// The one list of docs pages: grouped by what someone is trying to do. The sidebar (config.mts) and
// the docs index (theme/pages/DocsIndex.vue) both read it, so a new guide is added in one place.
export interface DocLink { text: string; desc: string; link: string }
export interface DocGroup { label: string; title: string; items: DocLink[] }

export const docGroups: DocGroup[] = [
  { label: 'Start here', title: 'Get up and running.', items: [
    { text: 'Getting started', desc: 'Install the app, check Java, and start a server.', link: '/guide/getting-started' },
    { text: 'Windows, Mac or Linux', desc: 'What differs on each system.', link: '/guide/run-a-server-on-your-pc' },
    { text: 'Downloads and platforms', desc: 'Installers and what each supports.', link: '/guide/beta' },
    { text: 'The desktop app', desc: 'Updates, data folders, and life outside the window.', link: '/guide/desktop' },
    { text: 'The panel', desc: 'Your console, plugins, worlds and backups.', link: '/guide/panel' },
    { text: 'Server software', desc: 'The loaders, and which one loads what.', link: '/reference/servers' },
  ] },
  { label: 'Run a server', title: 'Play with people.', items: [
    { text: 'Host for friends', desc: 'From the first start to a server that looks after itself.', link: '/guide/host-for-friends' },
    { text: 'Play on your home network', desc: 'Friends on the same Wi-Fi, with no router changes.', link: '/guide/play-on-your-network' },
    { text: 'Sharing your server', desc: 'How friends join, and what to switch on first.', link: '/guide/sharing' },
    { text: 'Whitelist and operators', desc: 'Control who joins and who can run commands.', link: '/guide/whitelist-and-operators' },
    { text: 'Customize your server', desc: 'MOTD, icon, difficulty, game mode and player limits.', link: '/guide/customize-your-server' },
    { text: 'Bring your world or server', desc: 'Import a map, or take over a server you already run.', link: '/guide/bring-your-world' },
  ] },
  { label: 'Keep it healthy', title: 'Look after it.', items: [
    { text: 'Backups', desc: 'Snapshots, schedules, verification and restore.', link: '/guide/backups' },
    { text: 'Schedule restarts and backups', desc: 'Nightly backups and restarts that warn players.', link: '/guide/schedule-restarts-and-backups' },
    { text: 'Restart after a crash', desc: 'Relaunch after a crash, with a loop limit.', link: '/guide/crash-recovery' },
    { text: 'Discord crash alerts', desc: 'Get a message when a server crashes.', link: '/guide/discord-alerts' },
    { text: 'How much RAM it needs', desc: 'Memory starting points, and how to tell it is enough.', link: '/guide/how-much-ram' },
    { text: 'Fix a laggy server', desc: 'Read TPS and memory, then change one thing at a time.', link: '/guide/fix-a-laggy-server' },
    { text: 'Recover a damaged world', desc: 'Restore a snapshot, in the right order.', link: '/guide/recover-a-damaged-world' },
  ] },
  { label: 'Plugins, mods and updates', title: 'Change what it runs.', items: [
    { text: 'Paper, Fabric or NeoForge', desc: 'Pick the software by what you want to do.', link: '/guide/choose-software' },
    { text: 'Plugins and mods', desc: 'Install, update and manage what your server loads.', link: '/guide/plugins' },
    { text: 'Fabric or NeoForge with mods', desc: 'Create a modded server and add mods safely.', link: '/guide/run-a-fabric-or-neoforge-server' },
    { text: 'Run a modpack', desc: 'A whole modded server from one Modrinth pack.', link: '/guide/modpack-server' },
    { text: 'Try things safely', desc: 'Test a plugin or an update on a copy first.', link: '/guide/try-it-safely' },
    { text: 'Update Minecraft safely', desc: 'Check, rehearse on a clone, then upgrade.', link: '/guide/update-minecraft-version' },
    { text: 'Databases', desc: 'Managed setup, connection details, and manual plugin configs.', link: '/guide/databases' },
    { text: 'Add a database', desc: 'MySQL or Redis for a plugin, with one click.', link: '/guide/add-a-database' },
  ] },
  { label: 'Tools and automation', title: 'Do it your way.', items: [
    { text: 'The game launcher', desc: 'Play on your own server from a window.', link: '/guide/launcher' },
    { text: 'AI assistants', desc: 'Let an AI app you choose check on and run your servers.', link: '/guide/ai-assistants' },
    { text: 'Connect an AI assistant', desc: 'Set up MCP, and know what leaves your PC.', link: '/guide/connect-an-ai-assistant' },
    { text: 'Command line basics', desc: 'The few commands most people use.', link: '/guide/command-line-basics' },
    { text: 'Command reference', desc: 'Commands, structured JSON, and performance exports.', link: '/reference/commands' },
  ] },
  { label: 'Get help', title: 'Understand it, fix it.', items: [
    { text: 'Troubleshooting', desc: 'Recognise the error. Find the next step.', link: '/guide/troubleshooting' },
    { text: 'Ask for help', desc: 'What to collect and where to post.', link: '/guide/ask-for-help' },
    { text: 'Questions', desc: 'Straight answers to the things people ask.', link: '/guide/faq' },
    { text: 'Security', desc: 'What stays local, and why.', link: '/guide/security' },
    { text: 'How it works', desc: 'The engine underneath the control room.', link: '/guide/how-it-works' },
    { text: 'Compare', desc: 'SpawnLoft next to Aternos, Pterodactyl and Crafty.', link: '/guide/compare' },
  ] },
]
