<script setup lang="ts">
const { data: posts } = await useFetch("/api/posts");
useSeoMeta({ title: "Blog", description: "Notes on building web apps, AI features and running Linux servers." });
</script>

<template>
  <div>
    <PageIntro title="Blog" lead="Notes on building web apps, AI features and running the servers underneath them." />
    <div class="shell mt-12">
      <p v-if="!posts?.length" class="text-muted">Nothing published yet. The first posts are on the way.</p>
      <ul v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <li v-for="post in posts" :key="post.slug"><PostCard :post="post" /></li>
      </ul>
    </div>
  </div>
</template>
