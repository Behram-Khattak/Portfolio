<script setup></script>

<template>
  <section class="ApproachMe">
    <div
      class="container flex flex-col items-center justify-center py-16 mx-auto space-y-10"
      id="approachMe"
    >
      <div class="text-2xl font-bold text-center capitalize sm:text-4xl text-myWhite dark:text-myBlack">
        <h1>approach me <span class="underline decoration-wavy decoration-indigo-500 underline-offset-4">here</span></h1>
      </div>

      <div class="section-content">
        <div
          class="grid approach-me-methods lg:grid-cols-2 lg:gap-60 text-myWhite dark:text-myBlack"
        >
          <div class="flex items-center space-x-5 call">
            <span class="approach-me-icons">
              <font-awesome-icon icon="fas fa-mobile" class="text-6xl sm:text-7xl" />
            </span>

            <span class="font-bold leading-loose">
              <span class="underline decoration-wavy decoration-indigo-500 underline-offset-4">Whatsapp Business Call</span> <br />
              <a href="tel:+923319218866" class="text-myGray"> +974-66917419 </a>
            </span>
          </div>

          <div class="flex items-center my-10 space-x-5 mail">
            <span class="approach-me-icons">
              <font-awesome-icon icon="fas fa-envelope" class="text-6xl sm:text-7xl" />
            </span>

            <span class="font-bold leading-loose">
              <span class="underline decoration-wavy decoration-indigo-500 underline-offset-4">Business Mail</span> <br />
              <a
                href="mailto:behramkttk9@gmail.com"
                target="_blank"
                class="text-myGray"
              >
                behramkttk9@gmail.com
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
