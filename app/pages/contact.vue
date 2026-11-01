<script setup lang="ts">
const site = useSite();
const route = useRoute();

useSeoMeta({ title: "Contact", description: "Book a free consultation, send a project brief, or get in touch about a role." });

const service = typeof route.query.service === "string" ? route.query.service.slice(0, 80) : undefined;

const channels = computed(() =>
  [
    { label: "WhatsApp", value: site.value.contact.phone, icon: "simple-icons:whatsapp", href: site.value.contact.whatsapp && `https://wa.me/${site.value.contact.whatsapp}` },
    { label: "Email", value: site.value.contact.email, icon: "lucide:mail", href: `mailto:${site.value.contact.email}` },
    { label: "LinkedIn", value: "Connect on LinkedIn", icon: "simple-icons:linkedin", href: site.value.socials.linkedin },
  ].filter((channel) => channel.href),
);
</script>

<template>
  <div>
    <PageIntro title="Contact" lead="Tell me what you need, or book a free consultation. I usually reply within a day or two." />

    <div class="shell mt-14 grid gap-14 lg:grid-cols-[1.4fr_1fr]">
      <BriefForm kind="project" :service="service" @done="navigateTo('/')" />

      <aside>
        <h2 class="text-2xl font-normal">Direct Contact</h2>
        <ul class="mt-6 space-y-3">
          <li v-for="channel in channels" :key="channel.label">
            <a :href="channel.href" target="_blank" rel="noopener noreferrer" class="group flex items-center gap-4 rounded-xl border border-line p-4 transition-colors hover:border-accent">
              <Icon :name="channel.icon" size="22" class="text-accent" />
              <span>
                <span class="block text-sm text-muted">{{ channel.label }}</span>
                <span class="block text-lg group-hover:text-accent">{{ channel.value }}</span>
              </span>
            </a>
          </li>
        </ul>
        <p v-if="site.contact.location" class="mt-6 flex items-center gap-2 text-muted">
          <Icon name="lucide:map-pin" size="18" /> {{ site.contact.location }}
        </p>
      </aside>
    </div>
  </div>
</template>
