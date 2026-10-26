# Apothekenfamilie Hildesheim

Unabhängiges Website-Konzept für Einhorn-Apotheke, Apotheke am Theater und Steinberg-Apotheke. Mit lokalem Demoshop für Nahrungsergänzungsmittel. Keine offizielle Apotheken-Website.

## Lokal starten

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Anschließend http://127.0.0.1:4173 öffnen. Das Projekt benötigt zur Laufzeit weder einen Build noch externe JavaScript-Bibliotheken. Auch Schriften und Bilder werden lokal ausgeliefert. Relative Pfade unterstützen die Veröffentlichung in einem GitHub-Pages-Unterverzeichnis.

## Struktur

- `index.html`: semantische Seitenstruktur und recherchierte Standortprofile
- `style.css`: Layout, Komponenten, responsive Ansichten und Lesemodus
- `scripts/app.js`: Initialisierung, Navigation und Schriftgrößen-Einstellung
- `scripts/data/products.js`: Produktkatalog, Bildpfade und Originalquellen
- `scripts/data/locations.js`: Kontaktdaten, Öffnungszeiten und Standortleistungen
- `scripts/cart.js`: Warenkorbmodell mit validierten Mengen und Berechnung in Cent
- `scripts/cart-view.js`: Warenkorbansicht und simulierter Bestellabschluss
- `scripts/shop.js`: Produktsuche, Kategorien, Markenfilter und Übersicht
- `scripts/locations.js`: Standortauswahl und Tastaturbedienung der Tabs
- `scripts/dialogs.js`: Produktinformationen und Projekthinweise
- `scripts/utils.js`: Text-Escaping, Preisformatierung und lokale Einstellungen
- `tests/cart.test.js`: Prüfungen der Warenkorblogik und Kataloganforderungen
- `assets/products/sources.json`: Herkunftsnachweise für Produktbilder

## Funktionen

Der Demoshop zeigt zwölf Produkte aus vier Marken in der Reihenfolge Orthomol, ratiopharm, NomoSan und Doppelherz. Von NomoSan sind ausschließlich Nomoadult AMD und Nomoadult Glaukom plus enthalten. In der ersten Übersicht mit acht gemischten Produkten erscheint nur AMD an dritter Stelle; über den Markenfilter oder die erweiterte Auswahl sind beide Produkte zugänglich. Die Produkte können nach Kategorie und Marke gefiltert werden.

Der Bestellabschluss ist vollständig simuliert. Es gibt keinen Bestellserver, keine Zahlungsabwicklung, keine Reservierung und keine Benachrichtigung der Apotheken. Preise sind ausdrücklich frei gewählte Demonstrationspreise.

Das Foto der Inhaberin erscheint auf kleinen Bildschirmen unmittelbar unter der Navigation. Gut lesbare Grundschrift, ausreichend große Bedienelemente, sichtbare Tastaturfokusse und ein zusätzlicher Lesemodus unterstützen die Bedienung. Eine Zertifizierung der Barrierefreiheit wird nicht behauptet.

## Prüfen und formatieren

```sh
npm install
npm test
npm run format
```

Prettier ist ausschließlich ein Entwicklungswerkzeug. Die Website hat keine Paketabhängigkeiten zur Laufzeit.

## Veröffentlichung

Der Workflow `.github/workflows/pages.yml` veröffentlicht `main` über GitHub Pages. Pages muss im Repository auf GitHub Actions eingestellt sein.

## Quellen und Rechte

Recherche vom 26.10.2026:

- https://www.apotheke-am-theater-hildesheim.de/
- https://www.apotheke-am-theater-hildesheim.de/einhorn-apotheke
- https://www.steinberg-apotheke.de/
- https://nomosan-ug.com/

Weitere Original-Produktseiten sind im Produktkatalog und bei jedem Produktdetail verlinkt. Logos, Apothekenfotos und Produktbilder gehören ihren jeweiligen Rechteinhabern. Die Darstellung behauptet keine Markenpartnerschaft und keine tatsächliche Produktverfügbarkeit der Apotheken. Schriftlizenzen liegen im Verzeichnis `assets`.

## Lokale Daten

Ausschließlich Artikelkennungen, Mengen und Schriftgrößen-Einstellung werden im Browser gespeichert. Der frei gewählte Testname wird nur vorübergehend für die simulierte Bestellbestätigung verwendet. Es werden keine Kunden-, Gesundheits- oder Zahlungsdaten versendet. Analyse- und Marketingdienste sind nicht eingebunden.
