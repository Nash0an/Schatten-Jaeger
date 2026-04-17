# Schatten-Jäger

Ein Browser-Arcade-Spiel um Licht, Schatten und präzise Bewegung. Du steuerst eine Lichtquelle, nutzt den Schatten einer Säule als Waffe und überlebst gegen immer aggressivere Gegner.

## Spielkonzept
- **Kernidee:** Gegner sterben nur im Schatten der zentralen Säule.
- **Klassisch:** 50 Level mit `score`, `survival` und `pacifist`-Zielen.
- **Labyrinth:** Ein Parkour-Zweig, bei dem ein Ring auf einem Holzsteg balanciert werden muss. 50 separate Parkour-Level mit Zeitlimit.
- **Progression:** Freigeschaltete Level und Bestwerte werden in `localStorage` unter `sj_v2_data` gespeichert.

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
- `index.html`: UI-Struktur, Overlays und Canvas.
- `game.js`: Hauptlogik, State-Machine, Rendering, Audio.
- `levels.js`: Leveldaten (Klassisch & Labyrinth).
- `assets/images/`: Hintergründe und Texturen.
- `styles.css`: Layout, HUD und Menü.
- `docs/`: Architektur, Changelog und Dev-Handoff.

## Start
Es gibt keinen Build-Schritt. Für lokale Tests reicht:

```bash
python3 -m http.server 8000
```

Dann `http://localhost:8000` im Browser öffnen. Alternativ kann `index.html` direkt geöffnet werden.
