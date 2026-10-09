<script setup lang="ts">
// The process as a ring: numbered stops around a circle, the current step's detail in the middle.
// It advances on its own, and hovering, focusing or clicking a stop selects it.
const props = defineProps<{ steps: { title: string; text: string }[] }>();

const active = ref(0);
const paused = ref(false);
const RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Stops start at 12 o'clock and run clockwise; 44% is the ring's radius relative to the box
const position = (index: number) => {
  const angle = (index / props.steps.length) * 2 * Math.PI - Math.PI / 2;
  return { left: `${50 + 44 * Math.cos(angle)}%`, top: `${50 + 44 * Math.sin(angle)}%` };
};
// The coloured arc reaches the current stop; the last step closes the ring
const progress = computed(() => (active.value === props.steps.length - 1 ? 1 : active.value / props.steps.length));

let timer: ReturnType<typeof setInterval> | undefined;
onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  timer = setInterval(() => {
    if (!paused.value) active.value = (active.value + 1) % props.steps.length;
  }, 3200);
});
onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
  <div class="relative mx-auto aspect-square w-full max-w-[26rem]" @mouseenter="paused = true" @mouseleave="paused = false" @focusin="paused = true" @focusout="paused = false">
    <svg viewBox="0 0 200 200" class="size-full -rotate-90" aria-hidden="true">
      <defs>
        <linearGradient id="process-arc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style="stop-color: var(--accent)" />
          <stop offset="1" style="stop-color: var(--accent-2)" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" :r="RADIUS" fill="none" stroke-width="1.5" style="stroke: var(--line)" />
      <circle
        class="arc"
        cx="100"
        cy="100"
        :r="RADIUS"
        fill="none"
        stroke="url(#process-arc)"
        stroke-width="2.5"
        stroke-linecap="round"
        :stroke-dasharray="CIRCUMFERENCE"
        :stroke-dashoffset="CIRCUMFERENCE * (1 - progress)"
      />
    </svg>

    <ol>
      <li v-for="(step, index) in steps" :key="step.title" class="absolute -translate-x-1/2 -translate-y-1/2" :style="position(index)">
        <button
          type="button"
          :class="[
            'grid size-12 place-items-center rounded-full border-2 font-mono text-[1rem] transition duration-300',
            index === active ? 'scale-110 border-transparent bg-linear-to-br from-accent to-accent-2 text-on-accent shadow-[0_0_0_8px_color-mix(in_srgb,var(--accent)_18%,transparent)]' : index < active ? 'border-accent bg-base text-accent' : 'border-line bg-base text-muted',
          ]"
          :aria-current="index === active ? 'step' : undefined"
          :aria-label="`Step ${index + 1}: ${step.title}. ${step.text}`"
          @mouseenter="active = index"
          @focus="active = index"
          @click="active = index"
        >
          {{ index + 1 }}
        </button>
      </li>
    </ol>

    <!-- Detail for the current step. Hidden from screen readers because each stop's label already carries it -->
    <div class="absolute inset-[19%] grid place-items-center text-center" aria-hidden="true">
      <Transition name="detail" mode="out-in">
        <div :key="active">
          <p class="font-mono text-sm text-muted">Step {{ active + 1 }} of {{ steps.length }}</p>
          <h3 class="text-gradient mt-2 text-2xl font-medium sm:text-3xl">{{ steps[active]!.title }}</h3>
          <p class="mt-3 text-[0.95rem] text-muted">{{ steps[active]!.text }}</p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.arc {
  transition: stroke-dashoffset 0.6s ease;
}
.detail-enter-active,
.detail-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}
.detail-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.detail-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
@media (prefers-reduced-motion: reduce) {
  .arc,
  .detail-enter-active,
  .detail-leave-active {
    transition: none;
  }
}
</style>
