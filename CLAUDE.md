# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Game

No build step required. Serve statically and open in a browser:

```bash
python3 -m http.server 8000
# Open http://localhost:8000
```

Alternatively, open `index.html` directly (note: some browsers restrict `localStorage` for `file://` URLs).

There are no linting tools, test suites, or CI pipelines — testing is manual in the browser.

## Debugging

- Open browser DevTools for runtime inspection.
- Type `angimylove` in the menu to unlock all levels for the current session (not persisted).
- Type `exit` in the menu to disable that mode.
- Reset all saved progress: `localStorage.removeItem('sj_v2_data')` in the browser console.

## Architecture

Pure HTML5/Canvas/Web Audio project with no dependencies and no build tooling.

**File loading order matters:** `levels.js` must be loaded before `game.js` because `game.js` references the global `LEVELS` array defined in `levels.js`.

### Core Files

- [index.html](index.html): Canvas element, HUD, menu/win/lose overlays, touch joystick containers. Scripts are included at the bottom.
- [game.js](game.js): The entire game engine as a single `SchattenJaeger` class (instantiated once on DOMContentLoaded). Contains the state machine, input handling, rendering, audio synthesis, physics, enemy AI, combo system, and localStorage persistence.
- [levels.js](levels.js): A single exported global `LEVELS` array of 50 level config objects.
- [styles.css](styles.css): Dark theme, HUD layout, menus, touch joystick styling.

### State Machine

```
MENU → PLAYING → WIN → (next level or back to MENU)
              ↘ LOSE → (retry or back to MENU)
```

Key methods: `startLevel()`, `win()`, `lose()`, `showMenu()`, `retry()`.

### Game Loop (60 FPS)

`loop()` calls `update()` then `draw()` each frame via `requestAnimationFrame`.

- `update()`: Reads input state, moves player and enemies, runs pillar behaviors, checks shadow kills, evaluates win/lose conditions, updates HUD DOM elements.
- `draw()`: Clears canvas, renders shadow polygon, pillar, enemies (with combo glows), particles, light effects, and player.

### Shadow Kill System

`getShadowPoly()` computes a quadrilateral from tangent lines on the pillar relative to the player's light position. Enemies inside this polygon (and within `shadowKillRadius` if set) are killed. In KOOP mode the light angle is controlled independently by the second player.

### Combo System

Enemies close to each other are grouped into `comboGroups` via `findOrCreateComboGroup()`. Killing a group of size N scores `10 * 2^(N-1)` points and triggers proportionally stronger screen shake, particle effects, and glows.

### Pillar Behaviors

Defined per-level in the `pillarBehavior` field as space-separated flags: `moving`, `shrinking`, `pulsating`. Multiple behaviors compose (e.g., `"moving pulsating"`).

### Mission Types

- `score`: Reach a target point value.
- `survival`: Survive for N seconds.
- `pacifist`: Survive N seconds; instant loss if kill count exceeds `maxScore`.

### Persistence

`localStorage` key `sj_v2_data` stores `{ unlockedLevel: N, bests: { levelId: bestScore } }`. On load, `restoreProgressFromBests()` recalculates `unlockedLevel` from `bests` to fix any data corruption.

## Adding a New Level

Add an entry to the `LEVELS` array in [levels.js](levels.js). The game unlocks levels sequentially — no other code changes required. Key fields:

```javascript
{
  id,           // 1–50
  name,
  targetType,   // 'score' | 'survival' | 'pacifist'
  targetValue,
  pillarRadius,
  pillarBehavior, // e.g. 'static', 'moving pulsating shrinking'
  shadowKillRadius, // null = unlimited
  enemySpeedStart, enemySpeedMax, spawnRateStart, spawnRateMax,
  acceleration,
  lightBehavior,  // 'stable' | 'flickering'
  maxScore        // only for pacifist
}
```
