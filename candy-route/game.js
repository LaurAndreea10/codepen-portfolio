// Pure game rules; shared by browser and tests.
export const VERSION = 2;
export const STORAGE_KEY = 'laurai-candy-v2';
const rows = [
 [3],[2,7],[4,1,4],[1,2,3,1],[2,7,9,3,1],
 [5,1,1,5],[4,5,4],[6,7,6,1],[3,9,4,2,8],[8,2,2,8,1,7],
 [7,8,7,1,9,2],[3,4,5,6,7,8,9],[10,1,2,10,2,1,10],[6,7,6,7,6,7,6,1],[9,2,8,3,7,4,6,5],
 [5,-2,6],[-3,7,-1,8,-4],[4,-5,-2,6,1,-3,9],[0,-2,8,-1,0,7],[-4,-1,-8],
 [2,3,2],[5,1,1,5],[1,2,3,1],[9,2,8,2,9],[4,8,4,8,4,8],
 [10,1,3,9,2,8,1],[8,9,8,1,6,7,6,2],[6,1,9,2,8,3,7,4],[2,7,9,3,1,8,4,6,5],[9,1,8,2,7,3,6,4,5,10]
];
export const LEVELS = Object.freeze(rows.map((street,i)=>Object.freeze({id:i+1,mode:i>=20?'circle':i>=15?'tricks':'classic',street:Object.freeze(street)})));
export function localDay(date=new Date()) {
 const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Bucharest',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date);
 return ['year','month','day'].map(k=>parts.find(p=>p.type===k).value).join('-');
}
export function dailyStreet(day=localDay()) {
 let seed=2166136261;
 for(const c of 'CandyRoute-v2:'+day)seed=Math.imul(seed^c.charCodeAt(0),16777619)>>>0;
 return Array.from({length:12},()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%15+1;});
}
export function legalPick(street,mode,indices) {
 if(!Array.isArray(indices)||indices.some(i=>!Number.isInteger(i)||i<0||i>=street.length)||new Set(indices).size!==indices.length)return false;
 const p=new Set(indices);
 return indices.every(i=>!p.has(i-1)&&!p.has(i+1))&&!(mode==='circle'&&street.length>1&&p.has(0)&&p.has(street.length-1));
}
export function validStreet(street,mode) {
 return ['classic','tricks','circle'].includes(mode)&&Array.isArray(street)&&street.length>=1&&street.length<=40&&street.every(n=>Number.isInteger(n)&&n>=(mode==='tricks'?-99:0)&&n<=99);
}
export function freshState() {
 return {version:VERSION,lang:'ro',wins:0,light:false,contrast:false,still:false,tutorialDone:false,progress:{},daily:{},attempt:{kind:'free',level:1,day:'',mode:'classic',street:[2,7,9,3,1,4,2,6],picked:[],hinted:false,revealed:false,credited:false}};
}
function record(value) {
 if(!value||typeof value!=='object'||Array.isArray(value)||!Number.isInteger(value.stars)||value.stars<0||value.stars>3||typeof value.practiced!=='boolean')throw Error('Invalid progress');
 return {stars:value.stars,practiced:value.practiced};
}
export function unlocked(progress,id){return id===1||!!(progress[id-1]?.stars||progress[id-1]?.practiced);}
export function validateState(s) {
 if(!s||s.version!==VERSION||!['ro','en'].includes(s.lang)||!Number.isSafeInteger(s.wins)||s.wins<0)throw Error('Invalid version or score');
 const clean=freshState();clean.lang=s.lang;clean.wins=s.wins;
 for(const key of ['light','contrast','still','tutorialDone']){if(typeof s[key]!=='boolean')throw Error('Invalid preference');clean[key]=s[key];}
 for(const field of ['progress','daily']){
  if(!s[field]||typeof s[field]!=='object'||Array.isArray(s[field]))throw Error('Invalid records');
  if(Object.keys(s[field]).length>(field==='daily'?3660:30))throw Error('Too many records');
  for(const [key,value] of Object.entries(s[field])){
   if(field==='progress'?!/^(?:[1-9]|[12]\d|30)$/.test(key):!/^\d{4}-\d{2}-\d{2}$/.test(key))throw Error('Invalid record key');
   clean[field][key]=record(value);
  }
 }
 const a=s.attempt;
 if(!a||!['free','campaign','daily','tutorial'].includes(a.kind)||!validStreet(a.street,a.mode)||!legalPick(a.street,a.mode,a.picked))throw Error('Invalid attempt');
 if(!Number.isInteger(a.level)||a.level<1||a.level>30||typeof a.day!=='string')throw Error('Invalid target');
 for(const key of ['hinted','revealed','credited'])if(typeof a[key]!=='boolean')throw Error('Invalid attempt flags');
 if(a.kind==='campaign'){
  const l=LEVELS[a.level-1];if(!unlocked(clean.progress,a.level)||a.mode!==l.mode||JSON.stringify(a.street)!==JSON.stringify(l.street))throw Error('Invalid campaign street');
 }
 if(a.kind==='daily'&&(!/^\d{4}-\d{2}-\d{2}$/.test(a.day)||a.mode!=='classic'||JSON.stringify(a.street)!==JSON.stringify(dailyStreet(a.day))))throw Error('Invalid daily street');
 clean.attempt={kind:a.kind,level:a.level,day:a.day,mode:a.mode,street:[...a.street],picked:[...a.picked],hinted:a.hinted,revealed:a.revealed,credited:a.credited};
 return clean;
}
export function gradeAttempt(a){return a.revealed?{stars:0,practiced:true}:{stars:a.hinted?2:3,practiced:false};}
export function award(state) {
 const a=state.attempt;if(a.kind==='tutorial')return;
 const result=gradeAttempt(a);
 const records=a.kind==='campaign'?state.progress:a.kind==='daily'?state.daily:null;
 const key=a.kind==='campaign'?a.level:a.day;
 const wasSolved=records?.[key]?.stars>0;
 if(records){const old=records[key]??{stars:0,practiced:false};records[key]={stars:Math.max(old.stars,result.stars),practiced:old.practiced||result.practiced};}
 if(!a.credited&&!a.revealed){if(!wasSolved)state.wins++;a.credited=true;}
}
export function migrateV1(old) {
 const s=freshState();if(!old||!validStreet(old.street,old.mode)||!legalPick(old.street,old.mode,old.picked))return s;
 s.lang=old.lang==='en'?'en':'ro';s.wins=Number.isSafeInteger(old.wins)&&old.wins>=0?old.wins:0;
 for(const key of ['light','contrast','still'])s[key]=old[key]===true;
 Object.assign(s.attempt,{mode:old.mode,street:[...old.street],picked:[...old.picked],hinted:old.assisted===true,revealed:old.assisted===true,credited:old.credited===true});return s;
}
export function parseShared(hash) {
 if(!hash.startsWith('#street='))return null;
 const payload=JSON.parse(decodeURIComponent(hash.slice(8)));
 if(payload.version!==1||!validStreet(payload.street,payload.mode))throw Error('Invalid shared street');
 return {mode:payload.mode,street:[...payload.street]};
}
export function shareHash(a){return '#street='+encodeURIComponent(JSON.stringify({version:1,mode:a.mode,street:a.street}));}
