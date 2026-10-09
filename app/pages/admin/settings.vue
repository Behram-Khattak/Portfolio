<script setup lang="ts">
import { passwordChangeSchema } from "#shared/utils/schemas";

definePageMeta({ layout: "admin", middleware: "admin" });
useHead({ title: "Settings" });

const { data: settings, refresh: refreshSettings } = await useAsyncData("admin-settings", () => adminFetch("/api/admin/settings"));
const { data: account, refresh: refreshAccount } = await useAsyncData("admin-account", () => adminFetch<{ email: string; totpEnabled: boolean }>("/api/admin/account"));
const { fetch: fetchSession } = useUserSession();

// Résumé
const resumeMessage = ref("");
const resumeBusy = ref(false);
async function uploadResume(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  resumeMessage.value = "";
  resumeBusy.value = true;
  try {
    const body = new FormData();
    body.append("file", file);
    await adminFetch("/api/admin/settings/resume", { method: "POST", body });
    await Promise.all([refreshSettings(), refreshNuxtData("site")]);
  } catch (error) {
    resumeMessage.value = errorMessage(error, "The file could not be uploaded.");
  } finally {
    resumeBusy.value = false;
    input.value = "";
  }
}
async function removeResume() {
  if (!confirm("Remove your résumé from the site?")) return;
  await adminFetch("/api/admin/settings/resume", { method: "DELETE" });
  await Promise.all([refreshSettings(), refreshNuxtData("site")]);
}

// Password
const password = reactive({ current: "", next: "", confirm: "" });
const passwordMessage = ref<{ ok: boolean; text: string } | null>(null);
async function changePassword() {
  passwordMessage.value = null;
  if (password.next !== password.confirm) return (passwordMessage.value = { ok: false, text: "The new passwords do not match." });
  const parsed = passwordChangeSchema.safeParse(password);
  if (!parsed.success) return (passwordMessage.value = { ok: false, text: parsed.error.issues[0]?.message ?? "Check the form." });
  try {
    await adminFetch("/api/admin/account/password", { method: "POST", body: parsed.data });
    await fetchSession();
    Object.assign(password, { current: "", next: "", confirm: "" });
    passwordMessage.value = { ok: true, text: "Password changed. Other devices have been signed out." };
  } catch (error) {
    passwordMessage.value = { ok: false, text: errorMessage(error) };
  }
}

// Two-factor authentication
const enrolment = ref<{ secret: string; qr: string } | null>(null);
const totpCode = ref("");
const disablePassword = ref("");
const totpMessage = ref("");
async function startTotp() {
  totpMessage.value = "";
  try {
    enrolment.value = await adminFetch<{ secret: string; qr: string }>("/api/admin/account/totp/setup", { method: "POST" });
  } catch (error) {
    totpMessage.value = errorMessage(error);
  }
}
async function confirmTotp() {
  totpMessage.value = "";
  try {
    await adminFetch("/api/admin/account/totp/enable", { method: "POST", body: { code: totpCode.value } });
    enrolment.value = null;
    totpCode.value = "";
    await refreshAccount();
  } catch (error) {
    totpMessage.value = errorMessage(error, "Enter the 6-digit code from your app.");
  }
}
async function disableTotp() {
  totpMessage.value = "";
  try {
    await adminFetch("/api/admin/account/totp/disable", { method: "POST", body: { password: disablePassword.value } });
    disablePassword.value = "";
    await refreshAccount();
  } catch (error) {
    totpMessage.value = errorMessage(error);
  }
}
</script>

<template>
  <div class="max-w-4xl">
    <h1 class="text-3xl font-semibold">Settings</h1>

    <div v-if="settings" class="mt-8 space-y-8">
      <AdminSettingsForm settings-key="site" :initial="settings.site" />
      <AdminSettingsForm settings-key="contact" :initial="settings.contact" />
      <AdminSettingsForm settings-key="socials" :initial="settings.socials" />

      <section class="rounded-xl border border-line bg-surface/50 p-6">
        <h2 class="text-xl font-semibold">Résumé</h2>
        <p class="mt-2 text-muted">
          <template v-if="settings.resume">Current file: <a href="/resume" class="link">{{ settings.resume.name }}</a></template>
          <template v-else>No résumé uploaded. Add a PDF and a download button appears on the About page and homepage.</template>
        </p>
        <div class="mt-4 flex flex-wrap gap-3">
          <label class="btn btn-ghost">
            <Icon name="lucide:upload" size="16" /> {{ resumeBusy ? "Uploading…" : settings.resume ? "Replace PDF" : "Upload PDF" }}
            <input type="file" accept="application/pdf" class="sr-only" :disabled="resumeBusy" @change="uploadResume" />
          </label>
          <button v-if="settings.resume" type="button" class="btn btn-danger" @click="removeResume">Remove</button>
        </div>
        <p v-if="resumeMessage" class="mt-3 text-danger" role="alert">{{ resumeMessage }}</p>
      </section>

      <form class="rounded-xl border border-line bg-surface/50 p-6" @submit.prevent="changePassword">
        <h2 class="text-xl font-semibold">Password</h2>
        <!-- Lets password managers associate the new password with the right account -->
        <input type="text" autocomplete="username" :value="account?.email" class="sr-only" tabindex="-1" aria-hidden="true" readonly />
        <div class="mt-5 grid gap-5 md:grid-cols-3">
          <div>
            <label class="label" for="pw-current">Current password</label>
            <input id="pw-current" v-model="password.current" type="password" class="field" autocomplete="current-password" required />
          </div>
          <div>
            <label class="label" for="pw-next">New password</label>
            <input id="pw-next" v-model="password.next" type="password" class="field" autocomplete="new-password" minlength="12" required />
          </div>
          <div>
            <label class="label" for="pw-confirm">Repeat new password</label>
            <input id="pw-confirm" v-model="password.confirm" type="password" class="field" autocomplete="new-password" required />
          </div>
        </div>
        <p class="mt-2 text-sm text-muted">At least 12 characters. Changing it signs out every other device.</p>
        <div class="mt-5 flex items-center gap-4">
          <button type="submit" class="btn btn-primary">Change password</button>
          <p v-if="passwordMessage" :class="passwordMessage.ok ? 'text-ok' : 'text-danger'" role="status">{{ passwordMessage.text }}</p>
        </div>
      </form>

      <section class="rounded-xl border border-line bg-surface/50 p-6">
        <h2 class="text-xl font-semibold">Two-factor authentication</h2>

        <template v-if="account?.totpEnabled">
          <p class="mt-2 flex items-center gap-2 text-ok"><Icon name="lucide:shield-check" size="18" /> On. Signing in needs a code from your authenticator app.</p>
          <form class="mt-5 flex flex-wrap items-end gap-3" @submit.prevent="disableTotp">
            <div>
              <label class="label" for="totp-password">Password, to turn it off</label>
              <input id="totp-password" v-model="disablePassword" type="password" class="field" autocomplete="current-password" required />
            </div>
            <button type="submit" class="btn btn-danger">Turn off</button>
          </form>
        </template>

        <template v-else-if="enrolment">
          <ol class="mt-4 list-decimal space-y-4 pl-5">
            <li>
              Scan this code with an authenticator app (Google Authenticator, 1Password, Authy).
              <img :src="enrolment.qr" alt="QR code for your authenticator app" width="220" height="220" class="mt-3 rounded-lg bg-white p-2" />
              <p class="mt-2 text-sm text-muted">Can't scan? Enter this key by hand: <code class="break-all text-fg">{{ enrolment.secret }}</code></p>
            </li>
            <li>
              Enter the 6-digit code it shows.
              <form class="mt-3 flex flex-wrap gap-3" @submit.prevent="confirmTotp">
                <input v-model="totpCode" class="field w-40 font-mono tracking-[0.3em]" inputmode="numeric" autocomplete="one-time-code" maxlength="6" aria-label="Authentication code" required />
                <button type="submit" class="btn btn-primary">Turn on</button>
              </form>
            </li>
          </ol>
        </template>

        <template v-else>
          <p class="mt-2 text-muted">Off. With it on, a stolen password alone is not enough to sign in.</p>
          <button type="button" class="btn btn-primary mt-4" @click="startTotp">Set up two-factor authentication</button>
        </template>

        <p v-if="totpMessage" class="mt-3 text-danger" role="alert">{{ totpMessage }}</p>
      </section>
    </div>
  </div>
</template>
