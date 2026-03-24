# KonnexClaw

**KonnexClaw** is our fork of the [Clawdbot](https://github.com/clawdbot/clawdbot) gateway (OpenClaw-style stack). We use it to run a **local-first AI gateway on a robot**, experiment with **extra MCP (Model Context Protocol) servers** for tools, and prototype **observe → plan → act** loops: the agent can **see through onboard cameras**, reason over streams or frames, and **issue motion and device commands through MCP-backed tools**—while still using the normal messaging channels (Telegram, WebChat, etc.) for operators when that fits your ops model.

> **Scope:** This README describes the **Konnex fork** and the **robot/MCP-oriented** additions. Everything about core channels, models, security, and the full CLI lives in **upstream** docs (linked below).

## What we are exploring

| Direction | What it means here |
|-----------|---------------------|
| **MCP** | Additional tool surfaces beyond the built-in plugin set: connect MCP servers so the same agent can call **standardized tools** (telemetry, skills, vendor APIs) alongside gateway tools. |
| **Robot payload** | Run the **gateway on the robot** (headless Linux), bind on LAN/tailnet, and keep state under a dedicated profile (`OPENCLAW_STATE_DIR` / `CLAWDBOT_STATE_DIR` patterns). |
| **Camera** | Use **node/camera** (where available) or your own capture pipeline; feed context into the agent so decisions are grounded in **what the robot sees**. |
| **Control via MCP** | Expose **drive, arm, or IO** through MCP tools (or a small bridge) so the model does not get raw shell on the motion controller—keep **estop and policy** outside the LLM. |

## What we added in this repository

| Path | Purpose |
|------|---------|
| `extensions/robot-bridge/` | Workspace plugin: stub tools `robot_status` / `robot_drive` (not MCP—normal plugin tools). Target **camera / arm / motor** command names for a future socket bridge: [`extensions/robot-bridge/BRIDGE_SURFACE.md`](extensions/robot-bridge/BRIDGE_SURFACE.md). |
| `deploy/robot/` | **systemd** unit, **env** sample, **docker-compose** slice, example **JSON5** to load the plugin on a headless host. |
| `scripts/robot/` | Install helper and **gateway smoke** script for boot checks. |

Details for copy-paste configs: `deploy/robot/README.md`.

## CLI name

The published binary from upstream is still **`clawdbot`** (see `package.json`). Commands like `clawdbot gateway`, `clawdbot onboard`, and `clawdbot agent` apply unchanged unless we ship a renamed binary in a future release.

## Quick start (from source, this fork)

Runtime: **Node ≥22**. Prefer **pnpm** for builds.

```bash
git clone https://github.com/konnex-world/konnex-openclaw.git
cd konnex-openclaw

pnpm install
pnpm ui:build   # first-time UI deps
pnpm build

pnpm clawdbot onboard --install-daemon
# or: npx / global clawdbot after npm install -g
```

Robot-oriented snippets: see `deploy/robot/` and `scripts/robot/install-openclaw.sh`.

## Safety and operations

- Treat **physical actuation** as high risk: **hardware estop** and your safety policy override the model.
- Do not expose the gateway **Control UI / WebSocket** to the public internet without **TLS**, **token or password auth**, and a reviewed threat model.
- Run `clawdbot doctor` after deploy or image upgrades.

## Upstream documentation (canonical for core product)

KonnexClaw **inherits** the full Clawdbot surface: WhatsApp, Telegram, Slack, Discord, Signal, iMessage, Microsoft Teams, WebChat, extensions, Canvas, nodes, skills, cron, and more.

- **Docs:** [docs.clawd.bot](https://docs.clawd.bot)
- **Getting started:** [Getting started](https://docs.clawd.bot/start/getting-started)
- **Gateway / security:** [Gateway](https://docs.clawd.bot/gateway) · [Security](https://docs.clawd.bot/gateway/security)
- **Upstream README (full detail):** [clawdbot/clawdbot `README.md`](https://github.com/clawdbot/clawdbot/blob/main/README.md)

## License

MIT — see `LICENSE` (same as upstream).

## Credits

**Konnex** fork — robot deployment shell and MCP/robot experiments on top of **Clawdbot**.

Clawdbot was built for **Clawd** 🦞 by [Peter Steinberger](https://steipete.me) and the community. See the [upstream README](https://github.com/clawdbot/clawdbot/blob/main/README.md) for sponsors, contributors, and the full feature list.
