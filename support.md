---
title: Support SpawnLoft
description: SpawnLoft is free and open source, and always will be. If it earns its place on your PC, here is how to help it keep going.
sidebar: false
aside: false
head:
  - - meta
    - name: robots
      content: noindex
---

<script setup>
// The GitHub Sponsors link is already used in the footer and FAQ; fill in Ko-fi once that account exists. An empty string
// hides the button, so no dead link is ever shown. Then remove the `head` block above to let
// search engines index this page, and add the page to the footer.
const links = {
  githubSponsors: 'https://github.com/sponsors/joogiebear',
  kofi: '',
}
const live = Object.values(links).some(Boolean)
</script>

# Support SpawnLoft

SpawnLoft is free. The app, every feature in it and every update stay free, and the code is [open source under the MIT licence](https://github.com/joogiebear/spawnloft). Nothing is locked behind a payment, now or later.

If it has saved you time or kept a world safe, you can help it keep going. Supporting is never required and never changes what the app does.

## What it pays for

- Time to fix bugs and answer questions, which is most of the work.
- The Apple and Windows code-signing costs, so your system can confirm an installer came from SpawnLoft.
- Test machines for all three platforms, so each release is installed and exercised on a real Windows, Mac and Linux system.

<p v-if="live" class="support-links">
  <Button v-if="links.githubSponsors" :href="links.githubSponsors" external>Sponsor on GitHub</Button>
  <Button v-if="links.kofi" :href="links.kofi" variant="secondary" external>Buy a coffee on Ko-fi</Button>
</p>

<p v-else><em>Supporting is not open yet. This page will link to it when it is.</em></p>

## Other ways to help

These cost nothing, and they matter just as much.

- **Star the project** on [GitHub](https://github.com/joogiebear/spawnloft). It helps other people find it.
- **Tell a friend** who runs a server, or share a [guide](/guide/) that helped you.
- **Report what broke.** **Feedback → Something broke** in the panel opens an issue with the details filled in.
- **Contribute.** Docs fixes and code are welcome in the [repository](https://github.com/joogiebear/spawnloft).

## What supporters get

Thanks, mainly. Planned for supporters, and none of it gating a feature: a credits page and a thread for [roadmap](/roadmap) ideas.

SpawnLoft is an independent project. It is not an official Minecraft product and is not approved by or associated with Mojang or Microsoft.
