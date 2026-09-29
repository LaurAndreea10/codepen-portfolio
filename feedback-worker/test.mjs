// Teste pentru Worker-ul de păreri. Rulează cu: node feedback-worker/test.mjs
import worker from './worker.js';

const ORIGIN = 'https://laurandreea10.github.io';
const env = { GITHUB_TOKEN: 'test-token', GITHUB_REPO: 'LaurAndreea10/codepen-portfolio', ALLOWED_ORIGINS: ORIGIN };
let calls = [];
let upstreamOk = true, mailOk = true;
globalThis.fetch = async (url, init) => {
  calls.push({ url, init });
  if (String(url).startsWith('https://api.resend.com/')) return new Response('{"id":"mail-1"}', { status: mailOk ? 200 : 500 });
  return new Response(JSON.stringify({ html_url: 'https://github.com/LaurAndreea10/codepen-portfolio/issues/42' }), { status: upstreamOk ? 201 : 500 });
};

let failures = 0, n = 0, ip = 0;
function check(ok, msg) { n++; console.log(`${ok ? 'OK  ' : 'FAIL'} ${msg}`); if (!ok) failures++; }
const good = { text: 'Copilul meu a învățat ceasul jucându-se. Mulțumim!', name: 'Ana, mama lui R.', role: 'parent', rating: 5, lang: 'ro', project: 'curious-garden', consent: true, elapsed: 9000, website: '' };
function post(data, { origin = ORIGIN, sameIp = false, envOverride = env } = {}) {
  if (!sameIp) ip++;
  return worker.fetch(new Request('https://gradina-feedback.example.workers.dev/', {
    method: 'POST',
    headers: { Origin: origin, 'Content-Type': 'application/json', 'CF-Connecting-IP': `10.0.0.${sameIp ? 250 : ip}` },
    body: typeof data === 'string' ? data : JSON.stringify(data)
  }), envOverride);
}
const errorOf = async r => (await r.json()).error;

const pre = await worker.fetch(new Request('https://x/', { method: 'OPTIONS', headers: { Origin: ORIGIN } }), env);
check(pre.status === 204 && pre.headers.get('Access-Control-Allow-Origin') === ORIGIN, 'CORS preflight allowed for the portfolio');
check((await worker.fetch(new Request('https://x/', { method: 'GET', headers: { Origin: ORIGIN } }), env)).status === 405, 'GET is rejected');
check((await post(good, { origin: 'https://evil.example' })).status === 403, 'other websites cannot post');
calls = [];
const trap = await post({ ...good, website: 'spam.example' });
check(trap.status === 200 && calls.length === 0, 'honeypot: bots get “ok” but nothing is saved');
check(await errorOf(await post({ ...good, elapsed: 800 })) === 'fast', 'instant submissions are rejected');
check(await errorOf(await post({ ...good, consent: false })) === 'consent', 'publication consent is required');
check(await errorOf(await post({ ...good, text: 'super' })) === 'short', 'too-short text is rejected');
check(await errorOf(await post({ ...good, text: 'Vedeți aici https://spam.example acum' })) === 'contact', 'links are rejected');
check(await errorOf(await post({ ...good, text: 'Scrieți-mi la ana@example.com oricând' })) === 'contact', 'e-mail addresses are rejected');
check(await errorOf(await post({ ...good, text: 'Sunați-mă la 0722 123 456 vă rog' })) === 'contact', 'phone numbers are rejected');
check(await errorOf(await post('not json')) === 'invalid', 'invalid JSON is rejected');

calls = [];
const ok = await post({ ...good, text: good.text + ' ```cod```', role: 'hacker', rating: 99, lang: 'xx', project: '../etc' });
check(ok.status === 200 && calls.length === 1, 'a valid opinion creates exactly one GitHub issue');
const call = calls[0], sent = JSON.parse(call.init.body);
check(call.url === 'https://api.github.com/repos/LaurAndreea10/codepen-portfolio/issues', 'issue goes to the portfolio repo');
check(call.init.headers.Authorization === 'Bearer test-token', 'token only used server-side');
check(JSON.stringify(sent.labels) === '["feedback","pending"]', 'issue is labelled feedback + pending (not published)');
const block = /```json\s*([\s\S]*?)```/.exec(sent.body);
const entry = block && JSON.parse(block[1]);
check(!!entry && entry.text.includes('’’’cod’’’') && !entry.text.includes('`'), 'backticks cannot break out of the JSON block');
check(entry && entry.role === 'other' && entry.rating === 5 && entry.lang === 'ro' && entry.project === 'curious-garden', 'unknown values are normalised');
check(entry && /^\d{4}-\d{2}-\d{2}$/.test(entry.date) && !('elapsed' in entry) && !('consent' in entry), 'stored entry has only public fields');
check(sent.title.startsWith('Părere: Copilul meu'), 'issue title starts with the opinion');

const statuses = [];
for (let i = 0; i < 4; i++) statuses.push((await post(good, { sameIp: true })).status);
check(JSON.stringify(statuses) === '[200,200,200,429]', `rate limit: 3 per 10 minutes per visitor (${statuses})`);
upstreamOk = false;
check((await post(good)).status === 502, 'GitHub errors are reported, not hidden');
check((await worker.fetch(new Request('https://x/', { method: 'POST', headers: { Origin: ORIGIN }, body: '{}' }), { ALLOWED_ORIGINS: ORIGIN })).status === 500, 'missing configuration is reported');

// --- Notificare pe e-mail (Resend)
const mailEnv = { ...env, RESEND_API_KEY: 're_test', NOTIFY_EMAIL: 'laura@example.com' };
upstreamOk = true; mailOk = true; calls = [];
const withMail = await post({ ...good, text: 'Jocul e <b>minunat</b> & copilul râde mult.' }, { envOverride: mailEnv });
const mail = calls.find(c => String(c.url).startsWith('https://api.resend.com/'));
check(withMail.status === 200 && calls.length === 2 && !!mail, 'with e-mail configured: one issue + one e-mail');
const m = mail ? JSON.parse(mail.init.body) : {};
check(JSON.stringify(m.to) === '["laura@example.com"]' && mail?.init.headers.Authorization === 'Bearer re_test', 'e-mail goes only to the configured address, key stays server-side');
check((m.subject || '').startsWith('Părere nouă (5★): Jocul e') , 'subject shows stars and the start of the opinion');
check((m.html || '').includes('&lt;b&gt;minunat&lt;/b&gt; &amp;') && !(m.html || '').includes('<b>minunat'), 'opinion text is escaped in the e-mail HTML');
check((m.text || '').includes('issues/42') && (m.html || '').includes('issues/42'), 'e-mail links to the issue for approval');
calls = []; await post(good);
check(calls.length === 1 && !calls.some(c => String(c.url).includes('resend')), 'without e-mail configuration nothing is e-mailed');
mailOk = false; calls = [];
check((await post(good, { envOverride: mailEnv })).status === 200, 'an e-mail failure does not lose the opinion (issue still created)');
upstreamOk = false; mailOk = true; calls = [];
const onlyMail = await post(good, { envOverride: mailEnv });
const m2 = JSON.parse(calls.find(c => String(c.url).includes('resend'))?.init.body || '{}');
check(onlyMail.status === 200 && (m2.text || '').includes('doar în acest e-mail'), 'if GitHub fails, the opinion still arrives by e-mail');
mailOk = false;
check((await post(good, { envOverride: mailEnv })).status === 502, 'if both fail, the visitor is told it did not go through');

console.log(`\n${n - failures}/${n} checks passed`);
process.exit(failures ? 1 : 0);
