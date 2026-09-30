"""Grădina Curioasă — festivaluri de sărbători (câte o provocare pe zi) și calendarul de Advent. Data e simulată cu page.clock."""
import os,tempfile,datetime
from playwright.sync_api import sync_playwright
URL=os.environ.get('GARDEN_URL','http://localhost:8000/curious-garden/')
SHOTS=os.environ.get('GARDEN_SHOTS',os.path.join(tempfile.gettempdir(),'garden-shots'))+'/'
os.makedirs(SHOTS,exist_ok=True)
fails=[]
def check(c,msg):
    print(('OK   ' if c else 'FAIL ')+msg)
    if not c: fails.append(msg)
F='#festival'
def status(pg): return pg.inner_text(f'{F} .party-status')
def wins(pg,g): return pg.evaluate(f"(()=>{{const d=gardenRewards.read();return (d.stats&&d.stats['{g}']&&d.stats['{g}'].w)||0}})()")
def solve(pg):
    """Rezolvă provocarea deschisă, oricare ar fi tipul ei."""
    t=pg.get_attribute(f'{F} .fest-stage','data-type')
    if t=='find':
        target=pg.get_attribute(f'{F} .fest-stage','data-target')
        for b in pg.locator(f'{F} .fest-item').all():
            if b.get_attribute('data-s')==target: b.click()
    elif t=='pattern':
        for _ in range(6):
            nx=pg.get_attribute(f'{F} .fest-stage','data-next')
            if not nx: break
            pg.locator(f'{F} .fest-opt[data-s="{nx}"]').click()
    elif t=='memory':
        cards=pg.eval_on_selector_all(f'{F} .fest-card','bs=>bs.map(b=>b.dataset.s)'); seen={}
        for i,s in enumerate(cards): seen.setdefault(s,[]).append(i)
        for s,(a,b) in seen.items():
            pg.locator(f'{F} .fest-card').nth(a).click(); pg.locator(f'{F} .fest-card').nth(b).click()
    elif t=='count':
        ans=pg.get_attribute(f'{F} .fest-stage','data-answer'); pg.click(f'{F} .craft-answer:text-is("{ans}")')
    elif t=='decorate':
        for x in (0.3,0.5,0.7):
            pg.evaluate("document.querySelector('#festival .fest-deco-view').scrollIntoView({block:'center'});document.querySelectorAll('.bia-bubble').forEach(e=>e.remove())"); pg.wait_for_timeout(120)
            bb=pg.locator(f'{F} .fest-deco-view').bounding_box(); pg.mouse.click(bb['x']+bb['width']*x,bb['y']+bb['height']*0.5)
        pg.click(f'{F} .fest-finish')
    return t
with sync_playwright() as p:
    br=p.chromium.launch(); errs=[]
    def page(when,age=7):
        ctx=br.new_context(viewport={'width':390,'height':844}); pg=ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.clock.install(time=datetime.datetime.fromisoformat(when)); pg.goto(URL)
        d=datetime.date.fromisoformat(when[:10]); pg.fill('#dob',f'{d.year-age}-02-02'); pg.fill('#nickname','Ana'); pg.click('#start'); pg.wait_for_timeout(400)
        pg.evaluate("document.body.classList.add('quiet');document.querySelectorAll('.bia-bubble').forEach(e=>e.remove())"); return ctx,pg
    # Halloween, 27 octombrie: ziua 4 din 9
    ctx,pg=page('2026-10-27T10:00:00')
    check('ziua 4 din 9' in pg.inner_text('.festival-home'),'Home announces the Halloween festival: day 4 of 9')
    pg.click('.festival-home button'); pg.wait_for_timeout(150)
    check(pg.evaluate("document.getElementById('app').dataset.view")=='festival' and pg.get_attribute('.garden-nav button[data-go=activities]','aria-pressed')=='true','the festival opens (menu keeps Activities highlighted)')
    check(pg.locator(f'{F} .fest-day').count()==9 and pg.locator(f'{F} .fest-day.locked').count()==5,'9 days: days 1–4 open, 5–9 locked')
    pg.click(f'{F} .fest-day[data-day="5"]'); check('mâine' in status(pg),'a future day says when it opens (tomorrow)')
    types=[]
    for day in range(1,5):
        pg.click(f'{F} .fest-day[data-day="{day}"]'); pg.wait_for_timeout(80)
        if day==1:
            target=pg.get_attribute(f'{F} .fest-stage','data-target')
            pg.locator(f'{F} .fest-item:not([data-s="{target}"])').first.click(); check('Mai caută' in status(pg),'find: a wrong item gives a hint')
            check(pg.locator(f'{F} .fest-item[data-s="{target}"]').count()==5,'age 7: find 5 items')
        types.append(solve(pg)); pg.wait_for_timeout(60)
        check('Ai primit' in status(pg),f'day {day} ({types[-1]}) completed with a reward')
        pg.click(f'{F} .fest-back'); pg.wait_for_timeout(60)
    check(types==['find','pattern','memory','count'],f'each day brings another kind of challenge {types}')
    check(pg.locator(f'{F} .fest-day.done').count()==4 and len(pg.inner_text(f'{F} .fest-collection').split(':',1)[1].split())==4,'four rewards in the festival collection')
    check(wins(pg,'festival-find')==1 and wins(pg,'festival-count')==1,'festival games count for the parent report')
    ctx.close()
    # 29 octombrie: ziua 5, decorează dovleacul
    ctx,pg=page('2026-10-29T10:00:00',10)
    pg.click('.festival-home button'); pg.click(f'{F} .fest-day[data-day="5"]'); pg.wait_for_timeout(80)
    check(pg.get_attribute(f'{F} .fest-stage','data-type')=='decorate' and pg.locator(f'{F} .fest-base').count()==1,'day 5: decorate a pumpkin')
    pg.evaluate("document.querySelector('#festival .fest-deco-view').scrollIntoView({block:'center'})"); pg.wait_for_timeout(120)
    bb=pg.locator(f'{F} .fest-deco-view').bounding_box(); pg.mouse.click(bb['x']+bb['width']*.5,bb['y']+bb['height']*.5); pg.click(f'{F} .fest-finish')
    check('Mai pune 2' in status(pg),'decorating needs at least 3 stickers')
    pg.click(f'{F} .pot-group:nth-child(1) button:nth-child(2)'); solve(pg)
    check('Ai primit' in status(pg),'the decorated pumpkin completes the day')
    pg.click(f'{F} .fest-back'); check(pg.locator(f'{F} .fest-mini').count()==1,'the pumpkin is saved in the holiday album')
    pg.click(f'{F} .fest-day[data-day="1"]'); t=pg.get_attribute(f'{F} .fest-stage','data-target')
    check(pg.locator(f'{F} .fest-item[data-s="{t}"]').count()==7,'age 10: find 7 items; missed days are still playable')
    ctx.close()
    # În afara sărbătorilor: fără anunț pe Acasă; cardul din Activități deschide o previzualizare
    ctx,pg=page('2026-08-01T10:00:00')
    check(pg.locator('.festival-home').count()==0,'no festival banner outside the holidays')
    pg.click('.garden-nav button[data-go=activities]'); pg.wait_for_timeout(100)
    btns=pg.locator('#eventsList .fest-open'); check(btns.count()>=3,'holiday cards in Activities have a Festival button')
    btns.first.click(); pg.wait_for_timeout(100)
    check('Previzualizare' in pg.inner_text(F) and pg.locator(f'{F} .fest-day.locked, {F} .advent-door.locked').count()==0,'outside the holiday the festival opens as an adult preview')
    ctx.close()
    # Advent, 5 decembrie
    ctx,pg=page('2026-12-05T18:00:00',4)
    check('fereastra 5' in pg.inner_text('.festival-home'),'Home: Advent window 5 is waiting')
    pg.click('.festival-home button'); pg.wait_for_timeout(100)
    check(pg.locator(f'{F} .advent-door').count()==24 and pg.locator(f'{F} .advent-door.locked').count()==19,'24 windows, 1–5 open, 6–24 locked')
    pg.click(f'{F} .advent-door[data-door="6"]'); check('6 decembrie' in status(pg),'window 6 says it opens on 6 December')
    pg.click(f'{F} .advent-door[data-door="1"]'); target=pg.get_attribute(f'{F} .fest-stage','data-target')
    check(pg.locator(f'{F} .fest-item[data-s="{target}"]').count()==3,'age 4: find 3 items')
    solve(pg); pg.click(f'{F} .fest-back'); pg.wait_for_timeout(60)
    check(pg.locator(f'{F} .advent-door.done').count()==1 and pg.locator(f'{F} .advent-tree text').count()==1,'window 1 gives an ornament that hangs on the tree')
    pg.screenshot(path=SHOTS+'advent.png'); ctx.close()
    # 3 ianuarie: toate cele 24 de ferestre sunt deschise; le rezolvăm pe toate
    ctx,pg=page('2027-01-03T10:00:00',8)
    pg.click('.festival-home button'); pg.wait_for_timeout(100)
    check(pg.locator(f'{F} .advent-door.locked').count()==0,'after Christmas every window is open until 7 January')
    seen=set()
    for n in range(1,25):
        pg.click(f'{F} .advent-door[data-door="{n}"]'); pg.wait_for_timeout(40); seen.add(solve(pg)); pg.wait_for_timeout(40); pg.click(f'{F} .fest-back'); pg.wait_for_timeout(40)
    check(seen=={'find','pattern','memory','count','decorate'},'the calendar mixes all five kinds of challenge')
    check(pg.locator(f'{F} .advent-door.done').count()==24 and 'Crăciun fericit' in pg.inner_text(F),'all 24 windows opened: Merry Christmas')
    check(pg.locator(f'{F} .advent-tree text').count()==25,'the tree has 24 ornaments and a star on top')
    check(pg.evaluate("Object.keys(localStorage).some(k=>k.includes('garden_festival_')&&k.includes('_christmas_2026')&&JSON.parse(localStorage.getItem(k)).complete)"),'the Advent calendar is marked complete (badge)')
    pg.select_option('#lang','hu'); pg.wait_for_timeout(150)
    check(pg.inner_text(f'{F} h2') not in ('','Calendarul de Advent','Advent calendar'),'festival texts are translated (Hungarian)')
    ctx.close()
    check(not errs,f'no page errors {errs[:3]}')
print('\nFAILURES:',len(fails))
raise SystemExit(1 if fails else 0)
