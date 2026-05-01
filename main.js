const PORTFOLIO_SOURCE_URL = 'https://es-d-5119724020260424-019d2b3a-2991-75d3-9c59-15de01ca8079.codepen.dev/';
const HUB_URL = `${PORTFOLIO_SOURCE_URL}#projects`;
const KEY_PROJECT_IDS = [49, 3, 18];
const GH_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.16c-3.2.7-3.87-1.37-3.87-1.37-.52-1.34-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.03 1.78 2.71 1.27 3.37.97.1-.75.4-1.27.73-1.56-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.69.42.36.78 1.05.78 2.12v3.14c0 .31.21.66.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z"/></svg>';
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
    url: 'https://es-d-1647531020260404-019d4e21-afd1-7808-abf5-d9c88b726df2.codepen.dev/'
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
    url: 'https://es-d-4029897220260413-019d7cd3-34b4-7538-a067-51b147dd0f7b.codepen.dev/'
  }
];
const STATIC_FALLBACK_GITHUB_PROJECTS = [
 {
  id: 23,
  title: { ro: 'Excel-Quest', en: 'Excel-Quest' },
  description: {
    ro: 'Case study despre transformarea unui landing într-un produs cu progres salvat și hub de reluare.',
    en: 'Case study on turning a landing page into a product with saved progress and a resume hub.'
  },
  category: 'github',
  tags: ['github', 'excel', 'education', 'ux'],
  url: 'projects/excel-quest.html',
  liveUrl: 'https://laurandreea10.github.io/Excel-Quest/excel-quest-hub.html',
  liveUrlPro: 'https://laurandreea10.github.io/Excel-Quest/enhanced-pro-v2.html',
  repoUrl: 'https://github.com/LaurAndreea10/Excel-Quest',
  isNew: true
}
  {
    id: 49,
    title: { ro: 'Alpis Fusion CRM Premium', en: 'Alpis Fusion CRM Premium' },
    description: {
      ro: 'CRM modular publicat cu focus pe fluxuri clare, roluri și automatizări.',
      en: 'Modular CRM published with a focus on clear flows, roles and automations.'
    },
    category: 'github',
    tags: ['github', 'crm', 'vite'],
    url: 'https://laurandreea10.github.io/Alpis-Fusion-CRM-premium/',
    liveUrl: 'https://laurandreea10.github.io/Alpis-Fusion-CRM-premium/',
    repoUrl: 'https://github.com/LaurAndreea10/Alpis-Fusion-CRM-premium'
  },
  {
    id: 3,
    title: { ro: 'ClientFlow', en: 'ClientFlow' },
    description: {
      ro: 'Dashboard CRM orientat pe task management și claritate operațională.',
      en: 'CRM dashboard focused on task management and operational clarity.'
    },
    category: 'github',
    tags: ['github', 'dashboard', 'crm'],
    url: 'https://laurandreea10.github.io/ClientFlow-SaaS-CRM-task-manager-automation-suite/',
    liveUrl: 'https://laurandreea10.github.io/ClientFlow-SaaS-CRM-task-manager-automation-suite/',
    repoUrl: 'https://github.com/LaurAndreea10/ClientFlow-PRO'
  },
  {
    id: 18,
    title: { ro: 'ALPIS Impact Path', en: 'ALPIS Impact Path' },
    description: {
      ro: 'Proiect educațional public, gândit pe structură și progres vizibil.',
      en: 'Public educational project designed around structure and visible progress.'
    },
    category: 'github',
    tags: ['github', 'education', 'ux'],
    url: 'https://github.com/LaurAndreea10/ALPIS-ImpactPath',
    repoUrl: 'https://github.com/LaurAndreea10/ALPIS-ImpactPath'
  }
];
const HERO_PREVIEW_SLIDES = [
  {
    title: 'Alpis Fusion CRM Premium',
    label: 'CRM premium',
    description: 'Colecție modulară pentru lead pipeline, task management, billing și automatizări.',
    meta: 'Vite + React · ~287KB build · Deploy automatizat',
    url: 'https://es-d-4029897220260413-019d7cd3-34b4-7538-a067-51b147dd0f7b.codepen.dev/',
  },
  {
    title: 'ARCADE WORLD',
    label: 'Arcade',
    description: 'Experimente arcade cu interacțiuni rapide, feedback vizual și ritm progresiv.',
    meta: 'Vanilla JS · Canvas · Game loop propriu',
    url: 'projects/arcade-fusion.html',
  },
  {
    title: 'Coaching AI',
    label: 'AI product',
    description: 'Interfață de coaching asistat AI, focusată pe flux clar și recomandări contextuale.',
    meta: 'Claude API · Conversational UI · State management',
    url: 'projects/coachingai.html',
  },
  {
    title: 'ClientFlow SaaS CRM',
    label: 'SaaS CRM',
    description: 'Sistem CRM orientat pe task-uri, automatizări și acțiuni operaționale zilnice.',
    meta: 'Kanban + triage · Shortcuts · Prioritizare vizuală',
    url: 'https://es-d-1647531020260404-019d4e21-afd1-7808-abf5-d9c88b726df2.codepen.dev/',
  },
  {
    title: 'Link Video Editor Studio',
    label: 'Video studio',
    description: 'Studio pentru editare video orientat pe workflow clar, navigare rapidă și prezentare premium.',
    meta: 'HTML · CSS · JavaScript · Deploy GitHub Pages',
    url: 'https://laurandreea10.github.io/Link-Video-Editor-Studio/',
    codeUrl: 'https://laurandreea10.github.io/Link-Video-Editor-Studio/'
  }
];

const translations = {
  ro: {
    brand: 'Portofoliu CodePen', nav_work: 'Top proiecte', nav_about: 'Despre mine', nav_contact: 'Contact',
    hero_eyebrow: 'CRM • Marketing • Front-end autodidact',
    hero_title: 'Construiesc interfețe CRM și dashboard-uri care transformă procese complicate în fluxuri clare',
    hero_text: 'Vin din CRM și marketing, iar în front-end mă concentrez pe produse unde structura, prioritizarea și feedback-ul vizual ajută utilizatorii să înțeleagă mai repede ce au de făcut și să acționeze fără fricțiune.',
    hero_cta: 'Scrie-mi despre un proiect', hero_cta_secondary: 'Scrie-mi despre un proiect',
    hero_proof_1: 'Kanban',
    hero_proof_2: 'Flow builder',
    hero_proof_3: 'RBAC',
    hero_proof_4: 'Billing',
    hero_proof_5: 'UI/UX orientat pe decizie', key_eyebrow: 'Proiecte-cheie',
    key_title: '3 proiecte care arată cel mai clar cum gândesc produsul și interfața',
    key_subtitle: 'Am ales 3 proiecte care mă reprezintă cel mai bine: structură clară, logică de produs, interfețe construite pentru acțiune și decizii UI/UX pe care le pot explica.',
    context: 'Rol / tip', problem: 'Problemă', constraints: 'Descriere', decision: 'Ce am construit', priority: 'Rezultat', learning: 'Focus', proof: 'CTA', open: 'Vezi proiectul',
    about_eyebrow: 'Despre mine', about_title: 'Context scurt',
    about_text: 'Vin din zona de CRM și marketing, iar asta îmi influențează felul în care construiesc interfețe: nu mă interesează doar cum arată un produs, ci și cum ghidează utilizatorul, cum reduce fricțiunea și cum susține obiective reale. În front-end mă atrag proiectele unde logica, structura și deciziile UI/UX fac diferența.',
    contact_eyebrow: 'Contact', contact_title: 'Lucrezi la un CRM, dashboard sau produs intern?',
    contact_text: 'Scrie-mi dacă vrei să vezi case study-urile complete, să discutăm o colaborare sau să-ți dau feedback pe un produs orientat pe fluxuri, claritate și UX.',
    contact_email: 'Scrie-mi despre un proiect', hub_eyebrow: 'Bibliotecă extinsă',
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
    hub_external: 'Explorează mai mult', results: 'rezultate', footer: 'Portofoliu selectat, construit în jurul proiectelor care mă reprezintă cel mai bine.',
    filter_state: 'Filtru: {filter} • Căutare: {query}',
    library_empty_fallback: 'Nu există rezultate pentru filtrul curent. Poți reveni la listarea completă sau accesa direct cele 3 proiecte-cheie:',
    reset_filters: 'Resetează filtrele',
    github_eyebrow: '🚀 Latest on GitHub',
    github_title: 'Cele mai noi proiecte cu repo public',
    github_meta: 'Cod public • Deploy automat • Open source',
    view_repo: 'View on GitHub',
    view_live: 'Live Demo',
    view_live_pro: 'Enhanced Pro',
    badge_new: 'NEW'
  },
  en: {
    brand: 'CodePen Portfolio', nav_work: 'Top projects', nav_about: 'About', nav_contact: 'Contact',
    hero_eyebrow: 'CRM • Marketing • Self-taught front-end',
    hero_title: 'I build CRM interfaces and dashboards that turn complex processes into clear flows.',
    hero_text: 'My background is in CRM and marketing, and in front-end I focus on products where structure, prioritization, and visual feedback help users understand faster what to do and act with less friction.',
    hero_cta: 'Write me about a project', hero_cta_secondary: 'Write me about a project',
    hero_proof_1: 'Kanban',
    hero_proof_2: 'Flow builder',
    hero_proof_3: 'RBAC',
    hero_proof_4: 'Billing',
    hero_proof_5: 'Decision-oriented UI/UX', key_eyebrow: 'Key projects',
    key_title: '3 projects that best show how I think about product and interface',
    key_subtitle: 'I selected 3 projects that represent me best: clear structure, product logic, action-oriented interfaces, and UI/UX decisions I can explain.',
    context: 'Role / type', problem: 'Problem', constraints: 'Description', decision: 'What I built', priority: 'Result', learning: 'Focus', proof: 'CTA', open: 'View project',
    about_eyebrow: 'About', about_title: 'Short context',
    about_text: 'I come from CRM and marketing, and that shapes how I build interfaces: I care not only how a product looks, but how it guides users, reduces friction, and supports real goals. In front-end, I am drawn to projects where logic, structure, and UI/UX decisions make the difference.',
    contact_eyebrow: 'Contact', contact_title: 'Are you working on a CRM, dashboard, or internal product?',
    contact_text: 'Write to me if you want full case studies, to discuss a collaboration, or to get feedback on a flow-oriented, clarity-first UX product.',
    contact_email: 'Write me about a project', hub_eyebrow: 'Extended library',
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
    hub_external: 'Explore more', results: 'results', footer: 'Selected portfolio, built around the projects that represent me best.',
    filter_state: 'Filter: {filter} • Search: {query}',
    library_empty_fallback: 'No results for the current filter. You can reset to the full list or jump straight to the 3 key projects:',
    reset_filters: 'Reset filters',
    github_eyebrow: '🚀 Latest on GitHub',
    github_title: 'Newest projects with public repo',
    github_meta: 'Public code • Auto deploy • Open source',
    view_repo: 'View on GitHub',
    view_live: 'Live Demo',
    view_live_pro: 'Enhanced Pro',
    badge_new: 'NEW'
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
      context: 'Design systems thinking • Module fusion • UX structure',
      problem: 'Multe produse cresc prin adăugiri succesive și ajung să pară lipite din bucăți, fără ierarhie clară.',
      constraints: 'Un proiect construit în jurul ideii de a combina pattern-uri, module și fluxuri diferite într-o experiență unitară.',
      decision: 'Am lucrat cu structură modulară, secțiuni coerente și logică de navigare care leagă mai natural zonele produsului.',
      priority: 'O experiență mai coerentă, mai ușor de înțeles și mai ușor de extins.',
      learning: 'Interfață modulară și coerență UX',
      proof: [
        'Vezi proiectul'
      ]
    },
    en: {
      context: 'Design systems thinking • Module fusion • UX structure',
      problem: 'Many products grow through successive additions and end up feeling stitched together without clear hierarchy.',
      constraints: 'A project built around combining patterns, modules, and different flows into one unified experience.',
      decision: 'I worked with modular structure, coherent sections, and navigation logic that naturally connects product areas.',
      priority: 'A more coherent experience that is easier to understand and easier to extend.',
      learning: 'Modular interface and UX coherence',
      proof: [
        'View project'
      ]
    }
  },
  18: {
    ro: {
      context: 'Front-end concept • UI feedback • Interaction clarity',
      problem: 'Când layout-ul, semnalele vizuale și stările UI nu sunt bine prioritizate, utilizatorul pierde timp și încredere.',
      constraints: 'Un proiect axat pe claritatea interacțiunii, ierarhie vizuală și feedback în interfață.',
      decision: 'Am lucrat cu layout adaptiv, componente clare, stări UI recognoscibile și prioritizare vizuală mai bună.',
      priority: 'O interfață mai ușor de parcurs și mai predictibilă pentru utilizator.',
      learning: 'Claritate de interacțiune și feedback UI',
      proof: [
        'Vezi proiectul'
      ]
    },
    en: {
      context: 'Front-end concept • UI feedback • Interaction clarity',
      problem: 'When layout, visual cues, and UI states are not well prioritized, users lose time and confidence.',
      constraints: 'A project focused on interaction clarity, visual hierarchy, and interface feedback.',
      decision: 'I worked with adaptive layout, clear components, recognizable UI states, and better visual prioritization.',
      priority: 'An interface that is easier to scan and more predictable for users.',
      learning: 'Interaction clarity and UI feedback',
      proof: [
        'View project'
      ]
    }
  }
  ,
  49: {
    ro: {
      context: 'CRM SPA • Product thinking • UI architecture',
      problem: 'Procesele devin greu de urmărit când informația este fragmentată, iar utilizatorul trebuie să schimbe prea multe contexte pentru a-și face treaba.',
      constraints: 'Un CRM construit ca sistem modular, gândit pentru echipe care au nevoie de claritate în lead-uri, task-uri, automatizări și billing.',
      decision: 'Am organizat produsul în module clare, cu kanban, flow builder, roluri și permisiuni, billing și componente reutilizabile care susțin o experiență coerentă.',
      priority: 'O interfață care reduce fricțiunea, face prioritățile mai vizibile și susține un ritm de lucru mai clar.',
      learning: 'Modularizare și product clarity',
      proof: [
        'Vezi proiectul'
      ]
    },
    en: {
      context: 'CRM SPA • Product thinking • UI architecture',
      problem: 'Processes become hard to follow when information is fragmented and users must switch too many contexts.',
      constraints: 'A CRM built as a modular system for teams that need clarity in leads, tasks, automations, and billing.',
      decision: 'I organized the product into clear modules with kanban, flow builder, roles and permissions, billing, and reusable components.',
      priority: 'An interface that reduces friction, makes priorities clearer, and supports a clearer working rhythm.',
      learning: 'Modularization and product clarity',
      proof: [
        'View project'
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
let keyCarouselIndex = 0;
let previewSlideIndex = 0;
let previewIntervalId;
let previewAutoPlayAllowed = true;
let heroPreviewIsVisible = true;
let heroPreviewFrameErrorTimer;
const HERO_PREVIEW_AUTOPLAY_MS = 4500;

function toggleHeroPreviewFallback(shouldShowFallback) {
  if (dom.heroPreviewFallback) {
    dom.heroPreviewFallback.style.opacity = shouldShowFallback ? '0.72' : '0';
  }
  if (dom.heroPreviewHint) {
    dom.heroPreviewHint.style.opacity = shouldShowFallback ? '1' : '0';
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function createHeroPreviewSrcdoc(slide) {
  const title = escapeHtml(slide.title || 'Project preview');
  const description = escapeHtml(slide.description || '');
  const meta = escapeHtml(slide.meta || '');
  const safeUrl = escapeHtml(slide.url || '#');
  return `<!doctype html>
<html lang="${currentLang}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      :root { color-scheme: dark; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 20px;
        font-family: Inter, Segoe UI, Roboto, Arial, sans-serif;
        background:
          radial-gradient(circle at 12% 15%, rgba(79,140,255,.24), transparent 45%),
          radial-gradient(circle at 88% 82%, rgba(139,92,246,.22), transparent 48%),
          #081326;
        color: #e8f0ff;
      }
      .card {
        width: min(640px, 100%);
        border: 1px solid rgba(255,255,255,.14);
        border-radius: 16px;
        background: rgba(8, 22, 46, 0.86);
        padding: 20px;
      }
      h1 { margin: 0 0 10px; font-size: 1.3rem; line-height: 1.2; }
      p { margin: 0 0 10px; color: #b8cae8; line-height: 1.55; }
      .meta { font-size: .85rem; color: #c9dcff; margin-bottom: 14px; }
      a {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        text-decoration: none;
        color: #051022;
        background: linear-gradient(135deg, #60a5fa, #a78bfa);
        border-radius: 999px;
        padding: 10px 16px;
        font-weight: 700;
      }
    </style>
  </head>
  <body>
    <article class="card">
      <h1>${title}</h1>
      <p>${description}</p>
      <p class="meta">${meta}</p>
      <a href="${safeUrl}" target="_blank" rel="noopener noreferrer">
        ${currentLang === 'ro' ? 'Deschide proiectul complet' : 'Open full project'}
      </a>
    </article>
  </body>
</html>`;
}

function loadHeroPreviewFrame(slide) {
  if (!dom.heroPreviewFrame) return;
  window.clearTimeout(heroPreviewFrameErrorTimer);
  toggleHeroPreviewFallback(false);
  const resolvedUrl = new URL(slide.url, window.location.href);
  const isExternal = resolvedUrl.origin !== window.location.origin;
  dom.heroPreviewFrame.removeAttribute('srcdoc');
  if (isExternal) {
    dom.heroPreviewFrame.srcdoc = createHeroPreviewSrcdoc(slide);
    return;
  }
  dom.heroPreviewFrame.src = resolvedUrl.toString();
  heroPreviewFrameErrorTimer = window.setTimeout(() => {
    dom.heroPreviewFrame.srcdoc = createHeroPreviewSrcdoc(slide);
    toggleHeroPreviewFallback(false);
  }, 2600);
}

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
  const latestMeta = document.getElementById('githubMeta');
  if (fallbackText) fallbackText.textContent = t('library_empty_fallback');
  if (resetButton) resetButton.textContent = t('reset_filters');
  if (latestMeta) latestMeta.textContent = t('github_meta');
}

function createLibraryCard(project) {
  const card = document.createElement('article');
  card.className = 'project-card glass';
  const title = project.title[currentLang];
  const description = project.description[currentLang];
  const tag = document.createElement('span');
  tag.className = `tag ${project.category || ''}`.trim();
  tag.textContent = project.category;

  const heading = document.createElement('h3');
  heading.textContent = title;

  const desc = document.createElement('p');
  desc.className = 'project-desc';
  desc.textContent = description;

  const actions = document.createElement('div');
  actions.className = 'card-actions';

  if (project.isNew) {
    const newBadge = document.createElement('span');
    newBadge.className = 'badge-new';
    newBadge.textContent = t('badge_new');
    card.append(newBadge);
  }

  const top = document.createElement('div');
  top.className = 'project-top';
  const topLeft = document.createElement('div');
  topLeft.append(heading);
  if (project.repoUrl) {
    const ghBadge = document.createElement('span');
    ghBadge.className = 'badge-github';
    ghBadge.innerHTML = `${GH_ICON}<span>GitHub</span>`;
    topLeft.append(ghBadge);
  }
  top.append(topLeft, tag);

  if (project.liveUrl) {
    const liveBtn = document.createElement('a');
    liveBtn.className = 'mini-btn primary';
    liveBtn.href = project.liveUrl;
    liveBtn.target = '_blank';
    liveBtn.rel = 'noopener noreferrer';
    liveBtn.textContent = t('view_live');
    actions.append(liveBtn);
  }

  if (project.liveUrlPro) {
    const liveProBtn = document.createElement('a');
    liveProBtn.className = 'mini-btn';
    liveProBtn.href = project.liveUrlPro;
    liveProBtn.target = '_blank';
    liveProBtn.rel = 'noopener noreferrer';
    liveProBtn.textContent = t('view_live_pro');
    actions.append(liveProBtn);
  }

  if (project.repoUrl) {
    const repoBtn = document.createElement('a');
    repoBtn.className = 'mini-btn';
    repoBtn.href = project.repoUrl;
    repoBtn.target = '_blank';
    repoBtn.rel = 'noopener noreferrer';
    repoBtn.innerHTML = `${GH_ICON}<span style="margin-left:6px">${t('view_repo')}</span>`;
    actions.append(repoBtn);
  } else {
    const link = document.createElement('a');
    link.className = 'btn btn-secondary';
    link.href = project.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = t('open');
    actions.append(link);
  }

  card.append(top, desc, actions);
  return card;
}

function renderLatestGithub() {
  const latestGrid = document.getElementById('latestGithubGrid');
  if (!latestGrid) return;
  latestGrid.innerHTML = '';
  const fragment = document.createDocumentFragment();
  const sourceProjects = Array.isArray(projects) ? projects : [];
  const githubProjects = sourceProjects.filter(project => (project.category || '').toLowerCase() === 'github');
  const fallbackFromRepoUrls = sourceProjects.filter(project => project.repoUrl);
  const latestProjects = (githubProjects.length ? githubProjects : (fallbackFromRepoUrls.length ? fallbackFromRepoUrls : STATIC_FALLBACK_GITHUB_PROJECTS))
    .sort((a, b) => (Number(b.id) || 0) - (Number(a.id) || 0))
    .slice(0, 6);
  latestProjects.forEach(project => fragment.appendChild(createLibraryCard(project)));
  latestGrid.appendChild(fragment);
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
  const sourceProjects = Array.isArray(projects) && projects.length ? projects : STATIC_FALLBACK_PROJECTS;
  const normalizedFilter = (activeFilter || 'all').toLowerCase();
  const filtered = sourceProjects.filter(project => {
    const projectCategory = (project.category || '').toLowerCase();
    const matchFilter = normalizedFilter === 'all' || projectCategory === normalizedFilter;
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
  renderLatestGithub();
  setupKeyProjectsCarousel();

  if (dom.searchInput && dom.libraryGrid && dom.libraryFallback) applyFilters();
}

function renderKeyCarouselDots(totalSlides) {
  if (!dom.keyCarouselDots) return;
  dom.keyCarouselDots.innerHTML = '';
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < totalSlides; index += 1) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'key-carousel-dot';
    dot.setAttribute('aria-label', `Slide ${index + 1}`);
    dot.addEventListener('click', () => setKeyCarouselSlide(index));
    fragment.appendChild(dot);
  }
  dom.keyCarouselDots.appendChild(fragment);
}

function setKeyCarouselSlide(index) {
  if (!dom.keyProjectsGrid) return;
  const cards = dom.keyProjectsGrid.querySelectorAll('.project-card');
  if (!cards.length) return;
  keyCarouselIndex = (index + cards.length) % cards.length;
  dom.keyProjectsGrid.style.transform = `translateX(-${keyCarouselIndex * 100}%)`;
  dom.keyCarouselPrev?.toggleAttribute('disabled', cards.length < 2);
  dom.keyCarouselNext?.toggleAttribute('disabled', cards.length < 2);
  const dots = dom.keyCarouselDots?.querySelectorAll('.key-carousel-dot') || [];
  dots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === keyCarouselIndex;
    dot.classList.toggle('active', isActive);
    dot.setAttribute('aria-pressed', String(isActive));
  });
}

function setupKeyProjectsCarousel() {
  if (!dom.keyProjectsGrid) return;
  const cards = dom.keyProjectsGrid.querySelectorAll('.project-card');
  if (!cards.length) return;
  keyCarouselIndex = 0;
  renderKeyCarouselDots(cards.length);
  setKeyCarouselSlide(0);
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

function keepActiveChipInView(chip) {
  const container = dom.heroPreviewLinks;
  if (!container || !chip) return;
  const containerRect = container.getBoundingClientRect();
  const chipRect = chip.getBoundingClientRect();
  const chipLeft = chipRect.left - containerRect.left + container.scrollLeft;
  const chipRight = chipLeft + chipRect.width;
  const visibleLeft = container.scrollLeft;
  const visibleRight = visibleLeft + container.clientWidth;

  if (chipLeft < visibleLeft) {
    container.scrollTo({ left: chipLeft - 8, behavior: 'smooth' });
    return;
  }

  if (chipRight > visibleRight) {
    container.scrollTo({ left: chipRight - container.clientWidth + 8, behavior: 'smooth' });
  }
}

function setHeroPreviewSlide(index) {
  if (!dom.heroPreviewTitle || !dom.heroPreviewOpen) return;
  previewSlideIndex = (index + HERO_PREVIEW_SLIDES.length) % HERO_PREVIEW_SLIDES.length;
  const slide = HERO_PREVIEW_SLIDES[previewSlideIndex];
  dom.heroPreviewTitle.textContent = slide.title;
  dom.heroPreviewOpen.href = slide.url;
  if (dom.heroPreviewOpenSecondary) dom.heroPreviewOpenSecondary.href = slide.url;
  if (dom.heroPreviewHeading) dom.heroPreviewHeading.textContent = slide.title;
  if (dom.heroPreviewMeta) dom.heroPreviewMeta.textContent = slide.meta || '';
  if (dom.heroPreviewDescription) dom.heroPreviewDescription.textContent = slide.description;
  if (dom.heroPreviewType) dom.heroPreviewType.textContent = slide.label;
  if (dom.heroPreviewUrl) {
    const cleanUrl = slide.url.replace(/^https?:\/\//, '');
    dom.heroPreviewUrl.textContent = cleanUrl;
    dom.heroPreviewUrl.href = slide.url;
  }
  if (dom.heroPreviewCode) dom.heroPreviewCode.href = slide.url;
  loadHeroPreviewFrame(slide);
  const chips = dom.heroPreviewLinks?.querySelectorAll('.chip') || [];
  chips.forEach((chip, chipIndex) => {
    const isActive = chipIndex === previewSlideIndex;
    chip.classList.toggle('active', isActive);
    chip.setAttribute('aria-pressed', String(isActive));
    if (isActive) keepActiveChipInView(chip);
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

function initVideoCards() {
  const cards = document.querySelectorAll('.project-card-video');
  if (!cards.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  cards.forEach(card => {
    const video = card.querySelector('.card-video');
    if (!video) return;
    let hasPlayed = card.classList.contains('has-played');
    const openUrl = card.dataset.openUrl || '';

    const play = () => {
      if (prefersReducedMotion) return;
      video.play().then(() => {
        card.classList.add('is-playing');
        if (!hasPlayed) {
          card.classList.add('has-played');
          hasPlayed = true;
        }
      }).catch(() => {});
    };

    const pause = () => {
      video.pause();
      card.classList.remove('is-playing');
    };

    const reset = () => {
      pause();
      video.currentTime = 0;
    };

    if (!card.dataset.videoInitialized) {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (event) => {
        if (!openUrl) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          window.open(openUrl, '_blank', 'noopener,noreferrer');
        }
      });

      if (!isTouch) {
        card.addEventListener('mouseenter', play);
        card.addEventListener('mouseleave', reset);
        card.addEventListener('click', (event) => {
          if (!openUrl) return;
          event.preventDefault();
          window.open(openUrl, '_blank', 'noopener,noreferrer');
        });
      } else {
        card.addEventListener('click', (event) => {
          event.preventDefault();
          if (video.paused) {
            play();
          } else {
            pause();
          }
        });
      }
      card.dataset.videoInitialized = 'true';
    }

    if (isTouch && 'IntersectionObserver' in window && !video.dataset.ioBound) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting && !video.paused) pause();
        });
      }, { threshold: 0.3 });
      io.observe(card);
      video.dataset.ioBound = 'true';
    }
  });
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
    heroPreviewOpen: document.getElementById('heroPreviewOpen'),
    heroPreviewOpenSecondary: document.getElementById('heroPreviewOpenSecondary'),
    heroPreviewTitle: document.getElementById('heroPreviewTitle'),
    heroPreviewHeading: document.getElementById('heroPreviewHeading'),
    heroPreviewMeta: document.getElementById('heroPreviewMeta'),
    heroPreviewDescription: document.getElementById('heroPreviewDescription'),
    heroPreviewType: document.getElementById('heroPreviewType'),
    heroPreviewUrl: document.getElementById('heroPreviewUrl'),
    heroPreviewCode: document.getElementById('heroPreviewCode'),
    heroPreviewLinks: document.getElementById('heroPreviewLinks'),
    heroPreviewFrame: document.getElementById('heroPreviewFrame'),
    heroPreviewFallback: document.getElementById('heroPreviewFallback'),
    heroPreviewHint: document.getElementById('heroPreviewHint'),
    keyCarouselPrev: document.getElementById('keyCarouselPrev'),
    keyCarouselNext: document.getElementById('keyCarouselNext'),
    keyCarouselDots: document.getElementById('keyCarouselDots')
  };
  dom.heroPreviewFrame?.addEventListener('load', () => {
    window.clearTimeout(heroPreviewFrameErrorTimer);
    toggleHeroPreviewFallback(false);
  });
  dom.heroPreviewFrame?.addEventListener('error', () => {
    window.clearTimeout(heroPreviewFrameErrorTimer);
    toggleHeroPreviewFallback(true);
  });
  if (dom.hubExternalLink) dom.hubExternalLink.href = HUB_URL;
  renderHeroPreviewChips();
  setHeroPreviewSlide(0);
  restartHeroPreviewAutoplay();
  dom.heroPreviewLinks?.addEventListener('pointerenter', stopHeroPreviewAutoplay);
  dom.heroPreviewLinks?.addEventListener('pointerleave', restartHeroPreviewAutoplay);
  dom.keyCarouselPrev?.addEventListener('click', () => setKeyCarouselSlide(keyCarouselIndex - 1));
  dom.keyCarouselNext?.addEventListener('click', () => setKeyCarouselSlide(keyCarouselIndex + 1));
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
  initVideoCards();

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
    initVideoCards();
  });
}

document.addEventListener('DOMContentLoaded', init);
