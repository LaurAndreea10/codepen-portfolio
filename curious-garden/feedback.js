// Grădina Curioasă — „Scrie-ți părerea” în zona pentru părinți (după poarta pentru adulți).
// Deschide pagina feedback.html, care trimite mesajul prin FormSubmit.
(()=>{
const F={
ro:{title:'Scrie-ți părerea',intro:'Cum ți se pare Grădina Curioasă? Mesajul ajunge direct la mine. Dacă ești de acord, îl pot publica în portofoliu după ce îl citesc.',open:'Deschide formularul de păreri',note:'Nu include numele sau alte date ale copilului.'},
en:{title:'Share your feedback',intro:'What do you think of Curious Garden? Your message comes straight to me. If you agree, I may publish it in my portfolio after reading it.',open:'Open the feedback form',note:'Please don’t include your child’s name or other personal details.'},
hu:{title:'Írd meg a véleményed',intro:'Hogy tetszik a Kíváncsi Kert? Az üzeneted közvetlenül hozzám érkezik. Ha beleegyezel, elolvasás után megjelenhet a portfóliómban. Az űrlap angolul nyílik meg.',open:'Véleményűrlap megnyitása',note:'Kérlek, ne írd bele a gyermek nevét vagy más személyes adatát.'},
uk:{title:'Напиши свою думку',intro:'Як тобі Цікавий сад? Повідомлення надійде прямо мені. Якщо погодишся, я зможу опублікувати його в портфоліо, прочитавши. Форма відкриється англійською.',open:'Відкрити форму відгуку',note:'Будь ласка, не пиши ім’я дитини чи інші особисті дані.'}};
const tx=k=>F[lang]?.[k]??F.en[k];
const prev=window.gardenSettingsExtra;
window.gardenSettingsExtra=(card,layer)=>{prev?.(card,layer);const d=document.createElement('details');d.className='settings-section feedback-section';const s=document.createElement('summary');s.textContent='💬 '+tx('title');const p=document.createElement('p');p.textContent=tx('intro');const a=document.createElement('a');a.className='feedback-link';a.href='feedback.html?lang='+(lang==='ro'?'ro':'en');a.textContent=tx('open');const n=document.createElement('p');n.className='small';n.textContent=tx('note');d.append(s,p,a,n);card.append(d)};
})();
