#!/usr/bin/env bash
# Install Clawdbot / OpenClaw gateway on a headless Linux robot (ARM64/x64).
# Not idempotent — review paths before production use.

set -euo pipefail

ROBOT_HOME="${ROBOT_HOME:-/opt/clawdbot}"
ROBOT_USER="${ROBOT_USER:-clawdbot}"

echo "Target install root: ${ROBOT_HOME} (user: ${ROBOT_USER})"
echo "Install Node 22+ from your distro or NodeSource, then:"
echo "  npm install -g clawdbot@<version>"
echo "  sudo -u \"${ROBOT_USER}\" clawdbot onboard --non-interactive  # or copy config"
echo "See deploy/robot/ for systemd unit and env sample."
