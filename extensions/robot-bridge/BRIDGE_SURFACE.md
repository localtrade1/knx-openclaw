# Robot bridge — target command surface

This file describes a **design contract** for a future on-robot **bridge daemon** that listens on `ROBOT_BRIDGE_SOCKET` (Unix domain socket or stream). It is **not** fully implemented by the stub plugin today.

**What exists in code right now**

- The **Clawdbot plugin** registers two gateway tools: `robot_status` and `robot_drive`. They do not speak MCP; they are normal agent tools.
- **MCP** in this ecosystem is usually **external** (separate processes, e.g. via `mcporter` / your own MCP servers) or wired through upstream gateway config—not a second copy inside `robot-bridge/`.

**How this document maps to integration**

- Option A: Bridge implements the JSON lines below over the socket; the plugin’s future `execute` paths forward to the bridge.
- Option B: You expose the same operations as **MCP tools** in a small MCP server that wraps your ROS2 / vendor SDK / GPIO layer; the agent then calls MCP tools instead of (or in addition to) these plugin tools.

All motion and power commands assume a **hardware estop** and site safety rules **outside** the LLM.

---

## Envelope (sketch)

One JSON object per line (NDJSON) or framed messages—pick one in the real bridge.

```json
{
  "id": "req-uuid",
  "method": "namespace.action",
  "params": {}
}
```

```json
{
  "id": "req-uuid",
  "ok": true,
  "result": {}
}
```

```json
{
  "id": "req-uuid",
  "ok": false,
  "error": { "code": "ESTOP", "message": "..." }
}
```

---

## Cameras (`camera.*`)

| Method | Params (summary) | Result / notes |
|--------|-------------------|----------------|
| `camera.list` | — | `{ "devices": [ { "id": "cam0", "label": "...", "role": "front" } ] }` |
| `camera.capture` | `{ "device": "cam0", "resolution"?: "1280x720", "format"?: "jpeg" }` | `{ "frame_id", "mime", "bytes_base64" }` or path to shared memory—define in bridge |
| `camera.stream.subscribe` | `{ "device": "cam0", "fps"?: 15 }` | `{ "handle": "stream-1" }` — push frames to agent pipeline separately |
| `camera.stream.unsubscribe` | `{ "handle": "stream-1" }` | ack |
| `camera.exposure` | `{ "device": "cam0", "mode": "auto" \| "manual", "ev"?: number }` | ack |
| `camera.ptz` | `{ "device": "cam0", "pan_deg"?: number, "tilt_deg"?: number, "zoom"?: number }` | only if hardware supports PTZ |

Use these for **grounding**: still frames for reasoning, or a throttled stream for monitoring—never trust the model to “see” without your own latency and privacy policy.

---

## Manipulator — arm / joints (`arm.*`)

Assume joint indices `0..N-1` or named joints; the bridge maps to your URDF / driver.

| Method | Params (summary) | Result / notes |
|--------|-------------------|----------------|
| `arm.get_state` | `{ "include_gripper"?: true }` | `{ "joints": [{ "name", "position_rad", "velocity_rad_s", "effort_nm" }], "fk": { ... } }` |
| `arm.move_joint` | `{ "joint": 3, "target_rad": 1.57, "max_velocity"?: 0.5 }` | planned move; may be async |
| `arm.move_joints` | `{ "targets": [{ "joint": 0, "rad": 0 }, ...], "time_s"?: 2.0 }` | synchronized trajectory stub |
| `arm.stop` | `{ "smooth"?: true }` | halt arm motion |
| `arm.gripper` | `{ "open_mm"?: 0, "force_n"?: 40 }` | parallel jaw / vacuum as your hardware defines |
| `arm.preset` | `{ "name": "home" \| "stow" \| "inspect_left" }` | optional named poses |

---

## Base / drive / motors (`base.*`)

| Method | Params (summary) | Result / notes |
|--------|-------------------|----------------|
| `base.drive` | `{ "vx_m_s": 0.2, "wz_rad_s": 0.0 }` | differential drive; matches stub `robot_drive` semantics |
| `base.stop` | — | zero commanded velocities |
| `base.estop` | `{ "reason": "operator" }` | **must** cut motion at controller; not reversible from software alone |
| `base.odometry` | — | `{ "x", "y", "theta", "vx", "wz" }` in your frame |
| `base.motor_raw` | `{ "id": "left_wheel", "pwm"?: number, "torque_nm"?: number }` | **escape hatch**—use only behind policy; prefer `base.drive` |

---

## Stub plugin mapping (today)

| Gateway tool | Rough bridge equivalent |
|--------------|-------------------------|
| `robot_status` | aggregate of `base.odometry`, `arm.get_state`, `camera.list` (or a single `robot.telemetry` method you define) |
| `robot_drive` | `base.drive` with `vx` / `wz` |

Extend the plugin when the bridge speaks a stable subset of the methods above.
