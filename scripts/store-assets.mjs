// Genera el icono y el material de la ficha de Google Play (solo para desarrollo).
import { chromium } from 'playwright-core';
import fs from 'fs';
const GB = fs.readFileSync(new URL('./.guide-bundle.js', import.meta.url), 'utf8');
const FONT = `<style>@font-face{font-family:Nunito;src:url(data:font/woff2;base64,${fs.readFileSync(new URL('../www/fonts/nunito.woff2', import.meta.url)).toString('base64')}) format('woff2');font-weight:200 1000}</style>`;
const b = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });

// Silueta blanca del personaje en una pose, como <svg> en texto
async function figure(anim, beat, colors) {
  const p = await b.newPage();
  await p.setContent(`<div id="c" style="width:300px;height:400px"></div><script>${GB}</script>`);
  const svg = await p.evaluate(({ anim, beat, colors }) => {
    const g = G.createGuide(document.getElementById('c')); g.seek(anim, beat);
    const el = document.querySelector('svg');
    el.querySelectorAll('ellipse').forEach((e) => { if (e.getAttribute('fill') && e.getAttribute('fill').startsWith('rgba')) e.remove(); });
    el.querySelectorAll('*').forEach((e) => {
      for (const a of ['fill', 'stroke']) {
        const v = e.getAttribute(a);
        if (v === '#5a2a47') e.setAttribute(a, colors.body);
        else if (v === '#f58aa6') e.setAttribute(a, colors.tutu);
        else if (v === '#fff') e.setAttribute(a, colors.eyes);
      }
    });
    el.removeAttribute('class');
    return el.outerHTML;
  }, { anim, beat, colors });
  await p.close();
  return svg;
}
async function shot(html, w, h, out, transparent = false) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.setContent(`<html><head>${FONT}</head><body style="margin:0">${html}</body></html>`);
  await p.waitForTimeout(150);
  await p.screenshot({ path: out, omitBackground: transparent });
  await p.close();
}
const WHITE = { body: '#ffffff', tutu: '#ffd1dc', eyes: '#e2527d' };
const BG = 'linear-gradient(145deg,#ffa9bd 0%,#ec5f86 55%,#c9406a 100%)';
const fig = await figure('celebrate', 1, WHITE);
const big = (svg, h) => svg.replace('<svg', `<svg style="height:${h}px;display:block"`);

// Icono de la app (1024 para Capacitor, 512 para Play)
const iconHtml = (size, scale) => `<div style="width:${size}px;height:${size}px;background:${BG};display:grid;place-items:center">${big(fig, size * scale)}</div>`;
await shot(iconHtml(1024, 0.98), 1024, 1024, 'assets/icon-only.png');
await shot(`<div style="width:1024px;height:1024px;background:${BG}"></div>`, 1024, 1024, 'assets/icon-background.png');
await shot(`<div style="width:1024px;height:1024px;display:grid;place-items:center">${big(fig, 1024 * 0.68)}</div>`, 1024, 1024, 'assets/icon-foreground.png', true);
await shot(iconHtml(512, 0.98), 512, 512, 'store/icono-512.png');
// Pantalla de carga
const splash = `<div style="width:2732px;height:2732px;background:#fff3f1;display:grid;place-items:center"><div style="width:900px;height:900px;border-radius:50%;background:${BG};display:grid;place-items:center">${big(fig, 760)}</div></div>`;
await shot(splash, 2732, 2732, 'assets/splash.png');
fs.copyFileSync('assets/splash.png', 'assets/splash-dark.png');

// Grafico de funciones 1024x500
const jete = await figure('grandjete', 4, WHITE);
for (const lang of ['es', 'en']) {
  const T = lang === 'es'
    ? ['Ballet en casa', 'Teoría, técnica y físico en 3 niveles, con una guía animada que te enseña cada paso.']
    : ['Ballet at home', 'Theory, technique and fitness across 3 levels, with an animated guide for every step.'];
  const html = `<div style="width:1024px;height:500px;background:${BG};display:flex;align-items:center;font-family:Nunito,system-ui,sans-serif;color:#fff;overflow:hidden;position:relative">
    <div style="position:absolute;right:-60px;top:-80px;width:520px;height:520px;border-radius:50%;background:rgba(255,255,255,.12)"></div>
    <div style="padding:0 0 0 70px;width:560px;z-index:1">
      <div style="font-size:112px;font-weight:900;letter-spacing:-2px;line-height:1">Plié</div>
      <div style="font-size:40px;font-weight:800;margin:10px 0 18px">${T[0]}</div>
      <div style="font-size:24px;font-weight:600;line-height:1.35;opacity:.95">${T[1]}</div>
    </div>
    <div style="flex:1;display:grid;place-items:center;z-index:1;padding-right:24px">${big(jete, 400)}</div>
  </div>`;
  await shot(html, 1024, 500, `store/grafico-funciones-${lang}.png`);
}
await b.close();
console.log('ok');
