// Cookieless analytics with GoatCounter (free, no banner needed, no personal data).
// Off until PORTFOLIO_CONFIG.analytics.goatcounter holds a site code
// (the "xyz" in https://xyz.goatcounter.com). Set it in portfolio-config.js.
//
// Counts page views plus one event per click on a project, an outbound link,
// the e-mail link or the language switch, so the dashboard shows which projects
// people actually open. Skipped on localhost and when the visitor sends
// Do Not Track or Global Privacy Control.
(() => {
  "use strict";
  const code = window.PORTFOLIO_CONFIG?.analytics?.goatcounter;
  if (!code || !/^[a-z0-9-]+$/i.test(code)) return;
  if (/^(localhost|127\.|0\.0\.0\.0)/.test(location.hostname) || location.protocol === "file:") return;
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://gc.zgo.at/count.js";
  script.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
  document.head.appendChild(script);

  const slug = (value) => value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9/.#-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

  function describe(link) {
    const href = link.getAttribute("href") || "";
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) return null;
    if (href.startsWith("mailto:")) return { path: "click/email", title: "E-mail" };
    const url = new URL(href, location.href);
    const label = (link.getAttribute("aria-label") || link.textContent || "").replace(/\s+/g, " ").trim().slice(0, 100);
    if (link.hreflang || /^(en\/?|\.\.\/portfolio\.html)$/.test(href)) return { path: "click/lang-" + (link.hreflang || "ro"), title: label };
    if (url.origin !== location.origin) return { path: "click/out/" + slug(url.hostname + url.pathname), title: label };
    // Same site: count project pages and game folders, not plain page anchors.
    const local = url.pathname.replace(/^\/codepen-portfolio\//, "");
    if (!local || local === location.pathname.replace(/^\/codepen-portfolio\//, "")) return null;
    return { path: "click/" + slug(local), title: label };
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest?.("a[href]");
    if (!link) return;
    const info = describe(link);
    if (!info) return;
    const send = () => window.goatcounter?.count?.({ path: info.path, title: info.title, event: true });
    // count.js may still be loading on a very early click; try again shortly.
    if (window.goatcounter?.count) send(); else setTimeout(send, 1200);
  }, { capture: true, passive: true });
})();
