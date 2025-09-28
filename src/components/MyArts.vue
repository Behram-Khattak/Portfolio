<script setup></script>

<template>
  <section class="MyArts">
    <div class="py-16" id="myArts">
      <div class="text-2xl font-bold text-center capitalize sm:text-4xl text-myWhite dark:text-myBlack">
        <h1>my <span class="underline decoration-wavy underline-offset-4">projects</span></h1>
      </div>

      <div class="pb-16 mt-10 text-lg sm:text-xl section-content">
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
                  class="text-myWhite hover:underline decoration-wavy"
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
            <div
              class="p-5 border border-gray-200 dark:border-gray-700"
            >
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
      </div>
    </div>
  </section>
</template>
