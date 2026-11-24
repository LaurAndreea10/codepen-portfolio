/*!
 * Portfolio motion layer — Laura Andreea
 * GSAP (ScrollTrigger + SplitText) + Lenis smooth scroll; React Bits islands load at idle time.
 * Respects prefers-reduced-motion, high contrast, print and keyboard navigation.
 */
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import './styles.css';

gsap.registerPlugin(ScrollTrigger, SplitText);

const doc = document.documentElement;
const body = document.body;
const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
const mqFine = window.matchMedia('(hover: hover) and (pointer: fine)');
const saveData = navigator.connection?.saveData === true;
const reduced = () => mqReduce.matches;

doc.classList.add('motion-ready');

/* ───────────── Lenis smooth scroll ───────────── */

// Scrollable overlays keep their own native scroll.
const PREVENT_SEL = [
  '[data-lenis-prevent]',
  '[role="dialog"]',
  '.plus-pal-list',
  '.nav-more-panel',
  '.nowbar-panel',
  '.scan-panel',
  'iframe',
  'textarea',
  'select'
].join(',');

let lenis = null;

function startLenis() {
  if (lenis || reduced()) return;
  lenis = new Lenis({
    autoRaf: false,
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: false, // touch devices keep native momentum scroll
    prevent: (node) => node instanceof Element && !!node.closest(PREVENT_SEL)
  });
  lenis.on('scroll', ScrollTrigger.update);
  window.portfolioLenis = lenis;
  syncLenisLock();
}

function stopLenis() {
  if (!lenis) return;
  lenis.destroy();
  lenis = null;
  window.portfolioLenis = null;
}

gsap.ticker.add((time) => lenis?.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// Pause smooth scroll while a modal dialog (command palette, 30s summary…) is open.
function modalOpen() {
  return [...document.querySelectorAll('[aria-modal="true"]')].some(
    (el) => !el.closest('[hidden]') && el.getClientRects().length > 0
  );
}
function syncLenisLock() {
  if (!lenis) return;
  const locked = modalOpen() || getComputedStyle(body).overflow === 'hidden';
  locked ? lenis.stop() : lenis.start();
}
new MutationObserver(() => requestAnimationFrame(syncLenisLock)).observe(body, {
  subtree: true,
  attributes: true,
  attributeFilter: ['hidden', 'class', 'style', 'aria-modal']
});

// Same-page anchors: smooth Lenis scroll, keep the hash contract other scripts rely on, move focus.
function scrollToTarget(target, { focus = true } = {}) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.1 }); // Lenis already honours scroll-margin-top
  } else {
    target.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
  }
  if (focus) {
    const focusable = target.matches('a,button,input,select,textarea,[tabindex]')
      ? target
      : target.querySelector('h1,h2') || target;
    if (!focusable.hasAttribute('tabindex') && !focusable.matches('a,button,input,select,textarea')) {
      focusable.setAttribute('tabindex', '-1');
    }
    focusable.focus({ preventScroll: true });
  }
}

window.addEventListener('click', (event) => {
  if (!lenis || event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target instanceof Element && event.target.closest('a[href]');
  if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin || url.pathname !== location.pathname) return;
  if (!url.hash || url.hash === '#') return;
  const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
  if (!target) return;
  event.preventDefault();
  if (location.hash !== url.hash) {
    // Chapter tabs reveal hidden collections on hashchange, so fire it before measuring.
    history.pushState(null, '', url.hash);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  }
  requestAnimationFrame(() => scrollToTarget(target));
});

mqReduce.addEventListener?.('change', () => {
  if (reduced()) {
    stopLenis();
    revealAll();
  } else {
    startLenis();
  }
});

startLenis();

/* ───────────── GSAP: scroll progress ───────────── */

const progress = document.createElement('div');
progress.className = 'motion-progress';
progress.setAttribute('aria-hidden', 'true');
body.appendChild(progress);
gsap.set(progress, { scaleX: 0 });
ScrollTrigger.create({
  start: 0,
  end: 'max',
  onUpdate: (self) => gsap.set(progress, { scaleX: self.progress })
});

/* ───────────── GSAP: reveals ───────────── */

const hidden = new Set();

function revealAll() {
  hidden.forEach((el) => gsap.set(el, { clearProps: 'opacity,transform,visibility' }));
  hidden.clear();
  document.querySelectorAll('.motion-split-pending').forEach((el) => el.classList.remove('motion-split-pending'));
}

const measurable = (el) => el.getClientRects().length > 0 && !el.closest('[hidden], details:not([open])');

if (!reduced()) {
  // Hero copy: gentle stagger in. The h1 stays untouched so LCP is not delayed.
  const heroBits = gsap.utils.toArray('.hero-main > :not(h1)');
  if (heroBits.length) {
    gsap.from(heroBits, {
      y: 18,
      autoAlpha: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out',
      delay: 0.05,
      clearProps: 'transform,opacity,visibility'
    });
  }

  // Chapter heads: outlined number slides in + parallax, title words rise through a line mask.
  // SplitText + ScrollTrigger measure layout, so the heads are set up in short chunks that yield
  // to the main thread (no single long task while the page is still loading → lower TBT).
  const setupHead = (head) => {
    if (!measurable(head)) return;
    const num = head.querySelector('.chapter-num');
    const title = head.querySelector('.chapter-title');
    const lede = head.querySelector('.chapter-lede');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: head, start: 'top 86%', once: true }
    });

    if (num) {
      tl.from(num, { xPercent: -24, autoAlpha: 0, duration: 1, ease: 'power3.out' }, 0);
      gsap.to(num, {
        yPercent: -22,
        ease: 'none',
        scrollTrigger: { trigger: head, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }

    if (title) {
      const split = SplitText.create(title, {
        type: 'lines,words',
        mask: 'lines',
        aria: 'auto',
        linesClass: 'motion-line',
        wordsClass: 'motion-word'
      });
      tl.from(split.words, { yPercent: 115, duration: 0.95, stagger: 0.045, ease: 'expo.out' }, 0.06);
      // Restore the original markup once played, so resizing never re-wraps split lines.
      tl.eventCallback('onComplete', () => split.revert());
    }

    if (lede) {
      tl.from(lede, { y: 14, autoAlpha: 0, duration: 0.7, ease: 'power2.out', clearProps: 'transform,opacity,visibility' }, 0.28);
    }
  };
  const heads = gsap.utils.toArray('.chapter-head');
  let headIndex = 0;
  const setupHeadsChunk = () => {
    const t0 = performance.now();
    while (headIndex < heads.length && performance.now() - t0 < 8) setupHead(heads[headIndex++]);
    if (headIndex < heads.length) setTimeout(setupHeadsChunk, 0);
    else ScrollTrigger.refresh();
  };
  setTimeout(setupHeadsChunk, 0);

  // Cards: batched fade-up. Positions come from IntersectionObserver (asynchronous, no forced
  // layout at startup). Its first report per card decides: below the fold → pre-hidden and
  // revealed on entry; visible, above, or in a hidden tab (zero size) → left untouched.
  const CARD_SEL = [
    '.cred-item',
    '.project-card',
    '.pow-card',
    '.plus-card',
    '.grid > .card'
  ].join(',');
  const seenCards = new WeakSet();
  const io = new IntersectionObserver(
    (entries) => {
      const batch = [];
      for (const entry of entries) {
        const el = entry.target;
        if (!seenCards.has(el)) {
          seenCards.add(el);
          const r = entry.boundingClientRect;
          if (entry.isIntersecting || r.height === 0 || r.top < window.innerHeight) {
            io.unobserve(el);
          } else {
            hidden.add(el);
            gsap.set(el, { autoAlpha: 0, y: 28 });
          }
          continue;
        }
        if (entry.isIntersecting) {
          // Cards clipped sideways in a horizontal row never intersect: reveal the row together.
          const row = el.parentElement ? [...el.parentElement.children].filter((c) => hidden.has(c)) : [];
          for (const c of new Set([el, ...row])) {
            io.unobserve(c);
            hidden.delete(c);
            batch.push(c);
          }
        }
      }
      if (batch.length) {
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power3.out',
          overwrite: true,
          clearProps: 'transform,opacity,visibility'
        });
      }
    },
    { rootMargin: '0px 0px -8% 0px' }
  );
  document.querySelectorAll(CARD_SEL).forEach((el) => io.observe(el));

  // Keyboard users never land on an invisible element.
  document.addEventListener('focusin', (event) => {
    if (!hidden.size || !(event.target instanceof Element)) return;
    hidden.forEach((el) => {
      if (el.contains(event.target)) {
        hidden.delete(el);
        gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.3, clearProps: 'transform,opacity,visibility' });
      }
    });
  });

  // Magnetic primary buttons (desktop pointers only).
  if (mqFine.matches) {
    gsap.utils.toArray('.hero-actions .btn, .btn-primary').forEach((btn) => {
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.22);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.32);
      });
      btn.addEventListener('pointerleave', () => {
        xTo(0);
        yTo(0);
      });
    });
  }
}

// Printing or saving as PDF always shows everything.
window.addEventListener('beforeprint', revealAll);

// Layout changes (collection tabs, Now panel, images, fonts) → recompute trigger positions.
let refreshTimer = 0;
new ResizeObserver(() => {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
}).observe(document.querySelector('main') || body);
window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });

/* ───────────── React Bits islands (idle time) ───────────── */

const idle = (cb) =>
  'requestIdleCallback' in window ? requestIdleCallback(cb, { timeout: 2500 }) : setTimeout(cb, 600);

const loadIslands = () =>
  import('./islands.jsx')
    .then((m) => m.mountIslands({ reduced: reduced(), saveData }))
    .catch((err) => console.warn('[motion] React Bits islands skipped:', err));

// Touch-only devices (phones, tablets) wait for the first touch, scroll or key press: React,
// the WebGL particles and the band cost ~300 ms of main-thread time that a slow phone would
// otherwise pay while the page is still loading. Mouse devices keep the idle-time load.
if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
  const events = ['pointerdown', 'touchstart', 'keydown', 'scroll', 'wheel'];
  const go = () => { events.forEach((e) => window.removeEventListener(e, go, true)); loadIslands(); };
  events.forEach((e) => window.addEventListener(e, go, { capture: true, passive: true }));
} else {
  idle(loadIslands);
}
