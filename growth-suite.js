(() => {
  const body = document.body;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const isEnglish = document.documentElement.lang === "en";
  const page = location.pathname.split("/").pop() || "growth-suite.html";

  function toast(message) {
    let node = $("#suiteToast");
    if (!node) {
      node = document.createElement("div");
      node.id = "suiteToast";
      node.className = "toast";
      node.setAttribute("role", "status");
      node.setAttribute("aria-live", "polite");
      document.body.append(node);
    }
    node.textContent = message;
    node.hidden = false;
    setTimeout(() => {
      node.hidden = true;
    }, 1800);
  }

  if (!$(".suite-preferences")) {
    const nav = document.createElement("nav");
    nav.className = "suite-preferences";
    nav.setAttribute(
      "aria-label",
      isEnglish
        ? "Display and language preferences"
        : "Preferințe de afișare și limbă",
    );
    const languageHref = isEnglish
      ? "../growth-suite.html"
      : `en/growth-suite.html#${page.replace(".html", "")}`;
    nav.innerHTML = `<a class="pill" href="${languageHref}" hreflang="${isEnglish ? "ro" : "en"}">${isEnglish ? "RO" : "EN"}</a><button class="pill" type="button" data-toggle="light" aria-pressed="false">${isEnglish ? "Light theme" : "Temă luminoasă"}</button><button class="pill" type="button" data-toggle="high" aria-pressed="false">${isEnglish ? "High contrast" : "Contrast ridicat"}</button>`;
    body.insertBefore(nav, body.firstChild);
    const style = document.createElement("style");
    style.textContent =
      ".suite-preferences{position:fixed;right:12px;bottom:12px;z-index:80;display:flex;gap:7px;flex-wrap:wrap;justify-content:flex-end;padding:8px;border:1px solid var(--line,#53627a);border-radius:18px;background:var(--bg,#071226);box-shadow:0 16px 38px rgba(0,0,0,.25)}.suite-preferences .pill{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:9px 13px;border:1px solid var(--line,#53627a);border-radius:999px;background:var(--panel,var(--surface,#10213d));color:var(--text,#fff);font:inherit;font-weight:750;text-decoration:none;cursor:pointer}@media(max-width:560px){.suite-preferences{left:8px;right:8px;bottom:8px}.suite-preferences .pill{flex:1;padding:10px 8px}}@media print{.suite-preferences{display:none!important}}";
    document.head.append(style);
  }

  $$("[data-toggle]").forEach((button) => {
    button.onclick = () => {
      const key = button.dataset.toggle;
      const enabled = body.classList.toggle(key);
      $$('[data-toggle="' + key + '"]').forEach((item) =>
        item.setAttribute("aria-pressed", String(enabled)),
      );
      localStorage.setItem("laurai-" + key, enabled ? "1" : "0");
    };
  });
  ["light", "high", "large", "simple"].forEach((key) => {
    if (localStorage.getItem("laurai-" + key) === "1") {
      body.classList.add(key);
      $$('[data-toggle="' + key + '"]').forEach((item) =>
        item.setAttribute("aria-pressed", "true"),
      );
    }
  });
  $$("[data-copy]").forEach((button) => {
    button.onclick = async () => {
      try {
        await navigator.clipboard.writeText($(button.dataset.copy).innerText);
        toast(isEnglish ? "Text copied" : "Text copiat");
      } catch {
        toast(isEnglish ? "Copy unavailable" : "Copiere indisponibilă");
      }
    };
  });
  $$("[data-print]").forEach((button) => {
    button.onclick = () => print();
  });
  $$(".filter").forEach((button) => {
    button.onclick = () => {
      $$(".filter").forEach((item) =>
        item.setAttribute("aria-pressed", "false"),
      );
      button.setAttribute("aria-pressed", "true");
      $$("[data-cat]").forEach((item) => {
        item.hidden =
          button.dataset.filter !== "all" &&
          item.dataset.cat !== button.dataset.filter;
      });
    };
  });
  $$(".tab").forEach((button) => {
    button.onclick = () => {
      $$(".tab").forEach((item) => {
        item.setAttribute("aria-selected", "false");
        $("#" + item.getAttribute("aria-controls")).hidden = true;
      });
      button.setAttribute("aria-selected", "true");
      $("#" + button.getAttribute("aria-controls")).hidden = false;
    };
  });
})();
