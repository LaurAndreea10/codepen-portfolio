// PentArena browser regression: desktop + mobile viewports, touch, two-player multitouch, dialogs, backup, offline and axe.
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const port=8147,origin=`http://127.0.0.1:${port}`,out='audit-artifacts/pentarena';
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'});
let browser;const reports=[];
const serious=v=>v.violations.filter(x=>['critical','serious'].includes(x.impact)).map(x=>({id:x.id,nodes:x.nodes.map(n=>n.target)}));
try{
  for(let i=0;i<50;i++){try{if((await fetch(origin)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
  browser=await chromium.launch();await mkdir(out,{recursive:true});
  for(const [width,height] of [[360,800],[390,844],[844,390],[1440,1000]]){
    const mobile=width<900,context=await browser.newContext({viewport:{width,height},isMobile:mobile,hasTouch:mobile,acceptDownloads:true});
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&!/favicon/.test(m.text()))errors.push(m.text());});
    await page.goto(origin+'/pentarena/');await page.waitForFunction(()=>window.PentArena&&navigator.serviceWorker.controller,null,{timeout:15000});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'no horizontal scroll on menu');
    assert.equal(await page.locator('#cards .card').count(),5);assert.equal(await page.locator('#leagues .league').count(),3);
    assert.equal(await page.locator('[data-l="silver"]').isDisabled(),true,'silver league locked at start');
    const menuAxe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(serious(menuAxe),[],'menu axe');
    await page.screenshot({path:`${out}/${width}x${height}-menu.png`,fullPage:true});
    // every sport starts, runs and pauses
    for(const key of ['basket','football','hockey','volley','billiards']){
      await page.locator(`.play[data-k="${key}"]`).click();await page.waitForFunction(k=>PentArena.game&&PentArena.game.sport.key===k,key);
      assert.equal(await page.locator('#game').isVisible(),true);await page.waitForTimeout(400);
      if(key==="football"){assert.equal(await page.locator("#btnAct").isVisible(),mobile,`kick button only on touch (${width}x${height})`);}
      const box=await page.locator('#cv').boundingBox();assert(box.width>=200);
      if(mobile){await page.touchscreen.tap(box.x+box.width*.3,box.y+box.height*.5);}else{await page.mouse.move(box.x+box.width*.3,box.y+box.height*.5);await page.mouse.click(box.x+box.width*.3,box.y+box.height*.55);}
      await page.waitForTimeout(250);
      if(key==='football')await page.screenshot({path:`${out}/${width}x${height}-${key}.png`});
      await page.locator('#pauseBtn').click();assert.equal(await page.locator('#pauseOv').isVisible(),true);await page.keyboard.press('Escape');assert.equal(await page.locator('#pauseOv').isVisible(),false);
      await page.locator('#exitBtn').click();await page.locator('#menuBtn').click();assert.equal(await page.locator('#menu').isVisible(),true);
    }
    // result screen and rewards persist after reload
    await page.locator('.play[data-k="volley"]').click();await page.evaluate(()=>{const s=PentArena.game.sport;s.score=[7,2];s.over=true;});
    await page.waitForSelector('#resOv:not([hidden])',{timeout:5000});assert((await page.locator('#resTitle').textContent()).length>0);
    const gameAxe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(serious(gameAxe),[],'result axe');
    await page.locator('#rMenu').click();const xp=await page.evaluate(()=>PentArena.store.xp);assert(xp>0);await page.reload();await page.waitForFunction(()=>window.PentArena);assert.equal(await page.evaluate(()=>PentArena.store.xp),xp);
    // two players: multitouch moves both air hockey mallets
    await page.locator('#plSeg button[data-v="2"]').click();await page.locator('.play[data-k="hockey"]').click();await page.waitForTimeout(300);
    assert.equal(await page.evaluate(()=>PentArena.M.two),true);assert.equal(await page.locator('#nmA').textContent(),await page.evaluate(()=>PentArena.store.prefs.lang==='ro'?'J2':'P2'));
    if(mobile){const r=await page.locator('#cv').boundingBox(),cdp=await context.newCDPSession(page),before=await page.evaluate(()=>PentArena.game.sport.m.map(m=>[m.x,m.y]));
      const L={x:r.x+r.width*.2,y:r.y+r.height*.2},R={x:r.x+r.width*.8,y:r.y+r.height*.8};
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...L,id:1},{...R,id:2}]});for(let i=0;i<6;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:L.x,y:L.y+i,id:1},{x:R.x,y:R.y-i,id:2}]});await page.waitForTimeout(60);}
      const after=await page.evaluate(()=>PentArena.game.sport.m.map(m=>[m.x,m.y]));await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      assert(after[0][1]<before[0][1]-20,'P1 mallet followed the left finger');assert(after[1][1]>before[1][1]+20,'P2 mallet followed the right finger');}
    else{await page.keyboard.down('KeyW');await page.keyboard.down('ArrowDown');await page.waitForTimeout(300);await page.keyboard.up('KeyW');await page.keyboard.up('ArrowDown');const m=await page.evaluate(()=>PentArena.game.sport.m.map(x=>x.y));assert(m[0]<290&&m[1]>310,'both players move with their own keys');}
    await page.locator('#exitBtn').click();await page.locator('#menuBtn').click();await page.locator('#plSeg button[data-v="1"]').click();
    // dialogs, shop, settings, language
    await page.evaluate(()=>{PentArena.store.coins=500;});await page.locator('#shopBtn').click();await page.locator('#dlgShop [data-id="lime"]').click();assert.equal(await page.evaluate(()=>PentArena.store.skin),'lime');
    const shopAxe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(serious(shopAxe),[],'shop axe');await page.locator('#dlgShop [data-close]').click();
    await page.locator('#statsBtn').click();assert(await page.locator('#statsBody table').count()>=1);await page.locator('#dlgStats [data-close]').click();
    await page.locator('#helpBtn').click();await page.locator('#dlgHelp [data-close]').click();
    await page.locator('#setBtn').click();await page.locator('#optContrast').check();await page.locator('#optMotion').check();await page.locator('#dlgSet [data-close]').click();
    assert.equal(await page.evaluate(()=>document.body.classList.contains('contrast')),true);
    await page.locator('#langBtn').click();assert.equal(await page.locator('html').getAttribute('lang'),'en');assert((await page.locator('#heroTitle').textContent()).includes('Five events'));
    // backup export + rejected / accepted import
    await page.locator('#backupBtn').click();const dl=page.waitForEvent('download');await page.locator('#exportBackup').click();const d=await dl;assert(d.suggestedFilename().endsWith('.json'));
    const backup=await page.evaluate(()=>PentArena.exportStore());await page.locator('#backupFile').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"progress":{"schema":2}}')});
    await page.waitForFunction(()=>document.getElementById('backupStatus').textContent.length>0);assert.equal(await page.locator('#applyBackup').isEnabled(),false);
    await page.locator('#backupFile').setInputFiles({name:'ok.json',mimeType:'application/json',buffer:Buffer.from(backup)});await page.waitForFunction(()=>!document.getElementById('applyBackup').disabled);await page.locator('#applyBackup').click();
    await page.locator('#dlgBackup [data-close]').click();
    // daily challenge + tournament progression
    await page.locator('#dailyBtn').click();const dk=await page.evaluate(()=>PentArena.dailyFor(PentArena.todayKey()).sport);assert.equal(await page.evaluate(()=>PentArena.game.sport.key),dk);await page.locator('#exitBtn').click();await page.locator('#menuBtn').click();
    await page.locator('#tourBtn').click();for(let i=0;i<5;i++){await page.evaluate(()=>{const s=PentArena.game.sport;s.score=[3,0];s.over=true;});await page.waitForSelector('#resOv:not([hidden])');await page.locator('#rNext').click();}
    assert((await page.locator('#resTitle').textContent()).length>0);assert.equal(await page.evaluate(()=>PentArena.store.tours),1);await page.locator('#fMenu').click();
    // offline
    await context.setOffline(true);await page.reload();await page.waitForFunction(()=>window.PentArena);assert.equal(await page.evaluate(()=>PentArena.store.tours),1);
    await page.locator('.play[data-k="billiards"]').click();assert.equal(await page.evaluate(()=>PentArena.game.sport.key),'billiards');await context.setOffline(false);
    await page.screenshot({path:`${out}/${width}x${height}-pool.png`});
    assert.deepEqual(errors,[]);reports.push({width,height,checks:'menu, 5 sports start/pause/exit, result + persistence, 2P multitouch/keys, locker, stats, settings, RO/EN, backup, daily, tournament, offline, axe'});
    await context.close();}
  await writeFile(`${out}/report.json`,JSON.stringify(reports,null,2));console.log('PASS: PentArena browser regression at four viewports');
}finally{if(browser)await browser.close();server.kill();}
