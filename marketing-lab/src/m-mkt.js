/* ===== 01–05 Marketing-tech ===== */
(() => {
  const { L, T, esc, $, $$, register, store, copy, download, toast, fmt, uid, pageHead } = App;

  /* ---------- 01 UTM Builder & Campaign Tracker ---------- */
  let utmForm = { url: 'https://laurandreea10.github.io/codepen-portfolio/', source: 'newsletter', medium: 'email', campaign: 'lansare_noiembrie', term: '', content: 'buton_hero' };
  let utmLinks = store.get('utm', []);
  register({
    id: 'utm', n: 1, cat: 'mkt',
    title: { ro: 'UTM Builder & Campaign Tracker', en: 'UTM Builder & Campaign Tracker' },
    desc: { ro: 'Generezi linkuri UTM validate, le grupezi pe campanii și le exporți în CSV.', en: 'Generate validated UTM links, group them by campaign and export to CSV.' },
    shows: ['URL API', 'validare', 'localStorage', 'CSV export'],
    render(root) {
      const fields = [['url', L('URL destinație', 'Destination URL'), true], ['source', 'utm_source', true], ['medium', 'utm_medium', true], ['campaign', 'utm_campaign', true], ['term', 'utm_term', false], ['content', 'utm_content', false]];
      const build = () => {
        let u; try { u = new URL(utmForm.url); } catch (e) { return { err: L('URL invalid — trebuie să înceapă cu https://', 'Invalid URL — must start with https://') }; }
        for (const k of ['source', 'medium', 'campaign', 'term', 'content']) { const v = (utmForm[k] || '').trim(); if (v) u.searchParams.set('utm_' + k, v); else u.searchParams.delete('utm_' + k); }
        return { link: u.toString() };
      };
      const warnings = () => {
        const w = [];
        for (const k of ['source', 'medium', 'campaign', 'term', 'content']) {
          const v = utmForm[k] || '';
          if (/[A-Z]/.test(v)) w.push(`utm_${k}: ${L('conține majuscule — GA4 tratează „Email” și „email” ca surse diferite', 'has uppercase — GA4 treats “Email” and “email” as different')}`);
          if (/\s/.test(v)) w.push(`utm_${k}: ${L('conține spații — folosește _ sau -', 'has spaces — use _ or -')}`);
        }
        const std = ['email', 'cpc', 'social', 'organic', 'referral', 'display', 'affiliate', 'paid_social', 'sms', 'push'];
        if (utmForm.medium && !std.includes(utmForm.medium.toLowerCase())) w.push(L('utm_medium nestandard — GA4 poate să nu-l încadreze corect în Default Channel Group', 'non-standard utm_medium — GA4 may not map it to the Default Channel Group'));
        return w;
      };
      const draw = () => {
        const b = build(); const w = warnings();
        const camps = [...new Set(utmLinks.map(x => x.campaign))];
        root.innerHTML = pageHead(this) + `
        <div class="grid g2">
          <form class="card" id="utmF" novalidate>
            <h2>${L('Construiește linkul', 'Build the link')}</h2>
            ${fields.map(([k, lab, req]) => `<div class="field"><label for="u-${k}">${lab}${req ? ' *' : ''}</label><input id="u-${k}" name="${k}" value="${esc(utmForm[k])}" ${req ? 'required' : ''} list="${k === 'medium' ? 'mediums' : k === 'source' ? 'sources' : ''}"></div>`).join('')}
            <datalist id="mediums">${['email', 'cpc', 'social', 'paid_social', 'organic', 'referral', 'display', 'affiliate', 'sms'].map(x => `<option value="${x}">`).join('')}</datalist>
            <datalist id="sources">${['newsletter', 'facebook', 'instagram', 'linkedin', 'google', 'tiktok', 'codepen'].map(x => `<option value="${x}">`).join('')}</datalist>
            <button class="btn primary" type="submit">${L('Salvează în tracker', 'Save to tracker')}</button>
          </form>
          <div class="card stack">
            <h2>${L('Rezultat', 'Result')}</h2>
            ${b.err ? `<p class="bad" role="alert">${b.err}</p>` : `<pre style="white-space:pre-wrap;word-break:break-all" aria-live="polite">${esc(b.link)}</pre>
              <div class="row"><button class="btn" id="cpy">${L('Copiază linkul', 'Copy link')}</button><span class="hint">${b.link.length} ${L('caractere', 'characters')}</span></div>`}
            <div>${w.length ? w.map(x => `<div class="issue">⚠ ${esc(x)}</div>`).join('') : `<div class="issue pass">✓ ${L('Convenții respectate', 'Naming conventions OK')}</div>`}</div>
            <div class="grid g4"><div class="kpi"><div class="v">${utmLinks.length}</div><div class="l">${L('linkuri', 'links')}</div></div><div class="kpi"><div class="v">${camps.length}</div><div class="l">${L('campanii', 'campaigns')}</div></div></div>
          </div>
        </div>
        <section class="card" style="margin-top:16px">
          <div class="row" style="justify-content:space-between"><h2 style="margin:0">Tracker</h2>
            <div class="row"><button class="btn sm" id="csvCopy" ${utmLinks.length ? '' : 'disabled'}>${L('Copiază CSV', 'Copy CSV')}</button><button class="btn sm" id="csvDl" ${utmLinks.length ? '' : 'disabled'}>${L('Descarcă CSV', 'Download CSV')}</button></div></div>
          ${utmLinks.length ? camps.map(c => `<h3 style="margin-top:16px">${esc(c)}</h3><div class="tablewrap"><table><thead><tr><th>source / medium</th><th>content</th><th>link</th><th>${L('creat', 'created')}</th><th></th></tr></thead><tbody>
            ${utmLinks.filter(x => x.campaign === c).map(x => `<tr><td>${esc(x.source)} / ${esc(x.medium)}</td><td>${esc(x.content || '—')}</td><td class="mono" style="word-break:break-all;max-width:420px">${esc(x.link)}</td><td>${App.timeAgo(x.t)}</td><td class="row"><button class="btn sm" data-cp="${x.id}">${L('Copiază', 'Copy')}</button><button class="btn sm danger" data-del="${x.id}" aria-label="${L('Șterge', 'Delete')}">✕</button></td></tr>`).join('')}</tbody></table></div>`).join('') : `<p class="hint">${L('Niciun link salvat încă.', 'No saved links yet.')}</p>`}
        </section>`;
        const f = $('#utmF', root);
        f.addEventListener('input', e => { utmForm[e.target.name] = e.target.value; const id = e.target.id, pos = e.target.selectionStart; draw(); const n = $('#' + id, root); n.focus(); try { n.setSelectionRange(pos, pos); } catch (_) {} });
        f.addEventListener('submit', e => {
          e.preventDefault(); const r = build();
          if (r.err || !utmForm.source || !utmForm.medium || !utmForm.campaign) { toast(L('Completează câmpurile obligatorii', 'Fill in required fields')); return; }
          utmLinks.unshift({ id: uid(), t: Date.now(), ...utmForm, link: r.link }); store.set('utm', utmLinks); draw(); toast(L('Salvat', 'Saved'));
        });
        const c = $('#cpy', root); if (c) c.onclick = () => copy(b.link);
        $$('[data-cp]', root).forEach(x => x.onclick = () => copy(utmLinks.find(l => l.id === x.dataset.cp).link));
        $$('[data-del]', root).forEach(x => x.onclick = () => { utmLinks = utmLinks.filter(l => l.id !== x.dataset.del); store.set('utm', utmLinks); draw(); });
        const csv = () => 'campaign,source,medium,term,content,link,created\n' + utmLinks.map(x => [x.campaign, x.source, x.medium, x.term, x.content, x.link, new Date(x.t).toISOString()].map(v => `"${String(v || '').replace(/"/g, '""')}"`).join(',')).join('\n');
        $('#csvCopy', root).onclick = () => copy(csv());
        $('#csvDl', root).onclick = () => download('utm-links.csv', csv(), 'text/csv');
      };
      draw();
    }
  });

  /* ---------- 02 A/B testing calculator ---------- */
  // standard normal CDF (Abramowitz-Stegun) and inverse (Acklam)
  const ncdf = (z) => { const t = 1 / (1 + 0.2316419 * Math.abs(z)); const d = 0.3989423 * Math.exp(-z * z / 2); const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return z > 0 ? 1 - p : p; };
  const ninv = (p) => {
    const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
    const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
    const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
    const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
    const pl = 0.02425; let q, r;
    if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    if (p > 1 - pl) { q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    q = p - 0.5; r = q * q; return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  };
  let ab = { nA: 5000, cA: 400, nB: 5000, cB: 460, conf: 95, base: 8, mde: 10, power: 80, tails: 2 };
  register({
    id: 'ab-test', n: 2, cat: 'mkt',
    title: { ro: 'Calculator A/B testing', en: 'A/B testing calculator' },
    desc: { ro: 'Semnificație statistică (test z pe două proporții), intervale de încredere vizualizate și mărimea eșantionului necesară.', en: 'Statistical significance (two-proportion z-test), visualised confidence intervals and required sample size.' },
    shows: ['statistică', 'SVG', 'z-test', 'power analysis'],
    render(root) {
      const calc = () => {
        const pA = ab.cA / ab.nA, pB = ab.cB / ab.nB;
        const pool = (ab.cA + ab.cB) / (ab.nA + ab.nB);
        const se0 = Math.sqrt(pool * (1 - pool) * (1 / ab.nA + 1 / ab.nB));
        const z = se0 ? (pB - pA) / se0 : 0;
        const p = ab.tails === 2 ? 2 * (1 - ncdf(Math.abs(z))) : 1 - ncdf(z);
        const zc = ninv(1 - (1 - ab.conf / 100) / 2);
        const seA = Math.sqrt(pA * (1 - pA) / ab.nA), seB = Math.sqrt(pB * (1 - pB) / ab.nB);
        const seD = Math.sqrt(seA * seA + seB * seB);
        return { pA, pB, z, p, uplift: pA ? (pB - pA) / pA : 0, ciA: [pA - zc * seA, pA + zc * seA], ciB: [pB - zc * seB, pB + zc * seB], ciD: [pB - pA - zc * seD, pB - pA + zc * seD], sig: p < 1 - ab.conf / 100 };
      };
      const sampleSize = () => {
        const p1 = ab.base / 100, p2 = p1 * (1 + ab.mde / 100);
        const za = ninv(1 - (1 - ab.conf / 100) / (ab.tails === 2 ? 2 : 1)), zb = ninv(ab.power / 100);
        const pbar = (p1 + p2) / 2;
        return Math.ceil(Math.pow(za * Math.sqrt(2 * pbar * (1 - pbar)) + zb * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)), 2) / Math.pow(p2 - p1, 2));
      };
      const ciSvg = (r) => {
        const lo = Math.min(r.ciA[0], r.ciB[0]), hi = Math.max(r.ciA[1], r.ciB[1]); const pad = (hi - lo) * 0.25 || 0.01;
        const x0 = lo - pad, x1 = hi + pad, W = 560, X = v => 60 + (v - x0) / (x1 - x0) * (W - 80);
        const bar = (ci, p, y, col, lab) => `<line x1="${X(ci[0])}" x2="${X(ci[1])}" y1="${y}" y2="${y}" stroke="${col}" stroke-width="10" stroke-linecap="round" opacity=".45"/><circle cx="${X(p)}" cy="${y}" r="7" fill="${col}"/><text x="6" y="${y + 4}">${lab}</text><text x="${X(ci[1]) + 8}" y="${y + 4}">${(p * 100).toFixed(2)}%</text>`;
        const ticks = [0, 1, 2, 3, 4].map(i => x0 + (x1 - x0) * i / 4);
        return `<svg viewBox="0 0 ${W} 130" width="100%" role="img" aria-label="${L('Intervale de încredere pentru A și B', 'Confidence intervals for A and B')}">
          ${ticks.map(t => `<line x1="${X(t)}" x2="${X(t)}" y1="10" y2="100" stroke="var(--line)"/><text x="${X(t)}" y="120" text-anchor="middle">${(t * 100).toFixed(1)}%</text>`).join('')}
          ${bar(r.ciA, r.pA, 35, 'var(--muted)', 'A')}${bar(r.ciB, r.pB, 75, r.sig ? 'var(--green)' : 'var(--amber)', 'B')}</svg>`;
      };
      const draw = () => {
        const r = calc(), n = sampleSize();
        const num = (k, lab, step = 1) => `<div class="field"><label for="ab-${k}">${lab}</label><input type="number" min="0" step="${step}" id="ab-${k}" data-k="${k}" value="${ab[k]}"></div>`;
        const valid = ab.cA <= ab.nA && ab.cB <= ab.nB && ab.nA > 0 && ab.nB > 0;
        root.innerHTML = pageHead(this) + `
        <div class="grid g2">
          <div class="card"><h2>${L('Rezultatele testului', 'Test results')}</h2>
            <div class="grid g2" style="gap:12px">${num('nA', L('Vizitatori A', 'Visitors A'))}${num('cA', L('Conversii A', 'Conversions A'))}${num('nB', L('Vizitatori B', 'Visitors B'))}${num('cB', L('Conversii B', 'Conversions B'))}</div>
            <div class="row"><div class="field" style="flex:1"><label for="ab-conf">${L('Încredere', 'Confidence')}</label><select id="ab-conf" data-k="conf">${[90, 95, 99].map(v => `<option ${ab.conf === v ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
            <div class="field" style="flex:1"><label for="ab-tails">${L('Tip test', 'Test type')}</label><select id="ab-tails" data-k="tails"><option value="2" ${ab.tails === 2 ? 'selected' : ''}>${L('bilateral', 'two-tailed')}</option><option value="1" ${ab.tails === 1 ? 'selected' : ''}>${L('unilateral', 'one-tailed')}</option></select></div></div>
          </div>
          <div class="card" aria-live="polite">
            ${valid ? `<div class="grid g4" style="margin-bottom:12px">
              <div class="kpi"><div class="v">${(r.pA * 100).toFixed(2)}%</div><div class="l">CR A</div></div>
              <div class="kpi"><div class="v">${(r.pB * 100).toFixed(2)}%</div><div class="l">CR B</div></div>
              <div class="kpi"><div class="v ${r.uplift >= 0 ? 'ok' : 'bad'}">${r.uplift >= 0 ? '+' : ''}${(r.uplift * 100).toFixed(1)}%</div><div class="l">uplift</div></div>
              <div class="kpi"><div class="v">${r.p < 0.0001 ? '<0.0001' : r.p.toFixed(4)}</div><div class="l">p-value</div></div></div>
            <div class="issue ${r.sig ? 'pass' : ''}"><b>${r.sig ? L('Semnificativ statistic', 'Statistically significant') : L('Nesemnificativ încă', 'Not significant yet')}</b> ${L('la', 'at')} ${ab.conf}% · z = ${r.z.toFixed(3)} · ${L('diferență', 'difference')}: ${(r.ciD[0] * 100).toFixed(2)}pp … ${(r.ciD[1] * 100).toFixed(2)}pp</div>
            ${ciSvg(r)}
            <p class="hint">${r.sig ? L('Intervalul diferenței nu include 0 — B chiar diferă de A.', 'The difference interval excludes 0 — B really differs from A.') : L('Intervalul diferenței include 0 — nu poți declara un câștigător. Continuă testul.', 'The difference interval includes 0 — no winner yet. Keep the test running.')}</p>`
            : `<p class="bad" role="alert">${L('Conversiile nu pot depăși vizitatorii.', 'Conversions cannot exceed visitors.')}</p>`}
          </div>
        </div>
        <section class="card" style="margin-top:16px"><h2>${L('Înainte de test: mărimea eșantionului', 'Before the test: sample size')}</h2>
          <div class="grid g4">${num('base', L('Rată de bază (%)', 'Baseline rate (%)'), 0.1)}${num('mde', L('Efect minim detectabil (% relativ)', 'Minimum detectable effect (% relative)'), 1)}
          <div class="field"><label for="ab-power">${L('Putere statistică', 'Statistical power')}</label><select id="ab-power" data-k="power">${[80, 90].map(v => `<option ${ab.power === v ? 'selected' : ''}>${v}</option>`).join('')}</select></div></div>
          <div class="grid g4"><div class="kpi"><div class="v">${isFinite(n) ? fmt(n) : '—'}</div><div class="l">${L('per variantă', 'per variant')}</div></div><div class="kpi"><div class="v">${isFinite(n) ? fmt(n * 2) : '—'}</div><div class="l">total</div></div></div>
          <p class="hint">${L('Formula: test bilateral pe două proporții, cu α = 1 − încrederea. Oprește testul abia când ai atins acest număr — „peeking”-ul umflă rata de fals pozitive.', 'Formula: two-proportion test, α = 1 − confidence. Stop only once you reach this number — peeking inflates false positives.')}</p>
        </section>`;
        $$('[data-k]', root).forEach(i => i.addEventListener('change', () => { ab[i.dataset.k] = Number(i.value); const id = i.id; draw(); $('#' + id, root).focus(); }));
      };
      draw();
    }
  });

  /* ---------- 03 Email Template Builder ---------- */
  const BLOCKS = {
    header: { ro: 'Antet', en: 'Header', def: { text: 'Marketing Lab', bg: '#0a1424', color: '#4fd8eb' } },
    heading: { ro: 'Titlu', en: 'Heading', def: { text: 'Noutăți din noiembrie', color: '#0d1b2e', size: 26 } },
    text: { ro: 'Paragraf', en: 'Paragraph', def: { text: 'Am lansat 15 instrumente noi pentru marketing și date. Toate rulează în browser, gratuit.', color: '#33425a' } },
    button: { ro: 'Buton', en: 'Button', def: { text: 'Vezi proiectele', href: 'https://laurandreea10.github.io/codepen-portfolio/', bg: '#ffb547', color: '#2a1800' } },
    image: { ro: 'Imagine', en: 'Image', def: { src: '', alt: 'Banner', h: 160, bg: '#4fd8eb' } },
    cols: { ro: '2 coloane', en: '2 columns', def: { left: 'UTM Builder — linkuri curate.', right: 'A/B Calculator — decizii pe date.', color: '#33425a' } },
    divider: { ro: 'Separator', en: 'Divider', def: { color: '#d5deeb' } },
    footer: { ro: 'Subsol', en: 'Footer', def: { text: 'Primești acest email pentru că te-ai abonat. Dezabonare: {{unsubscribe_url}}', color: '#7a879b' } }
  };
  let emailBlocks = store.get('email', null) || ['header', 'heading', 'text', 'button', 'cols', 'divider', 'footer'].map(type => ({ id: uid(), type, ...BLOCKS[type].def }));
  let emailSel = null, emailBg = '#eef2f8', emailTab = 'preview';
  const blockHtml = (b) => {
    const td = (inner, style = '') => `<tr><td style="padding:16px 32px;${style}">${inner}</td></tr>`;
    const e = esc;
    switch (b.type) {
      case 'header': return `<tr><td style="background:${e(b.bg)};padding:22px 32px;font-family:Georgia,serif;font-size:22px;font-weight:bold;color:${e(b.color)}">${e(b.text)}</td></tr>`;
      case 'heading': return td(`<h1 style="margin:0;font-family:Georgia,serif;font-size:${Number(b.size) || 24}px;line-height:1.25;color:${e(b.color)}">${e(b.text)}</h1>`);
      case 'text': return td(`<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${e(b.color)}">${e(b.text)}</p>`);
      case 'button': return td(`<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${e(b.bg)}" style="border-radius:8px;background:${e(b.bg)}"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${e(b.href)}" style="height:44px;v-text-anchor:middle;width:220px" arcsize="18%" fillcolor="${e(b.bg)}" stroke="f"><center style="color:${e(b.color)};font-family:Arial;font-size:16px;font-weight:bold">${e(b.text)}</center></v:roundrect><![endif]--><!--[if !mso]><!--><a href="${e(b.href)}" style="display:inline-block;padding:12px 26px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:${e(b.color)};text-decoration:none;border-radius:8px">${e(b.text)}</a><!--<![endif]--></td></tr></table>`);
      case 'image': return `<tr><td style="padding:0">${b.src ? `<img src="${e(b.src)}" alt="${e(b.alt)}" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0">` : `<div role="img" aria-label="${e(b.alt)}" style="height:${Number(b.h) || 160}px;background:${e(b.bg)};font-family:Arial;color:#0a1424;font-size:14px;line-height:${Number(b.h) || 160}px;text-align:center">${e(b.alt)} · 600×${Number(b.h) || 160}</div>`}</td></tr>`;
      case 'cols': return `<tr><td style="padding:12px 24px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="col" width="50%" valign="top" style="padding:8px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:${e(b.color)}">${e(b.left)}</td><td class="col" width="50%" valign="top" style="padding:8px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:${e(b.color)}">${e(b.right)}</td></tr></table></td></tr>`;
      case 'divider': return `<tr><td style="padding:8px 32px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-top:1px solid ${e(b.color)};font-size:0;line-height:0">&nbsp;</td></tr></table></td></tr>`;
      case 'footer': return td(`<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:${e(b.color)}">${e(b.text)}</p>`, 'background:#f5f7fb;');
    }
    return '';
  };
  const emailDoc = () => `<!DOCTYPE html>
<html lang="ro" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting"><title>Email</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>@media (max-width:620px){.wrap{width:100%!important}.col{display:block!important;width:100%!important}}</style></head>
<body style="margin:0;padding:0;background:${esc(emailBg)}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${esc(emailBg)}"><tr><td align="center" style="padding:24px 8px">
<table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:10px;overflow:hidden">
${emailBlocks.map(blockHtml).join('\n')}
</table></td></tr></table></body></html>`;
  const lint = () => {
    const html = emailDoc(); const out = [];
    const kb = new Blob([html]).size / 1024;
    out.push([kb < 102, `${L('Mărime', 'Size')}: ${kb.toFixed(1)} KB ${kb < 102 ? L('(sub limita de tăiere Gmail, 102 KB)', '(below Gmail clipping, 102 KB)') : L('— Gmail va tăia mesajul', '— Gmail will clip it')}`]);
    out.push([!/<div(?![^>]*role="img")/.test(html.replace(/<style[\s\S]*?<\/style>/, '')), L('Layout doar cu tabele (Outlook folosește motorul Word)', 'Table-only layout (Outlook uses the Word engine)')]);
    out.push([emailBlocks.every(b => b.type !== 'image' || b.alt), L('Toate imaginile au alt text', 'All images have alt text')]);
    out.push([emailBlocks.some(b => b.type === 'footer' && /unsubscribe|dezabon/i.test(b.text)), L('Link de dezabonare prezent (GDPR / CAN-SPAM)', 'Unsubscribe link present (GDPR / CAN-SPAM)')]);
    out.push([emailBlocks.some(b => b.type === 'button'), L('Există un CTA clar', 'Clear CTA present')]);
    return out;
  };
  register({
    id: 'email-builder', n: 3, cat: 'mkt',
    title: { ro: 'Email Template Builder', en: 'Email Template Builder' },
    desc: { ro: 'Editor drag & drop care exportă HTML compatibil Outlook și Gmail: tabele, CSS inline, buton VML, coloane responsive.', en: 'Drag & drop editor exporting Outlook/Gmail-safe HTML: tables, inline CSS, VML button, responsive columns.' },
    shows: ['Drag & Drop API', 'HTML email', 'MSO/VML', 'iframe srcdoc'],
    render(root) {
      const save = () => store.set('email', emailBlocks);
      const draw = () => {
        const sel = emailBlocks.find(b => b.id === emailSel);
        const props = sel ? Object.keys(BLOCKS[sel.type].def) : [];
        const lab = { text: L('Text', 'Text'), color: L('Culoare text', 'Text colour'), bg: L('Fundal', 'Background'), size: L('Mărime (px)', 'Size (px)'), href: 'Link', src: L('URL imagine', 'Image URL'), alt: 'Alt text', h: L('Înălțime', 'Height'), left: L('Stânga', 'Left'), right: L('Dreapta', 'Right') };
        root.innerHTML = pageHead(this) + `
        <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr))">
          <div class="card palette"><h3>${L('Blocuri', 'Blocks')}</h3>
            ${Object.entries(BLOCKS).map(([k, v]) => `<button class="btn" draggable="true" data-add="${k}">＋ ${esc(T(v))}</button>`).join('')}
            <div class="field" style="margin-top:12px"><label for="ebg">${L('Fundal email', 'Email background')}</label><input type="color" id="ebg" value="${emailBg}"></div>
            <button class="btn sm danger" id="ereset">${L('Resetează', 'Reset')}</button>
          </div>
          <div class="card"><h3>${L('Structură', 'Structure')} <span class="hint">(${L('trage pentru a reordona; sau ↑ ↓', 'drag to reorder; or ↑ ↓')})</span></h3>
            <div id="eList" aria-label="${L('Blocuri email', 'Email blocks')}" style="min-height:120px">
              ${emailBlocks.map((b, i) => `<div class="blk ${b.id === emailSel ? 'sel' : ''}" draggable="true" data-id="${b.id}">
                <span class="mono hint">${i + 1}</span><button class="t btn ghost sm" style="justify-content:flex-start" data-sel="${b.id}" aria-pressed="${b.id === emailSel}">${esc(T(BLOCKS[b.type]))}: ${esc((b.text || b.left || b.alt || '').slice(0, 30))}</button>
                <button class="btn sm icon" data-up="${i}" aria-label="${L('Mută sus', 'Move up')}" ${i === 0 ? 'disabled' : ''}>↑</button>
                <button class="btn sm icon" data-down="${i}" aria-label="${L('Mută jos', 'Move down')}" ${i === emailBlocks.length - 1 ? 'disabled' : ''}>↓</button>
                <button class="btn sm icon danger" data-rm="${i}" aria-label="${L('Șterge blocul', 'Remove block')}">✕</button></div>`).join('')}
            </div>
            ${sel ? `<div style="margin-top:12px;border-top:1px solid var(--line);padding-top:12px"><h3>${L('Proprietăți', 'Properties')} · ${esc(T(BLOCKS[sel.type]))}</h3>
              ${props.map(p => `<div class="field"><label for="ep-${p}">${lab[p] || p}</label>${['color', 'bg'].includes(p) ? `<input type="color" id="ep-${p}" data-p="${p}" value="${esc(sel[p])}">` : ['text', 'left', 'right'].includes(p) ? `<textarea id="ep-${p}" data-p="${p}" style="min-height:70px;font-family:var(--f-body)">${esc(sel[p])}</textarea>` : `<input id="ep-${p}" data-p="${p}" value="${esc(sel[p])}">`}</div>`).join('')}</div>` : `<p class="hint">${L('Selectează un bloc pentru a-l edita.', 'Select a block to edit it.')}</p>`}
          </div>
          <div class="card span2" style="min-width:0">
            <div class="tabs" role="tablist">${[['preview', L('Previzualizare', 'Preview')], ['mobile', 'Mobile 375px'], ['code', 'HTML'], ['lint', L('Verificări', 'Checks')]].map(([k, v]) => `<button role="tab" aria-selected="${emailTab === k}" data-tab="${k}">${v}</button>`).join('')}</div>
            ${emailTab === 'code' ? `<pre>${esc(emailDoc())}</pre>` : emailTab === 'lint' ? lint().map(([ok, m]) => `<div class="issue ${ok ? 'pass' : 'err'}">${ok ? '✓' : '✕'} ${esc(m)}</div>`).join('') : `<div style="${emailTab === 'mobile' ? 'max-width:375px;margin:auto' : ''}"><iframe class="preview" title="${L('Previzualizare email', 'Email preview')}" sandbox="" id="eFrame"></iframe></div>`}
            <div class="row" style="margin-top:12px"><button class="btn primary" id="ecopy">${L('Copiază HTML', 'Copy HTML')}</button><button class="btn" id="edl">${L('Descarcă .html', 'Download .html')}</button></div>
          </div>
        </div>`;
        const fr = $('#eFrame', root); if (fr) fr.srcdoc = emailDoc();
        $$('[data-tab]', root).forEach(b => b.onclick = () => { emailTab = b.dataset.tab; draw(); });
        $$('[data-add]', root).forEach(b => {
          b.onclick = () => { const nb = { id: uid(), type: b.dataset.add, ...BLOCKS[b.dataset.add].def }; emailBlocks.push(nb); emailSel = nb.id; save(); draw(); };
          b.addEventListener('dragstart', e => e.dataTransfer.setData('text/add', b.dataset.add));
        });
        $$('[data-sel]', root).forEach(b => b.onclick = () => { emailSel = b.dataset.sel === emailSel ? null : b.dataset.sel; draw(); });
        const mv = (i, j) => { const [x] = emailBlocks.splice(i, 1); emailBlocks.splice(j, 0, x); save(); draw(); };
        $$('[data-up]', root).forEach(b => b.onclick = () => { const i = +b.dataset.up; mv(i, i - 1); $(`[data-down="${i - 1}"]`, root)?.focus(); });
        $$('[data-down]', root).forEach(b => b.onclick = () => { const i = +b.dataset.down; mv(i, i + 1); $(`[data-up="${i + 1}"]`, root)?.focus(); });
        $$('[data-rm]', root).forEach(b => b.onclick = () => { emailBlocks.splice(+b.dataset.rm, 1); save(); draw(); });
        // drag & drop reorder + add
        const list = $('#eList', root); let dragId = null;
        $$('.blk', list).forEach(el => {
          el.addEventListener('dragstart', e => { dragId = el.dataset.id; el.classList.add('dragging'); e.dataTransfer.setData('text/plain', dragId); });
          el.addEventListener('dragend', () => el.classList.remove('dragging'));
        });
        list.addEventListener('dragover', e => e.preventDefault());
        list.addEventListener('drop', e => {
          e.preventDefault();
          const after = $$('.blk', list).find(el => { const r = el.getBoundingClientRect(); return e.clientY < r.top + r.height / 2; });
          let idx = after ? emailBlocks.findIndex(b => b.id === after.dataset.id) : emailBlocks.length;
          const add = e.dataTransfer.getData('text/add');
          if (add) { emailBlocks.splice(idx, 0, { id: uid(), type: add, ...BLOCKS[add].def }); }
          else if (dragId) { const from = emailBlocks.findIndex(b => b.id === dragId); const [x] = emailBlocks.splice(from, 1); if (from < idx) idx--; emailBlocks.splice(idx, 0, x); }
          dragId = null; save(); draw();
        });
        $$('[data-p]', root).forEach(i => i.addEventListener('input', () => { sel[i.dataset.p] = i.value; save(); const f = $('#eFrame', root); if (f) f.srcdoc = emailDoc(); const btn = $(`[data-sel="${sel.id}"]`, root); if (btn) btn.textContent = T(BLOCKS[sel.type]) + ': ' + (sel.text || sel.left || sel.alt || '').slice(0, 30); }));
        $('#ebg', root).addEventListener('input', e => { emailBg = e.target.value; const f = $('#eFrame', root); if (f) f.srcdoc = emailDoc(); });
        $('#ereset', root).onclick = () => { emailBlocks = ['header', 'heading', 'text', 'button', 'cols', 'divider', 'footer'].map(type => ({ id: uid(), type, ...BLOCKS[type].def })); emailSel = null; save(); draw(); };
        $('#ecopy', root).onclick = () => copy(emailDoc());
        $('#edl', root).onclick = () => download('email-template.html', emailDoc(), 'text/html');
      };
      draw();
    }
  });

  /* ---------- 04 Customer Journey Mapper ---------- */
  const defJourney = () => ([
    { id: uid(), name: { ro: 'Descoperire', en: 'Awareness' }, touch: ['Reclamă Instagram', 'Articol pe blog'], pain: ['Nu înțelege ce face produsul'], emo: 0 },
    { id: uid(), name: { ro: 'Considerare', en: 'Consideration' }, touch: ['Pagina de prețuri', 'Recenzii'], pain: ['Prețuri greu de comparat'], emo: -1 },
    { id: uid(), name: { ro: 'Achiziție', en: 'Purchase' }, touch: ['Checkout', 'Email de confirmare'], pain: ['Formular prea lung'], emo: -2 },
    { id: uid(), name: { ro: 'Onboarding', en: 'Onboarding' }, touch: ['Email de bun venit', 'Tutorial in-app'], pain: [], emo: 1 },
    { id: uid(), name: { ro: 'Loialitate', en: 'Advocacy' }, touch: ['Program de recomandări', 'Newsletter'], pain: [], emo: 2 }
  ]);
  let journey = store.get('journey', null) || defJourney();
  let persona = store.get('persona', 'Ana, 32, manager de marketing într-un IMM');
  register({
    id: 'journey', n: 4, cat: 'mkt',
    title: { ro: 'Customer Journey Mapper', en: 'Customer Journey Mapper' },
    desc: { ro: 'Hartă vizuală a parcursului clientului: touchpoint-uri, curba emoțiilor și punctele de fricțiune pe fiecare etapă.', en: 'Visual customer journey: touchpoints, emotion curve and friction points per stage.' },
    shows: ['SVG path', 'editor inline', 'JSON import/export'],
    render(root) {
      const save = () => { store.set('journey', journey); store.set('persona', persona); };
      const curve = () => {
        const W = Math.max(600, journey.length * 180), H = 170, step = W / journey.length;
        const pts = journey.map((s, i) => [step * i + step / 2, 85 - s.emo * 32]);
        let d = `M${pts[0][0]},${pts[0][1]}`; for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], cx = (x0 + x1) / 2; d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`; }
        const face = e => ['😣', '🙁', '😐', '🙂', '😄'][e + 2];
        return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="min-width:${W}px" role="img" aria-label="${L('Curba emoțiilor clientului', 'Customer emotion curve')}">
          <line x1="0" x2="${W}" y1="85" y2="85" stroke="var(--line)" stroke-dasharray="4 4"/>
          <path d="${d}" fill="none" stroke="var(--cyan)" stroke-width="3"/>
          ${pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="16" fill="var(--panel)" stroke="${journey[i].emo < 0 ? 'var(--red)' : journey[i].emo > 0 ? 'var(--green)' : 'var(--amber)'}" stroke-width="2"/><text x="${x}" y="${y + 5}" text-anchor="middle" style="font-size:15px">${face(journey[i].emo)}</text>`).join('')}</svg>`;
      };
      const draw = () => {
        const worst = journey.reduce((a, s) => (s.emo < a.emo ? s : a), journey[0]);
        const pains = journey.reduce((n, s) => n + s.pain.length, 0);
        root.innerHTML = pageHead(this) + `
        <div class="card" style="margin-bottom:16px"><div class="field"><label for="persona">Persona</label><input id="persona" value="${esc(persona)}"></div>
          <div class="grid g4"><div class="kpi"><div class="v">${journey.length}</div><div class="l">${L('etape', 'stages')}</div></div><div class="kpi"><div class="v">${journey.reduce((n, s) => n + s.touch.length, 0)}</div><div class="l">touchpoints</div></div><div class="kpi"><div class="v bad">${pains}</div><div class="l">${L('fricțiuni', 'frictions')}</div></div><div class="kpi"><div class="v" style="font-size:1rem">${worst ? esc(T(worst.name)) : '—'}</div><div class="l">${L('cel mai slab moment', 'lowest moment')}</div></div></div></div>
        <div class="card" style="overflow-x:auto;margin-bottom:16px">${curve()}</div>
        <div class="journey">${journey.map((s, i) => `<article class="card stage" aria-label="${esc(T(s.name))}">
          <div class="row" style="justify-content:space-between"><input aria-label="${L('Numele etapei', 'Stage name')}" data-name="${i}" value="${esc(T(s.name))}" style="font-weight:600;width:auto;flex:1">
          <button class="btn sm icon danger" data-rmst="${i}" aria-label="${L('Șterge etapa', 'Delete stage')}">✕</button></div>
          <label for="emo${i}" style="margin-top:8px">${L('Emoție', 'Emotion')}: ${s.emo}</label><input type="range" id="emo${i}" min="-2" max="2" step="1" value="${s.emo}" data-emo="${i}">
          <h3 style="margin-top:8px">Touchpoints</h3><ul>${s.touch.map((t, j) => `<li>${esc(t)} <button class="btn sm ghost" data-rmt="${i}:${j}" aria-label="${L('Șterge', 'Remove')} ${esc(t)}">✕</button></li>`).join('')}</ul>
          <form data-addt="${i}" class="row"><input aria-label="${L('Touchpoint nou', 'New touchpoint')}" placeholder="+ touchpoint" style="flex:1"><button class="btn sm">＋</button></form>
          <h3 style="margin-top:8px" class="bad">${L('Fricțiuni', 'Friction')}</h3><ul>${s.pain.map((t, j) => `<li>${esc(t)} <button class="btn sm ghost" data-rmp="${i}:${j}" aria-label="${L('Șterge', 'Remove')} ${esc(t)}">✕</button></li>`).join('')}</ul>
          <form data-addp="${i}" class="row"><input aria-label="${L('Fricțiune nouă', 'New friction')}" placeholder="+ ${L('fricțiune', 'friction')}" style="flex:1"><button class="btn sm">＋</button></form>
        </article>`).join('')}</div>
        <div class="row" style="margin-top:16px"><button class="btn primary" id="addSt">＋ ${L('Etapă', 'Stage')}</button><button class="btn" id="jCopy">${L('Copiază JSON', 'Copy JSON')}</button><button class="btn" id="jDl">${L('Descarcă JSON', 'Download JSON')}</button>
          <label class="btn" style="margin:0;color:var(--text)">${L('Importă JSON', 'Import JSON')}<input type="file" accept=".json,application/json" id="jImp" class="sr-only"></label><button class="btn danger" id="jReset">${L('Resetează', 'Reset')}</button></div>`;
        $('#persona', root).addEventListener('change', e => { persona = e.target.value; save(); });
        $$('[data-name]', root).forEach(x => x.addEventListener('change', () => { journey[+x.dataset.name].name = { ro: x.value, en: x.value }; save(); draw(); }));
        $$('[data-emo]', root).forEach(x => x.addEventListener('change', () => { journey[+x.dataset.emo].emo = +x.value; save(); draw(); $('#' + x.id, root).focus(); }));
        $$('[data-rmst]', root).forEach(x => x.onclick = () => { journey.splice(+x.dataset.rmst, 1); save(); draw(); });
        $$('[data-rmt]', root).forEach(x => x.onclick = () => { const [i, j] = x.dataset.rmt.split(':'); journey[i].touch.splice(j, 1); save(); draw(); });
        $$('[data-rmp]', root).forEach(x => x.onclick = () => { const [i, j] = x.dataset.rmp.split(':'); journey[i].pain.splice(j, 1); save(); draw(); });
        $$('[data-addt],[data-addp]', root).forEach(f => f.addEventListener('submit', e => { e.preventDefault(); const v = f.querySelector('input').value.trim(); if (!v) return; const i = f.dataset.addt ?? f.dataset.addp; journey[i][f.dataset.addt != null ? 'touch' : 'pain'].push(v); save(); draw(); }));
        $('#addSt', root).onclick = () => { journey.push({ id: uid(), name: { ro: L('Etapă nouă', 'New stage'), en: 'New stage' }, touch: [], pain: [], emo: 0 }); save(); draw(); };
        const json = () => JSON.stringify({ persona, stages: journey }, null, 2);
        $('#jCopy', root).onclick = () => copy(json());
        $('#jDl', root).onclick = () => download('customer-journey.json', json(), 'application/json');
        $('#jReset', root).onclick = () => { journey = defJourney(); save(); draw(); };
        $('#jImp', root).addEventListener('change', async e => { try { const d = JSON.parse(await e.target.files[0].text()); if (!Array.isArray(d.stages)) throw 0; journey = d.stages.map(s => ({ id: uid(), name: typeof s.name === 'string' ? { ro: s.name, en: s.name } : s.name, touch: s.touch || [], pain: s.pain || [], emo: Math.max(-2, Math.min(2, +s.emo || 0)) })); persona = d.persona || persona; save(); draw(); toast(L('Importat', 'Imported')); } catch (_) { toast(L('Fișier JSON invalid', 'Invalid JSON file')); } });
      };
      draw();
    }
  });

  /* ---------- 05 Lead Scoring Simulator ---------- */
  const FIELDS = {
    industry: { ro: 'Industrie', en: 'Industry', type: 'cat', opts: ['SaaS', 'Retail', 'Educație', 'Sănătate', 'Producție'] },
    size: { ro: 'Angajați', en: 'Employees', type: 'num' },
    role: { ro: 'Rol', en: 'Role', type: 'cat', opts: ['CEO', 'Marketing', 'Vânzări', 'IT', 'Stagiar'] },
    visits: { ro: 'Vizite site (30z)', en: 'Site visits (30d)', type: 'num' },
    opens: { ro: 'Emailuri deschise', en: 'Emails opened', type: 'num' },
    demo: { ro: 'A cerut demo', en: 'Requested demo', type: 'bool' },
    pricing: { ro: 'A văzut prețurile', en: 'Viewed pricing', type: 'bool' }
  };
  const seeded = (s) => () => (s = (s * 16807) % 2147483647) / 2147483647;
  const genLeads = () => {
    const r = seeded(42); const names = ['Andrei Pop', 'Ioana Rusu', 'Mihai Stan', 'Elena Dinu', 'Radu Marin', 'Alina Toma', 'Vlad Ene', 'Bianca Ilie', 'Cristi Oprea', 'Diana Lazăr', 'Sorin Nistor', 'Maria Barbu', 'Paul Dobre', 'Irina Matei', 'George Neagu', 'Oana Popa'];
    const co = ['Nova', 'Pixel', 'Carpatica', 'Orbit', 'Fluxo', 'Zenit', 'Ardeal Soft', 'Moldova Data'];
    return names.map((n, i) => ({ id: i, name: n, company: co[Math.floor(r() * co.length)] + (i % 3 ? ' SRL' : ' SA'), industry: FIELDS.industry.opts[Math.floor(r() * 5)], size: Math.floor(5 + r() * 900), role: FIELDS.role.opts[Math.floor(r() * 5)], visits: Math.floor(r() * 25), opens: Math.floor(r() * 12), demo: r() > 0.7, pricing: r() > 0.5 }));
  };
  const leads = genLeads();
  let rules = store.get('rules', null) || [
    { id: uid(), field: 'industry', op: 'eq', val: 'SaaS', pts: 15 },
    { id: uid(), field: 'size', op: 'gte', val: 100, pts: 20 },
    { id: uid(), field: 'role', op: 'eq', val: 'CEO', pts: 15 },
    { id: uid(), field: 'role', op: 'eq', val: 'Stagiar', pts: -20 },
    { id: uid(), field: 'visits', op: 'gte', val: 10, pts: 15 },
    { id: uid(), field: 'demo', op: 'eq', val: true, pts: 30 },
    { id: uid(), field: 'pricing', op: 'eq', val: true, pts: 10 }
  ];
  let decay = store.get('decay', 0);
  const OPS = { eq: '=', neq: '≠', gte: '≥', lte: '≤' };
  const scoreLead = (l) => {
    let s = 0; const hits = [];
    for (const r of rules) {
      const v = l[r.field]; let ok = false; const rv = FIELDS[r.field].type === 'num' ? Number(r.val) : FIELDS[r.field].type === 'bool' ? (r.val === true || r.val === 'true') : r.val;
      if (r.op === 'eq') ok = v === rv; else if (r.op === 'neq') ok = v !== rv; else if (r.op === 'gte') ok = v >= rv; else if (r.op === 'lte') ok = v <= rv;
      if (ok) { s += Number(r.pts); hits.push(r); }
    }
    s = s * (1 - decay / 100);
    return { s: Math.round(s), hits };
  };
  const grade = s => s >= 70 ? ['A', 'green'] : s >= 45 ? ['B', 'cyan'] : s >= 20 ? ['C', 'amber'] : ['D', 'red'];
  register({
    id: 'lead-scoring', n: 5, cat: 'mkt',
    title: { ro: 'Lead Scoring Simulator', en: 'Lead Scoring Simulator' },
    desc: { ro: 'Definești reguli și ponderi; lead-urile se reclasifică instant în A/B/C/D, cu explicația fiecărui scor.', en: 'Define rules and weights; leads re-rank instantly into A/B/C/D with each score explained.' },
    shows: ['rule engine', 'state reactiv', 'explainability'],
    render(root) {
      const save = () => { store.set('rules', rules); store.set('decay', decay); };
      const draw = (focusId) => {
        const scored = leads.map(l => ({ ...l, ...scoreLead(l) })).sort((a, b) => b.s - a.s);
        const dist = { A: 0, B: 0, C: 0, D: 0 }; scored.forEach(l => dist[grade(l.s)[0]]++);
        root.innerHTML = pageHead(this) + `
        <div class="grid g2">
          <div class="card"><h2>${L('Reguli', 'Rules')}</h2>
            ${rules.map(r => { const F = FIELDS[r.field]; return `<div class="row" style="margin-bottom:8px;flex-wrap:nowrap">
              <select aria-label="${L('Câmp', 'Field')}" data-r="${r.id}" data-f="field" style="flex:1.4">${Object.entries(FIELDS).map(([k, v]) => `<option value="${k}" ${k === r.field ? 'selected' : ''}>${esc(T(v))}</option>`).join('')}</select>
              <select aria-label="${L('Operator', 'Operator')}" data-r="${r.id}" data-f="op" style="flex:.6">${Object.entries(OPS).filter(([k]) => F.type === 'num' || ['eq', 'neq'].includes(k)).map(([k, v]) => `<option value="${k}" ${k === r.op ? 'selected' : ''}>${v}</option>`).join('')}</select>
              ${F.type === 'cat' ? `<select aria-label="${L('Valoare', 'Value')}" data-r="${r.id}" data-f="val" style="flex:1">${F.opts.map(o => `<option ${o === r.val ? 'selected' : ''}>${o}</option>`).join('')}</select>` : F.type === 'bool' ? `<select aria-label="${L('Valoare', 'Value')}" data-r="${r.id}" data-f="val" style="flex:1"><option value="true" ${String(r.val) === 'true' ? 'selected' : ''}>${L('da', 'yes')}</option><option value="false" ${String(r.val) === 'false' ? 'selected' : ''}>${L('nu', 'no')}</option></select>` : `<input type="number" aria-label="${L('Valoare', 'Value')}" data-r="${r.id}" data-f="val" value="${esc(r.val)}" style="flex:1">`}
              <input type="number" aria-label="${L('Puncte', 'Points')}" data-r="${r.id}" data-f="pts" value="${r.pts}" style="flex:.7" title="${L('Puncte', 'Points')}">
              <button class="btn sm icon danger" data-rmr="${r.id}" aria-label="${L('Șterge regula', 'Delete rule')}">✕</button></div>`; }).join('')}
            <button class="btn" id="addRule">＋ ${L('Regulă', 'Rule')}</button>
            <div class="field" style="margin-top:14px"><label for="decay">${L('Degradare în timp (inactivitate)', 'Time decay (inactivity)')}: ${decay}%</label><input type="range" id="decay" min="0" max="60" value="${decay}"></div>
            <div class="grid g4">${Object.entries(dist).map(([g, n]) => `<div class="kpi"><div class="v ${grade(g === 'A' ? 80 : g === 'B' ? 50 : g === 'C' ? 25 : 0)[1] === 'green' ? 'ok' : ''}">${n}</div><div class="l">${L('Grad', 'Grade')} ${g}</div></div>`).join('')}</div>
            <p class="hint">A ≥ 70 · B ≥ 45 · C ≥ 20 · D &lt; 20. ${L('Lead-urile A merg direct la vânzări; D rămân în nurturing.', 'A leads go straight to sales; D stay in nurturing.')}</p>
          </div>
          <div class="card" style="min-width:0"><h2>${L('Clasament live', 'Live ranking')}</h2>
            <div class="tablewrap"><table><thead><tr><th>#</th><th>Lead</th><th>${L('Profil', 'Profile')}</th><th>Scor</th></tr></thead><tbody>
            ${scored.map((l, i) => { const [g, c] = grade(l.s); return `<tr><td class="mono">${i + 1}</td><td><b>${esc(l.name)}</b><br><span class="hint">${esc(l.company)}</span></td><td class="hint">${esc(l.role)} · ${esc(l.industry)} · ${l.size} ${L('ang.', 'emp.')}<br>${l.visits} ${L('vizite', 'visits')} · ${l.opens} opens${l.demo ? ' · demo' : ''}${l.pricing ? ' · pricing' : ''}</td>
              <td><span class="badge ${c}">${g} · ${l.s}</span><details><summary class="hint" style="cursor:pointer">${L('de ce?', 'why?')}</summary><ul style="padding-left:16px;margin:4px 0;font-size:.78rem">${l.hits.map(h => `<li>${esc(T(FIELDS[h.field]))} ${OPS[h.op]} ${esc(String(h.val))}: ${h.pts > 0 ? '+' : ''}${h.pts}</li>`).join('') || '<li>—</li>'}</ul></details></td></tr>`; }).join('')}</tbody></table></div>
          </div>
        </div>`;
        $$('[data-r]', root).forEach(i => i.addEventListener('change', () => {
          const r = rules.find(x => x.id === i.dataset.r); r[i.dataset.f] = i.dataset.f === 'pts' ? Number(i.value) : i.value;
          if (i.dataset.f === 'field') { const F = FIELDS[r.field]; r.op = 'eq'; r.val = F.type === 'cat' ? F.opts[0] : F.type === 'bool' ? true : 0; }
          save(); draw({ r: i.dataset.r, f: i.dataset.f });
        }));
        $$('[data-rmr]', root).forEach(b => b.onclick = () => { rules = rules.filter(r => r.id !== b.dataset.rmr); save(); draw(); });
        $('#addRule', root).onclick = () => { rules.push({ id: uid(), field: 'opens', op: 'gte', val: 5, pts: 10 }); save(); draw(); };
        $('#decay', root).addEventListener('change', e => { decay = +e.target.value; save(); draw('decay'); });
        if (focusId) { const el = focusId === 'decay' ? $('#decay', root) : $(`[data-r="${focusId.r}"][data-f="${focusId.f}"]`, root); if (el) el.focus(); }
      };
      draw();
    }
  });
})();
