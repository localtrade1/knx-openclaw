#!/usr/bin/env bash
# Quick check that the gateway HTTP/control port answers after boot.
set -euo pipefail
HOST="${1:-127.0.0.1}"
PORT="${2:-18789}"
if command -v curl >/dev/null 2>&1; then
  curl -fsS --max-time 3 "http://${HOST}:${PORT}/" >/dev/null && exit 0
fi
if command -v nc >/dev/null 2>&1; then
  nc -z -w 2 "${HOST}" "${PORT}" && exit 0
fi
echo "Need curl or nc to probe ${HOST}:${PORT}" >&2
exit 1
