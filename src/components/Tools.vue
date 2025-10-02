<script setup>
//
</script>

<template>
  <section class="toolsAndSkills">
    <div
      class="text-2xl font-bold text-center capitalize sm:text-4xl text-myWhite dark:text-myBlack"
    >
      <h1>
        Tools i
        <span class="underline decoration-wavy decoration-indigo-500 underline-offset-4">prefer</span>
      </h1>
    </div>

    <div
      class="grid grid-cols-2 py-16 text-center sm:grid-cols-4 text-myWhite dark:text-myBlack"
    >
      <div class="py-4">
        <a href="https://laravel.com/">
          <font-awesome-icon
            icon="fab fa-laravel"
            class="text-6xl text-red-600 sm:text-8xl"
          /><br /><br />
          <span>Laravel</span>
        </a>
      </div>

      <div class="py-4">
        <a href="https://vuejs.org/">
          <font-awesome-icon
            icon="fab fa-vuejs"
            class="text-6xl text-green-600 sm:text-8xl"
          /><br /><br />
          <span>Vue Js</span>
        </a>
      </div>

      <div class="py-4">
        <a href="https://react.dev/">
          <font-awesome-icon
            icon="fab fa-react"
            class="text-6xl text-blue-400 sm:text-8xl"
          /><br /><br />
          <span>React Js</span>
        </a>
      </div>

      <div class="py-4">
        <a href="https://www.docker.com/">
          <font-awesome-icon
            icon="fab fa-docker"
            class="text-6xl text-blue-500 sm:text-8xl"
          /><br /><br />
          <span>Docker</span>
        </a>
      </div>
    </div>
  </section>
</template>
<!-- style -->
<style scoped>
/*  */
</style>
<!-- script -->
<script>
export default {
  //
};
</script>
