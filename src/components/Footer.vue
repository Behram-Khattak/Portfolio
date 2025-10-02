<script setup>
defineProps({
  // 
});
</script>

<template>
  <div class="flex justify-between max-w-screen-xl px-8 pb-5 mx-auto capitalize copy-right lg:px-0 text-myWhite dark:text-myBlack">
      <span>&COPY; behram {{ new Date().getFullYear() }}</span>

      <div class="jump-to-top">
        <a href="#whoAmI" class="px-3 py-2 border-4 border-indigo-500 rounded-full text-myWhite dark:text-myBlack">
          <font-awesome-icon icon="fas fa-arrow-up" size="lg" />
        </a>
      </div>
  </div>
</template>



