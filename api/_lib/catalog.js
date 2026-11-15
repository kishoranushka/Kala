/* The paintings and collections, for the server functions.
   Source of truth: the Supabase tables `works` / `collections` (edited in the admin panel at /admin).
   If the database isn't configured or can't be reached, the copy bundled with the deploy
   (src/data/works.json, refreshed from the database on every build) is used instead. */
import { createRequire } from 'node:module';
import { dbConfigured, readCatalog } from './db.js';

const require = createRequire(import.meta.url);
const BUNDLED = require('../../src/data/works.json');

const TTL = 10 * 1000;
let cache = null; // { at, data }

/* { collections, works, source: 'db' | 'bundled' } — cached for 10 s per server instance */
export async function getCatalog({ fresh = false } = {}) {
  if (!fresh && cache && Date.now() - cache.at < TTL) return cache.data;
  if (dbConfigured()) {
    try {
      const data = await readCatalog();
      if (data.works.length && data.collections.length) {
        cache = { at: Date.now(), data: { ...data, source: 'db' } };
        return cache.data;
      }
    } catch (err) {
      console.error('[catalog] database unavailable, using the bundled copy:', err.message);
    }
  }
  return { collections: BUNDLED.collections, works: BUNDLED.works, source: 'bundled' };
}

export const forgetCatalog = () => {
  cache = null;
};

/* ------------------------------------------------------------------ admin: checking a painting */
export const STATUSES = ['available', 'inquiry', 'sold', 'archived'];

/* paintings the site's code shows by id (home hero, walls page…): they can't be deleted.
   Keep in step with getWork('…') calls in src/ (search for them when adding one). */
export const PINNED = ['krishna', 'om', 'child', 'ganesha', 'mural', 'chalk', 'vitthal', 'escape', 'radhakrishna', 'buddha', 'sunflower', 'butterfly', 'elephant', 'peacock', 'babybuddha', 'cat'];

const FIELD_ORDER = ['id', 'plate', 'title', 'collection', 'status', 'badge', 'price', 'medium', 'size', 'year', 'framing', 'archiveNo', 'image', 'w', 'h', 'crop', 'room', 'ship', 'alt', 'note', 'details'];
const TEXT = { plate: 10, title: 120, collection: 40, status: 20, badge: 40, price: 30, medium: 120, size: 60, year: 20, framing: 120, archiveNo: 40, alt: 600, note: 4000 };

const text = (v, max) =>
  String(v ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);
const int = (v) => (Number.isFinite(Number(v)) ? Math.round(Number(v)) : 0);
const ORIGIN = /^(100|\d{1,2})% (100|\d{1,2})%$/;

/* keep only known fields, in a stable order, with sane types */
export function cleanWork(input) {
  const w = {};
  w.id = text(input.id, 60).toLowerCase();
  for (const [k, max] of Object.entries(TEXT)) {
    const v = text(input[k], max);
    if (v) w[k] = v;
  }
  /* "12000" or "12,000" → "₹ 12,000" (the format the site and the order API read) */
  if (w.price) {
    const n = Number(w.price.replace(/[^\d.]/g, ''));
    w.price = n >= 1 ? `₹ ${Math.round(n).toLocaleString('en-IN')}` : '';
    if (!w.price) delete w.price;
  }
  w.image = text(input.image, 100);
  w.w = int(input.w);
  w.h = int(input.h);
  if (input.crop) w.crop = true;
  if (input.room?.image) {
    w.room = { image: text(input.room.image, 100), w: int(input.room.w), h: int(input.room.h), label: text(input.room.label, 80) || 'On a wall' };
  }
  if (input.ship && typeof input.ship === 'object') {
    const ship = Object.fromEntries(['weight', 'length', 'breadth', 'height'].filter((k) => Number(input.ship[k]) > 0).map((k) => [k, Math.min(Number(input.ship[k]), 500)]));
    if (Object.keys(ship).length) w.ship = ship;
  }
  if (Array.isArray(input.details)) {
    w.details = input.details
      .slice(0, 4)
      .map((d) => ({ label: text(d?.label, 40), origin: text(d?.origin, 12), scale: Math.min(Math.max(Number(d?.scale) || 2.2, 1.2), 5) }))
      .filter((d) => d.label && ORIGIN.test(d.origin));
  }
  for (const k of ['note', 'medium', 'size', 'framing', 'alt', 'year']) if (w[k] === undefined) w[k] = '';
  return Object.fromEntries(FIELD_ORDER.filter((k) => w[k] !== undefined).map((k) => [k, w[k]]));
}

/* problems a visitor would notice; [] = fine */
export function problemsOf(w, { collections, isFile }) {
  const p = [];
  const name = w.title || 'This painting';
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(w.id)) p.push('The ID (web address) must be lowercase letters, numbers or dashes.');
  if (!w.title) p.push('Add a title.');
  if (!STATUSES.includes(w.status)) p.push(`${name}: choose a tag (Available, Inquiry only, Sold or Archived).`);
  if (!collections.some((c) => c.id === w.collection)) p.push(`${name}: choose a collection.`);
  if (!isFile(w.image)) p.push(`${name}: add the painting’s photo.`);
  if (!(w.w > 0 && w.h > 0)) p.push(`${name}: the photo’s width and height are missing; upload the photo again.`);
  if (w.room && !isFile(w.room.image)) p.push(`${name}: the second photo is missing; upload it again or remove it.`);
  if (!w.alt) p.push(`${name}: describe the painting for screen readers (subject and colours).`);
  return p;
}
