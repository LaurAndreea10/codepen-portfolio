"""Browser checks for the simple Ghost Talk page (Playwright + Chromium).

From the repository root:
    python -m http.server 8000 --bind 127.0.0.1 &
    GHOST_SIMPLE_URL=http://localhost:8000/ghost-talk/simple/ python ghost-talk/tests/test_page.py
"""
import os
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

URL = os.environ.get("GHOST_SIMPLE_URL", "http://localhost:8000/ghost-talk/simple/")
SHOTS = Path(os.environ.get("GHOST_SHOTS", "ghost-shots"))
SHOTS.mkdir(parents=True, exist_ok=True)
failures = []


def check(name, ok, detail=""):
    print(("PASS " if ok else "FAIL ") + name + (f" — {detail}" if detail and not ok else ""))
    if not ok:
        failures.append(name)


with sync_playwright() as p:
    browser = p.chromium.launch()
    for width, height, mobile in [(360, 740, True), (1280, 900, False)]:
        tag = f"{width}px"
        page = browser.new_context(viewport={"width": width, "height": height}, is_mobile=mobile, has_touch=mobile).new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(URL)

        check(f"[{tag}] the conversion shows on load", page.inner_text("#ghost").strip() == "andy-coo", page.inner_text("#ghost"))

        page.fill("#human", "owl")
        check(f"[{tag}] converts while typing", page.inner_text("#ghost").strip() == "owl-boo", page.inner_text("#ghost"))

        page.click(".examples button:has-text('Happy Halloween')")
        check(f"[{tag}] example sentence", page.inner_text("#ghost").strip() == "Appy-hoo Alloween-hoo, andy-coo!", page.inner_text("#ghost"))
        check(f"[{tag}] one explanation per word", page.locator("#steps li").count() == 3)
        check(f"[{tag}] explains the consonant rule", "consonant “c”" in page.inner_text("#steps") and "capital stays at the front" in page.inner_text("#steps"), page.inner_text("#steps"))

        check(f"[{tag}] no horizontal scroll", page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1"))
        page.screenshot(path=str(SHOTS / f"page-{tag}.png"), full_page=True)
        check(f"[{tag}] no page errors", not errors, "; ".join(errors))

    page = browser.new_page()
    page.goto(URL + "../test-results.html")
    page.wait_for_selector("#summary:not(:empty)")
    summary = page.inner_text("#summary")
    check("test-results.html runs ghosttalk.test.js and all pass", "failed" not in summary and "10 passed" in summary, summary)
    browser.close()

print(f"\n{len(failures)} failure(s)")
sys.exit(1 if failures else 0)
