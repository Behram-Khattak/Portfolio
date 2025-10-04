<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import WhoAmI from "@/components/WhoAmI.vue";
import AboutMe from "@/components/AboutMe.vue";
import MyJourney from "@/components/MyJourney.vue";
import MyArts from "@/components/MyArts.vue";
import Tools from "@/components/Tools.vue";
import ApproachMe from "./components/ApproachMe.vue";

import { onMounted } from "vue";
import { initFlowbite } from "flowbite";

// initialize components based on data attribute selectors
onMounted(() => {
  initFlowbite();
});
</script>

<template>
  <header class="">
    <Header />
  </header>

  <main class="max-w-screen-xl px-4 mx-auto">
    <!-- who am i -->
    <WhoAmI />
    
    <!-- about my experience -->
    <AboutMe />

    <!-- tools and skills -->
    <Tools />

    <!-- approach me -->
    <ApproachMe />
  </main>

  <footer>
    <Footer />
  </footer>
</template>

<script>
export default {
  // 
};
</script>
