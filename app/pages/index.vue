<script setup lang="ts">
const site = await useSite();
const { data } = await useFetch("/api/home");
if (!data.value) throw createError({ statusCode: 500, statusMessage: "Homepage could not be loaded" });
const home = data as Ref<NonNullable<typeof data.value>>;

// Service whose preview is showing in the Services section
const activeService = ref(0);
const shown = computed(() => home.value.services[activeService.value] ?? home.value.services[0]!);

// Position of a hero illustration along the arc, from -1 (far left) to 1 (far right)
const arcPosition = (index: number) => {
  const count = home.value.services.length;
  return count < 2 ? 0 : -1 + (index * 2) / (count - 1);
};

// A real sequence, so it is numbered
const workflow = [
  { title: "Discovery", text: "A short call or a few messages about what you need, who it is for and when you need it." },
  { title: "Proposal", text: "You get a written scope, a timeline and a price before any work starts." },
  { title: "Development", text: "You see working software as it takes shape, not a big reveal at the end." },
  { title: "Launch & Support", text: "I deploy it, hand over everything, and stay available for fixes and new features." },
];
</script>

<template>
  <div>
    <!-- Pulled up under the transparent header (5rem tall) so the backdrop runs to the top of the page -->
    <section class="hero relative isolate -mt-20 overflow-hidden pt-20">
      <!-- Backdrop: concentric half circles entering from the left and right edges -->
      <div v-for="side in ['left', 'right']" :key="side" :class="['rings', `rings-${side}`]" aria-hidden="true">
        <i v-for="n in 4" :key="n" :style="{ '--n': n }" />
      </div>
      <div class="shell flex flex-col items-center pb-4 pt-16 text-center md:pt-24">
        <p v-if="site.contact.availability" class="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/80 py-1.5 pl-3 pr-4 text-sm backdrop-blur">
          <span class="size-2 rounded-full bg-ok" aria-hidden="true" />
          {{ site.contact.availability }}
        </p>
        <h1 class="mt-7 max-w-[13ch] text-[2.9rem] font-normal sm:text-7xl lg:text-[6.5rem]">{{ home.hero.headline }}</h1>
        <p class="mt-6 max-w-[54ch] text-lg text-muted md:text-xl">{{ home.hero.subhead }}</p>
        <div class="mt-9 flex flex-wrap justify-center gap-3">
          <NuxtLink to="/contact" class="btn btn-primary">Start a project <Icon name="lucide:arrow-up-right" size="16" /></NuxtLink>
          <NuxtLink to="/projects" class="btn btn-ghost bg-base/60 backdrop-blur">See my work</NuxtLink>
        </div>
        <p class="mt-6 text-muted">
          Hiring for a role?
          <NuxtLink to="/about" class="link">See my experience<template v-if="site.hasResume"> and résumé</template></NuxtLink>
        </p>

      </div>

      <!-- The four service illustrations fanned along the top of a half circle that rises from the hero's bottom edge -->
      <div v-if="home.services.length" class="arc" aria-hidden="true">
        <span class="arc-glow" />
        <span class="arc-ring" />
        <div v-for="(service, index) in home.services" :key="service.slug" class="arc-item" :style="{ '--t': arcPosition(index) }">
          <ServiceGraphic :slug="service.slug" :icon="service.icon" compact />
        </div>
      </div>
    </section>

    <!-- Services as a studio-style index: large names on the left, a live preview of the one in focus on the right -->
    <section v-if="home.services.length" class="shell mt-16 md:mt-24">
      <SectionHeading title="Services." sub="What I build.">
        <NuxtLink to="/services" class="link">All services</NuxtLink>
      </SectionHeading>

      <div class="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <ul class="border-b border-line">
          <li v-for="(service, index) in home.services" :key="service.slug" class="border-t border-line">
            <NuxtLink
              :to="{ path: '/services', hash: `#${service.slug}` }"
              class="group flex items-center gap-5 py-6 md:py-8"
              :aria-current="index === activeService ? 'true' : undefined"
              @mouseenter="activeService = index"
              @focus="activeService = index"
            >
              <div class="min-w-0 flex-1">
                <h3 :class="['service-name text-3xl font-normal transition-colors duration-200 md:text-6xl', index === activeService ? 'is-active' : 'lg:text-muted']">{{ service.title }}</h3>
                <!-- No preview panel on small screens, so the summary sits under the name -->
                <p class="mt-2 text-muted lg:hidden">{{ service.tagline }}</p>
              </div>
              <span :class="['grid size-12 shrink-0 place-items-center rounded-full border transition duration-200', index === activeService ? 'lg:rotate-45 lg:border-fg lg:bg-fg lg:text-base' : 'text-muted', 'border-line']">
                <Icon name="lucide:arrow-up-right" size="22" />
              </span>
            </NuxtLink>
          </li>
        </ul>

        <div class="hidden lg:block">
          <div class="preview sticky top-8 overflow-hidden rounded-3xl border border-line bg-surface p-8">
            <Transition name="preview" mode="out-in">
              <div :key="shown.slug">
                <!-- The illustration is drawn at full size and scaled down, so its box is clipped to the visible size -->
                <div class="grid h-72 place-items-center overflow-hidden">
                  <ServiceGraphic :slug="shown.slug" :icon="shown.icon" compact class="scale-[0.7]" />
                </div>
                <p class="mt-6 text-xl">{{ shown.tagline }}</p>
                <ul class="mt-5 flex flex-wrap gap-2">
                  <li v-for="item in shown.deliverables" :key="item" class="rounded-full border border-line bg-base/60 px-3.5 py-1.5 text-sm text-muted">{{ item }}</li>
                </ul>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <section v-if="home.projects.length" class="shell mt-28">
      <SectionHeading title="Projects." sub="Selected work.">
        <NuxtLink to="/projects" class="link">All projects</NuxtLink>
      </SectionHeading>
      <div class="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2 md:[&>*:nth-child(even)]:mt-24">
        <ProjectTile v-for="project in home.projects" :key="project.slug" :project="project" />
      </div>
    </section>

    <!-- Full-width charcoal band -->
    <section class="dark-band mt-28 py-24 md:py-32">
      <div class="shell grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
      <div>
        <h2 class="text-5xl font-normal md:text-7xl">Process.<span class="block text-accent-2">How it runs.</span></h2>
        <p class="mt-8 max-w-[44ch] text-lg text-muted">
          Four clear steps from first conversation to a product in your customers' hands, with a written scope and price agreed before any work starts.
        </p>
        <NuxtLink to="/contact" class="btn btn-ghost mt-8">Start with step one</NuxtLink>
      </div>
      <ProcessCircle :steps="workflow" />
      </div>
    </section>

    <section v-if="home.posts.length" class="shell mt-28">
      <SectionHeading title="Articles." sub="Notes from the work.">
        <NuxtLink to="/blog" class="link">All posts</NuxtLink>
      </SectionHeading>
      <ul class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <li v-for="post in home.posts" :key="post.slug"><PostCard :post="post" /></li>
      </ul>
    </section>

    <ContactBand />
  </div>
</template>

<style scoped>
/* Hero arc. --r is the circle's radius, --spread the angle of the outermost illustrations off
   vertical, --s their size, --peak how far the top of the circle sits below the arc's upper edge.
   Only the upper part of the circle shows. Narrow screens use a tighter circle and a wider fan
   so the four scenes do not pile up. */
.arc {
  --r: 10.3rem;
  --spread: 58deg;
  --s: 0.22;
  --peak: 3.4rem;
  position: relative;
  height: 11.5rem;
  margin-top: 2.5rem;
  overflow: hidden;
  mask-image: linear-gradient(to bottom, #000 80%, transparent);
}
@media (min-width: 640px) {
  .arc {
    --r: 17rem;
    --spread: 50deg;
    --s: 0.36;
    --peak: 5rem;
    height: 17rem;
  }
}
@media (min-width: 1024px) {
  .arc {
    --r: 30rem;
    --spread: 42deg;
    --s: 0.5;
    --peak: 7rem;
    height: 22rem;
    margin-top: 3.5rem;
  }
}
.arc-ring,
.arc-glow {
  position: absolute;
  left: 50%;
  top: var(--peak);
  width: calc(var(--r) * 2);
  height: calc(var(--r) * 2);
  margin-left: calc(var(--r) * -1);
  border-radius: 9999px;
}
.arc-ring {
  border: 2px dashed color-mix(in srgb, var(--accent) 45%, transparent);
}
.arc-glow {
  background: radial-gradient(closest-side, color-mix(in srgb, var(--accent) 16%, transparent) 55%, transparent);
}
/* Each illustration starts centred on the circle's centre, is swung out to its angle, then
   turned most of the way back upright so it stays readable */
.arc-item {
  --a: calc(var(--t) * var(--spread));
  position: absolute;
  left: 50%;
  top: calc(var(--peak) + var(--r));
  display: grid;
  place-items: center;
  width: 28rem;
  height: 22rem;
  margin: -11rem 0 0 -14rem;
  transform: rotate(var(--a)) translateY(calc(var(--r) * -1)) rotate(calc(var(--a) * -0.62)) scale(var(--s));
}
@media (prefers-reduced-motion: no-preference) {
  .arc-ring {
    animation: arc-turn 90s linear infinite;
  }
}
@keyframes arc-turn {
  to {
    transform: rotate(360deg);
  }
}

/* The service in focus gets the gradient, but only where the preview panel exists */
@media (min-width: 1024px) {
  .service-name.is-active {
    background: linear-gradient(110deg, var(--accent), var(--accent-2));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
}

/* Services preview panel */
.preview {
  background-image: radial-gradient(24rem 14rem at 90% 0%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 70%);
}
.preview-enter-active,
.preview-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.preview-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.preview-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Half-circle backdrop. Each .rings box is a zero-size anchor on the hero's edge; its rings
   are full circles centred there, and the hero's overflow clips them to halves.
   --step is both the first radius and the gap between lines. */
.rings {
  --step: 2.5rem;
  position: absolute;
  top: 36%;
  z-index: -10;
  width: 0;
  height: 0;
}
.rings-left {
  left: 0;
}
.rings-right {
  right: 0;
}
.rings i {
  --radius: calc(var(--step) * var(--n));
  position: absolute;
  left: calc(var(--radius) * -1);
  top: calc(var(--radius) * -1);
  width: calc(var(--radius) * 2);
  height: calc(var(--radius) * 2);
  border: 1.5px solid var(--accent);
  border-radius: 9999px;
  /* Lines fade as they get further from the edge */
  opacity: calc(0.85 - var(--n) * 0.16);
}
@media (min-width: 640px) {
  .rings {
    --step: 4rem;
  }
}
@media (min-width: 1024px) {
  .rings {
    --step: 5.5rem;
  }
}
@media (prefers-reduced-motion: no-preference) {
  .rings i {
    animation: ripple 7s ease-in-out calc(var(--n) * 0.6s) infinite;
  }
}
@keyframes ripple {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.06);
  }
}

/* A soft iris glow behind the headline */
.hero::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -20;
  background: radial-gradient(46rem 26rem at 50% 12%, color-mix(in srgb, var(--accent) 20%, transparent), transparent 70%);
}
</style>
