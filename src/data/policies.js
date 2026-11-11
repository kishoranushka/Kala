/* The shop's policies: privacy, cookies, terms, shipping, returns.
   Plain JS with no Vite imports, so the SEO build (scripts/seo/build.mjs) can read it in Node too.
   Body blocks: a string is a paragraph, { list: [...] } a bulleted list. Inline links: [text](/path or mailto:…).
   Change UPDATED whenever the wording of any policy changes. */

export const UPDATED = '11 November 2026';

const EMAIL = 'kishoranushka96@gmail.com';
const MAIL = `[${EMAIL}](mailto:${EMAIL})`;
const SITE = 'kala.anushkakishor.in';

/* the order the policies are listed in (footer, "other policies" links) */
export const POLICY_ORDER = ['/shipping', '/returns', '/terms', '/privacy', '/cookies'];

export const POLICIES = {
  /* ================================================================= RETURNS */
  '/returns': {
    label: 'Returns & refunds',
    eyebrow: 'Returns, refunds & cancellations',
    lines: ['All sales', 'are *final.*'],
    lead: 'Every painting at KALA is a one-of-a-kind original, painted and packed by hand. Once your order is confirmed it can’t be cancelled, returned or refunded.',
    summary: [
      'No returns and no refunds on any painting, for any reason, once your order is confirmed.',
      'No cancellations after confirmation, including if you change your mind before the painting ships.',
      'Arrived damaged? Tell me within 48 hours with an unboxing video and I’ll repair it or offer a replacement.',
      'Charged twice, or I can’t send what you paid for? You get that money back in full.',
    ],
    sections: [
      {
        id: 'confirmed',
        title: 'When an order is confirmed',
        body: [
          'Your order is confirmed the moment your payment succeeds through Razorpay and you see an order reference starting with KALA-. The same reference appears on the thank-you screen, in your confirmation and on your Razorpay receipt.',
          'From that moment the painting is reserved for you alone and taken off sale for everyone else. That is why this policy applies from confirmation, not from dispatch.',
        ],
      },
      {
        id: 'no-cancellation',
        title: 'No cancellations after confirmation',
        body: [
          'A confirmed order can’t be cancelled for a refund. This holds even if you write to me before the painting has been packed or handed to the courier.',
          'Before you pay, nothing is charged. You can close the checkout at any time; the paintings you chose are simply released after the 20-minute hold ends.',
        ],
      },
      {
        id: 'no-returns',
        title: 'No returns and no refunds',
        body: [
          'Each painting is a single original, not a stocked product, so I don’t accept returns or exchanges and don’t give refunds, store credit or partial refunds. This includes, without limitation:',
          {
            list: [
              'a change of mind, or finding the painting doesn’t suit your room;',
              'small differences in colour, texture or tone between the photographs on screen and the painting in daylight, which come from screens, lighting and the hand-painted surface;',
              'brush marks, dot work, raised paint and other natural features of a hand-made painting;',
              'a delivery that is late because of the courier, weather, holidays or other events outside my control;',
              'a parcel returned to me because the address or phone number was wrong or incomplete, nobody was available, or delivery was refused.',
            ],
          },
          'Please look carefully at the photographs, the medium and the dimensions on each painting’s page before you pay. If you have any question, [write to me](/contact) first; I’m happy to send more photographs.',
        ],
      },
      {
        id: 'damage',
        title: 'If a painting arrives damaged',
        body: [
          'I pack every painting myself to travel safely. If it still reaches you damaged in transit, I will make it right with a repair or a replacement. There is still no refund and no return.',
          {
            list: [
              `Write to ${MAIL} within 48 hours of delivery, with your order reference.`,
              'Attach an unedited video of the parcel being opened, starting with the sealed outer box, and clear photographs of the outer box, the packing and the damage.',
              'Keep all the packing until I reply.',
            ],
          },
          'Once I’ve seen the evidence, I’ll either restore the painting (I’ll arrange how it reaches me and comes back to you, at no cost to you) or, if it can’t be restored, offer you an available original or a commissioned painting of similar size and value. Reports made after 48 hours, or without the unboxing video, can’t be accepted.',
        ],
      },
      {
        id: 'when-refunded',
        title: 'The only times money is refunded',
        body: [
          'A refund is made only when the mistake is on the shop’s side, never because an order is cancelled or a painting is returned:',
          {
            list: [
              'You were charged more than once for the same order. The extra payment is refunded in full.',
              'You were charged, but I can’t send the painting: for example, it was bought by someone else at the same moment, or it was damaged before dispatch. The amount for that painting is refunded in full.',
              'A price shown on the site was clearly wrong and I cancel the order for that reason. The amount paid is refunded in full.',
            ],
          },
          'In each case I’ll email you first. Refunds go back to the account or card you paid from, through Razorpay, and are started within 7 working days of my email. Your bank then usually takes 5 to 7 working days to show the money.',
        ],
      },
      {
        id: 'returned-parcels',
        title: 'Parcels that come back to me',
        body: [
          'If the courier returns a parcel to me because the delivery details were wrong or incomplete, the phone number didn’t answer, or delivery was refused, the order is not refunded. Write to me and I’ll send it again to a corrected address; the courier charge for the second shipment is paid by you.',
        ],
      },
      {
        id: 'commissions',
        title: 'Commissions and murals',
        body: [
          'Commissioned paintings, portraits, wall murals and painted wearables are made to order for one person. Once a commission is agreed with me by email and any payment for it is made, that payment is not refundable, and the finished work can’t be returned. Any revisions included are agreed in writing before work begins.',
        ],
      },
      {
        id: 'questions',
        title: 'Questions',
        body: [
          `For anything about an order, write to ${MAIL} with your order reference, or use the [contact page](/contact). I reply personally, usually within 2 working days. You can follow your order any time on the [tracking page](/track).`,
        ],
      },
    ],
  },

  /* ================================================================= SHIPPING */
  '/shipping': {
    label: 'Shipping',
    eyebrow: 'Shipping & delivery',
    lines: ['From my hands', 'to your *wall.*'],
    lead: 'Paintings bought on this site ship free within India. I pack every one myself and send it with a tracked courier.',
    summary: [
      'Free shipping on every order within India.',
      'Packed by me and handed to the courier within 7 working days of payment.',
      'Tracking reaches you by SMS and email, and on the tracking page.',
      'Ordering from outside India? Write to me and I’ll arrange it.',
    ],
    sections: [
      {
        id: 'where',
        title: 'Where I ship',
        body: [
          'Online orders are delivered to addresses in India only, to any PIN code our courier partners serve. If a PIN code can’t be reached, I’ll email you before dispatch to agree another address.',
          'For delivery outside India, please [write to me](/contact) before ordering. International shipping, customs duties and taxes are agreed with you separately by email, and those orders are not placed through the online checkout.',
        ],
      },
      {
        id: 'cost',
        title: 'What it costs',
        body: ['Shipping within India is free. The price you see at checkout is the full amount you pay for the painting and its delivery.'],
      },
      {
        id: 'when',
        title: 'When it leaves',
        body: [
          'I pack your painting and hand it to the courier within 7 working days of your payment (working days are Monday to Saturday, excluding public holidays). If anything would delay that, I’ll email you.',
          'Delivery time after dispatch depends on your PIN code and the courier. The courier’s expected delivery date, once available, appears on the [tracking page](/track).',
        ],
      },
      {
        id: 'packing',
        title: 'How it’s packed',
        body: [
          'Each painting is wrapped and protected at the corners and edges, then boxed for the journey. Shipments are booked through Shiprocket with its partner couriers.',
        ],
      },
      {
        id: 'tracking',
        title: 'Tracking your parcel',
        body: [
          'Once your painting ships, the courier sends tracking updates by SMS and email. You can also see its progress any time on the [tracking page](/track) with your order reference (it starts with KALA-) and the email you ordered with.',
        ],
      },
      {
        id: 'address',
        title: 'Your address and phone number',
        body: [
          'Please check your delivery address, PIN code and 10-digit mobile number before you pay; the courier calls that number on delivery. To change the address before dispatch, write to me straight away with your order reference. After dispatch the address can’t be changed.',
          'If a parcel comes back to me because the details were wrong, nobody was available, or delivery was refused, see [parcels that come back to me](/returns#returned-parcels).',
        ],
      },
      {
        id: 'receiving',
        title: 'When it arrives',
        body: [
          'Please record an unedited video while opening the parcel, starting with the sealed box. If anything has been damaged in transit, the video lets me put it right: see [if a painting arrives damaged](/returns#damage).',
        ],
      },
      {
        id: 'delays',
        title: 'Delays',
        body: [
          'Courier delays, weather, strikes, public holidays and other events outside my control can slow a delivery. I’ll help you chase the courier, but a late delivery isn’t a reason for a refund.',
        ],
      },
    ],
  },

  /* ================================================================= TERMS */
  '/terms': {
    label: 'Terms & conditions',
    eyebrow: 'Terms & conditions',
    lines: ['The terms', 'of the *shop.*'],
    lead: `These terms apply when you use ${SITE} or buy a painting from it. By placing an order you agree to them, together with the shipping, returns and privacy policies they refer to.`,
    summary: [
      'KALA is run by Anushka Kishor, an independent artist based in India.',
      'Every painting is a single original; your order is confirmed when payment succeeds.',
      'No cancellations, returns or refunds after confirmation.',
      'Buying a painting gives you the painting, not the copyright in it.',
    ],
    sections: [
      {
        id: 'who',
        title: 'Who we are',
        body: [
          `KALA (“KALA”, “I”, “me”, “the shop”) is the online shop of Anushka Kishor, an independent artist based in India, who sells original paintings and takes commissions through ${SITE}. You can reach me at ${MAIL} or through the [contact page](/contact).`,
        ],
      },
      {
        id: 'using',
        title: 'Using the site',
        body: [
          'You may browse the site and buy from it for personal, lawful purposes. Please don’t misuse it: no attempts to break or overload it, gain access to parts of it you aren’t meant to reach, place false orders, or copy its content or images (see [copyright](#copyright)).',
          'To buy a painting you must be at least 18, or buying with the permission of a parent or guardian, and able to make a binding contract under Indian law.',
        ],
      },
      {
        id: 'paintings',
        title: 'The paintings',
        body: [
          'Each painting is a hand-made, one-of-a-kind original; prints are not sold. I describe every work honestly, with its medium, dimensions, year and framing, and photograph it carefully. Colours can still look different on different screens and under different light, and hand-painted surfaces vary. These are not defects.',
          'A painting shown as Available can be sold to someone else at any moment until your payment succeeds. Paintings marked Sold, Archive or Inquiry only can’t be bought online.',
        ],
      },
      {
        id: 'prices',
        title: 'Prices',
        body: [
          'Prices are in Indian Rupees (₹). The total shown at checkout is the full amount you pay, with free shipping within India. Prices may change at any time, but the price on your confirmed order won’t.',
          'If a price was clearly shown by mistake, I may cancel the order, tell you by email and refund you in full.',
        ],
      },
      {
        id: 'ordering',
        title: 'Placing an order',
        body: [
          {
            list: [
              'Choose your paintings, add your details and delivery address, and pay through Razorpay by UPI, card, netbanking or wallet.',
              'While you pay, the paintings are held for you for 20 minutes so nobody else can buy them.',
              'Your order is confirmed, and a contract between us is made, when your payment succeeds and you receive an order reference starting with KALA-.',
              'If a payment succeeds but the painting was sold at the same moment to someone else, I’ll email you and refund that amount in full.',
            ],
          },
          'You are responsible for the accuracy of the name, email, phone number and address you give.',
        ],
      },
      {
        id: 'payment',
        title: 'Payment',
        body: [
          'Payments are processed by Razorpay Software Private Limited. Your card, UPI and bank details go straight to Razorpay and are never seen or stored by KALA. Razorpay’s own terms apply to the payment. Razorpay sends you a receipt by email.',
        ],
      },
      {
        id: 'delivery',
        title: 'Shipping and delivery',
        body: [
          'Orders ship free within India and are handed to the courier within 7 working days of payment. The [shipping policy](/shipping) has the details. The painting becomes your responsibility once it is delivered to the address you gave.',
        ],
      },
      {
        id: 'cancellations',
        title: 'Cancellations, returns and refunds',
        body: [
          'All sales are final. A confirmed order can’t be cancelled for a refund, and paintings can’t be returned or exchanged. Damage in transit reported within 48 hours, with an unboxing video, is put right by repair or replacement. Money is refunded only for duplicate payments, a painting I can’t send, or a pricing mistake. The full terms are in the [returns and refunds policy](/returns), which forms part of these terms.',
        ],
      },
      {
        id: 'commissions',
        title: 'Commissions and murals',
        body: [
          'Enquiries sent through the commission or contact forms are not orders. For a commission, wall mural or painted wearable, the design, size, price, payment schedule, timeline and any revisions are agreed with you by email before work begins, and those agreed terms apply alongside these. Payments made for a commission are not refundable once the commission is agreed, because the work is made for you alone.',
        ],
      },
      {
        id: 'copyright',
        title: 'Copyright and images',
        body: [
          'All paintings, photographs, designs, text and the KALA name and mark on this site are the work of Anushka Kishor and protected by copyright and other laws. Buying a painting transfers ownership of that physical painting only. The copyright stays with the artist.',
          'You may photograph and share the painting you own, for example on social media, ideally crediting @chaotic_kishor. You may not reproduce it, print it, sell copies, use it in products or advertising, or use the site’s images to train or prompt AI image models without my written permission.',
          'I may photograph and show work I’ve made, including commissions and murals, in my portfolio and on social media. If you’d prefer a commission or mural not be shown, tell me when we agree it.',
        ],
      },
      {
        id: 'links',
        title: 'Other websites',
        body: [
          'The site links to services run by others, such as Instagram, YouTube, Razorpay and the courier’s tracking pages. Their own terms and privacy policies apply there, and I’m not responsible for their content.',
        ],
      },
      {
        id: 'liability',
        title: 'Liability',
        body: [
          'I take care to keep the site accurate and working, but it is provided as it is, and I can’t promise it will always be available or free of errors.',
          'To the extent the law allows, my total liability for any order is limited to the amount you paid for it, and I am not liable for indirect or consequential losses. Nothing in these terms limits any liability that can’t be limited under Indian law, or your rights as a consumer under the Consumer Protection Act, 2019.',
        ],
      },
      {
        id: 'events',
        title: 'Events outside my control',
        body: [
          'I am not responsible for delay or failure caused by events beyond reasonable control, such as natural disasters, epidemics, strikes, government action, courier or network failures. I’ll tell you as soon as I can and do my best to deliver.',
        ],
      },
      {
        id: 'law',
        title: 'Governing law and disputes',
        body: [
          'These terms are governed by the laws of India. If something goes wrong, please write to me first; most problems are solved quickly that way. Any dispute that can’t be resolved between us is subject to the jurisdiction of the competent courts in India.',
        ],
      },
      {
        id: 'grievance',
        title: 'Grievance officer',
        body: [
          `Under the Consumer Protection (E-Commerce) Rules, 2020 and the Information Technology Act, 2000, the grievance officer for this site is Anushka Kishor, reachable at ${MAIL}. I acknowledge every complaint within 48 hours and aim to resolve it within one month of receiving it.`,
        ],
      },
      {
        id: 'changes',
        title: 'Changes to these terms',
        body: [
          'I may update these terms from time to time; the date at the top of this page shows the latest version. The terms in force when you placed your order apply to that order.',
        ],
      },
    ],
  },

  /* ================================================================= PRIVACY */
  '/privacy': {
    label: 'Privacy policy',
    eyebrow: 'Privacy policy',
    lines: ['Your details,', 'kept *with care.*'],
    lead: 'KALA collects only what it needs to answer your messages and deliver your paintings. It doesn’t sell your details, show ads or track you around the web.',
    summary: [
      'I collect what you type into the order, commission and contact forms, and nothing else about you.',
      'Your card and UPI details go to Razorpay only; I never see them.',
      'Your details are shared only with the services that run the shop and deliver your order.',
      'You can ask to see, correct or delete your details at any time.',
    ],
    sections: [
      {
        id: 'who',
        title: 'Who is responsible',
        body: [
          `This site is run by Anushka Kishor, an independent artist based in India, trading as KALA. I decide how your personal data is used (the “data fiduciary” under India’s Digital Personal Data Protection Act, 2023). Contact: ${MAIL}.`,
        ],
      },
      {
        id: 'collect',
        title: 'What I collect',
        body: [
          'Only what you choose to give me through a form:',
          {
            list: [
              'When you buy a painting: your name, email address, mobile number, delivery address (street, city, state and PIN code), any note you add, the paintings you bought and the amount paid, and the payment references Razorpay returns (never your card, UPI or bank details).',
              'When you send a commission enquiry: your name, email address, the kind of work, your idea and, if you choose, size, budget, timeline and where it will live.',
              'When you use the contact form: your name, email address, topic and message.',
              'When you track an order: the order reference and email you enter, used only to find that order.',
              'Whether you ticked the box to receive occasional updates on new work.',
            ],
          },
          'Like every website, the servers that host this site and its fonts receive technical information with each request, such as your IP address, browser type and the page asked for. I don’t use this to identify you. When you start a checkout, a one-way hashed form of your IP address is stored with it, only to stop automated or repeated checkout attempts; the original IP address isn’t kept.',
          'The site doesn’t ask for and doesn’t knowingly collect sensitive data such as health, financial account or government ID details.',
        ],
      },
      {
        id: 'use',
        title: 'How your details are used',
        body: [
          {
            list: [
              'To take payment, confirm your order and send your confirmation and order reference.',
              'To book the courier, ship your painting and let you track it.',
              'To answer your enquiries and discuss commissions with you.',
              'To send occasional updates on new work, only if you ticked the box asking for them.',
              'To keep the records Indian tax and accounting law requires, to prevent fraud, and to handle any complaint or legal claim.',
            ],
          },
          'I rely on your consent, given when you submit a form, and on the legitimate uses the law allows, such as fulfilling the purchase you asked for and meeting legal obligations. I don’t use your details for advertising, profiling or automated decisions, and I don’t sell or rent them to anyone.',
        ],
      },
      {
        id: 'share',
        title: 'Who your details are shared with',
        body: [
          'Only with the services that run the shop, and only what each one needs:',
          {
            list: [
              'Razorpay Software Private Limited: processes your payment; receives your name, email, phone number and the order amount.',
              'Shiprocket (BigFoot Retail Solutions Private Limited) and its courier partners: book and deliver your parcel; receive your name, phone number, delivery address and parcel details.',
              'Supabase: the database where order records are stored.',
              'Vercel: hosts the website and the functions that process orders.',
              'Resend: sends order emails.',
              'Web3Forms: delivers commission, contact and order messages to my inbox.',
              'Google Fonts: serves the website’s typefaces and receives your IP address when the page loads them.',
              'Google (Gmail): hosts the email inbox where your messages and order details arrive.',
            ],
          },
          'I may also share information when the law requires it, for example with tax authorities or in response to a lawful request from a court or government agency.',
          'Some of these providers store or process data on servers outside India. Where that happens, they protect it under their own security and privacy commitments, and transfers are made only as Indian law allows.',
        ],
      },
      {
        id: 'storage',
        title: 'How long it is kept',
        body: [
          'Order records are kept for as long as Indian tax and accounting law requires, and then deleted. Checkouts that were never paid are kept only as long as they’re needed to answer questions about a payment, and you can ask for them to be deleted at any time.Enquiry and contact emails are kept while we’re in touch, and deleted on request. If you stop wanting updates, your email is removed from that list straight away.',
        ],
      },
      {
        id: 'security',
        title: 'Keeping it safe',
        body: [
          'The site is served only over HTTPS. Order records sit in a database that only the shop’s server functions can reach, protected by secret keys; they can’t be read from the browser. Order tracking shows only limited details (the paintings, totals, city and shipment status) and only to someone who knows both the order reference and the email used. No system is perfectly secure, but if a breach ever affects your details, I’ll tell you and the authorities as the law requires.',
        ],
      },
      {
        id: 'rights',
        title: 'Your rights',
        body: [
          'Under the Digital Personal Data Protection Act, 2023 you can:',
          {
            list: [
              'ask what personal data I hold about you and how it is used;',
              'ask me to correct, complete or update it;',
              'ask me to delete it, except what I must keep by law, such as order records;',
              'withdraw your consent at any time, for example to updates on new work, without affecting what was done before;',
              'nominate someone to exercise these rights for you in case of death or incapacity;',
              'raise a grievance with me, and if you aren’t satisfied with my answer, complain to the Data Protection Board of India.',
            ],
          },
          `To use any of these rights, write to ${MAIL} from the email you used with KALA. I reply within 30 days.`,
        ],
      },
      {
        id: 'cookies',
        title: 'Cookies and storage',
        body: [
          'The site doesn’t set advertising or analytics cookies. It keeps your cart in your browser’s local storage, on your device only. Razorpay may set its own cookies when you open its payment window. The [cookie policy](/cookies) has the details.',
        ],
      },
      {
        id: 'children',
        title: 'Children',
        body: [
          'The shop is meant for adults. If you are under 18, please ask a parent or guardian to order or write for you. I don’t knowingly collect personal data from children; if you believe a child has sent me their details, write to me and I’ll delete them.',
        ],
      },
      {
        id: 'grievance',
        title: 'Grievance officer',
        body: [
          `Grievance officer: Anushka Kishor, ${MAIL}. Complaints are acknowledged within 48 hours and resolved within one month.`,
        ],
      },
      {
        id: 'changes',
        title: 'Changes to this policy',
        body: [
          'If this policy changes, the new version will be posted here with a new date at the top. If a change affects how I use details you’ve already given me, I’ll ask for your consent again where the law requires it.',
        ],
      },
    ],
  },

  /* ================================================================= COOKIES */
  '/cookies': {
    label: 'Cookie policy',
    eyebrow: 'Cookie policy',
    lines: ['No tracking,', 'just the *essentials.*'],
    lead: 'This site doesn’t use advertising cookies, analytics or tracking pixels. Here is everything it does store, and why.',
    summary: [
      'KALA sets no cookies of its own and uses no analytics.',
      'Your cart is kept in your browser’s local storage, on your device only.',
      'Razorpay sets its own cookies only when you open the payment window.',
      'No cookie banner is needed because nothing optional is used.',
    ],
    sections: [
      {
        id: 'what',
        title: 'What cookies are',
        body: [
          'Cookies are small text files a website stores in your browser. Browsers also offer similar storage, such as local storage. This policy covers both.',
        ],
      },
      {
        id: 'ours',
        title: 'What this site stores',
        body: [
          'KALA itself sets no cookies. It uses one item of local storage:',
          {
            list: [
              'kala-bag: the list of paintings in your cart, so they stay there between pages, visits and open tabs. It holds painting identifiers only, no personal details, and never leaves your device. It is emptied when your order is paid, and you can clear it any time by removing the paintings or clearing your browser’s site data.',
            ],
          },
          'It is strictly necessary for the cart to work, so it doesn’t need your consent.',
        ],
      },
      {
        id: 'third-party',
        title: 'Third-party services',
        body: [
          {
            list: [
              'Razorpay: when you press Pay, the site loads Razorpay’s checkout, which may set its own cookies to process the payment securely and prevent fraud. These are covered by Razorpay’s privacy and cookie policies.',
              'Google Fonts: the site’s typefaces are loaded from Google’s servers. Google receives your IP address and browser details to deliver the fonts, and doesn’t set cookies for this.',
              'Vercel: the hosting provider may record technical request data such as your IP address in server logs to keep the site running and secure. It doesn’t set tracking cookies on this site.',
            ],
          },
          'Links to Instagram, YouTube and the courier’s tracking page open those sites, which use their own cookies under their own policies. Nothing from them is embedded on this site.',
        ],
      },
      {
        id: 'not-used',
        title: 'What isn’t used',
        body: [
          'No advertising cookies, no analytics or visitor statistics tools, no social media pixels, and no cross-site tracking.',
        ],
      },
      {
        id: 'control',
        title: 'Your choices',
        body: [
          'You can clear or block cookies and site storage in your browser’s settings. Blocking local storage means the cart won’t remember paintings between pages, and blocking Razorpay’s cookies may stop the payment window from working, but you can still browse everything else.',
        ],
      },
      {
        id: 'changes',
        title: 'Changes',
        body: [
          `If the site ever adds analytics or other optional cookies, this policy will be updated first and your consent asked for. Questions: ${MAIL}.`,
        ],
      },
    ],
  },
};
