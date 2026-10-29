/* Carpați Enduro 2 — deterministic data contracts, no DOM dependencies. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CEExpedition=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const VERSION='2.0.0';
const DISCIPLINES=['sprint','hard','precision','rush','delivery','rescue','rally','rogue','boss','explore'];
const KINDS=['flat','hill','climb','descend','table','drop','logs','rocks','steps','mud','water','whoops','dunes','ice','puddle','roots','bridge','stairs'];
const num=(v,a,b,d)=>typeof v==='number'&&Number.isFinite(v)?Math.max(a,Math.min(b,v)):d;
const text=(s,n=40)=>typeof s==='string'?s.replace(/[\u0000-\u001f]/g,'').slice(0,n):'';
const clone=x=>JSON.parse(JSON.stringify(x));
function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function random(seed){let a=seed>>>0;return()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function course(x){if(!x||x.format!=='CE-TRACK-2'||!Array.isArray(x.segments)||x.segments.length<3||x.segments.length>40)throw Error('track');
return {format:'CE-TRACK-2',name:text(x.name)||'Trail',seed:Math.floor(num(x.seed,0,4294967295,42)),region:Math.floor(num(x.region,0,7,0)),weather:['c','r','f','s','l'].includes(x.weather)?x.weather:'c',tod:['d','u','n'].includes(x.tod)?x.tod:'d',profile:Array.isArray(x.profile)?x.profile.slice(0,41).filter(p=>Number.isFinite(p?.at)&&p.at>0&&p.at<1&&Number.isFinite(p?.dy)).map(p=>({at:num(p.at,.025,.975,.5),dy:num(p.dy,-180,180,0)})).sort((a,b)=>a.at-b.at):[],segments:x.segments.map(s=>{if(!s||!KINDS.includes(s.kind))throw Error('segment');return {kind:s.kind,grade:num(s.grade,.5,1.5,1),surface:s.surface==null?null:Math.floor(num(s.surface,0,10,0))}})}}
const courseID=c=>hash(JSON.stringify(course(c))).toString(36);
function decode(raw,type){if(typeof raw!=='string'||raw.length>1500000)throw Error('size');const v=JSON.parse(raw);if(type==='track')return course(v);if(type==='ghost')return ghost(v);if(type==='save')return save(v);throw Error('format')}
function ghost(g){if(!g||g.format!=='CE-GHOST-2'||!Array.isArray(g.frames)||g.frames.length<12||g.frames.length>72000||g.frames.length%6||g.frames.some(v=>!Number.isFinite(v)||Math.abs(v)>2000000))throw Error('ghost');
 const o=g.opts||{};if(!['race','tt','trial','duel'].includes(o.mode)||!Number.isInteger(o.r)||o.r<0||o.r>7||!Number.isSafeInteger(o.seed)||o.seed<0||o.seed>4294967295||!['c','r','f','s','l'].includes(o.w)||!['d','u','n'].includes(o.tod))throw Error('options');
 return {format:'CE-GHOST-2',name:text(g.name,16)||'Ghost',signature:text(g.signature,100),opts:{mode:o.mode,r:o.r,seed:o.seed,w:o.w,tod:o.tod,diff:Math.floor(num(o.diff,0,3,1)),opp:0,...(DISCIPLINES.includes(o.discipline)?{discipline:o.discipline,route:Math.floor(num(o.route,0,2,0))}:{}),...(o.course?{course:course(o.course)}:{})},weatherTimeline:Array.isArray(g.weatherTimeline)?g.weatherTimeline.slice(0,200).filter(e=>Number.isFinite(e.t)&&e.t>=0&&['c','r','f','s','l'].includes(e.w)).map(e=>({t:e.t,w:e.w})):[],frames:g.frames.slice()}}
function save(v){if(!v||v.v!==1||!v.bikes||typeof v.bikes!=='object'||Array.isArray(v.bikes)||!v.stats||typeof v.stats!=='object'||Array.isArray(v.stats)||!v.set||typeof v.set!=='object'||Array.isArray(v.set)||!Number.isFinite(v.coins)||v.coins<0||v.coins>1e9||!Number.isFinite(v.xp)||v.xp<0||v.xp>1e9)throw Error('save');
 const d=clone(v);for(const k of ['career','ghosts','lb','lbMeta','ach','daily','school','evt'])if(!d[k]||typeof d[k]!=='object'||Array.isArray(d[k]))d[k]={};
 for(const k of ['gOrder','lbOrder'])if(!Array.isArray(d[k]))d[k]=[];
 const bikes=['enduro','cross','trial','rally','volt'];const safeBikes={};for(const id of bikes){if(!d.bikes[id])continue;const up={};for(const k of ['eng','tire','susp','brk'])up[k]=Math.floor(num(d.bikes[id].up?.[k],0,5,0));safeBikes[id]={up}}if(!safeBikes.enduro)safeBikes.enduro={up:{eng:0,tire:0,susp:0,brk:0}};d.bikes=safeBikes;d.sel=bikes.includes(d.sel)&&d.bikes[d.sel]?d.sel:'enduro';
 d.stats.regions=Array.isArray(d.stats.regions)?d.stats.regions.filter(n=>Number.isInteger(n)&&n>=0&&n<8):[];
 for(const k of ['m','wins','crashes','jumps','flips','time','races'])d.stats[k]=num(d.stats[k],0,1e12,0);
 d.earned=num(d.earned,0,1e12,0);d.set.name=text(d.set.name,16)||'Pilot';d.set.num=Math.floor(num(d.set.num,1,99,7));d.set.lang=d.set.lang==='en'?'en':'ro';
 for(const k of ['color','suit'])if(!/^#[0-9a-f]{6}$/i.test(d.set[k]||''))d.set[k]='#22d3ee';
 d.set.q=Object.assign({mode:'race',r:0,diff:1,opp:3,w:'c',tod:'d'},d.set.q||{});if(!['race','tt','trial','hill','surv','stunt','elim','duel','free'].includes(d.set.q.mode))d.set.q.mode='race';d.set.q.r=Math.floor(num(d.set.q.r,0,7,0));d.set.q.diff=Math.floor(num(d.set.q.diff,0,3,1));
 for(const [k,a,b,f] of [['speed',.6,1,1],['text',1,1.3,1],['bs',.85,1.4,1],['assist',0,2,1],['vEng',0,1,.5],['vSfx',0,1,.7],['vMus',0,1,.25]])d.set[k]=num(d.set[k],a,b,f);
 d.shop=d.shop&&typeof d.shop==='object'?d.shop:{};for(const k of ['liv','helm','fx'])d.shop[k]=Array.isArray(d.shop[k])?d.shop[k].filter(x=>typeof x==='string').slice(0,50):[k==='fx'?'dust':'solid'];
 // Imported leaderboards are rendered by the legacy UI: normalize all interpolated fields.
 const date=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)?v:'2000-01-01';
 const cleanMap=(source,fn)=>Object.fromEntries(Object.entries(source||{}).filter(([k])=>/^[a-zA-Z0-9_-]{1,120}$/.test(k)).slice(0,100).flatMap(([k,v])=>{try{return [[k,fn(v)]]}catch{return []}}));
 d.career=cleanMap(d.career,c=>({m:Math.floor(num(c?.m,0,3,0)),b:c?.b==null?null:num(c.b,0,1e9,null)}));
 d.lb=cleanMap(d.lb,rows=>{if(!Array.isArray(rows))throw Error();return rows.slice(0,10).map(r=>({n:text(r.n,16),v:num(r.v,0,1e9,0),d:date(r.d),b:bikes.includes(r.b)?r.b:'enduro'}))});
 d.lbMeta=cleanMap(d.lbMeta,m=>({mode:['race','tt','trial','hill','surv','stunt','elim','duel','free','collect'].includes(m?.mode)?m.mode:'tt',r:Math.floor(num(m?.r,0,7,0)),ev:typeof m?.ev==='string'&&/^c[0-7][abc]$/.test(m.ev)?m.ev:null,daily:m?.daily?date(m.daily):null}));
 d.lbOrder=d.lbOrder.filter(k=>typeof k==='string'&&d.lb[k]).slice(0,24);
 d.ghosts=cleanMap(d.ghosts,g=>{if(!Array.isArray(g)||g.length>72000||g.length%6||g.some(n=>!Number.isFinite(n)||Math.abs(n)>2e6))throw Error();return g});d.gOrder=d.gOrder.filter(k=>typeof k==='string'&&d.ghosts[k]).slice(0,6);
 d.evt=cleanMap(d.evt,e=>({m:Array.from({length:3},(_,i)=>Math.floor(num(e?.m?.[i],0,3,0))),rew:!!e?.rew}));
 d.daily=cleanMap(d.daily,n=>num(n,0,1e9,0));d.ach=cleanMap(d.ach,v=>date(v));d.school=cleanMap(d.school,v=>date(v));
 d.rew=d.rew&&typeof d.rew==='object'?d.rew:{};d.rew.rank=num(d.rew.rank,1,10000,1);d.rew.streak=num(d.rew.streak,0,7,0);d.rew.ach=d.rew.ach&&typeof d.rew.ach==='object'?d.rew.ach:{};
 return d}
const defaults=()=>({v:2,history:[],tracks:[],tuning:{},outfits:[],missions:{},seasons:{},licenses:{},eventHistory:[],replay:null,suspended:null,settings:{pressure:1,spring:1,sensitivity:1,brake:.38,camera:1,dynamic:false,weatherPhysics:true,manual:false,clutch:false,economy:false,hud:true,oneHand:false,power:'none',layout:{}}});
function expansion(v){const d=defaults();if(!v||v.v!==2)return d;for(const k of ['history','tracks','outfits','eventHistory'])if(Array.isArray(v[k]))d[k]=v[k].slice(0,k==='history'?60:24);
 d.outfits=d.outfits.map(o=>({color:/^#[0-9a-f]{6}$/i.test(o?.color)?o.color:'#22d3ee',suit:/^#[0-9a-f]{6}$/i.test(o?.suit)?o.suit:'#f5a524',liv:text(o?.liv,20)||'solid',helm:text(o?.helm,20)||'solid',num:Math.floor(num(o?.num,1,99,7))}));
 d.tracks=d.tracks.flatMap(t=>{try{return[course(t)]}catch{return[]}});
 for(const k of ['tuning','missions','seasons','licenses'])if(v[k]&&typeof v[k]==='object'&&!Array.isArray(v[k]))d[k]=clone(v[k]);
 Object.assign(d.settings,v.settings||{});for(const [k,a,b,f] of [['pressure',.7,1.3,1],['spring',.7,1.3,1],['sensitivity',.3,1.5,1],['brake',0,1,.38],['camera',1,8,1]])d.settings[k]=num(d.settings[k],a,b,f);
 if(!['none','boost','shield','grip','slow','magnet','repair'].includes(d.settings.power))d.settings.power='none';
 d.settings.layout={};for(const k of ['thr','brk','lb','lf']){const p=v.settings?.layout?.[k];if(p)d.settings.layout[k]={x:num(p.x,0,90,10),y:num(p.y,20,85,70)}}
 for(const k of ['dynamic','weatherPhysics','manual','clutch','economy','hud','oneHand'])d.settings[k]=typeof d.settings[k]==='boolean'?d.settings[k]:defaults().settings[k];
 if(v.replay)try{d.replay=ghost(v.replay)}catch{}
 if(v.suspended)try{d.suspended={opts:ghost({format:'CE-GHOST-2',opts:v.suspended.opts,frames:Array(12).fill(0)}).opts,checkpoint:num(v.suspended.checkpoint,120,200000,120)}}catch{}
 return d}
function period(date=new Date(),weekly=false){const d=new Date(date.getFullYear(),date.getMonth(),date.getDate());if(weekly)d.setDate(d.getDate()-((d.getDay()+6)%7));return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function missions(date=new Date(),weekly=false){const id=period(date,weekly),r=random(hash(id+(weekly?'week':'day'))),k=weekly?4:1;return [{id:id+'-finish',weekly,metric:'finishes',target:2*k,reward:100*k},{id:id+'-clean',weekly,metric:'clean',target:k,reward:120*k},{id:id+'-jump',weekly,metric:'jumps',target:(3+Math.floor(r()*4))*k,reward:80*k}]}
function missionProgress(history,m){const weekly=!!m.weekly;const start=m.id.slice(0,10);return history.filter(h=>h.date>=start&&(weekly||h.date===start)).reduce((n,h)=>n+(m.metric==='finishes'?(h.fin?1:0):m.metric==='clean'?(h.fin&&h.crashes===0?1:0):(h.jumps||0)),0)}
function claim(state,m,history){if(state[m.id]||missionProgress(history,m)<m.target)return 0;state[m.id]=true;return m.reward}
function signature(s){return hash(JSON.stringify(s)).toString(36)}
return {VERSION,KINDS,num,text,clone,hash,random,course,courseID,ghost,save,decode,defaults,expansion,period,missions,missionProgress,claim,signature};
});
