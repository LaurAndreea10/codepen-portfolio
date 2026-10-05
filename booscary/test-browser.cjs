const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
const browser=await chromium.launch({headless:true,...(process.env.BOOSCARY_BROWSER?{executablePath:process.env.BOOSCARY_BROWSER}:{})});
const page=await browser.newPage({viewport:{width:360,height:800},hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('file://'+path.resolve(__dirname,'index.html'));
await page.locator('[data-tool="paint"]').click();await page.locator('#pumpkin-stage svg').tap({position:{x:145,y:135}});assert.equal(await page.evaluate(()=>pumpkin.paint.length),1);await page.click('#reset-pumpkin');await page.locator('[data-tool="carve"]').click();
assert.deepEqual(await page.evaluate(()=>runTests()),{passed:314,total:314});
for(const mode of ['classic','marathon','daily','survival','duel','free']){
await page.selectOption('#festival-mode',mode);await page.click('#festival-start');
const count=mode==='marathon'?30:mode==='duel'?20:['survival','free'].includes(mode)?18:15;
for(let i=0;i<count;i++){const a=await page.evaluate(()=>{const n=currentF();return n%15===0?'BooScary':n%3===0?'Boo':n%5===0?'Scary':'number'});await page.locator(`[data-f="${a}"]`).click()}
assert.equal(await page.evaluate(()=>round.score.reduce((a,b)=>a+b,0)),count);
assert.equal(await page.evaluate(()=>round.done),!['survival','free'].includes(mode));
}
await page.selectOption('#festival-mode','survival');await page.click('#festival-start');for(let i=0;i<3;i++)await page.locator('[data-f="Scary"]').click();assert.equal(await page.evaluate(()=>round.lives),0);
await page.selectOption('#mission','lantern');for(const part of ['left','right','nose','mouth'])await page.locator(`[data-part="${part}"]`).tap();await page.click('#light');assert.equal(await page.evaluate(()=>missionComplete('lantern')),true);
await page.locator('[data-tool="paint"]').tap();for(let i=0;i<5;i++)await page.locator('[data-part="left"]').tap();assert.equal(await page.evaluate(()=>missionComplete('artist')),true);
await page.locator('[data-tool="sticker"]').click();for(let i=0;i<3;i++)await page.locator('[data-part="right"]').tap();assert.equal(await page.evaluate(()=>missionComplete('party')),true);
await page.click('#undo');assert.equal(await page.evaluate(()=>pumpkin.stickers.length),2);
await page.selectOption('#face','cat');await page.selectOption('#scene','castle');await page.click('#paint-all');await page.click('#save-pumpkin');await page.reload();assert.equal(await page.evaluate(()=>gallery.length),1);await page.locator('#pumpkin-gallery button').first().click();assert.equal(await page.evaluate(()=>pumpkin.scene),'castle');
await page.click('#lang');assert.equal(await page.locator('html').getAttribute('lang'),'en');assert.match(await page.locator('#workshop-title').innerText(),/Workshop/);
await page.click('#theme');await page.click('#contrast');assert.equal(await page.evaluate(()=>document.body.classList.contains('contrast')),true);
await page.click('#sound');assert.equal(await page.locator('#sound').getAttribute('aria-pressed'),'true');await page.click('#light');await page.click('#sound');
await page.click('#festival-start');await page.locator('[data-f="number"]').press('1');assert.equal(await page.evaluate(()=>round.step),1);await page.click('#festival-focus');assert.equal(await page.locator('#festival-focus').getAttribute('aria-pressed'),'true');await page.click('#festival-focus');
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
assert.equal(await page.evaluate(()=>normalizePumpkin({parts:null})),null);
assert.equal(await page.evaluate(()=>JSON.stringify(dailySequence(123))===JSON.stringify(dailySequence(123))),true);
const downloadPromise=page.waitForEvent('download');await page.click('#export-pumpkin');const download=await downloadPromise;assert.equal(download.suggestedFilename(),'booscary-pumpkin.svg');
await page.locator('#workshop').screenshot({path:path.resolve(__dirname,'preview.png')});
await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:1280,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
assert.deepEqual(errors,[]);await browser.close();console.log('PASS: 314 logic checks; all 6 modes; lives; carving; painting; decorations; lighting; missions; undo; gallery reload; RO/EN; themes; audio toggle; SVG export; 360/1280px; reduced motion; no JS errors.');
})().catch(e=>{console.error(e);process.exit(1)});
