(() => {
  "use strict";
  const config = Object.freeze({
    projectCount: 87,
    repositoryCount: "20+",
    accessibilityScore: 100,
    updated: "2026-10-11"
  });
  window.PORTFOLIO_CONFIG = config;

  // Only rewrites stale project counts ("85 proiecte", "86 live projects"), never other numbers.
  const COUNT_RE = /\b(?:84|85|86)(?=\s+(?:de\s+)?(?:proiecte|projects|live|public))/gi;
  const HAS_COUNT = /\b(?:84|85|86)(?=\s+(?:de\s+)?(?:proiecte|projects|live|public))/i;
  function replaceCount(value) {
    return value.replace(COUNT_RE, String(config.projectCount));
  }

  function syncPublicMetrics() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      if (HAS_COUNT.test(node.nodeValue)) {
        node.nodeValue = replaceCount(node.nodeValue);
      }
    });

    document.querySelectorAll("[aria-label]").forEach(node => {
      const label = node.getAttribute("aria-label");
      if (label && HAS_COUNT.test(label)) {
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
