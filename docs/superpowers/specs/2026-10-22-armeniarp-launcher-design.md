# ArmeniaRP Launcher Design Specification

**Date:** 2026-10-22
**Status:** Approved product direction; architecture revised to C# WPF and Armenian-first UI.

## Goal

Build a Windows desktop launcher for the ArmeniaRP SA-MP/open.mp server with a premium modern Armenian-language interface, server status, player count, news, nickname, game launch entry point, settings, and a foundation for automatic client updates.

## Target User and Success Criteria

The primary user is an ArmeniaRP player on Windows. The launcher should immediately show whether the server is online, how many players are online, what is new, and how to start the game. The interface is Armenian-first: navigation, buttons, status messages, settings, update messages and errors are written in Armenian. The first release is a clean maintainable foundation rather than a fake fully connected production backend.

## Product Scope

### v1.0

- Premium dark ArmeniaRP interface with original branding treatment.
- Armenian-first UI and messages.
- Responsive desktop layout suitable for Windows launcher dimensions.
- Server Online/Offline indicator.
- Online player count.
- Large ԽԱՂԱԼ button.
- Մականուն field and local persistence.
- News cards with API-ready data model and safe local fallback.
- Launcher version display.
- Կարգավորումներ entry point.
- Game directory/executable selection foundation.
- API configuration isolated from UI code.
- Native Windows desktop packaging with C# WPF.
- GitHub Actions workflow for Windows build verification and installer artifacts.

### Future releases

- v1.1: automatic updater using version manifest, downloads, progress and SHA-256 verification.
- v1.2: account registration/login, player profile, character data, balance and level.
- v1.3: Discord/Telegram links, game settings and GTA/SA-MP directory auto-detection.

## Technical Architecture

- Desktop shell: C# .NET 8 WPF.
- UI: XAML with a reusable resource/style layer; WebView2 is optional only where it materially improves a visual component.
- Native functionality: C# services for process launching, filesystem access, HTTP and local settings.
- Backend API contract: PHP + MySQL can be added independently later.
- No Rust and no Tauri.
- No frontend framework is required for v1.0.
- Server IP/port and executable path must be configurable rather than hard-coded throughout the UI.

## Proposed Project Structure

```text
ArmeniaRP-Launcher/
├── src/
│   └── ArmeniaRP.Launcher/
│       ├── App.xaml
│       ├── App.xaml.cs
│       ├── MainWindow.xaml
│       ├── MainWindow.xaml.cs
│       ├── Models/
│       ├── Services/
│       │   ├── ApiService.cs
│       │   ├── GameLauncherService.cs
│       │   ├── SettingsService.cs
│       │   └── UpdateService.cs
│       ├── ViewModels/
│       ├── Views/
│       ├── Resources/
│       │   ├── Colors.xaml
│       │   ├── Styles.xaml
│       │   └── ArmenianText.xaml
│       └── Assets/
├── tests/
│   └── ArmeniaRP.Launcher.Tests/
├── docs/
│   └── superpowers/
│       ├── specs/
│       └── plans/
├── .github/workflows/build.yml
├── ArmeniaRP.Launcher.sln
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

The application must tolerate an unavailable API and display an explicit Armenian offline/unavailable state instead of crashing.

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

The C# service exposes a controlled launch method for the configured game executable. It must validate that the configured executable exists and is an absolute `.exe` path before launching. Server host and port come from configuration rather than duplicated UI handlers.

For v1.0, if the real ArmeniaRP executable and server endpoint are not supplied, the launcher must show a clear Armenian configuration-required message rather than pretending the game launched.

## Armenian UI Direction

Primary UI copy is Armenian. English is not required for v1.0.

Examples:

- ԽԱՂԱԼ
- Սերվերի կարգավիճակ
- ՕՆԼԱՅՆ
- ՕՖԼԱՅՆ
- Խաղացողներ
- Մականուն
- Նորություններ
- Կարգավորումներ
- Խաղի թղթապանակ
- Թարմացումների ստուգում
- Պահպանել
- Փակել
- Կապը սերվերի հետ անհասանելի է
- Խաղի ֆայլը չի գտնվել

Visual direction:

- Dark premium base.
- Armenia-inspired blue/red/orange accents used sparingly.
- Strong Armenian typography using a suitable Armenian Unicode font stack.
- Large Play CTA.
- Compact server-status panel.
- News section.
- Subtle gradients, borders, shadows and motion; no excessive animation.
- No bundled copyrighted GTA artwork unless supplied/licensed by the project owner. Use an original abstract background/branding treatment.

## Configuration

Environment-specific values must be isolated. At minimum:

- API base URL.
- ArmeniaRP server host.
- ArmeniaRP server port.
- Game executable path or selected game directory.
- Launcher version.

Production server values remain placeholders until the owner provides them.

## Security and Reliability

- Do not execute arbitrary shell commands from UI input.
- Validate executable paths before launching.
- Do not store passwords or authentication tokens in v1.0.
- Network failures must degrade to a visible Armenian unavailable/offline state.
- External links must use controlled process/browser APIs.
- Local settings must not contain secrets.

## Testing and Verification

- C# unit tests for server-status parsing, nickname validation, configuration validation, settings serialization and update-version comparison.
- C# tests for executable-path validation and launch argument construction where practical.
- CI must run tests and a Windows publish/build workflow.
- NSIS installer generation must be independent from MSI generation so an MSI failure cannot prevent a working Windows executable/installer artifact from being uploaded.
- No feature is considered complete solely because source files were committed; build/test output must be checked before claiming completion.

## Out of Scope for v1.0

- Real user authentication.
- Payments.
- Automatic game patching implementation.
- Server-side PHP/MySQL implementation.
- Real Discord OAuth.
- Anti-cheat implementation.
- Hard-coded production server credentials.

## Open Production Inputs

The following values remain deferred until ArmeniaRP server infrastructure is available:

1. Production API URL.
2. Production server IP/hostname.
3. Production server port.
4. Exact GTA/SA-MP/open.mp executable and launch arguments.
5. Official ArmeniaRP logo/artwork if supplied assets should replace the original placeholder branding.
