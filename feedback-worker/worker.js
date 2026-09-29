// Grădina Curioasă — primește părerile din joc și le transformă în Issue-uri GitHub de moderat.
// Rulează gratuit pe Cloudflare Workers. Nimeni nu are nevoie de cont ca să scrie.
//
// Variabile în Cloudflare (Settings → Variables and Secrets):
//   GITHUB_TOKEN     (secret) token fine-grained, doar repo-ul codepen-portfolio, permisiunea Issues: Read and write
//   GITHUB_REPO      LaurAndreea10/codepen-portfolio
//   ALLOWED_ORIGINS  https://laurandreea10.github.io
//   RESEND_API_KEY   (secret, opțional) cheie Resend, ca să primești fiecare părere pe e-mail
//   NOTIFY_EMAIL     (opțional) adresa ta de e-mail, aceeași cu cea a contului Resend
//
// Un Issue nou primește etichetele „feedback” și „pending”. Portofoliul arată doar Issue-urile
// cu eticheta „approved”, pusă de tine după ce citești părerea.

const MAX_TEXT = 600;
const MAX_NAME = 60;
const ROLES = ['parent', 'teacher', 'developer', 'other'];
const LANGS = ['ro', 'en', 'hu', 'uk'];
const PROJECTS = ['curious-garden'];
const RATE = { windowMs: 10 * 60 * 1000, max: 3 };
const recent = new Map(); // IP → momente de trimitere (limită aproximativă, per instanță)

// Caractere invizibile sau de control (inclusiv separatoare de linie și marcaje de direcție), construite din coduri.
const INVISIBLE = new RegExp('[' + [[0, 31], [127, 127], [0x200b, 0x200f], [0x2028, 0x202e], [0x2066, 0x2069], [0xfeff, 0xfeff]]
  .map(([a, b]) => String.fromCharCode(a) + '-' + String.fromCharCode(b)).join('') + ']', 'g');
const APOSTROPHE = String.fromCharCode(0x2019);
const clean = (value, max) => String(value ?? '')
  .replace(INVISIBLE, ' ')
  .replace(/`/g, APOSTROPHE)
  .replace(/[ \t\n\r]+/g, ' ')
  .replace(/ +/g, ' ')
  .trim()
  .slice(0, max);

// Fără linkuri, e-mailuri sau numere de telefon: părerile pot veni de la părinți ai unor copii.
const hasContact = text => /https?:\/\/|www\.|\b[\w.+-]+@[\w-]+\.[\w.]+\b|(?:\+?\d[\s.-]?){8,}/i.test(text);

function json(data, status, headers) {
  return new Response(JSON.stringify(data), { status, headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8' } });
}

function tooMany(ip, now) {
  const list = (recent.get(ip) || []).filter(t => now - t < RATE.windowMs);
  if (list.length >= RATE.max) { recent.set(ip, list); return true; }
  list.push(now);
  recent.set(ip, list);
  return false;
}

export default {
  async fetch(request, env) {
    const allowed = String(env.ALLOWED_ORIGINS || 'https://laurandreea10.github.io').split(',').map(s => s.trim()).filter(Boolean);
    const origin = request.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin'
    };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return json({ error: 'method' }, 405, cors);
    if (!allowed.includes(origin)) return json({ error: 'origin' }, 403, cors);
    if (!env.GITHUB_TOKEN || !env.GITHUB_REPO) return json({ error: 'config' }, 500, cors);

    let data;
    try { data = await request.json(); } catch { return json({ error: 'invalid' }, 400, cors); }
    if (!data || typeof data !== 'object') return json({ error: 'invalid' }, 400, cors);

    // Capcană pentru roboți: câmpul ascuns trebuie să rămână gol. Răspundem „ok” fără să salvăm.
    if (data.website) return json({ ok: true }, 200, cors);
    if (!(Number(data.elapsed) >= 4000)) return json({ error: 'fast' }, 400, cors);
    if (data.consent !== true) return json({ error: 'consent' }, 400, cors);

    const text = clean(data.text, MAX_TEXT);
    const name = clean(data.name, MAX_NAME);
    if (text.length < 10) return json({ error: 'short' }, 400, cors);
    if (hasContact(text) || hasContact(name)) return json({ error: 'contact' }, 400, cors);

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (tooMany(ip, Date.now())) return json({ error: 'rate' }, 429, cors);

    const entry = {
      text,
      name,
      role: ROLES.includes(data.role) ? data.role : 'other',
      rating: Math.max(0, Math.min(5, parseInt(data.rating, 10) || 0)),
      lang: LANGS.includes(data.lang) ? data.lang : 'ro',
      project: PROJECTS.includes(data.project) ? data.project : 'curious-garden',
      date: new Date().toISOString().slice(0, 10)
    };
    const body = [
      '<!-- gradina-feedback v1 -->',
      'Părere nouă trimisă din zona pentru părinți a Grădinii Curioase.',
      '',
      'Ca s-o publici în portofoliu, adaugă eticheta `approved`. Poți corecta textul din blocul de mai jos înainte. Ca s-o ascunzi, scoate eticheta sau închide Issue-ul fără ea.',
      '',
      '```json',
      JSON.stringify(entry, null, 2),
      '```'
    ].join('\n');

    const response = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/issues`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'gradina-curioasa-feedback',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({ title: `Părere: ${text.slice(0, 50)}${text.length > 50 ? '…' : ''}`, body, labels: ['feedback', 'pending'] })
    });
    let issueUrl = '';
    if (response.ok) issueUrl = (await response.json().catch(() => ({}))).html_url || '';

    // E-mail de notificare (GitHub nu te anunță despre Issue-urile create chiar de contul tău).
    const mailed = await notify(env, entry, issueUrl);
    if (!response.ok && !mailed) return json({ error: 'upstream' }, 502, cors);
    return json({ ok: true }, 200, cors);
  }
};

const ROLE_RO = { parent: 'părinte', teacher: 'profesor', developer: 'dezvoltator', other: 'altceva' };
const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function notify(env, entry, issueUrl) {
  if (!env.RESEND_API_KEY || !env.NOTIFY_EMAIL) return false;
  const stars = entry.rating ? '★'.repeat(entry.rating) + '☆'.repeat(5 - entry.rating) : 'fără stele';
  const who = [entry.name || 'fără semnătură', ROLE_RO[entry.role]].join(', ');
  const next = issueUrl
    ? `Ca s-o publici în portofoliu, deschide Issue-ul și adaugă eticheta „approved”: ${issueUrl}`
    : 'Issue-ul nu a putut fi creat pe GitHub; părerea există doar în acest e-mail.';
  const text = [`„${entry.text}”`, '', `— ${who}`, `Stele: ${stars}`, `Limba: ${entry.lang} · ${entry.date}`, '', next].join('\n');
  const html = `<div style="font-family:system-ui,sans-serif;max-width:560px;line-height:1.55;color:#193147">`
    + `<p style="font-size:13px;color:#667">Părere nouă din Grădina Curioasă</p>`
    + `<blockquote style="margin:0;padding:12px 16px;border-left:4px solid #ffc978;background:#fffdf5;font-size:17px">${escapeHtml(entry.text)}</blockquote>`
    + `<p>— ${escapeHtml(who)}<br><span style="color:#c77d00;letter-spacing:2px">${stars}</span><br><span style="color:#667">Limba: ${escapeHtml(entry.lang)} · ${escapeHtml(entry.date)}</span></p>`
    + (issueUrl
      ? `<p><a href="${escapeHtml(issueUrl)}" style="display:inline-block;background:#193147;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Deschide Issue-ul</a></p><p style="font-size:13px;color:#667">Adaugă eticheta „approved” ca să apară în portofoliu. Fără ea, părerea rămâne nepublicată.</p>`
      : `<p style="color:#a4262c">Issue-ul nu a putut fi creat pe GitHub; părerea există doar în acest e-mail.</p>`)
    + `</div>`;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.NOTIFY_FROM || 'Grădina Curioasă <onboarding@resend.dev>',
        to: [env.NOTIFY_EMAIL],
        subject: `Părere nouă${entry.rating ? ` (${entry.rating}★)` : ''}: ${entry.text.slice(0, 60)}${entry.text.length > 60 ? '…' : ''}`,
        text,
        html
      })
    });
    return r.ok;
  } catch {
    return false;
  }
}
