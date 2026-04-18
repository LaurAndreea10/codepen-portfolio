const HUB_URL = 'https://codepen.io/Laura-Andreea-the-typescripter/pen/019d2b3a-2991-75d3-9c59-15de01ca8079#projects';
const BLOG_URL = 'https://es-d-7037060320260420-019d9f7f-067d-7de0-a4e9-3438cc67bdaa.codepen.dev/';
const PARCURS_URL = '#';
const PREVIEW_URL = '#';
const FORKS_URL = '#';
const FUSIONS_URL = '#';
const PROJECTS_URL = '#';
const KEY_PROJECT_IDS = [1, 3, 39];

const translations = {
  ro: {
    brand: 'Portofoliu CodePen', nav_work: 'Proiecte-cheie', nav_blog: 'Blog', nav_about: 'Despre', nav_contact: 'Contact',
    hero_eyebrow: 'CRM • Marketing • Front-end autodidact',
    hero_title: 'Construiesc produse digitale clare: problemă → logică → rezultat',
    hero_text: 'Pagina principală este acum concentrată pe cele mai relevante 3 proiecte. Biblioteca completă rămâne disponibilă într-un hub secundar pentru explorare detaliată.',
    hero_cta: 'Vezi cele 3 proiecte-cheie', key_eyebrow: 'Proiecte-cheie',
    key_title: '3 proiecte care arată cel mai clar modul meu de lucru',
    problem: 'Problemă', stack: 'Stack', logic: 'Logică', result: 'Rezultat', open: 'Deschide proiectul',
    about_eyebrow: 'About', about_title: 'Context scurt',
    about_text: 'Vin din CRM și marketing, iar în front-end mă concentrez pe interfețe care rezolvă probleme reale: claritate de flux, feedback, structură și decizii UI/UX explicabile.',
    contact_eyebrow: 'Contact', contact_title: 'Hai să discutăm',
    contact_text: 'Dacă vrei, îți pot trimite și versiuni detaliate tip case study pentru fiecare proiect principal.',
    contact_email: 'Email', hub_eyebrow: 'Hub secundar',
    blog_eyebrow: 'Blog',
    blog_title: 'Articole și idei din procesul meu',
    blog_note: 'Am integrat și zona de blog pentru insight-uri despre proiecte, workflow și experimente front-end.',
    blog_cta: 'Deschide blogul',
    parcurs_eyebrow: 'Parcurs',
    parcurs_title: 'Evoluție, etape și învățăminte aplicate',
    parcurs_note: 'Un spațiu dedicat progresului meu: ce am construit, ce am iterat și cum am rafinat deciziile de produs.',
    parcurs_cta: 'Deschide Parcurs',
    preview_eyebrow: 'Preview',
    preview_title: 'Previzualizări rapide pentru experimente',
    preview_note: 'O zonă separată pentru preview-uri vizuale și versiuni intermediare înainte de publicarea finală.',
    preview_cta: 'Deschide Preview',
    forks_eyebrow: 'Forks',
    forks_title: 'Fork-uri și reinterpretări tehnice',
    forks_note: 'Colecție de idei pornite din proiecte existente, adaptate cu logică proprie și îmbunătățiri de UX.',
    forks_cta: 'Deschide Forks',
    fusions_eyebrow: 'Fusions',
    fusions_title: 'Fuziuni de concepte și module',
    fusions_note: 'Experimente unde combin componente, pattern-uri și flow-uri diferite într-o singură experiență coerentă.',
    fusions_cta: 'Deschide Fusions',
    projects_eyebrow: 'Proiecte',
    projects_title: 'Toate proiectele într-o secțiune dedicată',
    projects_note: 'Acces direct la lista completă de proiecte, organizată pentru explorare rapidă și comparație între idei.',
    projects_cta: 'Deschide Proiecte',
    hub_title: 'Biblioteca completă de proiecte',
    hub_note: 'Am păstrat întreaga bibliotecă aici, într-o secțiune secundară. Este accesibilă, dar nu domină funnel-ul principal.',
    hub_external: 'Deschide hub extern', results: 'rezultate', footer: 'Funnel principal: Hero → 3 proiecte-cheie → About → Contact',
    filter_state: 'Filtru: {filter} • Căutare: {query}'
  },
  en: {
    brand: 'CodePen Portfolio', nav_work: 'Key projects', nav_blog: 'Blog', nav_about: 'About', nav_contact: 'Contact',
    hero_eyebrow: 'CRM • Marketing • Self-taught front-end',
    hero_title: 'I build clear digital products: problem → logic → outcome',
    hero_text: 'The homepage now focuses on the 3 most relevant projects. The full library is still available in a secondary hub.',
    hero_cta: 'View the 3 key projects', key_eyebrow: 'Key projects',
    key_title: '3 projects that best show how I work',
    problem: 'Problem', stack: 'Stack', logic: 'Logic', result: 'Outcome', open: 'Open project',
    about_eyebrow: 'About', about_title: 'Short background',
    about_text: 'My background is in CRM and marketing; in front-end I focus on interfaces that solve real problems with clear flows, feedback and explainable UI/UX decisions.',
    contact_eyebrow: 'Contact', contact_title: 'Let’s talk',
    contact_text: 'If you want, I can share detailed case-study versions for each core project.',
    contact_email: 'Email', hub_eyebrow: 'Secondary hub',
    blog_eyebrow: 'Blog',
    blog_title: 'Articles and ideas from my process',
    blog_note: 'I also integrated the blog area for insights on projects, workflow and front-end experiments.',
    blog_cta: 'Open blog',
    parcurs_eyebrow: 'Journey',
    parcurs_title: 'Progress, milestones and applied learnings',
    parcurs_note: 'A dedicated space for my evolution: what I built, what I iterated and how product decisions improved over time.',
    parcurs_cta: 'Open Journey',
    preview_eyebrow: 'Preview',
    preview_title: 'Quick previews for experiments',
    preview_note: 'A separate area for visual previews and intermediate versions before final publishing.',
    preview_cta: 'Open Preview',
    forks_eyebrow: 'Forks',
    forks_title: 'Forks and technical reinterpretations',
    forks_note: 'A collection of ideas started from existing projects and adapted with my own logic and UX upgrades.',
    forks_cta: 'Open Forks',
    fusions_eyebrow: 'Fusions',
    fusions_title: 'Concept and module fusions',
    fusions_note: 'Experiments that combine different components, patterns and flows into one coherent experience.',
    fusions_cta: 'Open Fusions',
    projects_eyebrow: 'Projects',
    projects_title: 'All projects in a dedicated section',
    projects_note: 'Direct access to the complete list of projects, organized for quick exploration and idea comparison.',
    projects_cta: 'Open Projects',
    hub_title: 'Complete project library',
    hub_note: 'I kept the full library here in a secondary area. It remains accessible but no longer dominates the main funnel.',
    hub_external: 'Open external hub', results: 'results', footer: 'Main funnel: Hero → 3 key projects → About → Contact',
    filter_state: 'Filter: {filter} • Search: {query}'
  }
};

const keyProjectDetails = {
  1: {
    ro: {
      problem: 'Joc arcade rapid care să rămână clar la ritm mare.',
      stack: 'HTML, CSS, JavaScript (game loop + state updates).',
      logic: 'Actualizare în timp real pentru scor, timing și reacția adversarului.',
      result: 'Gameplay fluid, feedback instant și decizii vizibile în interfață.'
    },
    en: {
      problem: 'A fast arcade game that still feels clear under pressure.',
      stack: 'HTML, CSS, JavaScript (game loop + state updates).',
      logic: 'Real-time updates for score, timing and opponent reactions.',
      result: 'Fluid gameplay, instant feedback and visible UI decisions.'
    }
  },
  3: {
    ro: {
      problem: 'Structurare clară pentru un mini portal SaaS editabil.',
      stack: 'HTML, CSS, JavaScript modular.',
      logic: 'Separare între layout și fluxuri, cu zone care pot crește fără haos.',
      result: 'Produs demo ușor de extins, orientat pe claritate și utilitate.'
    },
    en: {
      problem: 'Clear structure for an editable mini SaaS portal.',
      stack: 'Modular HTML, CSS and JavaScript.',
      logic: 'Separation between layout and flows, with scalable functional areas.',
      result: 'An extendable product demo focused on clarity and utility.'
    }
  },
  39: {
    ro: {
      problem: 'Integrarea mai multor funcții educaționale fără aglomerare.',
      stack: 'HTML, CSS, JavaScript (module educaționale + planning).',
      logic: 'Ecosistem unificat de quiz, simulări, coach și calendar într-un flow coerent.',
      result: 'Platformă educațională complexă, dar ușor de parcurs și folosit.'
    },
    en: {
      problem: 'Integrating multiple education features without clutter.',
      stack: 'HTML, CSS, JavaScript (learning + planning modules).',
      logic: 'Unified ecosystem of quizzes, simulations, coaching and scheduling in one coherent flow.',
      result: 'A complex but easy-to-navigate educational platform.'
    }
  }
};

let currentLang = localStorage.getItem('portfolio-lang') || 'ro';
if (!translations[currentLang]) currentLang = 'ro';
let activeFilter = 'all';
let projects = [];
let dom = {};
let searchDebounceId;

function t(key) { return translations[currentLang][key] || key; }

function applyTranslations() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[currentLang][key]) el.textContent = translations[currentLang][key];
  });
  document.getElementById('langToggle').textContent = currentLang === 'ro' ? 'RO | EN' : 'EN | RO';
}

function createLibraryCard(project) {
  const card = document.createElement('article');
  card.className = 'project-card glass';
  const title = project.title[currentLang];
  const description = project.description[currentLang];
  const tag = document.createElement('span');
  tag.className = 'tag';
  tag.textContent = project.category;

  const heading = document.createElement('h3');
  heading.textContent = title;

  const desc = document.createElement('p');
  desc.className = 'project-desc';
  desc.textContent = description;

  const actions = document.createElement('div');
  actions.className = 'card-actions';

  const link = document.createElement('a');
  link.className = 'btn btn-secondary';
  link.href = project.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = t('open');

  actions.append(link);
  card.append(tag, heading, desc, actions);
  return card;
}

function createKeyCard(project) {
  const meta = keyProjectDetails[project.id][currentLang];
  const card = document.createElement('article');
  card.className = 'project-card glass';
  card.innerHTML = `
    <span class="tag">${project.category}</span>
    <h3>${project.title[currentLang]}</h3>
    <p class="project-desc">${project.description[currentLang]}</p>
    <div class="mini-grid">
      <div class="mini-item"><strong>${t('problem')}</strong><span>${meta.problem}</span></div>
      <div class="mini-item"><strong>${t('stack')}</strong><span>${meta.stack}</span></div>
      <div class="mini-item"><strong>${t('logic')}</strong><span>${meta.logic}</span></div>
      <div class="mini-item"><strong>${t('result')}</strong><span>${meta.result}</span></div>
    </div>
    <div class="card-actions"><a class="btn btn-primary" href="${project.url}" target="_blank" rel="noopener noreferrer">${t('open')}</a></div>
  `;
  return card;
}

function updateFilterState(query, total) {
  const filterName = activeFilter === 'all' ? 'all' : activeFilter;
  const readableFilter = filterName.toUpperCase();
  const q = query ? `"${query}"` : '—';
  const text = t('filter_state').replace('{filter}', readableFilter).replace('{query}', q);
  document.getElementById('filterState').textContent = text;
  document.getElementById('resultsCount').textContent = String(total);
}

function applyFilters() {
  const query = dom.searchInput.value.trim().toLowerCase();
  const filtered = projects.filter(project => {
    const matchFilter = activeFilter === 'all' || project.category === activeFilter;
    const haystack = [project.title.ro, project.title.en, project.description.ro, project.description.en, project.category, ...(project.tags || [])].join(' ').toLowerCase();
    return matchFilter && haystack.includes(query);
  });

  dom.libraryGrid.innerHTML = '';
  if (!filtered.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = currentLang === 'ro'
      ? 'Nu am găsit proiecte pentru filtrul/căutarea curentă.'
      : 'No projects matched the current filter/search.';
    dom.libraryGrid.appendChild(empty);
    updateFilterState(query, 0);
    return;
  }

  const fragment = document.createDocumentFragment();
  filtered.forEach(project => fragment.appendChild(createLibraryCard(project)));
  dom.libraryGrid.appendChild(fragment);
  updateFilterState(query, filtered.length);
}

function render() {
  applyTranslations();
  const keyProjects = KEY_PROJECT_IDS
    .map(id => projects.find(project => project.id === id))
    .filter(Boolean);

  dom.keyProjectsGrid.innerHTML = '';
  const fragment = document.createDocumentFragment();
  keyProjects.forEach(project => fragment.appendChild(createKeyCard(project)));
  dom.keyProjectsGrid.appendChild(fragment);
  applyFilters();
}

async function init() {
  dom = {
    blogExternalLink: document.getElementById('blogExternalLink'),
    parcursExternalLink: document.getElementById('parcursExternalLink'),
    previewExternalLink: document.getElementById('previewExternalLink'),
    forksExternalLink: document.getElementById('forksExternalLink'),
    fusionsExternalLink: document.getElementById('fusionsExternalLink'),
    projectsExternalLink: document.getElementById('projectsExternalLink'),
    hubExternalLink: document.getElementById('hubExternalLink'),
    searchInput: document.getElementById('searchInput'),
    filterChips: document.getElementById('filterChips'),
    themeToggle: document.getElementById('themeToggle'),
    langToggle: document.getElementById('langToggle'),
    keyProjectsGrid: document.getElementById('keyProjectsGrid'),
    libraryGrid: document.getElementById('libraryGrid')
  };
  dom.blogExternalLink.href = BLOG_URL;
  dom.parcursExternalLink.href = PARCURS_URL;
  dom.previewExternalLink.href = PREVIEW_URL;
  dom.forksExternalLink.href = FORKS_URL;
  dom.fusionsExternalLink.href = FUSIONS_URL;
  dom.projectsExternalLink.href = PROJECTS_URL;
  dom.hubExternalLink.href = HUB_URL;

  try {
    const response = await fetch('projects.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    projects = await response.json();
  } catch (error) {
    console.error('Nu am putut încărca projects.json', error);
    dom.libraryGrid.innerHTML = `<div class="empty-state">${currentLang === 'ro' ? 'Eroare la încărcarea proiectelor. Reîncarcă pagina.' : 'Failed to load projects. Please refresh the page.'}</div>`;
    return;
  }

  render();

  dom.searchInput.addEventListener('input', () => {
    window.clearTimeout(searchDebounceId);
    searchDebounceId = window.setTimeout(applyFilters, 120);
  });
  dom.filterChips.addEventListener('click', (event) => {
    const chip = event.target.closest('[data-filter]');
    if (!chip) return;
    activeFilter = chip.dataset.filter;
    document.querySelectorAll('.chip').forEach(button => {
      const isActive = button.dataset.filter === activeFilter;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
    applyFilters();
  });

  const applyTheme = (isLight) => {
    document.body.classList.toggle('light', isLight);
    dom.themeToggle.textContent = isLight ? '☀️ Light' : '🌙 Dark';
  };

  applyTheme(localStorage.getItem('portfolio-theme') === 'light');
  dom.themeToggle.addEventListener('click', () => {
    const nextLight = !document.body.classList.contains('light');
    applyTheme(nextLight);
    localStorage.setItem('portfolio-theme', nextLight ? 'light' : 'dark');
  });

  dom.langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'ro' ? 'en' : 'ro';
    localStorage.setItem('portfolio-lang', currentLang);
    render();
  });
}

document.addEventListener('DOMContentLoaded', init);
