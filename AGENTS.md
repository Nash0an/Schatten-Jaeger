# Repository Guidelines

## Project Structure & Module Organization
This repository is a small browser game with a flat structure. `index.html` boots the app and loads `styles.css`, `levels.js`, and `game.js`. Core gameplay, rendering, input, audio, and state handling live in `game.js` inside the `SchattenJaeger` class. Level definitions are stored in the `LEVELS` array in `levels.js`. Project documentation lives in `docs/` (`ARCHITECTURE.md`, `ROADMAP.md`, `CHANGELOG.md`). Internal notes in `internal/` are not part of the shipped game.

## Build, Test, and Development Commands
There is no build step or package manager in this repository.

- `xdg-open index.html`
  Opens the game directly in a browser for quick manual checks.
- `python3 -m http.server 8000`
  Runs a local static server from the repo root; use this when browser security or local storage behavior makes `file://` testing unreliable.
- `git status`
  Review pending changes before committing.

## Coding Style & Naming Conventions
Use 4-space indentation across JavaScript and CSS. Follow the existing plain ES6 style without external frameworks or bundlers. Keep gameplay logic in `game.js`; do not split files unless the change clearly improves maintainability. Use `camelCase` for variables, methods, and object fields, `UPPER_SNAKE_CASE` only for true constants, and keep DOM ids/classes descriptive (for example `main-start-btn`, `level-select`). Preserve the existing mix of English code identifiers and German player-facing text.

## Testing Guidelines
There is currently no automated test suite. Validate changes manually in a browser on desktop and, for input changes, on a touch device or responsive emulator. At minimum, test menu flow, one score level, one survival level, and save-data behavior in `localStorage`. When editing level data, verify unlock progression and mission targets still behave correctly.

## Commit & Pull Request Guidelines
Recent history uses short imperative subjects such as `Fix mobile joystick controls` and `Erstelle weitere Combo Bepunktung`. Keep commit messages concise, imperative, and focused on one change. For pull requests, include: a short summary, affected gameplay areas, manual test notes, and screenshots or short clips for visible UI changes. Link related docs or issues when level balance or architecture is affected.

## Documentation & Contributor Notes
Update `docs/ARCHITECTURE.md` or `PROJECT_STATUS.md` when changing core mechanics, level count, or major systems. If you touch progression, controls, or multiplayer behavior, add a brief note to `docs/CHANGELOG.md`.
