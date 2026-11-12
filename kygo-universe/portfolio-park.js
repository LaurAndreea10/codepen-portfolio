/* Keep the portfolio HTML inside its existing size budget; preserve earlier history. */
(() => {
  function entry(){
    const li=document.createElement('li');li.className='now-item now-item-done';li.dataset.kygoPark='1';li.dataset.completed='2026-11-12';
    const status=document.createElement('span');status.className='now-status';status.setAttribute('aria-hidden','true');status.textContent='✅';
    const text=document.createElement('span'),strong=document.createElement('strong');strong.textContent='Parcul lui Kygo — 4 moduri de joacă';text.append(strong,document.createTextNode(' — Sapă după os, Aleargă, Prinde discul și Sari peste obstacole; câte cinci niveluri, mod asistat, RO/EN și progres în pașaportul comun. '));
    const link=document.createElement('a');link.className='now-item-link';link.href='kygo-world/joaca/';link.textContent='Joacă';
    const history=document.createElement('a');history.className='now-item-link';history.href='kygo-world/joaca/CHANGELOG.md';history.textContent='Istoric';text.append(link,' · ',history);li.append(status,text);return li;
  }
  for(const list of [document.querySelector('#now-panel-done .now-checklist'),document.querySelector('#now-panel-history .now-history-week .now-checklist')])if(list&&!list.querySelector('[data-kygo-park]'))list.prepend(entry());
})();
