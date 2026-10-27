import {
  ADVENTURE_KEY,
  ADVENTURE_MODES,
  adventurePuzzle,
  adventureIssues,
  adventureScore,
  adventureOrder,
  solveAdventure,
  presetAdventure,
  newAdventureProfile,
  freshAdventure,
  validateAdventure,
  validateCampaign,
  weeklyAdventure,
  botAdventure,
} from "./adventure-rules.js";
import {
  normalizePuzzle,
  validateStudio,
  seededValues,
} from "./studio-rules.js";
import {
  bestRoute,
  maxCandy,
  maxCandyMemo,
  maxCandyBruteForce,
} from "./candy.js";
import { localDay, LEVELS, unlocked, validateState } from "./game.js";

export function initAdventure(bridge) {
  const main = document.querySelector("main"),
    host = document.createElement("section");
  host.id = "adventure";
  host.className = "panel";
  document.querySelector("footer").before(host);
  const home = document.createElement("section");
  home.id = "adventure-home";
  main.querySelector("header").after(home);
  const menu = document.createElement("nav");
  menu.id = "adventure-menu";
  menu.setAttribute("aria-label", "Candy Route");
  home.after(menu);
  const L = (ro, en) => (bridge.state().lang === "ro" ? ro : en);
  let data = freshAdventure(),
    error = "",
    blockedSave = false,
    solved = null,
    preview = null,
    animation = null,
    onlineTimer = null,
    online = null,
    turn = 0,
    otherPicks = [],
    pendingInstall = null,
    restoring = false;
  let legacy = new URL(location.href).searchParams.get("view") === "classic";
  try {
    const raw = localStorage.getItem(ADVENTURE_KEY);
    if (raw) data = validateAdventure(JSON.parse(raw));
  } catch {
    blockedSave = true;
    error = L(
      "Salvarea Aventură nu poate fi citită. Exportă datele brute înainte de import.",
      "Adventure save cannot be read. Export raw data before importing.",
    );
  }
  const id = () => `p${bridge.studio.identity()}`;
  const profile = () =>
    data.profiles[id()] ?? (data.profiles[id()] = newAdventureProfile());
  const session = () => profile().session;
  function store() {
    if (blockedSave) return;
    try {
      localStorage.setItem(ADVENTURE_KEY, JSON.stringify(data));
      error = "";
    } catch {
      error = L(
        "Nu s-a putut salva local. Exportă backupul.",
        "Local saving failed. Export a backup.",
      );
    }
  }
  const node = (tag, text, parent, cls) => {
    const n = document.createElement(tag);
    if (text !== undefined) n.textContent = text;
    if (cls) n.className = cls;
    parent.append(n);
    return n;
  };
  const action = (parent, text, fn, attrs = {}) => {
    const b = node("button", text, parent);
    b.type = "button";
    for (const [k, v] of Object.entries(attrs)) b.setAttribute(k, v);
    b.onclick = fn;
    return b;
  };
  function field(
    parent,
    label,
    key,
    value,
    type = "number",
    min = 0,
    max = 99,
  ) {
    const l = node("label", undefined, parent);
    node("span", label, l);
    const f = node("input", undefined, l);
    Object.assign(f, { id: key, type, value });
    if (type === "number" || type === "range") {
      f.min = min;
      f.max = max;
      f.step = 1;
    }
    return f;
  }
  function select(parent, label, key, options, value) {
    const l = node("label", undefined, parent);
    node("span", label, l);
    const f = node("select", undefined, l);
    f.id = key;
    options.forEach(([v, t]) => {
      const o = node("option", t, f);
      o.value = v;
    });
    f.value = value;
    return f;
  }
  function details(parent, title, id) {
    const d = node("details", undefined, parent, "adv-details");
    d.id = id;
    node("summary", title, d);
    return d;
  }
  function status(text) {
    let p = host.querySelector("#adv-status");
    if (!p) {
      p = node("p", "", host);
      p.id = "adv-status";
      p.setAttribute("role", "status");
    }
    p.textContent = text;
  }
  const labels = () => ({
    classic: L("Clasic", "Classic"),
    zones: L("Cartiere", "Districts"),
    minimum: L("Minimum opriri", "Minimum stops"),
    recharge: L("Energie regenerabilă", "Recharge"),
    diversity: L("Diversitate", "Diversity"),
    delivery: L("Livrare", "Delivery"),
    travel: L("Deplasare", "Travel"),
  });
  const issueText = (issue) =>
    ({
      indices: L("Indici invalizi.", "Invalid indices."),
      closed: L("Casă închisă", "Closed house"),
      required: L("Lipsește o casă obligatorie", "Missing required house"),
      count: L(
        "Numărul de opriri nu respectă limita",
        "Stop count violates the limit",
      ),
      neighbors: L("Case incompatibile", "Conflicting houses"),
      energy: L("Buget de energie depășit", "Energy budget exceeded"),
      time: L("Buget de timp depășit", "Time budget exceeded"),
      minimum: L("Mai sunt necesare opriri", "More stops required"),
      zones: L(
        "Maximum două vizite consecutive în același cartier",
        "At most two consecutive visits in one district",
      ),
      recharge: L(
        "Energie insuficientă înainte de vizită",
        "Not enough energy before the visit",
      ),
      finish: L("Destinația trebuie inclusă", "Destination must be included"),
      travel: L("Distanța depășește bugetul", "Distance exceeds budget"),
    })[issue.code] +
    (issue.houses ? " · " + issue.houses.map((i) => "#" + i).join(", ") : "") +
    (issue.value !== undefined ? " · " + issue.value : "");
  function exportFile(name, object, type = "application/json") {
    const text =
        typeof object === "string" ? object : JSON.stringify(object, null, 2),
      url = URL.createObjectURL(new Blob([text], { type })),
      a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
  function navigate(screen) {
    if (document.querySelector(".stage.expanded"))
      document.getElementById("expand-game").click();
    clearInterval(animation);
    legacy = false;
    data.screen = screen;
    const url = new URL(location.href);
    url.searchParams.delete("view");
    history.replaceState(null, "", url.pathname + url.search + url.hash);
    store();
    render();
    const title =
      screen === "home"
        ? home
        : screen === "play"
          ? document.querySelector("#session-title")
          : host;
    title.tabIndex = -1;
    title.focus();
  }
  window.addEventListener("candy:navigate", (e) => {
    if (typeof e.detail === "string") navigate(e.detail);
  });
  function applyPreferences() {
    const p = data.prefs;
    document.body.classList.toggle("text-only", p.text);
    document.body.style.setProperty("--text-scale", p.scale / 100);
    document.body.style.setProperty("--house-scale", p.house / 100);
    for (const k of ["character", "decor", "transitions", "effects"])
      document.body.dataset[k] = String(p[k]);
    document.body.dataset.weather = p.weather;
    document.body.dataset.night = String(p.night);
  }
  function visibility() {
    const screen = data.screen;
    for (const el of main.children) {
      if (
        [home, menu, host].includes(el) ||
        el.tagName === "HEADER" ||
        el.tagName === "FOOTER"
      )
        continue;
      if (legacy) {
        el.hidden = false;
        continue;
      }
      if (el.id === "studio") {
        el.hidden = true;
        continue;
      }
      const show =
        el.id === "campaign"
          ? false
          : el.classList.contains("strategy-lab") || el.id === "explanation"
            ? screen === "learn"
            : el.querySelector?.("#backup-title")
              ? screen === "settings"
              : el.querySelector?.("#editor")
                ? false
                : screen === "play";
      el.hidden = !show;
    }
    home.hidden = legacy || screen !== "home";
    host.hidden = legacy || screen === "home" || screen === "play";
    menu.hidden = legacy;
    if (screen === "campaign") document.querySelector("#campaign").open = true;
  }
  function renderHome() {
    home.replaceChildren();
    node("p", "CANDY ROUTE · V4", home, "eyebrow");
    node(
      "h2",
      L("O stradă. Alegerile tale.", "One street. Your choices."),
      home,
    );
    node(
      "p",
      L(
        "Adună bomboane fără să alegi case vecine. Începe simplu sau construiește propria provocare.",
        "Collect candy without choosing neighboring houses. Start simply or build your own challenge.",
      ),
      home,
    );
    const cards = node("div", undefined, home, "adv-start-grid");
    for (const [screen, title, desc] of [
      [
        "play",
        L("Joacă", "Play"),
        L("Intră direct pe stradă", "Go straight to the street"),
      ],
      [
        "campaign",
        L("Campanie", "Campaign"),
        L("Cinci cartiere, 30 de niveluri", "Five districts, 30 levels"),
      ],
      [
        "studio",
        "Studio",
        L("Creează și experimentează", "Create and experiment"),
      ],
    ]) {
      const card = action(cards, title, () => navigate(screen), {
        "data-route": screen,
      });
      node("span", desc, card);
    }
    const a = bridge.state().attempt;
    action(home, L("Continuă ultima sesiune", "Continue last session"), () =>
      navigate(session() && !session().checked ? "adventure" : "play"),
    );
    const summary = node(
      "p",
      `${L("Ultimul joc", "Last game")}: ${a.kind} · ${a.street.length} ${L("case", "houses")}`,
      home,
    );
    summary.className = "muted";
  }
  function renderMenu() {
    menu.replaceChildren();
    for (const [key, name] of [
      ["home", L("Acasă", "Home")],
      ["play", L("Joacă", "Play")],
      ["campaign", L("Campanie", "Campaign")],
      ["studio", "Studio"],
      ["adventure", L("Aventură", "Adventure")],
      ["learn", L("Învață", "Learn")],
      ["progress", L("Progres", "Progress")],
      ["settings", L("Setări", "Settings")],
    ])
      action(menu, name, () => navigate(key), {
        "aria-current": data.screen === key ? "page" : "false",
        "data-route": key,
      });
  }
  function welcomeHint() {
    const a = bridge.state().attempt;
    document.querySelector("#rule").title = L(
      "Alege o casă, apoi observă vecinele blocate.",
      "Choose a house, then notice its blocked neighbors.",
    );
    if (a.kind === "tutorial") {
      const active = document.querySelector(".house[aria-pressed=true]");
      if (active)
        active.title = L(
          "Vecinele acestei case sunt blocate. Alege mai departe.",
          "This house blocks its neighbors. Choose farther away.",
        );
      const target = active ?? document.querySelector(".house");
      if (target) {
        let tip=document.getElementById("adv-context-tip");
        if(!tip){tip=node("small","",document.getElementById("street-wrap"),"adv-tutorial-tip");tip.id="adv-context-tip";}
        tip.textContent=active?L("Acum ocolește vecina.","Now skip the neighbor."):L("Începe cu această casă.","Start with this house.");
        target.setAttribute("aria-describedby",tip.id);
      }
    } else { document.getElementById("adv-context-tip")?.remove(); }
  }
  const story = () => [
    [
      L("Suburbia felinarelor", "Lantern suburb"),
      L(
        "Mira pregătește seara de Halloween. Ajut-o să strângă dulciuri pentru invitați.",
        "Mira is preparing Halloween night. Help collect treats for her guests.",
      ),
      "Mira",
    ],
    [
      L("Pădurea șoaptelor", "Whispering forest"),
      L(
        "Bufnița Nox caută drumul printre casele cu surprize.",
        "Nox the owl searches for a route among mysterious houses.",
      ),
      "Nox",
    ],
    [
      L("Castelul dulce", "Candy castle"),
      L(
        "Ada organizează ospățul. Unele alegeri aparent bune ascund capcane.",
        "Ada is preparing a feast. Some tempting choices hide traps.",
      ),
      "Ada",
    ],
    [
      L("Orașul luminilor", "City of lights"),
      L(
        "Toma are puțin timp pentru livrări. Construiește o rută atentă.",
        "Toma has limited time for deliveries. Build a careful route.",
      ),
      "Toma",
    ],
    [
      L("Târgul de la miezul nopții", "Midnight fair"),
      L(
        "Luna deschide târgul. Ultima stradă îți pune strategia la încercare.",
        "Luna opens the fair. The final street tests your strategy.",
      ),
      "Luna",
    ],
  ];
  function map() {
    node("h2", L("Harta aventurii", "Adventure map"), host);
    const grid = node("div", undefined, host, "adv-district-map"),
      state = bridge.state();
    story().forEach(([name, intro, person], chapter) => {
      const district = node(
        "section",
        undefined,
        grid,
        "adv-district zone-" + chapter,
      );
      node(
        "span",
        ["🏡", "🌲", "🏰", "🌃", "🎡"][chapter],
        district,
        "adv-district-art",
      );
      node("h3", name, district);
      node("p", intro, district);
      const choice = profile().choices[chapter];
      district.dataset.choice = choice ?? "none";
      const storyDecor = node(
        "span",
        choice === "garden" ? "🌻 🌷" : choice === "lantern" ? "🏮 ✨" : "",
        district,
        "adv-story-decor",
      );
      storyDecor.setAttribute("aria-hidden", "true");
      const complete = LEVELS.slice(chapter * 6, chapter * 6 + 6).filter(
        (l) => state.progress[l.id]?.stars || state.progress[l.id]?.practiced,
      ).length;
      node(
        "p",
        L("Misiune: ", "Mission: ") +
          complete +
          "/6 " +
          L("străzi rezolvate", "streets completed"),
        district,
      );
      node(
        "p",
        `${person}: ${choice === "garden" ? L("Grădina noastră prinde culoare.", "Our garden is coming to life.") : choice === "lantern" ? L("Felinarele ne arată drumul.", "The lanterns show us the way.") : L("Alegi lumină sau grădină pentru cartier?", "Will you choose lanterns or a garden for this district?")}`,
        district,
      );
      const options = node("div", undefined, district, "actions");
      for (const c of ["lantern", "garden"])
        action(
          options,
          c === "lantern" ? L("Felinare", "Lanterns") : L("Grădină", "Garden"),
          () => {
            profile().choices[chapter] = c;
            store();
            render();
          },
          { "aria-pressed": String(choice === c) },
        );
      const levels = node("div", undefined, district, "adv-map-levels");
      LEVELS.slice(chapter * 6, chapter * 6 + 6).forEach((l) => {
        const r = state.progress[l.id];
        const b = action(
          levels,
          `${l.id}${r?.stars ? " ★".repeat(r.stars) : r?.practiced ? " ✓" : ""}`,
          () => {
            bridge.level(l.id);
            navigate("play");
          },
          { "aria-label": `${name} · ${L("Nivel", "Level")} ${l.id}` },
        );
        b.disabled = !unlocked(state.progress, l.id);
      });
      const last = state.progress[chapter * 6 + 6];
      if (last?.stars || last?.practiced)
        node(
          "p",
          L(
            "Capitol încheiat: compară „iau” cu „sar”. Explorează alte rute la rejucare.",
            "Chapter complete: compare take with skip. Explore other routes when replaying.",
          ),
          district,
        );
    });
    const complete = Object.values(state.progress).filter(
      (r) => r.stars || r.practiced,
    ).length;
    if (complete === 30) {
      node("h3", L("Târgul este deschis!", "The fair is open!"), host);
      const stars = Object.values(state.progress).reduce(
        (sum, r) => sum + r.stars,
        0,
      );
      node(
        "p",
        `${stars}/90 ★ · ${Object.values(profile().choices).filter((v) => v === "garden").length} ${L("grădini create. Prietenii îți mulțumesc pentru călătorie.", "gardens created. Your friends thank you for the journey.")}`,
        host,
      );
    }
  }
  function startAdventure(puzzle, name = "", picks = []) {
    const p = adventurePuzzle(puzzle);
    profile().session = {
      puzzle: p,
      name: name.slice(0, 60),
      picks: [...picks],
      secondPicks: [],
      assisted: false,
      checked: false,
    };
    solved = solveAdventure(p);
    turn = 0;
    otherPicks = [];
    store();
    navigate("adventure");
  }
  function recordAttempt(s, issues) {
    const r = {
      day: localDay(),
      mode: s.puzzle.mode,
      valid: !issues.length,
      assisted: s.assisted,
      score: adventureScore(s.puzzle, s.picks),
      best: solved.total,
      puzzle: JSON.stringify(s.puzzle),
      issue: issues.map(issueText).join("; ").slice(0, 500),
    };
    profile().records.push(r);
    if (profile().records.length > 1000) profile().records.shift();
    store();
    return r;
  }
  function instructions(p) {
    const b = p.base;
    const descriptions = {
      zones: L(
        "Maximum două vizite consecutive în același cartier.",
        "At most two consecutive visits in the same district.",
      ),
      minimum: L("Număr minim de opriri: ", "Minimum stops: ") + p.minimum,
      recharge: L(
        "Plătești energia înainte de vizită, apoi primești recompensa afișată.",
        "Pay energy before each visit, then receive the displayed reward.",
      ),
      diversity:
        L(
          "Fiecare tip diferit de dulce adaugă ",
          "Each distinct candy type adds ",
        ) + p.bonus,
      delivery:
        L("Vizitează destinația #", "Visit destination #") +
        p.finish +
        L(" la final.", " last."),
      travel:
        L("Plecare #", "Start #") +
        p.start +
        L(" · distanță maximă ", " · maximum distance ") +
        p.travel,
      classic: L(
        "Păstrează o casă liberă între vizite.",
        "Leave one house between visits.",
      ),
    };
    return (
      descriptions[p.mode] +
      L(
        " Vizitele sunt ordonate după indice, cu destinația la final.",
        " Visits follow index order, with the destination last.",
      )
    );
  }
  function decorate(parent) {
    const d = node("div", undefined, parent, "adv-scenery");
    d.setAttribute("aria-hidden", "true");
    for (const [icon, name] of [
      ["🏮", L("Felinar aprins", "Lantern lit")],
      ["🐈", L("Pisica te salută", "The cat says hello")],
      ["🎃", L("Dovleac vesel", "Happy pumpkin")],
    ]) {
      const b = action(d, icon, () => {
        const active = b.getAttribute("aria-pressed") !== "true";
        b.setAttribute("aria-pressed", String(active));
        b.textContent = active
          ? icon === "🐈"
            ? "😺"
            : icon === "🏮"
              ? "💡"
              : "✨"
          : icon;
        status(name);
      });
      b.tabIndex = -1;
    }
    d.removeAttribute("aria-hidden");
    for (const b of d.children)
      b.setAttribute(
        "aria-label",
        b.textContent === "🐈"
          ? L("Pisică", "Cat")
          : b.textContent === "🏮"
            ? L("Felinar", "Lantern")
            : L("Dovleac", "Pumpkin"),
      );
  }
  function roundResult(parent, s) {
    const issues = adventureIssues(s.puzzle, s.picks);
    node("h3", L("Rezultatul rundei", "Round result"), parent);
    node(
      "p",
      `${L("Scor", "Score")}: ${adventureScore(s.puzzle, s.picks)} · ${L("Optim", "Optimal")}: ${solved.total ?? L("imposibil", "impossible")} · ${s.assisted ? L("cu ajutor", "assisted") : L("fără ajutor", "unassisted")}`,
      parent,
    );
    const list = node("ul", undefined, parent);
    issues.forEach((i) => node("li", issueText(i), list));
    if (!issues.length && solved.total !== null) {
      const best = solved.routes[0],
        remove = s.picks.filter((i) => !best.includes(i)),
        add = best.filter((i) => !s.picks.includes(i));
      node(
        "p",
        L("Ajustare concretă: elimină ", "Concrete adjustment: remove ") +
          (remove.map((i) => "#" + i).join(", ") || "∅") +
          L("; adaugă ", "; add ") +
          (add.map((i) => "#" + i).join(", ") || "∅") +
          L(". Diferență: ", ". Gap: ") +
          (solved.total - adventureScore(s.puzzle, s.picks)),
        parent,
      );
    }
    action(parent, L("Reîncearcă", "Retry"), () =>
      startAdventure(s.puzzle, s.name),
    );
  }
  function drawRound() {
    const s = session();
    if (!s) {
      node(
        "p",
        L("Alege o provocare pentru a începe.", "Choose a challenge to begin."),
        host,
      );
      return;
    }
    solved = solveAdventure(s.puzzle);
    const p = s.puzzle,
      b = p.base,
      t = profile().tournament,
      playingTournament =
        t &&
        t.round < t.puzzles.length &&
        JSON.stringify(t.puzzles[t.round]) === JSON.stringify(p);
    node("h3", s.name || labels()[p.mode], host);
    node("p", instructions(p), host);
    const contextual = node(
      "p",
      L(
        "Atinge casa pentru selecție. Vecinătatea este verificată la final.",
        "Tap a house to select it. Adjacency is checked when submitting.",
      ),
      host,
    );
    contextual.id = "adv-context";
    if (playingTournament)
      node(
        "p",
        `${L("Runda", "Round")} ${t.round + 1}/${t.puzzles.length} · ${t.kind === "coop" ? L("Construiți împreună o rută", "Build one route together") : t.kind === "simultaneous" ? L("Două selecții independente", "Two independent selections") : L("Tu contra algoritmului", "You versus the algorithm")}`,
        host,
      );
    decorate(host);
    const scene = node("div", undefined, host, "adv-round-scene");
    const weather = node("div", undefined, scene, "adv-atmosphere");
    weather.setAttribute("aria-hidden", "true");
    const walker = node("span", "🚶", scene, "adv-route-person");
    walker.setAttribute("aria-hidden", "true");
    const road = node("div", undefined, scene, "adv-visual-street");
    road.setAttribute("role", "group");
    road.setAttribute("aria-label", L("Strada aventurii", "Adventure street"));
    const picks = s.picks;
    otherPicks = [...(s.secondPicks ?? [])];
    b.values.forEach((value, i) => {
      const card = action(
        road,
        "",
        () => {
          if (s.checked) return;
          s.picks = s.picks.includes(i)
            ? s.picks.filter((j) => j !== i)
            : [...s.picks, i];
          store();
          render();
          const conflicts = adventureIssues(p, s.picks).filter(
            (v) => v.code === "neighbors",
          );
          status(
            conflicts.length
              ? conflicts.map(issueText).join("; ")
              : story()[i % 5][2] +
                  ": " +
                  L(
                    "Bine ai venit! Verifică vecinele înainte de următoarea oprire.",
                    "Welcome! Check the neighbors before the next stop.",
                  ),
          );
        },
        {
          "aria-pressed": String(picks.includes(i)),
          "data-adv-house": String(i),
          "aria-label": `${L("Casa", "House")} ${i}, ${value}${b.closed.includes(i) ? ", " + L("închisă", "closed") : ""}`,
        },
      );
      card.className = "adv-house style-" + (i % 4);
      if (b.closed.includes(i)) card.disabled = true;
      node("span", `#${i}`, card, "adv-house-index");
      node("span", ["⌂", "♜", "⌂", "♟"][i % 4], card, "adv-house-art");
      const resident = node(
        "span",
        ["🧙", "🦉", "🧑‍🍳", "🚴", "🧚"][i % 5],
        card,
        "adv-resident",
      );
      resident.setAttribute("aria-hidden", "true");
      node("strong", String(value), card);
      node(
        "span",
        picks.includes(i) ? L("✓ Aleasă", "✓ Selected") : L("Alege", "Choose"),
        card,
        "adv-house-state",
      );
      node(
        "small",
        `${L("Energie", "Energy")} ${b.costs[i]}${p.mode === "recharge" ? " +" + p.rewards[i] : ""} · ${b.minutes[i]} min`,
        card,
      );
      if (p.mode === "zones")
        node("small", L("Cartier ", "District ") + p.zones[i], card);
      if (p.mode === "diversity")
        node(
          "small",
          [
            L("Ciocolată", "Chocolate"),
            L("Jeleuri", "Jelly"),
            L("Acadele", "Lollipop"),
          ][p.types[i]],
          card,
        );
      card.disabled ||= s.checked;
    });
    if (playingTournament && t.kind === "simultaneous" && !s.checked) {
      const second = node("div", undefined, host, "adv-p2");
      node("h4", L("Jucătorul 2", "Player 2"), second);
      const grid = node("div", undefined, second, "adv-map-levels");
      b.values.forEach((v, i) =>
        action(
          grid,
          `#${i}: ${v}${otherPicks.includes(i) ? " ✓" : ""}`,
          () => {
            otherPicks = otherPicks.includes(i)
              ? otherPicks.filter((x) => x !== i)
              : [...otherPicks, i];
            s.secondPicks = [...otherPicks];
            store();
            render();
          },
          {
            "aria-pressed": String(otherPicks.includes(i)),
            "data-p2-house": String(i),
          },
        ),
      );
    }
    const controls = node("div", undefined, host, "actions");
    action(controls, L("Verifică traseul", "Check route"), () => {
      if (s.checked) return;
      const issues = adventureIssues(p, s.picks);
      if (
        playingTournament &&
        t.kind === "simultaneous" &&
        adventureIssues(p, otherPicks).length
      ) {
        status(
          L(
            "Jucătorul 2 are o rută invalidă.",
            "Player 2 has an invalid route.",
          ),
        );
        return;
      }
      recordAttempt(s, issues);
      if (issues.length) {
        status(issues.map(issueText).join("; "));
        return;
      }
      s.checked = true;
      if (playingTournament) {
        const opponent =
          t.kind === "simultaneous"
            ? adventureScore(p, otherPicks)
            : t.kind === "coop"
              ? solved.total
              : adventureScore(
                  p,
                  botAdventure(
                    p,
                    ["greedy", "alternate", "strategist"][t.round % 3],
                  ),
                );
        t.scores.push([adventureScore(p, s.picks), opponent]);
        t.round++;
      }
      store();
      render();
      animateRoute(scene, walker, p, s.picks);
    }).disabled = s.checked;
    action(controls, L("Indiciu contextual", "Targeted hint"), () => {
      s.assisted = true;
      store();
      const issues = adventureIssues(p, s.picks);
      status(
        issues.length
          ? issueText(issues[0])
          : L("Încearcă casa #", "Try house #") +
              (solved.routes[0]?.find((i) => !s.picks.includes(i)) ?? "—"),
      );
    });
    action(controls, L("Golește", "Clear"), () => {
      if (!s.checked) {
        s.picks = [];
        store();
        render();
      }
    });
    if (playingTournament && t.kind === "coop")
      action(controls, L("Predă rândul", "Pass turn"), () => {
        turn = 1 - turn;
        status(L("Alege jucătorul ", "Player selecting: ") + (turn + 1));
      });
    if (s.checked) {
      const result = node("div", undefined, host, "adv-result");
      roundResult(result, s);
      if (t && t.round < t.puzzles.length)
        action(result, L("Runda următoare", "Next round"), () =>
          startAdventure(t.puzzles[t.round], L("Turneu", "Tournament")),
        );
      else if (t && t.round === t.puzzles.length) {
        const sums = t.scores.reduce(
          (s, r) => [s[0] + r[0], s[1] + r[1]],
          [0, 0],
        );
        node("h3", L("Clasament final", "Final standings"), result);
        node(
          "p",
          `${sums[0]} – ${sums[1]} · ${t.kind === "coop" ? L("Echipă / țintă", "Team / target") : sums[0] === sums[1] ? L("Egalitate", "Tie") : sums[0] > sums[1] ? L("Ai câștigat", "You win") : L("Adversarul câștigă", "Opponent wins")}`,
          result,
        );
      }
    }
  }
  function animateRoute(scene, walker, p, picks) {
    clearInterval(animation);
    if (
      !data.prefs.character ||
      bridge.state().still ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const actual = host.querySelector(".adv-route-person");
    const cards = [...host.querySelectorAll(".adv-house")],
      order = adventureOrder(p, picks);
    let step = 0;
    if (!actual || !cards.length) return;
    const move = () => {
      const card = cards[order[step++]],
        rect = card?.getBoundingClientRect(),
        root = actual.parentElement.getBoundingClientRect();
      if (rect) {
        actual.style.left = rect.left - root.left + rect.width / 2 + "px";
        actual.style.top = rect.top - root.top + 15 + "px";
      }
      if (step >= order.length) clearInterval(animation);
    };
    if (order.length) {
      move();
      animation = setInterval(move, 600);
    }
  }
  function adventure() {
    node("h2", L("Aventură și provocări", "Adventure and challenges"), host);
    const chooser = node("div", undefined, host, "adv-mode-picker");
    for (const mode of ADVENTURE_MODES)
      action(
        chooser,
        labels()[mode],
        () => {
          profile().tournament = null;
          startAdventure(
            presetAdventure(mode, localDay() + mode),
            labels()[mode],
          );
        },
        { "data-mode": mode },
      );
    const games = details(
      host,
      L("Campionat, cooperare și duel", "Championship, co-op and duel"),
      "adv-tournament",
    );
    node(
      "p",
      L(
        "Adversari: Greedy alege valori mari, Alternator încearcă indicii pari, Strateg calculează optimul.",
        "Opponents: Greedy favors large values, Alternator tries even indices, Strategist computes the optimum.",
      ),
      games,
    );
    for (const kind of ["championship", "coop", "simultaneous"])
      action(
        games,
        {
          championship: L("Campionat · 3 runde", "Championship · 3 rounds"),
          coop: L("Cooperare · 3 runde", "Co-op · 3 rounds"),
          simultaneous: L(
            "Duel simultan · 3 runde",
            "Simultaneous duel · 3 rounds",
          ),
        }[kind],
        () => {
          const puzzles = Array.from({ length: 3 }, (_, i) =>
            presetAdventure("classic", localDay() + i),
          );
          profile().tournament = { kind, puzzles, round: 0, scores: [] };
          startAdventure(puzzles[0], L("Turneu local", "Local tournament"));
        },
      );
    action(games, L("Export turneu", "Export tournament"), () =>
      exportFile("candy-route-tournament.json", {
        type: "candy-route-tournament",
        version: 1,
        puzzles:
          profile().tournament?.puzzles ??
          Array.from({ length: 3 }, (_, i) =>
            presetAdventure("classic", "tournament" + i),
          ),
      }),
    );
    const upload = field(
      games,
      L("Import turneu", "Import tournament"),
      "adv-tournament-file",
      "",
      "file",
    );
    upload.accept = ".json";
    upload.onchange = async () => {
      try {
        const file = upload.files[0];
        if (!file || file.size > 500000) throw Error();
        const raw = JSON.parse(await file.text());
        if (
          raw.type !== "candy-route-tournament" ||
          raw.version !== 1 ||
          !Array.isArray(raw.puzzles) ||
          raw.puzzles.length < 1 ||
          raw.puzzles.length > 20
        )
          throw Error();
        const puzzles = raw.puzzles.map(adventurePuzzle);
        profile().tournament = {
          kind: "package",
          puzzles,
          round: 0,
          scores: [],
        };
        startAdventure(puzzles[0], L("Turneu importat", "Imported tournament"));
      } catch {
        status(
          L(
            "Pachet invalid; progresul a fost păstrat.",
            "Invalid pack; progress preserved.",
          ),
        );
      }
    };
    action(games, L("Multiplayer online", "Online multiplayer"), () =>
      navigate("online"),
    );
    drawRound();
  }
  function builder() {
    node("h2", L("Creator vizual", "Visual creator"), host);
    node(
      "p",
      L(
        "Modifică fiecare casă, apoi validează și joacă. Maximum 16 case; toate regulile intră în pachet.",
        "Edit each house, then validate and play. Up to 16 houses; all rules are included in the pack.",
      ),
      host,
    );
    let draft = structuredClone(session()?.puzzle ?? presetAdventure());
    const controls = node("div", undefined, host, "adv-fields"),
      name = field(
        controls,
        L("Nume nivel", "Level name"),
        "adv-build-name",
        session()?.name ?? "Puzzle",
        "text",
      );
    name.maxLength = 60;
    const mode = select(
      controls,
      L("Regulă suplimentară", "Additional rule"),
      "adv-build-mode",
      ADVENTURE_MODES.map((k) => [k, labels()[k]]),
      draft.mode,
    );
    mode.onchange = () => {
      draft.mode = mode.value;
      previewDraft();
    };
    for (const [key, label, min, max] of [
      [
        "minimum",
        L("Minimum opriri", "Minimum stops"),
        0,
        draft.base.values.length,
      ],
      [
        "start",
        L("Punct de plecare", "Starting point"),
        0,
        draft.base.values.length - 1,
      ],
      ["travel", L("Buget de distanță", "Distance budget"), 0, 1000],
      ["bonus", L("Bonus per tip dulce", "Bonus per candy type"), 0, 50],
    ]) {
      const f = field(
        controls,
        label,
        "adv-build-" + key,
        draft[key],
        "number",
        min,
        max,
      );
      f.oninput = () => {
        draft[key] = Number(f.value);
        previewDraft();
      };
    }
    const finish = field(
      controls,
      L("Destinație (−1 = fără)", "Destination (−1 = none)"),
      "adv-build-finish",
      draft.finish ?? -1,
      "number",
      -1,
      draft.base.values.length - 1,
    );
    finish.oninput = () => {
      draft.finish = Number(finish.value) < 0 ? null : Number(finish.value);
      previewDraft();
    };
    for (const [key, label, min, max] of [
      ["gap", L("Distanță între case", "House spacing"), 1, 3],
      [
        "k",
        L("Maximum K opriri", "At most K stops"),
        0,
        draft.base.values.length,
      ],
      ["budget", L("Energie inițială", "Initial energy"), 0, 1000],
      ["time", L("Buget minute", "Minute budget"), 0, 1000],
    ]) {
      const f = field(
        controls,
        label,
        "adv-base-" + key,
        draft.base[key],
        "number",
        min,
        max,
      );
      f.oninput = () => {
        draft.base[key] = Number(f.value);
        previewDraft();
      };
    }
    const topology = select(
      controls,
      L("Vecinătate", "Adjacency"),
      "adv-topology",
      [
        ["line", L("Stradă", "Street")],
        ["circle", L("Cerc", "Circle")],
        ["tree", L("Arbore", "Tree")],
      ],
      draft.base.edges ? "tree" : draft.base.circle ? "circle" : "line",
    );
    topology.onchange = () => {
      draft.base.circle = topology.value === "circle";
      draft.base.edges =
        topology.value === "tree"
          ? Array.from({ length: draft.base.values.length - 1 }, (_, i) => [
              Math.floor(i / 2),
              i + 1,
            ])
          : null;
      rows();
      previewDraft();
    };
    const street = node("div", undefined, host, "adv-builder-grid"),
      previewBox = node("div", undefined, host, "adv-preview");
    previewBox.id = "adv-preview";
    previewBox.setAttribute("role", "status");
    function rows() {
      street.replaceChildren();
      draft.base.values.forEach((v, i) => {
        const card = node("section", undefined, street, "adv-build-card");
        node("h3", L("Casa #", "House #") + i, card);
        for (const [key, label, array, min, max] of [
          ["value", L("Bomboane", "Candy"), draft.base.values, -99, 99],
          ["energy", L("Cost energie", "Energy cost"), draft.base.costs, 1, 99],
          ["minutes", L("Minute", "Minutes"), draft.base.minutes, 1, 99],
          [
            "reward",
            L("Energie primită", "Energy received"),
            draft.rewards,
            0,
            99,
          ],
          ["zone", L("Cartier", "District"), draft.zones, 0, 15],
        ]) {
          const f = field(
            card,
            label,
            `adv-${key}-${i}`,
            array[i],
            "number",
            min,
            max,
          );
          f.oninput = () => {
            array[i] = Number(f.value);
            previewDraft();
          };
        }
        const type = select(
          card,
          L("Dulce", "Candy type"),
          "adv-type-" + i,
          [
            ["0", L("Ciocolată", "Chocolate")],
            ["1", L("Jeleuri", "Jelly")],
            ["2", L("Acadele", "Lollipop")],
          ],
          String(draft.types[i]),
        );
        type.onchange = () => {
          draft.types[i] = Number(type.value);
          previewDraft();
        };
        for (const [key, label] of [
          ["closed", L("Închisă", "Closed")],
          ["required", L("Obligatorie", "Required")],
        ]) {
          const toggle = action(
            card,
            (draft.base[key].includes(i) ? "✓ " : "○ ") + label,
            () => {
              draft.base[key] = draft.base[key].includes(i)
                ? draft.base[key].filter((x) => x !== i)
                : [...draft.base[key], i];
              rows();
              previewDraft();
            },
            { "aria-pressed": String(draft.base[key].includes(i)) },
          );
        }
        if (draft.base.edges && i > 0) {
          const parent = select(
            card,
            L("Conectată cu #", "Connected to #"),
            "adv-parent-" + i,
            Array.from({ length: i }, (_, j) => [String(j), String(j)]),
            String(draft.base.edges[i - 1][0]),
          );
          parent.onchange = () => {
            draft.base.edges[i - 1] = [Number(parent.value), i];
            previewDraft();
          };
        }
      });
      if (draft.base.edges)
        drawTree(street, draft.base.edges, draft.base.values.length);
    }
    function previewDraft() {
      previewBox.replaceChildren();
      try {
        const p = adventurePuzzle(draft),
          r = solveAdventure(p);
        node(
          "p",
          `${L("Optim", "Optimal")}: ${r.total ?? L("imposibil", "impossible")} · ${r.count} ${L("soluții optime", "optimal routes")} · ${r.operations} ${L("submulțimi verificate", "subsets checked")}`,
          previewBox,
        );
        if (r.total === null)
          node(
            "p",
            L(
              "Restricțiile nu permit nicio rută. Ajustează casele obligatorii, limitele sau destinația.",
              "No feasible route. Adjust required houses, limits or destination.",
            ),
            previewBox,
          );
        else {
          const greedy = botAdventure(p, "greedy"),
            score = adventureIssues(p, greedy).length
              ? null
              : adventureScore(p, greedy);
          node(
            "p",
            L("Greedy: ", "Greedy: ") +
              (score ?? L("rută invalidă", "invalid route")) +
              L(" · diferență față de optim: ", " · gap to optimum: ") +
              (score === null ? "—" : r.total - score),
            previewBox,
          );
        }
      } catch {
        node(
          "p",
          L(
            "Date invalide. Verifică numerele, limitele și conexiunile.",
            "Invalid data. Check values, limits and connections.",
          ),
          previewBox,
        );
      }
    }
    rows();
    previewDraft();
    action(host, L("Validează și joacă", "Validate and play"), () => {
      try {
        const p = adventurePuzzle(draft);
        if (solveAdventure(p).total === null) {
          status(
            L(
              "Puzzle imposibil; ajustează regulile înainte de joc.",
              "Infeasible puzzle; adjust rules before playing.",
            ),
          );
          return;
        }
        profile().tournament = null;
        startAdventure(p, name.value);
      } catch {
        status(L("Nivel invalid.", "Invalid level."));
      }
    });
    const campaigns = details(
        host,
        L("Constructor de campanii", "Campaign builder"),
        "adv-campaign-builder",
      ),
      campaignName = field(
        campaigns,
        L("Nume campanie", "Campaign name"),
        "adv-campaign-name",
        "Campanie",
        "text",
      );
    campaignName.maxLength = 60;
    const chapter = field(
        campaigns,
        L("Capitol", "Chapter"),
        "adv-chapter",
        1,
        "number",
        1,
        5,
      ),
      unlock = field(
        campaigns,
        L("Niveluri anterioare necesare", "Previous levels required"),
        "adv-unlock",
        0,
        "number",
        0,
        19,
      );
    let working = profile().campaigns.at(-1)
      ? structuredClone(profile().campaigns.at(-1))
      : { name: "Campanie", levels: [] };
    const campaignList = node("ol", undefined, campaigns);
    function renderCampaign() {
      campaignList.replaceChildren();
      working.levels.forEach((l, i) => {
        const row = node(
          "li",
          `${i + 1}. ${l.name} · ${L("capitol", "chapter")} ${l.chapter} · ${L("necesită", "requires")} ${l.unlock}`,
          campaignList,
        );
        const done = new Set(
          profile()
            .records.filter((r) => r.valid && r.score === r.best)
            .map((r) => r.puzzle),
        );
        const completed = working.levels
          .slice(0, i)
          .filter((x) => done.has(JSON.stringify(x.puzzle))).length;
        const b = action(row, L("Joacă nivelul", "Play level"), () => {
          profile().tournament = null;
          startAdventure(l.puzzle, l.name);
        });
        b.disabled = completed < l.unlock;
      });
    }
    renderCampaign();
    action(campaigns, L("Adaugă nivelul curent", "Add current level"), () => {
      try {
        if (working.levels.length >= 20) throw Error();
        const candidate = {
          name: campaignName.value,
          levels: [
            ...working.levels,
            {
              name: name.value,
              chapter: Number(chapter.value),
              unlock: Number(unlock.value),
              puzzle: adventurePuzzle(draft),
            },
          ],
        };
        working = validateCampaign(candidate);
        renderCampaign();
        status(
          L(
            "Nivel adăugat în schița campaniei.",
            "Level added to campaign draft.",
          ),
        );
      } catch {
        status(
          L(
            "Date de campanie invalide. Deblocarea nu poate depăși numărul nivelurilor anterioare.",
            "Invalid campaign. Unlock count cannot exceed previous levels.",
          ),
        );
      }
    });
    action(campaigns, L("Salvează campania", "Save campaign"), () => {
      try {
        working = validateCampaign({ ...working, name: campaignName.value });
        if (profile().campaigns.length >= 20) throw Error();
        profile().campaigns.push(structuredClone(working));
        store();
        status(L("Campanie salvată.", "Campaign saved."));
      } catch {
        status(
          L(
            "Campanie invalidă sau limită de 20 atinsă.",
            "Invalid campaign or 20-campaign limit reached.",
          ),
        );
      }
    });
    action(campaigns, L("Export campanie", "Export campaign"), () => {
      try {
        exportFile("candy-route-campaign.json", {
          version: 1,
          type: "candy-route-campaign",
          campaign: validateCampaign({ ...working, name: campaignName.value }),
        });
      } catch {
        status(L("Adaugă un nivel valid.", "Add a valid level."));
      }
    });
    const imported = field(
      campaigns,
      L("Import campanie", "Import campaign"),
      "adv-campaign-file",
      "",
      "file",
    );
    imported.accept = ".json";
    imported.onchange = async () => {
      try {
        const file = imported.files[0];
        if (!file || file.size > 1000000) throw Error();
        const raw = JSON.parse(await file.text());
        if (raw.type !== "candy-route-campaign" || raw.version !== 1)
          throw Error();
        working = validateCampaign(raw.campaign);
        campaignName.value = working.name;
        renderCampaign();
        status(
          L(
            "Schiță importată; salvează pentru păstrare.",
            "Draft imported; save to keep it.",
          ),
        );
      } catch {
        status(
          L(
            "Campanie invalidă; datele existente au fost păstrate.",
            "Invalid campaign; existing data preserved.",
          ),
        );
      }
    };
    const saved = node("div", undefined, campaigns);
    profile().campaigns.forEach((c, i) =>
      action(saved, c.name, () => {
        working = structuredClone(c);
        campaignName.value = c.name;
        renderCampaign();
      }),
    );
    action(
      host,
      L("Deschide instrumentele Studio v3", "Open Studio v3 tools"),
      () => {
        document.querySelector("#studio").hidden = false;
        document.querySelector("#studio").scrollIntoView({ block: "start" });
      },
    );
  }
  function drawTree(parent, edges, n) {
    const ns = "http://www.w3.org/2000/svg",
      svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 640 250");
    svg.setAttribute("role", "img");
    svg.setAttribute(
      "aria-label",
      L("Arborele conexiunilor dintre case", "Tree of house connections"),
    );
    const positions = Array.from({ length: n }, (_, i) => ({
      x:
        30 +
        ((i % (Math.ceil(n / 2) || 1)) * 580) /
          Math.max(1, Math.ceil(n / 2) - 1),
      y: i < Math.ceil(n / 2) ? 50 : 200,
    }));
    for (const [a, b] of edges) {
      const line = document.createElementNS(ns, "line");
      for (const [k, v] of Object.entries({
        x1: positions[a].x,
        y1: positions[a].y,
        x2: positions[b].x,
        y2: positions[b].y,
      }))
        line.setAttribute(k, v);
      svg.append(line);
    }
    positions.forEach((p, i) => {
      const text = document.createElementNS(ns, "text");
      text.setAttribute("x", p.x);
      text.setAttribute("y", p.y);
      text.textContent = "#" + i;
      svg.append(text);
    });
    parent.append(svg);
  }
  function learn() {
    node("h2", L("Înțelege alegerile", "Understand the choices"), host);
    node(
      "p",
      L(
        "Exercițiile de programare dinamică de aici folosesc regula liniară originală, independent de restricțiile Aventură.",
        "Dynamic programming exercises here use the original linear rule, independently of Adventure restrictions.",
      ),
      host,
    );
    action(host, L("Repară ruta [4,5,4]", "Repair route [4,5,4]"), () => {
      profile().tournament = null;
      startAdventure(
        adventurePuzzle({ base: { values: [4, 5, 4] } }),
        L("Repară ruta", "Repair route"),
        [1],
      );
    });
    const debug = details(
      host,
      L("Găsește greșeala algoritmului", "Find the algorithm bug"),
      "adv-debug",
    );
    node(
      "pre",
      "function solve(values) { return Math.max(0, ...values); }",
      debug,
    );
    node(
      "p",
      L(
        "De ce nu funcționează pentru [4,5,4]?",
        "Why does this fail for [4,5,4]?",
      ),
      debug,
    );
    for (const [text, correct] of [
      [
        L("Ignoră combinațiile de case", "It ignores combinations of houses"),
        true,
      ],
      [L("Nu sortează lista", "It does not sort the list"), false],
      [L("Numerele sunt prea mici", "The numbers are too small"), false],
    ])
      action(debug, text, () =>
        status(
          correct
            ? L(
                "Corect: 4 + 4 = 8. Valoarea individuală maximă este doar 5.",
                "Correct: 4 + 4 = 8. The largest single value is only 5.",
              )
            : L(
                "Contraexemplul este 4 + 4 > 5; ordinea străzii trebuie păstrată.",
                "The counterexample is 4 + 4 > 5; street order must be preserved.",
              ),
        ),
      );
    const values = session()?.puzzle.base.values ?? [4, 5, 4, 2, 7],
      r = bestRoute(values),
      practice = details(
        host,
        L("Completează matricea DP", "Complete the DP matrix"),
        "adv-dp-practice",
      ),
      table = node("table", undefined, practice);
    node(
      "caption",
      L("Optimul pentru fiecare prefix", "Optimum for every prefix"),
      table,
    );
    const tbody = node("tbody", undefined, table);
    const answers = [];
    r.steps.forEach((s, i) => {
      const row = node("tr", undefined, tbody);
      node("th", "#" + i, row).scope = "row";
      node("td", String(values[i]), row);
      const cell = node("td", undefined, row),
        f = field(cell, `dp[${i}]`, "adv-dp-" + i, "", "number", 0, 2000);
      answers.push(f);
    });
    action(practice, L("Verifică matricea", "Check matrix"), () => {
      const wrong = answers
        .map((f, i) =>
          f.value === "" || Number(f.value) !== r.steps[i].best ? i : null,
        )
        .filter((i) => i !== null);
      status(
        wrong.length
          ? L("Revizuiește casele #", "Review houses #") +
              wrong.join(", ") +
              L(
                ": dp[i] = max(dp[i−1], valoare + dp[i−2]).",
                ": dp[i] = max(dp[i−1], value + dp[i−2]).",
              )
          : L("Toate celulele sunt corecte.", "All cells are correct."),
      );
    });
    const reconstruct = details(
      host,
      L("Reconstruiește ruta înapoi", "Reconstruct the route backwards"),
      "adv-reconstruct",
    );
    let cursor = values.length - 1,
      selected = [];
    const guide = node("p", "", reconstruct),
      selection = node("p", "", reconstruct),
      controls = node("div", undefined, reconstruct, "actions");
    function update() {
      guide.textContent =
        cursor < 0
          ? L("Reconstrucție încheiată.", "Reconstruction complete.")
          : L("Casa curentă #", "Current house #") + cursor;
      selection.textContent = selected
        .sort((a, b) => a - b)
        .map((i) => "#" + i)
        .join(", ");
      for (const b of controls.children) b.disabled = cursor < 0;
    }
    for (const take of [true, false])
      action(controls, take ? L("Iau", "Take") : L("Sar", "Skip"), () => {
        if (cursor < 0) return;
        const expected = r.steps[cursor].take > r.steps[cursor].skip;
        if (take !== expected) {
          status(
            L(
              "Compară take și skip. La egalitate, această reconstrucție preferă skip.",
              "Compare take and skip. On ties, this reconstruction prefers skip.",
            ),
          );
          return;
        }
        if (take) selected.push(cursor);
        cursor -= take ? 2 : 1;
        update();
      });
    update();
    const benchmark = details(
        host,
        L("Măsurători reale pe dispozitiv", "Actual device measurements"),
        "adv-benchmark",
      ),
      result = node("div", undefined, benchmark);
    action(
      benchmark,
      L("Rulează benchmark limitat", "Run bounded benchmark"),
      () => {
        result.replaceChildren();
        node(
          "p",
          L(
            "Milisecunde măsurate acum; mediana a cinci rulări. Valorile depind de dispozitiv și rezoluția ceasului.",
            "Milliseconds measured now; median of five runs. Values depend on the device and clock resolution.",
          ),
          result,
        );
        const table = node("table", undefined, result);
        node(
          "caption",
          L(
            "Regulă liniară · aceleași date pentru fiecare metodă",
            "Linear rule · identical input for each method",
          ),
          table,
        );
        const head = node("tr", undefined, node("thead", undefined, table));
        ["n", "DP", "Memo", "Brute"].forEach(
          (t) => (node("th", t, head).scope = "col"),
        );
        const body = node("tbody", undefined, table);
        for (const n of [8, 12, 16]) {
          const a = seededValues("benchmark", n, 0, 20),
            row = node("tr", undefined, body);
          node("th", String(n), row).scope = "row";
          for (const fn of [maxCandy, maxCandyMemo, maxCandyBruteForce]) {
            fn(a);
            const times = Array.from({ length: 5 }, () => {
              const t = performance.now();
              fn(a);
              return performance.now() - t;
            }).sort((a, b) => a - b);
            node("td", times[2].toFixed(3), row);
          }
        }
      },
    );
  }
  function progress() {
    observationJournal();
    node("h2", L("Progresul tău", "Your progress"), host);
    const p = profile(),
      report = weeklyAdventure(p);
    node(
      "p",
      `${report.attempts} ${L("încercări în ultimele șapte zile", "attempts in the last seven days")} · ${report.wins}/${report.goal} ${L("optime fără ajutor", "unassisted optimal")}`,
      host,
    );
    const goal = field(
      host,
      L("Obiectiv personal pe șapte zile", "Personal seven-day goal"),
      "adv-goal",
      p.goal,
      "number",
      1,
      30,
    );
    goal.onchange = () => {
      const n = Number(goal.value);
      if (Number.isInteger(n) && n >= 1 && n <= 30) {
        p.goal = n;
        store();
        status(
          L(
            "Obiectiv salvat. Pauzele nu scad puncte.",
            "Goal saved. Breaks do not deduct points.",
          ),
        );
      }
    };
    const table = node("table", undefined, host);
    node("caption", L("Evoluție pe reguli", "Progress by rule"), table);
    const head = node("tr", undefined, node("thead", undefined, table));
    [
      L("Regulă", "Rule"),
      L("Încercări", "Attempts"),
      L("Optime fără ajutor", "Unassisted optimal"),
    ].forEach((t) => (node("th", t, head).scope = "col"));
    const body = node("tbody", undefined, table);
    report.modes.forEach((m) => {
      const row = node("tr", undefined, body);
      node("th", labels()[m.mode], row).scope = "row";
      node("td", String(m.attempts), row);
      node("td", String(m.wins), row);
    });
    action(
      host,
      L("Recomandare: ", "Recommendation: ") + labels()[report.recommendation],
      () => {
        profile().tournament = null;
        startAdventure(
          presetAdventure(report.recommendation, localDay()),
          L("Exercițiu recomandat", "Recommended practice"),
        );
      },
    );
    const history = details(
        host,
        L(
          "Toate încercările, inclusiv greșelile",
          "All attempts, including mistakes",
        ),
        "adv-attempt-history",
      ),
      list = node("ol", undefined, history);
    p.records
      .slice()
      .reverse()
      .forEach((r) =>
        node(
          "li",
          `${r.day} · ${labels()[r.mode]} · ${r.score}/${r.best ?? "—"} · ${r.valid ? L("validă", "valid") : r.issue} · ${r.assisted ? L("cu ajutor", "assisted") : L("fără ajutor", "unassisted")}`,
          list,
        ),
      );
    action(host, L("Export CSV", "Export CSV"), () => {
      const cell = (v) =>
        '"' +
        (/^[=+\-@]/.test(String(v)) ? "'" : "") +
        String(v).replaceAll('"', '""') +
        '"';
      const lines = [
        ["day", "mode", "score", "best", "valid", "assisted", "issue"],
        ...p.records.map((r) => [
          r.day,
          r.mode,
          r.score,
          r.best ?? "",
          r.valid,
          r.assisted,
          r.issue,
        ]),
      ];
      exportFile(
        "candy-route-progress.csv",
        lines.map((row) => row.map(cell).join(",")).join("\r\n"),
        "text/csv;charset=utf-8",
      );
    });
    action(host, L("Raport săptămânal", "Weekly report"), () => {
      const text = `Candy Route · ${localDay()}\n${report.attempts} ${L("încercări", "attempts")} · ${report.wins}/${report.goal} ${L("optime", "optimal")}\n${report.modes.map((m) => `${labels()[m.mode]}: ${m.wins}/${m.attempts}`).join("\n")}\n${L("Următorul exercițiu sugerat: ", "Suggested next practice: ")}${labels()[report.recommendation]}`;
      const box = node("pre", text, host);
      box.tabIndex = 0;
      action(host, L("Descarcă raportul", "Download report"), () =>
        exportFile("candy-route-weekly.txt", text, "text/plain"),
      );
    });
  }
  function observationJournal() {
    const journal = details(
      host,
      L(
        "Jurnal de observații · înainte / după",
        "Observation journal · before / after",
      ),
      "adv-observations",
    );
    const fields = {};
    for (const [key, label] of [
      ["observation", L("Observație reală", "Actual observation")],
      ["before", L("Înainte", "Before")],
      ["after", L("După", "After")],
      ["evidence", L("Dovadă sau link", "Evidence or link")],
    ]) {
      const l = node("label", label, journal),
        area = node("textarea", undefined, l);
      area.id = "adv-note-" + key;
      area.maxLength = 500;
      area.rows = 2;
      fields[key] = area;
    }
    action(journal, L("Salvează observația", "Save observation"), () => {
      if (!fields.observation.value.trim() || profile().notes.length >= 50) {
        status(
          L(
            "Completează observația; maximum 50 de înregistrări.",
            "Enter an observation; up to 50 entries.",
          ),
        );
        return;
      }
      profile().notes.push({
        day: localDay(),
        ...Object.fromEntries(
          Object.entries(fields).map(([key, el]) => [key, el.value]),
        ),
      });
      store();
      status(L("Observație salvată.", "Observation saved."));
    });
    action(
      journal,
      L(
        "Export observații pentru studiul de caz",
        "Export case-study observations",
      ),
      () =>
        exportFile(
          "candy-route-observations.txt",
          profile()
            .notes.map(
              (n) =>
                `${n.day}\n${n.observation}\n${L("Înainte", "Before")}: ${n.before}\n${L("După", "After")}: ${n.after}\n${L("Dovadă", "Evidence")}: ${n.evidence}`,
            )
            .join("\n\n"),
          "text/plain",
        ),
    );
    node(
      "p",
      L(
        "Notează numai experiențe observate. Testele automate și feedbackul uman sunt dovezi diferite.",
        "Record only observed experiences. Automated tests and human feedback are different evidence.",
      ),
      journal,
    );
  }
  function settings() {
    node("h2", L("Confort și salvări", "Comfort and saves"), host);
    const fields = node("div", undefined, host, "adv-fields");
    for (const [key, label] of [
      ["text", L("Mod exclusiv textual", "Text-only mode")],
      [
        "orientation",
        L("Sunete de orientare opționale", "Optional orientation sounds"),
      ],
      ["character", L("Animația personajului", "Character animation")],
      ["decor", L("Decor animat", "Animated scenery")],
      ["transitions", L("Tranziții", "Transitions")],
      ["effects", L("Efecte", "Effects")],
      ["night", L("Scenă de noapte", "Night scene")],
    ])
      action(
        fields,
        label,
        () => {
          data.prefs[key] = !data.prefs[key];
          store();
          render();
        },
        { "aria-pressed": String(data.prefs[key]) },
      );
    for (const [key, label] of [
      ["scale", L("Mărime text (%)", "Text size (%)")],
      ["house", L("Mărime case (%)", "House size (%)")],
    ]) {
      const f = field(
        fields,
        label,
        "adv-pref-" + key,
        data.prefs[key],
        "range",
        80,
        160,
      );
      f.oninput = () => {
        data.prefs[key] = Number(f.value);
        applyPreferences();
        store();
      };
    }
    const weather = select(
      fields,
      L("Vreme opțională", "Optional weather"),
      "adv-weather",
      [
        ["none", L("Fără", "None")],
        ["rain", L("Ploaie", "Rain")],
        ["snow", L("Ninsoare", "Snow")],
        ["leaves", L("Frunze", "Leaves")],
        ["fog", L("Ceață", "Fog")],
      ],
      data.prefs.weather,
    );
    weather.onchange = () => {
      data.prefs.weather = weather.value;
      applyPreferences();
      store();
    };
    node(
      "p",
      L(
        "Săgeți: deplasare între case. Enter/Space: alegere. Home/End: prima/ultima casă. ? afișează ajutorul; U = Undo; N = stradă nouă. Scurtăturile nu se aplică în câmpuri.",
        "Arrows: move between houses. Enter/Space: select. Home/End: first/last house. ? shows help; U = Undo; N = new street. Shortcuts do not apply inside fields.",
      ),
      host,
    );
    action(
      host,
      L("Interfața clasică completă", "Full classic interface"),
      () => {
        legacy = true;
        const url = new URL(location.href);
        url.searchParams.set("view", "classic");
        history.replaceState(null, "", url.pathname + url.search);
        render();
      },
    );
    const backups = details(
      host,
      L(
        "Backup complet v4 · previzualizare înainte de import",
        "Full v4 backup · preview before import",
      ),
      "adv-full-backup",
    );
    backups.open = true;
    action(backups, L("Export toate datele v4", "Export all v4 data"), () =>
      exportFile("candy-route-full-v4.json", {
        version: 4,
        type: "candy-route-full",
        core: bridge.state(),
        studio: bridge.studio.snapshot(),
        adventure: data,
      }),
    );
    action(
      backups,
      L("Export salvare brută Aventură", "Export raw Adventure save"),
      () => {
        let raw = "";
        try {
          raw = localStorage.getItem(ADVENTURE_KEY) ?? "";
        } catch {}
        exportFile("candy-route-adventure-recovery.json", { raw });
      },
    );
    const input = field(
      backups,
      L("Previzualizează un backup v4", "Preview a v4 backup"),
      "adv-full-file",
      "",
      "file",
    );
    input.accept = ".json";
    input.onchange = async () => {
      try {
        const f = input.files[0];
        if (!f || f.size > 5000000) throw Error();
        const raw = JSON.parse(await f.text());
        if (raw.type !== "candy-route-full" || raw.version !== 4) throw Error();
        const candidate = {
          core: validateState(raw.core),
          studio: validateStudio(raw.studio, validateState),
          adventure: validateAdventure(raw.adventure),
        };
        preview = candidate;
        render();
        status(
          L(
            "Backup valid. Datele nu au fost încă înlocuite.",
            "Valid backup. Data has not yet been replaced.",
          ),
        );
      } catch {
        preview = null;
        status(
          L(
            "Backup invalid; toate datele existente au fost păstrate.",
            "Invalid backup; all existing data preserved.",
          ),
        );
      }
      input.value = "";
    };
    if (preview) {
      const summary = node("div", undefined, backups, "adv-preview");
      node("h3", L("Conținutul backupului", "Backup contents"), summary);
      node(
        "p",
        preview.studio.profiles
          .map(
            (p) =>
              `${p.name}: ${Object.keys(p.core?.progress ?? {}).length} ${L("niveluri", "levels")}, ${p.collection.length} ${L("puzzle-uri", "puzzles")}`,
          )
          .join(" · "),
        summary,
      );
      node(
        "p",
        L("Încercări Aventură: ", "Adventure attempts: ") +
          Object.values(preview.adventure.profiles).reduce(
            (sum, p) => sum + p.records.length,
            0,
          ),
        summary,
      );
      action(
        summary,
        L("Aplică backupul previzualizat", "Apply previewed backup"),
        () => {
          const dialog = node("dialog", undefined, host);
          dialog.setAttribute("aria-labelledby", "adv-confirm-title");
          node(
            "h3",
            L("Înlocuiești datele actuale?", "Replace current data?"),
            dialog,
          ).id = "adv-confirm-title";
          node(
            "p",
            L(
              "Profilurile, campaniile și setările vor fi înlocuite cu backupul previzualizat. Exportă mai întâi dacă vrei să le păstrezi.",
              "Profiles, campaigns and preferences will be replaced by the previewed backup. Export first if you want to keep them.",
            ),
            dialog,
          );
          action(dialog, L("Anulează", "Cancel"), () => dialog.close());
          action(dialog, L("Înlocuiește", "Replace"), () => {
            restoring = true;
            try {
              const next = preview;
              data = next.adventure;
              blockedSave = false;
              bridge.studio.restoreSnapshot(next.studio);
              bridge.restoreCore(next.core);
              preview = null;
              solved = null;
              online = null;
              store();
            } finally {
              restoring = false;
            }
            dialog.close();
            render();
            status(L("Backup aplicat.", "Backup applied."));
          });
          dialog.showModal();
          dialog.querySelector("button").focus();
          dialog.addEventListener("close", () => dialog.remove());
        },
      );
    }
    const update = details(
      host,
      L("Instalare și actualizări", "Installation and updates"),
      "adv-updates",
    );
    const updateState = node(
      "p",
      L(
        "Jocul offline se pregătește după prima încărcare completă.",
        "Offline play is prepared after the first complete load.",
      ),
      update,
    );
    if (pendingInstall)
      action(update, L("Instalează jocul", "Install game"), async () => {
        await pendingInstall.prompt();
        pendingInstall = null;
      });
    if (navigator.serviceWorker)
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (!reg) return;
        const show = () => {
          if (reg.waiting)
            updateState.textContent = L(
              "O versiune nouă este pregătită. Închide toate ferestrele jocului și redeschide pentru activare. Progresul local se păstrează.",
              "A new version is ready. Close all game windows and reopen to activate it. Local progress is preserved.",
            );
          else
            updateState.textContent = L(
              "Versiunea offline este pregătită sau se descarcă.",
              "The offline version is ready or downloading.",
            );
        };
        show();
        reg.addEventListener("updatefound", () =>
          reg.installing?.addEventListener("statechange", show),
        );
      });
    node(
      "p",
      L(
        "Telefonul fizic, cititorul de ecran real și editorul CodePen necesită verificări separate.",
        "Physical-phone, real screen-reader and CodePen editor checks require separate verification.",
      ),
      host,
    );
  }
  async function arenaRequest(path, body, base = data.server) {
    const url = new URL(base);
    if (
      url.protocol !== "https:" &&
      !(
        url.protocol === "http:" &&
        ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
      )
    )
      throw Error(
        L("Folosește HTTPS sau localhost.", "Use HTTPS or localhost."),
      );
    url.pathname = url.pathname.replace(/\/$/, "") + path;
    url.search = "";
    url.hash = "";
    const response = await fetch(url, {
      method: body ? "POST" : "GET",
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined,
      credentials: "omit",
      referrerPolicy: "no-referrer",
      signal: AbortSignal.timeout(7000),
    });
    const result = await response.json();
    if (!response.ok) throw Error(result.error ?? "Arena error");
    return result;
  }
  function renderArenaBoard(target) {
    target.replaceChildren();
    if (!online?.state) return;
    const room = online.state,
      p = adventurePuzzle(room.puzzle);
    node("h3", L("Camera ", "Room ") + online.room, target);
    node(
      "p",
      room.players.map((p) => p.name + (p.submitted ? " ✓" : " …")).join(" · "),
      target,
    );
    node("p", instructions(p), target);
    const grid = node("div", undefined, target, "adv-visual-street");
    p.base.values.forEach((v, i) => {
      const b = action(
        grid,
        `#${i}: ${v}${online.picks.includes(i) ? " ✓" : ""}`,
        () => {
          online.picks = online.picks.includes(i)
            ? online.picks.filter((x) => x !== i)
            : [...online.picks, i];
          saveArenaSession();
          renderArenaBoard(target);
        },
        { "aria-pressed": String(online.picks.includes(i)) },
      );
      b.disabled =
        room.players.find((x) => x.id === online.player)?.submitted ?? false;
    });
    action(
      target,
      L("Trimite ruta serverului", "Submit route to server"),
      async () => {
        try {
          online.state = await arenaRequest(
            "/submit",
            { room: online.room, token: online.token, picks: online.picks },
            online.url,
          );
          renderArenaBoard(target);
        } catch (e) {
          status(String(e.message));
        }
      },
    ).disabled =
      room.players.find((x) => x.id === online.player)?.submitted ?? false;
    if (room.results) {
      const list = node("ol", undefined, target);
      room.results.forEach((r) =>
        node("li", `${r.name}: ${r.score} / ${r.best}`, list),
      );
      node(
        "p",
        L(
          "Rezultate calculate de server; numele nu reprezintă identități verificate.",
          "Scores computed by the server; names are not verified identities.",
        ),
        target,
      );
    }
  }
  function saveArenaSession() {
    try {
      const { url, room, token, player, picks } = online;
      sessionStorage.setItem(
        "laurai-candy-arena-session",
        JSON.stringify({ url, room, token, player, picks }),
      );
    } catch {}
  }
  try {
    const raw = JSON.parse(
      sessionStorage.getItem("laurai-candy-arena-session"),
    );
    if (
      raw &&
      typeof raw.url === "string" &&
      raw.url.length <= 300 &&
      /^[a-f0-9]{8}$/.test(raw.room) &&
      /^[a-f0-9]{48}$/.test(raw.token) &&
      ["p1", "p2"].includes(raw.player) &&
      Array.isArray(raw.picks) &&
      raw.picks.length <= 16 &&
      raw.picks.every((i) => Number.isInteger(i) && i >= 0 && i < 16)
    )
      online = { ...raw, state: null, active: false };
  } catch {}
  function arena() {
    node("h2", L("Multiplayer online", "Online multiplayer"), host);
    node(
      "p",
      L(
        "Necesită un server Arena activ. Conexiunea pornește numai când apeși Creează sau Intră. Progresul local rămâne separat.",
        "Requires an active Arena server. Connection starts only when you press Create or Join. Local progress stays separate.",
      ),
      host,
    );
    const fields = node("div", undefined, host, "adv-fields"),
      server = field(
        fields,
        L("Adresa serverului Arena", "Arena server address"),
        "adv-server",
        data.server,
        "url",
      ),
      name = field(
        fields,
        L("Nume afișat", "Display name"),
        "adv-online-name",
        "Player",
        "text",
      ),
      code = field(
        fields,
        L("Cod cameră", "Room code"),
        "adv-room-code",
        "",
        "text",
      );
    name.maxLength = 30;
    code.maxLength = 20;
    const target = node("div", undefined, host);
    target.id = "adv-online-board";
    async function connect(join) {
      try {
        data.server = server.value.trim();
        store();
        const result = await arenaRequest(
          join ? "/join" : "/rooms",
          join
            ? { room: code.value.trim(), name: name.value }
            : { name: name.value },
        );
        online = {
          url: data.server,
          room: result.room,
          token: result.token,
          player: result.player,
          picks: [],
          state: result.state,
          active: true,
        };
        saveArenaSession();
        renderArenaBoard(target);
        clearInterval(onlineTimer);
        onlineTimer = setInterval(pollArena, 1500);
      } catch (e) {
        status(L("Conexiune nereușită: ", "Connection failed: ") + e.message);
      }
    }
    action(host, L("Creează cameră", "Create room"), () => connect(false));
    action(host, L("Intră în cameră", "Join room"), () => connect(true));
    action(
      host,
      L("Clasament verificat de server", "Server-verified standings"),
      async () => {
        try {
          const list = await arenaRequest(
              "/leaderboard",
              undefined,
              server.value.trim(),
            ),
            table = node("ol", undefined, target);
          list.results.forEach((r) =>
            node("li", `${r.name}: ${r.score}/${r.best}`, table),
          );
        } catch (e) {
          status(e.message);
        }
      },
    );
    if (online) {
      renderArenaBoard(target);
      action(host, L("Reia conexiunea", "Resume connection"), async () => {
        online.active = true;
        await pollArena();
        if (online.active) {
          clearInterval(onlineTimer);
          onlineTimer = setInterval(pollArena, 1500);
        }
      });
    }
  }
  async function pollArena() {
    if (!online?.active || data.screen !== "online" || document.hidden) {
      clearInterval(onlineTimer);
      return;
    }
    try {
      const next = await arenaRequest(
          "/poll",
          { room: online.room, token: online.token },
          online.url,
        ),
        changed = JSON.stringify(next) !== JSON.stringify(online.state);
      online.state = next;
      const target = host.querySelector("#adv-online-board");
      if (target && changed) renderArenaBoard(target);
    } catch (e) {
      clearInterval(onlineTimer);
      online.active = false;
      status(
        L(
          "Conexiunea s-a întrerupt. Reintră în cameră pentru a continua. ",
          "Connection interrupted. Rejoin the room to continue. ",
        ) + e.message,
      );
    }
  }
  function demo() {
    const panel = node("section", undefined, home, "adv-demo");
    node(
      "h3",
      L("De ce contează strategia?", "Why does strategy matter?"),
      panel,
    );
    node(
      "p",
      L(
        "Pentru [4,5,4], casa de 5 pare tentantă. Două case de 4 aduc însă 8.",
        "For [4,5,4], the house with 5 looks tempting. Two houses with 4 yield 8.",
      ),
      panel,
    );
    const stage = node("div", undefined, panel, "adv-demo-houses");
    [4, 5, 4].forEach((v, i) => node("span", `#${i} · ${v}`, stage));
    action(panel, L("Vezi demonstrația", "Watch demonstration"), () => {
      clearInterval(animation);
      let step = 0;
      const lines = [
        L(
          "Greedy alege casa din mijloc: 5.",
          "Greedy takes the middle house: 5.",
        ),
        L("Aceasta blochează ambele vecine.", "That blocks both neighbors."),
        L(
          "Alege prima și ultima casă: 4 + 4.",
          "Choose the first and last: 4 + 4.",
        ),
        L(
          "Rezultat optim: 8. Acum încearcă tu.",
          "Optimal result: 8. Now try it yourself.",
        ),
      ];
      const message = node("p", "", panel);
      message.setAttribute("role", "status");
      const advance = () => {
        message.textContent = lines[step];
        [...stage.children].forEach((el, i) =>
          el.classList.toggle("selected", step < 2 ? i === 1 : i !== 1),
        );
        step++;
        if (step === lines.length) clearInterval(animation);
      };
      advance();
      if (
        bridge.state().still ||
        matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        message.textContent = lines.join(" ");
      else animation = setInterval(advance, 1500);
    });
  }
  let lastLanguage = "",
    lastIdentity = id(),
    lastCompletion = "";
  function render() {
    if (!session()?.checked) clearInterval(animation);
    const homeButton = document.getElementById("adv-home-button");
    if (homeButton)
      homeButton.textContent = L("Acasă · Candy Route", "Home · Candy Route");
    if (data.screen !== "online") clearInterval(onlineTimer);
    const focus = document.activeElement?.dataset.advHouse;
    applyPreferences();
    renderHome();
    demo();
    renderMenu();
    host.replaceChildren();
    host.setAttribute(
      "aria-label",
      L("Candy Route · Aventură", "Candy Route · Adventure"),
    );
    if (error) status(error);
    if (!legacy) {
      switch (data.screen) {
        case "campaign":
          map();
          break;
        case "studio":
          builder();
          break;
        case "adventure":
          adventure();
          break;
        case "learn":
          learn();
          break;
        case "progress":
          progress();
          break;
        case "settings":
          settings();
          break;
        case "online":
          arena();
          break;
      }
    }
    visibility();
    welcomeHint();
    if (focus !== undefined)
      host.querySelector(`[data-adv-house="${focus}"]`)?.focus();
    lastLanguage = bridge.state().lang;
    lastIdentity = id();
  }
  function refresh() {
    if (restoring) return;
    const language = bridge.state().lang,
      identity = id();
    if (language !== lastLanguage || identity !== lastIdentity) {
      solved = null;
      otherPicks = [];
      render();
    }
    visibility();
    welcomeHint();
    const a = bridge.state().attempt,
      key = JSON.stringify({
        level: a.level,
        mode: a.mode,
        picked: a.picked,
        credited: a.credited,
      });
    if (
      !a.credited ||
      a.kind !== "campaign" ||
      a.picked.reduce((sum, i) => sum + a.street[i], 0) !==
        bestRoute(a.street, a.mode === "circle").total
    ) {
      document.querySelector("#adv-core-summary")?.remove();
      lastCompletion = "";
    } else if (key !== lastCompletion) {
      lastCompletion = key;
      const old = document.querySelector("#adv-core-summary");
      old?.remove();
      const box = document.createElement("section");
      box.id = "adv-core-summary";
      box.className = "adv-result";
      node("h3", L("Nivel încheiat", "Level complete"), box);
      const record = bridge.state().progress[a.level];
      node(
        "p",
        `${L("Scor", "Score")}: ${a.picked.reduce((sum, i) => sum + a.street[i], 0)} · ${record?.stars ?? 0} ★`,
        box,
      );
      document.querySelector(".stage").append(box);
    }
  }
  const back = action(
    main.querySelector("header"),
    L("Acasă · Candy Route", "Home · Candy Route"),
    () => navigate("home"),
  );
  back.id = "adv-home-button";
  const atmosphere = document.createElement("div");
  atmosphere.className = "adv-atmosphere";
  atmosphere.setAttribute("aria-hidden", "true");
  document.querySelector(".stage").prepend(atmosphere);
  const orientation = document.createElement("p");
  orientation.id = "adv-orientation-status";
  orientation.setAttribute("role", "status");
  document.querySelector("#street-wrap").after(orientation);
  document.addEventListener("keydown", (event) => {
    if (
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.target.closest("input,select,textarea")
    )
      return;
    const house = event.target.closest(
      ".house,.studio-street button,.adv-house",
    );
    if (
      house &&
      [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ].includes(event.key)
    ) {
      const siblings = [
          ...house.parentElement.querySelectorAll("button:not(:disabled)"),
        ],
        i = siblings.indexOf(house),
        next =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? siblings.length - 1
              : (i +
                  (["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 1) +
                  siblings.length) %
                siblings.length;
      event.preventDefault();
      siblings[next]?.focus();
      return;
    }
    if (event.key === "?") {
      event.preventDefault();
      navigate("settings");
    }
    if (
      (data.screen === "play" || legacy) &&
      event.key.toLowerCase() === "u" &&
      !document.querySelector("#undo").disabled
    )
      document.querySelector("#undo").click();
    if (
      event.key.toLowerCase() === "n" &&
      !document.querySelector("#new-street").disabled &&
      data.screen === "play"
    )
      document.querySelector("#new-street").click();
  });
  let orientationAudio;
  document.addEventListener("focusin", (event) => {
    const house = event.target.closest(
      ".house,.studio-street button,.adv-house",
    );
    if (!house) return;
    const selected = house.getAttribute("aria-pressed") === "true";
    house.title = house.getAttribute("aria-label") ?? "";
    const a = bridge.state().attempt,
      index = Number(house.dataset.index),
      neighbors = Number.isInteger(index)
        ? [index - 1, index + 1].filter((i) => i >= 0 && i < a.street.length)
        : [];
    const feedback = document.querySelector("#adv-orientation-status");
    if (feedback)
      feedback.textContent =
        (house.getAttribute("aria-label") ?? "") +
        (selected && neighbors.length
          ? L(" · Blochează casele ", " · Blocks houses ") +
            neighbors.map((i) => "#" + i).join(", ")
          : "");
    if (!data.prefs.orientation) return;
    try {
      orientationAudio ??= new (window.AudioContext ||
        window.webkitAudioContext)();
      const o = orientationAudio.createOscillator(),
        g = orientationAudio.createGain();
      o.frequency.value = selected
        ? 800
        : house.getAttribute("aria-disabled") === "true"
          ? 180
          : 440;
      g.gain.value = 0.015;
      o.connect(g).connect(orientationAudio.destination);
      o.start();
      o.stop(orientationAudio.currentTime + 0.06);
    } catch {}
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearInterval(animation);
      clearInterval(onlineTimer);
    } else if (data.screen === "online" && online?.active) {
      pollArena();
      onlineTimer = setInterval(pollArena, 1500);
    }
  });
  document
    .querySelector('a[href="#campaign"]')
    .addEventListener("click", (e) => {
      if (!legacy) {
        e.preventDefault();
        navigate("campaign");
      }
    });
  for (const link of document.querySelectorAll('a[href="#studio"]'))
    link.addEventListener("click", (e) => {
      if (!legacy) {
        e.preventDefault();
        navigate("studio");
      }
    });
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    pendingInstall = e;
  });
  function sharedNavigation(hash) {
    if (hash.startsWith("#street=")) {
      data.screen = "play";
      store();
      render();
      const message = bridge.notice?.();
      if (message) {
        document.getElementById("adv-share-status")?.remove();
        const p = node("p", message, document.querySelector(".stage"));
        p.id = "adv-share-status";
        p.setAttribute("role", "status");
      }
    } else if (hash.startsWith("#studio=")) {
      legacy = true;
      render();
      document.querySelector("#studio").scrollIntoView({ block: "start" });
    }
  }
  document.addEventListener(
    "click",
    () => document.getElementById("adv-share-status")?.remove(),
    { capture: true },
  );
  window.addEventListener("hashchange", (e) =>
    sharedNavigation(new URL(e.newURL).hash),
  );
  render();
  sharedNavigation(bridge.entryHash?.() ?? location.hash);
  return { refresh };
}
