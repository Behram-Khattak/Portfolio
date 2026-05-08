<script setup>
import ContributionGraph from "./ContributionGraph.vue";
import TerminalView from "./TerminalView.vue";
import InfoText from "./InfoText.vue";

defineProps({
  //
});
</script>

<template>
  <section class="pb-8 WhoAmI" id="whoAmI">
    <div
      class="container mx-auto mb-8 space-y-8 xl:justify-between xl:items-center xl:flex"
    >
      <!-- Info Text -->
      <InfoText />
      <!-- Terminal view -->
      <TerminalView />
    </div>
  </section>
</template>

<script>
export default {
  //
};
</script>
