# Architektur: Schatten-Jäger

Dieses Dokument beschreibt den aktuellen technischen Stand von **Schatten-Jäger (v2.5.1)**.

## 1. Stack und Aufbau
- **Rendering:** HTML5 Canvas API.
- **Audio:** Web Audio API mit prozeduralen Sounds.
- **Sprache:** Modernes JavaScript ohne Build-Tooling.
- **Struktur:** Eine zentrale Klasse `SchattenJaeger` in `game.js`.

## 2. Hauptdateien
- `index.html`: Canvas, HUD, Menü-, Win- und Lose-Overlay.
- `game.js`: Spielzustand, Eingabe, Rendering, Gegnerlogik, Audio, Progression.
- `levels.js`: `LEVELS`-Array mit allen Missions- und Balancingdaten.
- `styles.css`: HUD, Menü, Buttons und Touch-Joysticks.

## 3. State-Machine
- `MENU`: Levelauswahl, Moduswahl, Cheat-Eingaben.
- `PLAYING`: Aktive Spielschleife.
- `WIN`: Ziel erfüllt, Rekord prüfen, Progression speichern.
- `LOSE`: Treffer durch Gegner oder Missionsfehler.

`loop()` ruft dauerhaft `update()` und `draw()` auf. Fachlogik läuft nur in `PLAYING`.

## 4. Kernmechaniken

### Schattenberechnung
`getShadowPoly()` berechnet über Tangenten an die Säule ein Polygon, das den tödlichen Schattenbereich beschreibt. Im Koop-Modus ist der Schatten zusätzlich vom aktuellen Lichtwinkel abhängig.

### Gegner und Kollision
- Spieler/Gegner: Kreis-Kollision.
- Gegner/Schatten: `isPointInPoly()` per Ray-Casting.
- Spawn und Balancing kommen direkt aus dem aktuellen Levelobjekt.

### Combo-System
Nahe Gegner werden in `comboGroups` über Objekt-Referenzen gruppiert. Punkte folgen `10 * 2^(groupSize - 1)`. Combo-Größe beeinflusst Farbe, Partikel und Screen Shake.

## 5. Eingabe
- **Desktop Solo:** `WASD` und Pfeiltasten bewegen.
- **Desktop Koop:** `WASD` bewegt, Pfeiltasten rotieren das Licht.
- **Touch:** Joysticks werden erst nach dem ersten echten `touchstart` initialisiert. Links ist Bewegung, rechts nur im Koop-Modus Lichtrotation.
- **Menü-Cheats:** `angimylove` aktiviert temporären Meister-Modus, `exit` deaktiviert ihn.

## 6. Persistenz und Progression
`localStorage` speichert `sj_v2_data` mit `unlockedLevel` und `bests`. Der Meister-Modus lebt nur in der aktuellen Sitzung (`masterModeActive`) und überschreibt die gespeicherte Progression nicht. Falls alte Daten durch frühere Bugs zu viele Level freigeschaltet haben, wird der Fortschritt beim Start aus den vorhandenen Bestzeiten zurückgerechnet.
