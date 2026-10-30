<script setup lang="ts">
import { computed } from 'vue'
// A capture in a hairline frame with a caption: a bold label, a sentence, and a mono detail on
// the right. With `widths`, the image comes from the responsive set that tools/images/build.mjs
// writes next to the master (<src>-<width>.avif and .webp), so a phone never downloads a 2558px file.
const props = withDefaults(defineProps<{
  src?: string
  alt?: string
  width?: number
  height?: number
  widths?: number[]
  sizes?: string
  label?: string
  caption?: string
  detail?: string
  loading?: 'lazy' | 'eager'
  priority?: boolean
}>(), { alt: '', sizes: '(min-width: 1400px) 1360px, 100vw', loading: 'lazy', priority: false })
const sorted = computed(() => [...(props.widths ?? [])].sort((a, b) => a - b))
const srcset = (format: string) => sorted.value.map(w => `${props.src}-${w}.${format} ${w}w`).join(', ')
const fallback = computed(() => sorted.value.length ? `${props.src}-${sorted.value[sorted.value.length - 1]}.webp` : props.src)
</script>

<template>
  <figure class="figure">
    <div class="frame">
      <slot>
        <picture v-if="sorted.length">
          <source type="image/avif" :srcset="srcset('avif')" :sizes="sizes" />
          <source type="image/webp" :srcset="srcset('webp')" :sizes="sizes" />
          <img :src="fallback" :alt="alt" :width="width" :height="height" :loading="priority ? 'eager' : loading" :fetchpriority="priority ? 'high' : undefined" decoding="async" />
        </picture>
        <img v-else-if="src" :src="src" :alt="alt" :width="width" :height="height" :loading="priority ? 'eager' : loading" decoding="async" />
      </slot>
    </div>
    <figcaption v-if="label || caption || detail || $slots.caption">
      <span class="words"><b v-if="label">{{ label }}</b><template v-if="label && caption"> · </template><slot name="caption">{{ caption }}</slot></span>
      <span v-if="detail" class="detail">{{ detail }}</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.figure { margin: 0; min-width: 0; }
.frame { border: 1px solid var(--line); border-radius: var(--r1); overflow: hidden; background: var(--bg-1); }
.frame :deep(img) { display: block; width: 100%; height: auto; }
figcaption { display: flex; justify-content: space-between; gap: var(--s4); padding-top: var(--s3); font-size: var(--t-small); line-height: 1.5; color: var(--fg-3); }
figcaption b { color: var(--fg); font-weight: 600; }
.detail { flex: none; font-family: var(--mono); font-size: var(--t-caption); padding-top: 2px; }
@media (max-width: 640px) { figcaption { flex-direction: column; gap: var(--s1); } }
</style>
