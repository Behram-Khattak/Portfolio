<script setup lang="ts">
import type { AdminField } from "~/utils/admin";

const props = defineProps<{
  fields: AdminField[];
  errors: Record<string, string>;
  // While creating, slug fields follow their source field until edited by hand
  autoSlug?: boolean;
}>();
const model = defineModel<Record<string, any>>({ required: true });
const uid = useId();

const needsServices = props.fields.some((field) => field.type === "service");
const { data: services } = await useAsyncData("admin-services", () => (needsServices ? adminFetch<{ id: number; title: string }[]>("/api/admin/services") : Promise.resolve([])));

const slugTouched = ref(false);
for (const field of props.fields.filter((f) => f.type === "slug" && f.from)) {
  watch(
    () => model.value[field.from!],
    (source) => {
      if (props.autoSlug && !slugTouched.value) model.value[field.key] = slugify(String(source ?? ""));
    },
  );
}

// Text representations of array fields
const joined = (key: string, separator: string) =>
  computed({
    get: () => (model.value[key] as string[]).join(separator),
    set: (text: string) => (model.value[key] = text.split(separator === ", " ? "," : "\n").map((item) => item.trim()).filter(Boolean)),
  });
const arrayText = Object.fromEntries(
  props.fields.filter((f) => f.type === "tags" || f.type === "list").map((f) => [f.key, joined(f.key, f.type === "tags" ? ", " : "\n")]),
);
// Keep what the user is typing (trailing commas, blank lines) until the field loses focus
const draft = reactive<Record<string, string | undefined>>({});
</script>

<template>
  <div class="grid gap-5 md:grid-cols-2">
    <div v-for="field in fields" :key="field.key" :class="{ 'md:col-span-2': field.wide }">
      <label v-if="field.type === 'boolean'" class="flex items-center gap-3 py-2">
        <input v-model="model[field.key]" type="checkbox" class="size-5 accent-[var(--accent)]" />
        <span class="font-medium">{{ field.label }}</span>
      </label>

      <template v-else>
        <label class="label" :for="`${uid}-${field.key}`">{{ field.label }}</label>

        <AdminMarkdownField v-if="field.type === 'markdown'" :id="`${uid}-${field.key}`" v-model="model[field.key]" />
        <textarea v-else-if="field.type === 'textarea'" :id="`${uid}-${field.key}`" v-model="model[field.key]" rows="4" class="field" />
        <textarea
          v-else-if="field.type === 'list'"
          :id="`${uid}-${field.key}`"
          :value="draft[field.key] ?? arrayText[field.key]!.value"
          rows="5"
          class="field"
          @input="((draft[field.key] = ($event.target as HTMLTextAreaElement).value), (arrayText[field.key]!.value = draft[field.key]!))"
          @blur="draft[field.key] = undefined"
        />
        <input
          v-else-if="field.type === 'tags'"
          :id="`${uid}-${field.key}`"
          :value="draft[field.key] ?? arrayText[field.key]!.value"
          class="field"
          @input="((draft[field.key] = ($event.target as HTMLInputElement).value), (arrayText[field.key]!.value = draft[field.key]!))"
          @blur="draft[field.key] = undefined"
        />
        <input v-else-if="field.type === 'number'" :id="`${uid}-${field.key}`" v-model.number="model[field.key]" type="number" min="0" class="field" />
        <input v-else-if="field.type === 'slug'" :id="`${uid}-${field.key}`" v-model="model[field.key]" class="field font-mono text-sm" @input="slugTouched = true" />
        <input v-else-if="field.type === 'url'" :id="`${uid}-${field.key}`" v-model="model[field.key]" type="url" inputmode="url" placeholder="https://" class="field" />
        <div v-else-if="field.type === 'icon'" class="flex items-center gap-3">
          <input :id="`${uid}-${field.key}`" v-model="model[field.key]" class="field font-mono text-sm" />
          <span class="grid size-10 shrink-0 place-items-center rounded-lg border border-line">
            <Icon v-if="/^(lucide|simple-icons):[a-z0-9-]+$/.test(model[field.key])" :name="model[field.key]" size="20" />
          </span>
        </div>
        <select v-else-if="field.type === 'service'" :id="`${uid}-${field.key}`" v-model="model[field.key]" class="field">
          <option :value="null">None</option>
          <option v-for="service in services" :key="service.id" :value="service.id">{{ service.title }}</option>
        </select>
        <AdminMediaPicker v-else-if="field.type === 'media'" v-model="model[field.key]" />
        <AdminMediaPicker v-else-if="field.type === 'gallery'" v-model="model[field.key]" multiple />
        <input v-else :id="`${uid}-${field.key}`" v-model="model[field.key]" class="field" />

        <p v-if="errors[field.key]" class="mt-1 text-sm text-danger" role="alert">{{ errors[field.key] }}</p>
        <p v-else-if="field.hint" class="mt-1 text-sm text-muted">{{ field.hint }}</p>
      </template>
    </div>
  </div>
</template>
