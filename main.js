const libraryItems = [
  { title: "ClientFlow", desc: "Board SaaS / CRM pentru triere operațională, prioritizare vizuală și decizii rapide pe același ecran.", cats: ["utility", "crm", "saas", "ui"], href: "projects/clientflow.html", type: "Case study" },
  { title: "Alpis Impact Path", desc: "Wizard de onboarding în pași mici, cu progres vizibil și CTA-uri contextuale.", cats: ["ui", "challenge"], href: "projects/alpis-impactpath.html", type: "Case study" },
  { title: "Brief Studio", desc: "Dashboard bilingv pentru brief-uri și comunicare client, gândit ca demo SaaS / CRM.", cats: ["github", "crm", "saas", "ui"], href: "https://laurandreea10.github.io/brief-studio/index.html", type: "Live demo" },
  { title: "Alpis Fusion CRM Premium", desc: "Workspace unificat pentru lead-uri, task-uri și billing într-un singur dashboard.", cats: ["github", "crm", "saas", "ui"], href: "https://laurandreea10.github.io/Alpis-Fusion-CRM-premium/", type: "Live demo" },
  { title: "Excel-Quest", desc: "Produs educațional gamificat pentru învățarea Excel.", cats: ["github", "utility"], href: "https://laurandreea10.github.io/Excel-Quest/", type: "Live demo" }
];

const HERO_PREVIEW_SLIDES = [
  {
    title: 'Alpis Fusion CRM Premium',
    label: 'CRM premium',
    description: 'Colecție modulară pentru lead pipeline, task management, billing și automatizări.',
    meta: 'Vite + React · ~287KB build · Deploy automatizat',
    url: 'https://laurandreea10.github.io/Alpis-Fusion-CRM-premium/',
    codeUrl: 'https://github.com/LaurAndreea10/Alpis-Fusion-CRM-premium'
  },
  {
    title: 'Brief Studio',
    label: 'SaaS / CRM',
    description: 'Platformă SaaS bilingvă RO/EN pentru gestionarea brief-urilor și comunicarea cu clienții.',
    meta: 'HTML · CSS · JavaScript · GitHub Pages',
    url: 'https://laurandreea10.github.io/brief-studio/index.html',
    codeUrl: 'https://github.com/LaurAndreea10/brief-studio'
  },
  {
    title: 'ClientFlow SaaS CRM',
    label: 'SaaS CRM',
    description: 'Sistem CRM orientat pe task-uri, automatizări și acțiuni operaționale zilnice.',
    meta: 'Kanban + triage · Shortcuts · Prioritizare vizuală',
    url: 'https://laurandreea10.github.io/ClientFlow-SaaS-CRM-task-manager-automation-suite/',
    codeUrl: 'https://github.com/LaurAndreea10/ClientFlow-PRO'
  },
  {
    title: 'Link Video Editor Studio',
    label: 'Video studio',
    description: 'Studio pentru editare video orientat pe workflow clar, navigare rapidă și prezentare premium.',
    meta: 'HTML · CSS · JavaScript · GitHub Pages',
    url: 'https://laurandreea10.github.io/Link-Video-Editor-Studio/',
    codeUrl: 'https://github.com/LaurAndreea10/Link-Video-Editor-Studio'
  },
  {
    title: 'ARCADE-WORLD',
    label: 'Arcade',
    description: 'Experimente arcade cu interacțiuni rapide, feedback vizual și ritm progresiv.',
    meta: 'Vanilla JS · Game UI · GitHub Pages',
    url: 'https://laurandreea10.github.io/ARCADE-WORLD/',
    codeUrl: 'https://github.com/LaurAndreea10/ARCADE-WORLD'
  }
];

const translations = {
  ro: {
    hero_eyebrow: 'CRM • Marketing • Front-end autodidact',
    hero_title: 'Construiesc interfețe CRM și dashboard-uri care transformă procese complicate în fluxuri clare',
    hero_text: 'Vin din CRM și marketing, iar în front-end mă concentrez pe produse unde structura, prioritizarea și feedback-ul vizual ajută utilizatorii să înțeleagă mai repede ce au de făcut și să acționeze fără fricțiune.',
    hero_cta: 'Scrie-mi despre un proiect',
    preview_eyebrow: 'Preview live',
    preview_cta: 'Deschide proiectul'
  },
  en: {
    hero_eyebrow: 'CRM • Marketing • Self-taught front-end',
    hero_title: 'I build CRM interfaces and dashboards that turn complex processes into clear flows',
    hero_text: 'My background is in CRM and marketing, and in front-end I focus on products where structure, prioritization, and visual feedback help users understand faster what to do and act with less friction.',
    hero_cta: 'Write me about a project',
    preview_eyebrow: 'Live preview',
    preview_cta: 'Open project'
  }
};

let currentLang = localStorage.getItem('portfolio-lang') || 'ro';
if (!translations[currentLang]) currentLang = 'ro';
let activeFilter = 'all';
let keyCarouselIndex = 0;
let previewSlideIndex = 0;
let previewIntervalId;
const HERO_PREVIEW_AUTOPLAY_MS = 4500;

const dom = {};

function applyTranslations() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[currentLang][key]) el.textContent = translations[currentLang][key];
  });
  if (dom.langToggle) dom.langToggle.textContent = currentLang === 'ro' ? 'RO | EN' : 'EN | RO';
}

function createHeroPreviewSrcdoc(slide) {
  return `<!doctype html>
<html lang="${currentLang}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
body{margin:0;min-height:100vh;display:grid;place-items:center;padding:20px;font-family:Inter,Arial,sans-serif;background:radial-gradient(circle at 12% 15%, rgba(79,140,255,.24), transparent 45%),radial-gradient(circle at 88% 82%, rgba(139,92,246,.22), transparent 48%),#081326;color:#e8f0ff}
.card{width:min(640px,100%);border:1px solid rgba(255,255,255,.14);border-radius:16px;background:rgba(8,22,46,.86);padding:20px}
h1{margin:0 0 10px;font-size:1.3rem}p{margin:0 0 10px;color:#b8cae8;line-height:1.55}.meta{font-size:.85rem;color:#c9dcff;margin-bottom:14px}a{display:inline-flex;align-items:center;text-decoration:none;color:#051022;background:linear-gradient(135deg,#60a5fa,#a78bfa);border-radius:999px;padding:10px 16px;font-weight:700}
</style>
</head>
<body>
<article class="card">
<h1>${slide.title}</h1>
<p>${slide.description}</p>
<p class="meta">${slide.meta}</p>
<a href="${slide.url}" target="_blank" rel="noopener noreferrer">${currentLang === 'ro' ? 'Deschide proiectul complet' : 'Open full project'}</a>
</article>
</body>
</html>`;
}

function setHeroPreviewSlide(index) {
  previewSlideIndex = (index + HERO_PREVIEW_SLIDES.length) % HERO_PREVIEW_SLIDES.length;
  const slide = HERO_PREVIEW_SLIDES[previewSlideIndex];
  dom.heroPreviewTitle.textContent = slide.title;
  dom.heroPreviewOpen.href = slide.url;
  dom.heroPreviewOpenSecondary.href = slide.url;
  dom.heroPreviewHeading.textContent = slide.title;
  dom.heroPreviewMeta.textContent = slide.meta;
  dom.heroPreviewDescription.textContent = slide.description;
  dom.heroPreviewType.textContent = slide.label;
  dom.heroPreviewUrl.textContent = slide.url.replace(/^https?:\/\//, '');
  dom.heroPreviewUrl.href = slide.url;
  dom.heroPreviewCode.href = slide.codeUrl || slide.url;
  dom.heroPreviewFrame.srcdoc = createHeroPreviewSrcdoc(slide);
  [...dom.heroPreviewLinks.querySelectorAll('.chip')].forEach((chip, chipIndex) => {
    chip.classList.toggle('active', chipIndex === previewSlideIndex);
    chip.setAttribute('aria-pressed', String(chipIndex === previewSlideIndex));
  });
}

function renderHeroPreviewChips() {
  dom.heroPreviewLinks.innerHTML = '';
  HERO_PREVIEW_SLIDES.forEach((slide, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chip';
    button.textContent = slide.title;
    button.addEventListener('click', () => {
      setHeroPreviewSlide(index);
      restartHeroPreviewAutoplay();
    });
    dom.heroPreviewLinks.appendChild(button);
  });
}

function restartHeroPreviewAutoplay() {
  clearInterval(previewIntervalId);
  if (HERO_PREVIEW_SLIDES.length < 2) return;
  previewIntervalId = setInterval(() => setHeroPreviewSlide(previewSlideIndex + 1), HERO_PREVIEW_AUTOPLAY_MS);
}

function renderKeyCarouselDots(totalSlides) {
  dom.keyCarouselDots.innerHTML = '';
  for (let index = 0; index < totalSlides; index += 1) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'key-carousel-dot';
    dot.addEventListener('click', () => setKeyCarouselSlide(index));
    dom.keyCarouselDots.appendChild(dot);
  }
}

function setKeyCarouselSlide(index) {
  const cards = dom.keyProjectsGrid.querySelectorAll('.project-card');
  if (!cards.length) return;
  keyCarouselIndex = (index + cards.length) % cards.length;
  dom.keyProjectsGrid.style.transform = `translateX(-${keyCarouselIndex * 100}%)`;
  [...dom.keyCarouselDots.querySelectorAll('.key-carousel-dot')].forEach((dot, dotIndex) => {
    dot.classList.toggle('active', dotIndex === keyCarouselIndex);
  });
}

function setupKeyProjectsCarousel() {
  const cards = dom.keyProjectsGrid.querySelectorAll('.project-card');
  if (!cards.length) return;
  renderKeyCarouselDots(cards.length);
  setKeyCarouselSlide(0);
}

function cardTemplate(item) {
  return `
    <article class="project-card glass" data-category="${item.cats.join(' ')}">
      <div class="project-top">
        <div><h3>${item.title}</h3></div>
        <span class="tag">${item.type}</span>
      </div>
      <p class="project-desc">${item.desc}</p>
      <div class="project-meta-row">${item.cats.map(cat => `<span class="project-meta-tag">${cat}</span>`).join('')}</div>
      <div class="card-actions">
        <a class="btn btn-primary" href="${item.href}" target="${item.href.startsWith('http') ? '_blank' : '_self'}" rel="noopener noreferrer">Deschide</a>
      </div>
    </article>`;
}

function renderLibrary() {
  const q = (dom.searchInput.value || '').trim().toLowerCase();
  const filtered = libraryItems.filter(item => {
    const byFilter = activeFilter === 'all' || item.cats.includes(activeFilter);
    const hay = (item.title + ' ' + item.desc + ' ' + item.cats.join(' ')).toLowerCase();
    return byFilter && (!q || hay.includes(q));
  });
  dom.libraryGrid.innerHTML = filtered.map(cardTemplate).join('');
  dom.resultsCount.textContent = filtered.length;
}

function applyTheme(isLight) {
  document.body.classList.toggle('light', isLight);
  dom.themeToggle.textContent = document.body.classList.contains('light') ? '☀️ Light' : '🌙 Dark';
}

function init() {
  dom.searchInput = document.getElementById('searchInput');
  dom.libraryGrid = document.getElementById('libraryGrid');
  dom.resultsCount = document.getElementById('resultsCount');
  dom.themeToggle = document.getElementById('themeToggle');
  dom.langToggle = document.getElementById('langToggle');
  dom.heroPreviewLinks = document.getElementById('heroPreviewLinks');
  dom.heroPreviewTitle = document.getElementById('heroPreviewTitle');
  dom.heroPreviewOpen = document.getElementById('heroPreviewOpen');
  dom.heroPreviewOpenSecondary = document.getElementById('heroPreviewOpenSecondary');
  dom.heroPreviewHeading = document.getElementById('heroPreviewHeading');
  dom.heroPreviewMeta = document.getElementById('heroPreviewMeta');
  dom.heroPreviewDescription = document.getElementById('heroPreviewDescription');
  dom.heroPreviewType = document.getElementById('heroPreviewType');
  dom.heroPreviewUrl = document.getElementById('heroPreviewUrl');
  dom.heroPreviewCode = document.getElementById('heroPreviewCode');
  dom.heroPreviewFrame = document.getElementById('heroPreviewFrame');
  dom.keyProjectsGrid = document.getElementById('keyProjectsGrid');
  dom.keyCarouselPrev = document.getElementById('keyCarouselPrev');
  dom.keyCarouselNext = document.getElementById('keyCarouselNext');
  dom.keyCarouselDots = document.getElementById('keyCarouselDots');

  applyTranslations();
  renderHeroPreviewChips();
  setHeroPreviewSlide(0);
  restartHeroPreviewAutoplay();
  setupKeyProjectsCarousel();
  renderLibrary();

  document.querySelectorAll('#filterChips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      activeFilter = chip.dataset.filter;
      document.querySelectorAll('#filterChips .chip').forEach(c => {
        c.classList.toggle('active', c === chip);
        c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
      });
      renderLibrary();
    });
  });

  dom.searchInput.addEventListener('input', renderLibrary);
  dom.keyCarouselPrev.addEventListener('click', () => setKeyCarouselSlide(keyCarouselIndex - 1));
  dom.keyCarouselNext.addEventListener('click', () => setKeyCarouselSlide(keyCarouselIndex + 1));

  applyTheme(localStorage.getItem('portfolio-theme') === 'light');
  dom.themeToggle.addEventListener('click', () => {
    const nextLight = !document.body.classList.contains('light');
    applyTheme(nextLight);
    localStorage.setItem('portfolio-theme', nextLight ? 'light' : 'dark');
  });

  dom.langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'ro' ? 'en' : 'ro';
    localStorage.setItem('portfolio-lang', currentLang);
    applyTranslations();
    setHeroPreviewSlide(previewSlideIndex);
  });
}

document.addEventListener('DOMContentLoaded', init);
