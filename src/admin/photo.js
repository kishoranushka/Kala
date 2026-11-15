/* Photo fixer for the admin panel: straighten a phone photo of a painting and crop it to the painting.
   1. the photo is rotated by EXIF and scaled to ≤ WORK_MAX px
   2. the painting's 4 corners are found automatically (OpenCV.js, loaded on first use from a CDN)
   3. the artist drags any corner that's off (a magnifier shows under the finger), rotates in 90° steps
   4. the 4 corners are mapped to a flat rectangle (perspective correction) and a plain paper/table
      border left around the painting is trimmed
   → resolves with a JPEG Blob (the server turns it into a ≤1400px WebP), or null if cancelled. */

const WORK_MAX = 2600; // px, long side of the photo we work on
const OUT_MAX = 2000; // px, long side of the result sent to the server
const DETECT_MAX = 720; // px, long side used to find the corners
const OPENCV_URL = 'https://cdn.jsdelivr.net/npm/@techstark/opencv-js@4.10.0-release.1/dist/opencv.js';

/* ------------------------------------------------------------------ loading */
export async function loadSource(source) {
  let bitmap;
  if (source instanceof Blob) {
    try {
      bitmap = await createImageBitmap(source, { imageOrientation: 'from-image' });
    } catch {
      bitmap = await imageFrom(URL.createObjectURL(source), true);
    }
  } else {
    bitmap = await imageFrom(source, false);
  }
  const w0 = bitmap.width || bitmap.naturalWidth;
  const h0 = bitmap.height || bitmap.naturalHeight;
  const k = Math.min(1, WORK_MAX / Math.max(w0, h0));
  const c = canvas(Math.round(w0 * k), Math.round(h0 * k));
  const ctx = c.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, c.width, c.height);
  bitmap.close?.();
  return c;
}

function imageFrom(url, revoke) {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.crossOrigin = 'anonymous';
    im.onload = () => {
      if (revoke) URL.revokeObjectURL(url);
      resolve(im);
    };
    im.onerror = () => reject(new Error('The photo couldn’t be opened. Try a JPEG or PNG.'));
    im.src = url;
  });
}

const canvas = (w, h) => Object.assign(document.createElement('canvas'), { width: w, height: h });

/* ------------------------------------------------------------------ rotation */
export function rotateCanvas(src, dir) {
  const c = canvas(src.height, src.width);
  const ctx = c.getContext('2d');
  ctx.translate(c.width / 2, c.height / 2);
  ctx.rotate((dir * Math.PI) / 2);
  ctx.drawImage(src, -src.width / 2, -src.height / 2);
  return c;
}
/* the same points on the rotated photo (dir 1 = clockwise) */
export const rotatePoints = (pts, w, h, dir) => orderCorners(pts.map(([x, y]) => (dir === 1 ? [h - y, x] : [y, w - x])));

/* TL, TR, BR, BL */
export function orderCorners(pts) {
  const bySum = [...pts].sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
  const byDiff = [...pts].sort((a, b) => a[0] - a[1] - (b[0] - b[1]));
  const tl = bySum[0];
  const br = bySum[3];
  const tr = byDiff[3];
  const bl = byDiff[0];
  /* degenerate (e.g. a diamond): fall back to angle order around the centre */
  if (new Set([tl, tr, br, bl]).size < 4) {
    const cx = pts.reduce((s, p) => s + p[0], 0) / 4;
    const cy = pts.reduce((s, p) => s + p[1], 0) / 4;
    const sorted = [...pts].sort((a, b) => Math.atan2(a[1] - cy, a[0] - cx) - Math.atan2(b[1] - cy, b[0] - cx));
    const start = sorted.indexOf(bySum[0]);
    return [0, 1, 2, 3].map((i) => sorted[(start + i) % 4]);
  }
  return [tl, tr, br, bl];
}

export const wholePhoto = (w, h) => [[0, 0], [w, 0], [w, h], [0, h]];
export const insetPhoto = (w, h, f = 0.06) => [[w * f, h * f], [w * (1 - f), h * f], [w * (1 - f), h * (1 - f)], [w * f, h * (1 - f)]];

/* ------------------------------------------------------------------ OpenCV: find the painting */
let cvPromise = null;
export function loadOpenCv() {
  if (cvPromise) return cvPromise;
  cvPromise = new Promise((resolve, reject) => {
    const ready = () => window.cv && typeof window.cv.Mat === 'function';
    const wait = () => {
      const t0 = Date.now();
      const tick = () => {
        if (ready()) return resolve(window.cv);
        if (Date.now() - t0 > 45000) return reject(new Error('OpenCV took too long to start'));
        setTimeout(tick, 60);
      };
      tick();
    };
    if (ready()) return resolve(window.cv);
    const s = document.createElement('script');
    s.src = OPENCV_URL;
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.onload = () => {
      /* some builds expose a Promise (or a thenable Module) instead of the ready module */
      if (window.cv && !ready() && typeof window.cv.then === 'function') {
        const pending = window.cv;
        window.cv = undefined;
        pending.then((m) => {
          /* don't resolve with the thenable itself (it would loop) */
          window.cv = m;
          delete m.then;
        });
      }
      wait();
    };
    s.onerror = () => reject(new Error('Couldn’t load the edge finder (no internet?)'));
    document.head.appendChild(s);
  });
  cvPromise.catch(() => {
    cvPromise = null;
  });
  return cvPromise;
}

/* corners of the painting on `src` (in src pixels), or null if nothing convincing was found */
export async function detectCorners(src) {
  const cv = await loadOpenCv();
  const k = Math.min(1, DETECT_MAX / Math.max(src.width, src.height));
  const small = canvas(Math.round(src.width * k), Math.round(src.height * k));
  small.getContext('2d').drawImage(src, 0, 0, small.width, small.height);

  const mats = [];
  const keep = (m) => (mats.push(m), m);
  try {
    const img = keep(cv.imread(small));
    const total = img.rows * img.cols;
    const gray = keep(new cv.Mat());
    cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY);
    cv.GaussianBlur(gray, gray, new cv.Size(5, 5), 0);
    const kernel = keep(cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3)));
    const candidates = [];

    const scan = (mask, bonus) => {
      const contours = new cv.MatVector();
      const hier = new cv.Mat();
      cv.findContours(mask, contours, hier, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
      for (let i = 0; i < contours.size(); i++) {
        const c = contours.get(i);
        const area = cv.contourArea(c);
        if (area > total * 0.08 && area < total * 0.97) {
          const hull = new cv.Mat();
          cv.convexHull(c, hull);
          const peri = cv.arcLength(hull, true);
          const approx = new cv.Mat();
          cv.approxPolyDP(hull, approx, 0.02 * peri, true);
          if (approx.rows === 4) {
            const pts = [0, 1, 2, 3].map((j) => [approx.data32S[j * 2], approx.data32S[j * 2 + 1]]);
            candidates.push({ pts, area: cv.contourArea(approx), fill: area / cv.contourArea(approx), bonus });
          } else {
            const rect = cv.minAreaRect(hull);
            const rArea = rect.size.width * rect.size.height;
            if (rArea > 0 && area / rArea > 0.9) {
              const pts = cv.RotatedRect.points(rect).map((p) => [p.x, p.y]);
              candidates.push({ pts, area: rArea, fill: area / rArea, bonus: bonus - 0.05 });
            }
          }
          approx.delete();
          hull.delete();
        }
        c.delete();
      }
      contours.delete();
      hier.delete();
    };

    /* 1 · edges at two strengths */
    for (const [lo, hi] of [[25, 80], [50, 150]]) {
      const edges = new cv.Mat();
      cv.Canny(gray, edges, lo, hi);
      cv.dilate(edges, edges, kernel, new cv.Point(-1, -1), 2);
      scan(edges, 0.05);
      edges.delete();
    }
    /* 2 · light/dark split (a painting on a table or wall of a different brightness) */
    const bin = keep(new cv.Mat());
    cv.threshold(gray, bin, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);
    cv.morphologyEx(bin, bin, cv.MORPH_OPEN, kernel, new cv.Point(-1, -1), 2);
    scan(bin, 0);
    cv.bitwise_not(bin, bin);
    scan(bin, 0);
    /* 3 · colourful painting vs plain surroundings (saturation) */
    const rgb = keep(new cv.Mat());
    cv.cvtColor(img, rgb, cv.COLOR_RGBA2RGB);
    const hsv = keep(new cv.Mat());
    cv.cvtColor(rgb, hsv, cv.COLOR_RGB2HSV);
    const planes = new cv.MatVector();
    cv.split(hsv, planes);
    const sat = keep(planes.get(1));
    planes.delete();
    cv.GaussianBlur(sat, sat, new cv.Size(7, 7), 0);
    cv.threshold(sat, sat, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);
    cv.morphologyEx(sat, sat, cv.MORPH_CLOSE, kernel, new cv.Point(-1, -1), 4);
    scan(sat, -0.02);

    if (!candidates.length) return null;
    /* the biggest convincing quadrilateral (paper border, if any, is trimmed later) */
    const score = (c) => c.area / total + c.bonus + (c.fill > 0.92 ? 0.05 : 0) - (isNearlyWhole(c.pts, small) ? 0.5 : 0);
    candidates.sort((a, b) => score(b) - score(a));
    return orderCorners(candidates[0].pts.map(([x, y]) => [x / k, y / k]));
  } finally {
    mats.forEach((m) => m.delete());
  }
}

/* a quad that is just the photo's own frame isn't a find */
function isNearlyWhole(pts, c) {
  const m = Math.max(c.width, c.height) * 0.015;
  return pts.every(([x, y]) => (x < m || x > c.width - m) && (y < m || y > c.height - m));
}

/* ------------------------------------------------------------------ perspective correction */
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/* 3×3 homography taking the unit square corners (0,0)(1,0)(1,1)(0,1) to the quad q */
function squareToQuad(q) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const sx = x0 - x1 + x2 - x3;
  const sy = y0 - y1 + y2 - y3;
  let g = 0;
  let h = 0;
  if (Math.abs(sx) > 1e-9 || Math.abs(sy) > 1e-9) {
    const den = dx1 * dy2 - dx2 * dy1;
    g = (sx * dy2 - dx2 * sy) / den;
    h = (dx1 * sy - sx * dy1) / den;
  }
  return [x1 - x0 + g * x1, x3 - x0 + h * x3, x0, y1 - y0 + g * y1, y3 - y0 + h * y3, y0, g, h, 1];
}

/* the real width/height ratio of the rectangle photographed as `quad`, from a pinhole camera with its
   centre in the middle of the photo (Zhang & He, "Whiteboard scanning and image enhancement").
   null when the photo is nearly head-on or the maths doesn't fit a camera → use the edge lengths. */
export function realRatio(quad, W, H) {
  const [tl, tr, br, bl] = quad.map(([x, y]) => [x - W / 2, y - H / 2, 1]);
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const [m1, m2, m3, m4] = [tl, tr, bl, br];
  const k2 = dot(cross(m1, m4), m3) / dot(cross(m2, m4), m3);
  const k3 = dot(cross(m1, m4), m2) / dot(cross(m3, m4), m2);
  const n2 = m2.map((v, i) => k2 * v - m1[i]);
  const n3 = m3.map((v, i) => k3 * v - m1[i]);
  if (Math.abs(n2[2]) < 1e-6 || Math.abs(n3[2]) < 1e-6) return null;
  const f2 = -(n2[0] * n3[0] + n2[1] * n3[1]) / (n2[2] * n3[2]);
  if (!(f2 > 0)) return null;
  const f = Math.sqrt(f2);
  /* a phone's focal length is roughly 0.5–3× the photo's long side; outside that the estimate is noise */
  const long = Math.max(W, H);
  if (f < long * 0.3 || f > long * 6) return null;
  const r = Math.sqrt((n2[0] ** 2 + n2[1] ** 2) / f2 + n2[2] ** 2) / Math.sqrt((n3[0] ** 2 + n3[1] ** 2) / f2 + n3[2] ** 2);
  return Number.isFinite(r) && r > 0.1 && r < 10 ? r : null;
}

/* the painting inside `quad` (TL,TR,BR,BL on src), flattened to a rectangle */
export function warp(src, quad) {
  const [tl, tr, br, bl] = quad;
  let w = Math.max(dist(tl, tr), dist(bl, br));
  let h = Math.max(dist(tl, bl), dist(tr, br));
  const ratio = realRatio(quad, src.width, src.height);
  /* trust the camera estimate only when it roughly agrees with the edges (guards against odd quads) */
  if (ratio && Math.abs(Math.log(ratio / (w / h))) < 0.35) {
    const area = w * h;
    h = Math.sqrt(area / ratio);
    w = h * ratio;
  }
  const k = Math.min(1, OUT_MAX / Math.max(w, h));
  w = Math.max(8, Math.round(w * k));
  h = Math.max(8, Math.round(h * k));

  const sctx = src.getContext('2d', { willReadFrequently: true });
  const S = sctx.getImageData(0, 0, src.width, src.height).data;
  const SW = src.width;
  const SH = src.height;
  const out = canvas(w, h);
  const octx = out.getContext('2d');
  const O = octx.createImageData(w, h);
  const D = O.data;
  const [a, b, c, d, e, f, g, hh] = squareToQuad(quad);

  let o = 0;
  for (let y = 0; y < h; y++) {
    const v = (y + 0.5) / h;
    for (let x = 0; x < w; x++) {
      const u = (x + 0.5) / w;
      const z = g * u + hh * v + 1;
      let sx = (a * u + b * v + c) / z - 0.5;
      let sy = (d * u + e * v + f) / z - 0.5;
      if (sx < 0) sx = 0;
      else if (sx > SW - 1.001) sx = SW - 1.001;
      if (sy < 0) sy = 0;
      else if (sy > SH - 1.001) sy = SH - 1.001;
      const x0 = sx | 0;
      const y0 = sy | 0;
      const fx = sx - x0;
      const fy = sy - y0;
      const i00 = (y0 * SW + x0) * 4;
      const i10 = i00 + 4;
      const i01 = i00 + SW * 4;
      const i11 = i01 + 4;
      for (let ch = 0; ch < 3; ch++) {
        const top = S[i00 + ch] + (S[i10 + ch] - S[i00 + ch]) * fx;
        const bot = S[i01 + ch] + (S[i11 + ch] - S[i01 + ch]) * fx;
        D[o + ch] = top + (bot - top) * fy;
      }
      D[o + 3] = 255;
      o += 4;
    }
  }
  octx.putImageData(O, 0, 0);
  return out;
}

/* ------------------------------------------------------------------ trim a plain border */
/* how many px of plain border (paper, table, wall) each side has: { top, right, bottom, left } */
export function findBorder(c) {
  const k = Math.min(1, 600 / Math.max(c.width, c.height));
  const s = canvas(Math.max(1, Math.round(c.width * k)), Math.max(1, Math.round(c.height * k)));
  s.getContext('2d').drawImage(c, 0, 0, s.width, s.height);
  const { data, width: W, height: H } = s.getContext('2d').getImageData(0, 0, s.width, s.height);
  const px = (x, y) => {
    const i = (y * W + x) * 4;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const line = (side, n) => {
    const out = [];
    if (side === 'top' || side === 'bottom') {
      const y = side === 'top' ? n : H - 1 - n;
      for (let x = 0; x < W; x++) out.push(px(x, y));
    } else {
      const x = side === 'left' ? n : W - 1 - n;
      for (let y = 0; y < H; y++) out.push(px(x, y));
    }
    return out;
  };
  const median = (arr) => [0, 1, 2].map((ch) => arr.map((p) => p[ch]).sort((a, b) => a - b)[arr.length >> 1]);
  const near = (p, q, t) => Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) + Math.abs(p[2] - q[2]) < t;
  const share = (pts, ref, t) => pts.filter((p) => near(p, ref, t)).length / pts.length;

  const result = {};
  for (const side of ['top', 'right', 'bottom', 'left']) {
    const depth = side === 'top' || side === 'bottom' ? H : W;
    const max = Math.floor(depth * 0.22);
    const skip = Math.max(2, Math.ceil(depth * 0.04)); // the corners may sit a little outside: skip that sliver
    /* the border starts with a plain line (paper, table…) near the edge */
    /* plain runs of lines (≥3 in a row) that start near the edge: a sliver of table, then the paper…
       the border ends where the last of them ends */
    let found = 0;
    for (let n = 0; n < Math.max(skip, found + 1) && n < max; n++) {
      const l = line(side, n);
      const ref = median(l);
      if (share(l, ref, 60) <= 0.9) continue;
      let end = n + 1;
      while (end < max && share(line(side, end), ref, 70) >= 0.88) end++;
      if (end - n >= 3) found = end;
      n = end - 1;
    }
    result[side] = found ? Math.round((found + 1) / k) : 0;
  }
  return result;
}

export function cropCanvas(c, { top, right, bottom, left }) {
  const w = c.width - left - right;
  const h = c.height - top - bottom;
  if (w < c.width * 0.4 || h < c.height * 0.4) return c; // trimming that much is surely wrong
  const out = canvas(w, h);
  out.getContext('2d').drawImage(c, left, top, w, h, 0, 0, w, h);
  return out;
}

export function toJpeg(c) {
  return new Promise((resolve) => c.toBlob((b) => resolve(b), 'image/jpeg', 0.92));
}

/* ------------------------------------------------------------------ the fixer dialog */
/* fixPhoto(source, { mode: 'painting' | 'room' }) → Promise<Blob | null> */
export function fixPhoto(source, { mode = 'painting' } = {}) {
  return new Promise((resolve) => {
    const root = document.createElement('div');
    root.className = 'fixer';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'Fix the photo');
    root.innerHTML = `
      <div class="fixer-top">
        <button type="button" class="btn ghost" data-act="cancel">Cancel</button>
        <strong class="fixer-title">Fix the photo</strong>
        <button type="button" class="btn" data-act="next">Next</button>
      </div>
      <p class="fixer-help" data-help>Opening the photo…</p>
      <div class="fixer-stage" data-stage>
        <div class="fixer-frame" data-frame>
          <svg class="fixer-svg" data-svg aria-hidden="true">
            <path class="fixer-shade" data-shade fill-rule="evenodd"></path>
            <polygon class="fixer-quad" data-quad></polygon>
          </svg>
        </div>
        <canvas class="fixer-loupe" data-loupe width="150" height="150" hidden></canvas>
      </div>
      <div class="fixer-tools" data-tools>
        <button type="button" class="btn secondary small" data-act="left" aria-label="Rotate left">↺ Rotate</button>
        <button type="button" class="btn secondary small" data-act="right" aria-label="Rotate right">Rotate ↻</button>
        <button type="button" class="btn secondary small" data-act="detect">Find edges</button>
        <button type="button" class="btn secondary small" data-act="whole">Whole photo</button>
      </div>
      <div class="fixer-tools" data-result-tools hidden>
        <label class="check"><input type="checkbox" data-trim ${mode === 'painting' ? 'checked' : ''}/> Trim plain border (paper, table)</label>
        <button type="button" class="btn secondary small" data-act="back">Back to corners</button>
      </div>`;
    document.body.appendChild(root);
    document.body.classList.add('fixer-open');

    const $ = (s) => root.querySelector(s);
    const frame = $('[data-frame]');
    const svg = $('[data-svg]');
    const help = $('[data-help]');
    const loupe = $('[data-loupe]');
    let src = null;
    let quad = null;
    let view = null; // the <canvas> shown
    let step = 'corners';
    let warped = null;
    let busy = false;
    const handles = [];

    const close = (value) => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('fixer-open');
      root.remove();
      resolve(value);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') close(null);
    };
    document.addEventListener('keydown', onKey);

    function showCanvas(c) {
      view?.remove();
      view = c;
      c.className = 'fixer-img';
      frame.prepend(c);
      frame.style.aspectRatio = `${c.width} / ${c.height}`;
      frame.style.setProperty('--ar', String(c.width / c.height));
    }

    function drawCorners() {
      svg.style.display = step === 'corners' ? '' : 'none'; // (`hidden` doesn't apply to <svg>)
      if (step !== 'corners') return;
      svg.setAttribute('viewBox', `0 0 ${src.width} ${src.height}`);
      const pts = quad.map((p) => p.join(',')).join(' ');
      $('[data-quad]').setAttribute('points', pts);
      $('[data-shade]').setAttribute('d', `M0 0H${src.width}V${src.height}H0Z M${quad.map((p) => p.join(' ')).join(' L')}Z`);
      const r = (22 * src.width) / Math.max(1, frame.clientWidth); // ~22 css px
      if (!handles.length) {
        for (let i = 0; i < 4; i++) {
          const h = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          h.setAttribute('class', 'fixer-handle');
          h.dataset.i = i;
          svg.appendChild(h);
          handles.push(h);
        }
      }
      handles.forEach((h, i) => {
        h.setAttribute('cx', quad[i][0]);
        h.setAttribute('cy', quad[i][1]);
        h.setAttribute('r', r);
      });
    }

    async function detect() {
      help.textContent = 'Finding the painting’s edges…';
      try {
        const found = await detectCorners(src);
        if (found) {
          quad = found;
          help.textContent = 'Check the corners: drag any that are off onto the painting’s corners.';
        } else {
          quad ??= mode === 'room' ? wholePhoto(src.width, src.height) : insetPhoto(src.width, src.height);
          help.textContent = 'Couldn’t find the edges by myself. Drag the 4 corners onto the painting’s corners.';
        }
      } catch (err) {
        quad ??= insetPhoto(src.width, src.height);
        help.textContent = `${err.message}. Drag the 4 corners onto the painting’s corners.`;
      }
      drawCorners();
    }

    /* dragging a corner (mouse, finger or pen) */
    let dragging = -1;
    const toPhoto = (e) => {
      const r = frame.getBoundingClientRect();
      return [Math.min(Math.max(((e.clientX - r.left) / r.width) * src.width, 0), src.width), Math.min(Math.max(((e.clientY - r.top) / r.height) * src.height, 0), src.height)];
    };
    svg.addEventListener('pointerdown', (e) => {
      if (step !== 'corners') return;
      const p = toPhoto(e);
      /* the nearest corner within reach (generous for fingers) */
      const reach = (48 * src.width) / frame.clientWidth;
      let best = -1;
      let bestD = Infinity;
      quad.forEach((q, i) => {
        const d = dist(q, p);
        if (d < bestD) [best, bestD] = [i, d];
      });
      if (bestD > reach) return;
      dragging = best;
      svg.setPointerCapture(e.pointerId);
      e.preventDefault();
      showLoupe(e);
    });
    svg.addEventListener('pointermove', (e) => {
      if (dragging < 0) return;
      quad[dragging] = toPhoto(e);
      drawCorners();
      showLoupe(e);
    });
    const endDrag = () => {
      if (dragging < 0) return;
      dragging = -1;
      loupe.hidden = true;
      quad = orderCorners(quad);
      drawCorners();
    };
    svg.addEventListener('pointerup', endDrag);
    svg.addEventListener('pointercancel', endDrag);

    /* a magnifier in the opposite top corner, so the finger doesn't hide the spot */
    function showLoupe(e) {
      const [x, y] = quad[dragging];
      const ctx = loupe.getContext('2d');
      const zoom = 3;
      const size = loupe.width;
      const srcSize = (size / zoom) * (src.width / frame.clientWidth);
      ctx.fillStyle = '#222';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(src, x - srcSize / 2, y - srcSize / 2, srcSize, srcSize, 0, 0, size, size);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(size / 2, 0);
      ctx.lineTo(size / 2, size);
      ctx.moveTo(0, size / 2);
      ctx.lineTo(size, size / 2);
      ctx.stroke();
      const stage = $('[data-stage]').getBoundingClientRect();
      const leftSide = e.clientX > stage.left + stage.width / 2;
      loupe.style.left = leftSide ? '8px' : '';
      loupe.style.right = leftSide ? '' : '8px';
      loupe.hidden = false;
    }

    function result() {
      const flat = warp(src, quad);
      const trim = $('[data-trim]').checked ? findBorder(flat) : null;
      return trim ? cropCanvas(flat, trim) : flat;
    }

    function toResult() {
      step = 'result';
      help.textContent = 'This is how it will look on the site.';
      warped = result();
      showCanvas(warped);
      drawCorners();
      $('[data-tools]').hidden = true;
      $('[data-result-tools]').hidden = false;
      $('[data-act="next"]').textContent = 'Use this photo';
    }

    function toCorners() {
      step = 'corners';
      help.textContent = 'Drag any corner that’s off onto the painting’s corners.';
      showCanvas(src);
      drawCorners();
      $('[data-tools]').hidden = false;
      $('[data-result-tools]').hidden = true;
      $('[data-act="next"]').textContent = 'Next';
    }

    root.addEventListener('click', async (e) => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (!act || busy || !src) {
        if (act === 'cancel') close(null);
        return;
      }
      if (act === 'cancel') return close(null);
      if (act === 'left' || act === 'right') {
        const dir = act === 'right' ? 1 : -1;
        quad = rotatePoints(quad, src.width, src.height, dir);
        src = rotateCanvas(src, dir);
        showCanvas(src);
        drawCorners();
      }
      if (act === 'detect') {
        busy = true;
        await detect();
        busy = false;
      }
      if (act === 'whole') {
        quad = wholePhoto(src.width, src.height);
        drawCorners();
      }
      if (act === 'back') toCorners();
      if (act === 'next') {
        if (step === 'corners') {
          busy = true;
          help.textContent = 'Straightening…';
          await new Promise((r) => setTimeout(r, 30));
          try {
            toResult();
          } finally {
            busy = false;
          }
        } else {
          busy = true;
          help.textContent = 'Preparing the photo…';
          close(await toJpeg(warped));
        }
      }
    });
    $('[data-trim]').addEventListener('change', () => {
      if (step === 'result') toResult();
    });
    window.addEventListener('resize', () => step === 'corners' && src && drawCorners());

    (async () => {
      try {
        src = await loadSource(source);
      } catch (err) {
        help.textContent = err.message;
        return;
      }
      showCanvas(src);
      if (mode === 'room') {
        quad = wholePhoto(src.width, src.height);
        help.textContent = 'Whole photo kept. Press “Find edges” to crop to the painting instead, or drag the corners.';
        drawCorners();
      } else {
        quad = insetPhoto(src.width, src.height);
        drawCorners();
        busy = true;
        await detect();
        busy = false;
      }
    })();
  });
}
