import { existsSync, writeFileSync } from "node:fs";

const origin = "https://laurandreea10.github.io/codepen-portfolio";
const pages = [
  ["growth-quest/", "monthly", "0.8", "2026-10-09"],
  ["growth-quest/funnel-forge.html", "monthly", "0.7", "2026-10-09"],
  ["growth-quest/about.html", "monthly", "0.6", "2026-10-09"],
  ["growth-quest/guide.html", "monthly", "0.6", "2026-10-09"],
  ["growth-quest/demo-case.html", "monthly", "0.7", "2026-10-09"],
  ["booscary/case-study.html", "monthly", "0.6", "2026-10-06"],
  ["booscary/demo.html", "monthly", "0.6", "2026-10-06"],
  ["booscary/", "monthly", "0.7", "2026-10-06"],
  ["pentarena/", "monthly", "0.7", "2026-10-05"],
  ["pentarena/changelog.html", "monthly", "0.6", "2026-10-05"],
  ["serpent-prism/", "monthly", "0.7", "2026-10-03"],
  ["serpent-prism/changelog.html", "monthly", "0.6", "2026-10-03"],
  ["slidestorm-arena/", "monthly", "0.7", "2026-10-02"],
  ["slidestorm-arena/case-study.html", "monthly", "0.7", "2026-10-02"],
  ["odyssey-quest/", "monthly", "0.7", "2026-10-02"],
  ["odyssey-quest/case-study.html", "monthly", "0.7", "2026-10-01"],
  ["portfolio.html", "weekly", "1.0", "2026-10-09"],
  ["en/", "weekly", "0.9", "2026-10-09"],
  ["alpis-fusion-crm.html", "monthly", "0.9", "2026-08-30"],
  ["projects/clientflow.html", "monthly", "0.9", "2026-08-30"],
  ["projects/alpis-impactpath.html", "monthly", "0.9", "2026-04-20"],
  ["projects/clientops-suite-premium.html", "monthly", "0.9", "2026-08-30"],
  ["projects/pulseboard.html", "monthly", "0.8", "2026-05-29"],
  ["projects/excel-quest.html", "monthly", "0.8", "2026-05-01"],
  ["process.html", "monthly", "0.8", "2026-05-15"],
  ["work-with-me.html", "monthly", "0.8", "2026-05-20"],
  ["insights.html", "weekly", "0.8", "2026-04-25"],
  ["changelog.html", "weekly", "0.7", "2026-10-09"],
  ["proof-pack.html", "monthly", "0.9", "2026-09-20"],
  ["mobile-test-lab.html", "monthly", "0.8", "2026-09-27"],
  ["uses.html", "monthly", "0.6", "2026-05-15"],
  ["campaignpilot.html", "monthly", "0.7", "2026-05-10"],
  ["Campaign%20ROI%20Calculator.html", "monthly", "0.7", "2026-05-10"],
  ["utm-builder.html", "monthly", "0.6", "2026-05-20"],
  ["ab-test-simulator.html", "monthly", "0.6", "2026-05-20"],
  ["email-subject-line-tester.html", "monthly", "0.6", "2026-05-19"],
  ["conversion-funnel-visualizer.html", "monthly", "0.6", "2026-05-20"],
  ["tools/marketing-os.html", "monthly", "0.7", "2026-05-24"],
  ["tools/link-video-automation-pack.html", "monthly", "0.7", "2026-08-29"],
  ["insights/saas-crm-lectii.html", "monthly", "0.7", "2026-05-23"],
  ["insights/single-file-la-vite-react.html", "monthly", "0.7", "2026-05-23"],
  ["insights/flow-builder-vs-kanban.html", "monthly", "0.7", "2026-05-23"],
  ["insights/ce-as-documenta.html", "monthly", "0.6", "2026-05-23"],
  ["project-health.html", "monthly", "0.8", "2026-09-20"],
  ["proof-registry.html", "monthly", "0.7", "2026-09-27"],
  ["game-audits.html", "monthly", "0.7", "2026-09-06"],
  ["release-timeline.html", "monthly", "0.7", "2026-09-06"],
  ["lead-magnet-landing.html", "monthly", "0.7", "2026-09-06"],
  ["accessibility-scorecard.html", "monthly", "0.7", "2026-09-06"],
  ["en/project-health.html", "monthly", "0.7", "2026-09-20"],
  ["en/proof-registry.html", "monthly", "0.7", "2026-09-27"],
  ["en/game-audits.html", "monthly", "0.7", "2026-09-06"],
  ["en/release-timeline.html", "monthly", "0.7", "2026-09-06"],
  ["evolution-lab.html", "monthly", "0.9", "2026-10-02"],
  ["design-system.html", "monthly", "0.8", "2026-09-13"],
  ["portfolio-summary.html", "monthly", "0.9", "2026-09-14"],
  ["growth-suite.html", "monthly", "0.9", "2026-09-13"],
  ["en/growth-suite.html", "monthly", "0.8", "2026-09-13"],
  ["case-study-story.html", "monthly", "0.7", "2026-09-13"],
  ["guided-tour.html", "monthly", "0.7", "2026-09-13"],
  ["recruiter-kit.html", "monthly", "0.7", "2026-09-13"],
  ["ecosystem-map.html", "monthly", "0.7", "2026-09-13"],
  ["proof-dashboard.html", "monthly", "0.7", "2026-09-13"],
  ["what-i-learned.html", "monthly", "0.7", "2026-09-13"],
  ["before-after.html", "monthly", "0.7", "2026-09-13"],
  ["demo-scenarios.html", "monthly", "0.7", "2026-09-13"],
  ["accessibility-lab.html", "monthly", "0.7", "2026-09-13"],
  ["build-in-public.html", "monthly", "0.7", "2026-09-13"],
  ["clipboard-crm-summary.html", "monthly", "0.75", "2026-09-21"],
  ["dashboard-activity-filter.html", "monthly", "0.75", "2026-09-23"],
  ["skydreams-portal/", "monthly", "0.8", "2026-09-27"],
  ["kygo-world/", "monthly", "0.8", "2026-09-27"],
  ["crm-accessible-form.html", "monthly", "0.75", "2026-09-25"],
  ["crm-json-backup.html", "monthly", "0.75", "2026-09-28"],
  ["crm-optimistic-undo.html", "monthly", "0.75", "2026-09-30"],
  ["canva-collection.html", "monthly", "0.6", "2026-10-02"],
  ["en/canva-collection.html", "monthly", "0.6", "2026-10-02"],
  ["dashboard-async-resilience.html", "monthly", "0.75", "2026-10-02"],
  ["curious-garden/", "weekly", "0.85", "2026-10-03"],
  ["curious-garden/case-study.html", "monthly", "0.75", "2026-10-01"],
  ["crm-client-card.html", "monthly", "0.5", "2026-09-16"],
  ["dashboard-activity-states.html", "monthly", "0.5", "2026-09-18"],
  ["frontend-newsroom.html", "monthly", "0.5", "2026-05-19"],
  ["negociator-pro.html", "monthly", "0.5", "2026-05-20"],
  ["surfin-bird-quest-premium.html", "monthly", "0.5", "2026-05-14"],
  ["tools/lighthouse-audit-guide.html", "monthly", "0.5", "2026-05-24"],
  ["tools/marketing-tech-templates.html", "monthly", "0.5", "2026-05-24"],
  ["projects/alpis-content-studio.html", "monthly", "0.5", "2026-04-04"],
  ["projects/alpis-fusion-case-study.html", "monthly", "0.5", "2026-05-24"],
  ["projects/arcade-fusion-3.html", "monthly", "0.5", "2026-04-04"],
  ["projects/arcade-fusion-mobile.html", "monthly", "0.5", "2026-04-04"],
  ["projects/arcade-fusion.html", "monthly", "0.5", "2026-04-04"],
  ["projects/bac-learning-space.html", "monthly", "0.5", "2026-04-04"],
  ["projects/basket-vs-ai-pro.html", "monthly", "0.5", "2026-04-04"],
  ["projects/basket-vs-ai.html", "monthly", "0.5", "2026-04-04"],
  ["projects/bomberman-neo.html", "monthly", "0.5", "2026-04-04"],
  ["projects/boolean-oracle.html", "monthly", "0.5", "2026-04-04"],
  ["projects/bounce-ball.html", "monthly", "0.5", "2026-04-04"],
  ["projects/breakout.html", "monthly", "0.5", "2026-04-04"],
  ["projects/budgetflow-pro-x.html", "monthly", "0.5", "2026-04-04"],
  ["projects/clientflow-mobile-first.html", "monthly", "0.5", "2026-04-04"],
  ["projects/clientflow-pro.html", "monthly", "0.5", "2026-04-24"],
  ["projects/coachingai.html", "monthly", "0.5", "2026-04-04"],
  ["projects/color-lab.html", "monthly", "0.5", "2026-04-04"],
  ["projects/event-planner.html", "monthly", "0.5", "2026-04-04"],
  ["projects/flappy-ball.html", "monthly", "0.5", "2026-04-04"],
  ["projects/front-end-opposites-2.html", "monthly", "0.5", "2026-04-04"],
  ["projects/front-end-opposites.html", "monthly", "0.5", "2026-04-04"],
  ["projects/front-end-playground-ultra.html", "monthly", "0.5", "2026-04-04"],
  ["projects/gravity-draw.html", "monthly", "0.5", "2026-04-04"],
  ["projects/home-air-hockey.html", "monthly", "0.5", "2026-04-04"],
  ["projects/invata-excel.html", "monthly", "0.5", "2026-04-04"],
  ["projects/labirint.html", "monthly", "0.5", "2026-04-04"],
  ["projects/loop-cosmic-relay.html", "monthly", "0.5", "2026-09-13"],
  ["projects/min-preferred-max.html", "monthly", "0.5", "2026-04-04"],
  ["projects/nexus-arcade.html", "monthly", "0.5", "2026-04-04"],
  ["projects/opposite-directions.html", "monthly", "0.5", "2026-04-04"],
  ["projects/particle-memory.html", "monthly", "0.5", "2026-04-04"],
  ["projects/photoauto-studio.html", "monthly", "0.5", "2026-04-04"],
  ["projects/pvai-new-game-plus.html", "monthly", "0.5", "2026-04-04"],
  ["projects/spatiu-de-invatare.html", "monthly", "0.5", "2026-04-04"],
  ["projects/synth-wave.html", "monthly", "0.5", "2026-04-04"],
  ["projects/tic-tac-toe.html", "monthly", "0.5", "2026-10-05"],
  ["projects/tri-link-quest.html", "monthly", "0.5", "2026-09-15"],
  ["projects/tristetea-poate-fi-eleganta.html", "monthly", "0.5", "2026-04-04"],
  ["projects/useless-but-addictive.html", "monthly", "0.5", "2026-04-04"],
  ["projects/void-hunter.html", "monthly", "0.5", "2026-04-04"],
];

const pairs = new Map([
  ["canva-collection.html", ["canva-collection.html", "en/canva-collection.html"]],
  ["en/canva-collection.html", ["canva-collection.html", "en/canva-collection.html"]],
  ["portfolio.html", ["portfolio.html", "en/"]],
  ["en/", ["portfolio.html", "en/"]],
  ["project-health.html", ["project-health.html", "en/project-health.html"]],
  ["en/project-health.html", ["project-health.html", "en/project-health.html"]],
  ["proof-registry.html", ["proof-registry.html", "en/proof-registry.html"]],
  ["en/proof-registry.html", ["proof-registry.html", "en/proof-registry.html"]],
  ["game-audits.html", ["game-audits.html", "en/game-audits.html"]],
  ["en/game-audits.html", ["game-audits.html", "en/game-audits.html"]],
  [
    "release-timeline.html",
    ["release-timeline.html", "en/release-timeline.html"],
  ],
  [
    "en/release-timeline.html",
    ["release-timeline.html", "en/release-timeline.html"],
  ],
  ["growth-suite.html", ["growth-suite.html", "en/growth-suite.html"]],
  ["en/growth-suite.html", ["growth-suite.html", "en/growth-suite.html"]],
]);

const missing = pages
  .map(([path]) => path)
  .filter(
    (path) =>
      path &&
      !existsSync(
        decodeURIComponent(path) + (path.endsWith("/") ? "index.html" : ""),
      ),
  );

if (missing.length) {
  console.error(`Sitemap aborted. Missing files:\n${missing.join("\n")}`);
  process.exit(1);
}

const entries = pages
  .map(([path, changefreq, priority, lastModified]) => {
    const url = `${origin}/${path}`;
    const pair = pairs.get(path);
    const alternates = pair
      ? `\n    <xhtml:link rel="alternate" hreflang="ro" href="${origin}/${pair[0]}" />\n    <xhtml:link rel="alternate" hreflang="en" href="${origin}/${pair[1]}" />\n    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/${pair[0]}" />`
      : "";
    return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${lastModified}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>${alternates}\n  </url>`;
  })
  .join("\n\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries}\n</urlset>\n`;
writeFileSync("sitemap.xml", xml);
console.log(`Generated sitemap.xml with ${pages.length} canonical URLs.`);




