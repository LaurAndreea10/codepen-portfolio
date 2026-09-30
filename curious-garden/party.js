// Grădina Curioasă — Petrecerea de ziua copilului: lângă tortul existent apar Baloanele de umflat și Camera de petrecere.
// Se deschid automat în fereastra zilei de naștere (cu 2 zile înainte, 3 zile după); în rest se pot doar previzualiza de un adult.
(()=>{
const LANGS=['ro','en','hu','uk'],L=a=>a[Math.max(0,LANGS.indexOf(lang))]??a[1],fmt=(s,v={})=>String(s).replace(/\{(\w+)\}/g,(_,x)=>v[x]??'');
const P={
cake:['🎂 Tortul','🎂 The cake','🎂 A torta','🎂 Торт'],balloons:['🎈 Baloane','🎈 Balloons','🎈 Lufik','🎈 Кульки'],room:['🏠 Camera de petrecere','🏠 Party room','🏠 Buliszoba','🏠 Святкова кімната'],tabs:['Activitățile petrecerii','Party activities','Buli-feladatok','Святкові заняття'],
hello:['🎉 La mulți ani{name}! Azi e petrecerea ta: decorează tortul, umflă baloane și pregătește camera.','🎉 Happy birthday{name}! It’s your party: decorate the cake, blow up balloons and get the room ready.','🎉 Boldog születésnapot{name}! Itt a bulid: díszítsd a tortát, fújj lufikat, és rendezd be a szobát.','🎉 З днем народження{name}! Це твоє свято: прикрась торт, надуй кульки й підготуй кімнату.'],
homeBtn:['🎈 Intră la petrecere','🎈 Go to the party','🎈 Irány a buli','🎈 До свята'],
locked:['🔒 Baloanele și camera de petrecere se deschid de ziua ta, cu 2 zile înainte: {when}.','🔒 Balloons and the party room open for your birthday, 2 days early: {when}.','🔒 A lufik és a buliszoba a születésnapodra nyílnak meg, 2 nappal előtte: {when}.','🔒 Кульки й святкова кімната відкриються до твого дня народження, за 2 дні: {when}.'],
inDays:['peste {n} zile','in {n} days','{n} nap múlva','через {n} дн.'],preview:['👀 Previzualizează (pentru adulți)','👀 Preview (for adults)','👀 Előnézet (felnőtteknek)','👀 Попередній перегляд (для дорослих)'],previewOn:['Previzualizare: așa va arăta petrecerea.','Preview: this is how the party will look.','Előnézet: így fog kinézni a buli.','Попередній перегляд: так виглядатиме свято.'],
listen:['🔊 Ascultă','🔊 Listen','🔊 Meghallgatom','🔊 Послухати'],
bYoung:['Alege o culoare și apasă pompa până balonul e mare. Apoi leagă-l! Umflă {n} baloane.','Pick a colour and press the pump until the balloon is big. Then tie it! Blow up {n} balloons.','Válassz színt, és nyomd a pumpát, amíg nagy nem lesz a lufi. Aztán kösd meg! Fújj fel {n} lufit.','Обери колір і натискай насос, доки кулька не стане великою. Потім зав’яжи її! Надуй {n} кульки.'],
bMid:['Comanda pentru petrecere: {list}. Nu umfla prea tare, că se sparge!','Party order: {list}. Don’t overdo it or it will pop!','Buli-rendelés: {list}. Ne fújd túl, mert kipukkad!','Замовлення для свята: {list}. Не перестарайся, бо лусне!'],
bOld:['Fiecare apăsare bagă {step} ml de aer. Un balon e perfect la exact {ml} ml. Câte apăsări îți trebuie? Umflă {n} baloane perfecte.','Each press adds {step} ml of air. A balloon is perfect at exactly {ml} ml. How many presses do you need? Blow up {n} perfect balloons.','Minden nyomás {step} ml levegőt fúj bele. A lufi pontosan {ml} ml-nél tökéletes. Hány nyomás kell? Fújj {n} tökéletes lufit.','Кожне натискання додає {step} мл повітря. Кулька ідеальна рівно на {ml} мл. Скільки натискань треба? Надуй {n} ідеальні кульки.'],
pump:['💨 Pompează','💨 Pump','💨 Pumpálj','💨 Качай'],tie:['🎀 Leagă balonul','🎀 Tie the balloon','🎀 Kösd meg a lufit','🎀 Зав’яжи кульку'],letOut:['🌬️ Lasă puțin aer','🌬️ Let some air out','🌬️ Engedj ki egy kis levegőt','🌬️ Випусти трохи повітря'],
small:['Încă e mic. Mai pompează!','Still small. Keep pumping!','Még kicsi. Pumpálj tovább!','Ще маленька. Качай далі!'],big:['E destul de mare! Acum leagă-l.','Big enough! Now tie it.','Elég nagy! Most kösd meg.','Досить велика! Тепер зав’яжи.'],
pop:['Pac! 💥 Balonul s-a spart. Încearcă unul nou, mai cu grijă.','Pop! 💥 The balloon burst. Try a new one, more gently.','Durr! 💥 Kipukkadt a lufi. Próbálj egy újat, óvatosabban.','Бах! 💥 Кулька лопнула. Спробуй нову, обережніше.'],
wrongColor:['Comanda nu mai cere baloane de culoarea asta ({c}).','The order doesn’t need more {c} balloons.','A rendelésben nincs több ilyen színű lufi ({c}).','У замовленні більше немає кульок цього кольору ({c}).'],
notExact:['Are {ml} ml, dar trebuie exact {t} ml.','It has {ml} ml, but it needs exactly {t} ml.','{ml} ml van benne, de pontosan {t} ml kell.','У ній {ml} мл, а треба рівно {t} мл.'],air:['Aer: {ml} ml','Air: {ml} ml','Levegő: {ml} ml','Повітря: {ml} мл'],
tied:['Balon legat! 🎈 {i} din {n}','Balloon tied! 🎈 {i} of {n}','Megkötve! 🎈 {i} / {n}','Кульку зав’язано! 🎈 {i} з {n}'],bDone:['Toate baloanele sunt gata! Le găsești în camera de petrecere. 🎉','All the balloons are ready! You’ll find them in the party room. 🎉','Minden lufi kész! A buliszobában várnak. 🎉','Усі кульки готові! Вони чекають у святковій кімнаті. 🎉'],
again:['🔁 Încă o comandă','🔁 Another order','🔁 Még egy rendelés','🔁 Ще одне замовлення'],balloon:['Balonul','The balloon','A lufi','Кулька'],colors:['Culoarea balonului','Balloon colour','A lufi színe','Колір кульки'],
rYoung:['Alege o decorațiune și atinge camera unde vrei s-o pui. Pune cel puțin {n} lucruri.','Choose a decoration and tap the room where you want it. Place at least {n} things.','Válassz díszt, és érintsd meg a szobát, ahová teszed. Tégy ki legalább {n} dolgot.','Обери прикрасу й торкнися кімнати, куди її поставити. Постав щонайменше {n} речей.'],
rMid:['Pregătește camera după listă. Bifele apar singure.','Get the room ready using the list. The ticks appear by themselves.','Rendezd be a szobát a lista alapján. A pipák maguktól megjelennek.','Підготуй кімнату за списком. Позначки з’являться самі.'],
rOld:['Ai {b} lei pentru decorațiuni. Pune tot ce e pe listă și nu depăși bugetul.','You have {b} lei for decorations. Place everything on the list without going over budget.','{b} lej a díszítésre szánt kereted. Tegyél ki mindent a listáról, de ne lépd túl.','У тебе {b} леїв на прикраси. Постав усе зі списку й не перевищ бюджет.'],
spent:['Cheltuit: {s} din {b} lei','Spent: {s} of {b} lei','Elköltve: {s} / {b} lej','Витрачено: {s} з {b} леїв'],over:['Ai depășit bugetul! Scoate ceva din cameră.','Over budget! Take something out of the room.','Túllépted a keretet! Vegyél ki valamit.','Бюджет перевищено! Прибери щось.'],
place:['Atinge camera ca să pui: {i}','Tap the room to place: {i}','Érintsd meg a szobát: {i}','Торкнися кімнати, щоб поставити: {i}'],removeHint:['Atinge o decorațiune din cameră ca s-o scoți.','Tap a decoration in the room to take it out.','Érints meg egy díszt a szobában, hogy kivedd.','Торкнися прикраси в кімнаті, щоб її прибрати.'],
addHere:['➕ Pune în cameră','➕ Put it in the room','➕ Tedd a szobába','➕ Постав у кімнату'],ready:['🎉 Camera e gata de petrecere!','🎉 The room is ready for the party!','🎉 Kész a szoba a bulira!','🎉 Кімната готова до свята!'],finish:['✅ Camera e gata','✅ The room is ready','✅ Kész a szoba','✅ Кімната готова'],
needMore:['Mai pune câteva decorațiuni.','Add a few more decorations.','Tégy ki még néhány díszt.','Додай ще кілька прикрас.'],missing:['Mai lipsesc: {list}','Still missing: {list}','Még hiányzik: {list}','Ще бракує: {list}'],
photo:['📸 Salvează poza petrecerii','📸 Save the party photo','📸 Mentsd el a bulifotót','📸 Зберегти фото свята'],clear:['🧹 Golește camera','🧹 Clear the room','🧹 Szoba kiürítése','🧹 Очистити кімнату'],
banner:['La mulți ani{name}!','Happy birthday{name}!','Boldog születésnapot{name}!','З днем народження{name}!'],roomLabel:['Camera de petrecere, cu {n} decorațiuni','Party room with {n} decorations','Buliszoba {n} díszzel','Святкова кімната, прикрас: {n}'],
list:['Lista','List','Lista','Список'],removeOne:['atinge ca s-o scoți','tap to remove','érintsd meg a kivételhez','торкнися, щоб прибрати'],decos:['Decorațiuni','Decorations','Díszek','Прикраси'],cost:['{c} lei','{c} lei','{c} lej','{c} леїв'],file:['petrecerea-mea','my-party','bulim','moie-sviato']};
const COL={red:['#ff6b6b',['roșu','red','piros','червоний']],blue:['#4dabf7',['albastru','blue','kék','синій']],yellow:['#ffd43b',['galben','yellow','sárga','жовтий']],green:['#69db7c',['verde','green','zöld','зелений']],purple:['#9775fa',['mov','purple','lila','фіолетовий']],pink:['#f783ac',['roz','pink','rózsaszín','рожевий']]};
const ITEMS={balloon:['🎈',2,['balon','balloon','lufi','кулька']],garland:['🎊',10,['ghirlandă','garland','füzér','гірлянда']],gift:['🎁',15,['cadou','present','ajándék','подарунок']],cake:['🎂',20,['tort','cake','torta','торт']],cupcake:['🧁',3,['brioșă','cupcake','muffin','кекс']],bear:['🧸',12,['ursuleț','teddy bear','maci','ведмедик']],star:['🌟',1,['steluță','star','csillag','зірочка']],ribbon:['🎀',2,['fundă','bow','masni','бантик']],confetti:['🎉',5,['confetti','confetti','konfetti','конфеті']],candle:['🕯️',1,['lumânare','candle','gyertya','свічка']]};
const E=(t,x='',c='')=>{const e=document.createElement(t);e.textContent=x;if(c)e.className=c;return e},B=(x,fn,c)=>{const b=E('button',x,c);b.type='button';b.onclick=fn;return b};
const NS='http://www.w3.org/2000/svg',S=(t,a={})=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);return e};
const uid=()=>localStorage.getItem('garden_active')||'default',key=()=>`garden_party_${uid()}_${new Date().getFullYear()}`,read=()=>{try{return JSON.parse(localStorage.getItem(key()))||{}}catch{return {}}},save=d=>{try{localStorage.setItem(key(),JSON.stringify(d))}catch{}};
const age=()=>ageOf(profile.dob),rand=n=>Math.floor(Math.random()*n),pick=a=>a[rand(a.length)],quick=()=>document.body.classList.contains('quiet');
// Numele salvat la configurarea profilului; fără nume, urarea rămâne simplă („La mulți ani!”).
const nameOf=()=>{const n=(window.gardenProfileApi?.active?.()?.name||'').trim();return n?', '+n:''};
function windows(){const y=new Date().getFullYear();return [y-1,y,y+1].map(v=>eventWindow('birthdayEvent',v))}
function isOpen(){const now=new Date();return windows().some(([a,b])=>now>=a&&now<b)}
function nextOpen(){const now=new Date();return windows().map(w=>w[0]).find(a=>a>now)}
const section=$('birthday'),bar=E('div','','party-keep party-top'),stage=E('div','','party-keep party-stage'),status=E('p','','party-keep party-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
section.prepend(bar);section.append(stage,status);
let tab='cake',previewing=false;
const say=(m,good=true)=>{status.textContent=m;status.classList.toggle('bad',!good)};
function draw(){if(!profile)return;const open=isOpen(),ok=open||previewing;if(!ok&&tab!=='cake')tab='cake';section.dataset.party=tab;section.classList.toggle('party-open',open);bar.replaceChildren();stage.replaceChildren();status.textContent='';
if(open){const h=E('div','','party-hello');h.append(E('p',fmt(L(P.hello),{name:nameOf()})));bar.append(h)}
const tabs=E('div','','learning-tabs party-tabs');tabs.setAttribute('role','group');tabs.setAttribute('aria-label',L(P.tabs));['cake','balloons','room'].forEach(k=>{const b=B(L(P[k]),()=>{tab=k;draw()});b.dataset.tab=k;b.setAttribute('aria-pressed',tab===k);if(k!=='cake'&&!ok){b.disabled=true;b.textContent+=' 🔒'}tabs.append(b)});bar.append(tabs);
if(!ok){const n=nextOpen(),days=n?Math.max(0,Math.ceil((n-new Date())/864e5)):0,p=E('p',fmt(L(P.locked),{when:fmt(L(P.inDays),{n:days})}),'party-locked');bar.append(p,B(L(P.preview),()=>{previewing=true;tab='balloons';draw()},'party-preview'))}
else if(previewing&&!open)bar.append(E('p',L(P.previewOn),'party-locked'));
if(tab==='balloons')balloons();else if(tab==='room')room()}
const help=t=>{stage.append(E('p',t,'studio-help'));if(age()<=6)stage.append(B(L(P.listen),()=>gardenSpeak(t,true),'speak-btn'))};

// ——— Baloane
let order=null;
function newOrder(){const a=age();if(a<=5)return {kind:'young',n:3,done:[]};if(a<=8){const cs=Object.keys(COL).sort(()=>Math.random()-.5).slice(0,2),want={[cs[0]]:1+rand(3),[cs[1]]:1+rand(2)};return {kind:'mid',want,done:[]}}const step=pick([50,100]),ml=step*(4+rand(5));return {kind:'old',step,ml,n:3,done:[]}}
function balloons(){if(!order)order=newOrder();const o=order,a=age(),need=o.kind==='mid'?Object.values(o.want).reduce((x,y)=>x+y,0):o.n;
const listText=o.kind==='mid'?Object.entries(o.want).map(([c,n])=>`${n} × ${L(COL[c][1])}`).join(', '):'';
help(o.kind==='young'?fmt(L(P.bYoung),{n:o.n}):o.kind==='mid'?fmt(L(P.bMid),{list:listText}):fmt(L(P.bOld),{step:o.step,ml:o.ml,n:o.n}));
stage.dataset.kind=o.kind;if(o.kind==='old'){stage.dataset.step=o.step;stage.dataset.ml=o.ml}if(o.kind==='mid')stage.dataset.want=JSON.stringify(o.want);
let color=o.kind==='mid'?Object.keys(o.want).find(c=>o.done.filter(x=>x===c).length<o.want[c])||'red':'red',air=0;
const colors=E('div','','palette party-colors');colors.setAttribute('role','group');colors.setAttribute('aria-label',L(P.colors));
Object.entries(COL).forEach(([k,[hex,nm]])=>{const b=B('',()=>{color=k;air=0;paint()},'swatch');b.dataset.c=k;b.style.setProperty('--sw',hex);b.setAttribute('aria-label',L(nm));b.title=L(nm);colors.append(b)});
const view=E('div','','balloon-view'),svg=S('svg',{viewBox:'0 0 200 220',role:'img'}),info=E('p','','versus-pairs'),done=E('div','','balloon-done');view.append(svg);
const pump=B(L(P.pump),()=>{if(o.kind==='old'){air+=o.step;if(air>o.ml+2*o.step)return burst()}else{if(o.kind==='young'&&air>=8){say(L(P.big));return}air++;if(o.kind==='mid'&&air>9)return burst()}window.gardenSound?.('pop');paint();if(o.kind!=='old'){say(air>=5?L(P.big):L(P.small))}else status.textContent=''},'primary party-pump');
const letOut=B(L(P.letOut),()=>{air=Math.max(0,air-o.step);paint()},'party-letout');
const tie=B(L(P.tie),()=>{if(o.kind==='old'){if(air!==o.ml){gardenMiss('party-balloons');say(air<o.ml?L(P.small)+' '+fmt(L(P.notExact),{ml:air,t:o.ml}):fmt(L(P.notExact),{ml:air,t:o.ml}),false);return}}else if(air<5){say(L(P.small),false);return}
if(o.kind==='mid'&&!(o.done.filter(x=>x===color).length<(o.want[color]||0))){gardenMiss('party-balloons');say(fmt(L(P.wrongColor),{c:L(COL[color][1])}),false);return}
o.done.push(color);const d=read();d.balloons=[...(d.balloons||[]),color].slice(-12);save(d);air=0;window.gardenSound?.('sticker');say(fmt(L(P.tied),{i:o.done.length,n:need}));
if(o.done.length>=need){gardenCelebrate('party-balloons');say(L(P.bDone));order=null;stage.append(B(L(P.again),()=>draw(),'primary'))}else if(o.kind==='mid')color=Object.keys(o.want).find(c=>o.done.filter(x=>x===c).length<o.want[c])||color;paint()},'party-tie');
function burst(){air=0;gardenMiss('party-balloons');view.classList.remove('popped');view.getBoundingClientRect();view.classList.add('popped');window.gardenSound?.('miss');say(L(P.pop),false);paint()}
function paint(){colors.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.c===color));const s=o.kind==='old'?Math.min(1.35,air/o.ml):Math.min(1.25,air/6),hex=COL[color][0];svg.replaceChildren();svg.setAttribute('aria-label',`${L(P.balloon)}: ${L(COL[color][1])}${o.kind==='old'?', '+fmt(L(P.air),{ml:air}):''}`);
const r=10+56*s,cy=150-r*1.15;svg.append(S('path',{d:`M100 ${cy+r*1.18} q-8 20 4 38 q10 16 -2 30`,fill:'none',stroke:'#8d99ae','stroke-width':2}),S('ellipse',{cx:100,cy,rx:r,ry:r*1.18,fill:hex,stroke:'#0003','stroke-width':2}),S('ellipse',{cx:100-r*.38,cy:cy-r*.45,rx:r*.18,ry:r*.28,fill:'#fff8'}),S('polygon',{points:`${96},${cy+r*1.16} ${104},${cy+r*1.16} 100,${cy+r*1.16+8}`,fill:hex}));
info.textContent=o.kind==='old'?fmt(L(P.air),{ml:air})+` · ${air/o.step}×`:'';letOut.hidden=o.kind!=='old';stage.dataset.air=air;
done.replaceChildren(...o.done.map(c=>{const sp=E('span','','mini-balloon');sp.style.setProperty('--b',COL[c][0]);sp.setAttribute('aria-label',L(COL[c][1]));return sp}))}
const row=E('div','','draw-tools');row.append(pump,letOut,tie);stage.append(colors,view,info,row,done);paint()}

// ——— Camera de petrecere
let roomTask=null,sel='balloon';
function newRoomTask(){const a=age();if(a<=5)return {kind:'young',n:5};if(a<=8)return {kind:'mid',list:{balloon:3+rand(2),gift:1+rand(2),garland:1,cake:1}};const list={balloon:3+rand(4),gift:1+rand(2),garland:1,cake:1};const cost=Object.entries(list).reduce((s,[k,n])=>s+ITEMS[k][1]*n,0);return {kind:'old',list,budget:Math.ceil((cost+5*rand(3))/5)*5}}
const SLOTS=[[20,70],[80,70],[35,78],[65,78],[50,62],[12,40],[88,40],[30,30],[70,30],[50,82],[22,86],[78,86],[42,72],[58,72]];
function room(){if(!roomTask)roomTask=newRoomTask();const t=roomTask,d=read(),placed=d.room||[];stage.dataset.kind=t.kind;if(t.kind!=='young')stage.dataset.list=JSON.stringify(t.list);if(t.kind==='old')stage.dataset.budget=t.budget;
help(t.kind==='young'?fmt(L(P.rYoung),{n:t.n}):t.kind==='mid'?L(P.rMid):fmt(L(P.rOld),{b:t.budget}));
const pal=E('div','','party-items');pal.setAttribute('role','group');pal.setAttribute('aria-label',L(P.decos));
Object.entries(ITEMS).forEach(([k,[ic,c,nm]])=>{const b=B('',()=>{sel=k;paintSel();say(fmt(L(P.place),{i:`${ic} ${L(nm)}`}))},'party-item');b.dataset.item=k;b.append(E('span',ic,'party-item-icon'),E('span',L(nm)));if(t.kind==='old')b.append(E('small',fmt(L(P.cost),{c})));pal.append(b)});
const paintSel=()=>pal.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.item===sel));
const scene=E('div','','party-room');scene.setAttribute('role','group');const ceiling=E('div','','party-ceiling');scene.append(E('div','','party-window'),E('div','','party-floor'),ceiling);
const banner=E('div',fmt(L(P.banner),{name:nameOf()}),'party-banner');scene.append(banner);
(d.balloons||[]).forEach((c,i)=>{const sp=E('span','','mini-balloon hang');sp.style.setProperty('--b',COL[c]?.[0]||'#ff6b6b');sp.style.left=`${6+i*7.5}%`;ceiling.append(sp)});
const layer=E('div','','party-layer');scene.append(layer);
const checklist=E('ul','','party-list'),money=E('p','','versus-pairs');
const count=k=>(read().room||[]).filter(p=>p.k===k).length,spent=()=>(read().room||[]).reduce((s,p)=>s+ITEMS[p.k][1],0);
function paintRoom(){const list=read().room||[];layer.replaceChildren(...list.map((p,i)=>{const b=B(ITEMS[p.k][0],()=>{const dd=read();dd.room.splice(i,1);save(dd);paintRoom();say(L(P.removeHint))},'party-placed');b.style.left=p.x+'%';b.style.top=p.y+'%';b.setAttribute('aria-label',`${L(ITEMS[p.k][2])} · ${L(P.removeOne)}`);b.dataset.k=p.k;return b}));
scene.setAttribute('aria-label',fmt(L(P.roomLabel),{n:list.length}));stage.dataset.placed=list.length;
if(t.kind!=='young'){checklist.replaceChildren(...Object.entries(t.list).map(([k,n])=>{const have=count(k),li=E('li',`${have>=n?'✅':'⬜'} ${ITEMS[k][0]} ${L(ITEMS[k][2])}: ${Math.min(have,n)}/${n}`);if(have>=n)li.className='ok';return li}))}
if(t.kind==='old'){const s=spent();money.textContent=fmt(L(P.spent),{s,b:t.budget});money.classList.toggle('bad',s>t.budget)}}
function put(x,y){const dd=read();dd.room=[...(dd.room||[]),{k:sel,x:Math.round(Math.min(94,Math.max(4,x))),y:Math.round(Math.min(92,Math.max(18,y)))}].slice(-40);save(dd);window.gardenSound?.('pop');paintRoom();if(t.kind==='old'&&spent()>t.budget)say(L(P.over),false);else status.textContent=''}
scene.addEventListener('click',e=>{if(e.target.closest('.party-placed'))return;const r=scene.getBoundingClientRect();put((e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100)});
const add=B(L(P.addHere),()=>{const n=(read().room||[]).length,[x,y]=SLOTS[n%SLOTS.length];put(x+(n>=SLOTS.length?4:0),y)},'party-add');
const finish=B(L(P.finish),()=>{const list=read().room||[];if(t.kind==='young'&&list.length<t.n){say(L(P.needMore),false);return}if(t.kind!=='young'){const miss=Object.entries(t.list).filter(([k,n])=>count(k)<n).map(([k,n])=>`${n-count(k)} × ${L(ITEMS[k][2])}`);if(miss.length){gardenMiss('party-room');say(fmt(L(P.missing),{list:miss.join(', ')}),false);return}if(t.kind==='old'&&spent()>t.budget){gardenMiss('party-room');say(L(P.over),false);return}}
gardenCelebrate('party-room');say(L(P.ready));const dd=read();dd.ready=true;save(dd);roomTask=null},'primary party-finish');
const photo=E('a',L(P.photo),'btn party-photo');photo.href='#';photo.onclick=()=>{photo.href=snapshot();photo.download=`${L(P.file)}.png`};
const clear=B(L(P.clear),()=>{const dd=read();dd.room=[];save(dd);paintRoom()});
const side=E('div','','party-side');if(t.kind!=='young')side.append(E('strong',L(P.list)),checklist);if(t.kind==='old')side.append(money);
const row=E('div','','draw-tools');row.append(add,finish,photo,clear);
stage.append(pal,scene,side,row);paintSel();paintRoom()}
function snapshot(){const c=document.createElement('canvas');c.width=960;c.height=600;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,600);g.addColorStop(0,'#ffe8f0');g.addColorStop(.72,'#fff4d6');g.addColorStop(.72,'#c8a27a');g.addColorStop(1,'#a07850');x.fillStyle=g;x.fillRect(0,0,960,600);
x.fillStyle='#bfe3ff';x.fillRect(620,120,220,150);x.strokeStyle='#fff';x.lineWidth=10;x.strokeRect(620,120,220,150);x.fillRect(726,120,8,150);
const d=read();(d.balloons||[]).forEach((cl,i)=>{x.fillStyle=COL[cl]?.[0]||'#ff6b6b';x.beginPath();x.ellipse(60+i*72,70,26,32,0,0,7);x.fill();x.strokeStyle='#8d99ae';x.lineWidth=2;x.beginPath();x.moveTo(60+i*72,102);x.lineTo(60+i*72,140);x.stroke()});
x.fillStyle='#7b2cbf';x.font='bold 40px system-ui,sans-serif';x.textAlign='center';x.fillText(fmt(L(P.banner),{name:nameOf()}),480,190);
x.textBaseline='middle';x.font='56px "Noto Color Emoji","Apple Color Emoji","Segoe UI Emoji",sans-serif';(d.room||[]).forEach(p=>x.fillText(ITEMS[p.k][0],p.x/100*960,p.y/100*600));return c.toDataURL('image/png')}
window.gardenParty={isOpen,hello:()=>fmt(L(P.hello),{name:nameOf()}),button:()=>L(P.homeBtn),open:t=>{tab=t||'balloons';draw()}};
gardenOn(r=>{if(r==='start'||r==='switch'){order=null;roomTask=null;previewing=false;tab='cake'}draw()});if(profile)draw();
})();
