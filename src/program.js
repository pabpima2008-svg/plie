/* ------------------------------------------------------------------
   PROGRAMA POR NIVELES
   Nivel 1 "Primeros pasos": 30 dias. Cada dia = Teoria (tarjeta + pregunta)
   + Tecnica + Fisico. Los dias 7, 14, 21 y 28 son de descanso activo.
   Al terminar el dia 30 se desbloquea el examen de nivel (pendiente).
   ------------------------------------------------------------------ */
import { CLASSES } from './data.js';

// Biblioteca de ejercicios: todos los ejercicios de las clases, por id.
export const LIB = {};
for (const c of CLASSES) for (const e of c.exercises) LIB[e.id] = e;

export const LEVELS = [
  {
    n: 1, days: 30,
    name: { es: 'Primeros pasos', en: 'First steps' },
    desc: { es: 'Postura, posiciones y la barra básica.', en: 'Posture, positions and the basic barre.' }
  },
  {
    n: 2, days: 30,
    name: { es: 'Barra y centro', en: 'Barre and centre' },
    desc: { es: 'Más ejercicios de barra, equilibrio y trabajo en el centro.', en: 'More barre work, balance and centre practice.' }
  },
  {
    n: 3, days: 30,
    name: { es: 'Saltos y giros', en: 'Jumps and turns' },
    desc: { es: 'Pequeños saltos, preparación de giros y combinaciones.', en: 'Small jumps, turn preparation and combinations.' }
  }
];

export const WEEKS = [
  { from: 1, to: 7, name: { es: 'Semana 1 · Fundamentos', en: 'Week 1 · Foundations' } },
  { from: 8, to: 14, name: { es: 'Semana 2 · La barra', en: 'Week 2 · The barre' } },
  { from: 15, to: 21, name: { es: 'Semana 3 · Brazos y equilibrio', en: 'Week 3 · Arms and balance' } },
  { from: 22, to: 28, name: { es: 'Semana 4 · El centro', en: 'Week 4 · The centre' } },
  { from: 29, to: 30, name: { es: 'Final · Ensayo', en: 'Final · Rehearsal' } }
];
export const weekOf = (d) => WEEKS.find((w) => d >= w.from && d <= w.to);

/* Plan: "tecnica | fisico", cada ejercicio "id:segundos". Vacio = sin bloque. */
const PLAN = [
  /* 1 */ 'warmup:120 posture:90 plie:120 | heel:60 butterfly:60',
  /* 2 */ 'warmup:120 posture:60 plie:150 | feet:90 neck:60',
  /* 3 */ 'warmup:120 posture:60 plie:150 tendu:120 | squat:60 fold:60',
  /* 4 */ 'warmup:120 plie:150 tendu:150 | heel:90 bridge:60 butterfly:60',
  /* 5 */ 'warmup:120 plie:150 tendu:150 port:120 | plank:45 quad:60',
  /* 6 */ 'warmup:120 plie:150 tendu:150 releve:90 port:120 | heel:90 cobra:45 child:45',
  /* 7 */ ' | neck:60 butterfly:90 fold:90 feet:90 child:60',
  /* 8 */ 'warmup:120 plie:180 tendu:150 degage:90 | squat:90 fold:60',
  /* 9 */ 'warmup:120 plie:180 tendu:150 degage:90 releve:90 | bridge:90 plank:45 butterfly:60',
  /* 10 */ 'warmup:120 plie:180 tendu:150 degage:120 port:120 | heel:90 deadbug:60 quad:60',
  /* 11 */ 'warmup:120 plie:180 tendu:150 degage:120 rond:120 | squat:90 cobra:45 child:45',
  /* 12 */ 'warmup:120 plie:180 tendu:150 degage:120 rond:120 releve:90 | plank:60 bridge:90 fold:60',
  /* 13 */ 'warmup:120 posture:60 plie:180 tendu:150 degage:120 rond:150 releve:120 | balance:60 butterfly:60',
  /* 14 */ ' | neck:60 feet:90 butterfly:90 quad:60 child:60',
  /* 15 */ 'warmup:120 plie:180 tendu:150 degage:120 port:150 c-releve:90 | balance:90 heel:90 fold:60',
  /* 16 */ 'warmup:120 plie:180 tendu:180 rond:150 port:150 | balance:90 deadbug:60 butterfly:60',
  /* 17 */ 'warmup:120 plie:180 tendu:180 degage:120 releve:120 c-releve:120 | squat:90 plank:60 quad:60',
  /* 18 */ 'warmup:120 plie:180 tendu:150 degage:120 rond:150 port:150 | bridge:90 balance:90 cobra:45',
  /* 19 */ 'warmup:120 plie:180 tendu:180 degage:120 releve:120 port:150 c-releve:120 | heel:120 deadbug:60 fold:60',
  /* 20 */ 'warmup:120 plie:180 tendu:180 degage:150 rond:150 releve:120 | balance:120 plank:60 butterfly:60',
  /* 21 */ ' | neck:60 butterfly:90 fold:90 cobra:45 child:60 feet:60',
  /* 22 */ 'warmup:120 plie:180 tendu:150 degage:120 port:150 walk:90 | heel:90 squat:90 fold:60',
  /* 23 */ 'warmup:120 plie:180 tendu:150 degage:120 rond:120 port:120 c-releve:120 walk:120 | balance:90 bridge:90',
  /* 24 */ 'warmup:120 plie:180 tendu:150 degage:120 releve:120 port:120 saute:90 | plank:60 butterfly:60 quad:60',
  /* 25 */ 'warmup:120 plie:180 tendu:150 degage:120 rond:120 c-releve:120 walk:90 saute:90 | deadbug:60 fold:60',
  /* 26 */ 'warmup:120 plie:180 tendu:180 degage:120 rond:150 port:120 saute:120 bow:60 | heel:90 balance:90 child:45',
  /* 27 */ 'warmup:120 plie:180 tendu:180 degage:150 rond:150 releve:120 port:150 walk:90 saute:120 bow:60 | squat:90 plank:60 butterfly:60',
  /* 28 */ ' | neck:60 feet:90 butterfly:90 fold:90 quad:60 child:60',
  /* 29 */ 'warmup:120 posture:60 plie:180 tendu:180 degage:150 rond:150 releve:120 port:150 c-releve:120 walk:90 saute:120 bow:60 | fold:60 butterfly:60',
  /* 30 */ 'warmup:120 posture:60 plie:180 tendu:180 degage:150 rond:150 releve:120 port:150 c-releve:120 walk:120 saute:120 bow:90 | balance:90 fold:60 child:60'
];

const parse = (part) => part.trim().split(/\s+/).filter(Boolean).map((tok) => {
  const [id, sec] = tok.split(':');
  if (!LIB[id]) throw new Error('Ejercicio desconocido: ' + id);
  return { ...LIB[id], dur: parseInt(sec, 10) };
});

/* Teoria del dia: una tarjeta y una pregunta. */
const T = (anim, es, en, q) => ({ anim, title: { es: es[0], en: en[0] }, text: { es: es[1], en: en[1] }, q });
const Q = (es, en, answer) => ({ q: { es: es[0], en: en[0] }, options: { es: es.slice(1), en: en.slice(1) }, answer });

const THEORY30 = [
  /* 1 */ T('wave',
    ['¿Qué es el ballet?', 'El ballet es una danza clásica con una técnica muy precisa. Se baila siempre con música, y cada paso tiene un nombre y una forma correcta de hacerse. En estos 30 días vas a aprender lo básico, poco a poco.'],
    ['What is ballet?', 'Ballet is a classical dance with a very precise technique. It is always danced to music, and every step has a name and a correct way of doing it. Over these 30 days you will learn the basics, bit by bit.'],
    Q(['Además de técnica, ¿qué necesita siempre el ballet?', 'Música', 'Un escenario', 'Un disfraz'], ['Besides technique, what does ballet always need?', 'Music', 'A stage', 'A costume'], 0)),
  /* 2 */ T('posture',
    ['Crecer hacia arriba', 'Imagina que un hilo tira suavemente de la parte alta de tu cabeza. La espalda se alarga sin arquearse ni encorvarse. Esta es la base de todo lo demás.'],
    ['Growing tall', 'Imagine a string gently pulling the top of your head upwards. Your back lengthens without arching or rounding. This is the base of everything else.'],
    Q(['¿Qué imagen te ayuda a colocar la espalda?', 'Un hilo que tira de la cabeza', 'Una mochila pesada', 'Mirar al suelo'], ['What image helps you place your back?', 'A string pulling your head up', 'A heavy backpack', 'Looking at the floor'], 0)),
  /* 3 */ T('stand',
    ['Primera posición', 'Talones juntos y puntas hacia fuera, solo hasta donde te resulte cómodo. Es la posición de partida de casi todos los ejercicios.'],
    ['First position', 'Heels together and toes turned out, only as far as is comfortable. It is the starting position of almost every exercise.'],
    Q(['En primera posición, los talones están...', 'Juntos', 'Separados', 'Cruzados'], ['In first position, the heels are...', 'Together', 'Apart', 'Crossed'], 0)),
  /* 4 */ T('plie',
    ['Rodillas sobre los pies', 'Cuando doblas las rodillas, tienen que mirar en la misma dirección que los dedos de los pies. Si se van hacia dentro, abre menos los pies.'],
    ['Knees over your feet', 'When you bend your knees, they must point the same way as your toes. If they fall inwards, turn your feet out less.'],
    Q(['Si las rodillas se van hacia dentro, ¿qué haces?', 'Abro menos los pies', 'Abro más los pies', 'Nada'], ['If your knees fall inwards, what do you do?', 'Turn my feet out less', 'Turn my feet out more', 'Nothing'], 0)),
  /* 5 */ T('plie',
    ['Plié significa "doblado"', 'Los pasos de ballet tienen nombres en francés. Plié es doblar las rodillas. El demi-plié es el medio plié: los talones no se despegan del suelo.'],
    ['Plié means "bent"', 'Ballet steps have French names. Plié means bending the knees. Demi-plié is the half bend: your heels stay on the floor.'],
    Q(['En el demi-plié, los talones...', 'Se despegan del suelo', 'Se quedan en el suelo', 'Se cruzan'], ['In a demi-plié, your heels...', 'Lift off the floor', 'Stay on the floor', 'Cross over'], 1)),
  /* 6 */ T('plie',
    ['Segunda posición', 'Como la primera, pero con los pies separados un poco más que el ancho de tus hombros. El peso se reparte igual entre los dos pies.'],
    ['Second position', 'Like first, but with your feet a little wider than your shoulders. Your weight is shared equally between both feet.'],
    Q(['En segunda posición, los pies están...', 'Pegados', 'Separados un poco más que los hombros', 'Uno delante del otro'], ['In second position, your feet are...', 'Touching', 'A little wider than your shoulders', 'One in front of the other'], 1)),
  /* 7 */ T('coach',
    ['Descansar también es entrenar', 'Hoy toca descanso activo: estiramientos suaves. Los músculos se hacen más fuertes mientras descansan, así que este día es tan importante como los demás.'],
    ['Resting is training too', 'Today is an active rest day: gentle stretching. Muscles get stronger while they rest, so this day is as important as the others.'],
    Q(['¿Para qué sirve el día de descanso?', 'Para que el cuerpo se recupere', 'No sirve para nada', 'Para saltar más'], ['What is the rest day for?', 'To let the body recover', 'Nothing at all', 'To jump more'], 0)),
  /* 8 */ T('tendu',
    ['Tendu significa "estirado"', 'En el tendu, el pie se desliza por el suelo hasta que la rodilla y el empeine quedan estirados. La punta no se despega nunca del suelo.'],
    ['Tendu means "stretched"', 'In a tendu, your foot slides along the floor until the knee and instep are stretched. The toe never leaves the floor.'],
    Q(['En el tendu, la punta del pie...', 'Se queda en el suelo', 'Sube muy alto', 'Golpea el suelo'], ['In a tendu, your toe...', 'Stays on the floor', 'Goes up high', 'Taps the floor'], 0)),
  /* 9 */ T('degage',
    ['Dégagé significa "soltado"', 'El dégagé es como un tendu, pero al final la punta se despega unos centímetros del suelo. Sale rápido y vuelve con control.'],
    ['Dégagé means "released"', 'A dégagé is like a tendu, but at the end the toe lifts a few centimetres off the floor. It goes out quickly and comes back with control.'],
    Q(['¿En qué se diferencia el dégagé del tendu?', 'La punta se despega un poco', 'Se hace sentado', 'No hay diferencia'], ['How is a dégagé different from a tendu?', 'The toe lifts off a little', 'It is done sitting', 'There is no difference'], 0)),
  /* 10 */ T('march',
    ['Contar la música', 'En ballet la música se cuenta de 8 en 8: "cinco, seis, siete, ocho" es la entrada, y después el ejercicio empieza en el "uno". El ritmo de la app te ayuda a contar.'],
    ['Counting the music', 'In ballet, music is counted in eights: "five, six, seven, eight" is the lead-in, and then the exercise starts on "one". The app beat helps you count.'],
    Q(['¿De cuánto en cuánto se suele contar la música?', 'De 3 en 3', 'De 8 en 8', 'De 10 en 10'], ['How is ballet music usually counted?', 'In threes', 'In eights', 'In tens'], 1)),
  /* 11 */ T('rond',
    ['Rond de jambe', 'Es un "círculo de pierna": la punta dibuja medio círculo en el suelo. En dehors es hacia fuera (de delante hacia atrás) y en dedans hacia dentro (de atrás hacia delante).'],
    ['Rond de jambe', 'It is a "leg circle": the toe draws half a circle on the floor. En dehors is outwards (front to back) and en dedans is inwards (back to front).'],
    Q(['En dehors significa...', 'Hacia fuera', 'Hacia dentro', 'Hacia arriba'], ['En dehors means...', 'Outwards', 'Inwards', 'Upwards'], 0)),
  /* 12 */ T('releve',
    ['Relevé y media punta', 'Relevé significa "levantado": subes a la media punta, sobre la parte delantera del pie. Los tobillos quedan rectos, sin caer hacia fuera.'],
    ['Relevé and demi-pointe', 'Relevé means "raised": you rise onto demi-pointe, the balls of your feet. Your ankles stay straight without rolling outwards.'],
    Q(['En el relevé subes a...', 'La media punta', 'Los talones', 'Un pie'], ['In a relevé you rise onto...', 'Demi-pointe', 'Your heels', 'One foot'], 0)),
  /* 13 */ T('releve',
    ['Reparte el peso', 'El peso del cuerpo se apoya en tres puntos de cada pie: el talón, la base del dedo gordo y la base del dedo pequeño. Así el pie no se tuerce.'],
    ['Share your weight', 'Your body weight rests on three points of each foot: the heel, the base of the big toe and the base of the little toe. That keeps the foot from rolling.'],
    Q(['¿En cuántos puntos se apoya cada pie?', 'En uno', 'En tres', 'En cinco'], ['On how many points does each foot rest?', 'One', 'Three', 'Five'], 1)),
  /* 14 */ T('coach',
    ['Esfuerzo o dolor', 'Notar que los músculos trabajan es normal. Un dolor fuerte, en una articulación o que no se va no lo es: para y avisa a un adulto o a un profesional.'],
    ['Effort or pain', 'Feeling your muscles work is normal. Strong pain, pain in a joint or pain that does not go away is not: stop and tell an adult or a professional.'],
    Q(['Si notas un dolor fuerte, ¿qué haces?', 'Sigo igual', 'Paro y aviso a un adulto', 'Voy más rápido'], ['If you feel a strong pain, what do you do?', 'Carry on', 'Stop and tell an adult', 'Go faster'], 1)),
  /* 15 */ T('portdebras',
    ['Posiciones de brazos', 'Los brazos tienen sus posiciones: abajo, delante del pecho (primera), a los lados (segunda) y sobre la cabeza (en haut). Siempre redondeados y sin tensión.'],
    ['Arm positions', 'Arms have positions too: down, in front of the chest (first), out to the sides (second) and above the head (en haut). Always rounded and relaxed.'],
    Q(['¿Cómo deben estar los brazos?', 'Rígidos', 'Redondeados y sin tensión', 'Pegados al cuerpo'], ['How should your arms be?', 'Stiff', 'Rounded and relaxed', 'Stuck to your body'], 1)),
  /* 16 */ T('portdebras',
    ['Port de bras', 'Port de bras es la forma de llevar y mover los brazos de una posición a otra. Los brazos se mueven despacio, como si pasaran por dentro del agua.'],
    ['Port de bras', 'Port de bras is the way the arms are carried and moved from one position to another. They move slowly, as if passing through water.'],
    Q(['Port de bras se refiere a...', 'Los brazos', 'Los pies', 'Los saltos'], ['Port de bras refers to...', 'The arms', 'The feet', 'Jumps'], 0)),
  /* 17 */ T('stand',
    ['La rotación sale de la cadera', 'Las puntas hacia fuera no se consiguen girando los pies, sino las piernas desde la cadera. Gira solo hasta donde puedas sin que las rodillas se tuerzan.'],
    ['Turnout comes from the hips', 'Turned-out feet do not come from twisting the feet, but from turning the legs at the hips. Turn out only as far as you can without twisting your knees.'],
    Q(['La rotación hacia fuera sale de...', 'Los pies', 'Las caderas', 'Los brazos'], ['Turnout comes from...', 'The feet', 'The hips', 'The arms'], 1)),
  /* 18 */ T('shrug',
    ['Hombros abajo, cuello largo', 'Cuando te concentras, los hombros tienden a subir hacia las orejas. Bájalos y relájalos: el cuello se ve más largo y los brazos se mueven mejor.'],
    ['Shoulders down, long neck', 'When you concentrate, your shoulders tend to creep up to your ears. Lower and relax them: your neck looks longer and your arms move better.'],
    Q(['¿Dónde deben estar los hombros?', 'Pegados a las orejas', 'Bajos y relajados', 'Hacia delante'], ['Where should your shoulders be?', 'Up by your ears', 'Low and relaxed', 'Rolled forward'], 1)),
  /* 19 */ T('releve2',
    ['Un punto fijo para el equilibrio', 'Para mantener el equilibrio, mira un punto fijo delante de ti, a la altura de los ojos. Si la mirada se mueve, el cuerpo también se mueve.'],
    ['A fixed point for balance', 'To keep your balance, look at a fixed point in front of you at eye level. If your eyes wander, your body wanders too.'],
    Q(['¿Qué te ayuda a mantener el equilibrio?', 'Mirar un punto fijo', 'Cerrar los ojos', 'Mirar los pies'], ['What helps you keep your balance?', 'Looking at a fixed point', 'Closing your eyes', 'Looking at your feet'], 0)),
  /* 20 */ T('retire',
    ['El retiré', 'En el retiré, un pie sube por la pierna de apoyo con la rodilla abierta hacia el lado. Para empezar, apoya el pie en el tobillo o la pantorrilla, nunca sobre la rodilla.'],
    ['The retiré', 'In a retiré, one foot slides up the supporting leg with the knee opening to the side. To begin, rest the foot on the ankle or calf, never on the knee.'],
    Q(['¿Dónde nunca apoyas el pie en el retiré?', 'En el tobillo', 'En la pantorrilla', 'Sobre la rodilla'], ['Where do you never rest your foot in a retiré?', 'On the ankle', 'On the calf', 'On the knee'], 2)),
  /* 21 */ T('bow',
    ['Un poco de historia', 'El ballet nació en las cortes de Italia y se desarrolló en Francia. En 1661 el rey Luis XIV fundó la Real Academia de Danza, y por eso los pasos tienen nombres en francés.'],
    ['A little history', 'Ballet was born in the courts of Italy and developed in France. In 1661 King Louis XIV founded the Royal Academy of Dance, which is why steps have French names.'],
    Q(['¿En qué idioma se nombran los pasos de ballet?', 'Inglés', 'Francés', 'Italiano'], ['In which language are ballet steps named?', 'English', 'French', 'Italian'], 1)),
  /* 22 */ T('portdebras',
    ['La barra y el centro', 'Una clase empieza en la barra, que ayuda con el equilibrio. Después pasa al centro, sin apoyo, donde repites ejercicios y los brazos cobran protagonismo.'],
    ['Barre and centre', 'A class starts at the barre, which helps your balance. Then it moves to the centre, with no support, where you repeat exercises and the arms take a bigger role.'],
    Q(['El centro son ejercicios...', 'Sin barra', 'En el suelo', 'Solo de brazos'], ['The centre is exercises...', 'Away from the barre', 'On the floor', 'Only for the arms'], 0)),
  /* 23 */ T('walk',
    ['Caminar en media punta', 'Caminar en media punta con pasos pequeños y ligeros entrena los tobillos y el equilibrio. Antes de hacerlo, despeja el espacio para no tropezar.'],
    ['Walking on demi-pointe', 'Walking on demi-pointe with small, light steps trains your ankles and balance. Clear the space first so you do not trip.'],
    Q(['Antes de caminar en media punta...', 'Despejo el espacio', 'Me pongo zapatos', 'Cierro los ojos'], ['Before walking on demi-pointe...', 'I clear the space', 'I put on shoes', 'I close my eyes'], 0)),
  /* 24 */ T('saute',
    ['Sauté: aterriza suave', 'Sauté significa "saltado". Para aterrizar: primero los dedos, después el talón, y terminas en plié. Así las rodillas absorben el golpe.'],
    ['Sauté: land softly', 'Sauté means "jumped". To land: toes first, then heels, finishing in plié. That way your knees absorb the impact.'],
    Q(['Al aterrizar de un salto, ¿qué toca primero el suelo?', 'Los talones', 'Los dedos de los pies', 'Las rodillas'], ['When landing a jump, what touches the floor first?', 'Your heels', 'Your toes', 'Your knees'], 1)),
  /* 25 */ T('stand',
    ['Tercera, cuarta y quinta', 'En estas posiciones los pies van uno delante del otro. En la quinta van cruzados y pegados. Se aprenden con un profesor cuando la primera y la segunda son cómodas.'],
    ['Third, fourth and fifth', 'In these positions one foot is in front of the other. In fifth they are crossed and touching. They are learned with a teacher once first and second feel comfortable.'],
    Q(['¿En qué posición los pies van cruzados y pegados?', 'Primera', 'Segunda', 'Quinta'], ['In which position are the feet crossed and touching?', 'First', 'Second', 'Fifth'], 2)),
  /* 26 */ T('coach',
    ['Ropa, pelo y suelo', 'Baila con ropa que te deje moverte, el pelo recogido y en un suelo firme que no resbale, con calcetines antideslizantes o zapatillas de ballet.'],
    ['Clothes, hair and floor', 'Dance in clothes that let you move, with your hair tied back, on a firm non-slip floor, in non-slip socks or ballet shoes.'],
    Q(['¿Qué suelo es mejor para bailar?', 'Uno que resbale', 'Uno firme que no resbale', 'Una alfombra gruesa'], ['Which floor is best for dancing?', 'A slippery one', 'A firm non-slip one', 'A thick rug'], 1)),
  /* 27 */ T('releve',
    ['Las zapatillas de punta', 'Bailar en puntas exige mucha fuerza y años de práctica. Solo se empieza cuando un profesor lo decide, normalmente no antes de los 11 o 12 años.'],
    ['Pointe shoes', 'Dancing on pointe demands a lot of strength and years of practice. You only start when a teacher decides, usually not before age 11 or 12.'],
    Q(['¿Quién decide cuándo empezar con puntas?', 'Yo mismo', 'Un profesor', 'La tienda'], ['Who decides when to start pointe work?', 'Me', 'A teacher', 'The shop'], 1)),
  /* 28 */ T('bow',
    ['La reverencia', 'La clase termina con una reverencia para dar las gracias al profesor y al pianista. Es una forma de respeto que se hace en todas las escuelas de ballet.'],
    ['The révérence', 'Class ends with a bow to thank the teacher and the pianist. It is a sign of respect in every ballet school.'],
    Q(['¿Para qué sirve la reverencia?', 'Para dar las gracias', 'Para calentar', 'Para saltar'], ['What is the révérence for?', 'To say thank you', 'To warm up', 'To jump'], 0)),
  /* 29 */ T('coach',
    ['Ensayo general', 'Hoy repasas todo lo aprendido en una clase casi completa. No hace falta que salga perfecto: fíjate en la postura, en las rodillas y en respirar con calma.'],
    ['Dress rehearsal', 'Today you go over everything in an almost complete class. It does not need to be perfect: focus on posture, your knees and calm breathing.'],
    Q(['En el ensayo, ¿en qué te fijas?', 'En hacerlo muy rápido', 'En la postura y las rodillas', 'En saltar muy alto'], ['In the rehearsal, what do you focus on?', 'Doing it very fast', 'Posture and knees', 'Jumping very high'], 1)),
  /* 30 */ T('celebrate',
    ['¡Lo has conseguido!', 'Treinta días de ballet. Hoy haces la clase completa, de la barra a la reverencia. Después te espera el examen del Nivel 1 para pasar al Nivel 2.'],
    ['You made it!', 'Thirty days of ballet. Today you do the full class, from barre to révérence. Then the Level 1 exam awaits, to move up to Level 2.'],
    Q(['¿Cuántos días dura el Nivel 1?', '7 días', '30 días', '100 días'], ['How many days does Level 1 last?', '7 days', '30 days', '100 days'], 1))
];

export const REST_DAYS = [7, 14, 21, 28];

export const PROGRAM = PLAN.map((line, i) => {
  const [tech, phys] = line.split('|');
  const day = i + 1;
  return {
    day,
    rest: REST_DAYS.includes(day),
    theory: THEORY30[i],
    tecnica: parse(tech),
    fisico: parse(phys)
  };
});

export const dayMinutes = (d) => Math.max(1, Math.round((d.tecnica.concat(d.fisico).reduce((a, e) => a + e.dur, 0) + 60) / 60));
