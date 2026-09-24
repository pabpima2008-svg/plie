import { CLASSES, THEORY, classesOf } from './data.js';
import { PROGRAM, LEVELS, weekOf, dayMinutes } from './program.js';
import { createGuide } from './guide.js';
import { STR } from './i18n.js';
import { Ads, Billing, CONFIG, adProfile, isNative } from './ads.js';
import { App as CapApp } from '@capacitor/app';

/* ================= utilidades ================= */
const $app = document.getElementById('app');
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } }
};
const emptyProg = () => ({ level: 1, doneDates: {}, minutes: 0, quizRight: 0 });

const state = {
  lang: LS.get('lang', (navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en'),
  birth: LS.get('birth', null),
  premium: LS.get('premium', false),
  done: LS.get('done', {}),
  prog: LS.get('prog', null) || emptyProg(),
  testMode: CONFIG.TEST_TOOLS ? LS.get('testMode', false) : false,
  screen: 'home',
  section: 'tecnica',
  lessonId: null,
  classId: null,
  dayN: 1,
  back: 'home',
  changingAge: false,
  lastResult: null
};
const saveProg = () => LS.set('prog', state.prog);

const t = (k, vars) => {
  let s = (STR[state.lang] && STR[state.lang][k]) ?? STR.es[k] ?? k;
  if (vars && typeof s === 'string') for (const key in vars) s = s.split('{' + key + '}').join(vars[key]);
  return s;
};
const L = (obj) => obj[state.lang] || obj.es;
const getClass = (id) => CLASSES.find(c => c.id === id);
const totalMin = (c) => Math.round(c.exercises.reduce((a, e) => a + e.dur, 0) / 60);
const fmt = (sec) => {
  sec = Math.max(0, Math.ceil(sec));
  return String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
};
const todayStr = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

function currentAge() {
  if (!state.birth) return null;
  const now = new Date();
  let age = now.getFullYear() - state.birth.y;
  if (now.getMonth() <= state.birth.m) age -= 1;
  return Math.max(0, age);
}
const profile = () => adProfile(currentAge() ?? 0);

const COLORS = {
  rose: ['#ffc4d0', '#ec5f86'],
  dusty: ['#ffd8e1', '#d4668d'],
  peach: ['#ffd4c2', '#f07f68'],
  coral: ['#ffc9bd', '#e8667a'],
  pink: ['#ffc4d0', '#ec5f86'],
  lilac: ['#ffd8e1', '#d4668d'],
  mint: ['#ffd4c2', '#f07f68']
};
const BLOCK_COLOR = { teoria: 'dusty', tecnica: 'rose', fisico: 'peach' };

/* ================= progreso del programa ================= */
const isDone = (n) => !!state.prog.doneDates[n];
const doneCount = () => Object.keys(state.prog.doneDates).length;
function nextDay() {
  for (let n = 1; n <= 30; n++) if (!isDone(n)) return n;
  return 31;
}
// 'done' | 'open' | 'tomorrow' | 'locked'
function dayStatus(n) {
  if (isDone(n)) return 'done';
  if (n === 1) return 'open';
  if (!isDone(n - 1)) return state.testMode ? 'open' : 'locked';
  if (state.testMode) return 'open';
  return state.prog.doneDates[n - 1] < todayStr() ? 'open' : 'tomorrow';
}
function streak() {
  const dates = new Set(Object.values(state.prog.doneDates));
  const d = new Date();
  if (!dates.has(todayStr(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (dates.has(todayStr(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

/* ================= audio ================= */
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
  if (!bpm || !S.metro) return;
  let beat = 0;
  const tick = () => { blip(beat % 4 === 0 ? 990 : 740, 0.05, 0.1); beat++; };
  tick();
  audio.metro = setInterval(tick, 60000 / bpm);
}

let wakeLock = null;
async function keepAwake(on) {
  try {
    if (on && navigator.wakeLock) wakeLock = await navigator.wakeLock.request('screen');
    else if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch { /* no disponible */ }
}

/* ================= anuncios ================= */
function setAdHeight(h) { document.documentElement.style.setProperty('--ad-h', (h || 0) + 'px'); }
Ads.onHeight = setAdHeight;
const AD_SCREENS = ['home', 'section', 'detail', 'day', 'dayDone', 'finish', 'exam', 'settings'];
const screenWantsAds = () => AD_SCREENS.includes(state.screen);
async function syncAds() {
  const want = !state.premium && state.birth && screenWantsAds();
  if (want) {
    if (isNative()) { if (!Ads.visible) await Ads.showBanner(); }
    else setAdHeight(56);
  } else {
    if (isNative()) { if (Ads.visible) await Ads.hideBanner(); }
    setAdHeight(0);
  }
}
const adSlotHtml = () => (!isNative() && !state.premium && screenWantsAds() && state.birth)
  ? `<div class="ad-slot" aria-hidden="true"><span>${t('adPreview')}</span></div>` : '';

/* ================= la sombra ================= */
let G = null;
function killGuide() { if (G) { G.destroy(); G = null; } }
function mountGuide(sel, anim, bpm) {
  killGuide();
  const c = document.querySelector(sel);
  if (!c) return null;
  G = createGuide(c);
  G.play(anim, bpm);
  return G;
}

/* ================= navegacion ================= */
function go(screen, extra = {}) {
  if (state.screen === 'session' && screen !== 'session') stopSession();
  Object.assign(state, extra);
  state.screen = screen;
  render();
  window.scrollTo(0, 0);
}

/* ================= sesion (dia del programa o clase libre) ================= */
const S = {
  kind: 'day', ref: null, steps: [], i: 0,
  running: false, endAt: 0, remainingMs: 0, timer: null,
  picked: null, quizOk: null, metro: LS.get('metro', true)
};

function buildDaySteps(d) {
  const steps = [
    { type: 'card', block: 'teoria', card: d.theory },
    { type: 'quiz', block: 'teoria', q: d.theory.q }
  ];
  d.tecnica.forEach(ex => steps.push({ type: 'ex', block: 'tecnica', ex }));
  d.fisico.forEach(ex => steps.push({ type: 'ex', block: 'fisico', ex }));
  return steps;
}

function startDay(n) {
  const d = PROGRAM[n - 1];
  Object.assign(S, { kind: 'day', ref: n, steps: buildDaySteps(d), i: 0, picked: null, quizOk: null });
  ensureAudio(); keepAwake(true);
  go('session');
  enterStep(0);
}
function startClass(id) {
  const c = getClass(id);
  Object.assign(S, { kind: 'class', ref: id, steps: c.exercises.map(ex => ({ type: 'ex', block: c.section, ex })), i: 0 });
  ensureAudio(); keepAwake(true);
  go('session');
  enterStep(0);
}

function stopSession() { clearInterval(S.timer); S.timer = null; S.running = false; stopMetro(); keepAwake(false); }

function enterStep(i) {
  clearInterval(S.timer); stopMetro();
  S.i = i;
  const st = S.steps[i];
  if (st.type === 'ex') {
    S.remainingMs = st.ex.dur * 1000;
    S.endAt = Date.now() + S.remainingMs;
    S.running = true;
    renderSession();
    startMetro(st.ex.bpm);
    S.timer = setInterval(tick, 200);
  } else {
    S.running = false;
    renderSession();
  }
}

function tick() {
  if (!S.running) return;
  const st = S.steps[S.i];
  S.remainingMs = S.endAt - Date.now();
  if (S.remainingMs <= 0) {
    blip(880, 0.12, 0.15); blip(880, 0.12, 0.15, 0.2); blip(1175, 0.25, 0.15, 0.4);
    nextStep();
    return;
  }
  updateTimerUi(st.ex);
}
function nextStep() {
  if (S.i + 1 < S.steps.length) enterStep(S.i + 1);
  else finishSession();
}

function updateTimerUi(ex) {
  const el = document.getElementById('time');
  if (!el) return;
  el.textContent = fmt(S.remainingMs / 1000);
  const frac = Math.max(0, Math.min(1, S.remainingMs / (ex.dur * 1000)));
  const ring = document.getElementById('ring');
  if (ring) ring.style.strokeDashoffset = String(565.49 * (1 - frac));
}

function togglePause() {
  const st = S.steps[S.i];
  if (!st || st.type !== 'ex') return;
  S.running = !S.running;
  if (S.running) { S.endAt = Date.now() + S.remainingMs; ensureAudio(); startMetro(st.ex.bpm); }
  else stopMetro();
  if (G) G.setRunning(S.running);
  const b = document.getElementById('pauseBtn');
  if (b) b.textContent = S.running ? t('pause') : t('resume');
}

function finishSession() {
  stopSession();
  if (S.kind === 'day') {
    const n = S.ref;
    const d = PROGRAM[n - 1];
    const first = !isDone(n);
    if (first) state.prog.doneDates[n] = todayStr();
    state.prog.minutes += dayMinutes(d);
    if (S.quizOk) state.prog.quizRight += 1;
    saveProg();
    state.lastResult = { n, first, quizOk: S.quizOk };
    go('dayDone');
  } else {
    state.done[S.ref] = (state.done[S.ref] || 0) + 1;
    LS.set('done', state.done);
    state.classId = S.ref;
    go('finish');
  }
}

function leaveSession() {
  if (S.kind === 'day') go('day', { dayN: S.ref });
  else go('detail', { classId: S.ref });
}

/* ================= ventanas ================= */
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

function confirmBox(question, yesLabel, noLabel, onYes, onNo) {
  const d = openModal(`
    <h2>${question}</h2>
    <div class="row">
      <button class="btn secondary" id="cYes">${yesLabel}</button>
      <button class="btn" id="cNo">${noLabel}</button>
    </div>`);
  d.querySelector('#cYes').onclick = () => { closeModal(); onYes(); };
  d.querySelector('#cNo').onclick = () => { closeModal(); if (onNo) onNo(); };
}

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
  const wasRunning = S.running;
  if (wasRunning) togglePause();
  confirmBox(t('quitAsk'), t('yes'), t('no'), leaveSession, () => { if (wasRunning) togglePause(); });
}

function clearToasts() { document.querySelectorAll('.toast').forEach(e => e.remove()); }
function toast(msg) {
  clearToasts();
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add('show'), 10);
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 2600);
}

/* ================= iconos ================= */
function logo() {
  return `<svg class="logo" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb3c4"/><stop offset="1" stop-color="#e2527d"/></linearGradient></defs><circle cx="24" cy="24" r="22" fill="url(#lg)"/><path d="M17 35V13h9.5a6.5 6.5 0 0 1 0 13H17" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
const gearSvg = () => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`;
const backSvg = () => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`;
const closeSvg = () => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`;
const lockSvg = (s = 14) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`;
const checkSvg = (s = 16) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;
const moonSvg = (s = 14) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="currentColor" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>`;
const starSvg = (s = 52) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z" fill="#f2b45a"/></svg>`;
const flameSvg = (s = 18) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true"><path d="M12 2c1 4 5 5.5 5 11a5 5 0 0 1-10 0c0-3 1.5-4.5 2.5-6 .3 2 1.2 3 2.2 3.3C11.4 8 11 5 12 2z" fill="#f28a6b"/></svg>`;

/* ================= pantalla: edad ================= */
function renderAge() {
  const now = new Date().getFullYear();
  const months = t('months').map((m, i) => `<option value="${i}">${m}</option>`).join('');
  let years = '';
  for (let y = now; y >= now - 100; y--) years += `<option value="${y}">${y}</option>`;
  const back = state.changingAge && state.birth ? `<button class="link" id="ageBack">${t('back')}</button>` : '';
  $app.innerHTML = `
    <main class="screen center">
      <div id="guide" class="guide hero-size"></div>
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
  mountGuide('#guide', 'wave', 90);
}

function langButtons() {
  return ['es', 'en'].map(l => `<button class="chip ${state.lang === l ? 'on' : ''}" data-lang="${l}">${l === 'es' ? 'Español' : 'English'}</button>`).join('');
}
function bindLang() {
  document.querySelectorAll('[data-lang]').forEach(b => {
    b.onclick = () => { state.lang = b.dataset.lang; LS.set('lang', state.lang); document.documentElement.lang = state.lang; render(); };
  });
}

/* ================= pantalla: inicio ================= */
function dayDot(n) {
  const st = dayStatus(n);
  const d = PROGRAM[n - 1];
  const isNext = n === nextDay();
  const cls = ['dot', st, isNext ? 'next' : '', d.rest ? 'rest' : ''].join(' ');
  const inner = st === 'done' ? checkSvg(15) : (st === 'locked' || st === 'tomorrow') ? (d.rest ? moonSvg(12) : `<span>${n}</span>`) : `<span>${n}</span>`;
  const label = `${t('dayWord')} ${n}${d.rest ? ' · ' + t('restDay') : ''}`;
  return `<button class="${cls}" data-day="${n}" aria-label="${label}">${inner}${d.rest && st !== 'done' && st !== 'locked' && st !== 'tomorrow' ? `<i class="moon">${moonSvg(10)}</i>` : ''}</button>`;
}

function renderHome() {
  const lv = LEVELS[0];
  const done = doneCount();
  const nd = nextDay();
  const all = nd > 30;
  const ndStatus = all ? 'done' : dayStatus(nd);
  let bubble, anim, cta;
  if (all) {
    bubble = t('hiExam'); anim = 'celebrate';
    cta = `<button class="btn big" id="ctaBtn">${t('toExam')}</button>`;
  } else if (ndStatus === 'tomorrow') {
    bubble = t('hiWait'); anim = 'coach';
    cta = `<div class="wait"><strong>${t('comeBack', { n: nd })}</strong><span>${t('comeBackText')}</span></div>`;
  } else {
    bubble = nd === 1 ? t('hiDay1') : PROGRAM[nd - 1].rest ? t('hiRest') : t('hiDayN', { n: nd });
    anim = 'wave';
    const d = PROGRAM[nd - 1];
    cta = `<button class="btn big" id="ctaBtn">${t('startDay', { n: nd })} · ${dayMinutes(d)} ${t('minutes')}</button>`;
  }
  const pct = Math.round(done / lv.days * 100);
  const weeks = [[1, 7], [8, 14], [15, 21], [22, 28], [29, 30]];
  const map = weeks.map(([a, b]) => {
    const w = weekOf(a);
    let dots = '';
    for (let n = a; n <= b; n++) dots += dayDot(n);
    return `<div class="week"><span class="wname">${L(w.name)}</span><div class="dots-row">${dots}</div></div>`;
  }).join('');
  const levelsHtml = LEVELS.map(l => {
    const cur = l.n === state.prog.level;
    return `<div class="lvl ${cur ? 'cur' : 'lockd'}">
      <span class="lnum">${l.n}</span>
      <div><strong>${L(l.name)}</strong><span>${cur ? L(l.desc) : t('levelLocked')}</span></div>
      ${cur ? `<em>${t('levelCurrent')}</em>` : `<em class="lk">${lockSvg(13)}</em>`}
    </div>`;
  }).join('');

  $app.innerHTML = `
    <main class="screen">
      <header class="topbar">
        <div class="brand">${logo()}<div><strong>${t('appName')}</strong><small>${t('tagline')}</small></div></div>
        <button class="icon-btn" id="setBtn" aria-label="${t('settings')}">${gearSvg()}</button>
      </header>

      <section class="hero-guide">
        <div id="guide" class="guide small"></div>
        <div class="bubble">${bubble}</div>
      </section>

      <section class="level-card">
        <div class="lc-top">
          <span class="eyebrow">${t('levelWord')} ${lv.n}</span>
          <h1>${L(lv.name)}</h1>
          <p>${L(lv.desc)}</p>
        </div>
        <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="30" aria-valuenow="${done}"><i style="width:${pct}%"></i></div>
        <div class="stats">
          <div><b>${done}<small>/30</small></b><span>${t('daysDone')}</span></div>
          <div><b>${flameSvg()} ${streak()}</b><span>${t('streak')}</span></div>
          <div><b>${state.prog.minutes}</b><span>${t('minutesDone')}</span></div>
        </div>
      </section>

      ${cta}

      <section class="block">
        <h2>${t('yourPath')}</h2>
        <div class="map">${map}</div>
        <button class="exam-row ${all ? 'open' : ''}" id="examRow">
          <span class="exam-ic">${all ? starSvg(22) : lockSvg(16)}</span>
          <span><strong>${t('exam')}</strong><small>${all ? t('examReady') : t('examLocked')}</small></span>
        </button>
      </section>

      <section class="block">
        <h2>${t('levels')}</h2>
        <div class="levels">${levelsHtml}</div>
      </section>

      <section class="block">
        <h2>${t('freePractice')}</h2>
        <p class="muted small">${t('freePracticeSub')}</p>
        <div class="tiles">${['teoria', 'tecnica', 'fisico'].map(tile).join('')}</div>
      </section>
      ${adSlotHtml()}
    </main>`;

  document.getElementById('setBtn').onclick = () => go('settings');
  const cb = document.getElementById('ctaBtn');
  if (cb) cb.onclick = () => all ? go('exam') : go('day', { dayN: nd });
  document.getElementById('examRow').onclick = () => go('exam');
  document.querySelectorAll('[data-day]').forEach(b => b.onclick = () => {
    const n = parseInt(b.dataset.day, 10);
    const st = dayStatus(n);
    if (st === 'locked') toast(t('lockedDay'));
    else if (st === 'tomorrow') toast(t('lockedTomorrow'));
    else go('day', { dayN: n });
  });
  document.querySelectorAll('[data-sec]').forEach(b => b.onclick = () => go('section', { section: b.dataset.sec }));
  mountGuide('#guide', anim, 90);
}

/* ================= pantalla: dia ================= */
function exList(list) {
  return `<ol class="ex-list">${list.map(e => `<li><span class="ex-name">${L(e.name)}</span><span class="ex-dur">${fmt(e.dur)}</span></li>`).join('')}</ol>`;
}
function renderDay() {
  const n = state.dayN;
  const d = PROGRAM[n - 1];
  const w = weekOf(n);
  const st = dayStatus(n);
  const mins = (arr) => Math.max(1, Math.round(arr.reduce((a, e) => a + e.dur, 0) / 60));
  const blk = (key, body, extra = '') => {
    const [c1, c2] = COLORS[BLOCK_COLOR[key]];
    return `<section class="dblock" style="--c1:${c1};--c2:${c2}">
      <header><span class="bchip">${t('block' + key[0].toUpperCase() + key.slice(1))}</span>${extra}</header>
      ${body}
    </section>`;
  };
  $app.innerHTML = `
    <main class="screen">
      <header class="topbar"><button class="icon-btn" id="backBtn" aria-label="${t('back')}">${backSvg()}</button><strong>${t('dayOf', { n, m: 30 })}</strong><span class="spacer"></span></header>
      <div class="day-hero">
        <div id="guide" class="guide small"></div>
        <div>
          <span class="eyebrow">${L(w.name)}</span>
          <h1>${d.rest ? t('restDay') : L(d.theory.title)}</h1>
          <p class="muted">${dayMinutes(d)} ${t('minutes')}${isDone(n) ? ' · ' + t('doneOnce') : ''}</p>
        </div>
      </div>
      ${st === 'done' || st === 'open' ? `<button class="btn big" id="startBtn">${isDone(n) ? t('repeatDay', { n }) : t('startDay', { n })}</button>` : ''}
      ${blk('teoria', `<p class="bline"><strong>${t('theoryOfDay')}:</strong> ${L(d.theory.title)}</p>`, `<small>~1 ${t('minutes')}</small>`)}
      ${d.tecnica.length ? blk('tecnica', exList(d.tecnica), `<small>${mins(d.tecnica)} ${t('minutes')}</small>`) : blk('tecnica', `<p class="bline muted">${t('noBlock')}</p>`)}
      ${d.fisico.length ? blk('fisico', exList(d.fisico), `<small>${mins(d.fisico)} ${t('minutes')}</small>`) : ''}
      <section class="note">
        <h2>${t('before')}</h2>
        <ul>${t('beforeList').map(x => `<li>${x}</li>`).join('')}</ul>
      </section>
      ${adSlotHtml()}
    </main>`;
  document.getElementById('backBtn').onclick = () => go('home');
  const sb = document.getElementById('startBtn');
  if (sb) sb.onclick = () => startDay(n);
  mountGuide('#guide', d.rest ? 'neck' : (d.tecnica[0] ? 'coach' : 'coach'), 70);
}

/* ================= pantalla: sesion ================= */
function renderSession() {
  const st = S.steps[S.i];
  const total = S.steps.length;
  const [c1, c2] = COLORS[BLOCK_COLOR[st.block]] || COLORS.rose;
  const pct = Math.round((S.i / total) * 100);
  const blockName = t('block' + st.block[0].toUpperCase() + st.block.slice(1));
  const head = `
    <header class="topbar">
      <button class="icon-btn" id="quitBtn" aria-label="${t('quit')}">${closeSvg()}</button>
      <span class="progress-text"><span class="bchip">${blockName}</span> ${t('step', { n: S.i + 1, m: total })}</span>
      <span class="spacer"></span>
    </header>
    <div class="sbar"><i style="width:${pct}%"></i></div>`;

  let body = '';
  if (st.type === 'card') {
    body = `
      <div class="stage"><div id="guide" class="guide"></div></div>
      <article class="lesson-card"><span class="eyebrow">${t('theoryOfDay')}</span><h1>${L(st.card.title)}</h1><p>${L(st.card.text)}</p></article>
      <div class="controls two">
        <button class="btn secondary" id="prevBtn" ${S.i === 0 ? 'disabled' : ''}>${t('prev')}</button>
        <button class="btn" id="nextBtn">${t('next')}</button>
      </div>`;
  } else if (st.type === 'quiz') {
    const opts = st.q.options[state.lang] || st.q.options.es;
    const answered = S.picked !== null;
    const ok = answered && S.picked === st.q.answer;
    body = `
      <div class="stage short"><div id="guide" class="guide"></div></div>
      <article class="lesson-card"><h1>${L(st.q.q)}</h1></article>
      <div class="opts">
        ${opts.map((o, i) => `<button class="opt ${answered ? (i === st.q.answer ? 'right' : i === S.picked ? 'wrong' : '') : ''}" data-o="${i}" ${answered ? 'disabled' : ''}>${o}</button>`).join('')}
      </div>
      ${answered ? `<p class="feedback ${ok ? 'ok' : 'no'}">${ok ? t('correct') : t('wrongIs')}</p>` : ''}
      <div class="controls two">
        <button class="btn secondary" id="prevBtn">${t('prev')}</button>
        <button class="btn" id="nextBtn" ${answered ? '' : 'aria-disabled="true"'}>${t('next')}</button>
      </div>`;
  } else {
    const ex = st.ex;
    const nextSt = S.steps[S.i + 1];
    const hasBeat = ex.bpm > 0;
    body = `
      <h1 class="ex-title">${L(ex.name)}</h1>
      <div class="stage">
        <div id="guide" class="guide"></div>
        <div class="ring-wrap mini">
          <svg viewBox="0 0 200 200" class="ring-svg" aria-hidden="true">
            <circle cx="100" cy="100" r="90" class="ring-bg"/>
            <circle cx="100" cy="100" r="90" class="ring-fg" id="ring" stroke-dasharray="565.49" stroke-dashoffset="0"/>
          </svg>
          <div class="time" id="time" role="timer">${fmt(ex.dur)}</div>
        </div>
      </div>
      <ol class="steps">${(ex.steps[state.lang] || ex.steps.es).map(s => `<li>${s}</li>`).join('')}</ol>
      <p class="tip"><strong>${t('tip')}:</strong> ${L(ex.tip)}</p>
      ${hasBeat ? `<div class="metro-row"><span>${t('metronome')} · ${ex.bpm} bpm</span><button class="chip ${S.metro ? 'on' : ''}" id="metroBtn">${S.metro ? t('on') : t('off')}</button></div>` : ''}
      ${nextSt && nextSt.type === 'ex' ? `<p class="next-up">→ ${L(nextSt.ex.name)}</p>` : ''}
      <div class="controls">
        <button class="btn secondary" id="prevBtn" ${S.i === 0 ? 'disabled' : ''}>${t('prev')}</button>
        <button class="btn" id="pauseBtn">${S.running ? t('pause') : t('resume')}</button>
        <button class="btn secondary" id="nextBtn">${t('next')}</button>
      </div>`;
  }
  $app.innerHTML = `<main class="screen player" style="--c1:${c1};--c2:${c2}">${head}${body}</main>`;

  document.getElementById('quitBtn').onclick = askQuit;
  const prev = document.getElementById('prevBtn');
  if (prev) prev.onclick = () => { if (S.i > 0) { if (S.steps[S.i - 1].type === 'quiz') S.picked = S.picked; enterStep(S.i - 1); } };
  const nx = document.getElementById('nextBtn');
  if (st.type === 'quiz') {
    document.querySelectorAll('[data-o]').forEach(b => b.onclick = () => {
      S.picked = parseInt(b.dataset.o, 10);
      if (S.quizOk === null) S.quizOk = S.picked === st.q.answer;
      renderSession();
    });
    nx.onclick = () => { if (S.picked === null) { toast(t('answerFirst')); return; } nextStep(); };
    const ok = S.picked !== null && S.picked === st.q.answer;
    mountGuide('#guide', S.picked === null ? 'coach' : ok ? 'celebrate' : 'coach', 90);
  } else if (st.type === 'card') {
    nx.onclick = nextStep;
    mountGuide('#guide', st.card.anim, 60);
  } else {
    nx.onclick = nextStep;
    document.getElementById('pauseBtn').onclick = togglePause;
    const mb = document.getElementById('metroBtn');
    if (mb) mb.onclick = () => {
      S.metro = !S.metro; LS.set('metro', S.metro);
      mb.textContent = S.metro ? t('on') : t('off');
      mb.classList.toggle('on', S.metro);
      if (S.metro && S.running) { ensureAudio(); startMetro(st.ex.bpm); } else stopMetro();
    };
    updateTimerUi(st.ex);
    mountGuide('#guide', st.ex.anim, st.ex.bpm || 60);
    if (G && !S.running) G.setRunning(false);
  }
}

/* ================= pantalla: dia completado ================= */
function renderDayDone() {
  const r = state.lastResult || { n: state.dayN, quizOk: null };
  const last = r.n >= 30;
  const nd = nextDay();
  $app.innerHTML = `
    <main class="screen center">
      <div class="guide hero-size" id="guide"></div>
      <div class="stars">${starSvg()}${starSvg()}${starSvg()}</div>
      <h1>${t('dayDoneTitle', { n: r.n })}</h1>
      ${r.quizOk === null ? '' : `<p class="pill ${r.quizOk ? 'ok' : 'no'}">${t('quizScore', { r: r.quizOk ? t('quizRight') : t('quizWrong') })}</p>`}
      <p>${last && nd > 30 ? t('dayDoneLast') : nd <= 30 ? t('dayDoneNext', { n: nd }) : ''}</p>
      <p class="muted">${t('finishText')}</p>
      ${nd > 30 ? `<button class="btn big" id="examBtn">${t('toExam')}</button>` : ''}
      <button class="btn ${nd > 30 ? 'secondary' : ''} big" id="homeBtn">${t('backHome')}</button>
      ${adSlotHtml()}
    </main>`;
  document.getElementById('homeBtn').onclick = () => go('home');
  const eb = document.getElementById('examBtn');
  if (eb) eb.onclick = () => go('exam');
  mountGuide('#guide', 'celebrate', 110);
}

/* ================= pantalla: examen (pendiente) ================= */
function renderExam() {
  const all = nextDay() > 30;
  $app.innerHTML = `
    <main class="screen">
      <header class="topbar"><button class="icon-btn" id="backBtn" aria-label="${t('back')}">${backSvg()}</button><strong>${t('exam')}</strong><span class="spacer"></span></header>
      <div class="stage"><div id="guide" class="guide"></div></div>
      <section class="lesson-card">
        <span class="eyebrow">${all ? t('levelSoon') : t('locked')}</span>
        <h1>${all ? t('examReady') : t('examLocked')}</h1>
        <p>${t('examSoon')}</p>
        <p><strong>${t('examWill')}</strong></p>
        <ul class="plain">${t('examList').map(x => `<li>${x}</li>`).join('')}</ul>
      </section>
      ${adSlotHtml()}
    </main>`;
  document.getElementById('backBtn').onclick = () => go('home');
  mountGuide('#guide', all ? 'celebrate' : 'coach', 90);
}

/* ================= practica libre ================= */
function classCard(c) {
  const [c1, c2] = COLORS[BLOCK_COLOR[c.section]] || COLORS.rose;
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
function sectionStats(sec) {
  if (sec === 'teoria') return { count: THEORY.length, mins: THEORY.reduce((a, l) => a + l.mins, 0), unit: t('lessons') };
  const cs = classesOf(sec);
  return { count: cs.length, mins: cs.reduce((a, c) => a + totalMin(c), 0), unit: t('classesWord') };
}
function tile(sec) {
  const [c1, c2] = COLORS[BLOCK_COLOR[sec]];
  const st = sectionStats(sec);
  return `
    <button class="tile" data-sec="${sec}" style="--c1:${c1};--c2:${c2}">
      <span class="tname">${t('sec_' + sec)}</span>
      <span class="tmeta">${st.count} ${st.unit} · ${st.mins} ${t('minutes')}</span>
    </button>`;
}
function lessonCard(l) {
  const [c1, c2] = COLORS.dusty;
  const n = state.done['lesson:' + l.id] || 0;
  const doneTxt = n === 0 ? '' : (n === 1 ? t('doneOnce') : t('doneTimes', { n }));
  return `
    <button class="card class-card" data-lesson="${l.id}" style="--c1:${c1};--c2:${c2}">
      <span class="badge">${l.mins} ${t('minutes')}</span>
      <span class="ctitle">${L(l.title)}</span>
      <span class="csub">${L(l.subtitle)}</span>
      <span class="cmeta">${l.cards.length} ${t('cardsAndQuiz')}${doneTxt ? ' · ' + doneTxt : ''}</span>
    </button>`;
}

function renderSection() {
  const sec = state.section;
  const [c1, c2] = COLORS[BLOCK_COLOR[sec]];
  const items = sec === 'teoria' ? THEORY.map(lessonCard).join('') : classesOf(sec).map(classCard).join('');
  const st = sectionStats(sec);
  $app.innerHTML = `
    <main class="screen">
      <header class="topbar"><button class="icon-btn" id="backBtn" aria-label="${t('back')}">${backSvg()}</button><strong>${t('sec_' + sec)}</strong><span class="spacer"></span></header>
      <div class="hero" style="--c1:${c1};--c2:${c2}">
        <span class="badge">${st.count} ${st.unit} · ${st.mins} ${t('minutes')}</span>
        <h1>${t('sec_' + sec)}</h1>
        <p>${t('secdesc_' + sec)}</p>
      </div>
      <div class="list">${items}</div>
      ${adSlotHtml()}
    </main>`;
  document.getElementById('backBtn').onclick = () => go('home');
  document.querySelectorAll('[data-class]').forEach(b => b.onclick = () => go('detail', { classId: b.dataset.class }));
  document.querySelectorAll('[data-lesson]').forEach(b => b.onclick = () => openLesson(b.dataset.lesson));
}

function renderDetail() {
  const c = getClass(state.classId);
  const [c1, c2] = COLORS[BLOCK_COLOR[c.section]] || COLORS.rose;
  $app.innerHTML = `
    <main class="screen">
      <header class="topbar"><button class="icon-btn" id="backBtn" aria-label="${t('back')}">${backSvg()}</button><strong>${L(c.title)}</strong><span class="spacer"></span></header>
      <div class="hero" style="--c1:${c1};--c2:${c2}">
        <span class="badge">${totalMin(c)} ${t('minutes')} · ${c.exercises.length} ${t('exercises')}</span>
        <h1>${L(c.title)}</h1>
        <p>${L(c.subtitle)}</p>
      </div>
      <button class="btn big" id="startBtn">${t('startClass')}</button>
      ${exList(c.exercises)}
      <section class="note">
        <h2>${t('before')}</h2>
        <ul>${t('beforeList').map(x => `<li>${x}</li>`).join('')}</ul>
      </section>
      ${adSlotHtml()}
    </main>`;
  document.getElementById('backBtn').onclick = () => go('section', { section: c.section });
  document.getElementById('startBtn').onclick = () => startClass(c.id);
}

function renderFinish() {
  const c = getClass(state.classId);
  $app.innerHTML = `
    <main class="screen center">
      <div class="guide hero-size" id="guide"></div>
      <div class="stars">${starSvg()}${starSvg()}${starSvg()}</div>
      <h1>${t('finishTitle')}</h1>
      <p class="muted">${L(c.title)} · ${totalMin(c)} ${t('minutes')}</p>
      <p>${t('finishText')}</p>
      <button class="btn big" id="homeBtn">${t('backHome')}</button>
      ${adSlotHtml()}
    </main>`;
  document.getElementById('homeBtn').onclick = () => go('home');
  mountGuide('#guide', 'celebrate', 110);
}

/* lecciones de teoria (practica libre) */
const LV = { i: 0, quiz: false, qi: 0, score: 0, picked: null };
function openLesson(id) {
  Object.assign(LV, { i: 0, quiz: false, qi: 0, score: 0, picked: null });
  go('lesson', { lessonId: id });
}
function renderLesson() {
  const l = THEORY.find(x => x.id === state.lessonId);
  const [c1, c2] = COLORS.dusty;
  const head = (label, total, cur) => `
    <header class="topbar">
      <button class="icon-btn" id="closeBtn" aria-label="${t('close')}">${closeSvg()}</button>
      <span class="progress-text">${label}</span>
      <span class="spacer"></span>
    </header>
    <div class="sbar"><i style="width:${Math.round(cur / total * 100)}%"></i></div>`;
  if (!LV.quiz) {
    const card = l.cards[LV.i];
    const last = LV.i === l.cards.length - 1;
    $app.innerHTML = `
      <main class="screen player" style="--c1:${c1};--c2:${c2}">
        ${head(`${t('card')} ${LV.i + 1} ${t('of')} ${l.cards.length}`, l.cards.length, LV.i)}
        <div class="stage"><div id="guide" class="guide"></div></div>
        <article class="lesson-card"><span class="eyebrow">${L(l.title)}</span><h1>${L(card.title)}</h1><p>${L(card.text)}</p></article>
        <div class="controls two">
          <button class="btn secondary" id="prevBtn" ${LV.i === 0 ? 'disabled' : ''}>${t('prev')}</button>
          <button class="btn" id="nextBtn">${last ? t('takeQuiz') : t('next')}</button>
        </div>
      </main>`;
    document.getElementById('prevBtn').onclick = () => { if (LV.i > 0) { LV.i--; renderLesson(); } };
    document.getElementById('nextBtn').onclick = () => { if (last) { LV.quiz = true; LV.qi = 0; LV.picked = null; } else LV.i++; renderLesson(); };
    mountGuide('#guide', card.anim, 60);
  } else if (LV.qi < l.quiz.length) {
    const q = l.quiz[LV.qi];
    const opts = q.options[state.lang] || q.options.es;
    const answered = LV.picked !== null;
    const ok = answered && LV.picked === q.answer;
    $app.innerHTML = `
      <main class="screen player" style="--c1:${c1};--c2:${c2}">
        ${head(`${t('takeQuiz')} · ${t('question')} ${LV.qi + 1} ${t('of')} ${l.quiz.length}`, l.quiz.length, LV.qi)}
        <div class="stage short"><div id="guide" class="guide"></div></div>
        <article class="lesson-card"><h1>${L(q.q)}</h1></article>
        <div class="opts">
          ${opts.map((o, i) => `<button class="opt ${answered ? (i === q.answer ? 'right' : i === LV.picked ? 'wrong' : '') : ''}" data-o="${i}" ${answered ? 'disabled' : ''}>${o}</button>`).join('')}
        </div>
        ${answered ? `<p class="feedback ${ok ? 'ok' : 'no'}">${ok ? t('correct') : t('wrongIs')}</p>
        <button class="btn big" id="qNext">${LV.qi + 1 < l.quiz.length ? t('next') : t('seeResult')}</button>` : ''}
      </main>`;
    document.querySelectorAll('[data-o]').forEach(b => b.onclick = () => {
      LV.picked = parseInt(b.dataset.o, 10);
      if (LV.picked === q.answer) LV.score++;
      renderLesson();
    });
    const nx = document.getElementById('qNext');
    if (nx) nx.onclick = () => { LV.qi++; LV.picked = null; renderLesson(); };
    mountGuide('#guide', ok ? 'celebrate' : 'coach', 90);
  } else {
    const good = LV.score >= 2;
    $app.innerHTML = `
      <main class="screen center">
        <div class="guide hero-size" id="guide"></div>
        <h1>${t('score', { n: LV.score, m: l.quiz.length })}</h1>
        <p class="muted">${L(l.title)}</p>
        <button class="btn big" id="doneBtn">${t('finishLesson')}</button>
      </main>`;
    document.getElementById('doneBtn').onclick = () => {
      state.done['lesson:' + l.id] = (state.done['lesson:' + l.id] || 0) + 1;
      LS.set('done', state.done);
      go('section', { section: 'teoria' });
    };
    mountGuide('#guide', good ? 'celebrate' : 'coach', 100);
  }
  const cb = document.getElementById('closeBtn');
  if (cb) cb.onclick = () => go('section', { section: 'teoria' });
}

/* ================= ajustes ================= */
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
        <h2>${t('progress')}</h2>
        ${CONFIG.TEST_TOOLS ? `
        <label class="switch-row" for="testSw">
          <span><strong>${t('testMode')}</strong><small>${t('testModeText')}</small></span>
          <input type="checkbox" id="testSw" ${state.testMode ? 'checked' : ''}>
        </label>` : ''}
        <button class="link block danger" id="resetBtn">${t('resetProgress')}</button>
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
  const sw = document.getElementById('testSw');
  if (sw) sw.onchange = () => { state.testMode = sw.checked; LS.set('testMode', state.testMode); };
  document.getElementById('resetBtn').onclick = () => confirmBox(t('resetAsk'), t('resetYes'), t('cancel'), () => {
    state.prog = emptyProg(); saveProg(); toast(t('resetDone'));
  });
  document.getElementById('ageBtn').onclick = () => {
    const open = () => go('age', { changingAge: true });
    if (profile() === 'child') showGate(open); else open();
  };
}

/* ================= render ================= */
function render() {
  killGuide();
  closeModal();
  clearToasts();
  document.documentElement.lang = state.lang;
  if (!state.birth && state.screen !== 'age') state.screen = 'age';
  switch (state.screen) {
    case 'age': renderAge(); break;
    case 'day': renderDay(); break;
    case 'session': renderSession(); break;
    case 'dayDone': renderDayDone(); break;
    case 'exam': renderExam(); break;
    case 'section': renderSection(); break;
    case 'lesson': renderLesson(); break;
    case 'detail': renderDetail(); break;
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

try {
  CapApp.addListener('backButton', () => {
    if (document.getElementById('modal')) { closeModal(); return; }
    const s = state.screen;
    if (s === 'session') askQuit();
    else if (s === 'age' && state.changingAge) { state.changingAge = false; go('settings'); }
    else if (s === 'home' || s === 'age') CapApp.exitApp();
    else if (s === 'detail') go('section', { section: (getClass(state.classId) || {}).section || 'tecnica' });
    else if (s === 'lesson') go('section', { section: 'teoria' });
    else go('home');
  });
} catch { /* vista previa web */ }

document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.screen === 'session' && S.running) togglePause();
});

render();
initServices(false).then(syncAds);
Billing.init();

if (!isNative()) window.__plie = { state, go, startDay, startClass, S, PROGRAM };
