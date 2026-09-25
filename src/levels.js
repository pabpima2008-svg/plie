/* ------------------------------------------------------------------
   Contenido de los niveles 2 (Intermedio) y 3 (Avanzado):
   ejercicios nuevos de tecnica y fisico, y sus planes de 30 dias.
   ------------------------------------------------------------------ */
const E = (id, bpm, anim, name, steps, tip) => ({
  id, dur: 120, bpm, anim,
  name: { es: name[0], en: name[1] },
  steps: { es: steps[0], en: steps[1] },
  tip: { es: tip[0], en: tip[1] }
});

export const NEW_EXERCISES = [
  /* ---------- tecnica nivel 2 ---------- */
  E('grandplie', 56, 'grandplie', ['Grand plié', 'Grand plié'], [[
    'Empieza en primera posición con los brazos en segunda.',
    'Baja pasando por el demi-plié y sigue bajando: en primera, los talones se despegan solo al final.',
    'Sube empujando el suelo y apoya los talones lo antes posible.',
    'Repite en segunda posición: ahí los talones no se despegan nunca.'
  ], [
    'Start in first position with your arms in second.',
    'Go down through demi-plié and keep going: in first, your heels lift only at the very end.',
    'Come up pushing the floor away, lowering your heels as early as you can.',
    'Repeat in second position: there your heels never leave the floor.'
  ]], ['No te sientes abajo: baja y sube sin parar, como un ascensor suave.', 'Do not sit at the bottom: go down and up without stopping, like a smooth lift.']),
  E('fondu', 60, 'fondu', ['Fondu', 'Fondu'], [[
    'Fondu significa "derretido". Empieza con un pie en cou-de-pied, junto al tobillo de la pierna de apoyo.',
    'Dobla la pierna de apoyo mientras el pie sigue en cou-de-pied.',
    'Estira las dos piernas a la vez: la de apoyo sube y la otra se abre al lado.',
    'Vuelve despacio y cambia de pierna.'
  ], [
    'Fondu means "melted". Start with one foot at cou-de-pied, next to the ankle of your supporting leg.',
    'Bend your supporting leg while the foot stays at cou-de-pied.',
    'Straighten both legs at the same time: the supporting leg rises and the other opens to the side.',
    'Come back slowly and switch legs.'
  ]], ['Las dos piernas se estiran juntas, como si fueran una sola.', 'Both legs stretch together, as if they were one.']),
  E('grandbatt', 72, 'grandbatt', ['Grand battement', 'Grand battement'], [[
    'Desde primera, pasa por el tendu y lanza la pierna estirada hacia arriba.',
    'La pierna sube rápido y baja despacio, con control, hasta el tendu.',
    'Cierra en primera. Hazlo al lado y luego delante.',
    'Las caderas se quedan niveladas; la altura llegará con el tiempo.'
  ], [
    'From first, pass through tendu and throw your straight leg upwards.',
    'The leg goes up fast and comes down slowly, with control, to tendu.',
    'Close in first. Do it to the side and then to the front.',
    'Keep your hips level; height will come with time.'
  ]], ['Mejor una pierna más baja y bien colocada que alta y torcida.', 'A lower, well-placed leg is better than a high, twisted one.']),
  E('sousus', 60, 'releve', ['Sous-sus', 'Sous-sus'], [[
    'Sous-sus significa "debajo-encima". Empieza en quinta posición, o en primera si aún no la dominas.',
    'Haz un pequeño plié y sube a media punta juntando mucho las piernas.',
    'Arriba, las piernas se aprietan como si fueran una sola.',
    'Baja en plié con control y repite.'
  ], [
    'Sous-sus means "under-over". Start in fifth position, or first if you are not yet comfortable in fifth.',
    'Do a small plié and rise to demi-pointe, squeezing your legs together.',
    'At the top, your legs press together as if they were one.',
    'Lower into plié with control and repeat.'
  ]], ['Crece hacia arriba al subir: no te quedes encogida o encogido.', 'Grow tall as you rise: do not scrunch down.']),
  E('echappe', 60, 'echappe', ['Échappé relevé', 'Échappé relevé'], [[
    'Échappé significa "escapado". Empieza en primera con un pequeño plié.',
    'Sube a media punta abriendo los pies a la segunda posición.',
    'Cierra de nuevo en primera con un plié suave.',
    'Repite con ritmo, manteniendo el cuerpo recto.'
  ], [
    'Échappé means "escaped". Start in first with a small plié.',
    'Rise to demi-pointe, opening your feet to second position.',
    'Close back into first with a soft plié.',
    'Repeat in rhythm, keeping your body upright.'
  ]], ['Los pies se escapan a la vez y a la misma distancia.', 'Both feet escape at the same time and the same distance.']),
  E('changement', 80, 'saute', ['Changements', 'Changements'], [[
    'Empieza en quinta posición (o en primera si aún no dominas la quinta) con un demi-plié.',
    'Salta estirando los pies en el aire.',
    'En el aire cambia el pie de delante y aterriza en quinta, en plié.',
    'Aterriza suave: dedos, planta y talón.'
  ], [
    'Start in fifth position (or first if you are not yet comfortable in fifth) with a demi-plié.',
    'Jump, stretching your feet in the air.',
    'In the air, change the front foot and land in fifth, in plié.',
    'Land softly: toes, sole, heel.'
  ]], ['Si el suelo es duro o resbala, salta más bajo o haz solo el cambio de pies.', 'If the floor is hard or slippery, jump lower or just practise the foot change.']),
  E('pirprep', 60, 'pirprep', ['Preparación de pirueta', 'Pirouette preparation'], [[
    'Empieza en plié, con un brazo delante y otro al lado.',
    'Sube a media punta llevando un pie a retiré, junto a la rodilla, y los brazos a primera.',
    'Mantén el equilibrio unos segundos mirando un punto fijo.',
    'Baja con control y cambia de lado.'
  ], [
    'Start in plié, with one arm in front and the other to the side.',
    'Rise to demi-pointe, bringing one foot to retiré next to the knee, and your arms to first.',
    'Hold your balance for a few seconds, looking at a fixed point.',
    'Lower with control and switch sides.'
  ]], ['Antes de girar hay que saber quedarse quieta o quieto arriba.', 'Before turning you must be able to stay still at the top.']),
  /* ---------- tecnica nivel 3 ---------- */
  E('develop', 60, 'develop', ['Développé', 'Développé'], [[
    'Développé significa "desarrollado". Sube el pie por la pierna de apoyo hasta retiré.',
    'Desde ahí, estira la pierna hacia el lado despacio, como si se desenrollara.',
    'Mantén la pierna arriba un momento con las caderas niveladas.',
    'Bájala estirada hasta el tendu y cierra.'
  ], [
    'Développé means "developed". Slide your foot up the supporting leg to retiré.',
    'From there, slowly unfold the leg to the side.',
    'Hold the leg up for a moment with your hips level.',
    'Lower it straight to tendu and close.'
  ]], ['La lentitud es lo difícil. No tengas prisa.', 'Slowness is the hard part. Take your time.']),
  E('pirouette', 60, 'pirouette', ['Pirueta en dehors', 'Pirouette en dehors'], [[
    'Haz la preparación: plié con un brazo delante y otro al lado.',
    'Sube a retiré en media punta, cierra los brazos en primera y gira hacia fuera, hacia el lado de la pierna levantada.',
    'Usa la vista: la cabeza se queda mirando un punto y gira la última.',
    'Termina con control en quinta o en cuarta. Empieza con un cuarto de vuelta.'
  ], [
    'Do the preparation: plié with one arm in front and the other to the side.',
    'Rise to retiré on demi-pointe, close your arms in first and turn outwards, towards the lifted leg.',
    'Spot: your head keeps looking at one point and turns last.',
    'Finish with control in fifth or fourth. Start with a quarter turn.'
  ]], ['Practica en un suelo que no resbale y con espacio alrededor.', 'Practise on a non-slip floor with space around you.']),
  E('valse', 90, 'balance', ['Balancé', 'Balancé'], [[
    'Balancé es un paso de vals, en tres tiempos.',
    'Da un paso al lado con plié (1), sube a media punta con el otro pie detrás (2) y baja de nuevo (3).',
    'Repite hacia el otro lado, inclinando un poco la cabeza y los brazos.',
    'Deja que el movimiento se balancee, como las olas.'
  ], [
    'Balancé is a waltz step, in three counts.',
    'Step to the side with plié (1), rise to demi-pointe with the other foot behind (2) and come down again (3).',
    'Repeat to the other side, tilting your head and arms slightly.',
    'Let the movement sway, like waves.'
  ]], ['Cuenta "un-dos-tres" en voz alta al principio.', 'Count "one-two-three" out loud at first.']),
  E('pasdebourree', 80, 'walk', ['Pas de bourrée', 'Pas de bourrée'], [[
    'Es un paso de tres pasitos rápidos en media punta.',
    'Pie de atrás, pie del lado, pie de delante, cambiando el peso cada vez.',
    'Termina en plié, en quinta o en primera.',
    'Hazlo primero despacio y después más ligero.'
  ], [
    'It is a step made of three quick little steps on demi-pointe.',
    'Back foot, side foot, front foot, changing weight each time.',
    'Finish in plié, in fifth or first.',
    'Do it slowly first, then more lightly.'
  ]], ['Pasos pequeños: los pies casi no se separan.', 'Small steps: your feet barely separate.']),
  E('allegro', 80, 'allegro', ['Pequeño allegro', 'Petit allegro'], [[
    'Una pequeña combinación de saltos: sautés, changements y échappés sautés.',
    'Échappé sauté: salta desde primera y aterriza en segunda en plié; salta otra vez y cierra.',
    'Mantén el tronco recto y los pies estirados en el aire.',
    'Aterriza siempre suave, terminando en plié.'
  ], [
    'A short combination of jumps: sautés, changements and échappé sautés.',
    'Échappé sauté: jump from first and land in second in plié; jump again and close.',
    'Keep your upper body upright and your feet pointed in the air.',
    'Always land softly, finishing in plié.'
  ]], ['Si te cansas, descansa: saltar cansada o cansado provoca malos aterrizajes.', 'If you get tired, rest: jumping tired leads to poor landings.']),
  E('retrel', 60, 'pirprep', ['Retiré en relevé', 'Retiré on relevé'], [[
    'Sin apoyarte en la barra, sube a media punta con un pie en retiré.',
    'Brazos en primera o en quinta (en haut).',
    'Aguanta el equilibrio todo lo que puedas mirando un punto fijo.',
    'Baja con control y cambia de pierna.'
  ], [
    'Without holding the barre, rise to demi-pointe with one foot in retiré.',
    'Arms in first or in fifth (en haut).',
    'Hold your balance as long as you can, looking at a fixed point.',
    'Lower with control and switch legs.'
  ]], ['El abdomen y los glúteos activos te sujetan arriba.', 'Active tummy and glutes hold you up.']),

  /* ---------- fisico niveles 2 y 3 ---------- */
  E('heel1', 50, 'heelraise', ['Talones a una pierna', 'Single-leg heel raises'], [[
    'Apóyate en una pared o silla y levanta un pie del suelo.',
    'Sube despacio sobre la media punta del pie de apoyo.',
    'Baja muy despacio, sin dejar caer el talón de golpe.',
    'Haz unas 8 repeticiones y cambia de pie.'
  ], [
    'Hold a wall or chair and lift one foot off the floor.',
    'Rise slowly onto demi-pointe on your supporting foot.',
    'Lower very slowly, without dropping the heel.',
    'Do about 8 reps, then switch feet.'
  ]], ['El tobillo no se tuerce hacia fuera: sube recto.', 'Your ankle does not roll outwards: rise straight up.']),
  E('pliesquat', 50, 'plie', ['Sentadilla en segunda', 'Second-position squat'], [[
    'Pies en segunda, un poco más separados que los hombros y con las puntas hacia fuera.',
    'Baja en plié con la espalda recta, manteniendo las rodillas sobre los pies.',
    'Aguanta abajo 2 segundos.',
    'Sube apretando los glúteos. Repite unas 10 veces.'
  ], [
    'Feet in second, a little wider than your shoulders, toes turned out.',
    'Lower into plié with a straight back, keeping your knees over your feet.',
    'Hold at the bottom for 2 seconds.',
    'Rise squeezing your glutes. Repeat about 10 times.'
  ]], ['Es tu plié, pero con más fuerza.', 'It is your plié, with extra strength.']),
  E('plankfull', 0, 'coach', ['Plancha completa', 'Full plank'], [[
    'Apoya los antebrazos y las puntas de los pies.',
    'El cuerpo forma una línea desde la cabeza hasta los talones.',
    'Aprieta el abdomen y respira con calma.',
    'Aguanta 20 a 30 segundos, descansa y repite.'
  ], [
    'Rest on your forearms and toes.',
    'Your body makes a line from head to heels.',
    'Engage your tummy and breathe calmly.',
    'Hold for 20 to 30 seconds, rest and repeat.'
  ]], ['Si la espalda se hunde, apoya las rodillas.', 'If your back sags, drop to your knees.']),
  E('sideplank', 0, 'coach', ['Plancha lateral', 'Side plank'], [[
    'Túmbate de lado apoyado en un antebrazo, con las rodillas dobladas.',
    'Sube las caderas hasta que el cuerpo quede en línea.',
    'Aguanta 15 a 20 segundos.',
    'Cambia de lado. Si te sientes fuerte, estira las piernas.'
  ], [
    'Lie on your side, resting on one forearm, knees bent.',
    'Lift your hips until your body is in a line.',
    'Hold for 15 to 20 seconds.',
    'Switch sides. If you feel strong, straighten your legs.'
  ]], ['El codo queda justo debajo del hombro.', 'Your elbow sits right under your shoulder.']),
  E('bridge1', 0, 'coach', ['Puente a una pierna', 'Single-leg bridge'], [[
    'Túmbate boca arriba con las rodillas dobladas.',
    'Estira una pierna hacia el techo.',
    'Sube las caderas empujando con el pie apoyado.',
    'Baja despacio. Unas 8 veces por pierna.'
  ], [
    'Lie on your back with your knees bent.',
    'Stretch one leg up towards the ceiling.',
    'Lift your hips, pushing through the foot on the floor.',
    'Lower slowly. About 8 times per leg.'
  ]], ['Las caderas suben rectas, sin inclinarse hacia un lado.', 'Your hips rise level, without tipping to one side.']),
  E('superman', 0, 'coach', ['Espalda fuerte', 'Strong back'], [[
    'Túmbate boca abajo con los brazos estirados hacia delante.',
    'Levanta un poco a la vez un brazo y la pierna contraria.',
    'Mantén 2 segundos mirando al suelo.',
    'Baja y cambia de lado. Unas 8 veces por lado.'
  ], [
    'Lie on your tummy with your arms stretched forward.',
    'Lift one arm and the opposite leg a little at the same time.',
    'Hold for 2 seconds, looking at the floor.',
    'Lower and switch sides. About 8 times per side.'
  ]], ['Es un movimiento pequeño: no hace falta subir mucho.', 'It is a small movement: no need to lift high.']),
  E('hops', 90, 'saute', ['Saltitos en el sitio', 'Little hops on the spot'], [[
    'Pies en paralelo, rodillas suaves.',
    'Da saltitos pequeños y rápidos con los pies estirados en el aire.',
    'Aterriza siempre sobre la parte delantera del pie y baja el talón.',
    'Salta 20 segundos, descansa 10 y repite.'
  ], [
    'Feet parallel, soft knees.',
    'Do small, quick hops with your feet pointed in the air.',
    'Always land on the front of the foot, then lower the heel.',
    'Hop for 20 seconds, rest for 10 and repeat.'
  ]], ['Silenciosos como un gato: si suena fuerte, aterriza más suave.', 'Quiet as a cat: if it is loud, land more softly.']),
  E('lunge', 0, 'coach', ['Estiramiento de cadera', 'Hip flexor stretch'], [[
    'Ponte de rodillas y adelanta un pie, con la rodilla doblada sobre el tobillo.',
    'Lleva las caderas un poco hacia delante con la espalda recta.',
    'Notarás el estiramiento en la parte delantera de la cadera de atrás.',
    'Mantén 30 segundos y cambia de lado.'
  ], [
    'Kneel and bring one foot forward, knee bent over the ankle.',
    'Shift your hips slightly forward with your back straight.',
    'You will feel the stretch at the front of the back hip.',
    'Hold for 30 seconds and switch sides.'
  ]], ['Pon una toalla bajo la rodilla si te molesta.', 'Put a towel under your knee if it hurts.']),
  E('hamstring', 0, 'coach', ['Estiramiento de isquios', 'Hamstring stretch'], [[
    'Túmbate boca arriba y sube una pierna estirada.',
    'Sujétala por detrás del muslo o con una toalla en el pie.',
    'Acércala solo hasta notar un estiramiento suave.',
    'Mantén 30 segundos y cambia de pierna.'
  ], [
    'Lie on your back and lift one straight leg.',
    'Hold it behind the thigh or with a towel around the foot.',
    'Bring it closer only until you feel a gentle stretch.',
    'Hold for 30 seconds and switch legs.'
  ]], ['Nunca tires con fuerza ni des rebotes.', 'Never pull hard or bounce.'])
];

/* Planes de 30 dias por nivel. Dias 7, 14, 21, 28: repaso (tecnica) o estiramientos (fisico). */
export const PLANS = {
  tecnica: {
    2: [
      'warmup:120 plie:150 grandplie:120 tendu:150 degage:120',
      'warmup:120 plie:150 grandplie:120 tendu:150 degage:120 fondu:120',
      'warmup:120 plie:150 grandplie:120 tendu:150 fondu:120 rond:120 sousus:90',
      'warmup:120 plie:150 grandplie:150 tendu:150 degage:120 rond:120 grandbatt:90',
      'warmup:120 plie:150 grandplie:150 tendu:150 fondu:120 rond:120 grandbatt:120 echappe:90',
      'warmup:120 plie:150 grandplie:150 tendu:150 degage:120 fondu:120 grandbatt:120 port:120 changement:90',
      'warmup:90 plie:150 grandplie:120 tendu:120 fondu:120 grandbatt:90 port:120',
      'warmup:120 plie:150 grandplie:150 tendu:150 degage:120 fondu:120 grandbatt:120 pirprep:120',
      'warmup:120 plie:150 grandplie:150 tendu:150 fondu:120 develop:120 grandbatt:120 pirprep:120 changement:90',
      'warmup:120 plie:150 grandplie:150 tendu:150 degage:120 rond:120 develop:120 grandbatt:120 retrel:90 echappe:120',
      'warmup:120 plie:150 grandplie:150 tendu:150 fondu:150 develop:150 grandbatt:120 pirprep:120 saute:90 changement:90',
      'warmup:120 plie:150 grandplie:150 tendu:150 degage:120 rond:150 develop:150 grandbatt:120 port:120 retrel:120 changement:120',
      'warmup:120 plie:150 grandplie:150 tendu:180 degage:120 fondu:150 develop:150 grandbatt:150 pirprep:150 echappe:120 changement:120',
      'warmup:90 plie:150 tendu:150 fondu:120 develop:120 grandbatt:90 pirprep:120',
      'warmup:120 plie:150 grandplie:150 tendu:150 fondu:150 develop:150 grandbatt:120 valse:120 pirprep:120',
      'warmup:120 plie:150 grandplie:150 tendu:150 degage:120 rond:150 develop:150 grandbatt:150 valse:120 pasdebourree:90',
      'warmup:120 plie:150 grandplie:150 tendu:180 fondu:150 develop:150 grandbatt:150 pirprep:120 pirouette:120 changement:120',
      'warmup:120 plie:150 grandplie:150 tendu:180 degage:150 rond:150 develop:150 grandbatt:150 valse:120 pasdebourree:120 allegro:90',
      'warmup:120 plie:180 grandplie:150 tendu:180 fondu:150 develop:180 grandbatt:150 retrel:120 pirouette:150 allegro:120',
      'warmup:120 plie:180 grandplie:150 tendu:180 degage:150 rond:150 fondu:150 develop:180 grandbatt:150 valse:120 pirouette:150 allegro:120',
      'warmup:90 plie:150 tendu:150 develop:150 grandbatt:120 pirouette:120 valse:120',
      'warmup:120 plie:180 grandplie:150 tendu:180 degage:150 fondu:150 develop:180 grandbatt:150 port:120 pirouette:150 pasdebourree:120 allegro:120',
      'warmup:120 plie:180 grandplie:150 tendu:180 rond:150 fondu:150 develop:180 grandbatt:150 retrel:150 valse:120 allegro:150',
      'warmup:120 plie:180 grandplie:180 tendu:180 degage:150 fondu:150 develop:180 grandbatt:150 pirouette:150 pasdebourree:120 allegro:150 changement:120',
      'warmup:120 plie:180 grandplie:180 tendu:180 degage:150 rond:150 fondu:150 develop:180 grandbatt:150 port:120 pirouette:150 valse:120 allegro:150',
      'warmup:120 plie:180 grandplie:180 tendu:180 fondu:180 develop:180 grandbatt:150 retrel:150 pirouette:150 pasdebourree:120 allegro:150 bow:60',
      'warmup:120 plie:180 grandplie:180 tendu:180 degage:150 rond:150 fondu:180 develop:180 grandbatt:180 pirouette:150 valse:150 allegro:180 bow:60',
      'warmup:90 plie:150 tendu:150 fondu:150 develop:150 pirouette:150 valse:120 bow:60',
      'warmup:120 plie:180 grandplie:180 tendu:180 degage:150 rond:150 fondu:180 develop:180 grandbatt:180 port:150 retrel:150 pirouette:180 pasdebourree:120 allegro:180 bow:60',
      'warmup:120 plie:180 grandplie:180 tendu:180 degage:180 rond:180 fondu:180 develop:180 grandbatt:180 port:150 retrel:150 pirouette:180 valse:150 pasdebourree:150 allegro:180 bow:90'
    ],
    3: [
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 b3-adagio:240 b3-grandbatt:180 c3-adagio:210 dblpir:180 p3-allegro:180 bow:60',
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 b3-adagio:240 b3-grandbatt:180 c3-adagio:210 dblpir:180 p3-allegro:180',
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 b3-adagio:240 b3-grandbatt:180 c3-adagio:210 dblpir:180 p3-allegro:180',
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 petitbatt:90 b3-adagio:240 b3-grandbatt:180 c3-adagio:210 dblpir:180 p3-allegro:180',
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 petitbatt:90 b3-adagio:240 b3-grandbatt:180 c3-adagio:210 dblpir:180 p3-allegro:180',
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 petitbatt:90 b3-adagio:240 b3-grandbatt:180 c3-adagio:210 dblpir:180 p3-allegro:180',
      'warmup:120 b3-plie:180 b3-tendu:150 b3-rond:180 b3-adagio:180 dblpir:150 bow:60',
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 petitbatt:90 b3-adagio:240 b3-grandbatt:180 dblpir:180 pirdedans:180 p3-allegro:180',
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 petitbatt:90 b3-adagio:240 b3-grandbatt:180 c3-adagio:210 dblpir:180 p3-allegro:180 sissonne:180',
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 petitbatt:90 b3-adagio:240 b3-grandbatt:180 c3-adagio:210 dblpir:180 pirdedans:180 p3-allegro:180',
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 petitbatt:90 b3-adagio:240 b3-grandbatt:180 c3-adagio:210 dblpir:180 pirdedans:180 p3-allegro:180 sissonne:180',
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 petitbatt:90 b3-adagio:240 b3-grandbatt:180 c3-adagio:210 dblpir:180 pirdedans:180 p3-allegro:180 sissonne:180',
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 petitbatt:90 b3-adagio:240 b3-grandbatt:180 c3-adagio:210 dblpir:180 pirdedans:180 p3-allegro:180 sissonne:180',
      'warmup:120 b3-plie:180 b3-tendu:150 b3-rond:180 b3-adagio:180 dblpir:150 bow:60',
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 petitbatt:90 b3-adagio:240 b3-grandbatt:180 c3-adagio:240 dblpir:180 pasdechat:150 sissonne:180',
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 petitbatt:90 b3-adagio:240 b3-grandbatt:180 c3-adagio:240 dblpir:180 pirdedans:180 chaines:150 fouette:180',
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 petitbatt:90 b3-adagio:240 b3-grandbatt:180 pirdedans:180 chaines:150 fouette:180 p3-allegro:210 pasdechat:150',
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 petitbatt:90 b3-adagio:240 b3-grandbatt:180 c3-adagio:240 dblpir:180 fouette:180 p3-allegro:210 pasdechat:150 sissonne:180',
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 petitbatt:90 b3-adagio:240 b3-grandbatt:180 c3-adagio:240 dblpir:180 pirdedans:180 chaines:150 pasdechat:150 sissonne:180',
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 petitbatt:90 b3-adagio:240 b3-grandbatt:180 c3-adagio:240 dblpir:180 pirdedans:180 chaines:150 fouette:180 p3-allegro:210 pasdechat:150',
      'warmup:120 b3-plie:180 b3-tendu:150 b3-rond:180 b3-adagio:180 dblpir:150 bow:60',
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 petitbatt:90 b3-adagio:240 b3-grandbatt:180 fouette:210 p3-allegro:210 sissonne:180 pasdechat:150',
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 petitbatt:90 b3-adagio:240 b3-grandbatt:180 c3-adagio:240 sissonne:180 pasdechat:150 grandjete:210 variation:240',
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 petitbatt:90 b3-adagio:240 b3-grandbatt:180 c3-adagio:240 dblpir:210 pirdedans:180 grandjete:210 variation:240 bow:60',
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 petitbatt:90 b3-adagio:240 b3-grandbatt:180 c3-adagio:240 dblpir:210 pirdedans:180 chaines:180 fouette:210 p3-allegro:210 bow:60',
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 petitbatt:90 b3-adagio:240 b3-grandbatt:180 pirdedans:180 chaines:180 fouette:210 p3-allegro:210 sissonne:180 pasdechat:150 bow:60',
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 petitbatt:90 b3-adagio:240 b3-grandbatt:180 c3-adagio:240 fouette:210 p3-allegro:210 sissonne:180 pasdechat:150 grandjete:210 variation:240 bow:60',
      'warmup:120 b3-plie:180 b3-tendu:150 b3-rond:180 b3-adagio:180 dblpir:150 bow:60',
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 petitbatt:90 b3-adagio:240 b3-grandbatt:180 c3-adagio:240 dblpir:210 pirdedans:180 chaines:180 fouette:210 p3-allegro:210 sissonne:180 pasdechat:150 grandjete:210 variation:240 bow:60',
      'warmup:120 b3-plie:240 b3-tendu:180 b3-degage:150 b3-rond:210 b3-fondu:180 frappe:150 petitbatt:90 b3-adagio:240 b3-grandbatt:180 c3-adagio:240 dblpir:210 pirdedans:180 chaines:180 fouette:210 p3-allegro:210 sissonne:180 pasdechat:150 grandjete:210 variation:240 bow:60'
    ]
  },
  fisico: {
    2: [
      'f-warm:90 heel:120 pliesquat:90 plank:60 butterfly:90 feet:60',
      'f-warm:90 heel1:90 bridge:90 sideplank:60 fold:90',
      'f-warm:90 pliesquat:120 plankfull:60 deadbug:90 butterfly:90',
      'f-warm:90 heel1:120 bridge1:90 balance:90 quad:60 child:60',
      'f-warm:90 pliesquat:120 sideplank:90 superman:90 fold:90',
      'f-warm:90 heel1:120 bridge1:120 plankfull:60 balance:90 lunge:90',
      'neck:60 butterfly:90 fold:90 lunge:90 hamstring:90 child:60',
      'f-warm:90 heel1:120 pliesquat:120 plankfull:75 hamstring:90',
      'f-warm:90 bridge1:120 sideplank:90 deadbug:90 lunge:90 child:60',
      'f-warm:90 heel1:150 pliesquat:120 superman:90 balance:120 fold:90',
      'f-warm:90 bridge1:120 plankfull:90 sideplank:90 butterfly:90 hamstring:60',
      'f-warm:90 heel1:150 pliesquat:150 superman:90 balance:120 lunge:90',
      'f-warm:90 bridge1:150 plankfull:90 deadbug:120 hops:60 fold:90',
      'neck:60 feet:90 butterfly:90 lunge:90 hamstring:90 cobra:45 child:60',
      'f-warm:90 heel1:150 pliesquat:150 plankfull:90 hops:90 hamstring:90',
      'f-warm:90 bridge1:150 sideplank:120 superman:120 balance:120 lunge:90',
      'f-warm:90 heel1:150 pliesquat:150 plankfull:90 deadbug:120 hops:90 fold:90',
      'f-warm:90 bridge1:150 sideplank:120 superman:120 balance:150 butterfly:90',
      'f-warm:90 heel1:180 pliesquat:150 plankfull:120 hops:90 hamstring:90',
      'f-warm:90 bridge1:150 sideplank:120 deadbug:120 balance:150 lunge:90 child:60',
      'neck:60 butterfly:90 fold:90 lunge:90 hamstring:90 quad:60 child:60',
      'f-warm:90 heel1:180 pliesquat:180 plankfull:120 hops:120 fold:90',
      'f-warm:90 bridge1:180 sideplank:120 superman:120 balance:150 lunge:90 hamstring:60',
      'f-warm:90 heel1:180 pliesquat:180 plankfull:120 deadbug:120 hops:120 butterfly:90',
      'f-warm:90 bridge1:180 sideplank:150 superman:120 balance:180 fold:90',
      'f-warm:90 heel1:180 pliesquat:180 plankfull:120 hops:120 lunge:90 hamstring:90',
      'f-warm:90 bridge1:180 sideplank:150 deadbug:150 balance:180 butterfly:90 child:60',
      'neck:60 feet:90 butterfly:90 fold:90 lunge:90 hamstring:90 child:60',
      'f-warm:90 heel1:180 pliesquat:180 bridge1:180 plankfull:120 sideplank:120 hops:120 fold:90',
      'f-warm:90 heel1:180 pliesquat:180 bridge1:180 plankfull:150 sideplank:150 superman:120 hops:120 balance:180 hamstring:90'
    ],
    3: [
      'f-warm:120 teaser:150 sidelift:180 archlift:150 plankfull:150 sideplank:150 plyo:180 legholds:150 splits:180',
      'f-warm:120 calfecc:180 plankfull:150 sideplank:150 bridge1:150 superman:120 plyo:180 hops:120 splits:180 lunge:90',
      'f-warm:120 calfecc:180 pistol:180 hollow:150 teaser:150 superman:120 plyo:180 lunge:90 hamstring:90',
      'f-warm:120 hollow:150 teaser:150 sidelift:180 archlift:150 plankfull:150 plyo:180 hops:120 hamstring:90 band:120',
      'f-warm:120 archlift:150 plankfull:150 sideplank:150 bridge1:150 superman:120 plyo:180 band:120 legholds:150',
      'f-warm:120 calfecc:180 pistol:180 hollow:150 bridge1:150 superman:120 plyo:180 hops:120 legholds:150 splits:180',
      'neck:60 feet:90 butterfly:90 band:120 lunge:90 hamstring:90 splits:180 child:60',
      'f-warm:120 sidelift:195 archlift:165 plankfull:165 sideplank:165 bridge1:165 plyo:195 hops:135 lunge:90 hamstring:90',
      'f-warm:120 calfecc:195 pistol:195 sideplank:165 bridge1:165 superman:135 plyo:195 hamstring:90 band:120',
      'f-warm:120 calfecc:195 pistol:195 hollow:165 teaser:165 sidelift:195 plyo:195 hops:135 band:120 legholds:150',
      'f-warm:120 teaser:165 sidelift:195 archlift:165 plankfull:165 sideplank:165 plyo:195 legholds:150 splits:180',
      'f-warm:120 calfecc:195 plankfull:165 sideplank:165 bridge1:165 superman:135 plyo:195 hops:135 splits:180 lunge:90',
      'f-warm:120 calfecc:195 pistol:195 hollow:165 teaser:165 superman:135 plyo:195 lunge:90 hamstring:90',
      'neck:60 feet:90 butterfly:90 band:120 lunge:90 hamstring:90 splits:180 child:60',
      'f-warm:120 calfecc:210 archlift:180 plankfull:180 sideplank:180 bridge1:180 superman:150 plyo:210 band:120 legholds:150',
      'f-warm:120 calfecc:210 pistol:210 hollow:180 teaser:180 bridge1:180 superman:150 plyo:210 hops:150 legholds:150 splits:180',
      'f-warm:120 pistol:210 hollow:180 teaser:180 sidelift:210 archlift:180 plankfull:180 plyo:210 splits:180 lunge:90',
      'f-warm:120 sidelift:210 archlift:180 plankfull:180 sideplank:180 bridge1:180 superman:150 plyo:210 hops:150 lunge:90 hamstring:90',
      'f-warm:120 calfecc:210 pistol:210 hollow:180 sideplank:180 bridge1:180 superman:150 plyo:210 hamstring:90 band:120',
      'f-warm:120 calfecc:210 pistol:210 hollow:180 teaser:180 sidelift:210 archlift:180 plyo:210 hops:150 band:120 legholds:150',
      'neck:60 feet:90 butterfly:90 band:120 lunge:90 hamstring:90 splits:180 child:60',
      'f-warm:120 calfecc:240 pistol:240 plankfull:195 sideplank:195 bridge1:195 superman:150 plyo:240 hops:150 splits:180 lunge:90 hamstring:90',
      'f-warm:120 calfecc:240 pistol:240 hollow:195 teaser:195 sidelift:240 superman:150 plyo:240 lunge:90 hamstring:90 band:120',
      'f-warm:120 hollow:195 teaser:195 sidelift:240 archlift:195 plankfull:195 sideplank:195 plyo:240 hops:150 hamstring:90 band:120 legholds:150',
      'f-warm:120 calfecc:240 pistol:240 archlift:195 plankfull:195 sideplank:195 bridge1:195 superman:150 plyo:240 band:120 legholds:150 splits:180',
      'f-warm:120 calfecc:240 pistol:240 hollow:195 teaser:195 sidelift:240 bridge1:195 superman:150 plyo:240 hops:150 legholds:150 splits:180 lunge:90',
      'f-warm:120 pistol:240 hollow:195 teaser:195 sidelift:240 archlift:195 plankfull:195 sideplank:195 plyo:240 splits:180 lunge:90 hamstring:90',
      'neck:60 feet:90 butterfly:90 band:120 lunge:90 hamstring:90 splits:180 child:60',
      'f-warm:120 calfecc:180 pistol:180 hollow:150 teaser:150 sidelift:180 archlift:150 plankfull:150 plyo:180 band:120 legholds:150 splits:180',
      'f-warm:120 calfecc:180 pistol:180 hollow:180 sidelift:180 archlift:150 sideplank:150 bridge1:150 plyo:210 hops:120 legholds:180 splits:180'
    ]
  }
};
