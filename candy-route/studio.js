import {
  normalizePuzzle,
  routeValid,
  routeScore,
  solveVariant,
  makePuzzle,
  seededValues,
  freshStudio,
  validateStudio,
  blankProfile,
  parsePack,
  STUDIO_KEY,
} from "./studio-rules.js";
import { bestRoute, biggestPileFirst } from "./candy.js";
import {
  localDay,
  validateState,
  freshState,
  LEVELS,
  unlocked,
} from "./game.js";

export function initStudio(bridge) {
  const host = document.createElement("section");
  host.id = "studio";
  host.className = "panel";
  document.querySelector("footer").before(host);
  const L = (ro, en) => (bridge.get().lang === "ro" ? ro : en);
  let data = freshStudio(),
    warning = "",
    variant = "classic",
    solution = null,
    checked = false,
    assisted = false,
    scouted = new Set(),
    duel = null,
    replayTimer = null;
  try {
    const saved = localStorage.getItem(STUDIO_KEY);
    if (saved) data = validateStudio(JSON.parse(saved), validateState);
  } catch {
    warning = L(
      "Salvarea Studio nu a putut fi citită. Exportă datele brute înainte de a le înlocui.",
      "Studio save could not be read. Export raw data before replacing it.",
    );
  }
  const profile = () => data.profiles[data.active];
  let recovery = !!warning,
    restoring = false;
  function restoreSession() {
    variant = profile().puzzle?.variant ?? "classic";
    checked = profile().session.checked;
    assisted = profile().session.assisted;
    scouted = new Set(profile().session.scouted);
    solution = null;
  }
  restoreSession();
  function switchCore(core) {
    restoring = true;
    try {
      bridge.restore(core);
      restoreSession();
    } finally {
      restoring = false;
    }
  }
  function save() {
    if (recovery) return;
    data.sound=bridge.getSound();
    profile().session = { checked, assisted, scouted: [...scouted] };
    try {
      profile().core = structuredClone(bridge.get());
      localStorage.setItem(STUDIO_KEY, JSON.stringify(data));
    } catch {
      warning = L(
        "Salvarea locală nu este disponibilă. Exportă backupul.",
        "Local saving is unavailable. Export a backup.",
      );
      status(warning);
    }
  }
  function status(message) {
    const node = host.querySelector("#s-status");
    if (node) node.textContent = message;
  }
  function download(name, object) {
    const url = URL.createObjectURL(
        new Blob([JSON.stringify(object, null, 2)], {
          type: "application/json",
        }),
      ),
      a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function button(text, action, parent, attrs = {}) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = text;
    Object.entries(attrs).forEach(([k, v]) => b.setAttribute(k, v));
    b.onclick = action;
    parent.append(b);
    return b;
  }
  function node(tag, text, parent, cls) {
    const el = document.createElement(tag);
    if (text !== undefined) el.textContent = text;
    if (cls) el.className = cls;
    parent.append(el);
    return el;
  }
  function field(parent, label, id, value, type = "number", min = 0, max = 99) {
    const wrap = node("label", undefined, parent);
    node("span", label, wrap);
    const input = node("input", undefined, wrap);
    Object.assign(input, { id, type, value });
    if (type === "number") {
      input.min = min;
      input.max = max;
      input.step = 1;
    }
    return input;
  }
  function selectField(parent, label, id, options, value) {
    const wrap = node("label", undefined, parent);
    node("span", label, wrap);
    const select = node("select", undefined, wrap);
    select.id = id;
    for (const [value, text] of options) {
      const o = node("option", text, select);
      o.value = value;
    }
    select.value = value;
    return select;
  }
  function panel(title, id) {
    const d = node("details", undefined, host);
    d.className = "studio-panel";
    d.id = id;
    node("summary", title, d);
    return d;
  }
  const jump = document.createElement("a");
  jump.className = "button-link";
  jump.href = "#studio";
  jump.textContent = "Studio";
  document.querySelector("nav").append(jump);
  const stage = document.querySelector(".stage"),
    expand = document.createElement("button"),
    walker = document.createElement("span"),
    objectives = document.createElement("p");
  expand.type = "button";
  expand.id = "expand-game";
  walker.className = "route-walker";
  walker.textContent = "♟";
  walker.setAttribute("aria-hidden", "true");
  objectives.id = "secondary-objectives";
  stage.prepend(expand);
  stage.querySelector("#street-wrap").before(walker, objectives);
  let expanded = false,
    previousFocus = null;
  function expandStage(active) {
    expanded = active;
    stage.classList.toggle("expanded", active);
    document.body.classList.toggle("stage-open", active);
    for (const child of document.querySelector("main").children)
      if (child !== stage) child.inert = active;
    expand.setAttribute("aria-expanded", String(active));
    expand.textContent = active
      ? L("Închide ecranul mare", "Close expanded game")
      : L("Ecran mare", "Expand game");
    if (active) {
      previousFocus = document.activeElement;
      expand.focus();
    } else previousFocus?.focus();
  }
  expand.onclick = () => expandStage(!expanded);
  document.addEventListener("keydown", (e) => {
    if (!expanded) return;
    if (e.key === "Escape") {
      expandStage(false);
      return;
    }
    if (e.key === "Tab") {
      const buttons = [
        ...stage.querySelectorAll('button:not(:disabled),[tabindex="0"]'),
      ].filter((x) => !x.hidden && x.getClientRects().length);
      const first = buttons[0],
        last = buttons.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  let wasSolved = false;
  const names = () => [
    ["classic", L("Clasic", "Classic")],
    ["circle", L("Cerc", "Circle")],
    ["gap", L("Distanță 2–3", "Distance 2–3")],
    ["maxk", L("Maximum K", "At most K")],
    ["exactk", L("Exact K", "Exactly K")],
    ["energy", L("Energie", "Energy")],
    ["time", L("Buget de timp", "Time budget")],
    ["closed", L("Casă închisă", "Closed house")],
    ["required", L("Casă obligatorie", "Required house")],
    ["taste", L("Preferințe dulci", "Candy preferences")],
    ["hidden", L("Explorare", "Exploration")],
    ["tree", L("Cartier ramificat", "Branching district")],
  ];
  function start(p, mode = variant) {
    stopReplay();
    profile().puzzle = normalizePuzzle(p);
    profile().picks = [];
    profile().replay = [[]];
    variant = p.variant ?? mode;
    solution = solveVariant(p);
    checked = false;
    assisted = false;
    scouted = new Set();
    save();
    renderBoard();
  }
  function stopReplay() {
    clearInterval(replayTimer);
    replayTimer = null;
  }
  function getValues() {
    const raw = host
      .querySelector("#s-values")
      .value.split(",")
      .map((x) => x.trim());
    if (raw.some((x) => !/^[-+]?\d+$/.test(x))) throw Error("values");
    return raw.map(Number);
  }
  function applyEditor() {
    try {
      const values = getValues(),
        n = values.length,
        mode = host.querySelector("#s-variant").value;
      let p = makePuzzle(values, mode, {
        gap: Number(host.querySelector("#s-gap").value),
        k: Number(host.querySelector("#s-k").value),
        budget: Number(host.querySelector("#s-budget").value),
        time: Number(host.querySelector("#s-time").value),
      });
      if (mode === "taste") {
        const weights = ["s-weight", "s-jelly", "s-lollipop"].map((id) =>
          Number(host.querySelector("#" + id).value),
        );
        if (
          weights.some(
            (weight) => !Number.isInteger(weight) || weight < 1 || weight > 3,
          )
        )
          throw Error("weight");
        p = normalizePuzzle({
          ...p,
          values: values.map((v, i) => v * weights[i % 3]),
        });
      }
      start(p, mode);
      status(
        L(
          "Puzzle aplicat. Indicii sunt de la 0.",
          "Puzzle applied. Indices start at 0.",
        ),
      );
    } catch {
      status(
        L(
          "Date invalide: 1–16 numere întregi între −99 și 99; verifică și limitele.",
          "Invalid data: 1–16 integers from −99 to 99; check the limits too.",
        ),
      );
    }
  }
  function record(score, best, id, mode, help = assisted) {
    const records = profile().records,
      day = localDay();
    const existing = records.find(
      (r) => r.id === id && r.day === day && r.assisted === help,
    );
    if (existing) {
      existing.score = Math.max(existing.score, score);
      existing.best = best;
    } else
      records.push({ day, id, variant: mode, score, best, assisted: help });
    if (records.length > 2000) records.shift();
    save();
    renderStats();
  }
  function renderBoard() {
    const target = host.querySelector("#s-board");
    if (!target) return;
    target.replaceChildren();
    const p = profile().puzzle;
    if (!p) {
      node(
        "p",
        L("Creează sau încarcă un puzzle.", "Create or load a puzzle."),
        target,
      );
      return;
    }
    solution ??= solveVariant(p);
    node(
      "h3",
      names().find(([v]) => v === variant)?.[1] ??
        L("Puzzle personalizat", "Custom puzzle"),
      target,
    );
    const rules = `${L("Distanță", "Distance")}: ${p.edges ? "—" : p.gap} · ${p.circle ? L("cerc · ", "circle · ") : ""}${p.exact ? "=" : "≤"} ${p.k} ${L("case", "houses")} · ${L("energie", "energy")} ≤ ${p.budget} · ${L("minute", "minutes")} ≤ ${p.time}`;
    node("p", rules, target);
    const difficult =
      p.values.length > 10 ||
      !["classic", "circle"].includes(variant) ||
      biggestPileFirst(p.values, { circular: p.circle }) <
        (solution.total ?? 0);
    node(
      "p",
      L("Dificultate orientativă: ", "Indicative difficulty: ") +
        (difficult ? L("avansată", "advanced") : L("standard", "standard")) +
        L(
          " (euristică după lungime, reguli și diferența greedy; nu este calibrată pe jucători).",
          " (heuristic based on length, rules and greedy gap; not player-calibrated).",
        ),
      target,
    );
    node(
      "p",
      L("Validare exhaustivă: ", "Exhaustive validation: ") +
        solution.operations +
        L(" submulțimi; maximum 65.536.", " subsets; maximum 65,536."),
      target,
    );
    node(
      "p",
      `${L("Închise", "Closed")}: ${p.closed.join(", ") || "—"} · ${L("Obligatorii", "Required")}: ${p.required.join(", ") || "—"}`,
      target,
    );
    if (p.edges)
      node(
        "p",
        L(
          "Muchii (casele legate nu pot fi alese împreună): ",
          "Edges (connected houses cannot both be selected): ",
        ) + p.edges.map((e) => e.join("↔")).join(" · "),
        target,
      );
    if (variant === "hidden")
      node(
        "p",
        L(
          "Poți cerceta trei case. Valorile rămase se dezvăluie la verificare. Punctajul compară ruta cu optimul străzii complete.",
          "Scout three houses. Other values are revealed on check. Your score is compared with the full-information optimum.",
        ),
        target,
      );
    const street = node("div", undefined, target, "studio-street");
    street.setAttribute("role", "group");
    street.setAttribute("aria-label", L("Strada Studio", "Studio street"));
    p.values.forEach((v, i) => {
      const seen = variant !== "hidden" || checked || scouted.has(i),
        picked = profile().picks.includes(i);
      const b = button(
        `#${i} · ${seen ? v : "?"}${variant === "taste" ? " · " + [L("ciocolată", "chocolate"), L("jeleuri", "jelly"), L("acadele", "lollipop")][i % 3] : ""}${p.closed.includes(i) ? " ⛔" : ""}${p.required.includes(i) ? " ★" : ""}${picked ? " ✓" : ""}`,
        () => {
          if (checked) return;
          if (variant === "hidden" && !scouted.has(i) && scouted.size < 3) {
            scouted.add(i);
            save();
            renderBoard();
            return;
          }
          profile().picks = picked
            ? profile().picks.filter((x) => x !== i)
            : [...profile().picks, i];
          profile().replay.push([...profile().picks]);
          if (profile().replay.length > 100) profile().replay.shift();
          save();
          renderBoard();
        },
        street,
        {
          "aria-pressed": String(picked),
          "aria-label": `${L("Casa", "House")} ${i}, ${seen ? v : L("necunoscut", "unknown")}${picked ? ", " + L("selectată", "selected") : ""}`,
        },
      );
      b.disabled = checked || p.closed.includes(i);
    });
    const picks = profile().picks;
    node(
      "p",
      `${L("Opriri", "Stops")}: ${picks.length} · ${L("Energie", "Energy")}: ${picks.reduce((s, i) => s + p.costs[i], 0)} · ${L("Timp", "Time")}: ${picks.reduce((s, i) => s + p.minutes[i], 0)}`,
      target,
    );
    node(
      "p",
      L("Costuri energie/timp pe casă: ", "Energy/time costs by house: ") +
        p.costs.map((v, i) => `#${i} ${v}/${p.minutes[i]}`).join(" · "),
      target,
    );
    const actions = node("div", undefined, target, "actions");
    const checkButton = button(
      L("Verifică ruta", "Check route"),
      () => {
        if (checked) return;
        if (solution.total === null) {
          checked = true;
          save();
          renderBoard();
          return;
        }
        if (!routeValid(p, picks)) {
          status(
            L(
              "Ruta nu respectă toate restricțiile. Verifică distanța, limitele și casele obligatorii.",
              "Route violates constraints. Check distance, limits and required houses.",
            ),
          );
          return;
        }
        checked = true;
        record(
          routeScore(p, picks),
          solution.total,
          JSON.stringify({
            puzzle: p,
            route: [...picks].sort((a, b) => a - b),
          }),
          variant,
        );
        if (duel) {
          duel.scores.push(routeScore(p, picks));
          if (duel.scores.length === 1) {
            status(
              L(
                "Predă dispozitivul jucătorului 2. Apasă „Jucătorul 2”.",
                "Pass the device to player 2. Press “Player 2”.",
              ),
            );
          } else
            status(
              `${L("Duel", "Duel")}: ${duel.scores.join(" – ")} · ${duel.scores[0] === duel.scores[1] ? L("Egalitate", "Tie") : L("Câștigă jucătorul ", "Winner: player ") + (duel.scores[0] > duel.scores[1] ? 1 : 2)}`,
            );
        }
        renderBoard();
      },
      actions,
    );
    checkButton.disabled = checked;
    button(L("Reîncearcă", "Retry"), () => start(p, variant), actions);
    const hintButton = button(
      L("Indiciu", "Hint"),
      () => {
        assisted = true;
        save();
        status(
          solution.total === null
            ? L("Nu există rută fezabilă.", "No feasible route.")
            : L("O rută optimă include: ", "An optimal route includes: ") +
                (solution.routes[0][0] ?? L("nicio casă", "no house")),
        );
      },
      actions,
    );
    hintButton.disabled = profile().style === "expert" && !checked;
    button(
      L("Arată soluțiile", "Show solutions"),
      () => {
        assisted = true;
        checked = true;
        save();
        renderBoard();
      },
      actions,
    );
    button(
      L("Reia alegerile", "Replay picks"),
      () => {
        stopReplay();
        const frames = profile().replay.map((a) => [...a]);
        let i = 0;
        const replay = node("p", "", target);
        replay.setAttribute("role", "status");
        const frame = () => {
          replay.textContent = `${i + 1}/${frames.length}: ${frames[i].map((x) => "#" + x).join(", ") || "∅"}`;
          i++;
          if (i >= frames.length) stopReplay();
        };
        if (frames.length) {
          frame();
          if (
            !matchMedia("(prefers-reduced-motion: reduce)").matches &&
            !bridge.get().still
          )
            replayTimer = setInterval(frame, 850);
          else
            replay.textContent = frames
              .map((f, i) => `${i + 1}: ${f.join(",") || "∅"}`)
              .join(" → ");
        }
      },
      actions,
    );
    button(L("Export PNG", "Export PNG"), exportPNG, actions);
    if (duel?.scores.length === 1)
      button(L("Jucătorul 2", "Player 2"), () => start(p, variant), actions);
    if (checked) {
      save();
      const summary = node("div", undefined, target, "studio-summary");
      summary.setAttribute("role", "status");
      if (solution.total === null)
        node(
          "p",
          L(
            "Imposibil: restricțiile nu permit nicio rută.",
            "Impossible: the constraints admit no route.",
          ),
          summary,
        );
      else {
        const score = routeValid(p, picks) ? routeScore(p, picks) : null;
        node(
          "p",
          `${L("Rezultatul tău", "Your score")}: ${score ?? "—"} · ${L("Optim", "Optimal")}: ${solution.total} · ${L("Diferență", "Gap")}: ${score === null ? "—" : solution.total - score}`,
          summary,
        );
        node(
          "p",
          L("Ajustare: elimină ", "Adjustment: remove ") +
            (picks
              .filter((i) => !solution.routes[0].includes(i))
              .map((i) => "#" + i)
              .join(", ") || "∅") +
            L("; adaugă ", "; add ") +
            (solution.routes[0]
              .filter((i) => !picks.includes(i))
              .map((i) => "#" + i)
              .join(", ") || "∅"),
          summary,
        );
        node(
          "p",
          L(
            "Înlocuiește selecția cu ruta ",
            "Replace your selection with route ",
          ) +
            (solution.routes[0].map((i) => "#" + i).join(", ") || "∅") +
            L(" pentru optim.", " for the optimum."),
          summary,
        );
        node(
          "p",
          `${solution.count} ${L("soluții optime; afișăm maximum 50", "optimal solutions; displaying at most 50")}`,
          summary,
        );
        const list = node("ol", undefined, summary);
        solution.routes.forEach((r) =>
          node("li", r.map((i) => "#" + i).join(", ") || "∅", list),
        );
      }
    }
  }
  function exportPNG() {
    const p = profile().puzzle;
    if (!p) return;
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 180 + Math.ceil(p.values.length / 8) * 100;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#0b1426";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#e6edf8";
    ctx.font = "bold 32px system-ui";
    ctx.fillText("Candy Route · LaurAi", 30, 50);
    ctx.font = "20px system-ui";
    ctx.fillText(names().find(([v]) => v === variant)?.[1] ?? "Custom", 30, 85);
    p.values.forEach((v, i) => {
      ctx.fillStyle = profile().picks.includes(i) ? "#ffcb80" : "#b5c5df";
      ctx.fillText(
        `#${i}: ${variant === "hidden" && !checked && !scouted.has(i) ? "?" : v}${profile().picks.includes(i) ? " ✓" : ""}`,
        30 + (i % 8) * 120,
        150 + Math.floor(i / 8) * 100,
      );
    });
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob),
        a = document.createElement("a");
      a.href = url;
      a.download = "candy-route.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }
  function renderStats() {
    const target = host.querySelector("#s-stats");
    if (!target) return;
    target.replaceChildren();
    const records = profile().records,
      won = records.filter((r) => r.score === r.best && !r.assisted),
      days = [...new Set(records.map((r) => r.day))].sort().reverse();
    node(
      "p",
      `${records.length} ${L("rezultate", "results")} · ${records.length ? Math.round((won.length / records.length) * 100) : 0}% ${L("optime fără ajutor", "optimal without help")} · ${records.filter((r) => r.assisted).length} ${L("cu ajutor", "assisted")}`,
      target,
    );
    const modes = [...new Set(records.map((r) => r.variant))];
    node(
      "p",
      L("Moduri jucate: ", "Modes played: ") + (modes.join(", ") || "—"),
      target,
    );
    const weekStart = new Date(localDay() + "T12:00:00Z");
    weekStart.setUTCDate(weekStart.getUTCDate() - 6);
    const since = weekStart.toISOString().slice(0, 10),
      weekly = won.filter(
        (r) => r.day >= since && r.variant === "circle",
      ).length;
    node(
      "p",
      L(
        "Obiectiv în ultimele 7 zile: 3 rute Circle optime, fără ajutor. ",
        "Last 7 days goal: 3 optimal Circle routes without help. ",
      ) +
        Math.min(weekly, 3) +
        "/3",
      target,
    );
    const badges = [
      won.length > 0,
      won.length >= 10,
      modes.length >= 5,
      won.filter((r) => r.variant === "circle").length >= 3,
    ];
    node(
      "h3",
      L("Insigne și album cosmetic", "Badges and cosmetic album"),
      target,
    );
    const labels = [
      L("Prima rută · Felinar", "First route · Lantern"),
      L("10 victorii · Pălărie", "10 wins · Hat"),
      L("5 moduri · Bufniță", "5 modes · Owl"),
      L("3 cercuri · Lună", "3 circles · Moon"),
    ];
    node(
      "p",
      labels.map((x, i) => (badges[i] ? "✓ " : "🔒 ") + x).join(" · "),
      target,
    );
    const cosmetics = [
      ["pawn", "♟"],
      ["lantern", "🏮"],
      ["hat", "🎩"],
      ["owl", "🦉"],
      ["moon", "☾"],
    ];
    const avatar = selectField(
      target,
      L("Companion cosmetic", "Cosmetic companion"),
      "s-avatar",
      cosmetics.filter((_, i) => i === 0 || badges[i - 1]),
      profile().avatar,
    );
    avatar.onchange = () => {
      profile().avatar = avatar.value;
      walker.textContent =
        cosmetics.find((x) => x[0] === avatar.value)?.[1] ?? "♟";
      save();
    };
    walker.textContent =
      cosmetics.find((x) => x[0] === profile().avatar)?.[1] ?? "♟";
    const chapterDone = [6, 12, 18, 24, 30].some(
      (id) =>
        bridge.get().progress[id]?.stars ||
        bridge.get().progress[id]?.practiced,
    );
    node(
      "p",
      (chapterDone ? "✓ " : "○ ") +
        L("Insignă: capitol complet", "Badge: chapter completed"),
      target,
    );
    const groups = new Map();
    for (const r of won) {
      try {
        const item = JSON.parse(r.id);
        if (item.puzzle && item.route) {
          const key = JSON.stringify(item.puzzle);
          if (!groups.has(key)) groups.set(key, new Set());
          groups.get(key).add(JSON.stringify(item.route));
        }
      } catch {}
    }
    node(
      "p",
      ([...groups.values()].some((set) => set.size >= 3) ? "✓ " : "○ ") +
        L(
          "Insignă: trei rute optime distincte pentru același puzzle",
          "Badge: three distinct optimal routes for one puzzle",
        ),
      target,
    );
    node("h3", L("Calendarul rezultatelor", "Result calendar"), target);
    const list = node("ul", undefined, target);
    days
      .slice(0, 31)
      .forEach((day) =>
        node(
          "li",
          `${day}: ${records.filter((r) => r.day === day).length} ${L("rezultate", "results")}`,
          list,
        ),
      );
  }
  function renderMap() {
    const target = host.querySelector("#s-map");
    if (!target) return;
    target.replaceChildren();
    const state = bridge.get();
    const chapters = [
      L("Suburbie", "Suburb"),
      L("Pădure", "Forest"),
      L("Castel", "Castle"),
      L("Oraș", "Town"),
      L("Târg", "Fair"),
    ];
    chapters.forEach((name, index) => {
      const group = node("section", undefined, target, "district");
      node("h3", `${index + 1}. ${name}`, group);
      node(
        "p",
        L("Finalul capitolului este nivelul ", "Chapter finale is level ") +
          (index * 6 + 6),
        group,
      );
      const grid = node("div", undefined, group, "actions");
      LEVELS.slice(index * 6, index * 6 + 6).forEach((l) => {
        const r = state.progress[l.id];
        const b = button(
          `${l.id} ${r?.stars ? "★".repeat(r.stars) : r?.practiced ? "✓" : "○"}`,
          () => bridge.level(l.id),
          grid,
        );
        b.disabled = !unlocked(state.progress, l.id);
        b.setAttribute(
          "aria-label",
          `${name}, ${L("nivel", "level")} ${l.id}${b.disabled ? ", " + L("blocat", "locked") : ""}`,
        );
      });
      const last = state.progress[index * 6 + 6];
      if (last?.stars || last?.practiced)
        node(
          "p",
          L(
            "Capitol complet. Recapitulare: compară suma „iau” cu „sar”; pentru cerc verifică separat capetele.",
            "Chapter complete. Recap: compare take with skip; in a circle consider endpoints separately.",
          ),
          group,
        );
    });
    const done = Object.keys(state.progress).length,
      last = state.progress[done],
      suggested =
        done && last && last.stars < 2 ? done : Math.min(30, done + 1);
    node("p", L("Nivel sugerat: ", "Suggested level: ") + suggested, target);
  }
  function renderCollection() {
    const target = host.querySelector("#s-collection");
    if (!target) return;
    target.replaceChildren();
    profile().collection.forEach((item, i) => {
      const row = node("div", undefined, target, "actions");
      node("span", item.name, row);
      button(
        L("Joacă", "Play"),
        () => start(item.puzzle, item.puzzle.variant),
        row,
      );
      button(
        L("Șterge", "Delete"),
        () => {
          profile().collection.splice(i, 1);
          save();
          renderCollection();
        },
        row,
      );
    });
  }
  function renderLab() {
    const target = host.querySelector("#s-lab-output");
    target.replaceChildren();
    const source = profile().puzzle?.values ?? bridge.get().attempt.street;
    const values = source.slice(0, 10),
      r = bestRoute(values);
    node(
      "p",
      L(
        "Demonstrație liniară pe primele maximum 10 valori; restricțiile Studio nu se aplică aici.",
        "Linear demonstration on the first at most 10 values; Studio constraints do not apply here.",
      ),
      target,
    );
    const table = node("table", undefined, target);
    node(
      "caption",
      L("Pseudocod și dependențe", "Pseudocode and dependencies"),
      table,
    );
    const head = node("thead", undefined, table),
      hr = node("tr", undefined, head);
    [
      L("Pas", "Step"),
      "take = value + dp[i−2]",
      "skip = dp[i−1]",
      "dp[i] = max(take, skip)",
    ].forEach((x) => {
      const th = node("th", x, hr);
      th.scope = "col";
    });
    const body = node("tbody", undefined, table);
    r.steps.forEach((s) => {
      const row = node("tr", undefined, body);
      [s.index, s.take, s.skip, s.best].forEach((x) => node("td", x, row));
    });
    const code = node("pre", "", target),
      stepActions = node("div", undefined, target, "actions");
    let cursor = 0;
    function showLabStep() {
      const s = r.steps[cursor];
      code.textContent = `i=${s.index}: take = ${s.candy} + ${s.take - s.candy} = ${s.take}; skip = ${s.skip}; dp = ${s.best}`;
      [...body.children].forEach((row, i) =>
        row.classList.toggle("current-step", i === cursor),
      );
    }
    button(
      L("Pas anterior", "Previous step"),
      () => {
        cursor = Math.max(0, cursor - 1);
        showLabStep();
      },
      stepActions,
    );
    button(
      L("Pas următor", "Next step"),
      () => {
        cursor = Math.min(r.steps.length - 1, cursor + 1);
        showLabStep();
      },
      stepActions,
    );
    showLabStep();
    node(
      "p",
      L(
        "Reconstrucție de la dreapta: dacă dp[i] > dp[i−1], ia casa și sari peste vecina ei; altfel sari casa. Ruta: ",
        "Reconstruct from the right: if dp[i] > dp[i−1], take the house and skip its neighbor; otherwise skip the house. Route: ",
      ) + r.indices.join(", "),
      target,
    );
    const cache = new Map();
    let calls = 0,
      hits = 0;
    const trace = [];
    function memo(i) {
      calls++;
      if (i >= values.length) return 0;
      if (cache.has(i)) {
        hits++;
        trace.push(`#${i}: CACHE`);
        return cache.get(i);
      }
      const total = Math.max(values[i] + memo(i + 2), memo(i + 1));
      cache.set(i, total);
      trace.push(`#${i}: ${total}`);
      return total;
    }
    memo(0);
    node(
      "p",
      `${L("Memoizare", "Memoization")}: ${calls} ${L("apeluri", "calls")}, ${hits} cache hits; ${cache.size} ${L("stări", "states")}`,
      target,
    );
    node("p", trace.join(" → "), target);
    const tree = node("details", undefined, target);
    node(
      "summary",
      L("Arbore recursiv (primele 6 case)", "Recursion tree (first 6 houses)"),
      tree,
    );
    let nodes = 0;
    function branch(i, parent) {
      nodes++;
      const li = node(
        "li",
        i >= Math.min(values.length, 6)
          ? "0"
          : `f(${i}) = max(${values[i]} + f(${i + 2}), f(${i + 1}))`,
        parent,
      );
      if (i < Math.min(values.length, 6)) {
        const ul = node("ul", undefined, li);
        branch(i + 2, ul);
        branch(i + 1, ul);
      }
    }
    branch(0, node("ul", undefined, tree));
    node(
      "h3",
      L("Scalare prin numărul de operații", "Scaling by operation counts"),
      target,
    );
    node(
      "p",
      L(
        "Barele compară formulele n (DP) și 2ⁿ (submulțimi exhaustive), nu timpi măsurați.",
        "Bars compare formulas n (DP) and 2ⁿ (exhaustive subsets), not measured runtimes.",
      ),
      target,
    );
    const chart = node("div", undefined, target, "operation-chart");
    [4, 8, 12, 16].forEach((n) => {
      const row = node("div", undefined, chart);
      node("span", `n=${n} · DP ${n} · brute ${2 ** n}`, row);
      const meter = node("meter", undefined, row);
      meter.min = 0;
      meter.max = 65536;
      meter.value = 2 ** n;
      meter.setAttribute("aria-label", `n=${n}, ${2 ** n} subsets`);
    });
    const nextStep = r.steps[Math.min(2, r.steps.length - 1)],
      predict = node("form", undefined, target);
    const guess = field(
      predict,
      L("Prezice take pentru casa #", "Predict take for house #") +
        nextStep.index +
        ` (${nextStep.candy} + ${nextStep.take - nextStep.candy})`,
      "s-next-step",
      "",
      "number",
      -999,
      999,
    );
    const predictButton = node(
      "button",
      L("Verifică pasul", "Check step"),
      predict,
    );
    predictButton.type = "submit";
    const feedback = node("p", "", predict);
    feedback.setAttribute("role", "status");
    predict.onsubmit = (e) => {
      e.preventDefault();
      feedback.textContent =
        guess.value !== "" && Number(guess.value) === nextStep.take
          ? L("Corect!", "Correct!")
          : L(
              "take = valoarea casei + optimul de acum două case: ",
              "take = house value + optimum two houses back: ",
            ) + nextStep.take;
    };
    const form = node("form", undefined, target),
      input = field(
        form,
        L(
          "Predicție: maximul pentru [4,5,4]?",
          "Predict the optimum for [4,5,4]?",
        ),
        "s-quiz",
        "",
        "number",
        0,
        99,
      );
    const submit = node(
      "button",
      L("Verifică predicția", "Check prediction"),
      form,
    );
    submit.type = "submit";
    const answer = node("p", "", form);
    answer.setAttribute("role", "status");
    form.onsubmit = (e) => {
      e.preventDefault();
      answer.textContent =
        Number(input.value) === 8 && input.value !== ""
          ? L("Corect: 4 + 4 = 8.", "Correct: 4 + 4 = 8.")
          : L(
              "Alege prima și ultima casă: 4 + 4 = 8, mai mult decât 5.",
              "Choose the first and last houses: 4 + 4 = 8, more than 5.",
            );
    };
    node(
      "p",
      L(
        "Cazuri speciale: o casă → max(0,v); două → max(0,a,b); toate zero → 0 și pot exista mai multe rute; într-un cerc prima și ultima sunt vecine.",
        "Edge cases: one house → max(0,v); two → max(0,a,b); all zeros → 0 with possibly multiple routes; circle endpoints are neighbors.",
      ),
      target,
    );
  }
  function sharePuzzle() {
    try {
      const p = profile().puzzle;
      if (!p) return;
      const url = new URL(location.href);
      url.hash =
        "studio=" +
        encodeURIComponent(JSON.stringify({ version: 1, puzzle: p }));
      const output = host.querySelector("#s-share");
      output.value = url.href;
      output.hidden = false;
      output.focus();
      output.select();
      status(
        L(
          "Copiază linkul; include regulile, fără progres personal.",
          "Copy the link; it includes rules and no personal progress.",
        ),
      );
    } catch {
      status(L("Linkul nu a putut fi generat.", "Could not create link."));
    }
  }
  function render() {
    stopReplay();
    const open = [...host.querySelectorAll("details[open]")].map((d) => d.id);
    host.replaceChildren();
    host.dataset.season = data.theme;
    document.body.dataset.season = data.theme;
    const connection = node(
      "p",
      navigator.onLine
        ? L(
            "Online · jocul poate fi disponibil offline după prima încărcare completă.",
            "Online · offline play is available after the first complete load.",
          )
        : L(
            "Offline · progresul rămâne pe acest dispozitiv.",
            "Offline · progress stays on this device.",
          ),
      host,
    );
    connection.id = "connection-status";
    node(
      "h2",
      L("Candy Route · Studio & Aventură", "Candy Route · Studio & Adventure"),
      host,
    );
    node(
      "p",
      L(
        "Modurile avansate au maximum 16 case. Campania originală și modul liber rămân disponibile mai sus.",
        "Advanced modes support at most 16 houses. The original campaign and free mode remain available above.",
      ),
      host,
    );
    const message = node("p", warning, host);
    message.id = "s-status";
    message.setAttribute("role", "status");
    const profiles = panel(
      L(
        "Profiluri, aspect și backup complet",
        "Profiles, appearance and full backup",
      ),
      "s-profiles",
    );
    const row = node("div", undefined, profiles, "actions");
    const select = selectField(
      row,
      L("Profil activ", "Active profile"),
      "s-profile",
      data.profiles.map((p, i) => [String(i), p.name]),
      String(data.active),
    );
    select.onchange = () => {
      save();
      data.active = Number(select.value);
      const core = profile().core ?? freshState();
      switchCore(core);
      duel = null;
      render();
      save();
    };
    const name = field(
      row,
      L("Nume profil nou", "New profile name"),
      "s-name",
      "",
      "text",
    );
    name.maxLength = 30;
    button(
      L("Adaugă profil", "Add profile"),
      () => {
        if (data.profiles.length >= 4 || !name.value.trim()) {
          status(
            L(
              "Maximum 4 profiluri, cu nume nenul.",
              "Up to 4 profiles, with a nonempty name.",
            ),
          );
          return;
        }
        save();
        data.profiles.push(blankProfile(name.value.trim()));
        data.active = data.profiles.length - 1;
        switchCore(freshState());
        duel = null;
        render();
        save();
      },
      row,
    );
    const playStyle = selectField(
      row,
      L("Stil de joc", "Play style"),
      "s-play-style",
      [
        [
          "relaxed",
          L("Relaxat · indicii disponibile", "Relaxed · hints available"),
        ],
        [
          "expert",
          L(
            "Expert · fără indicii înainte de verificare",
            "Expert · no hints before check",
          ),
        ],
      ],
      profile().style,
    );
    playStyle.onchange = () => {
      profile().style = playStyle.value;
      save();
      renderBoard();
    };
    const season = selectField(
      row,
      L("Temă sezonieră", "Season theme"),
      "s-season",
      [
        ["halloween", "Halloween"],
        ["winter", L("Iarnă", "Winter")],
        ["spring", L("Paște", "Easter")],
      ],
      data.theme,
    );
    season.onchange = () => {
      data.theme = season.value;
      save();
      render();
    };
    const volume = field(
      row,
      L("Volum (%)", "Volume (%)"),
      "s-volume",
      data.volume,
      "range",
      0,
      100,
    );
    volume.oninput = () => {
      data.volume = Number(volume.value);
      bridge.volume(data.volume / 100);
      save();
    };
    bridge.volume(data.volume / 100);
    button(
      L("Export backup complet", "Export full backup"),
      () => {
        save();
        download("candy-route-studio-backup.json", data);
      },
      profiles,
    );
    button(
      L("Export date brute", "Export raw saved data"),
      () => {
        let raw;
        try {
          raw = localStorage.getItem(STUDIO_KEY);
        } catch {}
        download("candy-route-raw-recovery.json", { raw });
      },
      profiles,
    );
    const backup = field(
      profiles,
      L("Import backup complet (JSON)", "Import full backup (JSON)"),
      "s-backup",
      "",
      "file",
    );
    backup.accept = ".json,application/json";
    backup.onchange = async () => {
      try {
        const file = backup.files[0];
        if (!file || file.size > 3000000) throw Error("file");
        const next = validateStudio(
          JSON.parse(await file.text()),
          validateState,
        );
        data = next;
        bridge.setSound(data.sound);
        recovery = false;
        warning = "";
        switchCore(profile().core ?? freshState());
        duel = null;
        render();
        save();
        status(L("Backup importat.", "Backup imported."));
      } catch {
        status(
          L(
            "Backup invalid. Datele existente au fost păstrate.",
            "Invalid backup. Existing data preserved.",
          ),
        );
      }
      backup.value = "";
    };
    const map = panel(
      L("Harta campaniei · 5 cartiere", "Campaign map · 5 districts"),
      "s-campaign",
    );
    node("div", undefined, map).id = "s-map";
    renderMap();
    const tools = panel(
      L("Creator de puzzle-uri și reguli", "Puzzle creator and rules"),
      "s-editor",
    );
    tools.open = true;
    const fields = node("div", undefined, tools, "studio-fields");
    field(
      fields,
      L("Valori separate prin virgulă", "Comma-separated values"),
      "s-values",
      (profile().puzzle?.values ?? [4, 5, 4, 1, 7, 3, 8, 2]).join(", "),
      "text",
    );
    selectField(
      fields,
      L("Variantă", "Variant"),
      "s-variant",
      names(),
      variant,
    );
    field(
      fields,
      L("Distanță (mod Distanță)", "Distance (Distance mode)"),
      "s-gap",
      2,
      "number",
      2,
      3,
    );
    field(
      fields,
      L("K (modurile K)", "K (K modes)"),
      "s-k",
      3,
      "number",
      0,
      16,
    );
    field(
      fields,
      L("Buget energie", "Energy budget"),
      "s-budget",
      6,
      "number",
      0,
      1000,
    );
    field(
      fields,
      L("Buget minute", "Minute budget"),
      "s-time",
      8,
      "number",
      0,
      1000,
    );
    field(
      fields,
      L(
        "Multiplicator ciocolată (fiecare a treia casă)",
        "Chocolate multiplier (every third house)",
      ),
      "s-weight",
      2,
      "number",
      1,
      3,
    );
    field(
      fields,
      L("Multiplicator jeleuri", "Jelly multiplier"),
      "s-jelly",
      1,
      "number",
      1,
      3,
    );
    field(
      fields,
      L("Multiplicator acadele", "Lollipop multiplier"),
      "s-lollipop",
      1,
      "number",
      1,
      3,
    );
    function showParameters() {
      const mode = host.querySelector("#s-variant").value;
      for (const [id, modes] of [
        ["s-gap", ["gap"]],
        ["s-k", ["maxk", "exactk"]],
        ["s-budget", ["energy"]],
        ["s-time", ["time"]],
        ["s-weight", ["taste"]],
        ["s-jelly", ["taste"]],
        ["s-lollipop", ["taste"]],
      ])
        host.querySelector("#" + id).closest("label").hidden =
          !modes.includes(mode);
    }
    host.querySelector("#s-variant").onchange = showParameters;
    showParameters();
    const editActions = node("div", undefined, tools, "actions");
    button(
      L("Aplică puzzle", "Apply puzzle"),
      () => {
        duel = null;
        applyEditor();
      },
      editActions,
    );
    button(
      L("Contraexemplu greedy", "Greedy counterexample"),
      () => {
        start(makePuzzle([4, 5, 4]));
        status(
          L(
            "Greedy alege 5; optimul este 4 + 4 = 8.",
            "Greedy picks 5; optimum is 4 + 4 = 8.",
          ),
        );
      },
      editActions,
    );
    const generator = node("div", undefined, tools, "studio-fields");
    field(
      generator,
      L("Seed generator", "Generator seed"),
      "s-seed",
      localDay(),
      "text",
    );
    field(generator, L("Lungime", "Length"), "s-length", 8, "number", 1, 16);
    const difficulty = selectField(
      generator,
      L("Dificultate · preset lungime", "Difficulty · length preset"),
      "s-difficulty",
      [
        ["6", L("Ușor · 6 case", "Easy · 6 houses")],
        ["10", L("Mediu · 10 case", "Medium · 10 houses")],
        ["16", L("Avansat · 16 case", "Advanced · 16 houses")],
      ],
      "10",
    );
    difficulty.onchange = () =>
      (host.querySelector("#s-length").value = difficulty.value);
    field(
      generator,
      L("Valoare minimă", "Minimum value"),
      "s-min",
      0,
      "number",
      -99,
      99,
    );
    field(
      generator,
      L("Valoare maximă", "Maximum value"),
      "s-max",
      20,
      "number",
      -99,
      99,
    );
    button(
      L("Generează reproductibil", "Generate reproducibly"),
      () => {
        const n = Number(host.querySelector("#s-length").value),
          min = Number(host.querySelector("#s-min").value),
          max = Number(host.querySelector("#s-max").value);
        if (
          ![n, min, max].every(Number.isInteger) ||
          n < 1 ||
          n > 16 ||
          min < -99 ||
          max > 99 ||
          max < min
        ) {
          status(
            L("Verifică limitele generatorului.", "Check generator limits."),
          );
          return;
        }
        host.querySelector("#s-values").value = seededValues(
          host.querySelector("#s-seed").value,
          n,
          min,
          max,
        ).join(",");
        applyEditor();
      },
      tools,
    );
    const direct = node("div", undefined, tools);
    direct.id = "s-direct";
    button(
      L("Editează fiecare casă", "Edit each house"),
      () => {
        direct.replaceChildren();
        try {
          getValues().forEach((v, i) => {
            const row = node("div", undefined, direct, "actions");
            const input = field(
              row,
              `#${i}`,
              "s-house-" + i,
              v,
              "number",
              -99,
              99,
            );
            input.onchange = () => {
              const values = getValues();
              values[i] = Number(input.value);
              host.querySelector("#s-values").value = values.join(",");
            };
            button(
              "←",
              () => {
                const v = getValues();
                if (i > 0) [v[i - 1], v[i]] = [v[i], v[i - 1]];
                host.querySelector("#s-values").value = v.join(",");
                direct.replaceChildren();
              },
              row,
            );
            button(
              "→",
              () => {
                const v = getValues();
                if (i < v.length - 1) [v[i + 1], v[i]] = [v[i], v[i + 1]];
                host.querySelector("#s-values").value = v.join(",");
                direct.replaceChildren();
              },
              row,
            );
            button(
              L("Șterge", "Delete"),
              () => {
                const v = getValues();
                v.splice(i, 1);
                host.querySelector("#s-values").value = v.join(",");
                direct.replaceChildren();
              },
              row,
            );
          });
        } catch {
          status(L("Verifică valorile.", "Check values."));
        }
      },
      tools,
    );
    button(
      L("Adaugă casă (0)", "Add house (0)"),
      () => {
        try {
          const values = getValues();
          if (values.length >= 16) throw Error();
          values.push(0);
          host.querySelector("#s-values").value = values.join(",");
        } catch {
          status(L("Maximum 16 case.", "At most 16 houses."));
        }
      },
      tools,
    );
    node("div", undefined, host).id = "s-board";
    renderBoard();
    const sharing = panel(
      L("Colecții, partajare și duel", "Collections, sharing and duel"),
      "s-sharing",
    );
    const puzzleName = field(
      sharing,
      L("Numele puzzle-ului", "Puzzle name"),
      "s-puzzle-name",
      "",
      "text",
    );
    puzzleName.maxLength = 60;
    button(
      L("Salvează în colecție", "Save to collection"),
      () => {
        if (
          !profile().puzzle ||
          !puzzleName.value.trim() ||
          profile().collection.length >= 100
        ) {
          status(
            L(
              "Aplică un puzzle, scrie un nume; maximum 100 de puzzle-uri.",
              "Apply a puzzle and enter a name; at most 100 puzzles.",
            ),
          );
          return;
        }
        profile().collection.push({
          name: puzzleName.value.trim(),
          puzzle: structuredClone(profile().puzzle),
        });
        save();
        renderCollection();
      },
      sharing,
    );
    button(
      L("Export pachet puzzle-uri", "Export puzzle pack"),
      () =>
        download("candy-route-puzzles.json", {
          version: 1,
          type: "candy-route-puzzles",
          items: profile().collection,
        }),
      sharing,
    );
    const pack = field(
      sharing,
      L("Import pachet puzzle-uri", "Import puzzle pack"),
      "s-pack",
      "",
      "file",
    );
    pack.accept = ".json";
    pack.onchange = async () => {
      try {
        const file = pack.files[0];
        if (!file || file.size > 1000000) throw Error();
        const items = parsePack(JSON.parse(await file.text()));
        if (items.length + profile().collection.length > 100) throw Error();
        profile().collection.push(...items);
        save();
        renderCollection();
        status(L("Pachet importat.", "Pack imported."));
      } catch {
        status(
          L(
            "Pachet invalid sau colecție plină.",
            "Invalid pack or collection full.",
          ),
        );
      }
      pack.value = "";
    };
    node("div", undefined, sharing).id = "s-collection";
    renderCollection();
    button(L("Link cu reguli", "Link with rules"), sharePuzzle, sharing);
    const shared = field(
      sharing,
      L("Link de copiat", "Link to copy"),
      "s-share",
      "",
      "text",
    );
    shared.readOnly = true;
    shared.hidden = true;
    button(
      L("Duel local · aceeași stradă", "Local duel · same street"),
      () => {
        if (!profile().puzzle) return;
        duel = { scores: [] };
        start(profile().puzzle, variant);
        status(
          L("Jucătorul 1: rezolvă și verifică.", "Player 1: solve and check."),
        );
      },
      sharing,
    );
    button(
      L("Cod rezultat", "Result code"),
      () => {
        if (!checked || !profile().puzzle) {
          status(L("Verifică mai întâi un puzzle.", "Check a puzzle first."));
          return;
        }
        const r = { puzzle: profile().puzzle, picks: profile().picks };
        shared.hidden = false;
        shared.value = JSON.stringify(r);
        shared.focus();
        shared.select();
      },
      sharing,
    );
    const opponent = field(
      sharing,
      L("Codul rezultatului adversarului", "Opponent result code"),
      "s-opponent",
      "",
      "text",
    );
    button(
      L("Compară codurile", "Compare codes"),
      () => {
        try {
          if (opponent.value.length > 12000) throw Error();
          const raw = JSON.parse(opponent.value),
            p = normalizePuzzle(raw.puzzle);
          if (
            JSON.stringify(p) !== JSON.stringify(profile().puzzle) ||
            !routeValid(p, raw.picks)
          )
            throw Error();
          status(
            L("Rezultat adversar: ", "Opponent score: ") +
              routeScore(p, raw.picks) +
              L(" · al tău: ", " · yours: ") +
              routeScore(p, profile().picks),
          );
        } catch {
          status(
            L(
              "Cod invalid sau alt puzzle.",
              "Invalid code or different puzzle.",
            ),
          );
        }
      },
      sharing,
    );
    node(
      "p",
      L(
        "Duelurile prin link sunt bazate pe încredere; datele locale și rezultatele partajate pot fi modificate.",
        "Link duels use an honor system; local data and shared scores can be modified.",
      ),
      sharing,
    );
    const stats = panel(
      L("Progres, calendar și recompense", "Progress, calendar and rewards"),
      "s-progress",
    );
    node("div", undefined, stats).id = "s-stats";
    renderStats();
    const lab = panel(
      L(
        "Laborator: dependențe, recursie și scalare",
        "Lab: dependencies, recursion and scaling",
      ),
      "s-lab",
    );
    button(L("Construiește explicația", "Build explanation"), renderLab, lab);
    const output = node("div", undefined, lab, "table-wrap");
    output.id = "s-lab-output";
    output.tabIndex = 0;
    output.setAttribute("role", "region");
    output.setAttribute(
      "aria-label",
      L("Explicații algoritm", "Algorithm explanations"),
    );
    open.forEach((id) => {
      const d = host.querySelector("#" + id);
      if (d) d.open = true;
    });
  }
  function refresh() {
    if (restoring) return;
    const caseLink = document.getElementById("case-study-link");
    if (caseLink) {
      caseLink.textContent = L("Studiu de caz", "Case study");
      caseLink.href =
        "./case-study.html" + (bridge.get().lang === "en" ? "?lang=en" : "");
    }
    expand.textContent = expanded
      ? L("Închide ecranul mare", "Close expanded game")
      : L("Ecran mare", "Expand game");
    expand.setAttribute("aria-expanded", String(expanded));
    const active = bridge.get().attempt,
      optimal = bestRoute(active.street, active.mode === "circle");
    const score = active.picked.reduce((sum, i) => sum + active.street[i], 0),
      solved = score === optimal.total;
    objectives.textContent =
      L(
        "Obiective secundare: optim fără indiciu; încearcă și o rută cu maximum 3 opriri. ",
        "Side goals: optimum without hints; also try a route with at most 3 stops. ",
      ) + (solved && !active.hinted && !active.revealed ? "✓" : "○");
    if (solved && !wasSolved) {
      walker.classList.remove("walking");
      void walker.offsetWidth;
      walker.classList.add("walking");
    }
    wasSolved = solved;
    expand.title = L("Escape pentru închidere", "Escape to close");
    if (!host.querySelector("#s-map")) return;
    const s = bridge.get();
    if (host.dataset.lang !== s.lang) {
      host.dataset.lang = s.lang;
      render();
    }
    renderMap();
    const a = s.attempt,
      r = bestRoute(a.street, a.mode === "circle");
    if (a.kind !== "tutorial" && a.credited) {
      record(
        a.picked.reduce((sum, i) => sum + a.street[i], 0),
        r.total,
        JSON.stringify({
          kind: a.kind,
          day: a.day,
          level: a.level,
          mode: a.mode,
          street: a.street,
        }),
        "core",
        a.hinted || a.revealed,
      );
    }
    save();
  }
  // Restore the active profile's core only when switching/importing; current v2 storage stays authoritative at startup.
  render();
  host.dataset.lang = bridge.get().lang;
  refresh();
  function onlineStatus() {
    const connection = host.querySelector("#connection-status");
    if (!connection) return;
    connection.textContent = navigator.onLine
      ? L(
          "Online · jocul poate fi disponibil offline după prima încărcare completă.",
          "Online · offline play is available after the first complete load.",
        )
      : L(
          "Offline · progresul rămâne pe acest dispozitiv.",
          "Offline · progress stays on this device.",
        );
  }
  onlineStatus();
  window.addEventListener("online", onlineStatus);
  window.addEventListener("offline", onlineStatus);
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    button(
      L("Instalează Candy Route", "Install Candy Route"),
      async () => {
        await event.prompt();
      },
      host,
    );
  });
  function loadHash() {
    if (!location.hash.startsWith("#studio=")) return;
    try {
      if (location.hash.length > 12000) throw Error();
      const raw = JSON.parse(decodeURIComponent(location.hash.slice(8)));
      if (raw.version !== 1) throw Error();
      const p = normalizePuzzle(raw.puzzle);
      start(p, p.variant);
      host.scrollIntoView({ block: "start" });
    } catch {
      status(L("Link Studio invalid.", "Invalid Studio link."));
    }
  }
  loadHash();
  window.addEventListener("hashchange", loadHash);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopReplay();
  });
  return { refresh };
}
