<script setup lang="ts">
defineProps<{
  post: {
    slug: string;
    title: string;
    excerpt: string;
    tags: string[];
    publishedAt: string | Date | null;
    readingMinutes: number;
    cover: { url: string; thumb: string; alt: string; width: number; height: number } | null;
  };
}>();
</script>

<template>
  <NuxtLink :to="`/blog/${post.slug}`" class="post-card flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface">
    <div class="aspect-[16/9] overflow-hidden border-b border-line">
      <img v-if="post.cover" :src="post.cover.thumb" :alt="post.cover.alt" loading="lazy" class="size-full object-cover" />
      <!-- No cover image yet: show the topics instead of an empty box -->
      <div v-else class="pattern glyph-texture flex size-full flex-col justify-end p-5">
        <p class="font-mono text-sm leading-7 text-muted">
          <span v-for="tag in post.tags" :key="tag" class="block"><span class="text-accent">#</span> {{ tag }}</span>
        </p>
      </div>
    </div>

    <div class="flex flex-1 flex-col p-6">
      <ul v-if="post.cover && post.tags.length" class="mb-3 flex flex-wrap gap-2">
        <li v-for="tag in post.tags" :key="tag" class="rounded-full border border-line px-2.5 py-0.5 text-sm text-muted">{{ tag }}</li>
      </ul>
      <h3 class="text-xl font-medium">{{ post.title }}</h3>
      <p v-if="post.excerpt" class="mt-3 line-clamp-3 text-muted">{{ post.excerpt }}</p>
      <p class="mt-auto flex items-center gap-4 pt-6 text-sm text-muted">
        <span v-if="post.publishedAt" class="flex items-center gap-1.5">
          <Icon name="lucide:calendar" size="15" />
          <time :datetime="new Date(post.publishedAt).toISOString()">{{ formatDate(post.publishedAt) }}</time>
        </span>
        <span class="flex items-center gap-1.5"><Icon name="lucide:clock" size="15" /> {{ post.readingMinutes }} min read</span>
      </p>
    </div>
  </NuxtLink>
</template>

<style scoped>
/* Hover: the card pops up a touch */
.post-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}
.post-card:hover,
.post-card:focus-visible {
  transform: translateY(-6px) scale(1.02);
  border-color: color-mix(in srgb, var(--accent) 60%, var(--line));
  box-shadow: 0 22px 44px -22px color-mix(in srgb, var(--accent) 75%, transparent);
}
@media (prefers-reduced-motion: reduce) {
  .post-card:hover,
  .post-card:focus-visible {
    transform: none;
  }
}
.pattern {
  background: radial-gradient(18rem 10rem at 100% 0%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 70%);
}
</style>
