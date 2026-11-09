# Comic temporary tunnel connection

The initial tunnel rewrote Host to localhost:5174. Browser Origin remained the public domain, so the backend correctly rejected the WebSocket with403. An Origin-free Node probe missed this failure.

Use `cloudflared tunnel --url http://127.0.0.1:5174 --no-autoupdate` with the Comic Vite `.trycloudflare.com` host allowlist. Preserve the backend's existing Origin comparison.

Verified replacement: https://greatest-curious-trainers-hampshire.trycloudflare.com/.

- Public page returns200.
- WebSocket with matching public Origin opens; unrelated `https://invalid.example` returns403.
- Actual Ego browser TaskSpace28 shows “เชื่อมต่อแล้ว”; filling a player name enables room creation. No room created. Space closed after verification.
- Vite config reloaded successfully; `git diff --check` passed. No UI layout or gameplay logic changed, so shared screenshot suites were not repeated.

Old Host-rewriting tunnel PID40156 stopped; replacement PID40320 remains running. The temporary URL depends on that process and the local frontend/backend staying available.
