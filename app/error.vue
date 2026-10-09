<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();
const notFound = computed(() => props.error.statusCode === 404);
useHead({ title: notFound.value ? "Page not found" : "Something went wrong" });
</script>

<template>
  <main class="shell grid min-h-screen place-content-center py-24">
    <p class="font-mono text-muted">{{ error.statusCode }}</p>
    <h1 class="mt-3 text-4xl font-normal md:text-5xl">{{ notFound ? "Page Not Found" : "Something Went Wrong" }}</h1>
    <p class="mt-4 max-w-[52ch] text-lg text-muted">
      {{ notFound ? "The link may be old, or the page may have been unpublished." : "The page could not be loaded. Try again in a moment." }}
    </p>
    <div class="mt-8">
      <button type="button" class="btn btn-primary" @click="clearError({ redirect: '/' })">Go to the homepage</button>
    </div>
  </main>
</template>
