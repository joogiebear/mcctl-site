<script setup lang="ts">
import { ref } from 'vue'
import Download from '../Download.vue'
import BrandIcon from '../BrandIcon.vue'
const downloads = ref<HTMLDialogElement>()
const demo = ref<HTMLDialogElement>()
const video = ref<HTMLVideoElement>()
function openDownloads() { downloads.value?.showModal() }
function openDemo() { demo.value?.showModal() }
function closeDemo() { video.value?.pause() }
function backdrop(event: MouseEvent, dialog?: HTMLDialogElement) {
  if (event.target !== dialog || !dialog) return
  const bounds = dialog.getBoundingClientRect()
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close()
}
defineExpose({ openDownloads, openDemo })
</script>
<template>
  <dialog ref="downloads" class="home-dialog download-dialog" aria-labelledby="download-title" @click="backdrop($event, downloads)">
    <div class="dialog-heading"><div><span class="home-eyebrow">YOUR NEXT WORLD STARTS HERE</span><h2 id="download-title">Download SpawnLoft</h2><p>Choose the installer for your computer.</p></div><button type="button" autofocus class="dialog-close" aria-label="Close downloads" @click="downloads?.close()"><BrandIcon name="close" /></button></div>
    <Download fine />
    <a href="https://github.com/joogiebear/spawnloft/releases/latest" class="dialog-release">View all files on GitHub</a>
  </dialog>
  <dialog ref="demo" class="home-dialog demo-dialog" aria-labelledby="home-demo-title" @close="closeDemo" @click="backdrop($event, demo)">
    <div class="dialog-heading"><div><span class="home-eyebrow">THE ACTUAL APP, IN ACTION</span><h2 id="home-demo-title">From setup to your first world.</h2></div><button type="button" autofocus class="dialog-close" aria-label="Close demo" @click="demo?.close()"><BrandIcon name="close" /></button></div>
    <video ref="video" controls playsinline preload="none" poster="/demo/poster.webp" width="1280" height="800" aria-label="SpawnLoft demo: create a server, press Start, install a plugin, and take a backup."><source src="/demo/demo.webm" type="video/webm"><source src="/demo/demo.mp4" type="video/mp4"><track kind="captions" src="/demo/captions.vtt" srclang="en" label="English" default></video>
    <p class="demo-caption">A recording of the real app. Waiting times have been sped up.</p>
  </dialog>
</template>
