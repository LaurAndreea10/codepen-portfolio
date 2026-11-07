// Runs the shared analyser (seo-analyzer.js) inside the active tab and renders the report.
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const lang = navigator.language.startsWith('ro') ? 'ro' : 'en';

(async () => {
  const out = document.getElementById('out');
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !/^https?:/.test(tab.url || '')) { out.textContent = lang === 'ro' ? 'Deschide o pagină web (http/https).' : 'Open a web page (http/https).'; return; }
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['seo-analyzer.js'] });
    const [{ result: r }] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: l => seoAnalyze(document, l), args: [lang] });
    const s = document.getElementById('score');
    s.textContent = r.score + '/100';
    s.style.color = r.score >= 80 ? '#4ade80' : r.score >= 50 ? '#ffb547' : '#f87171';
    const groups = [...new Set(r.checks.map(c => c.group))];
    out.innerHTML = `<div class="serp"><div class="t">${esc(r.title.slice(0, 60))}</div><div class="d">${esc(r.desc.slice(0, 160))}</div></div>` +
      groups.map(g => `<h2>${esc(g)}</h2>` + r.checks.filter(c => c.group === g).map(c => `<div class="i ${c.level === 'pass' ? 'pass' : c.level === 'err' ? 'err' : ''}">${c.level === 'pass' ? '✓' : c.level === 'err' ? '✕' : '⚠'} ${esc(c.msg)}</div>`).join('')).join('');
  } catch (e) {
    out.textContent = (lang === 'ro' ? 'Pagina nu poate fi analizată: ' : 'Page cannot be analysed: ') + e.message;
  }
})();
