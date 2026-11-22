#!/usr/bin/env python3
"""Romanian diacritic subsets for the self-hosted fonts.

Romanian text needs only a handful of glyphs outside the "latin" subset: Ă ă Ș ș Ț ț
(plus the older cedilla forms Ş ş Ţ ţ). Without this, every Romanian page downloads the
full "latin-ext" file of each font it uses (35-85 KB each) for those few letters.

For every latin-ext face in assets/fonts/fonts.css this script writes a tiny subset
(`*-ro.woff2`, variable axes kept) and appends an @font-face for it with a unicode-range
of just those code points. CSS Fonts: when unicode ranges overlap, the face defined last
is tried first, so the small file wins for these letters and the full latin-ext file is
only downloaded when a page uses other extended characters.

Run after scripts/build-local-fonts.py:  python3 scripts/build-ro-font-subsets.py
Needs: pip install fonttools brotli
"""
import os
import re

from fontTools import subset
from fontTools.ttLib import TTFont

CSS = 'assets/fonts/fonts.css'
FILES = 'assets/fonts/files'
RO = [0x0102, 0x0103, 0x0218, 0x0219, 0x021A, 0x021B, 0x015E, 0x015F, 0x0162, 0x0163]
RANGE = 'U+0102-0103, U+015E-015F, U+0162-0163, U+0218-021B'
MARK = '/* ---- Romanian diacritic subsets (scripts/build-ro-font-subsets.py) ---- */'

css = open(CSS, encoding='utf-8').read()
if MARK in css:  # idempotent: drop the previous run's block
    css = css[:css.index(MARK)].rstrip() + '\n'

def minus_ro(ur):
    """Remove the Romanian code points from a unicode-range, so browsers (which fetch every
    face whose range matches the text) no longer download the latin-ext file for them."""
    parts = []
    for p in ur.split(','):
        p = p.strip()[2:]
        a, _, b = p.partition('-')
        lo, hi = int(a, 16), int(b or a, 16)
        cur = lo
        for cp in sorted(c for c in RO if lo <= c <= hi):
            if cur < cp:
                parts.append((cur, cp - 1))
            cur = cp + 1
        if cur <= hi:
            parts.append((cur, hi))
    return ', '.join(f'U+{a:04X}' if a == b else f'U+{a:04X}-{b:04X}' for a, b in parts)


def strip_block(m):
    name, body = m.group(1), m.group(2)
    if 'latin-ext' not in name:
        return m.group(0)
    body = re.sub(r'unicode-range:\s*([^;]+);', lambda u: f'unicode-range: {minus_ro(u.group(1))};', body)
    return f'/* {name} */\n@font-face {{{body}}}'


faces = re.findall(r'/\* ([^*]+latin-ext[^*]*) \*/\s*@font-face\s*\{([^}]*)\}', css)
out, saved, written = [], 0, 0
for name, body in faces:
    src = re.search(r"url\(\./files/([^)]+)\)", body).group(1)
    dst = src.replace('latin-ext', 'ro')
    font = TTFont(os.path.join(FILES, src))
    cmap = font.getBestCmap() or {}
    if not any(cp in cmap for cp in RO):
        continue
    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = ['*']
    opts.name_IDs = ['*']
    opts.notdef_outline = True
    sub = subset.Subsetter(opts)
    sub.populate(unicodes=[cp for cp in RO if cp in cmap])
    sub.subset(font)
    font.flavor = 'woff2'
    font.save(os.path.join(FILES, dst))
    saved += os.path.getsize(os.path.join(FILES, src)) - os.path.getsize(os.path.join(FILES, dst))
    written += 1
    new_body = re.sub(r"url\(\./files/[^)]+\)", f"url(./files/{dst})", body)
    new_body = re.sub(r'unicode-range:\s*[^;]+;', f'unicode-range: {RANGE};', new_body)
    out.append(f"/* {name.replace('latin-ext', 'ro')} */\n@font-face {{{new_body}}}")

css = re.sub(r'/\* ([^*]+) \*/\s*@font-face\s*\{([^}]*)\}', strip_block, css)
css += '\n' + MARK + '\n' + '\n'.join(out) + '\n'
open(CSS, 'w', encoding='utf-8').write(css)
print(f'{written} Romanian subsets; a Romanian page saves up to {saved // 1024} KB across all families')
