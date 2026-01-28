import { Type } from "@sinclair/typebox";
import type { ClawdbotPluginApi } from "clawdbot/plugin-sdk";
import { emptyPluginConfigSchema } from "clawdbot/plugin-sdk";

function socketPath(): string | undefined {
  const raw = process.env.ROBOT_BRIDGE_SOCKET?.trim();
  return raw && raw.length > 0 ? raw : undefined;
}

const plugin = {
  id: "robot-bridge",
  name: "Robot bridge",
  description: "Stub tools for on-robot gateway integration (hardware bridge TBD).",
  configSchema: emptyPluginConfigSchema(),
  register(api: ClawdbotPluginApi) {
    api.registerTool({
      name: "robot_status",
      label: "Robot status",
      description: "Returns stub telemetry JSON for the robot bridge.",
      parameters: Type.Object({}, { additionalProperties: false }),
      execute: async () => {
        const sock = socketPath();
        const payload = sock
          ? { ok: true, mode: "stub", socket: sock }
          : { ok: false, error: "robot_bridge_unconfigured" };
        return { content: [{ type: "text", text: JSON.stringify(payload, null, 2) }] };
      },
    });

    api.registerTool({
      name: "robot_drive",
      label: "Robot drive",
      description: "Stub motion command (no motors).",
      parameters: Type.Object(
        {
          vx: Type.Optional(Type.Number()),
          wz: Type.Optional(Type.Number()),
        },
        { additionalProperties: false },
      ),
      execute: async (_id, params: { vx?: number; wz?: number }) => {
        if (!socketPath()) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({ ok: false, error: "robot_bridge_unconfigured" }),
              },
            ],
          };
        }
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                ok: true,
                mode: "stub",
                cmd: { vx: params.vx ?? 0, wz: params.wz ?? 0 },
              }),
            },
          ],
        };
      },
    });
  },
};

export default plugin;
