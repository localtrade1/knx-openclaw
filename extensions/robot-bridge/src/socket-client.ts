/**
 * Placeholder for a Unix-socket client to the on-robot bridge daemon.
 * Real implementation would connect to ROBOT_BRIDGE_SOCKET and exchange framed JSON.
 */

export function bridgeSocketPath(): string | undefined {
  const raw = process.env.ROBOT_BRIDGE_SOCKET?.trim();
  return raw && raw.length > 0 ? raw : undefined;
}

export function describeBridgeEndpoint(): { configured: boolean; path?: string } {
  const path = bridgeSocketPath();
  return path ? { configured: true, path } : { configured: false };
}
