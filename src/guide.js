/* ------------------------------------------------------------------
   La "sombra": una figura de ballet articulada, dibujada con SVG (vista frontal).
   Se mueve interpolando entre poses clave, sin imagenes ni videos.
   Sistema: x hacia la derecha, y hacia abajo. CX = eje central, FLOOR = suelo.
   ------------------------------------------------------------------ */
const NS = 'http://www.w3.org/2000/svg';
const CX = 100, FLOOR = 280;
const THIGH = 62, SHIN = 60, UPPER = 38, FORE = 36;
const HIPW = 13, SHW = 21, TORSO = 64;
const LEG = THIGH + SHIN - 0.02;
const rad = (d) => d * Math.PI / 180;

/* ---------- utilidades de poses ---------- */
const clone = (o) => JSON.parse(JSON.stringify(o));
function merge(base, over) {
  const o = clone(base);
  for (const k in over) {
    if (over[k] && typeof over[k] === 'object') o[k] = merge(o[k] || {}, over[k]);
    else o[k] = over[k];
  }
  return o;
}
function mix(a, b, t) {
  if (typeof a === 'number') return a + (b - a) * t;
  const o = {};
  for (const k in a) o[k] = mix(a[k], b[k], t);
  return o;
}

// hip = altura de la cadera; lean = desplazamiento lateral del torso; tilt = inclinacion de la cabeza
// shrug = hombros arriba; l / r = piernas (x = tobillo hacia fuera, y = altura del tobillo,
// tx/ty = donde queda la punta del pie respecto al tobillo, k = cuanto se abre la rodilla)
// al / ar = brazos (a = angulo del brazo, f = angulo del antebrazo; 0 = abajo, 90 = al lado, 180 = arriba)
const BASE = {
  hip: 150, lean: 0, tilt: 0, shrug: 0,
  l: { x: 7, y: 272, tx: 12, ty: 8, k: 1 },
  r: { x: 7, y: 272, tx: 12, ty: 8, k: 1 },
  al: { a: 14, f: -2 },
  ar: { a: 14, f: -2 }
};
const pose = (o = {}) => merge(BASE, o);

// pierna recta abierta un angulo phi (grados) respecto a la vertical
const straight = (phi, hip = 150) => ({
  x: HIPW + LEG * Math.sin(rad(phi)),
  y: hip + LEG * Math.cos(rad(phi))
});

const ARMS = {
  bas: { a: 14, f: -2 },
  prem: { a: 40, f: -105 },
  sec: { a: 80, f: 82 },
  haut: { a: 148, f: 222 },
  open: { a: 55, f: 68 }
};
const both = (arm) => ({ al: { ...arm }, ar: { ...arm } });
const POINT = { tx: 8, ty: 14 };            // pie estirado apoyando la punta
const LEGSIDE = (phi, extra = {}) => ({ ...straight(phi), ...POINT, k: 0.2, ...extra });

const P = {
  stand: pose(),
  stand2: pose({ l: { x: 40 }, r: { x: 40 } }),
  plie1: pose({ hip: 176, l: { k: 0.55 }, r: { k: 0.55 } }),
  plie2: pose({ hip: 180, l: { x: 40, k: 0.55 }, r: { x: 40, k: 0.55 } }),
  tenduR: pose({ lean: -3, r: LEGSIDE(17) }),
  tenduL: pose({ lean: 3, l: LEGSIDE(17) }),
  degR: pose({ lean: -4, r: LEGSIDE(22, { y: straight(22).y - 4, ty: 20 }) }),
  degL: pose({ lean: 4, l: LEGSIDE(22, { y: straight(22).y - 4, ty: 20 }) }),
  releve: pose({ hip: 136, l: { y: 258, tx: 3, ty: 22 }, r: { y: 258, tx: 3, ty: 22 } }),
  releveS: pose({ hip: 136, l: { y: 258, tx: 3, ty: 22 }, r: { y: 258, tx: 3, ty: 22 }, ...both(ARMS.sec) }),
  stand_sec: pose(both(ARMS.sec)),
  walkR: pose({ hip: 136, l: { y: 258, tx: 3, ty: 22 }, r: { x: 10, y: 244, tx: 2, ty: 20, k: 0.5 } }),
  walkL: pose({ hip: 136, r: { y: 258, tx: 3, ty: 22 }, l: { x: 10, y: 244, tx: 2, ty: 20, k: 0.5 } }),
  marchR: pose({ r: { x: 10, y: 236, tx: 2, ty: 16, k: 0.35 }, al: { a: 30, f: 20 }, ar: { a: 4, f: -10 } }),
  marchL: pose({ l: { x: 10, y: 236, tx: 2, ty: 16, k: 0.35 }, ar: { a: 30, f: 20 }, al: { a: 4, f: -10 } }),
  jump: pose({ hip: 116, l: { y: 238, tx: 3, ty: 20 }, r: { y: 238, tx: 3, ty: 20 }, ...both(ARMS.open) }),
  plie1open: pose({ hip: 176, l: { k: 0.55 }, r: { k: 0.55 }, ...both(ARMS.open) }),
  standOpen: pose(both(ARMS.open)),
  par: pose({ l: { x: 14, tx: 0, ty: 6 }, r: { x: 14, tx: 0, ty: 6 } }),
  parUp: pose({ hip: 136, l: { x: 14, y: 258, tx: 0, ty: 20 }, r: { x: 14, y: 258, tx: 0, ty: 20 } }),
  squat: pose({ hip: 186, l: { x: 14, tx: 0, ty: 6, k: 0.3 }, r: { x: 14, tx: 0, ty: 6, k: 0.3 }, ...both(ARMS.prem) }),
  parPrem: pose({ l: { x: 14, tx: 0, ty: 6 }, r: { x: 14, tx: 0, ty: 6 }, ...both(ARMS.prem) }),
  retR: pose({ lean: -4, r: { x: 8, y: 207, tx: 0, ty: 14, k: 1 }, ...both(ARMS.sec) }),
  retL: pose({ lean: 4, l: { x: 8, y: 207, tx: 0, ty: 14, k: 1 }, ...both(ARMS.sec) }),
  tiltL: pose({ tilt: -16, lean: -3 }),
  tiltR: pose({ tilt: 16, lean: 3 }),
  shrug: pose({ shrug: 9 }),
  bowDown: pose({ hip: 165, tilt: 13, lean: 5, l: { k: 0.4 }, r: { k: 0.4 }, ar: { a: 62, f: 68 } }),
  coachA: pose({ ar: { a: 55, f: 68 } }),
  coachB: pose({ ar: { a: 64, f: 80 } }),
  waveA: pose({ ar: { a: 132, f: 152 } }),
  waveB: pose({ ar: { a: 132, f: 196 } }),
  celebUp: pose({ hip: 128, l: { y: 250, tx: 3, ty: 20 }, r: { y: 250, tx: 3, ty: 20 }, ...both(ARMS.haut) }),
  celebDown: pose({ hip: 152, ...both(ARMS.haut) })
};
const withArms = (base, arm) => merge(base, both(arm));
const A = (name) => ARMS[name];

/* ---------- animaciones: [compas, pose], ciclo de `beats` compases ---------- */
export const ANIMS = {
  stand: { beats: 6, keys: [[0, P.stand], [6, P.stand]] },
  coach: { beats: 6, keys: [[0, P.coachA], [3, P.coachB], [6, P.coachA]] },
  wave: { beats: 4, keys: [[0, P.waveA], [1, P.waveB], [2, P.waveA], [3, P.waveB], [4, P.waveA]] },
  celebrate: { beats: 4, keys: [[0, P.celebDown], [1, P.celebUp], [2, P.celebDown], [3, P.celebUp], [4, P.celebDown]] },
  march: { beats: 4, keys: [[0, P.stand], [1, P.marchR], [2, P.stand], [3, P.marchL], [4, P.stand]] },
  posture: { beats: 8, keys: [[0, P.stand], [3, withArms(P.stand, A('prem'))], [5, withArms(P.stand, A('prem'))], [8, P.stand]] },
  plie: {
    beats: 20,
    keys: [[0, P.stand], [4, P.plie1], [8, P.stand], [10, P.stand2], [14, P.plie2], [18, P.stand2], [20, P.stand]]
  },
  tendu: { beats: 8, keys: [[0, P.stand], [2, P.tenduR], [4, P.stand], [6, P.tenduL], [8, P.stand]] },
  degage: { beats: 4, keys: [[0, P.stand], [1, P.degR], [2, P.stand], [3, P.degL], [4, P.stand]] },
  rond: {
    beats: 16,
    keys: [
      [0, pose({ lean: -3, r: LEGSIDE(2) })], [2, pose({ lean: -3, r: LEGSIDE(10) })], [4, pose({ lean: -3, r: LEGSIDE(17) })],
      [6, pose({ lean: -3, r: LEGSIDE(10) })], [8, pose({ lean: -3, r: LEGSIDE(2) })],
      [8.01, pose({ lean: 3, l: LEGSIDE(2) })], [10, pose({ lean: 3, l: LEGSIDE(10) })], [12, pose({ lean: 3, l: LEGSIDE(17) })],
      [14, pose({ lean: 3, l: LEGSIDE(10) })], [16, pose({ lean: 3, l: LEGSIDE(2) })]
    ]
  },
  releve: { beats: 6, keys: [[0, P.stand], [2, P.releve], [4, P.releve], [6, P.stand]] },
  releve2: { beats: 6, keys: [[0, P.stand_sec], [2, P.releveS], [4, P.releveS], [6, P.stand_sec]] },
  portdebras: {
    beats: 12,
    keys: [
      [0, P.stand], [2, withArms(P.stand, A('prem'))], [4, withArms(P.stand, A('sec'))],
      [6, withArms(P.stand, A('haut'))], [8, withArms(P.stand, A('sec'))], [10, P.stand], [12, P.stand]
    ]
  },
  walk: { beats: 4, keys: [[0, P.releve], [1, P.walkR], [2, P.releve], [3, P.walkL], [4, P.releve]] },
  saute: { beats: 4, keys: [[0, P.standOpen], [1, P.plie1open], [2, P.jump], [3, P.plie1open], [4, P.standOpen]] },
  bow: { beats: 10, keys: [[0, P.stand], [3, P.bowDown], [7, P.bowDown], [10, P.stand]] },
  heelraise: { beats: 6, keys: [[0, P.par], [2, P.parUp], [4, P.parUp], [6, P.par]] },
  squat: { beats: 8, keys: [[0, P.parPrem], [4, P.squat], [8, P.parPrem]] },
  retire: { beats: 16, keys: [[0, P.stand_sec], [2, P.retR], [7, P.retR], [9, P.stand_sec], [10, P.stand_sec], [12, P.retL], [15, P.retL], [16, P.stand_sec]] },
  neck: { beats: 8, keys: [[0, P.stand], [2, P.tiltL], [4, P.stand], [6, P.tiltR], [8, P.stand]] },
  shrug: { beats: 4, keys: [[0, P.stand], [1, P.shrug], [2, P.stand], [4, P.stand]] }
};

function sample(anim, beat) {
  const ks = anim.keys;
  for (let i = 0; i < ks.length - 1; i++) {
    const [b0, p0] = ks[i];
    const [b1, p1] = ks[i + 1];
    if (beat >= b0 && beat <= b1 && b1 > b0) {
      const t = (beat - b0) / (b1 - b0);
      return mix(p0, p1, 0.5 - 0.5 * Math.cos(Math.PI * t));
    }
  }
  return ks[ks.length - 1][1];
}

/* ---------- geometria ---------- */
function solveLeg(H, A, side, kf) {
  let dx = A.x - H.x, dy = A.y - H.y;
  let d = Math.hypot(dx, dy);
  const max = THIGH + SHIN - 0.01;
  if (d > max) { A = { x: H.x + dx * max / d, y: H.y + dy * max / d }; dx = A.x - H.x; dy = A.y - H.y; d = max; }
  const a = (THIGH * THIGH - SHIN * SHIN + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, THIGH * THIGH - a * a));
  const mx = H.x + dx * a / d, my = H.y + dy * a / d;
  let nx = -dy / d, ny = dx / d;
  if (nx * side < 0) { nx = -nx; ny = -ny; }
  return { knee: { x: mx + nx * h * kf, y: my + ny * h * kf }, ankle: A };
}
const dir = (deg, side) => ({ x: Math.sin(rad(deg)) * side, y: Math.cos(rad(deg)) });

function compute(p, breath) {
  const sh = p.shrug + breath;
  const shY = p.hip - TORSO - sh;
  const shX = CX + p.lean;
  const out = { shY, shX, sh };
  out.legs = [-1, 1].map((side) => {
    const L = side < 0 ? p.l : p.r;
    const H = { x: CX + side * HIPW, y: p.hip };
    const A = { x: CX + side * L.x, y: L.y };
    const s = solveLeg(H, A, side, L.k);
    return { H, knee: s.knee, ankle: s.ankle, toe: { x: s.ankle.x + side * L.tx, y: s.ankle.y + L.ty } };
  });
  out.arms = [-1, 1].map((side) => {
    const ar = side < 0 ? p.al : p.ar;
    const S = { x: shX + side * SHW, y: shY };
    const du = dir(ar.a, side), df = dir(ar.f, side);
    const E = { x: S.x + du.x * UPPER, y: S.y + du.y * UPPER };
    const Hh = { x: E.x + df.x * FORE, y: E.y + df.y * FORE };
    return { S, E, H: Hh };
  });
  const t = rad(p.tilt);
  out.head = { x: shX + Math.sin(t) * 38, y: shY - 4 - Math.cos(t) * 38 };
  out.tiltRad = t;
  // sombra del suelo: mas pequena cuando salta
  out.shadowScale = Math.max(0.55, Math.min(1.15, 1 - (150 - p.hip) / 140));
  out.footY = Math.max(out.legs[0].toe.y, out.legs[1].toe.y);
  return out;
}

/* ---------- dibujo (estilo caricatura) ---------- */
function el(tag, attrs = {}, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}

// falda de tul con ondas (coordenadas locales, centrada en la cadera)
function tutuPath(w, top, base, bumps, depth) {
  let d = `M${-w} ${top} Q0 ${top - 12} ${w} ${top} L${w + 2} ${base}`;
  const step = (2 * w + 4) / bumps;
  let x = w + 2;
  for (let i = 0; i < bumps; i++) {
    const nx = x - step;
    d += ` Q${(x - step / 2).toFixed(1)} ${base + depth} ${nx.toFixed(1)} ${base}`;
    x = nx;
  }
  return d + ' Z';
}

let uid = 0;
export function createGuide(container) {
  container.innerHTML = '';
  const id = 'g' + (++uid);
  const svg = el('svg', { viewBox: '-40 -84 280 384', class: 'guide-svg', role: 'img', 'aria-hidden': 'true' });
  const defs = el('defs', {}, svg);
  const body = el('linearGradient', { id: id + 'b', x1: '0', y1: '0', x2: '0', y2: '1' }, defs);
  el('stop', { offset: '0', 'stop-color': '#6b3457' }, body);
  el('stop', { offset: '1', 'stop-color': '#40203a' }, body);
  const tul = el('linearGradient', { id: id + 't', x1: '0', y1: '0', x2: '0', y2: '1' }, defs);
  el('stop', { offset: '0', 'stop-color': '#ffc2d6' }, tul);
  el('stop', { offset: '1', 'stop-color': '#f7859f' }, tul);
  const B = `url(#${id}b)`;

  const ground = el('ellipse', { cx: CX, cy: FLOOR + 4, rx: 50, ry: 7, fill: 'rgba(160, 60, 90, .16)' }, svg);
  const g = el('g', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);

  const legEls = [0, 1].map(() => ({
    thigh: el('line', { stroke: B, 'stroke-width': 18 }, g),
    shin: el('line', { stroke: B, 'stroke-width': 14 }, g),
    shoe: el('line', { stroke: '#f28aa8', 'stroke-width': 11 }, g)
  }));
  const torso = el('path', { fill: B, stroke: B, 'stroke-width': 10 }, g);
  const tutuBack = el('path', { d: tutuPath(52, -4, 8, 7, 11), fill: '#f47a98' }, g);
  const tutuFront = el('path', { d: tutuPath(44, -8, 4, 6, 10), fill: `url(#${id}t)` }, g);
  const neck = el('line', { stroke: B, 'stroke-width': 11 }, g);

  // cabeza: grupo que se mueve y se inclina entero
  const headG = el('g', {}, g);
  el('circle', { cx: 0, cy: -27, r: 12, fill: B }, headG);                  // moño
  el('path', { d: 'M9 -34 L22 -42 L20 -27 Z M9 -34 L3 -47 L16 -44 Z', fill: '#f5728f', stroke: '#f5728f', 'stroke-width': 3, 'stroke-linejoin': 'round' }, headG); // lazo
  el('circle', { cx: 9, cy: -35, r: 3.6, fill: '#ff9db6' }, headG);
  el('circle', { cx: 0, cy: 0, r: 25, fill: B }, headG);                    // cara
  const eyes = [-9, 9].map((x) => {
    const eg = el('g', { transform: `translate(${x} -1)` }, headG);
    const white = el('ellipse', { cx: 0, cy: 0, rx: 6, ry: 7.5, fill: '#fff' }, eg);
    const pupil = el('circle', { cx: 0.6, cy: 1.2, r: 3.8, fill: '#2a1426' }, eg);
    const shine = el('circle', { cx: 2, cy: -0.8, r: 1.4, fill: '#fff' }, eg);
    return { white, pupil, shine };
  });
  el('circle', { cx: -15, cy: 10, r: 4.6, fill: '#ff8fb0', opacity: '.8' }, headG);   // mofletes
  el('circle', { cx: 15, cy: 10, r: 4.6, fill: '#ff8fb0', opacity: '.8' }, headG);
  const mouth = el('path', { d: 'M-5 11 Q0 16 5 11', fill: 'none', stroke: '#ffd3e0', 'stroke-width': 2.4 }, headG);

  const armEls = [0, 1].map(() => ({
    up: el('line', { stroke: B, 'stroke-width': 12 }, g),
    fo: el('line', { stroke: B, 'stroke-width': 10 }, g),
    hand: el('circle', { r: 6.5, fill: B }, g)
  }));
  container.appendChild(svg);

  const set = (e, o) => { for (const k in o) e.setAttribute(k, (+o[k]).toFixed(1)); };
  const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  let anim = ANIMS.stand, bpm = 60, t = 0, clock = 0, running = true, last = 0, raf = 0, manual = null, smile = 0;

  function draw(p) {
    const c = compute(p, Math.sin(clock / 650) * 1.4);
    [0, 1].forEach((i) => {
      const L = c.legs[i], E = legEls[i];
      set(E.thigh, { x1: L.H.x, y1: L.H.y, x2: L.knee.x, y2: L.knee.y });
      set(E.shin, { x1: L.knee.x, y1: L.knee.y, x2: L.ankle.x, y2: L.ankle.y });
      set(E.shoe, { x1: L.ankle.x, y1: L.ankle.y, x2: L.toe.x, y2: L.toe.y });
      const a = c.arms[i], AE = armEls[i];
      set(AE.up, { x1: a.S.x, y1: a.S.y, x2: a.E.x, y2: a.E.y });
      set(AE.fo, { x1: a.E.x, y1: a.E.y, x2: a.H.x, y2: a.H.y });
      set(AE.hand, { cx: a.H.x, cy: a.H.y });
    });
    const s = c.shX, y = c.shY, hip = p.hip;
    const wy = y + TORSO * 0.62, wx = s * 0.4 + CX * 0.6;
    torso.setAttribute('d',
      `M${(s - SHW).toFixed(1)} ${y.toFixed(1)} Q${s.toFixed(1)} ${(y - 5).toFixed(1)} ${(s + SHW).toFixed(1)} ${y.toFixed(1)}` +
      ` Q${(s + SHW - 2).toFixed(1)} ${(y + TORSO * 0.35).toFixed(1)} ${(wx + 11).toFixed(1)} ${wy.toFixed(1)}` +
      ` L${CX + HIPW + 4} ${hip} L${CX - HIPW - 4} ${hip}` +
      ` L${(wx - 11).toFixed(1)} ${wy.toFixed(1)}` +
      ` Q${(s - SHW + 2).toFixed(1)} ${(y + TORSO * 0.35).toFixed(1)} ${(s - SHW).toFixed(1)} ${y.toFixed(1)} Z`);
    const tx = CX + p.lean * 0.4, rot = p.lean * 0.9;
    const tt = `translate(${tx.toFixed(1)} ${(hip - 4).toFixed(1)}) rotate(${rot.toFixed(1)})`;
    tutuBack.setAttribute('transform', tt);
    tutuFront.setAttribute('transform', tt);
    set(neck, { x1: s, y1: y, x2: c.head.x, y2: c.head.y });
    headG.setAttribute('transform', `translate(${c.head.x.toFixed(1)} ${c.head.y.toFixed(1)}) rotate(${p.tilt.toFixed(1)}) scale(1.28)`);
    // parpadeo cada ~3,5 s
    const ph = clock % 3500;
    const blink = ph < 140 ? Math.abs(ph - 70) / 70 : 1;
    eyes.forEach((e) => {
      e.white.setAttribute('ry', (7.5 * Math.max(0.12, blink)).toFixed(2));
      e.pupil.setAttribute('r', blink < 0.5 ? '0' : '3.8');
      e.shine.setAttribute('r', blink < 0.5 ? '0' : '1.4');
    });
    mouth.setAttribute('d', smile ? 'M-7 9 Q0 20 7 9 Z' : 'M-5 11 Q0 16 5 11');
    mouth.setAttribute('fill', smile ? '#ffd3e0' : 'none');
    set(ground, { cx: CX + p.lean * 0.5, rx: 50 * c.shadowScale });
  }

  function frame(now) {
    if (!container.isConnected) return;
    const dt = last ? Math.min(64, now - last) : 0;
    last = now;
    clock += dt;
    if (running && manual === null) t += dt;
    const beat = manual !== null ? manual : (t / (60000 / bpm)) % anim.beats;
    draw(sample(anim, beat));
    raf = requestAnimationFrame(frame);
  }

  function start() {
    cancelAnimationFrame(raf);
    last = 0;
    if (reduced) { clock = 1000; draw(sample(anim, 0)); return; }
    raf = requestAnimationFrame(frame);
  }
  start();

  return {
    play(name, newBpm) {
      anim = ANIMS[name] || ANIMS.coach;
      smile = name === 'celebrate' || name === 'wave' ? 1 : 0;
      bpm = newBpm > 0 ? newBpm : 60;
      t = 0; manual = null;
      start();
    },
    setRunning(v) { running = !!v; },
    seek(name, beat) { anim = ANIMS[name] || ANIMS.coach; smile = name === 'celebrate' || name === 'wave' ? 1 : 0; manual = beat; clock = 1000; cancelAnimationFrame(raf); draw(sample(anim, beat)); },
    destroy() { cancelAnimationFrame(raf); running = false; }
  };
}
