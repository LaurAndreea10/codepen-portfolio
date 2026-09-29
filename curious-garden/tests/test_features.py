"""Grădina Curioasă — test automat în browser (Playwright). Rulează cu serverul pornit în rădăcina repo-ului."""
from playwright.sync_api import sync_playwright
import os,sys,tempfile
URL=os.environ.get('GARDEN_URL','http://localhost:8000/curious-garden/')
SHOTS=os.environ.get('GARDEN_SHOTS',os.path.join(tempfile.gettempdir(),'garden-shots'))+'/'
os.makedirs(SHOTS,exist_ok=True)
import datetime,json,re,sys,collections


fails=[]
def check(c,msg):
    print(('OK   ' if c else 'FAIL ')+msg)
    if not c: fails.append(msg)
def dob(age): d=datetime.date.today(); return f'{d.year-age}-01-15'
def solve_options(pg,container,max_clicks=8):
    for _ in range(max_clicks):
        btns=pg.locator(f'{container} .discover-options button:not([disabled])')
        if btns.count()==0: break
        btns.first.click(); pg.wait_for_timeout(60)
        if pg.locator(f'{container} button.primary').count(): return True
        # remove wrong option from next try: click next ones
        n=btns.count()
        for i in range(n):
            b=pg.locator(f'{container} .discover-options button:not([disabled])')
            if b.count()==0: break
            b.nth(min(i,b.count()-1)).click(); pg.wait_for_timeout(60)
            if pg.locator(f'{container} button.primary').count(): return True
    return pg.locator(f'{container} button.primary').count()>0
def open_settings(pg):
    pg.click('.garden-nav button[data-go=activities]'); pg.click('#extras button:has-text("⚙")')
    q=pg.inner_text('.modal-layer label'); a,b=map(int,re.findall(r'(\d+) × (\d+)',q)[0])
    pg.fill('#adultAnswer',str(a*b)); pg.click('.modal-layer button >> nth=0'); pg.wait_for_timeout(150)
with sync_playwright() as p:
    br=p.chromium.launch()
    ctx=br.new_context(viewport={'width':390,'height':844},accept_downloads=True)
    pg=ctx.new_page(); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    pg.goto(URL); pg.wait_for_timeout(300)
    pg.fill('#dob',dob(7)); pg.fill('#nickname','Ana'); pg.click('#start'); pg.wait_for_timeout(700)
    check(pg.locator('.garden-nav button').count()==10,'menu has 10 screens')
    check(pg.locator('.guide-bubble.show').count()==1 and 'Ana' in pg.inner_text('.guide-bubble'),'Bia greets the child by name')
    vis=lambda: pg.evaluate("[...document.querySelectorAll('#app [data-view]')].filter(e=>e.offsetParent).map(e=>e.dataset.view)")
    for v in ['discover','collection']:
        pg.click(f'.garden-nav button[data-go={v}]'); pg.wait_for_timeout(100); check(set(vis())=={v},f'{v} screen shows only itself')
    # ---- Discover games (age 7 → group 6–8)
    pg.click('.garden-nav button[data-go=discover]')
    for tab in ['Litere','Ceasul','Bani']:
        pg.click(f'#discover .learning-tabs button:has-text("{tab}")'); pg.wait_for_timeout(80)
        ok=solve_options(pg,'#discover'); check(ok,f'discover {tab}: solvable, shows Next')
        pg.screenshot(path=SHOTS+f'n-discover-{tab}.png',full_page=True)
    pg.click('#discover .learning-tabs button:has-text("Ceasul")'); check(pg.locator('#discover .clock-wrap svg line').count()>=14,'analog clock drawn with ticks and hands')
    pg.click('#discover .learning-tabs button:has-text("Bani")'); check(pg.locator('#discover .wallet .money').count()>=2,'money pieces shown')
    # puzzle: tap-to-place + a wrong placement
    pg.click('#discover .learning-tabs button:has-text("Puzzle")'); pg.wait_for_timeout(80)
    pieces=pg.locator('#discover .puzzle-piece').count(); slots=pg.locator('#discover .puzzle-slot').count()
    check(pieces>=3 and slots>=3,f'puzzle has {pieces} pieces and {slots} slots')
    pg.evaluate("document.querySelector('.guide').style.display='none';document.querySelector('#discover .puzzle-wrap').scrollIntoView({block:'center'})")
    k0=pg.get_attribute('#discover .puzzle-piece >> nth=0','data-key')
    wrong=pg.locator(f'#discover .puzzle-slot:not([data-key="{k0}"])')
    if wrong.count():
        pg.locator('#discover .puzzle-piece').first.click(); wrong.first.dispatch_event('click'); check('nu se potrivește' in pg.inner_text('#discover .learning-feedback'),'wrong slot is rejected with a gentle message')
    # drag one piece by mouse
    pg.evaluate("document.querySelectorAll('#discover .puzzle-piece').forEach(x=>x.setAttribute('aria-pressed','false'))")
    pc=pg.locator('#discover .puzzle-piece').first; key=pc.get_attribute('data-key'); target=pg.locator(f'#discover .puzzle-slot[data-key="{key}"]:not(.filled)').first
    pb=pc.bounding_box(); tb=target.bounding_box()
    pg.mouse.move(pb['x']+pb['width']/2,pb['y']+pb['height']/2); pg.mouse.down(); pg.mouse.move(pb['x']+30,pb['y']+30,steps=4); pg.mouse.move(tb['x']+tb['width']/2,tb['y']+tb['height']/2,steps=8); pg.mouse.up(); pg.wait_for_timeout(100)
    check(pg.locator('#discover .puzzle-slot.filled').count()==1,'drag & drop places a piece on its silhouette')
    for _ in range(10):
        pcs=pg.locator('#discover .puzzle-piece')
        if pcs.count()==0: break
        key=pcs.first.get_attribute('data-key'); pcs.first.click(); pg.locator(f'#discover .puzzle-slot[data-key="{key}"]:not(.filled)').first.dispatch_event('click'); pg.wait_for_timeout(60)
    check('Ai construit' in pg.inner_text('#discover .learning-feedback'),'puzzle completes')
    pg.screenshot(path=SHOTS+'n-puzzle.png',full_page=True)
    # tale
    pg.click('#discover .learning-tabs button:has-text("Povești")'); pg.locator('#discover .discover-options button').first.click()
    for _ in range(6):
        ch=pg.locator('#discover .tale-choices button')
        if ch.count()==0: break
        ch.first.click(); pg.wait_for_timeout(50)
    check(pg.locator('#discover .tale-end').count()==1,'branching story reaches an ending')
    pg.screenshot(path=SHOTS+'n-tale.png',full_page=True)
    # ---- Maze in adventures: solve with BFS over the DOM
    pg.click('.garden-nav button[data-go=adventures]'); pg.wait_for_timeout(200)
    def solve_maze():
        n=int(pg.evaluate("getComputedStyle(document.querySelector('.arcade-grid')).getPropertyValue('--cols')"))
        states=pg.evaluate("[...document.querySelectorAll('.arcade-cell')].map(c=>c.dataset.state)")
        pos=[int(x)-1 for x in re.findall(r'(\d+), (\d+)',pg.inner_text('.arcade-progress'))[-1]]
        blocked={(i%n,i//n) for i,s in enumerate(states) if s=='block'}
        stars=[(i%n,i//n) for i,s in enumerate(states) if s=='star']
        def bfs(a,b):
            prev={a:None};q=collections.deque([a])
            while q:
                c=q.popleft()
                if c==b: break
                for d,(dx,dy) in {'ArrowRight':(1,0),'ArrowLeft':(-1,0),'ArrowDown':(0,1),'ArrowUp':(0,-1)}.items():
                    nx,ny=c[0]+dx,c[1]+dy
                    if 0<=nx<n and 0<=ny<n and (nx,ny) not in blocked and (nx,ny) not in prev: prev[(nx,ny)]=(c,d);q.append((nx,ny))
            if b not in prev: return None
            path=[];c=b
            while prev[c]: c,d=prev[c]; path.append(d)
            return path[::-1]
        cur=tuple(pos); keys=[]
        for s in stars+[(n-1,0)]:
            pth=bfs(cur,s)
            if pth is None: return False,n
            keys+=pth; cur=s
        pg.focus('.arcade-grid')
        t0=pg.evaluate("document.querySelector('.arcade-sprite').style.transform")
        for k in keys: pg.keyboard.press(k)
        t1=pg.evaluate("document.querySelector('.arcade-sprite').style.transform")
        return t0!=t1,n
    moved,n=solve_maze(); pg.wait_for_timeout(200)
    check(moved,f'unicorn sprite moves across the {n}x{n} maze')
    check('Bravo' in pg.inner_text('#interactiveAdventures'),'unicorn maze is solvable (stars + castle)')
    check(pg.locator('.arcade-cell.visited').count()>0,'trail shows where the unicorn walked')
    pg.screenshot(path=SHOTS+'n-maze.png',full_page=True)
    pg.click('#interactiveAdventures .arcade-stage button:has-text("Nivelul următor")'); pg.wait_for_timeout(150)
    moved,n=solve_maze(); pg.wait_for_timeout(150); check('Bravo' in pg.inner_text('#interactiveAdventures'),'level 2 maze solvable too')
    pg.click('#interactiveAdventures .arcade-worlds button:has-text("Cursa")'); pg.wait_for_timeout(150); moved,n=solve_maze(); pg.wait_for_timeout(150)
    check('Bravo' in pg.inner_text('#interactiveAdventures'),'car race maze solvable')
    # rocket launch animation
    pg.click('#interactiveAdventures .arcade-worlds button:has-text("Lansarea")'); pg.wait_for_timeout(100)
    for _ in range(8):
        pg.click('#interactiveAdventures button:has-text("Adaugă combustibil")')
    pg.click('#interactiveAdventures button:has-text("Lansează")'); check(pg.locator('.arcade-visual.launching .rocket-art').count()==1,'rocket launches with animation')
    # ---- Rewards
    d=pg.evaluate("gardenRewards.read()"); wins=sum(v['w'] for v in d['stats'].values())
    check(wins>=7,f'wins tracked across games ({wins})'); check(len(d.get('stickers',[]))>=3,f"stickers earned ({len(d.get('stickers',[]))})")
    check('first' in d.get('earned',[]),'first badge earned')
    pg.click('.garden-nav button[data-go=collection]'); pg.wait_for_timeout(100)
    tray=pg.locator('#collection .sticker-tray .sticker'); s0=tray.first.inner_text(); tray.first.click()
    bb=pg.locator('#collection .sticker-board').bounding_box(); pg.mouse.click(bb['x']+bb['width']*.3,bb['y']+bb['height']*.6); pg.wait_for_timeout(100)
    check(pg.locator('#collection .sticker.placed').count()==1,'sticker placed on the meadow by tapping')
    pl=pg.evaluate("gardenRewards.read().placed"); check(s0 in pl and 25<pl[s0][0]<35,'sticker position saved')
    pg.locator('#collection .sticker.placed').first.click(); pg.keyboard.press('ArrowRight'); pl2=pg.evaluate("gardenRewards.read().placed")
    check(pl2[s0][0]>pl[s0][0],'arrow keys move a placed sticker')
    pg.screenshot(path=SHOTS+'n-stickers.png',full_page=True)
    pg.click('#collection .learning-tabs button:has-text("Grădina")'); check(pg.locator('#collection .garden-scene svg.plant').count()>=2,'garden shows growing plants')
    pg.screenshot(path=SHOTS+'n-garden.png',full_page=True)
    pg.click('#collection .learning-tabs button:has-text("Insigne")'); check(pg.locator('#collection .badge-card.got').count()>=1,'badges screen lists earned badges')
    # misses → stuck + encouragement
    pg.evaluate("for(let i=0;i<6;i++)document.dispatchEvent(new CustomEvent('garden:miss',{detail:{game:'clock'}}))")
    check(pg.locator('.guide-bubble.show').count()==1,'Bia encourages after several mistakes')
    # ---- Parents
    open_settings(pg)
    check(pg.locator('.modal-layer .report-table tr').count()==9,'report shows 8 skills')
    check('Ceasul' in pg.inner_text('.modal-layer .settings-section >> nth=0'),'report lists where the child gets stuck (clock)')
    check(pg.locator('.modal-layer .time-col').count()==7,'7-day play-time chart')
    check(pg.locator('.modal-layer .ideas li').count()==3,'3 offline activity ideas')
    pg.screenshot(path=SHOTS+'n-report.png',full_page=True)
    # a11y toggles
    pg.click('.modal-layer summary:has-text("Accesibilitate")')
    pg.click('.modal-layer button:has-text("Font pentru dislexie")'); pg.click('.modal-layer button:has-text("Text mai mare")'); pg.click('.modal-layer button:has-text("daltonism")')
    ff=pg.evaluate("getComputedStyle(document.body).fontFamily"); check('OpenDyslexic' in ff,'dyslexia font applied')
    check(pg.evaluate("document.fonts.load('16px OpenDyslexic').then(f=>f.length>0)"),'dyslexia font file loads')
    check(pg.evaluate("getComputedStyle(document.documentElement).fontSize")=='18.88px','larger text applied')
    pg.select_option('.modal-layer select[aria-label="Viteză"]','1500')
    pg.click('.modal-layer button:has-text("Navigare cu un singur buton")')
    check(pg.locator('.scan-go').count()==1,'switch mode shows the big Choose button')
    pg.wait_for_timeout(1700); f1=pg.evaluate("document.querySelector('.scan-focus')?.textContent"); pg.wait_for_timeout(1600); f2=pg.evaluate("document.querySelector('.scan-focus')?.textContent")
    check(f1 is not None and f1!=f2,f'switch highlight moves by itself ({f1!r} → {f2!r})')
    pg.click('.modal-layer button:has-text("Navigare cu un singur buton")'); check(pg.locator('.scan-go').count()==0,'switch mode turns off')
    pg.screenshot(path=SHOTS+'n-a11y.png',full_page=True)
    # export
    pg.click('.modal-layer summary:has-text("Date și dispozitive")')
    with pg.expect_download() as dl: pg.click('.modal-layer button:has-text("Exportă progresul")')
    path=dl.value.path(); data=json.load(open(path)); check(data.get('version')==2 and 'garden_rewards' in data['data'],'export includes all game progress')
    pg.set_input_files('#gardenImport',path); pg.wait_for_timeout(400)
    check(pg.evaluate("JSON.parse(localStorage.garden_profiles).length")==2,'import adds the profile')
    newid=pg.evaluate("localStorage.garden_active"); check(pg.evaluate(f"!!localStorage['garden_rewards_{newid}']"),'imported progress copied to the new profile')
    pg.keyboard.press('Escape'); pg.evaluate("document.querySelectorAll('.modal-layer').forEach(x=>x.remove())")
    # font off for later shots
    pg.evaluate("localStorage.garden_a11y=JSON.stringify({speed:2500});document.documentElement.classList.remove('dys','big');document.body.classList.remove('cb')")
    # time limit → break
    pg.evaluate("localStorage.garden_time=JSON.stringify({limit:15,extra:{}})"); pg.reload(); pg.wait_for_timeout(500)
    pg.evaluate("(()=>{const k='garden_rewards_'+localStorage.garden_active;const d=JSON.parse(localStorage[k]||'{}');d.days=d.days||{};d.days[new Date().toLocaleDateString('en-CA')]=16*60;localStorage[k]=JSON.stringify(d);document.dispatchEvent(new CustomEvent('garden:tick'))})()")
    pg.wait_for_timeout(100); check(pg.locator('.break-layer').count()==1,'break screen appears when the daily limit is reached')
    pg.screenshot(path=SHOTS+'n-break.png')
    pg.click('.break-layer button'); q=pg.inner_text('.modal-layer:last-of-type label'); a,b=map(int,re.findall(r'(\d+) × (\d+)',q)[0]); pg.fill('#adultAnswer',str(a*b)); pg.click('.modal-layer:last-of-type button >> nth=0'); pg.wait_for_timeout(100)
    check(pg.locator('.break-layer').count()==0,'adult can add 15 minutes')
    # ---- Events
    ev=pg.evaluate("[gardenEventIds.length, eventWindow('martisor',2027).map(d=>d.toDateString()), document.querySelectorAll('#eventsList .event').length]")
    check(ev[0]==8 and 'Mar 01 2027' in ev[1][0] and ev[2]==5,f'8 holidays, Mărțișor window correct, 5 shown {ev}')
    # ---- Languages: no raw keys on any screen
    raw=re.compile(r'^[a-z]+[A-Z][A-Za-z]+$')
    for lg,homeword in [('hu','Kezdőlap'),('uk','Головна'),('en','Home')]:
        pg.select_option('#lang',lg); pg.wait_for_timeout(200)
        check(homeword in pg.inner_text('.garden-nav'),f'{lg}: menu translated')
        bad=set()
        for v in ['home','adventures','learning','discover','worlds','activities','collection','birthday']:
            pg.click(f'.garden-nav button[data-go={v}]'); pg.wait_for_timeout(80)
            txt=pg.evaluate("[...document.querySelectorAll('#app *')].filter(e=>e.offsetParent&&e.children.length===0).map(e=>e.textContent.trim())")
            bad|={t for t in txt if raw.match(t)}
        check(not bad,f'{lg}: no untranslated keys visible {sorted(bad)[:8]}')
        pg.click('.garden-nav button[data-go=discover]'); pg.screenshot(path=SHOTS+f'n-lang-{lg}.png',full_page=True)
    pg.select_option('#lang','ro')
    # offline cache contains new files
    pg.wait_for_timeout(500)
    cached=pg.evaluate("caches.keys().then(ks=>caches.open(ks.filter(k=>k.startsWith('gradina-curioasa')).sort().pop())).then(c=>c.keys()).then(k=>k.map(r=>r.url.split('/').pop()))")
    check(all(f in cached for f in ['discover.js','rewards.js','parents.js','i18n.js','art.js','extras.css','opendyslexic-latin-400-normal.woff2']),'offline cache includes all new files')
    check(not errs,f'no console errors {errs[:3]}')
    br.close()
print('\nFAILURES:',len(fails)); [print(' -',f) for f in fails]
sys.exit(1 if fails else 0)
