(function(){
  'use strict';

  var PATCH_MARKER = 'finalizat-recent-tools-2026-05-24';

  var completedItems = [
    {
      title: 'Alpis Fusion CRM Premium — Case Study & Decision Log',
      desc: 'studiu de caz extins cu decision log, alegeri de produs și decizii UX documentate.',
      href: 'projects/alpis-fusion-case-study.html',
      tag: 'Case study'
    },
    {
      title: 'Lighthouse CI Audit Guide',
      desc: 'audit de performanță pentru portofoliu, LCP, CSS non-critic și checklist de optimizare.',
      href: 'tools/lighthouse-audit-guide.html',
      tag: 'Performance'
    },
    {
      title: 'Marketing-Tech Templates',
      desc: 'template-uri orientate pe conversie și growth workflows după Campaign ROI Calculator.',
      href: 'tools/marketing-tech-templates.html',
      tag: 'Marketing-Tech'
    },
    {
      title: 'Marketing OS — Industry Benchmarks + UTM Builder v1.2',
      desc: 'hub activ pentru benchmarks, UTM Builder v1.2, campanii și raportare marketing.',
      href: 'tools/marketing-os.html',
      tag: 'Marketing OS'
    },
    {
      title: 'Link Video Editor Studio — Automation Pack Export',
      desc: 'export pentru Automation Pack, timeline din brief și workflow pentru handoff video.',
      href: 'tools/link-video-automation-pack.html',
      tag: 'Automation'
    }
  ];

  function ensureStyles(){
    if(document.getElementById('now-finalized-links-style')) return;
    var style = document.createElement('style');
    style.id = 'now-finalized-links-style';
    style.textContent = ''
      + '.now-item-link{color:var(--accent,#6aa6ff);text-decoration:none;border-bottom:1px solid rgba(106,166,255,.35)}'
      + '.now-item-link:hover{color:var(--text,#fff);border-bottom-color:currentColor}'
      + '.now-finalized-link-list .now-tag{margin-left:.4rem}';
    document.head.appendChild(style);
  }

  function makeItem(item){
    var li = document.createElement('li');
    li.className = 'now-item now-item-done now-finalized-link-list';
    li.setAttribute('data-finalized-tool', item.href);
    li.innerHTML = ''
      + '<span class="now-status" aria-label="Finalizat">✅</span>'
      + '<div>'
      + '<strong><a class="now-item-link" href="' + item.href + '">' + item.title + '</a></strong>'
      + ' — ' + item.desc + ' '
      + '<span class="now-tag now-tag-done">Mai 2026</span>'
      + '<span class="now-tag now-tag-done">' + item.tag + '</span>'
      + '</div>';
    return li;
  }

  function patchFinalizatRecent(){
    ensureStyles();

    var list = document.querySelector('#now-panel-done .now-checklist');
    if(!list) return false;

    if(list.getAttribute('data-finalizat-patch') === PATCH_MARKER) return true;

    completedItems.slice().reverse().forEach(function(item){
      if(list.querySelector('[data-finalized-tool="' + item.href + '"]')) return;
      list.insertBefore(makeItem(item), list.firstElementChild || null);
    });

    list.setAttribute('data-finalizat-patch', PATCH_MARKER);

    var badge = document.querySelector('.now-badge time');
    if(badge){
      badge.setAttribute('datetime','2026-05-24');
      badge.textContent = '24 Mai 2026';
    }

    return true;
  }

  function boot(){
    patchFinalizatRecent();
    [100, 300, 700, 1200, 2500, 5000].forEach(function(ms){
      window.setTimeout(patchFinalizatRecent, ms);
    });

    if(document.body && !document.body.__finalizatRecentObserver){
      document.body.__finalizatRecentObserver = new MutationObserver(function(){
        window.clearTimeout(document.body.__finalizatRecentTimer);
        document.body.__finalizatRecentTimer = window.setTimeout(patchFinalizatRecent, 60);
      });
      document.body.__finalizatRecentObserver.observe(document.body, {childList:true, subtree:true});
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
