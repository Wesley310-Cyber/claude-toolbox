# Claude Ecosystem Toolbox: instructions for Claude Code

Purpose: keep `toolbox.json` current with everything Wesley has installed, so he can see what works in Claude chat, Claude Code, or both.

## Rules
- Read-only scan of config. Never change settings, plugins or credentials.
- Do not edit hand-curated entries in `toolbox.json` or anything in `overrides.json`. Only `merge.mjs` adds or flags entries.
- Never put secrets, tokens or file contents from `~/.claude` into scan files. Names and short descriptions only.
- Wesley is a visual learner with no design vocabulary: when asked for visual changes, show options to react to.
- Deploy a private/draft site first; public only at launch.

## Task: scan (Code side)
Use the `toolbox-scan` skill in `.claude/skills/toolbox-scan/`. Summary:
Write `scans/code.json` following the contract in README.md. Sources to read:
- `~/.claude/` (settings, installed plugins, skills, MCP config), project `.claude/` folders
- `~/.agents/skills/` and `~/.agents/.skill-lock.json`
- Output of Claude Code's own plugin, skill and MCP list commands
Set `platform` only when there is evidence (e.g. a plugin description says "Claude Code"); put the reason in `evidence`.
Then run `node merge.mjs`, show Wesley the NEW items, and wait for him to approve before committing.

## What the first test showed (Nov 21, 2026)
- Claude Code sees account connectors, so connector labels can be confirmed.
- Claude Code does not see account-level skills or plugins, and cannot tell which folder an unprefixed skill came from. A chat scan is still needed for those.

## Open items
- Chat-side scan: `scans/chat.json` is written from a chat session (skill `toolbox-scan-chat`).
- A Claude Whiteboard step for per-project planning from `toolbox.json` is planned.
- Move NEW tools out of the "New ..." groups into the right groups.
