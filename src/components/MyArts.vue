<script setup>
import { ref } from "vue";

import { Carousel, Slide, Navigation } from "vue3-carousel";

const carouselConfig = {
  height: "auto",
  itemsToShow: 1,
  gap: 10,
  snapAlign: "center",
  breakpointMode: "carousel",

  breakpoints: {
    500: {
      itemsToShow: 2,
      snapAlign: "center",
    },

    600: {
      itemsToShow: 2,
      snapAlign: "center",
    },
  },
};

const projects = ref([
  {
    id: 1,
    title: "Quotes Network",
    summary:
      "Join Us On Our Engaging Social Media Journey As We Curate And Share The Best Quotes Every Day. Connect With Us On Pinterest And Instagram To Enhance Your Personal Growth And Enrich Your Daily Life.",
    tools: ["#laravel", "#bootstrap", "#javascript"],
    link: "https://quotes.network/",
  },
  {
    id: 2,
    title: "Cogni 4 Health",
    summary:
      "Cogni® is expanding Wellness for All, Always Providing virtual solutions to accelerate wellness results so that Wellness Programs and Mental Health Providers support more people without delay.",
    tools: ["#laravel", "#bootstrap", "#javascript"],
    link: "https://cogni4health.com/",
  },
]);
</script>

<style>
.carousel__prev, .carousel__next{
  background-color: #6875F5;
  border-radius: 100%;
}
</style>

<template>
  <section class="MyArts">
    <div class="py-16" id="myArts">
      <div
        class="pb-8 text-2xl font-bold text-center capitalize sm:text-4xl text-myWhite dark:text-myBlack"
      >
        <h1>
          my
          <span
            class="underline decoration-wavy decoration-indigo-500 underline-offset-4"
            >projects</span
          >
        </h1>
      </div>

      <div class="py-10 carousel__wrapper">
        <Carousel v-bind="carouselConfig">
          <Slide v-for="project in projects" :key="project.id">
            <div
              class="max-w-sm p-6 bg-white border border-gray-200 shadow-md rounded-2xl dark:bg-myBlack"
            >
              <a :href="project.link" target="_blank">
                <h5
                  class="mb-2 text-2xl font-bold tracking-tight underline text-myBlack dark:text-myWhite decoration-wavy decoration-indigo-500 underline-offset-4"
                >
                  {{ project.title }}
                </h5>
              </a>
              <p class="py-4 mb-3 font-normal text-gray-700 dark:text-gray-400">
                {{ project.summary }}
              </p>
              <a
                rel="stylesheet"
                class="hover:underline decoration-wavy text-myBlack dark:text-myWhite"
                :href="project.link"
                target="_blank"
                >Visit #</a
              >
            </div>
          </Slide>
          <!-- navigation -->
          <template #addons>
            <Navigation />
          </template>
        </Carousel>
      </div>

      <!-- <div class="pb-16 mt-10 text-lg sm:text-xl section-content">
        <div id="accordion-collapse" data-accordion="collapse">
          <h2 id="accordion-collapse-heading-1">
            <button
              type="button"
              class="flex items-center justify-between w-full gap-3 p-5 font-medium border border-b-0 border-gray-200 text-myGray rtl:text-right rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-myGray hover:bg-gray-100 dark:hover:bg-gray-800"
              data-accordion-target="#accordion-collapse-body-1"
              aria-expanded="true"
              aria-controls="accordion-collapse-body-1"
            >
              quotes.network
            </button>
          </h2>
          <div
            id="accordion-collapse-body-1"
            class="hidden"
            aria-labelledby="accordion-collapse-heading-1"
          >
            <div
              class="p-5 border border-b-0 border-gray-200 dark:border-gray-700"
            >
              <p class="mb-2 text-myGray">
                Join Us On Our Engaging Social Media Journey As We Curate And
                Share The Best Quotes Every Day. Connect With Us On Pinterest
                And Instagram To Enhance Your Personal Growth And Enrich Your
                Daily Life.
                <a
                  rel="stylesheet"
                  class="text-myWhite hover:underline decoration-wavy dark:text-myBlack"
                  href="https://quotes.network"
                  >Visit #</a
                >
              </p>

              <div class="pt-4 pb-2 text-myGray arts-keywords">
                <small
                  class="inline-block px-3 py-1 mb-2 mr-2 font-semibold rounded-full"
                  >#laravel</small
                >
                <small
                  class="inline-block px-3 py-1 mb-2 mr-2 font-semibold rounded-full"
                  >#bootstrap</small
                >
                <small
                  class="inline-block px-3 py-1 mb-2 mr-2 font-semibold rounded-full"
                  >#javascript</small
                >
              </div>
            </div>
          </div>
          <h2 id="accordion-collapse-heading-2">
            <button
              type="button"
              class="flex items-center justify-between w-full gap-3 p-5 font-medium border border-gray-200 text-myGray rtl:text-right focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-myGray hover:bg-gray-100 dark:hover:bg-gray-800"
              data-accordion-target="#accordion-collapse-body-2"
              aria-expanded="false"
              aria-controls="accordion-collapse-body-2"
            >
              cogni 4 health
            </button>
          </h2>
          <div
            id="accordion-collapse-body-2"
            class="hidden"
            aria-labelledby="accordion-collapse-heading-2"
          >
            <div class="p-5 border border-gray-200 dark:border-gray-700">
              <p class="mb-2 text-myGray">
                Cogni® is expanding Wellness for All, Always Providing virtual
                solutions to accelerate wellness results so that Wellness
                Programs and Mental Health Providers support more people without
                delay.
                <a
                  rel="stylesheet"
                  class="text-myWhite hover:underline decoration-wavy"
                  href="https://cogni4health.com/"
                  >Visit #</a
                >
              </p>
              <div class="pt-4 pb-2 text-myGray arts-keywords">
                <small
                  class="inline-block px-3 py-1 mb-2 mr-2 font-semibold rounded-full"
                  >#laravel</small
                >
                <small
                  class="inline-block px-3 py-1 mb-2 mr-2 font-semibold rounded-full"
                  >#bootstrap</small
                >
                <small
                  class="inline-block px-3 py-1 mb-2 mr-2 font-semibold rounded-full"
                  >#javascript</small
                >
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </section>
</template>
