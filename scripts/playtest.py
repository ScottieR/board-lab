"""Scripted playtest: drives every recipe game through the Piece Simulator in headless
Chrome, asserts each core loop pays off, and saves screenshots to playtest/.

The seed of the Studio check loop. Run: npm run build && npx vite preview & python3 scripts/playtest.py
"""
import asyncio, json, sys
from playwright.async_api import async_playwright
import os
OUT=os.environ.get("PLAYTEST_OUT", "playtest/")
os.makedirs(OUT, exist_ok=True)
URL=os.environ.get("PLAYTEST_URL", "http://localhost:4173/")

async def rotate(pg, steps):
    for _ in range(steps):
        await pg.mouse.wheel(0,100); await pg.wait_for_timeout(40)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(**({"executable_path": os.environ["CHROME"]} if os.environ.get("CHROME") else {}))
        pg = await b.new_page(viewport={"width":1920,"height":1080})
        errs=[]
        pg.on("pageerror", lambda e: errs.append("PAGEERR "+str(e)))
        pg.on("console", lambda m: errs.append(m.text) if m.type in("error","warning") else None)
        res = {}
        # ---- Fizz Lab
        await pg.goto(URL+"#fizz-lab"); await pg.wait_for_timeout(400)
        await pg.mouse.move(800,520); await pg.keyboard.press("1")   # water
        await pg.mouse.move(1020,560); await pg.keyboard.press("2")  # fire
        await pg.mouse.move(1500,300); await pg.keyboard.press("8")  # sparkle (alone)
        await pg.mouse.move(800,520); await pg.wait_for_timeout(200)
        await rotate(pg, 7)   # pour water into fire -> steam
        await pg.wait_for_timeout(450)
        await pg.screenshot(path=OUT+"lab1.png")
        res["labAfterSteam"] = await pg.evaluate("window.__world.teamScore")
        await pg.wait_for_timeout(2500)
        await pg.mouse.move(1240,600); await pg.keyboard.press("4")  # air next to steam
        await pg.wait_for_timeout(200)
        await rotate(pg, 7)
        await pg.wait_for_timeout(350)
        await pg.screenshot(path=OUT+"lab2.png")
        res["labAfterCloud"] = await pg.evaluate("window.__world.teamScore")
        # ---- Peek Park
        await pg.keyboard.press("c"); await pg.goto(URL+"#peek-park"); await pg.wait_for_timeout(500)
        wanted = await pg.evaluate("window.__world.things.filter(t=>t.data.wanted).map(t=>[t.x,t.y])")
        res["wanted"] = wanted
        await pg.mouse.move(400,500); await pg.keyboard.press("1")
        await pg.mouse.move(1500,500); await pg.keyboard.press("2")
        await pg.mouse.move(1500,500); await rotate(pg, 6)
        wx,wy = wanted[0]
        await pg.mouse.move(400,500); await pg.mouse.down(); await pg.mouse.move(wx+15, wy, steps=12)
        await pg.wait_for_timeout(200)
        await pg.screenshot(path=OUT+"peek1.png")
        await pg.mouse.up()
        await pg.wait_for_timeout(700)
        res["peekScores"] = await pg.evaluate("window.__world.scores")
        await pg.screenshot(path=OUT+"peek2.png")
        # ---- Night Lights
        await pg.keyboard.press("c"); await pg.goto(URL+"#night-lights"); await pg.wait_for_timeout(400)
        await pg.mouse.move(500,540); await pg.keyboard.press("1")
        await pg.mouse.move(1400,300); await pg.keyboard.press("3"); await rotate(pg, 9)
        await pg.wait_for_timeout(1500)
        await pg.screenshot(path=OUT+"night.png")
        res["nightFound"] = await pg.evaluate("window.__world.teamScore")
        res["errors"] = errs
        print(json.dumps(res, indent=2))
        failures = []
        if res["labAfterSteam"] < 1: failures.append("Fizz Lab: water+fire did not make steam")
        if res["labAfterCloud"] < 2: failures.append("Fizz Lab: steam+air did not make cloud")
        if sum(res["peekScores"]) < 1: failures.append("Peek Park: lens did not claim a wanted character")
        if res["nightFound"] < 1: failures.append("Night Lights: lanterns found nothing")
        if any(e.startswith("PAGEERR") for e in errs): failures.append("page errors")
        print("PASS" if not failures else "FAIL: " + "; ".join(failures))
        sys.exit(1 if failures else 0)
        await b.close()

asyncio.run(main())
