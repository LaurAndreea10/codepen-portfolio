#!/usr/bin/env python3
"""Concatenează foile de stil ale Grădinii Curioase și le pune inline în index.html,
între <style id="cg-bundle">…</style>, ca să nu existe nicio foaie care blochează randarea.
Sursele (*.css) rămân cele de editat; rulează scriptul după orice modificare."""
import pathlib, re
D = pathlib.Path(__file__).resolve().parent.parent / 'curious-garden'
ORDER = ['expansion.css','premium.css','arcade.css','home.css','learning.css','extras.css','studio.css']
out = ['/* generat de scripts/build-curious-garden-css.py — editează sursele, nu acest fișier */']
for f in ORDER:
    css = (D/f).read_text(encoding='utf-8')
    css = re.sub(r'/\*(?!!).*?\*/', '', css, flags=re.S)
    css = re.sub(r'\s*\n\s*', '\n', css).strip()
    out.append(f'/* {f} */\n{css}')
css = '\n'.join(out)
html = (D/'index.html').read_text(encoding='utf-8')
new, n = re.subn(r'<style id="cg-bundle">.*?</style>', lambda m: f'<style id="cg-bundle">\n{css}\n</style>', html, flags=re.S)
if n != 1:
    raise SystemExit('marcajul <style id="cg-bundle"> lipsește din index.html')
(D/'index.html').write_text(new, encoding='utf-8')
print('cg-bundle inline:', len(css), 'bytes')
