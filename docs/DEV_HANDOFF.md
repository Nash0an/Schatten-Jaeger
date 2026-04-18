# Dev Handoff

Diese Datei ist die praktische Übergabe für die weitere Entwicklung von Schatten-Jäger.

## Projektzustand (V2.7.0)
- **Menü-/Design-System neu:** 3-Schritt-Menü (Gerät → Spiel → Modus → Level) plus eigene Screens für Einstellungen und Credits. Per-Game-Theming über `#app-shell[data-theme]`.
- **Zwei Spielkarten:** `Schatten-Jäger` und `Panik-Lauf` (intern weiter `Labyrinth`).
- **`index.html` komplett neu strukturiert**; `styles.css` komplett neu geschrieben.
- **`game.js` unverändert** — versteckte Kompatibilitäts-Stubs (`#panel-classic`, `#panel-labyrinth`, `#tab-classic`, `#tab-labyrinth`, `#audio-init-btn`) halten die alten DOM-Hooks am Leben.
- **Gameplay weiter stabil:** Klassisches Hauptspiel und Panik-Lauf (inkl. Ring-Modi und Party-v1) laufen wie zuvor.
- **Fokus als Nächstes:** Settings persistieren, Party aus Panik-Lauf-Menü sauber routen, Level-Grid-Locked-State, Pause-Menü/HUD ins neue Design einziehen.

## Was gerade als abgeschlossen gilt (V2.7.0)
- **Menüfluss:** Gerätewahl, Spielwahl, Modus, Level, plus Back-Buttons und Animationen.
- **MenuFlow-Controller:** Navigation, Theming, `game.js`-Integration, `MutationObserver` gegen Inline-Hintergründe.
- **Design-System:** CSS-Tokens, Bebas Neue + Inter, animierte SVG-Logos (Licht-Puls / Feuerflackern), responsive Breakpoints.
- **Level-Grid:** 5/7/10-Spalten-Grid, stilisierte `completed`/`current-target`-Zustände inkl. `.best`-Zeile.
- **Party/Join/Rotate/Result-Panels:** auf das neue System übertragen.

## Was davon als wirklich verifiziert gilt
- **Desktop:** Menü-Navigation, Theming und Levelstart sind durchgespielt.
- **Gameplay:** Klassisches Hauptspiel und Panik-Lauf starten aus dem neuen Menü und verhalten sich unverändert.
- **Mobile lokal / Party:** müssen weiter auf echten Geräten getestet werden (v1-Strecke ist implementiert, aber kein breit verifizierter Alltags-Flow).

## Bekannte offene Punkte
- **Party aus Panik-Lauf-Menü** startet aktuell Schatten-Jäger `COOP` statt des Labyrinth-Modus.
- **Einstellungs-Toggles** (Audio, Screen-Shake, Reduzierte Bewegung) sind reine UI — keine Persistenz, keine Wirkung.
- **Kein Locked-Zustand** im Level-Grid; `game.js` rendert alle Level anwählbar.
- **Pause-Menü** und **In-Game-HUD** sind noch nicht auf das neue Design-System überführt.
- Labyrinth-Zeiten für `DUO`/`TRIO` bleiben der wichtigste Balancing-Punkt.
- Handgebaute Panik-Lauf-Level fehlen weiterhin — alles algorithmisch.
- Mobile-Playtesting auf echten Geräten (Portrait, Joystick, Ring-Labyrinth-Gefühl) ist weiter wichtig.
- Party-v1 braucht echten WLAN-Test mit Host + Lichtspieler-Handy.

## Nächste sinnvolle Schritte
1. **Party-Routing:** Panik-Lauf-Party in den Labyrinth-`COOP`-Zweig statt Schatten-Jäger führen.
2. **Settings-Persistenz:** `sj_v2_data` um `settings` erweitern (audio/shake/motion) und anwenden.
3. **Level-Grid:** expliziten Locked-State im Rendering einbauen (`game.js`-Seite oder CSS-Marker).
4. **Pause-Menü / HUD:** Ins neue Design-System überführen.
5. **Echtes Mobile-Playtesting** gegen Desktop.
6. **Party-WLAN-Test** mit zwei Geräten.
7. Danach gezielt entscheiden, ob Party-Stabilisierung oder Panik-Lauf-Balancing zuerst dran kommt.

## Wichtigste Dateien & Assets
- **UI-Shell:** `index.html` (enthält `MenuFlow`).
- **Design-System:** `styles.css`.
- **Spielelogik:** `game.js`, `levels.js`.
- **Assets:** `assets/images/`.
- **Doku:** `PROJECT_STATUS.md`, `docs/CHANGELOG.md`, `docs/ARCHITECTURE.md`, `DESIGN-REGELN.md`.

## Wo man im Code einsteigt
- **Menü-Controller:** `MenuFlow` am Ende von `index.html` (show/back/selectDevice/selectGame/selectMode/startParty/startTraining/toggleSetting).
- **Menü-Styles:** `styles.css` (Tokens im `:root`, Theme-Blöcke in `#app-shell[data-theme]`).
- **Spielstart:** `setMode()`, `startLevel()`, `renderLevelSelect()` in `game.js`.
- **Grafik/Hintergrund:** `drawBackground()` in `game.js`.
- **Labyrinth-Rendering:** `drawLabyrinth()` (beinhaltet die Holztextur-Logik).
- **Pfad-Generierung:** `createLabyrinthPath()` in `levels.js`.
- **Mobile Runtime / Framing:** `updateViewportMode()`, `getGameplayFrame()`, `getScaledLabyrinthPath()` in `game.js`.
- **Party / QR:** `startPartyLobby()`, `showPartyOverlay()`, `setupHostConnection()`, `handleControllerMessage()`, `updateController()`.

## Empfohlene Testreihenfolge
1. Menü-Check: Gerätewahl, Theming-Wechsel Schatten-Jäger ↔ Panik-Lauf, Back-Navigation.
2. Gameplay-Check: Ein Schatten-Jäger-Level und ein Panik-Lauf-Level starten und beenden.
3. Mobile-Check: Portrait erzwingen, Joystick testen, Panik-Lauf-Level auf dem Handy spielen.
4. Party-Check: Host starten, QR joinen, Lobby schließen, Countdown und Lichtsteuerung prüfen.
5. Performance-Check: Schattenwurf und Partikeleffekte bei vielen Gegnern.
