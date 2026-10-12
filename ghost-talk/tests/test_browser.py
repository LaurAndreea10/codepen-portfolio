"""Browser checks for Ghost Talk (Playwright + Chromium).

Run from the repository root with a static server:
    python -m http.server 8000 --bind 127.0.0.1 &
    GHOST_URL=http://localhost:8000/ghost-talk/ python ghost-talk/tests/test_browser.py
"""
import os
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

URL = os.environ.get("GHOST_URL", "http://localhost:8000/ghost-talk/")
SHOTS = Path(os.environ.get("GHOST_SHOTS", "ghost-shots"))
SHOTS.mkdir(parents=True, exist_ok=True)
failures = []


def check(name, ok, detail=""):
    print(("PASS " if ok else "FAIL ") + name + (f" — {detail}" if detail and not ok else ""))
    if not ok:
        failures.append(name)


def run(p, width, height, mobile):
    browser = p.chromium.launch()
    ctx = browser.new_context(viewport={"width": width, "height": height}, is_mobile=mobile, has_touch=mobile)
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(URL)
    page.wait_for_selector("#ghost")
    tag = f"{width}px"

    check(f"[{tag}] no horizontal scroll", page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1"))
    page.fill("#human", "Bună seara")
    page.wait_for_timeout(200)
    check(f"[{tag}] classic translation", page.inner_text("#ghost").strip().endswith("〰〰〰"), page.inner_text("#ghost"))

    page.click("label:has(#d-mirror)")
    page.click("#m-dec")
    page.wait_for_timeout(200)
    check(f"[{tag}] mirror decodes back", page.inner_text("#ghost").strip() == "Bună seara", page.inner_text("#ghost"))
    page.click("#m-enc")

    page.click("#t-play")
    page.select_option("#game", "boo")
    prompt = page.inner_text("#ghost").strip()
    n = int(prompt.split(" ")[0])
    answer = "BooScary" if n % 15 == 0 else "Boo" if n % 3 == 0 else "Scary" if n % 5 == 0 else str(n)
    page.fill("#answer", answer)
    page.press("#answer", "Enter")
    check(f"[{tag}] BooScary round accepts the rule", "+" in page.inner_text("#result"), page.inner_text("#result"))

    page.select_option("#game", "hangman")
    for k in "etaoinsrlucmdpb":
        page.keyboard.press(k)
    check(f"[{tag}] hangman reacts to the keyboard", page.locator(".key.hit, .key.miss").count() > 0)

    page.click("#t-story")
    page.click("#choices button >> nth=1")
    page.fill("#puzzle-input", "priieeteen" if "PRIETEN" in page.inner_text("#story-text") else "friieend")
    page.click("#puzzle-go")
    check(f"[{tag}] story riddle opens the gate", "bufniță" in page.inner_text("#story-text") or "owl" in page.inner_text("#story-text"))

    page.click("#t-tests")
    page.wait_for_selector("#tbadge.pass, #tbadge.fail")
    check(f"[{tag}] in-page Jest suite passes", page.inner_text("#tbadge") == "PASS", page.inner_text("#summary"))
    check(f"[{tag}] API coverage is complete", "100%" in page.inner_text("#cov-pct"), page.inner_text("#cov-pct"))
    page.screenshot(path=str(SHOTS / f"tests-{tag}.png"), full_page=False)

    page.click("#t-talk")
    page.screenshot(path=str(SHOTS / f"talk-{tag}.png"), full_page=True)
    check(f"[{tag}] no page errors", not errors, "; ".join(errors))

    # Offline: the service worker caches the app after the first visit.
    page.evaluate("navigator.serviceWorker && navigator.serviceWorker.ready")
    page.reload()
    page.wait_for_timeout(800)
    ctx.set_offline(True)
    page.reload()
    page.wait_for_selector("#ghost", timeout=5000)
    check(f"[{tag}] works offline after the first visit", page.inner_text("h1") == "Ghost Talk")
    browser.close()


with sync_playwright() as p:
    run(p, 390, 844, True)
    run(p, 1280, 900, False)

print(f"\n{len(failures)} failure(s)")
sys.exit(1 if failures else 0)
