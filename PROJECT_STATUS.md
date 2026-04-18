# Projektstatus: Schatten-Jäger

## Aktueller Stand (V2.7.0)
Das Menü- und Design-System ist auf einen neuen Stand gehoben:
- **3-Schritt-Menü:** Gerät → Spiel → Modus → Level, plus eigene Screens für Einstellungen und Credits.
- **Zwei Spielkarten:** `Schatten-Jäger` und `Panik-Lauf` mit animierten Inline-SVG-Logos.
- **Per-Game-Theming:** `[data-theme="shadow"|"panic"]` steuert Akzentfarben (Bernstein vs. Honig/Holz).
- **Design-System:** Bebas Neue + Inter, CSS-Tokens, einheitliche Touch-Größen und responsive Breakpoints.
- **Kompatibilitätsschicht:** `game.js` bleibt unverändert; versteckte `panel-classic`/`panel-labyrinth`-Elemente und Tabs dienen als Brücke.
- **Gameplay weiter stabil:** Klassisches Hauptspiel und Panik-Lauf (Labyrinth intern) laufen wie vor der UI-Überarbeitung.

## Spielbare Zweige
- `SOLO` / `COOP` (Klassisch)
- `RING_SOLO` / `RING_DUO` / `RING_TRIO` (Standard-Level)
- `LABYRINTH_RING_SOLO / DUO / TRIO` (Panik-Lauf)
- `RING_FORCE`-Sandbox
- Party (aktuell immer klassisches `COOP`)

## Was zuletzt gebaut wurde (V2.7.0)
- **Menü-Neubau:** 3-Schritt-Flow, eigene Back-Buttons, Gerätewahl, Einstellungen, Credits.
- **Design-System:** Neue `index.html`-Struktur plus komplette `styles.css`-Neufassung.
- **MenuFlow-Controller:** Navigations-, Theming- und Integrationsschicht in `index.html`.
- **MutationObserver:** Neutralisiert Inline-Hintergründe, die `game.js` am Overlay setzt.
- **Gerätepräferenz:** `sj_device` in `localStorage`.

## Was zuletzt gebaut wurde (V2.6.0)
- Dynamisches Hintergrund-System (Classic/Labyrinth).
- Asset-Reorganisation unter `assets/images/`.
- Breitere, organischere Labyrinth-Pfade mit Holztextur.
- Mobile-Portrait-Runtime mit Rotate-Overlay.
- Party-Modus v1 (QR-Join, Lobby, Countdown) für klassisches `COOP`.

## Was stabil ist
- Kern-Gameplay (Physik, Steuerung, Kollision).
- Labyrinth-/Panik-Lauf-Engine (Countdown, Zeitlimits, Zielerkennung).
- Speichersystem (`sj_v2_data` in `localStorage`).
- UI-Navigation, Modusumschaltung, Theming.

## Bekannte offene Punkte
- **Party aus Panik-Lauf-Menü** startet derzeit Schatten-Jäger COOP.
- **Einstellungs-Toggles** (Audio, Shake, Reduzierte Bewegung) sind noch nicht persistent.
- **Locked-State im Level-Grid** fehlt — `game.js` rendert alle Level anwählbar.
- **Pause-Menü** im Spielbildschirm ist noch nicht auf das neue Design-System umgestellt.
- **In-Game-HUD-Feinschliff** steht noch aus.
- Labyrinth-Zeiten für `DUO`/`TRIO` bleiben der wichtigste Balancing-Punkt.

## Was als Nächstes ansteht (Vision)
- **Party-Routing:** Party aus Panik-Lauf auf Labyrinth-Modus führen.
- **Settings-Persistenz:** Toggles in `localStorage` speichern und auf Audio/Shake/Motion anwenden.
- **Level-Grid:** Locked-State explizit rendern, Fortschritt visueller machen.
- **Pause-/HUD-Polish:** In-Game-Overlays in das neue Design-System überführen.
- **Handgebaute Panik-Lauf-Level** statt reiner Algorithmen.
- **Audio-Ausbau:** mehr Soundeffekte, atmosphärische Ambient-Layer.

## Wichtigste Dokumentation
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/DEV_HANDOFF.md](docs/DEV_HANDOFF.md)
- [docs/QUICK_CONTEXT.md](docs/QUICK_CONTEXT.md)
- [docs/CHANGELOG.md](docs/CHANGELOG.md)
- [DESIGN-REGELN.md](DESIGN-REGELN.md)
