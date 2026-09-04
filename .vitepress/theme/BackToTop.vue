<script setup lang="ts">
// One floating button, bottom right, on every width. It appears once the header has scrolled a
// screen away and goes back to the top on a click; the local nav's own "Return to top" is hidden
// in custom.css so there is one of these, not two.
import { onMounted, onUnmounted, ref } from 'vue'

const shown = ref(false)
let ticking = false

function check() {
  ticking = false
  shown.value = window.scrollY > 480
}
function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(check)
}
function toTop() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  check()
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <button class="to-top" :class="{ shown }" type="button" aria-label="Return to top" title="Return to top" :tabindex="shown ? 0 : -1" @click="toTop">
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 13V3M3.5 7.5 8 3l4.5 4.5"/></svg>
  </button>
</template>

<style scoped>
.to-top {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: var(--vp-z-index-local-nav);
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--edge);
  background: var(--raised);
  color: var(--ink);
  box-shadow: var(--lift), 0 10px 30px rgba(0, 0, 0, .45);
  cursor: pointer;
  opacity: 0;
  transform: translateY(12px);
  pointer-events: none;
  transition: opacity .25s ease, transform .25s ease, border-color .15s;
}
.to-top.shown { opacity: 1; transform: none; pointer-events: auto; }
.to-top:hover { border-color: var(--lapis); color: var(--lapis); }
.to-top:focus-visible { outline: 2px solid var(--lapis); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { .to-top { transition: none; } }
</style>
