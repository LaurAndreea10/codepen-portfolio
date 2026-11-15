#!/usr/bin/env python3
"""Recompute the story's data from this repository and inline it into index.html.

Sources: `git log` (author dates), `git ls-tree` (files at HEAD) and ../projects.json.
Run from anywhere:  python3 portfolio-in-data/build.py
Needs full history (not a shallow clone): `git fetch --unshallow` first if needed.
"""
import json, pathlib, re, subprocess, collections, datetime

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
git = lambda *a: subprocess.run(['git', '-C', str(ROOT), *a], check=True, capture_output=True, text=True).stdout

dates = git('log', '--format=%ad', '--date=short').split()
per_day = collections.Counter(dates)
first, last = min(dates), max(dates)
d0, d1 = datetime.date.fromisoformat(first), datetime.date.fromisoformat(last)
days = []
for i in range((d1 - d0).days + 1):
    d = (d0 + datetime.timedelta(days=i)).isoformat()
    days.append([d, per_day.get(d, 0)])
months = collections.OrderedDict()
for d, c in days:
    months[d[:7]] = months.get(d[:7], 0) + c
weekday = [0] * 7
for d in dates:
    weekday[datetime.date.fromisoformat(d).weekday()] += 1
streak = best = 0
for _, c in days:
    streak = streak + 1 if c else 0
    best = max(best, streak)
top_day = max(days, key=lambda x: x[1])

projects = json.loads((ROOT / 'projects.json').read_text())
cats = collections.Counter(p.get('category', 'other') for p in projects).most_common()
tags = collections.Counter(t for p in projects for t in p.get('tags', []))

ext = collections.defaultdict(lambda: [0, 0])
files = 0
for line in git('ls-tree', '-r', '-l', 'HEAD').splitlines():
    meta, path = line.split('\t', 1)
    size = meta.split()[3]
    name = path.rsplit('/', 1)[-1]
    e = name.rsplit('.', 1)[-1].lower() if '.' in name else 'other'
    ext[e][0] += 1
    ext[e][1] += int(size) if size.isdigit() else 0
    files += 1

data = {
    'generated': datetime.date.today().isoformat(),
    'commits': {'total': len(dates), 'first': first, 'last': last, 'days': days, 'months': list(months.items()),
                'weekday': weekday, 'activeDays': sum(1 for _, c in days if c), 'topDay': top_day, 'streak': best},
    'projects': {'total': len(projects), 'cats': cats, 'tags': tags.most_common(10),
                 'accessible': tags.get('Accessibility', 0), 'bilingual': tags.get('RO/EN', 0)},
    'files': {'total': files, 'ext': sorted(([k, v[0], v[1]] for k, v in ext.items()), key=lambda x: -x[1])[:8]},
}
blob = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
html = (HERE / 'index.html').read_text()
new, n = re.subn(r'/\*DATA:START\*/.*?/\*DATA:END\*/', lambda m: '/*DATA:START*/' + blob + '/*DATA:END*/', html, flags=re.S)
assert n == 1, 'data marker not found in index.html'
(HERE / 'index.html').write_text(new)
(HERE / 'index.pen.html').write_text(new)
print(f"{len(dates)} commits, {first} -> {last}, {len(projects)} projects, {files} files")
