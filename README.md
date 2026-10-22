# ArmeniaRP Launcher 🇦🇲

Native Windows launcher for ArmeniaRP with a fully Armenian interface.

## Technology

- C# / .NET 8
- WPF
- Windows x64
- Inno Setup installer
- HTTP API for server status and news

## Included in v0.1

- Premium dark ArmeniaRP UI
- Armenian interface and messages
- Server online/offline status
- Player count
- Nickname persistence
- Game `.exe` selection
- Guarded Play action
- News API integration with safe fallback
- Self-contained Windows x64 publish
- `ArmeniaRP-Launcher-Setup.exe` installer through GitHub Actions

## API

The launcher expects:

- `GET /api/server/status`
- `GET /api/news`

The current API base is `http://localhost:8080` and the game server display is `127.0.0.1:7777`. These are placeholders until the real ArmeniaRP infrastructure is supplied.

## Production game launch

The exact GTA/SA-MP/open.mp executable and command-line format still need to be confirmed. The launcher deliberately asks the player to select an `.exe` instead of pretending a production game path is known.

## Build

GitHub Actions uses Windows, .NET 8 and Inno Setup to create a self-contained x64 launcher and package it as `ArmeniaRP-Launcher-Setup.exe`.

The generated installer is uploaded as the `ArmeniaRP-Launcher-Setup` workflow artifact.

## Roadmap

- v0.2: automatic updater with SHA-256 verification
- v0.3: real ArmeniaRP API and production server configuration
- v0.4: authentication and player profile
- v0.5: GTA/SA-MP/open.mp auto-detection and correct launch arguments
- v0.6: Discord/Telegram integration and launcher settings
