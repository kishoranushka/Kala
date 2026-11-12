/* Tell IndexNow search engines (Bing — which also feeds DuckDuckGo, Yahoo and ChatGPT search —
   Yandex, Seznam, Naver…) that the site's pages are new or changed. Run AFTER a deploy is live:

     npm run indexnow                 every URL in the live sitemap
     npm run indexnow -- /shop /artwork/shiva    just these paths

   The key file public/<KEY>.txt must be deployed first (IndexNow fetches it to prove ownership).
   Google does not use IndexNow: use Search Console → URL inspection → Request indexing. */

const SITE = 'https://kala.anushkakishor.in';
const KEY = '046dc7b6709a8f1aff26d4806e698522';

const args = process.argv.slice(2);
let urls;
if (args.length) {
  urls = args.map((p) => (p.startsWith('http') ? p : SITE + (p.startsWith('/') ? p : `/${p}`)));
} else {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml → HTTP ${res.status}`);
  urls = [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => u.startsWith(SITE));
}

const keyCheck = await fetch(`${SITE}/${KEY}.txt`);
if (!keyCheck.ok || (await keyCheck.text()).trim() !== KEY) {
  throw new Error(`${SITE}/${KEY}.txt is not live yet — deploy first, then run this again.`);
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls }),
});
/* 200 = accepted, 202 = accepted (key check pending); 4xx = see https://www.indexnow.org/documentation */
console.log(`[indexnow] ${urls.length} URLs → HTTP ${res.status} ${res.statusText}`);
if (res.status >= 400) {
  console.log(await res.text());
  process.exitCode = 1;
}
