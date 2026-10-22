// Netlify Function: приймає заявку з форми і надсилає її в Telegram.
// Секрети — лише у змінних середовища Netlify: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.
const hits = new Map(); // базовий rate-limit (в пам'яті інстансу; не гарантує глобальний ліміт)
const SERVICES = ['Instagram Audit', 'SMM & Content', 'Website Development'];
const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const clean = (v, max) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
const out = (statusCode, o) => ({ statusCode, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(o) });
const okContact = v => /^@?[A-Za-z][A-Za-z0-9_]{4,31}$/.test(v) || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ||
  (/^[+\d][\d\s().-]{5,}$/.test(v) && v.replace(/\D/g, '').length >= 7 && v.replace(/\D/g, '').length <= 15);

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return out(405, { ok: false, code: 'method' });
  const token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return out(500, { ok: false, code: 'not_configured' });

  const h = event.headers || {};
  if (!String(h['content-type'] || '').includes('application/json')) return out(415, { ok: false, code: 'invalid' });
  if ((event.body || '').length > 10000) return out(413, { ok: false, code: 'invalid' });

  const ip = h['x-nf-client-connection-ip'] || (h['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const now = Date.now(), recent = (hits.get(ip) || []).filter(t => now - t < 600000);
  if (recent.length >= 5) return out(429, { ok: false, code: 'rate' });
  hits.set(ip, [...recent, now]);
  if (hits.size > 500) for (const [k, v] of hits) if (!v.some(t => now - t < 600000)) hits.delete(k);

  let b; try { b = JSON.parse(event.body || '{}'); } catch { b = {}; }
  if (b.website) return out(200, { ok: true });                       // honeypot: тихо ігноруємо ботів
  if (!b.t || now - Number(b.t) < 3000) return out(400, { ok: false, code: 'fast' }); // надто швидко = бот

  const name = clean(b.name, 80), contact = clean(b.contact, 100), service = clean(b.service, 40);
  const budget = clean(b.budget, 100), deadline = clean(b.deadline, 100), message = clean(b.message, 2000);
  if (name.length < 2 || !okContact(contact) || !SERVICES.includes(service) || message.length < 10 ||
      (message.match(/https?:\/\//gi) || []).length > 3)
    return out(400, { ok: false, code: 'invalid' });

  const when = new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' });
  const text = ['📩 <b>Нова заявка із сайту ShmatkoDeal</b>', '',
    `<b>Ім'я:</b> ${esc(name)}`, `<b>Контакт:</b> ${esc(contact)}`, `<b>Послуга:</b> ${esc(service)}`,
    `<b>Бюджет:</b> ${esc(budget || '—')}`, `<b>Термін:</b> ${esc(deadline || '—')}`, '',
    '<b>Опис завдання:</b>', esc(message), '', `<i>${esc(when)} (Київ) · мова сайту: ${esc(clean(b.lang, 2))}</i>`].join('\n');
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: 'HTML', disable_web_page_preview: true })
    });
    const j = await r.json().catch(() => ({}));
    // Успіх — лише коли Telegram справді підтвердив прийняття повідомлення
    return r.ok && j.ok === true ? out(200, { ok: true }) : out(502, { ok: false, code: 'telegram' });
  } catch { return out(502, { ok: false, code: 'telegram' }); }
};
