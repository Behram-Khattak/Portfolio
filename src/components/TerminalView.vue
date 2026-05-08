<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const currentTime = ref("");

const updateTime = () => {
  const now = new Date();
  // Formats to: May 8, 17:05:09 (or your preferred style)
  currentTime.value =
    now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }) +
    " " +
    now.toLocaleTimeString("en-GB");
};

let timer;
onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<template>
  <div
    class="flex w-full max-w-5xl transition-all duration-500 border border-gray-800 shadow-2xl shadow-indigo-500/10 rounded-2xl bg-myBlack/80 backdrop-blur-sm dark:shadow-indigo-500/50"
  >
    <div
      class="overflow-hidden font-mono border border-gray-800 rounded-2xl bg-myBlack"
    >
      <div
        class="flex items-center justify-between px-5 py-3 bg-[#2c343f] border-b border-gray-700"
      >
        <div class="flex gap-2">
          <div class="w-3.5 h-3.5 rounded-full bg-[#ff5f56]"></div>
          <div class="w-3.5 h-3.5 rounded-full bg-[#ffbd2e]"></div>
          <div class="w-3.5 h-3.5 rounded-full bg-[#27c93f]"></div>
        </div>
        <span class="text-xs text-gray-400 tracking-[0.2em] font-semibold"
          >ssh — behram@workspace</span
        >
        <div class="text-[12px] text-gray-400 font-medium tracking-wider hidden sm:block">
          {{ currentTime }}
        </div>
      </div>

      <div class="p-8 text-sm sm:text-lg leading-relaxed text-[#f8f8ff]">
        <div class="mb-8">
          <div class="flex gap-2 text-green-400">
            <span class="shrink-0">[root@portfolio ~]#</span>
            <span class="text-myWhite">whoami</span>
          </div>
          <p
            class="pl-4 mt-2 italic leading-relaxed text-gray-400 border-l-2 border-gray-700"
          >
            "I'm Behram Khattak, a Web Software Engineer passionate about
            building large-scale web apps and optimizing Linux infrastructure
            for high-performance Cloud Computing."
          </p>
        </div>

        <div class="mb-8">
          <div class="flex gap-2 text-green-400">
            <span class="shrink-0">[root@portfolio ~]#</span>
            <span class="text-myWhite">ls -la skills/</span>
          </div>
          <div
            class="grid grid-cols-1 mt-4 ml-2 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-8"
          >
            <div class="text-base text-blue-400">
              drwxr-xr-x <span class="text-myWhite">Laravel</span>
            </div>
            <div class="text-base text-blue-400">
              drwxr-xr-x <span class="text-myWhite">Vue.js</span>
            </div>
            <div class="text-base text-blue-400">
              drwxr-xr-x <span class="text-myWhite">PHP_8.3</span>
            </div>
            <div class="text-base text-blue-400">
              drwxr-xr-x <span class="text-myWhite">MySQL/PG</span>
            </div>
            <div class="text-base text-blue-400">
              drwxr-xr-x <span class="text-myWhite">Linux/Ubuntu</span>
            </div>
            <div class="text-base text-blue-400">
              drwxr-xr-x <span class="text-myWhite">Docker_Cloud</span>
            </div>
            <div class="text-base text-blue-400">
              drwxr-xr-x <span class="text-myWhite">Nginx/Proxy</span>
            </div>
            <div class="text-base text-blue-400">
              drwxr-xr-x <span class="text-myWhite">Next.js/TS</span>
            </div>
            <div class="text-base text-blue-400">
              drwxr-xr-x <span class="text-myWhite">Redis/Caching</span>
            </div>
          </div>
        </div>

        <div class="mb-8">
          <div class="flex gap-2 text-green-400">
            <span class="shrink-0">[root@portfolio ~]#</span>
            <span class="text-myWhite">ps aux --socials</span>
          </div>

          <div class="mt-4 overflow-x-auto">
            <table class="w-full font-mono text-left">
              <thead>
                <tr
                  class="text-myBlack bg-indigo-500 text-[10px] sm:text-xs uppercase font-bold"
                >
                  <th class="px-2 py-1">USER</th>
                  <th class="px-2 py-1">PID</th>
                  <th class="px-2 py-1">%CPU</th>
                  <th class="px-2 py-1">COMMAND</th>
                  <th class="px-2 py-1">STATUS</th>
                </tr>
              </thead>
              <tbody class="text-xs sm:text-sm md:text-base">
                <tr
                  class="transition-colors border-b border-gray-800/50 hover:bg-gray-800/30 group"
                >
                  <td class="px-2 py-3 text-gray-500">behram</td>
                  <td class="px-2 py-3 text-indigo-400">1024</td>
                  <td class="px-2 py-3 text-green-500">0.0</td>
                  <td class="px-2 py-3">
                    <a
                      href="https://github.com/Behram-Khattak"
                      target="_blank"
                      class="transition-colors text-myWhite group-hover:text-indigo-400"
                    >
                      /usr/bin/github --user
                      <span class="underline">Behram-Khattak</span>
                    </a>
                  </td>
                  <td class="px-2 py-3">
                    <span class="text-green-500 animate-pulse">●</span> Active
                  </td>
                </tr>

                <tr
                  class="transition-colors border-b border-gray-800/50 hover:bg-gray-800/30 group"
                >
                  <td class="px-2 py-3 text-gray-500">behram</td>
                  <td class="px-2 py-3 text-indigo-400">2048</td>
                  <td class="px-2 py-3 text-green-500">0.0</td>
                  <td class="px-2 py-3">
                    <a
                      href="https://www.linkedin.com/in/behramkttk"
                      target="_blank"
                      class="transition-colors text-myWhite group-hover:text-indigo-400"
                    >
                      /usr/bin/linkedin --id
                      <span class="underline">behramkttk</span>
                    </a>
                  </td>
                  <td class="px-2 py-3">
                    <span class="text-green-500 animate-pulse">●</span> Active
                  </td>
                </tr>

                <tr
                  class="transition-colors border-b border-gray-800/50 hover:bg-gray-800/30 group"
                >
                  <td class="px-2 py-3 text-gray-500">behram</td>
                  <td class="px-2 py-3 text-indigo-400">4096</td>
                  <td class="px-2 py-3 text-green-500">2.4</td>
                  <td class="px-2 py-3">
                    <a
                      href="https://www.youtube.com/@codewithbehram"
                      target="_blank"
                      class="transition-colors text-myWhite group-hover:text-red-400"
                    >
                      /usr/bin/youtube --stream
                      <span class="underline">codewithbehram</span>
                    </a>
                  </td>
                  <td class="px-2 py-3">
                    <span class="text-blue-400">▶</span> Streaming
                  </td>
                </tr>

                <tr class="transition-colors hover:bg-gray-800/30 group">
                  <td class="px-2 py-3 text-gray-500">behram</td>
                  <td class="px-2 py-3 text-indigo-400">8192</td>
                  <td class="px-2 py-3 text-green-500">0.0</td>
                  <td class="px-2 py-3">
                    <a
                      href="https://twitter.com/behramkttk"
                      target="_blank"
                      class="transition-colors text-myWhite group-hover:text-indigo-400"
                    >
                      /usr/bin/twitter --at
                      <span class="underline">behramkttk</span>
                    </a>
                  </td>
                  <td class="px-2 py-3">
                    <span class="text-green-500 animate-pulse">●</span> Active
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-green-400">[root@portfolio ~]#</span>
          <span class="w-3 h-6 bg-blue-500 animate-blink"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.animate-blink {
  animation: blink 1s step-end infinite;
  display: inline-block;
  vertical-align: middle;
}
</style>
