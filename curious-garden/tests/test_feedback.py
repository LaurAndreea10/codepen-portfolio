"""Grădina Curioasă — teste pentru păreri: intrarea din zona pentru părinți, pagina feedback.html (FormSubmit)
și afișarea în portofoliu a părerilor aprobate din approved-feedback.json."""
import os,sys,tempfile,re,json,datetime
from playwright.sync_api import sync_playwright
URL=os.environ.get('GARDEN_URL','http://localhost:8000/curious-garden/')
ROOT=URL.split('curious-garden/')[0]
SHOTS=os.environ.get('GARDEN_SHOTS',os.path.join(tempfile.gettempdir(),'garden-shots'))+'/'
os.makedirs(SHOTS,exist_ok=True)
FORMSUBMIT=re.compile(r'https://formsubmit\.co/ajax/.*')
fails=[]
def check(c,msg):
    print(('OK   ' if c else 'FAIL ')+msg)
    if not c: fails.append(msg)
def open_settings(pg):
    pg.click('.garden-nav button[data-go=activities]'); pg.click('#extras button:has-text("⚙")')
    q=pg.inner_text('.modal-layer label'); a,b=map(int,re.findall(r'(\d+) × (\d+)',q)[0])
    pg.fill('#adultAnswer',str(a*b)); pg.click('.modal-layer button >> nth=0'); pg.wait_for_timeout(150)
with sync_playwright() as p:
    br=p.chromium.launch(); errs=[]
    # --- Zona pentru părinți din joc
    pg=br.new_page(viewport={'width':390,'height':844}); pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(URL); d=datetime.date.today(); pg.fill('#dob',f'{d.year-6}-02-02'); pg.click('#start'); pg.wait_for_timeout(300)
    open_settings(pg); pg.click('.modal-layer summary:has-text("Scrie-ți părerea")')
    check(pg.get_attribute('.feedback-link','href')=='feedback.html?lang=ro','parents’ area (after the adult gate) opens the feedback page in Romanian')
    pg.keyboard.press('Escape'); pg.evaluate("document.querySelectorAll('.modal-layer').forEach(x=>x.remove())")
    pg.select_option('#lang','hu'); pg.wait_for_timeout(150); open_settings(pg); pg.click('.modal-layer summary:has-text("Írd meg")')
    check(pg.get_attribute('.feedback-link','href')=='feedback.html?lang=en','Hungarian/Ukrainian players get the English form (the page is RO/EN)')
    pg.close()
    # --- Pagina feedback.html
    pg=br.new_page(viewport={'width':390,'height':844}); pg.on('pageerror',lambda e:errs.append(str(e)))
    sent=[]; reply={'status':200,'body':'{"success":"true"}'}
    def handle(route):
        sent.append(route.request.post_data or ''); route.fulfill(status=reply['status'],content_type='application/json',headers={'Access-Control-Allow-Origin':'*'},body=reply['body'])
    pg.route(FORMSUBMIT,handle)
    pg.goto(URL+'feedback.html?lang=en'); pg.wait_for_timeout(200)
    check(pg.inner_text('#title')=='Share your feedback','?lang=en opens the page in English')
    pg.select_option('#language','ro'); pg.wait_for_timeout(80)
    pg.fill('#opinion','scurt'); pg.click('#send'); pg.wait_for_timeout(200); check(len(sent)==0,'too-short message is not sent')
    pg.fill('#opinion','Copilul meu adoră labirintul cu unicornul!'); pg.evaluate("document.getElementById('website').value='spam'"); pg.click('#send'); pg.wait_for_timeout(200)
    check(len(sent)==0,'honeypot: bots are not sent')
    pg.evaluate("document.getElementById('website').value=''"); pg.fill('#name','Mihai'); pg.check('#publish'); pg.click('#send'); pg.wait_for_timeout(400)
    body=sent[0] if sent else ''
    check(len(sent)==1 and 'Copilul meu adoră labirintul' in body and 'YES / DA' in body and 'Mihai' in body,'valid message is sent once with text, pseudonym and publication consent')
    check('acceptată' in pg.inner_text('#status') and pg.input_value('#opinion')=='','success message and the form resets')
    pg.screenshot(path=SHOTS+'f-feedback-page.png',full_page=True)
    reply.update(status=500,body='{}'); pg.fill('#opinion','Încă un mesaj de test pentru eroare.'); pg.click('#send'); pg.wait_for_timeout(400)
    check('Nu am putut' in pg.inner_text('#status') and not pg.is_disabled('#send'),'a delivery error is shown and the button works again')
    reply.update(status=200,body='{"success":"false"}'); pg.click('#send'); pg.wait_for_timeout(400)
    check('Nu am putut' in pg.inner_text('#status'),'a rejection from FormSubmit is not reported as success')
    reply.update(status=200,body='{"success":"false","message":"This form needs Activation. We\'ve sent you an email containing an \'Activate Form\' link."}'); pg.click('#send'); pg.wait_for_timeout(400)
    check('nu este încă activat' in pg.inner_text('#status'),'a not-yet-activated form says so clearly instead of a generic error')
    check(pg.is_visible('#classicSend'),'after a failure, a “send via the FormSubmit page” button appears')
    posted=[]
    pg.route('https://formsubmit.co/plugaru.laura10@gmail.com',lambda r:(posted.append(r.request.post_data or ''),r.fulfill(status=200,content_type='text/html',body='<p>FormSubmit page</p>')))
    pg.fill('#opinion','Mesaj trimis prin formularul clasic.'); pg.click('#classicSend'); pg.wait_for_timeout(600)
    check(len(posted)==1 and 'formularul+clasic' in posted[0].replace('%20','+') and '_next=' in posted[0],'classic fallback posts to FormSubmit with the message and a return link')
    pg.goto(URL+'feedback.html?sent=1'); pg.wait_for_timeout(150)
    check('Mulțumesc' in pg.inner_text('#status'),'returning from FormSubmit shows a thank-you message')
    pg.close()
    # --- Portofoliu RO și EN
    items={'items':[{'name':'Ana','quote':'Fiica mea a învățat ceasul jucându-se aici.','approved':True},{'name':'<b>Test</b>','quote':'<img src=x onerror="window.hacked=1"> joc frumos','approved':True},{'name':'Nepublicat','quote':'Acest mesaj nu are acord.','approved':False}]}
    for page,sel in [('portfolio.html','#curious-garden-opinions'),('en/','#garden-feedback')]:
        pg=br.new_page(viewport={'width':390,'height':844}); pg.on('pageerror',lambda e:errs.append(f'{page}: {e}'))
        pg.route(re.compile(r'.*/approved-feedback\.json.*'),lambda r:r.fulfill(status=200,content_type='application/json',body=json.dumps(items)))
        pg.goto(ROOT+page); pg.wait_for_timeout(700)
        cards=pg.locator(f'{sel} [data-feedback-list] figure')
        check(cards.count()==2 and pg.locator(f'{sel} [data-feedback-empty]').is_hidden(),f'{page}: shows only the 2 approved opinions')
        check(pg.evaluate('window.hacked===undefined') and pg.locator(f'{sel} img, {sel} b').count()==0,f'{page}: opinions are shown as text, never as HTML')
        check(pg.locator(f'{sel} a[href$="feedback.html"]').count()==1,f'{page}: has a “share your feedback” link')
        pg.close()
    pg=br.new_page(); pg.route(re.compile(r'.*/approved-feedback\.json.*'),lambda r:r.fulfill(status=200,content_type='application/json',body='{"items":[]}'))
    pg.goto(ROOT+'portfolio.html'); pg.wait_for_timeout(500)
    check(pg.locator('#curious-garden-opinions [data-feedback-empty]').is_visible() and pg.locator('#curious-garden-opinions figure').count()==0,'with no approved opinions the honest empty message is shown')
    pg.close()
    check(not errs,f'no page errors {errs[:3]}')
    br.close()
print('\nFAILURES:',len(fails)); [print(' -',f) for f in fails]
sys.exit(1 if fails else 0)
