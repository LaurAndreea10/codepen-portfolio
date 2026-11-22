import os, re, shutil, sys
# Utilizare: npm i @fontsource-variable/<familie> @fontsource/<familie> într-un folder temporar, apoi:
#   python3 scripts/build-local-fonts.py assets/fonts <folder>/node_modules
NM = sys.argv[2]
OUT = sys.argv[1]  # assets/fonts
os.makedirs(f'{OUT}/files', exist_ok=True); os.makedirs(f'{OUT}/licenses', exist_ok=True)
# (Google family name, package, [css files])
V = '@fontsource-variable/'; S = '@fontsource/'
spec = [
 ('Fraunces', V+'fraunces', ['opsz.css', 'opsz-italic.css']),
 ('Inter', V+'inter', ['wght.css', 'wght-italic.css']),
 ('JetBrains Mono', V+'jetbrains-mono', ['wght.css', 'wght-italic.css']),
 ('Space Grotesk', V+'space-grotesk', ['wght.css']),
 ('Orbitron', V+'orbitron', ['wght.css']),
 ('Outfit', V+'outfit', ['wght.css']),
 ('Nunito', V+'nunito', ['wght.css', 'wght-italic.css']),
 ('Lexend', V+'lexend', ['wght.css']),
 ('DM Sans', V+'dm-sans', ['opsz.css', 'opsz-italic.css']),
 ('Sora', V+'sora', ['wght.css']),
 ('Lora', V+'lora', ['wght.css', 'wght-italic.css']),
 ('Bricolage Grotesque', V+'bricolage-grotesque', ['standard.css']),
 ('Syne', V+'syne', ['wght.css']),
 ('Manrope', V+'manrope', ['wght.css']),
 ('Inter Tight', V+'inter-tight', ['wght.css', 'wght-italic.css']),
 ('Anybody', V+'anybody', ['standard.css', 'standard-italic.css']),
 ('Share Tech Mono', S+'share-tech-mono', ['400.css']),
 ('Atkinson Hyperlegible', S+'atkinson-hyperlegible', ['400.css', '400-italic.css', '700.css', '700-italic.css']),
 ('Special Elite', S+'special-elite', ['400.css']),
 ('Instrument Serif', S+'instrument-serif', ['400.css', '400-italic.css']),
 ('DM Mono', S+'dm-mono', ['300.css', '400.css', '500.css', '400-italic.css']),
 ('Bebas Neue', S+'bebas-neue', ['400.css']),
 ('Space Mono', S+'space-mono', ['400.css', '400-italic.css', '700.css', '700-italic.css']),
 ('Rajdhani', S+'rajdhani', ['300.css', '400.css', '500.css', '600.css', '700.css']),
 ('IBM Plex Mono', S+'ibm-plex-mono', ['300.css', '400.css', '500.css', '600.css', '700.css']),
]
KEEP = ('latin', 'latin-ext')
out = ['/* Fonturi găzduite local (licență SIL OFL 1.1, surse: pachetele npm @fontsource).',
       '   Înlocuiesc Google Fonts ca browserul să nu trimită IP-ul vizitatorului către Google (GDPR).',
       '   Generat cu scripts/build-local-fonts.py — nu edita manual. */', '']
total = 0
for fam, pkg, files in spec:
    d = os.path.join(NM, pkg)
    lic = os.path.join(d, 'LICENSE')
    if os.path.exists(lic): shutil.copy(lic, f'{OUT}/licenses/{pkg.split("/")[1]}.txt')
    for cf in files:
        css = open(os.path.join(d, cf)).read()
        for m in re.finditer(r'/\* ([\w-]+) \*/\s*@font-face\s*\{(.*?)\}', css, re.S):
            name, body = m.group(1), m.group(2)
            sub = next((k for k in sorted(KEEP, key=len, reverse=True) if f'-{k}-' in name + '-'), None)
            # name like fraunces-latin-ext-opsz-normal / atkinson-hyperlegible-latin-400-normal
            if '-latin-ext-' in name: sub = 'latin-ext'
            elif '-latin-' in name: sub = 'latin'
            else: continue
            src = re.search(r'url\(\./files/([^)]+\.woff2)\)\s*format\(\'([^\']+)\'\)', body)
            fn = src.group(1)
            shutil.copy(os.path.join(d, 'files', fn), f'{OUT}/files/{fn}'); total += os.path.getsize(f'{OUT}/files/{fn}')
            style = re.search(r'font-style:\s*([^;]+);', body).group(1)
            weight = re.search(r'font-weight:\s*([^;]+);', body).group(1)
            stretch = re.search(r'font-stretch:\s*([^;]+);', body)
            ur = re.search(r'unicode-range:\s*([^;]+);', body)
            out.append(f"/* {name} */\n@font-face {{\n  font-family: '{fam}';\n  font-style: {style};\n  font-weight: {weight};\n" +
                       (f"  font-stretch: {stretch.group(1)};\n" if stretch else '') +
                       f"  font-display: swap;\n  src: url(./files/{fn}) format('woff2');\n" +
                       (f"  unicode-range: {ur.group(1)};\n" if ur else '') + '}\n')
open(f'{OUT}/fonts.css', 'w').write('\n'.join(out))
print('faces', len(out) - 4, 'bytes', total, 'files', len(os.listdir(f'{OUT}/files')))
