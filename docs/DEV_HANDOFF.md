# Dev Handoff

Diese Datei ist die praktische Übergabe für die weitere Entwicklung von Schatten-Jäger.

## Projektzustand (V2.6.0)
- **Stabilität:** Klassisches Hauptspiel und Labyrinth sind stabil und visuell ausgereift.
- **Design:** Die Grafik wurde durch modus-spezifische Hintergründe, Gittereffekte und Texturen (Holzsteg) auf ein neues Niveau gehoben.
- **Struktur:** Alle grafischen Assets sind professionell unter `assets/images/` organisiert.
- **Fokus:** Der Schwerpunkt liegt kurzfristig auf Mobile-Spielbarkeit, Party-Modus-Realtest und danach wieder auf Content/Balancing.

## Was gerade als abgeschlossen gilt
- **Hintergrundsystem:** Dynamischer Wechsel zwischen `bg-classic.png` und `bg-labyrinth.png` im Menü und im Spiel.
- **Labyrinth-Evolution:** 50% breitere Pfade, organische Sinus-Kurven und dunkle Holztextur (`tex-wood.png`).
- **UI-Polishing:** Zentrierte Menübuttons, konsistente Panel-Breite (700px), aufgehellte Overlays für bessere Bildwirkung.
- **Visuals:** Erhöhte Lampen-Intensität, dunkle Schattenkanten, helleres Gesamtspielfeld für besseren Kontrast.
- **Mobile Gameplay:** Portrait-Overlay, mobiles Spielfeld-Framing und runtime-gedrehte Labyrinth-Strecken fuer Handys.
- **Touch-Steuerung:** Der erste echte Touch zaehlt jetzt direkt auch fuer Ring- und Labyrinth-Bewegung.
- **Party-Modus v1:** Host-Lobby, QR-Join, Join-Warteraum und Countdown fuer klassisches `COOP` sind im Code verdrahtet.

## Was davon als wirklich verifiziert gilt
- **Desktop:** Klassisches Hauptspiel und Labyrinth sind die bestaetigte Hauptstrecke.
- **Mobile lokal:** Portrait-Flow, Joystick und Labyrinth-Framing sind implementiert, aber muessen weiter auf echten Geraeten gespielt werden.
- **Party-Modus:** Funktional verdrahtet, aber noch kein breit verifizierter Alltags-Flow mit echten Handys im selben WLAN.

## Wichtig vor der naechsten Session
- Die Doku beschreibt inzwischen bewusst **Ist-Zustand** und nicht nur Vision.
- `docs/MULTIPLAYER_CONCEPT.md` enthaelt jetzt sowohl den aktuellen `COOP`-QR-Stand als auch den spaeteren Ausbaupfad.
- Wenn beim naechsten Wiedereinstieg Mobile oder Party bearbeitet werden, zuerst echtes Verhalten gegen die Doku pruefen statt vom Konzept aus zu starten.

## Zukünftige Visionspunkte
1. **Grafische Erweiterungen:**
   - Eigene Sprites für Gegner (statt einfacher Kreise).
   - Animierte Partikel oder Effekte für Sammelziele (Kirschen).
2. **Level-Erweiterungen:**
   - Handgebaute Speziallevel für das Labyrinth mit Hindernissen.
   - Tuning der Level-Eigenschaften (Geschwindigkeit, Spawnraten).
3. **Sound-Design:**
   - Ausbau der Soundeffekte für Kollisionen, Zielerreichung und Umgebung.
   - Atmosphärische Hintergrund-Ambient-Sounds.
4. **Spielmechanik:**
   - Feinjustierung der Ring-Physik.
   - Eventuell neue Power-Ups oder Bestrafungen im Labyrinth.

## Wichtigste Dateien & Assets
- **Logik:** `game.js`, `levels.js`.
- **UI:** `index.html`, `styles.css`.
- **Assets:** `assets/images/` (Hintergründe und Texturen).
- **Doku:** `PROJECT_STATUS.md`, `docs/CHANGELOG.md`.

## Wo man im Code einsteigt
- **Grafik/Hintergrund:** `drawBackground()` in `game.js`.
- **Labyrinth-Rendering:** `drawLabyrinth()` (beinhaltet die Holztextur-Logik).
- **Pfad-Generierung:** `createLabyrinthPath()` in `levels.js`.
- **Mobile Runtime / Framing:** `updateViewportMode()`, `getGameplayFrame()`, `getScaledLabyrinthPath()` in `game.js`.
- **Party / QR:** `startPartyLobby()`, `showPartyOverlay()`, `setupHostConnection()`, `handleControllerMessage()`, `updateController()` in `game.js`.
- **UI-Steuerung:** `setMenuTab()` und `.menu-switch-btn` im CSS.

## Bekannte offene Punkte
- Sound-System ist noch rudimentär und wartet auf Ausbau.
- Labyrinth-Zeiten für Duo/Trio benötigen noch breiteres Playtesting.
- Handgebaute Level fehlen noch komplett im Labyrinth-Zweig.
- Mobile Playtesting auf echten Geraeten bleibt wichtig, vor allem fuer Portrait-Raender und Ring-Labyrinth-Gefuehl.
- Party-Modus muss mit echtem Host plus mindestens einem Handy auf Verbindungsabbrueche, Rejoin und Startfluss getestet werden.
- Die aktuelle Party-v1-Strecke ist bewusst nur `COOP`; Ring/Labyrinth ueber QR ist noch offen.

## Naechste sinnvolle Schritte
1. Ein echter Mobile-Check fuer `SOLO`, `COOP` und `LABYRINTH_RING_SOLO`.
2. Ein echter WLAN-Check fuer den Party-Modus mit Host + Lichtspieler-Handy.
3. Danach gezielt entscheiden, ob als naechstes Party-Stabilisierung oder Mobile-Labyrinth-Balancing wichtiger ist.

## Empfohlene Testreihenfolge
1. Visueller Check: Wechsel zwischen Classic- und Labyrinth-Menü (Hintergrundwechsel).
2. Mobile Check: Portrait erzwingen, Joystick testen, dann ein Labyrinth-Level auf dem Handy spielen.
3. Gameplay-Check: Ein Desktop-Labyrinth-Level spielen (Holztextur, Kurvenverlauf, Breite).
4. Party-Check: Host starten, QR joinen, Lobby schliessen, Countdown und Lichtsteuerung pruefen.
5. Performance-Check: Schattenwurf und Partikeleffekte bei vielen Gegnern.
