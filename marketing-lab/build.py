#!/usr/bin/env python3
"""Inline everything into one self-contained index.html (also copied as index.pen.html for CodePen)."""
import json, re, pathlib, subprocess

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / 'src'

# 1) compile TypeScript and wrap it as a global TSCRM object
subprocess.run(['npx', 'tsc'], cwd=ROOT / 'ts-crm', check=True)
crm_js = (ROOT / 'ts-crm/dist/crm.js').read_text()
names = re.findall(r'^export (?:const|function|let) (\w+)', crm_js, re.M)
crm_js = re.sub(r'^export ', '', crm_js, flags=re.M)
tscrm = 'const TSCRM = (() => {\n' + crm_js + '\nreturn { ' + ', '.join(names) + ' };\n})();'

def js_str(text):
    return json.dumps(text, ensure_ascii=False).replace('</', '<\\/')

consts = '\n'.join([
    'const TS_SOURCE = ' + js_str((ROOT / 'ts-crm/src/crm.ts').read_text()) + ';',
    'const TS_TESTS = ' + js_str((ROOT / 'ts-crm/tests/crm.test.ts').read_text()) + ';',
    'const EXT_MANIFEST = ' + js_str((ROOT / 'extension/manifest.json').read_text()) + ';',
])

parts = [(SRC / 'seo-analyzer.js').read_text(), tscrm, consts] + \
        [(SRC / f).read_text() for f in ['core.js', 'm-home.js', 'm-mkt.js', 'm-data.js', 'm-tech.js', 'm-think.js']] + \
        ['App.init();']
js = '\n\n'.join(parts)
assert '</script' not in js.lower(), 'unescaped </script> in bundle'

html = (SRC / 'shell.html').read_text()
html = html.replace('/*CSS*/', (SRC / 'style.css').read_text()).replace('/*JS*/', js)
(ROOT / 'index.html').write_text(html)
(ROOT / 'index.pen.html').write_text(html)
print(f'index.html: {len(html)/1024:.1f} KB, TSCRM exports: {", ".join(names)}')
