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
  hip: 150, lean: 0, tilt: 0, shrug: 0, spin: 0,
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
const RET_REL = (side) => ({ [side]: { x: 8, y: 193, tx: 0, ty: 14, k: 1 } });
const ON_DEMI = { y: 258, tx: 3, ty: 22 };
const Q2 = {
  grandplie: pose({ hip: 204, l: { k: 0.6, tx: 9, ty: 13 }, r: { k: 0.6, tx: 9, ty: 13 }, ...both(ARMS.open) }),
  standOpen: pose(both(ARMS.open)),
  fonduInR: pose({ hip: 166, lean: -3, l: { k: 0.45 }, r: { x: 9, y: 246, tx: 1, ty: 12, k: 1 }, ...both(ARMS.sec) }),
  fonduOutR: pose({ lean: -5, r: { ...straight(40), tx: 9, ty: 14, k: 0.1 }, ...both(ARMS.sec) }),
  fonduInL: pose({ hip: 166, lean: 3, r: { k: 0.45 }, l: { x: 9, y: 246, tx: 1, ty: 12, k: 1 }, ...both(ARMS.sec) }),
  fonduOutL: pose({ lean: 5, l: { ...straight(40), tx: 9, ty: 14, k: 0.1 }, ...both(ARMS.sec) }),
  tenduSR: pose({ lean: -3, r: LEGSIDE(17), ...both(ARMS.sec) }),
  tenduSL: pose({ lean: 3, l: LEGSIDE(17), ...both(ARMS.sec) }),
  battR: pose({ lean: -7, r: { ...straight(68), tx: 10, ty: 10, k: 0.05 }, ...both(ARMS.sec) }),
  battL: pose({ lean: 7, l: { ...straight(68), tx: 10, ty: 10, k: 0.05 }, ...both(ARMS.sec) }),
  echRel: pose({ hip: 140, l: { x: 36, ...ON_DEMI }, r: { x: 36, ...ON_DEMI }, ...both(ARMS.sec) }),
  pliePrep: pose({ hip: 176, l: { k: 0.55 }, r: { k: 0.55 }, al: { ...ARMS.sec }, ar: { ...ARMS.prem } }),
  pirR: pose({ hip: 136, l: { ...ON_DEMI }, ...RET_REL('r'), ...both(ARMS.prem) }),
  develR: pose({ lean: -6, r: { ...straight(55), tx: 10, ty: 10, k: 0.05 }, ...both(ARMS.sec) }),
  develL: pose({ lean: 6, l: { ...straight(55), tx: 10, ty: 10, k: 0.05 }, ...both(ARMS.sec) }),
  retSR: pose({ lean: -4, r: { x: 8, y: 207, tx: 0, ty: 14, k: 1 }, ...both(ARMS.sec) }),
  retSL: pose({ lean: 4, l: { x: 8, y: 207, tx: 0, ty: 14, k: 1 }, ...both(ARMS.sec) }),
  swayL: pose({ hip: 160, lean: -10, tilt: -8, l: { k: 0.5 }, r: { x: 14, ...ON_DEMI, y: 262 }, al: { a: 70, f: 60 }, ar: { a: 45, f: -60 } }),
  swayR: pose({ hip: 160, lean: 10, tilt: 8, r: { k: 0.5 }, l: { x: 14, ...ON_DEMI, y: 262 }, ar: { a: 70, f: 60 }, al: { a: 45, f: -60 } }),
  jumpOpen: pose({ hip: 116, l: { x: 30, y: 236, tx: 3, ty: 20 }, r: { x: 30, y: 236, tx: 3, ty: 20 }, ...both(ARMS.open) }),
  plie2open: pose({ hip: 180, l: { x: 40, k: 0.55 }, r: { x: 40, k: 0.55 }, ...both(ARMS.open) })
};
Q2.pirRspin = merge(Q2.pirR, { spin: 1 });

/* ---------- poses del nivel avanzado ---------- */
const CDP = (side) => ({ [side]: { x: 9, y: 244, tx: 1, ty: 12, k: 1 } });
const Q3 = {
  cdpR: pose({ lean: -2, ...CDP('r'), ...both(ARMS.sec) }),
  cdpL: pose({ lean: 2, ...CDP('l'), ...both(ARMS.sec) }),
  frapR: pose({ lean: -4, r: LEGSIDE(26, { y: straight(26).y - 6, ty: 20 }), ...both(ARMS.sec) }),
  frapL: pose({ lean: 4, l: LEGSIDE(26, { y: straight(26).y - 6, ty: 20 }), ...both(ARMS.sec) }),
  pbA: pose({ lean: -2, r: { x: 4, y: 244, tx: 2, ty: 12, k: 1 }, ...both(ARMS.sec) }),
  pbB: pose({ lean: -2, r: { x: 15, y: 244, tx: 2, ty: 12, k: 1 }, ...both(ARMS.sec) }),
  enlairOut: pose({ lean: -6, r: { ...straight(48), tx: 10, ty: 10, k: 0.05 }, ...both(ARMS.sec) }),
  enlairIn: pose({ lean: -6, r: { x: 34, y: 214, tx: 4, ty: 12, k: 1 }, ...both(ARMS.sec) }),
  adagHigh: pose({ hip: 140, lean: -8, l: { ...ON_DEMI }, r: { ...straight(78, 140), tx: 10, ty: 8, k: 0.05 }, al: { ...ARMS.sec }, ar: { ...ARMS.haut } }),
  cambreL: pose({ lean: -14, tilt: -14, al: { a: 40, f: 20 }, ar: { ...ARMS.haut } }),
  cambreR: pose({ lean: 14, tilt: 14, ar: { a: 40, f: 20 }, al: { ...ARMS.haut } }),
  fourth: pose({ hip: 172, l: { x: 4, k: 0.55 }, r: { x: 26, k: 0.55, tx: 10, ty: 8 }, al: { ...ARMS.sec }, ar: { ...ARMS.prem } }),
  pirL: pose({ hip: 136, r: { ...ON_DEMI }, ...RET_REL('l'), ...both(ARMS.prem) }),
  releveTight: pose({ hip: 136, l: { x: 4, ...ON_DEMI }, r: { x: 4, ...ON_DEMI }, ...both(ARMS.prem) }),
  jumpTight: pose({ hip: 112, l: { x: 3, y: 234, tx: 2, ty: 20 }, r: { x: 3, y: 234, tx: 2, ty: 20 }, al: { a: 20, f: 5 }, ar: { a: 20, f: 5 } }),
  jumpBeat: pose({ hip: 112, l: { x: 13, y: 234, tx: 2, ty: 20 }, r: { x: 13, y: 234, tx: 2, ty: 20 }, al: { a: 20, f: 5 }, ar: { a: 20, f: 5 } }),
  sissAir: pose({ hip: 108, l: { ...straight(30, 108), tx: 8, ty: 14, k: 0.05 }, r: { ...straight(30, 108), tx: 8, ty: 14, k: 0.05 }, al: { ...ARMS.sec }, ar: { ...ARMS.haut } }),
  sissLand: pose({ hip: 170, lean: 4, l: { k: 0.5 }, r: { ...straight(38, 170), tx: 9, ty: 14, k: 0.05 }, al: { ...ARMS.sec }, ar: { ...ARMS.haut } }),
  chatAir: pose({ hip: 112, l: { x: 30, y: 196, tx: 0, ty: 12, k: 1 }, r: { x: 30, y: 196, tx: 0, ty: 12, k: 1 }, ...both(ARMS.open) }),
  jeteAir: pose({ hip: 104, l: { ...straight(72, 104), tx: 10, ty: 8, k: 0.02 }, r: { ...straight(72, 104), tx: 10, ty: 8, k: 0.02 }, al: { ...ARMS.sec }, ar: { ...ARMS.haut } }),
  fouOut: pose({ hip: 168, l: { k: 0.45 }, r: { ...straight(45, 168), tx: 9, ty: 12, k: 0.05 }, ...both(ARMS.sec) }),
  pistol: pose({ hip: 186, lean: 3, l: { x: 12, tx: 3, ty: 7, k: 0.35 }, r: { x: 20, y: 228, tx: 2, ty: 12, k: 0.3 }, ...both(ARMS.prem) })
};
const spun = (pz, sp) => merge(pz, { spin: sp });
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
  shrug: { beats: 4, keys: [[0, P.stand], [1, P.shrug], [2, P.stand], [4, P.stand]] },
  grandplie: { beats: 16, keys: [[0, Q2.standOpen], [4, P.plie1open], [8, Q2.grandplie], [12, P.plie1open], [16, Q2.standOpen]] },
  fondu: { beats: 16, keys: [[0, P.stand_sec], [2, Q2.fonduInR], [5, Q2.fonduOutR], [8, P.stand_sec], [10, Q2.fonduInL], [13, Q2.fonduOutL], [16, P.stand_sec]] },
  grandbatt: { beats: 8, keys: [[0, P.stand_sec], [1, Q2.tenduSR], [2, Q2.battR], [3, Q2.tenduSR], [4, P.stand_sec], [5, Q2.tenduSL], [6, Q2.battL], [7, Q2.tenduSL], [8, P.stand_sec]] },
  echappe: { beats: 8, keys: [[0, P.plie1open], [2, Q2.echRel], [4, P.plie1open], [6, Q2.standOpen], [8, P.plie1open]] },
  pirprep: { beats: 8, keys: [[0, P.stand], [2, Q2.pliePrep], [3, Q2.pirR], [6, Q2.pirR], [7, Q2.pliePrep], [8, P.stand]] },
  pirouette: { beats: 8, keys: [[0, P.stand], [2, Q2.pliePrep], [3, Q2.pirR], [5, Q2.pirRspin], [6, Q2.pirRspin], [7, Q2.pliePrep], [8, P.stand]] },
  develop: { beats: 16, keys: [[0, P.stand_sec], [2, Q2.retSR], [5, Q2.develR], [7, Q2.tenduSR], [8, P.stand_sec], [10, Q2.retSL], [13, Q2.develL], [15, Q2.tenduSL], [16, P.stand_sec]] },
  balance: { beats: 6, keys: [[0, Q2.swayL], [3, Q2.swayR], [6, Q2.swayL]] },
  frappe: { beats: 8, keys: [[0, Q3.cdpR], [0.6, Q3.frapR], [2, Q3.cdpR], [2.6, Q3.frapR], [4, P.stand_sec], [4.01, Q3.cdpL], [4.6, Q3.frapL], [6, Q3.cdpL], [6.6, Q3.frapL], [8, P.stand_sec]] },
  petitbatt: { beats: 4, keys: [[0, Q3.pbA], [0.5, Q3.pbB], [1, Q3.pbA], [1.5, Q3.pbB], [2, Q3.pbA], [2.5, Q3.pbB], [3, Q3.pbA], [3.5, Q3.pbB], [4, Q3.pbA]] },
  enlair: { beats: 8, keys: [[0, P.stand_sec], [1, Q2.tenduSR], [2, Q3.enlairOut], [3, Q3.enlairIn], [4, Q3.enlairOut], [5, Q3.enlairIn], [6, Q3.enlairOut], [7, Q2.tenduSR], [8, P.stand_sec]] },
  adagio: { beats: 24, keys: [[0, P.stand_sec], [3, Q2.retSR], [7, Q2.develR], [10, Q3.adagHigh], [14, Q3.adagHigh], [17, Q2.tenduSR], [18, P.stand_sec], [20, Q3.cambreL], [22, Q3.cambreR], [24, P.stand_sec]] },
  cambre: { beats: 16, keys: [[0, Q2.standOpen], [4, Q2.grandplie], [8, Q2.standOpen], [10, Q3.cambreL], [12, P.stand], [14, Q3.cambreR], [16, Q2.standOpen]] },
  dblpir: { beats: 8, keys: [[0, P.stand], [1.5, Q3.fourth], [2.5, Q2.pirR], [4.5, spun(Q2.pirR, 2)], [5.5, spun(Q2.pirR, 2)], [6.5, spun(Q3.fourth, 2)], [8, spun(P.stand, 2)]] },
  pirdedans: { beats: 8, keys: [[0, P.stand], [1.5, Q3.fourth], [2.5, Q3.pirL], [4.5, spun(Q3.pirL, -1)], [5.5, spun(Q3.pirL, -1)], [6.5, spun(Q3.fourth, -1)], [8, spun(P.stand, -1)]] },
  chaines: { beats: 4, keys: [[0, Q3.releveTight], [1, spun(Q3.releveTight, 1)], [2, spun(Q3.releveTight, 2)], [3, spun(Q3.releveTight, 3)], [4, spun(Q3.releveTight, 4)]] },
  pique: { beats: 8, keys: [[0, P.stand_sec], [1, Q2.tenduSR], [2, Q3.pirL], [3.5, spun(Q3.pirL, 1)], [4, spun(P.stand_sec, 1)], [5, spun(Q2.tenduSR, 1)], [6, spun(Q3.pirL, 1)], [7.5, spun(Q3.pirL, 2)], [8, spun(P.stand_sec, 2)]] },
  entrechat: { beats: 4, keys: [[0, P.plie1open], [0.8, Q3.jumpTight], [1.1, Q3.jumpBeat], [1.4, Q3.jumpTight], [2.2, P.plie1open], [2.8, Q3.jumpTight], [3.1, Q3.jumpBeat], [3.4, Q3.jumpTight], [4, P.plie1open]] },
  sissonne: { beats: 8, keys: [[0, P.plie1open], [1, Q3.sissAir], [2, Q3.sissLand], [3, P.plie1open], [4, P.stand], [5, P.plie1open], [6, Q3.sissAir], [7, Q3.sissLand], [8, P.plie1open]] },
  pasdechat: { beats: 4, keys: [[0, P.plie1open], [1, Q3.chatAir], [2, P.plie1open], [3, Q2.standOpen], [4, P.plie1open]] },
  grandjete: { beats: 8, keys: [[0, P.stand_sec], [1.5, Q2.tenduSR], [3, P.plie1open], [4, Q3.jeteAir], [5, Q3.sissLand], [6.5, P.plie1open], [8, P.stand_sec]] },
  fouette: { beats: 8, keys: [[0, Q3.fouOut], [1, Q2.pirR], [2, spun(Q3.fouOut, 1)], [3, spun(Q2.pirR, 2)], [4, spun(Q3.fouOut, 2)], [5, spun(Q2.pirR, 3)], [6, spun(Q3.fouOut, 3)], [7, spun(Q2.pirR, 4)], [8, spun(Q3.fouOut, 4)]] },
  pistol: { beats: 8, keys: [[0, P.parPrem], [4, Q3.pistol], [8, P.parPrem]] },
  allegro: { beats: 8, keys: [[0, Q2.standOpen], [1, P.plie1open], [2, P.jump], [3, P.plie1open], [4, Q2.jumpOpen], [5, Q2.plie2open], [6, Q2.jumpOpen], [7, P.plie1open], [8, Q2.standOpen]] }
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
/* Personaje sencillo: formas planas en dos colores, sin detalles sobrantes. */
const INK = '#5a2a47';     // cuerpo
const TUTU = '#f58aa6';    // falda y zapatillas
export function createGuide(container) {
  container.innerHTML = '';
  uid++;
  const svg = el('svg', { viewBox: '-40 -84 280 384', class: 'guide-svg', role: 'img', 'aria-hidden': 'true' });
  const ground = el('ellipse', { cx: CX, cy: FLOOR + 4, rx: 46, ry: 6, fill: 'rgba(160, 60, 90, .13)' }, svg);
  const g = el('g', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);

  const legEls = [0, 1].map(() => ({
    thigh: el('line', { stroke: INK, 'stroke-width': 15 }, g),
    shin: el('line', { stroke: INK, 'stroke-width': 12 }, g),
    shoe: el('line', { stroke: TUTU, 'stroke-width': 10 }, g)
  }));
  const torso = el('path', { fill: INK, stroke: INK, 'stroke-width': 10 }, g);
  const tutuBack = el('path', { d: 'M-46 0 Q0 -12 46 0 Q50 8 40 11 Q0 20 -40 11 Q-50 8 -46 0 Z', fill: TUTU, opacity: '.55' }, g);
  const tutuFront = el('path', { d: 'M-38 -4 Q0 -14 38 -4 Q42 4 32 7 Q0 14 -32 7 Q-42 4 -38 -4 Z', fill: TUTU }, g);
  const neck = el('line', { stroke: INK, 'stroke-width': 10 }, g);

  const headG = el('g', {}, g);
  el('circle', { cx: 0, cy: -26, r: 11, fill: INK }, headG);   // mono
  el('circle', { cx: 0, cy: 0, r: 23, fill: INK }, headG);     // cabeza
  const eyes = [-8, 8].map((x) => {
    const white = el('ellipse', { cx: x, cy: 0, rx: 3.2, ry: 3.2, fill: '#fff' }, headG);
    return { white, pupil: { setAttribute() {} }, shine: { setAttribute() {} } };
  });
  const mouth = { setAttribute() {} };

  const armEls = [0, 1].map(() => ({
    up: el('line', { stroke: INK, 'stroke-width': 11 }, g),
    fo: el('line', { stroke: INK, 'stroke-width': 9 }, g),
    hand: el('circle', { r: 5.5, fill: INK }, g)
  }));
  container.appendChild(svg);

  const set = (e, o) => { for (const k in o) e.setAttribute(k, (+o[k]).toFixed(1)); };
  const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  let anim = ANIMS.stand, bpm = 60, t = 0, clock = 0, running = true, last = 0, raf = 0, manual = null, smile = 0;

  function draw(p) {
    const c = compute(p, Math.sin(clock / 650) * 1.4);
    const sx = Math.cos(2 * Math.PI * (p.spin || 0));
    const sxs = Math.abs(sx) < 0.08 ? (sx < 0 ? -0.08 : 0.08) : sx;
    g.setAttribute('transform', p.spin ? `translate(${CX} 0) scale(${sxs.toFixed(3)} 1) translate(${-CX} 0)` : '');
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
      e.white.setAttribute('ry', (3.2 * Math.max(0.15, blink)).toFixed(2));
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
