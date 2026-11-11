import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DATA from '@/data/works.json';
import { WORKS, imageSrc } from '@/data/works';
import COPY from './copy.json';
import { createSeo } from './meta';

/* The build pre-renders each route's <head> (scripts/seo/build.mjs); this keeps it right while the
   visitor navigates inside the app. Live status (paintings sold online) comes from WORKS. */
const liveStatus = new Map(WORKS.map((w) => [w.id, w.status]));
const seo = createSeo({
  data: { ...DATA, works: DATA.works.map((w) => ({ ...w, status: liveStatus.get(w.id) ?? w.status })) },
  copy: COPY,
  imageUrl: imageSrc,
});

function setTag(selector, create, attr, value) {
  let el = document.head.querySelector(selector);
  if (!value) return el?.remove();
  if (!el) {
    el = document.createElement(create.tag);
    Object.entries(create.attrs).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}
const metaName = (name, value) => setTag(`meta[name="${name}"]`, { tag: 'meta', attrs: { name } }, 'content', value);
const metaProp = (property, value) => setTag(`meta[property="${property}"]`, { tag: 'meta', attrs: { property } }, 'content', value);

export function applySeo(m) {
  document.title = m.title;
  metaName('description', m.description);
  metaName('robots', m.robots);
  setTag('link[rel="canonical"]', { tag: 'link', attrs: { rel: 'canonical' } }, 'href', m.canonical);
  metaProp('og:type', m.ogType);
  metaProp('og:url', m.canonical);
  metaProp('og:title', m.title);
  metaProp('og:description', m.description);
  metaProp('og:image', m.image);
  metaProp('og:image:alt', m.imageAlt);
  metaProp('product:price:amount', m.product?.price ? String(m.product.price) : '');
  metaProp('product:price:currency', m.product?.currency);
  metaProp('product:availability', m.product?.availability);
  metaName('twitter:title', m.title);
  metaName('twitter:description', m.description);
  metaName('twitter:image', m.image);
  metaName('twitter:image:alt', m.imageAlt);
  let ld = document.getElementById('seo-jsonld');
  if (!ld) {
    ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.id = 'seo-jsonld';
    document.head.appendChild(ld);
  }
  ld.textContent = JSON.stringify(m.jsonLd);
}

export function useSeo() {
  const { pathname } = useLocation();
  useEffect(() => {
    applySeo(seo.meta(pathname));
  }, [pathname]);
}
