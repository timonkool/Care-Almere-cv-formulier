# Controleert een .docx op de schema-fouten waar Word streng op is en
# LibreOffice niet: volgorde van eigenschap-elementen, dubbele elementen en
# verplichte attributen. Gebruik: python check_word.py bestand.docx
import sys, zipfile, re
from lxml import etree
W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
q = lambda t: '{%s}%s' % (W, t)
SEQ = {
 'pPr': 'pStyle keepNext keepLines pageBreakBefore framePr widowControl numPr suppressLineNumbers pBdr shd tabs suppressAutoHyphens kinsoku wordWrap overflowPunct topLinePunct autoSpaceDE autoSpaceDN bidi adjustRightInd snapToGrid spacing ind contextualSpacing mirrorIndents suppressOverlap jc textDirection textAlignment textboxTightWrap outlineLvl divId cnfStyle rPr sectPr pPrChange'.split(),
 'rPr': 'rStyle rFonts b bCs i iCs caps smallCaps strike dstrike outline shadow emboss imprint noProof snapToGrid vanish webHidden color spacing w kern position sz szCs highlight u effect bdr shd fitText vertAlign rtl cs em lang eastAsianLayout specVanish oMath'.split(),
 'tcPr': 'cnfStyle tcW gridSpan hMerge vMerge tcBorders shd noWrap tcMar textDirection tcFitText vAlign hideMark'.split(),
 'tblPr': 'tblStyle tblpPr tblOverlap bidiVisual tblStyleRowBandSize tblStyleColBandSize tblW jc tblCellSpacing tblInd tblBorders shd tblLayout tblCellMar tblLook'.split(),
 'pBdr': 'top left bottom right between bar'.split(),
 'tcMar': 'top start left bottom end right'.split(),
 'tblBorders': 'top left bottom right insideH insideV'.split(),
}
REQ = {'shd': ['val'], 'bottom': ['val'], 'top': ['val']}

def check(path):
    z = zipfile.ZipFile(path); x = etree.fromstring(z.read('word/document.xml'))
    probs = {}
    def add(k): probs[k] = probs.get(k, 0) + 1
    for tag, seq in SEQ.items():
        for el in x.iter(q(tag)):
            if tag in ('pBdr','tcMar','tblBorders') or el.getparent().tag != q('rPrChange'):
                names = [etree.QName(c).localname for c in el]
                if tag == 'rPr' and etree.QName(el.getparent()).localname == 'pPr': pass
                known = [n for n in names if n in seq]
                for n in names:
                    if n not in seq: add(f'onbekend element <{n}> in <{tag}> (Word verwacht dit niet)')
                if [seq.index(n) for n in known] != sorted(seq.index(n) for n in known):
                    add(f'verkeerde volgorde in <{tag}>: {" ".join(names)}')
                for n in set(known):
                    if known.count(n) > 1: add(f'dubbel <{n}> in <{tag}>')
    for tag, attrs in REQ.items():
        for el in x.iter(q(tag)):
            par = etree.QName(el.getparent()).localname
            if tag in ('top', 'bottom') and par not in ('pBdr', 'tblBorders', 'tcBorders'): continue
            for a in attrs:
                if el.get(q(a)) is None: add(f'<{tag}> mist verplicht attribuut w:{a}')
    return probs

if __name__ == '__main__':
    for p in sys.argv[1:]:
        r = check(p)
        print('==', p.split('/')[-1], '->', 'GEEN FOUTEN' if not r else f'{sum(r.values())} fouten')
        for k, v in sorted(r.items(), key=lambda kv: -kv[1])[:12]: print(f'  {v:3}x {k}')
