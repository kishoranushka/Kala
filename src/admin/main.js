/* KALA admin panel (/admin): add and edit paintings from a phone or laptop.
   Talks to /api/admin (api/admin.js). Photos go through the fixer (photo.js) before upload.
   Views (hash routes): #/ list · #/new · #/edit/<id> */
import './admin.css';
import { fixPhoto } from './photo.js';

const app = document.getElementById('app');
const logoutBtn = document.getElementById('logout');

const STATUS = {
  available: { label: 'Available', hint: 'Shows the price; can be bought online.' },
  inquiry: { label: 'Inquiry only', hint: 'No price; visitors enquire.' },
  sold: { label: 'Sold', hint: 'Still shown; can’t be bought.' },
  archived: { label: 'Archived', hint: 'Past or not-for-sale work.' },
};
const DETAIL_DEFAULTS = [
  { label: 'Detail I', origin: '50% 40%', scale: 2.2 },
  { label: 'Detail II', origin: '50% 70%', scale: 2.2 },
];

let D = null; // { collections, works, storage, sold, held, pinned, rebuild }
let E = null; // the painting being edited: { work, isNew, dirty, picking, idTouched }
const list = { q: '', status: '' };

/* ------------------------------------------------------------------ helpers */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
const photoUrl = (file) => (file && D?.storage ? `${D.storage}/${encodeURIComponent(file)}` : '');
const $ = (s, el = app) => el.querySelector(s);
const clone = (o) => JSON.parse(JSON.stringify(o));

async function api(action, { method = 'GET', body, raw } = {}) {
  const headers = method === 'GET' ? {} : { 'X-Kala-Admin': '1', 'Content-Type': raw ? 'application/octet-stream' : 'application/json' };
  let res;
  try {
    res = await fetch(`/api/admin?a=${action}`, { method, headers, credentials: 'same-origin', body: raw ?? (body === undefined ? undefined : JSON.stringify(body)) });
  } catch {
    throw new Error('No connection. Check the internet and try again.');
  }
  let out = {};
  try {
    out = await res.json();
  } catch {
    /* empty or HTML */
  }
  if (res.status === 401 && out.login) {
    showLogin('You were logged out. Please log in again.');
    throw Object.assign(new Error(out.error), { handled: true });
  }
  if (!res.ok) throw Object.assign(new Error(out.error || `Something went wrong (${res.status}).`), { problems: out.problems, status: res.status });
  return out;
}

function message(kind, text, problems) {
  const box = $('#msg');
  if (!box) return;
  if (!kind) {
    box.innerHTML = '';
    return;
  }
  box.innerHTML = `<div class="msg ${kind}" role="${kind === 'err' ? 'alert' : 'status'}">${esc(text)}${problems?.length ? `<ul>${problems.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}</div>`;
  box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

/* ------------------------------------------------------------------ login */
function showLogin(note) {
  E = null;
  logoutBtn.hidden = true;
  app.innerHTML = `
    <section class="login">
      <h1>Admin</h1>
      <p class="sub">Add and edit your paintings.</p>
      <div id="msg"></div>
      <form id="loginForm" class="panel">
        <label class="field">Password<input type="password" name="password" autocomplete="current-password" required autofocus /></label>
        <button class="btn wide" type="submit">Log in</button>
      </form>
    </section>`;
  if (note) message('warn', note);
  $('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.disabled = true;
    try {
      await api('login', { method: 'POST', body: { password: e.target.password.value } });
      await boot();
    } catch (err) {
      message('err', err.message);
      btn.disabled = false;
    }
  });
}

logoutBtn.addEventListener('click', async () => {
  if (E?.dirty && !confirm('You have unsaved changes. Log out anyway?')) return;
  await api('logout', { method: 'POST' }).catch(() => {});
  showLogin();
});

/* ------------------------------------------------------------------ boot + routing */
async function boot() {
  app.innerHTML = '<p class="loading">Loading your paintings…</p>';
  let session;
  try {
    session = await (await fetch('/api/admin?a=session', { credentials: 'same-origin' })).json();
  } catch {
    app.innerHTML = '<p class="loading">Can’t reach the server. Check the internet and reload.</p>';
    return;
  }
  if (!session.configured) {
    app.innerHTML = '<section class="login"><h1>Admin</h1><div class="msg warn">The admin password isn’t set yet. Add <b>ADMIN_PASSWORD</b> in Vercel (and in .env.local for local use), then redeploy.</div></section>';
    return;
  }
  if (!session.ok) return showLogin();
  try {
    D = await api('data');
  } catch (err) {
    if (!err.handled) app.innerHTML = `<section class="login"><h1>Admin</h1><div class="msg err">${esc(err.message)}</div></section>`;
    return;
  }
  logoutBtn.hidden = false;
  route();
}

let lastHash = location.hash;
let ignoreHash = false;
window.addEventListener('hashchange', () => {
  if (ignoreHash) {
    ignoreHash = false;
    return;
  }
  if (E?.dirty && !confirm('You have unsaved changes. Leave without saving?')) {
    ignoreHash = true;
    location.hash = lastHash;
    return;
  }
  route();
});
window.addEventListener('beforeunload', (e) => {
  if (E?.dirty) e.preventDefault();
});

function route() {
  lastHash = location.hash;
  if (!D) return;
  const h = location.hash.replace(/^#\/?/, '');
  window.scrollTo(0, 0);
  if (h === 'new') return showEdit(null);
  const m = h.match(/^edit\/(.+)$/);
  if (m) {
    const w = D.works.find((x) => x.id === decodeURIComponent(m[1]));
    if (w) return showEdit(w);
  }
  showList();
}

/* ------------------------------------------------------------------ list */
function showList() {
  E = null;
  const counts = Object.fromEntries(Object.keys(STATUS).map((s) => [s, D.works.filter((w) => w.status === s).length]));
  app.innerHTML = `
    <div class="list-head">
      <h1>Paintings</h1>
      <a class="btn" href="#/new">+ Add a painting</a>
    </div>
    <div id="msg"></div>
    ${D.rebuild ? '' : '<div class="msg warn">Changes show on the site straight away, but search-engine pages only update on the next deploy: add <b>VERCEL_DEPLOY_HOOK_URL</b> in Vercel to rebuild them automatically.</div>'}
    <div class="filters">
      <input type="search" id="q" placeholder="Search by title…" aria-label="Search paintings" value="${esc(list.q)}" />
      <div class="chips" role="group" aria-label="Filter by tag">
        <button type="button" class="chip" data-s="" aria-pressed="${!list.status}">All ${D.works.length}</button>
        ${Object.entries(STATUS).map(([s, v]) => `<button type="button" class="chip" data-s="${s}" aria-pressed="${list.status === s}">${v.label} ${counts[s]}</button>`).join('')}
      </div>
    </div>
    <div class="cards" id="cards"></div>`;
  renderCards();
  $('#q').addEventListener('input', (e) => {
    list.q = e.target.value;
    renderCards();
  });
  app.querySelectorAll('.chip').forEach((b) =>
    b.addEventListener('click', () => {
      list.status = b.dataset.s;
      app.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c === b)));
      renderCards();
    })
  );
}

function renderCards() {
  const q = list.q.trim().toLowerCase();
  const items = [...D.works]
    .reverse() // newest first
    .filter((w) => (!list.status || w.status === list.status) && (!q || `${w.title} ${w.id} ${w.medium}`.toLowerCase().includes(q)));
  $('#cards').innerHTML = items.length
    ? items
        .map(
          (w) => `
      <a class="card" href="#/edit/${encodeURIComponent(w.id)}">
        <span class="thumb">${w.image ? `<img src="${esc(photoUrl(w.image))}" alt="" loading="lazy" />` : ''}</span>
        <span class="body">
          <span class="t">${esc(w.title) || 'Untitled'}</span>
          <span class="badge ${esc(w.status)}">${D.sold.includes(w.id) && w.status !== 'sold' ? 'Sold online' : STATUS[w.status]?.label ?? esc(w.status)}</span>
          <span class="m">${esc(w.price || 'No price')} · Pl. ${esc(w.plate)}</span>
        </span>
      </a>`
        )
        .join('')
    : '<p class="empty">No paintings match.</p>';
}

/* ------------------------------------------------------------------ edit */
function newWork() {
  const plate = String(Math.max(0, ...D.works.map((w) => parseInt(w.plate, 10) || 0)) + 1).padStart(2, '0');
  return { id: '', plate, title: '', collection: D.collections.at(-1)?.id ?? '', status: 'available', price: '', medium: '', size: '', year: String(new Date().getFullYear()), framing: '', image: '', w: 0, h: 0, alt: '', note: '', details: clone(DETAIL_DEFAULTS) };
}

function showEdit(existing) {
  const work = existing ? clone(existing) : newWork();
  if (!Array.isArray(work.details) || !work.details.length) work.details = clone(DETAIL_DEFAULTS);
  E = { work, isNew: !existing, dirty: false, picking: null, idTouched: false };
  const w = work;
  const pinned = D.pinned.includes(w.id);
  const soldOnline = D.sold.includes(w.id) && w.status !== 'sold';

  app.innerHTML = `
    <a class="back" href="#/">← All paintings</a>
    <h1 id="heading">${esc(w.title) || 'New painting'}</h1>
    <p class="sub">${E.isNew ? 'Not saved yet. Start with the photo.' : `Plate ${esc(w.plate)} · /artwork/${esc(w.id)}`}</p>
    <div id="msg"></div>
    ${soldOnline ? '<div class="msg warn">This painting was bought online. Set the tag to Sold.</div>' : ''}
    <form id="form" autocomplete="off" novalidate>
      <div class="edit-layout">
        <div class="photo-col">
          <section class="panel">
            <h2>Photo</h2>
            <div class="preview" id="preview"></div>
            <p class="hint" id="pickHint" hidden>Tap the spot on the photo to zoom into.</p>
            <div class="photo-actions">
              <span class="btn file-btn" id="photoBtn"><span>${w.image ? 'Replace photo' : 'Take or choose a photo'}</span><input type="file" accept="image/*" id="photoInput" aria-label="Painting photo" /></span>
              <button type="button" class="btn secondary" id="refix" ${w.image ? '' : 'hidden'}>Re-crop</button>
            </div>
            <p class="hint">The panel finds the painting’s edges, straightens it and crops it. You can adjust before it’s used.</p>
          </section>
        </div>

        <div>
          <section class="panel">
            <h2>Tag</h2>
            <div class="status-pick">
              ${Object.entries(STATUS)
                .map(([s, v]) => `<label><input type="radio" name="status" value="${s}" ${w.status === s ? 'checked' : ''} /><span class="badge ${s}">${v.label}</span><span class="hint">${v.hint}</span></label>`)
                .join('')}
            </div>
          </section>

          <section class="panel">
            <h2>About the painting</h2>
            <div class="grid two">
              <label class="field full">Title *<input type="text" name="title" value="${esc(w.title)}" required /></label>
              <label class="field">Collection *<select name="collection">${D.collections.map((c) => `<option value="${esc(c.id)}" ${c.id === w.collection ? 'selected' : ''}>${esc(c.num)} · ${esc(c.title)}</option>`).join('')}</select></label>
              <label class="field">Price <span class="hint">Full price in ₹, e.g. 12000. Empty = “Price on request”.</span><input type="text" name="price" inputmode="numeric" value="${esc(w.price)}" placeholder="₹ 12,000" /></label>
              <label class="field">Medium<input type="text" name="medium" value="${esc(w.medium)}" placeholder="Acrylic on canvas" /></label>
              <label class="field">Size<input type="text" name="size" value="${esc(w.size)}" placeholder="A3, or 30 × 40 cm" /></label>
              <label class="field">Year<input type="text" name="year" inputmode="numeric" value="${esc(w.year)}" placeholder="2026" /></label>
              <label class="field">Framing<input type="text" name="framing" value="${esc(w.framing)}" placeholder="Unframed, canvas, black frame…" /></label>
              <label class="field full">Your words about it <span class="hint">A few lines for the painting’s page.</span><textarea name="note">${esc(w.note)}</textarea></label>
              <label class="field full">Describe the painting * <span class="hint">For blind visitors and Google: subject, colours, background.</span><textarea name="alt">${esc(w.alt)}</textarea></label>
            </div>
          </section>

          <section class="panel">
            <h2>Close-ups on the painting’s page</h2>
            <p class="hint" style="margin-top:0">Two zoomed details. Press “Pick on photo”, then tap the spot.</p>
            <div class="grid" id="details"></div>
          </section>

          <section class="panel">
            <h2>Second photo (optional)</h2>
            <p class="hint" style="margin-top:0">The painting framed, on a wall, or in your hands.</p>
            <div class="room-thumb" id="roomThumb"></div>
            <div class="photo-actions">
              <span class="btn secondary file-btn"><span id="roomLabelBtn">${w.room?.image ? 'Replace second photo' : 'Add second photo'}</span><input type="file" accept="image/*" id="roomInput" aria-label="Second photo" /></span>
              <button type="button" class="btn danger small" id="roomClear" ${w.room?.image ? '' : 'hidden'}>Remove</button>
            </div>
            <label class="field" style="margin-top:12px">Caption<input type="text" name="roomLabel" value="${esc(w.room?.label ?? '')}" placeholder="Framed, on a wall" /></label>
          </section>

          <section class="panel">
            <h2>Shipping box (Shiprocket)</h2>
            <p class="hint" style="margin-top:0">The packed parcel. Leave empty for the default: 1 kg, 50 × 40 × 6 cm.</p>
            <div class="grid four">
              ${[['weight', 'Weight (kg)', '1', '0.1'], ['length', 'Length (cm)', '50', '1'], ['breadth', 'Breadth (cm)', '40', '1'], ['height', 'Height (cm)', '6', '1']]
                .map(([k, l, p, step]) => `<label class="field">${l}<input type="number" inputmode="decimal" min="0" step="${step}" data-ship="${k}" value="${esc(w.ship?.[k] ?? '')}" placeholder="${p}" /></label>`)
                .join('')}
            </div>
          </section>

          <section class="panel">
            <h2>Behind the scenes</h2>
            <div class="grid two">
              <label class="field">Web address (ID) <span class="hint">${E.isNew ? 'Made from the title. Can’t change after saving.' : 'Can’t be changed.'}</span><input type="text" name="id" value="${esc(w.id)}" ${E.isNew ? '' : 'readonly'} autocapitalize="off" spellcheck="false" /></label>
              <label class="field">Plate no.<input type="text" name="plate" value="${esc(w.plate)}" inputmode="numeric" /></label>
              <label class="field">Label instead of “Private collection” <span class="hint">Archived only. Keep it true, e.g. “Gifted”.</span><input type="text" name="badge" value="${esc(w.badge ?? '')}" /></label>
              <label class="field">Archive no. <span class="hint">Optional</span><input type="text" name="archiveNo" value="${esc(w.archiveNo ?? '')}" /></label>
              <label class="check full"><input type="checkbox" name="crop" ${w.crop ? 'checked' : ''} /> Hide the bottom-left corner (only for old Instagram screenshots with an avatar there)</label>
            </div>
          </section>

          ${
            E.isNew
              ? ''
              : pinned
                ? '<p class="hint">This painting is shown by name on the home, walls or artist page (or is a collection’s cover), so it can’t be deleted. Mark it Sold or Archived instead.</p>'
                : '<button type="button" class="btn danger" id="delete">Delete painting</button>'
          }
        </div>
      </div>
    </form>
    <div class="bar">
      <span class="state" id="state">${E.isNew ? 'New painting' : 'No changes'}</span>
      <a class="btn secondary view" id="view" href="/artwork/${encodeURIComponent(w.id)}" target="_blank" rel="noopener" ${E.isNew ? 'hidden' : ''}>View ↗</a>
      <button type="button" class="btn" id="save">Save</button>
    </div>`;

  renderPreview();
  renderDetails();
  renderRoom();
  bindEdit();
}

function setDirty(v = true) {
  E.dirty = v;
  const s = $('#state');
  s.textContent = v ? 'Unsaved changes' : 'Saved';
  s.classList.toggle('dirty', v);
}

function renderPreview() {
  const w = E.work;
  const box = $('#preview');
  box.classList.toggle('picking', E.picking !== null);
  $('#pickHint').hidden = E.picking === null;
  if (!w.image) {
    box.innerHTML = '<span class="hint">No photo yet</span>';
    return;
  }
  box.innerHTML = `<div class="wrap"><img src="${esc(photoUrl(w.image))}" alt="" id="previewImg" />${w.details
    .map((d, n) => {
      const [x, y] = String(d.origin).split(/\s+/);
      return `<span class="pin" style="left:${esc(x)};top:${esc(y)}">${n + 1}</span>`;
    })
    .join('')}</div>`;
}

function renderDetails() {
  $('#details').innerHTML = E.work.details
    .map(
      (d, n) => `
    <div class="detail">
      <label class="field">Close-up ${n + 1} name<input type="text" data-d="${n}" data-k="label" value="${esc(d.label)}" /></label>
      <label class="field">Zoom<input type="number" inputmode="decimal" step="0.1" min="1.2" max="5" data-d="${n}" data-k="scale" value="${esc(d.scale)}" /></label>
      <div class="row"><button type="button" class="btn secondary small" data-pick="${n}">${E.picking === n ? 'Tap the photo…' : 'Pick on photo'}</button> Spot: ${esc(d.origin)}</div>
    </div>`
    )
    .join('');
}

function renderRoom() {
  const r = E.work.room;
  $('#roomThumb').innerHTML = r?.image ? `<img src="${esc(photoUrl(r.image))}" alt="" />` : '';
  $('#roomClear').hidden = !r?.image;
  $('#roomLabelBtn').textContent = r?.image ? 'Replace second photo' : 'Add second photo';
}

async function addPhoto(source, kind) {
  const w = E.work;
  const blob = await fixPhoto(source, { mode: kind === 'room' ? 'room' : 'painting' });
  if (!blob) return;
  const save = $('#save');
  save.disabled = true;
  message('ok', 'Uploading the photo…');
  try {
    const base = w.id || slugify(w.title) || 'painting';
    const out = await api(`upload&name=${encodeURIComponent(kind === 'room' ? `${base}-room` : base)}`, { method: 'POST', raw: blob });
    if (kind === 'room') {
      w.room = { image: out.file, w: out.w, h: out.h, label: app.querySelector('[name=roomLabel]').value || 'On a wall' };
      app.querySelector('[name=roomLabel]').value = w.room.label;
      renderRoom();
    } else {
      Object.assign(w, { image: out.file, w: out.w, h: out.h });
      renderPreview();
      $('#refix').hidden = false;
      $('#photoBtn span').textContent = 'Replace photo';
    }
    setDirty();
    message('ok', 'Photo ready. Press Save to put it on the site.');
  } catch (err) {
    if (!err.handled) message('err', err.message);
  } finally {
    save.disabled = false;
  }
}

function bindEdit() {
  const form = $('#form');
  const w = E.work;

  form.addEventListener('submit', (e) => e.preventDefault());
  form.addEventListener('input', (e) => {
    const el = e.target;
    if (el.type === 'file') return;
    if (el.dataset.ship) {
      w.ship = { ...(w.ship || {}), [el.dataset.ship]: el.value === '' ? undefined : Number(el.value) };
    } else if (el.dataset.d !== undefined) {
      w.details[el.dataset.d][el.dataset.k] = el.dataset.k === 'scale' ? Number(el.value) : el.value;
    } else if (el.name === 'roomLabel') {
      if (w.room) w.room.label = el.value;
    } else if (el.name) {
      w[el.name] = el.type === 'checkbox' ? el.checked : el.value;
      if (el.name === 'title') {
        $('#heading').textContent = el.value || 'New painting';
        if (E.isNew && !E.idTouched) {
          w.id = slugify(el.value);
          form.elements.id.value = w.id;
        }
      }
      if (el.name === 'id') {
        E.idTouched = true;
        w.id = slugify(el.value);
      }
    }
    setDirty();
  });
  form.elements.id.addEventListener('change', (e) => {
    e.target.value = w.id;
  });

  $('#photoInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (file) await addPhoto(file, 'painting');
  });
  $('#refix').addEventListener('click', () => addPhoto(photoUrl(w.image), 'painting'));
  $('#roomInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (file) await addPhoto(file, 'room');
  });
  $('#roomClear').addEventListener('click', () => {
    delete w.room;
    app.querySelector('[name=roomLabel]').value = '';
    renderRoom();
    setDirty();
  });

  $('#details').addEventListener('click', (e) => {
    const b = e.target.closest('[data-pick]');
    if (!b) return;
    if (!w.image) return message('err', 'Add the photo first, then pick the close-up spots.');
    E.picking = E.picking === Number(b.dataset.pick) ? null : Number(b.dataset.pick);
    renderDetails();
    renderPreview();
    if (E.picking !== null) $('#preview').scrollIntoView({ block: 'center', behavior: 'smooth' });
  });
  $('#preview').addEventListener('click', (e) => {
    const img = $('#previewImg');
    if (E.picking === null || !img) return;
    const r = img.getBoundingClientRect();
    const x = Math.round(((e.clientX - r.left) / r.width) * 100);
    const y = Math.round(((e.clientY - r.top) / r.height) * 100);
    if (x < 0 || x > 100 || y < 0 || y > 100) return;
    w.details[E.picking].origin = `${x}% ${y}%`;
    E.picking = null;
    setDirty();
    renderDetails();
    renderPreview();
  });

  $('#save').addEventListener('click', save);
  $('#delete')?.addEventListener('click', remove);
}

async function save() {
  const w = E.work;
  if (!w.image) return message('err', 'Add the painting’s photo first.');
  if (!w.title.trim()) return message('err', 'Add a title.');
  const btn = $('#save');
  btn.disabled = true;
  $('#state').textContent = 'Saving…';
  try {
    const out = await api('save', { method: 'POST', body: { work: w, isNew: E.isNew } });
    const i = D.works.findIndex((x) => x.id === out.work.id);
    if (i >= 0) D.works[i] = out.work;
    else D.works.push(out.work);
    const wasNew = E.isNew;
    E.dirty = false;
    if (wasNew) {
      ignoreHash = true;
      location.hash = `#/edit/${encodeURIComponent(out.work.id)}`;
      lastHash = location.hash;
    }
    showEdit(out.work);
    setDirty(false);
    message(
      'ok',
      `Saved. It’s on the site now (give it about 10 seconds).${out.rebuilding ? ' Search-engine pages update in about 2 minutes.' : D.rebuild ? ' The rebuild for search pages didn’t start; it will catch up on the next save.' : ''}`
    );
  } catch (err) {
    if (err.handled) return;
    message('err', err.message, err.problems);
    $('#state').textContent = 'Not saved';
    btn.disabled = false;
  }
}

async function remove() {
  const w = E.work;
  if (!confirm(`Delete “${w.title}” from the site? This can’t be undone. (If it was sold, mark it Sold instead: it stays in the archive.)`)) return;
  try {
    await api('delete', { method: 'POST', body: { id: w.id } });
    D.works = D.works.filter((x) => x.id !== w.id);
    E.dirty = false;
    location.hash = '#/';
  } catch (err) {
    if (!err.handled) message('err', err.message);
  }
}

boot();
