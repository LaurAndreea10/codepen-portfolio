// Grădina Curioasă — mențiunea vizibilă „Datele rămân pe acest dispozitiv” și formularul de feedback la îndemână.
// Apare pe ecranul de configurare a profilului și într-o bară subțire pe toate ecranele jocului.
(()=>{
const LANGS=['ro','en','hu','uk'],L=a=>a[Math.max(0,LANGS.indexOf(lang))]??a[1];
const T={
title:['🔒 Datele rămân pe acest dispozitiv','🔒 Your data stays on this device','🔒 Az adatok ezen az eszközön maradnak','🔒 Дані залишаються на цьому пристрої'],
short:['Fără cont, fără server, fără reclame. Profilul și progresul se salvează doar în browserul acestui dispozitiv.','No account, no server, no ads. The profile and progress are saved only in this device’s browser.','Nincs fiók, nincs szerver, nincs reklám. A profil és a haladás csak ennek az eszköznek a böngészőjében tárolódik.','Без акаунта, без сервера, без реклами. Профіль і поступ зберігаються лише в браузері цього пристрою.'],
more:['Ce se salvează și cum le ștergi','What is saved and how to delete it','Mit tárolunk, és hogyan törölheted','Що зберігається і як це видалити'],
what:['Ce se salvează: porecla (dacă o scrii), data nașterii, lumea preferată, progresul, desenele, insignele și setările.','What is saved: the nickname (if you type one), birth date, favourite world, progress, drawings, badges and settings.','Mit tárolunk: a becenevet (ha megadod), a születési dátumot, a kedvenc világot, a haladást, a rajzokat, a jelvényeket és a beállításokat.','Що зберігається: псевдонім (якщо його вказати), дата народження, улюблений світ, поступ, малюнки, значки й налаштування.'],
where:['Unde: doar în memoria browserului de pe acest telefon, tabletă sau calculator (localStorage). Nimic nu pleacă pe internet și nu există statistici sau urmărire.','Where: only in the browser storage on this phone, tablet or computer (localStorage). Nothing is sent over the internet and there are no statistics or tracking.','Hol: csak ennek a telefonnak, táblagépnek vagy számítógépnek a böngészőjében (localStorage). Semmi nem megy ki az internetre, és nincs statisztika vagy követés.','Де: лише в пам’яті браузера на цьому телефоні, планшеті чи комп’ютері (localStorage). Нічого не надсилається в інтернет, немає статистики чи стеження.'],
send:['Singurul lucru care se trimite este părerea scrisă de un adult în formularul de feedback, și doar când apasă „Trimite”.','The only thing ever sent is the opinion an adult writes in the feedback form, and only when they press “Send”.','Csak a felnőtt által a visszajelző űrlapon megírt vélemény kerül elküldésre, és csak a „Küldés” gombra kattintva.','Надсилається лише відгук, який дорослий пише у формі зворотного зв’язку, і лише після натискання «Надіслати».'],
lose:['Atenție: dacă ștergi datele browserului sau joci în modul privat, progresul se pierde. Îl poți muta pe alt dispozitiv din Activități → ⚙ Setări → Exportă progresul.','Note: clearing browser data or playing in private mode loses the progress. You can move it to another device from Activities → ⚙ Settings → Export.','Figyelem: ha törlöd a böngészési adatokat vagy privát módban játszol, a haladás elvész. Másik eszközre a Feladatok → ⚙ Beállítások → Exportálás menüben viheted át.','Увага: якщо очистити дані браузера або грати в приватному режимі, поступ зникне. Перенести його на інший пристрій можна через Завдання → ⚙ Налаштування → Експорт.'],
erase:['🗑️ Șterge toate datele jocului de pe acest dispozitiv','🗑️ Delete all game data from this device','🗑️ Minden játékadat törlése erről az eszközről','🗑️ Видалити всі дані гри з цього пристрою'],
confirm:['Sigur ștergi toate profilurile și progresul de pe acest dispozitiv? Nu se pot recupera.','Delete every profile and all progress from this device? This cannot be undone.','Biztosan törlöd az összes profilt és haladást erről az eszközről? Nem állítható vissza.','Видалити всі профілі й увесь поступ із цього пристрою? Це не можна скасувати.'],
close:['Închide','Close','Bezárás','Закрити'],
feedback:['💬 Scrie-ți părerea','💬 Share your opinion','💬 Írd meg a véleményed','💬 Залиш відгук'],forAdults:['pentru părinți','for parents','szülőknek','для батьків'],
bar:['Datele rămân pe acest dispozitiv','Data stays on this device','Az adatok ezen az eszközön maradnak','Дані лишаються на цьому пристрої']};
const E=(t,x='',c='')=>{const e=document.createElement(t);e.textContent=x;if(c)e.className=c;return e};
const fbHref=()=>'feedback.html?lang='+(lang==='ro'?'ro':'en');
function fbLink(cls){const a=E('a',L(T.feedback),cls);a.href=fbHref();a.dataset.feedback='1';const s=E('span',` · ${L(T.forAdults)}`,'privacy-for');a.append(s);return a}
// Fereastra cu detalii
const dlg=E('dialog','','privacy-dialog');dlg.setAttribute('aria-labelledby','privacyTitle');document.body.append(dlg);
function openDetails(){dlg.replaceChildren();const h=E('h2',L(T.title));h.id='privacyTitle';const ul=E('ul','','privacy-list');[T.what,T.where,T.send,T.lose].forEach(k=>ul.append(E('li',L(k))));
const erase=E('button',L(T.erase),'privacy-erase');erase.type='button';erase.onclick=()=>{dlg.close();const go=()=>{if(!confirm(L(T.confirm)))return;Object.keys(localStorage).filter(k=>k.startsWith('garden_')).forEach(k=>localStorage.removeItem(k));try{sessionStorage.removeItem('garden_view')}catch{}location.reload()};window.gardenGate?gardenGate(go):go()};
const close=E('button',L(T.close),'primary');close.type='button';close.onclick=()=>dlg.close();const row=E('div','','privacy-actions');row.append(fbLink('btn privacy-fb'),erase,close);dlg.append(h,ul,row);if(!dlg.open)dlg.showModal();close.focus()}
// Pe ecranul de configurare: un chenar vizibil, înaintea datei nașterii
const setup=$('setup'),note=E('div','','privacy-note');note.setAttribute('role','note');setup.insertBefore(note,setup.querySelector('[data-i=setupText]')?.nextSibling||setup.firstChild);
// În joc: o bară subțire, pe toate ecranele
const bar=E('div','','privacy-bar');const app=$('app');app.insertBefore(bar,app.firstChild);
function draw(){note.replaceChildren(E('strong',L(T.title)),E('p',L(T.short)));const more=E('button',L(T.more),'privacy-more');more.type='button';more.onclick=openDetails;note.append(more,fbLink('privacy-fb-inline'));
bar.replaceChildren();const b=E('button','🔒 '+L(T.bar),'privacy-chip');b.type='button';b.setAttribute('aria-haspopup','dialog');b.onclick=openDetails;bar.append(b,fbLink('privacy-chip privacy-fb-chip'));if(dlg.open)openDetails()}
window.gardenPrivacy={open:openDetails};
gardenOn(draw);document.getElementById('lang')?.addEventListener('change',()=>setTimeout(draw));draw();
})();
