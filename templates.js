/*
  templates.js — Care Almere cv-formulier
  ------------------------------------------------------------------
  De cv-ontwerpen die de deelnemer in de laatste stap kan kiezen.

  Hoe het werkt: de opmaak zit volledig in vaste Python-code (CV_BOUWCODE).
  Die gaat mee in de cv-prompt. De chatbot van de kandidaat vult alleen het
  woordenboek "gegevens" in (CV_GEGEVENS) en roept maak_cv() aan. Zo komt
  het Word-document er elke keer hetzelfde uit, en zonder Word-fouten
  (word_veilig() zet alle opmaakcodes in de volgorde die Word eist).

  De preview-afbeeldingen (templates/previews/<ontwerp>-<kleur>.webp) zijn
  gemaakt met precies deze code: het echte .docx met voorbeeldgegevens,
  via LibreOffice omgezet naar een afbeelding. Wat je ziet is wat je krijgt.

  Wijzigen: de bron van de bouwcode is tools/cv_bouwcode.py. Pas die aan
  (of een kleur hieronder) en draai daarna  python tools/bouw_templates.py.
  Dat zet de code hieronder in CV_BOUWCODE, maakt alle previews opnieuw en
  controleert ze. Pas CV_BOUWCODE hier dus niet met de hand aan.
  In de bouwcode mogen geen backticks, backslashes of dollar-accolade staan,
  want het is een JavaScript-templatestring (een tab is daarom chr(9)).
*/

const TPL_KLEUREN = [
  {id:'blue',     naam:'Blauw',     hex:'#2F5597'},
  {id:'teal',     naam:'Teal',      hex:'#1D6F6F'},
  {id:'green',    naam:'Groen',     hex:'#4A7337'},
  {id:'purple',   naam:'Paars',     hex:'#5B4A8B'},
  {id:'burgundy', naam:'Bordeaux',  hex:'#8C2337'},
  {id:'black',    naam:'Antraciet', hex:'#404040'}
];
const tplKleuren = id => TPL_KLEUREN.map(k=>({...k, img:`templates/previews/${id}-${k.id}.webp`}));

const TEMPLATES = [
  {id:'klassiek', naam:'Klassiek', foto:false, kleuren:tplKleuren('klassiek')},
  {id:'modern',   naam:'Modern',   foto:true,  kleuren:tplKleuren('modern')}
];

/* Het in te vullen gegevensblok (Python) dat in de prompt meegaat. */
const CV_GEGEVENS = `gegevens = {
    "naam": "",
    "ondertitel": "",  # kort het soort werk dat de kandidaat zoekt
    "contact": ["", "", ""],  # telefoon, e-mail, woonplaats
    "profiel": "",
    "werkervaring": [
        {"functie": "", "werkgever": "", "plaats": "", "periode": "", "taken": ["", ""]},
    ],
    "vrijwilligerswerk": [],  # zelfde opbouw als werkervaring
    "opleiding": [{"opleiding": "", "school": "", "jaar": ""}],
    "vaardigheden": [],
    "talen": [{"taal": "", "niveau": ""}],  # niveau: moedertaal, goed, een beetje (leeg als onbekend)
    "persoonlijk": [],
    "foto": None,  # alleen bij ontwerp Modern: pad naar de foto van de kandidaat, anders None
}`;

/* De vaste bouwcode (Python, python-docx) die in de prompt meegaat. */
const CV_BOUWCODE = `# Bouwcode cv Stichting Care Almere (python-docx). Neem letterlijk over; verander niets.
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH as AL, WD_TAB_ALIGNMENT as TA
from docx.enum.table import WD_ROW_HEIGHT_RULE, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

TAB, ZELF = chr(9), '[Zelf invullen]'
NIVEAU = {'moedertaal': 5, 'vloeiend': 5, 'zeer goed': 5, 'goed': 4, 'redelijk': 3, 'gemiddeld': 3, 'een beetje': 2, 'basis': 2, 'beginner': 1}
ORDE = {'pPr': 'pStyle keepNext keepLines widowControl numPr pBdr shd tabs spacing ind jc rPr',
        'rPr': 'rStyle rFonts b bCs i iCs caps smallCaps color spacing kern sz szCs u',
        'tcPr': 'tcW gridSpan vMerge tcBorders shd tcMar vAlign',
        'tblPr': 'tblStyle tblW jc tblInd tblBorders shd tblLayout tblCellMar tblLook'}

def _el(tag, **a):
    e = OxmlElement('w:' + tag)
    for k, v in a.items(): e.set(qn('w:' + k), str(v))
    return e

def _mix(kleur, wit):
    return ''.join('%02X' % round(int(kleur[i:i + 2], 16) * (1 - wit) + 255 * wit) for i in (0, 2, 4))

def _run(p, tekst, pt, kleur='333333', vet=False, cursief=False, font=None, spatie=0, hoofd=False):
    delen = str(tekst).split(ZELF)
    for i, deel in enumerate(delen):
        for t, zv in ((deel, False), (ZELF if i < len(delen) - 1 else '', True)):
            if not t: continue
            r = p.add_run(t); f = r.font
            f.size = Pt(pt); f.bold = vet or zv; f.italic = cursief; f.all_caps = hoofd
            f.color.rgb = RGBColor.from_string(kleur)
            if font: f.name = font; r._r.get_or_add_rPr().rFonts.set(qn('w:eastAsia'), font)
            if spatie: r._r.get_or_add_rPr().append(_el('spacing', val=int(spatie * 20)))

def _alinea(c, voor=0, na=3, regel=1.15, uitlijn=None, samen=False, tab=None):
    p = c.add_paragraph(); f = p.paragraph_format
    f.space_before, f.space_after, f.line_spacing, f.keep_with_next = Pt(voor), Pt(na), regel, samen
    if uitlijn is not None: p.alignment = uitlijn
    if tab: f.tab_stops.add_tab_stop(Cm(tab), TA.RIGHT)
    return p

def _lijn(p, kleur, dikte, afstand):
    b = _el('pBdr'); b.append(_el('bottom', val='single', sz=int(dikte * 8), space=afstand, color=kleur))
    p._p.get_or_add_pPr().append(b)

def _kop(c, titel, kleur, st, voor, wit=False, lijn='BFBFBF'):
    p = _alinea(c, voor=voor, na=4, samen=True)
    _run(p, titel, st.tekst - (0.5 if wit else 0), 'FFFFFF' if wit else kleur, vet=True, spatie=1.5, hoofd=True)
    _lijn(p, lijn, 0.75 if wit else 0.5, 3 if wit else 2)

def _tabel(c, breedtes):
    t = c.add_table(rows=1, cols=len(breedtes)); t.autofit = False; pr = t._tbl.tblPr
    r = _el('tblBorders')
    for k in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'): r.append(_el(k, val='nil'))
    m = _el('tblCellMar'); m.append(_el('left', w=0, type='dxa')); m.append(_el('right', w=0, type='dxa'))
    pr.append(r); pr.append(m)
    for kol, b in zip(t._tbl.tblGrid.findall(qn('w:gridCol')), breedtes): kol.set(qn('w:w'), str(round(b * 567)))
    tw = pr.find(qn('w:tblW'))
    if tw is None: tw = _el('tblW'); pr.append(tw)
    tw.set(qn('w:w'), str(round(sum(breedtes) * 567))); tw.set(qn('w:type'), 'dxa')
    for cel, b in zip(t.rows[0].cells, breedtes):
        cel.width = Cm(b); cel.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.TOP
        p = cel.paragraphs[0]; p._p.getparent().remove(p._p)
    return t

def word_veilig(doc):
    for tag, volgorde in ORDE.items():
        seq = volgorde.split()
        for el in doc.element.body.iter(qn('w:' + tag)):
            kids = list(el)
            kids.sort(key=lambda c: seq.index(c.tag.split('}')[-1]) if c.tag.split('}')[-1] in seq else len(seq))
            for c in kids: el.remove(c)
            el.extend(kids)

def _foto(cel, pad):
    try:
        from PIL import Image
        import os, tempfile
        im = Image.open(pad).convert('RGB'); w, h = im.size
        if w / h > 0.8: n = int(h * 0.8); im = im.crop(((w - n) // 2, 0, (w - n) // 2 + n, h))
        else: n = int(w / 0.8); im = im.crop((0, (h - n) // 2, w, (h - n) // 2 + n))
        pad = os.path.join(tempfile.gettempdir(), 'cv_foto.jpg'); im.save(pad, quality=92)
    except Exception:
        pass
    p = _alinea(cel, voor=28, na=10, uitlijn=AL.CENTER); p.add_run().add_picture(pad, width=Cm(4.2))

class _Stijl:
    def __init__(s, compact):
        s.tekst = 9.8 if compact else 10.5; s.klein = s.tekst - 0.5
        s.kop = 12 if compact else 14; s.blok = 5.5 if compact else 7; s.regel = 1.1 if compact else 1.18

def _functies(c, lijst, st, b):
    for f in [x for x in lijst or [] if x.get('functie')]:
        p = _alinea(c, voor=st.blok, na=0, samen=True, tab=b)
        _run(p, f.get('functie', ''), st.tekst + 0.5, '222222', vet=True)
        if f.get('periode'): _run(p, TAB + f['periode'], st.klein, '7F7F7F')
        sub = ', '.join(x for x in (f.get('werkgever'), f.get('plaats')) if x)
        if sub: _run(_alinea(c, na=2, samen=bool(f.get('taken'))), sub, st.klein, '595959', cursief=True)
        for taak in [x for x in f.get('taken') or [] if x]:
            q = c.add_paragraph(style='List Bullet'); pf = q.paragraph_format
            pf.left_indent, pf.first_line_indent, pf.space_after, pf.line_spacing = Cm(0.5), Cm(-0.35), Pt(1.5), st.regel
            _run(q, taak, st.tekst)

def _opleidingen(c, lijst, st, b):
    for o in [x for x in lijst or [] if x.get('opleiding')]:
        p = _alinea(c, voor=st.blok * 0.6, na=0, samen=True, tab=b)
        _run(p, o.get('opleiding', ''), st.tekst, '222222', vet=True)
        if o.get('jaar'): _run(p, TAB + str(o['jaar']), st.klein, '7F7F7F')
        if o.get('school'): _run(_alinea(c, na=2), o['school'], st.klein, '595959', cursief=True)

def _talen(c, lijst, st, b, kleur, aan, uit, grijs):
    for t in [x for x in lijst if x and (not isinstance(x, dict) or x.get('taal'))]:
        naam, niv = (t.get('taal', ''), t.get('niveau', '')) if isinstance(t, dict) else (str(t), '')
        n = NIVEAU.get(str(niv or '').strip().lower())
        q = _alinea(c, na=2.5, regel=st.regel, tab=b); _run(q, naam, st.klein, kleur)
        if n: _run(q, TAB + '●' * n, st.klein - 1, aan); _run(q, '●' * (5 - n), st.klein - 1, uit)
        elif niv: _run(q, TAB + str(niv), st.klein - 0.5, grijs)

def _hoofdkolom(c, g, kleur, st, b):
    vol = lambda k, veld: any(x.get(veld) for x in g.get(k) or [])
    if g.get('profiel'): _kop(c, 'Profiel', kleur, st, st.kop); _run(_alinea(c, voor=2, na=0, regel=st.regel), g['profiel'], st.tekst)
    if vol('werkervaring', 'functie'): _kop(c, 'Werkervaring', kleur, st, st.kop); _functies(c, g['werkervaring'], st, b)
    if vol('vrijwilligerswerk', 'functie'): _kop(c, 'Vrijwilligerswerk', kleur, st, st.kop); _functies(c, g['vrijwilligerswerk'], st, b)
    if vol('opleiding', 'opleiding'): _kop(c, 'Opleiding en cursussen', kleur, st, st.kop); _opleidingen(c, g['opleiding'], st, b)

def _klassiek(doc, g, kleur, st):
    s = doc.sections[0]; s.left_margin = s.right_margin = Cm(2.1); s.top_margin, s.bottom_margin = Cm(1.7), Cm(1.6)
    B = 16.8
    _run(_alinea(doc, na=2, regel=1.0, uitlijn=AL.CENTER), g.get('naam', ''), 27, '1F1F1F', font='Georgia', spatie=2.5, hoofd=True)
    if g.get('ondertitel'): _run(_alinea(doc, na=4, uitlijn=AL.CENTER), g['ondertitel'], 10.5, kleur, vet=True, spatie=1.5, hoofd=True)
    p = _alinea(doc, na=4, uitlijn=AL.CENTER); _run(p, '   •   '.join(x for x in g.get('contact', []) if x), st.klein, '595959')
    _lijn(p, kleur, 1.5, 8)
    _hoofdkolom(doc, g, kleur, st, B)
    f = lambda k: [y for y in g.get(k) or [] if y and (not isinstance(y, dict) or y.get('taal'))]
    groepen = ([('Vaardigheden', f('vaardigheden'))], [('Talen', f('talen')), ('Persoonlijk', f('persoonlijk'))])
    if any(v for gr in groepen for _, v in gr):
        _alinea(doc, na=0); t = _tabel(doc, [8.0, 0.8, 8.0])
        for cel, groep in zip((t.cell(0, 0), t.cell(0, 2)), groepen):
            for titel, items in groep:
                if not items: continue
                _kop(cel, titel, kleur, st, st.kop * 0.6)
                if titel == 'Talen': _talen(cel, items, st, 7.9, '333333', kleur, 'D9D9D9', '7F7F7F'); continue
                for it in [y for y in items if y]:
                    q = _alinea(cel, na=2.5, regel=st.regel); _run(q, '■  ', st.tekst - 4, kleur); _run(q, it, st.klein)
        for cel in t.rows[0].cells:
            if not cel.paragraphs: cel.add_paragraph()
    _run(_alinea(doc, na=0), ' ', 1)

def _modern(doc, g, kleur, st):
    s = doc.sections[0]; s.left_margin = s.right_margin = s.top_margin = s.bottom_margin = Cm(1.2)
    t = _tabel(doc, [6.3, 12.3]); rij = t.rows[0]
    rij.height, rij.height_rule = Cm(27.0), WD_ROW_HEIGHT_RULE.AT_LEAST
    zb, hk = t.cell(0, 0), t.cell(0, 1)
    zb._tc.get_or_add_tcPr().append(_el('shd', val='clear', color='auto', fill=kleur))
    for cel, l, r in ((zb, 0.7, 0.6), (hk, 0.9, 0.2)):
        m = _el('tcMar')
        for k, v in (('top', 0), ('left', l), ('bottom', 0), ('right', r)): m.append(_el(k, w=round(v * 567), type='dxa'))
        cel._tc.get_or_add_tcPr().append(m)
    zacht, lijn = _mix(kleur, 0.82), _mix(kleur, 0.55)
    if g.get('foto'): _foto(zb, g['foto'])
    voor = 0 if g.get('foto') else 28
    for titel, sleutel in (('Contact', 'contact'), ('Vaardigheden', 'vaardigheden'), ('Talen', 'talen'), ('Persoonlijk', 'persoonlijk')):
        if not any(y and (not isinstance(y, dict) or y.get('taal')) for y in g.get(sleutel) or []): continue
        _kop(zb, titel, kleur, st, voor, wit=True, lijn=lijn); voor = st.kop
        if sleutel == 'talen': _talen(zb, g['talen'], st, 4.9, zacht, 'FFFFFF', lijn, lijn); continue
        for x in [y for y in g[sleutel] if y]: _run(_alinea(zb, na=3, regel=st.regel), x, st.klein, zacht)
    if not zb.paragraphs: zb.add_paragraph()
    _run(_alinea(hk, voor=24, na=2, regel=1.0), g.get('naam', ''), 28, '1F1F1F', vet=True)
    if g.get('ondertitel'): _run(_alinea(hk, na=6), g['ondertitel'], 11, kleur, vet=True, spatie=1.5, hoofd=True)
    _lijn(_alinea(hk, na=0, regel=0.5), kleur, 2.25, 1)
    _hoofdkolom(hk, g, kleur, st, 11.1)
    slot = _alinea(doc, na=0); slot.paragraph_format.line_spacing = Pt(1); _run(slot, ' ', 1)

def maak_cv(gegevens, ontwerp='modern', kleur='#2F5597', bestand='CV.docx', compact=None):
    if compact is None:
        omvang = len(gegevens.get('profiel') or '') + 90 * len(gegevens.get('opleiding') or [])
        for f in (gegevens.get('werkervaring') or []) + (gegevens.get('vrijwilligerswerk') or []):
            omvang += 120 + sum(len(t) + 40 for t in f.get('taken') or [])
        compact = omvang > (2300 if ontwerp == 'modern' else 1800)
    doc = Document(); st = _Stijl(compact)
    s = doc.sections[0]; s.page_width, s.page_height = Cm(21), Cm(29.7)
    n = doc.styles['Normal']; n.font.name = 'Calibri'; n.font.size = Pt(st.tekst)
    n.font.color.rgb = RGBColor.from_string('333333'); n.element.rPr.rFonts.set(qn('w:eastAsia'), 'Calibri')
    n.paragraph_format.space_after = Pt(3); n.paragraph_format.line_spacing = st.regel
    kleur = kleur.lstrip('#').upper()
    (_klassiek if ontwerp == 'klassiek' else _modern)(doc, gegevens, kleur, st)
    word_veilig(doc)
    if not bestand.lower().endswith('.docx'): bestand += '.docx'
    doc.save(bestand)
    return bestand`;
