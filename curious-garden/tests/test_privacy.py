"""Grădina Curioasă — mențiunea „Datele rămân pe acest dispozitiv” și formularul de feedback la îndemână."""
import os,re,datetime
from playwright.sync_api import sync_playwright
URL=os.environ.get('GARDEN_URL','http://localhost:8000/curious-garden/')
fails=[]
def check(c,msg):
    print(('OK   ' if c else 'FAIL ')+msg)
    if not c: fails.append(msg)
with sync_playwright() as p:
    br=p.chromium.launch(); errs=[]
    pg=br.new_page(viewport={'width':390,'height':844}); pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(URL); pg.wait_for_timeout(300)
    # Ecranul de configurare
    note=pg.locator('#setup .privacy-note')
    check(note.is_visible() and 'Datele rămân pe acest dispozitiv' in note.inner_text(),'the setup screen clearly says the data stays on this device')
    check(note.bounding_box()['y']<pg.locator('#dob').bounding_box()['y'],'the notice appears before the birth date field')
    check(pg.get_attribute('#setup .privacy-fb-inline','href')=='feedback.html?lang=ro','the feedback form is linked from the setup screen')
    pg.click('#setup .privacy-more'); pg.wait_for_timeout(100)
    check(pg.locator('.privacy-dialog[open] li').count()==4,'details explain what is saved, where, what is sent and how to back up')
    check('localStorage' in pg.inner_text('.privacy-dialog') and 'Exportă' in pg.inner_text('.privacy-dialog'),'details name the browser storage and the export option')
    pg.keyboard.press('Escape'); check(pg.locator('.privacy-dialog[open]').count()==0,'Escape closes the details')
    # În joc: bara e vizibilă pe toate ecranele
    d=datetime.date.today(); pg.fill('#dob',f'{d.year-7}-02-02'); pg.fill('#nickname','Ana'); pg.click('#start'); pg.wait_for_timeout(400)
    pg.evaluate("document.querySelectorAll('.bia-bubble').forEach(e=>e.remove())")
    ok=True
    for v in ['home','adventures','learning','discover','languages','worlds','activities','collection','versus','studio','birthday','drawing','music']:
        pg.evaluate(f"gardenGo('{v}')"); pg.wait_for_timeout(40)
        ok=ok and pg.locator('.privacy-bar .privacy-chip').first.is_visible() and pg.locator('.privacy-bar .privacy-fb-chip').is_visible()
    check(ok,'the privacy chip and the feedback button are visible on every screen')
    check(pg.get_attribute('.privacy-fb-chip','href')=='feedback.html?lang=ro','feedback button opens the Romanian form')
    pg.select_option('#lang','en'); pg.wait_for_timeout(150)
    check('Data stays on this device' in pg.inner_text('.privacy-bar') and pg.get_attribute('.privacy-fb-chip','href')=='feedback.html?lang=en','English: translated chip, English form')
    pg.select_option('#lang','uk'); pg.wait_for_timeout(150)
    check(pg.get_attribute('.privacy-fb-chip','href')=='feedback.html?lang=en' and pg.inner_text('.privacy-bar .privacy-chip >> nth=0').strip()!='🔒 Data stays on this device','Ukrainian: translated chip, English form (the form is RO/EN)')
    pg.select_option('#lang','ro'); pg.wait_for_timeout(150)
    # Ștergerea tuturor datelor: doar după întrebarea pentru adulți și confirmare
    pg.click('.privacy-bar .privacy-chip >> nth=0'); pg.click('.privacy-erase'); pg.wait_for_timeout(100)
    q=pg.inner_text('.modal-layer label'); a,b=map(int,re.findall(r'(\d+) × (\d+)',q)[0]); pg.fill('#adultAnswer',str(a*b))
    pg.once('dialog',lambda dlg:dlg.accept()); pg.click('.modal-layer button >> nth=0'); pg.wait_for_timeout(800)
    left=pg.evaluate("Object.keys(localStorage).filter(k=>k.startsWith('garden_')).length")
    check(left==0 and pg.locator('#setup').is_visible(),'an adult can delete all game data from this device (after the adult question and a confirmation)')
    check(not errs,f'no page errors {errs[:3]}')
print('\nFAILURES:',len(fails))
raise SystemExit(1 if fails else 0)
