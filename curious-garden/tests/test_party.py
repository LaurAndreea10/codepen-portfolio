"""Grădina Curioasă — teste pentru petrecerea de ziua copilului: blocare în afara zilei, baloane, camera de petrecere."""
import os,tempfile,json,datetime
from playwright.sync_api import sync_playwright
URL=os.environ.get('GARDEN_URL','http://localhost:8000/curious-garden/')
SHOTS=os.environ.get('GARDEN_SHOTS',os.path.join(tempfile.gettempdir(),'garden-shots'))+'/'
os.makedirs(SHOTS,exist_ok=True)
fails=[]
def check(c,msg):
    print(('OK   ' if c else 'FAIL ')+msg)
    if not c: fails.append(msg)
T=datetime.date.today()
def start(pg,age,birthday=True):
    if birthday: dob=f'{T.year-age}-{T.month:02d}-{T.day:02d}'
    else:
        far=T+datetime.timedelta(days=150); dob=f'{far.year-age-1}-{far.month:02d}-{min(far.day,28):02d}'
    pg.fill('#dob',dob); pg.fill('#nickname','Ana'); pg.click('#start'); pg.wait_for_timeout(350)
    pg.evaluate("document.body.classList.add('quiet');document.querySelectorAll('.bia-bubble').forEach(e=>e.remove())")
def wins(pg,g): return pg.evaluate(f"(()=>{{const d=gardenRewards.read();return (d.stats&&d.stats['{g}']&&d.stats['{g}'].w)||0}})()")
def status(pg): return pg.inner_text('#birthday .party-status')
with sync_playwright() as p:
    br=p.chromium.launch(); errs=[]
    def page(age,birthday=True):
        pg=br.new_page(viewport={'width':390,'height':844}); pg.on('pageerror',lambda e:errs.append(str(e))); pg.goto(URL); start(pg,age,birthday); return pg
    # În afara zilei de naștere: doar tortul; baloanele și camera sunt blocate (previzualizare pentru adulți)
    pg=page(7,False)
    check(pg.locator('.party-home').count()==0,'no party banner on Home outside the birthday window')
    pg.click('.garden-nav button[data-go=birthday]'); pg.wait_for_timeout(100)
    check(pg.locator('.party-tabs button[data-tab=balloons]').is_disabled() and pg.locator('.party-tabs button[data-tab=room]').is_disabled(),'balloons and party room are locked before the birthday')
    check('se deschid de ziua ta' in pg.inner_text('.party-locked') and pg.locator('#decorations button').count()>0,'locked note explains when it opens; the cake stays available')
    pg.click('.party-preview'); pg.wait_for_timeout(80)
    check(pg.get_attribute('#birthday','data-party')=='balloons' and pg.locator('.party-pump').count()==1,'an adult can preview the balloons')
    pg.close()
    # Ziua de naștere, 4 ani: mesaj pe Acasă, 3 baloane, fără să se spargă
    pg=page(4)
    check('La mulți ani, Ana' in pg.inner_text('.party-home'),'Home says Happy Birthday with the child’s nickname')
    pg.click('.party-home button'); pg.wait_for_timeout(100)
    check(pg.evaluate("document.getElementById('app').dataset.view")=='birthday' and pg.get_attribute('#birthday','data-party')=='balloons','the Home button opens the balloons')
    check(pg.locator('#birthday #bases').is_hidden(),'cake controls are hidden while blowing up balloons')
    pg.click('.party-tie'); check('mic' in status(pg),'a small balloon cannot be tied yet')
    for n in range(3):
        for _ in range(12): pg.click('.party-pump')
        pg.click('.party-tie')
    check(wins(pg,'party-balloons')==1 and 'Toate baloanele' in status(pg),'age 4: three balloons, never popping')
    pg.click('.party-tabs button[data-tab=room]'); pg.wait_for_timeout(80)
    check(pg.locator('.party-room .mini-balloon.hang').count()==3,'tied balloons hang in the party room')
    pg.click('.party-finish'); check('Mai pune' in status(pg),'age 4: the room needs a few decorations first')
    for k in ['cake','gift','bear','star','confetti']:
        pg.click(f'.party-item[data-item={k}]'); pg.click('.party-add')
    check(pg.locator('.party-placed').count()==5,'decorations are placed in the room')
    pg.locator('.party-placed').first.click(); check(pg.locator('.party-placed').count()==4,'tapping a decoration takes it out')
    pg.click('.party-item[data-item=ribbon]'); pg.evaluate("document.querySelector('.party-room').scrollIntoView({block:'start'});document.querySelectorAll('.bia-bubble').forEach(e=>e.remove())"); pg.wait_for_timeout(300); box=pg.locator('.party-room').bounding_box(); pg.mouse.click(box['x']+box['width']*.3,box['y']+box['height']*.6)
    check(pg.locator('.party-placed').count()==5,'tapping the room places the chosen decoration there')
    pg.click('.party-finish'); check(wins(pg,'party-room')==1 and 'gata de petrecere' in status(pg),'age 4: the room is ready')
    pg.click('.party-photo'); check(pg.get_attribute('.party-photo','href').startswith('data:image/png'),'the party photo can be saved')
    pg.click('.party-tabs button[data-tab=cake]'); pg.click('#decorations button >> nth=0'); pg.click('#finishCake')
    check('Felicitări' in pg.inner_text('#cakeFeedback'),'the cake still works inside the party')
    pg.screenshot(path=SHOTS+'party-4.png'); pg.close()
    # 7 ani: comandă pe culori, balonul se sparge dacă e umflat prea tare, camera după listă
    pg=page(7); pg.click('.party-home button'); pg.wait_for_timeout(80)
    want=json.loads(pg.get_attribute('#birthday .party-stage','data-want'))
    other=[c for c in ['red','blue','yellow','green','purple','pink'] if c not in want][0]
    pg.click(f'.party-colors button[data-c={other}]')
    for _ in range(6): pg.click('.party-pump')
    pg.click('.party-tie'); check('nu mai cere' in status(pg),'age 7: a colour not in the order is refused')
    popped=False
    for _ in range(6):
        pg.click('.party-pump')
        if 'Pac' in status(pg): popped=True; break
    check(popped,'age 7: pumping too much pops the balloon')
    for c,n in want.items():
        for _ in range(n):
            pg.click(f'.party-colors button[data-c={c}]')
            for _ in range(6): pg.click('.party-pump')
            pg.click('.party-tie')
    check(wins(pg,'party-balloons')==1,'age 7: the colour order is complete')
    pg.click('.party-tabs button[data-tab=room]'); pg.wait_for_timeout(80)
    lst=json.loads(pg.get_attribute('#birthday .party-stage','data-list'))
    pg.click('.party-finish'); check('Mai lipsesc' in status(pg),'age 7: the list says what is still missing')
    for k,n in lst.items():
        pg.click(f'.party-item[data-item={k}]')
        for _ in range(n): pg.click('.party-add')
    check(pg.locator('.party-list li.ok').count()==len(lst),'every item on the list is ticked')
    pg.click('.party-finish'); check(wins(pg,'party-room')==1,'age 7: the room matches the list')
    pg.close()
    # 10 ani: aer în ml, apăsări exacte; buget pentru decorațiuni
    pg=page(10); pg.click('.party-home button'); pg.wait_for_timeout(80)
    step=int(pg.get_attribute('#birthday .party-stage','data-step')); ml=int(pg.get_attribute('#birthday .party-stage','data-ml'))
    for _ in range(ml//step+1): pg.click('.party-pump')
    pg.click('.party-tie'); check('exact' in status(pg),'age 10: one press too many is not a perfect balloon')
    pg.click('.party-letout'); check(int(pg.get_attribute('#birthday .party-stage','data-air'))==ml,'letting some air out fixes it')
    pg.click('.party-tie')
    for _ in range(2):
        for _ in range(ml//step): pg.click('.party-pump')
        pg.click('.party-tie')
    check(wins(pg,'party-balloons')==1,f'age 10: three perfect {ml} ml balloons ({ml//step} presses of {step} ml)')
    pg.click('.party-tabs button[data-tab=room]'); pg.wait_for_timeout(80)
    lst=json.loads(pg.get_attribute('#birthday .party-stage','data-list')); budget=int(pg.get_attribute('#birthday .party-stage','data-budget'))
    check(pg.locator('.party-item small').count()==10,'age 10: every decoration shows its price')
    for k,n in lst.items():
        pg.click(f'.party-item[data-item={k}]')
        for _ in range(n): pg.click('.party-add')
    pg.click('.party-item[data-item=cake]'); pg.click('.party-add'); pg.click('.party-add')
    check('depășit' in status(pg),f'age 10: going over the {budget} lei budget is flagged')
    pg.click('.party-finish'); check(wins(pg,'party-room')==0,'the room is not finished while over budget')
    for _ in range(2): pg.locator('.party-placed[data-k=cake]').last.click()
    pg.click('.party-finish'); check(wins(pg,'party-room')==1,'within budget and with the whole list, the room is ready')
    pg.select_option('#lang','uk'); pg.wait_for_timeout(150)
    check(any('\u0400'<=c<='\u04ff' for c in pg.inner_text('.party-tabs')),'party tabs are translated (Ukrainian)')
    pg.close()
    # Numele vine din profilul salvat: alt nume, schimbarea profilului, profil fără nume
    pg=br.new_page(viewport={'width':390,'height':844}); pg.on('pageerror',lambda e:errs.append(str(e))); pg.goto(URL)
    pg.fill('#dob',f'{T.year-6}-{T.month:02d}-{T.day:02d}'); pg.fill('#nickname','Mihai'); pg.click('#start'); pg.wait_for_timeout(350)
    check('La mulți ani, Mihai!' in pg.inner_text('.party-home'),'the greeting uses the nickname saved in the profile (Mihai)')
    pg.click('.party-home button'); pg.click('.party-tabs button[data-tab=room]'); pg.wait_for_timeout(80)
    check(pg.inner_text('.party-banner')=='La mulți ani, Mihai!','the party-room banner uses the same nickname')
    pg.evaluate(f"gardenProfileApi.add({{id:'p2',name:'Ioana',dob:'{T.year-8}-{T.month:02d}-{T.day:02d}',world:'nature',done:0,attempts:0,days:[],album:[]}});gardenProfileApi.select('p2')"); pg.wait_for_timeout(300)
    pg.evaluate("gardenGo('home')"); pg.wait_for_timeout(100)
    check('La mulți ani, Ioana!' in pg.inner_text('.party-home'),'switching profile switches the name (Ioana)')
    pg.evaluate(f"gardenProfileApi.add({{id:'p3',name:'',dob:'{T.year-5}-{T.month:02d}-{T.day:02d}',world:'nature',done:0,attempts:0,days:[],album:[]}});gardenProfileApi.select('p3')"); pg.wait_for_timeout(300)
    pg.evaluate("gardenGo('home')"); pg.wait_for_timeout(100)
    t=pg.inner_text('.party-home'); check('La mulți ani!' in t and 'Ioana' not in t and 'Mihai' not in t,'without a nickname the greeting is simply “La mulți ani!”')
    pg.close()
    check(not errs,f'no page errors {errs[:3]}')
print('\nFAILURES:',len(fails))
raise SystemExit(1 if fails else 0)
