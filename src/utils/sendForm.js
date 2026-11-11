import { CONTACT, FORM_ACCESS_KEY } from '@/data/site';

/* Sends a form submission to the artist's inbox via Web3Forms (https://web3forms.com).
   The access key is tied to CONTACT.email and is safe to ship in the browser.
   `fields` is a flat { label: value } object that becomes the body of the email;
   replies to the email go straight to `email`. Throws on failure. */
export async function sendForm({ subject, name, email, fields, botcheck }) {
  if (!FORM_ACCESS_KEY) throw new Error('not-configured');

  const body = {
    access_key: FORM_ACCESS_KEY,
    subject,
    from_name: 'KALA website',
    replyto: email,
    botcheck: botcheck ? true : '',
    Name: name,
    Email: email,
    ...Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined && v !== '')),
  };

  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) throw new Error(data.message || `send-failed-${res.status}`);
  return data;
}

export const SEND_ERROR = `Sorry, your message couldn’t be sent just now. Please try again in a moment, or write to ${CONTACT.email}.`;
