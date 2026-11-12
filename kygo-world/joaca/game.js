/* Deterministic park rules, independent of rendering and browser storage. */
(function(root){
  'use strict';
  const MODES=['dig','run','disc','jump'],SCENES=['meadow','forest','beach','snow'],KEY='kygo-play-v1';
  const STATIONS=[{id:'dig',x:-3,z:5},{id:'run',x:3,z:11},{id:'disc',x:-3,z:17},{id:'jump',x:3,z:23},{id:'world',x:-3,z:30},{id:'archipelago',x:0,z:34},{id:'trail',x:3,z:38}];
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const rng=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  function create(mode='dig',level=1,assisted=false,options={}){
    if((!MODES.includes(mode)&&mode!=='free')||!Number.isInteger(level)||level<1||level>5)throw Error('Invalid stage');
    const scene=options.scene||'meadow',pace=options.pace??1;
    if(!SCENES.includes(scene)||![.5,.75,1,1.25].includes(pace))throw Error('Invalid park options');
    const random=rng((MODES.indexOf(mode)+1)*7919+level*127+SCENES.indexOf(scene)*5293),cells=Array.from({length:16},(_,i)=>i);
    for(let i=15;i>0;i--){const j=Math.floor(random()*(i+1));[cells[i],cells[j]]=[cells[j],cells[i]];}
    const s={mode,level,assisted:!!assisted,phase:'ready',elapsed:0,score:0,lives:3,found:0,cleared:0,catches:0,round:0,misses:0,cursor:5,cells:Array(16).fill(0),bones:cells.slice(0,3),dug:[],distance:0,length:160+level*32,lane:1,x:0,jump:0,vy:0,boost:0,cooldown:0,events:[],message:'ready',messageSerial:0,disc:null,wait:0};
    if(mode==='run')for(let i=0,z=14;z<s.length-8;i++,z+=10){s.events.push({z,lane:Math.floor(random()*3),kind:i%3===2?'cone':'bone',done:false});}
    if(mode==='jump')for(let i=0;i<7+level;i++)s.events.push({z:20+i*19,lane:1,kind:'hurdle',done:false});
    s.goal=mode==='dig'?3:mode==='run'?3+level:mode==='disc'?2+level:5+level;
    if(mode==='jump')s.length=s.events[s.events.length-1].z+18;
    s.scene=scene;s.pace=pace;s.walk={x:0,z:0,target:null};return s;
  }
  function tell(s,key){s.message=key;s.messageSerial++;}
  function begin(s){if(s.phase==='ready'){s.phase='playing';tell(s,'go');if(s.mode==='disc')throwDisc(s);}return s;}
  function end(s,won){if(s.phase!=='playing')return;s.phase=won?'won':'lost';if(won)s.score+=Math.max(0,150-Math.floor(s.elapsed));tell(s,won?'won':'lost');}
  function togglePause(s){if(s.phase==='playing'){s.phase='paused';tell(s,'paused');}else if(s.phase==='paused'){s.phase='playing';tell(s,'go');}}
  function move(s,dx,dy=0){
    if(s.phase!=='playing')return;
    if(s.mode==='free'){s.walk.target=null;s.walk.x=clamp(s.walk.x+Math.sign(dx),-6,6);s.walk.z=clamp(s.walk.z-Math.sign(dy)*2,0,42);tell(s,'walk');return;}
    if(s.mode==='dig'){const x=s.cursor%4,y=Math.floor(s.cursor/4);s.cursor=clamp(y+dy,0,3)*4+clamp(x+dx,0,3);tell(s,'scent');}
    else if(s.mode!=='jump'&&dx){s.lane=clamp(s.lane+Math.sign(dx),0,2);tell(s,'lane');}
  }
  function scent(s){let d=9;for(const i of s.bones)if(!s.dug.includes(i))d=Math.min(d,Math.abs(i%4-s.cursor%4)+Math.abs(Math.floor(i/4)-Math.floor(s.cursor/4)));return d<=1?'hot':d<=3?'warm':'cold';}
  function dig(s,index=s.cursor){
    if(s.phase!=='playing'||s.mode!=='dig'||!Number.isInteger(index)||index<0||index>15)return;
    s.cursor=index;
    if(s.cells[index]>=2){tell(s,'already');return;}
    s.cells[index]++;
    if(s.cells[index]===1){tell(s,'digAgain');return;}
    if(s.bones.includes(index)){s.dug.push(index);s.found++;s.score+=100;tell(s,'bone');if(s.found===s.goal)end(s,true);}
    else{s.score=Math.max(0,s.score-5);tell(s,'empty');}
  }
  function throwDisc(s){s.round++;s.disc={t:0,duration:Math.max(2.6,4-s.level*.15)+(s.assisted?1.2:0),x:[-2,0,2][(s.round*2+s.level)%3],caught:false};tell(s,'throw');}
  function canCatch(s){const d=s.disc;return s.phase==='playing'&&s.mode==='disc'&&!!d&&!d.caught&&d.t>=d.duration-(s.assisted?1.1:.65)&&d.t<=d.duration&&Math.abs(s.x-d.x)<(s.assisted?1.3:.9);}
  function action(s){
    if(s.phase!=='playing')return;
    if(s.mode==='free'){tell(s,nearest(s)?'enter':'walk');return;}
    if(s.mode==='dig'){dig(s);return;}
    if(s.mode==='run'){if(s.cooldown<=0){s.boost=1.1;s.cooldown=3;tell(s,'boost');}return;}
    if(s.mode==='jump'){if(s.jump<.01){s.vy=8.8;s.jump=.02;tell(s,'jump');}return;}
    if(!s.disc||s.disc.caught){tell(s,'wait');return;}
    if(canCatch(s)){s.disc.caught=true;s.catches++;s.score+=100;s.wait=.8;tell(s,'caught');if(s.catches>=s.goal)end(s,true);}
    else tell(s,s.disc.t<s.disc.duration-(s.assisted?1.1:.65)?'early':'align');
  }
  function step(s,dt){
    if(s.phase!=='playing'||!Number.isFinite(dt)||dt<=0)return;
    // Substeps preserve collision windows even when a frame is delayed.
    const total=Math.min(dt,.25);let remaining=total;
    while(remaining>1e-8&&s.phase==='playing'){const d=Math.min(.025,remaining);remaining-=d;tick(s,d);}
  }
  function tick(s,dt){
    s.elapsed+=dt;dt*=s.pace;
    if(s.mode==='free'){const target=STATIONS.find(v=>v.id===s.walk.target);if(target){const dx=target.x-s.walk.x,dz=target.z-s.walk.z,d=Math.hypot(dx,dz),step=Math.min(d,dt*7);if(d>.03){s.walk.x+=dx/d*step;s.walk.z+=dz/d*step;}else{s.walk.target=null;tell(s,'arrived');}}return;}
    s.x+=(s.lane*2-2-s.x)*Math.min(1,dt*12);s.boost=Math.max(0,s.boost-dt);s.cooldown=Math.max(0,s.cooldown-dt);
    if(s.jump>0||s.vy>0){s.vy-=20*dt;s.jump=Math.max(0,s.jump+s.vy*dt);if(!s.jump)s.vy=0;}
    if(s.mode==='disc'){
      if(s.wait>0){s.wait-=dt;if(s.wait<=0&&s.phase==='playing'){if(s.round>=s.goal+3)end(s,false);else throwDisc(s);}return;}
      const disc=s.disc;if(!disc)return;disc.t+=dt;
      if(s.assisted&&disc.t>disc.duration*.35)s.lane=clamp(Math.round((disc.x+2)/2),0,2);
      if(!disc.caught&&disc.t>disc.duration){s.misses++;s.wait=.8;tell(s,'miss');if(s.round>=s.goal+3)end(s,false);}
      return;
    }
    if(s.mode==='dig')return;
    const previous=s.distance,speed=(s.mode==='run'?9+s.level*.8:8+s.level*.6)*(s.boost>0?1.5:1)*(s.assisted?.72:1);
    s.distance=Math.min(s.length,s.distance+speed*dt);
    if(s.mode==='jump'&&s.assisted&&s.jump===0&&s.events.some(e=>!e.done&&e.z-s.distance>0&&e.z-s.distance<3.2))action(s);
    for(const e of s.events){
      if(e.done||e.z<previous||e.z>s.distance)continue;e.done=true;
      if(e.kind==='bone'){if(Math.abs(s.x-(e.lane*2-2))<(s.assisted?2.2:1)){s.found++;s.score+=25;tell(s,'bone');}}
      else if(e.kind==='cone'){if(Math.abs(s.x-(e.lane*2-2))<.85){s.score=Math.max(0,s.score-15);if(!s.assisted)s.lives--;tell(s,'bump');}}
      else if(s.jump>.65){s.cleared++;s.score+=60;tell(s,'clear');}
      else{s.misses++;if(!s.assisted)s.lives--;tell(s,'bump');}
      if(s.lives<=0){end(s,false);break;}
    }
    if(s.phase==='playing'&&s.distance>=s.length)end(s,(s.mode==='run'?s.found:s.cleared)>=s.goal);
  }
  function nearest(s){if(s.mode!=='free')return null;return STATIONS.map(v=>({...v,d:Math.hypot(v.x-s.walk.x,v.z-s.walk.z)})).filter(v=>v.d<2.2).sort((a,b)=>a.d-b.d)[0]||null;}
  function goTo(s,id){if(s.mode!=='free'||s.phase!=='playing'||!STATIONS.some(v=>v.id===id))return false;s.walk.target=id;tell(s,'walking');return true;}
  const settings=()=>({scene:'meadow',pace:1,accessory:'classic',color:'mint',controlScale:100,layout:'center'});
  function freshSave(){return {version:2,completed:[],best:{},assisted:false,settings:settings(),active:null,cups:{}};}
  function validateSave(data){
    const validId=id=>typeof id==='string'&&/^(dig|run|disc|jump):[1-5]$/.test(id);
    if(!data||![1,2].includes(data.version)||!Array.isArray(data.completed)||data.completed.length>20||new Set(data.completed).size!==data.completed.length||!data.completed.every(validId)||typeof data.assisted!=='boolean'||!data.best||typeof data.best!=='object'||Array.isArray(data.best)||Object.keys(data.best).length>40)throw Error('Invalid park save');
    for(const [key,r] of Object.entries(data.best)){if(!/^(dig|run|disc|jump):[1-5]:(standard|assisted)$/.test(key)||!r||!Number.isInteger(r.score)||r.score<0||r.score>1000000||!Number.isInteger(r.time)||r.time<0||r.time>86400000)throw Error('Invalid park record');}
    if(data.version===1)return {...freshSave(),completed:[...data.completed],best:JSON.parse(JSON.stringify(data.best)),assisted:data.assisted};
    const p=data.settings;if(!p||!SCENES.includes(p.scene)||![.5,.75,1,1.25].includes(p.pace)||!['classic','scarf','bow','crown'].includes(p.accessory)||!['mint','rose','gold','blue'].includes(p.color)||![100,120,140,160].includes(p.controlScale)||!['center','left','right'].includes(p.layout))throw Error('Invalid park settings');
    if(!data.cups||typeof data.cups!=='object'||Array.isArray(data.cups)||Object.keys(data.cups).length>40)throw Error('Invalid cup records');
    for(const [id,r] of Object.entries(data.cups)){if(!/^(meadow|forest|beach|snow):[1-5]:(standard|assisted)$/.test(id)||!r||!['gold','silver','bronze'].includes(r.medal)||!Number.isInteger(r.score)||r.score<0||r.score>1000000||!Number.isFinite(r.time)||r.time<0||r.time>86400000)throw Error('Invalid cup record');}
    if(data.active!==null){const a=data.active;if(!a||typeof a.reported!=='boolean')throw Error('Invalid active round');const s=restore(a.state);if(a.cup!==null){validateCup(a.cup);const expected=a.reported&&s.phase==='won'?MODES[a.cup.index-1]:MODES[a.cup.index];if(expected!==s.mode||a.cup.level!==s.level||a.cup.scene!==s.scene||a.cup.assisted!==s.assisted||a.cup.pace!==s.pace)throw Error('Mismatched championship round');}}
    return JSON.parse(JSON.stringify(data));
  }
  function unlocked(save,mode){return Math.min(5,1+save.completed.filter(id=>id.startsWith(mode+':')).reduce((max,id)=>Math.max(max,Number(id.split(':')[1])),0));}
  const rules=s=>s.assisted||s.pace<1?'assisted':'standard';
  function finish(save,s){if(s.phase!=='won')return false;const id=s.mode+':'+s.level,key=id+':'+rules(s),r={score:Math.max(0,Math.round(s.score)),time:Math.max(0,Math.round(s.elapsed*1000))};if(!save.completed.includes(id))save.completed.push(id);const old=save.best[key];if(!old||r.score>old.score||r.score===old.score&&r.time<old.time)save.best[key]=r;return true;}
  function createCup(level=1,assisted=false,scene='meadow',pace=1){create('dig',level,assisted,{scene,pace});return {level,assisted:!!assisted,scene,pace,index:0,results:[],phase:'playing'};}
  function validateCup(c){if(!c||!Number.isInteger(c.index)||c.index<0||c.index>4||!Array.isArray(c.results)||c.results.length!==c.index||!['playing','won'].includes(c.phase)||(c.phase==='won')!==(c.index===4))throw Error('Invalid cup');create('dig',c.level,c.assisted,{scene:c.scene,pace:c.pace});if(typeof c.assisted!=='boolean')throw Error('Invalid cup rules');for(let i=0;i<c.results.length;i++){const r=c.results[i];if(!r||r.mode!==MODES[i]||!Number.isInteger(r.score)||r.score<0||r.score>1000000||!Number.isFinite(r.time)||r.time<0||r.time>86400000||!Number.isFinite(r.quality)||r.quality<0||r.quality>1)throw Error('Invalid cup result');}return c;}
  function recordCup(c,s){validateCup(c);if(c.phase!=='playing'||s.phase!=='won'||MODES[c.index]!==s.mode||s.level!==c.level||s.scene!==c.scene||s.assisted!==c.assisted||s.pace!==c.pace)return false;const max=s.mode==='dig'?450:s.mode==='run'?s.events.filter(e=>e.kind==='bone').length*25+150:s.mode==='disc'?s.goal*100+150:s.events.length*60+150;c.results.push({mode:s.mode,score:Math.round(s.score),time:Math.round(s.elapsed*1000),quality:Math.min(1,s.score/max)});c.index++;if(c.index===4)c.phase='won';return true;}
  function cupResult(c){validateCup(c);if(c.phase!=='won')return null;const quality=c.results.reduce((n,r)=>n+r.quality,0)/4;return {score:c.results.reduce((n,r)=>n+r.score,0),time:c.results.reduce((n,r)=>n+r.time,0),medal:quality>=.8?'gold':quality>=.6?'silver':'bronze'};}
  function snapshot(s){const keys=['mode','level','assisted','scene','pace','phase','elapsed','score','lives','found','cleared','catches','round','misses','cursor','cells','dug','distance','lane','x','jump','vy','boost','cooldown','message','messageSerial','disc','wait','walk'];const out={version:1,eventsDone:s.events.map(e=>e.done)};for(const k of keys)out[k]=JSON.parse(JSON.stringify(s[k]));return out;}
  function restore(raw){
    if(!raw||raw.version!==1||typeof raw.assisted!=='boolean'||!['ready','playing','paused','won','lost'].includes(raw.phase))throw Error('Invalid round');
    const s=create(raw.mode,raw.level,raw.assisted,{scene:raw.scene,pace:raw.pace}),number=(key,min,max,int=false)=>{const v=raw[key];if(!Number.isFinite(v)||v<min||v>max||int&&!Number.isInteger(v))throw Error('Invalid '+key);return v;};
    for(const [key,min,max,int] of [['elapsed',0,86400],['score',0,1000000],['lives',0,3,true],['found',0,40,true],['cleared',0,12,true],['catches',0,7,true],['round',0,10,true],['misses',0,40,true],['cursor',0,15,true],['distance',0,s.length],['lane',0,2,true],['x',-2,2],['jump',0,3],['vy',-20,10],['boost',0,1.1],['cooldown',0,3],['wait',-1,.8],['messageSerial',0,1000000,true]])s[key]=number(key,min,max,int);
    if(!Array.isArray(raw.cells)||raw.cells.length!==16||!raw.cells.every(v=>Number.isInteger(v)&&v>=0&&v<=2)||!Array.isArray(raw.dug)||new Set(raw.dug).size!==raw.dug.length||!raw.dug.every(i=>s.bones.includes(i)&&raw.cells[i]===2)||!Array.isArray(raw.eventsDone)||raw.eventsDone.length!==s.events.length||!raw.eventsDone.every(v=>typeof v==='boolean')||typeof raw.message!=='string'||raw.message.length>40)throw Error('Invalid round collection');
    s.cells=[...raw.cells];s.dug=[...raw.dug];s.events.forEach((e,i)=>e.done=raw.eventsDone[i]);s.message=raw.message;
    if(s.mode==='dig'&&s.found!==s.dug.length)throw Error('Invalid found bones');
    if(raw.disc!==null){const d=raw.disc;if(s.mode!=='disc'||!d||typeof d.caught!=='boolean'||![-2,0,2].includes(d.x)||!Number.isFinite(d.t)||d.t<0||d.t>7||!Number.isFinite(d.duration)||d.duration<2||d.duration>6)throw Error('Invalid disc');s.disc={t:d.t,duration:d.duration,x:d.x,caught:d.caught};}else if(s.mode==='disc'&&s.round>0)throw Error('Missing disc');
    const walk=raw.walk;if(!walk||!Number.isFinite(walk.x)||Math.abs(walk.x)>6||!Number.isFinite(walk.z)||walk.z<0||walk.z>42||walk.target!==null&&!STATIONS.some(v=>v.id===walk.target))throw Error('Invalid walk');s.walk={...walk};
    s.phase=raw.phase==='playing'?'paused':raw.phase;return s;
  }
  const api={MODES,SCENES,STATIONS,KEY,create,begin,move,action,dig,scent,canCatch,step,togglePause,freshSave,validateSave,unlocked,finish,nearest,goTo,rules,createCup,validateCup,recordCup,cupResult,snapshot,restore};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.KygoPark=api;
})(typeof window!=='undefined'?window:globalThis);
