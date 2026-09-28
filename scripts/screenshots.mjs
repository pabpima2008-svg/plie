// Capturas para la ficha de Google Play (1080x1920), en ES y EN.
import { chromium } from 'playwright-core';
import http from 'http'; import fs from 'fs'; import path from 'path';
const root = new URL('../www/', import.meta.url).pathname;
const types = { js: 'text/javascript', css: 'text/css', html: 'text/html', woff2: 'font/woff2' };
const srv = http.createServer((q, r) => { const u = q.url.split('?')[0]; const f = path.join(root, u === '/' ? 'index.html' : u); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': types[f.split('.').pop()] || 'text/plain' }); r.end(d); }); }).listen(8190);
const FONT = fs.readFileSync(new URL('../www/fonts/nunito.woff2', import.meta.url)).toString('base64');
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });

const CAPS = {
  es: ['Tu camino de ballet, día a día', 'Tu nivel en cada modalidad', 'Una guía animada te enseña cada paso', 'Detalles de colocación en cada ejercicio', 'Teoría con mini test', 'Sesión combinada, distinta cada vez'],
  en: ['Your ballet path, day by day', 'Your level in each track', 'An animated guide shows every step', 'Placement details in every exercise', 'Theory with a mini quiz', 'A combined session, different every time']
};

for (const lang of ['es', 'en']) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 780 }, deviceScaleFactor: 2, locale: lang === 'es' ? 'es-ES' : 'en-GB' });
  const p = await ctx.newPage();
  await p.goto('http://localhost:8190/');
  await p.selectOption('#mSel', '4'); await p.selectOption('#ySel', '2010'); await p.click('#ageOk');
  await p.click('[data-y="2"]');
  await p.click('[data-tr="teoria"][data-v="2"]'); await p.click('[data-tr="tecnica"][data-v="2"]'); await p.click('[data-tr="fisico"][data-v="2"]');
  await p.click('#selfOk'); await p.waitForSelector('.lvl-pick'); await p.waitForTimeout(700);
  const raw = [];
  const snap = async () => { await p.waitForTimeout(900); raw.push(await p.screenshot()); };
  // premium para que no salga el hueco del anuncio en las capturas
  await p.evaluate(() => { const s = window.__plie.state; s.premium = true; });
  await snap(); const placement = raw.pop();
  await p.click('#placeOk'); await p.waitForSelector('.mode');
  await p.evaluate(() => {
    const P = window.__plie, s = P.state, d = new Date();
    const ds = (k) => { const x = new Date(d); x.setDate(x.getDate() - k); return x.toISOString().slice(0, 10); };
    for (let i = 1; i <= 6; i++) s.prog.tracks.tecnica.dates[i] = ds(7 - i);
    for (let i = 1; i <= 4; i++) s.prog.tracks.teoria.dates[i] = ds(5 - i);
    for (let i = 1; i <= 3; i++) s.prog.tracks.fisico.dates[i] = ds(4 - i);
    s.prog.minutes = 142; P.saveProg(); s.testMode = true; P.go('home');
  });
  await snap(); const home = raw.pop();
  // Tecnica: dia con plie
  await p.evaluate(() => window.__plie.startTrackDay('tecnica', 9));
  const idx = await p.evaluate(() => window.__plie.S.steps.findIndex(s => s.ex && s.ex.id === 'develop' ) );
  await p.evaluate((i) => { const P = window.__plie; for (let k = 0; k < i; k++) document.getElementById('nextBtn').click(); }, Math.max(0, idx));
  await p.waitForTimeout(2600); const player = await p.screenshot();
  await p.evaluate(() => document.querySelector('.details').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(500); const details = await p.screenshot();
  await p.evaluate(() => window.__plie.go('home'));
  // Teoria
  await p.evaluate(() => window.__plie.startTrackDay('teoria', 5));
  await p.waitForTimeout(1400); const theory = await p.screenshot();
  await p.evaluate(() => window.__plie.go('combo'));
  await p.waitForTimeout(1000); const combo = await p.screenshot();
  const shots = [home, placement, player, details, theory, combo];
  await ctx.close();

  // Componer 1080x1920 con titulo
  const fr = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (let i = 0; i < shots.length; i++) {
    const img = 'data:image/png;base64,' + shots[i].toString('base64');
    await fr.setContent(`<html><head><style>@font-face{font-family:Nunito;src:url(data:font/woff2;base64,${FONT}) format('woff2');font-weight:200 1000}</style></head>
      <body style="margin:0;width:1080px;height:1920px;background:linear-gradient(160deg,#ffb3c4,#ec5f86 60%,#c9406a);font-family:Nunito,sans-serif;overflow:hidden">
      <div style="height:330px;display:grid;place-items:center;text-align:center;padding:0 70px;color:#fff;font-size:76px;font-weight:900;line-height:1.08;letter-spacing:-.5px">${CAPS[lang][i]}</div>
      <div style="margin:0 auto;width:800px;height:1600px;border-radius:64px;overflow:hidden;box-shadow:0 30px 80px rgba(90,20,50,.35);background:#fff3f1">
        <img src="${img}" style="width:800px;display:block">
      </div></body></html>`);
    await fr.waitForTimeout(150);
    await fr.screenshot({ path: `store/captura-${lang}-${i + 1}.png` });
  }
  await fr.close();
}
await b.close(); srv.close();
console.log('ok');
