---
name: toolbox-scan
description: Scan this Mac's Claude Code setup (plugins, skills, MCP servers, connectors) and refresh the Claude Ecosystem Toolbox. Use when asked to scan, refresh, or update the toolbox, or after installing or creating a plugin, skill or MCP server.
---

# Toolbox scan (Claude Code side)

Goal: write `scans/code.json`, merge it into `toolbox.json`, show what is new, and wait for approval before committing.

## Rules
- Read-only. Do not change settings, plugins, skills or credentials.
- Names and one-line purposes only. Never copy tokens, keys or file contents into a scan file.
- Never edit `overrides.json` or hand-written entries in `toolbox.json`. Only `node merge.mjs` changes `toolbox.json`.

## Steps
1. List what Claude Code can see, using its own commands where they exist:
   - installed plugins and their bundled MCP servers
   - every skill available, noting plugin-bundled skills separately
   - every MCP server and connector, noting account connectors versus local config
   - local skill folders: `~/.agents/skills/` (with `~/.agents/.skill-lock.json`) and `~/.claude/skills/`
2. Write `scans/code.json`:
   ```json
   {"source":"code","scannedAt":"YYYY-MM-DD","items":[{"name":"...","type":"skill|local-skill|plugin|plugin-skill|connector|mcp|local","use":"one line","platform":"only if known","evidence":"why it is known"}]}
   ```
   - Skills bundled inside a plugin use type `plugin-skill` (the merge ignores them); the plugin itself is one `plugin` item.
   - Leave `platform` out unless a description or file states where it runs. Seen-by-both-scans is handled by the merge.
3. Run `node merge.mjs` and report: how many tools matched, how many are NEW, what is "not seen".
4. List the NEW tools with the platform the merge guessed. Ask Wesley which group each belongs in, and whether any guess is wrong (wrong guesses go in `overrides.json`).
5. After he approves: commit with a message like `toolbox: scan YYYY-MM-DD (+N new)` and push. Netlify deploys from the repo.

## Chat side
`scans/chat.json` comes from a chat session (skill `toolbox-scan-chat`), because Claude Code cannot see account-level skills or plugins. If it is missing or older than the code scan, say so.
