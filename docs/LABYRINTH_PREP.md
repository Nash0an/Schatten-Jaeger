# Labyrinth Prep

Diese Datei hält den Stand direkt nach der ersten spielbaren Labyrinth-Implementierung fest und dient als Arbeitsgrundlage für das nächste Balancing.

## Was schon steht
- eigener Labyrinth-Menübildschirm
- echte Moduskarten für:
  - `SOLO`
  - `KOOP`
  - `TRIO`
- eigene Labyrinth-Levelauswahl
- eigener Levelsatz `LABYRINTH_LEVELS`
- 50 generierte Parkourlevels
- Zeitlimit pro Level
- Start-Countdown `3, 2, 1, LOS`
- Absturz beim Verlassen des Kurses
- Zielerreichung am Finishpunkt
- getrennte Labyrinth-Bestzeiten

## Technischer Einstiegspunkt
- Leveldaten: `levels.js`
- Menü/Levelauswahl: `index.html`, `styles.css`, `updateLevelSelect()`
- Labyrinth-Setup: `setupLabyrinthRun()`
- Labyrinth-Update: `updateLabyrinth()`
- Labyrinth-Render: `drawLabyrinth()`

## Wichtigste offene Aufgabe
Balancing.

Das betrifft vor allem:
- Trackbreiten
- Kurvenhärte
- Zeitlimits
- Koop-Zwang in `DUO` und `TRIO`
- Startgefühl und Countdown-Übergang

## Aktuelle Annahme
Die Zeitfenster in `DUO` und `TRIO` sind auf Kooperation gerechnet. Ein einzelner Spieler soll diese Modi im Regelfall nicht sinnvoll schaffen.

Im `SOLO` wurde das Zeitfenster zuletzt leicht gelockert. Das muss jetzt im echten Test überprüft werden, nicht mehr nur rechnerisch.

Außerdem gilt aktuell:
- `3`, `2`, `1` blockieren Bewegung.
- Sobald `LOS` sichtbar ist, darf der Ring losfahren.
- Die Zeit startet ebenfalls erst bei `LOS`.

## Nächste sinnvolle Reihenfolge
1. Labyrinth Level 1, 10, 20, 30, 40, 50 testen.
2. Solo-Zeiten weiter feinziehen, bis man kleine Fehler machen darf, aber nicht trödelt.
3. Danach Duo-/Trio-Zeiten testen und den Koop-Zwang prüfen.
4. Zu harte oder langweilige generierte Kurse ersetzen.
5. Danach Spezialelemente oder optisches Polish hinzufügen.

## Nicht als Nächstes tun
- Nicht zuerst neue Labyrinth-Sonderobjekte bauen.
- Nicht zuerst das klassische Spiel umbauen.
- Nicht zuerst Touch für Trio lösen, solange die Kernbalance im Browser noch nicht steht.
