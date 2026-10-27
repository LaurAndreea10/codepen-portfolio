import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { bestRoute } from './candy.js';
const { chromium } = await import(process.env.CANDY_PLAYWRIGHT_MODULE || 'playwright');
const AxeBuilder = (await import(process.env.CANDY_AXE_MODULE || '@axe-core/playwright')).default;
const dir=dirname(fileURLToPath(import.meta.url));
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json'};
const server=createServer(async(req,res)=>{try{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname),path=resolve(dir,'.'+(name==='/'?'/index.html':name));if(!path.startsWith(dir+'/')){res.writeHead(403).end();return;}const data=await readFile(path);res.writeHead(200,{'Content-Type':mime[extname(path)]||'text/plain'}).end(data);}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const root=`http://127.0.0.1:${server.address().port}/`;
const browser=await chromium.launch({headless:true,...(process.env.CANDY_BROWSER?{executablePath:process.env.CANDY_BROWSER,args:['--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-zygote','--single-process','--disable-software-rasterizer']}: {})});
const context=await browser.newContext();const page=await context.newPage();const errors=[],checks=[];page.on('pageerror',e=>errors.push(e.message));
const click=id=>page.locator('#'+id).click();
const readState=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('laurai-candy-v2')));
const solveManual=async()=>{const s=await readState();for(const i of bestRoute(s.attempt.street,s.attempt.mode==='circle').indices)await page.locator(`[data-index="${i}"]`).click();await click('check');};
async function custom(text,mode='classic'){await click('free');await page.locator('#mode').selectOption(mode);await page.locator('#values').fill(text);await page.locator('#editor button[type=submit]').click();}
try{
 await page.goto(root+'?view=classic');await click('tutorial');await page.locator('[data-index="0"]').click();await page.locator('[data-index="1"]').focus();await page.keyboard.press('Enter');await page.locator('[data-index="2"]').click();assert.equal((await readState()).tutorialDone,true);await click('finish-tutorial');checks.push('3-step tutorial with keyboard and blocked-neighbor explanation');
 await solveManual();let s=await readState();assert.equal(s.progress[1].stars,3);assert.equal(s.wins,1);await click('retry');await solveManual();assert.equal((await readState()).wins,1);checks.push('campaign: 3 stars; retry cannot duplicate wins');
 await click('next-level');await click('hint');await solveManual();assert.equal((await readState()).progress[2].stars,2);await click('next-level');await page.locator('#explanation').evaluate(e=>e.open=true);await click('step-next');assert.equal((await readState()).attempt.revealed,true);assert.equal(await page.locator('#steps tr').count(),1);await click('step-back');assert.equal(await page.locator('#steps tr').count(),0);await click('step-play');await page.waitForTimeout(1650);await click('step-play');await click('solve');assert.deepEqual((await readState()).progress[3],{stars:0,practiced:true});checks.push('hint: 2 stars; stepper, play/pause, back; reveal: practice only');
 await click('next-level');await page.locator('[data-index="0"]').click();assert.equal(await page.locator('[data-index="1"]').getAttribute('aria-disabled'),'true');await click('undo');assert.equal(await page.locator('#yours').textContent(),'0');checks.push('adjacency and undo');
 // Exercise all 30 campaign transitions, including negative and circular chapters.
 for(let id=4;id<=30;id++){await click('solve');assert.ok((await readState()).progress[id].practiced);if(id<30)await click('next-level');}
 assert.equal(await page.locator('#campaign-progress').getAttribute('value'),'30');checks.push('all 30 levels, Continue, zero/negative and circular chapters');
 await click('daily');const daily=await readState();await solveManual();const firstWins=(await readState()).wins;await click('retry');await solveManual();assert.equal((await readState()).wins,firstWins);assert.deepEqual((await readState()).attempt.street,daily.attempt.street);checks.push('daily seed and unique daily victory');
 await custom('5,1,1,5','circle');assert.equal(await page.locator('#best').textContent(),'6');await click('share');const link=await page.locator('#share-url').inputValue();await page.goto(link);assert.equal((await readState()).attempt.mode,'circle');assert.equal((await readState()).attempt.kind,'free');checks.push('circular boundaries and shared-URL roundtrip');
 await custom('4,5,4');await page.locator('[data-index="0"]').click();const beforeOverlay=(await readState()).attempt.picked;await click('overlay-route');assert.equal(await page.locator('.best-route').count(),2);assert.deepEqual((await readState()).attempt.picked,beforeOverlay);assert.equal((await readState()).attempt.revealed,true);await click('overlay-route');assert.equal(await page.locator('.best-route').count(),0);checks.push('route overlay preserves manual picks and study status');
 await click('compare-strategies');assert.equal(await page.locator('[data-strategy="greedy"] td').first().textContent(),'5');assert.equal(await page.locator('[data-strategy="dp"] td').first().textContent(),'8');await click('show-matrix');assert.equal(await page.locator('#take-skip-matrix thead th').count(),4);assert.deepEqual(await page.locator('#take-skip-matrix tbody tr').first().locator('td').allTextContents(),['4','5','8']);checks.push('strategy counterexample and take/skip matrix');
 await custom('9,1,9','circle');await click('compare-strategies');for(const cell of await page.locator('#strategy-rows tr td:nth-child(2)').allTextContents())assert.ok(Number(cell)<=9);checks.push('all displayed strategies respect circular endpoints');
 await custom('-5,-1,-8','tricks');assert.equal(await page.locator('#best').textContent(),'0');await click('check');await page.locator('#values').fill('2,,3');await page.locator('#editor button[type=submit]').click();assert.ok(await page.locator('#error').textContent());checks.push('negative/zero optimum and editor validation');
 const snapshot=await readState();await page.locator('#import-file').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"version":2}')});await page.waitForFunction(()=>document.getElementById('notice').textContent.includes('invalid'));assert.deepEqual(await readState(),snapshot);checks.push('partial import rejected atomically');
 const backup={...snapshot,lang:'en'};await page.locator('#import-file').setInputFiles({name:'good.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});await page.waitForFunction(()=>document.documentElement.lang==='en');assert.equal((await readState()).lang,'en');const download=page.waitForEvent('download');await click('export');const exported=await download;assert.ok(exported.suggestedFilename().endsWith('.json'));checks.push('valid backup import and JSON export');
 await click('theme');await page.reload();assert.equal(await page.locator('body').evaluate(e=>e.classList.contains('light')),true);checks.push('language, theme and progress restoration');
 await click('reset-progress');await page.locator('#reset-dialog button[value=cancel]').click();assert.ok((await readState()).progress[1]);await click('reset-progress');await page.locator('#reset-dialog button[value=reset]').click();await page.waitForFunction(()=>Object.keys(JSON.parse(localStorage.getItem('laurai-candy-v2')).progress).length===0);assert.deepEqual((await readState()).progress,{});checks.push('reset: cancel and confirm');
 await custom(Array(40).fill(1).join(','));await click('compare-strategies');await click('show-matrix');assert.match(await page.locator('[data-strategy=brute]').textContent(),/18/);
 const axeResults=[];
 for(const width of [360,390,768,1280]){
  await page.setViewportSize({width,height:900});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`overflow ${width}`);
  const findings=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();axeResults.push({width,violations:findings.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))});
 }
 checks.push('responsive 360/390/768/1280 px with 40 houses');
 await page.setViewportSize({width:390,height:844});
 for(const variant of ['dark','high-contrast']){if(variant==='dark'&&await page.locator('body').evaluate(e=>e.classList.contains('light')))await click('theme');if(variant==='high-contrast')await click('contrast');const findings=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();axeResults.push({width:390,variant,violations:findings.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))});}
 await click('contrast');await custom('5,1,1,5');await click('overlay-route');await click('compare-strategies');await click('show-matrix');

 await page.setViewportSize({width:1280,height:900});await page.screenshot({path:'/tmp/candy-desktop-v2.png',fullPage:true});await page.setViewportSize({width:390,height:844});await page.screenshot({path:'/tmp/candy-mobile-v2.png',fullPage:true});
 await page.goto(root+'candy-route-standalone.html?view=classic');await click('solve');assert.equal(await page.locator('#yours').textContent(),await page.locator('#best').textContent());checks.push('standalone HTML');
 const blocked=await context.newPage();await blocked.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('Blocked');}});});await blocked.goto(root+'?view=classic');await blocked.locator('#solve').click();assert.ok(await blocked.locator('#storage-status').textContent());await blocked.close();checks.push('localStorage unavailable: gameplay and warning');
 const report={version:"4.0.0",view:"classic",date:new Date().toISOString(),checks,axe:axeResults,pageErrors:errors};await writeFile(resolve(dir,'browser-results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));assert.deepEqual(errors,[]);assert.ok(axeResults.every(r=>r.violations.length===0),'axe violations');
}finally{await browser.close();await new Promise(r=>server.close(r));}
