/*
  templates.js — Care Almere cv-formulier
  ------------------------------------------------------------------
  De zes cv-templates die de deelnemer in stap 7 kan kiezen. Staat los
  van index.html omdat dit los van het formulier verandert (zie CLAUDE.md).

  Per template:
    id          - korte sleutel (komt terug in de bestandsnamen van de previews)
    naam        - weergavenaam in het formulier
    omschrijving- uitgebreide beschrijving die in de prompt belandt, zodat de
                  AI het template kan nabouwen in Word
    kleuren[]   - de kleurvarianten uit de originele template-zips:
                    id   sleutel (= deel van de bestandsnaam)
                    naam Nederlandse label op de swatch
                    hex  accentkleur (uit de docx/preview gehaald) voor de swatch
                    img  preview-afbeelding van het template in die kleur

  De previews zijn gerenderd uit de originele Word-templates en staan in
  templates/previews/<id>-<kleur>.webp. Wil je een template of kleur
  toevoegen/wijzigen: pas hier de data aan en zet de bijbehorende preview erbij.
*/
const TEMPLATES = [
  {
    id:'stylish-modern',
    naam:'Modern',
    omschrijving:
`Strak en zakelijk. Bovenaan een brede gekleurde balk over de volle breedte met de naam in hoofdletters (wit) en daaronder de functietitel. Daaronder twee kolommen: een brede linkerkolom (ongeveer 70%) met een korte profieltekst ("Career Objective") en daarna de werkervaring (functietitel vet, werkgever en periode op een regel, daaronder bullets); en een smalle rechterkolom (ongeveer 30%) met Contact, Opleiding en Vaardigheden. Elke sectiekop heeft links een klein gekleurd vierkant icoontje. Schreefloos, modern lettertype (Inter, Lexend of Poppins). Eén pagina. Geschikt voor kantoor, zorg, administratie en dienstverlening.`,
    kleuren:[
      {id:'blue',   naam:'Blauw',  hex:'#799BCD', img:'templates/previews/stylish-modern-blue.webp'},
      {id:'green',  naam:'Groen',  hex:'#A6B784', img:'templates/previews/stylish-modern-green.webp'},
      {id:'orange', naam:'Oranje', hex:'#E19162', img:'templates/previews/stylish-modern-orange.webp'},
      {id:'violet', naam:'Violet', hex:'#908BB9', img:'templates/previews/stylish-modern-violet.webp'},
      {id:'yellow', naam:'Geel',   hex:'#DEAB52', img:'templates/previews/stylish-modern-yellow.webp'},
      {id:'black',  naam:'Zwart',  hex:'#606060', img:'templates/previews/stylish-modern-black.webp'}
    ]
  },
  {
    id:'westminster',
    naam:'Klassiek',
    omschrijving:
`Klassiek en verzorgd. Gecentreerde kop: de naam groot in hoofdletters tussen twee dunne horizontale lijnen, daaronder gecentreerd de functietitel. Daaronder twee kolommen, gescheiden door een verticale lijn: bovenin Contact (links) en een profieltekst "Professional Profile" (rechts); daaronder Werkervaring (breed, links) en Opleiding plus Vaardigheden (rechts). Vaardigheden worden getoond als gesegmenteerde balkjes (niveau-indicatie). Sectiekoppen in een elegant lettertype en in de accentkleur. Lettertypes Oswald en Open Sans. Geschikt voor zorg, onderwijs, dienstverlening en kantoor.`,
    kleuren:[
      {id:'blue',   naam:'Blauw',  hex:'#35598F', img:'templates/previews/westminster-blue.webp'},
      {id:'green',  naam:'Groen',  hex:'#6B7C48', img:'templates/previews/westminster-green.webp'},
      {id:'orange', naam:'Oranje', hex:'#C16025', img:'templates/previews/westminster-orange.webp'},
      {id:'violet', naam:'Violet', hex:'#625B97', img:'templates/previews/westminster-violet.webp'},
      {id:'yellow', naam:'Geel',   hex:'#A47520', img:'templates/previews/westminster-yellow.webp'},
      {id:'black',  naam:'Zwart',  hex:'#272828', img:'templates/previews/westminster-black.webp'}
    ]
  },
  {
    id:'venture',
    naam:'Strak',
    omschrijving:
`Minimalistisch met veel witruimte, rustig en heel goed leesbaar (ook ATS-vriendelijk). Bovenaan een gecentreerde contactregel (klein, in de accentkleur, met bolletjes tussen de gegevens). Links een kolom met de naam groot, de functietitel, een profieltekst, Opleiding, Certificaten en Vaardigheden (als nette regels). Rechts de hoofdkolom met de werkervaring als een verticale tijdlijn: kleine ronde icoontjes met een verbindingslijn, functietitel vet, werkgever en periode, daaronder bullets. Sectiekoppen in de accentkleur. Subtiel gekleurd hoekje linksonder. Lettertypes DM Sans en Inter. Geschikt voor kantoor, administratie, techniek en zakelijke functies.`,
    kleuren:[
      {id:'blue',   naam:'Blauw',  hex:'#619DF9', img:'templates/previews/venture-blue.webp'},
      {id:'green',  naam:'Groen',  hex:'#419581', img:'templates/previews/venture-green.webp'},
      {id:'purple', naam:'Paars',  hex:'#83619B', img:'templates/previews/venture-purple.webp'},
      {id:'red',    naam:'Rood',   hex:'#993939', img:'templates/previews/venture-red.webp'},
      {id:'yellow', naam:'Geel',   hex:'#C98D3F', img:'templates/previews/venture-yellow.webp'},
      {id:'black',  naam:'Zwart',  hex:'#484866', img:'templates/previews/venture-black.webp'}
    ]
  },
  {
    id:'photo',
    naam:'Met foto',
    omschrijving:
`Vriendelijk en modern, met nadruk op een foto. Kop met de naam groot in de accentkleur (sierlijk schreef-lettertype, Cormorant) en daaronder de functietitel, met een contactregel met icoontjes. Daaronder twee kolommen: een brede linkerkolom met een licht getinte achtergrond en de werkervaring als tijdlijn met datumblokjes aan de linkerkant; en een smalle rechterkolom met bovenaan een ronde foto, daarna een profieltekst, Opleiding en Vaardigheden als puntjes-rating (rijtjes gevulde en lege bolletjes). Lettertypes Cormorant SC met Source Sans of Inter. Geschikt voor zorg, welzijn, klantcontact en iedereen die met een foto op het cv wil.`,
    kleuren:[
      {id:'blue',    naam:'Blauw',   hex:'#03396C', img:'templates/previews/photo-blue.webp'},
      {id:'teal',    naam:'Teal',    hex:'#217C7C', img:'templates/previews/photo-teal.webp'},
      {id:'magenta', naam:'Magenta', hex:'#B23D8F', img:'templates/previews/photo-magenta.webp'},
      {id:'orange',  naam:'Oranje',  hex:'#FF7E26', img:'templates/previews/photo-orange.webp'},
      {id:'yellow',  naam:'Geel',    hex:'#D77F00', img:'templates/previews/photo-yellow.webp'},
      {id:'black',   naam:'Zwart',   hex:'#262626', img:'templates/previews/photo-black.webp'}
    ]
  },
  {
    id:'fashionable',
    naam:'Trendy',
    omschrijving:
`Trendy en eigentijds. Een smalle lichte linkerzijbalk met bovenaan een rechthoekige foto, daaronder een gekleurd accentblok, vervolgens contactgegevens met icoontjes, Opleiding, Vaardigheden en extra vaardigheden. Rechts de hoofdkolom: de naam met de voornaam in de accentkleur en de achternaam in zwart, daaronder de functietitel, een profieltekst, en de werkervaring met gekleurde afgeronde kop-labels (gevulde "pillen") en de periode rechts uitgelijnd; subtiele warme achtergrondtint. Lettertypes Arima, Raleway en Poppins. Geschikt voor creatieve functies, retail, horeca en jongere kandidaten.`,
    kleuren:[
      {id:'blue',    naam:'Blauw',   hex:'#03396C', img:'templates/previews/fashionable-blue.webp'},
      {id:'green',   naam:'Groen',   hex:'#287878', img:'templates/previews/fashionable-green.webp'},
      {id:'magenta', naam:'Magenta', hex:'#B23D8F', img:'templates/previews/fashionable-magenta.webp'},
      {id:'orange',  naam:'Oranje',  hex:'#FF7E26', img:'templates/previews/fashionable-orange.webp'},
      {id:'yellow',  naam:'Geel',    hex:'#F3BC4C', img:'templates/previews/fashionable-yellow.webp'},
      {id:'black',   naam:'Zwart',   hex:'#3F3F3F', img:'templates/previews/fashionable-black.webp'}
    ]
  },
  {
    id:'colorful',
    naam:'Opvallend',
    omschrijving:
`Opvallend en design-gericht. Een volledig gekleurde (donkere) linkerzijbalk over de hele hoogte met de naam groot bovenaan en verticaal gedraaide sectie-labels in "tabs" (Contact, Profiel, Opleiding, Vaardigheden). Rechts een brede kolom met de werkervaring, ook met een verticaal gedraaid label, en rechtsboven een zeshoekige (hexagon) foto. De accentkleur is de kleur van de hele zijbalk en de tabs. Naam in een schreef-lettertype (Bitter), tekst schreefloos (Inter, Lexend). Geschikt voor creatieve functies, retail, horeca en wie durft op te vallen.`,
    kleuren:[
      {id:'blue',     naam:'Blauw',    hex:'#252A41', img:'templates/previews/colorful-blue.webp'},
      {id:'burgundy', naam:'Bordeaux', hex:'#5C010E', img:'templates/previews/colorful-burgundy.webp'},
      {id:'green',    naam:'Groen',    hex:'#286450', img:'templates/previews/colorful-green.webp'},
      {id:'orange',   naam:'Oranje',   hex:'#D45C0A', img:'templates/previews/colorful-orange.webp'},
      {id:'violet',   naam:'Violet',   hex:'#2F0C49', img:'templates/previews/colorful-violet.webp'},
      {id:'black',    naam:'Zwart',    hex:'#3F3F3F', img:'templates/previews/colorful-black.webp'}
    ]
  }
];
