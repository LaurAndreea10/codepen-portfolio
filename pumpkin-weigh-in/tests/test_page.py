"""Pumpkin Weigh-In — browser checks for index.html and test-results.html.

Serve the repository root (python -m http.server 8000), then:
  PUMPKIN_URL=http://localhost:8000/pumpkin-weigh-in/ python pumpkin-weigh-in/tests/test_page.py
"""
import asyncio
import os

from playwright.async_api import async_playwright

URL = os.environ.get("PUMPKIN_URL", "http://localhost:8000/pumpkin-weigh-in/")
SHOTS = os.environ.get("PUMPKIN_SHOTS")


async def type_weight(page, value):
    await page.fill("#weight", value)
    await page.dispatch_event("#weight", "input")


async def check(page, label, condition):
    if not condition:
        raise AssertionError(label)
    print("✓", label)


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        for width in (390, 1280):
            page = await browser.new_page(viewport={"width": width, "height": 900})
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            await page.goto(URL)
            await page.wait_for_selector("#category")

            category = lambda: page.text_content("#category")
            await check(page, f"{width}px: starts as Tiny Gourd", await category() == "Tiny Gourd")

            for weight, expected in [("1", "Mini"), ("10", "Carving"), ("50", "Giant"),
                                     ("1000", "Record Breaker!"), ("2749", "Legendary"),
                                     ("heavy", "Invalid weight")]:
                await type_weight(page, weight)
                await check(page, f"{width}px: {weight} → {expected}", await category() == expected)

            await type_weight(page, "0")
            await page.click("#water")
            await check(page, f"{width}px: watering adds 10 lb", await page.input_value("#weight") == "10")

            await page.click(".step--down")
            await check(page, f"{width}px: − removes 1 lb", await page.input_value("#weight") == "9")

            box = await page.locator(".step--up").bounding_box()
            await page.mouse.move(box["x"] + 10, box["y"] + 10)
            await page.mouse.down()
            await page.wait_for_timeout(2500)
            await page.mouse.up()
            held = float(await page.input_value("#weight"))
            await check(page, f"{width}px: holding + accelerates (reached {held} lb)", held > 100)

            await page.click("[data-lang=en]")
            await check(page, f"{width}px: English copy", "Water the pumpkin" in await page.text_content("#water"))
            await check(page, f"{width}px: category name stays in English", await category() in (
                "Giant", "Record Breaker!", "Legendary"))

            overflow = await page.evaluate("document.documentElement.scrollWidth > innerWidth")
            await check(page, f"{width}px: no sideways scroll", not overflow)
            await check(page, f"{width}px: no script errors", not errors)

            if SHOTS:
                os.makedirs(SHOTS, exist_ok=True)
                await page.screenshot(path=f"{SHOTS}/pumpkin-{width}.png", full_page=True)
            await page.close()

        page = await browser.new_page()
        await page.goto(URL + "test-results.html")
        await page.wait_for_function("document.title.startsWith('✓') || document.title.startsWith('✕')")
        await check(page, "test-results.html: every test passes", (await page.title()).startswith("✓"))
        await browser.close()


asyncio.run(main())
