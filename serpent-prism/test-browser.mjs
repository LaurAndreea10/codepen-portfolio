import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const origin='http://127.0.0.1:8139';
const server=spawn('python3',['-m','http.server','8139','--bind','127.0.0.1'],{stdio:'ignore'});
let browser;const reports=[];
try{
for(let i=0;i<50;i++){try{if((await fetch(origin)).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}
browser=await chromium.launch();await mkdir('audit-artifacts/serpent-prism',{recursive:true});
for(const [width,height] of [[360,800],[390,844],[412,915],[844,390],[1440,1000]]){
 const context=await browser.newContext({viewport:{width,height},isMobile:width<900,hasTouch:width<900});const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/serpent-prism/');await page.locator('#start').click();
 assert.equal(await page.evaluate(()=>Serpent.state.guidePhase),1);const head=await page.evaluate(()=>Serpent.state.chains[0].head);await page.waitForTimeout(250);assert.equal(await page.evaluate(()=>Serpent.state.chains[0].head),head);
 await page.locator('#collect').click();assert.equal(await page.evaluate(()=>Serpent.state.guidePhase),2);await page.locator('#fire').click();assert.equal(await page.evaluate(()=>Serpent.state.guidePhase),0);
 await page.locator('#pause').click();assert.equal(await page.evaluate(()=>Serpent.state.state),'paused');await page.locator('#pause').click();
 if(width<900){const r=await page.locator('#arena').boundingBox();const before=await page.evaluate(()=>Serpent.state.snake[0].y);const cdp=await context.newCDPSession(page);const x=r.x+r.width*.5,y=r.y+r.height*.52;await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y+40}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.notEqual(await page.evaluate(()=>Serpent.state.snake[0].y),before)}
 assert.equal(await page.evaluate(()=>Serpent.audioStatus().context),'running');await page.locator('#audio').click();assert.equal(await page.evaluate(()=>Serpent.state.prefs.sound),false);
 for(let n=0;n<30&&(await page.evaluate(()=>Serpent.state.state))==='playing';n++){await page.locator('#collect').click();await page.locator('#fire').click()}
 assert.equal(await page.evaluate(()=>Serpent.state.state),'won');await page.locator('#resultNext').click();assert.equal(await page.evaluate(()=>Serpent.state.level),2);
 for(let n=0;n<30&&(await page.evaluate(()=>Serpent.state.state))==='playing';n++){await page.locator('#collect').click();await page.locator('#fire').click()}assert((await page.evaluate(()=>Serpent.state.maxCombo))>=2);
 await page.locator('#aboutBtn').click();await page.locator('#tutorialNext').click();await page.locator('#tutorial button[data-t="close"]').click();
 await page.locator('#lang').click();assert.equal(await page.locator('html').getAttribute('lang'),'en');await page.locator('#theme').click();
 for(let i=0;i<6;i++){await page.locator('#modes button').nth(i).click();await page.locator('#start').click();assert.equal(await page.evaluate(()=>Serpent.state.state),'playing');await page.locator('#pause').click()}
 await page.locator('#settingsBtn').click();await page.locator('#contrast').check();await page.locator('#motion').check();await page.locator('#settings button[data-t="close"]').click();await page.locator('#focus').click();
 const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();const violations=axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}));assert.deepEqual(violations.filter(v=>['critical','serious'].includes(v.impact)),[]);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);const fire=await page.locator('#fire').boundingBox();assert(fire.width>=44&&fire.height>=44);
 await page.screenshot({path:`audit-artifacts/serpent-prism/${width}x${height}.png`,fullPage:true});assert.deepEqual(errors,[]);reports.push({width,height,errors,violations,checks:'guide, touch, pause, audio context/mute, results, level progression/cascades, six modes, RO/EN, themes, contrast, reduced motion, focus and width'});await context.close();
}
await writeFile('audit-artifacts/serpent-prism/report.json',JSON.stringify(reports,null,2));console.log('PASS: browser regression at five desktop/mobile viewports');
}finally{if(browser)await browser.close();server.kill()}
