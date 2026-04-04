#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projects = [
  {slug:'basket-vs-ai',title:{ro:'BASKET VS AI',en:'BASKET VS AI'},category:'game',tags:['Game','AI','Basketball'],url:'https://es-d-5697283320260328-019d2b27-6fb7-7f3c-ae84-cf130aae5231.codepen.dev/',desc:{ro:'Joc de baschet contra AI, cu atmosferă arcade și progres vizual. Proiect front-end creat de Laura Andreea, publicat pe CodePen, cu HTML, CSS și JavaScript.',en:'Basketball game against AI with an arcade feel and visual progression. Front-end project by Laura Andreea, published on CodePen, built with HTML, CSS and JavaScript.'},thumbTitle:'BASKET',thumbSubtitle:'VS AI',thumbColor:'#ff7a30',thumbBg:'linear-gradient(135deg, rgba(255,122,48,.28), rgba(255,160,64,.10))'},
  {slug:'basket-vs-ai-pro',title:{ro:'BASKET VS AI PRO',en:'BASKET VS AI PRO'},category:'game',tags:['Game','AI','Pro'],url:'https://es-d-5697283320260328-019d267b-0535-7927-99da-f35c852ebaf1.codepen.dev/',desc:{ro:'Versiune extinsă a jocului de baschet, cu ritm mai rapid și prezentare premium. Creat cu HTML, CSS și JavaScript pe CodePen.',en:'Expanded version of the basketball game with faster pace and a premium feel. Built with HTML, CSS and JavaScript on CodePen.'},thumbTitle:'BASKET PRO',thumbSubtitle:'VS AI',thumbColor:'#60a5fa',thumbBg:'linear-gradient(135deg, rgba(96,165,250,.26), rgba(99,102,241,.10))'},
  {slug:'clientflow',title:{ro:'ClientFlow',en:'ClientFlow'},category:'utility',tags:['SaaS','Portal','Editable'],url:'https://es-d-5697283320260328-019d248d-5848-7531-8d9d-23699aa47d61.codepen.dev/',desc:{ro:'Mini SaaS portal editabil, fără cont, gata de export. Interfață utilă construită cu HTML, CSS și JavaScript pe CodePen.',en:'Mini SaaS editable portal ready for export. Useful interface built with HTML, CSS and JavaScript on CodePen.'},thumbTitle:'CLIENTFLOW',thumbSubtitle:'PORTAL',thumbColor:'#34d399',thumbBg:'linear-gradient(135deg, rgba(52,211,153,.28), rgba(59,130,246,.10))'},
  {slug:'tic-tac-toe',title:{ro:'Tic Tac Toe',en:'Tic Tac Toe'},category:'game',tags:['Game','Board','Classic'],url:'https://es-d-5697283320260328-019d202f-93fa-7c03-8496-9a9f55afbf17.codepen.dev/',desc:{ro:'Jocul clasic X și O într-o interfață simplă și modernă. Proiect front-end cu HTML, CSS și JavaScript.',en:'Classic Tic Tac Toe rebuilt in a simple and modern UI. Front-end project with HTML, CSS and JavaScript.'},thumbTitle:'TIC TAC TOE',thumbSubtitle:'CLASSIC',thumbColor:'#fb7185',thumbBg:'linear-gradient(135deg, rgba(251,113,133,.28), rgba(168,85,247,.10))'},
  {slug:'void-hunter',title:{ro:'VOID HUNTER — Space Shooter',en:'VOID HUNTER — Space Shooter'},category:'game',tags:['Game','Shooter','Space'],url:'https://es-d-5697283320260328-019d1ef0-2fb8-7dea-9187-a0ec413b8b23.codepen.dev/',desc:{ro:'Space shooter arcade cu look sci-fi și energie dinamică. Joc creat cu HTML, CSS și JavaScript pe CodePen.',en:'Arcade sci-fi space shooter with a bold feel. Game built with HTML, CSS and JavaScript on CodePen.'},thumbTitle:'VOID HUNTER',thumbSubtitle:'SPACE SHOOTER',thumbColor:'#f59e0b',thumbBg:'linear-gradient(135deg, rgba(245,158,11,.28), rgba(249,115,22,.10))'},
  {slug:'pvai-new-game-plus',title:{ro:'PvAI - New Game+ v5',en:'PvAI - New Game+ v5'},category:'game',tags:['Game','AI','PvAI'],url:'https://es-d-5697283320260328-019d19ba-35cc-7dc8-93fb-0f7b3071579c.codepen.dev/',desc:{ro:'Concept de joc PvAI cu feel de progres și iterare avansată. Creat pe CodePen cu HTML, CSS și JavaScript.',en:'PvAI game concept focused on progression and iteration. Built on CodePen with HTML, CSS and JavaScript.'},thumbTitle:'PVAI',thumbSubtitle:'NEW GAME+',thumbColor:'#818cf8',thumbBg:'linear-gradient(135deg, rgba(129,140,248,.28), rgba(14,165,233,.10))'},
  {slug:'photoauto-studio',title:{ro:'PhotoAuto Studio Premium',en:'PhotoAuto Studio Premium'},category:'utility',tags:['Photo','Studio','Premium'],url:'https://es-d-5697283320260328-019d0c67-c913-7756-bbca-4e6b932229a1.codepen.dev/',desc:{ro:'Interfață premium pentru fluxuri foto și automatizare de studio. Proiect front-end cu HTML, CSS și JavaScript.',en:'Premium interface for studio photo workflows. Front-end project with HTML, CSS and JavaScript.'},thumbTitle:'PHOTOAUTO',thumbSubtitle:'STUDIO',thumbColor:'#22c55e',thumbBg:'linear-gradient(135deg, rgba(34,197,94,.28), rgba(20,184,166,.10))'},
  {slug:'home-air-hockey',title:{ro:'Home Air Hockey',en:'Home Air Hockey'},category:'game',tags:['Game','Arcade','Hockey'],url:'https://es-d-5697283320260328-019cceb2-062d-7969-8c7f-407fbcfeac92.codepen.dev/',desc:{ro:'Joc rapid de air hockey, arcade, cu feedback instant. Creat cu HTML, CSS și JavaScript.',en:'Fast arcade air hockey game with instant feedback. Built with HTML, CSS and JavaScript.'},thumbTitle:'AIR HOCKEY',thumbSubtitle:'HOME',thumbColor:'#e879f9',thumbBg:'linear-gradient(135deg, rgba(232,121,249,.28), rgba(168,85,247,.10))'},
  {slug:'bomberman-neo',title:{ro:'Bomberman Neo',en:'Bomberman Neo'},category:'game',tags:['Game','Arcade','Action'],url:'https://es-d-5697283320260328-019ccc82-9700-75d0-8200-29b1d0b01b21.codepen.dev/',desc:{ro:'Interpretare modernă pentru un concept arcade clasic. Joc creat pe CodePen cu HTML, CSS și JavaScript.',en:'Modern take on a classic arcade concept. Game built on CodePen with HTML, CSS and JavaScript.'},thumbTitle:'BOMBERMAN',thumbSubtitle:'NEO',thumbColor:'#38bdf8',thumbBg:'linear-gradient(135deg, rgba(56,189,248,.28), rgba(37,99,235,.10))'},
  {slug:'opposite-directions',title:{ro:'Opposite Directions',en:'Opposite Directions'},category:'challenge',tags:['Challenge','Logic','CodePen'],url:'https://codepen.io/Laura-Andreea-the-typescripter/pen/EagbjvB',desc:{ro:'Challenge de logică și direcție, cu focus pe claritate și comportament. Exercițiu front-end cu HTML, CSS și JavaScript.',en:'Logic challenge focused on directions and behavior. Front-end exercise with HTML, CSS and JavaScript.'},thumbTitle:'OPPOSITE',thumbSubtitle:'DIRECTIONS',thumbColor:'#60a5fa',thumbBg:'linear-gradient(135deg, rgba(96,165,250,.28), rgba(59,130,246,.10))'},
  {slug:'boolean-oracle',title:{ro:'BOOLEAN ORACLE',en:'BOOLEAN ORACLE'},category:'challenge',tags:['Challenge','Boolean','Logic'],url:'https://codepen.io/Laura-Andreea-the-typescripter/pen/zxKzdyg',desc:{ro:'Challenge logic inspirat de condiții și decizii booleene. Proiect front-end pe CodePen.',en:'Boolean logic challenge about conditions and decisions. Front-end project on CodePen.'},thumbTitle:'BOOLEAN',thumbSubtitle:'ORACLE',thumbColor:'#facc15',thumbBg:'linear-gradient(135deg, rgba(250,204,21,.28), rgba(234,88,12,.10))'},
  {slug:'min-preferred-max',title:{ro:'Min. Preferred. Max.',en:'Min. Preferred. Max.'},category:'challenge',tags:['Challenge','Constraints','Logic'],url:'https://codepen.io/Laura-Andreea-the-typescripter/pen/bNwwQzQ',desc:{ro:'Challenge bazat pe limite, preferințe și reguli de evaluare. Exercițiu front-end cu HTML, CSS și JavaScript.',en:'Challenge about constraints and evaluation rules. Front-end exercise with HTML, CSS and JavaScript.'},thumbTitle:'MIN PREF MAX',thumbSubtitle:'RULES',thumbColor:'#c084fc',thumbBg:'linear-gradient(135deg, rgba(192,132,252,.28), rgba(236,72,153,.10))'},
  {slug:'budgetflow-pro-x',title:{ro:'BudgetFlow Pro X',en:'BudgetFlow Pro X'},category:'utility',tags:['App','Finance'],url:'https://es-d-9192350520260329-019cf25e-1ee9-7655-ae8c-9d6b150b25e0.codepen.dev/',desc:{ro:'Aplicație financiară modernă pentru gestionarea bugetului. Interfață creată cu HTML, CSS și JavaScript pe CodePen.',en:'Modern financial app for managing budgets. Interface built with HTML, CSS and JavaScript on CodePen.'},thumbTitle:'BUDGETFLOW',thumbSubtitle:'PRO X',thumbColor:'#22c55e',thumbBg:'linear-gradient(135deg, rgba(34,197,94,.28), rgba(16,185,129,.10))'},
  {slug:'breakout',title:{ro:'Breakout',en:'Breakout'},category:'game',tags:['Game','Arcade','Breakout'],url:'https://es-d-1768016420260328-019cf0ef-e43a-76c2-8a55-17856c11fe89.codepen.dev/',desc:{ro:'Joc arcade clasic tip Breakout, cu mecanici simple și rapide. Creat pe CodePen cu HTML, CSS și JavaScript.',en:'Classic Breakout-style arcade game. Built on CodePen with HTML, CSS and JavaScript.'},thumbTitle:'BREAKOUT',thumbSubtitle:'ARCADE',thumbColor:'#f97316',thumbBg:'linear-gradient(135deg, rgba(249,115,22,.28), rgba(251,146,60,.10))'},
  {slug:'front-end-opposites',title:{ro:'Front-End Opposites',en:'Front-End Opposites'},category:'challenge',tags:['Challenge','UI'],url:'https://codepen.io/Laura-Andreea-the-typescripter/pen/GgjpBJP',desc:{ro:'Challenge de UI bazat pe contraste și opoziții vizuale. Exercițiu front-end pe CodePen.',en:'UI challenge about contrast and visual opposites. Front-end exercise on CodePen.'},thumbTitle:'OPPOSITES',thumbSubtitle:'FRONT-END',thumbColor:'#f43f5e',thumbBg:'linear-gradient(135deg, rgba(244,63,94,.28), rgba(236,72,153,.10))'},
  {slug:'front-end-opposites-2',title:{ro:'Front-End Opposites 2',en:'Front-End Opposites 2'},category:'challenge',tags:['Challenge','UI'],url:'https://codepen.io/Laura-Andreea-the-typescripter/pen/yyaYEdY',desc:{ro:'Explorare vizuală a conceptului de opoziție în UI. Challenge front-end pe CodePen.',en:'Visual exploration of opposites in UI design. Front-end challenge on CodePen.'},thumbTitle:'OPPOSITES',thumbSubtitle:'UI DESIGN',thumbColor:'#fb7185',thumbBg:'linear-gradient(135deg, rgba(251,113,133,.28), rgba(190,24,93,.10))'},
  {slug:'color-lab',title:{ro:'Color Lab',en:'Color Lab'},category:'challenge',tags:['Challenge','CSS','Colors'],url:'https://codepen.io/Laura-Andreea-the-typescripter/pen/zxKObPV',desc:{ro:'Experiment modern CSS colors: light-dark(), culori relative, hwb() și altele. Proiect front-end pe CodePen.',en:'Modern CSS colors experiment and visual exploration. Front-end project on CodePen.'},thumbTitle:'COLOR LAB',thumbSubtitle:'CSS COLORS',thumbColor:'#facc15',thumbBg:'linear-gradient(135deg, rgba(250,204,21,.28), rgba(234,88,12,.10))'},
  {slug:'alpis-impactpath',title:{ro:'ALPIS ImpactPath',en:'ALPIS ImpactPath'},category:'utility',tags:['SaaS','Impact','Platform'],url:'https://es-d-9192350520260329-019d2e42-65ac-7734-91ba-16cfe41a0086.codepen.dev/#missions',desc:{ro:'Platformă orientată pe impact, cu structură de misiuni și progres. Interfață front-end creată cu HTML, CSS și JavaScript.',en:'Impact-oriented platform built around missions and progress. Front-end interface with HTML, CSS and JavaScript.'},thumbTitle:'IMPACTPATH',thumbSubtitle:'ALPIS',thumbColor:'#10b981',thumbBg:'linear-gradient(135deg, rgba(16,185,129,.28), rgba(34,197,94,.10))'},
  {slug:'event-planner',title:{ro:'Event Planner',en:'Event Planner'},category:'utility',tags:['Planner','Events','UI'],url:'https://es-d-9192350520260329-019d2ebf-cf4f-7615-b85e-da92ef38af41.codepen.dev/',desc:{ro:'Aplicație pentru planificarea evenimentelor, cu interfață clară și structură organizată. Proiect CodePen.',en:'Event planning app with a clear and organized interface. CodePen project.'},thumbTitle:'EVENT',thumbSubtitle:'PLANNER',thumbColor:'#14b8a6',thumbBg:'linear-gradient(135deg, rgba(20,184,166,.28), rgba(59,130,246,.10))'},
  {slug:'flappy-ball',title:{ro:'Flappy Ball',en:'Flappy Ball'},category:'game',tags:['Game','Arcade','Flappy'],url:'https://es-d-9192350520260329-019d2f0c-26b1-74c4-a2c0-04310269a74f.codepen.dev/',desc:{ro:'Joc arcade inspirat de mecanica Flappy, cu mișcare continuă și reflexe rapide. Creat cu HTML, CSS și JavaScript.',en:'Arcade game inspired by Flappy mechanics. Built with HTML, CSS and JavaScript.'},thumbTitle:'FLAPPY BALL',thumbSubtitle:'ARCADE',thumbColor:'#facc15',thumbBg:'linear-gradient(135deg, rgba(250,204,21,.28), rgba(234,88,12,.10))'},
  {slug:'bounce-ball',title:{ro:'Bounce Ball',en:'Bounce Ball'},category:'game',tags:['Game','Physics','Bounce'],url:'https://es-d-9192350520260329-019d2f46-380a-7240-86d0-2a6138bfc072.codepen.dev/',desc:{ro:'Joc bazat pe fizică și ricoșeu, cu interacțiuni dinamice. Proiect front-end pe CodePen.',en:'Physics-based bouncing game with dynamic interaction. Front-end project on CodePen.'},thumbTitle:'BOUNCE BALL',thumbSubtitle:'PHYSICS',thumbColor:'#38bdf8',thumbBg:'linear-gradient(135deg, rgba(56,189,248,.28), rgba(59,130,246,.10))'},
  {slug:'labirint',title:{ro:'Labirint',en:'Maze'},category:'game',tags:['Game','Maze','Logic'],url:'https://es-d-9192350520260329-019d2f38-a9f8-7ecb-9ef2-986872686b7a.codepen.dev/',desc:{ro:'Joc tip labirint cu navigare și rezolvare de trasee. Creat cu HTML, CSS și JavaScript pe CodePen.',en:'Maze game focused on navigation and path solving. Built with HTML, CSS and JavaScript on CodePen.'},thumbTitle:'MAZE',thumbSubtitle:'LABYRINTH',thumbColor:'#a78bfa',thumbBg:'linear-gradient(135deg, rgba(167,139,250,.28), rgba(139,92,246,.10))'},
  {slug:'invata-excel',title:{ro:'Învață Excel',en:'Learn Excel'},category:'utility',tags:['Learning','Excel','Education'],url:'https://es-d-9192350520260329-019d3034-1834-761b-8817-917926dc413b.codepen.dev/',desc:{ro:'Interfață educațională pentru învățarea funcțiilor și conceptelor Excel. Proiect CodePen cu HTML, CSS și JavaScript.',en:'Educational interface for learning Excel concepts. CodePen project with HTML, CSS and JavaScript.'},thumbTitle:'EXCEL',thumbSubtitle:'LEARN',thumbColor:'#22c55e',thumbBg:'linear-gradient(135deg, rgba(34,197,94,.28), rgba(16,185,129,.10))'},
  {slug:'spatiu-de-invatare',title:{ro:'Spațiu de învățare',en:'Learning Space'},category:'utility',tags:['Learning','Space','Education'],url:'https://es-d-9192350520260329-019d3097-692c-722d-b484-4bb3b55a345a.codepen.dev/',desc:{ro:'Spațiu organizat pentru studiu și explorare interactivă. Interfață educațională pe CodePen.',en:'Organized space for study and interactive exploration. Educational interface on CodePen.'},thumbTitle:'LEARNING',thumbSubtitle:'SPACE',thumbColor:'#60a5fa',thumbBg:'linear-gradient(135deg, rgba(96,165,250,.28), rgba(59,130,246,.10))'},
  {slug:'bac-learning-space',title:{ro:'BAC Learning Space Premium',en:'BAC Learning Space Premium'},category:'utility',tags:['Learning','UI','Education'],url:'https://es-d-9192350520260329-019d304f-7a11-7513-b501-5abb02444af7.codepen.dev/',desc:{ro:'Interfață premium pentru organizarea învățării și explorarea conținutului educațional. Proiect CodePen.',en:'Premium interface for organizing learning and exploring educational content. CodePen project.'},thumbTitle:'BAC',thumbSubtitle:'PREMIUM',thumbColor:'#3b82f6',thumbBg:'linear-gradient(135deg, rgba(59,130,246,.28), rgba(96,165,250,.10))'},
  {slug:'arcade-fusion-mobile',title:{ro:'Arcade Fusion Mobile Game',en:'Arcade Fusion Mobile Game'},category:'game',tags:['Game','Arcade','Mobile'],url:'https://es-d-5927833420260331-019d35b9-3b6b-728e-99f9-1e9a2bc673fa.codepen.dev/',desc:{ro:'Versiune mobile a conceptului Arcade Fusion, optimizată pentru joc rapid. Creat cu HTML, CSS și JavaScript.',en:'Mobile version of Arcade Fusion optimized for quick gameplay. Built with HTML, CSS and JavaScript.'},thumbTitle:'ARCADE',thumbSubtitle:'MOBILE',thumbColor:'#fb7185',thumbBg:'linear-gradient(135deg, rgba(251,113,133,.28), rgba(244,63,94,.10))'},
  {slug:'arcade-fusion',title:{ro:'Arcade Fusion',en:'Arcade Fusion'},category:'game',tags:['Game','Arcade','Fusion'],url:'https://es-d-5927833420260331-019d35b6-42da-71e8-a23f-17e06e63e336.codepen.dev/',desc:{ro:'Joc arcade cu energie vizuală modernă și ritm dinamic. Proiect front-end pe CodePen.',en:'Arcade game with dynamic pacing and modern style. Front-end project on CodePen.'},thumbTitle:'ARCADE',thumbSubtitle:'FUSION',thumbColor:'#60a5fa',thumbBg:'linear-gradient(135deg, rgba(96,165,250,.28), rgba(59,130,246,.10))'},
  {slug:'arcade-fusion-3',title:{ro:'Arcade Fusion 3',en:'Arcade Fusion 3'},category:'game',tags:['Game','Arcade','Fusion 3'],url:'https://es-d-5927833420260331-019d35c8-6e69-7bba-9adc-38275de6f7ca.codepen.dev/',desc:{ro:'A treia iterație Arcade Fusion, cu stil intens și prezentare extinsă. Creat pe CodePen cu JavaScript.',en:'Third Arcade Fusion iteration with stronger style. Built on CodePen with JavaScript.'},thumbTitle:'FUSION 3',thumbSubtitle:'EVOLVE',thumbColor:'#a78bfa',thumbBg:'linear-gradient(135deg, rgba(167,139,250,.28), rgba(139,92,246,.10))'},
  {slug:'coachingai',title:{ro:'CoachingAI',en:'CoachingAI'},category:'utility',tags:['AI','Coaching','App'],url:'https://es-d-5927833420260331-019d34e3-9f79-783e-a678-fdb79af31291.codepen.dev/',desc:{ro:'Aplicație de coaching asistată de AI, orientată spre ghidare și progres. Proiect CodePen.',en:'AI-assisted coaching app focused on guidance and progress. CodePen project.'},thumbTitle:'COACHING',thumbSubtitle:'AI APP',thumbColor:'#14b8a6',thumbBg:'linear-gradient(135deg, rgba(20,184,166,.28), rgba(59,130,246,.10))'},
  {slug:'alpis-content-studio',title:{ro:'ALPis CONTENT STUDIO',en:'ALPis CONTENT STUDIO'},category:'utility',tags:['Content','Studio','Brand'],url:'https://es-d-4875001020260401-019d38a5-0907-75f2-b1ab-22d6a511a9b2.codepen.dev/',desc:{ro:'Studio de conținut ALPis, cu prezentare modernă și structură orientată spre branding. Proiect front-end.',en:'Content studio with branding-focused modern presentation. Front-end project.'},thumbTitle:'ALPIS',thumbSubtitle:'CONTENT STUDIO',thumbColor:'#f472b6',thumbBg:'linear-gradient(135deg, rgba(244,114,182,.28), rgba(139,92,246,.10))'},
  {slug:'tristetea-poate-fi-eleganta',title:{ro:'Tristețea poate fi elegantă',en:'Sadness Can Be Elegant'},category:'ui',tags:['UI','Glassmorphism','Mood'],url:'https://es-d-1647531020260404-019d4d33-33a9-7efa-bf07-66c38bc4ab53.codepen.dev/',desc:{ro:'Un UI melancolic, calm și cinematografic, cu blur moale, contrast bun și ritm lent. Experiment vizual pe CodePen.',en:'A melancholic, calm and cinematic UI with soft blur, strong contrast and a slow rhythm. Visual experiment on CodePen.'},thumbTitle:'ELEGANT',thumbSubtitle:'SAD UI',thumbColor:'#a5b4fc',thumbBg:'linear-gradient(135deg, rgba(31,42,68,.30), rgba(107,126,165,.14))'},
  {slug:'front-end-playground-ultra',title:{ro:'Front-End Playground Ultra',en:'Front-End Playground Ultra'},category:'ui',tags:['UI','Design','Experiment'],url:'https://es-d-1647531020260404-019d4d1e-fe34-79ef-a2c3-151dbe2f7b6b.codepen.dev/',desc:{ro:'Explorare vizuală de interfață, pregătită pentru preview live și filtrare. Experiment UI pe CodePen.',en:'A visual interface exploration, ready for live preview and filtering. UI experiment on CodePen.'},thumbTitle:'PLAYGROUND',thumbSubtitle:'ULTRA',thumbColor:'#8b5cf6',thumbBg:'linear-gradient(135deg, rgba(79,140,255,.20), rgba(139,92,246,.18))'},
  {slug:'useless-but-addictive',title:{ro:'Useless but addictive',en:'Useless but addictive'},category:'ui',tags:['UI','Fun','Addictive'],url:'https://es-d-1647531020260404-019d4da3-1f66-70ec-8302-5dd35a1b3138.codepen.dev/',desc:{ro:'Experiment interactiv jucăuș, inutil în cel mai bun sens, dar surprinzător de captivant. Creat pe CodePen.',en:'A playful interactive experiment, gloriously useless and surprisingly addictive. Built on CodePen.'},thumbTitle:'USELESS',thumbSubtitle:'ADDICTIVE',thumbColor:'#f472b6',thumbBg:'linear-gradient(135deg, rgba(244,114,182,.24), rgba(251,191,36,.16))'},
  {slug:'clientflow-mobile-first',title:{ro:'ClientFlow Mobile-first SaaS',en:'ClientFlow Mobile-first SaaS'},category:'utility',tags:['SaaS','Mobile-first','ClientFlow'],url:'https://es-d-1647531020260404-019d4e21-afd1-7808-abf5-d9c88b726df2.codepen.dev/',desc:{ro:'Versiune ClientFlow gândită mobile-first, cu structură SaaS clară. Interfață optimizată pentru ecrane mici, creată pe CodePen.',en:'A mobile-first ClientFlow version with a clear SaaS structure optimized for small screens. Built on CodePen.'},thumbTitle:'CLIENTFLOW',thumbSubtitle:'MOBILE-FIRST',thumbColor:'#34d399',thumbBg:'linear-gradient(135deg, rgba(52,211,153,.28), rgba(59,130,246,.12))'}
];

const outDir = path.join(__dirname, 'projects');

function generatePage(p) {
  const canonical = `https://laurandreea10.github.io/codepen-portfolio/projects/${p.slug}.html`;
  return `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${p.title.ro} | Laura Andreea CodePen Portfolio</title>
  <meta name="description" content="${p.desc.ro}" />
  <meta name="author" content="Laura Andreea" />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#071226" />
  <link rel="canonical" href="${canonical}" />
  <link rel="icon" type="image/svg+xml" href="../favicon.svg" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${p.title.ro} | Laura Andreea" />
  <meta property="og:description" content="${p.desc.ro}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:site_name" content="CodePen Portfolio" />
  <meta property="og:locale" content="ro_RO" />
  <meta property="og:image" content="https://laurandreea10.github.io/codepen-portfolio/og-cover.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${p.title.ro} | Laura Andreea" />
  <meta name="twitter:description" content="${p.desc.ro}" />
  <meta name="twitter:image" content="https://laurandreea10.github.io/codepen-portfolio/og-cover.jpg" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "${p.title.en}",
    "description": "${p.desc.en}",
    "url": "${canonical}",
    "author": {
      "@type": "Person",
      "name": "Laura Andreea",
      "url": "https://laurandreea10.github.io/codepen-portfolio/"
    },
    "genre": "${p.category}",
    "keywords": "${p.tags.join(', ')}",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Laura Andreea CodePen Portfolio",
      "url": "https://laurandreea10.github.io/codepen-portfolio/"
    }
  }
  </script>
  <style>
    :root{
      --bg:#071226;--bg-2:#0b1730;--panel:rgba(13,24,46,.78);--panel-2:rgba(255,255,255,.06);
      --text:#eef4ff;--muted:#9db0d4;--line:rgba(255,255,255,.1);
      --accent:#4f8cff;--accent-2:#8b5cf6;--shadow:0 20px 50px rgba(0,0,0,.35);--container:860px;
    }
    *{box-sizing:border-box}
    html{scroll-behavior:smooth}
    body{
      margin:0;
      font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      background:
        radial-gradient(circle at top left, rgba(79,140,255,.18), transparent 26%),
        radial-gradient(circle at bottom right, rgba(139,92,246,.16), transparent 24%),
        linear-gradient(180deg,var(--bg-2),var(--bg));
      color:var(--text);
      min-height:100vh;
    }
    a{color:inherit}
    .container{width:min(var(--container), calc(100% - 32px));margin:0 auto;}
    .glass{
      background:var(--panel);border:1px solid var(--line);
      box-shadow:var(--shadow);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
    }
    .topbar{padding:18px 0;}
    .nav{
      padding:14px 18px;border-radius:999px;display:flex;align-items:center;
      justify-content:space-between;gap:16px;flex-wrap:wrap;
    }
    .brand{display:flex;align-items:center;gap:12px;font-weight:800;letter-spacing:.02em;text-decoration:none;}
    .brand-badge{
      width:42px;height:42px;border-radius:14px;display:grid;place-items:center;
      background:linear-gradient(135deg,var(--accent),var(--accent-2));color:#fff;font-weight:800;
    }
    .back{
      border:1px solid var(--line);background:var(--panel-2);color:var(--text);
      border-radius:999px;padding:10px 14px;text-decoration:none;font-weight:600;transition:.2s ease;
    }
    .back:hover{transform:translateY(-1px);border-color:rgba(79,140,255,.34);}
    .card{border-radius:24px;padding:28px;margin:22px 0;}
    .eyebrow{
      display:inline-flex;font-size:.84rem;font-weight:800;text-transform:uppercase;
      letter-spacing:.08em;color:var(--accent);margin-bottom:14px;
    }
    h1{
      margin:0 0 18px;font-size:clamp(1.8rem,4vw,2.6rem);line-height:1.1;letter-spacing:-.03em;
    }
    p{margin:0 0 14px;color:var(--muted);line-height:1.8;font-size:1.02rem;}
    .tags{display:flex;flex-wrap:wrap;gap:10px;margin:18px 0;}
    .tag{
      display:inline-flex;padding:8px 12px;border-radius:999px;
      background:var(--panel-2);border:1px solid var(--line);color:var(--muted);
      font-size:.86rem;text-transform:capitalize;
    }
    .tag.game{color:#ffd7c0;background:rgba(249,115,22,.14);border-color:rgba(249,115,22,.24)}
    .tag.utility{color:#c5ffe5;background:rgba(16,185,129,.14);border-color:rgba(16,185,129,.24)}
    .tag.challenge{color:#edd6ff;background:rgba(168,85,247,.14);border-color:rgba(168,85,247,.24)}
    .tag.ui{color:#cfe2ff;background:rgba(96,165,250,.14);border-color:rgba(96,165,250,.24)}
    .thumb{
      position:relative;min-height:220px;border-radius:22px;overflow:hidden;
      border:1px solid var(--line);padding:14px;margin-bottom:22px;
    }
    .thumb-browser{display:flex;gap:6px;margin-bottom:12px;}
    .thumb-browser span{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.34);}
    .thumb-screen{
      min-height:170px;border-radius:18px;border:1px solid rgba(255,255,255,.08);
      background:rgba(5,10,22,.42);display:flex;flex-direction:column;align-items:center;
      justify-content:center;padding:24px;text-align:center;
    }
    .thumb-title{
      font-size:clamp(1.8rem,4vw,2.6rem);font-weight:800;letter-spacing:.08em;
      text-transform:uppercase;line-height:1;
    }
    .thumb-subtitle{
      margin-top:10px;font-size:.82rem;letter-spacing:.18em;text-transform:uppercase;
      color:rgba(255,255,255,.72);
    }
    .thumb-bar{
      margin-top:18px;width:72%;height:38px;border-radius:12px;
      background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.08);
    }
    .actions{display:flex;gap:12px;flex-wrap:wrap;margin:22px 0;}
    .btn{
      min-height:48px;display:inline-flex;align-items:center;justify-content:center;
      padding:0 20px;border-radius:999px;font-weight:700;text-decoration:none;transition:.22s ease;
      border:1px solid transparent;
    }
    .btn:hover{transform:translateY(-2px)}
    .btn-primary{
      color:#fff;background:linear-gradient(135deg,var(--accent),var(--accent-2));
      box-shadow:0 16px 28px rgba(37,99,235,.25);
    }
    .btn-secondary{background:var(--panel-2);color:var(--text);border-color:var(--line);}
    .footer{padding:28px 0;text-align:center;color:var(--muted);font-size:.92rem;}
    @media (max-width:760px){
      .card{padding:18px;}
      .container{width:min(var(--container), calc(100% - 20px));}
    }
  </style>
</head>
<body>
  <div class="topbar">
    <div class="container">
      <nav class="nav glass">
        <a class="brand" href="../index.html">
          <span class="brand-badge" aria-hidden="true">CP</span>
          <span>Portofoliu CodePen</span>
        </a>
        <a class="back" href="../index.html#projects">&larr; Toate proiectele</a>
      </nav>
    </div>
  </div>
  <main>
    <div class="container">
      <article class="card glass">
        <span class="eyebrow">${p.category}</span>
        <h1>${p.title.ro}</h1>
        <p>${p.desc.ro}</p>
        <p><em>${p.desc.en}</em></p>
        <div class="tags">
          <span class="tag ${p.category}">${p.category}</span>
          ${p.tags.map(t => `<span class="tag">${t}</span>`).join('\n          ')}
        </div>
        <div class="thumb" style="background:${p.thumbBg}">
          <div class="thumb-browser"><span></span><span></span><span></span></div>
          <div class="thumb-screen">
            <div class="thumb-title" style="color:${p.thumbColor}">${p.thumbTitle}</div>
            <div class="thumb-subtitle">${p.thumbSubtitle}</div>
            <div class="thumb-bar"></div>
          </div>
        </div>
        <div class="actions">
          <a class="btn btn-primary" href="${p.url}" target="_blank" rel="noopener noreferrer">Deschide pe CodePen</a>
          <a class="btn btn-secondary" href="../index.html#projects">Toate proiectele</a>
        </div>
        <section>
          <h2 style="font-size:1.1rem;margin:22px 0 10px;">Despre acest proiect</h2>
          <p>
            Acest proiect face parte din portofoliul front-end al Laurei Andreea și a fost creat
            folosind HTML, CSS și JavaScript. Este publicat pe CodePen și poate fi explorat
            interactiv direct din browser. Categoria principală este <strong>${p.category}</strong>,
            iar tehnologiile și conceptele folosite includ: ${p.tags.join(', ')}.
          </p>
          <p>
            This project is part of Laura Andreea's front-end portfolio and was built using
            HTML, CSS and JavaScript. It is published on CodePen and can be explored interactively
            in the browser. The main category is <strong>${p.category}</strong>, and the
            technologies and concepts used include: ${p.tags.join(', ')}.
          </p>
        </section>
      </article>
    </div>
  </main>
  <footer class="footer">
    <div class="container">
      Laura Andreea &mdash; CodePen Portfolio &bull;
      <a href="../index.html" style="color:var(--accent)">Pagina principală</a>
    </div>
  </footer>
</body>
</html>`;
}

// Generate all pages
projects.forEach(p => {
  const filePath = path.join(outDir, `${p.slug}.html`);
  fs.writeFileSync(filePath, generatePage(p), 'utf8');
});

console.log(`Generated ${projects.length} project pages in ${outDir}`);
