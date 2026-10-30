<script setup lang="ts">
// Reading styles for text that arrives as HTML (release notes, roadmap entries) or as a slot.
</script>

<template>
  <div class="prose"><slot /></div>
</template>

<style>
.prose { color: var(--fg-2); font-size: var(--t-body); line-height: 1.65; max-width: 40em; }
.prose > :first-child { margin-top: 0; }
.prose > :last-child { margin-bottom: 0; }
.prose h2, .prose h3, .prose h4 { color: var(--fg); font-family: var(--display); font-weight: 600; letter-spacing: -.02em; margin: var(--s6) 0 var(--s3); }
.prose h2 { font-size: var(--t-h3); line-height: 1.25; }
.prose h3 { font-size: var(--t-h4); line-height: 1.3; }
.prose h4 { font-size: var(--t-body); line-height: 1.4; }
.prose p, .prose ul, .prose ol { margin: 0 0 var(--s4); }
.prose ul, .prose ol { padding-left: 1.3em; }
.prose li { margin: var(--s1) 0; }
.prose li::marker { color: var(--fg-3); }
.prose strong { color: var(--fg); font-weight: 600; }
.prose a { color: var(--accent-text); text-decoration: underline; text-underline-offset: 4px; text-decoration-thickness: 1px; }
.prose a:hover { text-decoration-thickness: 2px; }
.prose code { font-family: var(--mono); font-size: .86em; color: var(--fg); background: var(--bg-2); padding: 1px 5px; border-radius: 3px; }
.prose pre { margin: 0 0 var(--s4); padding: var(--s4); border: 1px solid var(--well-line); border-radius: var(--r1); background: var(--well); color: var(--well-fg); font: 400 var(--t-code)/1.65 var(--mono); overflow-x: auto; }
.prose pre code { background: none; padding: 0; color: inherit; font-size: inherit; }
.prose blockquote { margin: 0 0 var(--s4); padding: var(--s1) var(--s4); border-left: 3px solid var(--line-strong); color: var(--fg-3); }
.prose hr { border: 0; border-top: 1px solid var(--line); margin: var(--s6) 0; }
.prose table { width: 100%; border-collapse: collapse; font-size: var(--t-small); margin: 0 0 var(--s4); }
.prose th { text-align: left; font: 500 var(--t-caption)/1.5 var(--mono); letter-spacing: .1em; text-transform: uppercase; color: var(--fg-3); padding: var(--s2) var(--s3) var(--s2) 0; border-bottom: 1px solid var(--line-strong); }
.prose td { padding: var(--s3) var(--s3) var(--s3) 0; border-bottom: 1px solid var(--line); vertical-align: top; }
.prose td:first-child { color: var(--fg); }
.prose img { max-width: 100%; height: auto; border: 1px solid var(--line); border-radius: var(--r1); }
</style>
