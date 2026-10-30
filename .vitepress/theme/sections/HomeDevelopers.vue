<script setup lang="ts">
import ArrowLink from '../components/ArrowLink.vue'
import Card from '../components/Card.vue'
import CodeBlock from '../components/CodeBlock.vue'
import SectionHead from '../components/SectionHead.vue'

const tools = [
  { eyebrow: 'Command line', title: 'Script everything.', body: 'Create, start, snapshot and clone from a shell, with JSON and CSV out for the rest of your tooling.', code: '$ spawnloft create weekend --paper 1.21.10\n$ spawnloft start weekend\n$ spawnloft clone weekend scratch --port 25566\n$ spawnloft status --json', link: ['The command reference', '/reference/commands'] },
  { eyebrow: 'MCP server', title: 'Let an assistant do the checking.', body: 'Claude Desktop, Claude Code or any MCP app can read the console, explain a crash and take a backup. Passwords never leave the machine.', code: '{ "mcpServers": {\n    "spawnloft": {\n      "command": "spawnloft",\n      "args": ["mcp"]\n} } }', link: ['Set up an assistant', '/guide/ai-assistants'] },
  { eyebrow: 'Launcher · 1.6 beta', title: 'Join your own server in one click.', body: 'Sign in with your Microsoft account, pick any Minecraft version, and launch straight into the server you are running. Built for testing, not for mods.', code: '# Play\nAccount    Wunga_\nVersion    1.21.10 · Paper-compatible\nJoin       Weekend World (running)\n$ Play', link: ['What the beta includes', '/guide/beta#automatic-updates-and-beta-builds'] },
]
</script>

<template>
  <section class="section band" id="dev">
    <div class="wrap">
      <SectionHead eyebrow="For the people writing the plugin" title="Also a developer's tool.">
        <template #aside><p class="lede aside">The same engine runs from a terminal, from an AI assistant, and now from a launcher built for testing against your own server.</p></template>
      </SectionHead>
      <div class="grid grid-3 cards">
        <Card v-for="tool in tools" :key="tool.eyebrow" :eyebrow="tool.eyebrow" :title="tool.title" v-reveal>
          <p>{{ tool.body }}</p>
          <CodeBlock :code="tool.code" />
          <ArrowLink :href="tool.link[1]">{{ tool.link[0] }}</ArrowLink>
        </Card>
      </div>
    </div>
  </section>
</template>

<style scoped>
.band { background: var(--bg-1); }
.aside { max-width: 26em; font-size: var(--t-body); }
.cards { margin-top: var(--s7); }
.cards :deep(.card) { background: var(--bg); }
.cards :deep(.card-body) { display: grid; gap: var(--s4); }
.cards :deep(.card-body p) { margin: 0; }
</style>
