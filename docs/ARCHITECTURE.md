# Architektur: Schatten-Jäger

Dieses Dokument beschreibt den aktuellen technischen Stand von **Schatten-Jäger** nach dem Menü-Umbau für `Labyrinth` und nach der Integration der Ring-Modi in die normalen Level.

## 1. Projektform
- Reines Browser-Spiel ohne Build-Prozess oder externe Libraries.
- Rendering vollständig über die HTML5 Canvas API.
- Audio über Web Audio API.
- Kernlogik fast komplett in einer zentralen Klasse `SchattenJaeger` in `game.js`.

## 2. Wichtige Dateien
- `index.html`: Canvas, HUD, Menü, Win-/Lose-Overlays.
- `styles.css`: HUD, Menü, Touch-Joysticks und Menü-Layout.
- `levels.js`: Hauptlevelsatz `LEVELS` plus Zusatzkonfigurationen wie verzögerte Sammelziele.
- `game.js`: State-Machine, Eingabe, Gegner, Rendering, Ring-Physik, Progression, Menülogik.
- `PROJECT_STATUS.md`: Überblick über den aktuellen Entwicklungsstand.
- `docs/QUICK_CONTEXT.md`: Kurzkontext für schnellen Wiedereinstieg.
- `docs/LABYRINTH_PREP.md`: Vorbereitungsstand und offene Entscheidungen für den nächsten Spielzweig.

## 3. Zustände und Modi

### Laufende Zustände
- `MENU`: Startmenü und Levelauswahl.
- `PLAYING`: Normale Spielschleife.
- `WIN`: Level geschafft.
- `LOSE`: Spieler wurde getroffen oder Missionsziel ist gescheitert.
- `RING_FORCE`: Separater Physik-Prototyp außerhalb der normalen Level.

### Aktive Spielmodi im Hauptspiel
- `SOLO`: Ein Spieler trägt Licht und Bewegung.
- `COOP`: `P1` bewegt, `P2` steuert das gerichtete Licht.
- `RING_SOLO`: Ring-Mechanik in normalen Leveln mit einem Spieler im Ring.
- `RING_DUO`: Ring-Mechanik in normalen Leveln mit zwei Spielern im Ring.
- `RING_TRIO`: Ring-Mechanik in normalen Leveln mit drei Spielern im Ring.

### Menübildschirme
Das Menü nutzt aktuell keinen sichtbaren Reiter mehr, sondern zwei getrennte Panels:
- `panel-classic`: Überschrift `SCHATTEN-JÄGER`, enthält die bestehenden Hauptmodi und `RINGS`.
- `panel-labyrinth`: Überschrift `LABYRINTH`, aktuell als vorbereiteter Platzhalterbildschirm.

Der Wechsel erfolgt über `setMenuTab()` in `game.js`. Die Umschaltbuttons sitzen rechts oben in der Menü-Kopfzeile.

## 4. Kernsysteme

### 4.1 Schatten- und Lichtsystem
- `getShadowPoly()` berechnet den tödlichen Schatten über Tangenten an die Säule.
- Im `SOLO`- und Ring-Spiel ist das Licht radial um die aktive Trägerposition.
- Im `COOP`-Spiel ist das Licht ein gerichteter Kegel über `lightAngle` und `lightSpread`.

### 4.2 Gegner
- Gegner spawnen an den Bildschirmrändern.
- Bewegung immer in Richtung der aktiven Spieler-/Trägerposition.
- Tod bei Kreis-Kollision mit aktiven Spielerkörpern.
- Tötung im Schatten via `isPointInPoly()`.

### 4.3 Combo- und Punkte-System
- Gegner werden in `comboGroups` gruppiert.
- Punkteformel: `10 * 2^(groupSize - 1)`.
- Combo-Größe beeinflusst Farbe, Partikel und Shake.

### 4.4 Zusatz-Missionsziele
Spätere Level können ein verzögertes Sammelziel aktivieren:
- Konfiguration in `levels.js` über `collectHearts`.
- Aktuell visuell als **Kirschen** gerendert.
- Spawn nach kurzer Anfangsverzögerung.
- Vier Sammelobjekte erscheinen näher um die Mitte, je eines pro innerem Quadranten.
- Sieg wird blockiert, bis das Hauptziel **und** alle Kirschen erfüllt sind.

## 5. Ring-System

### 5.1 Ring-Force-Prototyp
Der Modus `RING_FORCE` ist eine isolierte Sandbox:
- Spieler bewegen sich frei im Ringinneren.
- Nur Druck gegen die Innenwand verschiebt den Ring.
- Kein Nachgleiten ohne aktiven Druck.
- Umschaltbar zwischen 1, 2 und 3 Spielern.

### 5.2 Ring in echten Leveln
Die Ring-Physik wurde in die normalen Level integriert:
- Der Ringmittelpunkt ist der eigentliche Licht-/Trägerpunkt.
- Zusätzliche Spielerkörper laufen im Ringinneren.
- Gegnerkontakt mit einem aktiven Ring-Spieler oder dem Trägerpunkt führt zum Tod.
- Der Ring wird gegen Spielfeldrand und Säule begrenzt.

### 5.3 Ring-Eingaben
- `P1`: `WASD`
- `P2`: Pfeiltasten
- `P3`: `H`, `B`, `N`, `M`

## 6. Menü und Progression

### 6.1 Levelauswahl
- Alle Hauptlevel sind jederzeit direkt anwählbar.
- Erledigte Level sind hell markiert.
- Unerledigte Level bleiben dunkel, sind aber klickbar.
- Der alte zentrale Startbutton wurde entfernt, weil er durch die direkte Levelwahl überflüssig geworden ist.

### 6.2 Niederlage und Überspringen
- Im Lose-Overlay gibt es `Level überspringen`.
- Übersprungene Level gelten nicht als geschafft.

### 6.3 Persistenz
- Fortschritt liegt in `localStorage` unter `sj_v2_data`.
- Gespeichert werden Bestwerte pro Level in `saveData.bests`.
- `masterModeActive` ist nur sitzungsbasiert.

## 7. Eingabe

### Desktop
- `SOLO`: `WASD` oder Pfeiltasten bewegen.
- `COOP`: `WASD` bewegt, Pfeiltasten drehen das Licht.
- Ring-Modi: `WASD`, Pfeile, `HBNM`.

### Touch
- Touch-Steuerung wird erst nach echtem `touchstart` aktiviert.
- Linker Joystick: Bewegung.
- Rechter Joystick: nur im klassischen `COOP` für Lichtrotation.

## 8. Aktuelle Menü-Realität für Labyrinth
`Labyrinth` ist derzeit **nur vorbereitet**, noch nicht spielbar:
- eigener Menübildschirm mit eigener Überschrift,
- gleicher Grundrahmen wie das Hauptmenü,
- keine obere klassische `Solo/Koop`-Gruppe,
- `RINGS`-Sektion mit drei Platzhalterkarten,
- Platzhalter für spätere Labyrinth-Levelauswahl.

Die eigentliche Labyrinth-Logik existiert noch nicht. Dafür ist `docs/LABYRINTH_PREP.md` die wichtigste Startdatei.
