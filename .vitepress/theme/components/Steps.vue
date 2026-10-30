<script setup lang="ts">
// A numbered list, for things that happen in order. Numbers appear nowhere else.
</script>

<template>
  <ol class="steps"><slot /></ol>
</template>

<style scoped>
.steps { list-style: none; margin: 0; padding: 0; display: grid; counter-reset: step; }
</style>
