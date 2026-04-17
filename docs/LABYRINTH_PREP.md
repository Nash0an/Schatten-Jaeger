# Labyrinth Prep

Diese Datei hält den sauberen Übergabestand fest, bevor die eigentliche `Labyrinth`-Programmierung beginnt.

## 1. Was schon vorhanden ist
- Das Menü hat bereits einen eigenen `Labyrinth`-Bildschirm.
- Der Wechsel zwischen `SCHATTEN-JÄGER` und `LABYRINTH` funktioniert über die runden Buttons rechts oben.
- Der `Labyrinth`-Bildschirm nutzt bewusst fast denselben Rahmen wie das Hauptmenü.
- Im `Labyrinth`-Bildschirm ist die obere klassische `SOLO`/`KOOP`-Zeile entfernt.
- Darunter existiert bereits die Gruppe `RINGS` mit Platzhalterkarten für:
  - `SOLO`
  - `KOOP`
  - `TRIO`
- Eine Platzhalter-Levelauswahl ist optisch angelegt, aber noch nicht funktional.

## 2. Was noch **nicht** existiert
- Keine `LABYRINTH_*`-Spielmodi im Code.
- Kein eigener Labyrinth-Levelsatz.
- Keine getrennte Progression für Labyrinth.
- Keine Labyrinth-spezifische Spielmechanik.
- Keine anklickbaren Labyrinth-Moduskarten.

## 3. Wahrscheinlich sinnvoller nächster Implementierungspfad

### Schritt 1: Moduszustände anlegen
Neue Modi einführen, z. B.:
- `LABYRINTH_RING_SOLO`
- `LABYRINTH_RING_DUO`
- `LABYRINTH_RING_TRIO`

Empfehlung:
- Die Benennung sollte sofort klar trennen zwischen
  - klassischem Hauptspiel,
  - Ring-Hauptspiel,
  - Labyrinth-Ringspiel.

### Schritt 2: Eigenen Levelsatz aufbauen
Nicht in `LEVELS` hineinmischen, sondern sauber trennen:
- entweder `LABYRINTH_LEVELS` in `levels.js`,
- oder später separate Datei.

### Schritt 3: Eigene Levelauswahl anbinden
Die aktuelle Platzhalterfläche im Labyrinth-Menü sollte später:
- echte Buttons erzeugen,
- nur Labyrinth-Level anzeigen,
- eigene Bestzeiten/-werte lesen.

### Schritt 4: Progression entscheiden
Noch offen ist, ob Labyrinth:
- dieselbe Save-Struktur teilt,
- oder einen eigenen Fortschrittspfad bekommt.

Empfehlung:
- getrennte Save-Keys innerhalb von `sj_v2_data`, damit das Hauptspiel stabil bleibt.

## 4. Technische Ankerstellen im Code
- Menüumschaltung: `setMenuTab()` in `game.js`
- Menü-Layout: `index.html`, `styles.css`
- Modusumschaltung Hauptspiel: `setMode()`
- Levelstart: `startLevel()`
- HUD/Menu Refresh: `updateUI()`, `updateLevelSelect()`

## 5. Wichtige Designentscheidung
Das Hauptspiel und `Labyrinth` sollten jetzt bewusst **nicht** vermischt werden.

Sauberer Weg:
- Hauptspiel bleibt stabil.
- Labyrinth bekommt eigene Modi.
- Labyrinth bekommt eigenen Levelsatz.
- Erst danach wird spezifische Labyrinth-Physik oder Wegelogik ergänzt.

## 6. Empfohlener Start für die nächste Session
Wenn die Labyrinth-Implementierung beginnt, dann in dieser Reihenfolge:
1. `LABYRINTH_*`-Modi im Code anlegen.
2. Platzhalterkarten klickbar machen.
3. Eigenen Labyrinth-Levelsatz aufsetzen.
4. Separate Labyrinth-Levelauswahl rendern.
5. Erst danach die eigentliche Labyrinth-Mechanik programmieren.
