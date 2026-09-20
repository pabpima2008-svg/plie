import { CLASSES } from './data.js';
import { STR } from './i18n.js';
import { Ads, Billing, CONFIG, adProfile, isNative } from './ads.js';
import { App as CapApp } from '@capacitor/app';

/* ---------- utilidades ---------- */
const $app = document.getElementById('app');
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } }
};

const state = {
  lang: LS.get('lang', (navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en'),
  birth: LS.get('birth', null), // { y, m }  (m = 0..11)
  premium: LS.get('premium', false),
  done: LS.get('done', {}),
  screen: 'home',
  classId: null,
  changingAge: false
};

const t = (k, vars) => {
  let s = (STR[state.lang] && STR[state.lang][k]) ?? STR.es[k] ?? k;
  if (vars && typeof s === 'string') for (const key in vars) s = s.replace('{' + key + '}', vars[key]);
  return s;
};
const L = (obj) => obj[state.lang] || obj.es;
const getClass = (id) => CLASSES.find(c => c.id === id);
const totalMin = (c) => Math.round(c.exercises.reduce((a, e) => a + e.dur, 0) / 60);
const fmt = (sec) => {
  sec = Math.max(0, Math.ceil(sec));
  return String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
};

/* Edad conservadora: si el mes de cumpleaños aun no ha terminado, se cuenta un año menos. */
function currentAge() {
  if (!state.birth) return null;
  const now = new Date();
  let age = now.getFullYear() - state.birth.y;
  if (now.getMonth() <= state.birth.m) age -= 1;
  return Math.max(0, age);
}
const profile = () => adProfile(currentAge() ?? 0);

const COLORS = {
  pink: ['#f9bfd6', '#e0629a'],
  lilac: ['#d5c9f7', '#8b7fd6'],
  peach: ['#ffd9bd', '#f0894f']
};

/* ---------- audio (metronomo y avisos) ---------- */
const audio = { ctx: null, metro: null };
function ensureAudio() {
  try {
    if (!audio.ctx) audio.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (audio.ctx.state === 'suspended') audio.ctx.resume();
  } catch { /* sin audio */ }
}
function blip(freq, dur = 0.06, vol = 0.12, delay = 0) {
  if (!audio.ctx) return;
  try {
    const o = audio.ctx.createOscillator();
    const g = audio.ctx.createGain();
    const t0 = audio.ctx.currentTime + delay;
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(audio.ctx.destination);
    o.start(t0); o.stop(t0 + dur + 0.02);
  } catch { /* nada */ }
}
function stopMetro() { if (audio.metro) { clearInterval(audio.metro); audio.metro = null; } }
function startMetro(bpm) {
  stopMetro();
  if (!bpm || !P.metro) return;
  let beat = 0;
  const tick = () => { blip(beat % 4 === 0 ? 990 : 740, 0.05, 0.1); beat++; };
  tick();
  audio.metro = setInterval(tick, 60000 / bpm);
}

/* ---------- pantalla encendida durante la clase ---------- */
let wakeLock = null;
async function keepAwake(on) {
  try {
    if (on && navigator.wakeLock) wakeLock = await navigator.wakeLock.request('screen');
    else if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch { /* no disponible */ }
}

/* ---------- anuncios ---------- */
function setAdHeight(h) { document.documentElement.style.setProperty('--ad-h', (h || 0) + 'px'); }
Ads.onHeight = setAdHeight;

function screenWantsAds() { return ['home', 'detail', 'finish', 'settings'].includes(state.screen); }
async function syncAds() {
  const want = !state.premium && state.birth && screenWantsAds();
  if (want) {
    if (isNative()) { if (!Ads.visible) await Ads.showBanner(); }
    else setAdHeight(56); // hueco de vista previa web
  } else {
    if (isNative()) { if (Ads.visible) await Ads.hideBanner(); }
    setAdHeight(0);
  }
}
const adSlotHtml = () => (!isNative() && !state.premium && screenWantsAds() && state.birth)
  ? `<div class="ad-slot" aria-hidden="true"><span>${t('adLabel')}</span> · ${profile()}</div>` : '';

/* ---------- reproductor ---------- */
const P = {
  i: 0, running: false, endAt: 0, remainingMs: 0, timer: null,
  metro: LS.get('metro', true)
};

function go(screen, extra = {}) {
  if (state.screen === 'player' && screen !== 'player') { clearInterval(P.timer); stopMetro(); keepAwake(false); }
  Object.assign(state, extra);
  state.screen = screen;
  render();
  window.scrollTo(0, 0);
}

function startClass(id) {
  state.classId = id;
  P.i = 0;
  ensureAudio();
  keepAwake(true);
  go('player');
  startExercise(0);
}

function startExercise(i) {
  const c = getClass(state.classId);
  P.i = i;
  const ex = c.exercises[i];
  P.remainingMs = ex.dur * 1000;
  P.endAt = Date.now() + P.remainingMs;
  P.running = true;
  renderPlayer();
  startMetro(ex.bpm);
  clearInterval(P.timer);
  P.timer = setInterval(tickPlayer, 200);
}

function tickPlayer() {
  if (!P.running) return;
  const c = getClass(state.classId);
  const ex = c.exercises[P.i];
  P.remainingMs = P.endAt - Date.now();
  if (P.remainingMs <= 0) {
    blip(880, 0.12, 0.15); blip(880, 0.12, 0.15, 0.2); blip(1175, 0.25, 0.15, 0.4);
    if (P.i + 1 < c.exercises.length) startExercise(P.i + 1);
    else finishClass();
    return;
  }
  updateTimerUi(ex);
}

function updateTimerUi(ex) {
  const el = document.getElementById('time');
  if (!el) return;
  el.textContent = fmt(P.remainingMs / 1000);
  const frac = Math.max(0, Math.min(1, P.remainingMs / (ex.dur * 1000)));
  const ring = document.getElementById('ring');
  if (ring) ring.style.strokeDashoffset = String(565.49 * (1 - frac));
}

function togglePause() {
  P.running = !P.running;
  if (P.running) {
    P.endAt = Date.now() + P.remainingMs;
    ensureAudio();
    startMetro(getClass(state.classId).exercises[P.i].bpm);
  } else {
    stopMetro();
  }
  const b = document.getElementById('pauseBtn');
  if (b) b.textContent = P.running ? t('pause') : t('resume');
}

function finishClass() {
  clearInterval(P.timer); stopMetro(); keepAwake(false);
  state.done[state.classId] = (state.done[state.classId] || 0) + 1;
  LS.set('done', state.done);
  go('finish');
}

/* ---------- ventanas ---------- */
function openModal(html) {
  closeModal();
  const d = document.createElement('div');
  d.className = 'overlay';
  d.id = 'modal';
  d.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
  document.body.appendChild(d);
  return d;
}
function closeModal() { const m = document.getElementById('modal'); if (m) m.remove(); }

function showGate(onOk) {
  const a = 6 + Math.floor(Math.random() * 4);
  const b = 6 + Math.floor(Math.random() * 4);
  const d = openModal(`
    <h2>${t('gateTitle')}</h2>
    <p>${t('gateText')}</p>
    <p class="sum">${a} × ${b} = ?</p>
    <input id="gateInput" type="number" inputmode="numeric" autocomplete="off" aria-label="${a} × ${b}">
    <p class="err" id="gateErr" hidden>${t('gateWrong')}</p>
    <div class="row">
      <button class="btn secondary" id="gateCancel">${t('cancel')}</button>
      <button class="btn" id="gateOk">${t('ok')}</button>
    </div>`);
  const input = d.querySelector('#gateInput');
  setTimeout(() => input.focus(), 50);
  d.querySelector('#gateCancel').onclick = closeModal;
  const check = () => {
    if (parseInt(input.value, 10) === a * b) { closeModal(); onOk(); }
    else { d.querySelector('#gateErr').hidden = false; input.value = ''; }
  };
  d.querySelector('#gateOk').onclick = check;
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
}

function askQuit() {
  if (document.getElementById('modal')) return;
  const wasRunning = P.running;
  if (wasRunning) togglePause();
  const d = openModal(`
    <h2>${t('quitAsk')}</h2>
    <div class="row">
      <button class="btn secondary" id="qYes">${t('yes')}</button>
      <button class="btn" id="qNo">${t('no')}</button>
    </div>`);
  d.querySelector('#qYes').onclick = () => { closeModal(); go('home'); };
  d.querySelector('#qNo').onclick = () => { closeModal(); if (wasRunning) togglePause(); };
}

function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add('show'), 10);
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2600);
}

/* ---------- pantallas ---------- */
function logo() {
  return `<svg class="logo" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f9bfd6"/><stop offset="1" stop-color="#8b7fd6"/></linearGradient></defs><circle cx="24" cy="24" r="22" fill="url(#lg)"/><path d="M17 35V13h9.5a6.5 6.5 0 0 1 0 13H17" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

function renderAge() {
  const now = new Date().getFullYear();
  const months = t('months').map((m, i) => `<option value="${i}">${m}</option>`).join('');
  let years = '';
  for (let y = now; y >= now - 100; y--) years += `<option value="${y}">${y}</option>`;
  const back = state.changingAge && state.birth ? `<button class="link" id="ageBack">${t('back')}</button>` : '';
  $app.innerHTML = `
    <main class="screen center">
      ${logo()}
      <h1>${t('ageTitle')}</h1>
      <p class="muted">${t('ageText')}</p>
      <div class="fields">
        <select id="mSel" aria-label="${t('month')}"><option value="" selected disabled>${t('month')}</option>${months}</select>
        <select id="ySel" aria-label="${t('year')}"><option value="" selected disabled>${t('year')}</option>${years}</select>
      </div>
      <p class="err" id="ageErr" hidden>${t('ageError')}</p>
      <button class="btn big" id="ageOk">${t('continue')}</button>
      ${back}
      <div class="lang-row">${langButtons()}</div>
    </main>`;
  document.getElementById('ageOk').onclick = () => {
    const m = document.getElementById('mSel').value;
    const y = document.getElementById('ySel').value;
    if (m === '' || y === '') { document.getElementById('ageErr').hidden = false; return; }
    state.birth = { y: parseInt(y, 10), m: parseInt(m, 10) };
    LS.set('birth', state.birth);
    const wasChanging = state.changingAge;
    state.changingAge = false;
    initServices(true).then(() => go(wasChanging ? 'settings' : 'home'));
  };
  const b = document.getElementById('ageBack');
  if (b) b.onclick = () => { state.changingAge = false; go('settings'); };
  bindLang();
}

function langButtons() {
  return ['es', 'en'].map(l => `<button class="chip ${state.lang === l ? 'on' : ''}" data-lang="${l}">${l === 'es' ? 'Español' : 'English'}</button>`).join('');
}
function bindLang() {
  document.querySelectorAll('[data-lang]').forEach(b => {
    b.onclick = () => { state.lang = b.dataset.lang; LS.set('lang', state.lang); document.documentElement.lang = state.lang; render(); };
  });
}

function classCard(c) {
  const [c1, c2] = COLORS[c.color] || COLORS.pink;
  const n = state.done[c.id] || 0;
  const doneTxt = n === 0 ? '' : (n === 1 ? t('doneOnce') : t('doneTimes', { n }));
  return `
    <button class="card class-card" data-class="${c.id}" style="--c1:${c1};--c2:${c2}">
      <span class="badge">${totalMin(c)} ${t('minutes')}</span>
      <span class="ctitle">${L(c.title)}</span>
      <span class="csub">${L(c.subtitle)}</span>
      <span class="cmeta">${c.exercises.length} ${t('exercises')}${doneTxt ? ' · ' + doneTxt : ''}</span>
    </button>`;
}

function renderHome() {
  $app.innerHTML = `
    <main class="screen">
      <header class="topbar">
        <div class="brand">${logo()}<div><strong>${t('appName')}</strong><small>${t('tagline')}</small></div></div>
        <button class="icon-btn" id="setBtn" aria-label="${t('settings')}">${gearSvg()}</button>
      </header>
      <h1 class="hello">${t('hello')}</h1>
      <p class="muted">${t('helloSub')}</p>
      <div class="list">${CLASSES.map(classCard).join('')}</div>
      ${adSlotHtml()}
    </main>`;
  document.getElementById('setBtn').onclick = () => go('settings');
  document.querySelectorAll('[data-class]').forEach(b => b.onclick = () => go('detail', { classId: b.dataset.class }));
}

function renderDetail() {
  const c = getClass(state.classId);
  const [c1, c2] = COLORS[c.color] || COLORS.pink;
  $app.innerHTML = `
    <main class="screen">
      <header class="topbar"><button class="icon-btn" id="backBtn" aria-label="${t('back')}">${backSvg()}</button><strong>${L(c.title)}</strong><span class="spacer"></span></header>
      <div class="hero" style="--c1:${c1};--c2:${c2}">
        <span class="badge">${totalMin(c)} ${t('minutes')} · ${c.exercises.length} ${t('exercises')}</span>
        <h1>${L(c.title)}</h1>
        <p>${L(c.subtitle)}</p>
      </div>
      <button class="btn big" id="startBtn">${t('startClass')}</button>
      <ol class="ex-list">
        ${c.exercises.map((e, i) => `<li><span class="num" style="--c2:${c2}">${i + 1}</span><span class="ex-name">${L(e.name)}</span><span class="ex-dur">${fmt(e.dur)}</span></li>`).join('')}
      </ol>
      <section class="note">
        <h2>${t('before')}</h2>
        <ul>${t('beforeList').map(x => `<li>${x}</li>`).join('')}</ul>
      </section>
      ${adSlotHtml()}
    </main>`;
  document.getElementById('backBtn').onclick = () => go('home');
  document.getElementById('startBtn').onclick = () => startClass(c.id);
}

function renderPlayer() {
  const c = getClass(state.classId);
  const ex = c.exercises[P.i];
  const [c1, c2] = COLORS[c.color] || COLORS.pink;
  const hasBeat = ex.bpm > 0;
  const nextEx = c.exercises[P.i + 1];
  $app.innerHTML = `
    <main class="screen player" style="--c1:${c1};--c2:${c2}">
      <header class="topbar">
        <button class="icon-btn" id="quitBtn" aria-label="${t('quit')}">${closeSvg()}</button>
        <span class="progress-text">${t('exercise')} ${P.i + 1} ${t('of')} ${c.exercises.length}</span>
        <span class="spacer"></span>
      </header>
      <div class="dots">${c.exercises.map((_, i) => `<i class="${i < P.i ? 'done' : i === P.i ? 'cur' : ''}"></i>`).join('')}</div>
      <h1 class="ex-title">${L(ex.name)}</h1>
      <div class="ring-wrap">
        <svg viewBox="0 0 200 200" class="ring-svg" aria-hidden="true">
          <circle cx="100" cy="100" r="90" class="ring-bg"/>
          <circle cx="100" cy="100" r="90" class="ring-fg" id="ring" stroke-dasharray="565.49" stroke-dashoffset="0"/>
        </svg>
        <div class="time" id="time" role="timer">${fmt(ex.dur)}</div>
      </div>
      <ol class="steps">${(ex.steps[state.lang] || ex.steps.es).map(s => `<li>${s}</li>`).join('')}</ol>
      <p class="tip"><strong>${t('tip')}:</strong> ${L(ex.tip)}</p>
      ${hasBeat ? `<div class="metro-row"><span>${t('metronome')} · ${ex.bpm} bpm</span><button class="chip ${P.metro ? 'on' : ''}" id="metroBtn">${P.metro ? t('on') : t('off')}</button></div>` : ''}
      ${nextEx ? `<p class="next-up">→ ${L(nextEx.name)}</p>` : ''}
      <div class="controls">
        <button class="btn secondary" id="prevBtn" ${P.i === 0 ? 'disabled' : ''}>${t('prev')}</button>
        <button class="btn" id="pauseBtn">${P.running ? t('pause') : t('resume')}</button>
        <button class="btn secondary" id="nextBtn">${t('next')}</button>
      </div>
    </main>`;
  document.getElementById('quitBtn').onclick = askQuit;
  document.getElementById('pauseBtn').onclick = togglePause;
  document.getElementById('prevBtn').onclick = () => { if (P.i > 0) startExercise(P.i - 1); };
  document.getElementById('nextBtn').onclick = () => { if (P.i + 1 < c.exercises.length) startExercise(P.i + 1); else finishClass(); };
  const mb = document.getElementById('metroBtn');
  if (mb) mb.onclick = () => {
    P.metro = !P.metro; LS.set('metro', P.metro);
    mb.textContent = P.metro ? t('on') : t('off');
    mb.classList.toggle('on', P.metro);
    if (P.metro && P.running) { ensureAudio(); startMetro(ex.bpm); } else stopMetro();
  };
  updateTimerUi(ex);
}

function renderFinish() {
  const c = getClass(state.classId);
  $app.innerHTML = `
    <main class="screen center">
      <div class="stars" aria-hidden="true">${starSvg()}${starSvg()}${starSvg()}</div>
      <h1>${t('finishTitle')}</h1>
      <p class="muted">${L(c.title)} · ${totalMin(c)} ${t('minutes')}</p>
      <p>${t('finishText')}</p>
      <button class="btn big" id="homeBtn">${t('backHome')}</button>
      ${adSlotHtml()}
    </main>`;
  document.getElementById('homeBtn').onclick = () => go('home');
}

function renderSettings() {
  const price = Billing.price ? ` (${Billing.price})` : '';
  $app.innerHTML = `
    <main class="screen">
      <header class="topbar"><button class="icon-btn" id="backBtn" aria-label="${t('back')}">${backSvg()}</button><strong>${t('settings')}</strong><span class="spacer"></span></header>
      <section class="card set">
        <h2>${t('language')}</h2>
        <div class="lang-row left">${langButtons()}</div>
      </section>
      <section class="card set">
        <h2>${t('removeAds')}${state.premium ? '' : price}</h2>
        <p class="muted">${state.premium ? t('adsRemoved') : t('removeAdsText')}</p>
        ${state.premium ? '' : `<button class="btn" id="buyBtn">${t('removeAds')}</button><button class="link" id="restoreBtn">${t('restore')}</button>`}
      </section>
      <section class="card set">
        <button class="link block" id="ageBtn">${t('changeAge')}</button>
        <a class="link block" href="${CONFIG.PRIVACY_URL}" target="_blank" rel="noopener">${t('privacy')}</a>
      </section>
      <section class="card set">
        <h2>${t('about')}</h2>
        <p class="muted">${t('aboutText')}</p>
      </section>
      ${adSlotHtml()}
    </main>`;
  document.getElementById('backBtn').onclick = () => go('home');
  bindLang();
  const buy = document.getElementById('buyBtn');
  if (buy) buy.onclick = () => showGate(async () => {
    const ok = await Billing.purchase();
    if (!ok) toast(t('purchaseUnavailable'));
  });
  const rs = document.getElementById('restoreBtn');
  if (rs) rs.onclick = async () => { const ok = await Billing.restore(); if (!ok) toast(t('purchaseUnavailable')); };
  document.getElementById('ageBtn').onclick = () => {
    const open = () => go('age', { changingAge: true });
    if (profile() === 'child') showGate(open); else open();
  };
}

/* ---------- iconos ---------- */
const gearSvg = () => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`;
const backSvg = () => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`;
const closeSvg = () => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`;
const starSvg = () => `<svg viewBox="0 0 24 24" width="56" height="56"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" fill="#f6b73c"/></svg>`;

/* ---------- render principal ---------- */
function render() {
  document.documentElement.lang = state.lang;
  if (!state.birth && state.screen !== 'age') state.screen = 'age';
  switch (state.screen) {
    case 'age': renderAge(); break;
    case 'detail': renderDetail(); break;
    case 'player': renderPlayer(); break;
    case 'finish': renderFinish(); break;
    case 'settings': renderSettings(); break;
    default: state.screen = 'home'; renderHome();
  }
  syncAds();
}

async function initServices(reinit) {
  if (!state.birth) return;
  await Ads.init(profile());
  if (reinit && isNative()) { await Ads.hideBanner(); }
}

Billing.onOwned = () => {
  if (state.premium) return;
  state.premium = true;
  LS.set('premium', true);
  toast(t('adsRemoved'));
  render();
};

/* Boton atras de Android */
try {
  CapApp.addListener('backButton', () => {
    if (document.getElementById('modal')) { closeModal(); return; }
    if (state.screen === 'player') askQuit();
    else if (state.screen === 'age' && state.changingAge) { state.changingAge = false; go('settings'); }
    else if (state.screen === 'home' || state.screen === 'age') CapApp.exitApp();
    else go(state.screen === 'settings' || state.screen === 'detail' || state.screen === 'finish' ? 'home' : 'home');
  });
} catch { /* vista previa web */ }

document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.screen === 'player' && P.running) togglePause();
});

render();
initServices(false).then(syncAds);
Billing.init();

// Solo para pruebas en el navegador (no existe en la app instalada)
if (!isNative()) window.__plie = { state, go, startClass, P };
