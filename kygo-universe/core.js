/* Shared local-only progress. No credentials, network requests or paid currency. */
(function (root) {
  'use strict';
  const VERSION = 1, KEY = 'kygo-universe-v1';
  const IDS = ['world', 'archipelago', 'trail'];
  const SAVE_KEYS = ['kygo-world-v2', 'kygo-world-3d', 'kygo-arhipelagul-v1', 'kygo-pe-urme-settings', 'kygo-pe-urme-done', 'kygo-pe-urme-v2-manor', 'kygo-pe-urme-v2-arena'];
  const plain = x => !!x && typeof x === 'object' && !Array.isArray(x) && Object.getPrototypeOf(x) === Object.prototype;
  const integer = (v, max = 1e8) => Number.isInteger(v) && v >= 0 && v <= max;
  const fresh = () => ({version:VERSION, name:'Kygo', avatar:'🐩', coins:0, xp:0, visits:[], wins:{world:[],archipelago:[],trail:[]}, records:[], claims:[], inventory:['classic'], equipped:'classic', decor:[], prefs:{lang:'ro',theme:'dark',contrast:false,motion:false,text:100,buttons:100,music:50,sfx:80,haptics:false,quality:'auto',camera:'follow'}, journal:[]});
  function safeTree(x, depth = 0) {
    if (depth > 16) return false;
    if (x === null || typeof x === 'boolean') return true;
    if (typeof x === 'number') return Number.isFinite(x) && Math.abs(x) <= 1e12;
    if (typeof x === 'string') return x.length <= 200000;
    if (Array.isArray(x)) return x.length <= 20000 && x.every(y => safeTree(y, depth + 1));
    return plain(x) && Object.keys(x).length <= 20000 && Object.entries(x).every(([k,v]) => !['__proto__','constructor','prototype'].includes(k) && safeTree(v, depth + 1));
  }
  const strings = (x, n = 10000) => Array.isArray(x) && x.length <= n && x.every(v => typeof v === 'string' && v.length <= 160);
  function validate(x) {
    if (!plain(x) || x.version !== VERSION || !safeTree(x) || typeof x.name !== 'string' || x.name.length > 32 || !['🐩','🐾','🦴','🏝️'].includes(x.avatar) || !integer(x.coins) || !integer(x.xp) || !strings(x.visits,3) || x.visits.some(v=>!IDS.includes(v))) throw Error('Invalid passport');
    if (!plain(x.wins) || !IDS.every(k => strings(x.wins[k])) || !strings(x.claims) || !strings(x.inventory,100) || !strings(x.decor,20) || !x.inventory.includes(x.equipped)) throw Error('Invalid progress');
    if (!Array.isArray(x.records) || x.records.length > 200 || !x.records.every(r=>plain(r)&&IDS.includes(r.game)&&typeof r.id==='string'&&r.id.length<=160&&integer(r.score)&&integer(r.time)&&typeof r.assisted==='boolean'&&typeof r.date==='string'&&r.date.length<=30&&Number.isFinite(Date.parse(r.date)))) throw Error('Invalid records');
    const p = x.prefs;
    if (!plain(p) || !['ro','en'].includes(p.lang) || !['dark','light'].includes(p.theme) || !['auto','low','medium','high'].includes(p.quality) || !['follow','overview','close','side'].includes(p.camera)) throw Error('Invalid settings');
    for (const k of ['contrast','motion','haptics']) if(typeof p[k]!=='boolean') throw Error('Invalid settings');
    for (const [k,min,max] of [['text',100,160],['buttons',100,150],['music',0,100],['sfx',0,100]]) if(!Number.isFinite(p[k])||p[k]<min||p[k]>max)throw Error('Invalid settings');
    if(p.keys!==undefined&&(!plain(p.keys)||Object.keys(p.keys).length>8||!Object.entries(p.keys).every(([k,v])=>['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space','KeyP','KeyB','KeyE'].includes(k)&&typeof v==='string'&&/^(Key[A-Z]|Digit[0-9]|Arrow(Left|Right|Up|Down)|Space|Enter|Shift(Left|Right))$/.test(v))||new Set(Object.values(p.keys)).size!==Object.values(p.keys).length))throw Error('Invalid keys');
    if (!Array.isArray(x.journal) || x.journal.length>100 || !x.journal.every(v=>typeof v==='string'&&v.length<=200)) throw Error('Invalid journal');
    return JSON.parse(JSON.stringify(x));
  }
  function load(storage) { try { const s = storage.getItem(KEY); return s ? validate(JSON.parse(s)) : fresh(); } catch { return fresh(); } }
  function save(storage, state) { storage.setItem(KEY, JSON.stringify(validate(state))); }
  function record(state, result, date = new Date().toISOString()) {
    if(!IDS.includes(result.game) || typeof result.id!=='string' || !result.id || result.id.length>160 || !integer(result.score||0) || !integer(result.time||0)) throw Error('Invalid result');
    const first = !state.wins[result.game].includes(result.id);
    if (first) { state.wins[result.game].push(result.id); state.coins += 15; state.xp += 100; }
    state.records.unshift({game:result.game,id:result.id,score:result.score||0,time:result.time||0,assisted:!!result.assisted,date});
    state.records.length = Math.min(200,state.records.length);
    if(first) { state.journal.unshift(date.slice(0,10)+' · '+result.game+' · '+result.id); state.journal.length=Math.min(100,state.journal.length); }
    return first;
  }
  function achievements(s) { const n=IDS.filter(k=>s.wins[k].length).length, count=IDS.reduce((a,k)=>a+s.wins[k].length,0); return {explorer:s.visits.length===3,first:count>=1,traveller:n===3,collector:count>=10,master:count>=30,wardrobe:s.inventory.length>=3}; }
  function claim(s,id,ok,reward=25) { if(!ok||s.claims.includes(id))return false;s.claims.push(id);s.coins+=reward;s.xp+=reward;return true; }
  function buy(s,item,cost) { if(s.inventory.includes(item)||!integer(cost)||s.coins<cost)return false;s.coins-=cost;s.inventory.push(item);return true; }
  function day(d=new Date()) { return new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Bucharest',year:'numeric',month:'2-digit',day:'2-digit'}).format(d); }
  function week(d=new Date()) { const t=new Date(day(d)+'T12:00:00Z'),n=(t.getUTCDay()+6)%7;t.setUTCDate(t.getUTCDate()-n);return t.toISOString().slice(0,10); }
  function seed(text) { let n=2166136261;for(const c of text)n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0; }
  function validateSave(key, raw) {
    if(!SAVE_KEYS.includes(key)||raw!==null&&typeof raw!=='string')throw Error('Unknown save');
    if(raw===null)return;
    if(raw.length>2000000)throw Error('Save too large');
    const x=JSON.parse(raw);if(!safeTree(x))throw Error('Unsafe save');
    if(key==='kygo-world-3d'){if(x!==0&&x!==1)throw Error('Invalid 3D preference');return;}
    if(x===null&&key.startsWith('kygo-pe-urme-v2-'))return;
    if(!plain(x))throw Error('Invalid game save');
    if(key==='kygo-world-v2'&&(!integer(x.level,100)||x.level<1||!integer(x.coins)||!Array.isArray(x.completed)||x.completed.some(v=>!integer(v,100)||v<1)||!plain(x.settings)||!plain(x.stars)||!Object.values(x.stars).every(v=>integer(v,3))))throw Error('Invalid World save');
    if(key==='kygo-arhipelagul-v1'&&(!integer(x.bones)||!plain(x.stars)||!Object.values(x.stars).every(v=>integer(v,3))||!plain(x.set)||!plain(x.st)||!plain(x.up)))throw Error('Invalid Archipelago save');
    if(key==='kygo-world-v2'){
      for(const [k,min,max] of [['sensitivity',1,100],['speed',0,200],['storySpeed',100,10000],['volume',0,100]])if(x.settings[k]!==undefined&&(!Number.isFinite(Number(x.settings[k]))||Number(x.settings[k])<min||Number(x.settings[k])>max))throw Error('Invalid World settings');
      for(const k of ['skins','album','customCourse'])if(x[k]!==undefined&&!Array.isArray(x[k]))throw Error('Invalid World collection');
      if(x.edition!==undefined&&!['classic','halloween','easter','christmas'].includes(x.edition))throw Error('Invalid World edition');
    }
    if(key==='kygo-arhipelagul-v1'){
      for(const k of ['coat','hat'])if(x[k]!==undefined&&!integer(x[k],5))throw Error('Invalid Archipelago cosmetic');
      for(const k of ['coats','hats'])if(x[k]!==undefined&&(!Array.isArray(x[k])||!x[k].every(v=>integer(v,5))))throw Error('Invalid Archipelago wardrobe');
      if(!Object.values(x.up).every(v=>integer(v,10)))throw Error('Invalid Archipelago upgrade');
    }
    if(key==='kygo-pe-urme-settings'&&(!['ro','en'].includes(x.lang)||!['adventure','walk'].includes(x.mode)||!Number.isFinite(x.speed)||x.speed<.5||x.speed>1.5))throw Error('Invalid Trail settings');
    if(key==='kygo-pe-urme-done'&&!Object.entries(x).every(([k,v])=>['manor','arena'].includes(k)&&plain(v)&&integer(v.stars,3)&&Number.isFinite(v.time)&&v.time>=0))throw Error('Invalid Trail progress');
    if(key.startsWith('kygo-pe-urme-v2-')&&(!Array.isArray(x.tasks)||!x.tasks.every(t=>integer(t,10000)||Array.isArray(t)&&t.every(v=>Array.isArray(v)&&v.length===3&&[0,1].includes(v[0])&&[0,1].includes(v[1])&&Number.isInteger(v[2])&&v[2]>=-1&&v[2]<=100))||!Number.isFinite(x.elapsed)||x.elapsed<0))throw Error('Invalid Trail run');
  }
  function backup(storage,state) { const saves={}; for(const k of SAVE_KEYS)saves[k]=storage.getItem(k);return {format:'kygo-universe-backup',version:VERSION,created:new Date().toISOString(),passport:validate(state),saves}; }
  function parseBackup(text) { if(typeof text!=='string'||text.length>8000000)throw Error('Backup too large');const x=JSON.parse(text);if(!plain(x)||x.format!=='kygo-universe-backup'||x.version!==VERSION||!plain(x.saves)||!safeTree(x))throw Error('Invalid backup');validate(x.passport);if(Object.keys(x.saves).length!==SAVE_KEYS.length)throw Error('Incomplete backup');for(const k of SAVE_KEYS){if(!Object.hasOwn(x.saves,k))throw Error('Missing save');validateSave(k,x.saves[k]);}return x; }
  function restore(storage, data) { const x=parseBackup(JSON.stringify(data)), before={};for(const k of [KEY,...SAVE_KEYS])before[k]=storage.getItem(k);try{for(const k of SAVE_KEYS)x.saves[k]===null?storage.removeItem(k):storage.setItem(k,x.saves[k]);save(storage,x.passport);}catch(e){for(const k of [KEY,...SAVE_KEYS])try{before[k]===null?storage.removeItem(k):storage.setItem(k,before[k]);}catch{}throw e;} }
  const SLOT_KEY='kygo-universe-profiles-v1';
  function profiles(storage) {try{const x=JSON.parse(storage.getItem(SLOT_KEY)||'null');if(!plain(x)||!['one','two','three'].includes(x.active)||!plain(x.slots))throw Error();for(const [id,s] of Object.entries(x.slots)){if(!['one','two','three'].includes(id))throw Error();parseBackup(JSON.stringify(s));}return x;}catch{return {active:'one',slots:{}};} }
  function switchProfile(storage,id) {
    if(!['one','two','three'].includes(id))throw Error('Invalid slot');
    const all=profiles(storage);if(id===all.active)return false;
    const current=backup(storage,load(storage));parseBackup(JSON.stringify(current));all.slots[all.active]=current;
    const target=all.slots[id]||{...backup(storage,fresh()),saves:Object.fromEntries(SAVE_KEYS.map(k=>[k,null]))};
    const previous=storage.getItem(SLOT_KEY);all.active=id;
    storage.setItem(SLOT_KEY,JSON.stringify(all));
    try{restore(storage,target);}catch(e){try{previous===null?storage.removeItem(SLOT_KEY):storage.setItem(SLOT_KEY,previous);}catch{}throw e;}return true;
  }
  const api={VERSION,KEY,IDS,SAVE_KEYS,SLOT_KEY,fresh,validate,load,save,record,achievements,claim,buy,day,week,seed,backup,parseBackup,restore,profiles,switchProfile};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.KygoCore=api;
})(typeof window!=='undefined'?window:globalThis);
