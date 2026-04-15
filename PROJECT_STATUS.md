# Projektstatus: Schatten-Jäger

## Aktueller Stand
Das Spiel ist auf dem Stand **v2.5.1**. Der Fokus lag zuletzt auf Stabilität, Mobile-Usability und einer sauberen Menü-/Startlogik.

### Technischer Status
- Reines HTML5-Canvas-Projekt ohne externe Libraries.
- Kernlogik in `game.js`, Leveldaten in `levels.js`.
- 51 spielbare Level (`0` bis `50`).
- Persistenz über `localStorage` (`sj_v2_data`).

### Zuletzt stabilisiert
- Solo-/Koop-Umschaltung im Menü reagiert wieder zuverlässig auf Touch und Pointer.
- Levelstart, HUD-Timer, Missions-Splash und Spawn-Animation laufen wieder korrekt.
- Meister-Modus ist jetzt **temporär pro Sitzung** und kann im Menü mit `exit` beendet werden.
- Alte versehentliche Komplett-Freischaltungen werden aus vorhandenen Bestzeiten zurückgerechnet.

### Dokumentation
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): Technischer Ist-Zustand.
- [docs/CHANGELOG.md](docs/CHANGELOG.md): Versions- und Bugfix-Historie.
- [docs/ROADMAP.md](docs/ROADMAP.md): Nächste sinnvolle Ausbauschritte.
- [docs/QUICK_CONTEXT.md](docs/QUICK_CONTEXT.md): Kurzkontext für den nächsten Einstieg.

### Bekannte Arbeitsweise
- Änderungen zuerst gegen `game.js` und `levels.js` prüfen; ältere Doku kann hinterherhinken.
- Für Gameplay-Änderungen immer Desktop- und Touch-Verhalten mitdenken.
- Meister-Modus ist Debug-/Freischaltwerkzeug, kein persistentes Progressionssystem.
