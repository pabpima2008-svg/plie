// Revisa todo el contenido de la app. Uso: node scripts/validate.mjs
import fs from 'fs';
import { LIB, TRACKS, TRACK_IDS } from '../src/program.js';
import { THEORY, CLASSES } from '../src/data.js';
import { EXTRA_LESSONS } from '../src/theory2.js';
import { STR } from '../src/i18n.js';
import { DETAILS, CORE } from '../src/details.js';

const guideSrc = fs.readFileSync(new URL('../src/guide.js', import.meta.url), 'utf8');
const animNames = new Set([...guideSrc.matchAll(/^  ([a-zA-Z0-9]+): \{ beats|^  ([a-zA-Z0-9]+): \{\n\s+beats/gm)].map(m => m[1] || m[2]));
const errors = [];
const err = (m) => errors.push(m);
const bi = (o, where) => { if (!o || typeof o.es !== 'string' || typeof o.en !== 'string' || !o.es.trim() || !o.en.trim()) err(`${where}: falta texto ES/EN`); };

// Ejercicios
for (const [id, e] of Object.entries(LIB)) {
  bi(e.name, `ejercicio ${id} nombre`); bi(e.tip, `ejercicio ${id} consejo`);
  if (!e.steps || !Array.isArray(e.steps.es) || !Array.isArray(e.steps.en)) err(`ejercicio ${id}: faltan pasos`);
  else {
    if (e.steps.es.length !== e.steps.en.length) err(`ejercicio ${id}: distinto nº de pasos ES/EN`);
    if (e.steps.es.length < 3) err(`ejercicio ${id}: menos de 3 pasos`);
  }
  if (!e.anim || !animNames.has(e.anim)) err(`ejercicio ${id}: animación "${e.anim}" no existe`);
}
// Preguntas
const checkQ = (q, where) => {
  bi(q.q, where);
  if (!q.options || q.options.es.length !== q.options.en.length || q.options.es.length < 2) err(`${where}: opciones mal`);
  if (!(q.answer >= 0 && q.answer < q.options.es.length)) err(`${where}: respuesta fuera de rango`);
};
const checkCard = (c, where) => { bi(c.title, where + ' título'); bi(c.text, where + ' texto'); if (!animNames.has(c.anim)) err(`${where}: animación "${c.anim}" no existe`); if (c.q) checkQ(c.q, where + ' pregunta'); };
// Caminos
let days = 0;
for (const tr of TRACK_IDS) for (const lvl of [1, 2, 3]) {
  const list = TRACKS[tr][lvl];
  if (!list || list.length !== 30) { err(`${tr} nivel ${lvl}: no tiene 30 días`); continue; }
  list.forEach((d, i) => {
    days++;
    const w = `${tr} N${lvl} día ${i + 1}`;
    bi(d.title, w + ' título');
    if (tr === 'teoria') {
      if (d.quizzes) d.quizzes.forEach((q, k) => checkQ(q, `${w} repaso ${k + 1}`));
      else { checkCard(d.card, w); if (d.review) checkQ(d.review, w + ' repaso'); }
    } else if (!d.exercises.length) err(`${w}: sin ejercicios`);
  });
}
// Teoria libre
for (const l of THEORY.concat(EXTRA_LESSONS)) {
  bi(l.title, `lección ${l.id}`); l.cards.forEach((c, i) => checkCard(c, `lección ${l.id} tarjeta ${i + 1}`)); l.quiz.forEach((q, i) => checkQ(q, `lección ${l.id} test ${i + 1}`));
}
// Detalles
for (const id of Object.keys(DETAILS)) if (!LIB[id]) err(`detalles de "${id}": ese ejercicio no existe`);
for (const [id, byL] of Object.entries(DETAILS)) for (const [l, arr] of Object.entries(byL)) arr.forEach((x, i) => bi(x, `detalle ${id} N${l} #${i + 1}`));
for (const k of ['tecnica', 'fisico']) for (const l of [1, 2, 3]) bi(CORE[k][l], `colocación ${k} N${l}`);
// Textos de la interfaz
const esK = Object.keys(STR.es), enK = Object.keys(STR.en);
esK.filter(k => !enK.includes(k)).forEach(k => err(`texto "${k}" sin inglés`));
enK.filter(k => !esK.includes(k)).forEach(k => err(`texto "${k}" sin español`));
const appSrc = fs.readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const used = new Set([...appSrc.matchAll(/\bt\('([a-zA-Z0-9_]+)'\s*[,)]/g)].map(m => m[1]));
for (const k of used) if (!(k in STR.es)) err(`texto "${k}" usado en la app pero no definido`);
// Prefijos dinamicos: t('block' + ...), t('sec_' + ...), t('selfQ_' + ...), t('examList_' + tr)
for (const tr of TRACK_IDS) for (const pre of ['sec_', 'secdesc_', 'selfQ_', 'selfOpts_', 'examList_']) if (!(pre + tr in STR.es)) err(`texto "${pre + tr}" no definido`);
for (const b of ['blockTeoria', 'blockTecnica', 'blockFisico']) if (!(b in STR.es)) err(`texto "${b}" no definido`);

console.log(`Ejercicios: ${Object.keys(LIB).length} · Días de programa: ${days} · Lecciones libres: ${THEORY.length + EXTRA_LESSONS.length} · Animaciones: ${animNames.size} · Textos: ${esK.length}`);
if (errors.length) { console.log(`\n${errors.length} problemas:`); errors.forEach(e => console.log(' - ' + e)); process.exit(1); }
console.log('Todo correcto.');
