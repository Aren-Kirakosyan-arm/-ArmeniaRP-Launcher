# Elite RP Reference Launcher Implementation Plan

Goal: replace the sidebar/web-style composition with a single-screen Elite RP launcher closely matching the approved reference direction.

Architecture: keep the existing Tauri frontend and plain HTML/CSS. Use a cinematic full-window shell with custom title controls, layered hero scene, Elite RP branding, server card, play CTA, profile, and compact news/update strip.

Constraints: Elite RP branding; Armenian primary UI; no visible scrollbar; desktop launcher feel; preserve existing build structure; usable at 1366x768 and larger.

Tasks:
1. Update the UI contract tests for single-screen shell, Elite RP branding, custom controls, no-scrollbar, server card, play CTA, profile and news/update strip.
2. Replace src/index.html with the reference-style single-screen structure.
3. Replace src/styles-elite-rp.css with cinematic layered styling, angled panels, glass surfaces, gold accents, city/mountain atmosphere and responsive desktop sizing.
4. Run npm test and npm run build, then verify the Windows release workflow succeeds before calling the launcher ready.
