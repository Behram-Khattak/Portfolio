<script setup>
import { ref } from "vue";

const tools = ref([
  {
    id: 1,
    name: "Laravel",
    icon: "fab fa-laravel",
    color: "text-[#FF2D20]",
    shadow: "hover:shadow-red-200",
  },
  {
    id: 2,
    name: "Vue Js",
    icon: "fab fa-vuejs",
    color: "text-[#42b883]",
    shadow: "hover:shadow-green-200",
  },
  {
    id: 3,
    name: "React Js",
    icon: "fab fa-react",
    color: "text-[#61DAFB]",
    shadow: "hover:shadow-blue-200",
  },
  {
    id: 4,
    name: "Docker",
    icon: "fab fa-docker",
    color: "text-[#2496ED]",
    shadow: "hover:shadow-cyan-200",
  },
  {
    id: 5,
    name: "Livewire",
    icon: "fas fa-bolt",
    color: "text-[#FB70A9]",
    shadow: "hover:shadow-pink-200",
  },
  {
    id: 6,
    name: "Filament",
    icon: "fas fa-plug",
    color: "text-[#FFA116]",
    shadow: "hover:shadow-amber-200",
  },
]);
</script>

<template>
  <section class="relative py-24 overflow-hidden">
    <!-- Subtle Top Border Accent -->
    <div
      class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent"
    ></div>

    <div class="container relative z-10 px-6 mx-auto">
      <!-- Centered Section Header -->
      <div
        class="pb-8 text-2xl font-bold text-center capitalize sm:text-4xl text-myWhite dark:text-myBlack"
      >
        <h1>
          Tools I
          <span
            class="underline decoration-wavy decoration-indigo-500 underline-offset-4"
            >Prefer the Most</span
          >
        </h1>
      </div>

      <!-- Tools Grid -->
      <div class="grid grid-cols-2 gap-8 md:grid-cols-3">
        <div v-for="tool in tools" :key="tool.id" class="relative group">
          <!-- The Minimalist Card -->
          <div
            class="relative flex flex-col items-center justify-center h-full px-4 py-8 text-center transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:border-transparent"
            :class="tool.shadow"
          >
            <!-- Icon -->
            <div
              class="mb-6 transition-transform duration-500 transform group-hover:scale-110"
            >
              <font-awesome-icon
                :icon="tool.icon"
                :class="[tool.color, 'text-5xl md:text-6xl']"
              />
            </div>

            <!-- Label -->
            <span
              class="font-bold tracking-tight text-gray-600 transition-colors duration-300 dark:text-gray-400 dark:group-hover:text-gray-900 group-hover:text-gray-200"
            >
              {{ tool.name }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.brush-highlight {
  position: relative;
  z-index: 1;
  padding: 0 10px;
}

.brush-highlight::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 8%;
  width: 100%;
  height: 30%;
  background: #6366f1; /* Your indigo/hero theme color */
  opacity: 0.2;
  z-index: -1;
  transform: skewX(-15deg);
}

/* Optional: Add a very faint grid background to the section to give it texture */
section {
  background-image: radial-gradient(#e5e7eb 0.5px, transparent 0.5px);
  background-size: 30px 30px;
}
</style>
