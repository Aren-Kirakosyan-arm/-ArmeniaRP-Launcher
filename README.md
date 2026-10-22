# ArmeniaRP Launcher

Windows desktop launcher for ArmeniaRP, built with Tauri 2, Rust and Vanilla TypeScript.

## Current v0.1 foundation

- Premium dark ArmeniaRP interface
- Online/offline server state
- Player count and latency
- Nickname persistence
- News API with local fallback
- Settings modal
- Safe executable-path validation in Rust
- Updater manifest/version-comparison foundation
- Windows CI and Tauri packaging workflow

## Local setup

Install Node.js 20+, Rust stable, Microsoft C++ Build Tools and WebView2 on Windows.

```bash
npm install
npm run dev
```

For a Windows desktop build:

```bash
npm run tauri build
```

## Production configuration

Update `src/config.ts` with the real API URL and server host/port. The launcher intentionally ships with placeholders until ArmeniaRP infrastructure is provided.

Expected API endpoints:

- `GET /api/server/status`
- `GET /api/news`

## Game launch

Open Settings and select the real game executable. The Rust backend rejects relative paths, missing files, non-`.exe` files and empty nicknames before launching.

The exact GTA/SA-MP/open.mp executable and command-line arguments still need to be confirmed for production.

## Roadmap

- v0.2: real server API
- v0.3: automatic updater downloads + SHA-256 verification
- v0.4: authentication/profile
- v0.5: game directory detection and social links
