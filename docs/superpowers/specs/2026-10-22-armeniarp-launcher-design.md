# ArmeniaRP Launcher Design Specification

**Date:** 2026-10-22
**Status:** Approved design direction; implementation follows after written-spec review.

## Goal

Build a Windows desktop launcher for the ArmeniaRP SA-MP/open.mp server with a premium modern UI, server status, player count, news, nickname, game launch entry point, and a foundation for automatic client updates.

## Target User and Success Criteria

The primary user is an ArmeniaRP player on Windows. The launcher should make it immediately clear whether the server is online, how many players are online, what is new, and how to start the game. The first release should be a clean, maintainable foundation rather than a fake fully connected production backend.

## Product Scope

### v1.0

- Premium dark launcher interface with ArmeniaRP branding.
- Responsive desktop layout suitable for Windows launcher dimensions.
- Server Online/Offline indicator.
- Online player count.
- Play button.
- Nickname field and local persistence.
- News cards with API-ready data model and safe local fallback.
- Client/launcher version display.
- Settings entry point.
- API configuration isolated from UI code.
- Tauri 2 Windows desktop packaging foundation.
- GitHub Actions workflow for Windows build verification.

### Future releases

- v1.1: automatic updater using version manifest, downloads, progress and SHA-256 verification.
- v1.2: account registration/login, player profile, character data, balance and level.
- v1.3: Discord/Telegram links, game settings and GTA/SA-MP directory auto-detection.

## Technical Architecture

- Desktop shell: Tauri 2.
- Native layer: Rust.
- Frontend: Vanilla TypeScript, HTML and CSS.
- Backend API contract: PHP + MySQL can be added independently later.
- No frontend framework in v1.0.
- The server IP/port and executable path must be configurable rather than hard-coded throughout the UI.

## Proposed Project Structure

```text
ArmeniaRP-Launcher/
├── src/
│   ├── index.html
│   ├── styles.css
│   ├── main.ts
│   └── assets/
├── src-tauri/
│   ├── src/
│   │   └── lib.rs
│   ├── capabilities/
│   ├── tauri.conf.json
│   └── Cargo.toml
├── tests/
├── docs/
│   └── superpowers/
│       ├── specs/
│       └── plans/
├── .github/workflows/build.yml
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
└── README.md
```

## Interfaces

### Server status

`GET /api/server/status`

Expected JSON shape:

```json
{
  "online": true,
  "players": 123,
  "maxPlayers": 1000,
  "version": "1.0.0"
}
```

The frontend must tolerate an unavailable API and render an explicit Offline/Unavailable state instead of crashing.

### News

`GET /api/news`

Expected JSON shape:

```json
[
  {
    "id": 1,
    "title": "Server news",
    "summary": "Short news summary",
    "date": "2026-10-22",
    "url": "https://example.com/news/1"
  }
]
```

A small local fallback dataset is permitted for development/demo mode.

### Game launch

The Rust layer exposes a controlled Tauri command for launching the configured game executable. The command must validate that the configured executable path exists before attempting to start it. Server host and port are passed from configuration, not duplicated across UI handlers.

For v1.0, if the real ArmeniaRP executable and server endpoint are not yet supplied, the launcher must present a clear configuration-required state rather than pretending the game was launched.

## UI Direction

- Dark premium base.
- Armenia-inspired blue/red/orange accent treatment used sparingly.
- Strong typography and clear hierarchy.
- Large Play CTA.
- Compact server-status panel.
- News section.
- Subtle gradients, borders, shadows and motion; no excessive animation.
- No bundled copyrighted GTA artwork unless supplied/licensed by the project owner. Use an original abstract background/branding treatment in the source repository.

## Configuration

The application must keep environment-specific values isolated. At minimum:

- API base URL.
- ArmeniaRP server host.
- ArmeniaRP server port.
- Game executable path or selected game directory.
- Launcher version.

Production server values remain placeholders until the owner provides them.

## Security and Reliability

- Do not execute arbitrary shell commands from frontend input.
- Validate executable paths in Rust before launching.
- Do not store passwords or authentication tokens in v1.0.
- Network failures must degrade to a visible unavailable/offline state.
- External links should be opened through controlled Tauri APIs.

## Testing and Verification

- TypeScript logic should have focused unit tests for status parsing, configuration validation and fallback behavior.
- Rust should have unit coverage for executable-path validation and launch argument construction where practical.
- CI must run frontend checks and a Windows-oriented Tauri build/check workflow.
- No feature is considered complete solely because the source files were committed; build/test output must be checked before claiming completion.

## Out of Scope for v1.0

- Real user authentication.
- Payments.
- Automatic game patching implementation.
- Server-side PHP/MySQL implementation.
- Real Discord OAuth.
- Anti-cheat implementation.
- Hard-coded production server credentials.

## Open Production Inputs

The following values are intentionally deferred until ArmeniaRP server infrastructure is available:

1. Production API URL.
2. Production server IP/hostname.
3. Production server port.
4. Exact GTA/SA-MP/open.mp executable and launch arguments.
5. Official ArmeniaRP logo/artwork if a supplied asset should replace the original placeholder branding.
