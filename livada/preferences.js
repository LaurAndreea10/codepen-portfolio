/* Shared display preferences for the landing page and game. */
(() => {
  const key = 'livada-display';
  let prefs = { theme: matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark', contrast: matchMedia('(prefers-contrast: more)').matches, motion: matchMedia('(prefers-reduced-motion: reduce)').matches };
  let savedDisplay = false;
  try { const raw = localStorage.getItem(key); savedDisplay = !!raw; prefs = { ...prefs, ...JSON.parse(raw || '{}') }; } catch {}
  if (!savedDisplay) for (const name of ['contrast', 'motion']) { const control = document.getElementById(`set-${name}`); if (control) prefs[name] = control.checked; }
  if (matchMedia('(forced-colors: active)').matches) prefs.contrast = true;
  const host = document.querySelector('.bar, .menu-bar');
  if (!host) return;
  const tools = document.createElement('div'); tools.className = 'display-preferences';
  for (const name of ['theme', 'contrast', 'motion']) {
    const button = document.createElement('button'); button.type = 'button'; button.id = `display-${name}`;
    button.addEventListener('click', () => { prefs[name] = name === 'theme' ? (prefs.theme === 'dark' ? 'light' : 'dark') : !prefs[name]; try { localStorage.setItem(key, JSON.stringify(prefs)); } catch {} apply(); });
    tools.append(button);
  }
  host.append(tools);
  document.addEventListener('change', e => {
    const name = e.target.id === 'set-motion' ? 'motion' : e.target.id === 'set-contrast' ? 'contrast' : null;
    if (!name) return;
    prefs[name] = e.target.checked;
    try { localStorage.setItem(key, JSON.stringify(prefs)); } catch {}
    apply();
  });
  function apply() {
    const en = document.documentElement.lang === 'en';
    document.body.classList.toggle('light', prefs.theme === 'light');
    document.body.classList.toggle('contrast', !!prefs.contrast);
    document.body.classList.toggle('reduced', !!prefs.motion);
    document.documentElement.dataset.displayTheme = prefs.theme;
    const labels = en ? ['Light theme', 'High contrast', 'Reduced motion'] : ['Temă deschisă', 'Contrast ridicat', 'Mișcare redusă'];
    tools.querySelectorAll('button').forEach((button, index) => {
      const name = ['theme', 'contrast', 'motion'][index];
      button.textContent = labels[index]; button.setAttribute('aria-pressed', String(name === 'theme' ? prefs.theme === 'light' : !!prefs[name]));
    });
    // The game uses its existing setting handlers, retaining saved progress and audio preferences.
    for (const name of ['contrast', 'motion']) {
      const control = document.getElementById(`set-${name}`);
      if (control && control.checked !== !!prefs[name]) { control.checked = !!prefs[name]; control.dispatchEvent(new Event('change')); }
    }
    window.dispatchEvent(new CustomEvent('livada-display', { detail: prefs }));
  }
  new MutationObserver(apply).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  apply();
})();
