<script setup lang="ts">
type Point = { key: string; visits: number; views: number };
const props = defineProps<{ points: Point[]; metric: "visits" | "views"; hourly: boolean }>();

const metricLabel = computed(() => (props.metric === "visits" ? "Visits" : "Page views"));
const value = (point: Point) => point[props.metric];

const label = (key: string) =>
  props.hourly
    ? `${key.slice(11, 16)} UTC`
    : new Date(`${key}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

// A round top for the axis, so the gridlines land on readable numbers
const top = computed(() => {
  const max = Math.max(...props.points.map(value), 0);
  if (max <= 4) return 4;
  const magnitude = 10 ** Math.floor(Math.log10(max));
  return ([1, 2, 2.5, 5, 10].find((step) => step * magnitude >= max) ?? 10) * magnitude;
});
const ticks = computed(() => [1, 0.5, 0].map((share) => Math.round(top.value * share)));

const axisLabels = computed(() => {
  const count = props.points.length;
  const indexes = count <= 8 ? props.points.map((_, index) => index) : [0, Math.floor((count - 1) / 2), count - 1];
  return indexes.map((index) => ({ index, text: label(props.points[index]!.key) }));
});

const count = (total: number, noun: string) => `${total} ${noun}${total === 1 ? "" : "s"}`;

const hovered = ref<number | null>(null);
const active = computed(() => (hovered.value === null ? null : props.points[hovered.value]));
const tooltipLeft = computed(() => (((hovered.value ?? 0) + 0.5) / props.points.length) * 100);
</script>

<template>
  <figure class="m-0">
    <div class="flex gap-2">
      <div class="flex h-56 w-8 shrink-0 flex-col justify-between text-right text-xs text-muted" aria-hidden="true">
        <span v-for="tick in ticks" :key="tick" class="-my-2">{{ tick }}</span>
      </div>
      <div class="relative h-56 min-w-0 flex-1" @pointerleave="hovered = null">
        <span class="absolute inset-x-0 top-0 h-px bg-line" aria-hidden="true" />
        <span class="absolute inset-x-0 top-1/2 h-px bg-line" aria-hidden="true" />
        <div class="absolute inset-0 flex items-stretch gap-px border-b border-accent-2 sm:gap-0.5" role="img" :aria-label="`${metricLabel} over the selected period. The table below lists every figure.`">
          <div v-for="(point, index) in points" :key="point.key" class="flex min-w-0 flex-1 cursor-default items-end" @pointerenter="hovered = index" @pointerdown="hovered = index">
            <span
              v-if="value(point)"
              :class="['block w-full rounded-t', hovered === null || hovered === index ? 'bg-accent' : 'bg-accent/40']"
              :style="{ height: `${Math.max((value(point) / top) * 100, 1.5)}%` }"
            />
          </div>
        </div>
        <div
          v-if="active"
          class="admin-card pointer-events-none absolute top-1 z-10 w-max -translate-x-1/2 px-2.5 py-1.5 text-[0.8125rem] shadow-[0_4px_12px_rgb(0_0_0/0.08)]"
          :style="{ left: `clamp(4rem, ${tooltipLeft}%, calc(100% - 4rem))` }"
        >
          <p class="text-muted">{{ label(active.key) }}</p>
          <p>{{ count(active.visits, "visit") }}, {{ count(active.views, "page view") }}</p>
        </div>
      </div>
    </div>
    <div class="relative ml-10 mt-1.5 h-4 text-xs text-muted" aria-hidden="true">
      <span
        v-for="(tick, position) in axisLabels"
        :key="tick.index"
        class="absolute whitespace-nowrap"
        :style="
          axisLabels.length > 3
            ? { left: `${((tick.index + 0.5) / points.length) * 100}%`, transform: 'translateX(-50%)' }
            : position === 0
              ? { left: 0 }
              : position === 1
                ? { left: '50%', transform: 'translateX(-50%)' }
                : { right: 0 }
        "
      >
        {{ tick.text }}
      </span>
    </div>

    <details class="mt-4">
      <summary class="cursor-pointer text-[0.8125rem] text-muted hover:text-fg">Show as a table</summary>
      <div class="mt-2 max-h-72 overflow-y-auto">
        <table class="w-full text-left">
          <thead class="sticky top-0 bg-surface text-[0.8125rem] text-muted">
            <tr>
              <th scope="col" class="py-1.5 font-normal">{{ hourly ? "Hour" : "Day" }}</th>
              <th scope="col" class="py-1.5 text-right font-normal">Visits</th>
              <th scope="col" class="py-1.5 text-right font-normal">Page views</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line">
            <tr v-for="point in points" :key="point.key">
              <td class="py-1.5">{{ label(point.key) }}</td>
              <td class="py-1.5 text-right">{{ point.visits }}</td>
              <td class="py-1.5 text-right">{{ point.views }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  </figure>
</template>
