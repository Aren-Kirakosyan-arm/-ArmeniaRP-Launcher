# ArmeniaRP Launcher v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Windows-ready ArmeniaRP launcher with a premium Armenian-themed UI, server status, news, nickname, game launch configuration, and a foundation for future automatic updates.

**Architecture:** Tauri 2 hosts a Vanilla TypeScript frontend and Rust backend. The frontend owns presentation and HTTP API integration; Rust owns safe native Windows operations such as launching the configured game executable. Server-specific values are isolated in configuration so the launcher can be connected to the real ArmeniaRP backend later.

**Tech Stack:** Tauri 2, Rust, TypeScript, HTML5, CSS3, Vitest for frontend unit tests, GitHub Actions for CI/build.

**Spec:** `docs/superpowers/specs/2026-10-22-armeniarp-launcher-design.md`

## Global Constraints

- Windows is the primary target.
- No frontend framework; use Vanilla TypeScript + HTML/CSS.
- No copyrighted GTA assets bundled by default; use original/abstract launcher artwork and SVG branding placeholders.
- Server host/port and executable path must be configurable rather than hard-coded into UI logic.
- Native process launching must validate the configured executable path before starting it.
- API failures must degrade to an Offline/Unavailable UI state without crashing the launcher.

## Review Focus

- Malformed/unreachable server API responses must produce a stable Offline/Unavailable state.
- Missing or invalid game executable paths must be rejected before launch.
- Empty/whitespace nicknames must not be persisted or sent as valid nicknames.
- Mobile/narrow Windows-window sizes must remain usable without clipped controls.
- Missing optional news data must leave the launcher usable.

### Task 1: Project scaffold and configuration

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `src/index.html`
- Create: `src/main.ts`
- Create: `src/styles.css`
- Create: `src/config.ts`
- Create: `src-tauri/Cargo.toml`
- Create: `src-tauri/src/lib.rs`
- Create: `src-tauri/tauri.conf.json`
- Create: `.gitignore`

**Interfaces:**
- `src/config.ts` exports `launcherConfig` containing API base URL, server host/port, client version, and game executable configuration.
- Rust exports Tauri commands `get_launcher_info` and `launch_game(executable_path: String, nickname: String) -> Result<(), String>`.

- [ ] Add the minimal Tauri/Vite project configuration with scripts for development, frontend build, and Tauri CLI.
- [ ] Add a Rust command layer that validates the executable path and rejects empty nicknames before process creation.
- [ ] Add a basic HTML shell that renders the launcher root.
- [ ] Add initial CSS variables/layout for dark navy, gold accents, glass cards, responsive spacing, and accessible focus states.
- [ ] Verify JSON/TOML syntax and run the frontend type/build command once dependencies are installed.
- [ ] Commit: `feat: scaffold ArmeniaRP Tauri launcher`.

### Task 2: Launcher UI and client-side state

**Files:**
- Modify: `src/index.html`
- Modify: `src/main.ts`
- Modify: `src/styles.css`
- Create: `src/ui.ts`
- Create: `src/types.ts`
- Create: `tests/ui-state.test.ts`

**Interfaces:**
- `ServerStatus` has `online: boolean`, `players: number`, `maxPlayers: number`, and optional `latencyMs`.
- `NewsItem` has `id`, `title`, `summary`, `publishedAt`, and optional `imageUrl`.
- `renderServerStatus(status: ServerStatus | null)` updates the status indicator, player count, and latency text.
- `validateNickname(value: string): string | null` returns a normalized nickname or `null` when invalid.

- [ ] Write tests for valid/invalid nicknames and online/offline status rendering data.
- [ ] Run the focused tests and confirm the new tests fail before implementation.
- [ ] Implement the state types and pure UI helpers.
- [ ] Build the full home screen: logo, server card, online players, nickname field, Play button, news cards, client version, and settings entry.
- [ ] Make the layout responsive for narrow windows and keyboard-accessible.
- [ ] Run focused tests and frontend build; expected result is zero test failures and successful compilation.
- [ ] Commit: `feat: build ArmeniaRP launcher interface`.

### Task 3: Server API integration

**Files:**
- Create: `src/api.ts`
- Modify: `src/main.ts`
- Modify: `src/config.ts`
- Modify: `tests/api.test.ts`

**Interfaces:**
- `fetchServerStatus(): Promise<ServerStatus>` reads `GET /api/server/status`.
- `fetchNews(): Promise<NewsItem[]>` reads `GET /api/news`.
- Both functions use a timeout and throw a typed/normalized API error on invalid JSON, HTTP errors, or network failure.

- [ ] Write tests for successful status/news responses and malformed/unreachable responses.
- [ ] Run focused tests and confirm failure before implementation.
- [ ] Implement fetch helpers with response validation and timeout handling.
- [ ] Connect startup refresh and a manual refresh path to the UI.
- [ ] Confirm API failure leaves the launcher usable and shows Offline/Unavailable rather than crashing.
- [ ] Run all frontend tests and build.
- [ ] Commit: `feat: connect ArmeniaRP server API`.

### Task 4: Game launch and settings flow

**Files:**
- Modify: `src/main.ts`
- Modify: `src/index.html`
- Modify: `src-tauri/src/lib.rs`
- Create: `src/settings.ts`
- Create: `tests/settings.test.ts`

**Interfaces:**
- `loadSettings(): LauncherSettings` reads persisted nickname and executable path.
- `saveSettings(settings: LauncherSettings): void` persists validated settings.
- `launchGame(settings: LauncherSettings): Promise<void>` invokes the Tauri command only after client-side validation.

- [ ] Write tests for empty nickname, whitespace nickname, missing executable path, and valid settings.
- [ ] Run focused tests and confirm failure before implementation.
- [ ] Implement settings persistence and validation.
- [ ] Add settings modal with nickname and game executable selection/configuration.
- [ ] Connect Play to the Rust command and display actionable launch errors.
- [ ] Run all frontend tests and type/build checks.
- [ ] Commit: `feat: add game launch and settings`.

### Task 5: Updater foundation and CI

**Files:**
- Create: `version.json.example`
- Create: `src/updater.ts`
- Create: `tests/updater.test.ts`
- Create: `.github/workflows/build.yml`
- Modify: `README.md`

**Interfaces:**
- `UpdateManifest` contains `version`, `url`, `sha256`, and `size`.
- `compareVersions(current: string, remote: string): number` returns -1/0/1 for semantic version ordering.
- `validateManifest(manifest: unknown): UpdateManifest` rejects incomplete/invalid manifests.

- [ ] Write tests for equal/newer/older versions and invalid update manifests.
- [ ] Run focused tests and confirm failure before implementation.
- [ ] Implement manifest validation and version comparison without downloading files yet.
- [ ] Add GitHub Actions for Windows dependency installation, frontend tests, type checking, and Tauri build.
- [ ] Document local Windows prerequisites and real server configuration in README.
- [ ] Run the available local checks; CI configuration must be syntactically valid.
- [ ] Commit: `feat: add updater foundation and Windows CI`.

### Task 6: Final verification and release branch

**Files:**
- Modify only files required by verification fixes.

- [ ] Run the complete frontend test suite.
- [ ] Run TypeScript type checking and production build.
- [ ] Run Rust formatting/checks where the environment supports them.
- [ ] Inspect the resulting diff against the design spec and this plan.
- [ ] Verify that no GTA copyrighted assets, secrets, or local paths are committed.
- [ ] Push the verified implementation branch and open a pull request into `main`.
- [ ] Record remaining integration requirements: real ArmeniaRP API URL, server IP/port, and GTA/SA-MP/open.mp executable strategy.
