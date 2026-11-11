/* HTML for the customer's order confirmation email.
   Email-safe on purpose: table layout, inline styles, bgcolor attributes, web-safe fonts,
   one fluid 600px column (MSO ghost table for Outlook), a single media query that only
   tightens spacing on phones, and a bulletproof (table-cell) button with a VML version for Outlook.
   No flexbox/grid, no CSS variables, no background images, no external CSS.
   The logo is embedded (cid:kala-logo) so it shows without the site being reachable. */
import { LOGO } from './email-logo.js';

export { LOGO };

const SITE = process.env.SITE_URL || 'https://kala.anushkakishor.in';

/* the site's theme colours (src/styles/index.css) */
const C = {
  page: '#f6f2eb',
  surface: '#fffefa',
  mat: '#ece5d9',
  primary: '#22211f',
  onPrimary: '#fffefa',
  secondary: '#c9531f',
  sale: '#a8401a',
  soft: '#4a4741',
  muted: '#6b645a',
  divider: '#e5e0d8',
  warningWash: '#f6ebd6',
  warning: '#8a5a12',
};
const SERIF = "Georgia, 'Times New Roman', Times, serif";
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
const inr = (rupees) => `&#8377;&nbsp;${Number(rupees).toLocaleString('en-IN')}`;

function button(href, label) {
  return `
<table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;">
  <tr>
    <td align="center" bgcolor="${C.primary}" style="border-radius:6px;">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${href}" style="height:48px;v-text-anchor:middle;width:240px;" arcsize="12%" stroke="f" fillcolor="${C.primary}">
        <w:anchorlock/>
        <center style="color:${C.onPrimary};font-family:${SANS};font-size:15px;font-weight:bold;letter-spacing:1px;">${label}</center>
      </v:roundrect>
      <![endif]-->
      <!--[if !mso]><!-- -->
      <a href="${href}" target="_blank" class="btn" style="display:inline-block;padding:15px 34px;font-family:${SANS};font-size:15px;font-weight:bold;line-height:18px;letter-spacing:1px;color:${C.onPrimary};text-decoration:none;border-radius:6px;background-color:${C.primary};mso-hide:all;">${label}</a>
      <!--<![endif]-->
    </td>
  </tr>
</table>`;
}

const notice = (text) => `
<tr>
  <td class="px" style="padding:0 40px 24px 40px;">
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
      <tr>
        <td bgcolor="${C.warningWash}" style="padding:14px 16px;border-radius:6px;font-family:${SANS};font-size:14px;line-height:21px;color:${C.warning};">${text}</td>
      </tr>
    </table>
  </td>
</tr>`;

export function confirmationHtml({ order, track, lost = [], allLost = false }) {
  const c = order.customer;
  const first = esc(String(c.name || '').trim().split(/\s+/)[0] || 'there');
  const lostIds = new Set(lost.map((w) => w.id));
  const address = [c.address, c.city, c.state && c.pin ? `${c.state} ${c.pin}` : c.state || c.pin, c.country || 'India'].filter(Boolean).map(esc).join('<br>');
  const lostNames = esc(lost.map((w) => w.title).join(', '));
  const preheader = allLost ? `About your order ${order.id}` : `Thank you, ${first}. Your painting is reserved for you and will be on its way soon.`;

  const rows = order.works
    .map((w) => {
      const gone = lostIds.has(w.id);
      return `
      <tr>
        <td class="item" style="padding:14px 0;border-bottom:1px solid ${C.divider};font-family:${SERIF};font-size:17px;line-height:24px;color:${C.primary};${gone ? 'text-decoration:line-through;color:' + C.muted + ';' : ''}">${esc(w.title)}</td>
        <td align="right" style="padding:14px 0 14px 12px;border-bottom:1px solid ${C.divider};font-family:${SANS};font-size:15px;line-height:24px;color:${C.soft};white-space:nowrap;vertical-align:top;">${w.full > w.price ? `<span style="color:${C.muted};font-size:13px;text-decoration:line-through;">${inr(w.full)}</span>&nbsp;&nbsp;<b style="color:${C.sale};">${inr(w.price)}</b>` : inr(w.price)}</td>
      </tr>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${allLost ? 'About your KALA order' : 'Your KALA order is confirmed'}</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<style>table,td,h1,p,a{font-family:Georgia,'Times New Roman',serif !important;}</style>
<![endif]-->
<style>
  body { margin:0 !important; padding:0 !important; width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
  table, td { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
  img { border:0; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
  a[x-apple-data-detectors] { color:inherit !important; text-decoration:none !important; }
  u + #body a { color:inherit; text-decoration:none; }
  .btn:hover { background-color:#34322e !important; }
  @media only screen and (max-width:620px) {
    .shell { width:100% !important; }
    .outer { padding:12px 8px !important; }
    .px { padding-left:22px !important; padding-right:22px !important; }
    .hero { padding-top:28px !important; }
    .h1 { font-size:26px !important; line-height:32px !important; }
    .item { font-size:16px !important; }
    .btn { display:block !important; padding:15px 20px !important; }
  }
</style>
</head>
<body id="body" style="margin:0;padding:0;background-color:${C.page};">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${C.page};opacity:0;">${preheader}&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>

<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="${C.page}" style="background-color:${C.page};">
  <tr>
    <td class="outer" align="center" style="padding:32px 16px;">
      <!--[if mso]><table role="presentation" width="600" align="center" border="0" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
      <table role="presentation" class="shell" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">

        <!-- logo -->
        <tr>
          <td align="center" style="padding:8px 0 24px 0;">
            <a href="${SITE}" target="_blank" style="text-decoration:none;">
              <img src="cid:kala-logo" width="${Math.round(LOGO.width / 2)}" height="${Math.round(LOGO.height / 2)}" alt="KALA" style="display:block;width:${Math.round(LOGO.width / 2)}px;max-width:60%;height:auto;margin:0 auto;font-family:${SERIF};font-size:28px;letter-spacing:10px;color:${C.primary};">
            </a>
          </td>
        </tr>

        <!-- card -->
        <tr>
          <td bgcolor="${C.surface}" style="background-color:${C.surface};border-radius:10px;border:1px solid ${C.divider};">
            <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">

              <tr>
                <td class="px hero" style="padding:40px 40px 8px 40px;font-family:${SANS};font-size:12px;line-height:16px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${C.secondary};">
                  ${allLost ? 'About your order' : 'Order confirmed'}
                </td>
              </tr>
              <tr>
                <td class="px" style="padding:0 40px 16px 40px;">
                  <h1 class="h1" style="margin:0;font-family:${SERIF};font-size:32px;line-height:40px;font-weight:normal;color:${C.primary};">
                    ${allLost ? `I’m sorry, ${first}` : `Thank you, ${first}`}
                  </h1>
                </td>
              </tr>
              <tr>
                <td class="px" style="padding:0 40px 28px 40px;font-family:${SANS};font-size:16px;line-height:25px;color:${C.soft};">
                  ${
                    allLost
                      ? `Your payment for order <strong style="color:${C.primary};">${esc(order.id)}</strong> came through moments after ${lostNames} went to another buyer. I’ll refund you in full and write to you shortly.`
                      : `Your payment is received and order <strong style="color:${C.primary};white-space:nowrap;">${esc(order.id)}</strong> is confirmed. I’ll pack your painting with care and send it soon. You’ll get courier tracking by SMS and email once it ships.`
                  }
                </td>
              </tr>

              ${lost.length && !allLost ? notice(`I’m sorry: <strong>${lostNames}</strong> went to another buyer moments before your payment came through. I’ll refund that part in full and write to you shortly.`) : ''}

              <!-- items -->
              <tr>
                <td class="px" style="padding:0 40px;">
                  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td colspan="2" style="padding:0 0 4px 0;border-bottom:1px solid ${C.primary};font-family:${SANS};font-size:12px;line-height:16px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${C.muted};">Your order</td>
                    </tr>
                    ${rows}
                    <tr>
                      <td style="padding:16px 0 0 0;font-family:${SANS};font-size:14px;line-height:20px;color:${C.muted};">Shipping</td>
                      <td align="right" style="padding:16px 0 0 12px;font-family:${SANS};font-size:14px;line-height:20px;color:${C.muted};white-space:nowrap;">Free</td>
                    </tr>
                    <tr>
                      <td style="padding:8px 0 0 0;font-family:${SANS};font-size:16px;line-height:24px;font-weight:bold;color:${C.primary};">Total paid</td>
                      <td align="right" style="padding:8px 0 0 12px;font-family:${SERIF};font-size:20px;line-height:24px;color:${C.primary};white-space:nowrap;">${inr(order.amount / 100)}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- shipping address -->
              <tr>
                <td class="px" style="padding:28px 40px 0 40px;">
                  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td bgcolor="${C.mat}" style="background-color:${C.mat};border-radius:6px;padding:18px 20px;">
                        <p style="margin:0 0 6px 0;font-family:${SANS};font-size:12px;line-height:16px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:${C.muted};">Shipping to</p>
                        <p style="margin:0;font-family:${SANS};font-size:15px;line-height:23px;color:${C.soft};"><strong style="color:${C.primary};">${esc(c.name)}</strong><br>${address}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- button -->
              <tr>
                <td class="px" align="center" style="padding:32px 40px 12px 40px;">
                  ${button(track, 'Track your order')}
                </td>
              </tr>
              <tr>
                <td class="px" align="center" style="padding:0 40px 36px 40px;font-family:${SANS};font-size:13px;line-height:20px;color:${C.muted};">
                  Order reference <strong style="color:${C.soft};">${esc(order.id)}</strong>
                </td>
              </tr>

              <!-- sign-off -->
              <tr>
                <td class="px" style="padding:24px 40px 36px 40px;border-top:1px solid ${C.divider};font-family:${SANS};font-size:15px;line-height:24px;color:${C.soft};">
                  Questions about your order? Just reply to this email.<br><br>
                  <span style="font-family:${SERIF};font-size:18px;color:${C.primary};">Anushka</span><br>
                  <span style="font-size:13px;color:${C.muted};">KALA · paintings, mandalas &amp; murals</span>
                </td>
              </tr>

            </table>
          </td>
        </tr>

        <!-- footer -->
        <tr>
          <td align="center" style="padding:24px 16px 8px 16px;font-family:${SANS};font-size:12px;line-height:18px;color:${C.muted};">
            <a href="${SITE}" target="_blank" style="color:${C.muted};text-decoration:underline;">kala.anushkakishor.in</a>
            &nbsp;·&nbsp;
            <a href="${track}" target="_blank" style="color:${C.muted};text-decoration:underline;">Track an order</a><br>
            You’re receiving this because you placed an order on KALA.
          </td>
        </tr>

      </table>
      <!--[if mso]></td></tr></table><![endif]-->
    </td>
  </tr>
</table>
</body>
</html>`;
}
