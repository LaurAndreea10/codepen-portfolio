import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import { startAuditServer } from './audit-server.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const server = await startAuditServer({ instrumentKygo: true });
const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {}) });
let checks = 0;
const check = (value, message) => { assert.ok(value, message); checks++; };
await mkdir('audit-artifacts/kygo', { recursive: true });
try {
  for (const width of [360, 390, 412, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, isMobile: width < 800, hasTouch: width < 800, timezoneId: 'America/New_York', reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('dialog', d => d.accept());
    const run = code => page.evaluate(code => window.__kygoEval(code), code);
    await page.goto(server.baseURL + '/kygo-world/');
    check(await page.locator('#coach').isVisible(), `${width}: first-run guide`);
    await page.locator('#coachSkip').click();
    await page.reload();
    check(!(await page.locator('#coach').isVisible()), `${width}: guide completion persists`);
    check(await run('Object.keys(I.ro).every(k=>k in I.en)&&Object.keys(I.en).every(k=>k in I.ro)'), 'dictionary parity');
    check(await run('motionOff()'), 'system reduced motion');
    check(await run("(()=>{const prior=mode;mode='garden';tickTime=10;ctx.setTransform(1,0,0,1,0,0);scenery();const first=canvas.toDataURL();tickTime=3000;scenery();const same=first===canvas.toDataURL();mode=prior;return same})()"),'decorative scenery freezes with reduced motion');
    const manifest = await page.evaluate(async () => {
      const m = await (await fetch(document.querySelector('link[rel=manifest]').href)).json();
      return { ...m, assets: await Promise.all(m.icons.map(async i => (await fetch(i.src)).ok)) };
    });
    check(manifest.display === 'standalone' && manifest.assets.every(Boolean), 'manifest and icons');
    await page.locator('#openMap').click();
    check(await page.locator('.map-level').count() === 100, '100 map levels');
    await page.locator('#mapClose').click();
    for (const mode of ['story', 'dash', 'championship', 'endless', 'maze', 'treasure', 'garden', 'duo', 'zen']) {
      await page.locator(`[data-mode=${mode}]`).click();
      await page.locator('#startOverlay').click();
      check(await run('running&&!paused'), `${width}: ${mode} starts`);
      check(await page.locator('#game').evaluate(c => c === document.activeElement), 'Start transfers keyboard focus');
      await page.keyboard.press('p');
      check(await run('paused'), 'keyboard pause works immediately after Start');
      await page.keyboard.press('p');
      if(width<800)await page.locator('#focusExit').click();else await run("paused=true;document.body.classList.remove('game-focus')");
    }
    await run("document.querySelector('[data-mode=story]').click();start();paused=true");
    if(width<800)await page.locator('#focusExit').click();else await run("paused=true;document.body.classList.remove('game-focus')");
    await page.locator('#language').selectOption('en');
    await page.locator('#contrast').click();
    await page.locator('#motion').click();
    await page.locator('#theme').click();
    await page.reload();
    check(await page.locator('html').getAttribute('lang') === 'en', 'language persists');
    check(await page.locator('.art').getAttribute('alt') === 'Kygo jumps across islands with bridges, waterfalls and glowing bones.', 'English alt');
    check(await page.locator('body').evaluate(b => b.classList.contains('contrast') && b.classList.contains('light')), 'theme and high contrast persist');
    check(await page.locator('#motion').getAttribute('aria-pressed') === 'true', 'manual reduced motion persists');
    check(await page.locator('body').evaluate(b => getComputedStyle(b).backgroundColor === 'rgb(0, 0, 0)'), 'high contrast background');
    check(await page.evaluate(async () => (await (await fetch(document.querySelector('link[rel=manifest]').href)).json()).lang === 'en'), 'English manifest');
    await page.locator('details').filter({ has: page.locator('#scan') }).locator('summary').click();
    await page.locator('#scan').check();
    await page.locator('#joystickToggle').check();
    await page.locator('[data-mode=maze]').click();
    await page.locator('#startOverlay').click();
    check(await page.locator('#switchAction').isVisible(), 'scan activation available during play');
    check(await page.locator('.pad:not(#friendPad)').isVisible(), 'scan directions visible');
    check(await page.locator('#joystick').isVisible(), 'joystick available during play');
    const axe=await new AxeBuilder({page}).analyze();check(!axe.violations.some(v=>['serious','critical'].includes(v.impact)),`${width}: gameplay high contrast axe ${JSON.stringify(axe.violations.filter(v=>['serious','critical'].includes(v.impact)).map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})))}`);
    await run('scanIndex=0');
        await page.locator('#switchAction').click();
    check(await run('running'), 'scan activates without stopping game');
    if(width===390)await page.screenshot({path:'audit-artifacts/kygo/mobile-scan-390.png'});
    // Pointer gestures exercise the same handlers used by touch swipes.
    await run("mode='story';start();paused=false");
    const laneBefore=await run('player.y');
    await page.locator('#game').evaluate(c=>{const r=c.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;c.setPointerCapture=()=>{};c.dispatchEvent(new PointerEvent('pointerdown',{pointerId:1,pointerType:'touch',clientX:x,clientY:y,bubbles:true}));c.dispatchEvent(new PointerEvent('pointermove',{pointerId:1,pointerType:'touch',clientX:x,clientY:y-80,bubbles:true}));c.dispatchEvent(new PointerEvent('pointerup',{pointerId:1,pointerType:'touch',clientX:x,clientY:y-80,bubbles:true}))});
    check(await run('player.y')===Math.max(2,laneBefore-1),'touch swipe changes story lane');
    if(width<800)await page.locator('#game').tap();else await page.locator('#game').click();
    check(await run('player.jump>0'),'touch tap jumps');
    if(width<800)await page.locator('#focusExit').click();else await run("paused=true;document.body.classList.remove('game-focus')");
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2), `${width}: no overflow`);
    if (width === 390) {
      await page.screenshot({ path: 'audit-artifacts/kygo/mobile-390.png', fullPage: true });
      const windows = await run("seasonSchedule(2026).map(e=>({id:e.id,start:e.start.toISOString(),end:e.end.toISOString(),before:seasonState(new Date(+e.start-1)).active?.id,at:seasonState(e.start).active?.id,last:seasonState(new Date(+e.end-1)).active?.id,after:seasonState(e.end).active?.id}))");
      check(windows.every(e => e.before !== e.id && e.at === e.id && e.last === e.id && e.after !== e.id), 'season exact boundaries');
      check(windows.find(e => e.id === 'halloween').start === '2026-10-23T21:00:00.000Z', 'Bucharest calendar independent of device timezone');
      for (const [edition, date] of [['halloween','2026-10-26T12:00:00Z'],['easter','2026-04-10T12:00:00Z'],['christmas','2026-12-26T12:00:00Z']]) {
        await page.clock.setFixedTime(new Date(date));
        await page.reload();
        await page.locator('#edition').selectOption(edition);
        await page.locator('[data-mode=story]').click();
        await page.locator('#startOverlay').tap();
        check(await run(`saved.edition==='${edition}'&&running`), `${edition}: mobile Start`);
        await run('saved.settings.safe=true;for(let i=0;i<29;i++)moveStory(1,0)');
        check(await run(`saved.editionCompleted.${edition}.includes(1)`), `${edition}: independent completion`);
        await page.locator('#focusExit').click();
      }
      await page.clock.setFixedTime(new Date('2026-09-30T12:00:00Z'));
      await page.reload();
      check(await run("saved.edition==='classic'&&['halloween','easter','christmas'].every(e=>saved.editionCompleted[e].includes(1))"), 'edition progress survives automatic return to classic');
      // Deterministic transition coverage, not a claim of manual completion of all courses.
      const levels = await run("(()=>{mode='story';dailyRun=customRun=trialRun=freeRun=false;saved.settings.safe=true;let failed=[];for(let n=1;n<=100;n++){saved.level=n;start();for(let i=0;i<29;i++)moveStory(1,0);if(!saved.completed.includes(n))failed.push(n)}return {failed,guardians:guardianCount(),ends:saved.chapterEnds.filter(k=>k.startsWith('classic-')).length,last:saved.level,restart:document.querySelector('#resultNext').dataset.restart}})()");
      check(!levels.failed.length && levels.guardians === 10 && levels.ends === 25 && levels.last === 100 && levels.restart === 'true', '100 transitions, 10 guardians, 25 endings, finale');
      await run('playLevel(4);for(let i=0;i<29;i++)moveStory(1,0)');
      check(await run('JSON.parse(backupData()).level===100'), 'backup during replay preserves frontier');
      await run('endReplay()');
      check(await run('saved.level===100'), 'replay does not reduce frontier');
      const backup = await run('backupData()');
      const storedBeforeInvalid = await run('localStorage.getItem(storeKey)');
      const invalidBackups = [
        {coins:0,level:1,best:null}, {coins:0,level:1,settings:[]},
        {coins:0,level:1,editionCompleted:{classic:null}}, {coins:0,level:1.5},
        {coins:0,level:1,stars:{'classic-1':4}}, {coins:0,level:1,customCourse:[null]},
        ...['best','stars','bestTrial','editionLevels','editionCompleted','dogRewards','stats','settings','ui','ghosts'].flatMap(key =>
          [null, [], 'invalid'].map(value => ({coins:0,level:1,[key]:value}))),
        ...[{editionLevels:{easter:0}}, {editionCompleted:{christmas:[101]}},
          {dogRewards:{biscuits:null}}, {stats:{runs:'1'}}, {settings:{speed:null}},
          {ui:{motion:'false'}}, {ghosts:{dash:{ev:null}}},
          {customCourse:[{x:'5',y:3,type:'paw'}]}, {customCourse:[{x:true,y:3,type:'paw'}]},
          {app:null}].map(fields => ({coins:0,level:1,...fields}))
      ];
      for (const invalid of invalidBackups) {
        for (const text of [JSON.stringify(invalid), 'KYGO1:'+Buffer.from(JSON.stringify(invalid)).toString('base64')]) {
          await run(`restoreFrom(${JSON.stringify(text)})`);
          check(await run('localStorage.getItem(storeKey)') === storedBeforeInvalid, 'invalid backup preserves the complete stored progress');
          check(await run("(()=>{renderUi();return saved.level===100})()"), 'invalid backup leaves live state renderable');
        }
      }
      check(await run("(()=>{const s=normalizeSave({coins:7,level:9,edition:'easter',editionLevels:{classic:3}},true);return s.level===9&&s.editionLevels.easter===9&&s.editionLevels.classic===3&&Array.isArray(s.editionCompleted.easter)&&s.best!==null&&s.settings.speed===65})()"), 'legacy partial save receives complete defaults and preserves active progress');
      check(await run("normalizeSave({coins:0,level:9,editionLevels:{classic:1}},true).level===1"), 'explicit edition level remains authoritative');
      check(await run("(()=>{const prior=saved;try{saved=normalizeSave({coins:0,level:1,best:null,settings:[],editionCompleted:{classic:null}},false);renderUi();return saved.best!==null&&Array.isArray(saved.editionCompleted.classic)}finally{saved=prior;renderUi()}})()"), 'corrupt local save recovers to renderable defaults');
      // Exercise the actual file upload and download controls.
      await page.locator('#saveFile').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(backup)});
      await page.waitForFunction(() => !!window.__kygoEval);
      check(await run('saved.level===100'), 'JSON file roundtrip');
      const downloaded = page.waitForEvent('download');
      if(!(await page.locator('#saveDownload').isVisible()))await page.locator('details').filter({has:page.locator('#saveDownload')}).locator('summary').click();await page.locator('#saveDownload').click();
      check((await downloaded).suggestedFilename().endsWith('.json'), 'JSON download');
      const encoded = await run("'KYGO1:'+b64enc(backupData())");
      await run(`restoreFrom(${JSON.stringify(encoded)})`);
      await page.waitForFunction(() => !!window.__kygoEval);
      check(await run('saved.level===100'), 'encoded backup roundtrip');
      // Record, export and import a real race state; replay consumes the saved seed.
      check(await run("(()=>{mode='dash';start();score=2;tickTime=1000;player.lane=2;recordGhost();ghostPick();saveGhost(true);const g=saved.ghosts.dash,code='KYGOGHOST1:'+b64enc(JSON.stringify(g));importGhost(code);start();return ghostPlay.from==='friend'&&ghostPlay.seed===g.seed&&ghostRec.seed===g.seed&&ghostPlay.ev.length===2})()"), 'ghost code roundtrip and same seeded course');
      await page.evaluate(() => navigator.serviceWorker.ready);
      await page.reload();
      await page.waitForFunction(() => !!navigator.serviceWorker.controller);
      await context.setOffline(true);
      await page.goto(server.baseURL+'/kygo-world/?source=app&lang=en');
      check(await page.locator('#game').isVisible(), 'offline app start URL');
      check(await run('sprite.complete&&sprite.naturalWidth>0&&world.complete&&world.naturalWidth>0'), 'offline game images');
      await page.locator('[data-mode=story]').click();
      await page.locator('#startOverlay').tap();
      check(await run('running'), 'offline play starts');
      await context.setOffline(false);
    }
    check(!errors.length, `${width}: no page/console errors: ${errors.join('; ')}`);
    console.log(`PASS Kygo @ ${width}px`);
    await context.close();
  }
  console.log(`PASS ${checks} Kygo regression assertions`);
} finally { await browser.close(); await server.close(); }
