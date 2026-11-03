# Style Studio — Atelier Edition V4

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

`index.html` lädt die vorhandenen Spielmodule. `js/figure.js` baut das neue Gesicht aus separaten Bildteilen auf. `js/atelier.js` enthält die neue Grafik-Einbindung und legt die Bildausschnitte aus den Atlanten fest. `css/boutique.css` enthält die neue Oberfläche. `js/hair.js` zeichnet die weiterhin editierbaren Haare. Die Regeln und Kundenbewertung liegen in `js/game.js` und `js/client.js`.

Bildatlanten nicht beliebig zuschneiden: Die SVG-Ausschnitte und Materialkoordinaten beziehen sich auf die vollständigen Dateien.
