<script setup lang="ts">
import HomeCompat from '../sections/HomeCompat.vue'
import HomeDevelopers from '../sections/HomeDevelopers.vue'
import HomeDownload from '../sections/HomeDownload.vue'
import HomeHero from '../sections/HomeHero.vue'
import HomeLimits from '../sections/HomeLimits.vue'
import HomePrinciples from '../sections/HomePrinciples.vue'
import HomeTour from '../sections/HomeTour.vue'
// The home page is the sections in order. Each section owns its own copy and layout.
</script>

<template>
  <main class="home">
    <HomeHero />
    <HomeCompat />
    <HomePrinciples />
    <HomeTour />
    <HomeDevelopers />
    <HomeLimits />
    <HomeDownload />
  </main>
</template>
