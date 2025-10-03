<script setup>
import { ref } from "vue";

const tools = ref([
  {
    id: 1,
    name: "Laravel",
    icon: "fab fa-laravel",
    color: "text-red-600 text-6xl sm:text-8xl",
    link: "https://laravel.com/",
  },
  {
    id: 2,
    name: "Vue Js",
    icon: "fab fa-vuejs",
    color: "text-green-600 text-6xl sm:text-8xl",
    link: "https://vuejs.org/",
  },
  {
    id: 3,
    name: "React Js",
    icon: "fab fa-react",
    color: "text-blue-400 text-6xl sm:text-8xl",
    link: "https://react.dev/",
  },
  {
    id: 4,
    name: "Docker",
    icon: "fab fa-docker",
    color: "text-blue-500 text-6xl sm:text-8xl",
    link: "https://www.docker.com/",
  },
]);

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
      <div class="py-4"
      v-for="tool in tools"
      >
        <a :href="tool.link" target="_blank">
          <font-awesome-icon
            :icon="tool.icon"
            :class="tool.color"
          /><br /><br />
          <span>{{ tool.name }}</span>
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
