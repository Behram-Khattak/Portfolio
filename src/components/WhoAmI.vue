<script setup>
defineProps({
  //
});
</script>

<template>
  <section class="WhoAmI" id="whoAmI">
    <div
      class="container flex flex-col items-center justify-center py-16 mx-auto mb-8 space-y-8"
    >

      <div class="grid text-center capitalize place-items-center name-and-designation">
        <h3
          class="text-3xl font-bold sm:text-5xl text-myWhite dark:text-myBlack"
        >
          Web Software Engineer <br> Linux Server Admin
        </h3>
        <br />
        <p class="sm:w-2/3 text-myWhite dark:text-myBlack">
          I'm Behram Khattak, a Web Software Engineer, who is passionate about
          building large scale web apps. Who's also enthusiast about Linux
          Server Administration & Cloud Computing.
        </p>
      </div>

      <div class="social-links">
        <ul class="flex space-x-10">
          <li>
            <a
              target="_blank"
              class="text-blue-500"
              href="https://twitter.com/behramkttk"
            >
              <font-awesome-icon icon="fab fa-twitter" size="xl" />
            </a>
          </li>

          <li>
            <a
              target="_blank"
              class="text-gray-700"
              href="https://github.com/Behram-Khattak"
            >
              <font-awesome-icon icon="fab fa-github" size="xl" />
            </a>
          </li>

          <li>
            <a
              target="_blank"
              class="text-blue-500"
              href="https://www.linkedin.com/in/behramkttk"
            >
              <font-awesome-icon icon="fab fa-linkedin" size="xl" />
            </a>
          </li>

          <li>
            <a
              target="_blank"
              class="text-red-500"
              href="https://www.youtube.com/@codewithbehram"
            >
              <font-awesome-icon icon="fab fa-youtube" size="xl" />
            </a>
          </li>
        </ul>
      </div>

      <!--  -->
      <!-- Prepare a container for your calendar. -->
      <div class="p-4 border border-gray-600 shadow-lg sm:p-6 rounded-xl">
        <h2 class="mb-4 font-bold sm:text-xl text-myWhite dark:text-myBlack">
          My Contribution Graph
        </h2>
        <div class="overflow-x-auto">
          <img
            src="https://ghchart.rshah.org/behram-khattak"
            alt="GitHub Contributions Graph"
            class="p-2 border border-gray-700 rounded-md w-[100em]"
          />
        </div>
        <div class="flex items-center justify-between mt-3 text-xs sm:text-sm">
          <span class="text-myWhite dark:text-myBlack">My GitHub Contributions</span>
          <div class="flex items-center gap-1">
            <span class="w-3 h-3 rounded-sm bg-[#161b22]"></span>
            <span class="w-3 h-3 rounded-sm bg-[#0e4429]"></span>
            <span class="w-3 h-3 rounded-sm bg-[#006d32]"></span>
            <span class="w-3 h-3 rounded-sm bg-[#26a641]"></span>
            <span class="w-3 h-3 rounded-sm bg-[#39d353]"></span>
            <span class="ml-2 text-myWhite dark:text-myBlack">Less → More</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  //
};
</script>
