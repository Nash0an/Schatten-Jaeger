# Schatten-Jäger

Ein Browser-Arcade-Spiel um Licht, Schatten und präzise Bewegung. Du steuerst eine Lichtquelle, nutzt den Schatten einer Säule als Waffe und überlebst gegen immer aggressivere Gegner.

## Spielkonzept
- **Kernidee:** Gegner sterben nur im Schatten der zentralen Säule.
- **Schatten-Jäger (Klassisch):** 50 Level mit `score`, `survival` und `pacifist`-Zielen, plus Solo, Koop, Ring×3, Party und Training.
- **Panik-Lauf (Labyrinth):** Ein Parkour-Zweig, bei dem ein Ring auf einem Holzsteg balanciert werden muss. 50 separate Parkour-Level mit Zeitlimit, inklusive Ring×3, Party und Training.
- **Progression:** Freigeschaltete Level und Bestwerte werden in `localStorage` unter `sj_v2_data` gespeichert. Die Gerätepräferenz (Desktop/Mobile) liegt unter `sj_device`.

## Menüfluss
Das Menü führt in drei Schritten ins Spiel:
1. **Gerätewahl** (einmalig, speichert `sj_device`)
2. **Spielwahl** – Schatten-Jäger oder Panik-Lauf
3. **Modus** → **Level**

Aus dem Hauptmenü sind zusätzlich eigene Screens für **Einstellungen** und **Credits** erreichbar. Jeder Screen hat einen klaren Zurück-Button; die Akzentfarbe folgt dem gewählten Spiel (Bernstein für Schatten-Jäger, Honig/Holz für Panik-Lauf).

## Steuerung

### Desktop
- **Solo:** `WASD` oder Pfeiltasten bewegen die Figur.
- **Koop:** `WASD` bewegt die Figur, Pfeiltasten drehen den Lichtkegel.

### Touch
- Touch-Steuerung wird erst nach der ersten echten Berührung aktiviert.
- **Solo:** linker Joystick bewegt die Figur.
- **Koop:** linker Joystick bewegt, rechter Joystick dreht den Lichtkegel.

## Meister-Modus
- `angimylove` im Menü aktiviert den Meister-Modus für die aktuelle Sitzung.
- `exit` im Menü beendet den Meister-Modus wieder.
- Der Meister-Modus speichert keine dauerhafte Komplett-Freischaltung.

## Projektstruktur
- `index.html`: UI-Struktur, Overlays, Canvas und `MenuFlow`-Controller.
- `game.js`: Hauptlogik, State-Machine, Rendering, Audio (unverändert zur Menü-Überarbeitung).
- `levels.js`: Leveldaten (Klassisch & Panik-Lauf).
- `assets/images/`: Hintergründe und Texturen.
- `styles.css`: Design-System, Layout, HUD, Menü und Joysticks.
- `DESIGN-REGELN.md`: Design-Leitlinien (Farben, Typografie, Touch, Game Juice).
- `docs/`: Architektur, Changelog, Dev-Handoff und Konzeptdokumente.

## Start
Es gibt keinen Build-Schritt. Für lokale Tests reicht:

```bash
python3 -m http.server 8000
```

Dann `http://localhost:8000` im Browser öffnen. Alternativ kann `index.html` direkt geöffnet werden.
