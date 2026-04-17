# Dev Handoff

Diese Datei ist die praktische Übergabe für die weitere Entwicklung von Schatten-Jäger.

## Projektzustand (V2.6.0)
- **Stabilität:** Klassisches Hauptspiel und Labyrinth sind stabil und visuell ausgereift.
- **Design:** Die Grafik wurde durch modus-spezifische Hintergründe, Gittereffekte und Texturen (Holzsteg) auf ein neues Niveau gehoben.
- **Struktur:** Alle grafischen Assets sind professionell unter `assets/images/` organisiert.
- **Fokus:** Der Schwerpunkt verlagert sich von der Grundarchitektur hin zu Content (Levelerweiterungen), Balancing (Sound/Physik) und detailliertem grafischen Polishing.

## Was gerade als abgeschlossen gilt
- **Hintergrundsystem:** Dynamischer Wechsel zwischen `bg-classic.png` und `bg-labyrinth.png` im Menü und im Spiel.
- **Labyrinth-Evolution:** 50% breitere Pfade, organische Sinus-Kurven und dunkle Holztextur (`tex-wood.png`).
- **UI-Polishing:** Zentrierte Menübuttons, konsistente Panel-Breite (700px), aufgehellte Overlays für bessere Bildwirkung.
- **Visuals:** Erhöhte Lampen-Intensität, dunkle Schattenkanten, helleres Gesamtspielfeld für besseren Kontrast.

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
- **UI-Steuerung:** `setMenuTab()` und `.menu-switch-btn` im CSS.

## Bekannte offene Punkte
- Sound-System ist noch rudimentär und wartet auf Ausbau.
- Labyrinth-Zeiten für Duo/Trio benötigen noch breiteres Playtesting.
- Handgebaute Level fehlen noch komplett im Labyrinth-Zweig.

## Empfohlene Testreihenfolge
1. Visueller Check: Wechsel zwischen Classic- und Labyrinth-Menü (Hintergrundwechsel).
2. Gameplay-Check: Ein Labyrinth-Level spielen (Holztextur, Kurvenverlauf, Breite).
3. Performance-Check: Schattenwurf und Partikeleffekte bei vielen Gegnern.
