const {chromium}=require('playwright');const assert=require('node:assert/strict');const path=require('node:path');
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.BOOSCARY_BROWSER?{executablePath:process.env.BOOSCARY_BROWSER}:{}),...(process.env.BOOSCARY_ARGS?{args:JSON.parse(process.env.BOOSCARY_ARGS)}:{})});
const page=await(await browser.newContext({viewport:{width:390,height:844},hasTouch:true})).newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(process.env.BOOSCARY_URL||'file://'+path.resolve(__dirname,'index.html'));
assert.match(await page.locator('header .badge').innerText(),/4\.1\.0/);
assert.match(await page.locator('#count-chip').innerText(),/1$/);
const gateOpen=()=>page.evaluate(()=>$('count-gate').open);
const visible=id=>page.evaluate(i=>$(i).classList.contains('activity-visible'),id);
// Entering an activity requires continuing the count.
await page.click('[data-activity="workshop"]');assert.equal(await gateOpen(),true);assert.equal(await visible('workshop'),false);
assert.match(await page.locator('#gate-intro').innerText(),/3/);
await page.click('#gate-answers [data-gate="Boo"]');assert.match(await page.locator('#gate-status').innerText(),/1/);assert.equal(await page.locator('#gate-number').innerText(),'1');
await page.click('#gate-answers [data-gate="number"]');await page.click('#gate-answers [data-gate="number"]');assert.equal(await gateOpen(),true);
await page.click('#gate-answers [data-gate="Boo"]');assert.equal(await gateOpen(),false);assert.equal(await visible('workshop'),true);
assert.match(await page.locator('#count-chip-bar').innerText(),/4$/);
// The count continues across activities and reloads: 4, Scary, Boo.
await page.reload();assert.match(await page.locator('#count-chip').innerText(),/4$/);
await page.evaluate(()=>openWorld('pieces'));assert.equal(await gateOpen(),true);
await page.keyboard.press('1');await page.keyboard.press('3');await page.keyboard.press('2');assert.equal(await gateOpen(),false);assert.equal(await visible('world-play'),true);
// Cancel keeps you out; counting activities open directly.
await page.click('#exit-activity');await page.evaluate(()=>openActivity('memory'));await page.click('#gate-close');assert.equal(await gateOpen(),false);assert.equal(await visible('mini-games'),false);
await page.evaluate(()=>openActivity('festival'));assert.equal(await gateOpen(),false);assert.equal(await visible('festival'),true);
// Free practice from the chip, all the way through 15 → BooScary.
await page.click('#count-chip-bar');for(const n of [7,8]){await page.click('#gate-answers [data-gate="number"]')}
for(const a of ['Boo','Scary','number','Boo','number','number','BooScary']){await page.click(`#gate-answers [data-gate="${a}"]`)}
assert.equal(await gateOpen(),true);assert.equal(await page.locator('#gate-number').innerText(),'16');
const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('booscary-count-v41')));assert.equal(saved.next,16);assert.equal(saved.gates,2);
await page.click('#gate-close');await page.click('#exit-activity');await page.click('#lang');assert.match(await page.locator('#count-chip').innerText(),/The count/);
for(const w of [360,1280]){await page.setViewportSize({width:w,height:800});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)}
assert.deepEqual(errors,[]);await browser.close();console.log('PASS v4.1: gate on activities, explanations on wrong answers, shared count persists, counting activities ungated, free practice, RO/EN, 360/390/1280px, no JS errors.');
})().catch(e=>{console.error(e);process.exit(1)});
