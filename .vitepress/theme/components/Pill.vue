<script setup lang="ts">
// A state in a hairline capsule: the dot colour means something, the words say what.
withDefaults(defineProps<{ tone?: 'ok' | 'warn' | 'bad' | 'off' | 'none' }>(), { tone: 'none' })
</script>

<template>
  <span class="pill" :class="tone"><i v-if="tone !== 'none'" aria-hidden="true"></i><slot /></span>
</template>

<style scoped>
.pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border: 1px solid var(--line-strong); border-radius: 999px; font: 500 var(--t-caption)/1.4 var(--mono); letter-spacing: .04em; color: var(--fg-2); white-space: nowrap; }
.pill i { width: 6px; height: 6px; border-radius: 50%; background: var(--fg-3); }
.pill.ok i { background: var(--ok); }
.pill.warn i { background: var(--warn); }
.pill.bad i { background: var(--bad); }
</style>
