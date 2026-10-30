import { analyticsQuerySchema } from "#shared/utils/schemas";

const SITE_HOST = "behramkttk.dev";
const DIRECT = "(direct)";
const HOUR_MS = 3600000;
const DAY_MS = 86400000;

// Query params and the Cloudflare field each one filters
const FILTERS = { path: "requestPath", country: "countryName", device: "deviceType", browser: "userAgentBrowser", referrer: "refererHost" } as const;

const BREAKDOWNS = { path: "requestPath", country: "countryName", referrer: "refererHost", device: "deviceType", browser: "userAgentBrowser" } as const;
type Breakdown = keyof typeof BREAKDOWNS;

// Past about 10 days in one query, Cloudflare samples 1 in 10 and doesn't scale visits back up,
// so long ranges are asked for in 7-day chunks and added together. Sampled rows are scaled here.
const CHUNK_DAYS = 7;
// Each chunk asks for 6 groups, and Cloudflare allows 30 in one request
const CHUNKS_PER_REQUEST = 5;
const TOP_ROWS = 8;

const group = (alias: string, filter: string, dimension: string, order: string, limit: number) =>
  `${alias}: rumPageloadEventsAdaptiveGroups(limit: ${limit}, filter: $${filter}, orderBy: [${order}]) { count sum { visits } avg { sampleInterval } dimensions { key: ${dimension} } }`;

function query(chunks: number, dimension: string) {
  const ids = Array.from({ length: chunks }, (_, index) => index);
  const fields = ids.flatMap((id) => [
    group(`series${id}`, `f${id}`, dimension, `${dimension}_ASC`, 100),
    ...Object.entries(BREAKDOWNS).map(([key, field]) => group(`${key}${id}`, `f${id}`, field, "count_DESC", 25)),
  ]);
  const variables = ids.map((id) => `$f${id}: accountRumPageloadEventsAdaptiveGroupsFilter_InputObject!`).join(", ");
  return `query ($account: String!, ${variables}) { viewer { accounts(filter: { accountTag: $account }) { ${fields.join("\n")} } } }`;
}

type Row = { count: number; sum: { visits: number }; avg: { sampleInterval: number }; dimensions: { key: string } };
type Point = { key: string; visits: number; views: number };

// Adds rows from every chunk together, by key
function merge(rows: Row[]) {
  const merged = new Map<string, Point>();
  for (const row of rows) {
    const point = merged.get(row.dimensions.key) ?? { key: row.dimensions.key, visits: 0, views: 0 };
    point.visits += Math.round(row.sum.visits * row.avg.sampleInterval);
    point.views += row.count;
    merged.set(row.dimensions.key, point);
  }
  return [...merged.values()];
}

const top = (points: Point[]) => points.sort((a, b) => b.views - a.views).slice(0, TOP_ROWS);

function chunkRanges(from: string, to: string) {
  const start = Date.parse(from);
  const end = Date.parse(to) + DAY_MS;
  const ranges: [string, string][] = [];
  for (let at = start; at < end; at += CHUNK_DAYS * DAY_MS) {
    ranges.push([new Date(at).toISOString(), new Date(Math.min(at + CHUNK_DAYS * DAY_MS, end)).toISOString()]);
  }
  return ranges;
}

// Every day or hour in the range, so quiet periods show as gaps at zero
function buckets(from: string, to: string, hourly: boolean) {
  const start = Date.parse(`${from}T00:00:00Z`);
  const count = hourly ? 24 : (Date.parse(to) - Date.parse(from)) / DAY_MS + 1;
  const step = hourly ? HOUR_MS : DAY_MS;
  return Array.from({ length: count }, (_, index) => {
    const iso = new Date(start + index * step).toISOString();
    return hourly ? `${iso.slice(0, 19)}Z` : iso.slice(0, 10);
  });
}

export default defineEventHandler(async (event) => {
  const params = await getValidatedQuery(event, analyticsQuerySchema.parse);
  const { cfAnalyticsToken, cfAccountId } = useRuntimeConfig(event);
  if (!cfAnalyticsToken) throw createError({ statusCode: 503, statusMessage: "Analytics isn't connected yet" });

  const hourly = params.from === params.to;
  const selected = Object.entries(FILTERS).flatMap(([param, field]) => {
    const value = params[param as keyof typeof FILTERS];
    if (value === undefined) return [];
    return [{ [field]: param === "referrer" && value === DIRECT ? "" : value }];
  });
  const shared = {
    requestHost: SITE_HOST,
    AND: [{ requestPath_notlike: "/admin%" }, { requestPath_notlike: "/auth%" }, ...selected],
  };
  const ranges = chunkRanges(params.from, params.to);
  const batches = Array.from({ length: Math.ceil(ranges.length / CHUNKS_PER_REQUEST) }, (_, index) =>
    ranges.slice(index * CHUNKS_PER_REQUEST, (index + 1) * CHUNKS_PER_REQUEST),
  );

  const responses = await Promise.all(
    batches.map((batch) =>
      $fetch<{ data?: { viewer: { accounts: Record<string, Row[]>[] } }; errors?: unknown[] | null }>("https://api.cloudflare.com/client/v4/graphql", {
        method: "POST",
        headers: { Authorization: `Bearer ${cfAnalyticsToken}` },
        body: {
          query: query(batch.length, hourly ? "datetimeHour" : "date"),
          variables: { account: cfAccountId, ...Object.fromEntries(batch.map(([start, end], index) => [`f${index}`, { ...shared, datetime_geq: start, datetime_lt: end }])) },
        },
      }).catch(() => null),
    ),
  );

  const results = responses.map((response) => (response?.errors?.length ? undefined : response?.data?.viewer.accounts[0]));
  if (results.some((result) => !result)) throw createError({ statusCode: 502, statusMessage: "Cloudflare couldn't return your analytics. Try again shortly." });

  const rowsFor = (name: string) =>
    results.flatMap((result, batch) => batches[batch]!.flatMap((_, index) => result?.[`${name}${index}`] ?? []));
  const seriesRows = rowsFor("series");
  const byKey = new Map(merge(seriesRows).map((point) => [point.key, point]));
  const series = buckets(params.from, params.to, hourly).map((key) => byKey.get(key) ?? { key, visits: 0, views: 0 });

  return {
    hourly,
    // Older data is sampled, so its figures are estimates
    estimated: seriesRows.some((row) => row.avg.sampleInterval > 1.5),
    totals: {
      visits: series.reduce((total, point) => total + point.visits, 0),
      views: series.reduce((total, point) => total + point.views, 0),
    },
    series,
    path: top(merge(rowsFor("path"))),
    country: top(merge(rowsFor("country"))),
    // A page-to-page move inside the site isn't a source
    referrer: top(merge(rowsFor("referrer")).filter((point) => point.key !== SITE_HOST)).map((point) => ({ ...point, key: point.key || DIRECT })),
    device: top(merge(rowsFor("device"))),
    browser: top(merge(rowsFor("browser"))),
  };
});
