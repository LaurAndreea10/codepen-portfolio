/* Deterministic park rules, independent of rendering and browser storage. */
(function(root){
  'use strict';
  const MODES=['dig','run','disc','jump'],KEY='kygo-play-v1';
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const rng=seed=>()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  function create(mode='dig',level=1,assisted=false){
    if(!MODES.includes(mode)||!Number.isInteger(level)||level<1||level>5)throw Error('Invalid stage');
    const random=rng((MODES.indexOf(mode)+1)*7919+level*127),cells=Array.from({length:16},(_,i)=>i);
    for(let i=15;i>0;i--){const j=Math.floor(random()*(i+1));[cells[i],cells[j]]=[cells[j],cells[i]];}
    const s={mode,level,assisted:!!assisted,phase:'ready',elapsed:0,score:0,lives:3,found:0,cleared:0,catches:0,round:0,misses:0,cursor:5,cells:Array(16).fill(0),bones:cells.slice(0,3),dug:[],distance:0,length:160+level*32,lane:1,x:0,jump:0,vy:0,boost:0,cooldown:0,events:[],message:'ready',messageSerial:0,disc:null,wait:0};
    if(mode==='run')for(let i=0,z=14;z<s.length-8;i++,z+=10){s.events.push({z,lane:Math.floor(random()*3),kind:i%3===2?'cone':'bone',done:false});}
    if(mode==='jump')for(let i=0;i<7+level;i++)s.events.push({z:20+i*19,lane:1,kind:'hurdle',done:false});
    s.goal=mode==='dig'?3:mode==='run'?3+level:mode==='disc'?2+level:5+level;
    if(mode==='jump')s.length=s.events[s.events.length-1].z+18;
    return s;
  }
  function tell(s,key){s.message=key;s.messageSerial++;}
  function begin(s){if(s.phase==='ready'){s.phase='playing';tell(s,'go');if(s.mode==='disc')throwDisc(s);}return s;}
  function end(s,won){if(s.phase!=='playing')return;s.phase=won?'won':'lost';if(won)s.score+=Math.max(0,150-Math.floor(s.elapsed));tell(s,won?'won':'lost');}
  function togglePause(s){if(s.phase==='playing'){s.phase='paused';tell(s,'paused');}else if(s.phase==='paused'){s.phase='playing';tell(s,'go');}}
  function move(s,dx,dy=0){
    if(s.phase!=='playing')return;
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
    s.elapsed+=dt;s.x+=(s.lane*2-2-s.x)*Math.min(1,dt*12);s.boost=Math.max(0,s.boost-dt);s.cooldown=Math.max(0,s.cooldown-dt);
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
  function freshSave(){return {version:1,completed:[],best:{},assisted:false};}
  function validateSave(data){
    const validId=id=>typeof id==='string'&&/^(dig|run|disc|jump):[1-5]$/.test(id);
    if(!data||data.version!==1||!Array.isArray(data.completed)||data.completed.length>20||new Set(data.completed).size!==data.completed.length||!data.completed.every(validId)||typeof data.assisted!=='boolean'||!data.best||typeof data.best!=='object'||Array.isArray(data.best)||Object.keys(data.best).length>40)throw Error('Invalid park save');
    for(const [key,r] of Object.entries(data.best)){if(!/^(dig|run|disc|jump):[1-5]:(standard|assisted)$/.test(key)||!r||!Number.isInteger(r.score)||r.score<0||r.score>1000000||!Number.isInteger(r.time)||r.time<0||r.time>86400000)throw Error('Invalid park record');}
    return JSON.parse(JSON.stringify(data));
  }
  function unlocked(save,mode){return Math.min(5,1+save.completed.filter(id=>id.startsWith(mode+':')).reduce((max,id)=>Math.max(max,Number(id.split(':')[1])),0));}
  function finish(save,s){if(s.phase!=='won')return false;const id=s.mode+':'+s.level,key=id+':'+(s.assisted?'assisted':'standard'),r={score:Math.max(0,Math.round(s.score)),time:Math.max(0,Math.round(s.elapsed*1000))};if(!save.completed.includes(id))save.completed.push(id);const old=save.best[key];if(!old||r.score>old.score||r.score===old.score&&r.time<old.time)save.best[key]=r;return true;}
  const api={MODES,KEY,create,begin,move,action,dig,scent,canCatch,step,togglePause,freshSave,validateSave,unlocked,finish};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.KygoPark=api;
})(typeof window!=='undefined'?window:globalThis);
