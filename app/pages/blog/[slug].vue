<script setup lang="ts">
const route = useRoute();
const { data, error } = await useFetch(`/api/posts/${route.params.slug}`);
if (error.value || !data.value) throw createError({ statusCode: 404, statusMessage: "Post not found", fatal: true });
const post = data as Ref<NonNullable<typeof data.value>>;

const body = ref<HTMLElement>();
useCodeCopy(body);

const base = useRuntimeConfig().public.siteUrl.replace(/\/$/, "");
usePageSeo({
  title: post.value.title,
  description: post.value.excerpt,
  type: "article",
  image: post.value.cover?.url,
  breadcrumbs: [
    { name: "Blog", path: "/blog" },
    { name: post.value.title, path: `/blog/${post.value.slug}` },
  ],
  jsonLd: [
    {
      "@type": "BlogPosting",
      headline: post.value.title,
      description: post.value.excerpt,
      url: `${base}/blog/${post.value.slug}`,
      mainEntityOfPage: `${base}/blog/${post.value.slug}`,
      image: post.value.cover?.url,
      datePublished: post.value.publishedAt ? new Date(post.value.publishedAt).toISOString() : undefined,
      author: { "@id": personId() },
      keywords: post.value.tags.join(", ") || undefined,
    },
  ],
});
</script>

<template>
  <article class="shell pt-16 md:pt-24">
    <p class="text-muted">
      <time v-if="post.publishedAt" :datetime="new Date(post.publishedAt).toISOString()">{{ formatDate(post.publishedAt) }}</time>,
      {{ post.readingMinutes }} min read
    </p>
    <h1 class="mt-4 max-w-[22ch] text-4xl font-normal md:text-6xl">{{ post.title }}</h1>
    <p v-if="post.excerpt" class="mt-5 max-w-[60ch] text-xl text-muted">{{ post.excerpt }}</p>

    <img
      v-if="post.cover"
      :src="post.cover.url"
      :alt="post.cover.alt"
      :width="post.cover.width"
      :height="post.cover.height"
      class="mt-10 w-full rounded-xl border border-line"
    />

    <!-- eslint-disable-next-line vue/no-v-html -- rendered server-side with raw HTML disabled -->
    <div ref="body" class="prose mt-12" v-html="post.bodyHtml" />

    <p v-if="post.tags.length" class="mt-12 text-muted">Filed under {{ post.tags.join(", ") }}</p>
    <p class="mt-6"><NuxtLink to="/blog" class="link">All posts</NuxtLink></p>
  </article>
</template>
