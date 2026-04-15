# Konzept: Party-Modus (3+ Spieler)

Dieses Dokument beschreibt die Vision für den Ausbau von **Schatten-Jäger** zu einem lokalen Multiplayer-Erlebnis für bis zu 4 Spieler.

## 1. Die Vision
Schatten-Jäger soll ein intensives Couch-Koop-Spiel werden, bei dem Kommunikation der Schlüssel zum Überleben ist. Anstatt dass nur zwei Personen die Kontrolle haben, wird die Verantwortung auf ein ganzes Team verteilt.

## 2. Rollenverteilung (Beispiel 4 Spieler)
Jeder Spieler übernimmt eine spezialisierte Aufgabe:

*   **Spieler 1 (Der Navigator):** Steuert die Bewegung der Spielfigur (WASD / Linker Stick). Er ist verantwortlich für die Positionierung im Raum.
*   **Spieler 2 (Der Lichtmeister):** Steuert die Rotation des Lichtkegels (Pfeiltasten / Rechter Stick). Er bestimmt, in welche Richtung der Schatten geworfen wird.
*   **Spieler 3 (Der Impulsgeber):** Verfügt über eine "Schockwelle" (Leertaste / Button A). Diese stößt Gegner in einem kleinen Radius um den Spieler kurzzeitig zurück – ein defensiver Notfallknopf.
*   **Spieler 4 (Der Fokus-Wächter):** Kann den Lichtstrahl bündeln (Shift / Button X). Der Lichtkegel wird schmaler, aber der geworfene Schatten wird deutlich länger und mächtiger (mehr Reichweite).

## 3. Technische Anforderungen
*   **Gamepad API:** Unterstützung für Controller ist zwingend erforderlich, da eine Tastatur für 4 Spieler zu klein ist.
*   **Visuelle Kennung:** Jeder Spieler bekommt eine eigene Farbe im UI (P1: Blau, P2: Gelb, P3: Rot, P4: Grün), um die Steuerung der Rollen intuitiv zu machen.

## 4. Neue Spielmechaniken für Teams
*   **Energie-Management:** Der Impuls von Spieler 3 benötigt eine Abkühlzeit (Cooldown).
*   **Team-Combos:** Wenn alle Spieler synchron agieren, könnten Spezial-Effekte ausgelöst werden (z. B. ein 360-Grad-Schattenblitz).

## 5. Nächste Schritte (Planung)
- [ ] Integration der Gamepad-Eingabe in die Basis-Architektur.
- [ ] Prototyp für die "Schockwelle" (Spieler 3).
- [ ] UI-Anzeige für Spieler-Rollen im Menü.
