<script setup lang="ts">
// Decorative, gently animated illustration for a service, drawn in HTML/CSS so it follows the theme.
// All motion is switched off for visitors who ask for reduced motion.
// Known services get their own scene; anything else falls back to its icon.
// compact: no minimum height or padding, for when a parent sizes and positions the scene
const props = defineProps<{ slug: string; icon: string; compact?: boolean }>();

const scenes: Record<string, "website" | "webapp" | "mobile" | "ai"> = {
  "website-development": "website",
  "custom-web-apps": "webapp",
  "mobile-apps": "mobile",
  "ai-apps": "ai",
};
const scene = computed(() => scenes[props.slug] ?? "generic");
const bars = [45, 70, 55, 85, 60, 95, 75];
</script>

<template>
  <div :class="['grid w-full place-items-center', !compact && 'min-h-72 py-6 lg:min-h-[24rem]']" aria-hidden="true">
    <!-- Website: a browser window with a landing page -->
    <div v-if="scene === 'website'" class="float w-full max-w-md overflow-hidden rounded-xl border border-line bg-base shadow-2xl shadow-black/30">
      <div class="flex items-center gap-1.5 border-b border-line px-3 py-2.5">
        <span class="size-2.5 rounded-full bg-[#ff5f56]" /><span class="size-2.5 rounded-full bg-[#ffbd2e]" /><span class="size-2.5 rounded-full bg-[#27c93f]" />
        <span class="ml-2 flex h-6 flex-1 items-center gap-1.5 rounded-md bg-raised px-2 font-mono text-[0.7rem] text-muted"><Icon name="lucide:lock" size="11" class="text-ok" />yourbusiness.com</span>
      </div>
      <div class="p-5">
        <div class="flex items-center justify-between">
          <span class="h-3 w-16 rounded bg-fg/70" />
          <span class="flex gap-2"><span class="h-2 w-8 rounded bg-line" /><span class="h-2 w-8 rounded bg-line" /><span class="h-2 w-8 rounded bg-line" /></span>
        </div>
        <div class="mt-6 grid grid-cols-[1.2fr_1fr] items-center gap-4">
          <div>
            <span class="block h-4 w-full rounded bg-fg/80" /><span class="mt-2 block h-4 w-3/4 rounded bg-fg/80" />
            <span class="mt-4 block h-2 w-full rounded bg-line" /><span class="mt-1.5 block h-2 w-5/6 rounded bg-line" />
            <span class="cta mt-4 block h-7 w-24 rounded-md bg-accent" />
          </div>
          <div class="shimmer relative grid aspect-square place-items-center overflow-hidden rounded-lg bg-accent/15 text-accent"><Icon name="lucide:image" size="34" /></div>
        </div>
        <div class="mt-6 grid grid-cols-3 gap-3">
          <span v-for="n in 3" :key="n" class="tile h-12 rounded-lg border border-line bg-surface" :style="{ '--i': n }" />
        </div>
      </div>
    </div>

    <!-- Web app: an admin dashboard -->
    <div v-else-if="scene === 'webapp'" class="float grid w-full max-w-md grid-cols-[3.2rem_1fr] overflow-hidden rounded-xl border border-line bg-base shadow-2xl shadow-black/30">
      <div class="flex flex-col items-center gap-3 border-r border-line bg-surface py-4 text-muted">
        <span class="grid size-8 place-items-center rounded-lg bg-accent text-on-accent"><Icon name="lucide:layout-dashboard" size="16" /></span>
        <Icon name="lucide:user" size="16" /><Icon name="lucide:database" size="16" /><Icon name="lucide:settings" size="16" />
      </div>
      <div class="p-4">
        <div class="grid grid-cols-3 gap-2.5">
          <div v-for="n in 3" :key="n" class="rounded-lg border border-line bg-surface p-2.5">
            <span class="block h-1.5 w-8 rounded bg-line" /><span :class="['mt-2 block h-3.5 rounded', n === 1 ? 'w-10 bg-accent' : 'w-8 bg-fg/70']" />
          </div>
        </div>
        <div class="mt-3 flex h-24 items-end gap-2 rounded-lg border border-line bg-surface p-3">
          <span v-for="(height, index) in bars" :key="index" class="bar flex-1 rounded-t bg-accent/70" :style="{ height: `${height}%`, '--i': index }" />
        </div>
        <div class="mt-3 space-y-2">
          <div v-for="n in 3" :key="n" class="flex items-center gap-2.5">
            <span class="size-5 rounded-full bg-raised" /><span class="h-2 flex-1 rounded bg-line" />
            <span :class="['status h-4 w-12 rounded-full', n === 2 ? 'bg-signal/30' : 'bg-ok/30']" :style="{ '--i': n }" />
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile: two phones sharing one backend -->
    <div v-else-if="scene === 'mobile'" class="flex items-end justify-center gap-5">
      <div v-for="n in 2" :key="n" :style="{ '--i': n }" :class="['float w-32 rounded-[1.6rem] border-2 border-line bg-base p-2 shadow-2xl shadow-black/30 sm:w-36', n === 2 && 'mb-6']">
        <span class="mx-auto block h-1.5 w-10 rounded-full bg-line" />
        <div class="mt-3 space-y-2.5 px-1 pb-2">
          <div v-if="n === 1" class="notify flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/15 p-2">
            <Icon name="lucide:zap" size="14" class="shrink-0 text-accent" /><span class="h-1.5 flex-1 rounded bg-accent/60" />
          </div>
          <span class="block h-3 w-3/4 rounded bg-fg/80" />
          <span class="block h-16 rounded-xl bg-accent/15" />
          <div v-for="row in 3" :key="row" class="flex items-center gap-2">
            <span class="size-6 shrink-0 rounded-lg bg-raised" />
            <span class="flex-1"><span class="block h-1.5 w-full rounded bg-line" /><span class="mt-1 block h-1.5 w-2/3 rounded bg-line" /></span>
          </div>
          <span class="block h-7 rounded-lg bg-accent" />
        </div>
      </div>
    </div>

    <!-- AI: an assistant answering from the business's own data -->
    <div v-else-if="scene === 'ai'" class="float w-full max-w-md space-y-3 rounded-xl border border-line bg-base p-4 font-mono text-[0.8rem] shadow-2xl shadow-black/30">
      <p class="msg msg-1 ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-md bg-accent px-3.5 py-2 text-on-accent">Which orders are still unpaid?</p>
      <p class="msg msg-2 flex w-fit items-center gap-2 rounded-full border border-line px-3 py-1.5 text-muted">
        <Icon name="lucide:database" size="13" class="text-signal" /> Searching your order records
        <span class="dots flex gap-0.5"><i /><i /><i /></span>
      </p>
      <div class="msg msg-3 max-w-[88%] rounded-2xl rounded-bl-md border border-line bg-surface px-3.5 py-3">
        <p class="flex items-center gap-2 text-fg"><Icon name="lucide:bot" size="15" class="text-accent" /> Three orders are unpaid:</p>
        <div class="mt-2.5 space-y-2">
          <div v-for="n in 3" :key="n" class="flex items-center gap-2"><span class="size-1.5 rounded-full bg-accent" /><span class="h-2 rounded bg-line" :style="{ width: `${[72, 58, 66][n - 1]}%` }" /></div>
        </div>
        <p class="mt-3 flex gap-1.5 text-[0.7rem] text-muted"><span class="rounded border border-line px-1.5 py-0.5">orders.csv</span><span class="rounded border border-line px-1.5 py-0.5">invoices</span></p>
      </div>
    </div>

    <Icon v-else :name="icon" size="120" class="float text-accent" />
  </div>
</template>

<style scoped>
.dots i {
  width: 3px;
  height: 3px;
  border-radius: 9999px;
  background: currentColor;
}
.shimmer::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 35%, color-mix(in srgb, var(--fg) 22%, transparent) 50%, transparent 65%);
  transform: translateX(-100%);
}

@media (prefers-reduced-motion: no-preference) {
  /* Everything drifts slightly so the scene feels alive without demanding attention */
  .float {
    animation: float 6s ease-in-out calc(var(--i, 0) * -1.6s) infinite;
  }

  /* Website: light sweeps the image, the button breathes, content blocks load in turn */
  .shimmer::after {
    animation: sweep 3.2s ease-in-out infinite;
  }
  .cta {
    animation: breathe 2.4s ease-in-out infinite;
  }
  .tile {
    animation: blink 3s ease-in-out calc(var(--i) * 0.35s) infinite;
  }

  /* Web app: live chart and status changes */
  .bar {
    transform-origin: bottom;
    animation: chart 2.8s ease-in-out calc(var(--i) * -0.4s) infinite alternate;
  }
  .status {
    animation: blink 2.6s ease-in-out calc(var(--i) * 0.5s) infinite;
  }

  /* Mobile: a notification drops in */
  .notify {
    animation: notify 4.5s ease-in-out infinite;
  }

  /* AI: question, lookup, answer, on a loop */
  .msg {
    animation: 9s ease-in-out infinite both;
  }
  .msg-1 {
    animation-name: msg-1;
  }
  .msg-2 {
    animation-name: msg-2;
  }
  .msg-3 {
    animation-name: msg-3;
  }
  .dots i {
    animation: blink 1.2s infinite;
  }
  .dots i:nth-child(2) {
    animation-delay: 0.2s;
  }
  .dots i:nth-child(3) {
    animation-delay: 0.4s;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
@keyframes sweep {
  0%,
  30% {
    transform: translateX(-100%);
  }
  80%,
  100% {
    transform: translateX(100%);
  }
}
@keyframes breathe {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 45%, transparent);
  }
  50% {
    transform: scale(1.04);
    box-shadow: 0 0 0 8px transparent;
  }
}
@keyframes blink {
  0%,
  100% {
    opacity: 0.35;
  }
  50% {
    opacity: 1;
  }
}
@keyframes chart {
  from {
    transform: scaleY(0.45);
  }
  to {
    transform: scaleY(1);
  }
}
@keyframes notify {
  0%,
  12% {
    opacity: 0;
    transform: translateY(-10px);
  }
  22%,
  82% {
    opacity: 1;
    transform: translateY(0);
  }
  94%,
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}
@keyframes msg-1 {
  0%,
  4% {
    opacity: 0;
    transform: translateY(8px);
  }
  10%,
  92% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
  }
}
@keyframes msg-2 {
  0%,
  20% {
    opacity: 0;
    transform: translateY(8px);
  }
  26%,
  92% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
  }
}
@keyframes msg-3 {
  0%,
  44% {
    opacity: 0;
    transform: translateY(8px);
  }
  52%,
  92% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
  }
}
</style>
