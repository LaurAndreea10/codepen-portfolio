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
    console.log('VIEWPORT',width,height);const mobile=width<900,context=await browser.newContext({viewport:{width,height},isMobile:mobile,hasTouch:mobile,acceptDownloads:true});
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
      if(key==="football"&&height>width){const r2=await page.locator("#cv").boundingBox();assert(r2.height>r2.width,"football field is vertical in portrait");}
      if(key==="football"){assert.equal(await page.locator("#btnAct").isVisible(),mobile,`kick button only on touch (${width}x${height})`);}
      const box=await page.locator('#cv').boundingBox();assert(box.width>=200);
      if(mobile){await page.touchscreen.tap(box.x+box.width*.3,box.y+box.height*.5);}else{await page.mouse.move(box.x+box.width*.3,box.y+box.height*.5);await page.mouse.click(box.x+box.width*.3,box.y+box.height*.55);}
      await page.waitForTimeout(250);
      if(key==='football')await page.screenshot({path:`${out}/${width}x${height}-${key}.png`});
      await page.locator('#pauseBtn').click();assert.equal(await page.locator('#pauseOv').isVisible(),true);await page.keyboard.press('Escape');assert.equal(await page.locator('#pauseOv').isVisible(),false);
      await page.locator('#exitBtn').click();await page.locator('#menuBtn').click();assert.equal(await page.locator('#menu').isVisible(),true);
    }
    console.log('PASS sports',width);
    // enlarged court, paused guide, focus trap, fullscreen and mute
    await page.locator('.play[data-k="football"]').click();
    const field=await page.locator('#cv').boundingBox();
    const stage=await page.locator('#stage').boundingBox();
    assert(field.x>=stage.x-1&&field.y>=stage.y-1&&field.x+field.width<=stage.x+stage.width+1&&field.y+field.height<=stage.y+stage.height+1,'court fits without cropping');
    assert.equal(await page.locator('#menu').isVisible(),false);
    if(width===844)assert(field.height>=370,'landscape court uses nearly full height');
    await page.locator('#gameHelp').click();assert.equal(await page.evaluate(()=>PentArena.game.paused),true);
    const time=await page.evaluate(()=>PentArena.game.sport.time);await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>PentArena.game.sport.time),time,'guide freezes match');
    await page.locator('#guideClose').focus();await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'guideNext','guide traps focus');
    await page.locator('#guideNext').click();await page.locator('#guideNext').click();await page.locator('#guideNext').click();
    assert.equal(await page.evaluate(()=>PentArena.game.paused),false);assert.equal(await page.evaluate(()=>document.activeElement.id),'cv');
    await page.locator('#soundGame').click();assert.equal(await page.evaluate(()=>PentArena.store.prefs.sound),false);await page.locator('#soundGame').click();
    await page.locator('#fullBtn').click();if(await page.evaluate(()=>!!document.fullscreenElement))await page.locator('#fullBtn').click();
    await page.locator('#exitBtn').click();await page.locator('#menuBtn').click();
    assert.equal(await page.evaluate(()=>document.body.classList.contains('playing')),false);
    console.log('PASS guide/fullscreen',width);
    // theme and practice persist; a practice result cannot change competitive progress
    await page.locator('#setBtn').click();await page.locator('#optTheme').selectOption('light');await page.locator('#optPractice').check();await page.locator('#dlgSet [data-close]').click();
    assert.equal(await page.evaluate(()=>document.body.classList.contains('light')),true);
    const lightAxe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(serious(lightAxe),[],'light menu axe');
    await page.reload();await page.waitForFunction(()=>window.PentArena);assert.equal(await page.evaluate(()=>PentArena.store.prefs.practice),true);
    const before=await page.evaluate(()=>JSON.stringify(PentArena.store));await page.locator('.play[data-k="volley"]').click();await page.evaluate(()=>{PentArena.game.sport.score=[7,0];PentArena.game.sport.over=true;});
    await page.waitForSelector('#resOv:not([hidden])');assert.equal(await page.evaluate(()=>JSON.stringify(PentArena.store)),before);await page.locator('#rMenu').click();
    await page.locator('#setBtn').click();await page.locator('#optPractice').uncheck();await page.locator('#optTheme').selectOption('dark');await page.locator('#dlgSet [data-close]').click();
    console.log('PASS theme/practice',width);
    // result screen and rewards persist after reload
    await page.locator('.play[data-k="volley"]').click();await page.evaluate(()=>{const s=PentArena.game.sport;s.score=[7,2];s.over=true;});
    await page.waitForSelector('#resOv:not([hidden])',{timeout:5000});assert((await page.locator('#resTitle').textContent()).length>0);
    const gameAxe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(serious(gameAxe),[],'result axe');
    await page.locator('#rMenu').click();const xp=await page.evaluate(()=>PentArena.store.xp);assert(xp>0);await page.reload();await page.waitForFunction(()=>window.PentArena);assert.equal(await page.evaluate(()=>PentArena.store.xp),xp);
    // two players: multitouch moves both air hockey mallets
    await page.locator('#plSeg button[data-v="2"]').click();await page.locator('.play[data-k="hockey"]').click();await page.waitForTimeout(300);
    assert.equal(await page.evaluate(()=>PentArena.M.two),true);assert.equal(await page.locator('#nmA').textContent(),await page.evaluate(()=>PentArena.store.prefs.lang==='ro'?'J2':'P2'));
    if(mobile){const r=await page.locator('#cv').boundingBox(),cdp=await context.newCDPSession(page),rot=await page.evaluate(()=>PentArena.rotated);
      if(height>width)assert.equal(rot,true,'portrait phone rotates air hockey');
      const A=rot?{x:r.x+r.width*.35,y:r.y+r.height*.8}:{x:r.x+r.width*.2,y:r.y+r.height*.4},B=rot?{x:r.x+r.width*.65,y:r.y+r.height*.2}:{x:r.x+r.width*.8,y:r.y+r.height*.6};
      const logical=p=>{const u=(p.x-r.x)/r.width,v=(p.y-r.y)/r.height;return rot?{x:960-v*960,y:u*600}:{x:u*960,y:v*600};};
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...A,id:1},{...B,id:2}]});for(let i=0;i<10;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:A.x,y:A.y+i*.2,id:1},{x:B.x,y:B.y-i*.2,id:2}]});await page.waitForTimeout(50);}
      const m=await page.evaluate(()=>PentArena.game.sport.m.map(x=>({x:x.x,y:x.y})));await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      const ea=logical(A),eb=logical(B);assert(Math.hypot(m[0].x-ea.x,m[0].y-ea.y)<45,`P1 mallet follows its finger ${JSON.stringify([m[0],ea])}`);assert(Math.hypot(m[1].x-eb.x,m[1].y-eb.y)<45,`P2 mallet follows its finger ${JSON.stringify([m[1],eb])}`);}
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
    assert.deepEqual(errors,[]);reports.push({width,height,checks:'enlarged court, guide pause/focus, fullscreen, mute, light theme axe, practice persistence/no rewards, menu, 5 sports start/pause/exit, result + persistence, 2P multitouch/keys, locker, stats, settings, RO/EN, backup, daily, tournament, offline, axe'});
    await context.close();}
  await writeFile(`${out}/report.json`,JSON.stringify(reports,null,2));console.log('PASS: PentArena browser regression at four viewports');
}finally{if(browser)await browser.close();server.kill();}

