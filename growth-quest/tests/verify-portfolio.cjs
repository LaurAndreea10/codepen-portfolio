const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..','..');
const html=fs.readFileSync(path.join(root,'portfolio.html'),'utf8');
const done=html.split('id="now-panel-done"')[1].split('</ul>')[0].split('<ul class="now-checklist">')[1];
const history=html.split('id="now-panel-history"')[1].split('id="now-panel')[0];
const nodes={
 '#now-panel-active .now-checklist':{innerHTML:'Original active'},
 '#now-panel-done .now-checklist':{innerHTML:done},
 '#now-panel-history .now-history':{innerHTML:history},
 '#now .now-note':{textContent:''},
 'now-title':{textContent:''},
 'now-datetime':{textContent:'',dateTime:''}
};
const ctx={window:{},document:{readyState:'loading',documentElement:{lang:'ro'},addEventListener(){},querySelector:s=>nodes[s],getElementById:s=>nodes[s]}};
vm.createContext(ctx);
const src=fs.readFileSync(path.join(root,'main.js'),'utf8').replace("if(document.readyState==='loading')", "window.testNow={captureStaticNowRo,restoreNow};if(document.readyState==='loading')");
vm.runInContext(src,ctx);ctx.window.testNow.captureStaticNowRo();
nodes['#now-panel-done .now-checklist'].innerHTML='Legacy overwrite';nodes['#now-panel-history .now-history'].innerHTML='Legacy overwrite';
ctx.window.testNow.restoreNow();
assert(nodes['#now-panel-done .now-checklist'].innerHTML.includes('data-growth-quest="2.0.1"'));
assert(nodes['#now-panel-history .now-history'].innerHTML.includes('data-growth-quest="2.0.1"'));
assert.equal(nodes['now-datetime'].dateTime,'2026-10-09');
assert(fs.readFileSync(path.join(root,'en/index.html'),'utf8').includes('data-growth-quest="2.0.1"'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'projects.json'),'utf8'));
assert.equal(catalog.filter(p=>p.slug==='growth-quest').length,1);
console.log('PASS: completion and history survive legacy rendering; date and EN/catalog integration aligned.');
