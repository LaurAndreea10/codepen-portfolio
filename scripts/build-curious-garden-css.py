#!/usr/bin/env python3
"""Grădina Curioasă — CSS fără blocarea randării și fără CSS nefolosit la încărcare.

1. Concatenează sursele (*.css, în ordinea de mai jos) în curious-garden/bundle.css.
2. Pune inline în index.html, între <style id="cg-bundle">…</style>, doar regulile din
   curious-garden/critical-selectors.txt (cele folosite pe primul ecran).
3. bundle.css complet se încarcă la prima interacțiune (atingere, tastă, scroll) sau imediat
   dacă sesiunea revine pe alt ecran decât Acasă; celelalte ecrane se deschid doar după o
   interacțiune, deci au toate stilurile. Ordinea cascadei rămâne aceeași:
   regulile critice sunt un subset al bundle-ului, în aceeași ordine.

Rulează după orice modificare a surselor:
    python3 scripts/build-curious-garden-css.py
Regenerează lista critică (Playwright; servește rădăcina repo-ului, ex. python3 -m http.server 8000):
    python3 scripts/build-curious-garden-css.py --extract http://localhost:8000/curious-garden/
Sursele (*.css) rămân cele de editat.
"""
import pathlib, re, sys

D = pathlib.Path(__file__).resolve().parent.parent / 'curious-garden'
ORDER = ['expansion.css', 'premium.css', 'arcade.css', 'home.css', 'learning.css', 'extras.css', 'studio.css']
LIST = D / 'critical-selectors.txt'


def bundle_text():
    out = ['/* generat de scripts/build-curious-garden-css.py — editează sursele, nu acest fișier */']
    for f in ORDER:
        css = (D / f).read_text(encoding='utf-8')
        css = re.sub(r'/\*(?!!).*?\*/', '', css, flags=re.S)
        css = re.sub(r'\s*\n\s*', '\n', css).strip()
        out.append(f'/* {f} */\n{css}')
    return '\n'.join(out) + '\n'


def parse(css, start=0, end=None):
    """Blocuri de nivel superior: (prelude, start, end, body_start, body_end). Comentarii și șiruri ignorate."""
    end = len(css) if end is None else end
    blocks, i, pre = [], start, start
    while i < end:
        c = css[i]
        if css.startswith('/*', i):
            j = css.find('*/', i + 2)
            i = end if j < 0 else j + 2
            pre = i if css[pre:i].strip().startswith('/*') else pre
            continue
        if c in '"\'':
            j = i + 1
            while j < end and css[j] != c:
                j += 2 if css[j] == '\\' else 1
            i = j + 1
            continue
        if c == ';':  # @import / @charset la nivel superior
            i += 1
            pre = i
            continue
        if c == '{':
            depth, j = 1, i + 1
            while j < end and depth:
                if css.startswith('/*', j):
                    k = css.find('*/', j + 2)
                    j = end if k < 0 else k + 2
                    continue
                if css[j] in '"\'':
                    q = css[j]
                    j += 1
                    while j < end and css[j] != q:
                        j += 2 if css[j] == '\\' else 1
                    j += 1
                    continue
                depth += {'{': 1, '}': -1}.get(css[j], 0)
                j += 1
            prelude = re.sub(r'/\*.*?\*/', '', css[pre:i], flags=re.S).strip()
            blocks.append((prelude, pre, j, i + 1, j - 1))
            i = pre = j
            continue
        i += 1
    return blocks


def key(prelude, parent=''):
    return (parent + ' >> ' if parent else '') + re.sub(r'\s+', ' ', prelude)


def critical_css(css, wanted):
    out = []
    names = set()
    for pre, s, e, bs, be in parse(css):
        if pre.startswith('@media') or pre.startswith('@supports') or pre.startswith('@layer'):
            inner = [css[is_:ie].strip() for p2, is_, ie, _, _ in parse(css, bs, be) if key(p2, pre) in wanted]
            if inner:
                out.append(pre + '{' + ''.join(inner) + '}')
        elif pre.startswith('@keyframes') or pre.startswith('@font-face'):
            continue
        elif key(pre) in wanted:
            out.append(css[s:e].strip())
    text = '\n'.join(out)
    # @keyframes folosite de regulile critice
    for pre, s, e, bs, be in parse(css):
        if pre.startswith('@keyframes'):
            name = pre.split(None, 1)[1].strip()
            if re.search(r'\b' + re.escape(name) + r'\b', text) and name not in names:
                names.add(name)
                text += '\n' + css[s:e].strip()
    return text


def build():
    css = bundle_text()
    (D / 'bundle.css').write_text(css, encoding='utf-8')
    wanted = set(LIST.read_text(encoding='utf-8').splitlines()) if LIST.exists() else set()
    crit = critical_css(css, wanted)
    html = (D / 'index.html').read_text(encoding='utf-8')
    block = (f'<style id="cg-bundle">\n{crit}\n</style>'
             '<script id="cg-bundle-css">/* restul stilurilor: la prima interacțiune sau imediat dacă sesiunea revine pe alt ecran */'
             '(()=>{let done=0;const ev=["pointerdown","touchstart","keydown","wheel","scroll"];'
             'const go=()=>{if(done)return;done=1;ev.forEach(e=>removeEventListener(e,go,true));'
             'const l=document.createElement("link");l.rel="stylesheet";l.href="bundle.css";document.head.append(l)};'
             'let v="home";try{v=sessionStorage.getItem("garden_view")||"home"}catch{}'
             'if(v!=="home"||location.hash.length>1)go();else ev.forEach(e=>addEventListener(e,go,{capture:true,passive:true}));'
             'window.gardenLoadStyles=go})()</script>'
             '<noscript><link rel="stylesheet" href="bundle.css"></noscript>')
    new, n = re.subn(r'<style id="cg-bundle">.*?</style>(<link[^>]*id="cg-bundle-css">|<script id="cg-bundle-css">.*?</script>)?(<noscript><link rel="stylesheet" href="bundle.css"></noscript>)?',
                     lambda m: block, html, flags=re.S)
    if n != 1:
        raise SystemExit('marcajul <style id="cg-bundle"> lipsește din index.html')
    (D / 'index.html').write_text(new, encoding='utf-8')
    print(f'bundle.css {len(css)} B · critic inline {len(crit)} B ({len(wanted)} reguli în listă)')


def extract(url):
    """Regulile din bundle.css folosite pe primele ecrane: profil nou, acasă (temă întunecată,
    luminoasă, contrast ridicat), lățime de telefon și de desktop."""
    from playwright.sync_api import sync_playwright
    import datetime, json
    css = bundle_text()
    (D / 'bundle.css').write_text(css, encoding='utf-8')
    dob = f'{datetime.date.today().year - 6}-03-10'
    profile = json.dumps({'dob': dob, 'world': 'nature'})
    states = [
        {},
        {'garden_profile': profile},
        {'garden_profile': profile, 'garden_theme': 'light'},
        {'garden_profile': profile, 'garden_contrast': 'true'},
        {'garden_theme': 'light'},
    ]
    used = set()
    with sync_playwright() as p:
        b = p.chromium.launch()
        for vw in ({'width': 390, 'height': 844}, {'width': 1280, 'height': 900}):
            for st in states:
                ctx = b.new_context(viewport=vw, service_workers='block')
                pg = ctx.new_page()
                pg.add_init_script('(' + json.dumps(st) + ');Object.entries(' + json.dumps(st) +
                                   ').forEach(([k,v])=>{if(!sessionStorage.cgInit)localStorage.setItem(k,v)});sessionStorage.cgInit=1')
                cdp = ctx.new_cdp_session(pg)
                sheets = {}
                cdp.on('CSS.styleSheetAdded', lambda e: sheets.__setitem__(e['header']['styleSheetId'], e['header'].get('sourceURL', '')))
                cdp.send('DOM.enable'); cdp.send('CSS.enable'); cdp.send('CSS.startRuleUsageTracking')
                pg.goto(url)
                pg.evaluate('window.gardenLoadStyles&&gardenLoadStyles()')  # măsurăm pe bundle.css complet
                pg.wait_for_timeout(2500)
                usage = cdp.send('CSS.stopRuleUsageTracking')['ruleUsage']
                bid = [k for k, v in sheets.items() if v.split('?')[0].endswith('/bundle.css')]
                ranges = [(u['startOffset'], u['endOffset']) for u in usage if u['used'] and u['styleSheetId'] in bid]
                for pre, s, e, bs, be in parse(css):
                    if pre.startswith(('@media', '@supports', '@layer')):
                        for p2, is_, ie, ibs, ibe in parse(css, bs, be):
                            if any(is_ <= a < ie for a, _ in ranges):
                                used.add(key(p2, pre))
                    elif any(s <= a < e for a, _ in ranges):
                        used.add(key(pre))
                ctx.close()
        b.close()
    LIST.write_text('\n'.join(sorted(used)) + '\n', encoding='utf-8')
    print(f'{len(used)} reguli critice → {LIST.name}')


if __name__ == '__main__':
    if '--extract' in sys.argv:
        build()
        extract(sys.argv[sys.argv.index('--extract') + 1])
    build()
