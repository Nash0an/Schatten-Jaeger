# Projektstatus: Schatten-Jäger

## Aktueller Stand
Das Projekt ist aktuell in einer stabilen Übergangsphase:
- Das klassische Hauptspiel funktioniert.
- Die Ring-Mechanik ist als echter Spielzweig in normalen Levels integriert.
- Das Menü ist bereits für einen zweiten Spielzweig `Labyrinth` vorbereitet.
- Die eigentliche Labyrinth-Programmierung hat aber noch **nicht** begonnen.

## Was gerade spielbar ist
- Klassisches `SOLO`
- Klassisches `KOOP`
- `RING_SOLO`
- `RING_DUO`
- `RING_TRIO`
- Separater `Ring-Force`-Sandbox-Prototyp

## Technischer Status
- Reines HTML5-Canvas-Projekt ohne externe Libraries.
- Hauptlogik zentral in `game.js`.
- Hauptlevelsatz in `levels.js`.
- Fortschritt über `localStorage` (`sj_v2_data`).
- Alle Hauptlevel sind direkt anwählbar.
- Lose-Overlay unterstützt `Level überspringen`.

## Zuletzt wichtige Änderungen
- Ring-Modi wurden in die normalen Level integriert.
- Ring-Physik wurde auf 1, 2 und 3 Spieler erweitert.
- Zusatzziele mit früh spawnenden Kirschen wurden in ausgewählten späteren Levels ergänzt.
- Menü wurde auf zwei Bildschirme vorbereitet:
  - `SCHATTEN-JÄGER`
  - `LABYRINTH`
- Der alte zentrale Startbutton wurde entfernt, weil die Levelauswahl nun direkt alles abdeckt.

## Labyrinth-Stand
`Labyrinth` ist aktuell nur auf Menüebene vorbereitet:
- eigener Menübildschirm,
- gleiche Grundstruktur wie das Hauptmenü,
- andere Überschrift,
- keine obere klassische `Solo/Koop`-Zeile,
- `RINGS`-Gruppe mit drei Platzhaltern,
- Platzhalter für spätere Levelauswahl.

Es gibt derzeit noch:
- keine Labyrinth-Modi,
- keine Labyrinth-Level,
- keine Labyrinth-Progression,
- keine Labyrinth-Mechanik.

## Empfohlener nächster Arbeitsschritt
Die nächste große Aufgabe ist klar:
- `Labyrinth` als echten zweiten Spielzweig aufsetzen, ohne das Hauptspiel zu destabilisieren.

Die wichtigste Detailvorbereitung dafür steht in:
- [docs/LABYRINTH_PREP.md](docs/LABYRINTH_PREP.md)

## Wichtige Dokumente
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): Technischer Ist-Zustand.
- [docs/QUICK_CONTEXT.md](docs/QUICK_CONTEXT.md): Schnellster Wiedereinstieg.
- [docs/LABYRINTH_PREP.md](docs/LABYRINTH_PREP.md): Nächste Schritte für Labyrinth.
- [docs/ROADMAP.md](docs/ROADMAP.md): Priorisierte Ausbauplanung.
- [docs/CHANGELOG.md](docs/CHANGELOG.md): Historie der relevanten Änderungen.
