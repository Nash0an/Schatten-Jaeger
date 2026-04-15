# Changelog: Schatten-Jäger

Alle relevanten Änderungen an diesem Projekt werden hier dokumentiert.

## [2.5.1] - 2026-04-15
### Behoben
- Solo-/Koop-Auswahl im Menü reagiert wieder zuverlässig auf Touch und Pointer.
- Levelstart hängt nicht mehr in einem fehlerhaften Renderpfad fest.
- HUD-Timer, Missions-Splash und Spielfeldstart laufen wieder korrekt.

### Geändert
- Meister-Modus ist jetzt sitzungsbasiert statt dauerhaft gespeichert.
- `exit` im Menü beendet den Meister-Modus.
- Alte irrtümliche Vollfreischaltungen werden beim Start aus Bestzeiten zurückgesetzt.

## [2.5.0] - 2026-04-15
### Hinzugefügt
- **Tutorial-Modus:** Neues Level 0 mit dynamischen Bildschirmanweisungen.
- **Enhanced Particles:** Partikel haben nun Reibung, individuelle Farben und Größen.
- **Dynamic Shake:** Der Bildschirmschütteleffekt skaliert nun mit der Größe der Combo.
- **Audio Pitch-Shift:** Minimale Variationen in der Tonhöhe beim Kill-Sound für mehr Natürlichkeit.

## [2.4.0] - 2026-04-15
### Hinzugefügt
- **Arc-Drop Spawn-Effekt:** Konzentrische Bögen, die dynamisch auf die Startposition des Spielers fallen.
- **HUD-Timer:** Echtzeit-Anzeige (MM:SS.d) im HUD für bessere zeitliche Orientierung.
- **Meister-Modus:** Cheat-Code `angimylove` zur vollständigen Freischaltung der aktuellen Sitzung.
- **Polished Audio:** Harmonischer Kill-Sound für befriedigenderes Feedback.

## [2.3.0] - 2026-04-15
### Hinzugefügt
- **Level-Expansion:** Erweiterung auf insgesamt 50 Hauptlevel plus Tutorial.
- **Pulsierende Säulen:** Neue Hindernis-Mechanik.
- **Variable Gegner:** Unterstützung für unterschiedliche Gegner-Radien (`enemyRadius`).
- **Simultane Effekte:** Säulen können gleichzeitig pulsieren, sich bewegen und schrumpfen.

## [2.2.0] - 2026-04-15
### Hinzugefügt
- **Mission-Splash:** Große Anzeige des Level-Ziels beim Start.
- **Spawn-Effekt:** Visuelles Feedback am Startpunkt.
- **Optimierte Startposition:** Spieler startet zentraler relativ zur Säule.

## [2.1.0] - 2026-04-15
### Geändert
- Combo-System nutzt Objekt-Referenzen statt Indizes.
- Touch-UI wird erst bei echter Touch-Interaktion aktiviert.
- Render-Performance für Combo-Glows wurde verbessert.

## [2.0.0] - Früherer Release
- Modularisierung in `game.js`, `levels.js` und `styles.css`.
- Koop-Modus.
- Erweiterung auf mehrere Missionsarten und lokalen Speicherstand.

## [1.0.0] - Initialer Release
- Kernmechanik Licht/Schatten/Gegner.
