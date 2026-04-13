/**
 * Laura Andreea | CodePen Portfolio — main.js
 * Loads projects from projects.json (no more hard-coded data in HTML)
 */

const HUB_URL = 'https://es-d-6681629020260406-019d2b3a-2991-75d3-9c59-15de01ca8079.codepen.dev/#projects';

/* ============================================================
   i18n translations
   ============================================================ */
const translations = {
  ro: {
    brand: 'Portofoliu CodePen', nav_about: 'Despre', nav_preview: 'Preview',
    nav_projects: 'Proiecte', nav_contact: 'Contact',
    hero_eyebrow: 'CRM • Marketing • Front-end autodidact',
    hero_title: 'Construiesc experiențe digitale clare, interactive și gândite din perspectiva utilizatorului',
    hero_text: 'Am peste 5 ani de experiență în CRM și Marketing, iar în paralel explorez front-end development din pasiune și disciplină. Portofoliul meu reunește aplicații utile, mini jocuri și interfețe interactive construite pentru a demonstra logică, structură, feedback și decizii UI/UX, nu doar estetică.',
    hero_cta_1: 'Vezi proiectele', hero_cta_2: 'Despre mine', hero_cta_3: 'Deschide hub-ul complet',
    stat_projects: 'Proiecte live', stat_projects_text: 'Experimente și demo-uri publicate pe CodePen',
    stat_preview: 'Preview activ', stat_preview_text: 'Poți schimba proiectul afișat direct din carduri',
    stat_experience: 'Background', stat_experience_text: 'Relații cu clienții, retenție, campanii și gândire orientată pe utilizator',
    stat_focus: 'Focus', stat_focus_text: 'Interfețe interactive, flow-uri utile, mini-jocuri și prototipuri front-end',
    featured_eyebrow: 'Featured', featured_title: 'Selecție recomandată',
    recent_eyebrow: 'Proiecte recente', recent_title: 'Cele mai noi proiecte adăugate',
    about_eyebrow: 'Despre mine', about_title: 'Combin experiența din CRM și Marketing cu explorarea front-end pentru a construi produse mai clare și mai umane',
    about_text_1: 'Cu peste 5 ani de experiență în CRM și Marketing, am lucrat cu baze de date, campanii, retenție, comunicare și optimizarea relației cu potențialii clienți. Asta mi-a format o gândire orientată spre utilizator, structură și rezultate reale.',
    about_text_2: 'În paralel, din pasiune și dorința de a învăța continuu, dezvolt proiecte personale în HTML, CSS și JavaScript. Construiesc mini jocuri, interfețe interactive și pagini moderne în care mă interesează nu doar cum arată produsul, ci și cum se simte, cum reacționează și cât de clar își transmite scopul.',
    preview_eyebrow: 'Preview live', preview_open: 'Deschide proiectul', preview_hub: 'Vezi hub-ul complet',
    preview_note: 'Preview-ul este generat local în portofoliu ca să fie afișat mereu, inclusiv pentru proiectele care blochează iframe extern.',
    preview_fallback_label: 'Preview local',
    projects_eyebrow: 'Proiecte', projects_title: 'Explorează colecția de proiecte', projects_results: 'rezultate afișate',
    filter_all: 'Toate',
    main_projects_eyebrow: 'Top Projects', main_projects_title: 'Proiecte care arată cel mai clar cum transform o problemă într-o soluție digitală cu logică, structură și experiență bună',
    experiments_eyebrow: 'Other experiments', experiments_title: 'Explorări UI, mini concepte și prototipuri vizuale',
    experiments_text: 'Această secțiune include experimente UI, mini jocuri și explorări vizuale construite pentru a testa interacțiuni, layout-uri, feedback vizual și idei de prototipare rapidă.',
    challenges_eyebrow: 'Challenges', challenges_title: 'Provocări și exerciții logice',
    empty_state: 'Nu am găsit proiecte pentru filtrul sau căutarea curentă.',
    contact_eyebrow: 'Contact', contact_title: 'Lasă-mi o sugestie',
    contact_text: 'Lasă-mi o sugestie despre ce ai vrea să mai adaug în portofoliu',
    contact_email: 'Email', contact_hub: 'Hub complet',
    footer_text: 'Creat pentru prezentarea proiectelor CodePen • Responsive • Dark/Light • Live Preview',
    search_placeholder: 'Caută după nume, tag sau descriere...', search_label: 'Caută proiecte după nume, tag sau descriere',
    search_help: 'Scrie pentru a filtra proiectele afișate.',
    preview_live: 'Preview live', open_new_tab: 'Open tab nou',
    theme_dark: '🌙 Dark', theme_light: '☀️ Light', learn_title: 'Problemă + soluție + decizii'
  },
  en: {
    brand: 'CodePen Portfolio', nav_about: 'About', nav_preview: 'Preview',
    nav_projects: 'Projects', nav_contact: 'Contact',
    hero_eyebrow: 'CRM • Marketing • Self-taught front-end',
    hero_title: 'I build clear, interactive digital experiences shaped by user perspective',
    hero_text: 'I have 5+ years of experience in CRM and Marketing, and in parallel I explore front-end development through passion and discipline. My portfolio brings together useful apps, mini games and interactive interfaces built to show logic, structure, feedback and UI/UX decisions, not just aesthetics.',
    hero_cta_1: 'View projects', hero_cta_2: 'About me', hero_cta_3: 'Open full hub',
    stat_projects: 'Live projects', stat_projects_text: 'Experiments and demos published on CodePen',
    stat_preview: 'Active preview', stat_preview_text: 'You can switch the shown project directly from the cards',
    stat_experience: 'Background', stat_experience_text: 'Customer relationships, retention, campaigns and user-focused thinking',
    stat_focus: 'Focus', stat_focus_text: 'Interactive interfaces, useful flows, mini-games and front-end prototypes',
    featured_eyebrow: 'Featured', featured_title: 'Recommended selection',
    recent_eyebrow: 'Recent projects', recent_title: 'Newest added projects',
    about_eyebrow: 'About me', about_title: 'I combine CRM and Marketing experience with front-end exploration to build clearer, more human digital products',
    about_text_1: 'With 5+ years of experience in CRM and Marketing, I have worked with databases, campaigns, retention, communication and optimizing the relationship with potential clients. That shaped a mindset focused on users, structure and real results.',
    about_text_2: 'At the same time, through curiosity and continuous learning, I build personal projects in HTML, CSS and JavaScript. I create mini games, interactive interfaces and modern pages where I care not only about how the product looks, but also how it feels, how it reacts and how clearly it communicates its purpose.',
    preview_eyebrow: 'Live preview', preview_open: 'Open project', preview_hub: 'View full hub',
    preview_note: 'The preview is generated locally inside the portfolio so it always shows, including projects that block external iframe embedding.',
    preview_fallback_label: 'Local preview',
    projects_eyebrow: 'Projects', projects_title: 'Explore the project collection', projects_results: 'results shown',
    filter_all: 'All',
    main_projects_eyebrow: 'Top Projects', main_projects_title: 'Projects that best show how I turn a problem into a digital solution through logic, structure and strong UX',
    experiments_eyebrow: 'Other experiments', experiments_title: 'UI explorations, mini concepts and visual prototypes',
    experiments_text: 'This section includes UI experiments, mini games and visual explorations built to test interactions, layouts, visual feedback and rapid prototyping ideas.',
    challenges_eyebrow: 'Challenges', challenges_title: 'Logic challenges and coding exercises',
    empty_state: 'No projects found for the current search or filter.',
    contact_eyebrow: 'Contact', contact_title: 'Leave me a suggestion',
    contact_text: "Leave me a suggestion about what you'd like me to add next to the portfolio",
    contact_email: 'Email', contact_hub: 'Full hub',
    footer_text: 'Built to showcase your CodePen projects • Responsive • Dark/Light • Live Preview',
    search_placeholder: 'Search by name, tag or description...', search_label: 'Search projects by name, tag or description',
    search_help: 'Type to filter the displayed projects.',
    preview_live: 'Live preview', open_new_tab: 'Open in new tab',
    theme_dark: '🌙 Dark', theme_light: '☀️ Light', learn_title: 'Problem + solution + decisions'
  }
};

/* ============================================================
   State
   ============================================================ */
let projects = [];
let currentLang = localStorage.getItem('portfolio-lang') || 'ro';
if (!translations[currentLang]) currentLang = 'ro';
let activeFilter = 'all';
let activePreview = null;
const RECENT_COUNT = 3;
const SELECTED_WORK_IDS = [1, 3, 13, 18, 19, 29, 34, 39, 41, 42, 43, 44, 45];

/* ============================================================
   Helpers
   ============================================================ */
function t(key) { return translations[currentLang][key] || key; }

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function updateMetaForLanguage() {
  document.documentElement.lang = currentLang;
  const titleMap = { ro: 'Laura Andreea | CodePen Portfolio', en: 'Laura Andreea | CodePen Portfolio' };
  const descMap = {
    ro: 'Portofoliu front-end Laura Andreea: aplicații interactive, mini jocuri, experimente UI și studii de caz scurte, cu preview live și structură clară.',
    en: 'Laura Andreea front-end portfolio: interactive apps, mini games, UI experiments and short case studies with live preview.'
  };
  const ogLocaleMap = { ro: 'ro_RO', en: 'en_US' };
  document.title = titleMap[currentLang];
  document.querySelector('meta[name="description"]').setAttribute('content', descMap[currentLang]);
  document.querySelector('meta[property="og:title"]').setAttribute('content', titleMap[currentLang]);
  document.querySelector('meta[property="og:description"]').setAttribute('content', descMap[currentLang]);
  document.querySelector('meta[property="og:locale"]').setAttribute('content', ogLocaleMap[currentLang]);
  document.querySelector('meta[name="twitter:title"]').setAttribute('content', titleMap[currentLang]);
  document.querySelector('meta[name="twitter:description"]').setAttribute('content', descMap[currentLang]);
}

/* ============================================================
   Preview iframe (local fallback)
   ============================================================ */
function buildPreviewCard(project) {
  const thumbBg = project.thumbBg || 'linear-gradient(135deg, rgba(79,140,255,.18), rgba(139,92,246,.12))';
  const thumbColor = project.thumbColor || '#ffffff';
  const thumbLang = project.thumbLang || 'EN';
  const thumbTitle = project.thumbTitle || project.title[currentLang];
  const thumbSubtitle = project.thumbSubtitle || project.category;
  const learned = (project.learned && project.learned[currentLang]) || [
    currentLang === 'ro'
      ? 'Problemă: am urmărit să construiesc o interfață clară și ușor de explorat.'
      : 'Problem: I wanted to build an interface that feels clear and easy to explore.',
    currentLang === 'ro'
      ? 'Soluție: am organizat conținutul astfel încât acțiunile principale să fie rapid de înțeles.'
      : 'Solution: I organized the content so the main actions are easy to understand.',
    currentLang === 'ro'
      ? 'Provocare: să păstrez un echilibru bun între prezentare vizuală, claritate și experiență responsive.'
      : 'Challenge: keeping a good balance between visual presentation, clarity and responsive experience.'
  ];

  return `<!DOCTYPE html><html lang="${currentLang}"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><style>*{box-sizing:border-box}html,body{height:100%}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;font-family:Inter,system-ui,-apple-system,sans-serif;background:radial-gradient(circle at top left,rgba(79,140,255,.18),transparent 28%),radial-gradient(circle at bottom right,rgba(139,92,246,.16),transparent 24%),linear-gradient(180deg,#0b1730,#071226);color:#eef4ff}.box{width:min(100%,820px);border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);border-radius:24px;padding:24px;box-shadow:0 20px 50px rgba(0,0,0,.35)}.top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:18px}.label{display:inline-flex;align-items:center;justify-content:center;padding:8px 12px;border-radius:999px;font-size:.78rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#8fb6ff;background:rgba(79,140,255,.12);border:1px solid rgba(79,140,255,.24)}.cat{display:inline-flex;align-items:center;justify-content:center;padding:8px 12px;border-radius:999px;font-size:.78rem;font-weight:700;text-transform:capitalize;color:#dbe8ff;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.1)}.thumb{position:relative;min-height:260px;border-radius:22px;overflow:hidden;border:1px solid rgba(255,255,255,.1);background:${thumbBg};padding:14px;margin-bottom:20px}.thumb-browser{display:flex;gap:6px;margin-bottom:12px}.thumb-browser span{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.34)}.thumb-screen{min-height:200px;border-radius:18px;border:1px solid rgba(255,255,255,.08);background:rgba(5,10,22,.42);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;position:relative;overflow:hidden}.thumb-lang{position:absolute;top:10px;right:10px;padding:6px 10px;border-radius:999px;font-size:.72rem;letter-spacing:.05em;font-weight:700;color:rgba(255,255,255,.85);background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08)}.thumb-title{font-size:clamp(1.7rem,4vw,2.4rem);font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:${thumbColor};line-height:1}.thumb-subtitle{margin-top:10px;font-size:.82rem;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.72)}.thumb-bar{margin-top:18px;width:72%;height:38px;border-radius:12px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08)}h2{margin:0 0 10px;font-size:1.45rem;line-height:1.2}p{margin:0;color:#9db0d4;line-height:1.75}.tags{margin-top:16px;display:flex;flex-wrap:wrap;gap:10px}.tags span{padding:8px 12px;border-radius:999px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.08);color:#eef4ff;font-size:.9rem}.learn{margin-top:18px;padding:16px;border-radius:18px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)}.learn ul{margin:0;padding-left:18px;color:#b6c7e6;line-height:1.7}.actions{margin-top:18px;display:flex;gap:12px;flex-wrap:wrap}a{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 18px;border-radius:999px;color:#fff;text-decoration:none;font-weight:700;background:linear-gradient(135deg,#4f8cff,#8b5cf6)}.ghost{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08);color:#eef4ff}</style></head><body><div class="box"><div class="top"><div class="label">${escapeHtml(t('preview_fallback_label'))}</div><div class="cat">${escapeHtml(project.category)}</div></div><div class="thumb"><div class="thumb-browser"><span></span><span></span><span></span></div><div class="thumb-screen"><div class="thumb-lang">${escapeHtml(thumbLang)}</div><div class="thumb-title">${escapeHtml(thumbTitle)}</div><div class="thumb-subtitle">${escapeHtml(thumbSubtitle)}</div><div class="thumb-bar"></div></div></div><h2>${escapeHtml(project.title[currentLang])}</h2><p>${escapeHtml(project.description[currentLang])}</p><div class="tags">${project.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div><div class="learn"><ul>${learned.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div><div class="actions"><a href="${escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('preview_open'))}</a><a class="ghost" href="${escapeHtml(HUB_URL)}" target="_blank" rel="noopener noreferrer">Hub</a></div></div></body></html>`;
}

/* ============================================================
   Card rendering
   ============================================================ */
function makeThumb(project) {
  return `<div class="project-thumb" style="--thumb-bg:${project.thumbBg};--thumb-color:${project.thumbColor}"><div class="thumb-browser"><span></span><span></span><span></span></div><div class="thumb-screen"><div class="thumb-lang">${project.thumbLang || 'EN'}</div><div class="thumb-title">${project.thumbTitle || project.title[currentLang]}</div><div class="thumb-subtitle">${project.thumbSubtitle || project.category}</div><div class="thumb-bar"></div></div></div>`;
}

function createProjectCard(project) {
  const learned = (project.learned && project.learned[currentLang]) || [
    currentLang === 'ro'
      ? 'Problemă: am urmărit să construiesc o interfață clară și ușor de explorat.'
      : 'Problem: I wanted to build an interface that feels clear and easy to explore.',
    currentLang === 'ro'
      ? 'Soluție: am organizat conținutul astfel încât acțiunile principale să fie rapid de înțeles.'
      : 'Solution: I organized the content so the main actions are easy to understand.',
    currentLang === 'ro'
      ? 'Provocare: să păstrez un echilibru bun între prezentare vizuală, claritate și experiență responsive.'
      : 'Challenge: keeping a good balance between visual presentation, clarity and responsive experience.'
  ];

  const isActive = activePreview && activePreview.id === project.id;
  const card = document.createElement('article');
  card.className = `project-card glass${isActive ? ' active-preview' : ''}`;
  card.dataset.id = project.id;
  card.innerHTML = `
    ${makeThumb(project)}
    <div class="project-top">
      <h3>${escapeHtml(project.title[currentLang])}</h3>
      <span class="tag ${project.category}">${project.category}</span>
    </div>
    <p class="project-desc">${escapeHtml(project.description[currentLang])}</p>
    <div class="learn-box">
      <button class="learn-toggle" type="button" aria-expanded="false" aria-controls="learn-${project.id}">
        <span>${t('learn_title')}</span>
        <span aria-hidden="true">▾</span>
      </button>
      <div class="learn-content" id="learn-${project.id}" hidden>
        <ul>${learned.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="project-actions">
      <button class="mini-btn primary preview-btn" type="button" data-id="${project.id}">
        ${t('preview_live')}
      </button>
      <a class="mini-btn" href="${escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer">
        ${t('open_new_tab')}
      </a>
    </div>`;

  // Toggle learn box
  card.querySelector('.learn-toggle').addEventListener('click', function () {
    const content = document.getElementById(`learn-${project.id}`);
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    content.hidden = expanded;
  });

  // Preview button
  card.querySelector('.preview-btn').addEventListener('click', () => setActivePreview(project));

  return card;
}

/* ============================================================
   Preview pane
   ============================================================ */
function setActivePreview(project) {
  activePreview = project;
  const projectFrame = document.getElementById('projectFrame');
  const previewTitle = document.getElementById('previewTitle');
  const previewTag = document.getElementById('previewTag');
  const previewUrl = document.getElementById('previewUrl');
  const previewOpen = document.getElementById('previewOpen');
  const currentPreviewIndex = document.getElementById('currentPreviewIndex');

  previewTitle.textContent = project.title[currentLang];
  previewTag.className = `tag ${project.category}`;
  previewTag.textContent = project.category;
  previewUrl.textContent = project.url;
  previewOpen.href = project.url;
  currentPreviewIndex.textContent = String(project.id).padStart(2, '0');

  // Write local fallback into iframe
  const html = buildPreviewCard(project);
  projectFrame.removeAttribute('src');
  projectFrame.srcdoc = html;

  // Scroll to preview section on mobile
  if (window.innerWidth <= 760) {
    document.getElementById('preview').scrollIntoView({ behavior: 'smooth' });
  }

  // Update active card highlight
  document.querySelectorAll('.project-card').forEach(el => {
    el.classList.toggle('active-preview', Number(el.dataset.id) === project.id);
  });
}

/* ============================================================
   Grid rendering
   ============================================================ */
function renderGrid(gridEl, list) {
  gridEl.innerHTML = '';
  list.forEach(p => gridEl.appendChild(createProjectCard(p)));
}

function applyFilters() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();

  const filtered = projects.filter(p => {
    const matchFilter = activeFilter === 'all' || p.category === activeFilter;
    const matchSearch = !query
      || p.title.ro.toLowerCase().includes(query)
      || p.title.en.toLowerCase().includes(query)
      || p.description.ro.toLowerCase().includes(query)
      || p.description.en.toLowerCase().includes(query)
      || p.tags.some(tag => tag.toLowerCase().includes(query));
    return matchFilter && matchSearch;
  });

  const topIds = new Set(SELECTED_WORK_IDS);
  const topProjects = filtered.filter(p => topIds.has(p.id));
  const experiments = filtered.filter(p => !topIds.has(p.id) && p.category !== 'challenge');
  const challenges = filtered.filter(p => !topIds.has(p.id) && p.category === 'challenge');

  renderGrid(document.getElementById('projectsGrid'), topProjects);
  renderGrid(document.getElementById('experimentsGrid'), experiments);
  renderGrid(document.getElementById('challengesGrid'), challenges);

  const total = filtered.length;
  document.getElementById('resultsCount').textContent = total;

  const emptyState = document.getElementById('emptyState');
  emptyState.style.display = total === 0 ? 'block' : 'none';
}

/* ============================================================
   i18n apply
   ============================================================ */
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang][key]) el.textContent = translations[currentLang][key];
  });
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.placeholder = t('search_placeholder');
  updateMetaForLanguage();
}

/* ============================================================
   Theme
   ============================================================ */
function applyTheme(light) {
  document.body.classList.toggle('light', light);
  const btn = document.getElementById('themeToggle');
  btn.textContent = light ? t('theme_dark') : t('theme_light');
  btn.setAttribute('aria-pressed', String(light));
}

/* ============================================================
   Init
   ============================================================ */
async function init() {
  // Load projects from JSON
  try {
    const res = await fetch('projects.json');
    projects = await res.json();
  } catch (e) {
    console.error('Could not load projects.json', e);
    return;
  }

  // Update stat count
  document.getElementById('projectCount').textContent = projects.length;

  // Featured grid
  const featured = projects.filter(p => p.featured);
  renderGrid(document.getElementById('featuredGrid'), featured);

  // Recent grid (last RECENT_COUNT by id)
  const recent = [...projects].sort((a, b) => b.id - a.id).slice(0, RECENT_COUNT);
  renderGrid(document.getElementById('recentGrid'), recent);

  // Main grids
  applyFilters();

  // Set initial preview
  setActivePreview(projects[0]);

  // Hub links
  document.querySelectorAll('[id^="hubLink"]').forEach(el => { el.href = HUB_URL; });

  // Theme
  const savedTheme = localStorage.getItem('portfolio-theme');
  const isLight = savedTheme === 'light';
  applyTheme(isLight);
  document.getElementById('themeToggle').addEventListener('click', () => {
    const light = !document.body.classList.contains('light');
    applyTheme(light);
    localStorage.setItem('portfolio-theme', light ? 'light' : 'dark');
  });

  // Language
  applyTranslations();
  const langToggle = document.getElementById('langToggle');
  langToggle.setAttribute('aria-pressed', currentLang === 'en' ? 'true' : 'false');
  langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'ro' ? 'en' : 'ro';
    localStorage.setItem('portfolio-lang', currentLang);
    langToggle.setAttribute('aria-pressed', currentLang === 'en' ? 'true' : 'false');
    applyTranslations();
    applyFilters();
    if (activePreview) setActivePreview(activePreview);
  });

  // Search
  document.getElementById('searchInput').addEventListener('input', applyFilters);

  // Filter chips
  document.getElementById('filterChips').addEventListener('click', e => {
    const chip = e.target.closest('[data-filter]');
    if (!chip) return;
    activeFilter = chip.dataset.filter;
    document.querySelectorAll('.chip').forEach(c => {
      const isActive = c.dataset.filter === activeFilter;
      c.classList.toggle('active', isActive);
      c.setAttribute('aria-pressed', String(isActive));
    });
    applyFilters();
  });
}

document.addEventListener('DOMContentLoaded', init);
