/* Keep the portfolio HTML inside its existing size budget; preserve earlier history. */
(() => {
  function entry(version=1){
    const li=document.createElement('li');li.className='now-item now-item-done';li.dataset.kygoPark=String(version);li.dataset.completed='2026-11-12';
    const status=document.createElement('span');status.className='now-status';status.setAttribute('aria-hidden','true');status.textContent='✅';
    const text=document.createElement('span'),strong=document.createElement('strong');strong.textContent=version===2?'Parcul lui Kygo — explorare și competiție':'Parcul lui Kygo — 4 moduri de joacă';text.append(strong,document.createTextNode(version===2?' — Opt extinderi: animații, plimbare liberă, patru decoruri, competiție cu medalii, accesorii vizibile, comenzi ajustabile, reluarea rundei și portaluri. RO/EN. ':' — Sapă după os, Aleargă, Prinde discul și Sari peste obstacole; câte cinci niveluri, mod asistat, RO/EN și progres în pașaportul comun. '));
    const link=document.createElement('a');link.className='now-item-link';link.href='kygo-world/joaca/';link.textContent='Joacă';
    const history=document.createElement('a');history.className='now-item-link';history.href='kygo-world/joaca/CHANGELOG.md';history.textContent='Istoric';text.append(link,' · ',history);li.append(status,text);return li;
  }
  const done=document.querySelector('#now-panel-done .now-checklist'),history=document.querySelector('#now-panel-history .now-history-week .now-checklist');
  if(done&&!done.querySelector('[data-kygo-park="2"]'))done.prepend(entry(2));
  if(history){if(!history.querySelector('[data-kygo-park="1"]'))history.prepend(entry(1));if(!history.querySelector('[data-kygo-park="2"]'))history.prepend(entry(2));}
})();
