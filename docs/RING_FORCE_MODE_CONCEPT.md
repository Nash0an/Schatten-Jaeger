# Konzept: Ring-Force-Modus

Dieses Dokument beschreibt den neu gedachten Ring-Modus fuer **Schatten-Jaeger**. Der Modus basiert nicht auf Spielern auf der Ringkante, sondern auf Spielern **im Inneren** eines schweren Rings.

## 1. Kernidee
- Der Ring ist ein grosser, schwerer, verschiebbarer Rahmen.
- Ein oder mehrere Spieler bewegen sich frei im Ringinneren.
- Der Ring bewegt sich nur dann, wenn ein Spieler die Innenwand beruehrt und weiter in diese Richtung drueckt.
- Ohne aktiven Druck bleibt der Ring stehen.

Das Modell ist bewusst spielphysikalisch und nicht voll realistisch gleitend. Der Ring soll sich schwer anfuehlen, aber klar lesbar und kontrollierbar bleiben.

## 2. Mentales Bild
Das richtige Bild ist:
- Eisflaeche oder sehr glatter Boden
- ein grosser Ring liegt um die Spieler herum
- die Spieler laufen im Inneren des Rings
- wer die Innenwand erreicht und weiter drueckt, verschiebt den ganzen Ring

Wichtig:
- freie Bewegung im Ringinneren ist von der Ringbewegung getrennt
- kein Innenwand-Kontakt bedeutet kein Schub auf den Ring
- Richtungswechsel erfordert, dass ein Spieler erst durchs Ringinnere zur anderen Seite laeuft

## 3. Physik- und Mechanik-Regeln

### 3.1 Spielerbewegung
Jeder Spieler hat eine lokale Position relativ zum Ringzentrum:

- `player.localPos`
- `player.radius`
- `player.speed`

Solange der Spieler innerhalb des erlaubten Innenradius bleibt, bewegt sich nur der Spieler.

### 3.2 Innenwand-Kontakt
Der Spieler darf die Ringinnenwand nicht durchqueren.

Definiere:
- `ring.radius`: Mittelpunkt bis Ringmitte
- `ring.thickness`: Ringdicke
- `innerPadding`: kleiner Sicherheitsabstand

Dann gilt fuer den maximalen Bewegungsradius des Spielerzentrums:

`innerLimit = ring.radius - ring.thickness - innerPadding - player.radius`

Wenn eine geplante Spielerbewegung `innerLimit` ueberschreitet:
- die Spielerposition wird auf `innerLimit` geklemmt
- der ueberzaehlige Bewegungsanteil gilt als geblockter Druck in diese Richtung

### 3.3 Ring-Schub
Nur dieser geblockte Anteil uebertraegt Kraft auf den Ring.

Vereinfacht:
- geplanter Schritt nach aussen
- Kollision mit der Innenwand
- Ueberschuss wird zu Ring-Schub

Dadurch gilt automatisch:
- Spieler laeuft frei in der Mitte -> Ring bleibt stehen
- Spieler lehnt gegen die Wand und drueckt weiter -> Ring verschiebt sich
- Spieler laesst los -> Ring stoppt sofort

### 3.4 Keine Nachgleit-Physik
Fuer den ersten Prototyp wird absichtlich **kein dauerhaftes Nachrutschen** verwendet.

Das bedeutet:
- Ringgeschwindigkeit entspricht direkt dem aktuellen Gesamtschub
- ohne Schub wird `ring.velocity = 0`

Das ist einfacher zu steuern und passt besser zu deinem Zielbild.

## 4. Zwei Spieler im selben Ring

Wenn zwei Spieler gleichzeitig im Ring sind:
- druecken beide auf dieselbe Innenwandseite, addiert sich ihr Schub
- druecken sie an entgegengesetzten Seiten, kompensieren sich ihre Kraefte
- drueckt nur einer, wirkt nur dessen Schub
- laeuft ein Spieler nur durch den Innenraum, bewegt er den Ring nicht

Das bildet genau die gewuenschte Logik ab:
- erst Kontakt
- dann Weiterdruecken
- dann Ringbewegung

## 5. Prototyp-Umsetzung im Repo

Der aktuelle lokale Prototyp nutzt deshalb diese vereinfachte Struktur:

1. Ring mit Translation auf dem Spielfeld
2. Zwei Spieler mit freier Innenraum-Bewegung
3. Kollisionsgrenze an der Ringinnenwand
4. Ringbewegung nur durch blockierten Input an der Innenwand
5. Sofortiger Stillstand ohne aktiven Druck

## 6. Warum dieses Modell richtig fuer den naechsten Schritt ist
- Es ist viel naeher an deinem beschriebenen Spielgefuehl.
- Es ist einfacher als echte Vollphysik mit Rutschen, Reibungsketten und Impulserhaltung.
- Es ist spaeter erweiterbar auf mehr Spieler.
- Es trennt sauber zwischen Innenraum-Bewegung und Ring-Schub.

## 7. Naechste sinnvolle Ausbaustufen
- Tangentiales Rutschen an der Innenwand noch sauberer modellieren.
- Spieler-Spieler-Kollisionen im Ringinneren ergaenzen.
- Optional spaet minimale Ringtraegheit statt Sofort-Stopp testen.
- UI fuer Mehrspieler und spaetere Netz-Synchronisation vorbereiten.

## 8. Konkrete Leitregel
Die wichtigste Regel fuer den ganzen Modus lautet:

**Ein Spieler bewegt den Ring nur dann, wenn seine geplante Bewegung von der Innenwand blockiert wird und er weiter in diese Wand hinein drueckt.**

Das ist der Kern des neuen Modells.
