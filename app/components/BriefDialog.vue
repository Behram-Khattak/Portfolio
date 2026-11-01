<script setup lang="ts">
const { request, close } = useBrief();
const dialog = ref<HTMLDialogElement>();
onMounted(() => dialog.value?.showModal());
</script>

<template>
  <dialog ref="dialog" class="brief-dialog" aria-labelledby="brief-title" @close="close">
    <div class="flex items-start justify-between gap-4 px-5 pt-5 sm:px-7 sm:pt-6">
      <h2 id="brief-title" class="text-2xl font-normal md:text-3xl">{{ request?.kind === "consultation" ? "Book a free consultation" : "Start a project" }}</h2>
      <button type="button" class="grid size-9 shrink-0 place-items-center rounded-full border border-line hover:border-fg" aria-label="Close" @click="dialog?.close()">
        <Icon name="lucide:x" size="18" />
      </button>
    </div>
    <BriefForm v-if="request" :kind="request.kind" :service="request.service" class="px-5 pb-5 sm:px-7 sm:pb-7" @done="dialog?.close()" @kind="request && (request.kind = $event)" />
  </dialog>
</template>
