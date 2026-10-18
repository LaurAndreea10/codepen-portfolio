/* COMPER resource panel: official links only; no contest PDFs are copied into this app. */
(function(){
'use strict';
var LANG=function(){return document.documentElement.lang==='en'?'en':'ro'};
var tr=function(ro,en){return LANG()==='en'?en:ro};
var esc=function(v){return String(v||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var archive='https://www.concursurilecomper.ro/arhiva-subiecte/';
var sources={
 mat:{
  I:[
   {test:'https://drive.google.com/file/d/1QnjEko09th3NnVXbhsGDaJUv-Fodw_x0/view?usp=sharing',barem:'https://www.concursurilecomper.ro/download/arhiva_bareme/matematica/Baremele-editiei-2026-Matematica-Etapa-I/Barem-Comper-Mate-EtapaI-2025-2026-clasaV.pdf'},
   {test:'https://drive.google.com/file/d/1ltIvCidHmUYoag6mbiHFksp7RdCRLW2A/view?usp=sharing',barem:'https://www.concursurilecomper.ro/download/arhiva_bareme/matematica/Baremele-editiei-2026-Matematica-Etapa-I/Barem-Comper-Mate-EtapaI-2025-2026-clasaVI.pdf'},
   {test:'https://drive.google.com/file/d/1VWoyqf9Op08t83Y0qtXShCs9e3aCFKbo/view?usp=sharing',barem:'https://www.concursurilecomper.ro/download/arhiva_bareme/matematica/Baremele-editiei-2026-Matematica-Etapa-I/Barem-Comper-Mate-EtapaI-2025-2026-clasaVII.pdf'},
   {test:'https://drive.google.com/file/d/14XOPilC5iOrwafaDt1KxhOXRGO6Vx52m/view?usp=sharing',barem:'https://www.concursurilecomper.ro/download/arhiva_bareme/matematica/Baremele-editiei-2026-Matematica-Etapa-I/Barem-Comper-Mate-EtapaI-2025-2026-clasaVIII.pdf'}
  ],
  II:[
   {test:'https://drive.google.com/file/d/19hF7BxjWBo5uxC3RgVw03mH1cY_G9l6K/view?usp=sharing',barem:'https://www.concursurilecomper.ro/download/arhiva_bareme/matematica/Baremele-editiei-2026-Matematica-Etapa-II/Barem-Comper-Mate-EtapaII-2025-2026-clasaV.pdf'},
   {test:'https://drive.google.com/file/d/174PwcQcs7o1Q9ELwcxlnl_fdJkNocMhX/view?usp=sharing',barem:'https://www.concursurilecomper.ro/download/arhiva_bareme/matematica/Baremele-editiei-2026-Matematica-Etapa-II/Barem-Comper-Mate-EtapaII-2025-2026-clasaVI.pdf'},
   {test:'https://drive.google.com/file/d/1yIRAnST9JXMf7fy-vRwGdjKFLJn_awyg/view?usp=sharing',barem:'https://www.concursurilecomper.ro/download/arhiva_bareme/matematica/Baremele-editiei-2026-Matematica-Etapa-II/Barem-Comper-Mate-EtapaII-2025-2026-clasaVII.pdf'},
   {test:'https://drive.google.com/file/d/1JutJ_RD9Pokm7WXXvq94uUaGsAG_xW53/view?usp=sharing',barem:'https://www.concursurilecomper.ro/download/arhiva_bareme/matematica/Baremele-editiei-2026-Matematica-Etapa-II/Barem-Comper-Mate-EtapaII-2025-2026-clasaVIII.pdf'}
  ]
 },
 rom:{
  I:[
   {test:'https://drive.google.com/file/d/1vlLD8BBs0urXJ0sLy40h8sBhzu7Crn_K/view?usp=sharing',barem:'https://www.concursurilecomper.ro/download/arhiva_bareme/romana/Baremele-editiei-2026-Limba-Romana-Etapa-I/Barem-Comper-Romana-EtapaI-2025-2026-clasaV.pdf'},
   {test:'https://drive.google.com/file/d/1tbWMKMYDeqG3EZaDzrP8Pk1SduIQRXlz/view?usp=sharing',barem:'https://www.concursurilecomper.ro/download/arhiva_bareme/romana/Baremele-editiei-2026-Limba-Romana-Etapa-I/Barem-Comper-Romana-EtapaI-2025-2026-clasaVI.pdf'},
   {test:'https://drive.google.com/file/d/18phkSdIrQ0jz0r4uh8IwixZBDaMMuGR6/view?usp=sharing',barem:'https://www.concursurilecomper.ro/download/arhiva_bareme/romana/Baremele-editiei-2026-Limba-Romana-Etapa-I/Barem-Comper-Romana-EtapaI-2025-2026-clasaVII.pdf'},
   {test:'https://drive.google.com/file/d/16AdLoGxaVuxWqsvnaXndQEGnmUZMRPsg/view?usp=sharing',barem:'https://www.concursurilecomper.ro/download/arhiva_bareme/romana/Baremele-editiei-2026-Limba-Romana-Etapa-I/Barem-Comper-Romana-EtapaI-2025-2026-clasaVIII.pdf'}
  ],
  II:[
   {test:'https://drive.google.com/file/d/1GHESwZqo5sIhO97O-d5b81UARM8eOUmD/view?usp=sharing',barem:'https://www.concursurilecomper.ro/download/arhiva_bareme/romana/Baremele-editiei-2026-Limba-Romana-Etapa-II/Barem-Comper-Romana-EtapaII-2025-2026-clasaV.pdf'},
   {test:'https://drive.google.com/file/d/13yERSgGHhCHHqTTaqPuXzn7sDBwWToLH/view?usp=sharing',barem:'https://www.concursurilecomper.ro/download/arhiva_bareme/romana/Baremele-editiei-2026-Limba-Romana-Etapa-II/Barem-Comper-Romana-EtapaII-2025-2026-clasaVI.pdf'},
   {test:'https://drive.google.com/file/d/1CoW3KP6_AwimrsINjkIQZCPxrWm3Yyhp/view?usp=sharing',barem:'https://www.concursurilecomper.ro/download/arhiva_bareme/romana/Baremele-editiei-2026-Limba-Romana-Etapa-II/Barem-Comper-Romana-EtapaII-2025-2026-clasaVII.pdf'},
   {test:'https://drive.google.com/file/d/1mHRV_eUt8rFxUh7FdvKBoitJ_U8IMukk/view?usp=sharing',barem:'https://www.concursurilecomper.ro/download/arhiva_bareme/romana/Baremele-editiei-2026-Limba-Romana-Etapa-II/Barem-Comper-Romana-EtapaII-2025-2026-clasaVIII.pdf'}
  ]
 }
};
var root=function(){return document.querySelector('#view')};
function render(rootEl){
 if(rootEl.dataset.comperRendered==='true')return;
 rootEl.dataset.comperRendered='true';
 rootEl.innerHTML='<header class="view-head"><p class="eyebrow">COMPER · '+esc(tr('arhivă oficială','official archive'))+'</p><h1 tabindex="-1">'+esc(tr('Teste COMPER · clasele V–VIII','COMPER tests · grades 5–8'))+'</h1><p class="lede">'+esc(tr('Alege materia, etapa și clasa pentru subiectul și baremul ediției 2025–2026. Fișierele rămân găzduite de organizator sau de Google Drive, prin linkurile publicate în arhiva COMPER.','Choose subject, stage and grade for the 2025–2026 paper and marking scheme. Files remain hosted by the organizer or Google Drive through links published in the COMPER archive.'))+'</p></header>'+
 '<section class="card stack"><div class="grid g2">'+
 '<label class="stack"><span>'+esc(tr('Ediția','Edition'))+'</span><select class="search" id="comper-edition"><option value="2025-2026">2025–2026 · disponibilă aici</option><option value="archive">'+esc(tr('Alți ani / toate edițiile','Other years / all editions'))+'</option></select></label>'+
 '<label class="stack"><span>'+esc(tr('Materia','Subject'))+'</span><select class="search" id="comper-subject"><option value="mat">'+esc(tr('Matematică','Mathematics'))+'</option><option value="rom">'+esc(tr('Limba română','Romanian language'))+'</option></select></label>'+
 '<label class="stack"><span>'+esc(tr('Etapa','Stage'))+'</span><select class="search" id="comper-stage"><option value="I">'+esc(tr('Etapa I','Stage I'))+'</option><option value="II">'+esc(tr('Etapa a II-a','Stage II'))+'</option></select></label>'+
 '<label class="stack"><span>'+esc(tr('Clasa','Grade'))+'</span><select class="search" id="comper-grade"><option value="5">V</option><option value="6">VI</option><option value="7">VII</option><option value="8">VIII</option></select></label></div>'+
 '<div class="row" id="comper-links"></div>'+
 '<p class="hint" id="comper-note"></p>'+
 '<p class="small muted">'+esc(tr('Linkurile pentru subiecte deschid Google Drive deoarece organizatorul le publică acolo. Dacă un link individual nu se deschide, folosește arhiva oficială și selectează clasa.','Paper links open Google Drive because the organizer publishes them there. If an individual link does not open, use the official archive and select the grade.'))+'</p>'+
 '<div class="row"><a class="btn" href="'+archive+'" target="_blank" rel="noopener">'+esc(tr('Deschide arhiva completă COMPER','Open full COMPER archive'))+' ↗</a><a class="btn" href="https://www.concursurilecomper.ro/" target="_blank" rel="noopener">'+esc(tr('Despre COMPER și regulament','About COMPER and regulations'))+' ↗</a><a class="btn" id="comper-practice" href="#quiz?s=mat&g=5">'+esc(tr('Exersează în Gimnaziu Space','Practise in Gimnaziu Space'))+' →</a></div></section>'+
 '<section class="card stack"><h2>'+esc(tr('Lucrează ca la concurs','Practise like a contest'))+'</h2><ol><li>'+esc(tr('Descarcă subiectul și rezolvă-l fără barem.','Open the paper and solve it without the marking scheme.'))+'</li><li>'+esc(tr('Verifică răspunsurile cu baremul oficial.','Check your answers with the official marking scheme.'))+'</li><li>'+esc(tr('Notează noțiunile dificile și repetă-le în quizurile Gimnaziu Space.','Note difficult topics and review them in Gimnaziu Space quizzes.'))+'</li></ol><p class="hint">'+esc(tr('Gimnaziu Space nu este afiliat organizatorului COMPER. Exercițiile din quiz sunt materiale proprii și nu sunt subiecte oficiale COMPER.','Gimnaziu Space is not affiliated with the COMPER organizer. Quiz questions are original practice material and are not official COMPER papers.'))+'</p></section>';
 var h=rootEl.querySelector('h1');document.title=(h?h.textContent:'COMPER')+' · Gimnaziu Space';
 var edit=rootEl.querySelector('#comper-edition'),sub=rootEl.querySelector('#comper-subject'),stage=rootEl.querySelector('#comper-stage'),grade=rootEl.querySelector('#comper-grade'),links=rootEl.querySelector('#comper-links'),note=rootEl.querySelector('#comper-note'),practice=rootEl.querySelector('#comper-practice');
 function update(){
  if(edit.value==='archive'){
   links.innerHTML='<a class="btn primary" href="'+archive+'" target="_blank" rel="noopener">'+esc(tr('Alege ediția, materia, etapa și clasa în arhiva COMPER','Choose edition, subject, stage and grade in the COMPER archive'))+' ↗</a>';
   note.textContent=tr('Arhiva organizatorului include și edițiile anterioare; disponibilitatea fișierelor depinde de publicarea lor de către COMPER.','The organizer archive also includes earlier editions; file availability depends on COMPER publication.');
  }else{
   var record=sources[sub.value][stage.value][Number(grade.value)-5];
   links.innerHTML='<a class="btn primary" href="'+record.test+'" target="_blank" rel="noopener">'+esc(tr('Deschide subiectul clasei ','Open grade '))+grade.value+' ↗</a><a class="btn" href="'+record.barem+'" target="_blank" rel="noopener">'+esc(tr('Deschide baremul clasei ','Open grade '))+grade.value+' ↗</a>';
   note.textContent=tr('Ediția 2025–2026 · '+(sub.value==='mat'?'Matematică':'Limba română')+' · Etapa '+(stage.value==='I'?'I':'a II-a')+' · Clasa '+grade.value+'.','2025–2026 edition · '+(sub.value==='mat'?'Mathematics':'Romanian language')+' · Stage '+stage.value+' · Grade '+grade.value+'.');
  }
  practice.href='#quiz?s='+sub.value+'&g='+grade.value;
 }
 [edit,sub,stage,grade].forEach(function(select){select.addEventListener('change',update)});
 update();document.querySelectorAll('[data-nav]').forEach(function(a){a.removeAttribute('aria-current')});var active=document.querySelector('[data-nav=comper]');if(active)active.setAttribute('aria-current','page');if(h)h.focus({preventScroll:true})
}
function card(){
 return '<section class="card stack" data-comper-card><p class="eyebrow">COMPER · 2025–2026</p><h2>'+esc(tr('Subiecte și bareme pentru clasele V–VIII','COMPER papers and marking schemes for grades 5–8'))+'</h2><p class="muted">'+esc(tr('Alege materia, etapa și clasa; deschide documentele publicate de organizator.','Choose subject, stage and grade; open the organizer’s published documents.'))+'</p><div class="row"><a class="btn primary" href="#comper">'+esc(tr('Deschide arhiva COMPER','Open COMPER tests'))+' →</a><a class="btn" href="'+archive+'" target="_blank" rel="noopener">'+esc(tr('Arhiva oficială','Official archive'))+' ↗</a></div></section>'
}
function enhance(){
 var el=root();if(!el)return;
 if(location.hash.split('?')[0]==='#comper'){render(el);return}
 var home=location.hash===''||location.hash==='#acasa'||location.hash.indexOf('#acasa?')===0;
 if(home&&!el.querySelector('[data-comper-card]')){
  var lab=el.querySelector('[data-learning-lab]'),hero=el.querySelector('.hero'),anchor=lab||hero;
  if(anchor)anchor.insertAdjacentHTML('afterend',card());else el.insertAdjacentHTML('beforeend',card())
 }
}
window.addEventListener('hashchange',function(){setTimeout(enhance,0)});
document.addEventListener('click',function(e){if(e.target.closest('[data-set-lang]'))setTimeout(enhance,20)});
var v=root(),queued=false;if(v)new MutationObserver(function(){if(!queued){queued=true;requestAnimationFrame(function(){queued=false;enhance()})}}).observe(v,{childList:true,subtree:true});
enhance()
})();