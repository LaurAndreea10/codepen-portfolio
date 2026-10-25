"""Builds the social preview images (Open Graph, 1200x630) used by the portfolio.

Why: Facebook, LinkedIn, WhatsApp and X do not render SVG previews, and
og-cover.jpg was referenced by 36 project pages but missing from the repo.

Outputs:
  og-cover.jpg                    generic portfolio card (fixes the 36 pages)
  assets/og/<name>.jpg            JPEG copies of the SVG posters + one card per game

Run (needs Playwright + Chromium):  python3 scripts/build-og-images.py
Optional: FONT_DIR=/path/with/fraunces-600.ttf,jetbrains-mono-600.ttf
"""
import os
import pathlib
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "og"
OUT.mkdir(parents=True, exist_ok=True)
FONT_DIR = os.environ.get("FONT_DIR", "")


def font_face():
    if not FONT_DIR:
        return ""
    faces = []
    for fam, file in [("Fraunces", "fraunces-600.ttf"), ("JetBrains Mono", "jetbrains-mono-600.ttf")]:
        p = pathlib.Path(FONT_DIR) / file
        if p.exists():
            faces.append(f"@font-face{{font-family:'{fam}';src:url('file://{p}');font-weight:400 800}}")
    return "".join(faces)


BASE_CSS = """
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px;overflow:hidden}
body{font-family:Inter,system-ui,sans-serif;color:#eef4ff;background:#071226}
.card{position:relative;width:1200px;height:630px;padding:64px 72px;display:grid;grid-template-columns:1fr 330px;gap:40px;align-items:center;
  background:radial-gradient(circle at 8% 0%,rgba(79,140,255,.30),transparent 42%),radial-gradient(circle at 100% 100%,var(--glow),transparent 50%),linear-gradient(160deg,#0b1730,#071226 60%)}
.card::after{content:"";position:absolute;inset:18px;border:1px solid rgba(255,255,255,.08);border-radius:28px;pointer-events:none}
.eyebrow{font-family:'JetBrains Mono',ui-monospace,monospace;font-weight:600;letter-spacing:.14em;font-size:20px;color:var(--accent)}
h1{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:var(--size,82px);line-height:1.02;letter-spacing:-.02em;margin:22px 0 18px}
p{font-size:29px;line-height:1.35;color:#b8c7e4;max-width:640px}
.chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:30px}
.chips span{font-family:'JetBrains Mono',ui-monospace,monospace;font-weight:600;font-size:19px;padding:8px 14px;border-radius:10px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);color:#dbe6ff}
.art{width:330px;height:330px;border-radius:50%;display:grid;place-items:center;font-size:170px;line-height:1;
  background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.18),transparent 55%),radial-gradient(circle,var(--glow),transparent 70%);border:2px solid rgba(255,255,255,.12)}
.foot{position:absolute;left:72px;bottom:44px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:18px;color:#7f93b8;letter-spacing:.04em}
.mono{font-family:Fraunces,Georgia,serif;font-size:150px;font-weight:600;letter-spacing:-.04em;background:linear-gradient(135deg,#4f8cff,#8b5cf6);-webkit-background-clip:text;color:transparent}
"""

GAMES = [
    ("booscary", "🎃", "Halloween BooScary", "FizzBuzz cu Boo, Scary și BooScary: șase moduri și un atelier de dovleci.", ["CodePen Challenge", "RO/EN", "314 teste"], "#f97316", "rgba(249,115,22,.38)"),
    ("ghost-talk", "👻", "Ghost Talk", "Limba fantomelor: owl → owl-boo, candy → andy-coo, cu dialecte și jocuri.", ["CodePen Challenge", "RO/EN", "Jest"], "#a78bfa", "rgba(167,139,250,.38)"),
    ("pumpkin-weigh-in", "⚖️", "Pumpkin Weigh-In", "Cântar de dovleci, de la Tiny Gourd la Legendary.", ["CodePen Challenge", "Jest", "lb / kg"], "#f59e0b", "rgba(245,158,11,.36)"),
    ("serpent-prism", "🐍", "Serpent Prism", "Snake × Zuma: potrivește culorile într-o arenă de sticlă.", ["Canvas", "RO/EN", "PWA"], "#22d3ee", "rgba(34,211,238,.32)"),
    ("slidestorm-arena", "🌊", "SlideStorm Arena", "Tobogane, apă, dune și sporturi: 100 de niveluri.", ["Canvas", "RO/EN", "Zen mode"], "#38bdf8", "rgba(56,189,248,.34)"),
    ("puck-pool-arena", "🎱", "Puck & Pool Arena", "Air hockey × biliard, contra AI sau pe ture.", ["Canvas", "AI", "RO/EN"], "#22c55e", "rgba(34,197,94,.32)"),
    ("livada", "🍎", "LIVADA", "Landing page cinematic pentru un suc presat la rece din livezile Moldovei.", ["Scroll", "RO/EN", "Landing page"], "#ef4444", "rgba(239,68,68,.34)"),
    ("livada-joc", "🍒", "LIVADA: Culesul", "Joc de tăiat fructe: viespi, mărul de aur și patru moduri.", ["Canvas", "RO/EN", "Offline"], "#f43f5e", "rgba(244,63,94,.34)"),
    ("gimnaziu-space", "📐", "Gimnaziu Space", "Recapitulare pentru clasele V–VIII și Evaluarea Națională.", ["Formule", "Quiz", "RO/EN"], "#60a5fa", "rgba(96,165,250,.34)"),
    ("skydreams-portal", "☁️", "SkyDreams Portal", "Curse printre nori, Cloud Maze, Daily Maze și campionat.", ["Canvas", "RO/EN", "Fără cont"], "#93c5fd", "rgba(147,197,253,.32)"),
    ("growth-quest", "📈", "LaurAI Growth Quest", "Joc de agenție: CRM, campanii, calendar editorial și analiză.", ["CRM", "RO/EN", "Offline"], "#34d399", "rgba(52,211,153,.32)"),
]


def game_html(slug, emoji, title, tagline, chips, accent, glow):
    size = "82px" if len(title) <= 16 else "66px"
    path = "livada/joc/" if slug == "livada-joc" else f"{slug}/"
    return f"""<!doctype html><meta charset="utf-8"><style>{font_face()}{BASE_CSS}</style>
<div class="card" style="--accent:{accent};--glow:{glow};--size:{size}">
  <div><span class="eyebrow">LAURA ANDREEA · PORTOFOLIU</span><h1>{title}</h1><p>{tagline}</p>
  <div class="chips">{''.join(f'<span>{c}</span>' for c in chips)}</div></div>
  <div class="art">{emoji}</div>
  <span class="foot">laurandreea10.github.io/codepen-portfolio/{path}</span>
</div>"""


COVER = f"""<!doctype html><meta charset="utf-8"><style>{{FONTS}}{BASE_CSS}</style>
<div class="card" style="--accent:#76a9ff;--glow:rgba(139,92,246,.35)">
  <div><span class="eyebrow">CRM · MARKETING · FRONT-END</span><h1>Laura Andreea</h1>
  <p>Front-end CRM &amp; Dashboard Developer. Proiecte construite în timpul liber, cu cod public și istoric de versiuni.</p>
  <div class="chips"><span>React + Vite</span><span>CRM &amp; dashboards</span><span>Jocuri</span><span>RO / EN</span></div></div>
  <div class="art" style="font-size:0"><span class="mono">LA</span></div>
  <span class="foot">laurandreea10.github.io/codepen-portfolio</span>
</div>"""


def poster_html(svg):
    return f"""<!doctype html><meta charset="utf-8"><style>*{{margin:0}}html,body{{width:1200px;height:630px;overflow:hidden;background:#071226}}
img{{width:1200px;height:630px;object-fit:cover;object-position:center}}</style><img src="file://{ROOT / svg}">"""


def main():
    exe = os.environ.get("CHROMIUM")
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=exe) if exe else p.chromium.launch()
        page = browser.new_page(viewport={"width": 1200, "height": 630})

        tmp = OUT / "_render.html"

        def shot(html, path):
            # A real file:// page, so local SVGs and fonts are allowed to load.
            tmp.write_text(html, encoding="utf-8")
            page.goto(tmp.as_uri(), wait_until="load")
            page.wait_for_timeout(300)
            page.screenshot(path=str(path), type="jpeg", quality=86)
            print("wrote", path.relative_to(ROOT), path.stat().st_size // 1024, "KB")

        shot(COVER.replace("{FONTS}", font_face()), ROOT / "og-cover.jpg")
        for svg in ["alpis-fusion-demo-poster.svg", "clientflow-demo-poster.svg", "impact-path-demo-poster.svg", "og-cover.svg"]:
            if (ROOT / svg).exists():
                name = "og-cover-svg" if svg == "og-cover.svg" else svg.replace(".svg", "")
                shot(poster_html(svg), OUT / f"{name}.jpg")
        for g in GAMES:
            shot(game_html(*g), OUT / f"{g[0]}.jpg")
        tmp.unlink(missing_ok=True)
        browser.close()


if __name__ == "__main__":
    main()
