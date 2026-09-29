"""Grădina Curioasă — teste pentru: Paștele catolic, teme noi, Jocul zilei, tabletă pe orizontală,
pagina de aprobare a părerilor, diplome și părerile din studiul de caz."""
import os,sys,tempfile,re,json,datetime
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
APPROVED={'items':[{'name':'Ioana','quote':'O părere deja publicată.','approved':True}]}
with sync_playwright() as p:
    br=p.chromium.launch(); errs=[]
    pg=br.new_page(viewport={'width':390,'height':844}); pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(URL); start(pg,10)
    # Paște: ortodox pentru RO/UK, catolic pentru HU/EN
    ro=pg.evaluate("eventWindow('easter',2027)[0].toDateString()")
    pg.select_option('#lang','hu'); pg.wait_for_timeout(100)
    hu=pg.evaluate("eventWindow('easter',2027)[0].toDateString()")
    pg.select_option('#lang','ro'); pg.wait_for_timeout(100)
    check('Apr 25 2027' in ro and 'Mar 21 2027' in hu,f'Easter 2027: Orthodox window for RO ({ro}), Catholic for HU ({hu})')
    # Teme noi
    pg.click('.garden-nav button[data-go=languages]'); pg.wait_for_timeout(100)
    chips=pg.locator('#languages .lang-themes button').all_inner_texts()
    check(len(chips)==12 and all(x in chips for x in ['Mâncare','Vremea','Familia','Transport']),f'12 vocabulary themes incl. food, weather, family, transport')
    pg.click('#languages .lang-themes button:has-text("Vremea")'); pg.wait_for_timeout(80)
    check(bool(pg.inner_text('#languages .lang-word').strip()),'new theme plays (weather)')
    # Jocul zilei, pe fiecare grupă de vârstă
    for age in (4,7,10):
        p2=br.new_page(viewport={'width':390,'height':844}); p2.on('pageerror',lambda e:errs.append(str(e)))
        p2.goto(URL); start(p2,age); p2.click('.garden-nav button[data-go=home]'); p2.wait_for_timeout(100)
        card=p2.locator('.daily-card'); v=card.get_attribute('data-daily-view'); m=card.get_attribute('data-daily-mode'); name=p2.inner_text('.daily-card .daily-name')
        p2.click('.daily-card .daily-play'); p2.wait_for_timeout(250)
        at=p2.evaluate("document.getElementById('app').dataset.view")
        ok=at==v
        if v=='activities': ok=ok and p2.inner_text('#gameTitle').strip()!=''
        elif v=='worlds': ok=ok and p2.locator('#grandAdventure .world-grid button[aria-pressed=true]').count()==1
        else: ok=ok and p2.locator(f'[data-view={v}] button[aria-pressed=true]').count()>=1
        check(ok,f'age {age}: Game of the day “{name}” opens {v}/{m}')
        if age==7: p2.screenshot(path=SHOTS+'p-daily.png')
        p2.close()
    pg.close()
    # Tabletă pe orizontală
    tb=br.new_page(viewport={'width':1024,'height':768}); tb.goto(URL); start(tb,6)
    tops={round(b.bounding_box()['y']) for b in tb.locator('.garden-nav button').all()}
    check(len(tops)==1,'tablet landscape: the whole menu fits on one row')
    tb.click('.garden-nav button[data-go=adventures]'); tb.wait_for_timeout(300)
    gh=tb.locator('.arcade-grid').bounding_box()['height']; check(gh<=768*0.57,f'tablet landscape: maze board fits on screen ({gh:.0f}px of 768)')
    tb.screenshot(path=SHOTS+'p-tablet.png'); tb.close()
    # Pagina de aprobare
    ap=br.new_page(viewport={'width':390,'height':844}); ap.on('pageerror',lambda e:errs.append(str(e)))
    ap.route(re.compile(r'.*/approved-feedback\.json.*'),lambda r:r.fulfill(status=200,content_type='application/json',body=json.dumps(APPROVED)))
    ap.goto(URL+'aproba.html')
    ap.fill('#mail','Grădina Curioasă — părere\nname\nMihai\nmessage\nCopilul meu adoră labirintul! Scrieți-mi la mihai@example.com\npublication_consent\nYES / DA')
    ap.click('#parse'); ap.wait_for_timeout(100)
    check(ap.input_value('#name')=='Mihai' and 'labirintul' in ap.input_value('#quote') and '@' not in ap.input_value('#quote'),'approval page reads name and message from the e-mail and strips contact details')
    check(ap.is_visible('#cleaned') and not ap.is_disabled('#build'),'it warns that contact details were removed')
    ap.click('#build'); ap.wait_for_timeout(300)
    full=json.loads(ap.inner_text('#full'))
    check(full['items'][0]['name']=='Mihai' and full['items'][0]['approved'] is True and full['items'][1]['name']=='Ioana','the complete file keeps existing opinions and adds the new one first')
    check('edit/main/curious-garden/approved-feedback.json' in ap.get_attribute('#edit','href'),'link opens the file for editing on GitHub')
    ap.fill('#mail','name: Andrei\nmessage: Un mesaj privat pentru Laura.\npublication_consent: NO / NU'); ap.click('#parse'); ap.wait_for_timeout(80)
    check(ap.is_disabled('#build') and ap.is_visible('#consentWarn'),'without publication consent nothing can be prepared')
    ap.screenshot(path=SHOTS+'p-approve.png',full_page=True); ap.close()
    # Diplome
    dp=br.new_page(viewport={'width':390,'height':844}); dp.on('pageerror',lambda e:errs.append(str(e)))
    dp.goto(URL); start(dp,7)
    dp.evaluate("document.dispatchEvent(new CustomEvent('garden:win',{detail:{game:'count'}}))")
    dp.click('.garden-nav button[data-go=collection]'); dp.click('#collection .learning-tabs button:has-text("Insigne")'); dp.wait_for_timeout(100)
    href=dp.get_attribute('#collection .badge-card.got .diploma-link','href') or ''
    check('diploma.html?' in href and 'name=Ana' in href,'earned badges have a Diploma link with the child’s nickname')
    dp.goto(URL+href); dp.wait_for_timeout(200)
    check(dp.inner_text('#name')=='Ana' and dp.inner_text('#badge')=='Prima descoperire' and dp.inner_text('#title')=='Diplomă','diploma shows the nickname and the badge')
    dp.screenshot(path=SHOTS+'p-diploma.png')
    dp.goto(URL+'diploma.html?lang=en&name=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E&badge=Explorer'); dp.wait_for_timeout(150)
    check(dp.inner_text('#title')=='Certificate' and dp.locator('#name img').count()==0,'English certificate; text from the link is never treated as HTML')
    dp.close()
    # Studiul de caz afișează părerile aprobate
    cs=br.new_page(viewport={'width':390,'height':844}); cs.on('pageerror',lambda e:errs.append(str(e)))
    cs.route(re.compile(r'.*/approved-feedback\.json.*'),lambda r:r.fulfill(status=200,content_type='application/json',body=json.dumps(APPROVED)))
    cs.goto(URL+'case-study.html'); cs.wait_for_timeout(500)
    check(cs.locator('main[data-lang=ro] [data-feedback-list] figure').count()==1,'case study shows approved parent opinions automatically')
    cs.close()
    check(not errs,f'no page errors {errs[:3]}')
    br.close()
print('\nFAILURES:',len(fails)); [print(' -',f) for f in fails]
sys.exit(1 if fails else 0)
