<script setup></script>

<template>
  <section class="MyJourney">
    <div
      class="container flex flex-col items-center justify-center py-16 mx-auto space-y-5"
      id="myJourney"
    >
      <div class="text-2xl font-bold text-center capitalize sm:text-4xl text-myWhite dark:text-myBlack">
        <h1>my <span class="underline decoration-wavy decoration-indigo-500 underline-offset-4">skillful</span> journey</h1>
      </div>

      <div
        class="grid section-content place-items-center"
      >
        <!-- component -->

        <div class="mb-4">
          <ul
            class="flex-wrap -mb-px text-sm font-medium text-center md:flex"
            id="default-tab"
            data-tabs-toggle="#default-tab-content"
            role="tablist"
          >
            <li class="me-2" role="presentation">
              <button
                class="inline-block p-4 rounded-t-lg hover:underline focus:underline underline-offset-8 decoration-wavy hover:decoration-indigo-500 dark:hover:text-indigo-500 text-myWhite hover:text-indigo-500 dark:focus:text-indigo-500"
                id="profile-tab"
                data-tabs-target="#profile"
                type="button"
                role="tab"
                aria-controls="profile"
                aria-selected="false"
              >
                php
              </button>
            </li>
            <li class="me-2" role="presentation">
              <button
                class="inline-block p-4 rounded-t-lg hover:underline focus:underline underline-offset-8 decoration-wavy hover:decoration-indigo-500 dark:hover:text-indigo-500 text-myWhite hover:text-indigo-500 dark:focus:text-indigo-500"
                id="dashboard-tab"
                data-tabs-target="#dashboard"
                type="button"
                role="tab"
                aria-controls="dashboard"
                aria-selected="false"
              >
                Javascript
              </button>
            </li>
            <li class="me-2" role="presentation">
              <button
                class="inline-block p-4 rounded-t-lg hover:underline focus:underline underline-offset-8 decoration-wavy hover:decoration-indigo-500 dark:hover:text-indigo-500 text-myWhite hover:text-indigo-500 dark:focus:text-indigo-500"
                id="settings-tab"
                data-tabs-target="#settings"
                type="button"
                role="tab"
                aria-controls="settings"
                aria-selected="false"
              >
                Frameworks
              </button>
            </li>
            <li role="presentation">
              <button
                class="inline-block p-4 rounded-t-lg hover:underline focus:underline underline-offset-8 decoration-wavy hover:decoration-indigo-500 dark:hover:text-indigo-500 text-myWhite hover:text-indigo-500 dark:focus:text-indigo-500"
                id="contacts-tab"
                data-tabs-target="#contacts"
                type="button"
                role="tab"
                aria-controls="contacts"
                aria-selected="false"
              >
                Version control | linux | Docker
              </button>
            </li>
          </ul>
        </div>
        <!-- tabs content -->
        <div id="default-tab-content">
          <div
            class="hidden p-4 rounded-lg"
            id="profile"
            role="tabpanel"
            aria-labelledby="profile-tab"
          >
            <p class="text-xl text-center text-myGray">
              Started learning Php back in 2019 and still looking for
              implementing new ideas that can speed up the development as well
              as the afterwords website life to the next level. Php is my
              all-time favorite General Purpose language. Php also acquires
              almost half of the web and is the most suitable language for web
              apps.
            </p>
          </div>
          <div
            class="hidden p-4 rounded-lg"
            id="dashboard"
            role="tabpanel"
            aria-labelledby="dashboard-tab"
          >
            <p class="text-xl text-center text-myGray">
              Started learning Javascript back in 2019, and still working with
              Frameworks like Vue and React. These frameworks make the
              complicated work so much easy for the developers out there.
            </p>
          </div>
          <div
            class="hidden p-4 rounded-lg"
            id="settings"
            role="tabpanel"
            aria-labelledby="settings-tab"
          >
            <p class="text-xl text-center text-myGray">
              Started learning Frameworks like Laravel, React, and Vue back in
              2021, and still working with these Frameworks creating projects
              like:
              <br />
              <span class="leading-loose underline decoration-wavy decoration-indigo-500 underline-offset-8">CMS Content Management Systems</span><br />
              <span class="leading-loose underline decoration-wavy decoration-indigo-500 underline-offset-8">Custom E-commerce Platforms</span><br />
              <span class="leading-loose underline decoration-wavy decoration-indigo-500 underline-offset-8">Chat Applications</span><br />
              <span class="leading-loose underline decoration-wavy decoration-indigo-500 underline-offset-8">LMS (Learning Management Systems)</span><br />
            </p>
          </div>
          <div
            class="hidden p-4 rounded-lg"
            id="contacts"
            role="tabpanel"
            aria-labelledby="contacts-tab"
          >
            <p class="text-xl text-center text-myGray">
              Started learning Git and Github back in 2020, and using Linux
              Ubuntu from 2021. Linux really sped up my development career. Also
              Recently Started learning how Docker works and looking forward to
              use in my development career.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
