// Grădina Curioasă — Atelierul de muzică: xilofon/pian/flaut, cântece, repetă melodia, sus sau jos, ritmuri.
// Toate sunetele sunt sintetizate cu Web Audio: fără fișiere audio, fără înregistrări, fără server.
(()=>{
const T={
ro:{title:'Atelierul de muzică',intro:'Cântă la xilofon, învață cântece, repetă melodii și fă ritmuri. Sunetele sunt create chiar de browser.',play:'Xilofon',songs:'Cântece',echo:'Repetă melodia',ear:'Sus sau jos?',beats:'Ritmuri',listen:'🔊 Ascultă',instrument:'Instrument',xylo:'Xilofon',piano:'Pian',flute:'Flaut',note:'Nota {n}',
playHelp:'Atinge barele colorate sau apasă tastele 1–8. Barele scurte sună mai sus, cele lungi mai jos.',replay:'🔁 Ascultă ce ai cântat',nothing:'Cântă câteva note mai întâi.',nice:'Ce melodie frumoasă! 🎶',
songHelp:'Alege un cântec. Ascultă-l, apoi cântă-l tu: atinge bara care strălucește.',listenSong:'▶ Ascultă cântecul',playSong:'🎵 Cântă tu',stop:'■ Stop',progress:'Nota {i} din {n}',songDone:'Bravo! Ai cântat „{s}” până la capăt! 🎶',tryNote:'Aproape! Caută bara care strălucește.',learned:'învățat',
echoHelp:'Ascultă melodia lui Bia, apoi repet-o atingând aceleași bare. La fiecare reușită, melodia crește cu o notă.',echoStart:'▶ Începe',echoListen:'Ascultă… 👂',echoYour:'Rândul tău! Nota {i} din {n}.',echoGood:'Corect! Acum melodia are {n} note.',echoMiss:'Aproape! Mai ascultă o dată.',echoBest:'Cea mai lungă melodie: {n} note',echoReplay:'🔁 Ascultă din nou',
earHelp:'Ascultă două sunete. Al doilea e mai sus sau mai jos decât primul?',earHelpSame:'Ascultă două sunete. Al doilea e mai sus, mai jos sau la fel?',play2:'▶ Ascultă sunetele',higher:'⬆️ Mai sus 🐦',lower:'⬇️ Mai jos 🐻',same:'↔️ La fel',earGood:'Da! Ai ureche bună. 👂',earMiss:'Ascultă din nou: primul sunet, apoi al doilea.',earScore:'Răspunsuri corecte: {n}',first:'Primul',second:'Al doilea',
beatsHelp:'Atinge pătrățelele ca să faci un ritm, apoi apasă Pornește. Ritmul se repetă până îl oprești.',startLoop:'▶ Pornește',stopLoop:'■ Oprește',tempo:'Viteză',slow:'🐢 Rar',normal:'🚶 Normal',fast:'🐇 Repede',kick:'Toba mare',snare:'Toba mică',hat:'Cinel',clap:'Palme',step:'{r}, pasul {n}',on:'pornit',off:'oprit',clearBeat:'🧹 Șterge',preset:'✨ Exemplu',beatDone:'Ce ritm grozav! 🥁',noAudio:'Browserul nu poate reda sunete aici.',
names:['do','re','mi','fa','sol','la','si','do'],
s_hot:'Chifle calde',s_mary:'Mielușelul Mariei',s_twinkle:'Sclipește, steluță',s_ode:'Oda bucuriei',s_jingle:'Clopoței, clopoței'},
en:{title:'Music studio',intro:'Play the xylophone, learn songs, repeat melodies and make rhythms. The browser creates every sound.',play:'Xylophone',songs:'Songs',echo:'Repeat the tune',ear:'High or low?',beats:'Rhythms',listen:'🔊 Listen',instrument:'Instrument',xylo:'Xylophone',piano:'Piano',flute:'Flute',note:'Note {n}',
playHelp:'Tap the coloured bars or press keys 1–8. Short bars sound higher, long bars lower.',replay:'🔁 Hear what you played',nothing:'Play a few notes first.',nice:'What a lovely tune! 🎶',
songHelp:'Pick a song. Listen to it, then play it yourself: tap the bar that glows.',listenSong:'▶ Listen to the song',playSong:'🎵 Your turn',stop:'■ Stop',progress:'Note {i} of {n}',songDone:'Well done! You played “{s}” all the way through! 🎶',tryNote:'Nearly! Look for the glowing bar.',learned:'learned',
echoHelp:'Listen to Bia’s tune, then repeat it by tapping the same bars. Each time you get it right, the tune grows by one note.',echoStart:'▶ Start',echoListen:'Listen… 👂',echoYour:'Your turn! Note {i} of {n}.',echoGood:'Correct! Now the tune has {n} notes.',echoMiss:'Nearly! Listen once more.',echoBest:'Longest tune: {n} notes',echoReplay:'🔁 Listen again',
earHelp:'Listen to two sounds. Is the second one higher or lower than the first?',earHelpSame:'Listen to two sounds. Is the second higher, lower or the same?',play2:'▶ Listen to the sounds',higher:'⬆️ Higher 🐦',lower:'⬇️ Lower 🐻',same:'↔️ The same',earGood:'Yes! You have a good ear. 👂',earMiss:'Listen again: the first sound, then the second.',earScore:'Correct answers: {n}',first:'First',second:'Second',
beatsHelp:'Tap the squares to make a rhythm, then press Start. It repeats until you stop it.',startLoop:'▶ Start',stopLoop:'■ Stop',tempo:'Speed',slow:'🐢 Slow',normal:'🚶 Normal',fast:'🐇 Fast',kick:'Big drum',snare:'Small drum',hat:'Cymbal',clap:'Claps',step:'{r}, step {n}',on:'on',off:'off',clearBeat:'🧹 Clear',preset:'✨ Example',beatDone:'What a great rhythm! 🥁',noAudio:'This browser cannot play sounds here.',
names:['C','D','E','F','G','A','B','C'],
s_hot:'Hot Cross Buns',s_mary:'Mary Had a Little Lamb',s_twinkle:'Twinkle, Twinkle, Little Star',s_ode:'Ode to Joy',s_jingle:'Jingle Bells'},
hu:{title:'Zeneműhely',intro:'Játssz xilofonon, tanulj dalokat, ismételj dallamokat és készíts ritmusokat. Minden hangot a böngésző hoz létre.',play:'Xilofon',songs:'Dalok',echo:'Ismételd a dallamot',ear:'Magas vagy mély?',beats:'Ritmusok',listen:'🔊 Meghallgatom',instrument:'Hangszer',xylo:'Xilofon',piano:'Zongora',flute:'Furulya',note:'{n} hang',
playHelp:'Érintsd meg a színes lapokat, vagy nyomd meg az 1–8 billentyűket. A rövid lapok magasabban, a hosszúak mélyebben szólnak.',replay:'🔁 Meghallgatom, amit játszottam',nothing:'Előbb játssz néhány hangot.',nice:'Milyen szép dallam! 🎶',
songHelp:'Válassz egy dalt. Hallgasd meg, aztán játszd el te: érintsd meg a világító lapot.',listenSong:'▶ Meghallgatom a dalt',playSong:'🎵 Most te',stop:'■ Állj',progress:'{i}. hang / {n}',songDone:'Ügyes! Végigjátszottad: „{s}”! 🎶',tryNote:'Majdnem! Keresd a világító lapot.',learned:'megtanulva',
echoHelp:'Hallgasd meg Bia dallamát, aztán ismételd meg ugyanazokkal a lapokkal. Minden sikernél eggyel hosszabb lesz a dallam.',echoStart:'▶ Kezdés',echoListen:'Figyelj… 👂',echoYour:'Te jössz! {i}. hang / {n}.',echoGood:'Helyes! A dallam most {n} hangból áll.',echoMiss:'Majdnem! Hallgasd meg még egyszer.',echoBest:'A leghosszabb dallam: {n} hang',echoReplay:'🔁 Újra meghallgatom',
earHelp:'Hallgass meg két hangot. A második magasabb vagy mélyebb, mint az első?',earHelpSame:'Hallgass meg két hangot. A második magasabb, mélyebb vagy ugyanolyan?',play2:'▶ Meghallgatom',higher:'⬆️ Magasabb 🐦',lower:'⬇️ Mélyebb 🐻',same:'↔️ Ugyanolyan',earGood:'Igen! Jó füled van. 👂',earMiss:'Hallgasd meg újra: az első, aztán a második hangot.',earScore:'Helyes válaszok: {n}',first:'Első',second:'Második',
beatsHelp:'Érintsd meg a négyzeteket, hogy ritmust készíts, aztán nyomd meg az Indítást. Addig ismétlődik, amíg meg nem állítod.',startLoop:'▶ Indítás',stopLoop:'■ Állj',tempo:'Tempó',slow:'🐢 Lassú',normal:'🚶 Közepes',fast:'🐇 Gyors',kick:'Nagydob',snare:'Kisdob',hat:'Cintányér',clap:'Taps',step:'{r}, {n}. lépés',on:'be',off:'ki',clearBeat:'🧹 Törlés',preset:'✨ Példa',beatDone:'Micsoda ritmus! 🥁',noAudio:'Ez a böngésző itt nem tud hangot lejátszani.',
names:['dó','ré','mi','fá','szó','lá','ti','dó'],
s_hot:'Forró zsemle (angol dal)',s_mary:'Marynek volt egy báránykája',s_twinkle:'Ragyogj, kis csillag',s_ode:'Örömóda',s_jingle:'Csengőszó'},
uk:{title:'Музична майстерня',intro:'Грай на ксилофоні, вивчай пісні, повторюй мелодії та створюй ритми. Усі звуки створює сам браузер.',play:'Ксилофон',songs:'Пісні',echo:'Повтори мелодію',ear:'Вище чи нижче?',beats:'Ритми',listen:'🔊 Послухати',instrument:'Інструмент',xylo:'Ксилофон',piano:'Піаніно',flute:'Флейта',note:'Нота {n}',
playHelp:'Торкайся кольорових пластинок або натискай клавіші 1–8. Короткі пластинки звучать вище, довгі — нижче.',replay:'🔁 Послухати, що я зіграв(-ла)',nothing:'Спершу зіграй кілька нот.',nice:'Яка гарна мелодія! 🎶',
songHelp:'Обери пісню. Послухай її, а потім зіграй сам(-а): торкайся пластинки, що світиться.',listenSong:'▶ Послухати пісню',playSong:'🎵 Тепер ти',stop:'■ Стоп',progress:'Нота {i} з {n}',songDone:'Молодець! Ти зіграв(-ла) «{s}» до кінця! 🎶',tryNote:'Майже! Шукай пластинку, що світиться.',learned:'вивчено',
echoHelp:'Послухай мелодію Бії, а потім повтори її, торкаючись тих самих пластинок. Щоразу мелодія стає на одну ноту довшою.',echoStart:'▶ Почати',echoListen:'Слухай… 👂',echoYour:'Твоя черга! Нота {i} з {n}.',echoGood:'Правильно! Тепер у мелодії {n} нот.',echoMiss:'Майже! Послухай ще раз.',echoBest:'Найдовша мелодія: {n} нот',echoReplay:'🔁 Послухати ще раз',
earHelp:'Послухай два звуки. Другий вищий чи нижчий за перший?',earHelpSame:'Послухай два звуки. Другий вищий, нижчий чи такий самий?',play2:'▶ Послухати звуки',higher:'⬆️ Вище 🐦',lower:'⬇️ Нижче 🐻',same:'↔️ Однаково',earGood:'Так! У тебе гарний слух. 👂',earMiss:'Послухай ще раз: перший звук, потім другий.',earScore:'Правильних відповідей: {n}',first:'Перший',second:'Другий',
beatsHelp:'Торкайся квадратиків, щоб створити ритм, а потім натисни «Почати». Ритм повторюватиметься, доки ти його не зупиниш.',startLoop:'▶ Почати',stopLoop:'■ Зупинити',tempo:'Швидкість',slow:'🐢 Повільно',normal:'🚶 Звичайно',fast:'🐇 Швидко',kick:'Великий барабан',snare:'Малий барабан',hat:'Тарілка',clap:'Оплески',step:'{r}, крок {n}',on:'увімкнено',off:'вимкнено',clearBeat:'🧹 Очистити',preset:'✨ Приклад',beatDone:'Чудовий ритм! 🥁',noAudio:'Цей браузер не може тут відтворювати звуки.',
names:['до','ре','мі','фа','соль','ля','сі','до'],
s_hot:'Гарячі булочки (англ. пісенька)',s_mary:'У Мері є ягнятко',s_twinkle:'Зірочка',s_ode:'Ода до радості',s_jingle:'Дзвіночки'}};
const tx=(k,v={})=>String(T[lang]?.[k]??T.en[k]??k).replace(/\{(\w+)\}/g,(_,x)=>v[x]??'');
const noteName=i=>(T[lang]?.names||T.en.names)[i]+(i===7?'′':'');
const E=(tag,text='',cls='')=>{const e=document.createElement(tag);e.textContent=text;if(cls)e.className=cls;return e},B=(text,fn,cls)=>{const b=E('button',text,cls);b.type='button';b.onclick=fn;return b};
const uid=()=>localStorage.getItem('garden_active')||'default',key=()=>`garden_music_${uid()}`,read=()=>{try{return JSON.parse(localStorage.getItem(key()))||{}}catch{return {}}},save=d=>{try{localStorage.setItem(key(),JSON.stringify(d))}catch{}};
const age=()=>ageOf(profile.dob),rand=n=>Math.floor(Math.random()*n),fast=()=>!!window.gardenMusicFast;
const NOTES=[261.63,293.66,329.63,349.23,392,440,493.88,523.25],BAR=['#ff6b6b','#ffa94d','#ffd43b','#69db7c','#38d9a9','#4dabf7','#9775fa','#f783ac'];
const midi=m=>440*2**((m-69)/12);
// Cântece din domeniul public, doar melodia: [indexul notei 0–7 (do–do′), durata în timpi]
const SONGS={
hot:[[2,1],[1,1],[0,2],[2,1],[1,1],[0,2],[0,.5],[0,.5],[0,.5],[0,.5],[1,.5],[1,.5],[1,.5],[1,.5],[2,1],[1,1],[0,2]],
mary:[[2,1],[1,1],[0,1],[1,1],[2,1],[2,1],[2,2],[1,1],[1,1],[1,2],[2,1],[4,1],[4,2],[2,1],[1,1],[0,1],[1,1],[2,1],[2,1],[2,1],[2,1],[1,1],[1,1],[2,1],[1,1],[0,4]],
twinkle:[[0,1],[0,1],[4,1],[4,1],[5,1],[5,1],[4,2],[3,1],[3,1],[2,1],[2,1],[1,1],[1,1],[0,2],[4,1],[4,1],[3,1],[3,1],[2,1],[2,1],[1,2],[4,1],[4,1],[3,1],[3,1],[2,1],[2,1],[1,2],[0,1],[0,1],[4,1],[4,1],[5,1],[5,1],[4,2],[3,1],[3,1],[2,1],[2,1],[1,1],[1,1],[0,2]],
ode:[[2,1],[2,1],[3,1],[4,1],[4,1],[3,1],[2,1],[1,1],[0,1],[0,1],[1,1],[2,1],[2,1.5],[1,.5],[1,2],[2,1],[2,1],[3,1],[4,1],[4,1],[3,1],[2,1],[1,1],[0,1],[0,1],[1,1],[2,1],[1,1.5],[0,.5],[0,2]],
jingle:[[2,1],[2,1],[2,2],[2,1],[2,1],[2,2],[2,1],[4,1],[0,1.5],[1,.5],[2,4],[3,1],[3,1],[3,1.5],[3,.5],[3,1],[2,1],[2,1],[2,.5],[2,.5],[2,1],[1,1],[1,1],[2,1],[1,2],[4,2]]};
const SONG_ICON={hot:'🥯',mary:'🐑',twinkle:'⭐',ode:'🎻',jingle:'🔔'};

// ——— Motorul audio
let ac=null,master=null,noiseBuf=null;
function ctx(){try{if(!ac){const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;ac=new A();master=ac.createGain();master.connect(ac.destination)}master.gain.value=document.body.classList.contains('quiet')?.35:.6;if(ac.state==='suspended')ac.resume();return ac}catch{return null}}
let instrument='xylo';
function tone(f,when=0,dur=.45,inst=instrument){const a=ctx();if(!a)return;const t=a.currentTime+when+.01,g=a.createGain();g.connect(master);const osc=(type,freq,gain)=>{const o=a.createOscillator(),og=a.createGain();o.type=type;o.frequency.value=freq;og.gain.value=gain;o.connect(og).connect(g);return o};let os,end;
if(inst==='flute'){end=t+dur+.18;const o=osc('sine',f,1),lfo=a.createOscillator(),lg=a.createGain();lfo.frequency.value=5;lg.gain.value=f*.006;lfo.connect(lg).connect(o.frequency);os=[o,lfo,osc('sine',f*2,.08)];g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.32,t+.07);g.gain.setValueAtTime(.32,t+dur);g.gain.linearRampToValueAtTime(0,end)}
else if(inst==='piano'){end=t+dur+.9;os=[osc('triangle',f,.9),osc('sine',f*2,.18),osc('sine',f*3,.06)];g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.42,t+.012);g.gain.exponentialRampToValueAtTime(.12,t+.25);g.gain.exponentialRampToValueAtTime(.001,end)}
else{end=t+1.1;os=[osc('sine',f,1),osc('sine',f*3.93,.25),osc('sine',f*9.2,.05)];g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.5,t+.005);g.gain.exponentialRampToValueAtTime(.001,end)}
os.forEach(o=>{o.start(t);o.stop(end+.05)});setTimeout(()=>{try{g.disconnect()}catch{}},(end-a.currentTime+.3)*1000)}
function noise(a){if(!noiseBuf){noiseBuf=a.createBuffer(1,a.sampleRate*.5,a.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}return noiseBuf}
function drum(kind,when=0){const a=ctx();if(!a)return;const t=a.currentTime+when+.01;
if(kind==='kick'){const o=a.createOscillator(),g=a.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(45,t+.25);g.gain.setValueAtTime(.9,t);g.gain.exponentialRampToValueAtTime(.001,t+.3);o.connect(g).connect(master);o.start(t);o.stop(t+.32);return}
const src=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();src.buffer=noise(a);
if(kind==='snare'){f.type='bandpass';f.frequency.value=1800;g.gain.setValueAtTime(.5,t);g.gain.exponentialRampToValueAtTime(.001,t+.18);const o=a.createOscillator(),og=a.createGain();o.type='triangle';o.frequency.value=185;og.gain.setValueAtTime(.35,t);og.gain.exponentialRampToValueAtTime(.001,t+.1);o.connect(og).connect(master);o.start(t);o.stop(t+.12)}
else if(kind==='hat'){f.type='highpass';f.frequency.value=7000;g.gain.setValueAtTime(.28,t);g.gain.exponentialRampToValueAtTime(.001,t+.06)}
else{f.type='bandpass';f.frequency.value=1200;f.Q.value=.8;g.gain.setValueAtTime(0,t);[0,.013,.026].forEach(d=>{g.gain.setValueAtTime(.6,t+d);g.gain.exponentialRampToValueAtTime(.06,t+d+.011)});g.gain.exponentialRampToValueAtTime(.001,t+.22)}
src.connect(f).connect(g).connect(master);src.start(t);src.stop(t+.3)}

// ——— Ecranul
const section=E('section','','card studio music');section.id='music';section.dataset.view='music';$('app').insertBefore(section,$('birthday'));
let mode=null,stage,status,token=0,timers=[],loop=null,onStop=null;
const say=(msg,good=true)=>{status.textContent=msg;status.classList.toggle('bad',!good)};
function stopAll(){timers.forEach(clearTimeout);timers=[];if(loop){clearInterval(loop);loop=null}section.querySelectorAll('.lit,.now').forEach(x=>x.classList.remove('lit','now'));onStop?.()}
const later=(fn,ms)=>{const my=token;timers.push(setTimeout(()=>{if(my===token)fn()},fast()?Math.min(ms,40):ms))};
const listen=text=>B(tx('listen'),()=>gardenSpeak(text,true),'speak-btn');
const help=text=>{stage.append(E('p',text,'studio-help'));if(age()<=6)stage.append(listen(text))};
function instruments(){const row=E('div','','draw-tools');row.setAttribute('role','group');row.setAttribute('aria-label',tx('instrument'));[['xylo','🎼'],['piano','🎹'],['flute','🪈']].forEach(([k,i])=>{const b=B(`${i} ${tx(k)}`,()=>{instrument=k;row.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x.dataset.k===k));tone(NOTES[4],0,.35)});b.dataset.k=k;b.setAttribute('aria-pressed',instrument===k);row.append(b)});return row}
// Xilofonul: câte o bară pe notă; barele scurte sunt notele înalte.
function xylo(idx,onTap){const box=E('div','','xylo');box.style.setProperty('--n',idx.length);const light=(n,ms=260)=>{const b=box.querySelector(`.bar[data-note="${n}"]`);if(!b)return;b.classList.add('lit');setTimeout(()=>b.classList.remove('lit'),fast()?30:ms)};
idx.forEach(n=>{const b=B('',()=>{tone(NOTES[n]);light(n);onTap?.(n,b)},'bar');b.dataset.note=n;b.style.setProperty('--c',BAR[n]);b.style.setProperty('--i',n);b.append(E('span',noteName(n)));b.setAttribute('aria-label',tx('note',{n:noteName(n)}));box.append(b)});return {box,light}}

function play(){help(tx('playHelp'));stage.append(instruments());let rec=[],lastT=0,praised=false;const x=xylo([0,1,2,3,4,5,6,7],n=>{const now=performance.now();rec.push([n,rec.length?Math.min(1200,Math.max(140,now-lastT)):0]);lastT=now;if(rec.length>24)rec.shift();if(rec.length>=8&&!praised){praised=true;gardenCelebrate('music-play');say(tx('nice'))}});stage.append(x.box);
const row=E('div','','draw-tools');row.append(B(tx('replay'),()=>{if(!rec.length){say(tx('nothing'),false);return}stopAll();let at=0;rec.forEach(([n,d],i)=>{at+=i?d:0;later(()=>{tone(NOTES[n]);x.light(n)},at)})}));stage.append(row)}

let songId=null;
function songs(){const ids=Object.keys(SONGS),learned=read().songs||{};if(!songId)songId=age()<=5?'hot':age()<=8?'mary':'ode';help(tx('songHelp'));
const pick=E('div','','learning-tabs page-picker');ids.forEach(id=>{const b=B(`${SONG_ICON[id]} ${tx('s_'+id)}${learned[id]?' ✓':''}`,()=>{stopAll();songId=id;render()});b.setAttribute('aria-pressed',id===songId);if(learned[id])b.setAttribute('aria-description',tx('learned'));pick.append(b)});stage.append(pick,instruments());
const song=SONGS[songId];let idx=0,along=false;const prog=E('p','','versus-pairs');const x=xylo([0,1,2,3,4,5,6,7],n=>{if(!along)return;if(n===song[idx][0]){idx++;mark();if(idx===song.length){along=false;mark();const d=read();d.songs={...(d.songs||{}),[songId]:true};save(d);gardenCelebrate('music-song');say(tx('songDone',{s:tx('s_'+songId)}))}}else say(tx('tryNote'),false)});
const mark=()=>{x.box.querySelectorAll('.bar').forEach(b=>b.classList.toggle('next',along&&+b.dataset.note===song[idx]?.[0]));prog.textContent=along&&idx<song.length?tx('progress',{i:idx+1,n:song.length}):'';stage.dataset.next=along?(song[idx]?.[0]??''):''};
const beat=age()<=5?560:480;const listenBtn=B(tx('listenSong'),()=>{stopAll();along=false;mark();let at=0;song.forEach(([n,d])=>{later(()=>{tone(NOTES[n],0,d*beat/1000*.9);x.light(n,d*beat*.8)},at);at+=d*beat})}),alongBtn=B(tx('playSong'),()=>{stopAll();idx=0;along=true;status.textContent='';mark()},'primary'),stopBtn=B(tx('stop'),()=>{stopAll();along=false;mark()});
const row=E('div','','draw-tools');row.append(listenBtn,alongBtn,stopBtn);stage.append(row,prog,x.box);mark()}

function echo(){const a=age(),pool=a<=5?[0,2,4,7]:a<=8?[0,1,2,4,5]:[0,1,2,3,4,5,6,7],startLen=a<=5?2:a<=8?3:4,speed=a<=5?650:a<=8?560:460;let seq=[],pos=0,phase='idle';
help(tx('echoHelp'));const best=E('p',tx('echoBest',{n:read().echo||0}),'versus-pairs');
const x=xylo(pool,n=>{if(phase!=='input')return;if(n===seq[pos]){pos++;if(pos<seq.length){say(tx('echoYour',{i:pos+1,n:seq.length}));return}phase='idle';const d=read();if(seq.length>(d.echo||0)){d.echo=seq.length;save(d);best.textContent=tx('echoBest',{n:seq.length})}gardenCelebrate('music-echo');seq.push(pool[rand(pool.length)]);say(tx('echoGood',{n:seq.length}));later(playSeq,1300)}else{phase='idle';gardenMiss('music-echo');say(tx('echoMiss'),false);later(playSeq,1100)}});
function playSeq(){phase='listen';pos=0;stage.dataset.seq=seq.join(',');x.box.classList.add('listening');say(tx('echoListen'));seq.forEach((n,i)=>later(()=>{tone(NOTES[n],0,.4);x.light(n,speed*.7)},300+i*speed));later(()=>{phase='input';x.box.classList.remove('listening');say(tx('echoYour',{i:1,n:seq.length}))},300+seq.length*speed)}
const row=E('div','','draw-tools');row.append(B(tx('echoStart'),()=>{stopAll();seq=Array.from({length:startLen},()=>pool[rand(pool.length)]);playSeq()},'primary echo-start'),B(tx('echoReplay'),()=>{if(!seq.length)return;stopAll();playSeq()}));stage.append(row,best,x.box)}

function ear(){const a=age(),minD=a<=5?7:a<=8?3:1,maxD=a<=5?12:a<=8?7:5,withSame=a>=9;let pair=null,locked=false;const d0=read();let score=d0.ear||0;
help(withSame?tx('earHelpSame'):tx('earHelp'));const dots=E('div','','ear-dots');dots.setAttribute('aria-hidden','true');const s1=E('span',tx('first')),s2=E('span',tx('second'));dots.append(s1,s2);const sc=E('p',tx('earScore',{n:score}),'versus-pairs');
const fresh=()=>{const m1=55+rand(16),dir=Math.random()<.5?1:-1;let dd=minD+rand(maxD-minD+1);if(withSame&&Math.random()<.2)dd=0;pair=[m1,m1+dir*dd];stage.dataset.answer=dd===0?'same':dir>0?'higher':'lower'};
const hear=()=>{stopAll();locked=true;tone(midi(pair[0]),0,.55,'piano');s1.classList.add('lit');later(()=>s1.classList.remove('lit'),600);later(()=>{tone(midi(pair[1]),0,.55,'piano');s2.classList.add('lit')},800);later(()=>{s2.classList.remove('lit');locked=false},1400)};
const answer=k=>{if(!pair)return;if(k===stage.dataset.answer){score++;const d=read();d.ear=score;save(d);sc.textContent=tx('earScore',{n:score});gardenCelebrate('music-ear');say(tx('earGood'));fresh();later(hear,1000)}else{gardenMiss('music-ear');say(tx('earMiss'),false);later(hear,700)}};
const row=E('div','','ear-answers');row.append(B(tx('higher'),()=>answer('higher'),'ear-btn'),B(tx('lower'),()=>answer('lower'),'ear-btn'));if(withSame)row.append(B(tx('same'),()=>answer('same'),'ear-btn'));
fresh();stage.append(B(tx('play2'),hear,'primary ear-play'),dots,row,sc)}

const ROWS=[['kick','#ff6b6b'],['snare','#4dabf7'],['hat','#ffd43b'],['clap','#9775fa']];let pattern=ROWS.map(()=>Array(8).fill(false)),bpm=100;
function beats(){help(tx('beatsHelp'));let step=0,praised=false;const grid=E('div','','beat-grid');grid.append(E('span'));for(let s=0;s<8;s++)grid.append(E('span',String(s+1),'beat-num'));
const cells=ROWS.map(([k,c],r)=>{grid.append(E('span',tx(k),'row-label'));return pattern[r].map((on,s)=>{const b=B('',()=>{pattern[r][s]=!pattern[r][s];paint();if(pattern[r][s])drum(k)},'beat-cell');b.style.setProperty('--c',c);if(s===4)b.classList.add('half');grid.append(b);return b})});
const paint=()=>cells.forEach((row,r)=>row.forEach((b,s)=>{b.setAttribute('aria-pressed',pattern[r][s]);b.setAttribute('aria-label',`${tx('step',{r:tx(ROWS[r][0]),n:s+1})}`)}));
const go=B('',()=>{if(loop){stopAll();return}const active=pattern.flat().filter(Boolean).length;start();if(active>=4&&!praised){praised=true;gardenCelebrate('music-beats');say(tx('beatDone'))}},'primary beat-go');
const setGo=()=>{go.textContent=loop?tx('stopLoop'):tx('startLoop')};onStop=setGo;
function start(){if(loop)clearInterval(loop);step=0;const tick=()=>{cells.forEach(row=>row.forEach((b,s)=>b.classList.toggle('now',s===step)));pattern.forEach((row,r)=>{if(row[step])drum(ROWS[r][0])});step=(step+1)%8};tick();loop=setInterval(tick,60000/bpm/2);setGo()}
const tempo=E('div','','draw-tools');tempo.setAttribute('role','group');tempo.setAttribute('aria-label',tx('tempo'));[['slow',80],['normal',100],['fast',132]].forEach(([k,v])=>{const b=B(tx(k),()=>{bpm=v;tempo.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',+x.dataset.v===bpm));if(loop)start()});b.dataset.v=v;b.setAttribute('aria-pressed',bpm===v);tempo.append(b)});
const row=E('div','','draw-tools');row.append(go,B(tx('preset'),()=>{pattern=[[1,0,0,0,1,0,0,0],[0,0,1,0,0,0,1,0],[1,1,1,1,1,1,1,1],[0,0,0,0,0,0,0,1]].map(r=>r.map(Boolean));paint()}),B(tx('clearBeat'),()=>{pattern=ROWS.map(()=>Array(8).fill(false));paint()}));
stage.append(row,tempo,grid);paint();setGo()}

function render(){if(!profile||$('app').hidden)return;token++;stopAll();onStop=null;section.replaceChildren();const back=E('div','','draw-tools');back.append(B(['← Toate atelierele','← All workshops','← Összes műhely','← Усі майстерні'][Math.max(0,['ro','en','hu','uk'].indexOf(lang))],()=>gardenGo('studio'),'studio-back'));section.append(back);const head=E('div','','versus-head');head.append(gardenArt('music',72),E('div'));head.lastChild.append(E('h2',tx('title')),E('p',tx('intro')));section.append(head);
if(!['play','songs','echo','ear','beats'].includes(mode))mode=age()<=5?'play':'songs';
const tabs=E('div','','learning-tabs');[['play','🎹'],['songs','🎵'],['echo','🔁'],['ear','👂'],['beats','🥁']].forEach(([k,i])=>{const b=B(`${i} ${tx(k)}`,()=>{mode=k;render()});b.setAttribute('aria-pressed',mode===k);tabs.append(b)});section.append(tabs);
stage=E('div','','learning-stage studio-stage');status=E('div','','learning-feedback');status.setAttribute('role','status');status.setAttribute('aria-live','polite');section.append(stage,status);
if(!(window.AudioContext||window.webkitAudioContext))stage.append(E('p',tx('noAudio'),'warn'));try{localStorage.setItem(`garden_last_${uid()}`,JSON.stringify({view:'music',mode}))}catch{}({play,songs,echo,ear,beats})[mode]()}
// Oprește sunetele când copilul pleacă de pe ecran.
new MutationObserver(()=>{if($('app').dataset.view!=='music'){token++;stopAll()}}).observe($('app'),{attributes:true,attributeFilter:['data-view']});
const KEYS='12345678',KEYS2='asdfghjk';
document.addEventListener('keydown',e=>{if($('app').dataset.view!=='music'||e.ctrlKey||e.metaKey||e.altKey||e.target.closest?.('input,textarea,select'))return;let i=KEYS.indexOf(e.key);if(i<0)i=KEYS2.indexOf((e.key||'').toLowerCase());if(i<0)return;const b=section.querySelector(`.bar[data-note="${i}"]`);if(b){e.preventDefault();b.click()}});
document.addEventListener('garden:open',e=>{const {view,mode:m}=e.detail||{};if(view!=='music')return;mode=m;render()});
gardenOn(r=>{if(r==='start'||r==='switch'){mode=null;songId=null}render()});if(profile)render();
})();
