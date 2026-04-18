# Quick Context

## Projekt in einem Satz
`Schatten-Jäger` ist ein Canvas-Spiel mit klassischem Hauptspiel, Ring-Modi und dem Parkour-Zweig `Panik-Lauf`, unter einem neuen 3-Schritt-Menü mit Per-Game-Theming.

## Gerade wichtig
- **Neues Menü-System (V2.7.0):** Gerät → Spiel → Modus → Level, plus Einstellungen und Credits.
- `game.js` wurde nicht angefasst; versteckte Kompatibilitäts-Stubs in `index.html` halten die alten DOM-Hooks am Leben.
- Theming läuft über `#app-shell[data-theme="shadow"|"panic"]`.
- Klassisches Hauptspiel und Panik-Lauf bleiben spielbar und stabil.
- Mobile Gameplay (Portrait, Rotate-Overlay, Labyrinth-Laufzeitrotation) funktioniert weiter.
- Party-Modus v1 ist als `COOP`-Host/Join vorhanden, braucht weiter echtes Mobile-Playtesting.

## Was zuletzt eingebaut wurde
- 3-Schritt-Menü mit Spielkarten, SVG-Logos (Licht-Puls / Feuerflackern) und animierten Übergängen
- Per-Game-Theming, Bebas Neue + Inter als Standardschriften
- `MenuFlow`-Controller in `index.html` mit Back-Buttons, Gerätewahl, Settings, Credits
- Komplette Neufassung der `styles.css` nach dem Design-System
- Level-Grid-Rendering bleibt an `game.js` gekoppelt, aber über neue `.lvl-btn`-Styles

## Wo man zuerst schaut
- Menü-UI: `MenuFlow` am Ende von `index.html`
- Menü-Styles: `styles.css` (Suche nach `.menu-screen`, `.game-card`, `.card`, `.lvl-btn`)
- Spiel-Modi-Integration: `setMode()`, `startLevel()`, `renderLevelSelect()` in `game.js`
- Mobile Runtime: `updateViewportMode()`, `getGameplayFrame()`, `configureTouchControls()`
- Party-Flow: `startPartyLobby()`, `showPartyOverlay()`, `handleControllerMessage()`, `updateController()`
- Panik-Lauf-Setup: `setupLabyrinthRun()`
- Panik-Lauf-Loop: `updateLabyrinth()`
- Panik-Lauf-Render: `drawLabyrinth()`
- Ring-Physik: `updateRingForce()`

## Nächster sinnvoller Arbeitsschritt
- Party aus dem Panik-Lauf-Menü auf den Labyrinth-Zweig routen
- Einstellungs-Toggles (Audio, Shake, Reduzierte Bewegung) persistieren und auf das Spiel anwenden
- Level-Grid: expliziten Locked-Zustand rendern
- Pause-Menü und In-Game-HUD ins neue Design-System überführen

## Wenn du morgen neu einsteigst
1. `docs/DEV_HANDOFF.md` lesen
2. `docs/ARCHITECTURE.md` (Abschnitt „Menü V2.7.0")
3. `DESIGN-REGELN.md` überfliegen
4. dann erst `index.html`, `styles.css`, `game.js`, `levels.js`

## Wichtige Save-Daten
- `saveData.bests`: klassisches Hauptspiel
- `saveData.labyrinthBests`: Panik-Lauf
- `masterModeActive`: nur temporär
- `sj_device` (LocalStorage-Key): Gerätepräferenz Desktop/Mobile
