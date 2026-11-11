import { CONTACT, FORM_ACCESS_KEY } from '@/data/site';

/* Sends a form submission to the artist's inbox via Web3Forms (https://web3forms.com).
   The access key is tied to CONTACT.email and is safe to ship in the browser.
   `fields` is a flat { label: value } object that becomes the body of the email;
   replies to the email go straight to `email`. Throws on failure (err.code says why).
   `keepalive` lets the request finish even if the visitor leaves the page. */
const TIMEOUT_MS = 20000;

const fail = (code, message) => Object.assign(new Error(message || code), { code });

export async function sendForm({ subject, name, email, fields, botcheck, keepalive = false }) {
  if (!FORM_ACCESS_KEY) throw fail('not-configured');

  const body = {
    access_key: FORM_ACCESS_KEY,
    subject: String(subject).slice(0, 250),
    from_name: 'KALA website',
    replyto: email,
    botcheck: botcheck ? true : '',
    Name: name,
    Email: email,
    ...Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined && v !== null && v !== '')),
  };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  let res;
  try {
    res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
      keepalive,
    });
  } catch (err) {
    throw fail(err.name === 'AbortError' ? 'timeout' : 'network');
  } finally {
    clearTimeout(timer);
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 429) throw fail('rate-limited', data.message);
  if (!res.ok || !data.success) throw fail('send-failed', data.message || `HTTP ${res.status}`);
  return data;
}

export const SEND_ERROR = `Sorry, your message couldn’t be sent just now. Please try again in a moment, or write to ${CONTACT.email}.`;

/* what to tell the visitor when sendForm throws */
export function sendErrorMessage(err) {
  switch (err?.code) {
    case 'not-configured':
      return `This form isn’t connected yet, so your message can’t be sent from here. Please write to me at ${CONTACT.email}.`;
    case 'network':
    case 'timeout':
      return `Your message couldn’t be sent: the connection dropped or timed out. Check your connection and try again, or write to ${CONTACT.email}.`;
    case 'rate-limited':
      return `Too many messages were sent in a short time. Please wait a minute and try again, or write to ${CONTACT.email}.`;
    default:
      return SEND_ERROR;
  }
}
