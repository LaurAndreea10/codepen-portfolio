"""Grădina Curioasă — Jucării: Puzzle, Lego (model, știfturi, liber) și Potrivește."""
import os,json,datetime,re
from playwright.sync_api import sync_playwright
URL=os.environ.get('GARDEN_URL','http://localhost:8000/curious-garden/')
fails=[]
def check(c,msg):
    print(('OK   ' if c else 'FAIL ')+msg)
    if not c: fails.append(msg)
T='#toys'
def status(pg): return pg.inner_text(f'{T} .party-status')
def wins(pg,g): return pg.evaluate(f"(()=>{{const d=gardenRewards.read();return (d.stats&&d.stats['{g}']&&d.stats['{g}'].w)||0}})()")
def rot(pg,i):
    s=pg.locator(f'{T} .pz-piece[data-piece="{i}"] svg').get_attribute('style') or ''
    m=re.search(r'rotate\((\d+)deg\)',s); return int(m.group(1)) if m else 0
def solve_puzzle(pg):
    for _ in range(20):
        if pg.locator(f'{T} .pz-piece').count()==0: break
        i=pg.locator(f'{T} .pz-piece').first.get_attribute('data-piece'); pg.click(f'{T} .pz-piece[data-piece="{i}"]')
        for _ in range(4):
            if rot(pg,i)%360==0: break
            pg.click(f'{T} .pz-rotate')
        pg.click(f'{T} .pz-slot[data-slot="{i}"]')
def place(pg,w,c,x):
    pg.click(f'{T} .lego-size[data-w="{w}"]'); pg.click(f'{T} .lego-palette .swatch[data-c="{c}"]'); pg.click(f'{T} .lego-plate.mine .lego-col[data-col="{x}"]')
def solve_match(pg):
    for i in pg.eval_on_selector_all(f'{T} .m-left','bs=>bs.map(b=>b.dataset.pair)'):
        pg.click(f'{T} .m-left[data-pair="{i}"]'); pg.click(f'{T} .m-right[data-pair="{i}"]')
with sync_playwright() as p:
    br=p.chromium.launch(); errs=[]
    def page(age,lang=None):
        pg=br.new_page(viewport={'width':390,'height':844}); pg.on('pageerror',lambda e:errs.append(str(e))); pg.goto(URL)
        d=datetime.date.today(); pg.fill('#dob',f'{d.year-age}-02-02'); pg.fill('#nickname','Ana'); pg.click('#start'); pg.wait_for_timeout(350)
        pg.evaluate("document.body.classList.add('quiet');document.querySelectorAll('.bia-bubble').forEach(e=>e.remove())")
        if lang: pg.select_option('#lang',lang); pg.wait_for_timeout(150)
        return pg
    # 4 ani: puzzle 2×2 cu imagine ajutătoare, umbre
    pg=page(4)
    check(pg.locator('.garden-nav button[data-go=toys]').count()==1 and pg.locator('.garden-nav button').count()==12,'menu has the Toys screen (12 screens)')
    pg.click('.garden-nav button[data-go=toys]'); pg.wait_for_timeout(100)
    check(pg.locator(f'{T} .pz-slot').count()==4 and pg.locator(f'{T} .pz-ghost').count()==1,'age 4: 2×2 puzzle with a helper picture')
    pg.click(f'{T} .pz-slot[data-slot="0"]'); check('Alege întâi' in status(pg),'tapping the board first asks for a piece')
    first=pg.locator(f'{T} .pz-piece').first.get_attribute('data-piece'); wrong=str((int(first)+1)%4)
    pg.locator(f'{T} .pz-piece').first.click(); pg.click(f'{T} .pz-slot[data-slot="{wrong}"]'); check('nu se potrivește' in status(pg),'a piece in the wrong place gives a hint')
    solve_puzzle(pg); check('Puzzle complet' in status(pg) and wins(pg,'toys-puzzle')==1,'age 4: the puzzle is completed')
    pg.click(f'{T} .pz-next'); check(pg.locator(f'{T} .pz-slot.filled').count()==0,'another puzzle starts empty')
    pg.click(f'{T} .learning-tabs button[data-mode=match]'); pg.wait_for_timeout(80)
    check(pg.locator(f'{T} .m-left').count()==3 and pg.locator(f'{T} .m-right.silhouette').count()==3,'age 4: 3 pairs, objects and their shadows')
    b=pg.locator(f'{T} .m-left').first; i=b.get_attribute('data-pair'); b.click(); other=[x.get_attribute('data-pair') for x in pg.locator(f'{T} .m-right').all() if x.get_attribute('data-pair')!=i][0]
    pg.click(f'{T} .m-right[data-pair="{other}"]'); check('Nu sunt pereche' in status(pg),'a wrong pair gives a hint')
    solve_match(pg); check('Toate perechile' in status(pg) and wins(pg,'toys-match')==1,'age 4: all pairs matched')
    pg.click(f'{T} .page-picker button:nth-child(2)'); solve_match(pg); check(wins(pg,'toys-match')==2,'colours: coloured dot ↔ object')
    pg.click(f'{T} .learning-tabs button[data-mode=lego]'); pg.wait_for_timeout(80)
    model=json.loads(pg.get_attribute(f'{T} .toys-stage','data-model')); check(len(model)==3,'age 4: copy a 3-brick tower')
    for b in model: place(pg,b['w'],b['c'],b['x'])
    check('Construcție reușită' in status(pg) and wins(pg,'toys-lego')==1,'age 4: the tower matches the model')
    pg.close()
    # 7 ani: Lego după model (mai multe cărămizi) și știfturi
    pg=page(7); pg.evaluate("gardenGo('toys')"); pg.click(f'{T} .learning-tabs button[data-mode=lego]'); pg.wait_for_timeout(80)
    model=json.loads(pg.get_attribute(f'{T} .toys-stage','data-model')); check(5<=len(model)<=6,f'age 7: copy a {len(model)}-brick model')
    b=model[0]; other=[c for c in ['red','yellow','green','blue','orange','white'] if c!=b['c']][0]
    place(pg,b['w'],other,b['x']); check(pg.get_attribute(f'{T} .toys-stage','data-done')=='','a different colour does not match the model')
    pg.click(f'{T} .draw-tools button:has-text("Scoate ultima")')
    for b in model: place(pg,b['w'],b['c'],b['x'])
    check(pg.get_attribute(f'{T} .toys-stage','data-done')=='1','age 7: the building matches the model')
    pg.click(f'{T} .lego-subs button:nth-child(2)'); target=int(pg.get_attribute(f'{T} .toys-stage','data-target'))
    left=target-1
    while left>0:
        w=min(4,left); place(pg,w,'blue',0); left-=w
    place(pg,2,'red',6); check('Prea multe' in status(pg),'too many studs gives a hint')
    pg.click(f'{T} .draw-tools button:has-text("Scoate ultima")'); place(pg,1,'red',6)
    check('Construcție reușită' in status(pg),f'age 7: exactly {target} studs')
    pg.click(f'{T} .lego-subs button:nth-child(3)'); place(pg,4,'red',0); place(pg,2,'yellow',1); pg.click(f'{T} .lego-save')
    check(pg.locator(f'{T} .lego-plate.thumb').count()==1,'a free building can be saved and shown')
    pg.close()
    # 10 ani: puzzle 4×4 cu piese rotite, Lego cu înălțime exactă, perechi mai grele
    pg=page(10); pg.evaluate("gardenGo('toys')"); pg.wait_for_timeout(80)
    check(pg.locator(f'{T} .pz-slot').count()==16 and pg.locator(f'{T} .pz-ghost').count()==0,'age 10: 4×4 puzzle without a helper picture')
    turned=[b.get_attribute('data-piece') for b in pg.locator(f'{T} .pz-piece').all() if rot(pg,b.get_attribute('data-piece'))]
    if turned:
        i=turned[0]; pg.click(f'{T} .pz-piece[data-piece="{i}"]'); pg.click(f'{T} .pz-slot[data-slot="{i}"]'); check('Rotește' in status(pg),'a turned piece in the right place must be rotated first')
    solve_puzzle(pg); check('Puzzle complet' in status(pg),'age 10: the rotated puzzle is completed')
    pg.click(f'{T} .learning-tabs button[data-mode=lego]'); pg.click(f'{T} .lego-subs button:nth-child(2)'); pg.wait_for_timeout(60)
    target=int(pg.get_attribute(f'{T} .toys-stage','data-target')); H=int(pg.get_attribute(f'{T} .toys-stage','data-height'))
    for _ in range(H): place(pg,1,'green',0)
    left=target-H; x=1
    while left>0:
        w=min(4,left,10-x)
        if w<=0: x=1; continue
        place(pg,w,'orange',x); left-=w; x+=w
        if x>=10: x=1
    check('Construcție reușită' in status(pg),f'age 10: exactly {target} studs and {H} rows high')
    pg.click(f'{T} .learning-tabs button[data-mode=match]'); pg.wait_for_timeout(60)
    themes=pg.eval_on_selector_all(f'{T} .page-picker button','bs=>bs.map(b=>b.textContent)')
    check(len(themes)==4 and pg.locator(f'{T} .m-left').count()==6,'age 10: 4 harder themes with 6 pairs')
    lefts=pg.eval_on_selector_all(f'{T} .m-left','bs=>bs.map(b=>b.textContent)'); check(all('×' in t for t in lefts),'times tables: 7 × 8 ↔ 56')
    solve_match(pg); check('Toate perechile' in status(pg),'times tables matched')
    for k in (2,3,4):
        pg.click(f'{T} .page-picker button:nth-child({k})'); solve_match(pg)
    check(wins(pg,'toys-match')==4,'opposites, fractions and clocks can be matched too')
    check(pg.evaluate("['toys-puzzle','toys-lego','toys-match'].map(g=>gardenRewards.skillOf(g)).join()")=='logic,creativity,attention','toys feed the parent report skills')
    pg.close()
    # Ucraineană: literele sunt chirilice
    pg=page(7,'uk'); pg.evaluate("gardenGo('toys')"); pg.click(f'{T} .learning-tabs button[data-mode=match]'); pg.click(f'{T} .page-picker button:nth-child(3)'); pg.wait_for_timeout(60)
    lefts=''.join(pg.eval_on_selector_all(f'{T} .m-left','bs=>bs.map(b=>b.textContent)'))
    check(all('Ѐ'<=c<='ӿ' for c in lefts),'Ukrainian: letter pairs use the Cyrillic alphabet')
    pg.close()
    check(not errs,f'no page errors {errs[:3]}')
print('\nFAILURES:',len(fails))
raise SystemExit(1 if fails else 0)
