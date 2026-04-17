# Quick Context

## Projekt in einem Satz
`Schatten-Jäger` ist aktuell ein Canvas-Spiel mit klassischem Hauptspiel, Ring-Modi und einem ersten spielbaren Labyrinth-Parkourzweig.

## Gerade wichtig
- Klassisches Hauptspiel soll stabil bleiben.
- Labyrinth ist jetzt nicht mehr nur Menü, sondern bereits spielbar.
- Mobile Gameplay ist jetzt Portrait-first; Labyrinth wird auf Handys runtime-seitig gedreht und neu eingerahmt.
- Party-Modus ist technisch als `COOP`-Host/Join v1 vorhanden, braucht aber noch echtes Mobile-Playtesting und UX-Polish.
- Für die Arbeitsaufnahme nach einer Pause ist `docs/DEV_HANDOFF.md` die wichtigste Datei.

## Was zuletzt eingebaut wurde
- Mobile Portrait-Modus mit Rotate-Overlay
- Touch-Fix fuer Ring/Labyrinth, damit der erste Stick-Kontakt direkt zaehlt
- Laufzeit-Rotation fuer mobile Labyrinth-Pfade
- QR-Party-Lobby mit Join-Warteraum, Rollenvergabe und Countdown fuer `COOP`
- Labyrinth-Modi:
  - `LABYRINTH_RING_SOLO`
  - `LABYRINTH_RING_DUO`
  - `LABYRINTH_RING_TRIO`
- Eigene Labyrinth-Levelauswahl
- 50 generierte Labyrinth-Level
- Parkour-Update-/Render-Logik
- Getrennte Labyrinth-Bestzeiten
- Start-Countdown `3, 2, 1, LOS`, wobei Bewegung und Zeit bei `LOS` beginnen

## Wo man zuerst schaut
- Menü/Modi: `setMode()`, `setMenuTab()`, `refreshModeSelection()`
- Mobile Runtime: `updateViewportMode()`, `getGameplayFrame()`, `configureTouchControls()`
- Party-Flow: `startPartyLobby()`, `showPartyOverlay()`, `handleControllerMessage()`, `updateController()`
- Levelauswahl: `updateLevelSelect()`, `renderLevelSelect()`
- Labyrinth-Setup: `setupLabyrinthRun()`
- Labyrinth-Loop: `updateLabyrinth()`
- Labyrinth-Render: `drawLabyrinth()`
- Ring-Physik: `updateRingForce()`

## Nächster sinnvoller Arbeitsschritt
- Mobile auf echtem Handy gegen Desktop gegenprüfen
- Party-Modus mit zwei echten Geraeten im WLAN testen
- danach erst Zeitlimits fuer `LABYRINTH_RING_SOLO` und spaeter `DUO`/`TRIO` feinziehen

## Wenn du morgen neu einsteigst
1. `docs/DEV_HANDOFF.md` lesen
2. `docs/MULTIPLAYER_CONCEPT.md` lesen
3. `docs/LABYRINTH_PREP.md` lesen
4. dann erst `game.js` und `levels.js` öffnen

## Wichtige Save-Daten
- `saveData.bests`: klassisches Hauptspiel
- `saveData.labyrinthBests`: Labyrinth
- `masterModeActive`: nur temporär
