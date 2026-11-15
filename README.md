# Care Almere cv-formulier

Formulier voor het Jobmatch-traject van Stichting Care Almere. Een kandidaat vult in een paar korte stappen zijn of haar gegevens in, kiest een cv-ontwerp en een kleur, en krijgt aan het eind twee teksten om te kopiëren: één voor het cv en één voor een basis-motivatiebrief. Die tekst plakt de kandidaat in ChatGPT of Claude. De chatbot stelt nog een paar vragen en levert daarna een opgemaakt Word-bestand (.docx).

Live: <http://timonkool.nl/Care-Almere-cv-formulier/>

## Privacy

Het formulier slaat niets op en verstuurt niets: geen opslag in de browser, geen server, geen analytics. Alle antwoorden bestaan alleen in het geopende tabblad. De pagina roept zelf geen AI aan; de kandidaat kopieert de tekst zelf naar een chatbot.

## Zo werkt de cv-opmaak

Een chatbot die zelf een Word-bestand moet ontwerpen, levert elke keer iets anders op, en vaak een bestand dat Word niet goed opent. Daarom zit de opmaak volledig in vaste code:

- `tools/cv_bouwcode.py` bevat de functie `maak_cv()` (Python, python-docx). Die bouwt het cv in het gekozen ontwerp en de gekozen kleur, en zet alle opmaakcodes in de volgorde die Word eist.
- Deze code gaat letterlijk mee in de cv-tekst die de kandidaat kopieert. De chatbot schrijft alleen de inhoud (profiel, taken, enzovoort), vult die in het woordenboek `gegevens` in en voert de code uit.
- De voorbeelden die de kandidaat in het formulier ziet (`templates/previews/`), zijn afbeeldingen van het echte Word-resultaat van dezelfde code. Wat de kandidaat ziet, is wat hij of zij krijgt.

Er zijn twee ontwerpen, elk in zes kleuren:

| Ontwerp | Kenmerken |
| --- | --- |
| Klassiek | Eén kolom, naam gecentreerd, koppen met letterafstand en dunne lijn, vaardigheden en talen naast elkaar onderaan. Geen foto. |
| Modern | Zijbalk in de accentkleur over de hele hoogte (foto, contact, vaardigheden, talen), rechts profiel, werkervaring en opleiding. |

## Bestanden

```
index.html                       Het formulier (opmaak + logica, geen build-stap)
masterprompt.js                  Instructie voor de chatbot: cv
masterprompt-motivatiebrief.js   Instructie voor de chatbot: motivatiebrief
templates.js                     Ontwerpen, kleuren en de bouwcode (CV_BOUWCODE) die in de cv-prompt gaat
templates/previews/              Voorbeeldafbeeldingen per ontwerp en kleur
tools/                           Onderhoud van de ontwerpen (niet nodig voor de website)
  cv_bouwcode.py                 Bron van de bouwcode
  voorbeeldgegevens.py           Fictieve gegevens voor de voorbeeldafbeeldingen
  bouw_templates.py              Zet de bouwcode in templates.js en maakt de voorbeelden opnieuw
  check_word.py                  Controleert een .docx op fouten waar Word streng op is
CLAUDE.md                        Werkafspraken voor wie (of welke AI) aan dit project werkt
```

## Een ontwerp of kleur aanpassen

1. Pas `tools/cv_bouwcode.py` aan (opmaak), of `TPL_KLEUREN` / `TEMPLATES` in `templates.js` (kleuren, ontwerpen).
2. Draai vanuit deze map:

   ```bash
   python tools/bouw_templates.py
   ```

   Dit zet de bouwcode in `templates.js`, maakt alle voorbeeldafbeeldingen opnieuw en controleert dat elk voorbeeld foutloos is en op één pagina past.
3. Open `index.html` in de browser en controleer de laatste stap.

Nodig voor stap 2 (alleen op de computer van wie onderhoudt): Python 3 met `pip install python-docx pymupdf pillow lxml`, en LibreOffice.

## Publiceren

De repository is gekoppeld aan timonkool.nl. Een push naar `main` staat na ongeveer een minuut live; er is geen aparte testomgeving.

Heb je `templates.js`, `masterprompt.js` of `masterprompt-motivatiebrief.js` gewijzigd? Verhoog dan in `index.html` het versienummer achter die scripts (`?v=2026-11-15` wordt bijvoorbeeld `?v=2026-12-01`). Browsers bewaren de scripts anders tot 10 minuten, en een nieuwe pagina met een oud script kan vastlopen. Test daarom eerst lokaal door `index.html` te openen (met `?test` achter de URL verschijnt per stap een knop die fictieve testgegevens invult).
