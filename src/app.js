import { CLASSES, THEORY, classesOf } from './data.js';
import { TRACKS, TRACK_IDS, LEVELS, MAX_LEVEL, weekOf, trackMinutes, CARD_POOL, exercisesUpTo } from './program.js';
import { EXTRA_LESSONS } from './theory2.js';
import { CORE, detailsFor } from './details.js';
const THEORY_ALL = THEORY.concat(EXTRA_LESSONS);
import { createGuide } from './guide.js';
import { STR } from './i18n.js';
import { Ads, Billing, CONFIG, adProfile, isNative } from './ads.js';
import { App as CapApp } from '@capacitor/app';
import { KeepAwake } from '@capacitor-community/keep-awake';

/* ================= utilidades ================= */
const $app = document.getElementById('app');
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } }
};
const emptyTrack = (level = 1) => ({ level, dates: {}, passed: [] });
const emptyProg = () => ({ placed: false, tracks: { teoria: emptyTrack(), tecnica: emptyTrack(), fisico: emptyTrack() }, comboDates: [], minutes: 0, quizRight: 0 });

const state = {
  lang: LS.get('lang', (navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en'),
  birth: LS.get('birth', null),
  premium: LS.get('premium', false),
  done: LS.get('done', {}),
  prog: LS.get('prog4', null) || emptyProg(),
  exp: LS.get('exp', { years: null, self: { teoria: null, tecnica: null, fisico: null } }),
  pending: null,
  testMode: CONFIG.TEST_TOOLS ? LS.get('testMode', false) : false,
  screen: 'home',
  section: 'tecnica',
  lessonId: null,
  classId: null,
  dayN: 1,
  track: 'tecnica',
  mapTrack: 'tecnica',
  back: 'home',
  changingAge: false,
  lastResult: null
};
const saveProg = () => LS.set('prog4', state.prog);

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

/* ================= progreso: cada modalidad tiene su nivel y su camino de 30 dias ================= */
const trackOf = (tr) => state.prog.tracks[tr];
const levelOf = (tr) => trackOf(tr).level;
const daysOf = (tr) => TRACKS[tr][levelOf(tr)];
const trackDates = (tr) => trackOf(tr).dates;
const isDone = (tr, n) => !!trackDates(tr)[n];
const doneCount = (tr) => Object.keys(trackDates(tr)).length;
function nextDay(tr) {
  for (let n = 1; n <= 30; n++) if (!isDone(tr, n)) return n;
  return 31;
}
// 'done' | 'open' | 'tomorrow' | 'locked'
function dayStatus(tr, n) {
  if (isDone(tr, n)) return 'done';
  if (n === 1) return 'open';
  if (!isDone(tr, n - 1)) return state.testMode ? 'open' : 'locked';
  if (state.testMode) return 'open';
  if (trackDates(tr)[n - 1] < todayStr()) return 'open';
  const e = (state.prog.early || {})[tr];
  return e && e.date === todayStr() && e.day === n ? 'open' : 'tomorrow';
}
/* Desbloqueo anticipado del dia siguiente viendo un anuncio con recompensa (1 por modalidad y dia). */
const earlyUsedToday = (tr) => { const e = (state.prog.early || {})[tr]; return !!(e && e.date === todayStr()); };
async function unlockEarly(tr, n) {
  if (earlyUsedToday(tr)) { toast(t('earlyUsed')); return; }
  let ok = true;
  if (!state.premium) {
    if (!Ads.rewardedAvailable()) { toast(t('earlyNoAd')); Ads.prepareRewarded(); return; }
    ok = await Ads.showRewarded();
  }
  if (!ok) { toast(t('earlyNotEarned')); return; }
  state.prog.early = { ...(state.prog.early || {}), [tr]: { date: todayStr(), day: n } };
  saveProg();
  toast(t('earlyDone', { n }));
  go('day', { track: tr, dayN: n });
}
const doneToday = (tr) => Object.values(trackDates(tr)).includes(todayStr());
const trackFinished = (tr) => nextDay(tr) > 30;
const allLevelsDone = (tr) => trackOf(tr).passed.includes(MAX_LEVEL);
function streak() {
  const dates = new Set(TRACK_IDS.flatMap(tr => Object.values(trackDates(tr))).concat(state.prog.comboDates));
  const d = new Date();
  if (!dates.has(todayStr(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (dates.has(todayStr(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
const joinList = (arr) => arr.length < 2 ? arr.join('') : arr.slice(0, -1).join(', ') + t('andWord') + arr[arr.length - 1];
const trackName = (tr) => t('block' + tr[0].toUpperCase() + tr.slice(1));
const levelName = (n) => L(LEVELS[n - 1].name);
const TRACK_ANIM = { teoria: 'portdebras', tecnica: 'plie', fisico: 'heelraise' };

/* Edad: las sesiones de menores de 9 anos son un 20 % mas cortas. */
const durScale = () => ((currentAge() ?? 12) < 9 ? 0.8 : 1);
const scaleEx = (ex) => ({ ...ex, dur: Math.max(30, Math.round(ex.dur * durScale() / 5) * 5) });
const dayMins = (tr, d) => tr === 'teoria' ? trackMinutes(tr, d) : Math.max(1, Math.round(trackMinutes(tr, d) * durScale()));

/* Nivel recomendado: mezcla los anos de experiencia con como se ve cada persona. */
const YEARS_BASE = [1, 1, 2, 2, 3];
function recommend(exp) {
  const base = YEARS_BASE[exp.years ?? 0];
  const out = {};
  for (const tr of TRACK_IDS) {
    const self = exp.self[tr] ?? 1;
    let lvl = Math.floor((base + self) / 2 + 0.25);
    if (tr === 'tecnica' && exp.years === 0) lvl = 1;        // sin experiencia, la tecnica empieza por el principio
    if (tr !== 'teoria' && (currentAge() ?? 12) < 11) lvl = Math.min(lvl, 2);   // lo avanzado, desde los 11 anos
    out[tr] = Math.max(1, Math.min(MAX_LEVEL, lvl));
  }
  return out;
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
  if (isNative()) {
    try { if (on) await KeepAwake.keepAwake(); else await KeepAwake.allowSleep(); } catch { /* sin permiso */ }
    return;
  }
  try {
    if (on && navigator.wakeLock) wakeLock = await navigator.wakeLock.request('screen');
    else if (!on && wakeLock) { await wakeLock.release(); wakeLock = null; }
  } catch { /* no disponible */ }
}

/* ================= anuncios ================= */
function setAdHeight(h) { document.documentElement.style.setProperty('--ad-h', (h || 0) + 'px'); }
Ads.onHeight = setAdHeight;
const AD_SCREENS = ['home', 'section', 'detail', 'day', 'dayDone', 'finish', 'exam', 'settings', 'combo'];
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

/* ================= sesion (dia de una modalidad o clase libre) ================= */
const S = {
  kind: 'day', track: 'tecnica', ref: null, steps: [], i: 0,
  running: false, endAt: 0, remainingMs: 0, timer: null,
  answers: {}, metro: LS.get('metro', true)
};

function buildTrackSteps(tr, d) {
  if (tr === 'teoria') {
    if (d.quizzes) return d.quizzes.map(q => ({ type: 'quiz', block: 'teoria', q }));
    const steps = [
      { type: 'card', block: 'teoria', card: d.card },
      { type: 'quiz', block: 'teoria', q: d.card.q }
    ];
    if (d.review) steps.push({ type: 'quiz', block: 'teoria', q: d.review, review: d.reviewDay });
    return steps;
  }
  return d.exercises.map(ex => ({ type: 'ex', block: tr, ex: scaleEx(ex), level: levelOf(tr) }));
}

function startTrackDay(tr, n) {
  const d = daysOf(tr)[n - 1];
  Object.assign(S, { kind: 'day', track: tr, ref: n, steps: buildTrackSteps(tr, d), i: 0, answers: {} });
  ensureAudio(); keepAwake(true);
  go('session');
  enterStep(0);
}
function startClass(id) {
  const c = getClass(id);
  Object.assign(S, { kind: 'class', ref: id, steps: c.exercises.map(ex => ({ type: 'ex', block: c.section, ex: scaleEx(ex), level: levelOf(c.section === 'fisico' ? 'fisico' : 'tecnica') })), i: 0, answers: {} });
  ensureAudio(); keepAwake(true);
  go('session');
  enterStep(0);
}

/* Sesion combinada: teoria + tecnica + fisico, distinta cada vez. */
const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
function buildCombo() {
  const lt = levelOf('teoria');
  const pool = [];
  for (let l = 1; l <= lt; l++) pool.push(...CARD_POOL[l]);
  const card = shuffle(pool)[0];
  const tech = exercisesUpTo('tecnica', levelOf('tecnica')).filter(e => e.id !== 'warmup' && e.id !== 'bow');
  const phys = exercisesUpTo('fisico', levelOf('fisico'));
  const strength = phys.filter(e => e.anim !== 'coach' || ['plank', 'plankfull', 'sideplank', 'bridge', 'bridge1', 'deadbug', 'superman'].includes(e.id)).filter(e => e.id !== 'f-warm');
  const stretch = phys.filter(e => ['butterfly', 'fold', 'quad', 'cobra', 'child', 'feet', 'lunge', 'hamstring', 'neck'].includes(e.id));
  const withDur = (e, d) => scaleEx({ ...e, dur: d });
  const steps = [
    { type: 'card', block: 'teoria', card },
    { type: 'quiz', block: 'teoria', q: card.q },
    { type: 'ex', block: 'tecnica', ex: withDur(LIB_WARM, 90) },
    ...shuffle(tech).slice(0, 4).map(e => ({ type: 'ex', block: 'tecnica', ex: withDur(e, 120) })),
    ...shuffle(strength).slice(0, 2).map(e => ({ type: 'ex', block: 'fisico', ex: withDur(e, 90) })),
    ...shuffle(stretch).slice(0, 1).map(e => ({ type: 'ex', block: 'fisico', ex: withDur(e, 90) }))
  ];
  steps.forEach(st => { if (st.type === 'ex') st.level = levelOf(st.block); });
  return steps;
}
const LIB_WARM = CLASSES.flatMap(c => c.exercises).find(e => e.id === 'warmup');
const comboMinutes = (steps) => Math.round((steps.filter(s => s.type === 'ex').reduce((a, s) => a + s.ex.dur, 0) + 60) / 60);
function startCombo(steps) {
  Object.assign(S, { kind: 'combo', ref: null, steps, i: 0, answers: {} });
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
    const tr = S.track, n = S.ref;
    const d = daysOf(tr)[n - 1];
    const first = !isDone(tr, n);
    if (first) trackDates(tr)[n] = todayStr();
    state.prog.minutes += dayMins(tr, d);
    const qs = S.steps.map((st, i) => st.type === 'quiz' ? (S.answers[i] === st.q.answer) : null).filter(v => v !== null);
    const right = qs.filter(Boolean).length;
    state.prog.quizRight += right;
    saveProg();
    state.lastResult = { tr, n, first, right, total: qs.length };
    go('dayDone');
    adAfterSession();
  } else if (S.kind === 'combo') {
    if (!state.prog.comboDates.includes(todayStr())) state.prog.comboDates.push(todayStr());
    state.prog.minutes += comboMinutes(S.steps);
    saveProg();
    state.lastResult = { combo: true, mins: comboMinutes(S.steps) };
    go('dayDone');
    adAfterSession();
  } else {
    state.done[S.ref] = (state.done[S.ref] || 0) + 1;
    LS.set('done', state.done);
    state.classId = S.ref;
    go('finish');
    adAfterSession();
  }
}

/* Anuncio a pantalla completa al terminar (con frecuencia limitada y nunca durante el ejercicio). */
function adAfterSession() {
  if (state.premium) return;
  setTimeout(() => { if (['dayDone', 'finish'].includes(state.screen)) Ads.afterSession(); }, 900);
}

function leaveSession() {
  if (S.kind === 'day') go('day', { track: S.track, dayN: S.ref });
  else if (S.kind === 'combo') go('combo');
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
    initServices(true).then(() => go(wasChanging ? 'settings' : (state.prog.placed ? 'home' : 'exp')));
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

/* ================= alta: experiencia y autoevaluacion ================= */
function onbHead(step) {
  const back = step > 1 || state.changingLevel ? `<button class="icon-btn" id="onbBack" aria-label="${t('back')}">${backSvg()}</button>` : '<span class="spacer"></span>';
  return `<header class="topbar">${back}<span class="progress-text">${t('onbStep', { n: step, m: 3 })}</span><span class="spacer"></span></header>
    <div class="sbar"><i style="width:${Math.round(step / 3 * 100)}%"></i></div>`;
}
function renderExp() {
  const opts = t('yearsOpts');
  $app.innerHTML = `
    <main class="screen">
      ${onbHead(1)}
      <div class="onb-hero"><div id="guide" class="guide small"></div><div class="bubble">${t('expBubble')}</div></div>
      <h1>${t('expTitle')}</h1>
      <p class="muted">${t('expText')}</p>
      <div class="opts">${opts.map((o, i) => `<button class="opt ${state.exp.years === i ? 'sel' : ''}" data-y="${i}">${o}</button>`).join('')}</div>
    </main>`;
  document.querySelectorAll('[data-y]').forEach(b => b.onclick = () => {
    state.exp.years = parseInt(b.dataset.y, 10); LS.set('exp', state.exp); go('self');
  });
  const bk = document.getElementById('onbBack');
  if (bk) bk.onclick = () => { state.changingLevel = false; go('settings'); };
  mountGuide('#guide', 'wave', 90);
}
function renderSelf() {
  const q = (tr) => {
    const opts = t('selfOpts_' + tr);
    const cur = state.exp.self[tr];
    return `<section class="selfq">
      <span class="bchip" style="--c1:${COLORS[BLOCK_COLOR[tr]][0]};--c2:${COLORS[BLOCK_COLOR[tr]][1]}">${trackName(tr)}</span>
      <h2>${t('selfQ_' + tr)}</h2>
      <div class="opts">${opts.map((o, i) => `<button class="opt ${cur === i + 1 ? 'sel' : ''}" data-tr="${tr}" data-v="${i + 1}">${o}</button>`).join('')}</div>
    </section>`;
  };
  const ready = TRACK_IDS.every(tr => state.exp.self[tr]);
  $app.innerHTML = `
    <main class="screen">
      ${onbHead(2)}
      <h1>${t('selfTitle')}</h1>
      <p class="muted">${t('selfText')}</p>
      ${TRACK_IDS.map(q).join('')}
      <button class="btn big" id="selfOk" ${ready ? '' : 'aria-disabled="true"'}>${t('continue')}</button>
    </main>`;
  document.querySelectorAll('[data-tr]').forEach(b => b.onclick = () => {
    state.exp.self[b.dataset.tr] = parseInt(b.dataset.v, 10); LS.set('exp', state.exp);
    const y = window.scrollY; render(); window.scrollTo(0, y);
  });
  document.getElementById('selfOk').onclick = () => {
    if (!TRACK_IDS.every(tr => state.exp.self[tr])) { toast(t('selfMissing')); return; }
    state.pending = recommend(state.exp);
    go('placement');
  };
  document.getElementById('onbBack').onclick = () => go('exp');
}
function renderPlacement() {
  if (!state.pending) state.pending = recommend(state.exp);
  const rec = recommend(state.exp);
  const row = (tr) => `
    <div class="prow">
      <span class="bchip" style="--c1:${COLORS[BLOCK_COLOR[tr]][0]};--c2:${COLORS[BLOCK_COLOR[tr]][1]}">${trackName(tr)}</span>
      <div class="lvl-pick" role="radiogroup" aria-label="${trackName(tr)}">
        ${LEVELS.map(l => `<button role="radio" aria-checked="${state.pending[tr] === l.n}" class="${state.pending[tr] === l.n ? 'on' : ''}" data-tr="${tr}" data-l="${l.n}"><b>${l.n}</b><small>${L(l.name)}</small>${rec[tr] === l.n ? `<i>${t('recommended')}</i>` : ''}</button>`).join('')}
      </div>
    </div>`;
  $app.innerHTML = `
    <main class="screen">
      ${onbHead(3)}
      <div class="onb-hero"><div id="guide" class="guide small"></div><div class="bubble">${t('placeBubble')}</div></div>
      <h1>${t('placeTitle')}</h1>
      <p class="muted">${t('placeText')}</p>
      <div class="prows">${TRACK_IDS.map(row).join('')}</div>
      ${(currentAge() ?? 12) < 11 ? `<p class="muted small rule">${t('placeAgeCap')}</p>` : ''}
      ${state.changingLevel ? `<p class="muted small rule">${t('placeReset')}</p>` : ''}
      <button class="btn big" id="placeOk">${state.changingLevel ? t('saveLevels') : t('startApp')}</button>
    </main>`;
  document.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
    if (b.dataset.tr !== 'teoria' && parseInt(b.dataset.l, 10) === 3 && (currentAge() ?? 12) < 11) { toast(t('placeAgeCap')); return; }
    state.pending[b.dataset.tr] = parseInt(b.dataset.l, 10);
    const y = window.scrollY; render(); window.scrollTo(0, y);
  });
  document.getElementById('placeOk').onclick = () => {
    for (const tr of TRACK_IDS) {
      if (!state.prog.placed || levelOf(tr) !== state.pending[tr]) state.prog.tracks[tr] = emptyTrack(state.pending[tr]);
    }
    state.prog.placed = true; saveProg();
    const wasChanging = state.changingLevel;
    state.changingLevel = false; state.pending = null;
    go(wasChanging ? 'settings' : 'home');
  };
  document.getElementById('onbBack').onclick = () => go('self');
  mountGuide('#guide', 'celebrate', 90);
}

/* ================= pantalla: inicio ================= */
function dayDot(tr, n) {
  const st = dayStatus(tr, n);
  const d = daysOf(tr)[n - 1];
  const isNext = n === nextDay(tr);
  const cls = ['dot', st, isNext ? 'next' : '', d.rest ? 'rest' : ''].join(' ');
  const inner = st === 'done' ? checkSvg(15) : `<span>${n}</span>`;
  const label = `${trackName(tr)} · ${t('dayWord')} ${n}${d.rest ? ' · ' + L(d.title) : ''}`;
  return `<button class="${cls}" data-day="${n}" aria-label="${label}">${inner}${d.rest && st !== 'done' ? `<i class="moon">${moonSvg(10)}</i>` : ''}</button>`;
}

function modeCard(tr) {
  const [c1, c2] = COLORS[BLOCK_COLOR[tr]];
  const nd = nextDay(tr);
  let status, meta;
  if (allLevelsDone(tr)) { status = `<em class="mstate done">${checkSvg(13)} ${t('trackDone')}</em>`; meta = t('allLevelsDone'); }
  else if (nd > 30) { status = `<em class="mstate go">${t('examShort')}</em>`; meta = t('examWaiting', { l: levelOf(tr) }); }
  else {
    const d = daysOf(tr)[nd - 1];
    const st = dayStatus(tr, nd);
    meta = `${t('dayWord')} ${nd} · ${dayMins(tr, d)} ${t('minutes')} · ${L(d.title)}`;
    status = st === 'tomorrow'
      ? `<em class="mstate wait">${checkSvg(13)} ${t('doneTodayShort')}</em>`
      : `<em class="mstate go">${t('startShort')}</em>`;
  }
  return `
    <button class="mode" data-track="${tr}" style="--c1:${c1};--c2:${c2}">
      <span class="mtop"><span class="mname">${trackName(tr)}</span>${status}</span>
      <span class="mlevel">${t('levelWord')} ${levelOf(tr)} · ${levelName(levelOf(tr))}</span>
      <span class="mmeta">${meta}</span>
      <span class="mbar"><i style="width:${Math.round(doneCount(tr) / 30 * 100)}%"></i></span>
      <span class="mcount">${doneCount(tr)}/30 ${t('daysWord')}</span>
    </button>`;
}

function renderHome() {
  const today = TRACK_IDS.filter(doneToday);
  let bubble, anim;
  if (today.length === 3) { bubble = t('hiAllToday'); anim = 'celebrate'; }
  else if (today.length) { bubble = t('hiMore', { m: joinList(today.map(trackName)) }); anim = 'coach'; }
  else if (TRACK_IDS.every(tr => doneCount(tr) === 0) && !state.prog.comboDates.length) { bubble = t('hiStart'); anim = 'wave'; }
  else { bubble = t('hiPick'); anim = 'wave'; }

  const mt = state.mapTrack;
  let dots = '';
  for (let n = 1; n <= 30; n++) dots += dayDot(mt, n);
  const w = weekOf(mt, Math.min(30, nextDay(mt)), levelOf(mt));
  const fin = trackFinished(mt);
  const lvRows = TRACK_IDS.map(tr => {
    const lv = levelOf(tr);
    return `<div class="lvrow">
      <strong>${trackName(tr)}</strong>
      <span class="pips">${LEVELS.map(l => `<i class="${l.n < lv || trackOf(tr).passed.includes(l.n) ? 'done' : l.n === lv ? 'cur' : ''}" title="${L(l.name)}">${l.n}</i>`).join('')}</span>
      <small>${levelName(lv)}</small>
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
        <span class="eyebrow">${t('yourLevels')}</span>
        <div class="lvrows">${lvRows}</div>
        <div class="stats">
          <div><b>${TRACK_IDS.reduce((a, tr) => a + doneCount(tr), 0)}</b><span>${t('daysDone')}</span></div>
          <div><b>${flameSvg()} ${streak()}</b><span>${t('streak')}</span></div>
          <div><b>${state.prog.minutes}</b><span>${t('minutesDone')}</span></div>
        </div>
      </section>

      <section class="block">
        <h2>${t('whatToday')}</h2>
        <p class="muted small">${t('whatTodaySub')}</p>
        <div class="modes">${TRACK_IDS.map(modeCard).join('')}</div>
        <button class="combo-card" id="comboBtn">
          <span class="cstripe"><i></i><i></i><i></i></span>
          <span><strong>${t('comboTitle')}</strong><small>${t('comboSub')}</small></span>
        </button>
      </section>

      <section class="block">
        <h2>${t('yourPath')}</h2>
        <div class="seg" role="tablist">
          ${TRACK_IDS.map(tr => `<button role="tab" aria-selected="${tr === mt}" class="${tr === mt ? 'on' : ''}" data-map="${tr}">${trackName(tr)}</button>`).join('')}
        </div>
        <div class="map">
          <p class="wnow"><span class="eyebrow">${t('levelWord')} ${levelOf(mt)} · ${levelName(levelOf(mt))}</span>${L(w.name)}</p>
          <div class="dots-grid">${dots}</div>
        </div>
        <button class="exam-row ${fin ? 'open' : ''}" id="examRow">
          <span class="exam-ic">${fin ? starSvg(22) : lockSvg(16)}</span>
          <span><strong>${t('examOf', { m: trackName(mt), l: levelOf(mt) })}</strong><small>${fin ? t('examReadyTrack') : t('examLockedTrack')}</small></span>
        </button>
      </section>

      <section class="block">
        <h2>${t('freePractice')}</h2>
        <p class="muted small">${t('freePracticeSub')}</p>
        <div class="tiles">${['teoria', 'tecnica', 'fisico'].map(tile).join('')}</div>
      </section>
      ${adSlotHtml()}
    </main>`;

  document.getElementById('setBtn').onclick = () => go('settings');
  document.getElementById('examRow').onclick = () => go('exam', { track: mt });
  document.getElementById('comboBtn').onclick = () => { state.combo = buildCombo(); go('combo'); };
  document.querySelectorAll('[data-track]').forEach(b => b.onclick = () => {
    const tr = b.dataset.track;
    const nd = nextDay(tr);
    if (nd > 30) { go('exam', { track: tr }); return; }
    go('day', { track: tr, dayN: nd });
  });
  document.querySelectorAll('[data-map]').forEach(b => b.onclick = () => { state.mapTrack = b.dataset.map; const y = window.scrollY; render(); window.scrollTo(0, y); });
  document.querySelectorAll('[data-day]').forEach(b => b.onclick = () => {
    const n = parseInt(b.dataset.day, 10);
    const st = dayStatus(mt, n);
    if (st === 'locked') toast(t('lockedDay'));
    else if (st === 'tomorrow') toast(t('lockedTomorrow'));
    else go('day', { track: mt, dayN: n });
  });
  document.querySelectorAll('[data-sec]').forEach(b => b.onclick = () => go('section', { section: b.dataset.sec }));
  mountGuide('#guide', anim, 90);
}

/* ================= pantalla: sesion combinada ================= */
function renderCombo() {
  if (!state.combo) state.combo = buildCombo();
  const steps = state.combo;
  const card = steps[0].card;
  const byBlock = (b) => steps.filter(s => s.type === 'ex' && s.block === b);
  const blk = (tr, body, mins) => {
    const [c1, c2] = COLORS[BLOCK_COLOR[tr]];
    return `<section class="dblock" style="--c1:${c1};--c2:${c2}">
      <header><span class="bchip">${trackName(tr)} · ${t('levelWord')} ${levelOf(tr)}</span>${mins ? `<small>${mins} ${t('minutes')}</small>` : ''}</header>${body}</section>`;
  };
  const m = (arr) => Math.max(1, Math.round(arr.reduce((a, s) => a + s.ex.dur, 0) / 60));
  $app.innerHTML = `
    <main class="screen">
      <header class="topbar"><button class="icon-btn" id="backBtn" aria-label="${t('back')}">${backSvg()}</button><strong>${t('comboTitle')}</strong><span class="spacer"></span></header>
      <div class="day-hero">
        <div id="guide" class="guide small"></div>
        <div>
          <span class="eyebrow">${t('comboEyebrow')}</span>
          <h1>${t('comboHead')}</h1>
          <p class="muted">${comboMinutes(steps)} ${t('minutes')}</p>
        </div>
      </div>
      <button class="btn big" id="startBtn">${t('comboStart')}</button>
      <button class="btn secondary big" id="shuffleBtn">${t('comboShuffle')}</button>
      ${blk('teoria', `<p class="bline">${t('tlCard')}: <strong>${L(card.title)}</strong></p>`, 1)}
      ${blk('tecnica', exList(byBlock('tecnica').map(s => s.ex)), m(byBlock('tecnica')))}
      ${blk('fisico', exList(byBlock('fisico').map(s => s.ex)), m(byBlock('fisico')))}
      <p class="muted small rule">${t('comboRule')}</p>
      ${adSlotHtml()}
    </main>`;
  document.getElementById('backBtn').onclick = () => go('home');
  document.getElementById('startBtn').onclick = () => startCombo(steps);
  document.getElementById('shuffleBtn').onclick = () => { state.combo = buildCombo(); render(); };
  mountGuide('#guide', 'balance', 90);
}

/* ================= pantalla: dia de una modalidad ================= */
function exList(list) {
  return `<ol class="ex-list">${list.map(e => `<li><span class="ex-name">${L(e.name)}</span><span class="ex-dur">${fmt(e.dur)}</span></li>`).join('')}</ol>`;
}
function renderDay() {
  const tr = state.track, n = state.dayN;
  const lv = levelOf(tr);
  const d = daysOf(tr)[n - 1];
  const w = weekOf(tr, n, lv);
  const st = dayStatus(tr, n);
  const [c1, c2] = COLORS[BLOCK_COLOR[tr]];
  let body;
  if (tr === 'teoria') {
    body = `<section class="dblock" style="--c1:${c1};--c2:${c2}">
      <ul class="plain tl">
        ${d.quizzes ? `<li>${t('tlQuizzes', { n: d.quizzes.length })}</li>` : `
        <li>${t('tlCard')}: <strong>${L(d.card.title)}</strong></li>
        <li>${t('tlQuiz')}</li>
        ${d.review ? `<li>${t('tlReview', { n: d.reviewDay })}</li>` : ''}`}
      </ul></section>`;
  } else {
    body = `<section class="dblock" style="--c1:${c1};--c2:${c2}">${exList(d.exercises.map(scaleEx))}</section>`;
  }
  $app.innerHTML = `
    <main class="screen">
      <header class="topbar"><button class="icon-btn" id="backBtn" aria-label="${t('back')}">${backSvg()}</button><strong>${trackName(tr)} · ${t('dayOf', { n, m: 30 })}</strong><span class="spacer"></span></header>
      <div class="day-hero" style="--c1:${c1};--c2:${c2}">
        <div id="guide" class="guide small"></div>
        <div>
          <span class="bchip">${trackName(tr)} · ${t('levelWord')} ${lv}</span>
          <span class="eyebrow wk">${L(w.name)}</span>
          <h1>${L(d.title)}</h1>
          <p class="muted">${dayMins(tr, d)} ${t('minutes')}${isDone(tr, n) ? ' · ' + t('doneOnce') : ''}</p>
        </div>
      </div>
      ${st === 'done' || st === 'open' ? `<button class="btn big" id="startBtn">${isDone(tr, n) ? t('repeatDay', { n }) : t('startDay', { n })}</button>` : `<div class="wait"><strong>${t('comeBack', { n })}</strong><span>${t('comeBackText')}</span></div>
        ${st === 'tomorrow' && !earlyUsedToday(tr) ? `<button class="btn big reward-btn" id="earlyBtn">${state.premium ? t('earlyPremium') : t('earlyAd')}</button><p class="muted small rule">${t('earlyNote')}</p>` : ''}`}
      ${body}
      <p class="muted small rule">${t('onlyThisTrack', { m: trackName(tr) })}</p>
      ${tr === 'teoria' ? '' : `<section class="note">
        <h2>${t('before')}</h2>
        <ul>${t('beforeList').map(x => `<li>${x}</li>`).join('')}</ul>
      </section>`}
      ${adSlotHtml()}
    </main>`;
  document.getElementById('backBtn').onclick = () => go('home', { mapTrack: tr });
  const sb = document.getElementById('startBtn');
  if (sb) sb.onclick = () => startTrackDay(tr, n);
  const eb = document.getElementById('earlyBtn');
  if (eb) eb.onclick = () => unlockEarly(tr, n);
  const firstAnim = tr === 'teoria' ? 'portdebras' : (d.exercises.find(e => !['warmup', 'f-warm'].includes(e.id)) || d.exercises[0]).anim;
  mountGuide('#guide', firstAnim || TRACK_ANIM[tr], 70);
}

/* ================= detalles de colocacion ================= */
function detailsHtml(st) {
  const lvl = st.level || levelOf(st.block === 'fisico' ? 'fisico' : 'tecnica');
  const kind = st.block === 'fisico' ? 'fisico' : 'tecnica';
  const core = CORE[kind][lvl];
  const list = detailsFor(st.ex.id, lvl);
  return `<section class="details">
    <header><span class="dl-title">${t('detailsTitle')}</span><span class="dl-level">${t('levelWord')} ${lvl}</span></header>
    <p class="core"><strong>${t('placement')}:</strong> ${L(core)}</p>
    ${list.length ? `<ul>${list.map(x => `<li>${L(x)}</li>`).join('')}</ul>` : ''}
  </section>`;
}

/* ================= pantalla: sesion ================= */
function renderSession() {
  const st = S.steps[S.i];
  const total = S.steps.length;
  const [c1, c2] = COLORS[BLOCK_COLOR[st.block]] || COLORS.rose;
  const pct = Math.round((S.i / total) * 100);
  const head = `
    <header class="topbar">
      <button class="icon-btn" id="quitBtn" aria-label="${t('quit')}">${closeSvg()}</button>
      <span class="progress-text"><span class="bchip">${trackName(st.block)}${S.kind === 'day' ? ' · ' + t('dayWord') + ' ' + S.ref : ''}</span> ${t('step', { n: S.i + 1, m: total })}</span>
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
    const picked = S.answers[S.i] ?? null;
    const answered = picked !== null;
    const ok = answered && picked === st.q.answer;
    body = `
      <div class="stage short"><div id="guide" class="guide"></div></div>
      <article class="lesson-card">${st.review ? `<span class="eyebrow">${t('reviewOf', { n: st.review })}</span>` : `<span class="eyebrow">${t('question')}</span>`}<h1>${L(st.q.q)}</h1></article>
      <div class="opts">
        ${opts.map((o, i) => `<button class="opt ${answered ? (i === st.q.answer ? 'right' : i === picked ? 'wrong' : '') : ''}" data-o="${i}" ${answered ? 'disabled' : ''}>${o}</button>`).join('')}
      </div>
      ${answered ? `<p class="feedback ${ok ? 'ok' : 'no'}">${ok ? t('correct') : t('wrongIs')}</p>` : ''}
      <div class="controls two">
        <button class="btn secondary" id="prevBtn">${t('prev')}</button>
        <button class="btn" id="nextBtn" ${answered ? '' : 'aria-disabled="true"'}>${S.i + 1 === total ? t('finishDay') : t('next')}</button>
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
      ${detailsHtml(st)}
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
  if (prev) prev.onclick = () => { if (S.i > 0) enterStep(S.i - 1); };
  const nx = document.getElementById('nextBtn');
  if (st.type === 'quiz') {
    const picked = S.answers[S.i] ?? null;
    document.querySelectorAll('[data-o]').forEach(b => b.onclick = () => {
      S.answers[S.i] = parseInt(b.dataset.o, 10);
      renderSession();
    });
    nx.onclick = () => { if (picked === null) { toast(t('answerFirst')); return; } nextStep(); };
    mountGuide('#guide', picked === null ? 'coach' : picked === st.q.answer ? 'celebrate' : 'coach', 90);
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
  const r = state.lastResult || { tr: state.track, n: state.dayN, right: 0, total: 0 };
  if (r.combo) {
    $app.innerHTML = `
      <main class="screen center">
        <div class="guide hero-size" id="guide"></div>
        <div class="stars">${starSvg()}${starSvg()}${starSvg()}</div>
        <h1>${t('comboDone')}</h1>
        <p>${t('comboDoneText', { m: r.mins })}</p>
        <button class="btn big" id="againBtn">${t('comboAgain')}</button>
        <button class="btn secondary big" id="homeBtn">${t('backHome')}</button>
        ${adSlotHtml()}
      </main>`;
    document.getElementById('homeBtn').onclick = () => go('home');
    document.getElementById('againBtn').onclick = () => { state.combo = buildCombo(); go('combo'); };
    mountGuide('#guide', 'celebrate', 110);
    return;
  }
  const nd = nextDay(r.tr);
  const others = TRACK_IDS.filter(tr => tr !== r.tr && nextDay(tr) <= 30 && dayStatus(tr, nextDay(tr)) === 'open');
  $app.innerHTML = `
    <main class="screen center">
      <div class="guide hero-size" id="guide"></div>
      <div class="stars">${starSvg()}${starSvg()}${starSvg()}</div>
      <h1>${t('dayDoneTitle', { n: r.n, m: trackName(r.tr) })}</h1>
      ${r.total ? `<p class="pill ${r.right === r.total ? 'ok' : 'no'}">${t('quizScore2', { r: r.right, t: r.total })}</p>` : ''}
      <p>${nd > 30 ? t('trackDoneMsg2', { m: trackName(r.tr), l: levelOf(r.tr) }) : t('dayDoneNext2', { n: nd, m: trackName(r.tr) })}</p>
      ${others.length ? `<p class="muted">${t('tryOther', { m: joinList(others.map(trackName)).replace(t('andWord'), t('orWord')) })}</p>` : ''}
      ${nd > 30 ? `<button class="btn big" id="examBtn">${t('toExam')}</button>` : ''}
      <button class="btn ${nd > 30 ? 'secondary' : ''} big" id="homeBtn">${t('backHome')}</button>
      ${adSlotHtml()}
    </main>`;
  document.getElementById('homeBtn').onclick = () => go('home', { mapTrack: r.tr });
  const eb = document.getElementById('examBtn');
  if (eb) eb.onclick = () => go('exam', { track: r.tr });
  mountGuide('#guide', 'celebrate', 110);
}

/* ================= pantalla: examen de una modalidad (pendiente) ================= */
function renderExam() {
  const tr = state.track;
  const lv = levelOf(tr);
  const fin = trackFinished(tr);
  const top = allLevelsDone(tr);
  $app.innerHTML = `
    <main class="screen">
      <header class="topbar"><button class="icon-btn" id="backBtn" aria-label="${t('back')}">${backSvg()}</button><strong>${t('examOf', { m: trackName(tr), l: lv })}</strong><span class="spacer"></span></header>
      <div class="stage"><div id="guide" class="guide"></div></div>
      <section class="lesson-card">
        <span class="eyebrow">${top ? t('trackDone') : fin ? t('levelSoon') : t('locked')}</span>
        <h1>${top ? t('allLevelsDone') : fin ? t('examReadyTrack') : t('examLockedTrack')}</h1>
        <p><strong>${trackName(tr)}</strong> · ${t('levelWord')} ${lv} (${levelName(lv)}): ${doneCount(tr)}/30 ${t('daysWord')}</p>
        ${top ? '' : `<p>${t('examSoon2', { next: lv < MAX_LEVEL ? levelName(lv + 1) : '' })}</p>
        <p><strong>${t('examWill')}</strong></p>
        <ul class="plain">${t('examList_' + tr).map(x => `<li>${x}</li>`).join('')}</ul>`}
      </section>
      ${fin && !top && state.testMode ? `<button class="btn big" id="passBtn">${t('testPass')}</button>` : ''}
      ${adSlotHtml()}
    </main>`;
  document.getElementById('backBtn').onclick = () => go('home', { mapTrack: tr });
  const pb = document.getElementById('passBtn');
  if (pb) pb.onclick = () => {
    const passed = trackOf(tr).passed.concat(lv);
    if (lv < MAX_LEVEL) state.prog.tracks[tr] = { ...emptyTrack(lv + 1), passed };
    else trackOf(tr).passed = passed;
    saveProg();
    toast(lv < MAX_LEVEL ? t('levelUp', { m: trackName(tr), l: lv + 1 }) : t('allLevelsDone'));
    go('home', { mapTrack: tr });
  };
  mountGuide('#guide', fin ? 'celebrate' : 'coach', 90);
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
  if (sec === 'teoria') return { count: THEORY_ALL.length, mins: THEORY_ALL.reduce((a, l) => a + l.mins, 0), unit: t('lessons') };
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
  const items = sec === 'teoria' ? THEORY_ALL.map(lessonCard).join('') : classesOf(sec).map(classCard).join('');
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
  const l = THEORY_ALL.find(x => x.id === state.lessonId);
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
        <button class="link block" id="levelBtn">${t('changeLevel')}</button>
        <button class="link block danger" id="resetBtn">${t('resetProgress')}</button>
      </section>
      <section class="card set">
        <button class="link block" id="ageBtn">${t('changeAge')}</button>
        ${CONFIG.PRIVACY_URL ? `<a class="link block" href="${CONFIG.PRIVACY_URL}" target="_blank" rel="noopener">${t('privacy')}</a>` : ''}
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
  document.getElementById('levelBtn').onclick = () => { state.changingLevel = true; state.pending = { teoria: levelOf('teoria'), tecnica: levelOf('tecnica'), fisico: levelOf('fisico') }; go('exp'); };
  document.getElementById('resetBtn').onclick = () => confirmBox(t('resetAsk'), t('resetYes'), t('cancel'), () => {
    state.prog = emptyProg(); saveProg(); toast(t('resetDone')); go('exp');
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
  else if (state.birth && !state.prog.placed && !['age', 'exp', 'self', 'placement'].includes(state.screen)) state.screen = 'exp';
  switch (state.screen) {
    case 'age': renderAge(); break;
    case 'exp': renderExp(); break;
    case 'self': renderSelf(); break;
    case 'placement': renderPlacement(); break;
    case 'combo': renderCombo(); break;
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
    else if (s === 'self') go('exp');
    else if (s === 'placement') go('self');
    else if (s === 'exp') { if (state.changingLevel) { state.changingLevel = false; go('settings'); } else CapApp.exitApp(); }
    else go('home');
  });
} catch { /* vista previa web */ }

document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.screen === 'session' && S.running) togglePause();
});

render();
initServices(false).then(syncAds);
Billing.init();

if (!isNative()) window.__plie = { state, go, startTrackDay, startClass, S, TRACKS, saveProg };
