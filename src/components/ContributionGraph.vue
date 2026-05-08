<template>
  <div class="p-4 border border-gray-600 shadow-lg sm:p-6 rounded-2xl">
    <h2 class="mb-4 font-bold sm:text-xl text-myWhite dark:text-myBlack">
      My Contribution Graph
    </h2>
    <div class="overflow-x-auto">
      <img
        src="https://ghchart.rshah.org/behram-khattak"
        alt="GitHub Contributions Graph"
        class="p-2 border border-gray-700 rounded-md w-[60em]"
      />
    </div>
    <div class="flex items-center justify-between mt-3 text-xs sm:text-sm">
      <span class="text-myWhite dark:text-myBlack"
        >My GitHub Contributions</span
      >
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
</template>
