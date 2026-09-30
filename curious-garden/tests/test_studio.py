"""Grădina Curioasă — teste pentru Ateliere: desen, muzică, olărit, croșetat, grădinărit,
construcții, doctor, service și gătit."""
import os,tempfile,json,datetime
from playwright.sync_api import sync_playwright
URL=os.environ.get('GARDEN_URL','http://localhost:8000/curious-garden/')
SHOTS=os.environ.get('GARDEN_SHOTS',os.path.join(tempfile.gettempdir(),'garden-shots'))+'/'
os.makedirs(SHOTS,exist_ok=True)
fails=[]
def check(c,msg):
    print(('OK   ' if c else 'FAIL ')+msg)
    if not c: fails.append(msg)
def start(pg,age):
    d=datetime.date.today(); pg.fill('#dob',f'{d.year-age}-02-02'); pg.fill('#nickname','Ana'); pg.click('#start'); pg.wait_for_timeout(350)
    pg.evaluate("window.gardenMusicFast=true;document.body.classList.add('quiet');document.querySelectorAll('.bia-bubble').forEach(e=>e.remove())")
def wins(pg,g): return pg.evaluate(f"(()=>{{const d=gardenRewards.read();return (d.stats&&d.stats['{g}']&&d.stats['{g}'].w)||0}})()")
def status(pg,sel): return pg.inner_text(f'{sel} .learning-feedback')
def solve_pairs(pg,S,wrong_first=False):
    probs=pg.locator(f'{S} .pair-problem'); missed=False
    for i in range(probs.count()):
        answers=probs.nth(i).get_attribute('data-answers').split(','); probs.nth(i).click()
        tools=pg.eval_on_selector_all(f'{S} .pair-tools .craft-tool:not([disabled])','bs=>bs.map(b=>b.dataset.tool)')
        if wrong_first and i==0:
            w=[t for t in tools if t not in answers][0]; pg.click(f'{S} .pair-tools .craft-tool[data-tool={w}]'); missed='Nu chiar' in status(pg,S)
        pg.click(f'{S} .pair-tools .craft-tool[data-tool={[t for t in answers if t in tools][0]}]')
    return missed
with sync_playwright() as p:
    br=p.chromium.launch(); errs=[]
    def page(age):
        pg=br.new_page(viewport={'width':390,'height':844}); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto(URL); start(pg,age); return pg
    pg=page(10)
    # Meniul și hub-ul
    check(pg.locator('.garden-nav button[data-go=studio]').count()==1,'menu has the Workshops screen')
    pg.click('.garden-nav button[data-go=studio]'); pg.wait_for_timeout(100)
    check(pg.locator('#studio .craft-card').count()==12,'hub lists 12 workshops')
    pg.click('#studio .craft-card[data-craft=drawing]'); pg.wait_for_timeout(150)
    check(pg.evaluate("document.getElementById('app').dataset.view")=='drawing' and pg.get_attribute('.garden-nav button[data-go=studio]','aria-pressed')=='true','Drawing opens from the hub and the menu keeps Workshops highlighted')
    # Desen liber: o linie pe foaie, apoi în galerie
    D='#drawing'
    pg.click(f'{D} .learning-tabs button:nth-child(1)'); pg.wait_for_timeout(100)
    pg.click(f'{D} .draw-tools button:has-text("Salvează")'); check('Desenează ceva' in status(pg,D),'empty sheet is not saved')
    box=pg.locator(f'{D} canvas').bounding_box(); pg.mouse.move(box['x']+40,box['y']+40); pg.mouse.down(); pg.mouse.move(box['x']+160,box['y']+120,steps=8); pg.mouse.up()
    painted=pg.evaluate(f"(()=>{{const c=document.querySelector('{D} canvas'),d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=0;i<d.length;i+=4)if(d[i+1]<200)n++;return n}})()")
    check(painted>200,f'drawing with the pointer paints the sheet ({painted} px)')
    pg.click(f'{D} button[data-tool=bucket]'); pg.locator(f'{D} canvas').scroll_into_view_if_needed(); pg.wait_for_timeout(300); box=pg.locator(f'{D} canvas').bounding_box(); pg.mouse.click(box['x']+box['width']-30,box['y']+box['height']-30)
    corner=pg.evaluate(f"(()=>{{const c=document.querySelector('{D} canvas'),d=c.getContext('2d').getImageData(c.width-20,c.height-20,1,1).data;return [d[0],d[1],d[2]]}})()")
    check(corner!=[255,255,255],'bucket fills the empty area')
    pg.click(f'{D} .draw-tools button:has-text("Înapoi")'); pg.wait_for_timeout(50)
    corner2=pg.evaluate(f"(()=>{{const c=document.querySelector('{D} canvas'),d=c.getContext('2d').getImageData(c.width-20,c.height-20,1,1).data;return [d[0],d[1],d[2]]}})()")
    check(corner2==[255,255,255],'undo removes the fill')
    pg.click(f'{D} .draw-tools button:has-text("Salvează")'); pg.wait_for_timeout(150)
    check(pg.locator(f'{D} .draw-gallery img').count()==1 and wins(pg,'draw-free')==1,'saved drawing appears in the gallery')
    # Colorează după cod (10 ani: calcule)
    pg.click(f'{D} .learning-tabs button:nth-child(2)'); pg.wait_for_timeout(200)
    labels=pg.eval_on_selector_all(f'{D} .region-label','ts=>ts.map(t=>t.textContent)')
    check(len(labels)>5 and any(('+' in t or '−' in t) for t in labels),'age 10: colour-by-number areas show sums and differences')
    regs=pg.locator(f'{D} [data-region]'); n=regs.count(); t0=regs.nth(0).get_attribute('data-target')
    wrong=[c for c in pg.eval_on_selector_all(f'{D} .color-legend button','bs=>bs.map(b=>b.dataset.c)') if c!=t0][0]
    pg.click(f'{D} .color-legend button[data-c={wrong}]'); regs.nth(0).dispatch_event('click')
    check(regs.nth(0).get_attribute('fill')=='#ffffff' and 'alt număr' in status(pg,D),'wrong colour is refused with a hint')
    for i in range(n):
        t=regs.nth(i).get_attribute('data-target'); pg.click(f'{D} .color-legend button[data-c={t}]'); regs.nth(i).dispatch_event('click')
    check('Gata' in status(pg,D) and wins(pg,'draw-code')==1,'colouring the whole page by number completes it')
    # Unește punctele: numără din s în s
    pg.click(f'{D} .learning-tabs button:nth-child(3)'); pg.wait_for_timeout(100)
    g=pg.locator(f'{D} .dot-g'); k=g.count(); labs=[int(g.nth(i).get_attribute('data-label')) for i in range(k)]
    step=labs[1]-labs[0]; check(step in (2,3,5,10) and all(labs[i]==(i+1)*step for i in range(k)),f'age 10: dots count in {step}s')
    g.nth(2).dispatch_event('click'); check('Caută punctul' in status(pg,D),'tapping a dot out of order gives a hint')
    for i in range(k): g.nth(i).dispatch_event('click')
    check('Ai desenat' in status(pg,D) and wins(pg,'draw-dots')==1,'joining all dots reveals the shape')
    # Pixel art în oglindă
    pg.click(f'{D} .learning-tabs button:nth-child(4)'); pg.wait_for_timeout(100)
    check('oglindă' in pg.inner_text(f'{D} .studio-help'),'age 10: pixel art is a mirror challenge')
    model=pg.eval_on_selector_all(f'{D} .px-grid.model .px-cell','cs=>cs.map(c=>getComputedStyle(c).backgroundColor)')
    import math; N=int(math.isqrt(len(model)))
    sw=pg.eval_on_selector_all(f'{D} .palette .swatch','bs=>bs.map(b=>[b.dataset.c,getComputedStyle(b).backgroundColor])')
    colour={bg:c for c,bg in sw}
    cells=pg.locator(f'{D} .px-grid.mine .px-cell')
    pg.click(f'{D} .draw-tools button:has-text("Verifică")'); check('diferite' in status(pg,D),'check lists the squares that differ')
    for r in range(N):
        for c in range(N):
            want=colour[model[r*N+(N-1-c)]]
            if want=='white': continue
            pg.click(f'{D} .palette .swatch[data-c={want}]'); cells.nth(r*N+c).click()
    check('Perfect' in status(pg,D) and wins(pg,'draw-pixel')==1,'mirrored copy completes the pixel art')
    pg.close()

    # ——— Muzică
    pg=page(10); pg.evaluate("gardenGo('music')"); M='#music'; pg.wait_for_timeout(100)
    pg.click(f'{M} .learning-tabs button:nth-child(1)'); pg.wait_for_timeout(100)
    check(pg.locator(f'{M} .xylo .bar').count()==8,'xylophone has 8 bars (do to high do)')
    for key in '12345678': pg.keyboard.press(key)
    pg.wait_for_timeout(50); check(wins(pg,'music-play')==1,'keys 1–8 play the bars and a tune earns praise')
    pg.click(f'{M} .learning-tabs button:nth-child(2)'); pg.wait_for_timeout(100)
    check(pg.locator(f'{M} .page-picker button').count()==5,'5 public-domain songs')
    pg.click(f'{M} .page-picker button:nth-child(1)'); pg.wait_for_timeout(100)
    pg.click(f'{M} .draw-tools button.primary'); pg.wait_for_timeout(50)
    pg.click(f'{M} .xylo .bar:not(.next)'); check('strălucește' in status(pg,M),'wrong bar shows which one to find')
    for _ in range(80):
        nx=pg.get_attribute(f'{M} .studio-stage','data-next')
        if not nx: break
        pg.click(f'{M} .xylo .bar[data-note="{nx}"]')
    check('Bravo' in status(pg,M) and wins(pg,'music-song')==1,'playing along to the end completes the song')
    pg.click(f'{M} .learning-tabs button:nth-child(3)'); pg.wait_for_timeout(100)
    pg.click(f'{M} .echo-start'); pg.wait_for_function(f"document.querySelector('{M} .learning-feedback').textContent.includes('Rândul tău')",timeout=5000)
    seq=pg.get_attribute(f'{M} .studio-stage','data-seq').split(','); check(len(seq)==4,'age 10: echo starts with 4 notes')
    for n in seq: pg.click(f'{M} .xylo .bar[data-note="{n}"]')
    check('5 note' in status(pg,M) and wins(pg,'music-echo')==1,'repeating the tune correctly makes it one note longer')
    pg.wait_for_function(f"document.querySelector('{M} .learning-feedback').textContent.includes('Rândul tău')",timeout=5000)
    seq=pg.get_attribute(f'{M} .studio-stage','data-seq').split(',')
    wrongn=[b for b in pg.eval_on_selector_all(f'{M} .xylo .bar','bs=>bs.map(b=>b.dataset.note)') if b!=seq[0]][0]
    pg.click(f'{M} .xylo .bar[data-note="{wrongn}"]'); check('Mai ascultă' in status(pg,M),'a wrong note replays the tune')
    pg.click(f'{M} .learning-tabs button:nth-child(4)'); pg.wait_for_timeout(100)
    check(pg.locator(f'{M} .ear-btn').count()==3,'age 10: higher, lower and the same')
    for _ in range(2):
        ans=pg.get_attribute(f'{M} .studio-stage','data-answer'); pg.click(f'{M} .ear-btn:nth-child({["higher","lower","same"].index(ans)+1})'); pg.wait_for_timeout(80)
    check(wins(pg,'music-ear')==2,'correct high/low answers are counted')
    pg.click(f'{M} .learning-tabs button:nth-child(5)'); pg.wait_for_timeout(100)
    cells=pg.locator(f'{M} .beat-cell'); check(cells.count()==32,'rhythm grid has 4 instruments × 8 steps')
    for i in (0,4,10,14): cells.nth(i).click()
    pg.click(f'{M} .beat-go'); pg.wait_for_timeout(400)
    check(pg.locator(f'{M} .beat-cell.now').count()>0 and wins(pg,'music-beats')==1,'the rhythm loop plays and marks the current step')
    pg.click('.garden-nav button[data-go=home]'); pg.wait_for_timeout(100)
    check(pg.evaluate("document.querySelectorAll('#music .beat-cell.now').length")==0,'leaving the screen stops the music')
    pg.close()

    # ——— Ateliere cu pași, unelte, calcule
    pg=page(10); pg.evaluate("gardenGo('studio')")
    for k in ['garden','farm','build','doctor','service','cooking']:
        pg.evaluate(f"gardenCrafts.open('{k}')"); pg.wait_for_timeout(80); S='#studio'
        if k in ('doctor','service','cooking','build','farm'): check(pg.locator(f'{S} .craft-safety').count()==1,f'{k}: safety note is shown')
        steps=pg.locator(f'{S} .craft-choice'); n=steps.count()
        pg.locator(f'{S} .craft-choice[data-step="{n-1}"]').dispatch_event('click'); miss=status(pg,S)
        for i in range(n): pg.locator(f'{S} .craft-choice[data-step="{i}"]').dispatch_event('click')
        check('înainte' in miss and 'ordinea bună' in status(pg,S) and wins(pg,'craft-'+k)==1,f'{k}: {n} steps in order')
        pg.click(f'{S} .learning-tabs button:nth-child(2)'); pg.wait_for_timeout(50)
        check(pg.locator(f'{S} .pair-problem').count()==3,f'{k}: age 10 gets a job list with 3 problems')
        missed=solve_pairs(pg,S,wrong_first=(k=='service'))
        check('Toate trei' in status(pg,S) and wins(pg,'craft-'+k)==2 and pg.locator(f'{S} .pair-problem.right').count()==3,f'{k}: every problem matched with its tool')
        if k=='service': check(missed,'service: a wrong tool in the job list is refused')
        pg.click(f'{S} .learning-tabs button:nth-child(3)'); pg.wait_for_timeout(50)
        ans=pg.get_attribute(f'{S} .studio-stage','data-answer'); pg.click(f'{S} .craft-answer:text-is("{ans}")')
        check('Corect' in status(pg,S),f'{k}: age-10 maths question answered')
    if 'house-svg' in pg.content() or True:
        pg.evaluate("gardenCrafts.open('build')"); pg.wait_for_timeout(50)
        for i in range(pg.locator('#studio .craft-choice').count()): pg.locator(f'#studio .craft-choice[data-step="{i}"]').dispatch_event('click')
        check(pg.locator('#studio .house-svg polygon').count()==1,'finished house has its roof')
    # Animale: hrană (cu mai multe răspunsuri bune), pui, sunete, calcule
    pg.evaluate("gardenCrafts.open('animals')"); pg.wait_for_timeout(80); S='#studio'
    check(pg.locator(f'{S} .craft-safety').count()==1 and pg.locator(f'{S} .learning-tabs button').count()==4,'animals: safety note and 4 activities')
    solve_pairs(pg,S); check('Toate trei' in status(pg,S),'animals: age 10 feeds three animals in one job list')
    for i,name in [(2,'babies'),(3,'sounds')]:
        pg.click(f'{S} .learning-tabs button:nth-child({i})'); pg.wait_for_timeout(50)
        ans=pg.get_attribute(f'{S} .studio-stage','data-answer'); others=[t for t in pg.eval_on_selector_all(f'{S} .craft-tool','bs=>bs.map(b=>b.dataset.tool)') if t!=ans]
        pg.click(f'{S} .craft-tool[data-tool={others[0]}]'); miss='Corect' not in status(pg,S)
        pg.click(f'{S} .craft-tool[data-tool={ans}]')
        check(miss and 'Corect' in status(pg,S),f'animals: {name} question')
    check(wins(pg,'craft-animals')==3,'animal answers are counted for the report')
    check(pg.locator(f'{S} .craft-why').count()==0,'babies and sounds need no explanation')
    pg.click(f'{S} .learning-tabs button:nth-child(4)'); ans=pg.get_attribute(f'{S} .studio-stage','data-answer'); pg.click(f'{S} .craft-answer:text-is("{ans}")')
    check('Corect' in status(pg,S),'animals: age-10 maths question')
    # Cules fructe, 10 ani: coș cu greutate exactă
    pg.evaluate("gardenCrafts.open('picking')"); pg.wait_for_timeout(80)
    check(pg.get_attribute(f'{S} .studio-stage','data-mode')=='weight','age 10: fruit picking asks for an exact weight')
    target=int(pg.get_attribute(f'{S} .studio-stage','data-target'))
    ws=pg.eval_on_selector_all(f'{S} .orchard .fruit','bs=>bs.map(b=>+b.dataset.w)')
    heavy=max(range(len(ws)),key=lambda i:ws[i]); sel=None
    import itertools
    for r in range(1,len(ws)+1):
        for comb in itertools.combinations(range(len(ws)),r):
            if sum(ws[i] for i in comb)==target: sel=comb; break
        if sel: break
    over=[i for i in range(len(ws))]; total=0; picked=[]
    for i in sorted(range(len(ws)),key=lambda i:-ws[i]):
        if total>target: break
        pg.click(f'{S} .orchard .fruit[data-i="{i}"]'); total+=ws[i]; picked.append(i)
    check('Prea greu' in status(pg,S),'too much fruit: take something out')
    for _ in picked: pg.click(f'{S} .fruit-basket .fruit >> nth=0')
    for i in sel: pg.click(f'{S} .orchard .fruit[data-i="{i}"]')
    check('Coșul e plin' in status(pg,S) and wins(pg,'craft-picking')==1,'exact weight fills the basket')
    pg.click(f'{S} .learning-tabs button:nth-child(2)'); ans=pg.get_attribute(f'{S} .studio-stage','data-answer'); pg.click(f'{S} .craft-tool[data-tool={ans}]')
    check('Corect' in status(pg,S) and wins(pg,'craft-picking')==2,'fruit seasons question')
    # Olărit: coacere liberă și comandă
    pg.evaluate("gardenCrafts.open('pottery')"); pg.wait_for_timeout(80); S='#studio'
    pg.click(f'{S} .pot-bake'); pg.wait_for_timeout(200)
    check(pg.locator(f'{S} .pot-shelf .pot-mini').count()==1 and wins(pg,'craft-pottery')==1,'pottery: fired pot goes on the shelf')
    pg.click(f'{S} .page-picker button:nth-child(2)'); pg.wait_for_timeout(80)
    order=json.loads(pg.get_attribute(f'{S} .studio-stage','data-order'))
    pg.click(f'{S} .pot-group:nth-child(1) button[data-v={"low" if order["height"]!="low" else "tall"}]'); pg.click(f'{S} .pot-bake')
    check('altceva' in status(pg,S),'pottery: a pot that does not match the order gets a hint')
    for i,key in enumerate(['height','belly','neck','glaze','pattern']): pg.click(f'{S} .pot-group:nth-child({i+1}) button[data-v={order[key]}]')
    pg.click(f'{S} .pot-bake'); pg.wait_for_timeout(200)
    check('Exact' in status(pg,S) and wins(pg,'craft-pottery')==2,'pottery: matching the order pleases the customer')
    # Croșetat: rânduri până la fular + calculul ochiurilor
    pg.evaluate("gardenCrafts.open('crochet')"); pg.wait_for_timeout(80)
    first=True
    for _ in range(80):
        nx=pg.get_attribute(f'{S} .studio-stage','data-next')
        if nx in (None,''): break
        if first:
            other=[c for c in pg.eval_on_selector_all(f'{S} .yarn-btn','bs=>bs.map(b=>b.dataset.c)') if c!=nx][0]; pg.click(f'{S} .yarn-btn[data-c="{other}"]'); check('ce culoare urmează' in status(pg,S),'crochet: wrong colour gives a hint'); first=False
        pg.click(f'{S} .yarn-btn[data-c="{nx}"]')
        if pg.locator(f'{S} .craft-answer').count(): break
    check(wins(pg,'craft-crochet')==4 and 'Fularul e gata' in status(pg,S),'crochet: 4 rows make a scarf')
    ans=pg.get_attribute(f'{S} .studio-stage','data-answer'); pg.click(f'{S} .craft-answer:text-is("{ans}")')
    check(pg.locator(f'{S} .craft-answer.right').count()==1,'crochet: counting all the stitches (rows × stitches)')
    check(pg.evaluate("[gardenRewards.skillOf('music-echo'),gardenRewards.skillOf('draw-dots'),gardenRewards.skillOf('craft-math'),gardenRewards.skillOf('craft-crochet')].join()")=='music,creativity,numbers,logic','new games feed the parent report skills')
    pg.screenshot(path=SHOTS+'s-crochet.png')
    pg.close()

    # Cei mici: pași mai puțini, fără calcule mari, fără provocarea în oglindă
    pg=page(4); pg.evaluate("gardenGo('studio')"); pg.evaluate("gardenCrafts.open('garden')"); pg.wait_for_timeout(80)
    check(pg.locator('#studio .craft-choice').count()==4,'age 4: planting has 4 steps')
    pg.click('#studio .learning-tabs button:nth-child(2)'); check(pg.locator('#studio .craft-tool').count()==3,'age 4: 3 tool choices')
    pg.evaluate("gardenCrafts.open('pottery')"); check(pg.locator('#studio .page-picker').count()==0,'age 4: pottery has no orders')
    pg.evaluate("gardenCrafts.open('picking')"); pg.wait_for_timeout(50)
    check(pg.get_attribute('#studio .studio-stage','data-mode')=='ripe','age 4: pick only the ripe apples')
    pg.click('#studio .orchard .fruit[data-fruit=green] >> nth=0'); check('încă verde' in status(pg,'#studio'),'age 4: green apples are left to grow')
    n=pg.locator('#studio .orchard .fruit[data-fruit=apple]').count()
    for _ in range(n): pg.click('#studio .orchard .fruit[data-fruit=apple]:visible >> nth=0')
    check('Coșul e plin' in status(pg,'#studio'),f'age 4: all {n} red apples picked')
    pg.evaluate("gardenGo('drawing')"); pg.wait_for_timeout(80)
    check(pg.get_attribute('#drawing .learning-tabs button:nth-child(2)','aria-pressed')=='true' and pg.locator('#drawing .code-toggle').count()==0,'age 4: drawing opens on free colouring')
    pg.click('#drawing .learning-tabs button:nth-child(4)'); check(pg.locator('#drawing .px-grid.mine .px-cell').count()==36,'age 4: 6×6 pixel art')
    pg.evaluate("gardenGo('music')"); pg.wait_for_timeout(50); pg.click('#music .learning-tabs button:nth-child(3)')
    check(pg.locator('#music .xylo .bar').count()==4,'age 4: echo uses 4 bars')
    pg.select_option('#lang','uk'); pg.wait_for_timeout(200); pg.evaluate("gardenGo('studio')"); pg.evaluate("gardenCrafts.open(null)"); pg.wait_for_timeout(80)
    h=pg.inner_text('#studio h2'); check(h not in ('','Workshops and jobs','Ateliere și meserii') and any('\u0400'<=c<='\u04ff' for c in h),f'Ukrainian workshop hub ({h})')
    pg.select_option('#lang','hu'); pg.wait_for_timeout(200)
    h=pg.inner_text('#studio h2'); check(h not in ('','Workshops and jobs','Ateliere și meserii') and not any('\u0400'<=c<='\u04ff' for c in h),f'Hungarian workshop hub ({h})')
    pg.screenshot(path=SHOTS+'s-hub-hu.png')
    pg.close()
    pg=page(7); pg.evaluate("gardenGo('studio')"); pg.wait_for_timeout(80); S='#studio'
    # Hub ghidat: filtre, recomandarea zilei, NOU
    check(pg.locator(f'{S} .hub-filter button').count()==4 and pg.locator(f'{S} .craft-card.recommended').count()==1 and pg.locator(f'{S} .craft-card').first.get_attribute('class').count('recommended')==1,'hub: 4 filters and today’s pick shown first')
    check(pg.locator(f'{S} .craft-badge:not(.rec)').count()==11,'hub: untried workshops are marked NEW')
    pg.click(f'{S} .hub-filter button[data-cat=nature]'); cards=pg.eval_on_selector_all(f'{S} .craft-card','bs=>bs.map(b=>b.dataset.craft).sort()')
    check(cards==['animals','farm','garden','picking'],f'hub: Nature filter shows garden, farm, fruit, animals ({cards})')
    pg.click(f'{S} .hub-filter button[data-cat=all]')
    try: pg.wait_for_function("[...document.querySelectorAll('#studio .craft-card-icon img.tw')].every(i=>i.complete&&i.naturalWidth>0)",timeout=5000)
    except Exception: pass
    check(pg.evaluate("document.querySelectorAll('.garden-nav .ni img.tw').length")==11 and pg.evaluate("[...document.querySelectorAll('#studio .craft-card-icon img.tw')].every(i=>i.complete&&i.naturalWidth>0)"),'Twemoji icons load in the menu and on the workshop cards')
    # 6–8 ani: o problemă, 4 unelte, explicația „De ce?”, runda de 5 și stelele
    pg.evaluate("gardenCrafts.open('doctor')"); pg.click(f'{S} .learning-tabs button:nth-child(2)'); pg.wait_for_timeout(50)
    check(pg.locator(f'{S} .round-bar span').count()==5 and pg.locator(f'{S} .craft-tool').count()==4,'age 7: rounds of 5 problems with 4 tools each')
    for r in range(5):
        ans=pg.get_attribute(f'{S} .studio-stage','data-answer')
        if r==0:
            w=[t for t in pg.eval_on_selector_all(f'{S} .craft-tool','bs=>bs.map(b=>b.dataset.tool)') if t!=ans][0]; pg.click(f'{S} .craft-tool[data-tool={w}]')
        pg.click(f'{S} .craft-tool[data-tool={ans}]')
        if r==0: check(pg.locator(f'{S} .craft-why').count()==1,'a correct answer explains why')
        if r<4: pg.click(f'{S} .craft-next')
    check(pg.get_attribute(f'{S} .studio-stage','data-stars')=='2' and pg.locator(f'{S} .round-stars').count()==1,'round of 5 ends with stars (one mistake → 2 stars)')
    pg.click(f'{S} .studio-back'); check('⭐⭐☆' in pg.inner_text(f'{S} .craft-card[data-craft=doctor]'),'best stars appear on the workshop card')
    pg.evaluate("gardenCrafts.open('picking')"); pg.wait_for_timeout(80)
    want=pg.get_attribute(f'{S} .studio-stage','data-want'); t=int(pg.get_attribute(f'{S} .studio-stage','data-target'))
    check(pg.get_attribute(f'{S} .studio-stage','data-mode')=='count' and 3<=t<=6,f'age 7: pick exactly {t} of one fruit')
    pg.click(f'{S} .orchard .fruit:not([data-fruit={want}]) >> nth=0'); check('Caută' in status(pg,S),'age 7: other fruit gives a hint')
    for _ in range(t): pg.click(f'{S} .orchard .fruit[data-fruit={want}]:visible >> nth=0')
    check('Coșul e plin' in status(pg,S) and pg.locator(f'{S} .fruit-basket .fruit').count()==t,'age 7: exact count fills the basket')
    pg.evaluate("gardenCrafts.open('farm')"); pg.click(f'{S} .learning-tabs button:nth-child(3)'); ans=pg.get_attribute(f'{S} .studio-stage','data-answer'); pg.click(f'{S} .craft-answer:text-is("{ans}")')
    check('Corect' in status(pg,S),'age 7: egg boxes question')
    # Sugestiile lui Bia pe Acasă: continuă, nou, de exersat
    pg.click('.garden-nav button[data-go=home]'); pg.evaluate("gardenGo('studio');gardenGo('home')"); pg.wait_for_timeout(100)
    kinds=pg.eval_on_selector_all('.bia-idea','bs=>bs.map(b=>b.dataset.kind)')
    check(kinds==['continue','new','practice'],f'Home shows Bia’s ideas: continue, new, practise ({kinds})')
    pg.click('.bia-idea[data-kind=continue]'); pg.wait_for_timeout(100)
    check(pg.evaluate("document.getElementById('app').dataset.view")=='studio' and pg.get_attribute('#studio','data-craft')=='farm','Continue reopens the last workshop')
    pg.close()
    check(not errs,f'no page errors {errs[:3]}')
print('\nFAILURES:',len(fails))
raise SystemExit(1 if fails else 0)
