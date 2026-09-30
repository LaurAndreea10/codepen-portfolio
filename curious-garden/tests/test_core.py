"""Grădina Curioasă — test automat în browser (Playwright). Rulează cu serverul pornit în rădăcina repo-ului."""
from playwright.sync_api import sync_playwright
import os,sys,tempfile
URL=os.environ.get('GARDEN_URL','http://localhost:8000/curious-garden/')
SHOTS=os.environ.get('GARDEN_SHOTS',os.path.join(tempfile.gettempdir(),'garden-shots'))+'/'
os.makedirs(SHOTS,exist_ok=True)
import datetime,sys


fails=[]
def check(c,msg):
    print(('OK   ' if c else 'FAIL ')+msg)
    if not c: fails.append(msg)
def dob(age):
    d=datetime.date.today(); return f'{d.year-age}-01-15'
with sync_playwright() as p:
    b=p.chromium.launch()
    ctx=b.new_context(viewport={'width':390,'height':844},service_workers='allow')
    pg=ctx.new_page(); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    pg.goto(URL); pg.wait_for_timeout(400)
    check(pg.locator('#worldChoices button').count()==3,'setup shows 3 world choices, no gender question')
    check('gen' not in pg.locator('#setup').inner_text().lower(),'no gender wording on setup')
    pg.screenshot(path=SHOTS+'1-setup.png',full_page=True)
    pg.fill('#dob',dob(4)); pg.locator('#worldChoices button').nth(1).click(); pg.fill('#nickname','Ana'); pg.click('#start'); pg.wait_for_timeout(500)
    check(pg.evaluate("document.getElementById('app').dataset.view")=='home','lands on home screen after start')
    check(pg.evaluate("JSON.parse(localStorage.garden_profile).world")=='space','chosen world saved')
    check(pg.evaluate("window.gardenWorld")=='space','world applied')
    pg.screenshot(path=SHOTS+'2-home.png',full_page=True)
    vis=lambda: pg.evaluate("[...document.querySelectorAll('#app [data-view]')].filter(e=>e.offsetParent).map(e=>e.dataset.view)")
    for v in ['adventures','learning','worlds','activities','birthday','home']:
        pg.click(f'.garden-nav button[data-go={v}]'); pg.wait_for_timeout(150)
        vv=vis(); check(vv and set(vv)=={v},f'view {v}: only its sections visible {vv}')
        if v!='home': pg.screenshot(path=SHOTS+f'3-{v}.png',full_page=True)
    # no horizontal scroll
    check(pg.evaluate("document.documentElement.scrollWidth<=innerWidth"),'no horizontal page scroll at 390px')
    # voice default on for 4-year-old
    check(pg.evaluate("JSON.parse(localStorage.garden_settings||'{}').voice===undefined"),'voice not explicitly set (auto for 3–5)')
    # activities: route, craft, order for age 4? group 3-5 map: sort,count,season,shadow,craft,order
    pg.click('.garden-nav button[data-go=activities]')
    pg.locator('.map button').nth(4).click(); pg.wait_for_timeout(100)
    t=pg.inner_text('#gameContent .target'); check(t.endswith('?') and len(t.split())==6 and t.split()[0]==t.split()[2]==t.split()[4],f'craft is ABAB pattern: {t!r}')
    pg.locator('.map button').nth(5).click(); pg.wait_for_timeout(100)
    check('→' in pg.inner_text('#gameContent .target'),'order uses growth sequence')
    # Next button after extra game should stay on same game (was overridden bug)
    ans=pg.evaluate("(()=>{const btns=[...document.querySelectorAll('#gameContent .play-items button')];return btns.length})()")
    check(ans==3,'order has 3 options')
    # win basic game by brute force and check celebrate + next
    pg.locator('#activities button').first.click(); pg.wait_for_timeout(100)
    for i in range(pg.locator('#gameContent .play-items button').count()):
        pg.locator('#gameContent .play-items button').nth(i).click()
        if pg.is_visible('#next'): break
    check(pg.is_visible('#next'),'correct answer reveals Next')
    check(pg.locator('.celebrate').count()==1,'celebration shown on win')
    # position randomness for count game: correct answer index across 30 renders
    idx=pg.evaluate("""(()=>{const out=new Set();for(let i=0;i<30;i++){startGame('count');const bs=[...document.querySelectorAll('#gameContent .play-items button')];out.add(bs.findIndex(b=>b.textContent===answer))}return [...out]})()""")
    check(len(idx)>=3,f'count: correct answer lands in varied positions {idx}')
    # extra games route (switch to age 7 group later) via direct call
    pg.evaluate("startGame('route')"); check(pg.locator('#gameContent .route-grid').count()==1,'route shows a map grid, not the arrow itself')
    check('⬆️' not in pg.inner_text('#gameContent .route-grid') and '➡️' not in pg.inner_text('#gameContent .route-grid'),'route map does not contain the answer arrow')
    pg.evaluate("startGame('mission')"); check(pg.locator('#gameContent .play-items button').count()==4,'odd-one-out has 4 options')
    # premium special challenge button order != sequence order
    pg.click('.garden-nav button[data-go=worlds]')
    pg.locator('.world-grid button').nth(3).click(); pg.wait_for_timeout(100)  # rocket story
    orders=set()
    for i in range(12):
        pg.locator('.mode-tabs button').nth(1).click(); pg.locator('.mode-tabs button').nth(0).click()
        orders.add(pg.evaluate("[...document.querySelectorAll('#grandAdventure .answer-grid button')].map(b=>b.textContent).join('')"))
    check(len(orders)>1,f'story buttons shuffled ({len(orders)} different orders)')
    check('PREMIUM' not in pg.inner_text('#grandAdventure'),'no PREMIUM label')
    # memory mechanic in dino world (mechanics memory first)
    pg.locator('.world-grid button').nth(7).click(); pg.locator('.mode-tabs button').nth(3).click(); pg.wait_for_timeout(100)
    has_mem=pg.locator('#grandAdventure button:has-text("Am reținut")').count()
    check(has_mem==1,'memory challenge hides answers until "Am reținut"')
    if has_mem:
        check(pg.locator('#grandAdventure .answer-grid button:disabled').count()>0,'answers disabled before remembering')
        pg.click('#grandAdventure button:has-text("Am reținut")')
        check(pg.inner_text('#grandAdventure .target')=='❓','symbol hidden after remembering')
    pg.screenshot(path=SHOTS+'4-worlds-memory.png',full_page=True)
    # adult gate
    pg.click('.garden-nav button[data-go=activities]'); pg.click('#extras button:has-text("Setări")')
    q=pg.inner_text('.modal-layer label'); check('×' in q,f'gate uses multiplication: {q}')
    import re; a,bb=map(int,re.findall(r'(\d+) × (\d+)',q)[0])
    pg.fill('#adultAnswer','7'); pg.click('.modal-layer button >> nth=0'); check(pg.locator('.modal-layer').count()==1,'wrong answer (7) rejected')
    pg.fill('#adultAnswer',str(a*bb)); pg.click('.modal-layer button >> nth=0'); pg.wait_for_timeout(100)
    check(pg.locator('.modal-layer h2').count()==1,'correct product opens settings')
    check(pg.get_attribute('.modal-layer button >> nth=0','aria-pressed')=='true','voice shown ON by default for age 4')
    pg.keyboard.press('Escape')
    # language switch keeps view & no errors
    pg.select_option('#lang','en'); pg.wait_for_timeout(200)
    check(pg.evaluate("document.getElementById('app').dataset.view")=='activities','language switch keeps current screen')
    check('Activities' in pg.inner_text('.garden-nav'),'nav translated to EN')
    pg.select_option('#lang','ro'); pg.wait_for_timeout(200)
    # second profile + switch
    pg.click('.garden-nav button[data-go=home]'); pg.click('#edit'); pg.wait_for_timeout(100)
    pg.click('.profilebar button:has-text("Profil nou")'); pg.fill('#dob',dob(10)); pg.locator('#worldChoices button').nth(0).click(); pg.click('#start'); pg.wait_for_timeout(300)
    check(pg.evaluate("JSON.parse(localStorage.garden_profiles).length")==2,'second profile created')
    check('9–12' in pg.inner_text('#ageLabel'),'age group 9–12 applied')
    pg.click('#edit'); pg.locator('.profilebar button').nth(0).click(); pg.wait_for_timeout(300)
    check('3–5' in pg.inner_text('#ageLabel') and pg.evaluate("window.gardenWorld")=='space','switching back restores first child')
    # birthday
    pg.click('.garden-nav button[data-go=birthday]'); pg.click('#decorations button >> nth=0'); pg.click('#finishCake')
    check('Felicitări' in pg.inner_text('#cakeFeedback'),'birthday cake finishes')
    pg.click('#closeCake'); check(pg.evaluate("document.getElementById('app').dataset.view")=='home','back button returns home')
    # SW + manifest
    pg.wait_for_timeout(800)
    check(pg.evaluate("navigator.serviceWorker.controller!==null || navigator.serviceWorker.getRegistration().then(r=>!!r)"),'service worker registered')
    check(pg.evaluate("fetch('manifest.webmanifest').then(r=>r.json()).then(j=>j.icons.length)")==3,'manifest loads')
    check(not errs,f'no console errors {errs}')
    # offline reload
    pg.reload(); pg.wait_for_timeout(600); ctx.set_offline(True); pg.reload(); pg.wait_for_timeout(600)
    check(pg.locator('.garden-nav').count()==1,'game loads offline after first visit')
    ctx.set_offline(False)
    # legacy profile migration (old gender-based data)
    c2=b.new_context(viewport={'width':1280,'height':900}); p2=c2.new_page(); e2=[]
    p2.on('pageerror',lambda e:e2.append(str(e)))
    p2.goto(URL); p2.evaluate(f"""localStorage.clear();localStorage.garden_profile=JSON.stringify({{dob:'{dob(6)}',gender:'girl'}});""")
    p2.reload(); p2.wait_for_timeout(500)
    check(p2.evaluate("window.gardenWorld")=='magic' and not e2,f'old gender profile migrates to world {e2}')
    p2.screenshot(path=SHOTS+'5-desktop.png',full_page=False)
    b.close()
print('\nFAILURES:',len(fails)); [print(' -',f) for f in fails]
sys.exit(1 if fails else 0)
