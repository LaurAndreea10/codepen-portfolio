import { maxCandy, bestRoute, compareStrategies } from './candy.js';
import { copy } from './i18n.js';
import { LEVELS, STORAGE_KEY, freshState, validateState, migrateV1, dailyStreet, localDay, unlocked, award, parseShared, shareHash } from './game.js';
const $=id=>document.getElementById(id);
let state=freshState(),history=[],hintIndex=-1,sound=false,audio,step=0,timer=null,tutorialStep=0,noticeKey='',transient='',storageFailed=false,routeVisible=false,comparisonOpen=false,matrixOpen=false;
try{const saved=localStorage.getItem(STORAGE_KEY);state=saved?validateState(JSON.parse(saved)):migrateV1(JSON.parse(localStorage.getItem('laurai-candy-v1')));}catch{}
const a=()=>state.attempt,t=()=>copy[state.lang];
function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));storageFailed=false;}catch{storageFailed=true;}$('storage-status').textContent=storageFailed?t().storageError:'';}
function stop(){if(timer!==null)clearInterval(timer);timer=null;}
function focusStage(){$('session-title').focus();}
function load(street,mode='classic',kind='free',level=1,day=''){
 stop();history=[];hintIndex=-1;step=0;tutorialStep=0;routeVisible=false;comparisonOpen=false;matrixOpen=false;transient='';noticeKey='';$('error').textContent='';$('share-box').hidden=true;
 if(location.hash.startsWith('#street=')){try{window.history.replaceState(null,'',location.pathname+location.search);}catch{}}
 state.attempt={kind,level,day,mode,street:[...street],picked:[],hinted:false,revealed:false,credited:false};
 $('length').value=street.length;$('values').value=street.join(', ');render();focusStage();
}
function loadLevel(id){if(unlocked(state.progress,id)){const l=LEVELS[id-1];load(l.street,l.mode,'campaign',id);}}
function blocked(i){const p=new Set(a().picked);return p.has(i-1)||p.has(i+1)||(a().mode==='circle'&&a().street.length>1&&((i===0&&p.has(a().street.length-1))||(i===a().street.length-1&&p.has(0))));}
function result(){return bestRoute(a().street,a().mode==='circle');}
function total(){return a().picked.reduce((sum,i)=>sum+a().street[i],0);}
function checkpoint(){history.push([...a().picked]);if(history.length>100)history.shift();}
function tone(){if(!sound)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();void audio.resume().catch(()=>{});const o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.frequency.value=660;g.gain.setValueAtTime(.04,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.12);o.start();o.stop(audio.currentTime+.12);}catch{}}
function evaluate(){if(total()===result().total)award(state);}
function select(i){
 if(a().kind==='tutorial'){
  if(tutorialStep===0&&i===0){a().picked=[0];tutorialStep=1;}
  else if(tutorialStep===1&&i===1){tutorialStep=2;}
  else if(tutorialStep===2&&i===2){a().picked=[0,2];tutorialStep=3;state.tutorialDone=true;}
  render();return;
 }
 if(!a().picked.includes(i)&&blocked(i)){transient='blocked';render();return;}
 checkpoint();a().picked=a().picked.includes(i)?a().picked.filter(j=>j!==i):[...a().picked,i];hintIndex=-1;transient='';tone();evaluate();render();
}
function recordLabel(r){return r?.stars?'★'.repeat(r.stars):r?.practiced?t().practiced:t().notPlayed;}
function renderCampaign(){
 const completed=Object.values(state.progress).filter(r=>r.stars||r.practiced).length;
 const stars=Object.values(state.progress).reduce((s,r)=>s+r.stars,0);
 $('campaign-progress').value=completed;$('campaign-progress').setAttribute('aria-label',t().progress);$('progress-label').textContent=`${completed} / 30 · ${stars} / 90 ${t().stars}`;
 const previous=Number($('level-select').value)||1;
 const options=LEVELS.map(l=>{const o=document.createElement('option');o.value=l.id;o.disabled=!unlocked(state.progress,l.id);o.textContent=`${t().level} ${l.id} · ${recordLabel(state.progress[l.id])}${o.disabled?' 🔒':''}`;return o;});
 $('level-select').replaceChildren(...options);$('level-select').value=a().kind==='campaign'?a().level:(unlocked(state.progress,previous)?previous:1);
 $('level-grid').replaceChildren(...LEVELS.map(l=>{const b=document.createElement('button');b.type='button';b.disabled=!unlocked(state.progress,l.id);b.textContent=`${l.id} · ${recordLabel(state.progress[l.id])}`;b.setAttribute('aria-label',`${t().level} ${l.id}: ${recordLabel(state.progress[l.id])}${b.disabled?', '+t().lockedLevel:''}`);if(a().kind==='campaign'&&a().level===l.id)b.setAttribute('aria-current','step');b.onclick=()=>loadLevel(l.id);return b;}));
}
function renderSteps(){
 const r=result(),shown=r.steps.slice(0,step);
 $('circle-note').textContent=a().mode==='circle'?t().circularNote:'';
 const current=shown.at(-1);
 $('step-message').textContent=current?t().stepText.replace('{house}',current.index+1).replace('{take}',current.take).replace('{skip}',current.skip).replace('{best}',current.best):t().stepStart;
 $('step-position').textContent=t().stepPosition.replace('{current}',step).replace('{total}',r.steps.length);
 $('steps').replaceChildren(...shown.map((s,i)=>{const tr=document.createElement('tr');if(i===shown.length-1)tr.className='current-step';for(const value of [s.index+1,s.take,s.skip,s.best]){const td=document.createElement('td');td.textContent=value;tr.append(td);}return tr;}));
 $('step-back').disabled=step===0;$('step-next').disabled=step>=r.steps.length;$('step-play').textContent=timer===null?t().playSteps:t().pauseSteps;$('step-play').disabled=step>=r.steps.length&&timer===null;
}
function render(){
 const c=t();document.documentElement.lang=state.lang;
 for(const [key,cls] of [['light','light'],['contrast','contrast'],['still','still']])document.body.classList.toggle(cls,state[key]);
 document.querySelectorAll('[data-t]').forEach(el=>el.textContent=c[el.dataset.t]??el.dataset.t);
 $('lang').textContent=state.lang==='ro'?'EN':'RO';$('lang').setAttribute('aria-label',state.lang==='ro'?'Switch to English':'Schimbă în română');$('theme').setAttribute('aria-label',state.lang==='ro'?'Temă luminoasă':'Light theme');
 for(const [id,active] of [['theme',state.light],['contrast',state.contrast],['motion',state.still],['sound',sound]])$(id).setAttribute('aria-pressed',String(active));
 for(const id of ['free','daily','tutorial'])$(id).setAttribute('aria-pressed',String(a().kind===id));
 $('mode').value=a().mode;$('mode').disabled=a().kind!=='free';$('length').disabled=a().kind!=='free';$('new-street').disabled=a().kind!=='free';
 $('tutorial-panel').hidden=a().kind!=='tutorial';$('tutorial-text').textContent=c['tutorial'+tutorialStep];$('finish-tutorial').disabled=tutorialStep!==3;
 let title=c.free;if(a().kind==='campaign')title=`${c.level} ${a().level} / 30`;if(a().kind==='daily')title=`${c.daily} · ${a().day}`;if(a().kind==='tutorial')title=c.tutorial;
 $('session-title').textContent=title;$('street').setAttribute('aria-label',title);
 $('attempt-status').textContent=a().revealed?c.revealed:a().kind==='daily'&&a().day!==localDay()?c.dayOld:c.howStars;
 $('street-wrap').classList.toggle('loop',a().mode==='circle');
 const bestIndices=new Set(routeVisible?result().indices:[]);
 const focusIndex=document.activeElement?.dataset.index;
 $('street').replaceChildren(...a().street.map((n,i)=>{
  const b=document.createElement('button'),picked=a().picked.includes(i),locked=!picked&&blocked(i),study=result().steps[step-1]?.index===i;
  b.type='button';b.className='house'+(locked?' blocked':'')+(hintIndex===i?' hinted':'')+(study?' studying':'')+(n<0?' trick':'')+(bestIndices.has(i)?' best-route':'');b.dataset.index=i;b.setAttribute('aria-pressed',String(picked));b.setAttribute('aria-disabled',String(locked));
  b.setAttribute('aria-label',`${c.visit} ${i+1}, ${n} ${c.candy}, ${c[picked?'selected':locked?'locked':'available']}${bestIndices.has(i)?', '+c.optimalMark:''}`);
  b.innerHTML=`<span class="number">${c.house} ${i+1}</span><span class="icon" aria-hidden="true"><span class="door"></span><span class="window one"></span><span class="window two"></span></span><span class="amount">${n} <span class="candy-dot" aria-hidden="true"></span></span><span class="zero-index" aria-hidden="true">#${i}</span>`;b.onclick=()=>select(i);return b;
 }));
 if(focusIndex!==undefined)$('street').querySelector(`[data-index="${focusIndex}"]`)?.focus();
 const best=a().mode==='circle'?result().total:maxCandy(a().street),yours=total();$('yours').textContent=yours;$('best').textContent=best;$('wins').textContent=state.wins;
 $('message').textContent=transient?c[transient]:hintIndex>=0?c.hinted:yours===best?(a().revealed?c.shown:a().hinted?c.hintGrade:c.won):c.playing;
 $('rule').textContent=a().mode==='circle'?c.circleRule:a().mode==='tricks'?c.negative:c.rule;
 $('undo').disabled=!history.length||a().kind==='tutorial';$('clear').disabled=!a().picked.length||a().kind==='tutorial';
 for(const id of ['hint','solve','check','retry','overlay-route','compare-strategies','show-matrix'])$(id).disabled=a().kind==='tutorial';
 $('next-level').hidden=a().kind!=='campaign';$('next-level').disabled=a().level===30||!unlocked(state.progress,a().level+1);
 if(a().kind==='campaign'&&a().level===30&&(state.progress[30]?.stars||state.progress[30]?.practiced))$('message').textContent=c.campaignFinished;
 $('notice').textContent=noticeKey?c[noticeKey]:'';
 renderCampaign();renderSteps();renderLab();persist();
}
function generate(){const raw=Number($('length').value),n=Number.isFinite(raw)?Math.max(1,Math.min(40,Math.trunc(raw))):8;const mode=$('mode').value;load(Array.from({length:n},()=>mode==='tricks'?Math.floor(Math.random()*21)-6:Math.floor(Math.random()*10)+1),mode);}
function reveal(){a().revealed=true;}
function advance(){if(step>=result().steps.length){stop();render();return;}reveal();step++;if(step>=result().steps.length)stop();render();}
function renderLab(){
 const c=t();
 document.querySelectorAll('.table-wrap').forEach(el=>{el.tabIndex=0;el.setAttribute('role','region');el.setAttribute('aria-label',el.closest('#matrix-results')?c.matrix:el.closest('#strategy-results')?c.strategyTitle:c.table);});
 $('overlay-route').textContent=routeVisible?c.hideRoute:c.overlayRoute;
 $('overlay-route').setAttribute('aria-pressed',String(routeVisible));
 $('strategy-results').hidden=!comparisonOpen;$('matrix-results').hidden=!matrixOpen;
 $('compare-strategies').textContent=comparisonOpen?c.hideCompare:c.compare;
 $('compare-strategies').setAttribute('aria-expanded',String(comparisonOpen));
 $('show-matrix').textContent=matrixOpen?c.hideMatrix:c.showMatrix;
 $('show-matrix').setAttribute('aria-expanded',String(matrixOpen));
 if(comparisonOpen){
  const labels={dp:c.dpMethod,memo:c.memoMethod,brute:c.bruteMethod,alternate:c.alternateMethod,greedy:c.greedyMethod};
  $('comparison-note').textContent=a().mode==='circle'?c.circleCompare:c.negativeCompare;
  $('strategy-rows').replaceChildren(...compareStrategies(a().street,a().mode==='circle').map(row=>{
   const tr=document.createElement('tr');tr.dataset.strategy=row.id;
   const label=document.createElement('th');label.scope='row';label.textContent=labels[row.id];tr.append(label);
   for(const value of [row.total===null?c.bruteLimit:row.total,row.gap===null?'—':row.gap,row.exact?c.exact:c.heuristic]){const cell=document.createElement('td');cell.textContent=value;tr.append(cell);}
   tr.className=row.gap===0?'strategy-match':row.gap>0?'strategy-loss':'';return tr;
  }));
 }
 if(matrixOpen){
  const steps=result().steps,table=$('take-skip-matrix');table.replaceChildren();
  const caption=document.createElement('caption');caption.textContent=c.matrix;table.append(caption);
  const head=document.createElement('thead'),headRow=document.createElement('tr'),corner=document.createElement('th');corner.scope='col';corner.textContent=c.caseLabel;headRow.append(corner);
  for(const s of steps){const th=document.createElement('th');th.scope='col';th.textContent=`#${s.index} · ${s.candy}`;headRow.append(th);}head.append(headRow);table.append(head);
  const body=document.createElement('tbody');
  for(const [key,label] of [['take',c.take],['skip',c.skip]]){const tr=document.createElement('tr'),th=document.createElement('th');th.scope='row';th.textContent=label;tr.append(th);for(const s of steps){const td=document.createElement('td');td.textContent=s[key];if(s[key]>=s[key==='take'?'skip':'take'])td.className='matrix-win';tr.append(td);}body.append(tr);}table.append(body);
 }
}
$('new-street').onclick=generate;$('mode').onchange=generate;
$('free').onclick=()=>load([2,7,9,3,1,4,2,6]);
$('daily').onclick=()=>{const day=localDay();load(dailyStreet(day),'classic','daily',1,day);};
$('tutorial').onclick=()=>load([4,5,4],'classic','tutorial');
$('finish-tutorial').onclick=()=>loadLevel(1);$('exit-tutorial').onclick=()=>load([2,7,9,3,1]);
$('load-level').onclick=()=>loadLevel(Number($('level-select').value));$('next-level').onclick=()=>loadLevel(a().level+1);
$('retry').onclick=()=>{const old=a();load(old.street,old.mode,old.kind,old.level,old.day);if(old.kind==='free'){a().credited=old.credited;render();}};
$('lang').onclick=()=>{state.lang=state.lang==='ro'?'en':'ro';$('error').textContent='';render();};
for(const [id,key] of [['theme','light'],['contrast','contrast'],['motion','still']])$(id).onclick=()=>{state[key]=!state[key];if(key==='still'&&state.still)stop();render();};
$('sound').onclick=()=>{sound=!sound;tone();render();};
$('undo').onclick=()=>{if(history.length){a().picked=history.pop();hintIndex=-1;transient='';render();}};
$('clear').onclick=()=>{checkpoint();a().picked=[];hintIndex=-1;transient='';render();};
$('overlay-route').onclick=()=>{routeVisible=!routeVisible;if(routeVisible)reveal();render();};
$('compare-strategies').onclick=()=>{comparisonOpen=!comparisonOpen;if(comparisonOpen)reveal();render();};
$('show-matrix').onclick=()=>{matrixOpen=!matrixOpen;if(matrixOpen)reveal();render();};
$('solve').onclick=()=>{checkpoint();reveal();a().picked=result().indices;hintIndex=-1;transient='';evaluate();render();};
$('hint').onclick=()=>{a().hinted=true;hintIndex=result().indices.find(i=>!a().picked.includes(i))??-1;transient='';render();};
$('check').onclick=()=>{evaluate();transient=total()===result().total?(a().revealed?'revealed':a().hinted?'hintGrade':'perfectGrade'):'noneSelected';render();};
$('step-next').onclick=advance;$('step-back').onclick=()=>{stop();step=Math.max(0,step-1);render();};$('step-reset').onclick=()=>{stop();step=0;render();};
$('step-play').onclick=()=>{if(timer!==null){stop();render();return;}advance();if(step<result().steps.length)timer=setInterval(advance,1500);render();};
$('explanation').addEventListener('toggle',()=>{if(!$('explanation').open){stop();renderSteps();}});
$('example').onclick=()=>load([5,1,1,5]);
$('editor').onsubmit=e=>{e.preventDefault();const tokens=$('values').value.split(',').map(s=>s.trim()),values=tokens.map(Number),mode=$('mode').value;if(tokens.some(s=>!/^[-+]?\d+$/.test(s))||values.length<1||values.length>40||values.some(n=>!Number.isInteger(n)||n<(mode==='tricks'?-99:0)||n>99)){$('error').textContent=t().invalid;return;}load(values,mode);};
$('export').onclick=()=>{persist();const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='candy-route-backup-'+localDay()+'.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);noticeKey='exported';render();};
$('import-file').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>1000000)throw Error('Too large');const validated=validateState(JSON.parse(await file.text()));stop();state=validated;history=[];step=0;hintIndex=-1;routeVisible=false;comparisonOpen=false;matrixOpen=false;tutorialStep=0;transient='';$('share-box').hidden=true;$('values').value=a().street.join(', ');$('length').value=a().street.length;noticeKey='importOk';}catch{noticeKey='importError';}e.target.value='';render();};
$('share').onclick=()=>{const url=new URL(location.href);url.hash=shareHash(a());$('share-url').value=url.href;$('share-box').hidden=false;noticeKey=location.protocol==='file:'?'shareLocal':'copyManual';render();};
$('copy-link').onclick=async()=>{try{if(!navigator.clipboard)throw Error('No clipboard');await navigator.clipboard.writeText($('share-url').value);noticeKey='copied';}catch{$('share-url').focus();$('share-url').select();noticeKey='copyManual';}render();};
$('reset-progress').onclick=()=>{$('reset-dialog').returnValue='';$('reset-dialog').showModal();};
$('reset-dialog').addEventListener('close',()=>{if($('reset-dialog').returnValue!=='reset')return;const old=state;state=freshState();for(const key of ['lang','light','contrast','still'])state[key]=old[key];try{localStorage.removeItem('laurai-candy-v1');}catch{}stop();history=[];step=0;hintIndex=-1;tutorialStep=0;routeVisible=false;comparisonOpen=false;matrixOpen=false;transient='';noticeKey='resetDone';$('values').value=a().street.join(', ');$('length').value=a().street.length;render();});
function shared(){if(!location.hash.startsWith('#street='))return;try{if(location.hash.length>4000)throw Error('Too large');const payload=parseShared(location.hash);load(payload.street,payload.mode);noticeKey='sharedLoaded';render();}catch{noticeKey='invalidShare';render();}}
window.addEventListener('hashchange',shared);document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();renderSteps();}});
document.querySelector('a[href="#campaign"]').onclick=()=>{$('campaign').open=true;};
if(a().kind==='tutorial')tutorialStep=a().picked.includes(2)?3:a().picked.includes(0)?1:0;
const requestedLang=new URLSearchParams(location.search).get('lang');if(['ro','en'].includes(requestedLang))state.lang=requestedLang;
$('length').value=a().street.length;$('values').value=a().street.join(', ');render();shared();
