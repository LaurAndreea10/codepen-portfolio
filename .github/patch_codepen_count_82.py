from pathlib import Path
import re

ROOT = Path('.')
TEXT_EXTS = {'.html', '.js', '.json', '.md', '.txt'}
skip_dirs = {'.git', 'node_modules', 'dist', 'vendor'}
changed = []

for path in ROOT.rglob('*'):
    if not path.is_file() or path.suffix.lower() not in TEXT_EXTS:
        continue
    if any(part in skip_dirs for part in path.parts):
        continue
    try:
        old = path.read_text(encoding='utf-8')
    except Exception:
        continue
    new = old
    # Visible RO/EN portfolio-count phrases.
    new = re.sub(r'(?<!\d)(?:64|66)(?=\s*(?:proiecte|projects|pens)\b)', '82', new, flags=re.I)
    # Intro animated count and common static/dynamic fallbacks.
    new = re.sub(r'\bvar\s+v1\s*=\s*(?:64|66)\b', 'var v1=82', new)
    new = re.sub(r'\bconst\s+CODEPEN_COUNT\s*=\s*(?:64|66)\b', 'const CODEPEN_COUNT = 82', new)
    new = re.sub(r'(--c1\s*:\s*)(?:64|66)(\b)', r'\g<1>82\2', new)
    new = re.sub(r'(<strong[^>]+id=["\']scan-proj-count["\'][^>]*>)(?:64|66)(</strong>)', r'\g<1>82\2', new, flags=re.I)
    # JSON/JS-ish named counters where present.
    new = re.sub(r'((?:codepen|project|pen)(?:Count|_count| count)?\s*[:=]\s*)(?:64|66)\b', r'\g<1>82', new, flags=re.I)
    if new != old:
        path.write_text(new, encoding='utf-8')
        changed.append(str(path))

print('Updated files:')
for p in changed:
    print('-', p)

# Self-delete helper; workflow deletes itself too.
Path('.github/patch_codepen_count_82.py').unlink(missing_ok=True)
