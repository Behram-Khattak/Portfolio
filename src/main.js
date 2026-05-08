import "./assets/main.css";
import "vue3-carousel/carousel.css";
//
import { createApp } from "vue";
import App from "./App.vue";
/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import solid and brands icons */
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

/* add icons to the library */
library.add(fas, fab);

createApp(App).component("font-awesome-icon", FontAwesomeIcon).mount("#app");

// var themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
// var themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");

// // Change the icons inside the button based on previous settings
// if (
//   localStorage.getItem("color-theme") === "dark" ||
//   (!("color-theme" in localStorage) &&
//     window.matchMedia("(prefers-color-scheme: dark)").matches)
// ) {
//   themeToggleLightIcon.classList.remove("hidden");
// } else {
//   themeToggleDarkIcon.classList.remove("hidden");
// }

// var themeToggleBtn = document.getElementById("theme-toggle");

// themeToggleBtn.addEventListener("click", function () {
//   // toggle icons inside button
//   themeToggleDarkIcon.classList.toggle("hidden");
//   themeToggleLightIcon.classList.toggle("hidden");

//   // if set via local storage previously
//   if (localStorage.getItem("color-theme")) {
//     if (localStorage.getItem("color-theme") === "light") {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("color-theme", "dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("color-theme", "light");
//     }

//     // if NOT set via local storage previously
//   } else {
//     if (document.documentElement.classList.contains("dark")) {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("color-theme", "light");
//     } else {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("color-theme", "dark");
//     }
//   }
// });

const themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
const themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");
const themeToggleBtn = document.getElementById("theme-toggle");

// Helper to sync icons with the current state of the <html> class
function syncIcons() {
  if (document.documentElement.classList.contains("dark")) {
    themeToggleLightIcon.classList.remove("hidden");
    themeToggleDarkIcon.classList.add("hidden");
  } else {
    themeToggleLightIcon.classList.add("hidden");
    themeToggleDarkIcon.classList.remove("hidden");
  }
}

// Initial icon sync on load
syncIcons();

themeToggleBtn.addEventListener("click", function () {
  // Toggle the class on the document
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("color-theme", "light");
  } else {
    document.documentElement.classList.add("dark");
    localStorage.setItem("color-theme", "dark");
  }
  syncIcons();
});

// WATCH FOR SYSTEM CHANGES (The "Auto" support)
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    // Only auto-switch if the user has NOT manually set a preference
    if (!localStorage.getItem("color-theme")) {
      if (e.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      syncIcons();
    }
  });
