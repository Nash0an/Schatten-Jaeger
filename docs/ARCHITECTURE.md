# Architektur: Schatten-Jäger

Dieses Dokument beschreibt den aktuellen technischen Stand von `Schatten-Jäger` so, dass morgen oder ein anderer Entwickler ohne Rekonstruktion direkt weiterarbeiten kann.

## 1. Projektform
- Reines Browser-Spiel ohne Build-Prozess.
- Rendering über HTML5 Canvas.
- Audio über Web Audio API.
- Kernlogik zentral in `game.js`.

## 2. Wichtige Dateien
- `index.html`: Canvas, HUD, Menü, Win-/Lose-Overlays.
- `styles.css`: HUD, Menü, Touch-Joysticks und Menü-Layout.
- `levels.js`: klassischer Hauptlevelsatz `LEVELS` und separater `LABYRINTH_LEVELS`.
- `game.js`: State-Machine, Eingabe, Menülogik, Ring-Physik, Hauptspiel, Labyrinth.
- `assets/images/`: Verzeichnis für grafische Assets (Hintergründe, Texturen).
- `PROJECT_STATUS.md`: komprimierter Projektstatus.
- `docs/QUICK_CONTEXT.md`: schnellster Wiedereinstieg.
- `docs/DEV_HANDOFF.md`: praktische Übergabe mit Startpunkten, offenen Aufgaben und Testfokus.
- `docs/LABYRINTH_PREP.md`: offener Reststand für Labyrinth-Balancing und Ausbau.

## 3. Rendering-System
Das Spiel nutzt ein geschichtetes Rendering auf einem einzigen Canvas:
1. **Hintergrund:** `drawBackground()` zeichnet modus-abhängige Bilder (`bg-classic.png` / `bg-labyrinth.png`), ein technisches Gitter und eine Vignette.
2. **Schatten/Licht:** Dynamische Berechnung von Schatten-Polygonen basierend auf der Säulenposition.
3. **Welt-Objekte:** Pfade (im Labyrinth mit Holztextur), Gegner, Partikel und Spielerfiguren.
4. **UI/HUD:** Overlay-Elemente direkt auf dem Canvas oder als HTML-Overlays.

## 4. Entwickler-Start

Wenn du nach einer Pause wieder einsteigst, nimm diese Reihenfolge:
- `docs/QUICK_CONTEXT.md` für den 60-Sekunden-Überblick.
- `docs/DEV_HANDOFF.md` für die direkte Arbeitsaufnahme.
- `docs/LABYRINTH_PREP.md`, wenn du an Labyrinth weitermachst.
- Danach erst `game.js` und `levels.js`.

## 4. Zustände
- `MENU`
- `PLAYING`
- `WIN`
- `LOSE`
- `PARTY_LOBBY`
- `PARTY_JOIN`
- `RING_FORCE`

`RING_FORCE` bleibt eine separate Sandbox. `PLAYING` deckt sowohl klassisches Hauptspiel als auch Labyrinth ab.

## 5. Aktive Spielmodi

### Klassisches Hauptspiel
- `SOLO`
- `COOP`
- `RING_SOLO`
- `RING_DUO`
- `RING_TRIO`

### Labyrinth
- `LABYRINTH_RING_SOLO`
- `LABYRINTH_RING_DUO`
- `LABYRINTH_RING_TRIO`

## 6. Hauptspiel-Systeme

### Schatten und Licht
- `getShadowPoly()` berechnet den Schattenbereich der Säule.
- Im `SOLO`- und Ring-Spiel ist das Licht radial.
- Im klassischen `COOP` ist das Licht gerichtet über `lightAngle`.

### Gegner
- Gegner spawnen an Bildschirmrändern.
- Gegner laufen auf den aktiven Träger-/Spielerpunkt zu.
- Tod über Kreis-Kollision.
- Tötung im Schatten via `isPointInPoly()`.

### Combo-System
- Gruppenbildung über `comboGroups`.
- Punkteformel: `10 * 2^(groupSize - 1)`.
- Combo-Größe beeinflusst Farbe, Partikel und Shake.

### Zusatzziele
- Spätere Hauptlevel können früh spawnende Kirschen aktivieren.
- Sieg gilt dann erst, wenn Hauptziel und Kirschen erfüllt sind.

## 7. Ring-System

### Ring-Force-Sandbox
- Freie Bewegung im Ringinneren.
- Ringbewegung nur über Druck gegen die Innenwand.
- Kein freies Nachgleiten.
- Sandbox kann 1, 2 oder 3 Spieler simulieren.

### Ring in echten Levels
- Der Ringmittelpunkt ist Träger- und Lichtpunkt.
- Aktive Spielerkörper laufen im Ringinneren.
- Gegnerkontakt mit aktiven Ring-Spielern oder Trägerpunkt ist tödlich.

### Ring-Eingaben
- `P1`: `WASD`
- `P2`: Pfeiltasten
- `P3`: `H`, `B`, `N`, `M`

## 8. Labyrinth-System

### Grundidee
`Labyrinth` ist ein Parkour-Zweig:
- Der Ring fährt einen Kurs entlang.
- Verlässt der Ring den Kurs, geht das Level verloren.
- Das Ziel muss innerhalb eines Zeitlimits erreicht werden.

### Leveldaten
Der Labyrinth-Zweig nutzt `LABYRINTH_LEVELS`:
- 50 Level
- eigener Name pro Level
- steigender Schwierigkeitswert
- Trackbreite pro Level
- normalisierte Pfadpunkte

Aktuell werden diese Level algorithmisch erzeugt und sind als erste Testreihe gedacht.

### Laufzeitlogik
Beim Start eines Labyrinth-Levels wird:
- der Pfad auf die aktuelle Bildschirmgröße skaliert,
- auf Mobile-Portrait-Laufzeit zuerst um 90 Grad gedreht und neu eingerahmt,
- die Parkour-Länge berechnet,
- daraus ein Zeitlimit für den aktuellen Modus abgeleitet,
- der Ring auf den Startpunkt gesetzt.
- vor dem eigentlichen Lauf ein Start-Countdown `3, 2, 1, LOS` gezeigt.

Wichtig:
- Bewegung ist bei sichtbarem `LOS` erlaubt.
- Die Labyrinth-Zeit startet ebenfalls mit `LOS`, nicht vorher.

### Zeit- und Koop-Logik
- `SOLO` ist aktuell bewusst leicht lockerer als der erste Entwurf gerechnet.
- `DUO` und `TRIO` werden absichtlich auf Kooperation gerechnet.
- In `DUO`/`TRIO` wird Fortschritt stark abgebremst, wenn nicht mindestens zwei Spieler gleichzeitig aktiv schieben.

Dieser Bereich ist aktuell der wichtigste Balancing-Punkt im Projekt.

### Wichtige Code-Einstiegspunkte
- `getLevelsForMode()`: trennt klassischen und Labyrinth-Levelsatz.
- `setMenuTab()` und `setMode()`: Menü- und Modusumschaltung.
- `startLevel()`: zentraler Einstieg für Levelstart und Modus-Setup.
- `setupLabyrinthRun()`: baut die Laufzeitdaten für den Parkour.
- `updateLabyrinth()`: Countdown, Zeitlogik, Koop-Zwang, Absturz, Ziel.
- `drawLabyrinth()`: kompletter Labyrinth-Renderpfad.
- `updateRingLevelMovement()`: Ring-Steuerung in echten Levels.

### Track-Prüfung
- Die Ringmitte wird gegen die nächste Segmentdistanz des Parkours geprüft.
- Wird die erlaubte Distanz überschritten, gilt der Ring als heruntergefallen.
- Das Ziel zählt nur bei genügend Fortschritt plus Nähe zum Finishpunkt.

## 9. Menü
Das Menü nutzt zwei Panels:
- `panel-classic`
- `panel-labyrinth`

Der Wechsel erfolgt über `setMenuTab()`.

### Classic-Panel
- klassische Hauptmodi
- Ring-Modi
- Hauptlevelauswahl

### Labyrinth-Panel
- eigene Überschrift `LABYRINTH`
- nur `RINGS`-Gruppe
- eigene Labyrinth-Levelauswahl

## 10. Progression und Savegame
- Savegame-Key: `sj_v2_data`
- Klassische Bestwerte: `saveData.bests`
- Labyrinth-Bestwerte: `saveData.labyrinthBests`
- `masterModeActive` bleibt sitzungsbasiert

Alle Levels sind direkt anwählbar. Der alte zentrale Startbutton wurde entfernt.

## 11. Touch
- Mobile-Geräte werden über Coarse-Pointer/Touch plus Viewport-Heuristik erkannt.
- Auf Mobile wird Gameplay im Hochformat erzwungen; im Querformat blockiert ein Rotate-Overlay den Lauf.
- Touch wird auf Mobile direkt beim Runtime-Start vorbereitet, damit der erste echte Stick-Kontakt bereits Eingabe liefert.
- Linker Joystick: Bewegung.
- Rechter Joystick: nur im klassischen `COOP` für Lichtrotation.
- Im QR-Join-Modus nutzt der Lichtspieler ebenfalls den rechten Joystick; der Joiner landet zuerst im Warteraum und erst nach dem Countdown in der Controller-Ansicht.

Für `LABYRINTH_RING_DUO` und `LABYRINTH_RING_TRIO` gibt es noch kein wirklich gutes Touch-Konzept.

## 12. Input-Schichten
- Tastatur, lokaler Touch und Remote-Inputs laufen ueber gemeinsame Hilfsfunktionen statt ueber getrennte Spezialfaelle in jedem Modus.
- `SOLO` kombiniert Tastatur plus linken Touch-Stick.
- `COOP` trennt Bewegung und Lichtrotation logisch:
  - Host / lokaler Spieler 1: Bewegung
  - lokaler rechter Stick oder QR-Joiner: Lichtrotation
- Ring-/Labyrinth-Modi nutzen dieselbe Input-Pipeline weiter; der linke Stick speist auch die Ringbewegung.

## 13. Mobile Portrait Runtime
- `isMobileGameplay`: aktiviert mobiles Framing, Portrait-Zwang und Touch-Layout.
- `requiresPortrait`: blockiert Gameplay im Querformat auf Handys.
- `isPortraitGameplay`: schaltet die mobilen Spielränder, HUD-Abstände und Joystick-Positionen.
- Classic-Level werden auf Mobile nicht mathematisch rotiert, sondern neu eingerahmt.
- Labyrinth-Pfade bleiben als ein Levelsatz in `levels.js`, werden aber zur Laufzeit fuer Mobile-Portrait gedreht und neu skaliert.

## 14. Party-Modus v1
- Zielmodus ist bewusst nur klassisches `COOP`.
- Host bleibt Spieler 1 und bewegt die Figur lokal.
- Der erste Joiner ueber `?join=<sessionId>` wird Lichtspieler.
- Ein zweiter Joiner darf als Reserve beitreten, hat in v1 aber noch keine eigene Spielaktion.

### Host-Ablauf
- `startPartyLobby()` oeffnet die Lobby und erzeugt einen PeerJS-Host.
- `showPartyOverlay()` zeigt QR-Code, Join-URL, Spielerstatus und Netzwerkhinweise.
- `closeLobbyAndStart()` schliesst nur die Einladungen.
- `startPartyGame()` sendet Countdown, danach `game-start`, und startet erst dann das Match.

### Join-Ablauf
- Joiner starten direkt im Zustand `PARTY_JOIN`.
- Nach erfolgreichem Verbindungsaufbau sehen sie zuerst Warteraum und Rollenkarte.
- Nach `lobby-closed` warten sie auf den Countdown.
- Nach `game-start` wird die Controller-Oberflaeche freigeschaltet.

### Nachrichtenmodell
- Verwendete Hauptnachrichten:
  - `joined`
  - `slot-assigned`
  - `lobby-closed`
  - `countdown`
  - `game-start`
  - `session-full`
  - `host-missing`
  - `session-ended`

## 15. Stabil vs. offen

### Stabil
- Klassisches Hauptspiel mit `SOLO` und `COOP`.
- Ring-Modi in normalen Levels.
- Direkte Levelwahl und Skip-Logik.
- Separater Labyrinth-Menüfluss.
- Labyrinth-Grundengine mit Countdown, Zeitlimit, Absturz und Ziel.
- Mobile Portrait-Gameplay mit Rotate-Overlay, neuem Framing und Labyrinth-Laufzeitrotation.
- Party-Modus v1 fuer klassisches `COOP` mit Host-Lobby, QR-Join, Warteraum und Start-Countdown.

### Offen
- Labyrinth-Zeiten vor allem für `DUO` und `TRIO`.
- Qualität der generierten Labyrinth-Kurse.
- Touch-Konzept für mehr als einen Ring-Spieler im Labyrinth.
- Mehrspieler-Ring/Labyrinth ueber QR ist noch nicht Teil der freigegebenen Party-v1-Strecke.
- Feintuning von Trackbreiten, Kurvenhärte und Koop-Zwang.
