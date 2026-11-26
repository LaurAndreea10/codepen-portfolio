/* Star Catch — jocul demo construit cu GameKit. Copiază-l și schimbă-l: e punctul de plecare pentru un game jam.
   Laura Andreea · MIT */
(() => {
  "use strict";
  const { createLoop, createInput, createI18n, createSave, createAudio, createHud, a11y, util } = window.GameKit;
  const W = 480, H = 320;
  const canvas = document.getElementById("gk-canvas");
  if (!canvas) return;
  const ctx = util.fitCanvas(canvas, W, H);

  const i18n = createI18n({
    ro: { title: "Star Catch", start: "Start", again: "Încă o dată", paused: "Pauză — apasă P", over: "Gata! Scor: {s}", best: "Record nou! {s}", caught: "Stea prinsă", hurt: "Fulger! Mai ai {n} vieți", score: "Scor", lives: "Vieți", time: "Timp", record: "Record", left: "Stânga", right: "Dreapta", pause: "Pauză", mute: "Sunet" },
    en: { title: "Star Catch", start: "Start", again: "Play again", paused: "Paused — press P", over: "Done! Score: {s}", best: "New record! {s}", caught: "Star caught", hurt: "Lightning! {n} lives left", score: "Score", lives: "Lives", time: "Time", record: "Best", left: "Left", right: "Right", pause: "Pause", mute: "Sound" }
  }, "pd-lang");
  const input = createInput();
  input.bindPointer(canvas);
  input.bindButtons(document.getElementById("gk-pad") || document);
  const save = createSave("star-catch", 1, { best: 0, plays: 0 });
  const audio = createAudio();
  const hud = createHud({ score: "#gk-score", lives: "#gk-lives", time: "#gk-time", best: "#gk-best" });
  const overlay = document.getElementById("gk-overlay"), startBtn = document.getElementById("gk-start"), msg = document.getElementById("gk-msg");

  let s;
  const reset = () => (s = { x: W / 2, score: 0, lives: 3, time: 45, items: [], spawn: 0, shake: 0, over: false, paused: false });
  reset();

  function update(dt) {
    if (input.wasPressed("pause") && !s.over) { s.paused = !s.paused; a11y.announce(s.paused ? i18n.t("paused") : ""); }
    if (s.paused || s.over) { input.endFrame(); return; }
    const sp = 260 * dt;
    if (input.isDown("left")) s.x -= sp;
    if (input.isDown("right")) s.x += sp;
    if (input.pointer.down) s.x += util.clamp(input.pointer.x - s.x, -sp * 1.5, sp * 1.5);
    s.x = util.clamp(s.x, 20, W - 20);
    s.time -= dt;
    s.spawn -= dt;
    if (s.spawn <= 0) {
      const bad = Math.random() < Math.min(.45, .18 + (45 - s.time) / 120);
      s.items.push({ x: util.rand(20, W - 20), y: -16, r: 12, v: util.rand(90, 150) + (45 - s.time) * 2.5, bad, rot: 0 });
      s.spawn = util.rand(.35, .7);
    }
    const player = { x: s.x, y: H - 34, r: 20 };
    s.items.forEach(it => {
      it.y += it.v * dt; it.rot += dt * 3;
      if (!it.dead && util.hit(it, player)) {
        it.dead = true;
        if (it.bad) { s.lives--; s.shake = a11y.reducedMotion ? 0 : .3; audio.hit(); a11y.announce(i18n.t("hurt", { n: s.lives })); }
        else { s.score += 10; audio.coin(); }
      }
    });
    s.items = s.items.filter(it => !it.dead && it.y < H + 20);
    s.shake = Math.max(0, s.shake - dt);
    if (s.lives <= 0 || s.time <= 0) end();
    input.endFrame();
  }

  function render() {
    const dark = document.documentElement.dataset.theme !== "light";
    ctx.save();
    if (s.shake) ctx.translate(util.rand(-4, 4), util.rand(-4, 4));
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, dark ? "#0b1530" : "#cfe9ff"); g.addColorStop(1, dark ? "#1b2c55" : "#fff4dc");
    ctx.fillStyle = g; ctx.fillRect(-10, -10, W + 20, H + 20);
    ctx.fillStyle = dark ? "#ffffff22" : "#0d1a2d14";
    for (let i = 0; i < 30; i++) ctx.fillRect((i * 97) % W, (i * 53) % (H - 60), 2, 2);
    ctx.fillStyle = dark ? "#132447" : "#bfe3b4"; ctx.fillRect(0, H - 14, W, 14);
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    s.items.forEach(it => {
      ctx.save(); ctx.translate(it.x, it.y); if (!a11y.reducedMotion) ctx.rotate(it.bad ? 0 : it.rot);
      ctx.font = "24px serif"; ctx.fillText(it.bad ? "⚡" : "⭐", 0, 0); ctx.restore();
    });
    ctx.font = "36px serif"; ctx.fillText("🐩", s.x, H - 36);
    if (s.paused) { ctx.fillStyle = "#000a"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#fff"; ctx.font = "700 22px Inter, sans-serif"; ctx.fillText(i18n.t("paused"), W / 2, H / 2); }
    ctx.restore();
    hud.set("score", s.score); hud.set("lives", "❤".repeat(Math.max(0, s.lives)) || "—"); hud.set("time", Math.ceil(Math.max(0, s.time)) + "s"); hud.set("best", save.data.best);
  }

  const loop = createLoop({ update, render });

  function start() {
    reset(); overlay.hidden = true; save.data.plays++; save.save();
    canvas.focus(); loop.start(); a11y.announce(i18n.t("title") + " — " + i18n.t("start"));
  }
  function end() {
    s.over = true; loop.stop(); render();
    const rec = s.score > save.data.best;
    if (rec) { save.data.best = s.score; save.save(); audio.win(); }
    msg.textContent = i18n.t(rec ? "best" : "over", { s: s.score });
    startBtn.textContent = i18n.t("again");
    overlay.hidden = false; startBtn.focus(); a11y.announce(msg.textContent);
  }
  startBtn.addEventListener("click", start);
  document.getElementById("gk-mute")?.addEventListener("click", e => { audio.muted = !audio.muted; e.currentTarget.setAttribute("aria-pressed", String(!audio.muted)); e.currentTarget.textContent = audio.muted ? "🔇" : "🔊"; });
  document.addEventListener("visibilitychange", () => { if (!document.hidden && loop.pausedByTab && !s.over && overlay.hidden) { loop.pausedByTab = false; s.paused = true; loop.start(); } });
  document.addEventListener("pd:lang", e => i18n.set(e.detail));
  document.addEventListener("pd:theme", render);
  i18n.apply();
  render();
})();
