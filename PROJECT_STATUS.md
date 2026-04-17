# Projektstatus: Schatten-Jäger

## Aktueller Stand
Das Projekt hat einen großen visuellen und strukturellen Sprung gemacht:
- **Grafik:** Modus-spezifische High-Res Hintergründe sind integriert.
- **Labyrinth:** Der Parkour hat eine Holzsteg-Optik und organischere, breitere Wege (Sinus-basiert).
- **Beleuchtung:** Licht- und Schatten-Balance sind für maximale Atmosphäre feinjustiert.
- **Struktur:** Dateistruktur ist für Assets professionalisiert (`assets/images/`).
- **Stabilität:** Klassisches Hauptspiel und Labyrinth sind stabil und visuell auf einem Niveau.

## Spielbare Zweige
- `SOLO` / `COOP` (Klassisch)
- `RING_SOLO` / `RING_DUO` / `RING_TRIO` (Standard-Level)
- `LABYRINTH_RING_SOLO / DUO / TRIO` (Parkour-Modus)
- `RING_FORCE`-Sandbox

## Was zuletzt gebaut wurde
- **Dynamisches Hintergrundsystem:** Automatischer Wechsel zwischen Classic- und Labyrinth-Hintergrund.
- **Asset-Reorganisation:** Einführung von `assets/images/` und saubere Benennung.
- **Labyrinth-Upgrade:** 50% breitere Wege, Sinus-Kurven-Generierung für flüssigeres Gameplay.
- **Texturierung:** Holzsteg-Textur für Labyrinth-Pfade mit Tiefeneffekten.
- **UI-Polishing:** Exakte Zentrierung der Menü-Buttons und Vereinheitlichung der Panel-Breite auf 700px.
- **Atmosphäre:** Hellere Lampe, dunklere Schattenkanten, aufgehelltes Spielfeld.

## Was stabil ist
- Kern-Gameplay (Physik, Steuerung, Kollision).
- Labyrinth-Engine (Countdown, Zeitlimits, Zielerkennung).
- Speichersystem (localStorage Progression).
- UI-Navigation und Modusumschaltung.

## Was als Nächstes ansteht (Vision)
- **Grafik:** Spezialisierte Texturen für Gegner oder Sammelziele (Kirschen).
- **Level:** Handgebaute Speziallevel für das Labyrinth statt reiner Algorithmen.
- **Tuning:** Feinschliff an den Zeitlimits und Level-Eigenschaften.
- **Audio:** Ausbau der Soundeffekte und atmosphärische Hintergrundgeräusche.
- **Gameplay:** Neue Power-Ups oder dynamische Hindernisse.

## Wichtigste Dokumentation
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/DEV_HANDOFF.md](docs/DEV_HANDOFF.md)
- [docs/QUICK_CONTEXT.md](docs/QUICK_CONTEXT.md)
- [docs/CHANGELOG.md](docs/CHANGELOG.md)
