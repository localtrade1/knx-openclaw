# robot-bridge

Workspace extension for **on-robot gateway** experiments.

## What this is (and is not)

- **Implemented today:** a Clawdbot **plugin** that registers two agent tools: `robot_status` and `robot_drive`. They are **not** MCP servers; they use the normal plugin `registerTool` API (`index.ts`).
- **Not in this folder:** a full MCP implementation. You can still attach **external MCP servers** (same as upstream: separate processes, config, or helpers like `mcporter`) and map them to cameras / HAL on your side.
- **Future:** a **bridge daemon** on the robot listening on `ROBOT_BRIDGE_SOCKET` (Unix socket). The stub tools are placeholders until that exists.

## Docs

- **[BRIDGE_SURFACE.md](./BRIDGE_SURFACE.md)** — design-style catalog of **commands** (cameras, arm joints, gripper, base motors, estop): names, params, and how they relate to the stub tools.

## Config

Set `ROBOT_BRIDGE_SOCKET` to a Unix socket path when a bridge daemon is available; until then the tools return `robot_bridge_unconfigured` or stub JSON.
