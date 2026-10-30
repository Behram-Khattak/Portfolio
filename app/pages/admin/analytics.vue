<script setup lang="ts">
import { ANALYTICS_MAX_DAYS, analyticsQuerySchema } from "#shared/utils/schemas";

definePageMeta({ layout: "admin" });
useHead({ title: "Analytics" });

const DAY_MS = 86400000;
const iso = (time: number) => new Date(time).toISOString().slice(0, 10);
const today = iso(Date.now());
const daysAgo = (days: number) => iso(Date.now() - days * DAY_MS);

const presets = [
  { label: "Today", from: today },
  { label: "7 days", from: daysAgo(6) },
  { label: "30 days", from: daysAgo(29) },
  { label: "90 days", from: daysAgo(89) },
];

// The URL holds the range and filters, so a reload or bookmark keeps them
const route = useRoute();
const router = useRouter();
const from = computed(() => String(route.query.from ?? presets[1]!.from));
const to = computed(() => String(route.query.to ?? today));
const update = (changes: Record<string, string | undefined>) => router.replace({ query: { ...route.query, ...changes } });
const setRange = (start: string, end: string) => update({ from: start, to: end });

const filterKeys = ["path", "country", "referrer", "device", "browser"] as const;
type FilterKey = (typeof filterKeys)[number];

const params = computed(() => {
  const filters = Object.fromEntries(filterKeys.filter((key) => route.query[key]).map((key) => [key, String(route.query[key])]));
  return { from: from.value, to: to.value, ...filters };
});

type Row = { key: string; visits: number; views: number };
type Analytics = { hourly: boolean; estimated: boolean; totals: { visits: number; views: number }; series: Row[] } & Record<FilterKey, Row[]>;

const rangeError = computed(() => {
  const parsed = analyticsQuerySchema.safeParse(params.value);
  return parsed.success ? "" : (parsed.error.issues[0]?.message ?? "Check the dates");
});

const { data, status, error } = await useAsyncData<Analytics | null>(
  "admin-analytics",
  () => (rangeError.value ? Promise.resolve(null) : adminFetch<Analytics>("/api/admin/analytics", { query: params.value })),
  { watch: [params] },
);

const notConnected = computed(() => error.value?.statusCode === 503);

const metric = ref<"visits" | "views">("visits");
const stats = computed(() => {
  const totals = data.value?.totals ?? { visits: 0, views: 0 };
  return [
    { key: "visits" as const, label: "Visits", value: totals.visits.toLocaleString("en-GB") },
    { key: "views" as const, label: "Page views", value: totals.views.toLocaleString("en-GB") },
    { key: null, label: "Pages per visit", value: totals.visits ? (totals.views / totals.visits).toFixed(1) : "0" },
  ];
});

const countryNames = new Intl.DisplayNames(["en"], { type: "region" });
function display(key: FilterKey, value: string) {
  if (key === "country") {
    try {
      return countryNames.of(value) ?? value;
    } catch {
      return value;
    }
  }
  if (key === "referrer" && value === "(direct)") return "Direct or unknown";
  if (key === "device") return value.charAt(0).toUpperCase() + value.slice(1);
  return value || "Unknown";
}

const sections: { key: FilterKey; title: string; filterLabel: string; empty: string }[] = [
  { key: "path", title: "Pages", filterLabel: "Page", empty: "No page views in this period." },
  { key: "country", title: "Countries", filterLabel: "Country", empty: "No countries in this period." },
  { key: "referrer", title: "Sources", filterLabel: "Source", empty: "No visits from other sites in this period." },
  { key: "device", title: "Devices", filterLabel: "Device", empty: "No devices in this period." },
  { key: "browser", title: "Browsers", filterLabel: "Browser", empty: "No browsers in this period." },
];

const activeFilters = computed(() =>
  sections.filter((section) => route.query[section.key]).map((section) => ({ ...section, value: String(route.query[section.key]) })),
);
const widest = (rows: Row[]) => Math.max(...rows.map((row) => row.views), 1);
</script>

<template>
  <div>
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="admin-title">Analytics</h1>
      <div class="flex flex-wrap items-center gap-2">
        <div class="flex rounded-lg border border-line bg-surface p-0.5" role="group" aria-label="Date range">
          <button
            v-for="preset in presets"
            :key="preset.label"
            type="button"
            :aria-pressed="from === preset.from && to === today"
            :class="['rounded-md px-2.5 py-1 text-[0.8125rem]', from === preset.from && to === today ? 'bg-raised' : 'text-muted hover:text-fg']"
            @click="setRange(preset.from, today)"
          >
            {{ preset.label }}
          </button>
        </div>
        <label class="sr-only" for="analytics-from">From</label>
        <input id="analytics-from" type="date" class="field !w-auto !py-1 text-[0.8125rem]" :value="from" :max="today" @change="setRange(($event.target as HTMLInputElement).value, to)" />
        <label class="sr-only" for="analytics-to">To</label>
        <input id="analytics-to" type="date" class="field !w-auto !py-1 text-[0.8125rem]" :value="to" :max="today" @change="setRange(from, ($event.target as HTMLInputElement).value)" />
      </div>
    </div>

    <p v-if="rangeError" class="mt-3 text-[0.8125rem] text-danger" role="alert">{{ rangeError }}. A range can cover up to {{ ANALYTICS_MAX_DAYS }} days.</p>

    <ul v-if="activeFilters.length" class="mt-3 flex flex-wrap items-center gap-2">
      <li v-for="filter in activeFilters" :key="filter.key">
        <button type="button" class="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2 py-1 text-[0.8125rem] hover:bg-raised" :aria-label="`Remove filter ${filter.filterLabel}: ${display(filter.key, filter.value)}`" @click="update({ [filter.key]: undefined })">
          <span class="text-muted">{{ filter.filterLabel }}</span> {{ display(filter.key, filter.value) }}
          <Icon name="lucide:x" size="13" class="text-muted" />
        </button>
      </li>
    </ul>

    <div v-if="notConnected" class="admin-card mt-5 p-5">
      <h2 class="admin-section">Connect your analytics</h2>
      <p class="mt-1 max-w-[60ch] text-muted">Add a Cloudflare API token with Account Analytics read access as the <code>NUXT_CF_ANALYTICS_TOKEN</code> Worker secret, then reload this page.</p>
    </div>
    <p v-else-if="error" class="admin-card mt-5 p-5 text-danger" role="alert">{{ errorMessage(error, "Your analytics couldn't be loaded. Try again shortly.") }}</p>

    <div v-else-if="data" :class="['transition-opacity', status === 'pending' && 'opacity-60']">
      <section class="admin-card mt-5" aria-label="Visits over time">
        <div class="grid grid-cols-3 divide-x divide-line border-b border-line">
          <component
            :is="stat.key ? 'button' : 'div'"
            v-for="stat in stats"
            :key="stat.label"
            :type="stat.key ? 'button' : undefined"
            :aria-pressed="stat.key ? metric === stat.key : undefined"
            :class="['min-w-0 px-4 py-3 text-left first:rounded-tl-xl last:rounded-tr-xl', stat.key && (metric === stat.key ? 'bg-base' : 'hover:bg-base')]"
            @click="stat.key && (metric = stat.key)"
          >
            <p class="text-[0.8125rem] leading-tight text-muted">{{ stat.label }}</p>
            <p class="text-[1.375rem] leading-snug">{{ stat.value }}</p>
          </component>
        </div>
        <div class="p-4">
          <AdminVisitsChart :points="data.series" :metric="metric" :hourly="data.hourly" />
        </div>
      </section>

      <div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <section v-for="section in sections" :key="section.key" class="admin-card p-4">
          <div class="flex items-baseline justify-between">
            <h2 class="admin-section">{{ section.title }}</h2>
            <span class="text-[0.8125rem] text-muted">Page views</span>
          </div>
          <p v-if="!data[section.key].length" class="mt-3 text-muted">{{ section.empty }}</p>
          <ul v-else class="mt-2 space-y-0.5">
            <li v-for="row in data[section.key]" :key="row.key">
              <button
                type="button"
                class="relative block w-full overflow-hidden rounded-md px-2 py-1.5 text-left hover:bg-raised"
                :aria-pressed="route.query[section.key] === row.key"
                :title="`Filter by ${display(section.key, row.key)}`"
                @click="update({ [section.key]: route.query[section.key] === row.key ? undefined : row.key })"
              >
                <span class="absolute inset-y-0 left-0 bg-raised" :style="{ width: `${(row.views / widest(data[section.key])) * 100}%` }" aria-hidden="true" />
                <span class="relative flex items-center justify-between gap-3">
                  <span class="truncate">{{ display(section.key, row.key) }}</span>
                  <span class="shrink-0 text-muted">{{ row.views.toLocaleString("en-GB") }}</span>
                </span>
              </button>
            </li>
          </ul>
        </section>
      </div>

      <p class="mt-5 max-w-[80ch] text-[0.8125rem] text-muted">
        A visit is one arrival from outside your site, so the same person coming back counts again. Dashboard pages are left out, your own public browsing is included, and ad blockers hide some visitors. Days are in UTC.
        <template v-if="data.estimated">Figures more than 7 days old are estimates, because Cloudflare samples older data.</template>
      </p>
    </div>
  </div>
</template>
