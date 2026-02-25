# Robot deploy snippets

- `systemd/clawdbot-gateway-robot.service` — run gateway on boot.
- `clawdbot.env.example` — copy to `/etc/clawdbot/robot.env`.
- `clawdbot.json5.example` — merge into `~/.clawdbot/clawdbot.json` (adjust `plugins.load.paths` to your checkout).
- `docker-compose.robot.yml` — optional container run with host networking.
