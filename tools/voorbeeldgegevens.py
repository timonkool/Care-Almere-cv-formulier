VOORBEELD = {
 'naam': 'Sam Jansen', 'ondertitel': 'Medewerker logistiek',
 'contact': ['06 12345678', 'sam.jansen@voorbeeld.nl', 'Almere'],
 'profiel': "Betrouwbare en rustige medewerker met vijf jaar ervaring in logistiek en winkel. Ik werk nauwkeurig, help collega's graag op weg en ben altijd op tijd. Ik zoek een vaste baan in een magazijn of distributiecentrum.",
 'werkervaring': [
  {'functie': 'Orderpicker', 'werkgever': 'Logistiek Centrum', 'plaats': 'Almere', 'periode': '2021 – heden',
   'taken': ['Orders verzamelen en klaarzetten voor verzending', "Nieuwe collega's inwerken op de handscanner", 'Voorraad tellen en tekorten op tijd melden']},
  {'functie': 'Kassamedewerker', 'werkgever': 'Supermarkt De Hoek', 'plaats': 'Almere', 'periode': '2018 – 2021',
   'taken': ['Klanten helpen aan de kassa en de servicebalie', 'Vakken vullen en de winkel netjes houden', 'Vaak gevraagd door vaste klanten om hulp']}],
 'vrijwilligerswerk': [
  {'functie': 'Vrijwilliger', 'werkgever': 'Buurthuis De Schakel', 'plaats': 'Almere', 'periode': '2016 – 2018',
   'taken': ['Activiteiten voor ouderen mee organiseren', 'Bezoekers ontvangen en koffie schenken']}],
 'opleiding': [{'opleiding': 'Mbo Logistiek medewerker, niveau 2', 'school': 'Mbo-college Almere', 'jaar': '2018'},
               {'opleiding': 'Heftruckcertificaat', 'school': 'Praktijkcursus', 'jaar': '2020'}],
 'vaardigheden': ['Rijbewijs B', 'Heftruck rijden', 'Handscanner en voorraadsysteem', 'Kassasysteem'],
 'talen': [{'taal': 'Nederlands', 'niveau': 'moedertaal'}, {'taal': 'Engels', 'niveau': 'goed'}, {'taal': 'Arabisch', 'niveau': 'een beetje'}],
 'persoonlijk': ['Betrouwbaar', 'Rustig', 'Behulpzaam'],
}
import copy  # noqa
LANG = copy.deepcopy(VOORBEELD)
LANG['naam'] = '[Zelf invullen]'; LANG['contact'] = ['[Zelf invullen]', 'sam.jansen@voorbeeld.nl', 'Almere']
LANG['werkervaring'] = LANG['werkervaring'] + [
  {'functie': 'Schoonmaker', 'werkgever': 'Schoon & Fris', 'plaats': 'Lelystad', 'periode': '2015 – 2018', 'taken': ['Kantoren en sanitair schoonmaken volgens schema', 'Materiaal bestellen en voorraad bijhouden', 'Zelfstandig werken in de avond']},
  {'functie': 'Bezorger', 'werkgever': 'Krantenwijk', 'plaats': 'Almere', 'periode': '2012 – 2015', 'taken': ['Kranten op tijd bezorgen in een vaste wijk']}]
LANG['vaardigheden'] = LANG['vaardigheden'] + ['VCA Basis', 'Computer en Office', 'Plannen van eigen werk']
