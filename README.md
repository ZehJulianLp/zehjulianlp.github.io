# Julian's corner

Eigenständige statische Website im Stil **SeaWing's Den × JulianOS**:
dunkles Petrol, warme Akzente, Fensterrahmen und vorhandene Drachenkunst.
Die Website wird aus dem Repository-Hauptverzeichnis über GitHub Pages unter
https://web.julianverse.de/ veröffentlicht. Die vorherige Version ist in der
Git-Historie erhalten.

## Vorschau

Mit dem bestehenden Server: http://localhost:5500/

Kein Build und keine Installation nötig. Den Ordner über HTTP ausliefern,
nicht direkt als file:// öffnen (die Seiten laden JSON). Der Ordner kann auch
selbst als Webroot verwendet werden; interne Links und Assets sind relativ.

## Seiten und Inhalte

Home, About, Projects, Dragon stuff, Collection, Now, Updates,
Guestbook, Socials & friends, Search und eine 404-Seite.

- Texte aus About und Dragon stuff sowie Artwork und Künstlernachweise übernommen.
- 24 Projekte: bisherige Einträge plus Julians Projektliste, mit Kategorien,
  Beschreibungen, Status, Technik, Notizen und verfügbaren Links.
- 8 Galeriebilder, 51 Zitate, 8 Social-Profile und 7 befreundete Websites.
- Collection mit 16 Geräten bzw. Gerätegruppen. Ältere Geräte werden verlinkt,
  nicht doppelt angelegt. Die alten Beispiel-Einträge wurden ersetzt.
- 40 Hörbuch-Einträge in sechs Themenbereichen: Julians eingefügte Titelliste
  plus der auf Wunsch ergänzte zweite Harry-Potter-Band. Damit sind alle sieben
  Harry-Potter-Bände enthalten. Beim zweiten Band bleibt der Sprecher offen,
  da die konkrete Hörbuchausgabe nicht angegeben wurde.
  Reihen stehen zusammen in Bandreihenfolge; Einzelband und Sammelband bleiben
  getrennte Einträge. Keine Kontodaten,
  Hörfortschritte, Restzeiten, Laufzeiten, Bewertungen oder Hörstatus übernommen.
  Die Liste ist lokal/statisch, ohne Audible-Anmeldung oder Synchronisierung.
- 58 Spiele: 57 aus Julians eingefügter Steam-Liste plus Minecraft. Acht
  Kategorien, darin alphabetisch und mit numerisch sortierten Fortsetzungen.
  Kurze sachliche Beschreibungen, Genre, Spielmodi und Quellenlinks; Minecraft
  verlinkt außerdem das eigene Redstone-&-Rails-Projekt. Die Einteilung ist
  redaktionell, keine automatische Übernahme der Steam-Tags.
  Spielinfos wurden mit den offiziellen Steam-Produktdaten und Minecraft.net
  abgeglichen. Bei Nothing ist die genaue Ausgabe noch unbestätigt; deshalb
  nur eine allgemeine Beschreibung und ein klar beschrifteter Steam-Suchlink.
  Wallpaper Engine bleibt ausgeschlossen. Keine Spielzeiten, letzten Aktivitäten,
  Errungenschaften oder Konto-/Gerätedaten. Lokal/statisch, ohne Anmeldung oder Sync.
- Now und Updates aus JSON. Unbestätigte Aktivitäten, Daten und Projektlinks
  werden nicht erfunden; Pläne bleiben von vorhandenen Funktionen getrennt.
- Suche über Seiten, Projekte, Collection (Geräte, Hörbücher und Spiele),
  Galerie, Links und Updates.
- Gemeinsamer Vollbild-Bildbetrachter für Galerie und Collection:
  begrenzte Bildfläche, Pfeiltasten, Escape und Fokus-Rückgabe.
- Gästebuch lädt Giscus erst auf Knopfdruck; bestehendes Repository und
  Kategorie bleiben erhalten, die Zuordnung verwendet /guestbook/.
- Calm mode ist eine lokale Darstellungspräferenz. Kein Tracking.
- Eigener statischer 88×31-PNG-Button unter Socials & friends / Link back:
  vorhandener Drachenavatar, pixelgenaue Schrift und Farben des Indie-Entwurfs.
  Download und kopierbares HTML für selbst gehostete Einbindungen. Das Linkziel
  ist die persönliche Website aus CNAME (`https://web.julianverse.de/`), nicht
  localhost. Ohne JavaScript oder Clipboard-Zugriff bleibt manuelles Kopieren möglich.

## Bearbeiten

- `data/projects.json`: Projektinhalte; `featured`, `related`, `planned`,
  optionale `screenshot` und `github`-Felder.
- `data/collection.json`: Kategorien, Geräte, Spezifikationen,
  Bilder und Quellen. `retired` fügt einen Verweis im Bereich Older gear hinzu.
- `data/audiobooks.json`: Hörbuch-Themen, Titel, Autoren, Sprecher, Mitwirkende
  und Reihenangaben. Nur bibliografische Felder verwenden; der Originaltext
  aus der Audible-Bibliothek wird nicht gespeichert. Anzeige und Suche greifen
  ausdrücklich nur auf diese Metadaten zu, nicht auf beliebige Importfelder.
- `data/gallery.json`: Artwork, Alternativtexte und Künstlerlinks.
- `data/games.json`: Kategorien und Spiele mit stabiler ID, Titel, Kategorie,
  Kurzbeschreibung, Genre, Spielmodi und Links. Anzeige und Suche verwenden
  ausschließlich diese Inhaltsfelder. Den eingefügten Steam-Seitentext mit
  Aktivitäten und Kontoinformationen nicht speichern.
- `data/socials.json`: Socials und Friends.
- `data/quotes.json`: ursprüngliche Zitate.
- `data/site.json`: Now und Updates sowie Profil-/Skill-Notizen.
  About und der gemeinsame HTML-Rahmen sind statisch; Änderungen dort
  müssen auch in den betroffenen HTML-Seiten vorgenommen werden.
- `style.css` und `app.js`: gemeinsame Darstellung und Funktionen.
- `assets/buttons/julians-corner-88x31.svg`: bearbeitbares Button-Layout,
  referenziert den vorhandenen Avatar. Der veröffentlichte PNG-Export ist eigenständig.
  Nach Layoutänderungen vom Repository-Hauptordner mit
  `node scripts/render-button.mjs` neu rendern (Node.js und ImageMagick nötig).
- `assets/img/`: ursprüngliche Bilder; `assets/collection/`: Gerätebilder.
- `CNAME`, `robots.txt` und `sitemap.xml`: Domain und Suchmaschinen-Verweise.
- `img/`: bisherige Bildadressen bleiben für vorhandene externe Links erreichbar.
  Die neue Website verwendet `assets/img/`.

## Bilder und Quellen

Gerätebilder werden lokal ausgeliefert, nicht von Drittservern hotgelinkt.
Quellseite, Namensnennung und gegebenenfalls freie Lizenz stehen je Eintrag
in `imageSource` und werden auch im Bildbetrachter angezeigt.

Produktbilder von Herstellern/Händlern sind nicht als frei lizenziert ausgewiesen;
eine Quellenangabe allein ist keine Nutzungslizenz. Vor öffentlicher Veröffentlichung
die Nutzungsrechte prüfen oder eigene/frei lizenzierte Fotos einsetzen.
Commons-Bilder behalten ihre angegebenen CC-Lizenzen. Heruntergeladene
Vorschaubilder sind nicht inhaltlich verändert.

Unbekannte Webcam-/Drucker-/NFC-Modelle und das Rechenzentrum sind ausdrücklich
als Beispielbilder gekennzeichnet. Das Desktopbild zeigt das gewünschte
Kolink-Stronghold-Gehäuse. Das Headset meldet sich am PC als
„Razer BlackShark V2 HS USB“; die Zuordnung zum BlackShark V2 HyperSpeed ist
im offiziellen Razer-Handbuch beschrieben. Keine USB-Seriennummern,
Netzwerkadressen oder sonstigen lokalen Systemdetails veröffentlichen.

## Prüfung

JavaScript-Syntax: `node --check app.js` vom Repository-Hauptordner.
HTML- und JSON-Referenzen müssen innerhalb des Webroots auflösbar bleiben.
Die 404-Seite verwendet root-relative Pfade, damit sie auch unter verschachtelten
unbekannten URLs funktioniert. Die Gästebuch-Zuordnung bleibt `/guestbook/`.

## Veröffentlichen

Änderungen committen und auf `origin/main` pushen. GitHub Pages verwendet das
Repository-Hauptverzeichnis; ein Build oder ein separater Entwurfsordner ist
nicht nötig. `CNAME` für die bestehende Domain beibehalten.
