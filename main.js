(() => {
  'use strict';

  const ORIGINAL_MAIN = 'https://cdn.jsdelivr.net/gh/LaurAndreea10/codepen-portfolio@32d68e9388727fd0052b50b1c09b78da26dbf812/main.js';

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function currentLang() {
    return document.documentElement.lang === 'en' ? 'en' : 'ro';
  }

  function injectCarouselFixStyles() {
    if (qs('#carousel-white-fix')) return;
    const style = document.createElement('style');
    style.id = 'carousel-white-fix';
    style.textContent = `
      .hero-preview,
      .hero-preview-wrap {
        background:
          radial-gradient(circle at 20% 0%, rgba(79,140,255,.22), transparent 35%),
          radial-gradient(circle at 100% 100%, rgba(139,92,246,.18), transparent 38%),
          linear-gradient(135deg, #071226 0%, #050a16 100%) !important;
      }
      .hero-preview-wrap {
        position: relative !important;
        overflow: hidden !important;
        min-height: 430px !important;
        border: 1px solid rgba(255,255,255,.08) !important;
      }
      .hero-preview-wrap::before {
        content: '';
        position: absolute;
        inset: 0;
        pointer-events: none;
        background:
          linear-gradient(120deg, rgba(79,140,255,.13), transparent 42%),
          radial-gradient(circle at 80% 20%, rgba(255,255,255,.08), transparent 22%);
        z-index: 0;
      }
      .hero-preview-fallback {
        background: #071226 !important;
        object-fit: cover !important;
        opacity: 1 !important;
        z-index: 1 !important;
      }
      .hero-preview-frame,
      iframe.hero-preview-frame,
      #heroPreviewFrame {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
        background: #071226 !important;
      }
      .hero-preview-hint {
        opacity: 0 !important;
        display: none !important;
      }
      .hero-preview-stage {
        position: relative !important;
        z-index: 2 !important;
        margin-top: 260px !important;
        background: linear-gradient(180deg, rgba(7,18,38,.88), rgba(5,10,22,.98)) !important;
        border-top: 1px solid rgba(255,255,255,.1) !important;
        backdrop-filter: blur(12px) !important;
      }
      body.light .hero-preview,
      body.light .hero-preview-wrap {
        background:
          radial-gradient(circle at 20% 0%, rgba(79,140,255,.16), transparent 35%),
          radial-gradient(circle at 100% 100%, rgba(139,92,246,.13), transparent 38%),
          linear-gradient(135deg, #edf3fb 0%, #f8fbff 100%) !important;
      }
      body.light .hero-preview-stage {
        background: linear-gradient(180deg, rgba(255,255,255,.82), rgba(237,243,251,.95)) !important;
      }
      .crm-galaxy-injected-card {
        position: relative;
        overflow: hidden;
      }
      .crm-galaxy-injected-card::after {
        content: '15 variants';
        position: absolute;
        top: 14px;
        right: 14px;
        padding: 5px 9px;
        border-radius: 999px;
        background: rgba(63,216,224,.14);
        color: #3fd8e0;
        border: 1px solid rgba(63,216,224,.32);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: .08em;
        text-transform: uppercase;
      }
      .crm-galaxy-carousel-btn {
        border: 1px solid rgba(63,216,224,.36) !important;
        background: rgba(63,216,224,.10) !important;
        color: inherit !important;
      }
      .crm-galaxy-carousel-btn.is-active,
      .crm-galaxy-carousel-btn:hover {
        border-color: #3fd8e0 !important;
        box-shadow: 0 0 0 3px rgba(63,216,224,.10) !important;
      }
      @media (max-width: 760px) {
        .hero-preview-wrap { min-height: 360px !important; }
        .hero-preview-stage { margin-top: 210px !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function lockCarouselToDarkPoster() {
    injectCarouselFixStyles();
    const frame = qs('#heroPreviewFrame');
    const wrap = qs('.hero-preview-wrap');
    const fallback = qs('#heroPreviewFallback');
    const hint = qs('#heroPreviewHint');
    if (frame) {
      frame.removeAttribute('src');
      frame.setAttribute('aria-hidden', 'true');
      frame.style.setProperty('display', 'none', 'important');
      frame.style.setProperty('opacity', '0', 'important');
      frame.style.setProperty('visibility', 'hidden', 'important');
      frame.style.setProperty('pointer-events', 'none', 'important');
      frame.style.setProperty('background', '#071226', 'important');
    }
    if (fallback) {
      fallback.style.setProperty('opacity', '1', 'important');
      fallback.style.setProperty('background', '#071226', 'important');
    }
    if (hint) {
      hint.style.setProperty('display', 'none', 'important');
      hint.style.setProperty('opacity', '0', 'important');
    }
    if (wrap) {
      wrap.dataset.carouselFixed = '2';
      wrap.removeAttribute('role');
      wrap.removeAttribute('tabindex');
      wrap.removeAttribute('aria-label');
    }
  }

  function itemTemplate(item, done) {
    const link = item.href
      ? ` <a class="now-item-link" href="${item.href}" target="_blank" rel="noopener noreferrer">${item.linkLabel || 'Live'}</a>`
      : '';
    const tagClass = done ? 'now-tag now-tag-done' : 'now-tag';
    return `
      <li class="now-item${done ? ' now-item-done' : ''}">
        <span class="now-status" aria-hidden="true">${done ? '✅' : '🔄'}</span>
        <span><strong>${item.title}</strong>${link} — ${item.text}<span class="${tagClass}">${item.tag}</span></span>
      </li>
    `;
  }

  function injectCrmGalaxyCarousel() {
    const links = qs('#heroPreviewLinks');
    if (!links || qs('[data-crm-galaxy-carousel]')) return;

    const projectHref = 'projects/crm-galaxy-3d-ultimate-15.html';
    const readmeHref = 'projects/crm-galaxy-3d-ultimate-15.md';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pill crm-galaxy-carousel-btn';
    btn.dataset.crmGalaxyCarousel = 'true';
    btn.textContent = 'CRM Galaxy 3D';
    btn.setAttribute('aria-label', 'Preview CRM Galaxy 3D Ultimate');

    btn.addEventListener('click', () => {
      links.querySelectorAll('button,a').forEach(el => el.classList.remove('is-active', 'active', 'on'));
      btn.classList.add('is-active');

      const titleTop = qs('#heroPreviewTitle');
      const heading = qs('#heroPreviewHeading');
      const type = qs('#heroPreviewType');
      const meta = qs('#heroPreviewMeta');
      const desc = qs('#heroPreviewDescription');
      const open = qs('#heroPreviewOpen');
      const code = qs('#heroPreviewCode');
      const url = qs('#heroPreviewUrl');
      const secondary = qs('#heroPreviewOpenSecondary');
      const fallback = qs('#heroPreviewFallback');

      if (titleTop) titleTop.textContent = 'CRM Galaxy 3D Ultimate';
      if (heading) heading.textContent = 'CRM Galaxy 3D Ultimate';
      if (type) type.textContent = 'CRM Intelligence';
      if (meta) meta.textContent = '15 variante · Risk Score · Pipeline · Executive Report';
      if (desc) desc.textContent = 'Dashboard CRM vizual care transformă portofoliul de clienți într-o galaxie interactivă, cu analiză, pipeline, Customer Success OS și raportare executivă.';
      if (open) {
        open.href = projectHref;
        open.textContent = 'Deschide proiectul';
        open.removeAttribute('target');
      }
      if (code) {
        code.href = readmeHref;
        code.textContent = 'README →';
        code.removeAttribute('target');
      }
      if (url) {
        url.href = projectHref;
        url.textContent = 'codepen-portfolio/projects/crm-galaxy-3d-ultimate-15.html';
        url.removeAttribute('target');
      }
      if (secondary) {
        secondary.href = projectHref;
        secondary.textContent = 'Deschide CRM Galaxy';
        secondary.removeAttribute('target');
      }
      if (fallback) {
        fallback.alt = 'Preview CRM Galaxy 3D Ultimate';
      }
      lockCarouselToDarkPoster();
    });

    links.insertAdjacentElement('afterbegin', btn);
  }

  function injectCrmGalaxyCards() {
    const projectHref = 'projects/crm-galaxy-3d-ultimate-15.html';
    const readmeHref = 'projects/crm-galaxy-3d-ultimate-15.md';

    const powGrid = qs('#proof-of-work .pow-grid');
    if (powGrid && !qs('[data-crm-galaxy-proof]')) {
      powGrid.insertAdjacentHTML('afterbegin', `
        <div class="pow-card crm-galaxy-injected-card" data-crm-galaxy-proof>
          <div class="pow-card-header"><div class="pow-icon blue">🪐</div><h4>CRM Galaxy 3D Ultimate finalizat</h4></div>
          <p>Dashboard CRM experimental cu 15 variante: Galaxie, Analysis, Pipeline, PRO, Customer Success OS, Sales & Retention Hub și AI CRM Assistant.</p>
          <span class="pow-metric">15 variante · GitHub Pages ready</span>
          <div class="pow-links">
            <a class="pow-link" href="${projectHref}">→ Deschide proiectul</a>
            <a class="pow-link" href="${readmeHref}">→ README</a>
          </div>
        </div>
      `);
    }

    const latestGrid = qs('#latest-github .projects-grid');
    if (latestGrid && !qs('[data-crm-galaxy-latest]')) {
      latestGrid.insertAdjacentHTML('afterbegin', `
        <article class="project-card glass crm-galaxy-injected-card" data-crm-galaxy-latest aria-labelledby="crm-galaxy-title">
          <span class="badge-new">NEW</span>
          <div class="project-top"><div><h3 id="crm-galaxy-title">CRM Galaxy 3D Ultimate</h3><span class="badge-github">GitHub Pages · CRM Intelligence</span></div><span class="tag github">crm</span></div>
          <p class="project-desc">Dashboard CRM vizual cu 15 variante, risk score, pipeline, Customer Success OS, import CSV/JSON sample și raport executiv generat în browser.</p>
          <div class="card-actions">
            <a class="btn btn-primary" href="${projectHref}">Live Demo</a>
            <a class="btn btn-secondary" href="${readmeHref}">README →</a>
          </div>
        </article>
      `);
    }
  }

  function overrideNowSection() {
    const date = qs('#now-datetime');
    const activeList = qs('#now-panel-active .now-checklist');
    const doneList = qs('#now-panel-done .now-checklist');
    const history = qs('#now-panel-history .now-history');
    if (!date || !activeList || !doneList || !history) return;

    date.dateTime = '2026-07-05';
    date.textContent = currentLang() === 'en' ? '5 July 2026' : '5 Iulie 2026';

    const active = currentLang() === 'en'
      ? [
          { title: 'Case study screenshots & before/after visuals', text: 'adding screenshots, before/after comparisons and short visual explanations for the main projects so the case studies are easier to scan.', tag: 'In progress' },
          { title: 'Project metrics & validation notes', text: 'adding lightweight proof for key projects: solved problem, simplified flow, UX decision and live validation method.', tag: 'UX proof' },
          { title: 'Portfolio content cleanup RO/EN', text: 'refining bilingual copy, titles, microcopy and CTAs for a more coherent and professional portfolio.', tag: 'Content' },
          { title: 'Recruiter / reviewer quick path', text: 'building a fast visitor path: top 3 projects, proof-of-work, GitHub, live demos and contact visible in 30–60 seconds.', tag: 'Portfolio UX' }
        ]
      : [
          { title: 'Case study screenshots & before/after visuals', text: 'adaug capturi, comparații before/after și mini explicații vizuale pentru proiectele principale, ca studiile de caz să fie mai ușor de scanat.', tag: 'În lucru' },
          { title: 'Project metrics & validation notes', text: 'completez proiectele-cheie cu dovezi simple: problema rezolvată, flow simplificat, decizie UX și mod de verificare live.', tag: 'UX proof' },
          { title: 'Portfolio content cleanup RO/EN', text: 'rafinez textele bilingve, titlurile, microcopy-ul și CTA-urile pentru un portofoliu mai coerent și mai profesional.', tag: 'Content' },
          { title: 'Recruiter / reviewer quick path', text: 'construiesc un traseu rapid pentru vizitatori: top 3 proiecte, proof-of-work, GitHub, live demos și contact vizibile în 30–60 secunde.', tag: 'Portfolio UX' }
        ];

    const done = currentLang() === 'en'
      ? [
          { title: 'CRM Galaxy 3D Ultimate', text: '15 CRM intelligence variants delivered: galaxy, analysis, pipeline, PRO, customer success, sales retention and executive report.', tag: 'Completed', href: 'projects/crm-galaxy-3d-ultimate-15.html', linkLabel: 'Open project' },
          { title: 'CRM Galaxy 3D README', text: 'portfolio-ready bilingual project positioning, features, business value and tags documented.', tag: 'Docs', href: 'projects/crm-galaxy-3d-ultimate-15.md', linkLabel: 'README' },
          { title: 'VELOCITYX V1', text: 'first live version marked as completed and ready for review.', tag: 'Completed', href: 'https://laurandreea10.github.io/VELOCITYX/', linkLabel: 'Open V1' },
          { title: 'VELOCITYX V2', text: 'second live version marked as completed, with the new iteration available separately.', tag: 'Completed', href: 'https://laurandreea10.github.io/VELOCITYX/v2.html', linkLabel: 'Open V2' },
          { title: 'Portfolio Now refresh', text: 'weekly work section updated with current priorities and clearer proof-of-work direction.', tag: '5 Jul' }
        ]
      : [
          { title: 'CRM Galaxy 3D Ultimate', text: 'au fost livrate toate cele 15 variante CRM intelligence: galaxie, analiză, pipeline, PRO, customer success, sales retention și raport executiv.', tag: 'Finalizat', href: 'projects/crm-galaxy-3d-ultimate-15.html', linkLabel: 'Deschide proiectul' },
          { title: 'CRM Galaxy 3D README', text: 'documentație de portofoliu cu poziționare bilingvă, features, business value și tag-uri.', tag: 'Docs', href: 'projects/crm-galaxy-3d-ultimate-15.md', linkLabel: 'README' },
          { title: 'VELOCITYX V1', text: 'prima versiune live este notată ca finalizată și gata de review.', tag: 'Finalizat', href: 'https://laurandreea10.github.io/VELOCITYX/', linkLabel: 'Deschide V1' },
          { title: 'VELOCITYX V2', text: 'a doua versiune live este notată ca finalizată, cu iterația nouă disponibilă separat.', tag: 'Finalizat', href: 'https://laurandreea10.github.io/VELOCITYX/v2.html', linkLabel: 'Deschide V2' },
          { title: 'Portfolio Now refresh', text: 'secțiunea săptămânală a fost actualizată cu prioritățile curente și direcție mai clară de proof-of-work.', tag: '5 Iul' }
        ];

    activeList.innerHTML = active.map(item => itemTemplate(item, false)).join('');
    doneList.innerHTML = done.map(item => itemTemplate(item, true)).join('');
    history.innerHTML = currentLang() === 'en'
      ? `
        <div class="now-history-week">
          <strong>July 2026</strong>
          <p>CRM Galaxy 3D Ultimate moved to completed and added to Proof of Work with a live project page and README.</p>
        </div>
        <div class="now-history-week">
          <strong>June 2026</strong>
          <p>VELOCITYX moved to completed: V1 and V2 are now linked as reviewable live versions.</p>
        </div>
        <div class="now-history-week">
          <strong>May–June 2026</strong>
          <p>Portfolio focus: stronger case studies, clearer bilingual content and faster reviewer navigation.</p>
        </div>
      `
      : `
        <div class="now-history-week">
          <strong>Iulie 2026</strong>
          <p>CRM Galaxy 3D Ultimate a fost mutat la finalizat și adăugat la Dovezi, cu pagină live și README.</p>
        </div>
        <div class="now-history-week">
          <strong>Iunie 2026</strong>
          <p>VELOCITYX a fost mutat la finalizat: V1 și V2 sunt acum legate ca versiuni live pentru review.</p>
        </div>
        <div class="now-history-week">
          <strong>Mai–Iunie 2026</strong>
          <p>Focus portofoliu: studii de caz mai vizuale, conținut bilingv mai clar și navigare rapidă pentru revieweri.</p>
        </div>
      `;
  }

  function applyPatchesRepeatedly() {
    lockCarouselToDarkPoster();
    overrideNowSection();
    injectCrmGalaxyCards();
    injectCrmGalaxyCarousel();
    window.setTimeout(() => { lockCarouselToDarkPoster(); overrideNowSection(); injectCrmGalaxyCards(); injectCrmGalaxyCarousel(); }, 50);
    window.setTimeout(() => { lockCarouselToDarkPoster(); overrideNowSection(); injectCrmGalaxyCards(); injectCrmGalaxyCarousel(); }, 200);
    window.setTimeout(() => { lockCarouselToDarkPoster(); overrideNowSection(); injectCrmGalaxyCards(); injectCrmGalaxyCarousel(); }, 700);
    window.setTimeout(() => { lockCarouselToDarkPoster(); overrideNowSection(); injectCrmGalaxyCards(); injectCrmGalaxyCarousel(); }, 1500);
  }

  function loadOriginalMain() {
    injectCarouselFixStyles();
    const script = document.createElement('script');
    script.src = ORIGINAL_MAIN;
    script.defer = true;
    script.onload = applyPatchesRepeatedly;
    script.onerror = () => {
      console.warn('Portfolio original main.js could not be loaded from snapshot. Applying local patches.');
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyPatchesRepeatedly, { once: true });
      } else {
        applyPatchesRepeatedly();
      }
    };
    document.head.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadOriginalMain, { once: true });
  } else {
    loadOriginalMain();
  }
})();
