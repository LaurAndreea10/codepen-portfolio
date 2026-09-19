(() => {
  "use strict";
  const config = Object.freeze({
    projectCount: 85,
    repositoryCount: "20+",
    accessibilityScore: 100,
    updated: "2026-09-19"
  });
  window.PORTFOLIO_CONFIG = config;

  function replaceCount(value) {
    return value.replace(/\b(?:84|85)\b/g, String(config.projectCount));
  }

  function syncPublicMetrics() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (/\b(?:84|85)\b/.test(node.nodeValue)) {
        node.nodeValue = replaceCount(node.nodeValue);
      }
    });

    document.querySelectorAll("[aria-label]").forEach(node => {
      const label = node.getAttribute("aria-label");
      if (label && /\b(?:84|85)\b/.test(label)) {
        node.setAttribute("aria-label", replaceCount(label));
      }
    });

    document.querySelectorAll('meta[name="description"],meta[property="og:description"],meta[name="twitter:description"]').forEach(meta => {
      const value = meta.getAttribute("content") || "";
      meta.setAttribute("content", replaceCount(value));
    });

    document.querySelectorAll('script[type="application/ld+json"]').forEach(script => {
      script.textContent = replaceCount(script.textContent);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncPublicMetrics, { once: true });
  } else {
    syncPublicMetrics();
  }
})();