const PORTFOLIO_SOURCE_URL = 'https://es-d-7037060320260420-019d2b3a-2991-75d3-9c59-15de01ca8079.codepen.dev/';
const HUB_URL = `${PORTFOLIO_SOURCE_URL}#projects`;
const KEY_PROJECT_IDS = [49, 3, 18];
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
const HERO_PREVIEW_SLIDES = [
  { title: 'Alpis Fusion CRM Premium', url: 'https://laurandreea10.github.io/Alpis-Fusion-CRM-premium/' },
  { title: 'BACapp', url: 'https://laurandreea10.github.io/BACapp/' },
  { title: 'ARCADE WORLD', url: 'https://github.com/LaurAndreea10/ARCADE-WORLD' },
  { title: 'Coaching AI', url: 'https://github.com/LaurAndreea10/Coaching-AI' },
  { title: 'Nexus Arcade', url: 'https://laurandreea10.github.io/Nexus-arcade/' },
  { title: 'ALPis Content Studio', url: 'https://github.com/LaurAndreea10/ALPis-CONTENT-STUDIO' },
  { title: 'ClientFlow SaaS CRM Suite', url: 'https://github.com/LaurAndreea10/ClientFlow-SaaS-CRM-task-manager-automation-suite' },
  { title: 'Mood UI Generator', url: 'https://github.com/LaurAndreea10/Mood-UI-Generator' },
  { title: 'Code Words Strings Challenge', url: 'https://github.com/LaurAndreea10/CodePen-Challenge-Code-Words-Strings' }
];

const translations = {
  ro: {
    brand: 'Portofoliu CodePen', nav_work: 'Top proiecte', nav_about: 'Despre mine', nav_contact: 'Contact',
    hero_eyebrow: 'CRM • Marketing • Front-end autodidact început în CodePen',
    hero_title: 'Construiesc interfețe CRM și dashboard-uri care reduc fricțiunea, clarifică fluxurile și ajută utilizatorii să acționeze mai repede.',
    hero_text: 'Vin din CRM și marketing, iar în front-end mă concentrez pe produse unde structura, feedback-ul și prioritizarea fac diferența în onboarding, task management și deciziile zilnice.',
    hero_cta: 'Vezi proiectele-cheie', hero_cta_secondary: 'Contactează-mă',
    hero_proof_1: 'CRM SPA publicat pe GitHub Pages',
    hero_proof_2: 'Kanban + flow builder + RBAC + billing',
    hero_proof_3: 'UI/UX orientat pe flow și decizii explicabile', key_eyebrow: 'Top proiecte',
    key_title: '3 proiecte care arată cel mai clar modul meu de lucru',
    key_subtitle: 'Le-am ales pentru că evidențiază cel mai bine felul în care combin claritatea, logica și deciziile de produs în proiecte interactive.',
    context: 'Context', problem: 'Problemă', constraints: 'Constrângeri', decision: 'Decizia mea', priority: 'Ce am prioritizat', learning: 'Ce am învățat', proof: 'Dovezi observabile', open: 'Deschide proiectul',
    about_eyebrow: 'Despre mine', about_title: 'Despre mine',
    about_text: 'Am început autodidact în CodePen, apoi am extins în proiecte front-end complete. Vin din CRM și marketing, iar acum construiesc dashboard-uri și interfețe unde structura, feedback-ul și prioritizarea reduc fricțiunea pentru utilizator.',
    contact_eyebrow: 'Contact', contact_title: 'Lucrezi la un CRM, dashboard sau produs intern?',
    contact_text: 'Scrie-mi dacă vrei feedback pe UX, o colaborare sau dacă vrei să vezi case study-urile complete.',
    contact_email: 'Trimite email', hub_eyebrow: 'Bibliotecă extinsă',
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
    hub_external: 'Explorează mai mult', results: 'rezultate', footer: 'Funnel principal: Hero → 3 proiecte-cheie → Contact. Restul secțiunilor sunt grupate în hub-ul secundar „Explorează mai mult”.',
    filter_state: 'Filtru: {filter} • Căutare: {query}',
    library_empty_fallback: 'Nu există rezultate pentru filtrul curent. Poți reveni la listarea completă sau accesa direct cele 3 proiecte-cheie:',
    reset_filters: 'Resetează filtrele'
  },
  en: {
    brand: 'CodePen Portfolio', nav_work: 'Top projects', nav_about: 'About', nav_contact: 'Contact',
    hero_eyebrow: 'CRM • Marketing • Self-taught front-end started in CodePen',
    hero_title: 'I build CRM interfaces and dashboards that reduce friction, clarify flows, and help users act faster.',
    hero_text: 'My background is in CRM and marketing, and in front-end I focus on products where structure, feedback, and prioritization improve onboarding, task management, and daily decisions.',
    hero_cta: 'View key projects', hero_cta_secondary: 'Contact me',
    hero_proof_1: 'CRM SPA published on GitHub Pages',
    hero_proof_2: 'Kanban + flow builder + RBAC + billing',
    hero_proof_3: 'Flow-oriented UI/UX with explainable decisions', key_eyebrow: 'Key projects',
    key_title: '3 projects that best show how I work',
    key_subtitle: 'I selected these because they best highlight how I combine clarity, logic, and product decisions in interactive projects.',
    context: 'Context', problem: 'Problem', constraints: 'Constraints', decision: 'Decision', priority: 'What I prioritized', learning: 'What I learned', proof: 'Observable evidence', open: 'Open project',
    about_eyebrow: 'About', about_title: 'Short background',
    about_text: 'I started self-taught in CodePen, then expanded into complete front-end projects. My CRM and marketing background now translates into dashboards and interfaces where structure, feedback, and prioritization reduce user friction.',
    contact_eyebrow: 'Contact', contact_title: 'Working on a CRM, dashboard, or internal product?',
    contact_text: 'Reach out if you want UX feedback, a collaboration, or the full case studies.',
    contact_email: 'Send email', hub_eyebrow: 'Extended library',
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
    hub_external: 'Explore more', results: 'results', footer: 'Main funnel: Hero → 3 key projects → Contact. The rest is grouped in the secondary “Explore more” hub.',
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
      context: 'Lead-urile și follow-up-urile erau urmărite în liste diferite, fără o imagine comună de zi cu zi.',
      problem: 'Echipa pierdea context când schimba rapid task-uri, iar trierea devenea inconsistentă.',
      constraints: 'Interfață simplă, rapidă și ușor de întreținut, fără dependențe externe complexe.',
      decision: 'Am grupat lead-urile pe stadii, cu semnale vizuale de urgență și shortcut-uri pentru acțiuni repetitive.',
      priority: 'Triage rapid, overview zilnic clar și minimizarea revenirilor între ecrane.',
      learning: 'Ierarhia de informație bună crește viteza deciziilor mai mult decât adăugarea de widget-uri.',
      proof: [
        'Am redus pașii pentru trierea lead-urilor în workflow-ul zilnic.',
        'Am făcut trecerea între acțiuni mai predictibilă pentru echipă.',
        'Am reorganizat informația astfel încât urgențele să fie vizibile imediat.'
      ]
    },
    en: {
      context: 'Leads and follow-ups were split across separate lists, with no shared day-to-day overview.',
      problem: 'Context was lost during quick task switching, making prioritization inconsistent.',
      constraints: 'The interface had to stay simple, fast, and easy to maintain without heavy dependencies.',
      decision: 'I grouped leads by stage, added urgency signals, and created shortcuts for repetitive actions.',
      priority: 'Fast triage, clear daily overview, and fewer back-and-forth screen hops.',
      learning: 'Strong information hierarchy improves decision speed more than adding more widgets.',
      proof: [
        'I reduced the steps needed for daily lead triage.',
        'I made action switching more predictable for the team.',
        'I reorganized information so urgent items stand out immediately.'
      ]
    }
  },
  18: {
    ro: {
      context: 'Produsul trebuia să comunice pașii de impact într-un mod motivațional și ușor de parcurs.',
      problem: 'Versiunea statică era lungă, iar utilizatorii pierdeau mesajul principal pe parcurs.',
      constraints: 'Conținut dens, dar nevoie de ritm scurt, orientare clară și layout responsive.',
      decision: 'Am împărțit experiența în misiuni scurte cu progres vizibil, CTA contextual și tranziții ghidate.',
      priority: 'Orientarea utilizatorului, retenția mesajului principal și flow fluent cap-coadă.',
      learning: 'Storytelling-ul interactiv funcționează mai bine când ritmul e controlat prin pași clari.',
      proof: [
        'Am redus abandonul pe parcurs prin secțiuni mai scurte și progres vizibil.',
        'Am făcut onboarding-ul în experiență mai previzibil prin tranziții ghidate.',
        'Am reorganizat informația astfel încât mesajul principal să se rețină mai ușor.'
      ]
    },
    en: {
      context: 'The product had to communicate impact steps in a motivational, easy-to-follow experience.',
      problem: 'The static version was too long, and users lost the main message during the journey.',
      constraints: 'Dense content with a need for short pacing, clear orientation, and responsive structure.',
      decision: 'I split the journey into short missions with visible progress, contextual CTAs, and guided transitions.',
      priority: 'User orientation, main-message retention, and a smooth end-to-end flow.',
      learning: 'Interactive storytelling works better when pacing is controlled through clear steps.',
      proof: [
        'I reduced drop-off through shorter sections and visible progress.',
        'I made onboarding into the experience more predictable with guided transitions.',
        'I reorganized information so the core message is easier to retain.'
      ]
    }
  }
  ,
  49: {
    ro: {
      context: 'Datele de client, task-urile și billing-ul erau distribuite în zone separate ale produsului.',
      problem: 'Aceeași operațiune cerea prea multe schimbări de ecran, cu risc de eroare și ritm lent.',
      constraints: 'Single-page app publicat pe GitHub Pages, cu module clare și componente reutilizabile.',
      decision: 'Am centralizat fluxul într-un dashboard modular cu kanban, flow builder, RBAC și shortcut-uri de execuție.',
      priority: 'Predictibilitate în onboarding, claritate operațională și reducerea pașilor pentru update-uri recurente.',
      learning: 'Un flow compact și coerent ajută mai mult decât extinderea continuă a funcționalităților.',
      proof: [
        'Am redus pașii pentru update-uri recurente prin acțiuni rapide în dashboard.',
        'Am făcut onboarding-ul mai predictibil pentru utilizatori noi.',
        'Am reorganizat informația ca deciziile zilnice să se ia dintr-un singur punct.'
      ]
    },
    en: {
      context: 'Client data, tasks, and billing were spread across separate product areas.',
      problem: 'The same operation required too many screen switches, slowing execution and increasing error risk.',
      constraints: 'A GitHub Pages single-page app with clear modules and reusable components.',
      decision: 'I centralized the flow in a modular dashboard with kanban, flow builder, RBAC, and execution shortcuts.',
      priority: 'Predictable onboarding, operational clarity, and fewer steps for recurring updates.',
      learning: 'A compact, coherent flow delivers more value than continuously adding features.',
      proof: [
        'I reduced the steps for recurring updates through quick dashboard actions.',
        'I made onboarding more predictable for new users.',
        'I reorganized information so daily decisions can be made from one main point.'
      ]
    }
  }
};

let currentLang = localStorage.getItem('portfolio-lang') || 'ro';
if (!translations[currentLang]) currentLang = 'ro';
let activeFilter = 'all';
let projects = [];
let dom = {};
let searchDebounceId;
let previewSlideIndex = 0;
let previewIntervalId;
let previewAutoPlayAllowed = true;
let heroPreviewIsVisible = true;
const HERO_PREVIEW_AUTOPLAY_MS = 4500;

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
  const proofItems = (meta.proof || []).map(item => `<li>${item}</li>`).join('');
  const card = document.createElement('article');
  card.className = 'project-card glass';
  card.innerHTML = `
    <span class="tag">${project.category}</span>
    <h3>${project.title[currentLang]}</h3>
    <p class="project-desc">${project.description[currentLang]}</p>
    <div class="mini-grid">
      <div class="mini-item"><strong>${t('context')}</strong><span>${meta.context}</span></div>
      <div class="mini-item"><strong>${t('problem')}</strong><span>${meta.problem}</span></div>
      <div class="mini-item"><strong>${t('constraints')}</strong><span>${meta.constraints}</span></div>
      <div class="mini-item"><strong>${t('decision')}</strong><span>${meta.decision}</span></div>
      <div class="mini-item"><strong>${t('priority')}</strong><span>${meta.priority}</span></div>
      <div class="mini-item"><strong>${t('learning')}</strong><span>${meta.learning}</span></div>
    </div>
    <div class="project-proof"><strong>${t('proof')}</strong><ul>${proofItems}</ul></div>
    <div class="card-actions"><a class="btn btn-primary" href="${project.url}" target="_blank" rel="noopener noreferrer">${t('open')}</a></div>
  `;
  return card;
}

function updateFilterState(query, total) {
  const filterStateEl = document.getElementById('filterState');
  const separatorEl = document.getElementById('statusSeparator');
  const resultsCountEl = document.getElementById('resultsCount');
  if (!filterStateEl || !separatorEl || !resultsCountEl) return;

  const filterName = activeFilter === 'all' ? 'all' : activeFilter;
  const readableFilter = filterName.toUpperCase();
  const q = query ? `"${query}"` : '—';
  const text = t('filter_state').replace('{filter}', readableFilter).replace('{query}', q);
  resultsCountEl.textContent = String(total);

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
  if (!dom.searchInput || !dom.libraryGrid || !dom.libraryFallback) return;
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

  if (dom.searchInput && dom.libraryGrid && dom.libraryFallback) applyFilters();
}

function renderHeroPreviewChips() {
  if (!dom.heroPreviewLinks) return;
  dom.heroPreviewLinks.innerHTML = '';
  const fragment = document.createDocumentFragment();
  HERO_PREVIEW_SLIDES.forEach((slide, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chip';
    button.textContent = slide.title;
    button.setAttribute('aria-label', `Preview ${slide.title}`);
    button.addEventListener('click', () => {
      setHeroPreviewSlide(index);
      restartHeroPreviewAutoplay();
    });
    fragment.appendChild(button);
  });
  dom.heroPreviewLinks.appendChild(fragment);
}

function setHeroPreviewSlide(index) {
  if (!dom.heroPreviewFrame || !dom.heroPreviewTitle || !dom.heroPreviewOpen) return;
  previewSlideIndex = (index + HERO_PREVIEW_SLIDES.length) % HERO_PREVIEW_SLIDES.length;
  const slide = HERO_PREVIEW_SLIDES[previewSlideIndex];
  dom.heroPreviewFrame.src = slide.url;
  dom.heroPreviewFrame.title = slide.title;
  dom.heroPreviewTitle.textContent = slide.title;
  dom.heroPreviewOpen.href = slide.url;
  const chips = dom.heroPreviewLinks?.querySelectorAll('.chip') || [];
  chips.forEach((chip, chipIndex) => {
    const isActive = chipIndex === previewSlideIndex;
    chip.classList.toggle('active', isActive);
    chip.setAttribute('aria-pressed', String(isActive));
    if (isActive) {
      chip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  });
}

function restartHeroPreviewAutoplay() {
  window.clearInterval(previewIntervalId);
  if (!previewAutoPlayAllowed || !heroPreviewIsVisible || HERO_PREVIEW_SLIDES.length < 2) return;
  previewIntervalId = window.setInterval(() => {
    setHeroPreviewSlide(previewSlideIndex + 1);
  }, HERO_PREVIEW_AUTOPLAY_MS);
}

function stopHeroPreviewAutoplay() {
  window.clearInterval(previewIntervalId);
}

function disableHeroPreviewAutoplayPermanently() {
  previewAutoPlayAllowed = false;
  stopHeroPreviewAutoplay();
}

async function init() {
  dom = {
    hubExternalLink: document.getElementById('hubExternalLink'),
    searchInput: document.getElementById('searchInput'),
    filterChips: document.getElementById('filterChips'),
    themeToggle: document.getElementById('themeToggle'),
    langToggle: document.getElementById('langToggle'),
    keyProjectsGrid: document.getElementById('keyProjectsGrid'),
    libraryGrid: document.getElementById('libraryGrid'),
    libraryFallback: document.getElementById('libraryFallback'),
    resetFiltersBtn: document.getElementById('resetFiltersBtn'),
    heroPreviewFrame: document.getElementById('heroPreviewFrame'),
    heroPreviewOpen: document.getElementById('heroPreviewOpen'),
    heroPreviewTitle: document.getElementById('heroPreviewTitle'),
    heroPreviewLinks: document.getElementById('heroPreviewLinks')
  };
  if (dom.hubExternalLink) dom.hubExternalLink.href = HUB_URL;
  renderHeroPreviewChips();
  setHeroPreviewSlide(0);
  restartHeroPreviewAutoplay();
  dom.heroPreviewLinks?.addEventListener('pointerenter', stopHeroPreviewAutoplay);
  dom.heroPreviewLinks?.addEventListener('pointerleave', restartHeroPreviewAutoplay);
  window.addEventListener('wheel', disableHeroPreviewAutoplayPermanently, { passive: true, once: true });
  window.addEventListener('touchmove', disableHeroPreviewAutoplayPermanently, { passive: true, once: true });
  window.addEventListener('keydown', (event) => {
    if (['PageDown', 'ArrowDown', 'Space', 'Home', 'End'].includes(event.code)) {
      disableHeroPreviewAutoplayPermanently();
    }
  }, { once: true });

  const heroSection = document.getElementById('home');
  if ('IntersectionObserver' in window && heroSection) {
    const observer = new IntersectionObserver((entries) => {
      heroPreviewIsVisible = entries.some((entry) => entry.isIntersecting && entry.intersectionRatio > 0.35);
      if (heroPreviewIsVisible) {
        restartHeroPreviewAutoplay();
        return;
      }
      stopHeroPreviewAutoplay();
    }, { threshold: [0, 0.35, 1] });
    observer.observe(heroSection);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopHeroPreviewAutoplay();
      return;
    }
    restartHeroPreviewAutoplay();
  });

  try {
    const response = await fetch('projects.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    projects = await response.json();
  } catch (error) {
    console.error('Nu am putut încărca projects.json', error);
    projects = STATIC_FALLBACK_PROJECTS;
    if (dom.libraryGrid) {
      dom.libraryGrid.innerHTML = `<div class="empty-state">${currentLang === 'ro' ? 'Am încărcat o versiune fallback cu proiecte esențiale, deoarece projects.json nu a fost disponibil.' : 'Loaded fallback essentials because projects.json was unavailable.'}</div>`;
    }
  }

  render();

  dom.searchInput?.addEventListener('input', () => {
    window.clearTimeout(searchDebounceId);
    searchDebounceId = window.setTimeout(applyFilters, 120);
  });
  dom.filterChips?.addEventListener('click', (event) => {
    const chip = event.target.closest('[data-filter]');
    if (!chip) return;
    activeFilter = chip.dataset.filter;
    dom.filterChips.querySelectorAll('.chip').forEach(button => {
      const isActive = button.dataset.filter === activeFilter;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
    applyFilters();
  });
  dom.resetFiltersBtn?.addEventListener('click', () => {
    activeFilter = 'all';
    if (dom.searchInput) dom.searchInput.value = '';
    dom.filterChips?.querySelectorAll('.chip').forEach(button => {
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
