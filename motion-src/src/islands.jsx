/*
 * React Bits islands — small React roots mounted into the static portfolio page.
 * Components from React Bits (https://reactbits.dev) by David Haz, MIT + Commons Clause,
 * see ./reactbits/LICENSE-react-bits.md. Used as part of this website, not redistributed.
 */
import { createRoot } from 'react-dom/client';
import { useEffect, useRef, useSyncExternalStore } from 'react';
import Particles from './reactbits/Particles.jsx';
import CountUp from './reactbits/CountUp.jsx';
import ScrollVelocity from './reactbits/ScrollVelocity.jsx';
import ShinyText from './reactbits/ShinyText.jsx';
import ClickSpark from './reactbits/ClickSpark.jsx';

/* Theme store: body.light / body.high-contrast are toggled by main-core.js. */
const readTheme = () => {
  const c = document.body.classList;
  return c.contains('high-contrast') ? 'contrast' : c.contains('light') ? 'light' : 'dark';
};
let theme = readTheme();
const listeners = new Set();
new MutationObserver(() => {
  const next = readTheme();
  if (next !== theme) {
    theme = next;
    listeners.forEach((fn) => fn());
  }
}).observe(document.body, { attributes: true, attributeFilter: ['class'] });
const useTheme = () =>
  useSyncExternalStore(
    (fn) => (listeners.add(fn), () => listeners.delete(fn)),
    () => theme
  );

const PALETTE = {
  dark: { particles: ['#5ee7ff', '#7aa2ff', '#f5b544'], shine: '#fff4d6', spark: ['#5ee7ff', '#f5b544'], band: 'rgba(157,176,212,.55)' },
  light: { particles: ['#0e7490', '#1d4ed8', '#b45309'], shine: '#3b2300', spark: ['#0e7490', '#b45309'], band: 'rgba(16,24,40,.45)' }
};

const isEn = (document.documentElement.lang || 'ro').toLowerCase().startsWith('en');

function mount(el, node) {
  el.dataset.reactBits = 'mounted';
  createRoot(el).render(node);
}

/* 1 · Particles behind the hero (WebGL, pauses off-screen / hidden tab). */
function HeroParticles() {
  const t = useTheme();
  if (t === 'contrast') return null;
  const p = PALETTE[t];
  const small = window.innerWidth < 760;
  return (
    <Particles
      particleCount={small ? 70 : 150}
      particleSpread={12}
      speed={0.06}
      particleColors={p.particles}
      particleBaseSize={small ? 70 : 90}
      sizeRandomness={0.9}
      alphaParticles
      moveParticlesOnHover
      particleHoverFactor={0.6}
      hoverEffect="parallax"
      clickBurst={false}
      glow={0.6}
      twinkle={0.45}
      cameraDistance={22}
      lightMode={t === 'light'}
      opacity={t === 'light' ? 0.55 : 0.8}
    />
  );
}

/* 2 · CountUp on the credibility numbers. */
function mountCounters() {
  const projectCount = window.PORTFOLIO_CONFIG?.projectCount;
  document.querySelectorAll('.cred-item > strong, .metric > strong').forEach((strong) => {
    if (strong.dataset.reactBits) return;
    const m = strong.textContent.trim().match(/^(\d{1,4})(\+?)$/);
    if (!m) return; // years ("2022 →") and labels stay as written
    let to = Number(m[1]);
    // The projects tile uses the canonical count from portfolio-config.js (the static HTML can lag behind).
    const label = strong.parentElement?.textContent || '';
    if (projectCount && /proiecte live|live projects/i.test(label)) to = projectCount;
    strong.textContent = '';
    mount(strong, <CountUp to={to} suffix={m[2]} duration={1.8} easing="expo" />);
  });
}

/* 3 · ShinyText on chapter kickers ("Capitolul 02"). */
function Kicker({ text, el }) {
  const t = useTheme();
  if (t === 'contrast') return text;
  const base = getComputedStyle(el).color; // follows the light/dark kicker colour from the site CSS
  return (
    <ShinyText
      text={text}
      color={base}
      shineColor={PALETTE[t].shine}
      speed={2.6}
      delay={3.5}
      shineWidth={36}
      trigger="loop"
    />
  );
}
function mountKickers() {
  document.querySelectorAll('.chapter-kicker').forEach((kicker) => {
    if (kicker.dataset.reactBits || kicker.children.length) return;
    const text = kicker.textContent.trim();
    if (!text) return;
    kicker.textContent = '';
    mount(kicker, <Kicker text={text} el={kicker} />);
  });
}

/* 4 · ScrollVelocity band — speed reacts to scroll (Lenis keeps window scroll native). */
function Band() {
  const t = useTheme();
  const color = t === 'contrast' ? '#ffffff' : PALETTE[t === 'light' ? 'light' : 'dark'].band;
  const texts = isEn
    ? ['CRM · Dashboards · Marketing-tech · RO / EN · Accessibility · ', 'React · Vite · TypeScript · GSAP · Lenis · React Bits · ']
    : ['CRM · Dashboard-uri · Marketing-tech · RO / EN · Accesibilitate · ', 'React · Vite · TypeScript · GSAP · Lenis · React Bits · '];
  return (
    <ScrollVelocity
      texts={texts}
      velocity={36}
      numCopies={6}
      damping={50}
      stiffness={400}
      parallaxClassName="rb-parallax"
      scrollerClassName="rb-scroller motion-band-row"
      fadeEdges
      outlineAlternate
      skewWithVelocity={4}
      color={color}
    />
  );
}
function mountBand() {
  if (document.querySelector('.motion-band')) return;
  const anchor = document.getElementById('ch-intro') || document.querySelector('main > :first-child');
  if (!anchor) return;
  const band = document.createElement('div');
  band.className = 'motion-band';
  band.setAttribute('aria-hidden', 'true');
  anchor.parentNode.insertBefore(band, anchor);
  mount(band, <Band />);
}

/* 5 · ClickSpark — one fixed overlay, fired imperatively on buttons and pills. */
function Sparks() {
  const t = useTheme();
  const ref = useRef(null);
  useEffect(() => {
    const onClick = (e) => {
      const hit = e.target instanceof Element && e.target.closest('.btn, .pill, .collection-tab, .now-tab, .snapshot-durations > *');
      if (!hit || !ref.current) return;
      if (e.detail === 0) {
        const r = hit.getBoundingClientRect(); // keyboard activation → burst from the centre
        ref.current.spark(r.left + r.width / 2, r.top + r.height / 2);
      } else {
        ref.current.spark(e.clientX, e.clientY);
      }
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
  if (t === 'contrast') return null;
  return (
    <ClickSpark
      ref={ref}
      sparkColor={PALETTE[t].spark}
      sparkSize={10}
      sparkRadius={22}
      sparkCount={9}
      duration={480}
      glow={t === 'dark' ? 0.6 : 0}
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999 }}
    />
  );
}

export function mountIslands({ reduced, saveData }) {
  if (!reduced) mountCounters(); // reduced motion keeps the static numbers
  mountKickers();
  mountBand();

  if (!reduced) {
    const spark = document.createElement('div');
    spark.className = 'motion-spark-layer';
    spark.setAttribute('aria-hidden', 'true');
    document.body.appendChild(spark);
    mount(spark, <Sparks />);
  }

  const hero = document.querySelector('header.hero');
  if (hero && !reduced && !saveData && !hero.querySelector('.motion-hero-bg')) {
    const bg = document.createElement('div');
    bg.className = 'motion-hero-bg';
    bg.setAttribute('aria-hidden', 'true');
    hero.prepend(bg);
    hero.classList.add('has-motion-bg');
    mount(bg, <HeroParticles />);
  }

  document.documentElement.classList.add('react-bits-ready');
}
