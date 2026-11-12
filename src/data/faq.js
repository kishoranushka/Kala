/* Questions & answers shown on the site AND sent to search engines as FAQPage structured data.
   Plain JS with no Vite imports, so the SEO build (src/seo/meta.js → scripts/seo/build.mjs) reads it too.
   Google only accepts FAQ markup for questions that are visible on the page, so every list here is
   rendered by <FaqSection> on its page — edit the text here and both stay in step.
   Answers are plain text (no links), keep them true to how the shop works (see policies.js). */

/* home: who / what KALA is — answers searches for "kala", "kala by anushka", "anushka kishor" */
export const HOME_FAQ = [
  {
    q: 'What is KALA by Anushka Kishor?',
    a: 'KALA is the online studio of Anushka Kishor, an artist based in India. It is where her original hand-painted work lives: acrylic paintings, dot-work mandalas, devotional art of Krishna, Radha, Ganesha, Shiva and Buddha, portraits, hand-painted wall murals and painted wearables. Every painting is one of a kind.',
  },
  {
    q: 'What does “Kala” mean?',
    a: 'Kala (कला) is the Hindi and Sanskrit word for art. KALA is the name that brings all of Anushka Kishor’s work together: canvases, mandalas, walls and wearables.',
  },
  {
    q: 'Who is Anushka Kishor?',
    a: 'Anushka Kishor is an India-based painter and mural artist, and the artist behind KALA. She builds software by day and paints by passion: devotional figures, mandalas, portraits, small joyful canvases, wall murals and wearable art. You can follow her work on Instagram at @kala.anushkakishor.in and on YouTube at @kishoranushka.',
  },
  {
    q: 'Where can I buy Anushka Kishor’s paintings?',
    a: 'Right here, in the KALA shop. Every painting is an original, so there is only one of each. Add a painting to your cart and pay securely online with UPI, card or netbanking. Shipping is free anywhere in India.',
  },
  {
    q: 'Can I commission a painting, portrait or wall mural?',
    a: 'Yes. Anushka takes commissions for custom paintings, portraits of people you love, hand-painted wall murals for homes, offices, cafés and schools, and painted wearables. Share your idea on the Commission page and she will reply with a quote and a timeline before any paint goes on.',
  },
  {
    q: 'Does KALA sell prints?',
    a: 'No. KALA sells original, hand-painted work only. Each painting exists just once, and once it is sold it moves to the archive.',
  },
];

/* shop: buying an original */
export const SHOP_FAQ = [
  {
    q: 'Are these original paintings or prints?',
    a: 'Every painting in the shop is a one-of-a-kind original, hand-painted by Anushka Kishor. There are no prints or copies, so once a painting is sold it is gone.',
  },
  {
    q: 'How do I pay?',
    a: 'Add the paintings you love to your cart and pay online through Razorpay with UPI, a debit or credit card, or netbanking. Your painting is held for you while you pay, and you get an order reference starting with KALA- by email.',
  },
  {
    q: 'How much is shipping and how long does it take?',
    a: 'Shipping is free anywhere in India. Each painting is packed by the artist and handed to a tracked courier within 7 working days of payment. You can follow it on the Track order page with your order reference and email.',
  },
  {
    q: 'Can I return a painting?',
    a: 'All sales are final once your order is confirmed: there are no cancellations, returns or refunds. If a painting arrives damaged, tell us within 48 hours with an unboxing video and it will be repaired or replaced.',
  },
];

/* contact: before you write */
export const CONTACT_FAQ = [
  { q: 'Do you ship outside India?', a: 'Paintings ordered on this site ship free anywhere in India. I pack each one myself, wrapped and protected at the corners, and send it with a tracked courier. For delivery abroad, write to me first and we’ll work out shipping and customs together.' },
  { q: 'How long does a commission take?', a: 'It depends on the size and the detail: a small canvas takes far less time than a large portrait or a wall. Once we’ve talked it through, I’ll give you a clear timeline along with the quote, before any paint goes on.' },
  { q: 'Can I see a painting in person?', a: 'Most of my work lives online, so I’m happy to send more photographs, close-ups in daylight, or a short video of a painting before you decide. Just ask on the work’s page or write to me.' },
  { q: 'Do you paint walls outside your city?', a: 'Yes. I travel for murals within India. Tell me your city and the size of the wall, and travel and stay are included in the quote so there are no surprises.' },
];

/* which list belongs to which route (read by the SEO build) */
export const FAQ_BY_PATH = { '/': HOME_FAQ, '/shop': SHOP_FAQ, '/contact': CONTACT_FAQ };
