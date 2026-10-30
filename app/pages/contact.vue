<script setup lang="ts">
import { contactSchema } from "#shared/utils/schemas";

const site = useSite();
const { public: { turnstileSiteKey } } = useRuntimeConfig();
const { data: services } = await useFetch("/api/services");
const route = useRoute();

useSeoMeta({ title: "Contact", description: "Start a project or get in touch about a role." });

const budgets = ["Not sure yet", "Under $1,000", "$1,000 to $5,000", "$5,000 to $15,000", "Over $15,000"];
const form = reactive({
  name: "",
  email: "",
  company: "",
  service: typeof route.query.service === "string" ? route.query.service.slice(0, 160) : "",
  budget: "",
  message: "",
  turnstileToken: "",
});
const turnstile = ref<{ reset: () => void }>();

const errors = ref<Record<string, string>>({});
const status = ref<"idle" | "sending" | "sent">("idle");
const failure = ref("");

async function send() {
  failure.value = "";
  const parsed = contactSchema.safeParse(form);
  if (!parsed.success) {
    errors.value = Object.fromEntries(parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message]));
    return;
  }
  errors.value = {};
  status.value = "sending";
  try {
    await $fetch("/api/contact", { method: "POST", body: parsed.data });
    status.value = "sent";
  } catch (error) {
    status.value = "idle";
    turnstile.value?.reset();
    failure.value = "The message could not be sent. Check your connection and try again, or email me directly.";
  }
}

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
    <PageIntro title="Contact" lead="Tell me about the project or the role. I usually reply within a day or two." />

    <div class="shell mt-14 grid gap-14 lg:grid-cols-[1.4fr_1fr]">
      <div v-if="status === 'sent'" class="h-fit rounded-xl border border-ok/50 bg-surface p-8" role="status">
        <Icon name="lucide:circle-check" size="32" class="text-ok" />
        <h2 class="mt-4 text-2xl font-normal">Message Sent</h2>
        <p class="mt-2 text-muted">Thanks, {{ form.name }}. I will reply to {{ form.email }} soon.</p>
      </div>

      <!-- Without Turnstile keys the server would refuse every message, so only the direct links show -->
      <form v-else-if="turnstileSiteKey" class="space-y-5" novalidate @submit.prevent="send">
        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label class="label" for="name">Your name</label>
            <input id="name" v-model="form.name" class="field" autocomplete="name" :aria-invalid="Boolean(errors.name)" aria-describedby="name-error" />
            <p v-if="errors.name" id="name-error" class="mt-1 text-sm text-danger">{{ errors.name }}</p>
          </div>
          <div>
            <label class="label" for="email">Email</label>
            <input id="email" v-model="form.email" type="email" class="field" autocomplete="email" :aria-invalid="Boolean(errors.email)" aria-describedby="email-error" />
            <p v-if="errors.email" id="email-error" class="mt-1 text-sm text-danger">{{ errors.email }}</p>
          </div>
        </div>

        <div>
          <label class="label" for="company">Company <span class="text-muted">(optional)</span></label>
          <input id="company" v-model="form.company" class="field" autocomplete="organization" />
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label class="label" for="service">What do you need?</label>
            <select id="service" v-model="form.service" class="field">
              <option value="">Choose one</option>
              <option v-for="service in services" :key="service.slug" :value="service.title">{{ service.title }}</option>
              <option value="Hiring for a role">Hiring for a role</option>
              <option value="Something else">Something else</option>
            </select>
          </div>
          <div>
            <label class="label" for="budget">Budget <span class="text-muted">(optional)</span></label>
            <select id="budget" v-model="form.budget" class="field">
              <option value="">Choose one</option>
              <option v-for="budget in budgets" :key="budget" :value="budget">{{ budget }}</option>
            </select>
          </div>
        </div>

        <div>
          <label class="label" for="message">Tell me about it</label>
          <textarea id="message" v-model="form.message" rows="7" class="field" :aria-invalid="Boolean(errors.message)" aria-describedby="message-error" placeholder="What are you building, who is it for, and when do you need it?" />
          <p v-if="errors.message" id="message-error" class="mt-1 text-sm text-danger">{{ errors.message }}</p>
        </div>

        <TurnstileWidget ref="turnstile" @token="form.turnstileToken = $event" />
        <p v-if="errors.turnstileToken" class="text-sm text-danger">{{ errors.turnstileToken }}</p>

        <p v-if="failure" class="text-danger" role="alert">{{ failure }}</p>
        <button type="submit" class="btn btn-primary" :disabled="status === 'sending'">
          {{ status === "sending" ? "Sending…" : "Send message" }}
        </button>
      </form>

      <aside :class="{ 'lg:col-span-2': !turnstileSiteKey }">
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
