export const SCHEMA_VERSION=2;
export const DEFAULT_DESIGN=Object.freeze({name:'Jack',color:'#ff9c3d',face:'auto',hat:'none',shape:'round',light:false,lightColor:'#ffe3a0',intensity:70,strokes:[],stickers:[]});
export const DEFAULT_SETTINGS=Object.freeze({theme:'dark',contrast:false,motion:false,pause:false,large:false,performance:false,sound:false,ambient:false,volume:35,weather:'fog',season:'autumn',dial:'both',hold:true,timeLimit:60});
export function normalizeDesign(d={}){
 if(!d||typeof d!=='object')throw Error('design');
 const hex=v=>typeof v==='string'&&/^#[0-9a-f]{6}$/i.test(v);
 const out={...DEFAULT_DESIGN,name:typeof d.name==='string'?d.name.slice(0,40):'Jack'};
 if(hex(d.color))out.color=d.color;if(hex(d.lightColor))out.lightColor=d.lightColor;
 for(const [k,values]of Object.entries({face:['auto','classic','cute','angry','surprised','none'],hat:['none','witch','crown','bow'],shape:['round','wide','tall']}))if(values.includes(d[k]))out[k]=d[k];
 out.light=d.light===true;out.intensity=Number.isFinite(d.intensity)?Math.min(100,Math.max(0,d.intensity)):70;
 out.strokes=Array.isArray(d.strokes)?d.strokes.slice(-100).filter(s=>s&&['paint','carve','erase'].includes(s.tool)&&hex(s.color)&&Number.isFinite(s.width)&&s.width>=1&&s.width<=25&&Array.isArray(s.points)&&s.points.length<=1000&&s.points.every(p=>Array.isArray(p)&&p.length===2&&p.every(n=>Number.isFinite(n)&&n>=0&&n<=200))).map(s=>({tool:s.tool,color:s.color,width:s.width,points:s.points})):[];
 out.stickers=Array.isArray(d.stickers)?d.stickers.slice(0,25).filter(s=>s&&['⭐','🍁','🌙','🦇','💜'].includes(s.text)&&Number.isFinite(s.x)&&Number.isFinite(s.y)&&s.x>=0&&s.x<=200&&s.y>=0&&s.y<=170).map(s=>({text:s.text,x:s.x,y:s.y})):[];
 return out;
}
export function validateBackup(raw){
 if(!raw||raw.schema!==2||!Array.isArray(raw.entries)||raw.entries.length>1000||!Array.isArray(raw.gallery)||raw.gallery.length>60)throw Error('schema');
 const entries=raw.entries.map(e=>{if(!e||!Number.isFinite(e.pounds)||e.pounds<0||e.pounds>1e9||!Number.isFinite(e.time)||e.time<0||e.time>8640000000000000)throw Error('entry');return {id:typeof e.id==='string'?e.id.slice(0,80):String(e.time),name:typeof e.name==='string'?e.name.slice(0,40):'Jack',pounds:e.pounds,time:e.time};});
 const gallery=raw.gallery.map(g=>{if(!g||typeof g.id!=='string'||!Number.isFinite(g.pounds)||g.pounds<0||g.pounds>1e9||!Number.isFinite(g.time)||g.time<0||g.time>8640000000000000)throw Error('gallery');return {id:g.id.slice(0,80),pounds:g.pounds,time:g.time,favorite:g.favorite===true,design:normalizeDesign(g.design)};});
 const progress=raw.progress||{};if(!Number.isFinite(progress.xp)||progress.xp<0||!Number.isFinite(progress.games)||progress.games<0||!Array.isArray(progress.categories)||!Array.isArray(progress.daily)||!Array.isArray(progress.scores))throw Error('progress');
 return {schema:2,entries,gallery,design:normalizeDesign(raw.design),progress:{xp:Math.floor(progress.xp),games:Math.floor(progress.games),categories:progress.categories.filter(n=>Number.isInteger(n)&&n>=0&&n<6),daily:progress.daily.filter(x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)).slice(-366),scores:progress.scores.filter(s=>s&&typeof s.mode==='string'&&Number.isFinite(s.score)&&s.score>=0&&Number.isFinite(s.time)).slice(-100)}};
}
export function statistics(entries){const a=entries.map(e=>e.pounds).sort((a,b)=>a-b),n=a.length;return {count:n,mean:n?a.reduce((s,x)=>s+x,0)/n:0,median:n?(a[Math.floor((n-1)/2)]+a[Math.floor(n/2)])/2:0,max:n?a[n-1]:0};}
export function dailyWeight(date){let n=2166136261;for(const c of date)n=Math.imul(n^c.charCodeAt(0),16777619);return 1+(n>>>0)%35000/10;}
export function accuracyScore(guess,target){if(!Number.isFinite(guess)||guess<0||!Number.isFinite(target)||target<=0)return 0;return Math.max(0,Math.round(100*(1-Math.abs(guess-target)/target)));}
export function shareCode(design,pounds){const d=normalizeDesign({...design,strokes:[],stickers:[]});return encodeURIComponent(JSON.stringify({design:d,pounds}));}
export function readShare(value){const d=JSON.parse(decodeURIComponent(value));if(!Number.isFinite(d.pounds)||d.pounds<0||d.pounds>1e9)throw Error('weight');return {design:normalizeDesign(d.design),pounds:d.pounds};}
