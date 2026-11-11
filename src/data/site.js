/* Site-wide navigation and contact details. Replace bracketed values with real details. */

/* the header nav (and the order of the full-screen menu) */
export const NAV_LINKS = [
  { key: 'shop', label: 'Shop', to: '/shop' },
  { key: 'commission', label: 'Commission', to: '/commission', italicInMenu: true },
  { key: 'walls', label: 'Wall murals', to: '/walls' },
  { key: 'artist', label: 'The Artist', to: '/artist' },
  { key: 'contact', label: 'Contact', to: '/contact' },
];

/* the menu adds the wearables section of the home page after Wall murals */
export const MENU_LINKS = [
  NAV_LINKS[0],
  NAV_LINKS[1],
  NAV_LINKS[2],
  { key: 'wearables', label: 'Wearables', to: '/#wearables' },
  NAV_LINKS[3],
  NAV_LINKS[4],
];

export const FOOTER_GROUPS = [
  {
    title: 'Explore',
    links: [
      { label: 'Shop', to: '/shop' },
      { label: 'Collections', to: '/collections' },
      { label: 'Archive', to: '/archive' },
      { label: 'The Artist', to: '/artist' },
    ],
  },
  {
    title: 'Work with me',
    links: [
      { label: 'Commission', to: '/commission' },
      { label: 'Wall murals', to: '/walls' },
      { label: 'Painted wearables', to: '/#wearables' },
      { label: 'Collaborate', to: '/contact' },
      { label: 'Contact', to: '/contact' },
    ],
  },
];

export const CONTACT = {
  artist: 'Anushka Kishor',
  email: 'kishoranushka96@gmail.com',
  instagram: 'https://www.instagram.com/chaotic_kishor/',
  instagramHandle: '@chaotic_kishor',
  reels: 'https://www.instagram.com/chaotic_kishor/reels/',
  youtube: 'https://www.youtube.com/@kishoranushka',
  youtubeHandle: '@kishoranushka',
  location: '[Location]',
};

/* Web3Forms access key: commission, contact and order forms are emailed to CONTACT.email.
   Get one free at https://web3forms.com (enter the email above; the key arrives by mail).
   It's a public key, safe to commit. VITE_WEB3FORMS_KEY in .env.local overrides it. */
export const FORM_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || '';

export const LEGAL_LINKS = ['Shipping', 'Returns', 'Privacy', 'Terms'];

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
