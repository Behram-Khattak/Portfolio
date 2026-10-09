<script setup lang="ts">
definePageMeta({ layout: false });
useHead({ title: "Sign in | Admin", meta: [{ name: "robots", content: "noindex, nofollow" }] });

const { loggedIn, fetch: fetchSession } = useUserSession();
if (!loggedIn.value) await fetchSession();
if (loggedIn.value) await navigateTo("/admin");

const form = reactive({ email: "", password: "", code: "" });
const needsCode = ref(false);
const failure = ref("");
const busy = ref(false);

async function signIn() {
  failure.value = "";
  busy.value = true;
  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: { email: form.email, password: form.password, ...(needsCode.value ? { code: form.code } : {}) },
    });
    await fetchSession();
    await navigateTo("/admin");
  } catch (error) {
    const e = error as { statusCode?: number; data?: { data?: { totpRequired?: boolean } } };
    if (e.data?.data?.totpRequired) {
      needsCode.value = true;
    } else if (e.statusCode === 429) {
      failure.value = "Too many attempts. Wait 15 minutes and try again.";
    } else if (e.statusCode === 400) {
      failure.value = "Enter a valid email, password and 6-digit code.";
    } else {
      failure.value = needsCode.value ? "That code or password is not correct." : "That email or password is not correct.";
    }
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <main class="grid min-h-screen place-items-center p-5">
    <form class="w-full max-w-sm rounded-2xl border border-line bg-surface p-8" @submit.prevent="signIn">
      <Icon name="lucide:shield-check" size="30" class="text-accent" />
      <h1 class="mt-4 text-3xl font-semibold">Sign in</h1>

      <div class="mt-6 space-y-4">
        <div>
          <label class="label" for="email">Email</label>
          <input id="email" v-model="form.email" type="email" class="field" autocomplete="username" required :readonly="needsCode" />
        </div>
        <div>
          <label class="label" for="password">Password</label>
          <input id="password" v-model="form.password" type="password" class="field" autocomplete="current-password" required :readonly="needsCode" />
        </div>
        <div v-if="needsCode">
          <label class="label" for="code">Authentication code</label>
          <input id="code" v-model="form.code" class="field font-mono tracking-[0.3em]" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="\d{6}" required autofocus />
          <p class="mt-1 text-sm text-muted">The 6-digit code from your authenticator app.</p>
        </div>
      </div>

      <p v-if="failure" class="mt-4 text-danger" role="alert">{{ failure }}</p>
      <button type="submit" class="btn btn-primary mt-6 w-full" :disabled="busy">{{ busy ? "Signing in…" : "Sign in" }}</button>
    </form>
  </main>
</template>
