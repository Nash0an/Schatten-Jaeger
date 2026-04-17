# Konzept: Party-Modus

Dieses Dokument trennt bewusst zwischen **aktuellem Stand** und **spaeterer Vision**, damit beim naechsten Wiedereinstieg nicht Konzept und bereits implementierte Strecke durcheinander geraten.

## 1. Aktueller Stand (v1)
- Zielmodus ist aktuell nur klassisches `COOP`.
- Host bleibt lokal Spieler 1 und steuert die Bewegung.
- Der erste Joiner per `?join=<sessionId>` wird Lichtspieler und nutzt auf dem Handy den rechten Stick.
- Ein zweiter Joiner darf aktuell nur als Reserve verbunden sein; fuer ihn existiert in v1 noch keine echte Spielaktion.
- Der Ablauf ist:
  - Host oeffnet Lobby
  - QR-Code / Join-URL wird angezeigt
  - Handy joint in Warteraum
  - Rolle wird zugewiesen
  - Host schliesst Einladungen
  - Countdown
  - Spielstart

## 2. Was fuer v1 schon stimmt
- Grundzustände `PARTY_LOBBY` und `PARTY_JOIN` existieren.
- PeerJS-Host/Join ist im Code verdrahtet.
- Rollenhinweis und Start-Countdown fuer Joiner sind vorhanden.
- Touch-Controller fuer den Lichtspieler ist im Join-Flow vorgesehen.

## 3. Was fuer v1 noch offen ist
- Realtests mit echten Handys im selben WLAN.
- Stabilitaet bei Disconnect, Rejoin und Host-Abbruch.
- Besseres Feedback fuer schwache oder fehlgeschlagene Verbindungen.
- Entscheidung, ob und wann ein zweiter Joiner mehr als Reserve sein soll.

## 4. Die spaetere Vision
Schatten-Jäger soll langfristig ein intensives Couch-Koop-Spiel werden, bei dem Kommunikation der Schluessel zum Ueberleben ist. Anstatt dass nur zwei Personen die Kontrolle haben, wird die Verantwortung auf ein ganzes Team verteilt.

## 5. Rollenverteilung (spaeteres Beispiel fuer 4 Spieler)
Jeder Spieler übernimmt eine spezialisierte Aufgabe:

*   **Spieler 1 (Der Navigator):** Steuert die Bewegung der Spielfigur (WASD / Linker Stick). Er ist verantwortlich für die Positionierung im Raum.
*   **Spieler 2 (Der Lichtmeister):** Steuert die Rotation des Lichtkegels (Pfeiltasten / Rechter Stick). Er bestimmt, in welche Richtung der Schatten geworfen wird.
*   **Spieler 3 (Der Impulsgeber):** Verfügt über eine "Schockwelle" (Leertaste / Button A). Diese stößt Gegner in einem kleinen Radius um den Spieler kurzzeitig zurück – ein defensiver Notfallknopf.
*   **Spieler 4 (Der Fokus-Wächter):** Kann den Lichtstrahl bündeln (Shift / Button X). Der Lichtkegel wird schmaler, aber der geworfene Schatten wird deutlich länger und mächtiger (mehr Reichweite).

## 6. Technische Anforderungen fuer den spaeteren Ausbau
*   **Gamepad API:** Unterstützung für Controller ist zwingend erforderlich, da eine Tastatur für 4 Spieler zu klein ist.
*   **Visuelle Kennung:** Jeder Spieler bekommt eine eigene Farbe im UI (P1: Blau, P2: Gelb, P3: Rot, P4: Grün), um die Steuerung der Rollen intuitiv zu machen.

## 7. Neue Spielmechaniken fuer Teams
*   **Energie-Management:** Der Impuls von Spieler 3 benötigt eine Abkühlzeit (Cooldown).
*   **Team-Combos:** Wenn alle Spieler synchron agieren, könnten Spezial-Effekte ausgelöst werden (z. B. ein 360-Grad-Schattenblitz).

## 8. Naechste reale Schritte
- [ ] Party-v1 mit Host + 1 Handy im WLAN komplett testen.
- [ ] Disconnect/Rejoin-Verhalten dokumentieren.
- [ ] Entscheiden, ob als naechstes Stabilisierung oder Ausbau auf weitere Rollen wichtiger ist.
- [ ] Erst danach an Spieler-3-/Spieler-4-Mechaniken oder Gamepad-Ausbau gehen.
