(() => {
  'use strict';

  const ORIGINAL_MAIN = 'https://cdn.jsdelivr.net/gh/LaurAndreea10/codepen-portfolio@32d68e9388727fd0052b50b1c09b78da26dbf812/main.js';

  function qs(selector, root = document) {
    return root.querySelector(selector);
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function currentLang() {
    return document.documentElement.lang === 'en' ? 'en' : 'ro';
  }

  function getActivePreviewUrl() {
    const liveButton = qs('#heroPreviewCode');
    const secondaryButton = qs('#heroPreviewOpenSecondary');
    const url = liveButton && liveButton.href ? liveButton.href : secondaryButton && secondaryButton.href ? secondaryButton.href : '';
    return url && /^https?:\/\//.test(url) ? url : '';
  }

  function setFallbackState(showFallback) {
    const frame = qs('#heroPreviewFrame');
    const fallback = qs('#heroPreviewFallback');
    const hint = qs('#heroPreviewHint');
    if (fallback) fallback.style.opacity = showFallback ? '1' : '0';
    if (hint) {
      hint.style.opacity = showFallback ? '1' : '0';
      hint.textContent = currentLang() === 'en'
        ? 'Click the preview to load the live project.'
        : 'Click pe preview pentru a încărca proiectul live.';
    }
    if (frame) frame.style.opacity = showFallback ? '0' : '1';
  }

  function injectCarouselFixStyles() {
    if (qs('#carousel-white-fix')) return;
    const style = document.createElement('style');
    style.id = 'carousel-white-fix';
    style.textContent = `
      .hero-preview,
      .hero-preview-wrap {
        background:
          radial-gradient(circle at 25% 10%, rgba(79,140,255,.18), transparent 34%),
          radial-gradient(circle at 85% 90%, rgba(139,92,246,.16), transparent 34%),
          linear-gradient(135deg, rgba(7,18,38,.98), rgba(5,10,22,.98)) !important;
      }
      .hero-preview-wrap {
        position: relative;
        overflow: hidden;
        min-height: 430px;
      }
      .hero-preview-frame,
      iframe.hero-preview-frame {
        background: #071226 !important;
        color-scheme: dark;
      }
      .hero-preview-fallback {
        background: #071226 !important;
        object-fit: cover;
      }
      .hero-preview-stage {
        background: linear-gradient(180deg, rgba(7,18,38,.88), rgba(5,10,22,.94)) !important;
        border-top: 1px solid rgba(255,255,255,.08);
      }
      body.light .hero-preview,
      body.light .hero-preview-wrap {
        background:
          radial-gradient(circle at 25% 10%, rgba(79,140,255,.14), transparent 34%),
          radial-gradient(circle at 85% 90%, rgba(139,92,246,.12), transparent 34%),
          linear-gradient(135deg, #edf3fb, #f8fbff) !important;
      }
      body.light .hero-preview-frame,
      body.light iframe.hero-preview-frame,
      body.light .hero-preview-fallback {
        background: #edf3fb !important;
      }
    `;
    document.head.appendChild(style);
  }

  function ensureHeroPreviewFacade() {
    const frame = qs('#heroPreviewFrame');
    const wrap = qs('.hero-preview-wrap');
    const fallback = qs('#heroPreviewFallback');
    const hint = qs('#heroPreviewHint');
    injectCarouselFixStyles();
    if (!frame || !wrap || wrap.dataset.carouselFixed === '1') return;

    wrap.dataset.carouselFixed = '1';
    wrap.setAttribute('role', 'button');
    wrap.setAttribute('tabindex', '0');
    wrap.setAttribute('aria-label', currentLang() === 'en' ? 'Load live project preview' : 'Încarcă preview-ul live al proiectului');

    // IMPORTANT: index.html had inline display:none for the iframe.
    // The original carousel only toggles opacity, so the iframe could remain invisible.
    frame.removeAttribute('style');
    frame.style.display = 'block';
    frame.style.opacity = '0';
    frame.style.pointerEvents = 'none';
    frame.style.background = '#071226';
    frame.loading = 'lazy';

    if (fallback) fallback.style.opacity = '1';
    if (hint) {
      hint.style.opacity = '1';
      hint.textContent = currentLang() === 'en'
        ? 'Click the preview to load the live project.'
        : 'Click pe preview pentru a încărca proiectul live.';
    }

    let activated = false;

    function activatePreview() {
      const url = getActivePreviewUrl();
      if (!url) return;
      activated = true;
      frame.style.pointerEvents = 'auto';
      if (frame.src !== url) frame.src = url;
      setFallbackState(false);
    }

    function resetForSlideChange() {
      if (!activated) {
        frame.removeAttribute('src');
        frame.style.pointerEvents = 'none';
        setFallbackState(true);
        return;
      }
      const url = getActivePreviewUrl();
      if (url && frame.src !== url) {
        setFallbackState(true);
        frame.src = url;
      }
    }

    frame.addEventListener('load', () => {
      if (activated) setFallbackState(false);
    });
    frame.addEventListener('error', () => setFallbackState(true));

    wrap.addEventListener('click', (event) => {
      if (event.target.closest('a, button')) return;
      activatePreview();
    });

    wrap.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activatePreview();
      }
    });

    // Când caruselul schimbă slide-ul, originalul modifică linkurile/chipurile.
    // Observăm acele schimbări și sincronizăm iframe-ul fără să rupem autoplay-ul.
    const observed = [qs('#heroPreviewTitle'), qs('#heroPreviewCode'), qs('#heroPreviewOpenSecondary'), qs('#heroPreviewLinks')].filter(Boolean);
    const observer = new MutationObserver(() => window.requestAnimationFrame(resetForSlideChange));
    observed.forEach(node => observer.observe(node, { childList: true, subtree: true, attributes: true, attributeFilter: ['href', 'class', 'aria-pressed'] }));

    // Curățăm orice src setat de scriptul original la inițializare, ca LCP să rămână pe poster.
    window.requestAnimationFrame(() => {
      if (!activated) {
        frame.removeAttribute('src');
        setFallbackState(true);
      }
    });
  }

  function itemTemplate(item, done) {
    const link = item.href
      ? ` <a class="now-item-link" href="${item.href}" target="_blank" rel="noopener noreferrer">${item.linkLabel || 'Live'}</a>`
      : '';
    const extra = item.href2
      ? ` <a class="now-item-link now-link-action" href="${item.href2}" target="_blank" rel="noopener noreferrer">${item.linkLabel2 || 'V2'}</a>`
      : '';
    const tagClass = done ? 'now-tag now-tag-done' : 'now-tag';
    return `
      <li class="now-item${done ? ' now-item-done' : ''}">
        <span class="now-status" aria-hidden="true">${done ? '✅' : '🔄'}</span>
        <span><strong>${item.title}</strong>${link}${extra} — ${item.text}<span class="${tagClass}">${item.tag}</span></span>
      </li>
    `;
  }

  function overrideNowSection() {
    const date = qs('#now-datetime');
    const activeList = qs('#now-panel-active .now-checklist');
    const doneList = qs('#now-panel-done .now-checklist');
    const history = qs('#now-panel-history .now-history');
    if (!date || !activeList || !doneList || !history) return;

    date.dateTime = '2026-06-21';
    date.textContent = currentLang() === 'en' ? '21 June 2026' : '21 Iunie 2026';

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
          { title: 'VELOCITYX V1', text: 'first live version marked as completed and ready for review.', tag: 'Completed', href: 'https://laurandreea10.github.io/VELOCITYX/', linkLabel: 'Open V1' },
          { title: 'VELOCITYX V2', text: 'second live version marked as completed, with the new iteration available separately.', tag: 'Completed', href: 'https://laurandreea10.github.io/VELOCITYX/v2.html', linkLabel: 'Open V2' },
          { title: 'Portfolio Now refresh', text: 'weekly work section updated with current priorities and clearer proof-of-work direction.', tag: '21 Jun' }
        ]
      : [
          { title: 'VELOCITYX V1', text: 'prima versiune live este notată ca finalizată și gata de review.', tag: 'Finalizat', href: 'https://laurandreea10.github.io/VELOCITYX/', linkLabel: 'Deschide V1' },
          { title: 'VELOCITYX V2', text: 'a doua versiune live este notată ca finalizată, cu iterația nouă disponibilă separat.', tag: 'Finalizat', href: 'https://laurandreea10.github.io/VELOCITYX/v2.html', linkLabel: 'Deschide V2' },
          { title: 'Portfolio Now refresh', text: 'secțiunea săptămânală a fost actualizată cu prioritățile curente și direcție mai clară de proof-of-work.', tag: '21 Iun' }
        ];

    activeList.innerHTML = active.map(item => itemTemplate(item, false)).join('');
    doneList.innerHTML = done.map(item => itemTemplate(item, true)).join('');
    history.innerHTML = currentLang() === 'en'
      ? `
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
          <strong>Iunie 2026</strong>
          <p>VELOCITYX a fost mutat la finalizat: V1 și V2 sunt acum legate ca versiuni live pentru review.</p>
        </div>
        <div class="now-history-week">
          <strong>Mai–Iunie 2026</strong>
          <p>Focus portofoliu: studii de caz mai vizuale, conținut bilingv mai clar și navigare rapidă pentru revieweri.</p>
        </div>
      `;
  }

  function patchCarouselRepeatedly() {
    ensureHeroPreviewFacade();
    overrideNowSection();
    window.setTimeout(() => { ensureHeroPreviewFacade(); overrideNowSection(); }, 100);
    window.setTimeout(() => { ensureHeroPreviewFacade(); overrideNowSection(); }, 500);
    window.setTimeout(() => { ensureHeroPreviewFacade(); overrideNowSection(); }, 1200);
  }

  function loadOriginalMain() {
    const script = document.createElement('script');
    script.src = ORIGINAL_MAIN;
    script.defer = true;
    script.onload = patchCarouselRepeatedly;
    script.onerror = () => {
      console.warn('Portfolio original main.js could not be loaded from snapshot. Applying local patches.');
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', patchCarouselRepeatedly, { once: true });
      } else {
        patchCarouselRepeatedly();
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