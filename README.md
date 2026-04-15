# Schatten-Jäger

Ein Browser-Arcade-Spiel um Licht, Schatten und präzise Bewegung. Du steuerst eine Lichtquelle, nutzt den Schatten einer Säule als Waffe und überlebst gegen immer aggressivere Gegner.

## Spielkonzept
- **Kernidee:** Gegner sterben nur im Schatten der zentralen Säule.
- **Modi:** `SOLO` mit gemeinsamer Bewegungssteuerung und `KOOP`, bei dem Bewegung und Lichtrotation getrennt sind.
- **Inhalt:** 51 Level (`0` bis `50`) mit `score`, `survival` und `pacifist`-Zielen.
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
- `game.js`: Hauptlogik, State-Machine, Input, Rendering, Audio.
- `levels.js`: Leveldaten und Missionsparameter.
- `styles.css`: Layout, HUD, Menü und Touch-UI.
- `docs/`: Architektur, Changelog, Roadmap und Arbeitskontext.

## Start
Es gibt keinen Build-Schritt. Für lokale Tests reicht:

```bash
python3 -m http.server 8000
```

Dann `http://localhost:8000` im Browser öffnen. Alternativ kann `index.html` direkt geöffnet werden.
