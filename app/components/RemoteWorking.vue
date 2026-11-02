<template>
  <section class="shell mt-24">
    <SectionHeading title="Working remotely." sub="How it runs from anywhere." />
    <ul class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <li v-for="note in remoteNotes" :key="note.title" class="rounded-2xl border border-line bg-surface p-6">
        <Icon :name="note.icon" size="22" class="text-accent" />
        <h3 class="mt-4 text-xl font-medium">{{ note.title }}</h3>
        <p class="mt-2 text-muted">{{ note.text }}</p>
      </li>
    </ul>
  </section>
</template>
