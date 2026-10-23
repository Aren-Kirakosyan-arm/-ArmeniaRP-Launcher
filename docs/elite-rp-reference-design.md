# Elite RP Launcher — Reference Redesign

## Goal
Rebuild the launcher to visually match the supplied reference: a premium, minimal desktop game launcher rather than a web page.

## Visual direction
- Dark glassmorphism shell with a large scenic hero area.
- Rounded/beveled outer frame and layered inner panels.
- Narrow left navigation rail.
- Large Elite RP brand lockup in the hero.
- Compact account/status capsule in the top-right.
- Server status card with a prominent gold play action.
- News cards on the right.
- Bottom update/progress panel.
- Armenian UI copy throughout.
- No page scrollbar; the shell fits the desktop viewport.
- Responsive fallback for smaller windows.

## Interaction direction
- Play button is visually dominant.
- Navigation items use active glow/outline states.
- Status indicators use subtle animation.
- Window controls remain visually integrated into the shell.
- The launcher must feel like a native game launcher even though the current frontend is HTML/CSS inside Tauri.

## Important implementation note
The reference image is used as a visual direction only. Its exact copyrighted imagery is not copied. The implementation uses original CSS/SVG-style atmospheric artwork and UI composition so the launcher remains self-contained.
