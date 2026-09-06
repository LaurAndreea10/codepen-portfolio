(() => {
  const body = document.body;
  const theme = document.querySelector('[data-evidence-theme]');
  const contrast = document.querySelector('[data-evidence-contrast]');
  if (!theme || !contrast) return;
  if (localStorage.getItem('portfolio-theme') === 'light') body.classList.add('evidence-light');
  if (localStorage.getItem('portfolio-contrast') === 'high') body.classList.add('evidence-contrast');
  const sync = () => {
    const english = document.documentElement.lang === 'en';
    const light = body.classList.contains('evidence-light');
    const high = body.classList.contains('evidence-contrast');
    theme.textContent = english ? (light ? 'Dark theme' : 'Light theme') : (light ? 'Temă întunecată' : 'Temă luminoasă');
    contrast.textContent = english ? (high ? 'Standard contrast' : 'High contrast') : (high ? 'Contrast standard' : 'Contrast ridicat');
    theme.setAttribute('aria-pressed', String(light));
    contrast.setAttribute('aria-pressed', String(high));
  };
  theme.addEventListener('click', () => {
    body.classList.toggle('evidence-light');
    localStorage.setItem('portfolio-theme', body.classList.contains('evidence-light') ? 'light' : 'dark');
    sync();
  });
  contrast.addEventListener('click', () => {
    body.classList.toggle('evidence-contrast');
    localStorage.setItem('portfolio-contrast', body.classList.contains('evidence-contrast') ? 'high' : 'normal');
    sync();
  });
  sync();
})();
