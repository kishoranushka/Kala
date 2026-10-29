/* Site-wide navigation and contact placeholders. Replace bracketed values with real details. */

export const NAV_LINKS = [
  { key: 'shop', label: 'Shop', to: '/shop' },
  { key: 'collections', label: 'Collections', to: '/collections' },
  { key: 'archive', label: 'Archive', to: '/archive' },
  { key: 'artist', label: 'The Artist', to: '/artist' },
  { key: 'commission', label: 'Commission', to: '/commission', italicInMenu: true },
  { key: 'contact', label: 'Contact', to: '/contact' },
];

export const CONTACT = {
  email: '[studio@email]',
  instagram: '[handle]',
  youtube: '[channel]',
  location: '[Location]',
  artist: '[Artist name]',
};

export const LEGAL_LINKS = ['Shipping', 'Returns', 'Privacy', 'Terms'];

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
