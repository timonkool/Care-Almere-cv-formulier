"""
bouw_templates.py — onderhoudsscript voor de cv-ontwerpen (alleen nodig bij wijzigingen).

Wat het doet:
  1. Zet tools/cv_bouwcode.py (de bron) als CV_BOUWCODE in templates.js.
  2. Maakt per ontwerp en kleur een echt .docx met de voorbeeldgegevens
     (tools/voorbeeldgegevens.py), zet dat via LibreOffice om naar PDF en
     bewaart pagina 1 als templates/previews/<ontwerp>-<kleur>.webp.
  3. Controleert elk .docx op fouten waar Word streng op is (check_word.py)
     en of elk voorbeeld op één pagina past.

Ontwerpen en kleuren worden uit templates.js gelezen (TEMPLATES en TPL_KLEUREN),
dus voeg een kleur daar toe en draai dit script opnieuw.

Nodig (alleen op de computer van wie dit onderhoudt, niet voor de website):
  python 3, en: pip install python-docx pymupdf pillow lxml
  LibreOffice (soffice). Staat die niet op de standaardplek, zet dan SOFFICE=<pad>.

Gebruik (vanuit de map van de repo):
  python tools/bouw_templates.py
"""
import copy, os, re, shutil, subprocess, sys, tempfile, runpy

HIER = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HIER)
TEMPLATES_JS = os.path.join(REPO, 'templates.js')
PREVIEWS = os.path.join(REPO, 'templates', 'previews')


def soffice():
    kandidaten = [os.environ.get('SOFFICE'), shutil.which('soffice'), shutil.which('libreoffice'),
                  r'C:\Program Files\LibreOffice\program\soffice.exe',
                  '/Applications/LibreOffice.app/Contents/MacOS/soffice', '/usr/bin/soffice']
    for k in kandidaten:
        if k and os.path.exists(k): return k
    sys.exit('LibreOffice (soffice) niet gevonden. Zet SOFFICE=<pad naar soffice>.')


def bouwcode_in_templates_js():
    code = open(os.path.join(HIER, 'cv_bouwcode.py'), encoding='utf-8').read().strip()
    for teken, naam in (('`', 'backtick'), ('${', 'dollar-accolade'), (chr(92), 'backslash')):
        if teken in code:
            sys.exit(f'cv_bouwcode.py bevat een {naam}; dat breekt de JavaScript-templatestring in templates.js.')
    js = open(TEMPLATES_JS, encoding='utf-8').read()
    start = js.index('const CV_BOUWCODE = `')
    eind = js.index('`;', start + len('const CV_BOUWCODE = `'))
    nieuw = js[:start] + 'const CV_BOUWCODE = `' + code + js[eind:]
    if nieuw != js:
        open(TEMPLATES_JS, 'w', encoding='utf-8', newline='\n').write(nieuw)
        print('templates.js: CV_BOUWCODE bijgewerkt')
    else:
        print('templates.js: CV_BOUWCODE was al actueel')
    return nieuw


def lees_ontwerpen(js):
    kleuren = re.findall(r"\{id:'(\w+)',\s*naam:'[^']+',\s*hex:'#([0-9A-Fa-f]{6})'\}", js)
    ontwerpen = re.findall(r"\{id:'(\w+)',\s*naam:'[^']+',\s*foto:(true|false)", js)
    if not kleuren or not ontwerpen: sys.exit('Kon TEMPLATES of TPL_KLEUREN niet lezen uit templates.js.')
    return [(o, f == 'true') for o, f in ontwerpen], kleuren


def foto_placeholder(map_):
    from PIL import Image, ImageDraw
    pad = os.path.join(map_, 'foto.jpg')
    im = Image.new('RGB', (800, 1000), (212, 212, 212))
    ImageDraw.Draw(im).text((400, 500), 'Foto', fill=(140, 140, 140), anchor='mm', font_size=90)
    im.save(pad); return pad


def main():
    import fitz
    from PIL import Image
    sys.path.insert(0, HIER)
    from voorbeeldgegevens import VOORBEELD
    from check_word import check

    js = bouwcode_in_templates_js()
    ontwerpen, kleuren = lees_ontwerpen(js)
    ns = runpy.run_path(os.path.join(HIER, 'cv_bouwcode.py'))
    tmp = tempfile.mkdtemp(prefix='cv_previews_')
    foto = foto_placeholder(tmp)

    bestanden = []
    for ontwerp, met_foto in ontwerpen:
        for kid, hexkleur in kleuren:
            g = copy.deepcopy(VOORBEELD)
            if met_foto: g['foto'] = foto
            bestanden.append(ns['maak_cv'](g, ontwerp, '#' + hexkleur, os.path.join(tmp, f'{ontwerp}-{kid}.docx')))
    subprocess.run([soffice(), '--headless', '--convert-to', 'pdf', '--outdir', tmp] + bestanden,
                   capture_output=True, check=True)

    os.makedirs(PREVIEWS, exist_ok=True); fouten = 0
    for f in bestanden:
        naam = os.path.basename(f)[:-5]
        problemen = check(f)
        doc = fitz.open(f[:-5] + '.pdf')
        if problemen: fouten += 1; print(f'  FOUT {naam}: Word-problemen {problemen}')
        if len(doc) != 1: fouten += 1; print(f'  FOUT {naam}: {len(doc)} pagina\'s in plaats van 1')
        pm = doc[0].get_pixmap(dpi=84)
        Image.frombytes('RGB', (pm.width, pm.height), pm.samples).save(
            os.path.join(PREVIEWS, naam + '.webp'), quality=82, method=6)
        print(f'  {naam}.webp')
    shutil.rmtree(tmp, ignore_errors=True)
    print('Klaar.' if not fouten else f'Klaar, maar met {fouten} probleem/problemen (zie hierboven).')
    sys.exit(1 if fouten else 0)


if __name__ == '__main__':
    main()
