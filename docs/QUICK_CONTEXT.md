# Quick Context

Diese Datei ist die Kurznotiz für den nächsten Einstieg ins Projekt.

## Was dieses Projekt ist
- Reines Browser-Spiel ohne Build-Prozess.
- Hauptlogik fast vollständig in `game.js`.
- `levels.js` enthält Balancing und Missionsziele.

## Was zuletzt wichtig war
- Menüauswahl für `SOLO` und `KOOP` wurde auf robuste Pointer-/Touch-Bedienung umgestellt.
- Ein Renderfehler beim Levelstart wurde behoben.
- Meister-Modus ist absichtlich **nicht persistent**.

## Wichtige Cheats und Zustände
- `angimylove`: Meister-Modus an.
- `exit`: Meister-Modus aus.
- `sj_v2_data` in `localStorage`: echter Progressionsstand.
- `masterModeActive` in `game.js`: nur temporärer Sitzungsstatus.

## Wo man zuerst schaut
- Menü-/Startprobleme: `bindEvents()`, `updateLevelSelect()`, `startLevel()`, `updateUI()`.
- Touch-Probleme: `initTouch()`, `handleTouch()`, `configureTouchControls()`.
- Gameplay-Probleme: `update()`, `draw()`, `getShadowPoly()`.

## Vorsicht
- Doku immer gegen den aktuellen Code abgleichen.
- Bei Änderungen an Progression niemals `saveData.unlockedLevel` für Debug-/Cheat-Zwecke dauerhaft überschreiben.
