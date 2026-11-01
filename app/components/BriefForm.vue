<script setup lang="ts">
import { contactSchema } from "#shared/utils/schemas";

const props = defineProps<{ kind: "project" | "consultation"; service?: string }>();
const emit = defineEmits<{ done: []; kind: [value: "project" | "consultation"] }>();

const site = useSite();
const { public: { turnstileSiteKey } } = useRuntimeConfig();

const serviceOptions = computed(() => [
  ...(site.value.services ?? []).map((service) => ({ label: service.title, hint: service.tagline })),
  ...briefOptions.extraServices.map((label) => ({ label, hint: "" })),
]);

const form = reactive({
  kind: props.kind,
  name: "",
  email: "",
  phone: "",
  company: "",
  companySize: "",
  website: "",
  contactMethod: "Email",
  services: props.service ? [props.service] : ([] as string[]),
  stage: "",
  features: [] as string[],
  timeline: "",
  budget: "",
  preferredDate: "",
  preferredTime: "",
  meetingType: "",
  timezone: "",
  message: "",
  turnstileToken: "",
});
onMounted(() => (form.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone));

const isProject = computed(() => form.kind === "project");
const steps = computed(() => (isProject.value ? ["What you need", "The project", "Your details"] : ["What it's about", "Choose a time", "Your details"]));
const step = ref(0);

const errors = ref<Record<string, string>>({});
const status = ref<"idle" | "sending" | "sent">("idle");
const failure = ref("");
const turnstile = ref<{ reset: () => void }>();

const today = new Date().toISOString().slice(0, 10);

function toggle(list: string[], value: string) {
  const index = list.indexOf(value);
  if (index >= 0) list.splice(index, 1);
  else list.push(value);
}

// Fields that must be right before moving past each step
const stepFields = computed(() => [["services"], isProject.value ? ["stage"] : ["preferredDate", "preferredTime", "meetingType"], ["name", "email", "turnstileToken"]]);

function validate(fields: string[]) {
  const parsed = contactSchema.safeParse({ ...form, name: form.name || "..", email: form.email || "name@example.com", turnstileToken: form.turnstileToken || "pending" });
  const issues = parsed.success ? [] : parsed.error.issues;
  errors.value = Object.fromEntries(issues.filter((issue) => fields.includes(String(issue.path[0]))).map((issue) => [String(issue.path[0]), issue.message]));
  return !Object.keys(errors.value).length;
}

function next() {
  if (validate(stepFields.value[step.value]!)) step.value += 1;
}

function switchKind(kind: "project" | "consultation") {
  form.kind = kind;
  emit("kind", kind);
  errors.value = {};
  step.value = 0;
}

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
  } catch {
    status.value = "idle";
    turnstile.value?.reset();
    failure.value = "This couldn't be sent. Check your connection and try again, or email me directly.";
  }
}
</script>

<template>
  <div v-if="status === 'sent'" class="pt-5" role="status">
    <Icon name="lucide:circle-check" size="32" class="text-ok" />
    <h3 class="mt-3 text-2xl font-normal">{{ isProject ? "Brief received" : "Request received" }}</h3>
    <p class="mt-2 text-muted">
      Thanks, {{ form.name }}.
      {{ isProject ? `I'll read this and reply to ${form.email} within a day or two.` : `I'll confirm a time with you at ${form.email} within a day or two.` }}
    </p>
    <button type="button" class="btn btn-ghost mt-6" @click="emit('done')">Close</button>
  </div>

  <form v-else novalidate @submit.prevent="step === steps.length - 1 ? send() : next()">
    <p class="mt-1 text-muted">
      {{ isProject ? "A few quick choices, so our first conversation starts in the right place." : "It's free and there's no commitment. Choose what suits you and I'll confirm a time." }}
    </p>

    <ol class="mt-5 grid grid-cols-3 gap-2" aria-label="Progress">
      <li v-for="(label, index) in steps" :key="label" :aria-current="index === step ? 'step' : undefined">
        <span :class="['block h-1 rounded-full', index <= step ? 'bg-fg' : 'bg-line']" />
        <span :class="['mt-1.5 block text-sm', index === step ? 'text-fg' : 'text-muted']">{{ label }}</span>
      </li>
    </ol>

    <!-- Step 1 -->
    <fieldset v-if="step === 0" class="mt-6">
      <legend class="label">{{ isProject ? "What do you need? Choose all that apply." : "What would you like to talk about?" }}</legend>
      <div class="mt-1 grid gap-2 sm:grid-cols-2">
        <label v-for="option in serviceOptions" :key="option.label" :class="['choice-card', { 'is-on': form.services.includes(option.label) }]">
          <input type="checkbox" class="sr-only" :checked="form.services.includes(option.label)" @change="toggle(form.services, option.label)" />
          <span class="font-medium">{{ option.label }}</span>
          <span v-if="option.hint" class="mt-0.5 block text-sm text-muted">{{ option.hint }}</span>
        </label>
      </div>
      <p v-if="errors.services" class="mt-2 text-sm text-danger" role="alert">{{ errors.services }}</p>

      <div v-if="!isProject" class="mt-5">
        <label class="label" for="brief-topic">Anything specific? <span class="text-muted">(optional)</span></label>
        <textarea id="brief-topic" v-model="form.message" rows="3" class="field" placeholder="A sentence or two is plenty." />
      </div>
    </fieldset>

    <!-- Step 2, project -->
    <div v-else-if="step === 1 && isProject" class="mt-6 space-y-5">
      <fieldset>
        <legend class="label">Where is the project now?</legend>
        <div class="flex flex-wrap gap-2">
          <label v-for="option in briefOptions.stages" :key="option" :class="['choice', { 'is-on': form.stage === option }]"><input v-model="form.stage" type="radio" class="sr-only" :value="option" />{{ option }}</label>
        </div>
        <p v-if="errors.stage" class="mt-2 text-sm text-danger" role="alert">{{ errors.stage }}</p>
      </fieldset>
      <fieldset>
        <legend class="label">What should it include? <span class="text-muted">(optional)</span></legend>
        <div class="flex flex-wrap gap-2">
          <label v-for="option in briefOptions.features" :key="option" :class="['choice', { 'is-on': form.features.includes(option) }]"><input type="checkbox" class="sr-only" :checked="form.features.includes(option)" @change="toggle(form.features, option)" />{{ option }}</label>
        </div>
      </fieldset>
      <fieldset>
        <legend class="label">When do you need it? <span class="text-muted">(optional)</span></legend>
        <div class="flex flex-wrap gap-2">
          <label v-for="option in briefOptions.timelines" :key="option" :class="['choice', { 'is-on': form.timeline === option }]"><input v-model="form.timeline" type="radio" class="sr-only" :value="option" />{{ option }}</label>
        </div>
      </fieldset>
      <fieldset>
        <legend class="label">What's your budget? <span class="text-muted">(optional)</span></legend>
        <div class="flex flex-wrap gap-2">
          <label v-for="option in briefOptions.budgets" :key="option" :class="['choice', { 'is-on': form.budget === option }]"><input v-model="form.budget" type="radio" class="sr-only" :value="option" />{{ option }}</label>
        </div>
      </fieldset>
    </div>

    <!-- Step 2, consultation -->
    <div v-else-if="step === 1" class="mt-6 space-y-5">
      <div>
        <label class="label" for="brief-date">Preferred date <span class="text-muted">(optional)</span></label>
        <input id="brief-date" v-model="form.preferredDate" type="date" class="field sm:max-w-60" :min="today" />
      </div>
      <fieldset>
        <legend class="label">What time of day suits you?</legend>
        <div class="flex flex-wrap gap-2">
          <label v-for="option in briefOptions.times" :key="option" :class="['choice', { 'is-on': form.preferredTime === option }]"><input v-model="form.preferredTime" type="radio" class="sr-only" :value="option" />{{ option }}</label>
        </div>
        <p v-if="errors.preferredTime" class="mt-2 text-sm text-danger" role="alert">{{ errors.preferredTime }}</p>
      </fieldset>
      <fieldset>
        <legend class="label">How would you like to meet?</legend>
        <div class="flex flex-wrap gap-2">
          <label v-for="option in briefOptions.meetings" :key="option" :class="['choice', { 'is-on': form.meetingType === option }]"><input v-model="form.meetingType" type="radio" class="sr-only" :value="option" />{{ option }}</label>
        </div>
        <p v-if="errors.meetingType" class="mt-2 text-sm text-danger" role="alert">{{ errors.meetingType }}</p>
      </fieldset>
      <p v-if="form.timezone" class="text-sm text-muted">Your time zone: {{ form.timezone }}</p>
    </div>

    <!-- Step 3 -->
    <div v-else class="mt-6 space-y-4">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <label class="label" for="brief-name">Your name</label>
          <input id="brief-name" v-model="form.name" class="field" autocomplete="name" :aria-invalid="Boolean(errors.name)" />
          <p v-if="errors.name" class="mt-1 text-sm text-danger" role="alert">{{ errors.name }}</p>
        </div>
        <div>
          <label class="label" for="brief-email">Work email</label>
          <input id="brief-email" v-model="form.email" type="email" class="field" autocomplete="email" :aria-invalid="Boolean(errors.email)" />
          <p v-if="errors.email" class="mt-1 text-sm text-danger" role="alert">{{ errors.email }}</p>
        </div>
        <div>
          <label class="label" for="brief-phone">Phone or WhatsApp <span class="text-muted">(optional)</span></label>
          <input id="brief-phone" v-model="form.phone" type="tel" class="field" autocomplete="tel" />
        </div>
        <div>
          <label class="label" for="brief-company">Company <span class="text-muted">(optional)</span></label>
          <input id="brief-company" v-model="form.company" class="field" autocomplete="organization" />
        </div>
        <div>
          <label class="label" for="brief-size">Company size <span class="text-muted">(optional)</span></label>
          <select id="brief-size" v-model="form.companySize" class="field">
            <option value="">Choose one</option>
            <option v-for="option in briefOptions.companySizes" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>
        <div>
          <label class="label" for="brief-website">Website <span class="text-muted">(optional)</span></label>
          <input id="brief-website" v-model="form.website" class="field" inputmode="url" autocomplete="url" placeholder="yourcompany.com" />
        </div>
      </div>
      <fieldset>
        <legend class="label">Best way to reach you</legend>
        <div class="flex flex-wrap gap-2">
          <label v-for="option in briefOptions.contactMethods" :key="option" :class="['choice', { 'is-on': form.contactMethod === option }]"><input v-model="form.contactMethod" type="radio" class="sr-only" :value="option" />{{ option }}</label>
        </div>
      </fieldset>
      <div v-if="isProject">
        <label class="label" for="brief-message">Anything else I should know? <span class="text-muted">(optional)</span></label>
        <textarea id="brief-message" v-model="form.message" rows="3" class="field" placeholder="What are you building, and who is it for?" />
      </div>
      <TurnstileWidget v-if="turnstileSiteKey" ref="turnstile" @token="form.turnstileToken = $event" />
      <p v-if="errors.turnstileToken" class="text-sm text-danger" role="alert">{{ errors.turnstileToken }}</p>
      <p v-if="failure" class="text-danger" role="alert">{{ failure }}</p>
    </div>

    <div class="mt-7 flex items-center justify-between gap-3">
      <button v-if="step > 0" type="button" class="btn btn-ghost" @click="step -= 1">Back</button>
      <button v-else type="button" class="link text-[0.95rem]" @click="switchKind(isProject ? 'consultation' : 'project')">
        {{ isProject ? "Prefer to talk first?" : "Send a project brief instead" }}
      </button>
      <button type="submit" class="btn btn-primary" :disabled="status === 'sending'">
        <template v-if="step < steps.length - 1">Continue</template>
        <template v-else-if="status === 'sending'">Sending…</template>
        <template v-else>{{ isProject ? "Send brief" : "Request consultation" }}</template>
      </button>
    </div>
  </form>
</template>
