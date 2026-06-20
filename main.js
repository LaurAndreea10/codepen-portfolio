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

  function ensureHeroPreviewFacade() {
    const frame = qs('#heroPreviewFrame');
    const wrap = qs('.hero-preview-wrap');
    const fallback = qs('#heroPreviewFallback');
    const hint = qs('#heroPreviewHint');
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

  function patchCarouselRepeatedly() {
    ensureHeroPreviewFacade();
    window.setTimeout(ensureHeroPreviewFacade, 100);
    window.setTimeout(ensureHeroPreviewFacade, 500);
    window.setTimeout(ensureHeroPreviewFacade, 1200);
  }

  function loadOriginalMain() {
    const script = document.createElement('script');
    script.src = ORIGINAL_MAIN;
    script.defer = true;
    script.onload = patchCarouselRepeatedly;
    script.onerror = () => {
      console.warn('Portfolio original main.js could not be loaded from snapshot. Applying carousel-only patch.');
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