<template>
  <div class="flex items-start gap-4 mb-10 text-gray-200">
    <!-- Logo + vertical line -->
    <div class="flex flex-col items-center h-full">
      <img :src="logo" :alt="name" class="object-cover w-24" />
      <!-- vertical line -->
      <div class="flex-1 w-px mt-2 bg-myGray/20"></div>
    </div>

    <!-- Content -->
    <div class="flex-1">
      <h3 class="text-lg font-bold text-myWhite dark:text-myBlack">
        {{ name }}
      </h3>
      <!-- link -->
      <a
        :href="link"
        target="_blank"
        rel="noopener noreferrer"
        class="text-sm text-myGray hover:text-myWhite dark:hover:text-myBlack"
      >
        <FontAwesomeIcon :icon="['fas', 'external-link-alt']" class="ml-1" />
      </a>
      <p class="my-4 text-xs tracking-wide text-myWhite dark:text-myBlack">
        {{ timeline }}
      </p>
      <p class="leading-relaxed text-myGray text-md">
        {{ summary }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const props = defineProps({
  name: String,
  designation: String,
  logo: String,
  timeline: String,
  summary: String,
  link: String,
});
</script>
