# Style Studio — Atelier Edition V6

Komplettes Browser-Spiel mit neu gestalteten Räumen, Werkzeugen und Figurenmaterialien.

## Starten

ZIP vollständig entpacken. Im entpackten Ordner ausführen:

    python3 -m http.server 8000

Anschließend die lokale Seite auf Port 8000 im Browser öffnen. Es sind keine npm-Pakete, Konten oder API-Schlüssel nötig. Die Grafiken liegen vollständig im Ordner `img`. Google Fonts sind optional; ohne Internet werden lokale Ersatzschriften verwendet.

## Spielen

- **Salon öffnen:** Kundinnen mit individuellen Wünschen bedienen, Wunschbild ansehen, Look abgeben und bewerten lassen.
- **Freies Stylen:** ohne Kundenauftrag ausprobieren.
- Werkzeuge aus der Ablage auf Haare beziehungsweise Gesicht ziehen. Alternativ Werkzeug antippen und anschließend auf der Figur anwenden.
- Haarfarbe lässt sich lokal aufmalen oder über „Alles“ komplett ändern.
- Die seitlichen Pfeile wechseln zwischen Haaren, Make-up und Outfit.
- Kleidung und Accessoires über Kategorien auswählen, mit den Farbpunkten umfärben; die Ablagen lassen sich seitlich verschieben.
- Haus, Zurücksetzen und Ton-Schalter stehen oben zur Verfügung.

## Neuer Körper in V6

- Hals und Oberkörper haben eine durchgehende Kontur. Weiche Übergänge, Schlüsselbeine und ein Schatten unter dem Kinn ersetzen die bisherige sichtbare Kante.
- Ein neuer ImageGen-Bildatlas modelliert Hals, Schultern, Oberkörper, Arme, Hände, Beine und Füße mit räumlicher Lichtwirkung.
- Die Hände haben fünf ausgearbeitete Finger mit dezenten Nägeln; die Beine weich modellierte Knie und Waden. Füße mit einzelnen Zehen schließen an die Knöchel an.
- Alle sieben Hautfarben färben die neuen Körperteile mit ein.
- Geschlossene Schuhe verdecken die Zehen passend zum Schnitt. In Sandalen und barfuß bleiben die neuen Füße sichtbar; Glasschuhe verwenden eine passende Fußkontur.
- Die bestehenden Ärmel- und Hosenkonturen bleiben mit der Figur abgestimmt. Auch Kunden-Wunschbilder und Menüporträts nutzen das neue Körpermodell.

## Neue Kleidung seit V5

- Passende Schulter- und Ärmelanschlüsse, schmalere Unterarm-Schnitte und Bündchen bis zum Handgelenk bei langen Ärmeln.
- Neue Schnitte für Ringelshirt, T-Shirt, Tanktop, Hoodie und Abendkleid.
- Unterschiedliche ImageGen-Stoffoberflächen für Baumwolle, Satin, Strick, Denim, Leder und Spitze.
- Materialeffekte auf allen 88 Kleidungs-, Schuh- und Taschenmodellen; individuelle Muster und Verzierungen bleiben erhalten.
- Vorschaubilder verwenden dieselben Körperproportionen wie Spielfigur und Kunden-Wunschbild.
- Alle 125 Auswahlstücke und 586 Farbvarianten bleiben verfügbar.

## Grafische Überarbeitung

- Drei mit ImageGen gestaltete Räume: Friseursalon, Make-up-Atelier und Ankleideboutique.
- 25 mit ImageGen gestaltete Werkzeugmotive. Die Spielablagen nutzen die passenden Motive für alle bisherigen Werkzeuge.
- Mit ImageGen gestaltete Oberflächen für Gesicht, Haare und Stoffe, eingebunden in die bearbeitbaren SVG-/Canvas-Ebenen.
- Neues Gesicht aus separaten ImageGen-Komponenten: modellierte Nase und Haut, weichere Augenform, glänzende Lippen und fein gezeichnete Augenbrauen.
- Rund 12 Prozent kleinere Augen mit passend skalierten Wimpern und Mascara-Pinselkoordinaten.
- Etwas breiterer, geschwungener Haarfall mit weichen Spitzen.
- Geschlossener Haaransatz am Scheitel und an den Schläfen; einzelne Haarfarben erzeugen keine transparenten Zwischenräume. Gezielte Rasur und Nachwachsen bleiben sichtbar.
- Breitere Schultern, kürzerer Hals und abgestimmte Körperlänge; Kleidung und Accessoires folgen denselben Körperproportionen, auch in den Wunschbildern.
- Neue Grafiken im platzsparenden WebP-Format; Bildmaße und Transparenz bleiben erhalten.
- Einheitliche Boutique-Oberfläche, neue Ablagen, Karten, Farbauswahl und Dialoge; Unterstützung für reduzierte Animationen.

Die Figuren bleiben dynamisch: Haare werden weiterhin simuliert, Make-up frei gemalt und Kleidungsstücke einzeln ausgetauscht. Es wird kein unbewegliches Figurenbild über das Spiel gelegt.

## Für weitere Bearbeitung mit Claude

`index.html` lädt die vorhandenen Spielmodule. `js/body.js` modelliert Hals und Körper aus dem transparenten ImageGen-Atlas `img/atelier-body.webp`, färbt ihn in der gewählten Hautfarbe und verbindet die Körperteile. `ART.body(skin, outfit)` liefert die vier bisherigen Zeichenebenen; das Outfit steuert die Fußdarstellung in Schuhen. `js/wardrobe.js` enthält die neuen Schnitte und Materialeffekte und berechnet passende Vorschaubilder. `js/clothes.js` stellt die gemeinsam verwendete Schnitt- und Ärmelgeometrie bereit. `js/figure.js` baut das neue Gesicht aus separaten Bildteilen auf und legt die gemeinsame Körpertransformation fest. `js/atelier.js` bindet Räume, Werkzeugmotive und weitere Materialien ein. `css/boutique.css` enthält die neue Oberfläche. `js/hair.js` zeichnet die weiterhin editierbaren Haare. Die Regeln und Kundenbewertung liegen in `js/game.js` und `js/client.js`.

Bildatlanten nicht beliebig zuschneiden: Die SVG-Ausschnitte und Materialkoordinaten beziehen sich auf die vollständigen Dateien.
