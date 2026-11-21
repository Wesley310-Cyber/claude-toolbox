# Claude Ecosystem Toolbox

A visual map of every skill, plugin, connector and local tool, tagged **Chat**, **Code** or **Both**, plus a project planner. Static site: `index.html` reads `toolbox.json` and `overrides.json`.

## Files
| File | What it is |
|---|---|
| `index.html` | The viewer (map + planner). No build step. |
| `toolbox.json` | The data. Groups, tools, projects. Edited by hand or by `merge.mjs`. |
| `overrides.json` | Your label corrections. Never overwritten by a refresh. |
| `scans/code.json`, `scans/chat.json` | Scanner output (see contract below). |
| `merge.mjs` | Merges scans into `toolbox.json`. New tools are tagged NEW. |
| `CLAUDE.md` | Instructions for the Claude Code session that runs the scan. |
| `CODE-TEST-PROMPT.md` | One-time test: what can Claude Code see? (already run) |
| `.claude/skills/toolbox-scan/` | The Claude Code scanner skill. Say "scan the toolbox". |

## Refresh loop (the "living" part)
1. Claude Code scans your Mac and writes `scans/code.json`.
2. A chat session lists account skills, plugins, connectors and writes `scans/chat.json` (optional but gives better labels).
3. `node merge.mjs`
4. Review the NEW items, move them into the right group, then commit and push. Netlify redeploys.

Seen by both scans means it is installed in both, so an unconfirmed label is upgraded to Both. Seen by only one scan gets a best-guess label. Skills bundled inside a plugin are not listed one by one.

## Scan file contract
```json
{ "source": "code" | "chat", "scannedAt": "YYYY-MM-DD",
  "items": [ { "name": "hallmark", "type": "skill|local-skill|plugin|connector|mcp|local",
               "platform": "chat|code|both   (optional)", "use": "one line (optional)", "evidence": "why the platform is known (optional)" } ] }
```

## Run locally
`npx serve .` then open the address it prints. (Opening index.html as a file will not load the JSON.)

## Deploy
Netlify from this GitHub repo, no build command, publish directory `.`. Deploy a private/draft version first; go public only at launch.

## Correcting a label
Add to `overrides.json`: `"venture::spin-analysis": {"platform":"both","confirmed":true}`. Key = `<groupId>::<tool name>`.
