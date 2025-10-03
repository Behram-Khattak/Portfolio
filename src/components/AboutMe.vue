<script setup>
import { ref } from "vue";
import cnLogo from "@/assets/images/CN-logo.png";
import sscLogo from "@/assets/images/ssc-logo.png";
import ipsLogo from "@/assets/images/ips-logo.webp";
import ExperienceCard from "@/components/ExperienceCard.vue";

const works = ref([
  {
    id: 1,
    name: "Creative Networks",
    logo: cnLogo,
    designation: "Web Engineer | Contract",
    timeline: "March 2025 - September 2025",
    summary:
      "Managed client communications and project management tasks, also developed websites & web applications using Laravel and WordPress, ensuring optimal performance and user experience.",
    link: "https://www.creative-n.com/",
    type: "left",
  },
  {
    id: 2,
    name: "Safe Solutions Consultants",
    logo: sscLogo,
    designation: "Backend Engineer | Contract",
    timeline: "January 2024 - October 2024",
    summary:
      "Developed and maintained backend services using Laravel & PHP, enhancing application functionality and performance.",
    link: "https://safesolutionsconsultants.com/",
    type: "right",
  },
  {
    id: 3,
    name: "iPlexSoft",
    logo: ipsLogo,
    designation: "Full Stack Web Developer | Contract",
    timeline: "June 2023 - December 2023",
    summary:
      "Developed and deployed CRM and ERP systems using Laravel and Vue.js, improving business operations and client management.",
    link: "https://safesolutionsconsultants.com/",
    type: "left",
  },
]);
</script>

<template>
  <section class="work">
    <div
      class="pb-8 text-2xl font-bold text-center capitalize sm:text-4xl text-myWhite dark:text-myBlack"
    >
      <h1>
        Work
        <span
          class="underline decoration-wavy decoration-indigo-500 underline-offset-4"
          >Experience with firms</span
        >
      </h1>
    </div>
    <!--  -->
    <div
      class="container flex flex-col items-center justify-center py-16 mx-auto space-y-5"
      id="aboutMe"
    >
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <ExperienceCard
          v-for="work in works"
          :key="work.id"
          :name="work.name"
          :designation="work.designation"
          :logo="work.logo"
          :timeline="work.timeline"
          :summary="work.summary"
        />
      </div>
    </div>
  </section>
</template>
