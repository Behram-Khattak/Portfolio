<script setup lang="ts">
// Cloudflare's spam check. Emits a one-time token for the server to verify.
const emit = defineEmits<{ token: [value: string] }>();
const { public: { turnstileSiteKey } } = useRuntimeConfig();

type Turnstile = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
const api = () => (window as unknown as { turnstile?: Turnstile }).turnstile;

const container = ref<HTMLElement>();
let widget: string | undefined;

useHead({
  script: [{ src: "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit", async: true, defer: true }],
});

onMounted(() => {
  const render = () => {
    const turnstile = api();
    if (!turnstile) return void setTimeout(render, 100);
    if (!container.value) return;
    widget = turnstile.render(container.value, {
      sitekey: turnstileSiteKey,
      callback: (token: string) => emit("token", token),
      "expired-callback": () => emit("token", ""),
      "error-callback": () => emit("token", ""),
    });
  };
  render();
});

onBeforeUnmount(() => {
  if (widget) api()?.remove(widget);
});

// Tokens are single-use, so a failed send needs a fresh one
defineExpose({
  reset() {
    emit("token", "");
    if (widget) api()?.reset(widget);
  },
});
</script>

<template>
  <div ref="container" />
</template>
