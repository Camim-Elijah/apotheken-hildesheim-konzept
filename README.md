# Apothekenfamilie Hildesheim · Designkonzept

Responsive, statische Website für Einhorn-Apotheke, Apotheke am Theater und Steinberg-Apotheke. Unabhängiger Entwurf, keine offizielle Apotheken-Website.

## Start

`python3 -m http.server 4173`

Danach http://localhost:4173 öffnen. Kein Build und keine Installation erforderlich. Relative Asset-Pfade funktionieren auf GitHub Pages in Unterverzeichnissen.

## Funktionen

- Drei Original-Logos und echte Apothekenfotos
- Standortwechsel, recherchierte Öffnungszeiten, Telefon, E-Mail und Routenlinks
- Beratungsakkordeon und redaktionelle Artikeldialoge
- Acht illustrative NEM-Produkte, Kategorien, Suche, Produktdetails
- Persistenter lokaler Demo-Warenkorb mit Mengenänderung und Entfernen
- Simulierter Abholabschluss ohne Backend, Zahlung oder Übermittlung
- Tastaturbedienbare Dialoge und Standort-Tabs; reduzierte Bewegung

## Veröffentlichung

Die GitHub-Actions-Datei `.github/workflows/pages.yml` veröffentlicht den Stand von `main` über GitHub Pages. Im Repository muss Pages auf GitHub Actions eingestellt sein.

## Fakten und Quellen

Recherche: 26.10.2026. Logos und Fotos wurden direkt von den Original-Websites übernommen, nicht verändert und nicht als eigene Werke ausgegeben.

- https://www.apotheke-am-theater-hildesheim.de/
- https://www.apotheke-am-theater-hildesheim.de/einhorn-apotheke
- https://www.apotheke-am-theater-hildesheim.de/aktuelles
- https://www.steinberg-apotheke.de/
- https://www.hildesheim-tourismus.de/marktplatz
- https://www.hildesheim-tourismus.de/sehen-und-erleben/sehenswuerdigkeiten

Instagram ist verlinkt; der Abruf war nicht zuverlässig möglich. Keine Instagram-Posts übernommen.

Produktdarstellungen, Preise und Packungsgrößen sind ausdrücklich fiktive Beispiele, keine echten Angebote und keine Markenpartnerschaften. Produktpackungen bestehen aus eigenem HTML/CSS. Keine therapeutischen Produktversprechen. Die Logos und Apothekenfotos verbleiben bei den jeweiligen Rechteinhabern.

## Daten

Nur Artikel-IDs und Mengen werden im lokalen Browser gespeichert. Keine Kunden-, Gesundheits- oder Zahlungsdaten werden versendet. Der eingegebene Testname bleibt im Arbeitsspeicher der Seite. Bilder und Schriften werden lokal bereitgestellt. Die Schriftlizenzen liegen im assets-Verzeichnis. Eine spätere offizielle Version benötigt die eigenen rechtlichen Angaben des Betreibers.
