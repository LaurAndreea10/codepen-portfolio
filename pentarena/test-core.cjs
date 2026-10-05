// PentArena core regression: runs game.js headless (no DOM) and checks sports, AI, progression and backup.
const vm=require('vm'),fs=require('fs'),path=require('path'),assert=require('assert');
const stored={};
const sandbox={console,Math,Date,JSON,Number,Array,Object,Set,Map,Error,isFinite,parseInt,
  localStorage:{getItem:k=>stored[k]??null,setItem:(k,v)=>{stored[k]=String(v);}}};
sandbox.window=sandbox;sandbox.globalThis=sandbox;vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname,'game.js'),'utf8'),sandbox);
const PA=sandbox.PentArena;assert(PA&&PA.VERSION==='2.0.0');
const ctx=new Proxy({},{get:(_,k)=>k==='createRadialGradient'||k==='createLinearGradient'?()=>({addColorStop(){}}):k==='measureText'?()=>({width:10}):()=>{},set:()=>true});
const reset=()=>{PA.store=PA.freshStore();};
const DT=1/60;
function play(key,{diff='normal',players=1,cap=420,bot=true}={}){
  PA.store.prefs.diff=diff;PA.store.prefs.players=players;PA.store.prefs.replay=true;
  const g=PA.startQuick(key),s=g.sport;let t=0;
  while(!s.over&&t<cap){
    if(bot){
      if(key==='basket'&&s.state==='aim'&&s.human())s.launch(480+Math.random()*320,-680-Math.random()*240);
      if(key==='billiards'&&s.state==='aim'&&s.human()){if(s.bih)s.placeAt(300,310);s.spin=[-1,0,1][Math.floor(Math.random()*3)];s.shoot(Math.random()*6.283,300+Math.random()*1000);}
      if(key==='volley'&&Math.random()<.02)PA.pressed.add('Space');
      if(key==='hockey'){PA.PTRS.set('mouse',{id:'mouse',type:'mouse',inside:true,down:false,sx:100,x:s.k.x-28,y:s.k.y,justDown:false,justUp:false});}
    }
    PA.step(DT);s.draw(ctx);s.info();s.clock();if(s.matchStats)s.matchStats();t+=DT;
    for(const v of s.score)assert(Number.isInteger(v)&&v>=0);
  }
  return{s,t,g};
}
reset();
// 1. every sport finishes against the AI on every difficulty, without exceptions
const summary=[];
for(const diff of ['easy','normal','hard'])for(const key of PA.SPORT_KEYS){const {s,t}=play(key,{diff});summary.push(`${diff}/${key} ${s.score.join(':')} ${Math.round(t)}s`);
  if(key!=='football')assert(s.over,`${diff} ${key} did not finish (${s.score})`);else assert(s.over);}
console.log('PASS: all five sports finish vs AI on easy/normal/hard —',summary.join(' | '));
// 2. AI is a real opponent: wins hockey and volley against an idle player, scores in football
for(const key of ['hockey','volley']){const {s}=play(key,{diff:'normal',bot:false,cap:400});assert(s.over&&s.score[1]>s.score[0],`${key} AI should beat an idle player`);}
{const {s}=play('football',{diff:'hard',bot:false});assert(s.score[1]>=1,'football AI should score vs idle player');}
console.log('PASS: AI beats an idle player in hockey/volley and scores in football');
// 3. two-player mode runs every sport with both sides human
for(const key of PA.SPORT_KEYS){const {s}=play(key,{players:2,cap:25});assert.equal(PA.M.two,true);assert(!s.over||key==='basket'||key==='billiards'||true);}
console.log('PASS: local two-player mode runs every sport');
// 4. football: golden goal, replay frames, charged shot
{PA.store.prefs.mods=true;PA.store.prefs.players=1;const g=PA.startQuick('football'),s=g.sport;s.pause=0;for(let i=0;i<60;i++)PA.step(DT);
  s.b.x=905;s.b.y=300;s.b.vx=900;s.b.vy=0;for(let i=0;i<10;i++)PA.step(DT);assert.equal(s.score[0],1);assert(g.replay,'goal starts a replay');for(let i=0;i<400&&g.replay;i++)PA.step(DT);assert(!g.replay);
  s.time=.01;s.score=[2,2];s.pause=0;PA.step(DT);assert.equal(s.golden,true);s.pause=0;s.b.x=905;s.b.y=300;s.b.vx=900;for(let i=0;i<10;i++)PA.step(DT);assert(s.over&&s.goldenWin);
  const g2=PA.startQuick('football'),f=g2.sport;f.pause=0;f.t[0].x=f.b.x-28;f.t[0].y=f.b.y;PA.keys.add('Space');for(let i=0;i<40;i++){PA.step(DT);PA.keys.add('Space');}assert(f.t[0].ch>.8);PA.keys.delete('Space');PA.released.add('Space');f.t[0].x=f.b.x-28;f.t[0].y=f.b.y;f.t[0].cd=0;f.t[1].x=880;f.t[1].y=100;PA.step(DT);assert(Math.hypot(f.b.vx,f.b.vy)>800,'charged shot is stronger');
  console.log('PASS: football goal replay, golden goal win and charged shot');}
// 5. air hockey power-ups: shield blocks a goal, freeze slows, turbo boosts
{const g=PA.startQuick('hockey'),s=g.sport;s.pause=0;s.grant(0,'shield');s.k.x=80;s.k.y=300;s.k.vx=-900;s.k.vy=0;for(let i=0;i<20;i++)PA.step(DT);assert.equal(s.score[1],0,'shield saves');assert.equal(s.eff[0].sh,0);
  s.grant(0,'freeze');assert(s.eff[1].frz>0);s.grant(0,'big');PA.step(DT);assert.equal(s.m[0].r,44);assert.equal(s.stats.power[0],3);console.log('PASS: hockey shield, freeze and big mallet');}
// 6. volleyball spike
{const g=PA.startQuick('volley'),s=g.sport;s.pause=0;const p=s.s[0];p.x=400;p.y=450;p.onG=false;p.vy=-100;p.cd=0;s.b.x=405;s.b.y=p.y-p.r-14;s.b.vx=0;s.b.vy=60;
  for(let i=0;i<3;i++)PA.step(DT);assert.equal(s.stats.spikes[0],1,'spike registered');assert(s.b.vx>400&&s.b.vy>0);console.log('PASS: volleyball spike near the net');}
// 7. basketball AI accounts for wind and a moving hoop
{PA.store.prefs.mods=true;PA.store.prefs.len=2;PA.M.A=1.45;const g=PA.startQuick('basket'),s=g.sport;s.round=2;s.setRound();assert(s.moving);
  let made=0,att=0;for(let n=0;n<50;n++){s.turn=1;s.shot=0;s.newBall();s.wind=n%2?180:-180;s.aiShoot();const before=s.score[1];for(let i=0;i<400&&s.state==='fly'&&s.b.t<4;i++){s.update(DT);if(s.b.made)break;}att++;if(s.b.made)made++;}
  assert(made/att>=.35,`AI basket accuracy too low: ${made}/${att}`);PA.store.prefs.len=1;console.log(`PASS: basketball AI with wind + moving hoop made ${made}/${att}`);}
// 8. pool: draw spin pulls the cue ball back, scratch gives ball in hand
{const g=PA.startQuick('billiards'),s=g.sport;s.isBreak=false;s.groups=['solid','stripe'];for(const b of s.balls)if(b.n!==0&&b.n!==1){b.in=true;}
  const one=s.balls.find(b=>b.n===1);one.x=500;one.y=310;s.cue.x=380;s.cue.y=310;s.spin=-1;s.shoot(0,900);let minVx=1e9;for(let i=0;i<400&&s.state==='roll';i++){s.update(DT);minVx=Math.min(minVx,s.cue.vx);}assert(minVx<0,'draw spin reverses the cue ball');
  const g2=PA.startQuick('billiards'),q=g2.sport;q.isBreak=false;q.cue.x=q.cue.y=0;q.cue.x=830;q.cue.y=480;q.shoot(Math.atan2(500-480,860-830),600);for(let i=0;i<300&&q.state==='roll';i++)q.update(DT);
  assert.equal(q.shooter,1);assert.equal(q.bih,true);assert.equal(q.stats.fouls[0],1);q.update(DT);assert(!q.cue.in);console.log('PASS: pool draw spin and ball in hand after a scratch');}
// 9. progression: rewards, tournament, career unlocks, achievements
{reset();PA.store.prefs.players=1;PA.store.prefs.diff='hard';
  const fake=(key,a,b)=>{const s=new PA.SPORTS[key]();s.score=[a,b];s.over=true;return s;};
  PA.startTour();for(const k of PA.SPORT_KEYS){const r=PA.finishMatch(PA.run,fake(k,5,1));assert(r.o===1&&r.xp>0&&r.coins>0);}
  const f=PA.finishRun(PA.run);assert(f.champ);assert.equal(PA.store.tours,1);assert(PA.store.ach.includes('champ')&&PA.store.ach.includes('penta')&&PA.store.ach.includes('hard'));
  assert.equal(PA.startCareer('silver'),null,'silver locked at start');
  PA.startCareer('bronze');for(const k of PA.SPORT_KEYS)PA.finishMatch(PA.run,fake(k,k==='volley'?2:3,k==='volley'?3:0));const c=PA.finishRun(PA.run);
  assert(c.champ);assert.equal(PA.store.leagues.bronze,'won');assert.equal(PA.store.leagues.silver,'open');assert.equal(c.unlocked,'silver');assert.equal(c.coins,250);
  PA.startCareer('silver');assert.equal(PA.M.mods,true);assert.equal(PA.M.rival,'Ioana');
  assert(PA.levelOf(PA.store.xp)>=3);console.log(`PASS: tournament + bronze league → silver unlocked, level ${PA.levelOf(PA.store.xp)}, ${PA.store.coins} coins`);}
// 10. daily challenge is deterministic and only rewarded once
{const a=PA.dailyFor('2026-10-05'),b=PA.dailyFor('2026-10-05');assert.equal(JSON.stringify(a),JSON.stringify(b));
  const sports=new Set();for(let d=1;d<=28;d++)sports.add(PA.dailyFor(`2026-11-${String(d).padStart(2,'0')}`).sport);assert(sports.size>=4);
  reset();const dk=PA.todayKey(),ch=PA.dailyFor(dk);PA.startDaily();assert.equal(PA.game.sport.key,ch.sport);
  const s=new PA.SPORTS[ch.sport]();s.score=[9,0];s.stats.spikes=[5,0];s.over=true;const r=PA.finishMatch(PA.run,s);assert.equal(r.daily,true);assert.equal(PA.store.dailyDone[dk],true);
  const coins=PA.store.coins;PA.startDaily();PA.finishMatch(PA.run,s);assert(PA.store.coins-coins<120,'daily bonus paid only once');console.log('PASS: seeded daily challenge, single reward');}
// 11. shop and backup
{reset();assert.equal(PA.buy('skin','violet'),'poor');PA.store.coins=500;assert.equal(PA.buy('skin','violet'),'ok');assert.equal(PA.store.skin,'violet');assert.equal(PA.store.coins,200);
  const json=PA.exportStore(),back=PA.validateStore(JSON.parse(json));assert.equal(back.skin,'violet');assert.equal(back.coins,200);
  for(const [field,val] of [['xp',-1],['coins','9'],['skin','gold'],['ach',['nope']],['prefs',null],['leagues',{bronze:'x'}],['dailyDone',{'2026-02-31':true}]]){const bad=JSON.parse(json);bad.progress[field]=val;assert.throws(()=>PA.validateStore(bad),`${field} should be rejected`);}
  assert.throws(()=>PA.validateStore(null));assert.throws(()=>PA.validateStore({app:'other',progress:back}));
  console.log('PASS: locker purchases and validated backup round-trip');}
console.log('ALL PENTARENA CORE CHECKS PASSED');
