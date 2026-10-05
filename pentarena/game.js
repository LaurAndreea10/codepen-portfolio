'use strict';
/* PentArena v2.0.0 — five arcade sports on one canvas. No libraries.
   Sections: core · i18n · audio · fx · input · sports (basket, football, hockey, volley, pool) · progression · UI. */
(function(root){
const VERSION='2.0.0';
const W=960,H=600,TAU=Math.PI*2;
const clamp=(v,a,b)=>v<a?a:v>b?b:v,rand=(a,b)=>a+Math.random()*(b-a),hyp=Math.hypot;
function gauss(){let u=0,v=0;while(!u)u=Math.random();while(!v)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(TAU*v);}
const HAS_DOM=typeof document!=='undefined'&&typeof document.getElementById==='function'&&typeof document.createElement==='function'&&!!root.requestAnimationFrame;
const now=()=>(typeof performance!=='undefined'?performance.now():Date.now());
const C={cyan:'#3fd0e0',amber:'#f5b041',coral:'#ff7a6b',ink:'#e7eef7',navy:'#0a1322',good:'#5fe08a',mute:'#9db0c8',lime:'#a3e635',violet:'#a78bfa',ice:'#e0f2fe'};
const SPORT_KEYS=['basket','football','hockey','volley','billiards'];
const DIFFS={easy:{D:.75,A:.6},normal:{D:1,A:1},hard:{D:1.3,A:1.45}};
const LEAGUES=[
  {id:'bronze',D:.8,A:.65,len:0,mods:false,reward:250,xp:300,col:'#d9935a',rival:'Radu'},
  {id:'silver',D:1.05,A:1.05,len:1,mods:true,reward:400,xp:500,col:'#c6cfdb',rival:'Ioana'},
  {id:'gold',D:1.3,A:1.5,len:1,mods:true,reward:700,xp:800,col:'#f5c542',rival:'Kairos'}];
const SKINS=[{id:'cyan',col:'#3fd0e0',price:0},{id:'coral',col:'#ff7a6b',price:150},{id:'lime',col:'#a3e635',price:220},{id:'violet',col:'#a78bfa',price:300},{id:'ice',col:'#e0f2fe',price:400},{id:'prism',col:null,price:700}];
const TRAILS=[{id:'none',price:0},{id:'comet',price:200},{id:'spark',price:350}];
const ACHS=['first','swish','shut','hard','penta','champ','clean','mara','spike','power','golden','duo','run','daily3','league','legend'];
/* match config: D = AI speed, A = AI accuracy, mods = modifiers, len 0..2, two = local 2-player */
let M={D:1,A:1,mods:true,len:1,two:false,rival:null};

/* ================= i18n ================= */
const I18N={
ro:{skip:'Sari la conținut',heroA:'Cinci probe.',heroB:'Un singur campion.',heroSub:'Baschet, fotbal, air hockey, volei și biliard împotriva unui AI sau a unui prieten pe același dispozitiv. Urcă prin trei ligi, deblochează echipament și întoarce-te zilnic pentru o provocare nouă.',
tag1:'5 sporturi',tag2:'Carieră în 3 ligi',tag3:'1–2 jucători',tag4:'Offline · RO/EN',
level:'Nivel',xpOf:(a,b)=>`${a} / ${b} XP`,coinsN:n=>`${n} monede`,diff:'Dificultate',easy:'Ușor',normal:'Normal',hard:'Greu',players:'Jucători',pl1:'1 jucător',pl2:'2 jucători',
startTour:'Start turneu Pentatlon',tourLen:'5 probe',wins:'Victorii',tours:'Turnee',achs:'Realizări',
daily:'Provocarea zilei',dailyAccept:'Acceptă',dailyDone:'Completată azi. Revino mâine pentru una nouă.',dailyReward:'Recompensă: 120 monede și 150 XP',
cond_score:n=>`Câștigă și înscrie cel puțin ${n} puncte.`,cond_margin:n=>`Câștigă la o diferență de cel puțin ${n} goluri.`,cond_conceded:n=>`Câștigă primind cel mult ${n} goluri.`,cond_spikes:n=>`Câștigă cu cel puțin ${n} lovituri spike.`,cond_win:()=>'Câștigă partida.',
pick:'Alege proba',pickSub:'Meci rapid cu setările de mai sus. În modul 2 jucători, fiecare probă se joacă pe același ecran.',event:'Proba',play:'Joacă',newIn:'Nou în v2',
career:'Carieră',careerSub:'Fiecare ligă e un pentatlon contra unui rival cu stil propriu. Strânge mai multe puncte decât el (3 pentru victorie, 1 pentru egal) ca să deblochezi liga următoare.',
league_bronze:'Liga de Bronz',league_silver:'Liga de Argint',league_gold:'Liga de Aur',
rd_bronze:'Radu „Rapidul” aleargă mult, dar țintește aproximativ. Meciuri scurte, fără modificatori.',rd_silver:'Ioana Vortex joacă echilibrat și precis. Modificatori activi: vânt, coș mobil, bonusuri pe masă.',rd_gold:'Maestrul Kairos citește jocul și nu iartă greșelile. Viteză și precizie maxime.',
locked:'Blocată',open:'Deschisă',won:'Câștigată',playLeague:'Joacă liga',replayLeague:'Rejoacă liga',leagueReward:(c,x)=>`Premiu: ${c} monede, ${x} XP`,
foot:'Progresul rămâne pe acest dispozitiv. Construit cu canvas și Web Audio, fără biblioteci.',portfolio:'Portofoliu',history:'Istoric versiuni',
stats:'Statistici',shop:'Vestiar',help:'Controale',settings:'Setări',backup:'Backup',close:'Închide',
you:'TU',p1n:'J1',p2n:'J2',ai:'AI',paused:'Pauză',pauseKeys:'Esc sau P reia jocul.',resume:'Continuă',restart:'Reia meciul',menu:'Meniu',next:'Următoarea probă',final:'Vezi clasamentul',rematch:'Revanșă',
win:'Victorie!',loss:'Înfrângere',draw:'Egal',p1win:'Câștigă J1!',p2win:'Câștigă J2!',champ:'Campion Pentatlon!',tourLoss:'Trofeul pleacă',tourDraw:'Turneu egal',leagueWon:'Liga e a ta!',leagueLost:'Liga rămâne de câștigat',points:'puncte',total:'Total',
kick:'ȘUT',sprint:'SPRINT',jump:'SARI',rotate:'Rotește telefonul pentru un teren mai mare.',
firstTo:'Primul la',goal:'GOL!',goldenGoal:'Gol de aur',point:'Punct',foul:'Fault!',again:'Mai joci o dată',breakShot:'Spargerea',openTable:'Masă deschisă',solid:'plin',stripe:'dungi',
yourTurn:'Rândul tău',aiTurn:'Aruncă adversarul',p1Turn:'Rândul lui J1',p2Turn:'Rândul lui J2',spot:'Poziția',ball:'Mingea',money:'minge de aur ×2',overtime:'Prelungiri',touches:'4 atingeri!',
shotClock:'TIMP!',windL:'Vânt ←',windR:'Vânt →',moving:'Coș mobil',replay:'RELUARE',skipReplay:'Sari peste reluare',spike:'SPIKE!',ace:'AS!',saved:'Apărat!',
bih:'Bilă în mână',bihHint:'Trage bila albă unde vrei, apoi țintește.',spin:'Efect',spin_f:'Urmărire',spin_s:'Stop',spin_d:'Retragere',
pu_boost:'Șut turbo',pu_shield:'Scut',pu_big:'Crosă mare',pu_freeze:'Îngheț',
basket:'Baschet',football:'Fotbal',hockey:'Air Hockey',volley:'Volei',billiards:'Biliard',
d_basket:'Duel de aruncări pe poziții, cu mingea de aur ×2 și bonus pentru swish.',d_football:'Unu la unu cu portari automați, sprint și șut încărcat.',d_hockey:'Pucul ricoșează fără milă, iar bonusurile apar pe masă.',d_volley:'Volei pe plajă cu maximum 3 atingeri și lovituri spike la fileu.',d_billiards:'8-ball cu efect pe bila albă și bilă în mână după fault.',
n_basket:'Vânt, coș mobil, ceas de aruncare',n_football:'Sprint, șut încărcat, gol de aur',n_hockey:'4 bonusuri: turbo, scut, crosă mare, îngheț',n_volley:'Spike, așii din serviciu, raliuri',n_billiards:'Efect: urmărire, stop, retragere',
c_basket:'Trage înapoi și eliberează · tastatură: ↑↓ unghi, ține Space',c_football:'WASD/săgeți · Shift sprint · ține Space pentru șut puternic · atingere scurtă = șut',c_hockey:'Mouse sau deget mută crosa · tastatură: WASD/săgeți',c_volley:'A/D sau ține pe teren · W/Space/atingere = săritură · lovește în aer lângă fileu pentru spike',c_billiards:'Țintește, trage înapoi, eliberează · ←→ țintă (Shift fin) · ↑↓ efect · ține Space',
c2:'J1: W A S D + Space (Shift sprint) · J2: săgeți + Enter (Shift dreapta sprint) · pe ecran tactil, fiecare își folosește jumătatea de teren',c2turns:'Jucătorii aruncă pe rând cu aceleași controale.',
matchStats:'Statistica meciului',st_shots:'Șuturi',st_poss:'Posesie',st_saves:'Parade',st_acc:'Aruncări reușite',st_swish:'Swish',st_spikes:'Spike-uri',st_rally:'Cel mai lung raliu',st_aces:'Ași',st_top:'Viteză maximă puc',st_power:'Bonusuri luate',st_potted:'Bile băgate',st_fouls:'Faulturi',st_run:'Cea mai lungă serie',
xpGain:n=>`+${n} XP`,coinGain:n=>`+${n} monede`,levelUp:n=>`Nivel nou: ${n}!`,dailyOk:'Provocarea zilei completată!',dailyFail:'Provocarea zilei nu a fost îndeplinită.',newAch:'Realizări noi',
played:'Meciuri',wS:'V',lS:'Î',dS:'E',winRate:'Procent victorii',scored:'Marcate',conceded:'Primite',bestStreak:'Serie maximă',noStats:'Joacă primul meci ca să apară statisticile.',extras:'Momente',
skins:'Culoarea ta',trails:'Urma mingii',buy:p=>`Cumpără · ${p}`,equip:'Folosește',equipped:'Folosit acum',notEnough:'Nu ai destule monede.',bought:'Cumpărat și echipat.',
skin_cyan:'Cian',skin_coral:'Coral',skin_lime:'Lime',skin_violet:'Violet',skin_ice:'Gheață',skin_prism:'Prismă',trail_none:'Fără urmă',trail_comet:'Cometă',trail_spark:'Scântei',
length:'Durata meciului',len0:'Scurt',len1:'Standard',len2:'Lung',mods:'Modificatori (vânt, coș mobil, bonusuri, gol de aur)',modsHelp:'Cariera folosește regulile ligii, indiferent de această setare.',replays:'Reluări la goluri și puncte spectaculoase',sound:'Sunet',volume:'Volum',contrast:'Contrast ridicat',motion:'Mișcare redusă (fără tremurat și particule)',
backupHelp:'Salvează progresul într-un fișier JSON sau încarcă unul exportat anterior. Fișierul este verificat înainte de aplicare.',exportBackup:'Exportă progresul',importBackup:'Alege fișierul de backup',applyBackup:'Aplică backup-ul',backupOk:'Fișier valid. Apasă „Aplică” pentru a-l folosi.',backupBad:e=>`Fișier respins: ${e}`,backupDone:'Progres restaurat.',
helpIntro:'Toate probele merg cu tastatura, mouse-ul sau atingerea. Esc ori P pune pauză.',
achUnlocked:'Realizare deblocată:',
a_first:'Prima victorie',ad_first:'Câștigă orice meci',a_swish:'Swish',ad_swish:'Înscrie la baschet fără să atingi inelul',a_shut:'Poartă închisă',ad_shut:'Câștigă la fotbal sau air hockey fără gol primit',a_hard:'Fără milă',ad_hard:'Câștigă un meci pe Greu',
a_penta:'Pentatlonist',ad_penta:'Câștigă măcar o dată la fiecare sport',a_champ:'Campion',ad_champ:'Câștigă turneul Pentatlon',a_clean:'Masă curată',ad_clean:'Câștigă la biliard fără ca adversarul să bage vreo bilă',a_mara:'Maratonist',ad_mara:'Joacă 25 de meciuri',
a_spike:'Ciocanul',ad_spike:'Fă 4 spike-uri într-un meci de volei',a_power:'Colecționar',ad_power:'Ia 3 bonusuri într-un meci de air hockey',a_golden:'Aur curat',ad_golden:'Câștigă cu gol de aur',a_duo:'În doi',ad_duo:'Joacă un meci în modul 2 jucători',
a_run:'Serie',ad_run:'Bagă 4 bile într-o singură tură',a_daily3:'Fidel',ad_daily3:'Completează 3 provocări zilnice',a_league:'Promovat',ad_league:'Câștigă o ligă',a_legend:'Legendă',ad_legend:'Câștigă Liga de Aur'},
en:{skip:'Skip to content',heroA:'Five events.',heroB:'One champion.',heroSub:'Basketball, football, air hockey, volleyball and pool against an AI or a friend on the same device. Climb three leagues, unlock gear and come back daily for a new challenge.',
tag1:'5 sports',tag2:'3-league career',tag3:'1–2 players',tag4:'Offline · RO/EN',
level:'Level',xpOf:(a,b)=>`${a} / ${b} XP`,coinsN:n=>`${n} coins`,diff:'Difficulty',easy:'Easy',normal:'Normal',hard:'Hard',players:'Players',pl1:'1 player',pl2:'2 players',
startTour:'Start Pentathlon tournament',tourLen:'5 events',wins:'Wins',tours:'Tournaments',achs:'Achievements',
daily:'Daily challenge',dailyAccept:'Accept',dailyDone:'Completed today. Come back tomorrow for a new one.',dailyReward:'Reward: 120 coins and 150 XP',
cond_score:n=>`Win and score at least ${n} points.`,cond_margin:n=>`Win by at least ${n} goals.`,cond_conceded:n=>`Win conceding at most ${n} goals.`,cond_spikes:n=>`Win with at least ${n} spikes.`,cond_win:()=>'Win the match.',
pick:'Choose an event',pickSub:'Quick match with the settings above. In two-player mode every event is played on the same screen.',event:'Event',play:'Play',newIn:'New in v2',
career:'Career',careerSub:'Each league is a pentathlon against a rival with their own style. Collect more points than them (3 for a win, 1 for a draw) to unlock the next league.',
league_bronze:'Bronze League',league_silver:'Silver League',league_gold:'Gold League',
rd_bronze:'Radu “the Quick” runs a lot but aims loosely. Short matches, no modifiers.',rd_silver:'Ioana Vortex plays balanced and precise. Modifiers on: wind, moving hoop, table power-ups.',rd_gold:'Master Kairos reads the game and punishes every mistake. Top speed and accuracy.',
locked:'Locked',open:'Open',won:'Won',playLeague:'Play league',replayLeague:'Replay league',leagueReward:(c,x)=>`Prize: ${c} coins, ${x} XP`,
foot:'Progress stays on this device. Built with canvas and Web Audio, no libraries.',portfolio:'Portfolio',history:'Version history',
stats:'Stats',shop:'Locker',help:'Controls',settings:'Settings',backup:'Backup',close:'Close',
you:'YOU',p1n:'P1',p2n:'P2',ai:'AI',paused:'Paused',pauseKeys:'Esc or P resumes.',resume:'Resume',restart:'Restart match',menu:'Menu',next:'Next event',final:'See standings',rematch:'Rematch',
win:'Victory!',loss:'Defeat',draw:'Draw',p1win:'P1 wins!',p2win:'P2 wins!',champ:'Pentathlon Champion!',tourLoss:'The trophy leaves',tourDraw:'Tournament tied',leagueWon:'The league is yours!',leagueLost:'League still to be won',points:'points',total:'Total',
kick:'KICK',sprint:'SPRINT',jump:'JUMP',rotate:'Rotate your phone for a bigger field.',
firstTo:'First to',goal:'GOAL!',goldenGoal:'Golden goal',point:'Point',foul:'Foul!',again:'Shoot again',breakShot:'The break',openTable:'Open table',solid:'solids',stripe:'stripes',
yourTurn:'Your turn',aiTurn:'Opponent shooting',p1Turn:'P1 to shoot',p2Turn:'P2 to shoot',spot:'Spot',ball:'Ball',money:'money ball ×2',overtime:'Overtime',touches:'4 touches!',
shotClock:'TIME!',windL:'Wind ←',windR:'Wind →',moving:'Moving hoop',replay:'REPLAY',skipReplay:'Skip replay',spike:'SPIKE!',ace:'ACE!',saved:'Saved!',
bih:'Ball in hand',bihHint:'Drag the cue ball anywhere, then aim.',spin:'Spin',spin_f:'Follow',spin_s:'Stun',spin_d:'Draw',
pu_boost:'Turbo shot',pu_shield:'Shield',pu_big:'Big mallet',pu_freeze:'Freeze',
basket:'Basketball',football:'Football',hockey:'Air Hockey',volley:'Volleyball',billiards:'Pool',
d_basket:'Shooting duel across spots, with a ×2 money ball and a swish bonus.',d_football:'One on one with auto keepers, sprint and charged shots.',d_hockey:'The puck rebounds without mercy and power-ups appear on the table.',d_volley:'Beach volleyball with 3 touches max and spikes at the net.',d_billiards:'8-ball with cue-ball spin and ball in hand after a foul.',
n_basket:'Wind, moving hoop, shot clock',n_football:'Sprint, charged shot, golden goal',n_hockey:'4 power-ups: turbo, shield, big mallet, freeze',n_volley:'Spikes, service aces, rallies',n_billiards:'Spin: follow, stun, draw',
c_basket:'Pull back and release · keyboard: ↑↓ angle, hold Space',c_football:'WASD/arrows · Shift sprint · hold Space for a power shot · quick tap = shoot',c_hockey:'Mouse or finger moves the mallet · keyboard: WASD/arrows',c_volley:'A/D or hold on the court · W/Space/tap = jump · hit in the air near the net to spike',c_billiards:'Aim, pull back, release · ←→ aim (Shift fine) · ↑↓ spin · hold Space',
c2:'P1: W A S D + Space (Shift sprint) · P2: arrows + Enter (right Shift sprint) · on touch screens each player uses their half',c2turns:'Players shoot in turns with the same controls.',
matchStats:'Match stats',st_shots:'Shots',st_poss:'Possession',st_saves:'Saves',st_acc:'Shots made',st_swish:'Swish',st_spikes:'Spikes',st_rally:'Longest rally',st_aces:'Aces',st_top:'Top puck speed',st_power:'Power-ups taken',st_potted:'Balls potted',st_fouls:'Fouls',st_run:'Longest run',
xpGain:n=>`+${n} XP`,coinGain:n=>`+${n} coins`,levelUp:n=>`New level: ${n}!`,dailyOk:'Daily challenge completed!',dailyFail:'Daily challenge not met.',newAch:'New achievements',
played:'Matches',wS:'W',lS:'L',dS:'D',winRate:'Win rate',scored:'Scored',conceded:'Conceded',bestStreak:'Best streak',noStats:'Play your first match to see stats.',extras:'Highlights',
skins:'Your colour',trails:'Ball trail',buy:p=>`Buy · ${p}`,equip:'Equip',equipped:'Equipped',notEnough:'Not enough coins.',bought:'Bought and equipped.',
skin_cyan:'Cyan',skin_coral:'Coral',skin_lime:'Lime',skin_violet:'Violet',skin_ice:'Ice',skin_prism:'Prism',trail_none:'No trail',trail_comet:'Comet',trail_spark:'Sparks',
length:'Match length',len0:'Short',len1:'Standard',len2:'Long',mods:'Modifiers (wind, moving hoop, power-ups, golden goal)',modsHelp:'Career uses each league’s rules regardless of this setting.',replays:'Replays for goals and highlight points',sound:'Sound',volume:'Volume',contrast:'High contrast',motion:'Reduced motion (no shake or particles)',
backupHelp:'Save progress to a JSON file or load one you exported earlier. The file is checked before it is applied.',exportBackup:'Export progress',importBackup:'Choose backup file',applyBackup:'Apply backup',backupOk:'Valid file. Press “Apply” to use it.',backupBad:e=>`File rejected: ${e}`,backupDone:'Progress restored.',
helpIntro:'Every event works with keyboard, mouse or touch. Esc or P pauses.',
achUnlocked:'Achievement unlocked:',
a_first:'First win',ad_first:'Win any match',a_swish:'Swish',ad_swish:'Score in basketball without touching the rim',a_shut:'Clean sheet',ad_shut:'Win football or air hockey without conceding',a_hard:'No mercy',ad_hard:'Win a match on Hard',
a_penta:'Pentathlete',ad_penta:'Win at least once in every sport',a_champ:'Champion',ad_champ:'Win the Pentathlon tournament',a_clean:'Clean table',ad_clean:'Win at pool without the opponent potting a ball',a_mara:'Marathoner',ad_mara:'Play 25 matches',
a_spike:'The Hammer',ad_spike:'Make 4 spikes in one volleyball match',a_power:'Collector',ad_power:'Take 3 power-ups in one air hockey match',a_golden:'Pure gold',ad_golden:'Win with a golden goal',a_duo:'Together',ad_duo:'Play a two-player match',
a_run:'On a run',ad_run:'Pot 4 balls in a single turn',a_daily3:'Loyal',ad_daily3:'Complete 3 daily challenges',a_league:'Promoted',ad_league:'Win a league',a_legend:'Legend',ad_legend:'Win the Gold League'}};
let LANG='ro';
function tr(k,...a){const d=I18N[LANG];let v=d&&d[k]!=null?d[k]:(I18N.en[k]!=null?I18N.en[k]:k);return typeof v==='function'?v(...a):v;}

/* ================= store ================= */
const STORE_KEY='pentarena-v2';
function freshStore(){return{schema:1,xp:0,coins:0,stats:{},ex:{swish:0,spike:0,power:0,potted:0,golden:0,daily:0,duo:0},ach:[],won:[],tours:0,leagues:{bronze:'open',silver:'locked',gold:'locked'},dailyDone:{},skins:['cyan'],skin:'cyan',trails:['none'],trail:'none',
  prefs:{lang:'ro',diff:'normal',players:1,sound:true,vol:70,len:1,mods:true,replay:true,contrast:false,motion:false}};}
let ST=freshStore();
const isNum=v=>typeof v==='number'&&isFinite(v)&&v>=0;
function validateStore(o){
  if(!o||typeof o!=='object'||Array.isArray(o))throw new Error('format');
  if(o.app!=null&&o.app!=='pentarena')throw new Error('app');
  const p=o.progress&&typeof o.progress==='object'?o.progress:o;
  if(p.schema!==1)throw new Error('schema');
  const out=freshStore();
  for(const k of ['xp','coins','tours']){if(!isNum(p[k]))throw new Error(k);out[k]=Math.floor(p[k]);}
  const strArr=(v,k,allowed)=>{if(!Array.isArray(v)||v.some(x=>typeof x!=='string'||(allowed&&!allowed.includes(x))))throw new Error(k);return [...new Set(v)];};
  out.ach=strArr(p.ach,'ach',ACHS);out.won=strArr(p.won,'won',SPORT_KEYS);
  out.skins=strArr(p.skins,'skins',SKINS.map(s=>s.id));if(!out.skins.includes('cyan'))out.skins.unshift('cyan');
  out.trails=strArr(p.trails,'trails',TRAILS.map(s=>s.id));if(!out.trails.includes('none'))out.trails.unshift('none');
  if(!out.skins.includes(p.skin))throw new Error('skin');out.skin=p.skin;if(!out.trails.includes(p.trail))throw new Error('trail');out.trail=p.trail;
  if(!p.leagues||typeof p.leagues!=='object')throw new Error('leagues');
  for(const L of LEAGUES){const v=p.leagues[L.id];if(!['open','locked','won'].includes(v))throw new Error('leagues');out.leagues[L.id]=v;}
  if(!p.ex||typeof p.ex!=='object')throw new Error('ex');for(const k of Object.keys(out.ex)){if(p.ex[k]!=null&&!isNum(p.ex[k]))throw new Error('ex');out.ex[k]=Math.floor(p.ex[k]||0);}
  if(!p.stats||typeof p.stats!=='object')throw new Error('stats');
  for(const [k,s] of Object.entries(p.stats)){if(!SPORT_KEYS.includes(k)||!s||typeof s!=='object')throw new Error('stats');const c={};for(const f of ['p','w','l','d','f','a','streak','best']){if(!isNum(s[f]??0))throw new Error('stats');c[f]=Math.floor(s[f]||0);}out.stats[k]=c;}
  if(!p.dailyDone||typeof p.dailyDone!=='object')throw new Error('dailyDone');
  for(const [k,v] of Object.entries(p.dailyDone)){if(!/^\d{4}-\d{2}-\d{2}$/.test(k)||v!==true)throw new Error('dailyDone');const d=new Date(k+'T12:00:00');if(isNaN(d)||todayKey(d)!==k)throw new Error('dailyDone');out.dailyDone[k]=true;}
  const pr=p.prefs;if(!pr||typeof pr!=='object')throw new Error('prefs');
  if(!['ro','en'].includes(pr.lang))throw new Error('lang');if(!DIFFS[pr.diff])throw new Error('diff');if(![1,2].includes(pr.players))throw new Error('players');if(![0,1,2].includes(pr.len))throw new Error('len');
  for(const k of ['sound','mods','replay','contrast','motion'])if(typeof pr[k]!=='boolean')throw new Error(k);
  if(!isNum(pr.vol)||pr.vol>100)throw new Error('vol');
  out.prefs={lang:pr.lang,diff:pr.diff,players:pr.players,sound:pr.sound,vol:pr.vol,len:pr.len,mods:pr.mods,replay:pr.replay,contrast:pr.contrast,motion:pr.motion};
  return out;}
function exportStore(){return JSON.stringify({app:'pentarena',version:VERSION,exported:new Date().toISOString(),progress:ST},null,2);}
function load(){try{const raw=root.localStorage&&root.localStorage.getItem(STORE_KEY);if(raw)ST=validateStore(JSON.parse(raw));}catch(e){ST=freshStore();}
  if(!(root.localStorage&&root.localStorage.getItem(STORE_KEY))&&HAS_DOM&&root.matchMedia&&root.matchMedia('(prefers-reduced-motion: reduce)').matches)ST.prefs.motion=true;LANG=ST.prefs.lang;}
function save(){try{root.localStorage&&root.localStorage.setItem(STORE_KEY,JSON.stringify(ST));}catch(e){}}

/* ================= progression ================= */
const levelOf=xp=>Math.floor(Math.sqrt(xp/120))+1, xpFor=l=>120*(l-1)*(l-1);
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function todayKey(d=new Date()){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function dailyFor(key){const r=mulberry(parseInt(key.replace(/-/g,''),10));r();const sport=SPORT_KEYS[Math.floor(r()*5)];const diff=r()<.5?'normal':'hard';let cond;
  if(sport==='basket')cond={type:'score',n:5+Math.floor(r()*3)};else if(sport==='football')cond={type:'margin',n:2};else if(sport==='hockey')cond={type:'conceded',n:3};else if(sport==='volley')cond={type:'spikes',n:2};else cond={type:'win',n:0};
  return{key,sport,diff,cond};}
function dailyMet(ch,s,o){if(o<=0)return false;const c=ch.cond;if(c.type==='score')return s.score[0]>=c.n;if(c.type==='margin')return s.score[0]-s.score[1]>=c.n;if(c.type==='conceded')return s.score[1]<=c.n;if(c.type==='spikes')return (s.stats.spikes?s.stats.spikes[0]:0)>=c.n;return true;}
function unlock(id,list){if(ST.ach.includes(id))return false;ST.ach.push(id);if(list)list.push(id);if(HAS_DOM&&UI.ready)toast(`${tr('achUnlocked')} <b>${tr('a_'+id)}</b>`);return true;}
const outcome=s=>s.winner!=null?s.winner:Math.sign(s.score[0]-s.score[1]);
function matchConfig(run,key){const pr=ST.prefs;
  if(run.mode==='career'){const L=LEAGUES.find(l=>l.id===run.league);return{D:L.D,A:L.A,mods:L.mods,len:L.len,two:false,rival:L.rival};}
  if(run.mode==='daily'){const d=DIFFS[run.daily.diff];return{D:d.D,A:d.A,mods:true,len:1,two:false,rival:null};}
  const d=DIFFS[pr.diff];return{D:d.D,A:d.A,mods:pr.mods,len:pr.len,two:pr.players===2,rival:null};}
/* records one finished match; returns everything the result screen needs */
function finishMatch(run,s){const o=outcome(s),k=s.key,res={o,xp:0,coins:0,ach:[],level:null,daily:null,runDone:false};const lv0=levelOf(ST.xp);
  if(M.two){ST.ex.duo++;res.xp=40;res.coins=10;unlock('duo',res.ach);}
  else{const st=ST.stats[k]||(ST.stats[k]={p:0,w:0,l:0,d:0,f:0,a:0,streak:0,best:0});st.p++;st.f+=s.score[0];st.a+=s.score[1];
    if(o>0){st.w++;st.streak++;st.best=Math.max(st.best,st.streak);}else{st.streak=0;if(o<0)st.l++;else st.d++;}
    const mult=(M.D>=1.29?1.5:1)*(run.mode==='career'?1.2:1);res.xp=Math.round((o>0?120:o<0?35:60)*mult+s.score[0]*4);res.coins=Math.round((o>0?40:o<0?8:15)*mult);
    if(o>0){unlock('first',res.ach);if(!ST.won.includes(k))ST.won.push(k);if(M.D>=1.29)unlock('hard',res.ach);if((k==='football'||k==='hockey')&&s.score[1]===0)unlock('shut',res.ach);
      if(k==='billiards'&&s.score[1]===0)unlock('clean',res.ach);if(ST.won.length>=5)unlock('penta',res.ach);if(k==='football'&&s.goldenWin){ST.ex.golden++;unlock('golden',res.ach);}}
    if(run.mode==='daily'){const ok=dailyMet(run.daily,s,o);res.daily=ok;if(ok&&!ST.dailyDone[run.daily.key]){ST.dailyDone[run.daily.key]=true;ST.ex.daily++;res.xp+=150;res.coins+=120;if(ST.ex.daily>=3)unlock('daily3',res.ach);}}}
  const ex=s.stats||{};if(ex.sw)ST.ex.swish+=ex.sw[0];if(ex.spikes)ST.ex.spike+=ex.spikes[0];if(ex.power)ST.ex.power+=ex.power[0];if(ex.potted)ST.ex.potted+=ex.potted[0];
  if(ex.spikes&&ex.spikes[0]>=4)unlock('spike',res.ach);if(ex.power&&ex.power[0]>=3)unlock('power',res.ach);if(ex.run&&ex.run[0]>=4)unlock('run',res.ach);if(ex.sw&&ex.sw[0]>0)unlock('swish',res.ach);
  const played=Object.values(ST.stats).reduce((a,b)=>a+b.p,0)+ST.ex.duo;if(played>=25)unlock('mara',res.ach);
  if(run.mode==='tour'||run.mode==='career'){run.res.push({key:k,o,score:s.score.slice()});res.runDone=run.res.length>=SPORT_KEYS.length;}
  ST.xp+=res.xp;ST.coins+=res.coins;const lv1=levelOf(ST.xp);if(lv1>lv0)res.level=lv1;save();return res;}
function runPoints(run){let p=0,a=0;for(const r of run.res){if(r.o>0)p+=3;else if(r.o<0)a+=3;else{p++;a++;}}return[p,a];}
function finishRun(run){const [p,a]=runPoints(run),out={p,a,champ:p>a,ach:[],xp:0,coins:0,unlocked:null};
  if(run.mode==='tour'&&out.champ&&!M.two){ST.tours++;out.coins=150;out.xp=200;unlock('champ',out.ach);}
  if(run.mode==='career'&&out.champ){const i=LEAGUES.findIndex(l=>l.id===run.league),L=LEAGUES[i];const first=ST.leagues[L.id]!=='won';ST.leagues[L.id]='won';
    if(first){out.coins=L.reward;out.xp=L.xp;}else{out.coins=Math.round(L.reward/4);out.xp=Math.round(L.xp/4);}
    if(LEAGUES[i+1]&&ST.leagues[LEAGUES[i+1].id]==='locked'){ST.leagues[LEAGUES[i+1].id]='open';out.unlocked=LEAGUES[i+1].id;}
    unlock('league',out.ach);if(L.id==='gold')unlock('legend',out.ach);}
  ST.xp+=out.xp;ST.coins+=out.coins;save();return out;}
function buy(kind,id){const list=kind==='skin'?SKINS:TRAILS,item=list.find(i=>i.id===id),own=kind==='skin'?ST.skins:ST.trails;if(!item)return'missing';
  if(!own.includes(id)){if(ST.coins<item.price)return'poor';ST.coins-=item.price;own.push(id);}
  if(kind==='skin')ST.skin=id;else ST.trail=id;save();return'ok';}

/* ================= audio ================= */
let AC=null,MASTER=null;const lastS={};
function ac(){if(!HAS_DOM)return null;if(!AC){try{AC=new (root.AudioContext||root.webkitAudioContext)();MASTER=AC.createGain();MASTER.connect(AC.destination);}catch(e){AC=null;}}if(AC&&AC.state==='suspended')AC.resume();if(MASTER)MASTER.gain.value=ST.prefs.vol/100;return AC;}
function gate(k,ms){const n=now();if(lastS[k]&&n-lastS[k]<ms)return false;lastS[k]=n;return true;}
function tone(f,dur=.08,type='sine',vol=.12,slide=0,delay=0){if(!ST.prefs.sound)return;const a=ac();if(!a)return;const t0=a.currentTime+delay,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t0);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f*slide),t0+dur);g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.0008,t0+dur);o.connect(g).connect(MASTER);o.start(t0);o.stop(t0+dur+.03);}
function noise(dur=.25,vol=.08,f=1500,q=1,delay=0){if(!ST.prefs.sound)return;const a=ac();if(!a)return;const len=Math.max(1,Math.floor(a.sampleRate*dur)),buf=a.createBuffer(1,len,a.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2);const s=a.createBufferSource();s.buffer=buf;const bp=a.createBiquadFilter();bp.type='bandpass';bp.frequency.value=f;bp.Q.value=q;const g=a.createGain();g.gain.value=vol;s.connect(bp).connect(g).connect(MASTER);s.start(a.currentTime+delay);}
const SFX={
  kick(p=.5){if(gate('k',60)){tone(150-p*40,.1,'sine',.2+p*.12,.5);noise(.06,.06+p*.06,900);}},
  hit(s){if(gate('h',35)){tone(220+s*380,.05,'triangle',.08+.14*s);noise(.03,.05+.08*s,2400,2);}},
  wall(){if(gate('w',50))tone(170,.05,'square',.035,.7);},
  rim(){if(gate('r',70)){tone(880,.12,'triangle',.07,.92);tone(1320,.08,'sine',.04);}},
  board(){if(gate('b',70)){noise(.08,.12,600);tone(110,.08,'sine',.12);}},
  bounce(){if(gate('bo',80))tone(95,.1,'sine',.2,.6);},
  swoosh(){noise(.18,.05,3000,.7);},net(){noise(.3,.09,4200,.6);},
  score(){[523,659,784].forEach((f,i)=>tone(f,.16,'square',.05,0,i*.08));},
  goal(){[523,659,784,1047].forEach((f,i)=>tone(f,.2,'square',.055,0,i*.09));noise(1.1,.07,900,.5,.1);},
  concede(){[392,330,262].forEach((f,i)=>tone(f,.22,'sawtooth',.04,0,i*.12));},
  whistle(){tone(2200,.28,'sine',.06);tone(2300,.28,'sine',.04,0,.02);},
  cue(s){tone(160,.06,'triangle',.1+.1*s);noise(.04,.1,1800,1.5);},
  clack(s){if(gate('c',25)){tone(1500+s*900,.035,'sine',.05+.12*s);noise(.02,.05+.08*s,3500,3);}},
  pot(){if(gate('p',60)){tone(180,.18,'sine',.16,.5);noise(.12,.06,500);}},
  foul(){tone(200,.25,'sawtooth',.05,.7);},
  power(){[660,880,1320].forEach((f,i)=>tone(f,.09,'triangle',.06,0,i*.05));},
  spike(){tone(90,.18,'sawtooth',.12,.4);noise(.12,.12,700);},
  click(){tone(660,.04,'square',.03);}};

/* ================= fx ================= */
const FX={parts:[],texts:[],shake:0,trail:[]};
function calm(){return ST.prefs.motion;}
function burst(x,y,col,n=16,sp=240){if(calm())n=Math.min(n,4);for(let i=0;i<n;i++){const a=Math.random()*TAU,v=sp*(.3+Math.random()*.9);FX.parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:.5+Math.random()*.5,col,r:1.5+Math.random()*3});}}
function floatText(x,y,txt,col,size=46){FX.texts.push({x,y,txt,col,life:1.3,size});}
function shake(a){if(!calm())FX.shake=Math.max(FX.shake,a);}
function updFX(dt){for(const p of FX.parts){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.exp(-3*dt);p.vy*=Math.exp(-3*dt);p.life-=dt;}FX.parts=FX.parts.filter(p=>p.life>0);for(const t of FX.texts){t.y-=34*dt;t.life-=dt;}FX.texts=FX.texts.filter(t=>t.life>0);FX.shake=Math.max(0,FX.shake-dt*30);}
function drawFX(c){for(const p of FX.parts){c.globalAlpha=clamp(p.life*1.6,0,1);c.fillStyle=p.col;c.beginPath();c.arc(p.x,p.y,p.r,0,TAU);c.fill();}c.globalAlpha=1;
  for(const t of FX.texts){c.globalAlpha=clamp(t.life*1.5,0,1);c.font=`italic 800 ${t.size}px Fraunces, Georgia, serif`;c.textAlign='center';c.textBaseline='middle';c.lineWidth=6;c.strokeStyle='rgba(6,11,20,.85)';c.strokeText(t.txt,t.x,t.y);c.fillStyle=t.col;c.fillText(t.txt,t.x,t.y);}c.globalAlpha=1;}
function drawTrail(c){if(ST.trail==='none'||FX.trail.length<2)return;const sp=ST.trail==='spark';const col=colP(0);
  for(let i=1;i<FX.trail.length;i++){const p=FX.trail[i],q=FX.trail[i-1];if(hyp(p.x-q.x,p.y-q.y)>80)continue;const k=i/FX.trail.length;c.globalAlpha=k*.5;
    if(sp){c.fillStyle=i%2?C.amber:col;c.beginPath();c.arc(p.x+rand(-4,4),p.y+rand(-4,4),1.5+k*2.5,0,TAU);c.fill();}else{c.strokeStyle=col;c.lineWidth=k*p.r*1.6;c.lineCap='round';c.beginPath();c.moveTo(q.x,q.y);c.lineTo(p.x,p.y);c.stroke();}}
  c.globalAlpha=1;c.lineCap='butt';}

/* ================= colours & names ================= */
function skinCol(id){if(id==='prism')return `hsl(${(now()/14)%360} 85% 62%)`;const s=SKINS.find(x=>x.id===id);return s?s.col:C.cyan;}
function colP(i){if(i===0)return skinCol(ST.skin);if(M.two)return ST.skin==='coral'?C.violet:C.coral;return C.amber;}
function sideName(i){if(M.two)return i?tr('p2n'):tr('p1n');if(i===0)return tr('you');return M.rival?M.rival.toUpperCase():tr('ai');}
function hexA(col,a){if(col.startsWith('hsl'))return col.replace(')',` / ${a})`);const n=parseInt(col.slice(1),16);return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`;}

/* ================= input ================= */
const keys=new Set(),pressed=new Set(),released=new Set(),PTRS=new Map();
const BTN={act:{p:false,h:false,u:false},spr:{h:false}};
function endFrameInput(){pressed.clear();released.clear();for(const [id,p] of PTRS){p.justDown=p.justUp=false;if(!p.down&&p.type!=='mouse')PTRS.delete(id);}BTN.act.p=BTN.act.u=false;}
function ptr(side){let hover=null;for(const p of PTRS.values()){if(side!=null&&M.two&&(p.sx<W/2?0:1)!==side)continue;if(p.down||p.justUp)return p;if(p.type==='mouse'&&p.inside)hover=p;}return hover;}
const KM={single:{l:['ArrowLeft','KeyA'],r:['ArrowRight','KeyD'],u:['ArrowUp','KeyW'],d:['ArrowDown','KeyS'],a:['Space','Enter'],s:['ShiftLeft','ShiftRight']},
  p1:{l:['KeyA'],r:['KeyD'],u:['KeyW'],d:['KeyS'],a:['Space','KeyF'],s:['ShiftLeft']},
  p2:{l:['ArrowLeft'],r:['ArrowRight'],u:['ArrowUp'],d:['ArrowDown'],a:['Enter','NumpadEnter','Numpad0'],s:['ShiftRight','Slash']}};
function ctl(i){const m=M.two?(i?KM.p2:KM.p1):KM.single,any=(set,l)=>l.some(k=>set.has(k)),b=!M.two;
  return{x:(any(keys,m.r)?1:0)-(any(keys,m.l)?1:0),y:(any(keys,m.d)?1:0)-(any(keys,m.u)?1:0),up:any(pressed,m.u),down:any(pressed,m.d),
    act:any(pressed,m.a)||(b&&BTN.act.p),actHeld:any(keys,m.a)||(b&&BTN.act.h),actUp:any(released,m.a)||(b&&BTN.act.u),sprint:any(keys,m.s)||(b&&BTN.spr.h)};}

/* ================= drawing helpers ================= */
function collide(ball,body,e,bv){const dx=ball.x-body.x,dy=ball.y-body.y,d=Math.hypot(dx,dy),rr=ball.r+body.r;if(d>=rr||d===0)return 0;const nx=dx/d,ny=dy/d;ball.x=body.x+nx*rr;ball.y=body.y+ny*rr;const bvx=bv?bv.vx:0,bvy=bv?bv.vy:0,vn=(ball.vx-bvx)*nx+(ball.vy-bvy)*ny;if(vn<0){ball.vx-=(1+e)*vn*nx;ball.vy-=(1+e)*vn*ny;return -vn;}return .001;}
function capSpeed(o,m){const s=Math.hypot(o.vx,o.vy);if(s>m){o.vx*=m/s;o.vy*=m/s;}}
function shadow(c,x,y,rx,ry,a=.35){c.fillStyle=`rgba(0,0,0,${a})`;c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,TAU);c.fill();}
function shade(c,x,y,r){const g=c.createRadialGradient(x-r*.4,y-r*.45,0,x-r*.15,y-r*.15,r*1.15);g.addColorStop(0,'rgba(255,255,255,.6)');g.addColorStop(.3,'rgba(255,255,255,.08)');g.addColorStop(1,'rgba(0,0,0,.4)');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
function orb(c,x,y,r,col){c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();shade(c,x,y,r);}
function label(c,txt,x,y,col,size=14,align='center'){c.font=`700 ${size}px "JetBrains Mono", monospace`;c.textAlign=align;c.textBaseline='middle';c.fillStyle=col;c.fillText(txt,x,y);}
function banner(c,txt,col,a,y=110){c.globalAlpha=clamp(a,0,1);c.font='italic 800 40px Fraunces, Georgia, serif';c.textAlign='center';c.textBaseline='middle';c.lineWidth=7;c.strokeStyle='rgba(6,11,20,.8)';c.strokeText(txt,W/2,y);c.fillStyle=col;c.fillText(txt,W/2,y);c.globalAlpha=1;}
function meter(c,x,y,w,v,col){c.fillStyle='rgba(231,238,247,.15)';c.fillRect(x,y,w,5);c.fillStyle=col;c.fillRect(x,y,w*clamp(v,0,1),5);}
const fmtClock=s=>{s=Math.max(0,Math.ceil(s));return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;};
let announce=()=>{};

/* ================= 1. BASKETBALL ================= */
const BK={floor:545,fx:792,bx:850,ry:285,bbX:866,g:1250};
const CROWD=Array.from({length:260},(_,i)=>({x:Math.random()*W,y:40+Math.random()*190,r:3+Math.random()*3,c:['#25406a','#1c3355','#2b4a77','#3a3050','#24485a'][i%5]}));
class Basket{
  constructor(){this.key='basket';this.score=[0,0];this.over=false;this.acts=[];this.winner=null;
    const pool=[230,320,410,500,590].sort(()=>Math.random()-.5);this.spots=pool.slice(0,[2,3,4][M.len]);
    this.round=0;this.turn=0;this.shot=0;this.RACK=3;this.extra=0;this.net=0;this.kAng=58;this.kPow=0;this.charging=false;this.drag=null;this.ban=1.6;this.clk=0;
    this.stats={made:[0,0],att:[0,0],sw:[0,0]};this.setRound();this.newBall();}
  get sx(){return this.spots[this.round];}
  human(){return this.turn===0||M.two;}
  setRound(){const ot=this.round>=this.spots.length-this.extra&&this.extra>0;this.wind=(M.mods&&!ot&&this.round%2===1)?(Math.random()<.5?-1:1)*rand(150,260):0;this.moving=M.mods&&!ot&&this.round>=2;}
  hyAt(t){return BK.ry+(this.moving?Math.sin(t*1.3)*45:0);}
  rims(){const y=this.hy;return[{x:BK.fx,y,r:4},{x:BK.bx,y,r:4}];}
  newBall(){this.b={x:this.sx,y:430,vx:0,vy:0,r:16,rim:false,made:false,money:this.shot===this.RACK-1,t:0,bounce:0,rot:0};this.state='aim';this.aiT=this.human()?0:1.05;this.sc=8;this.drag=null;this.charging=false;this.kPow=0;}
  turnName(){return M.two?(this.turn?tr('p2Turn'):tr('p1Turn')):(this.turn?tr('aiTurn'):tr('yourTurn'));}
  info(){let t=`${this.extra&&this.round>=this.spots.length-this.extra?tr('overtime')+' · ':''}${tr('spot')} ${this.round+1}/${this.spots.length} · ${tr('ball')} ${this.shot+1}/${this.RACK}`;if(this.b.money)t+=' · '+tr('money');if(this.wind)t+=' · '+tr(this.wind>0?'windR':'windL');if(this.moving)t+=' · '+tr('moving');return t;}
  clock(){return this.turnName()+(this.state==='aim'&&this.human()?` · ${Math.ceil(this.sc)}s`:'');}
  launch(vx,vy){this.b.vx=vx;this.b.vy=vy;this.state='fly';this.stats.att[this.turn]++;SFX.swoosh();}
  dragVel(p){const dx=this.drag.x-p.x,dy=this.drag.y-p.y;let vx=dx*3.4,vy=dy*3.4;const l=Math.hypot(vx,vy),m=1250;if(l>m){vx*=m/l;vy*=m/l;}return{x:vx,y:vy};}
  sim(x,y,v,th,t0){let vx=v*Math.cos(th),vy=-v*Math.sin(th),t=0,above=false;const h=1/240;for(let i=0;i<1400;i++){const py=y;vx+=this.wind*h;vy+=BK.g*h;x+=vx*h;y+=vy*h;t+=h;const hy=this.hyAt(t0+t);if(y<hy-20)above=true;if(above&&py<hy&&y>=hy&&vy>0)return x;if(x>BK.bbX)return 1e9;if(y>BK.floor)return above?x:-1e9;}return -1e9;}
  aiShoot(){const b=this.b,tx=(BK.fx+BK.bx)/2+2,k=clamp((tx-b.x-200)/420,0,1);let th=(68-14*k+rand(-2,2))*Math.PI/180;let lo=250,hi=1500;
    for(let i=0;i<30;i++){const mid=(lo+hi)/2;if(this.sim(b.x,b.y,mid,th,this.clk)<tx)lo=mid;else hi=mid;}
    let v=(lo+hi)/2*(1+gauss()*.013/M.A);th+=gauss()*.008/M.A;this.launch(v*Math.cos(th),-v*Math.sin(th));}
  update(dt){if(this.over)return;const b=this.b;this.clk+=dt;this.hy=this.hyAt(this.clk);if(this.ban>0)this.ban-=dt;this.net=Math.max(0,this.net-dt);
    if(this.state==='aim'){
      if(this.human()){const p=ptr(),c=ctl(0),c2=M.two?ctl(1):null;
        this.sc-=dt;if(this.sc<=0){floatText(W/2,250,tr('shotClock'),C.coral,48);SFX.foul();this.stats.att[this.turn]++;this.next();return;}
        if(p&&p.justDown)this.drag={x:p.x,y:p.y};
        if(this.drag&&p&&!p.down){const v=this.dragVel(p);this.drag=null;if(Math.hypot(v.x,v.y)>150)this.launch(v.x,v.y);return;}
        if(this.drag&&!p)this.drag=null;
        const up=c.y<0||(c2&&c2.y<0),dn=c.y>0||(c2&&c2.y>0),held=c.actHeld||(c2&&c2.actHeld);
        if(up)this.kAng=Math.min(80,this.kAng+40*dt);if(dn)this.kAng=Math.max(25,this.kAng-40*dt);
        if(held){this.charging=true;this.kPow=Math.min(1,this.kPow+dt*.8);}
        else if(this.charging){this.charging=false;const sp=420+this.kPow*720,a=this.kAng*Math.PI/180;this.kPow=0;this.launch(Math.cos(a)*sp,-Math.sin(a)*sp);}
      }else{this.aiT-=dt;if(this.aiT<=0)this.aiShoot();}
      return;}
    b.t+=dt;const n=4,h=dt/n,rims=this.rims(),bbT=this.hy-117,bbB=this.hy+17;
    for(let i=0;i<n;i++){const py=b.y;b.vx+=this.wind*h;b.vy+=BK.g*h/2;b.x+=b.vx*h;b.y+=b.vy*h;b.vy+=BK.g*h/2;b.rot+=b.vx*h*.04;
      for(const rp of rims){const imp=collide(b,rp,.55);if(imp>0){b.rim=true;if(imp>60)SFX.rim();}}
      if(b.vx>0&&b.x+b.r>BK.bbX&&b.x<BK.bbX+12&&b.y>bbT-6&&b.y<bbB+6){b.x=BK.bbX-b.r;b.vx=-b.vx*.6;b.rim=true;SFX.board();}
      if(b.y+b.r>BK.floor){b.y=BK.floor-b.r;if(b.vy>0){b.vy=-b.vy*.55;b.vx*=.8;b.bounce++;if(b.vy<-80)SFX.bounce();}}
      if(b.x<b.r){b.x=b.r;b.vx=Math.abs(b.vx)*.6;}
      if(!b.made&&py<this.hy&&b.y>=this.hy&&b.vy>0&&b.x>BK.fx+5&&b.x<BK.bx-5)this.made();}
    if(b.t>4.2||b.bounce>=3||b.x>W+60||(b.made&&b.bounce>=2))this.next();}
  made(){const b=this.b;b.made=true;let pts=b.money?2:1;const sw=!b.rim;if(sw){pts++;this.stats.sw[this.turn]++;}this.score[this.turn]+=pts;this.stats.made[this.turn]++;this.net=.7;
    const col=colP(this.turn);floatText(820,this.hy-65,(sw?'SWISH ':'')+'+'+pts,col,sw?48:40);burst(821,this.hy+20,col,22,220);SFX.net();SFX.score();announce(`${sideName(this.turn)} +${pts}`);}
  next(){this.shot++;if(this.shot>=this.RACK){this.shot=0;if(this.turn===0)this.turn=1;else{this.turn=0;this.round++;
        if(this.round>=this.spots.length){if(this.score[0]===this.score[1]&&this.extra<1){this.extra++;this.spots.push(450);}else{this.over=true;SFX.whistle();return;}}this.setRound();}
      this.ban=1.6;}
    this.newBall();}
  draw(c){if(this.hy==null)this.hy=this.hyAt(0);
    const g=c.createLinearGradient(0,0,0,BK.floor);g.addColorStop(0,'#08111f');g.addColorStop(1,'#132643');c.fillStyle=g;c.fillRect(0,0,W,H);
    for(const p of CROWD){c.fillStyle=p.c;c.beginPath();c.arc(p.x,p.y,p.r,0,TAU);c.fill();}
    c.fillStyle='rgba(10,19,34,.55)';c.fillRect(0,0,W,250);
    for(let i=0;i<4;i++){const lx=120+i*240,lg=c.createRadialGradient(lx,0,0,lx,0,260);lg.addColorStop(0,'rgba(245,176,65,.16)');lg.addColorStop(1,'rgba(245,176,65,0)');c.fillStyle=lg;c.fillRect(lx-260,0,520,300);}
    c.fillStyle='#0e1d33';c.fillRect(0,250,W,BK.floor-250);c.strokeStyle='rgba(63,208,224,.18)';c.lineWidth=2;c.beginPath();c.moveTo(0,250);c.lineTo(W,250);c.stroke();
    label(c,'PENTARENA',W/2,400,'rgba(231,238,247,.06)',64);
    const fg=c.createLinearGradient(0,BK.floor,0,H);fg.addColorStop(0,'#7a5531');fg.addColorStop(1,'#4b321c');c.fillStyle=fg;c.fillRect(0,BK.floor,W,H-BK.floor);
    c.strokeStyle='rgba(0,0,0,.18)';c.lineWidth=1;for(let x=0;x<W;x+=48){c.beginPath();c.moveTo(x,BK.floor);c.lineTo(x-20,H);c.stroke();}
    c.fillStyle='rgba(231,238,247,.5)';c.fillRect(0,BK.floor,W,2);
    this.spots.forEach((sx,i)=>{const cur=i===this.round;c.fillStyle=cur?colP(this.turn):'rgba(231,238,247,.25)';c.beginPath();c.ellipse(sx,BK.floor+12,22,5,0,0,TAU);c.fill();label(c,String(i+1),sx,BK.floor+32,cur?C.ink:'rgba(231,238,247,.4)',12);});
    if(this.wind){const dir=Math.sign(this.wind),x0=W/2;c.strokeStyle='rgba(231,238,247,.45)';c.lineWidth=2;for(let i=0;i<3;i++){const ox=((this.clk*120*dir+i*90)%270+270)%270-135;c.beginPath();c.moveTo(x0+ox-30*dir,170+i*18);c.lineTo(x0+ox+30*dir,170+i*18);c.stroke();}label(c,tr(dir>0?'windR':'windL'),x0,140,C.ink,13);}
    const hy=this.hy,bbT=hy-117,bbB=hy+17;
    c.fillStyle='#24344f';c.fillRect(905,bbT+30,12,BK.floor-bbT-30);c.fillRect(874,bbT+56,36,8);c.fillStyle='#1a2740';c.fillRect(890,BK.floor-24,40,24);
    c.fillStyle='rgba(231,238,247,.85)';c.fillRect(BK.bbX,bbT,9,bbB-bbT);c.fillStyle=C.coral;c.fillRect(BK.bbX,hy-46,9,44);c.fillStyle='rgba(231,238,247,.85)';c.fillRect(BK.bbX+2,hy-42,5,36);
    const b=this.b;
    if(this.state==='aim'&&this.human()){let v=null;const p=ptr();
      if(this.drag&&p)v=this.dragVel(p);else if(this.charging||(p&&p.type!=='mouse')||keys.size){const a=this.kAng*Math.PI/180,sp=420+this.kPow*720;v={x:Math.cos(a)*sp,y:-Math.sin(a)*sp};}
      if(v){const T=M.A<.8?1:M.A>1.2?.3:.55;c.fillStyle=hexA(C.cyan,.85);for(let t=.04;t<T;t+=.045){const x=b.x+v.x*t+.5*this.wind*t*t,y=b.y+v.y*t+.5*BK.g*t*t;c.globalAlpha=1-t/T;c.beginPath();c.arc(x,y,3.2,0,TAU);c.fill();}c.globalAlpha=1;}
      if(this.charging)meter(c,b.x-30,b.y+30,60,this.kPow,C.amber);
      c.strokeStyle=this.sc<3?C.coral:'rgba(231,238,247,.5)';c.lineWidth=3;c.beginPath();c.arc(b.x,b.y,b.r+8,-Math.PI/2,-Math.PI/2+TAU*this.sc/8);c.stroke();}
    if(this.state==='aim')label(c,sideName(this.turn),b.x,b.y-38,colP(this.turn),13);
    shadow(c,b.x,BK.floor+3,b.r*(1-clamp((BK.floor-b.y)/700,0,.6)),4,.35);this.drawBall(c,b);
    for(let i=this.shot+1;i<this.RACK;i++){const rx=this.sx-60-(i-this.shot)*22;orb(c,rx,BK.floor-10,9,i===this.RACK-1?C.amber:'#e8782c');}
    const sw=Math.sin(this.net*18)*this.net*8;c.strokeStyle='rgba(231,238,247,.75)';c.lineWidth=1.5;const nb=hy+50;
    for(let i=0;i<=5;i++){const x0=BK.fx+(BK.bx-BK.fx)*i/5,x1=BK.fx+12+(BK.bx-BK.fx-24)*i/5+sw;c.beginPath();c.moveTo(x0,hy);c.lineTo(x1,nb);c.stroke();}
    for(let j=1;j<=3;j++){const y=hy+j*12.5,k=j/4;c.beginPath();c.moveTo(BK.fx+12*k+sw*k,y);c.lineTo(BK.bx-12*k+sw*k,y);c.stroke();}
    c.strokeStyle='#ff7a2f';c.lineWidth=5;c.beginPath();c.moveTo(BK.fx,hy);c.lineTo(BK.bbX,hy);c.stroke();orb(c,BK.fx,hy,4.5,'#ff7a2f');
    if(this.ban>0)banner(c,this.turnName(),colP(this.turn),this.ban);}
  drawBall(c,b){c.save();c.translate(b.x,b.y);c.rotate(b.rot);c.fillStyle=b.money?C.amber:'#e8782c';c.beginPath();c.arc(0,0,b.r,0,TAU);c.fill();
    c.strokeStyle=b.money?'#0a1322':'#2a1406';c.lineWidth=1.6;c.beginPath();c.moveTo(-b.r,0);c.lineTo(b.r,0);c.moveTo(0,-b.r);c.lineTo(0,b.r);c.stroke();
    c.beginPath();c.arc(-b.r*1.25,0,b.r*.9,-.9,.9);c.stroke();c.beginPath();c.arc(b.r*1.25,0,b.r*.9,Math.PI-.9,Math.PI+.9);c.stroke();c.restore();shade(c,b.x,b.y,b.r);}
  matchStats(){const pct=i=>this.stats.att[i]?`${this.stats.made[i]}/${this.stats.att[i]}`:'0/0';return[[tr('st_acc'),pct(0),pct(1)],[tr('st_swish'),this.stats.sw[0],this.stats.sw[1]]];}
}

/* ================= 2. FOOTBALL ================= */
const FB={x0:40,x1:920,y0:40,y1:560,gT:235,gB:365};
const FPOSTS=[{x:FB.x0,y:FB.gT,r:5},{x:FB.x0,y:FB.gB,r:5},{x:FB.x1,y:FB.gT,r:5},{x:FB.x1,y:FB.gB,r:5}];
class Football{
  constructor(){this.key='football';this.score=[0,0];this.time=[60,90,120][M.len];this.target=[3,5,7][M.len];this.over=false;this.golden=false;this.goldenWin=false;this.winner=null;
    this.acts=['kick','sprint'];this.stats={shots:[0,0],poss:[0,0],saves:[0,0]};this.buf=[];this.replayFrames=null;this.reset();}
  reset(){const mk=x=>({x,y:300,vx:0,vy:0,r:18,cd:0,st:1,ch:0,chg:false});this.t=[mk(300),mk(660)];this.b={x:480,y:300,vx:0,vy:0,r:10,rot:0};
    this.k=[{x:FB.x0+22,y:300,r:17,vx:0,vy:0},{x:FB.x1-22,y:300,r:17,vx:0,vy:0}];this.pause=1.1;this.err=gauss()*.5;}
  info(){return this.golden?tr('goldenGoal'):`${tr('firstTo')} ${this.target}`;}
  clock(){return fmtClock(this.time);}
  snap(){const[p,a]=this.t,b=this.b;return[p.x,p.y,a.x,a.y,b.x,b.y,b.rot,this.k[0].y,this.k[1].y];}
  applySnap(s){const[p,a]=this.t,b=this.b;[p.x,p.y,a.x,a.y,b.x,b.y,b.rot,this.k[0].y,this.k[1].y]=s;}
  trailPt(){return{x:this.b.x,y:this.b.y,r:this.b.r};}
  shoot(o,i,pw,ty){const b=this.b,f=FB,tx=i===0?f.x1+10:f.x0-10,w=(M.two||i===0)?.3:.1,dx=b.x-o.x,dy=b.y-o.y,d=Math.hypot(dx,dy)||1,gx=tx-b.x,gy=ty-b.y,gd=Math.hypot(gx,gy)||1;
    let vx=dx/d*w+gx/gd*(1-w),vy=dy/d*w+gy/gd*(1-w);const l=Math.hypot(vx,vy)||1;b.vx=vx/l*pw+o.vx*.25;b.vy=vy/l*pw+o.vy*.25;capSpeed(b,1000);
    {const gx=i===0?f.x1:f.x0,vxs=b.vx*(i===0?1:-1);if(vxs>200){const yg=b.y+b.vy/b.vx*(gx-b.x);if(yg>f.gT-40&&yg<f.gB+40&&Math.abs(gx-b.x)<520)this.stats.shots[i]++;}}SFX.kick(clamp((pw-500)/450,0,1));burst(b.x,b.y,'#e7eef7',6,120);if(pw>850)shake(4);}
  human(i,dt){const o=this.t[i],c=ctl(i),pp=ptr(i),b=this.b;let ix=c.x,iy=c.y;
    if(pp&&pp.down&&pp.holdT>.12){const dx=pp.x-o.x,dy=pp.y-o.y,d=Math.hypot(dx,dy);if(d>10){ix=dx/d;iy=dy/d;}}
    const il=Math.hypot(ix,iy);if(il>1){ix/=il;iy/=il;}
    const spr=c.sprint&&o.st>.05&&il>.1,sp=spr?400:285;o.st=clamp(o.st+(spr?-.5:.22)*dt,0,1);
    const k=Math.min(1,dt*9);o.vx+=(ix*sp-o.vx)*k;o.vy+=(iy*sp-o.vy)*k;
    if(c.actHeld){o.chg=true;o.ch=Math.min(1,o.ch+dt/.7);}
    const near=hyp(b.x-o.x,b.y-o.y)<o.r+b.r+18,tap=pp&&pp.justUp&&pp.tap;
    if((c.actUp&&(o.chg||c.act))||tap){if(near&&o.cd<=0){this.shoot(o,i,560+o.ch*420,300+iy*85);o.cd=.3;}o.ch=0;o.chg=false;}
    else if(!c.actHeld){o.chg=false;o.ch=0;}}
  ai(dt){const a=this.t[1],p=this.t[0],b=this.b,f=FB,gX=f.x0,gY=300,ul=Math.hypot(b.x-gX,b.y-gY)||1,ux=(b.x-gX)/ul,uy=(b.y-gY)/ul,side=(a.x-b.x)*ux+(a.y-b.y)*uy;let tx,ty;
    if(side>8){tx=b.x;ty=b.y;}else{tx=b.x+ux*50;ty=b.y+uy*50+(a.y<b.y?-34:34);}
    if(b.vx>250&&b.x>560&&a.x<b.x){tx=Math.min(f.x1-60,b.x+70);ty=b.y;}
    const adx=tx-a.x,ady=ty-a.y,ad=Math.hypot(adx,ady)||1,far=ad>180&&a.st>.35;a.st=clamp(a.st+(far?-.45:.2)*dt,0,1);
    const asp=(195+65*M.D)*(far?1.3:1)*(ad<20?ad/20:1),k=Math.min(1,dt*9);a.vx+=(adx/ad*asp-a.vx)*k;a.vy+=(ady/ad*asp-a.vy)*k;
    if(a.cd<=0&&hyp(b.x-a.x,b.y-a.y)<a.r+b.r+8&&side>0&&(b.x<420||hyp(p.x-b.x,p.y-b.y)<90)){const aimY=(this.k[0].y<300?f.gB-24:f.gT+24)+gauss()*22/M.A;this.shoot(a,1,(b.x<420?640:480)+90*M.D,aimY);a.cd=.55/M.D;}
    else if(a.cd<=0&&hyp(b.x-a.x,b.y-a.y)<a.r+b.r+8&&(b.y<f.y0+45||b.y>f.y1-45||b.x<f.x0+45)){this.shoot(a,1,420,300+gauss()*60);a.cd=.4;}}
  update(dt){if(this.over)return;if(this.pause>0){this.pause-=dt;return;}
    this.buf.push(this.snap());if(this.buf.length>150)this.buf.shift();
    this.time-=dt;if(this.time<=0){if(this.score[0]===this.score[1]&&M.mods&&!this.golden){this.golden=true;this.time=30;floatText(W/2,250,tr('goldenGoal'),C.amber,52);SFX.whistle();announce(tr('goldenGoal'));}else{this.time=0;this.over=true;SFX.whistle();return;}}
    const [p,a]=this.t,b=this.b,f=FB;
    this.human(0,dt);if(M.two)this.human(1,dt);else this.ai(dt);
    for(const o of this.t){o.x=clamp(o.x+o.vx*dt,f.x0+o.r,f.x1-o.r);o.y=clamp(o.y+o.vy*dt,f.y0+o.r,f.y1-o.r);o.cd-=dt;}
    {const dx=a.x-p.x,dy=a.y-p.y,d=Math.hypot(dx,dy)||1,rr=p.r+a.r;if(d<rr){const o=(rr-d)/2;p.x-=dx/d*o;p.y-=dy/d*o;a.x+=dx/d*o;a.y+=dy/d*o;}}
    const dp=hyp(b.x-p.x,b.y-p.y),da=hyp(b.x-a.x,b.y-a.y);if(Math.min(dp,da)<70)this.stats.poss[dp<da?0:1]+=dt;
    const kpT=b.x<W/2?clamp(b.y,f.gT+8,f.gB-8):300,kaT=b.x>W/2?clamp(b.y+(M.two?0:this.err*40/M.D),f.gT+8,f.gB-8):300;
    const k0=M.two?115:110,k1=M.two?115:95+60*M.D;
    this.k[0].vy=clamp((kpT-this.k[0].y)*4,-k0,k0);this.k[0].y+=this.k[0].vy*dt;this.k[1].vy=clamp((kaT-this.k[1].y)*4,-k1,k1);this.k[1].y+=this.k[1].vy*dt;
    for(let s=0;s<3;s++){const h=dt/3;b.x+=b.vx*h;b.y+=b.vy*h;
      collide(b,p,.25,p);collide(b,a,.25,a);
      for(let i=0;i<2;i++){const toward=i===0?b.vx<-200:b.vx>200;const imp=collide(b,this.k[i],.6,this.k[i]);if(imp>1){if(toward&&imp>200){this.stats.saves[i]++;floatText(this.k[i].x+(i?-50:50),this.k[i].y-30,tr('saved'),colP(i),26);}b.vx=(i?-1:1)*Math.max(Math.abs(b.vx),300);SFX.hit(.5);}}
      for(const pt of FPOSTS)if(collide(b,pt,.6)>40)SFX.wall();
      if(b.y<f.y0+b.r){b.y=f.y0+b.r;b.vy=Math.abs(b.vy)*.7;}if(b.y>f.y1-b.r){b.y=f.y1-b.r;b.vy=-Math.abs(b.vy)*.7;}
      const inM=b.y>f.gT&&b.y<f.gB;
      if(b.x<f.x0+b.r){if(inM){if(b.x<f.x0-14){this.goal(1);return;}}else{b.x=f.x0+b.r;b.vx=Math.abs(b.vx)*.7;}}
      if(b.x>f.x1-b.r){if(inM){if(b.x>f.x1+14){this.goal(0);return;}}else{b.x=f.x1-b.r;b.vx=-Math.abs(b.vx)*.7;}}
      if(b.x<f.x0||b.x>f.x1)b.y=clamp(b.y,f.gT+b.r,f.gB-b.r);}
    const fr=Math.exp(-.85*dt);b.vx*=fr;b.vy*=fr;capSpeed(b,1000);b.rot+=Math.hypot(b.vx,b.vy)*dt*.05;}
  goal(side){this.score[side]++;const col=colP(side);floatText(480,250,tr('goal'),col,64);burst(side?FB.x0:FB.x1,300,col,40,320);shake(12);(side===0||M.two)?SFX.goal():SFX.concede();
    announce(`${tr('goal')} ${sideName(0)} ${this.score[0]} – ${sideName(1)} ${this.score[1]}`);
    if(this.buf.length>30)this.replayFrames=this.buf.slice();this.buf=[];
    if(this.golden){this.over=true;this.goldenWin=side===0;SFX.whistle();return;}
    if(this.score[side]>=this.target){this.over=true;SFX.whistle();}else this.reset();}
  draw(c){const f=FB;c.fillStyle='#0a2526';c.fillRect(0,0,W,H);
    for(let i=0;i<11;i++){c.fillStyle=i%2?'#0f3a35':'#0c322e';c.fillRect(f.x0+i*80,f.y0,80,f.y1-f.y0);}
    const vg=c.createRadialGradient(W/2,H/2,100,W/2,H/2,620);vg.addColorStop(0,'rgba(63,208,224,.06)');vg.addColorStop(1,'rgba(0,0,0,.35)');c.fillStyle=vg;c.fillRect(0,0,W,H);
    c.strokeStyle='rgba(231,238,247,.55)';c.lineWidth=3;c.strokeRect(f.x0,f.y0,f.x1-f.x0,f.y1-f.y0);c.beginPath();c.moveTo(W/2,f.y0);c.lineTo(W/2,f.y1);c.stroke();c.beginPath();c.arc(W/2,300,72,0,TAU);c.stroke();
    c.strokeRect(f.x0,170,110,260);c.strokeRect(f.x1-110,170,110,260);c.strokeRect(f.x0,f.gT-10,40,f.gB-f.gT+20);c.strokeRect(f.x1-40,f.gT-10,40,f.gB-f.gT+20);
    c.beginPath();c.arc(f.x0+110,300,50,-1.1,1.1);c.stroke();c.beginPath();c.arc(f.x1-110,300,50,Math.PI-1.1,Math.PI+1.1);c.stroke();
    c.fillStyle='rgba(231,238,247,.7)';c.beginPath();c.arc(W/2,300,4,0,TAU);c.fill();
    for(const gx of [f.x0-26,f.x1]){c.fillStyle='rgba(231,238,247,.07)';c.fillRect(gx,f.gT,26,f.gB-f.gT);c.strokeStyle='rgba(231,238,247,.22)';c.lineWidth=1;
      for(let y=f.gT;y<=f.gB;y+=10){c.beginPath();c.moveTo(gx,y);c.lineTo(gx+26,y);c.stroke();}for(let x=gx;x<=gx+26;x+=9){c.beginPath();c.moveTo(x,f.gT);c.lineTo(x,f.gB);c.stroke();}}
    for(const pt of FPOSTS)orb(c,pt.x,pt.y,5,'#e7eef7');
    const b=this.b;
    const man=(o,col,kp)=>{shadow(c,o.x+3,o.y+6,o.r,o.r*.75);orb(c,o.x,o.y,o.r,col);c.strokeStyle='rgba(6,11,20,.8)';c.lineWidth=2;c.beginPath();c.arc(o.x,o.y,o.r,0,TAU);c.stroke();
      if(kp){c.fillStyle='rgba(6,11,20,.55)';c.fillRect(o.x-o.r*.7,o.y-3,o.r*1.4,6);}else{c.fillStyle='#0a1322';c.beginPath();c.arc(o.x,o.y,o.r*.36,0,TAU);c.fill();}};
    man(this.k[0],hexA(colP(0),.7),true);man(this.k[1],hexA(colP(1),.7),true);
    this.t.forEach((o,i)=>{const human=i===0||M.two;if(human&&hyp(b.x-o.x,b.y-o.y)<o.r+b.r+18){c.strokeStyle=hexA(colP(i),.75);c.setLineDash([4,5]);c.lineWidth=2;c.beginPath();c.arc(o.x,o.y,o.r+9,0,TAU);c.stroke();c.setLineDash([]);}
      if(o.chg&&o.ch>0){c.strokeStyle=C.amber;c.lineWidth=4;c.beginPath();c.arc(o.x,o.y,o.r+13,-Math.PI/2,-Math.PI/2+TAU*o.ch);c.stroke();}
      man(o,colP(i));if(o.st<.99)meter(c,o.x-16,o.y+o.r+8,32,o.st,o.st<.25?C.coral:C.good);});
    shadow(c,b.x+2,b.y+4,b.r,b.r*.7,.4);orb(c,b.x,b.y,b.r,'#f4f1ea');c.fillStyle='#1a1a1a';for(let i=0;i<3;i++){const an=b.rot+i*TAU/3;c.beginPath();c.arc(b.x+Math.cos(an)*b.r*.5,b.y+Math.sin(an)*b.r*.5,2.4,0,TAU);c.fill();}
    if(this.pause>0&&!this.over)label(c,'GO',W/2,300,`rgba(245,176,65,${clamp(1.1-this.pause,0,1)})`,36);
    if(this.golden)label(c,tr('goldenGoal').toUpperCase(),W/2,22,C.amber,14);}
  matchStats(){const tot=this.stats.poss[0]+this.stats.poss[1]||1,pp=Math.round(this.stats.poss[0]/tot*100);return[[tr('st_shots'),this.stats.shots[0],this.stats.shots[1]],[tr('st_poss'),pp+'%',(100-pp)+'%'],[tr('st_saves'),this.stats.saves[0],this.stats.saves[1]]];}
}

/* ================= 3. AIR HOCKEY ================= */
const AH={x0:60,x1:900,y0:60,y1:540,gT:225,gB:375,mid:480};
const APOSTS=[{x:AH.x0,y:AH.gT,r:4},{x:AH.x0,y:AH.gB,r:4},{x:AH.x1,y:AH.gT,r:4},{x:AH.x1,y:AH.gB,r:4}];
const PU_TYPES=['boost','shield','big','freeze'];
class AirHockey{
  constructor(){this.key='hockey';this.score=[0,0];this.target=[5,7,9][M.len];this.over=false;this.acts=[];this.winner=null;
    const mk=x=>({x,y:300,vx:0,vy:0,r:32,hc:0});this.m=[mk(170),mk(790)];this.k={x:480,y:300,vx:0,vy:0,r:19};this.aiT=0;this.aiTarget={x:790,y:300};
    this.eff=[{big:0,frz:0,sh:0,boost:false},{big:0,frz:0,sh:0,boost:false}];this.pu=null;this.puT=5;this.last=-1;this.stuck=0;
    this.stats={shots:[0,0],top:0,power:[0,0]};this.buf=[];this.replayFrames=null;this.serve(0);}
  serve(to){this.k.x=to===0?330:630;this.k.y=300;this.k.vx=this.k.vy=0;this.pause=.8;this.last=-1;}
  info(){const e=this.eff.map((e,i)=>[e.big>0&&tr('pu_big'),e.frz>0&&tr('pu_freeze'),e.sh>0&&tr('pu_shield'),e.boost&&tr('pu_boost')].filter(Boolean).map(t=>`${sideName(i)}: ${t}`)).flat();return e.length?e.join(' · '):`${tr('firstTo')} ${this.target}`;}
  clock(){return '';}
  snap(){const[p,a]=this.m,k=this.k;return[p.x,p.y,a.x,a.y,k.x,k.y];}
  applySnap(s){const[p,a]=this.m,k=this.k;[p.x,p.y,a.x,a.y,k.x,k.y]=s;}
  trailPt(){return{x:this.k.x,y:this.k.y,r:this.k.r};}
  move(m,tx,ty,max,dt){const dx=tx-m.x,dy=ty-m.y,d=Math.hypot(dx,dy),st=Math.min(d,max*dt),nx=d?m.x+dx/d*st:m.x,ny=d?m.y+dy/d*st:m.y;m.vx=(nx-m.x)/dt;m.vy=(ny-m.y)/dt;m.x=nx;m.y=ny;}
  bounds(i){const r=this.m[i].r,T=AH;return i===0?[T.x0+r,T.mid-r]:[T.mid+r,T.x1-r];}
  humanMove(i,dt){const m=this.m[i],pp=ptr(i),c=ctl(i);let tx=m.x,ty=m.y;
    if(pp&&(pp.down||(pp.type==='mouse'&&(i===0||!M.two)))){tx=pp.x;ty=pp.y;}
    if(c.x||c.y){tx=m.x+c.x*30;ty=m.y+c.y*30;}
    const [lo,hi]=this.bounds(i);this.move(m,clamp(tx,lo,hi),clamp(ty,AH.y0+m.r,AH.y1-m.r),1700*(this.eff[i].frz>0?.4:1),dt);}
  plan(){const k=this.k,a=this.m[1],T=AH,p=this.m[0],gx=T.x0,gy=(p.y<300?T.gB-24:T.gT+24)+gauss()*40/M.A;
    if(this.pu&&this.pu.x>T.mid&&Math.hypot(k.vx,k.vy)<200&&k.x<T.mid){this.aiTarget={x:this.pu.x,y:this.pu.y};return;}
    if(k.x>T.mid-30){const ux0=k.x-gx,uy0=k.y-gy,ul=Math.hypot(ux0,uy0)||1,ux=ux0/ul,uy=uy0/ul,off=a.r+k.r+6,bx=k.x+ux*off,by=k.y+uy*off,behind=(a.x-k.x)*ux+(a.y-k.y)*uy;
      if(bx>T.x1-a.r||by<T.y0+a.r||by>T.y1-a.r){this.aiTarget={x:k.x-ux*30,y:k.y-uy*30};return;}
      if(behind>a.r*.6&&Math.hypot(a.x-bx,a.y-by)<48)this.aiTarget={x:k.x-ux*70,y:k.y-uy*70};
      else if(behind<0)this.aiTarget={x:k.x+62,y:k.y+(a.y<k.y?-72:72)};else this.aiTarget={x:bx,y:by};}
    else this.aiTarget={x:T.x1-92,y:300+(k.y-300)*.55};
    if(k.vx>300&&k.x>T.mid&&a.x<k.x){const ti=(T.x1-60-k.x)/k.vx;this.aiTarget={x:T.x1-60,y:clamp(k.y+k.vy*ti,T.gT,T.gB)};}}
  grant(i,type){const e=this.eff[i],o=this.eff[1-i];this.stats.power[i]++;SFX.power();floatText(this.k.x,this.k.y-40,tr('pu_'+type),colP(i),30);announce(`${sideName(i)}: ${tr('pu_'+type)}`);
    if(type==='big')e.big=8;else if(type==='freeze')o.frz=3.5;else if(type==='shield')e.sh=12;else e.boost=true;}
  update(dt){if(this.over)return;const T=AH,[p,a]=this.m,k=this.k;
    for(let i=0;i<2;i++){const e=this.eff[i];e.big=Math.max(0,e.big-dt);e.frz=Math.max(0,e.frz-dt);e.sh=Math.max(0,e.sh-dt);this.m[i].r=e.big>0?44:32;this.m[i].hc-=dt;}
    this.humanMove(0,dt);
    if(M.two)this.humanMove(1,dt);else{this.aiT-=dt;if(this.aiT<=0){this.aiT=.09/M.D;this.plan();}const at=this.aiTarget,[lo,hi]=this.bounds(1);this.move(a,clamp(at.x,lo,hi),clamp(at.y,T.y0+a.r,T.y1-a.r),(400+280*M.D)*(this.eff[1].frz>0?.4:1),dt);}
    if(this.pause>0){this.pause-=dt;return;}
    this.buf.push(this.snap());if(this.buf.length>150)this.buf.shift();
    if(M.mods){if(!this.pu){this.puT-=dt;if(this.puT<=0)this.pu={type:PU_TYPES[Math.floor(Math.random()*4)],x:rand(300,660),y:rand(130,470),t:9};}
      else{this.pu.t-=dt;if(this.pu.t<=0){this.pu=null;this.puT=rand(5,8);}else if(this.last>=0&&hyp(k.x-this.pu.x,k.y-this.pu.y)<k.r+18){this.grant(this.last,this.pu.type);this.pu=null;this.puT=rand(6,10);}}}
    const n=5,h=dt/n;
    for(let s=0;s<n;s++){k.x+=k.vx*h;k.y+=k.vy*h;
      for(let i=0;i<2;i++){const m=this.m[i],imp=collide(k,m,.92,m);if(imp>1){this.last=i;SFX.hit(Math.min(1,imp/1000));
          if(this.eff[i].boost){this.eff[i].boost=false;const sp=Math.hypot(k.vx,k.vy)||1,ns=Math.min(1700,sp*1.6+300);k.vx*=ns/sp;k.vy*=ns/sp;shake(6);burst(k.x,k.y,C.amber,16,260);}
          if(imp>650){burst(k.x,k.y,colP(i),8,200);shake(3);}
          if(m.hc<=0&&(i===0?k.vx>450:k.vx<-450)){this.stats.shots[i]++;m.hc=.25;}}}
      for(const pt of APOSTS)collide(k,pt,.8);
      if(k.y<T.y0+k.r){k.y=T.y0+k.r;k.vy=Math.abs(k.vy)*.9;SFX.wall();}if(k.y>T.y1-k.r){k.y=T.y1-k.r;k.vy=-Math.abs(k.vy)*.9;SFX.wall();}
      const inM=k.y>T.gT&&k.y<T.gB;
      if(k.x<T.x0+k.r){if(inM&&this.eff[0].sh>0){this.eff[0].sh=0;k.x=T.x0+k.r;k.vx=Math.abs(k.vx)*.9+120;burst(T.x0,k.y,colP(0),20,240);SFX.board();}else if(inM){if(k.x<T.x0-k.r){this.goal(1);return;}}else{k.x=T.x0+k.r;k.vx=Math.abs(k.vx)*.9;SFX.wall();}}
      if(k.x>T.x1-k.r){if(inM&&this.eff[1].sh>0){this.eff[1].sh=0;k.x=T.x1-k.r;k.vx=-Math.abs(k.vx)*.9-120;burst(T.x1,k.y,colP(1),20,240);SFX.board();}else if(inM){if(k.x>T.x1+k.r){this.goal(0);return;}}else{k.x=T.x1-k.r;k.vx=-Math.abs(k.vx)*.9;SFX.wall();}}
      if(k.x<T.x0||k.x>T.x1)k.y=clamp(k.y,T.gT+k.r,T.gB-k.r);}
    capSpeed(k,1700);const fr=Math.exp(-.2*dt);k.vx*=fr;k.vy*=fr;this.stats.top=Math.max(this.stats.top,Math.hypot(k.vx,k.vy));
    if(Math.abs(k.x-T.mid)<26)k.vx+=Math.sign(k.x-T.mid||1)*60*dt;
    if(!this.anc||hyp(k.x-this.anc.x,k.y-this.anc.y)>45){this.anc={x:k.x,y:k.y};this.stuck=0;}else{this.stuck+=dt;if(this.stuck>3){this.stuck=0;this.anc=null;this.serve(k.x<T.mid?1:0);}}}
  goal(side){this.score[side]++;const col=colP(side);floatText(480,250,tr('goal'),col,64);burst(side?AH.x0:AH.x1,300,col,40,330);shake(12);(side===0||M.two)?SFX.goal():SFX.concede();
    announce(`${tr('goal')} ${sideName(0)} ${this.score[0]} – ${sideName(1)} ${this.score[1]}`);if(this.buf.length>30)this.replayFrames=this.buf.slice();this.buf=[];
    if(this.score[side]>=this.target){this.over=true;SFX.whistle();}else this.serve(side===1?0:1);}
  drawPU(c,pu){const t=now()/300,r=16+Math.sin(t)*2,x=pu.x,y=pu.y;c.globalAlpha=pu.t<2?.4+.6*Math.abs(Math.sin(t*3)):1;
    c.fillStyle='rgba(6,11,20,.8)';c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.strokeStyle=C.amber;c.lineWidth=2.5;c.beginPath();c.arc(x,y,r,0,TAU);c.stroke();c.strokeStyle=C.ink;c.fillStyle=C.ink;c.lineWidth=2.5;
    if(pu.type==='boost'){c.beginPath();c.moveTo(x+3,y-10);c.lineTo(x-5,y+2);c.lineTo(x+1,y+2);c.lineTo(x-3,y+10);c.lineTo(x+6,y-2);c.lineTo(x,y-2);c.closePath();c.fill();}
    else if(pu.type==='shield'){c.beginPath();c.moveTo(x,y-9);c.lineTo(x+8,y-5);c.lineTo(x+6,y+5);c.lineTo(x,y+10);c.lineTo(x-6,y+5);c.lineTo(x-8,y-5);c.closePath();c.stroke();}
    else if(pu.type==='big'){c.beginPath();c.arc(x,y,8,0,TAU);c.stroke();c.beginPath();c.moveTo(x-4,y);c.lineTo(x+4,y);c.moveTo(x,y-4);c.lineTo(x,y+4);c.stroke();}
    else{for(let i=0;i<3;i++){const a=i*Math.PI/3;c.beginPath();c.moveTo(x-Math.cos(a)*9,y-Math.sin(a)*9);c.lineTo(x+Math.cos(a)*9,y+Math.sin(a)*9);c.stroke();}}c.globalAlpha=1;}
  draw(c){const T=AH;c.fillStyle='#060c17';c.fillRect(0,0,W,H);
    c.fillStyle='#1a2a44';c.beginPath();c.roundRect(T.x0-22,T.y0-22,T.x1-T.x0+44,T.y1-T.y0+44,46);c.fill();
    const g=c.createRadialGradient(W/2,H/2,40,W/2,H/2,520);g.addColorStop(0,'#13294a');g.addColorStop(1,'#0c1a30');c.fillStyle=g;c.beginPath();c.roundRect(T.x0,T.y0,T.x1-T.x0,T.y1-T.y0,30);c.fill();
    c.fillStyle='rgba(231,238,247,.05)';for(let x=T.x0+20;x<T.x1;x+=30)for(let y=T.y0+20;y<T.y1;y+=30)c.fillRect(x,y,2,2);
    c.strokeStyle='rgba(63,208,224,.55)';c.lineWidth=3;c.beginPath();c.moveTo(T.mid,T.y0);c.lineTo(T.mid,T.y1);c.stroke();c.beginPath();c.arc(T.mid,300,70,0,TAU);c.stroke();
    c.strokeStyle='rgba(245,176,65,.5)';c.beginPath();c.arc(T.x0,300,95,-Math.PI/2,Math.PI/2);c.stroke();c.beginPath();c.arc(T.x1,300,95,Math.PI/2,Math.PI*1.5);c.stroke();
    c.fillStyle='#000';c.fillRect(T.x0-22,T.gT,22,T.gB-T.gT);c.fillRect(T.x1,T.gT,22,T.gB-T.gT);
    c.fillStyle=colP(0);c.fillRect(T.x0-4,T.gT,4,T.gB-T.gT);c.fillStyle=colP(1);c.fillRect(T.x1,T.gT,4,T.gB-T.gT);
    for(let i=0;i<2;i++)if(this.eff[i].sh>0){const x=i?T.x1-6:T.x0+6;c.strokeStyle=colP(i);c.lineWidth=6;c.globalAlpha=.5+.3*Math.sin(now()/150);c.shadowColor=colP(i);c.shadowBlur=calm()?0:16;c.beginPath();c.moveTo(x,T.gT);c.lineTo(x,T.gB);c.stroke();c.shadowBlur=0;c.globalAlpha=1;}
    if(this.pu)this.drawPU(c,this.pu);
    const k=this.k,boost=this.last>=0&&this.eff[this.last].boost;
    shadow(c,k.x+3,k.y+5,k.r,k.r*.8,.45);c.fillStyle='#0b0f17';c.beginPath();c.arc(k.x,k.y,k.r,0,TAU);c.fill();c.strokeStyle=boost?C.amber:C.cyan;c.lineWidth=3;c.shadowColor=c.strokeStyle;c.shadowBlur=calm()?0:14;c.beginPath();c.arc(k.x,k.y,k.r-2,0,TAU);c.stroke();c.shadowBlur=0;
    this.m.forEach((m,i)=>{const col=colP(i);shadow(c,m.x+4,m.y+7,m.r,m.r*.8,.45);orb(c,m.x,m.y,m.r,col);c.fillStyle='rgba(6,11,20,.35)';c.beginPath();c.arc(m.x,m.y,m.r*.62,0,TAU);c.fill();orb(c,m.x,m.y,m.r*.42,col);
      if(this.eff[i].frz>0){c.fillStyle='rgba(224,242,254,.35)';c.beginPath();c.arc(m.x,m.y,m.r+4,0,TAU);c.fill();}
      if(this.eff[i].boost){c.strokeStyle=C.amber;c.lineWidth=3;c.setLineDash([5,5]);c.beginPath();c.arc(m.x,m.y,m.r+7,0,TAU);c.stroke();c.setLineDash([]);}});}
  matchStats(){return[[tr('st_shots'),this.stats.shots[0],this.stats.shots[1]],[tr('st_power'),this.stats.power[0],this.stats.power[1]],[tr('st_top'),Math.round(this.stats.top/10)+' km/h','']];}
}

/* ================= 4. VOLLEYBALL ================= */
const VB={G:530,net:480,top:385,nw:10};
const STARS=Array.from({length:70},()=>({x:Math.random()*W,y:Math.random()*260,r:Math.random()*1.4+.3}));
class Volley{
  constructor(){this.key='volley';this.score=[0,0];this.target=[5,7,11][M.len];this.over=false;this.acts=['jump'];this.g=980;this.winner=null;
    const mk=x=>({x,y:VB.G,vx:0,vy:0,r:44,onG:true,cd:0});this.s=[mk(240),mk(720)];this.b={x:240,y:200,vx:0,vy:0,r:15,rot:0};
    this.stats={spikes:[0,0],aces:[0,0],rally:0,best:0};this.buf=[];this.replayFrames=null;this.clk=0;this.serve(0);}
  serve(w){this.b.x=w===0?240:720;this.b.y=200;this.b.vx=this.b.vy=0;this.pause=1;this.touch={side:null,n:0};this.err=gauss()*30/M.A;this.server=w;this.rally=0;this.oppTouched=false;this.lastSpike=false;this.buf=[];}
  info(){return `${tr('firstTo')} ${this.target}`;}
  clock(){return this.touch.side===null?'':`${sideName(this.touch.side)} · ${this.touch.n}/3`;}
  snap(){const[p,a]=this.s,b=this.b;return[p.x,p.y,a.x,a.y,b.x,b.y,b.rot];}
  applySnap(v){const[p,a]=this.s,b=this.b;[p.x,p.y,a.x,a.y,b.x,b.y,b.rot]=v;}
  trailPt(){return{x:this.b.x,y:this.b.y,r:this.b.r};}
  predict(){let x=this.b.x,y=this.b.y,vx=this.b.vx,vy=this.b.vy;const h=1/120,cy=VB.G-this.s[1].r*.75,r=this.b.r;for(let i=0;i<420;i++){vy+=this.g*h;x+=vx*h;y+=vy*h;if(x<r){x=r;vx=-vx;}if(x>W-r){x=W-r;vx=-vx;}if(vy>0&&y>=cy)return x;}return x;}
  human(i){const s=this.s[i],c=ctl(i),pp=ptr(i);let ix=c.x;if(pp&&pp.down){const dx=pp.x-s.x;if(Math.abs(dx)>8)ix=Math.sign(dx)*Math.min(1,Math.abs(dx)/40);}
    if((c.up||c.act||(pp&&pp.justDown))&&s.onG){s.vy=-650;s.onG=false;SFX.click();}s.vx=ix*390;}
  ai(dt){const b=this.b,a=this.s[1];let tx=700;
    if(this.pause>0)tx=this.server===1?b.x+14:700;else{const px=this.predict();if(px>VB.net||b.x>VB.net)tx=Math.max(VB.net+a.r,px+16+this.err);}
    const dx=tx-a.x;a.vx=Math.abs(dx)<5?0:Math.sign(dx)*Math.min(390*(.68+.32*M.D),Math.abs(dx)*9);
    if(a.onG&&this.pause<=0&&b.x>VB.net&&Math.abs(b.x-a.x)<70&&b.y>VB.G-260&&b.y<VB.G-125&&b.vy>0&&Math.random()<2.6*M.D*dt){a.vy=-650;a.onG=false;}
    if(a.onG&&this.pause<=0&&M.A>.9&&b.x>VB.net&&b.x<VB.net+150&&Math.abs(b.x-a.x)<50&&b.y<VB.G-200&&b.y>VB.G-330&&b.vy>0&&Math.random()<1.5*M.A*dt){a.vy=-700;a.onG=false;}}
  update(dt){if(this.over)return;const [p,a]=this.s,b=this.b;this.clk+=dt;
    this.human(0);if(M.two)this.human(1);else this.ai(dt);
    for(let i=0;i<2;i++){const s=this.s[i],lo=i===0?s.r:VB.net+VB.nw/2+s.r,hi=i===0?VB.net-VB.nw/2-s.r:W-s.r;s.x=clamp(s.x+s.vx*dt,lo,hi);s.vy+=1800*dt;s.y+=s.vy*dt;if(s.y>=VB.G){s.y=VB.G;s.vy=0;s.onG=true;}s.cd-=dt;s.nh=Math.max(0,(s.nh||0)-dt);}
    if(this.pause>0){this.pause-=dt;return;}
    this.buf.push(this.snap());if(this.buf.length>150)this.buf.shift();
    const n=4,h=dt/n;
    for(let k=0;k<n;k++){b.vy+=this.g*h/2;b.x+=b.vx*h;b.y+=b.vy*h;b.vy+=this.g*h/2;b.rot+=b.vx*h*.03;
      for(let i=0;i<2;i++){const s=this.s[i];if(b.y>s.y+4||s.nh>0)continue;const imp=collide(b,s,.9,s);if(imp<=0)continue;
        const dxs=b.x-s.x,dys=b.y-s.y,dd=Math.hypot(dxs,dys)||1;if(dys/dd<-.35&&b.vy>-380)b.vy=-380;
        if(!s.onG&&Math.abs(s.x-VB.net)<170&&dys/dd<-.3&&s.cd<=0){const dir=i?-1:1;b.vx=dir*(580+Math.abs(s.vx)*.25);b.vy=80;s.nh=.18;this.stats.spikes[i]++;this.lastSpike=true;floatText(s.x+dir*40,s.y-110,tr('spike'),colP(i),38);SFX.spike();shake(5);}
        else this.lastSpike=false;
        capSpeed(b,800);
        if(s.cd<=0){s.cd=.2;SFX.hit(Math.min(1,imp/700));this.rally++;if(i!==this.server)this.oppTouched=true;if(this.touch.side===i)this.touch.n++;else this.touch={side:i,n:1};
          if(this.touch.n>3){this.point(1-i,tr('touches'));return;}}}
      collide(b,{x:VB.net,y:VB.top,r:VB.nw/2},.7);
      if(b.y>VB.top&&Math.abs(b.x-VB.net)<VB.nw/2+b.r){if(b.x<VB.net){b.x=VB.net-VB.nw/2-b.r;b.vx=-Math.abs(b.vx)*.7;}else{b.x=VB.net+VB.nw/2+b.r;b.vx=Math.abs(b.vx)*.7;}SFX.wall();}
      if(b.x<b.r){b.x=b.r;b.vx=Math.abs(b.vx)*.9;}if(b.x>W-b.r){b.x=W-b.r;b.vx=-Math.abs(b.vx)*.9;}if(b.y<-300){b.y=-300;b.vy=Math.abs(b.vy)*.5;}
      const bs=b.x<VB.net?0:1;if(this.touch.side!==null&&bs!==this.touch.side)this.touch={side:null,n:0};
      if(b.y+b.r>=VB.G){this.point(b.x<VB.net?1:0);return;}}}
  point(w,msg){this.score[w]++;const col=colP(w);this.stats.best=Math.max(this.stats.best,this.rally);
    const ace=!msg&&w===this.server&&!this.oppTouched;if(ace)this.stats.aces[w]++;
    floatText(480,230,msg||(ace?tr('ace'):tr('point')),col,msg?42:52);burst(this.b.x,VB.G,'#d9b06a',24,260);shake(6);(w===0||M.two)?SFX.score():SFX.concede();
    announce(`${tr('point')} ${sideName(0)} ${this.score[0]} – ${sideName(1)} ${this.score[1]}`);
    if((this.lastSpike||this.rally>=6)&&this.buf.length>30)this.replayFrames=this.buf.slice();
    if(this.score[w]>=this.target){this.over=true;SFX.whistle();}else this.serve(w);}
  draw(c){const g=c.createLinearGradient(0,0,0,VB.G);g.addColorStop(0,'#07101f');g.addColorStop(.7,'#12304c');g.addColorStop(1,'#1d4a63');c.fillStyle=g;c.fillRect(0,0,W,H);
    c.fillStyle='rgba(231,238,247,.7)';for(const s of STARS){c.globalAlpha=.3+s.r*.4;c.beginPath();c.arc(s.x,s.y,s.r,0,TAU);c.fill();}c.globalAlpha=1;
    const mg=c.createRadialGradient(820,90,0,820,90,60);mg.addColorStop(0,'rgba(245,176,65,.9)');mg.addColorStop(.4,'rgba(245,176,65,.25)');mg.addColorStop(1,'rgba(245,176,65,0)');c.fillStyle=mg;c.fillRect(740,10,160,160);
    c.fillStyle='#0d2a40';c.fillRect(0,VB.G-70,W,30);c.fillStyle='rgba(63,208,224,.2)';for(let x=0;x<W;x+=40)c.fillRect(x+(this.clk*30%40),VB.G-58,18,2);
    const sg=c.createLinearGradient(0,VB.G-40,0,H);sg.addColorStop(0,'#a77d45');sg.addColorStop(1,'#6e4f2b');c.fillStyle=sg;c.fillRect(0,VB.G-40,W,H);
    c.strokeStyle='rgba(231,238,247,.35)';c.lineWidth=2;c.beginPath();c.moveTo(0,VB.G);c.lineTo(W,VB.G);c.stroke();
    c.strokeStyle='rgba(245,176,65,.25)';c.setLineDash([6,8]);c.beginPath();c.moveTo(VB.net-170,VB.G+8);c.lineTo(VB.net+170,VB.G+8);c.stroke();c.setLineDash([]);
    c.fillStyle='#c9d6e6';c.fillRect(VB.net-3,VB.top-8,6,VB.G-VB.top+8);c.strokeStyle='rgba(231,238,247,.35)';c.lineWidth=1;
    for(let y=VB.top;y<VB.G-10;y+=11){c.beginPath();c.moveTo(VB.net-VB.nw/2,y);c.lineTo(VB.net+VB.nw/2,y);c.stroke();}
    c.fillStyle='#e7eef7';c.fillRect(VB.net-VB.nw/2-1,VB.top-4,VB.nw+2,6);
    const b=this.b;shadow(c,b.x,VB.G+4,b.r*(1-clamp((VB.G-b.y)/800,0,.6)),4,.3);
    this.s.forEach((s,i)=>{const col=colP(i),face=i?-1:1;shadow(c,s.x,VB.G+4,s.r*.95,6,.35);c.fillStyle=col;c.beginPath();c.arc(s.x,s.y,s.r,Math.PI,0);c.closePath();c.fill();
      const gg=c.createLinearGradient(s.x,s.y-s.r,s.x,s.y);gg.addColorStop(0,'rgba(255,255,255,.3)');gg.addColorStop(1,'rgba(0,0,0,.25)');c.fillStyle=gg;c.beginPath();c.arc(s.x,s.y,s.r,Math.PI,0);c.closePath();c.fill();
      const ex=s.x+face*s.r*.42,ey=s.y-s.r*.55;c.fillStyle='#fff';c.beginPath();c.arc(ex,ey,8,0,TAU);c.fill();const an=Math.atan2(b.y-ey,b.x-ex);c.fillStyle='#0a1322';c.beginPath();c.arc(ex+Math.cos(an)*3.5,ey+Math.sin(an)*3.5,4,0,TAU);c.fill();});
    c.save();c.translate(b.x,b.y);c.rotate(b.rot);c.fillStyle='#f3efe0';c.beginPath();c.arc(0,0,b.r,0,TAU);c.fill();c.strokeStyle='#2a6fdb';c.lineWidth=2.2;
    for(let i=0;i<3;i++){c.rotate(TAU/3);c.beginPath();c.arc(b.r*.9,0,b.r*.9,Math.PI*.6,Math.PI*1.4);c.stroke();}c.restore();shade(c,b.x,b.y,b.r);
    if(this.pause>0&&b.y<260){c.strokeStyle='rgba(245,176,65,.5)';c.setLineDash([4,6]);c.beginPath();c.moveTo(b.x,b.y+b.r+4);c.lineTo(b.x,VB.G-50);c.stroke();c.setLineDash([]);}
    if(this.touch.side!==null){const s=this.s[this.touch.side];for(let i=0;i<3;i++){c.fillStyle=i<this.touch.n?colP(this.touch.side):'rgba(231,238,247,.2)';c.beginPath();c.arc(s.x-14+i*14,s.y-s.r-16,4,0,TAU);c.fill();}}}
  matchStats(){return[[tr('st_spikes'),this.stats.spikes[0],this.stats.spikes[1]],[tr('st_aces'),this.stats.aces[0],this.stats.aces[1]],[tr('st_rally'),this.stats.best,'']];}
}

/* ================= 5. POOL ================= */
const PT={x0:110,x1:850,y0:125,y1:495};PT.cy=(PT.y0+PT.y1)/2;PT.head=PT.x0+(PT.x1-PT.x0)*.25;PT.foot=PT.x0+(PT.x1-PT.x0)*.72;
const POCKETS=[[PT.x0-4,PT.y0-4,1],[PT.x1+4,PT.y0-4,1],[PT.x0-4,PT.y1+4,1],[PT.x1+4,PT.y1+4,1],[480,PT.y0-10,0],[480,PT.y1+10,0]].map(([x,y,cr])=>({x,y,corner:!!cr,cr:cr?22:20,ax:x+(x<480?10:x>480?-10:0),ay:y+(y<PT.cy?10:-10)}));
const BC=['#f4f1e8','#f2c230','#2a6fdb','#e0412f','#7b4bc9','#f08a24','#1f9a5a','#8c2d2d','#121212'];
const SPIN={x:W/2+200,y:566,r:20};
class Pool{
  constructor(){this.key='billiards';this.r=11;this.over=false;this.acts=[];this.score=[0,0];this.balls=[];this.winner=null;
    this.cue=this.mk(0,PT.head,PT.cy);this.balls.push(this.cue);this.rack();
    this.shooter=0;this.groups=[null,null];this.state='aim';this.isBreak=true;this.aim=0;this.power=0;this.drag=null;this.charging=false;this.aiT=0;this.aiAim=null;this.spin=0;this.bih=false;this.moving=false;
    this.potted=[];this.firstHit=null;this.spinDone=false;this.msg=tr('breakShot');this.msgT=2;this.curRun=0;this.stats={potted:[0,0],fouls:[0,0],run:[0,0]};}
  mk(n,x,y){return{n,x,y,vx:0,vy:0,r:this.r,in:false};}
  rack(){const order=[1,9,2,10,8,3,11,7,14,4,5,13,15,6,12],r=this.r;let i=0;for(let row=0;row<5;row++)for(let k=0;k<=row;k++)this.balls.push(this.mk(order[i++],PT.foot+row*(2*r*.866+.4),PT.cy+(k-row/2)*(2*r+.4)));}
  grp(n){return n<8?'solid':'stripe';}
  ownLeft(s){const g=this.groups[s];return g?this.balls.filter(b=>!b.in&&b.n!==0&&b.n!==8&&this.grp(b.n)===g).length:7;}
  targets(s){const g=this.groups[s];let t;if(!g)t=this.balls.filter(b=>!b.in&&b.n!==0&&b.n!==8);else if(this.ownLeft(s)===0)t=this.balls.filter(b=>b.n===8&&!b.in);else t=this.balls.filter(b=>!b.in&&b.n!==0&&b.n!==8&&this.grp(b.n)===g);return t.length?t:this.balls.filter(b=>b.n===8);}
  human(){return this.shooter===0||M.two;}
  info(){const g=this.groups;return g[0]?`${sideName(0)}: ${tr(g[0])} · ${sideName(1)}: ${tr(g[1])}`:tr('openTable');}
  clock(){return (M.two?(this.shooter?tr('p2Turn'):tr('p1Turn')):(this.shooter===0?tr('yourTurn'):tr('aiTurn')))+(this.bih&&this.state==='aim'?' · '+tr('bih'):'');}
  shoot(a,sp){this.cue.vx=Math.cos(a)*sp;this.cue.vy=Math.sin(a)*sp;this.shotDir={x:Math.cos(a),y:Math.sin(a)};this.state='roll';this.potted=[];this.firstHit=null;this.spinDone=false;this.power=0;this.bih=false;this.moving=false;SFX.cue(sp/1500);}
  update(dt){if(this.over)return;if(this.msgT>0)this.msgT-=dt;
    if(this.state==='aim'){if(this.human())this.playerAim(dt);else this.aiStep(dt);return;}
    this.physics(dt);if(this.balls.every(b=>b.in||(b.vx===0&&b.vy===0)))this.resolve();}
  inSpin(p){return hyp(p.x-SPIN.x,p.y-SPIN.y)<SPIN.r+14;}
  playerAim(dt){const c=this.cue,p=ptr(),k=M.two?[ctl(0),ctl(1)]:[ctl(0)];const any=f=>k.some(f);
    if(any(x=>x.up))this.spin=Math.min(1,this.spin+1);if(any(x=>x.down))this.spin=Math.max(-1,this.spin-1);
    if(p&&p.justDown&&this.inSpin(p)){this.spin=this.spin>=1?-1:this.spin+1;SFX.click();return;}
    if(this.bih&&p&&p.justDown&&hyp(p.x-c.x,p.y-c.y)<this.r*2.5){this.moving=true;}
    if(this.moving){if(p&&p.down){this.placeAt(p.x,p.y);}else this.moving=false;return;}
    if(p&&p.type==='mouse'&&!p.down&&p.inside&&!this.charging&&!this.inSpin(p))this.aim=Math.atan2(p.y-c.y,p.x-c.x);
    const fine=keys.has('ShiftLeft')||keys.has('ShiftRight')?.22:1.1;if(any(x=>x.x<0))this.aim-=fine*dt;if(any(x=>x.x>0))this.aim+=fine*dt;
    if(p&&p.justDown){this.aim=Math.atan2(p.y-c.y,p.x-c.x);this.drag={x:p.x,y:p.y};}
    if(this.drag){const dx=Math.cos(this.aim),dy=Math.sin(this.aim),q=p||this.drag;const pull=-((q.x-this.drag.x)*dx+(q.y-this.drag.y)*dy);this.power=clamp(pull/200,0,1);
      if(!p||!p.down){this.drag=null;if(this.power>.03)this.shoot(this.aim,120+this.power*1380);else this.power=0;return;}}
    if(any(x=>x.actHeld)){this.charging=true;this.power=Math.min(1,this.power+dt*.75);}else if(this.charging){this.charging=false;if(this.power>.03)this.shoot(this.aim,120+this.power*1380);}}
  placeAt(x,y){const r=this.r,c=this.cue;const nx=clamp(x,PT.x0+r,PT.x1-r),ny=clamp(y,PT.y0+r,PT.y1-r);if(this.balls.some(o=>o!==c&&!o.in&&hyp(o.x-nx,o.y-ny)<2*r+1))return false;c.x=nx;c.y=ny;return true;}
  aiStep(dt){if(!this.aiAim){if(this.bih)this.aiPlace();this.aiAim=this.plan();this.aiT=1.1;this.spin=this.aiAim.spin||0;}this.aiT-=dt;
    const da=((this.aiAim.a-this.aim)%TAU+TAU*1.5)%TAU-Math.PI;this.aim+=da*Math.min(1,dt*5);this.power=this.aiAim.p*clamp(1.1-this.aiT,0,1);
    if(this.aiT<=0){const s=this.aiAim;this.aiAim=null;this.shoot(s.a+gauss()*(.014/M.A),s.s);}}
  aiPlace(){const c=this.cue;let best=null;for(let gx=0;gx<12;gx++)for(let gy=0;gy<6;gy++){const x=PT.x0+30+gx*(PT.x1-PT.x0-60)/11,y=PT.y0+30+gy*(PT.y1-PT.y0-60)/5;if(!this.placeAt(x,y))continue;const p=this.plan();if(!best||p.sc>best.sc)best={x,y,sc:p.sc};}
    if(best){c.x=best.x;c.y=best.y;}}
  clear(ax,ay,bx,by,ign){const dx=bx-ax,dy=by-ay,L2=dx*dx+dy*dy||1,R=2*this.r-1;for(const o of this.balls){if(o.in||ign.includes(o))continue;const t=clamp(((o.x-ax)*dx+(o.y-ay)*dy)/L2,0,1),px=ax+dx*t-o.x,py=ay+dy*t-o.y;if(px*px+py*py<R*R)return false;}return true;}
  plan(){const c=this.cue,r=this.r;
    if(this.isBreak){const ap=this.balls.find(b=>b.n===1);return{a:Math.atan2(ap.y-c.y+gauss()*2,ap.x-c.x),s:1450,p:.96,sc:0,spin:0};}
    const tg=this.targets(1);let best=null;
    for(const b of tg)for(const pk of POCKETS){let ux=pk.ax-b.x,uy=pk.ay-b.y;const d2=Math.hypot(ux,uy)||1;ux/=d2;uy/=d2;if(!pk.corner&&Math.abs(uy)<.35)continue;
      const gx=b.x-ux*2*r,gy=b.y-uy*2*r;if(gx<PT.x0+r-1||gx>PT.x1-r+1||gy<PT.y0+r-1||gy>PT.y1-r+1)continue;
      let vx=gx-c.x,vy=gy-c.y;const d1=Math.hypot(vx,vy);if(d1<1)continue;vx/=d1;vy/=d1;const cut=Math.acos(clamp(vx*ux+vy*uy,-1,1));if(cut>1.3)continue;
      if(!this.clear(c.x,c.y,gx,gy,[c,b])||!this.clear(b.x,b.y,pk.ax,pk.ay,[b,c]))continue;
      const sc=-cut*1.8-(d1+d2)/700;if(!best||sc>best.sc){const sp=clamp(300+(d1*.55+d2/Math.max(.35,Math.cos(cut)))*1.2,350,1350);
        const after={x:gx+vx*60,y:gy+vy*60};const scratchRisk=POCKETS.some(q=>hyp(q.x-after.x,q.y-after.y)<45);best={sc,a:Math.atan2(vy,vx),s:sp,spin:cut<.25?(scratchRisk?-1:0):0};}}
    if(!best){let nb=null,nd=1e9;for(const b of tg){const d=Math.hypot(b.x-c.x,b.y-c.y);if(d<nd&&this.clear(c.x,c.y,b.x,b.y,[c,b])){nd=d;nb=b;}}if(!nb)nb=tg[0];best={a:Math.atan2(nb.y-c.y,nb.x-c.x),s:760,sc:-99,spin:0};}
    best.p=(best.s-120)/1380;return best;}
  physics(dt){const n=8,h=dt/n,r=this.r,R2=4*r*r,live=this.balls.filter(b=>!b.in);
    for(let s=0;s<n;s++){
      for(const b of live){if(b.in)continue;b.x+=b.vx*h;b.y+=b.vy*h;const sp=Math.hypot(b.vx,b.vy);if(sp>0){const ns=sp-(95+sp*.32)*h;if(ns<2){b.vx=b.vy=0;}else{b.vx*=ns/sp;b.vy*=ns/sp;}}this.cushion(b);}
      for(let i=0;i<live.length;i++){const A=live[i];if(A.in)continue;for(let j=i+1;j<live.length;j++){const B=live[j];if(B.in)continue;const dx=B.x-A.x,dy=B.y-A.y,d2=dx*dx+dy*dy;
        if(d2<R2&&d2>0){const d=Math.sqrt(d2),nx=dx/d,ny=dy/d,ov=(2*r-d)/2;A.x-=nx*ov;A.y-=ny*ov;B.x+=nx*ov;B.y+=ny*ov;const rel=(A.vx-B.vx)*nx+(A.vy-B.vy)*ny;
          if(rel>0){const j2=rel*.97;A.vx-=j2*nx;A.vy-=j2*ny;B.vx+=j2*nx;B.vy+=j2*ny;
            if(this.firstHit===null){if(A.n===0)this.firstHit=B.n;else if(B.n===0)this.firstHit=A.n;}
            if(!this.spinDone&&(A.n===0||B.n===0)&&this.spin){this.spinDone=true;const cue=A.n===0?A:B,k=this.spin>0?.42:-.55;cue.vx+=this.shotDir.x*rel*k;cue.vy+=this.shotDir.y*rel*k;}
            else if(!this.spinDone&&(A.n===0||B.n===0))this.spinDone=true;
            if(rel>30)SFX.clack(Math.min(1,rel/900));}}}}}}
  cushion(b){const r=this.r;
    for(const pk of POCKETS)if(Math.hypot(b.x-pk.x,b.y-pk.y)<pk.cr){this.pot(b,pk);return;}
    const nearCorner=POCKETS.some(pk=>pk.corner&&Math.hypot(b.x-pk.x,b.y-pk.y)<28),nearMid=Math.abs(b.x-480)<20;
    if(!nearCorner){if(b.x<PT.x0+r){b.x=PT.x0+r;b.vx=Math.abs(b.vx)*.78;}if(b.x>PT.x1-r){b.x=PT.x1-r;b.vx=-Math.abs(b.vx)*.78;}
      if(!nearMid){if(b.y<PT.y0+r){b.y=PT.y0+r;b.vy=Math.abs(b.vy)*.78;}if(b.y>PT.y1-r){b.y=PT.y1-r;b.vy=-Math.abs(b.vy)*.78;}}}
    if(b.x<PT.x0-14||b.x>PT.x1+14||b.y<PT.y0-14||b.y>PT.y1+14){let best=POCKETS[0],bd=1e9;for(const pk of POCKETS){const d=Math.hypot(b.x-pk.x,b.y-pk.y);if(d<bd){bd=d;best=pk;}}this.pot(b,best);}}
  pot(b,pk){b.in=true;b.vx=b.vy=0;this.potted.push(b.n);SFX.pot();burst(pk.x,pk.y,b.n===0?BC[0]:BC[b.n===8?8:(b.n>8?b.n-8:b.n)],10,140);}
  place(b,x,y){b.in=false;b.vx=b.vy=0;b.x=x;b.y=y;let tries=0;while(this.balls.some(o=>o!==b&&!o.in&&Math.hypot(o.x-b.x,o.y-b.y)<2*this.r+1)&&tries<40){b.y=PT.cy+((tries%2?1:-1)*Math.ceil((tries+1)/2))*(2*this.r+2);if(b.y<PT.y0+this.r||b.y>PT.y1-this.r){b.x-=2*this.r+2;b.y=PT.cy;}tries++;}}
  resolve(){const me=this.shooter,op=1-me,pot=this.potted,g=this.groups[me];
    const cueIn=pot.includes(0),eightIn=pot.includes(8);
    const clearedBefore=!!g&&this.balls.filter(b=>b.n!==0&&b.n!==8&&this.grp(b.n)===g&&(!b.in||pot.includes(b.n))).length===0;
    let foul=cueIn||this.firstHit===null;
    if(!foul&&g){if(clearedBefore){if(this.firstHit!==8)foul=true;}else if(this.firstHit===8||this.grp(this.firstHit)!==g)foul=true;}
    if(eightIn){if(this.isBreak)this.place(this.balls.find(b=>b.n===8),PT.foot,PT.cy);else{this.finish(!foul&&clearedBefore?me:op);return;}}
    if(!g&&!foul){const f=pot.find(n=>n!==0&&n!==8);if(f!=null){this.groups[me]=this.grp(f);this.groups[op]=this.groups[me]==='solid'?'stripe':'solid';}}
    const gg=this.groups[me],own=pot.filter(n=>n!==0&&n!==8&&(!gg||this.grp(n)===gg)).length;
    this.stats.potted[me]+=pot.filter(n=>n!==0&&n!==8).length;
    if(cueIn)this.place(this.cue,PT.head,PT.cy);
    this.isBreak=false;
    if(foul){this.msg=tr('foul');this.msgT=1.6;SFX.foul();this.stats.fouls[me]++;this.curRun=0;this.shooter=op;this.bih=true;announce(tr('foul')+' '+tr('bih'));}
    else if(!own){this.curRun=0;this.shooter=op;this.msg=M.two?(op?tr('p2Turn'):tr('p1Turn')):(op===0?tr('yourTurn'):tr('aiTurn'));this.msgT=1.1;}
    else{this.curRun+=own;this.stats.run[me]=Math.max(this.stats.run[me],this.curRun);this.msg=tr('again');this.msgT=1.1;}
    this.updScore();this.state='aim';this.aiAim=null;this.drag=null;this.charging=false;this.power=0;if(!this.human())this.spin=0;}
  updScore(){for(let i=0;i<2;i++){const g=this.groups[i];this.score[i]=g?this.balls.filter(b=>b.in&&b.n!==0&&b.n!==8&&this.grp(b.n)===g).length:0;}}
  finish(w){this.updScore();this.over=true;this.winner=w===0?1:-1;this.msg=M.two?(w?tr('p2win'):tr('p1win')):(w===0?tr('win'):tr('loss'));this.msgT=3;(w===0||M.two)?SFX.goal():SFX.concede();announce(this.msg);}
  cast(a){const c=this.cue,dx=Math.cos(a),dy=Math.sin(a),R=2*this.r;let best=Infinity,hit=null;
    for(const b of this.balls){if(b.in||b===c)continue;const fx=b.x-c.x,fy=b.y-c.y,tca=fx*dx+fy*dy;if(tca<0)continue;const d2=fx*fx+fy*fy-tca*tca;if(d2>R*R)continue;const tt=tca-Math.sqrt(R*R-d2);if(tt<best){best=tt;hit=b;}}
    let tc=Infinity;const r=this.r;if(dx>0)tc=Math.min(tc,(PT.x1-r-c.x)/dx);if(dx<0)tc=Math.min(tc,(PT.x0+r-c.x)/dx);if(dy>0)tc=Math.min(tc,(PT.y1-r-c.y)/dy);if(dy<0)tc=Math.min(tc,(PT.y0+r-c.y)/dy);
    return tc<best?{t:tc,hit:null}:{t:best,hit};}
  drawBall(c,b,x=b.x,y=b.y,r=this.r){const n=b.n,col=n===0?BC[0]:n===8?BC[8]:BC[n>8?n-8:n];
    c.save();c.beginPath();c.arc(x,y,r,0,TAU);c.clip();if(n>8){c.fillStyle=BC[0];c.fillRect(x-r,y-r,2*r,2*r);c.fillStyle=col;c.fillRect(x-r,y-r*.55,2*r,r*1.1);}else{c.fillStyle=col;c.fillRect(x-r,y-r,2*r,2*r);}
    if(n>0&&r>7){c.fillStyle=BC[0];c.beginPath();c.arc(x,y,r*.5,0,TAU);c.fill();c.fillStyle='#111';c.font=`700 ${Math.round(r*.72)}px "JetBrains Mono", monospace`;c.textAlign='center';c.textBaseline='middle';c.fillText(n,x,y+.5);}
    c.restore();shade(c,x,y,r);}
  draw(c){c.fillStyle='#070d18';c.fillRect(0,0,W,H);
    const lg=c.createRadialGradient(W/2,PT.cy,50,W/2,PT.cy,560);lg.addColorStop(0,'rgba(245,176,65,.12)');lg.addColorStop(1,'rgba(245,176,65,0)');c.fillStyle=lg;c.fillRect(0,0,W,H);
    c.fillStyle='#2b1d16';c.beginPath();c.roundRect(PT.x0-40,PT.y0-40,PT.x1-PT.x0+80,PT.y1-PT.y0+80,22);c.fill();
    c.strokeStyle='rgba(245,176,65,.25)';c.lineWidth=2;c.beginPath();c.roundRect(PT.x0-34,PT.y0-34,PT.x1-PT.x0+68,PT.y1-PT.y0+68,18);c.stroke();
    c.fillStyle='#0b4650';c.fillRect(PT.x0-14,PT.y0-14,PT.x1-PT.x0+28,PT.y1-PT.y0+28);
    const cg=c.createRadialGradient(W/2,PT.cy,30,W/2,PT.cy,440);cg.addColorStop(0,'#16727c');cg.addColorStop(1,'#0e5761');c.fillStyle=cg;c.fillRect(PT.x0,PT.y0,PT.x1-PT.x0,PT.y1-PT.y0);
    c.fillStyle=C.amber;for(let i=1;i<8;i++){if(i===4)continue;const x=PT.x0+(PT.x1-PT.x0)*i/8;c.beginPath();c.arc(x,PT.y0-26,2.5,0,TAU);c.arc(x,PT.y1+26,2.5,0,TAU);c.fill();}
    for(let i=1;i<4;i++){const y=PT.y0+(PT.y1-PT.y0)*i/4;c.beginPath();c.arc(PT.x0-26,y,2.5,0,TAU);c.arc(PT.x1+26,y,2.5,0,TAU);c.fill();}
    c.strokeStyle='rgba(231,238,247,.12)';c.lineWidth=1;c.beginPath();c.moveTo(PT.head,PT.y0);c.lineTo(PT.head,PT.y1);c.stroke();c.fillStyle='rgba(231,238,247,.25)';c.beginPath();c.arc(PT.foot,PT.cy,2.5,0,TAU);c.fill();
    for(const pk of POCKETS){c.fillStyle='#030508';c.beginPath();c.arc(pk.x,pk.y,pk.cr,0,TAU);c.fill();c.strokeStyle='rgba(245,176,65,.35)';c.lineWidth=2;c.stroke();}
    for(const b of this.balls)if(!b.in)shadow(c,b.x+2,b.y+3,this.r,this.r*.8,.35);
    const cue=this.cue,col=colP(this.shooter);
    if(this.state==='aim'&&!this.over&&!cue.in){const a=this.aim,dx=Math.cos(a),dy=Math.sin(a);
      if(this.bih&&this.human()){c.strokeStyle=col;c.setLineDash([3,4]);c.lineWidth=2;c.beginPath();c.arc(cue.x,cue.y,this.r*2.2,0,TAU);c.stroke();c.setLineDash([]);}
      if(this.human()&&!this.moving){const g=this.cast(a),gx=cue.x+dx*g.t,gy=cue.y+dy*g.t;c.strokeStyle='rgba(231,238,247,.55)';c.setLineDash([6,6]);c.lineWidth=1.5;c.beginPath();c.moveTo(cue.x,cue.y);c.lineTo(gx,gy);c.stroke();c.setLineDash([]);
        c.strokeStyle='rgba(231,238,247,.7)';c.beginPath();c.arc(gx,gy,this.r,0,TAU);c.stroke();
        const len=M.A<.8?150:M.A>1.2?0:75;if(g.hit&&len){const nx=g.hit.x-gx,ny=g.hit.y-gy,nl=Math.hypot(nx,ny)||1,own=this.targets(this.shooter).includes(g.hit);c.strokeStyle=own?C.good:C.coral;c.lineWidth=2.5;c.beginPath();c.moveTo(g.hit.x,g.hit.y);c.lineTo(g.hit.x+nx/nl*len,g.hit.y+ny/nl*len);c.stroke();}}
      if(!this.moving){const pull=14+this.power*70;c.lineCap='round';c.strokeStyle='#5a3a22';c.lineWidth=7;c.beginPath();c.moveTo(cue.x-dx*pull,cue.y-dy*pull);c.lineTo(cue.x-dx*(pull+330),cue.y-dy*(pull+330));c.stroke();
        c.strokeStyle='#e9dcc0';c.lineWidth=5;c.beginPath();c.moveTo(cue.x-dx*pull,cue.y-dy*pull);c.lineTo(cue.x-dx*(pull+70),cue.y-dy*(pull+70));c.stroke();
        c.strokeStyle=col;c.lineWidth=4;c.beginPath();c.moveTo(cue.x-dx*pull,cue.y-dy*pull);c.lineTo(cue.x-dx*(pull+5),cue.y-dy*(pull+5));c.stroke();c.lineCap='butt';}}
    for(const b of this.balls)if(!b.in)this.drawBall(c,b);
    // power + spin widget
    meter(c,W/2-300,563,240,this.power,col);label(c,'POWER',W/2-310,566,'rgba(231,238,247,.5)',11,'right');
    c.fillStyle='#f4f1e8';c.beginPath();c.arc(SPIN.x,SPIN.y,SPIN.r,0,TAU);c.fill();c.fillStyle=C.coral;c.beginPath();c.arc(SPIN.x,SPIN.y-this.spin*12,5,0,TAU);c.fill();
    c.strokeStyle='rgba(6,11,20,.3)';c.lineWidth=1;c.beginPath();c.moveTo(SPIN.x-SPIN.r,SPIN.y);c.lineTo(SPIN.x+SPIN.r,SPIN.y);c.stroke();
    label(c,`${tr('spin')}: ${tr(this.spin>0?'spin_f':this.spin<0?'spin_d':'spin_s')}`,SPIN.x+30,SPIN.y,C.ink,12,'left');
    const tray=(side,x0,dir)=>{const g=this.groups[side];label(c,sideName(side),x0,32,colP(side),13,dir>0?'left':'right');if(!g)return;
      this.balls.filter(b=>b.n!==0&&b.n!==8&&this.grp(b.n)===g).sort((a,b)=>a.n-b.n).forEach((b,i)=>{c.globalAlpha=b.in?1:.18;this.drawBall(c,b,x0+dir*(56+i*24),32,9);c.globalAlpha=1;});};
    tray(0,PT.x0-30,1);tray(1,PT.x1+30,-1);
    if(this.bih&&this.human()&&this.state==='aim')label(c,tr('bihHint'),W/2,PT.y1+52,C.amber,12);
    if(this.msgT>0)banner(c,this.msg,this.over?colP(this.winner>0?0:1):C.ink,this.msgT);}
  matchStats(){return[[tr('st_potted'),this.stats.potted[0],this.stats.potted[1]],[tr('st_run'),this.stats.run[0],this.stats.run[1]],[tr('st_fouls'),this.stats.fouls[0],this.stats.fouls[1]]];}
}

const SPORTS={basket:Basket,football:Football,hockey:AirHockey,volley:Volley,billiards:Pool};

/* ================= UI ================= */
const UI={ready:false};
let game=null,run=null,cv=null,ctx=null,scale=1,last=0;
const $=id=>document.getElementById(id);
function setTxt(id,v){const el=$(id);v=String(v);if(el&&el.textContent!==v)el.textContent=v;}
function toast(html){const el=document.createElement('div');el.className='toast';el.innerHTML=html;$('toasts').appendChild(el);setTimeout(()=>el.remove(),3400);}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}

let touchSeen=false;
function isTouch(){return touchSeen||root.matchMedia('(pointer: coarse)').matches||((navigator.maxTouchPoints||0)>0&&!root.matchMedia('(pointer: fine)').matches);}
function startMatch(key){M=matchConfig(run,key);FX.parts=[];FX.texts=[];FX.shake=0;FX.trail=[];
  game={sport:new SPORTS[key](),endT:0,paused:false,shown:false,replay:null};
  if(!HAS_DOM)return game;
  $('menu').hidden=true;$('game').hidden=false;$('pauseOv').hidden=true;$('resOv').hidden=true;$('skipReplay').hidden=true;
  setTxt('hName',tr(key));setTxt('nmP',sideName(0));setTxt('nmA',sideName(1));
  const g=$('game');g.style.setProperty('--pc',ST.skin==='prism'?C.cyan:skinCol(ST.skin));g.style.setProperty('--oc',colP(1));
  const coarse=isTouch(),acts=M.two?[]:game.sport.acts;
  $('btnAct').hidden=!(coarse&&acts[0]);if(acts[0])$('btnAct').textContent=tr(acts[0]);$('btnSpr').hidden=!(coarse&&acts[1]);if(acts[1])$('btnSpr').textContent=tr(acts[1]);
  updateHint();fit();SFX.whistle();cv.focus({preventScroll:true});return game;}
function updateHint(){if(!game)return;const coarse=isTouch(),portrait=innerHeight>innerWidth,k=game.sport.key;
  let h=M.two?(k==='basket'||k==='billiards'?tr('c2turns')+' '+tr('c_'+k):tr('c2')):tr('c_'+k);if(coarse&&portrait)h=tr('rotate')+' · '+h;setTxt('hint',h);}
function fit(){if(!game||!cv)return;const st=$('stage').getBoundingClientRect();let w=st.width,h=w/1.6;if(h>st.height){h=st.height;w=h*1.6;}
  w=Math.max(200,Math.floor(w));h=Math.floor(w/1.6);cv.style.width=w+'px';cv.style.height=h+'px';const dpr=Math.min(2,root.devicePixelRatio||1);cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);scale=cv.width/W;}
function setPause(v){if(!game||game.sport.over||game.shown)return;game.paused=v;$('pauseOv').hidden=!v;if(v){setTxt('pauseHint',tr('pauseKeys'));$('resBtn').focus();}else cv.focus({preventScroll:true});}
function toMenu(){game=null;run=null;keys.clear();$('game').hidden=true;$('menu').hidden=false;renderMenu();}

function step(dt){const s=game.sport;
  if(game.replay){const r=game.replay;r.i+=dt*60*.45;if(r.i>=r.frames.length||r.skip){s.applySnap(r.cur);game.replay=null;if(HAS_DOM)$('skipReplay').hidden=true;}else s.applySnap(r.frames[Math.floor(r.i)]);updFX(dt);return;}
  if(game.paused||game.shown)return;
  for(const p of PTRS.values())if(p.down)p.holdT+=dt;
  s.update(dt);updFX(dt);
  if(s.trailPt){const t=s.trailPt();FX.trail.push(t);if(FX.trail.length>14)FX.trail.shift();}
  if(s.replayFrames){if(ST.prefs.replay&&!calm()){game.replay={frames:s.replayFrames.slice(-130),i:0,cur:s.snap()};if(HAS_DOM)$('skipReplay').hidden=false;FX.trail=[];}s.replayFrames=null;}
  if(s.over){game.endT+=dt;if(game.endT>1.4&&!game.replay){game.shown=true;if(HAS_DOM)showResult();}}}
function loop(ts){const dt=Math.min(.033,(ts-last)/1000||0);last=ts;
  if(game){step(dt);render();const s=game.sport;setTxt('hsP',s.score[0]);setTxt('hsA',s.score[1]);setTxt('hInfo',s.info());setTxt('hClock',s.clock());}
  endFrameInput();root.requestAnimationFrame(loop);}
function render(){ctx.setTransform(scale,0,0,scale,0,0);ctx.save();if(FX.shake>0)ctx.translate(rand(-FX.shake,FX.shake)*.5,rand(-FX.shake,FX.shake)*.5);game.sport.draw(ctx);if(!game.replay)drawTrail(ctx);drawFX(ctx);
  if(game.replay){ctx.fillStyle='rgba(6,11,20,.25)';ctx.fillRect(0,0,W,H);ctx.strokeStyle=C.amber;ctx.lineWidth=6;ctx.strokeRect(3,3,W-6,H-6);label(ctx,'● '+tr('replay'),24,28,C.coral,16,'left');meter(ctx,24,46,160,game.replay.i/game.replay.frames.length,C.amber);}
  ctx.restore();}

function statRows(s){if(!s.matchStats)return'';return `<table class="t"><caption class="sr">${tr('matchStats')}</caption><thead><tr><th scope="col">${tr('matchStats')}</th><th class="n" scope="col">${esc(sideName(0))}</th><th class="n" scope="col">${esc(sideName(1))}</th></tr></thead><tbody>${s.matchStats().map(r=>`<tr><td>${r[0]}</td><td class="n">${r[1]}</td><td class="n">${r[2]}</td></tr>`).join('')}</tbody></table>`;}
function showResult(){const s=game.sport,r=finishMatch(run,s),o=r.o;
  const title=M.two?(o>0?tr('p1win'):o<0?tr('p2win'):tr('draw')):(o>0?tr('win'):o<0?tr('loss'):tr('draw'));
  const multi=run.mode==='tour'||run.mode==='career';let btns;
  if(multi)btns=`<button class="btn pri" id="rNext" type="button">${r.runDone?tr('final'):tr('next')}</button><button class="btn" id="rMenu" type="button">${tr('menu')}</button>`;
  else btns=`<button class="btn pri" id="rAgain" type="button">${tr('rematch')}</button><button class="btn" id="rMenu" type="button">${tr('menu')}</button>`;
  const pts=multi?runPoints(run):null;
  $('resBox').innerHTML=`<div class="lbl">${tr(s.key)}${multi?` · ${tr('event')} ${run.res.length}/5`:''}${run.mode==='career'?' · '+tr('league_'+run.league):''}</div>
    <h2 id="resTitle" style="color:${o>0?colP(0):o<0?colP(1):C.ink}">${title}</h2>
    <div class="big"><span class="p">${s.score[0]}</span> : <span class="a">${s.score[1]}</span></div>${statRows(s)}
    ${pts?`<div class="lbl">${tr('total')}: ${esc(sideName(0))} ${pts[0]} · ${esc(sideName(1))} ${pts[1]} ${tr('points')}</div>`:''}
    <div class="rewards"><span>${tr('xpGain',r.xp)}</span><span>${tr('coinGain',r.coins)}</span></div>
    ${r.level?`<p class="ok"><b>${tr('levelUp',r.level)}</b></p>`:''}${r.daily!=null?`<p class="${r.daily?'ok':'no'}">${r.daily?tr('dailyOk'):tr('dailyFail')}</p>`:''}
    ${r.ach.length?`<p><span class="lbl">${tr('newAch')}</span><br>${r.ach.map(a=>esc(tr('a_'+a))).join(' · ')}</p>`:''}<div class="btns">${btns}</div>`;
  $('resOv').hidden=false;
  const b=id=>document.getElementById(id);
  if(b('rAgain'))b('rAgain').onclick=()=>{SFX.click();startMatch(s.key);};
  b('rMenu').onclick=()=>{SFX.click();toMenu();};
  if(b('rNext'))b('rNext').onclick=()=>{SFX.click();if(r.runDone)showFinal();else startMatch(SPORT_KEYS[run.res.length]);};
  (b('rAgain')||b('rNext')).focus();}
function showFinal(){const f=finishRun(run),champ=f.champ,isCareer=run.mode==='career';
  const rows=run.res.map(r=>`<tr><td>${tr(r.key)}</td><td><span class="res ${r.o>0?'w':r.o<0?'l':'d'}">${r.o>0?tr('wS'):r.o<0?tr('lS'):tr('dS')}</span></td><td class="n">${r.score[0]}:${r.score[1]}</td></tr>`).join('');
  const title=isCareer?(champ?tr('leagueWon'):tr('leagueLost')):(M.two?(champ?tr('p1win'):f.p===f.a?tr('tourDraw'):tr('p2win')):(champ?tr('champ'):f.p===f.a?tr('tourDraw'):tr('tourLoss')));
  $('resBox').innerHTML=`<div class="lbl">${isCareer?tr('league_'+run.league):'Pentathlon'}</div><h2 id="resTitle" style="color:${champ?C.amber:C.ink}">${title}</h2>
    <div class="big"><span class="p">${f.p}</span> : <span class="a">${f.a}</span></div><table class="t"><tbody>${rows}</tbody></table>
    ${f.coins?`<div class="rewards"><span>${tr('xpGain',f.xp)}</span><span>${tr('coinGain',f.coins)}</span></div>`:''}${f.unlocked?`<p class="ok"><b>${tr('league_'+f.unlocked)}: ${tr('open')}</b></p>`:''}
    ${f.ach.length?`<p><span class="lbl">${tr('newAch')}</span><br>${f.ach.map(a=>esc(tr('a_'+a))).join(' · ')}</p>`:''}
    <div class="btns"><button class="btn pri" id="fAgain" type="button">${isCareer?tr('replayLeague'):tr('startTour')}</button><button class="btn" id="fMenu" type="button">${tr('menu')}</button></div>`;
  if(champ){burst(W/2,200,C.amber,60,400);burst(W/2,200,C.cyan,60,400);SFX.goal();}
  const mode=run.mode,league=run.league;$('fAgain').onclick=()=>{SFX.click();if(mode==='career')startCareer(league);else startTour();};$('fMenu').onclick=()=>{SFX.click();toMenu();};$('fAgain').focus();}
function startQuick(key){run={mode:'quick',res:[]};return startMatch(key);}
function startTour(){run={mode:'tour',res:[]};return startMatch(SPORT_KEYS[0]);}
function startCareer(id){if(ST.leagues[id]==='locked')return null;run={mode:'career',league:id,res:[]};return startMatch(SPORT_KEYS[0]);}
function startDaily(){const d=dailyFor(todayKey());run={mode:'daily',daily:d,res:[]};return startMatch(d.sport);}

function dateParts(){const d=new Date();return{day:d.getDate(),mon:d.toLocaleDateString(LANG==='ro'?'ro-RO':'en-GB',{month:'short'})};}
function renderMenu(){if(!HAS_DOM)return;document.documentElement.lang=LANG;document.body.classList.toggle('contrast',ST.prefs.contrast);document.body.classList.toggle('calm',ST.prefs.motion);
  $('heroTitle').innerHTML=`${tr('heroA')} <em>${tr('heroB')}</em>`;
  document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=tr(el.dataset.i18n);});
  const lb=$('langBtn');lb.textContent=LANG==='ro'?'EN':'RO';lb.lang=LANG==='ro'?'en':'ro';lb.setAttribute('aria-label',LANG==='ro'?'Switch to English':'Schimbă în română');
  $('pauseBtn').setAttribute('aria-label',tr('paused'));$('exitBtn').setAttribute('aria-label',tr('menu'));
  const lv=levelOf(ST.xp),a=xpFor(lv),b=xpFor(lv+1),pct=Math.round((ST.xp-a)/(b-a)*100);
  setTxt('lvlBadge',lv);setTxt('lvlLabel',`${tr('level')} ${lv}`);setTxt('coins',tr('coinsN',ST.coins));setTxt('xpText',tr('xpOf',ST.xp,b));
  const xb=$('xpBar');xb.setAttribute('aria-valuenow',pct);xb.setAttribute('aria-label',`${tr('level')} ${lv}: ${pct}%`);xb.firstElementChild.style.width=pct+'%';
  document.querySelectorAll('#diffSeg button').forEach(x=>{x.textContent=tr(x.dataset.v);x.setAttribute('aria-pressed',String(x.dataset.v===ST.prefs.diff));});
  document.querySelectorAll('#plSeg button').forEach(x=>{x.textContent=tr('pl'+x.dataset.v);x.setAttribute('aria-pressed',String(+x.dataset.v===ST.prefs.players));});
  setTxt('stW',Object.values(ST.stats).reduce((s,x)=>s+x.w,0));setTxt('stT',ST.tours);setTxt('stA',`${ST.ach.length}/${ACHS.length}`);
  const d=dailyFor(todayKey()),dp=dateParts(),done=!!ST.dailyDone[d.key];
  $('dailyDate').innerHTML=`<b>${dp.day}</b>${esc(dp.mon)}`;setTxt('dailySport',`${tr(d.sport)} · ${tr(d.diff)}`);setTxt('dailyCond',tr('cond_'+d.cond.type,d.cond.n));
  const ds=$('dailyStatus');ds.textContent=done?tr('dailyDone'):tr('dailyReward');ds.className=done?'done':'';$('dailyBtn').textContent=done?tr('play'):tr('dailyAccept');
  const cards=$('cards');cards.innerHTML='';
  SPORT_KEYS.forEach((k,i)=>{const s=ST.stats[k]||{w:0,l:0,d:0},el=document.createElement('article');el.className='card';
    el.innerHTML=`<canvas width="480" height="300" aria-hidden="true"></canvas><div class="body"><span class="eyebrow">${tr('event')} ${i+1}</span><h3>${tr(k)}</h3><p>${tr('d_'+k)}</p><div class="new"><span class="sr">${tr('newIn')}: </span>${tr('n_'+k)}</div>
      <div class="foot"><span class="rec" aria-label="${s.w} ${tr('wins')}">${s.w}${tr('wS')} · ${s.l}${tr('lS')} · ${s.d}${tr('dS')}</span><button class="play" type="button" data-k="${k}">${tr('play')}<span class="sr"> ${tr(k)}</span></button></div></div>`;
    cards.appendChild(el);const tc=el.querySelector('canvas').getContext('2d');tc.setTransform(.5,0,0,.5,0,0);const keep=M;M={D:1,A:1,mods:false,len:1,two:false,rival:null};try{new SPORTS[k]().draw(tc);}catch(e){}M=keep;});
  cards.querySelectorAll('.play').forEach(b=>b.onclick=()=>{SFX.click();startQuick(b.dataset.k);});
  $('leagues').innerHTML=LEAGUES.map(L=>{const st=ST.leagues[L.id];return `<article class="league" style="--lc:${L.col}"><h3>${tr('league_'+L.id)}</h3><div class="rival"><span class="mono" aria-hidden="true">${L.rival[0]}</span><p>${tr('rd_'+L.id)}</p></div>
    <span class="pill ${st}">${tr(st)}</span><p>${tr('leagueReward',L.reward,L.xp)}</p><button class="play" type="button" data-l="${L.id}" ${st==='locked'?'disabled':''}>${st==='won'?tr('replayLeague'):tr('playLeague')}<span class="sr"> ${tr('league_'+L.id)}</span></button></article>`;}).join('');
  $('leagues').querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{SFX.click();startCareer(b.dataset.l);});
  $('achList').innerHTML=ACHS.map(a=>`<span class="chip ${ST.ach.includes(a)?'on':''}"><b>${tr('a_'+a)}</b> · ${tr('ad_'+a)}</span>`).join('');
  syncSettings();}
function syncSettings(){const p=ST.prefs;const ol=$('optLen');[...ol.options].forEach(o=>o.textContent=tr('len'+o.value));ol.value=String(p.len);$('optMods').checked=p.mods;$('optReplay').checked=p.replay;$('optSound').checked=p.sound;$('optVol').value=p.vol;$('optContrast').checked=p.contrast;$('optMotion').checked=p.motion;}
function renderStats(){const rows=SPORT_KEYS.map(k=>{const s=ST.stats[k]||{p:0,w:0,l:0,d:0,f:0,a:0,best:0};const wr=s.p?Math.round(s.w/s.p*100):0;return{k,s,wr};});
  const any=rows.some(r=>r.s.p);
  $('statsBody').innerHTML=any?`<div class="scroll"><table class="t"><thead><tr><th scope="col"></th><th class="n" scope="col">${tr('played')}</th><th class="n" scope="col">${tr('wS')}</th><th class="n" scope="col">${tr('lS')}</th><th class="n" scope="col">${tr('dS')}</th><th class="n" scope="col">${tr('scored')}</th><th class="n" scope="col">${tr('conceded')}</th><th class="n" scope="col">${tr('bestStreak')}</th></tr></thead><tbody>
    ${rows.map(r=>`<tr><th scope="row">${tr(r.k)}</th><td class="n">${r.s.p}</td><td class="n">${r.s.w}</td><td class="n">${r.s.l}</td><td class="n">${r.s.d}</td><td class="n">${r.s.f}</td><td class="n">${r.s.a}</td><td class="n">${r.s.best}</td></tr>`).join('')}</tbody></table></div>
    <h3 class="lbl">${tr('winRate')}</h3>${rows.map(r=>`<div class="barrow"><span>${tr(r.k)}</span><div class="bar" role="img" aria-label="${tr(r.k)} ${r.wr}%"><i style="width:${r.wr}%"></i></div><span class="rec">${r.wr}%</span></div>`).join('')}
    <h3 class="lbl">${tr('extras')}</h3><p>${tr('st_swish')}: ${ST.ex.swish} · ${tr('st_spikes')}: ${ST.ex.spike} · ${tr('st_power')}: ${ST.ex.power} · ${tr('st_potted')}: ${ST.ex.potted} · ${tr('goldenGoal')}: ${ST.ex.golden}</p>`:`<p>${tr('noStats')}</p>`;}
function renderShop(){setTxt('shopCoins',tr('coinsN',ST.coins));
  const item=(kind,it)=>{const own=(kind==='skin'?ST.skins:ST.trails).includes(it.id),eq=(kind==='skin'?ST.skin:ST.trail)===it.id;
    const sw=kind==='skin'?(it.id==='prism'?'conic-gradient(#3fd0e0,#a78bfa,#ff7a6b,#f5b041,#a3e635,#3fd0e0)':it.col):it.id==='none'?'transparent':it.id==='comet'?'linear-gradient(90deg,transparent,#3fd0e0)':'radial-gradient(circle,#f5b041 20%,transparent 22%),radial-gradient(circle at 70% 30%,#3fd0e0 15%,transparent 17%)';
    return `<div class="item ${eq?'eq':''}"><span class="sw" style="background:${sw}" aria-hidden="true"></span><b>${tr(kind+'_'+it.id)}</b><button class="btn ${eq?'':'pri'}" type="button" data-kind="${kind}" data-id="${it.id}" ${eq?'disabled':''}>${eq?tr('equipped'):own?tr('equip'):tr('buy',it.price)}</button></div>`;};
  $('shopSkins').innerHTML=SKINS.map(s=>item('skin',s)).join('');$('shopTrails').innerHTML=TRAILS.map(s=>item('trail',s)).join('');
  $('dlgShop').querySelectorAll('[data-kind]').forEach(b=>b.onclick=()=>{const r=buy(b.dataset.kind,b.dataset.id);if(r==='poor')toast(tr('notEnough'));else{SFX.power();if(r==='ok'&&b.textContent.includes('·'))toast(tr('bought'));}renderShop();renderMenu();});}
function renderHelp(){$('helpBody').innerHTML=`<p>${tr('helpIntro')}</p>`+SPORT_KEYS.map(k=>`<h3>${tr(k)}</h3><p>${tr('c_'+k)}</p>`).join('')+`<h3>${tr('pl2')}</h3><p>${tr('c2')}</p><p>${tr('c2turns')}</p>`;}

function boot(){load();cv=$('cv');ctx=cv.getContext('2d');cv.tabIndex=0;
  document.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&!touchSeen){touchSeen=true;if(game&&!M.two){const a=game.sport.acts;$('btnAct').hidden=!a[0];$('btnSpr').hidden=!a[1];}}},true);
  announce=t=>{const l=$('live');l.textContent='';setTimeout(()=>{l.textContent=t;},30);};
  const toL=(e,p)=>{const r=cv.getBoundingClientRect();p.x=(e.clientX-r.left)/r.width*W;p.y=(e.clientY-r.top)/r.height*H;};
  const getP=e=>{const id=e.pointerType==='mouse'?'mouse':e.pointerId;let p=PTRS.get(id);if(!p){p={id,x:W/4,y:H/2,sx:W/4,down:false,justDown:false,justUp:false,tap:false,holdT:0,t0:0,type:e.pointerType||'mouse',inside:false};PTRS.set(id,p);}return p;};
  cv.addEventListener('pointerdown',e=>{ac();const p=getP(e);toL(e,p);p.sx=p.x;p.inside=true;try{cv.setPointerCapture(e.pointerId);}catch(_){}p.down=true;p.justDown=true;p.holdT=0;p.t0=now();
    if(game&&game.replay){game.replay.skip=true;}e.preventDefault();});
  cv.addEventListener('pointermove',e=>{const p=getP(e);toL(e,p);p.inside=true;});
  const up=e=>{const p=PTRS.get(e.pointerType==='mouse'?'mouse':e.pointerId);if(!p||!p.down)return;toL(e,p);p.down=false;p.justUp=true;p.tap=now()-p.t0<220;};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);cv.addEventListener('pointerleave',e=>{const p=PTRS.get('mouse');if(e.pointerType==='mouse'&&p&&!p.down)p.inside=false;});
  cv.addEventListener('contextmenu',e=>e.preventDefault());
  const hold=(el,o)=>{el.addEventListener('pointerdown',e=>{ac();if(o.p!==undefined)o.p=true;o.h=true;e.preventDefault();});['pointerup','pointercancel','pointerleave'].forEach(t=>el.addEventListener(t,()=>{if(o.h&&o.u!==undefined)o.u=true;o.h=false;}));};
  hold($('btnAct'),BTN.act);hold($('btnSpr'),BTN.spr);
  addEventListener('keydown',e=>{if(!game||$('game').hidden)return;if(e.target&&e.target.closest&&e.target.closest('.overlay')){if(e.code==='Escape'&&game.paused)setPause(false);return;}
    if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Enter'].includes(e.code))e.preventDefault();
    if(e.code==='Escape'||e.code==='KeyP'){if(game.replay)game.replay.skip=true;else setPause(!game.paused);return;}
    if(game.replay&&(e.code==='Space'||e.code==='Enter')){game.replay.skip=true;return;}
    if(!e.repeat)pressed.add(e.code);keys.add(e.code);ac();});
  addEventListener('keyup',e=>{if(keys.has(e.code))released.add(e.code);keys.delete(e.code);});
  addEventListener('blur',()=>{keys.clear();BTN.act.h=BTN.spr.h=false;});
  addEventListener('resize',()=>{fit();updateHint();});if(root.ResizeObserver)new ResizeObserver(fit).observe($('stage'));
  $('langBtn').onclick=()=>{LANG=ST.prefs.lang=LANG==='ro'?'en':'ro';save();renderMenu();};
  document.querySelectorAll('#diffSeg button').forEach(b=>b.onclick=()=>{ST.prefs.diff=b.dataset.v;save();SFX.click();renderMenu();});
  document.querySelectorAll('#plSeg button').forEach(b=>b.onclick=()=>{ST.prefs.players=+b.dataset.v;save();SFX.click();renderMenu();});
  $('tourBtn').onclick=()=>{SFX.click();startTour();};$('dailyBtn').onclick=()=>{SFX.click();startDaily();};
  $('pauseBtn').onclick=()=>setPause(!game.paused);$('resBtn').onclick=()=>setPause(false);
  $('rstBtn').onclick=()=>{startMatch(game.sport.key);};$('menuBtn').onclick=toMenu;$('exitBtn').onclick=()=>{if(game&&!game.sport.over&&!game.shown)setPause(true);else toMenu();};
  $('skipReplay').onclick=()=>{if(game&&game.replay)game.replay.skip=true;};
  const open=(btn,dlg,fn)=>$(btn).onclick=()=>{if(fn)fn();$(dlg).showModal();};
  open('statsBtn','dlgStats',renderStats);open('shopBtn','dlgShop',renderShop);open('helpBtn','dlgHelp',renderHelp);open('setBtn','dlgSet',syncSettings);open('backupBtn','dlgBackup',()=>{setTxt('backupStatus','');$('applyBackup').disabled=true;$('backupFile').value='';});
  document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());
  const pref=(id,k,f=v=>v)=>$(id).onchange=e=>{ST.prefs[k]=f(e.target.type==='checkbox'?e.target.checked:e.target.value);save();renderMenu();};
  pref('optLen','len',v=>+v);pref('optMods','mods');pref('optReplay','replay');pref('optSound','sound');pref('optVol','vol',v=>+v);pref('optContrast','contrast');pref('optMotion','motion');
  $('optVol').oninput=e=>{ST.prefs.vol=+e.target.value;if(MASTER)MASTER.gain.value=ST.prefs.vol/100;};
  $('exportBackup').onclick=()=>{const blob=new Blob([exportStore()],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`pentarena-backup-${todayKey()}.json`;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);};
  let pending=null;
  $('backupFile').onchange=async e=>{pending=null;$('applyBackup').disabled=true;const f=e.target.files&&e.target.files[0];if(!f)return;
    try{pending=validateStore(JSON.parse(await f.text()));setTxt('backupStatus',tr('backupOk'));$('applyBackup').disabled=false;}catch(err){setTxt('backupStatus',tr('backupBad',err.message||'JSON'));}};
  $('applyBackup').onclick=()=>{if(!pending)return;ST=pending;pending=null;LANG=ST.prefs.lang;save();renderMenu();setTxt('backupStatus',tr('backupDone'));$('applyBackup').disabled=true;};
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&game&&!game.sport.over)setPause(true);});
  UI.ready=true;renderMenu();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{if(!game)renderMenu();});
  root.requestAnimationFrame(loop);}

/* ================= public API (tests, PWA) ================= */
root.PentArena={VERSION,SPORTS,SPORT_KEYS,LEAGUES,DIFFS,ACHS,SKINS,TRAILS,
  get store(){return ST;},set store(v){ST=v;},get M(){return M;},set M(v){M=v;},get game(){return game;},get run(){return run;},
  keys,pressed,released,PTRS,BTN,endFrameInput,step:dt=>{if(game){step(dt);endFrameInput();}},
  startQuick,startTour,startCareer,startDaily,finishMatch,finishRun,runPoints,matchConfig,outcome,dailyFor,dailyMet,todayKey,levelOf,xpFor,buy,validateStore,exportStore,freshStore,
  setLang:l=>{LANG=l;},busy:()=>!!(game&&!game.shown&&!game.sport.over)};
if(HAS_DOM){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();}
})(typeof window!=='undefined'?window:globalThis);
