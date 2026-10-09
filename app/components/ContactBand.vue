<script setup lang="ts">
const site = await useSite();
</script>

<template>
  <section class="shell mt-28">
    <div class="dark-band rounded-[2rem] px-8 py-16 md:px-16 md:py-24">
      <h2 class="text-5xl font-normal md:text-8xl">
        Start a project.
        <span class="block text-accent-2">Let's build it.</span>
      </h2>
      <div class="mt-12 flex flex-col gap-8 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
        <p class="max-w-[46ch] text-lg text-muted">Tell me what you need. I reply within a day or two with questions, a rough plan and what it would take.</p>
        <div class="flex flex-wrap gap-3">
          <NuxtLink to="/contact" class="btn btn-primary">Start a project <Icon name="lucide:arrow-up-right" size="16" /></NuxtLink>
          <a v-if="site.contact.whatsapp" :href="`https://wa.me/${site.contact.whatsapp}`" target="_blank" rel="noopener noreferrer" class="btn btn-ghost">
            <Icon name="simple-icons:whatsapp" size="16" /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
