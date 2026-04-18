# Design-Regeln für Schatten-Jäger

Sammlung von Best-Practices und Regeln für das visuelle und interaktive Design eines Desktop-/Mobile-Browserspiels (HTML5 Canvas). Grundlage für eine spätere Design-Überarbeitung von Schatten-Jäger.

---

## 1. Leitprinzipien (übergeordnet)

1. **Klarheit vor Dekoration.** Der Spieler muss in Bruchteilen von Sekunden erkennen können: *Was ist gerade wichtig? Was hat sich verändert? Was muss ich tun?*
2. **Cross-Platform von Anfang an.** Touch, Maus, Tastatur, Controller und unterschiedliche Bildschirmgrößen werden parallel gedacht — nicht im Nachhinein "drangeflanscht".
3. **Konsistenz.** Gleiche Farben, Icons und Begriffe bedeuten überall dasselbe. Ein roter Glow heißt im ganzen Spiel "Gefahr".
4. **Weniger ist mehr.** Lieber drei perfekt platzierte Elemente als zehn dekorative.
5. **Feedback auf jede Aktion.** Jeder Klick, jeder Kill, jeder Levelstart bekommt visuelles und/oder akustisches Feedback. Ohne Feedback fühlt sich das Spiel "tot" an.

---

## 2. Visuelle Hierarchie

- **Größe, Kontrast, Farbe und Bewegung** sind die vier Hebel, mit denen Wichtigkeit kommuniziert wird.
- **Wichtigstes Element zuerst.** Beim Blick auf den Bildschirm muss das Auge automatisch beim wichtigsten HUD-Element landen (z. B. Punkte oder verbleibende Zeit).
- **Maximal 3 visuelle Ebenen** auf einmal aktiv: Hintergrund (statisch/ruhig), Spielwelt (dynamisch), HUD (immer lesbar oben drüber).
- **Tote Räume nutzen.** Negativer Raum (leere Flächen) ist kein verschwendeter Platz, sondern ein Atemraum für die Augen.

---

## 3. Farbpalette und Atmosphäre

Schatten-Jäger ist ein dunkles, atmosphärisches Spiel über Licht und Schatten. Daraus folgt:

- **Begrenzte Palette** (5–8 Kernfarben). Mehr wirkt schnell chaotisch.
- **Dunkler Hintergrund + wenige helle Akzente** (Noir/Limbo-Prinzip): Das Auge wird zwingend dorthin gelenkt, wo Helligkeit ist.
- **Kontrastverhältnis ca. 3:1 als Startpunkt.** Höhere Kontraste (5:1+) für Gefahr/Highlights, niedrigere für Hintergrundelemente.
- **Farbe = Bedeutung:**
  - Warmes Gelb/Orange = Licht, Sicherheit, Spieler
  - Tiefes Schwarz/Indigo = Schatten, sicherer Raum für den Jäger
  - Rot = Gefahr, Tod, Verlust
  - Cyan/Weiß = Aktion erlaubt, Combo, Belohnung
- **Entsättigte Grundtöne** + gezielt platzierte gesättigte Farben für Aufmerksamkeit. Niemals alle Farben gleich grell.

---

## 4. Typografie

- **Maximal 2 Schriftarten** im ganzen Spiel: eine für Headlines/Menüs, eine für HUD/Fließtext.
- **Klarheit vor Stil.** Verschnörkelte Display-Fonts nur für Titel, niemals für Live-HUD-Daten.
- **Mindestgrößen:**
  - HUD (Score, Zeit): mind. 18–20 px auf Mobile, 24+ px auf Desktop
  - Menü-Buttons: mind. 16 px Schriftgröße
  - Body-Text: mind. 14 px
- **Hoher Kontrast zur Hintergrundfarbe.** Bei dunklem Spiel: helle Schrift mit leichtem Glow oder Outline, damit sie sich auch über Partikeleffekten abhebt.
- **Konsistente Schriftgröße pro Funktion.** Score sieht überall gleich aus, Buttons haben dieselbe Größe.

---

## 5. HUD (Heads-Up Display)

- **Nur lebenswichtige Infos permanent zeigen** (z. B. Punkte, Ziel, Zeit). Alles andere ins Menü.
- **Ecken nutzen, Mitte freihalten.** Die Spielwelt ist das Wichtigste — das HUD darf sie nicht zerschneiden.
- **Veränderungen animieren.** Score zählt hoch (nicht springt), Zeit pulsiert in den letzten Sekunden, Combo wächst dramatisch.
- **Diegetisch wo möglich.** Wenn Information Teil der Welt sein kann (z. B. Glow um den Spieler statt Lebensbalken), wirkt das immersiver.
- **Symbole + Text** kombinieren, statt Text alleine. Symbole werden schneller erfasst.

---

## 6. Mobile-Design / Touch-Steuerung

- **Touch-Targets mindestens 44×44 px** (Apple-Standard) bzw. 48×48 dp (Material-Standard), mit **8 px Abstand** zueinander.
- **Daumenzone respektieren.** Hauptaktionen (Joystick, Schießen, Pause) im **unteren Drittel** des Bildschirms — dort liegt der natürliche Daumenradius.
- **Keine kritischen Interaktionen oben in den Ecken.** Diese sind beim einhändigen Halten kaum erreichbar.
- **Sichtbares Feedback bei Touch:** Button-Press-State (Farbe, Skalierung, Glow) ist Pflicht. Sonst weiß der Nutzer nicht, ob sein Tap registriert wurde.
- **Touch-Bereich > Visueller Bereich.** Die anklickbare Zone darf größer sein als das sichtbare Icon — verzeiht Ungenauigkeit.
- **Kein Hover-Verlass.** Mobile hat kein Hover; alles muss per Tap funktionieren.

---

## 7. Responsives Layout

- **Spielfeld passt sich an Aspect Ratio an.** Unterstütze mindestens 9:16 (Mobile Portrait), 16:9 (Desktop), evtl. 4:3 und 21:9.
- **Letterboxing/Pillarboxing** ist ok, wenn das Spielfeld nicht beliebig skalieren kann — besser als verzerrte Inhalte.
- **HUD skaliert mit der Bildschirmgröße,** nicht mit der Pixelzahl. Auf einem 4K-Monitor darf der Score nicht winzig wirken.
- **Test auf mehreren Geräten:** mind. 360×800 (kleines Mobile), 1080p Desktop, 1440p+ Desktop.
- **Alles vektorbasiert oder hochaufgelöst** zeichnen, niemals verpixelt oder verzerrt.

---

## 8. "Game Juice" — das Spiel lebendig machen

Game Juice = die kleinen Effekte, die Aktionen sich gut anfühlen lassen. Schatten-Jäger hat schon einiges (Combo, Screen Shake) — hier die Regeln dazu:

- **Layered Feedback.** Jede wichtige Aktion bekommt mehrere Feedback-Ebenen: visuell + Sound + ggf. Haptik. Beispiel Kill: Partikel + Glow + Screen Shake + Sound.
- **Screen Shake dosiert einsetzen.** Stark = großer Combo / Tod. Schwach = einfacher Kill. Niemals dauerhaft, sonst ermüdet das Auge.
- **Partikel als Akzent, nicht als Tapete.** Sie sollen Bewegung und Reaktion zeigen, dürfen aber die Spielinfos nicht überdecken.
- **Animationen statt Sprünge.** Score zählt hoch, Buttons skalieren beim Klick, Menüs faden ein.
- **Antizipation + Reaktion + Nachklang.** Jede Aktion hat: kleinen Vorlauf (z. B. Aufladen) → Hauptmoment → Ausklang (z. B. Partikel verglimmen).
- **Vorsicht vor Übertreibung.** Zu viel Juice lenkt von schwachen Mechaniken ab und macht müde. Lieber gezielt einsetzen.

---

## 9. Menüs und Übergänge

- **Maximal 5–7 Optionen pro Menü-Ebene.** Mehr überfordert.
- **Eine eindeutige Primäraktion** pro Bildschirm (z. B. großer "Spielen"-Button), Sekundäraktionen dezenter.
- **Keine Sackgassen.** Jeder Bildschirm hat einen klaren Weg zurück.
- **Übergänge unter 300 ms.** Sonst fühlt sich das Spiel träge an. Snappy = professionell.
- **Lade-/Übergangsbildschirme** kurz, mit Bewegung (sonst wirkt das Spiel hängend).

---

## 10. Accessibility / Barrierefreiheit

- **Nicht nur über Farbe kommunizieren.** Rot = Gefahr ist okay, aber zusätzlich Form/Bewegung nutzen (Farbenblindheit!).
- **Lesbare Schriftgrößen.** Siehe Typografie-Sektion.
- **Reduced-Motion-Option.** Manche Spieler kriegen von Screen Shake Übelkeit — optional abschaltbar.
- **Sound nicht essenziell machen.** Wichtige Infos auch visuell zeigen.
- **Tastatur-Steuerung als Alternative** auf Desktop, nicht nur Maus.

---

## 11. Performance als Designprinzip

- **60 FPS sind das Ziel.** Alles unter 30 FPS fühlt sich kaputt an.
- **Nur neu zeichnen, was sich verändert.** Statische Hintergründe nicht jeden Frame neu rendern.
- **Partikelanzahl begrenzen.** Auf schwacher Hardware sollten Effekte automatisch reduziert werden.
- **Sound-Pooling.** Audio-Dateien wiederverwenden, nicht ständig neu instanziieren.

---

## 12. Konkrete Checkliste für Schatten-Jäger

Anwendung der Regeln auf das aktuelle Spiel:

- [ ] Farbpalette auf 5–8 Kernfarben festlegen und dokumentieren
- [ ] Eine HUD-Schrift, eine Menü-Schrift festlegen
- [ ] Mindestgrößen für Touch-Buttons prüfen (44×44 px+)
- [ ] HUD auf kleinste Mobile-Auflösung (360×800) testen
- [ ] Reduced-Motion-Option für Screen Shake prüfen
- [ ] Konsistenz: bedeutet Rot überall dasselbe? Gelb? Cyan?
- [ ] Menüs: max. 7 Optionen pro Ebene?
- [ ] Übergänge zwischen Menü/Spiel/Win/Lose snappy (<300 ms)?
- [ ] Score, Zeit und Combo gut lesbar bei laufendem Partikelchaos?
- [ ] Funktioniert das Spiel in Portrait und Landscape?

---

## Quellen

- [5 Best Practices for Game UI Design — Procreator](https://procreator.design/blog/best-practices-for-game-ui-design/)
- [11 Proven Mobile App UI/UX Design Principles for 2026 — Design Studio](https://www.designstudiouiux.com/blog/principles-mobile-app-design/)
- [Mobile-First Gaming Platforms 2026 — Digital Edge](https://digitaledge.org/how-mobile-first-gaming-platforms-are-redefining-user-experience-in-2026)
- [A Full Guide To Mobile Game Design — Innovecs Games](https://www.innovecsgames.com/blog/mobile-game-design/)
- [Responsive Design for Games — Get Armature](https://getarmature.com/responsive-design-for-games/)
- [Playables Design Best Practices — Google for Developers](https://developers.google.com/youtube/gaming/playables/certification/best_practices_design)
- [Designer's Guide to Touch Controls — Microsoft Learn](https://learn.microsoft.com/en-us/gaming/gdk/docs/features/common/game-streaming/building-touch-layouts/game-streaming-tak-designers-guide)
- [Let's Talk About Touching: Touchscreen Controls — Game Developer](https://www.gamedeveloper.com/design/let-s-talk-about-touching-making-great-touchscreen-controls)
- [Principles Of HTML5 Game Design — Smashing Magazine](https://www.smashingmagazine.com/2015/09/principles-of-html5-game-design/)
- [Juice in Game Design — Blood Moon Interactive](https://www.bloodmooninteractive.com/articles/juice.html)
- [The "Juice" Problem: Exaggerated Feedback — Wayline](https://www.wayline.io/blog/the-juice-problem-how-exaggerated-feedback-is-harming-game-design)
- [Lighting Design Fundamentals: Contrast — Game Developer](https://www.gamedeveloper.com/art/lighting-design-fundamentals-using-contrast-in-your-game)
- [Color in Video Games: How to Choose a Palette — Kongregate](https://blog.kongregate.com/color-in-video-games-how-to-choose-a-palette/)
- [Colour Palettes In Horror Videogames — PekoeBlaze](https://pekoeblaze.wordpress.com/2021/05/23/colour-palettes-in-horror-videogames/)
- [Game HUD Essentials — Page Flows](https://pageflows.com/resources/game-hud/)
- [Video Game HUD & UI Design Guide — Sunstrike Studios](https://sunstrikestudios.com/en/HUD_design_in_games)
- [Mastering HUD Design in Game Development — Number Analytics](https://www.numberanalytics.com/blog/ultimate-guide-to-hud-design-in-game-programming)
