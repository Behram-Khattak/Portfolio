<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import WhoAmI from "@/components/WhoAmI.vue";
import AboutMe from "@/components/AboutMe.vue";
import Tools from "@/components/Tools.vue";
import ApproachMe from "./components/ApproachMe.vue";

import { onMounted } from "vue";
import { initFlowbite } from "flowbite";

// initialize components based on data attribute selectors
onMounted(() => {
  initFlowbite();
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const applyTheme = () => {
    const savedTheme = localStorage.getItem("color-theme");

    // 1. If user manually picked a theme, respect that.
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    }
    // 2. If no manual choice, follow the system (Auto).
    else {
      if (mediaQuery.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  // Run on mount
  applyTheme();

  // Watch for system changes (The "Auto" magic)
  mediaQuery.addEventListener("change", () => {
    // Only auto-switch if the user hasn't forced a manual preference
    if (!localStorage.getItem("color-theme")) {
      applyTheme();
    }
  });
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
