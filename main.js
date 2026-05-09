const PORTFOLIO_SOURCE_URL='https://es-d-5119724020260424-019d2b3a-2991-75d3-9c59-15de01ca8079.codepen.dev/';
const HUB_URL=`${PORTFOLIO_SOURCE_URL}#projects`;
const KEY_PROJECT_IDS=[49,3,18];
const GH_ICON='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.16c-3.2.7-3.87-1.37-3.87-1.37-.52-1.34-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.03 1.78 2.71 1.27 3.37.97.1-.75.4-1.27.73-1.56-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.69.42.36.78 1.05.78 2.12v3.14c0 .31.21.66.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z"/></svg>';

const STATIC_FALLBACK_PROJECTS=[
{id:1,title:{ro:'Arcade Fusion',en:'Arcade Fusion'},description:{ro:'Joc arcade cu feedback instant, scor live și ritm progresiv.',en:'Arcade game with instant feedback, live score and progressive pace.'},category:'game',tags:['arcade','js','ux'],url:'projects/arcade-fusion.html'},
{id:3,title:{ro:'ClientFlow',en:'ClientFlow'},description:{ro:'Dashboard utilitar pentru lead-uri, task-uri și urmărirea acțiunilor.',en:'Utility dashboard for leads, tasks and action tracking.'},category:'utility',tags:['crm','dashboard','workflow'],url:'https://es-d-1647531020260404-019d4e21-afd1-7808-abf5-d9c88b726df2.codepen.dev/'},
{id:49,title:{ro:'Alpis Fusion CRM Premium',en:'Alpis Fusion CRM Premium'},description:{ro:'CRM modular cu kanban, flow builder, roluri și billing într-un singur SPA.',en:'Modular CRM with kanban, flow builder, roles and billing in one SPA.'},category:'ui',tags:['crm','rbac','kanban'],url:'https://es-d-4029897220260413-019d7cd3-34b4-7538-a067-51b147dd0f7b.codepen.dev/'},
{id:55,title:{ro:'Excel-Quest',en:'Excel-Quest'},description:{ro:'Aplicație educațională gamificată pentru învățarea Excel cu structură de quest și progres vizibil.',en:'Gamified educational app for learning Excel with quest structure and visible progress.'},category:'github',tags:['github','education','excel','pages'],url:'projects/excel-quest.html',liveUrl:'https://laurandreea10.github.io/Excel-Quest/',repoUrl:'https://github.com/LaurAndreea10/Excel-Quest',isNew:true},
{id:50,title:{ro:'BASKET VS AI',en:'BASKET VS AI'},description:{ro:'Joc arcade cu două variante live: Main și Enhanced Pro. Deploy automat, repo public.',en:'Arcade game with two live builds: Main and Enhanced Pro. Auto deploy, public repo.'},category:'github',tags:['github','game','ai','arcade'],url:'https://laurandreea10.github.io/BASKET-VS-AI/',liveUrl:'https://laurandreea10.github.io/BASKET-VS-AI/',liveUrlPro:'https://laurandreea10.github.io/BASKET-VS-AI/enhanced.html',repoUrl:'https://github.com/LaurAndreea10/BASKET-VS-AI',isNew:true},
{id:51,title:{ro:'Link Video Editor Studio',en:'Link Video Editor Studio'},description:{ro:'Studio front-end pentru planuri de producție video cu zone funcționale clare.',en:'Front-end studio for video production plans with clear functional zones.'},category:'github',tags:['github','video','tool','studio'],url:'https://laurandreea10.github.io/Link-Video-Editor-Studio/',liveUrl:'https://laurandreea10.github.io/Link-Video-Editor-Studio/',repoUrl:'https://github.com/LaurAndreea10/Link-Video-Editor-Studio',isNew:true},
{id:52,title:{ro:'ARCADE-WORLD',en:'ARCADE-WORLD'},description:{ro:'Lume arcade pe GitHub Pages cu estetică retro-modernă și prezentare orientată pe explorare.',en:'Arcade world on GitHub Pages with retro-modern aesthetics and exploration-focused presentation.'},category:'github',tags:['github','arcade','game','pages'],url:'https://laurandreea10.github.io/ARCADE-WORLD/',liveUrl:'https://laurandreea10.github.io/ARCADE-WORLD/',repoUrl:'https://github.com/LaurAndreea10/ARCADE-WORLD',isNew:true},
{id:53,title:{ro:'BACapp',en:'BACapp'},description:{ro:'Aplicație de pregătire BAC cu structură clară și conținut educațional organizat pe secțiuni.',en:'BAC prep app with clear structure and educational content organized into distinct sections.'},category:'github',tags:['github','education','bac','app'],url:'https://github.com/LaurAndreea10/BACapp',repoUrl:'https://github.com/LaurAndreea10/BACapp',isNew:true},
{id:54,title:{ro:'Brief Studio',en:'Brief Studio'},description:{ro:'Platformă SaaS bilingvă RO/EN pentru gestionarea brief-urilor și comunicarea cu clienții.',en:'Bilingual RO/EN SaaS platform for brief management and client communication.'},category:'github',tags:['github','crm','saas','brief','dashboard'],url:'https://laurandreea10.github.io/brief-studio/index.html',liveUrl:'https://laurandreea10.github.io/brief-studio/index.html',repoUrl:'https://github.com/LaurAndreea10/brief-studio',isNew:true},
{id:56,title:{ro:'ClientOps Suite Premium',en:'ClientOps Suite Premium'},description:{ro:'Suită CRM premium cu fluxuri operaționale avansate, automatizări și dashboard unificat.',en:'Premium CRM suite with advanced operational flows, automations and unified dashboard.'},category:'github',tags:['github','crm','saas','premium'],url:'https://github.com/LaurAndreea10/clientops-suite-app-premium',repoUrl:'https://github.com/LaurAndreea10/clientops-suite-app-premium',isNew:true},
{id:57,title:{ro:'ClientOps',en:'ClientOps'},description:{ro:'Dashboard CRM operațional cu flux clar pentru gestionarea clienților și task-urilor zilnice.',en:'Operational CRM dashboard with clear flow for managing clients and daily tasks.'},category:'github',tags:['github','crm','dashboard','ops'],url:'https://laurandreea10.github.io/clientops/',liveUrl:'https://laurandreea10.github.io/clientops/',repoUrl:'https://github.com/LaurAndreea10/clientops',isNew:true},
{id:58,title:{ro:'LUMA',en:'LUMA'},description:{ro:'Challenge front-end cu estetică vizuală distinctă și interacțiuni fluide.',en:'Front-end challenge with distinctive visual aesthetics and fluid interactions.'},category:'challenge',tags:['github','challenge','ui','design'],url:'https://laurandreea10.github.io/LUMA/',liveUrl:'https://laurandreea10.github.io/LUMA/',repoUrl:'https://github.com/LaurAndreea10/LUMA',isNew:true},
{id:59,title:{ro:'ARCADE-OPS Excel Quest',en:'ARCADE-OPS Excel Quest'},description:{ro:'Variantă arcade a Excel Quest cu gameplay ops-oriented și mecanici progresive.',en:'Arcade variant of Excel Quest with ops-oriented gameplay and progressive mechanics.'},category:'challenge',tags:['github','arcade','excel','ops'],url:'https://laurandreea10.github.io/ARCADE-OPS-EXCEL-QUEST/',liveUrl:'https://laurandreea10.github.io/ARCADE-OPS-EXCEL-QUEST/',repoUrl:'https://github.com/LaurAndreea10/ARCADE-OPS-EXCEL-QUEST',isNew:true},
{id:60,title:{ro:'Arcade-Ops Excel Quest v2',en:'Arcade-Ops Excel Quest v2'},description:{ro:'Versiunea v2 a Arcade-Ops cu gameplay îmbunătățit și interfață actualizată.',en:'v2 of Arcade-Ops with improved gameplay and updated interface.'},category:'challenge',tags:['github','arcade','excel','v2'],url:'https://laurandreea10.github.io/Arcade-Ops-EXCEL-QUEST-v2/',liveUrl:'https://laurandreea10.github.io/Arcade-Ops-EXCEL-QUEST-v2/',repoUrl:'https://github.com/LaurAndreea10/Arcade-Ops-EXCEL-QUEST-v2',isNew:true},
{id:61,title:{ro:'ARCADE-OPS Excel Quest HQ',en:'ARCADE-OPS Excel Quest HQ'},description:{ro:'Ediție HQ cu grafică îmbunătățită și experiență de joc rafinată.',en:'HQ edition with improved graphics and refined game experience.'},category:'challenge',tags:['github','arcade','excel','hq'],url:'https://laurandreea10.github.io/ARCADE-OPS-EXCEL-QUEST-HQ/',liveUrl:'https://laurandreea10.github.io/ARCADE-OPS-EXCEL-QUEST-HQ/',repoUrl:'https://github.com/LaurAndreea10/ARCADE-OPS-EXCEL-QUEST-HQ',isNew:true},
{id:62,title:{ro:'ARCADE-OPS HQ',en:'ARCADE-OPS HQ'},description:{ro:'Versiune HQ standalone cu focus pe gameplay arcade curat și performanță maximă.',en:'Standalone HQ version focused on clean arcade gameplay and maximum performance.'},category:'challenge',tags:['github','arcade','hq','ops'],url:'https://laurandreea10.github.io/ARCADE-OPS-HQ/',liveUrl:'https://laurandreea10.github.io/ARCADE-OPS-HQ/',repoUrl:'https://github.com/LaurAndreea10/ARCADE-OPS-HQ',isNew:true},
{id:63,title:{ro:'ARCADE-OPS v5',en:'ARCADE-OPS v5'},description:{ro:'Iterație v5 a seriei Arcade-Ops cu mecanici noi și design sistem evoluat.',en:'v5 iteration of the Arcade-Ops series with new mechanics and evolved design system.'},category:'challenge',tags:['github','arcade','v5','ops'],url:'https://laurandreea10.github.io/ARCADE-OPS-v5/',liveUrl:'https://laurandreea10.github.io/ARCADE-OPS-v5/',repoUrl:'https://github.com/LaurAndreea10/ARCADE-OPS-v5',isNew:true}
];

const STATIC_FALLBACK_GITHUB_PROJECTS=[
{id:23,title:{ro:'Excel-Quest',en:'Excel-Quest'},description:{ro:'Case study despre transformarea unui landing într-un produs cu progres salvat și hub de reluare.',en:'Case study on turning a landing page into a product with saved progress and a resume hub.'},category:'github',tags:['github','excel','education','ux'],url:'projects/excel-quest.html',liveUrl:'https://laurandreea10.github.io/Excel-Quest/excel-quest-hub.html',liveUrlPro:'https://laurandreea10.github.io/Excel-Quest/enhanced-pro-v2.html',repoUrl:'https://github.com/LaurAndreea10/Excel-Quest',isNew:true},
{id:49,title:{ro:'Alpis Fusion CRM Premium',en:'Alpis Fusion CRM Premium'},description:{ro:'CRM modular publicat cu focus pe fluxuri clare, roluri și automatizări.',en:'Modular CRM published with a focus on clear flows, roles and automations.'},category:'github',tags:['github','crm','vite'],url:'https://laurandreea10.github.io/Alpis-Fusion-CRM-premium/',liveUrl:'https://laurandreea10.github.io/Alpis-Fusion-CRM-premium/',repoUrl:'https://github.com/LaurAndreea10/Alpis-Fusion-CRM-premium'},
{id:3,title:{ro:'ClientFlow',en:'ClientFlow'},description:{ro:'Dashboard CRM orientat pe task management și claritate operațională.',en:'CRM dashboard focused on task management and operational clarity.'},category:'github',tags:['github','dashboard','crm'],url:'https://laurandreea10.github.io/ClientFlow-SaaS-CRM-task-manager-automation-suite/',liveUrl:'https://laurandreea10.github.io/ClientFlow-SaaS-CRM-task-manager-automation-suite/',repoUrl:'https://github.com/LaurAndreea10/ClientFlow-PRO'},
{id:18,title:{ro:'ALPIS Impact Path',en:'ALPIS Impact Path'},description:{ro:'Proiect educațional public, gândit pe structură și progres vizibil.',en:'Public educational project designed around structure and visible progress.'},category:'github',tags:['github','education','ux'],url:'https://github.com/LaurAndreea10/ALPIS-ImpactPath',repoUrl:'https://github.com/LaurAndreea10/ALPIS-ImpactPath'},
{id:54,title:{ro:'Brief Studio',en:'Brief Studio'},description:{ro:'Platformă SaaS bilingvă RO/EN pentru gestionarea brief-urilor și comunicarea cu clienții.',en:'Bilingual RO/EN SaaS platform for brief management and client communication.'},category:'github',tags:['github','crm','saas','brief','dashboard'],url:'https://laurandreea10.github.io/brief-studio/index.html',liveUrl:'https://laurandreea10.github.io/brief-studio/index.html',repoUrl:'https://github.com/LaurAndreea10/brief-studio',isNew:true},
{id:56,title:{ro:'ClientOps Suite Premium',en:'ClientOps Suite Premium'},description:{ro:'Suită CRM premium cu automatizări avansate și dashboard unificat.',en:'Premium CRM suite with advanced automations and unified dashboard.'},category:'github',tags:['github','crm','saas'],url:'https://github.com/LaurAndreea10/clientops-suite-app-premium',repoUrl:'https://github.com/LaurAndreea10/clientops-suite-app-premium',isNew:true},
{id:57,title:{ro:'ClientOps',en:'ClientOps'},description:{ro:'Dashboard CRM operațional orientat pe claritate și flux zilnic.',en:'Operational CRM dashboard focused on clarity and daily flow.'},category:'github',tags:['github','crm','dashboard'],url:'https://laurandreea10.github.io/clientops/',liveUrl:'https://laurandreea10.github.io/clientops/',repoUrl:'https://github.com/LaurAndreea10/clientops',isNew:true}
];

const HERO_PREVIEW_SLIDES=[
{title:'Alpis Fusion CRM Premium',label:'CRM premium',description:'Colecție modulară pentru lead pipeline, task management, billing și automatizări.',meta:'Vite + React · ~287KB build · Deploy automatizat',url:'https://es-d-4029897220260413-019d7cd3-34b4-7538-a067-51b147dd0f7b.codepen.dev/'},
{title:'ARCADE WORLD',label:'Arcade',description:'Experimente arcade cu interacțiuni rapide, feedback vizual și ritm progresiv.',meta:'Vanilla JS · Canvas · Game loop propriu',url:'projects/arcade-fusion.html'},
{title:'Coaching AI',label:'AI product',description:'Interfață de coaching asistat AI, focusată pe flux clar și recomandări contextuale.',meta:'Claude API · Conversational UI · State management',url:'projects/coachingai.html'},
{title:'ClientFlow SaaS CRM',label:'SaaS CRM',description:'Sistem CRM orientat pe task-uri, automatizări și acțiuni operaționale zilnice.',meta:'Kanban + triage · Shortcuts · Prioritizare vizuală',url:'https://es-d-1647531020260404-019d4e21-afd1-7808-abf5-d9c88b726df2.codepen.dev/'},
{title:'Link Video Editor Studio',label:'Video studio',description:'Studio pentru editare video orientat pe workflow clar, navigare rapidă și prezentare premium.',meta:'HTML · CSS · JavaScript · Deploy GitHub Pages',url:'https://laurandreea10.github.io/Link-Video-Editor-Studio/',codeUrl:'https://laurandreea10.github.io/Link-Video-Editor-Studio/'}
];

const translations={
ro:{brand:'Portofoliu CodePen',nav_work:'Top proiecte',nav_about:'Despre mine',nav_contact:'Contact',hero_eyebrow:'CRM • Marketing • Front-end autodidact',hero_title:'Construiesc interfețe CRM și dashboard-uri care transformă procese complicate în fluxuri clare',hero_text:'Vin din CRM și marketing, iar în front-end mă concentrez pe produse unde structura, prioritizarea și feedback-ul vizual ajută utilizatorii să înțeleagă mai repede ce au de făcut și să acționeze fără fricțiune.',hero_cta:'Scrie-mi despre un proiect',hero_cta_secondary:'Scrie-mi despre un proiect',hero_proof_1:'Kanban',hero_proof_2:'Flow builder',hero_proof_3:'RBAC',hero_proof_4:'Billing',hero_proof_5:'UI/UX orientat pe decizie',key_eyebrow:'Proiecte-cheie',key_title:'3 proiecte care arată cel mai clar cum gândesc produsul și interfața',key_subtitle:'Am ales 3 proiecte care mă reprezintă cel mai bine: structură clară, logică de produs, interfețe construite pentru acțiune și decizii UI/UX pe care le pot explica.',context:'Rol / tip',problem:'Problemă',constraints:'Descriere',decision:'Ce am construit',priority:'Rezultat',learning:'Focus',proof:'CTA',open:'Vezi proiectul',about_eyebrow:'Despre mine',about_title:'Context scurt',about_text:'Vin din zona de CRM și marketing, iar asta îmi influențează felul în care construiesc interfețe: nu mă interesează doar cum arată un produs, ci și cum ghidează utilizatorul, cum reduce fricțiunea și cum susține obiective reale. În front-end mă atrag proiectele unde logica, structura și deciziile UI/UX fac diferența.',contact_eyebrow:'Contact',contact_title:'Lucrezi la un CRM, dashboard sau produs intern?',contact_text:'Scrie-mi dacă vrei să vezi case study-urile complete, să discutăm o colaborare sau să-ți dau feedback pe un produs orientat pe fluxuri, claritate și UX.',contact_email:'Scrie-mi despre un proiect',hub_eyebrow:'Bibliotecă extinsă',blog_eyebrow:'Blog',blog_title:'Ce am învățat pe drum',blog_note:'O selecție de reflecții, observații și idei desprinse din procesul meu de învățare, lucru practic și construcție de proiecte. Secțiunea aceasta completează portofoliul cu partea de gândire din spatele execuției.',blog_cta:'Deschide blogul',parcurs_eyebrow:'Parcurs',parcurs_title:'De la CRM la cod — parcursul meu',parcurs_note:'Experiența mea profesională a început în zone în care claritatea, organizarea și înțelegerea utilizatorului erau esențiale: CRM, marketing, content și campanii digitale. În timp, interesul pentru partea practică a produselor digitale a crescut firesc. Nu m-a interesat doar cum se comunică un produs, ci și cum se construiește, cum reacționează, cum ghidează utilizatorul și cum transmite claritate prin interfață. Front-end development a devenit astfel o continuare logică a parcursului meu: o combinație între structură, creativitate, logică și atenție reală la experiența utilizatorului.',parcurs_cta:'Deschide Parcurs',preview_eyebrow:'Preview live',preview_title:'Preview live',preview_note:'Aici poți vedea unul dintre proiectele mele direct în portofoliu, într-un format gândit pentru explorare rapidă și experiență fluentă. Această zonă funcționează ca demonstrație practică a modului în care construiesc interacțiuni clare, feedback vizual și flow coerent între utilizator și interfață.',preview_cta:'Deschide proiectul',crm_eyebrow:'CRM',crm_title:'Sisteme CRM și flow-uri orientate pe utilizator',crm_note:'Secțiune dedicată proiectelor în care combin organizarea datelor, automatizarea și experiența utilizatorului pentru procese mai clare.',crm_cta:'Deschide CRM',forks_eyebrow:'Top Projects',forks_title:'Top Projects',forks_note:'Proiectele care exprimă cel mai bine felul în care transform o idee într-o experiență digitală clară, interactivă și bine structurată.',forks_cta:'Vezi hub-ul complet',fusions_eyebrow:'Other Experiments',fusions_title:'Other Experiments',fusions_note:'Explorări vizuale, concepte UI și prototipuri rapide create pentru a testa interacțiuni, layout-uri, feedback vizual și direcții noi de construcție.',fusions_cta:'Explorează',projects_eyebrow:'Challenges',projects_title:'Challenges',projects_note:'Exerciții și provocări practice prin care îmi antrenez logica, structura și capacitatea de a construi soluții simple, clare și funcționale.',projects_cta:'Deschide Proiecte',hub_title:'Explorează colecția de proiecte',hub_note:'Biblioteca completă de proiecte rămâne disponibilă separat, pentru explorare extinsă. Pagina principală păstrează doar selecția esențială.',hub_external:'Explorează mai mult',results:'rezultate',footer:'Portofoliu selectat, construit în jurul proiectelor care mă reprezintă cel mai bine.',filter_state:'Filtru: {filter} • Căutare: {query}',library_empty_fallback:'Nu există rezultate pentru filtrul curent. Poți reveni la listarea completă sau accesa direct cele 3 proiecte-cheie:',reset_filters:'Resetează filtrele',github_eyebrow:'🚀 Latest on GitHub',github_title:'Cele mai noi proiecte cu repo public',github_meta:'Cod public • Deploy automat • Open source',view_repo:'View on GitHub',view_live:'Live Demo',view_live_pro:'Enhanced Pro',badge_new:'NEW'},
en:{brand:'CodePen Portfolio',nav_work:'Top projects',nav_about:'About',nav_contact:'Contact',hero_eyebrow:'CRM • Marketing • Self-taught front-end',hero_title:'I build CRM interfaces and dashboards that turn complex processes into clear flows.',hero_text:'My background is in CRM and marketing, and in front-end I focus on products where structure, prioritization, and visual feedback help users understand faster what to do and act with less friction.',hero_cta:'Write me about a project',hero_cta_secondary:'Write me about a project',hero_proof_1:'Kanban',hero_proof_2:'Flow builder',hero_proof_3:'RBAC',hero_proof_4:'Billing',hero_proof_5:'Decision-oriented UI/UX',key_eyebrow:'Key projects',key_title:'3 projects that best show how I think about product and interface',key_subtitle:'I selected 3 projects that represent me best: clear structure, product logic, action-oriented interfaces, and UI/UX decisions I can explain.',context:'Role / type',problem:'Problem',constraints:'Description',decision:'What I built',priority:'Result',learning:'Focus',proof:'CTA',open:'View project',about_eyebrow:'About',about_title:'Short context',about_text:'I come from CRM and marketing, and that shapes how I build interfaces: I care not only how a product looks, but how it guides users, reduces friction, and supports real goals. In front-end, I am drawn to projects where logic, structure, and UI/UX decisions make the difference.',contact_eyebrow:'Contact',contact_title:'Are you working on a CRM, dashboard, or internal product?',contact_text:'Write to me if you want full case studies, to discuss a collaboration, or to get feedback on a flow-oriented, clarity-first UX product.',contact_email:'Write me about a project',hub_eyebrow:'Extended library',blog_eyebrow:'Blog',blog_title:'Articles and ideas from my process',blog_note:'I also integrated the blog area for insights on projects, workflow and front-end experiments.',blog_cta:'Open blog',parcurs_eyebrow:'Journey',parcurs_title:'Progress, milestones and applied learnings',parcurs_note:'A dedicated space for my evolution: what I built, what I iterated and how product decisions improved over time.',parcurs_cta:'Open Journey',preview_eyebrow:'Preview',preview_title:'Quick previews for experiments',preview_note:'A separate area for visual previews and intermediate versions before final publishing.',preview_cta:'Open Preview',crm_eyebrow:'CRM',crm_title:'CRM systems and user-focused flows',crm_note:'A dedicated section for projects where I combine data organization, automation and user experience to make processes clearer.',crm_cta:'Open CRM',forks_eyebrow:'Forks',forks_title:'Forks and technical reinterpretations',forks_note:'A collection of ideas started from existing projects and adapted with my own logic and UX upgrades.',forks_cta:'Open Forks',fusions_eyebrow:'Fusions',fusions_title:'Concept and module fusions',fusions_note:'Experiments that combine different components, patterns and flows into one coherent experience.',fusions_cta:'Open Fusions',projects_eyebrow:'Projects',projects_title:'All projects in a dedicated section',projects_note:'Direct access to the complete list of projects, organized for quick exploration and idea comparison.',projects_cta:'Open Projects',hub_title:'Complete project library',hub_note:'The complete project library remains available in a separate hub for deeper exploration. The homepage keeps only the essential selection.',hub_external:'Explore more',results:'results',footer:'Selected portfolio, built around the projects that represent me best.',filter_state:'Filter: {filter} • Search: {query}',library_empty_fallback:'No results for the current filter. You can reset to the full list or jump straight to the 3 key projects:',reset_filters:'Reset filters',github_eyebrow:'🚀 Latest on GitHub',github_title:'Newest projects with public repo',github_meta:'Public code • Auto deploy • Open source',view_repo:'View on GitHub',view_live:'Live Demo',view_live_pro:'Enhanced Pro',badge_new:'NEW'}
};

const keyProjectDetails={
1:{ro:{problem:'Joc arcade rapid care să rămână clar la ritm mare.',stack:'HTML, CSS, JavaScript (game loop + state updates).',logic:'Actualizare în timp real pentru feedback și dificultate progresivă.',context:'Game concept / micro interaction',constraints:'Miză mică, feedback instant, control vizual clar.',decision:'Am construit loop simplu, scor live și semnale vizuale pentru ritm.',priority:'Experiență fluidă și ușor de înțeles.',learning:'Game feel, feedback loops, pacing.',proof:['Live score','Micro animations','Progressive difficulty']},en:{problem:'A fast arcade game that stays clear at high pace.',stack:'HTML, CSS, JavaScript (game loop + state updates).',logic:'Real-time updates for feedback and progressive difficulty.',context:'Game concept / micro interaction',constraints:'Low friction, instant feedback, clear visual control.',decision:'I built a simple loop, live score and visual rhythm cues.',priority:'Fluid experience that is easy to understand.',learning:'Game feel, feedback loops, pacing.',proof:['Live score','Micro animations','Progressive difficulty']}},
3:{ro:{problem:'Lead-urile și task-urile trebuie urmărite clar într-un dashboard utilitar.',stack:'HTML, CSS, JavaScript.',logic:'Task triage, status tracking, organizare pe zone funcționale.',context:'CRM dashboard / workflow UI',constraints:'Claritate operațională și ierarhie vizuală bună.',decision:'Am separat lead-uri, task-uri și acțiuni într-o structură ușor de scanat.',priority:'Reducerea fricțiunii în fluxul zilnic.',learning:'Operational UX, data grouping, dashboard decisions.',proof:['Task-focused layout','Clear hierarchy','Action-oriented sections']},en:{problem:'Leads and tasks need to be tracked clearly inside a utility dashboard.',stack:'HTML, CSS, JavaScript.',logic:'Task triage, status tracking, layout structured by function.',context:'CRM dashboard / workflow UI',constraints:'Operational clarity and strong visual hierarchy.',decision:'I separated leads, tasks and actions into a scan-friendly layout.',priority:'Reducing friction in daily workflows.',learning:'Operational UX, data grouping, dashboard decisions.',proof:['Task-focused layout','Clear hierarchy','Action-oriented sections']}},
18:{ro:{problem:'Un proiect educațional trebuie să facă progresul vizibil și motivant.',stack:'HTML, CSS, JavaScript.',logic:'Secțiuni clare, reluare progres și structură orientată pe pași.',context:'Education / guided flow',constraints:'Claritate, orientare și feedback vizual pozitiv.',decision:'Am organizat experiența pe pași ușor de urmărit și elemente de progres.',priority:'Senzația de avans și control.',learning:'Guided UX, progress framing, educational structure.',proof:['Visible progress','Clear step structure','Motivational framing']},en:{problem:'An educational project must make progress visible and motivating.',stack:'HTML, CSS, JavaScript.',logic:'Clear sections, resume flow and step-based structure.',context:'Education / guided flow',constraints:'Clarity, orientation and positive visual feedback.',decision:'I organized the experience into easy-to-follow steps and progress markers.',priority:'A sense of progress and control.',learning:'Guided UX, progress framing, educational structure.',proof:['Visible progress','Clear step structure','Motivational framing']}},
49:{ro:{problem:'Un CRM premium trebuie să pară coerent, modular și ușor de navigat.',stack:'Vite, React, JavaScript, CSS.',logic:'Modular CRM, role-based sections, billing, kanban și automatizări.',context:'SaaS / CRM / SPA',constraints:'Mulți itemi și module fără să devină aglomerat.',decision:'Am împărțit produsul pe module clare și suprafețe UI bine delimitate.',priority:'Claritate în complexitate.',learning:'Product thinking, information architecture, SaaS interface systems.',proof:['Kanban','Role-based zones','Billing + automation']},en:{problem:'A premium CRM must feel coherent, modular and easy to navigate.',stack:'Vite, React, JavaScript, CSS.',logic:'Modular CRM, role-based sections, billing, kanban and automations.',context:'SaaS / CRM / SPA',constraints:'Many items and modules without visual clutter.',decision:'I split the product into clear modules and well-defined UI surfaces.',priority:'Clarity inside complexity.',learning:'Product thinking, information architecture, SaaS interface systems.',proof:['Kanban','Role-based zones','Billing + automation']}}
};

const HERO_PREVIEW_FALLBACK_DELAY_MS=4000;
const HERO_PREVIEW_AUTOPLAY_MS=4800;

let heroPreviewFrameErrorTimer=null;
let heroPreviewIsVisible=true;
let previewAutoPlayAllowed=true;
// Lang detection: URL param > localStorage > default
const urlLang = new URLSearchParams(location.search).get('lang');
let currentLang = (urlLang === 'en' || urlLang === 'ro')
  ? urlLang
  : (localStorage.getItem('portfolio-lang') || 'ro');
if (!translations[currentLang]) currentLang = 'ro';
localStorage.setItem('portfolio-lang', currentLang);

let activeFilter='all';
let projects=[];
let dom={};
let searchDebounceId;
let keyCarouselIndex=0;
let latestGithubPage=0;
let previewSlideIndex=0;
let previewIntervalId;

const t=k=>translations[currentLang]?.[k]||k;
const byId=id=>document.getElementById(id);

function injectRuntimeStyles(){
  if(byId('portfolio-runtime-fixes')) return;
  const style=document.createElement('style');
  style.id='portfolio-runtime-fixes';
  style.textContent=`
    #gh-projects-static,.gh-carousel{width:100%;min-width:0}
    .gh-carousel-viewport{width:100%;overflow:hidden;position:relative}
    .gh-carousel-track{display:flex;width:100%;transition:transform .45s ease;will-change:transform}
    .gh-carousel-slide{flex:0 0 100%;min-width:100%;width:100%;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;align-items:stretch;box-sizing:border-box}
    .gh-carousel-slide .project-card{min-width:0;width:100%;height:100%}
    .gh-carousel-slide .project-desc,.gh-carousel-slide h3{overflow-wrap:anywhere;word-break:break-word}
    .gh-carousel-slide .project-card .card-actions{margin-top:auto}
    .gh-section-head,.section-head{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;flex-wrap:wrap}
    .gh-section-head .section-copy,.section-head .section-copy{min-width:0;flex:1 1 520px}
    .gh-section-head .section-cta,.section-head .section-cta{flex:0 0 auto}
    @media (max-width:1100px){.gh-carousel-slide{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media (max-width:700px){
      .gh-carousel-slide{grid-template-columns:minmax(0,1fr)}
      .gh-section-head,.section-head{align-items:stretch}
      .gh-section-head .section-cta,.section-head .section-cta{width:100%}
      .gh-section-head .section-cta .btn,.section-head .section-cta .btn{width:100%;justify-content:center}
    }
  `;
  document.head.appendChild(style);
}

function toggleHeroPreviewFallback(show){
  if(!dom.heroPreviewFallback||!dom.heroPreviewHint||!dom.heroPreviewFrame) return;
  dom.heroPreviewFallback.style.opacity=show?'1':'0';
  dom.heroPreviewHint.style.opacity=show?'1':'0';
  dom.heroPreviewFrame.style.opacity=show?'0':'1';
}

function loadHeroPreviewFrame(slide){
  if(!dom.heroPreviewFrame) return;
  clearTimeout(heroPreviewFrameErrorTimer);
  toggleHeroPreviewFallback(false);
  dom.heroPreviewFrame.src=slide.url;
  heroPreviewFrameErrorTimer=setTimeout(()=>toggleHeroPreviewFallback(true),HERO_PREVIEW_FALLBACK_DELAY_MS);
}

function applyTranslations(){
  document.documentElement.lang = currentLang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key=el.dataset.i18n;
    if(translations[currentLang]?.[key]) el.textContent=translations[currentLang][key];
  });
  if(dom.langToggle) dom.langToggle.textContent=currentLang==='ro'?'RO | EN':'EN | RO';
  const fallbackText=byId('libraryFallbackText');
  const resetButton=byId('resetFiltersBtn');
  const latestMeta=byId('gh-meta-static');
  if(fallbackText) fallbackText.textContent=t('library_empty_fallback');
  if(resetButton) resetButton.textContent=t('reset_filters');
  if(latestMeta) latestMeta.textContent=t('github_meta');
}

function normalizeProject(raw,i=0){
  if(!raw||typeof raw!=='object') return null;
  const id=Number(raw.id??i+1);
  const title=typeof raw.title==='object'
    ? {ro:raw.title.ro||raw.title.en||`Project ${id}`,en:raw.title.en||raw.title.ro||`Project ${id}`}
    : {ro:String(raw.title||`Project ${id}`),en:String(raw.title||`Project ${id}`)};
  const description=typeof raw.description==='object'
    ? {ro:raw.description.ro||raw.description.en||'',en:raw.description.en||raw.description.ro||''}
    : {ro:String(raw.description||''),en:String(raw.description||'')};
  return {id,title,description,category:String(raw.category||'other').toLowerCase(),tags:Array.isArray(raw.tags)?raw.tags:[],url:raw.url||'#',liveUrl:raw.liveUrl||'',liveUrlPro:raw.liveUrlPro||'',repoUrl:raw.repoUrl||'',isNew:Boolean(raw.isNew)};
}

function dedupeProjects(list){
  const map=new Map();
  list.forEach((p,i)=>{
    const n=normalizeProject(p,i);
    if(!n) return;
    const key=n.repoUrl||n.liveUrl||n.url||`${n.id}-${n.title.en}`;
    if(!map.has(key)) map.set(key,n);
  });
  return [...map.values()];
}

function createLibraryCard(project){
  const card=document.createElement('article');
  card.className='project-card glass';

  const tag=document.createElement('span');
  tag.className=`tag ${project.category||''}`.trim();
  tag.textContent=project.category;

  const heading=document.createElement('h3');
  heading.textContent=project.title[currentLang];

  const desc=document.createElement('p');
  desc.className='project-desc';
  desc.textContent=project.description[currentLang];

  const actions=document.createElement('div');
  actions.className='card-actions';

  if(project.isNew){
    const badge=document.createElement('span');
    badge.className='badge-new';
    badge.textContent=t('badge_new');
    card.append(badge);
  }

  const top=document.createElement('div');
  top.className='project-top';
  const topLeft=document.createElement('div');
  topLeft.append(heading);

  if(project.repoUrl){
    const gh=document.createElement('span');
    gh.className='badge-github';
    gh.innerHTML=`${GH_ICON}<span>GitHub</span>`;
    topLeft.append(gh);
  }

  top.append(topLeft,tag);

  if(project.liveUrl){
    const a=document.createElement('a');
    a.className='mini-btn primary';
    a.href=project.liveUrl;
    a.target='_blank';
    a.rel='noopener noreferrer';
    a.textContent=t('view_live');
    actions.append(a);
  }

  if(project.liveUrlPro){
    const a=document.createElement('a');
    a.className='mini-btn';
    a.href=project.liveUrlPro;
    a.target='_blank';
    a.rel='noopener noreferrer';
    a.textContent=t('view_live_pro');
    actions.append(a);
  }

  if(project.repoUrl){
    const a=document.createElement('a');
    a.className='mini-btn';
    a.href=project.repoUrl;
    a.target='_blank';
    a.rel='noopener noreferrer';
    a.innerHTML=`${GH_ICON}<span style="margin-left:6px">${t('view_repo')}</span>`;
    actions.append(a);
  }else{
    const a=document.createElement('a');
    a.className='btn btn-secondary';
    a.href=project.url;
    a.target='_blank';
    a.rel='noopener noreferrer';
    a.textContent=t('open');
    actions.append(a);
  }

  card.append(top,desc,actions);
  return card;
}

function renderLatestGithub(){
  const container=byId('gh-projects-static');
  if(!container) return;

  const source=projects.length?projects:STATIC_FALLBACK_GITHUB_PROJECTS;
  const githubProjects=source
    .filter(p=>(p.category||'').toLowerCase()==='github')
    .sort((a,b)=>Number(!!b.isNew)-Number(!!a.isNew)||(b.id||0)-(a.id||0));

  if(!githubProjects.length){
    container.innerHTML='';
    return;
  }

  const pageSize=3;
  const totalPages=Math.max(1,Math.ceil(githubProjects.length/pageSize));
  latestGithubPage=Math.min(latestGithubPage,totalPages-1);

  const pages=[];
  for(let i=0;i<githubProjects.length;i+=pageSize) pages.push(githubProjects.slice(i,i+pageSize));

  container.innerHTML='';
  container.className='gh-carousel';

  const viewport=document.createElement('div');
  viewport.className='gh-carousel-viewport';

  const track=document.createElement('div');
  track.className='gh-carousel-track';

  pages.forEach((pageProjects,pageIndex)=>{
    const slide=document.createElement('div');
    slide.className='gh-carousel-slide';
    slide.dataset.ghSlide=String(pageIndex);
    pageProjects.forEach(project=>slide.appendChild(createLibraryCard(project)));
    track.appendChild(slide);
  });

  viewport.appendChild(track);
  container.appendChild(viewport);
  track.style.transform=`translateX(-${latestGithubPage*100}%)`;

  let controls=byId('gh-projects-pagination');
  if(!controls){
    controls=document.createElement('div');
    controls.id='gh-projects-pagination';
    controls.className='key-carousel-controls';
    container.insertAdjacentElement('afterend',controls);
  }

  if(totalPages<2){
    controls.innerHTML='';
    controls.hidden=true;
    return;
  }

  controls.hidden=false;
  const pageLabel=currentLang==='ro'?`Pagina ${latestGithubPage+1} din ${totalPages}`:`Page ${latestGithubPage+1} of ${totalPages}`;
  const moreLabel=currentLang==='ro'?'Mai multe':'More';
  const isMorePage=latestGithubPage>0;

  controls.innerHTML=`
    <div class="key-carousel-nav">
      <button type="button" class="key-carousel-btn" data-gh-prev ${latestGithubPage===0?'disabled':''} aria-label="Previous">‹</button>
      <button type="button" class="key-carousel-btn" data-gh-next ${latestGithubPage>=totalPages-1?'disabled':''} aria-label="Next">›</button>
    </div>
    <div class="key-carousel-dots">
      ${pages.map((_,i)=>`<button type="button" class="key-carousel-dot ${i===latestGithubPage?'active':''}" data-gh-dot="${i}" aria-label="Slide ${i+1}" aria-pressed="${i===latestGithubPage?'true':'false'}"></button>`).join('')}
    </div>
    <div class="gh-meta" style="margin-top:0;">
      <span>${isMorePage?`${moreLabel} · `:''}${pageLabel}</span>
    </div>
  `;

  controls.querySelector('[data-gh-prev]')?.addEventListener('click',()=>{
    if(latestGithubPage===0) return;
    latestGithubPage--;
    renderLatestGithub();
  });

  controls.querySelector('[data-gh-next]')?.addEventListener('click',()=>{
    if(latestGithubPage>=totalPages-1) return;
    latestGithubPage++;
    renderLatestGithub();
  });

  controls.querySelectorAll('[data-gh-dot]').forEach(dot=>{
    dot.addEventListener('click',()=>{
      latestGithubPage=Number(dot.dataset.ghDot||0);
      renderLatestGithub();
    });
  });
}

function createKeyCard(project){
  const meta=keyProjectDetails[project.id]?.[currentLang];
  if(!meta) return createLibraryCard(project);
  const card=document.createElement('article');
  card.className='project-card glass';
  card.innerHTML=`<span class="tag">${project.category}</span><h3>${project.title[currentLang]}</h3><p class="project-desc">${project.description[currentLang]}</p><div class="mini-grid"><div class="mini-item"><strong>${t('context')}</strong><span>${meta.context}</span></div><div class="mini-item"><strong>${t('problem')}</strong><span>${meta.problem}</span></div><div class="mini-item"><strong>${t('constraints')}</strong><span>${meta.constraints}</span></div><div class="mini-item"><strong>${t('decision')}</strong><span>${meta.decision}</span></div><div class="mini-item"><strong>${t('priority')}</strong><span>${meta.priority}</span></div><div class="mini-item"><strong>${t('learning')}</strong><span>${meta.learning}</span></div></div><div class="project-proof"><strong>${t('proof')}</strong><ul>${(meta.proof||[]).map(i=>`<li>${i}</li>`).join('')}</ul></div><div class="card-actions"><a class="btn btn-primary" href="${project.url}" target="_blank" rel="noopener noreferrer">${t('open')}</a></div>`;
  return card;
}

function updateFilterState(query,total){
  const filterStateEl=byId('filterState');
  const separatorEl=byId('statusSeparator');
  const resultsCountEl=byId('resultsCount');
  if(!filterStateEl||!separatorEl||!resultsCountEl) return;

  const readableFilter=(activeFilter==='all'?'all':activeFilter).toUpperCase();
  const q=query?`"${query}"`:'—';
  const text=t('filter_state').replace('{filter}',readableFilter).replace('{query}',q);
  resultsCountEl.textContent=String(total);

  const statusBar=byId('libraryStatus');
  const resetBtn=byId('resetFiltersBtn');
  if(statusBar) statusBar.style.visibility='';
  if(resetBtn) resetBtn.style.visibility='';

  if(total===0){
    filterStateEl.hidden=true;
    separatorEl.hidden=true;
    return;
  }

  filterStateEl.hidden=false;
  separatorEl.hidden=false;
  filterStateEl.textContent=text;
}

function applyFilters(){
  if(!dom.searchInput||!dom.libraryGrid||!dom.libraryFallback) return;

  const query=dom.searchInput.value.trim().toLowerCase();
  const sourceProjects=projects.length?projects:STATIC_FALLBACK_PROJECTS;
  const normalizedFilter=(activeFilter||'all').toLowerCase();

  const filtered=sourceProjects.filter(project=>{
    const projectCategory=(project.category||'').toLowerCase();
    const matchFilter=normalizedFilter==='all'||projectCategory===normalizedFilter;
    const haystack=[project.title.ro,project.title.en,project.description.ro,project.description.en,project.category,...(project.tags||[])].join(' ').toLowerCase();
    return matchFilter&&haystack.includes(query);
  });

  dom.libraryGrid.innerHTML='';

  if(!filtered.length){
    dom.libraryGrid.hidden=true;
    dom.libraryFallback.classList.add('show');
    updateFilterState(query,0);
    return;
  }

  dom.libraryGrid.hidden=false;
  dom.libraryFallback.classList.remove('show');
  const frag=document.createDocumentFragment();
  filtered.forEach(project=>frag.appendChild(createLibraryCard(project)));
  dom.libraryGrid.appendChild(frag);
  updateFilterState(query,filtered.length);
}

function renderKeyProjects(){
  if(!dom.keyProjectsGrid) return;
  const sourceProjects=projects.length?projects:STATIC_FALLBACK_PROJECTS;
  const keyProjects=KEY_PROJECT_IDS.map(id=>sourceProjects.find(p=>Number(p.id)===Number(id))).filter(Boolean);
  dom.keyProjectsGrid.innerHTML='';
  const fallback=STATIC_FALLBACK_PROJECTS.filter(p=>KEY_PROJECT_IDS.includes(Number(p.id))).filter(p=>!keyProjects.find(k=>Number(k.id)===Number(p.id)));
  [...keyProjects,...fallback].slice(0,3).forEach(project=>dom.keyProjectsGrid.appendChild(createKeyCard(project)));
}

function normalizeGithubSectionLayout(){
  const ghGrid=byId('gh-projects-static');
  if(!ghGrid) return;
  const section=ghGrid.closest('section');
  if(!section) return;

  const candidates=[...section.querySelectorAll(':scope > div,:scope > header,:scope > .section-head,:scope > .gh-section-head')];
  const head=candidates.find(el=>el.contains(byId('gh-meta-static'))||el.querySelector('#gh-meta-static')||el.querySelector('[href*="#projects"]')||el.querySelector('a.btn'));
  if(!head) return;

  if(!head.classList.contains('gh-section-head')) head.classList.add('gh-section-head');

  const cta=head.querySelector('a.btn, a.button, .btn');
  if(cta){
    let wrap=cta.closest('.section-cta');
    if(!wrap){
      wrap=document.createElement('div');
      wrap.className='section-cta';
      cta.parentNode.insertBefore(wrap,cta);
      wrap.appendChild(cta);
    }
  }

  const introCandidates=[...head.children].filter(el=>!el.classList.contains('section-cta'));
  if(introCandidates.length>1){
    const copy=document.createElement('div');
    copy.className='section-copy';
    introCandidates.forEach(node=>copy.appendChild(node));
    head.prepend(copy);
  }else if(introCandidates.length===1&&!introCandidates[0].classList.contains('section-copy')){
    introCandidates[0].classList.add('section-copy');
  }
}

function render(){
  applyTranslations();
  renderKeyProjects();
  renderLatestGithub();
  setupKeyProjectsCarousel();
  normalizeGithubSectionLayout();
  if(dom.searchInput&&dom.libraryGrid&&dom.libraryFallback) applyFilters();
}

function renderKeyCarouselDots(totalSlides){
  if(!dom.keyCarouselDots) return;
  dom.keyCarouselDots.innerHTML='';
  const frag=document.createDocumentFragment();
  for(let i=0;i<totalSlides;i++){
    const dot=document.createElement('button');
    dot.type='button';
    dot.className='key-carousel-dot';
    dot.setAttribute('aria-label',`Slide ${i+1}`);
    dot.addEventListener('click',()=>setKeyCarouselSlide(i));
    frag.appendChild(dot);
  }
  dom.keyCarouselDots.appendChild(frag);
}

function setKeyCarouselSlide(index){
  if(!dom.keyProjectsGrid) return;
  const cards=dom.keyProjectsGrid.querySelectorAll('.project-card');
  if(!cards.length) return;
  keyCarouselIndex=(index+cards.length)%cards.length;
  dom.keyProjectsGrid.style.transform=`translateX(-${keyCarouselIndex*100}%)`;
  const hasMultiple=cards.length>1;
  if(dom.keyCarouselPrev) dom.keyCarouselPrev.disabled=!hasMultiple;
  if(dom.keyCarouselNext) dom.keyCarouselNext.disabled=!hasMultiple;
  (dom.keyCarouselDots?.querySelectorAll('.key-carousel-dot')||[]).forEach((dot,i)=>{
    const active=i===keyCarouselIndex;
    dot.classList.toggle('active',active);
    dot.setAttribute('aria-pressed',String(active));
  });
}

function setupKeyProjectsCarousel(){
  if(!dom.keyProjectsGrid) return;
  const cards=dom.keyProjectsGrid.querySelectorAll('.project-card');
  if(!cards.length) return;
  keyCarouselIndex=0;
  renderKeyCarouselDots(cards.length);
  setKeyCarouselSlide(0);
}

function renderHeroPreviewChips(){
  if(!dom.heroPreviewLinks) return;
  dom.heroPreviewLinks.innerHTML='';
  const frag=document.createDocumentFragment();
  HERO_PREVIEW_SLIDES.forEach((slide,index)=>{
    const button=document.createElement('button');
    button.type='button';
    button.className='chip';
    button.textContent=slide.title;
    button.setAttribute('aria-label',`Preview ${slide.title}`);
    button.addEventListener('click',()=>{
      setHeroPreviewSlide(index);
      restartHeroPreviewAutoplay();
    });
    frag.appendChild(button);
  });
  dom.heroPreviewLinks.appendChild(frag);
}

function keepActiveChipInView(chip){
  const container=dom.heroPreviewLinks;
  if(!container||!chip) return;
  const cr=container.getBoundingClientRect();
  const ir=chip.getBoundingClientRect();
  const chipLeft=ir.left-cr.left+container.scrollLeft;
  const chipRight=chipLeft+ir.width;
  const visibleLeft=container.scrollLeft;
  const visibleRight=visibleLeft+container.clientWidth;
  if(chipLeft<visibleLeft) return container.scrollTo({left:chipLeft-8,behavior:'smooth'});
  if(chipRight>visibleRight) container.scrollTo({left:chipRight-container.clientWidth+8,behavior:'smooth'});
}

function setHeroPreviewSlide(index){
  if(!dom.heroPreviewTitle||!dom.heroPreviewOpen) return;
  previewSlideIndex=(index+HERO_PREVIEW_SLIDES.length)%HERO_PREVIEW_SLIDES.length;
  const slide=HERO_PREVIEW_SLIDES[previewSlideIndex];
  dom.heroPreviewTitle.textContent=slide.title;
  dom.heroPreviewOpen.href=slide.url;
  if(dom.heroPreviewOpenSecondary) dom.heroPreviewOpenSecondary.href=slide.url;
  if(dom.heroPreviewHeading) dom.heroPreviewHeading.textContent=slide.title;
  if(dom.heroPreviewMeta) dom.heroPreviewMeta.textContent=slide.meta||'';
  if(dom.heroPreviewDescription) dom.heroPreviewDescription.textContent=slide.description;
  if(dom.heroPreviewType) dom.heroPreviewType.textContent=slide.label;
  if(dom.heroPreviewUrl){
    const cleanUrl=slide.url.replace(/^https?:\/\//,'');
    dom.heroPreviewUrl.textContent=cleanUrl;
    dom.heroPreviewUrl.href=slide.url;
  }
  if(dom.heroPreviewCode) dom.heroPreviewCode.href=slide.codeUrl||slide.url;
  loadHeroPreviewFrame(slide);
  (dom.heroPreviewLinks?.querySelectorAll('.chip')||[]).forEach((chip,i)=>{
    const active=i===previewSlideIndex;
    chip.classList.toggle('active',active);
    chip.setAttribute('aria-pressed',String(active));
    if(active) keepActiveChipInView(chip);
  });
}

function restartHeroPreviewAutoplay(){
  clearInterval(previewIntervalId);
  if(!previewAutoPlayAllowed||!heroPreviewIsVisible||HERO_PREVIEW_SLIDES.length<2) return;
  previewIntervalId=setInterval(()=>setHeroPreviewSlide(previewSlideIndex+1),HERO_PREVIEW_AUTOPLAY_MS);
}

function stopHeroPreviewAutoplay(){ clearInterval(previewIntervalId); }
function disableHeroPreviewAutoplayPermanently(){ previewAutoPlayAllowed=false; stopHeroPreviewAutoplay(); }

function cacheDom(){
  dom={
    searchInput:byId('searchInput'),
    libraryGrid:byId('libraryGrid'),
    libraryFallback:byId('libraryFallback'),
    filterButtons:[...document.querySelectorAll('[data-filter]')],
    resetFiltersBtn:byId('resetFiltersBtn'),
    keyProjectsGrid:byId('keyProjectsGrid'),
    keyCarouselPrev:byId('keyCarouselPrev'),
    keyCarouselNext:byId('keyCarouselNext'),
    keyCarouselDots:byId('keyCarouselDots'),
    heroPreviewLinks:byId('heroPreviewLinks'),
    heroPreviewTitle:byId('heroPreviewTitle'),
    heroPreviewHeading:byId('heroPreviewHeading'),
    heroPreviewMeta:byId('heroPreviewMeta'),
    heroPreviewDescription:byId('heroPreviewDescription'),
    heroPreviewType:byId('heroPreviewType'),
    heroPreviewUrl:byId('heroPreviewUrl'),
    heroPreviewCode:byId('heroPreviewCode'),
    heroPreviewOpen:byId('heroPreviewOpen'),
    heroPreviewOpenSecondary:byId('heroPreviewOpenSecondary'),
    heroPreviewFrame:byId('heroPreviewFrame'),
    heroPreviewFallback:byId('heroPreviewFallback'),
    heroPreviewHint:byId('heroPreviewHint'),
    heroPreviewSection:byId('heroPreviewSection'),
    langToggle:byId('langToggle')
  };
}

async function fetchProjectsFromRemote(){
  // Static-only data source pentru predictibilitate și securitate.
  // Dacă vrei sync remote, mută datele într-un projects.json în repo
  // și fă: const res = await fetch('./projects.json'); return r.json();
  return dedupeProjects([
    ...STATIC_FALLBACK_PROJECTS,
    ...STATIC_FALLBACK_GITHUB_PROJECTS
  ]);
}
async function loadProjects(){
  const remoteProjects=await fetchProjectsFromRemote();
  projects=dedupeProjects([...remoteProjects,...STATIC_FALLBACK_PROJECTS,...STATIC_FALLBACK_GITHUB_PROJECTS]);
}

function setActiveFilter(nextFilter){
  activeFilter=String(nextFilter||'all').toLowerCase();
  dom.filterButtons?.forEach(button=>{
    const isActive=String(button.dataset.filter||'all').toLowerCase()===activeFilter;
    button.classList.toggle('active',isActive);
    button.setAttribute('aria-pressed',String(isActive));
  });
  applyFilters();
}

function resetFilters(){
  activeFilter='all';
  if(dom.searchInput) dom.searchInput.value='';
  setActiveFilter('all');
}

function bindFilterEvents(){
  dom.filterButtons?.forEach(button=>button.addEventListener('click',()=>setActiveFilter(button.dataset.filter||'all')));
  dom.resetFiltersBtn?.addEventListener('click',resetFilters);
  dom.searchInput?.addEventListener('input',()=>{
    clearTimeout(searchDebounceId);
    searchDebounceId=setTimeout(applyFilters,180);
  });
}

function bindCarouselEvents(){
  dom.keyCarouselPrev?.addEventListener('click',()=>setKeyCarouselSlide(keyCarouselIndex-1));
  dom.keyCarouselNext?.addEventListener('click',()=>setKeyCarouselSlide(keyCarouselIndex+1));
}

function bindHeroPreviewEvents(){
  renderHeroPreviewChips();
  setHeroPreviewSlide(0);
  dom.heroPreviewFrame?.addEventListener('load',()=>{
    clearTimeout(heroPreviewFrameErrorTimer);
    toggleHeroPreviewFallback(false);
  });
  dom.heroPreviewFrame?.addEventListener('error',()=>toggleHeroPreviewFallback(true));
  dom.heroPreviewFrame?.addEventListener('mouseenter',stopHeroPreviewAutoplay);
  dom.heroPreviewFrame?.addEventListener('mouseleave',restartHeroPreviewAutoplay);
  dom.heroPreviewLinks?.addEventListener('pointerdown',disableHeroPreviewAutoplayPermanently);

  if('IntersectionObserver' in window && dom.heroPreviewSection){
    new IntersectionObserver(entries=>{
      heroPreviewIsVisible=!!entries[0]?.isIntersecting;
      heroPreviewIsVisible?restartHeroPreviewAutoplay():stopHeroPreviewAutoplay();
    },{threshold:.35}).observe(dom.heroPreviewSection);
  }

  restartHeroPreviewAutoplay();
}

function bindLangToggle(){
  dom.langToggle?.addEventListener('click',()=>{
    currentLang=currentLang==='ro'?'en':'ro';
    localStorage.setItem('portfolio-lang',currentLang);
    render();
    setHeroPreviewSlide(previewSlideIndex);
  });
}

function bindGlobalEvents(){
  window.addEventListener('visibilitychange',()=>document.hidden?stopHeroPreviewAutoplay():restartHeroPreviewAutoplay());
  window.addEventListener('beforeunload',()=>{
    stopHeroPreviewAutoplay();
    clearTimeout(heroPreviewFrameErrorTimer);
    clearTimeout(searchDebounceId);
  });
  window.addEventListener('resize',()=>normalizeGithubSectionLayout(),{passive:true});
}

async function initPortfolio(){
  injectRuntimeStyles();
  cacheDom();
  applyTranslations();
  bindLangToggle();
  bindFilterEvents();
  bindCarouselEvents();
  bindHeroPreviewEvents();
  bindGlobalEvents();
  await loadProjects();
  render();
  setHeroPreviewSlide(previewSlideIndex);
}

document.addEventListener('DOMContentLoaded',initPortfolio);
