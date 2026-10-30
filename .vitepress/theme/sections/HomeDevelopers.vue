<script setup lang="ts">
import ArrowLink from '../components/ArrowLink.vue'
import Card from '../components/Card.vue'
import CodeBlock from '../components/CodeBlock.vue'
import SectionHead from '../components/SectionHead.vue'

const tools = [
  { eyebrow: 'Command line', title: 'Script everything.', body: 'Create, start, snapshot and clone from a shell, with JSON and CSV out for the rest of your tooling.', code: '$ spawnloft create weekend --paper 1.21.10\n$ spawnloft start weekend\n$ spawnloft clone weekend scratch --port 25566\n$ spawnloft status --json', link: ['The command reference', '/reference/commands'] },
  { eyebrow: 'MCP server', title: 'Let an assistant do the checking.', body: 'Claude Desktop, Claude Code or any MCP app can read the console, explain a crash and take a backup, once the CLI is set up. Passwords never leave the machine.', code: '{ "mcpServers": {\n    "spawnloft": {\n      "command": "spawnloft",\n      "args": ["mcp"]\n} } }', link: ['Set up an assistant', '/guide/ai-assistants'] },
  { eyebrow: 'Scheduled work', title: 'Backups while you sleep.', body: 'Nightly snapshots, a verify pass that reads them back, a restart with a countdown. Tasks run on the system scheduler, not inside the app, so a closed window changes nothing.', code: '$ spawnloft task add weekend --do backup --daily 03:00\n$ spawnloft task add weekend --do verify --weekly SUN --at 04:00\n$ spawnloft task list', link: ['Scheduled work in the reference', '/reference/commands#scheduled-work'] },
]
</script>

<template>
  <section class="section band" id="dev">
    <div class="wrap">
      <SectionHead eyebrow="For the people writing the plugin" title="Also a developer's tool.">
        <template #aside><p class="lede aside">The same engine runs from a terminal, from an AI assistant, and on a schedule you set once.</p></template>
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
