// Builds data/catalog.json — the index used by the Ctrl+K search (portfolio-plus.js).
// Sources: projects.json (the existing catalogue), the local case-study pages in
// projects/, the game folders in this repo and the hub pages. Nothing is removed
// from projects.json; this file only reads it.
//
// Run: node scripts/build-catalog.mjs
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const SITE = "https://laurandreea10.github.io/codepen-portfolio/";
const projects = JSON.parse(readFileSync("projects.json", "utf8"));

const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/\+/g, " plus ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Title → local case-study page when the slug does not match the title.
const pageOverrides = {
  "PvAI - New Game+ v5": "projects/pvai-new-game-plus.html",
  "VOID HUNTER — Space Shooter": "projects/void-hunter.html",
  "PhotoAuto Studio Premium": "projects/photoauto-studio.html",
  "ALPIS ImpactPath": "projects/alpis-impactpath.html",
  "ClientFlow": "projects/clientflow.html",
  "ClientFlow Mobile-first SaaS": "projects/clientflow-mobile-first.html",
  "Arcade Fusion Mobile Game": "projects/arcade-fusion-mobile.html",
  "ALPis CONTENT STUDIO": "projects/alpis-content-studio.html",
  "Spațiu de învățare": "projects/spatiu-de-invatare.html",
  "BAC Learning Space Premium": "projects/bac-learning-space.html",
  "LOOP — Cosmic Relay": "projects/loop-cosmic-relay.html",
  "Gimnaziu Space · ExamSpace V–VIII": "projects/examspace-v-viii.html",
  "Alpis Fusion CRM": "alpis-fusion-crm.html",
  "BAC Space Premium": "bac-space-premium.html"
};

const toLocal = (url) => url.startsWith(SITE) ? url.slice(SITE.length) || "portfolio.html" : url;

const items = [];
for (const p of projects) {
  const title = p.title?.ro || p.title?.en;
  if (!title) continue;
  const guess = `projects/${slug(title)}.html`;
  const page = pageOverrides[title] && existsSync(pageOverrides[title]) ? pageOverrides[title] : existsSync(guess) ? guess : null;
  const live = toLocal(p.url || "");
  // Prefer a stable address: a local page or a GitHub Pages / CodePen URL.
  // Temporary *.codepen.dev previews are kept only as a secondary "live" link.
  const temporary = /\.codepen\.dev\//.test(live);
  items.push({
    id: `p${p.id}`,
    kind: "project",
    cat: p.category,
    game: p.category === "game" || p.slug === "candy-route",
    title: { ro: p.title.ro, en: p.title.en || p.title.ro },
    desc: { ro: p.description?.ro || "", en: p.description?.en || p.description?.ro || "" },
    tags: p.tags || [],
    href: page || (temporary ? null : live),
    live: temporary ? live : (page ? live : null)
  });
}

// Projects that live in this repo or on GitHub Pages but are not in projects.json.
const extras = [
  ["kygo-world", "game", "Kygo World", "Kygo World", "Joc bilingv cu Kygo: patru lumi, ediții sezoniere și progres local.", "Bilingual game starring Kygo: four worlds, seasonal editions and local progress.", "kygo-world/", null, ["Game", "Canvas", "RO/EN"]],
  ["booscary", "challenge", "Halloween BooScary", "Halloween BooScary", "CodePen Challenge Halloween: FizzBuzz cu Boo / Scary / BooScary, șase moduri și atelier de dovleci.", "Halloween CodePen Challenge: FizzBuzz with Boo / Scary / BooScary, six modes and a pumpkin studio.", "booscary/", null, ["Challenge", "Game", "Tests"]],
  ["pumpkin-weigh-in", "challenge", "Pumpkin Weigh-In", "Pumpkin Weigh-In", "CodePen Challenge Halloween, săptămâna 3: cântar de dovleci cu categorii și teste Jest.", "Halloween CodePen Challenge, week 3: a pumpkin scale with categories and Jest tests.", "pumpkin-weigh-in/", null, ["Challenge", "Jest", "Tests"]],
  ["tri-link-quest", "game", "Tri-Link Quest", "Tri-Link Quest", "Joc accesibil 3-în-1: puzzle glisant, match-3 și connect, 10 niveluri, PWA offline.", "Accessible 3-in-1 game: sliding puzzle, match-3 and connect, 10 levels, offline PWA.", "projects/tri-link-quest.html", "https://laurandreea10.github.io/Tri-Link-Quest/", ["Game", "PWA", "A11y"]],
  ["curious-garden-local", "game", "Grădina Curioasă", "Curious Garden", "Joc educațional bilingv pentru copii de 3–12 ani, cu 12 lumi.", "Bilingual educational game for children aged 3–12, with 12 worlds.", "curious-garden/", null, ["Game", "Kids", "RO/EN"]],
  ["alpis-premium", "crm", "Alpis Fusion CRM Premium", "Alpis Fusion CRM Premium", "CRM modular în React + Vite: pipeline, task-uri, booking, billing, RBAC.", "Modular React + Vite CRM: pipeline, tasks, booking, billing, RBAC.", "alpis-fusion-crm.html", "https://laurandreea10.github.io/Alpis-Fusion-CRM-premium/", ["CRM", "React", "Vite"]],
  ["clientflow-pro", "crm", "ClientFlow PRO", "ClientFlow PRO", "Suită operațională în TypeScript, fluxuri pe roluri, PWA.", "TypeScript operations suite with role-aware workflows, PWA.", "projects/clientflow.html", "https://laurandreea10.github.io/ClientFlow-PRO/#/", ["CRM", "TypeScript", "PWA"]],
  ["link-video", "utility", "Link Video Editor Studio", "Link Video Editor Studio", "Workflow video repetabil: preseturi, validare, exporturi și Automation Pack.", "Repeatable video workflow: presets, validation, exports and an Automation Pack.", "projects/link-video-editor-studio.html", "https://laurandreea10.github.io/Link-Video-Editor-Studio/", ["Automation", "Workflow"]],
  ["revenue-landscape", "ui", "Revenue Landscape", "Revenue Landscape", "Peisaj izometric 3D al veniturilor în Canvas 2D.", "Isometric 3D revenue landscape in Canvas 2D.", "https://laurandreea10.github.io/Revenue-Landscape/", null, ["Data viz", "Canvas"]],
  ["bugflow", "utility", "BUGFLOW v10", "BUGFLOW v10", "Editor local-first pentru fluxuri de bug-uri, securizat și testat.", "Local-first bug-flow editor, hardened and tested.", "https://laurandreea10.github.io/-BUGFLOW/", null, ["Mermaid", "PWA", "Security"]]
];
for (const [id, cat, ro, en, dro, den, href, live, tags] of extras) {
  if (items.some((x) => x.title.ro === ro)) continue;
  items.push({ id, kind: "project", cat, game: cat === "game" || ["booscary"].includes(id), title: { ro, en }, desc: { ro: dro, en: den }, tags, href, live });
}

const pages = [
  ["evolution-lab.html", "Evolution Lab", "Evolution Lab", "Înainte, acum, dovadă: evoluția proiectelor.", "Before, now, proof: how the projects evolved."],
  ["portfolio-summary.html", "Rezumat în 60 de secunde", "60-second snapshot", "Profil, Top 3 și rezultate măsurabile.", "Profile, Top 3 and measurable results."],
  ["growth-suite.html", "LaurAi Growth Suite", "LaurAi Growth Suite", "Cele zece experiențe conectate.", "The ten connected experiences."],
  ["case-study-story.html", "Case Study Story Mode", "Case Study Story Mode", "Problemă, decizie, implementare, dovadă, lecție.", "Problem, decision, build, proof, lesson."],
  ["before-after.html", "Înainte / după", "Before / after", "Versiunile inițiale comparate cu produsele actuale.", "Early versions compared with today's products."],
  ["guided-tour.html", "Tur ghidat", "Guided tour", "Traseu de 90 de secunde prin portofoliu.", "A 90-second route through the portfolio."],
  ["accessibility-lab.html", "Accessibility Lab", "Accessibility Lab", "Contrast, text mare, tastatură, feedback multimodal.", "Contrast, large text, keyboard, multimodal feedback."],
  ["build-in-public.html", "Jurnal Build in Public", "Build in Public log", "Probleme, remedieri, dovezi și lecții.", "Problems, fixes, proof and lessons."],
  ["what-i-learned.html", "Ce am învățat", "What I learned", "Lecțiile fiecărei etape.", "The lessons from each stage."],
  ["proof-registry.html", "Proof Registry", "Proof Registry", "Implementări verificabile și audituri.", "Verifiable builds and audits."],
  ["proof-dashboard.html", "Proof Dashboard", "Proof Dashboard", "Status pentru demo, documentație, audit, CI/CD.", "Status for demos, docs, audits, CI/CD."],
  ["release-timeline.html", "Releases", "Releases", "Istoricul livrărilor.", "Release history."],
  ["project-health.html", "Project Health", "Project Health", "Starea tehnică a proiectelor principale.", "Technical health of the main projects."],
  ["process.html", "Process", "Process", "De la idee la versiune publicată.", "From idea to published version."],
  ["uses.html", "Uses", "Uses", "Uneltele și stack-ul.", "Tools and stack."],
  ["canva-collection.html", "Colecție Canva", "Canva collection", "Materiale de design pentru educație, CRM și marketing.", "Design pieces for education, CRM and marketing."],
  ["ecosystem-map.html", "Ecosistem LaurAi", "LaurAi ecosystem", "Harta direcțiilor: CRM, Marketing-Tech, jocuri.", "Map of the directions: CRM, Marketing-Tech, games."],
  ["demo-scenarios.html", "Demo Scenarios", "Demo Scenarios", "Trasee pentru manager, agent, client.", "Routes for manager, agent, client."],
  ["recruiter-kit.html", "Experience Kit", "Experience Kit", "Bio, competențe, Top 3 și PDF.", "Bio, skills, Top 3 and PDF."],
  ["insights/saas-crm-lectii.html", "3 lecții din construirea unui SaaS CRM", "3 lessons from building a SaaS CRM", "Insight despre produs și decizii.", "An insight on product and decisions."],
  ["insights/single-file-la-vite-react.html", "De la single-file la Vite + React", "From single-file to Vite + React", "Insight despre arhitectură.", "An insight on architecture."]
].filter(([href]) => existsSync(href));

for (const [href, ro, en, dro, den] of pages) {
  items.push({ id: `page-${slug(href)}`, kind: "page", cat: "page", title: { ro, en }, desc: { ro: dro, en: den }, tags: [], href, live: null });
}

const out = { generated: new Date().toISOString().slice(0, 10), count: items.length, items };
writeFileSync("data/catalog.json", JSON.stringify(out, null, 2) + "\n");
const missing = items.filter((x) => !x.href && !x.live).map((x) => x.title.ro);
const canonical = Number(readFileSync("portfolio-config.js", "utf8").match(/projectCount:\s*(\d+)/)?.[1]);
const searchable = items.filter((x) => x.kind === "project").length;
if (canonical && searchable !== canonical) {
  console.warn(`Note: portfolio-config.js says ${canonical} projects, the search catalogue has ${searchable}. Add the missing ones to projects.json or the extras list so Ctrl+K finds every project.`);
}
console.log(`data/catalog.json: ${items.length} items (${items.filter((x) => x.kind === "project").length} projects, ${pages.length} pages)` + (missing.length ? `\nNo link: ${missing.join(", ")}` : ""));
