# Changelog: Schatten-Jäger

Alle relevanten Änderungen an diesem Projekt werden hier dokumentiert.

## [2.6.0] - 2026-04-17
### Hinzugefügt
- **Dynamisches Hintergrund-System:** Unterstützung für modus-spezifische Hintergründe (Schattenjäger vs. Labyrinth).
- **Asset-Management:** Einführung einer professionellen Verzeichnisstruktur unter `assets/images/`.
- **Visuelle Effekte:** Prozedurales Gitter (Grid) und Vignette-Effekt für mehr Tiefe und Atmosphäre.
- **Labyrinth-Texturen:** Implementierung einer dunklen Holzsteg-Textur für den Parkour-Pfad.
- **QR-Party-Modus v1:** Host-Lobby mit QR-Code, Join-Warteraum auf dem Handy, Rollenvergabe und Start-Countdown fuer klassisches `COOP`.
- **Mobile Portrait Mode:** Handys erkennen jetzt ein eigenes Hochformat-Gameplay mit Rotate-Overlay, mobilen Spielfeldraendern und angepasstem HUD.

### Geändert
- **Labyrinth-Engine:** Pfade sind nun 50% breiter und deutlich geschwungener/organischer generiert.
- **Beleuchtungs-Tuning:** Lampe vergrößert (Radius 450-600) und intensiviert; Spielfeld insgesamt aufgehellt.
- **Schatten-Design:** Schatten-Polygone sind massiver und dunkler für besseren Kontrast.
- **UI-Verbesserungen:** 
    - Menü-Umschaltbuttons (Schattenjäger/Labyrinth) sind nun exakt zentriert.
    - Menü-Panels haben eine konsistente Breite von 700px für stabilere Layouts auf dem Desktop.
    - Das Hauptmenü zeigt nun live den Hintergrund des jeweiligen Modus an.
    - Mobile Joysticks sind groesser, stabiler positioniert und werden fuer lokalen `SOLO`/`COOP` sowie den QR-Lichtcontroller konsistent wiederverwendet.
    - Party-Joiner landen nicht mehr direkt in einer nackten Controllerflaeche, sondern sehen zuerst Session-Status, Rolle und Spielstart.
    - Eingaben fuer Tastatur, Touch und Remote-Controller laufen ueber eine gemeinsame Input-Schicht.
    - Mobile Labyrinth-Level werden zur Laufzeit um 90 Grad gedreht, portrait-sicher eingerahmt und mit angepasster Trackbreite gespielt.
    - Klassische Level nutzen auf Handys ein engeres Portrait-Framing fuer Startposition, Gegner-Spawns und Bewegungsraum.

### Bereinigt
- Redundanter Audio-Aktivierungsbutton im Labyrinth-Menü entfernt.
- Der erste Touch auf dem Handy wird nicht mehr von der Initialisierung verschluckt; Ring- und Labyrinth-Steuerung reagieren direkt.

## [2.5.3] - 2026-04-17
### Hinzugefügt
- Separater `Ring-Force`-Physikprototyp im Menü, in dem zwei Spieler sich frei im Ringinneren bewegen.
- Der Ring verschiebt sich nur durch aktiven Druck gegen seine Innenwand; ohne Druck bleibt er sofort stehen.
- Neue Spielmodi `RING SOLO`, `RING DUO` und `RING TRIO` in den normalen Leveln.
- Neue Spielmodi `LABYRINTH_RING_SOLO`, `LABYRINTH_RING_DUO` und `LABYRINTH_RING_TRIO`.
- Die Sandbox kann jetzt zwischen einem, zwei und drei Spielern umschalten.
- Spätere Level können jetzt verzögerte Kirsch-Sammelziele aktivieren, die früh im Spielfeld erscheinen.
- Labyrinth besitzt jetzt einen eigenen 50-Level-Parkoursatz mit Zeitlimit, Absturzlogik und Zielerreichung.
- Neue Übergabedokumentation `docs/DEV_HANDOFF.md` für schnellen Wiedereinstieg und Entwicklerübergabe.

### Geändert
- Stillstehende Spieler bleiben bei Ringbewegung zunächst in Weltkoordinaten stehen und werden erst von der nachrückenden Innenwand mitgenommen.
- Pro Spieler wird der aktuelle Schub im Debug-Overlay deutlicher angezeigt.
- Alle Level bleiben in der Levelauswahl anwählbar; erledigte Level sind hell, unerledigte bleiben dunkel.
- Nach einer Niederlage kann das aktuelle Level jetzt direkt übersprungen werden.
- Ein Level endet nun in diesen markierten Stufen erst, wenn sowohl das Hauptziel als auch alle erschienenen Kirschen erfüllt sind.
- Das Startmenü trennt jetzt zwischen `Schattenjäger` und `Labyrinth` auf zwei Menübildschirmen mit Umschaltbutton.
- Das Labyrinth-Menü nutzt jetzt echte Moduskarten und eine eigene Levelauswahl.
- Labyrinth nutzt jetzt einen Start-Countdown `3, 2, 1, LOS`; Bewegung und Timer beginnen bei `LOS`.
- Die Labyrinth-Solo-Zeitfenster wurden leicht gelockert.
- Architektur-, Status-, Roadmap- und Einstiegsdokumente wurden auf den aktuellen Stand vor dem `Labyrinth`-Ausbau gebracht.

## [2.5.2] - 2026-04-15
### Geändert
- Tutorial-Level 0 wurde wieder entfernt; die Progression startet nun direkt bei Level 1.
- Menü enthält jetzt einen bewusst unauffälligen Button zum Zurücksetzen des lokalen Fortschritts.

### Behoben
- Alte Speicherstände mit freigeschaltetem Level 0 werden beim Laden sauber auf das neue Startlevel migriert.

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
