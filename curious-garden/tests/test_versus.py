"""Grădina Curioasă — teste pentru modul Contra lui Robo (proprietăți ale adversarului)."""
import os,sys,tempfile,random,re,datetime
from playwright.sync_api import sync_playwright
URL=os.environ.get('GARDEN_URL','http://localhost:8000/curious-garden/')
SHOTS=os.environ.get('GARDEN_SHOTS',os.path.join(tempfile.gettempdir(),'garden-shots'))+'/'
os.makedirs(SHOTS,exist_ok=True)
fails=[]
def check(c,msg):
    print(('OK   ' if c else 'FAIL ')+msg)
    if not c: fails.append(msg)
def status(pg): return pg.inner_text('#versus .learning-feedback')
def over(pg): return pg.locator('#versus .versus-stage button.primary').count()>0
with sync_playwright() as p:
    br=p.chromium.launch(); pg=br.new_page(viewport={'width':390,'height':844}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    pg.goto(URL); d=datetime.date.today(); pg.fill('#dob',f'{d.year-10}-02-20'); pg.click('#start'); pg.wait_for_timeout(400)
    pg.evaluate('window.gardenVersusFast=true')
    pg.click('.garden-nav button[data-go=versus]'); pg.wait_for_timeout(150)
    check(pg.locator('#versus .ttt-cell').count()==9,'tic-tac-toe board has 9 cells')
    check(pg.locator('#versus .versus-head .art-robot').count()==1,'Robo illustration shown')
    pg.screenshot(path=SHOTS+'v-ttt.png',full_page=True)
    # --- X și 0 la nivelul „isteț”: Robo nu pierde niciodată
    pg.click('#versus .versus-level button:has-text("isteț")')
    child_wins=0; relaxed=False; games=0
    for g in range(14):
        pg.click('#versus .versus-level button:has-text("isteț")') if g==0 else None
        for _ in range(9):
            if over(pg): break
            free=pg.locator('#versus .ttt-cell:not([disabled])')
            if free.count()==0: pg.wait_for_timeout(80); continue
            free.nth(random.randrange(free.count())).click(); pg.wait_for_timeout(90)
        pg.wait_for_timeout(60); s=status(pg); games+=1
        if 'Ai câștigat' in s: child_wins+=1
        if 'relaxează' in s: relaxed=True; break
        pg.click('#versus .versus-stage button.primary'); pg.wait_for_timeout(60)
    lvl_after=pg.inner_text('#versus .versus-level strong')
    check(child_wins==0,f'clever Robo never loses at tic-tac-toe ({games} games)')
    check(relaxed and 'mediu' in lvl_after,f'Robo relaxes after two losses in a row → {lvl_after!r}')
    # --- Bețișoare la „isteț”: după mutarea lui, rămâne mereu un multiplu de 4 (când se poate)
    pg.click('#versus .learning-tabs button:has-text("Bețișoarele")'); pg.click('#versus .versus-level button:has-text("isteț")'); pg.wait_for_timeout(80)
    bad=0; checked=0
    for g in range(6):
        for _ in range(12):
            if over(pg): break
            opts=pg.locator('#versus .discover-options button:not([disabled])')
            if opts.count()==0: pg.wait_for_timeout(60); continue
            opts.nth(random.randrange(opts.count())).click()
            before=int(re.search(r'(\d+)',pg.inner_text('#versus .versus-pairs')).group(1))
            pg.wait_for_timeout(120)
            after=int(re.search(r'(\d+)',pg.inner_text('#versus .versus-pairs')).group(1))
            if before>0 and before%4!=0: checked+=1; bad+=after%4!=0
        if over(pg): pg.click('#versus .versus-stage button.primary'); pg.wait_for_timeout(60)
        pg.click('#versus .versus-level button:has-text("isteț")'); pg.wait_for_timeout(40)
    check(checked>0 and bad==0,f'clever Robo always leaves a multiple of 4 sticks ({checked} positions)')
    pg.screenshot(path=SHOTS+'v-nim.png',full_page=True)
    # --- Memory: jocul se termină, toate perechile sunt împărțite
    pg.click('#versus .learning-tabs button:has-text("Memory")'); pg.wait_for_timeout(80)
    total=pg.locator('#versus .memory-card').count()//2
    for _ in range(200):
        if over(pg): break
        c=pg.locator('#versus .memory-card:not([disabled])')
        if c.count()==0: pg.wait_for_timeout(60); continue
        c.nth(random.randrange(c.count())).click(); pg.wait_for_timeout(50)
    pg.wait_for_timeout(100)
    a,b=map(int,re.findall(r'(\d+)',pg.inner_text('#versus .versus-pairs'))[:2])
    check(over(pg) and a+b==total,f'memory duel ends with all {total} pairs shared (you {a} · Robo {b})')
    pg.screenshot(path=SHOTS+'v-memory.png',full_page=True)
    # --- scor salvat și limbi
    sc=pg.evaluate("JSON.parse(localStorage['garden_versus_'+localStorage.garden_active])")
    check(sum(sc['score']['ttt'])>=2 and sum(sc['score']['memory'])==1,'scores saved per game and profile')
    for lg,word in [('hu','Robo ellen'),('uk','Проти Робо'),('en','Versus Robo')]:
        pg.select_option('#lang',lg); pg.wait_for_timeout(120); check(word in pg.inner_text('#versus h2'),f'{lg}: versus screen translated')
    check(not errs,f'no console errors {errs[:3]}')
    br.close()
print('\nFAILURES:',len(fails)); [print(' -',f) for f in fails]
sys.exit(1 if fails else 0)
