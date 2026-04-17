# Quick Context

Diese Datei ist die Kurznotiz für den nächsten sauberen Einstieg ins Projekt.

## Projekt in einem Satz
`Schatten-Jäger` ist aktuell ein browserbasiertes Canvas-Spiel mit klassischem Hauptspiel, integrierten Ring-Modi und einem vorbereiteten, aber noch nicht implementierten zweiten Spielzweig `Labyrinth`.

## Was gerade wichtig ist
- Hauptspiel ist stabil und soll nicht unnötig umgebaut werden.
- Ring-Modi (`RING_SOLO`, `RING_DUO`, `RING_TRIO`) laufen bereits in normalen Levels.
- Das Menü ist für `Labyrinth` vorbereitet, aber `Labyrinth` ist noch reine Platzhalter-UI.
- Alle Hauptlevel sind direkt anwählbar; es gibt keinen zentralen Startbutton mehr.

## Was zuletzt eingebaut wurde
- Ring-Mechanik mit 1/2/3 Spielern.
- Ring-Force-Sandbox.
- Zusatzziele mit früh spawnenden Kirschen in ausgewählten späten Levels.
- Menü-Umbau auf zwei Bildschirme:
  - `SCHATTEN-JÄGER`
  - `LABYRINTH`

## Wo man im Code zuerst schaut
- Menü/Umschaltung: `setMenuTab()`, `setMode()`, `updateUI()`
- Levelauswahl/Progression: `updateLevelSelect()`, `startLevel()`, `skipLevel()`
- Hauptgameplay: `update()`, `draw()`, `getShadowPoly()`
- Ring-Gameplay: `setupRingForcePrototype()`, `updateRingForce()`, `updateRingLevelMovement()`
- Sammelziele: `setupCollectibleObjective()`, `updateCollectibleObjective()`

## Wichtig für die nächste große Aufgabe
Wenn `Labyrinth` beginnt:
- nicht in die bestehenden Hauptmodi hineinpfuschen,
- neue `LABYRINTH_*`-Modi anlegen,
- eigenen Levelsatz verwenden,
- eigene Levelauswahl aufbauen.

Details dazu stehen in:
- [docs/LABYRINTH_PREP.md](docs/LABYRINTH_PREP.md)

## Wichtige Zustände und Daten
- `sj_v2_data` in `localStorage`: echter Spielfortschritt
- `masterModeActive`: nur temporärer Sitzungsstatus
- `RING_FORCE`: separater Sandbox-Zustand

## Cheats
- `angimylove`: Meister-Modus an
- `exit`: Meister-Modus aus
