const PORTFOLIO_SOURCE_URL = 'https://es-d-7037060320260420-019d2b3a-2991-75d3-9c59-15de01ca8079.codepen.dev/';
const JOURNEY_SOURCE_URL = 'https://es-d-7037060320260420-019d9f7f-067d-7de0-a4e9-3438cc67bdaa.codepen.dev/';

const HUB_URL = `${PORTFOLIO_SOURCE_URL}#projects`;
const BLOG_URL = `${PORTFOLIO_SOURCE_URL}#blog`;
const PARCURS_URL = `${JOURNEY_SOURCE_URL}#journey`;
const PREVIEW_URL = `${PORTFOLIO_SOURCE_URL}#preview`;
const FORKS_URL = `${PORTFOLIO_SOURCE_URL}#forks`;
const CRM_URL = `${JOURNEY_SOURCE_URL}#crm`;
const FUSIONS_URL = `${JOURNEY_SOURCE_URL}#crm-fusion`;
const PROJECTS_URL = `${PORTFOLIO_SOURCE_URL}#projects`;
const KEY_PROJECT_IDS = [1, 3, 49];
const STATIC_FALLBACK_PROJECTS = [
  {
    id: 1,
    title: { ro: 'Arcade Fusion', en: 'Arcade Fusion' },
    description: {
      ro: 'Joc arcade cu feedback instant, scor live și ritm progresiv.',
      en: 'Arcade game with instant feedback, live score and progressive pace.'
    },
    category: 'game',
    tags: ['arcade', 'js', 'ux'],
    url: 'projects/arcade-fusion.html'
  },
  {
    id: 3,
    title: { ro: 'ClientFlow', en: 'ClientFlow' },
    description: {
      ro: 'Dashboard utilitar pentru lead-uri, task-uri și urmărirea acțiunilor.',
      en: 'Utility dashboard for leads, tasks and action tracking.'
    },
    category: 'utility',
    tags: ['crm', 'dashboard', 'workflow'],
    url: 'projects/clientflow.html'
  },
  {
    id: 49,
    title: { ro: 'Alpis Fusion CRM Premium', en: 'Alpis Fusion CRM Premium' },
    description: {
      ro: 'CRM modular cu kanban, flow builder, roluri și billing într-un singur SPA.',
      en: 'Modular CRM with kanban, flow builder, roles and billing in one SPA.'
    },
    category: 'ui',
    tags: ['crm', 'rbac', 'kanban'],
    url: 'https://laurandreea10.github.io/Alpis-Fusion-CRM-premium/'
  }
];

const translations = {
  ro: {
    brand: 'Portofoliu CodePen', nav_work: 'Top proiecte', nav_crm: 'CRM', nav_fusions: 'Fusion', nav_about: 'Despre mine', nav_contact: 'Contact',
    hero_eyebrow: 'Marketing Specialist • Social Media Manager • Front-end autodidact',
    hero_title: 'Construiesc experiențe digitale clare, interactive și gândite din perspectiva utilizatorului',
    hero_text: 'Am peste 5 ani de experiență în CRM și marketing, iar în paralel îmi dezvolt constant competențele în front-end development. Portofoliul meu reunește aplicații utile, mini jocuri și interfețe interactive create pentru a demonstra logică, structură, feedback și decizii UI/UX bine gândite — nu doar estetică.',
    hero_cta: 'Vezi proiectele', key_eyebrow: 'Top proiecte',
    key_title: '3 proiecte care arată cel mai clar modul meu de lucru',
    key_subtitle: 'Le-am ales pentru că evidențiază cel mai bine felul în care combin claritatea, logica și deciziile de produs în proiecte interactive.',
    problem: 'Problemă', stack: 'Stack', logic: 'Logică', result: 'Rezultat', open: 'Deschide proiectul',
    about_eyebrow: 'Despre mine', about_title: 'Despre mine',
    about_text: 'Combin experiența din CRM și marketing cu interesul meu pentru front-end development, pentru a construi produse digitale mai clare, mai utile și mai ușor de folosit. Un exemplu concret: am construit Alpis Fusion CRM Premium ca SPA publicat pe GitHub Pages, cu kanban, flow builder, RBAC și billing într-o singură interfață.',
    contact_eyebrow: 'Contact', contact_title: 'Lasă-mi o sugestie',
    contact_text: 'Dacă ai o idee, o sugestie sau un feedback despre ce ai vrea să mai adaug în portofoliu, îmi poți scrie. Sunt deschisă la recomandări, colaborări și conversații care construiesc mai departe.',
    contact_email: 'Email', hub_eyebrow: 'Bibliotecă extinsă',
    blog_eyebrow: 'Blog',
    blog_title: 'Ce am învățat pe drum',
    blog_note: 'O selecție de reflecții, observații și idei desprinse din procesul meu de învățare, lucru practic și construcție de proiecte. Secțiunea aceasta completează portofoliul cu partea de gândire din spatele execuției.',
    blog_cta: 'Deschide blogul',
    parcurs_eyebrow: 'Parcurs',
    parcurs_title: 'De la CRM la cod — parcursul meu',
    parcurs_note: 'Experiența mea profesională a început în zone în care claritatea, organizarea și înțelegerea utilizatorului erau esențiale: CRM, marketing, content și campanii digitale. În timp, interesul pentru partea practică a produselor digitale a crescut firesc. Nu m-a interesat doar cum se comunică un produs, ci și cum se construiește, cum reacționează, cum ghidează utilizatorul și cum transmite claritate prin interfață. Front-end development a devenit astfel o continuare logică a parcursului meu: o combinație între structură, creativitate, logică și atenție reală la experiența utilizatorului.',
    parcurs_cta: 'Deschide Parcurs',
    preview_eyebrow: 'Preview live',
    preview_title: 'Preview live',
    preview_note: 'Aici poți vedea unul dintre proiectele mele direct în portofoliu, într-un format gândit pentru explorare rapidă și experiență fluentă. Această zonă funcționează ca demonstrație practică a modului în care construiesc interacțiuni clare, feedback vizual și flow coerent între utilizator și interfață.',
    preview_cta: 'Deschide proiectul',
    crm_eyebrow: 'CRM',
    crm_title: 'Sisteme CRM și flow-uri orientate pe utilizator',
    crm_note: 'Secțiune dedicată proiectelor în care combin organizarea datelor, automatizarea și experiența utilizatorului pentru procese mai clare.',
    crm_cta: 'Deschide CRM',
    forks_eyebrow: 'Top Projects',
    forks_title: 'Top Projects',
    forks_note: 'Proiectele care exprimă cel mai bine felul în care transform o idee într-o experiență digitală clară, interactivă și bine structurată.',
    forks_cta: 'Vezi hub-ul complet',
    fusions_eyebrow: 'Other Experiments',
    fusions_title: 'Other Experiments',
    fusions_note: 'Explorări vizuale, concepte UI și prototipuri rapide create pentru a testa interacțiuni, layout-uri, feedback vizual și direcții noi de construcție.',
    fusions_cta: 'Explorează',
    projects_eyebrow: 'Challenges',
    projects_title: 'Challenges',
    projects_note: 'Exerciții și provocări practice prin care îmi antrenez logica, structura și capacitatea de a construi soluții simple, clare și funcționale.',
    projects_cta: 'Deschide Proiecte',
    hub_title: 'Explorează colecția de proiecte',
    hub_note: 'Biblioteca completă de proiecte rămâne disponibilă separat, pentru explorare extinsă. Pagina principală păstrează doar selecția esențială.',
    hub_external: 'Hub complet', results: 'rezultate', footer: 'Creat pentru prezentarea proiectelor CodePen, cu accent pe claritate, explorare ușoară, responsive design, suport dark/light mode și live preview.',
    filter_state: 'Filtru: {filter} • Căutare: {query}',
    library_empty_fallback: 'Nu există rezultate pentru filtrul curent. Poți reveni la listarea completă sau accesa direct cele 3 proiecte-cheie:',
    reset_filters: 'Resetează filtrele'
  },
  en: {
    brand: 'CodePen Portfolio', nav_work: 'Top projects', nav_crm: 'CRM', nav_fusions: 'Fusion', nav_about: 'About', nav_contact: 'Contact',
    hero_eyebrow: 'CRM • Marketing • Self-taught front-end',
    hero_title: 'I build clear digital products: problem → logic → outcome',
    hero_text: 'The homepage now focuses on the 3 most relevant projects. The full library is still available in a secondary hub.',
    hero_cta: 'View the 3 key projects', key_eyebrow: 'Key projects',
    key_title: '3 projects that best show how I work',
    key_subtitle: 'I selected these because they best highlight how I combine clarity, logic, and product decisions in interactive projects.',
    problem: 'Problem', stack: 'Stack', logic: 'Logic', result: 'Outcome', open: 'Open project',
    about_eyebrow: 'About', about_title: 'Short background',
    about_text: 'My background is in CRM and marketing; in front-end I focus on interfaces that solve real problems with clear flows, feedback and explainable UI/UX decisions. A concrete example is Alpis Fusion CRM Premium, a GitHub Pages SPA that combines kanban, flow builder, RBAC and billing.',
    contact_eyebrow: 'Contact', contact_title: 'Let’s talk',
    contact_text: 'If you want, I can share detailed case-study versions for each core project.',
    contact_email: 'Email', hub_eyebrow: 'Extended library',
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
    crm_eyebrow: 'CRM',
    crm_title: 'CRM systems and user-focused flows',
    crm_note: 'A dedicated section for projects where I combine data organization, automation and user experience to make processes clearer.',
    crm_cta: 'Open CRM',
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
    hub_note: 'The complete project library remains available in a separate hub for deeper exploration. The homepage keeps only the essential selection.',
    hub_external: 'Open external hub', results: 'results', footer: 'Main funnel: Hero → 3 key projects → About → Contact',
    filter_state: 'Filter: {filter} • Search: {query}',
    library_empty_fallback: 'No results for the current filter. You can reset to the full list or jump straight to the 3 key projects:',
    reset_filters: 'Reset filters'
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
  ,
  49: {
    ro: {
      problem: 'Un CRM premium care să păstreze multe funcții fără să încarce interfața.',
      stack: 'HTML, CSS, JavaScript (dashboard modular + fluxuri CRM).',
      logic: 'Secțiuni clare pentru clienți, task-uri și organizare, cu navigare predictibilă.',
      result: 'Flux de lucru mai rapid, structură ușor de înțeles și experiență coerentă.'
    },
    en: {
      problem: 'A premium CRM that keeps rich features without overwhelming the interface.',
      stack: 'HTML, CSS, JavaScript (modular dashboard + CRM flows).',
      logic: 'Clear sections for clients, tasks and organization with predictable navigation.',
      result: 'Faster workflow, easy-to-understand structure and a coherent experience.'
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
  const fallbackText = document.getElementById('libraryFallbackText');
  const resetButton = document.getElementById('resetFiltersBtn');
  if (fallbackText) fallbackText.textContent = t('library_empty_fallback');
  if (resetButton) resetButton.textContent = t('reset_filters');
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
  const filterStateEl = document.getElementById('filterState');
  const separatorEl = document.getElementById('statusSeparator');
  document.getElementById('resultsCount').textContent = String(total);

  if (total === 0) {
    filterStateEl.hidden = true;
    separatorEl.hidden = true;
    return;
  }

  filterStateEl.hidden = false;
  separatorEl.hidden = false;
  filterStateEl.textContent = text;
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
    dom.libraryGrid.hidden = true;
    dom.libraryFallback.classList.add('show');
    updateFilterState(query, 0);
    return;
  }

  dom.libraryGrid.hidden = false;
  dom.libraryFallback.classList.remove('show');
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

  if (keyProjects.length === KEY_PROJECT_IDS.length) {
    dom.keyProjectsGrid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    keyProjects.forEach(project => fragment.appendChild(createKeyCard(project)));
    dom.keyProjectsGrid.appendChild(fragment);
  }

  applyFilters();
}

async function init() {
  dom = {
    blogExternalLink: document.getElementById('blogExternalLink'),
    parcursExternalLink: document.getElementById('parcursExternalLink'),
    previewExternalLink: document.getElementById('previewExternalLink'),
    forksExternalLink: document.getElementById('forksExternalLink'),
    crmExternalLink: document.getElementById('crmExternalLink'),
    fusionsExternalLink: document.getElementById('fusionsExternalLink'),
    projectsExternalLink: document.getElementById('projectsExternalLink'),
    hubExternalLink: document.getElementById('hubExternalLink'),
    searchInput: document.getElementById('searchInput'),
    filterChips: document.getElementById('filterChips'),
    themeToggle: document.getElementById('themeToggle'),
    langToggle: document.getElementById('langToggle'),
    keyProjectsGrid: document.getElementById('keyProjectsGrid'),
    libraryGrid: document.getElementById('libraryGrid'),
    libraryFallback: document.getElementById('libraryFallback'),
    resetFiltersBtn: document.getElementById('resetFiltersBtn')
  };
  dom.blogExternalLink.href = BLOG_URL;
  dom.parcursExternalLink.href = PARCURS_URL;
  dom.previewExternalLink.href = PREVIEW_URL;
  dom.forksExternalLink.href = FORKS_URL;
  dom.crmExternalLink.href = CRM_URL;
  dom.fusionsExternalLink.href = FUSIONS_URL;
  dom.projectsExternalLink.href = PROJECTS_URL;
  dom.hubExternalLink.href = HUB_URL;

  try {
    const response = await fetch('projects.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    projects = await response.json();
  } catch (error) {
    console.error('Nu am putut încărca projects.json', error);
    projects = STATIC_FALLBACK_PROJECTS;
    dom.libraryGrid.innerHTML = `<div class="empty-state">${currentLang === 'ro' ? 'Am încărcat o versiune fallback cu proiecte esențiale, deoarece projects.json nu a fost disponibil.' : 'Loaded fallback essentials because projects.json was unavailable.'}</div>`;
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
  dom.resetFiltersBtn.addEventListener('click', () => {
    activeFilter = 'all';
    dom.searchInput.value = '';
    document.querySelectorAll('.chip').forEach(button => {
      const isActive = button.dataset.filter === 'all';
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
