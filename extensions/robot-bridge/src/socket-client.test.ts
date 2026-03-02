import { afterEach, describe, expect, it } from "vitest";

import { bridgeSocketPath, describeBridgeEndpoint } from "./socket-client.js";

describe("robot-bridge socket-client", () => {
  const prev = process.env.ROBOT_BRIDGE_SOCKET;

  afterEach(() => {
    if (prev === undefined) {
      delete process.env.ROBOT_BRIDGE_SOCKET;
    } else {
      process.env.ROBOT_BRIDGE_SOCKET = prev;
    }
  });

  it("returns undefined when env is unset", () => {
    delete process.env.ROBOT_BRIDGE_SOCKET;
    expect(bridgeSocketPath()).toBeUndefined();
    expect(describeBridgeEndpoint().configured).toBe(false);
  });

  it("reads socket path from env", () => {
    process.env.ROBOT_BRIDGE_SOCKET = "/tmp/mock.sock";
    expect(bridgeSocketPath()).toBe("/tmp/mock.sock");
    expect(describeBridgeEndpoint()).toEqual({ configured: true, path: "/tmp/mock.sock" });
  });
});
