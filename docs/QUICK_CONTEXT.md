# Quick Context

## Projekt in einem Satz
`Schatten-Jäger` ist aktuell ein Canvas-Spiel mit klassischem Hauptspiel, Ring-Modi und einem ersten spielbaren Labyrinth-Parkourzweig.

## Gerade wichtig
- Klassisches Hauptspiel soll stabil bleiben.
- Labyrinth ist jetzt nicht mehr nur Menü, sondern bereits spielbar.
- Der nächste Schritt ist Balancing, nicht mehr Grundarchitektur.
- Für die Arbeitsaufnahme nach einer Pause ist `docs/DEV_HANDOFF.md` die wichtigste Datei.

## Was zuletzt eingebaut wurde
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
- Levelauswahl: `updateLevelSelect()`, `renderLevelSelect()`
- Labyrinth-Setup: `setupLabyrinthRun()`
- Labyrinth-Loop: `updateLabyrinth()`
- Labyrinth-Render: `drawLabyrinth()`
- Ring-Physik: `updateRingForce()`

## Nächster sinnvoller Arbeitsschritt
- Labyrinth-Level im Browser testen
- zuerst Zeitlimits für `SOLO` feinziehen
- danach `DUO` und `TRIO` prüfen
- harte oder schlechte Kurse ersetzen

## Wenn du morgen neu einsteigst
1. `docs/DEV_HANDOFF.md` lesen
2. `docs/LABYRINTH_PREP.md` lesen
3. dann erst `game.js` und `levels.js` öffnen

## Wichtige Save-Daten
- `saveData.bests`: klassisches Hauptspiel
- `saveData.labyrinthBests`: Labyrinth
- `masterModeActive`: nur temporär
