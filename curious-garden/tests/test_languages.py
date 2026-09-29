"""Grădina Curioasă — teste pentru ecranul Limbi străine (EN/FR/DE/ES)."""
import os,sys,tempfile,re,datetime,json
from playwright.sync_api import sync_playwright
URL=os.environ.get('GARDEN_URL','http://localhost:8000/curious-garden/')
SHOTS=os.environ.get('GARDEN_SHOTS',os.path.join(tempfile.gettempdir(),'garden-shots'))+'/'
os.makedirs(SHOTS,exist_ok=True)
EN_NUM={'1':'one','2':'two','3':'three','4':'four','5':'five','6':'six','7':'seven','8':'eight','9':'nine','10':'ten'}
fails=[]
def check(c,msg):
    print(('OK   ' if c else 'FAIL ')+msg)
    if not c: fails.append(msg)
S='#languages'
def tab(pg,name): pg.click(f'{S} .lang-tabs button:has-text("{name}")'); pg.wait_for_timeout(80)
def won(pg): return pg.locator(f'{S} .lang-stage button.primary').count()>0
def brute(pg,sel,until):
    for _ in range(12):
        if until(): return True
        b=pg.locator(sel+':not([disabled])')
        if b.count()==0: return until()
        for i in range(b.count()):
            bb=pg.locator(sel+':not([disabled])')
            if i>=bb.count(): break
            bb.nth(i).click(); pg.wait_for_timeout(60)
            if until(): return True
    return until()
def start(pg,age):
    d=datetime.date.today(); pg.fill('#dob',f'{d.year-age}-02-02'); pg.click('#start'); pg.wait_for_timeout(300)
    pg.click('.garden-nav button[data-go=languages]'); pg.wait_for_timeout(150)
with sync_playwright() as p:
    br=p.chromium.launch(); errs=[]
    # --- 4 ani: doar jocuri fără citit, teme simple
    pg=br.new_page(viewport={'width':390,'height':844}); pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(URL); start(pg,4)
    check(pg.locator(f'{S} .lang-tabs button').count()==2,'age 4: only listening games (Listen and tap, Words of the day)')
    check(pg.locator(f'{S} .lang-themes button').count()==4,'age 4: four simple themes (animals, fruit, colours, numbers)')
    check(pg.locator(f'{S} .lang-targets button').count()==4,'four languages to learn: EN, FR, DE, ES')
    pg.screenshot(path=SHOTS+'l-young.png',full_page=True)
    ok=brute(pg,f'{S} .lang-option',lambda: won(pg)); check(ok,'listen and tap: picking the right picture wins')
    pg.close()
    # --- 10 ani: toate jocurile
    pg=br.new_page(viewport={'width':390,'height':844}); pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(URL); start(pg,10)
    check(pg.locator(f'{S} .lang-tabs button').count()==6,'age 10: all six games')
    check(pg.locator('.garden-nav button[data-go=languages]').count()==1,'menu has the Languages screen')
    for t,sample in [('fr','🇫🇷'),('de','🇩🇪'),('es','🇪🇸'),('en','🇬🇧')]:
        pg.click(f'{S} .lang-targets button:has-text("{sample}")'); pg.wait_for_timeout(80)
        w=pg.inner_text(f'{S} .lang-word'); lg=pg.get_attribute(f'{S} .lang-stage','lang')
        check(bool(w.strip()) and lg==t,f'target {t}: word shown ({w!r}), stage marked lang={lg} for correct pronunciation')
    # Memory cu numere în engleză
    tab(pg,'Memory'); pg.click(f'{S} .lang-themes button:has-text("Numere")'); pg.wait_for_timeout(80)
    cards=pg.locator(f'{S} .lang-card'); n=cards.count(); seen={}
    for i in range(0,n,2):
        cards.nth(i).click(); pg.wait_for_timeout(40); cards.nth(i+1).click(); pg.wait_for_timeout(40)
        for j in (i,i+1):
            c=cards.nth(j); dots=c.locator('.lang-dots')
            seen[j]=('pic',dots.get_attribute('aria-label')) if dots.count() else ('word',c.inner_text().strip())
        pg.wait_for_timeout(950)
    pics={v[1]:k for k,v in seen.items() if v[0]=='pic'}; words={v[1]:k for k,v in seen.items() if v[0]=='word'}
    for num,i in pics.items():
        j=words.get(EN_NUM[num])
        if j is None: continue
        if 'found' in (cards.nth(i).get_attribute('class') or ''): continue
        cards.nth(i).click(); pg.wait_for_timeout(40); cards.nth(j).click(); pg.wait_for_timeout(120)
    check(won(pg) and pg.locator(f'{S} .lang-card.found').count()==n,f'word memory: all {n//2} picture–word pairs matched (numbers in English)')
    pg.screenshot(path=SHOTS+'l-memory.png',full_page=True)
    # Scrie cuvântul
    tab(pg,'Scrie'); pg.click(f'{S} .lang-themes button:has-text("Animale")'); pg.wait_for_timeout(80)
    total=pg.locator(f'{S} .lang-slots span').count()
    for _ in range(total+2):
        if won(pg): break
        filled=pg.locator(f'{S} .lang-slots span.filled').count()
        for b in pg.locator(f'{S} .lang-letter:not([disabled])').all():
            b.click(); pg.wait_for_timeout(30)
            if pg.locator(f'{S} .lang-slots span.filled').count()>filled: break
    check(won(pg) and pg.locator(f'{S} .lang-slots span.filled').count()==total,f'spell the word: {total} letters placed in order')
    # Propoziții în germană
    pg.click(f'{S} .lang-targets button:has-text("🇩🇪")'); tab(pg,'Propoziții')
    sent=pg.inner_text(f'{S} .lang-sentence')
    ok=brute(pg,f'{S} .lang-choices button',lambda: won(pg))
    check(ok and 'Corect' in pg.inner_text(f'{S} .learning-feedback') and '___' in sent,f'sentences (German): {sent!r} completed')
    pg.screenshot(path=SHOTS+'l-sentence.png',full_page=True)
    # Dialog în spaniolă
    pg.click(f'{S} .lang-targets button:has-text("🇪🇸")'); tab(pg,'Dialoguri')
    pg.click(f'{S} .lang-choices button:has-text("magazin")'); pg.wait_for_timeout(80)
    line=pg.inner_text(f'{S} .lang-bubble')
    for stepn in range(3):
        brute(pg,f'{S} .lang-choices.dialog button',lambda: pg.locator(f'{S} .lang-gloss').count()>0)
        if stepn<2: pg.click(f'{S} .lang-stage button.primary'); pg.wait_for_timeout(80)
    check('Buenos' in line and 'Ai terminat conversația' in pg.inner_text(f'{S} .learning-feedback'),'dialogue (Spanish, at the shop): three replies, with meaning explained in Romanian')
    pg.screenshot(path=SHOTS+'l-dialog.png',full_page=True)
    # Cuvintele zilei + repetare spațiată
    pg.click(f'{S} .lang-targets button:has-text("🇬🇧")'); tab(pg,'Cuvintele zilei')
    check('Azi: 5 cuvinte' in pg.inner_text(f'{S} .lang-stage'),'words of the day: 5 new words planned')
    for _ in range(5): pg.click(f'{S} .lang-stage button.primary'); pg.wait_for_timeout(50)
    for k in range(5):
        brute(pg,f'{S} .lang-option',lambda: pg.locator(f'{S} .lang-option.right').count()>0)
        if k<4: pg.click(f'{S} .lang-stage button.primary'); pg.wait_for_timeout(60)
    d=pg.evaluate("JSON.parse(localStorage['garden_langs_'+localStorage.garden_active])")
    srs={k:v for k,v in d.get('srs',{}).items() if k.startswith('en:')}
    tomorrow=(datetime.date.today()+datetime.timedelta(days=1)).isoformat()
    check(len(srs)==5 and all(v['due']>=tomorrow for v in srs.values()),'after the quiz, each word is scheduled for review (spaced repetition)')
    check('terminat cuvintele de azi' in pg.inner_text(S),'daily session ends with a “come back tomorrow” message')
    past=(datetime.date.today()-datetime.timedelta(days=1)).isoformat()
    pg.evaluate(f"(()=>{{const k='garden_langs_'+localStorage.garden_active,d=JSON.parse(localStorage[k]);Object.keys(d.srs).slice(0,2).forEach(x=>d.srs[x].due='{past}');delete d.dailyDone;localStorage[k]=JSON.stringify(d)}})()")
    tab(pg,'Ascultă'); tab(pg,'Cuvintele zilei')
    check('2 de repetat' in pg.inner_text(f'{S} .lang-stage'),'words that are due come back for review the next time')
    # Recompense și raport
    pg.evaluate("for(let i=0;i<10;i++)document.dispatchEvent(new CustomEvent('garden:win',{detail:{game:'lang-listen'}}))")
    check('polyglot' in pg.evaluate("gardenRewards.read().earned||[]"),'“Little polyglot” badge after 10 language successes')
    pg.click('.garden-nav button[data-go=activities]'); pg.click('#extras button:has-text("⚙")')
    q=pg.inner_text('.modal-layer label'); a,b=map(int,re.findall(r'(\d+) × (\d+)',q)[0]); pg.fill('#adultAnswer',str(a*b)); pg.click('.modal-layer button >> nth=0'); pg.wait_for_timeout(150)
    check('Limbi străine' in pg.inner_text('.modal-layer .report-table'),'parent report has a Foreign languages row')
    pg.keyboard.press('Escape'); pg.evaluate("document.querySelectorAll('.modal-layer').forEach(x=>x.remove())")
    # Interfață în alte limbi
    for lg,title in [('hu','Idegen nyelvek'),('uk','Іноземні мови'),('en','Foreign languages')]:
        pg.select_option('#lang',lg); pg.click('.garden-nav button[data-go=languages]'); pg.wait_for_timeout(120)
        check(title in pg.inner_text(f'{S} h2'),f'{lg}: screen translated')
    check(not errs,f'no page errors {errs[:3]}')
    br.close()
print('\nFAILURES:',len(fails)); [print(' -',f) for f in fails]
sys.exit(1 if fails else 0)
