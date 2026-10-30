<script setup lang="ts">
import { computed } from 'vue'
// Terminal text stays terminal text: a dark well on both surfaces. Lines starting with "$ " are
// prompts and lines starting with "# " are comments; everything else is output.
const props = defineProps<{ code: string; label?: string }>()
const lines = computed(() => props.code.replace(/^\n+|\n+$/g, '').split('\n').map(line => {
  if (line.startsWith('$ ')) return { kind: 'prompt', text: line.slice(2) }
  if (line.startsWith('# ')) return { kind: 'comment', text: line }
  return { kind: 'out', text: line }
}))
</script>

<template>
  <div class="code">
    <div v-if="label" class="code-label">{{ label }}</div>
    <pre tabindex="0"><code><template v-for="(line, index) in lines" :key="index"><span :class="line.kind"><b v-if="line.kind === 'prompt'">$ </b>{{ line.text }}</span>{{ index < lines.length - 1 ? '\n' : '' }}</template></code></pre>
  </div>
</template>

<style scoped>
.code { border: 1px solid var(--well-line); border-radius: var(--r1); background: var(--well); color: var(--well-fg); overflow: hidden; }
.code-label { padding: var(--s2) var(--s4); border-bottom: 1px solid var(--well-line); font: 500 var(--t-caption)/1.5 var(--mono); letter-spacing: .08em; text-transform: uppercase; color: var(--well-fg-2); }
pre { margin: 0; padding: var(--s4); font: 400 var(--t-code)/1.65 var(--mono); overflow-x: auto; }
code { font: inherit; background: none; padding: 0; color: inherit; }
.prompt b { color: var(--accent); font-weight: 500; }
.comment { color: var(--well-fg-2); }
.out { opacity: .85; }
</style>
