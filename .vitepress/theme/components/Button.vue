<script setup lang="ts">
// The one button. Primary is the only lime fill on a view; on paper the --cta tokens flip it to ink.
withDefaults(defineProps<{
  href?: string
  variant?: 'primary' | 'secondary' | 'quiet'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit'
  disabled?: boolean
  external?: boolean
}>(), { variant: 'primary', size: 'md', type: 'button', disabled: false, external: false })
</script>

<template>
  <!-- Two elements rather than one dynamic `component`: `:is="'button'"` would resolve to this
       globally registered Button and render it inside itself without end. -->
  <a v-if="href" class="btn" :class="[`btn-${variant}`, `btn-${size}`]" :href="href" :rel="external ? 'noopener' : undefined" :aria-disabled="disabled || undefined" :tabindex="disabled ? -1 : undefined">
    <slot name="icon" /><span class="label"><slot /></span><slot name="trailing" />
  </a>
  <button v-else class="btn" :class="[`btn-${variant}`, `btn-${size}`]" :type="type" :aria-disabled="disabled || undefined" :tabindex="disabled ? -1 : undefined">
    <slot name="icon" /><span class="label"><slot /></span><slot name="trailing" />
  </button>
</template>

<style scoped>
.btn { display: inline-flex; align-items: center; justify-content: center; gap: var(--s3); min-height: 44px; padding: 0 var(--s5); border: 1px solid transparent; border-radius: var(--r0); font: 600 var(--t-ui)/1 var(--text); white-space: nowrap; cursor: pointer; text-decoration: none; background: none; color: inherit; transition: background var(--d1) var(--ease), color var(--d1) var(--ease), border-color var(--d1) var(--ease), transform var(--d1) var(--ease); }
.btn :deep(svg) { width: 16px; height: 16px; flex: none; }
.btn-primary { background: var(--cta); color: var(--cta-fg); border-color: var(--cta); }
.btn-primary:hover { background: var(--cta-hover); border-color: var(--cta-hover); }
.btn-secondary { border-color: var(--line-strong); color: var(--fg); }
.btn-secondary:hover { border-color: var(--fg); }
.btn-quiet { color: var(--fg); padding-inline: var(--s2); }
.btn-quiet:hover { color: var(--accent-text); }
.btn-lg { min-height: 52px; padding-inline: var(--s6); font-size: var(--t-body); }
.btn-sm { min-height: 36px; padding-inline: var(--s4); font-size: var(--t-small); }
.btn:active { transform: translateY(1px); }
.btn[aria-disabled="true"] { opacity: .45; pointer-events: none; }
</style>
