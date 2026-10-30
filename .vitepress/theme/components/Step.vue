<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <li class="step">
    <div class="step-words">
      <h3 class="step-title">{{ title }}</h3>
      <div class="step-body"><slot /></div>
    </div>
  </li>
</template>

<style scoped>
.step { display: grid; grid-template-columns: 56px minmax(0, 1fr); gap: var(--s4); padding: var(--s5) 0; border-top: 1px solid var(--line); counter-increment: step; }
.step:last-child { border-bottom: 1px solid var(--line); }
.step::before { content: "0" counter(step); font: 400 var(--t-code)/1 var(--mono); color: var(--accent-text); padding-top: 6px; }
.step-title { margin: 0 0 var(--s2); font: 600 var(--t-h4)/1.25 var(--display); letter-spacing: -.02em; }
.step-body { color: var(--fg-2); font-size: var(--t-ui); line-height: 1.55; max-width: 40em; }
.step-body :deep(p) { margin: 0 0 var(--s2); }
.step-body :deep(p:last-child) { margin-bottom: 0; }
@media (max-width: 640px) { .step { grid-template-columns: 40px minmax(0, 1fr); } }
</style>
