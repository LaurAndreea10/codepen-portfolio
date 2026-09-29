"""Grădina Curioasă — teste pentru „Scrie-ți părerea” (jocul) și secțiunea Păreri (portofoliu)."""
import os,sys,tempfile,re,json,datetime
from playwright.sync_api import sync_playwright
URL=os.environ.get('GARDEN_URL','http://localhost:8000/curious-garden/')
ROOT=URL.split('curious-garden/')[0]
SHOTS=os.environ.get('GARDEN_SHOTS',os.path.join(tempfile.gettempdir(),'garden-shots'))+'/'
os.makedirs(SHOTS,exist_ok=True)
fails=[]
def check(c,msg):
    print(('OK   ' if c else 'FAIL ')+msg)
    if not c: fails.append(msg)
def open_feedback(pg):
    pg.click('.garden-nav button[data-go=activities]'); pg.click('#extras button:has-text("⚙")')
    q=pg.inner_text('.modal-layer label'); a,b=map(int,re.findall(r'(\d+) × (\d+)',q)[0])
    pg.fill('#adultAnswer',str(a*b)); pg.click('.modal-layer button >> nth=0'); pg.wait_for_timeout(150)
    pg.click('.modal-layer summary:has-text("Scrie-ți părerea")')
def issue(login,labels,payload,pr=False):
    body='<!-- gradina-feedback v1 -->\nPărere nouă.\n\n```json\n'+(payload if isinstance(payload,str) else json.dumps(payload,ensure_ascii=False))+'\n```'
    d={'user':{'login':login},'labels':[{'name':l} for l in labels],'body':body}
    if pr: d['pull_request']={}
    return d
ISSUES=[
 issue('LaurAndreea10',['feedback','approved'],{'text':'Fiica mea a învățat ceasul jucându-se aici.','name':'Ana, mama lui R.','role':'parent','rating':5,'project':'curious-garden','date':'2026-10-02'}),
 issue('LaurAndreea10',['feedback','approved'],{'text':'<img src=x onerror="window.hacked=1"> joc foarte frumos','name':'<b>Test</b>','role':'teacher','rating':4,'project':'curious-garden','date':'2026-10-01'}),
 issue('someone-else',['feedback','approved'],{'text':'Nu ar trebui să apară, nu e creat de Worker.','role':'parent','rating':5}),
 issue('LaurAndreea10',['feedback','pending'],{'text':'Încă nemoderată, nu trebuie să apară.','role':'parent','rating':3}),
 issue('LaurAndreea10',['feedback','approved'],{'text':'PR, nu Issue'},pr=True),
 issue('LaurAndreea10',['feedback','approved'],'{not json'),
]
with sync_playwright() as p:
    br=p.chromium.launch(); errs=[]
    # --- Formularul din joc, fără Worker configurat
    pg=br.new_page(viewport={'width':390,'height':844}); pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(URL); d=datetime.date.today(); pg.fill('#dob',f'{d.year-6}-02-02'); pg.click('#start'); pg.wait_for_timeout(300)
    open_feedback(pg)
    check(pg.locator('.feedback-form button.primary').is_disabled() and 'în curând' in pg.inner_text('.fb-status'),'without a Worker address the form says it will be switched on soon')
    pg.close()
    # --- Formularul din joc, cu Worker simulat
    pg=br.new_page(viewport={'width':390,'height':844}); pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.add_init_script("window.GARDEN_FEEDBACK_ENDPOINT='https://feedback.test/'")
    sent=[]
    def handle(route):
        sent.append(json.loads(route.request.post_data)); route.fulfill(status=200,content_type='application/json',headers={'Access-Control-Allow-Origin':'*'},body='{"ok":true}')
    pg.route('https://feedback.test/**',handle)
    pg.goto(URL); pg.fill('#dob',f'{d.year-6}-02-02'); pg.click('#start'); pg.wait_for_timeout(300)
    open_feedback(pg)
    check(pg.locator('.feedback-section').count()==1,'feedback form sits in the parents’ area (after the adult gate)')
    send=pg.locator('.feedback-form button.primary')
    pg.fill('#fbText','bun'); send.click(); check('10 caractere' in pg.inner_text('.fb-status'),'too-short opinion is caught')
    pg.fill('#fbText','Scrieți-mi la ana@example.com vă rog'); send.click(); check('linkuri' in pg.inner_text('.fb-status'),'contact details are refused before sending')
    pg.fill('#fbText','Copilul meu adoră labirintul cu unicornul!'); send.click(); check('acordul' in pg.inner_text('.fb-status'),'publication consent is required')
    check(len(sent)==0,'nothing is sent while the form is invalid')
    pg.fill('#fbName','Mihai, tata lui D.'); pg.select_option('#fbRole','parent'); pg.locator('.fb-stars button').nth(3).click(); pg.check('#fbConsent')
    pg.screenshot(path=SHOTS+'f-form.png',full_page=False)
    send.click(); pg.wait_for_timeout(300)
    check(len(sent)==1,'a valid opinion is sent once')
    if sent:
        s=sent[0]; check(s['text'].startswith('Copilul meu') and s['name']=='Mihai, tata lui D.' and s['role']=='parent' and s['rating']==4 and s['lang']=='ro' and s['consent'] is True and s['website']=='' and s['project']=='curious-garden','sent fields are correct (text, signature, role, 4 stars, language, consent)')
        check(set(s)=={'text','name','role','rating','lang','project','consent','elapsed','website'},'no extra personal data is sent')
    check('Mulțumesc' in pg.inner_text('.fb-status') and pg.input_value('#fbText')=='','thank-you message and the form resets')
    pg.close()
    # --- Portofoliu RO și EN cu Issue-uri simulate
    for page,expect_link in [('portfolio.html','curious-garden/'),('en/','../curious-garden/')]:
        pg=br.new_page(viewport={'width':390,'height':844}); pg.on('pageerror',lambda e:errs.append(f'{page}: {e}'))
        pg.route(re.compile(r'https://api\.github\.com/repos/LaurAndreea10/codepen-portfolio/issues\?.*'),lambda r:r.fulfill(status=200,content_type='application/json',headers={'Access-Control-Allow-Origin':'*'},body=json.dumps(ISSUES)))
        pg.goto(ROOT+page); pg.wait_for_timeout(800)
        cards=pg.locator('#testimonials .testimonial')
        check(pg.locator('#testimonials').is_visible() and cards.count()==2,f'{page}: shows only the 2 approved opinions created through the Worker')
        check(pg.evaluate('window.hacked===undefined') and pg.locator('#testimonials img, #testimonials b').count()==0,f'{page}: opinion text is shown as text, never as HTML')
        check(pg.get_attribute('#testimonials .testimonial a','href')==expect_link,f'{page}: links to the game')
        check(pg.locator('#testimonials .stars').first.get_attribute('aria-label') in ('5 din 5 stele','5 of 5 stars'),f'{page}: stars have an accessible label')
        pg.locator('#testimonials').scroll_into_view_if_needed(); pg.screenshot(path=SHOTS+f'f-portfolio-{page.strip("/").replace(".html","")}.png')
        pg.close()
    pg=br.new_page(); pg.route(re.compile(r'https://api\.github\.com/.*'),lambda r:r.fulfill(status=200,content_type='application/json',headers={'Access-Control-Allow-Origin':'*'},body='[]'))
    pg.goto(ROOT+'portfolio.html'); pg.wait_for_timeout(600); check(pg.locator('#testimonials').is_hidden(),'with no approved opinions the section stays hidden (no empty box)')
    pg.close()
    check(not errs,f'no page errors {errs[:3]}')
    br.close()
print('\nFAILURES:',len(fails)); [print(' -',f) for f in fails]
sys.exit(1 if fails else 0)
