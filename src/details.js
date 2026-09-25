/* ------------------------------------------------------------------
   DETALLES DE COLOCACION
   CORE: la indicacion fija que aparece siempre (tripa, costillas, pelvis...).
   DETAILS[id][nivel]: indicaciones concretas de cada ejercicio.
   Si un ejercicio no tiene detalles para un nivel, se usa el nivel inferior mas cercano.
   ------------------------------------------------------------------ */
const d = (es, en) => ({ es, en });

export const CORE = {
  tecnica: {
    1: d('Mete la tripa: lleva el ombligo hacia dentro y hacia arriba, como si te subieras la cremallera de un pantalón, y sigue respirando. Hombros abajo y cuello largo.',
      'Pull your tummy in: draw your belly button in and up, as if zipping up tight trousers, and keep breathing. Shoulders down, long neck.'),
    2: d('Tripa dentro y costillas cerradas: que no se abran hacia delante al subir los brazos. Cóccix hacia el suelo, glúteos activos sin apretar de más, peso sobre la parte delantera del pie.',
      'Tummy in and ribs closed: do not let them flare when your arms rise. Tailbone down, glutes active without over-squeezing, weight over the front of the foot.'),
    3: d('Colocación completa: transverso activo (ombligo hacia la columna), costillas cerradas, pelvis neutra, ni metida ni sacada, peso adelantado sobre el metatarso, rotación activa desde la cadera, escápulas abajo y cuello largo.',
      'Full placement: deep core engaged (belly button to spine), ribs closed, neutral pelvis, neither tucked nor tilted, weight forward over the balls of the feet, active turnout from the hips, shoulder blades down and a long neck.')
  },
  fisico: {
    1: d('Tripa dentro y espalda larga en todos los ejercicios. Respira: nunca aguantes el aire.',
      'Tummy in and a long back in every exercise. Breathe: never hold your breath.'),
    2: d('Abdomen activo durante toda la serie. Controla la bajada tanto como la subida.',
      'Core active throughout the set. Control the lowering as much as the lifting.'),
    3: d('Calidad antes que cantidad: si la técnica se rompe, termina la serie. Pelvis estable, abdomen profundo activo y respiración constante.',
      'Quality before quantity: if your form breaks, end the set. Stable pelvis, deep core active and steady breathing.')
  }
};

export const DETAILS = {
  /* ========== TECNICA ========== */
  warmup: {
    1: [d('Muévete suave y sin rebotes.', 'Move gently, no bouncing.')],
    2: [d('Insiste en tobillos y caderas: son las articulaciones que más vas a usar.', 'Focus on ankles and hips: they are the joints you will use most.')],
    3: [d('Añade movilidad de columna y activación de glúteos antes de la barra.', 'Add spine mobility and glute activation before the barre.')]
  },
  posture: {
    1: [
      d('Hombros abajo y hacia atrás, sin sacar pecho.', 'Shoulders down and back, without pushing your chest out.'),
      d('Rodillas estiradas, pero sin empujarlas hacia atrás.', 'Knees straight, but do not push them back.'),
      d('Los dedos de los pies largos y relajados, sin agarrar el suelo.', 'Toes long and relaxed, not gripping the floor.')
    ],
    2: [
      d('Peso ligeramente hacia delante, sobre la parte delantera del pie, sin despegar los talones.', 'Weight slightly forward over the front of the foot, heels still down.'),
      d('Cóccix hacia el suelo: ni metas ni saques la cadera.', 'Tailbone to the floor: neither tuck nor stick out your hips.')
    ],
    3: [
      d('Oreja, hombro, cadera y tobillo en una misma línea vertical.', 'Ear, shoulder, hip and ankle in one vertical line.'),
      d('Si tus rodillas se hiperextienden, no las bloquees hacia atrás: estíralas subiendo los cuádriceps.', 'If your knees hyperextend, do not lock them back: straighten them by lifting the quadriceps.')
    ]
  },
  plie: {
    1: [
      d('Los talones apoyados todo el rato en el demi-plié.', 'Heels stay down the whole time in demi-plié.'),
      d('Las rodillas se abren hacia los dedos pequeños del pie, nunca hacia dentro.', 'Knees open towards your little toes, never inwards.'),
      d('La espalda baja recta, como un ascensor: no te inclines hacia delante.', 'Your back goes down straight like a lift: do not lean forward.')
    ],
    2: [
      d('Reparte el peso entre los dos pies y en los tres puntos de apoyo de cada pie.', 'Share your weight between both feet and across the three points of each foot.'),
      d('Al subir, empuja el suelo y estira las rodillas del todo.', 'On the way up, push the floor away and straighten your knees completely.'),
      d('No saques el culete al bajar: cóccix hacia el suelo.', 'Do not stick your bottom out as you go down: tailbone to the floor.')
    ],
    3: [
      d('La rotación trabaja más cuanto más bajas: no la sueltes en el fondo.', 'Turnout works harder the lower you go: do not release it at the bottom.'),
      d('Misma resistencia al bajar que al subir, en el tempo exacto de la música.', 'Same resistance going down as coming up, exactly in time with the music.')
    ]
  },
  tendu: {
    1: [
      d('El pie sale por el suelo: primero el talón, después el empeine y al final los dedos.', 'The foot slides out along the floor: heel first, then instep, then toes.'),
      d('La rodilla de la pierna que trabaja se estira del todo.', 'The working knee straightens completely.'),
      d('El peso se queda en la pierna de apoyo.', 'Your weight stays on the supporting leg.')
    ],
    2: [
      d('Delante, guía con el talón hacia delante; detrás, guía con los dedos.', 'Front: lead with the heel forward. Back: lead with the toes.'),
      d('La cadera de la pierna que trabaja no sube ni se adelanta.', 'The hip of the working leg does not lift or come forward.'),
      d('Cierra apretando desde la parte interna de los muslos.', 'Close by squeezing from your inner thighs.')
    ],
    3: [
      d('Metatarso y dedos presionan el suelo en la salida y en la entrada.', 'The ball of the foot and toes press the floor going out and coming in.'),
      d('Trabaja los dos acentos: fuera (la punta llega en el tiempo) y dentro (el cierre llega en el tiempo).', 'Work both accents: out (the point arrives on the count) and in (the close arrives on the count).')
    ]
  },
  degage: {
    1: [
      d('Sale como un tendu y solo al final se despega un poco.', 'It goes out like a tendu and only lifts a little at the end.'),
      d('El pie siempre estirado en el aire.', 'Your foot is always pointed in the air.')
    ],
    2: [
      d('Altura baja, unos 25°: la rapidez importa más que la altura.', 'Keep it low, about 25°: speed matters more than height.'),
      d('Cierre limpio en quinta o primera, sin rebotar.', 'A clean close in fifth or first, without bouncing.')
    ],
    3: [
      d('Acento fuera; la pierna de apoyo no se hunde ni se mueve.', 'Accent out; the supporting leg does not sink or move.'),
      d('Detrás, cadera cuadrada: no abras la cadera para subir más.', 'Behind, keep the hips square: do not open the hip to go higher.')
    ]
  },
  rond: {
    1: [
      d('La punta no se despega del suelo en todo el círculo.', 'The toe stays on the floor for the whole circle.'),
      d('El talón de la pierna que trabaja mira hacia delante mientras dibujas.', 'The heel of the working leg faces forward as you draw.')
    ],
    2: [
      d('Pasa por primera con la pierna estirada en cada vuelta.', 'Pass through first with a straight leg on every circle.'),
      d('Las caderas no giran con la pierna.', 'Your hips do not turn with the leg.')
    ],
    3: [
      d('Mantén la rotación máxima en el paso por detrás, donde más se pierde.', 'Keep maximum turnout as you pass behind, where it is most often lost.'),
      d('Tempo continuo: sin pararte delante, al lado ni detrás.', 'Continuous tempo: no stopping front, side or back.')
    ]
  },
  releve: {
    1: [
      d('Sube recto, sin echar el cuerpo hacia delante.', 'Rise straight up without leaning forward.'),
      d('El peso sobre el dedo gordo y el segundo dedo, no hacia el meñique.', 'Weight over the big toe and second toe, not towards the little toe.')
    ],
    2: [
      d('Aprieta la parte interna de los muslos al subir.', 'Squeeze your inner thighs as you rise.'),
      d('Baja pasando por todo el pie, sin dejarte caer.', 'Lower through the whole foot, without dropping.')
    ],
    3: [
      d('En media punta alta, el empeine continúa la línea de la tibia: ni hacia dentro (sickling) ni hacia fuera (winging).', 'On high demi-pointe, the instep continues the line of the shin: neither curving in (sickling) nor out (winging).'),
      d('Sostén el relevé con el abdomen, no con los brazos.', 'Hold the relevé with your core, not your arms.')
    ]
  },
  port: {
    1: [
      d('Codos ligeramente redondeados, sin dejarlos caer.', 'Elbows slightly rounded, never dropping.'),
      d('Dedos juntos y suaves, el pulgar cerca del dedo corazón.', 'Fingers together and soft, thumb near the middle finger.')
    ],
    2: [
      d('La cabeza acompaña: mira la mano al subir y al abrir.', 'Your head goes with it: look at your hand as it rises and opens.'),
      d('Los hombros no suben cuando suben los brazos.', 'Your shoulders do not rise when your arms do.')
    ],
    3: [
      d('Los brazos se mueven desde la espalda, no desde las manos.', 'The arms move from the back, not from the hands.'),
      d('Épaulement: cabeza y hombros giran e inclinan ligeramente según la dirección.', 'Épaulement: head and shoulders turn and tilt slightly with the direction.')
    ]
  },
  'c-releve': {
    1: [d('Mira un punto fijo delante de ti.', 'Look at a fixed point in front of you.')],
    2: [d('Brazos en segunda sin tensión en los hombros ni en el cuello.', 'Arms in second without tension in your shoulders or neck.')],
    3: [d('Encuentra el eje antes de subir; arriba, sigue creciendo.', 'Find your axis before rising; at the top, keep growing.')]
  },
  walk: {
    1: [d('Pasos pequeños sobre la media punta.', 'Small steps on demi-pointe.')],
    2: [d('Rodillas estiradas en cada paso.', 'Straight knees on every step.')],
    3: [d('Pas couru rápido y ligero con el torso quieto.', 'A quick, light pas couru with a still torso.')]
  },
  saute: {
    1: [
      d('Aterriza suave: dedos, planta y talón, y termina en plié.', 'Land softly: toes, sole, heel, finishing in plié.'),
      d('Los talones tocan el suelo al aterrizar.', 'Your heels touch the floor on landing.')
    ],
    2: [
      d('Pies completamente estirados en el aire.', 'Feet fully pointed in the air.'),
      d('El salto nace del empuje del plié, no de los brazos.', 'The jump comes from the push of the plié, not the arms.')
    ],
    3: [
      d('Rodillas estiradas y rotación mantenida en el aire.', 'Straight knees and held turnout in the air.'),
      d('Tronco quieto y arriba: no te inclines al saltar.', 'Torso still and lifted: do not lean as you jump.')
    ]
  },
  bow: {
    1: [d('Muévete despacio y con elegancia.', 'Move slowly and gracefully.')],
    2: [d('La mirada acompaña al brazo.', 'Your eyes follow the arm.')],
    3: [d('La reverencia también es baile: con música, épaulement y calma.', 'The bow is dance too: with music, épaulement and calm.')]
  },
  grandplie: {
    2: [
      d('Espalda recta en todo el recorrido.', 'A straight back all the way down.'),
      d('En segunda, los talones no se despegan nunca.', 'In second, the heels never lift.'),
      d('Sin pausa abajo: baja y sube de forma continua.', 'No pause at the bottom: go down and up continuously.')
    ],
    3: [
      d('En primera y quinta, los talones se despegan lo más tarde posible y vuelven lo antes posible.', 'In first and fifth, the heels lift as late as possible and return as early as possible.'),
      d('No te sientes sobre los talones: la cadera queda por encima de las rodillas.', 'Do not sit on your heels: your hips stay above your knees.')
    ]
  },
  fondu: {
    2: [
      d('La rodilla de apoyo baja sobre la dirección del pie.', 'The supporting knee bends over the line of the foot.'),
      d('Las dos piernas se estiran a la vez.', 'Both legs straighten at the same time.')
    ],
    3: [
      d('Cou-de-pied envolvente y limpio, con el talón adelantado.', 'A clean, wrapped cou-de-pied with the heel forward.'),
      d('La pierna de trabajo mantiene la altura mientras la de apoyo se estira.', 'The working leg keeps its height while the supporting leg straightens.')
    ]
  },
  grandbatt: {
    2: [
      d('Caderas niveladas: la cadera de la pierna que sube no se levanta.', 'Level hips: the hip of the working leg does not hitch up.'),
      d('Delante, el torso no se echa hacia atrás.', 'To the front, your torso does not lean back.')
    ],
    3: [
      d('Pasa por tendu al subir y al bajar.', 'Pass through tendu going up and coming down.'),
      d('La rodilla de apoyo estirada y el talón pegado al suelo.', 'The supporting knee straight and the heel on the floor.')
    ]
  },
  sousus: {
    2: [
      d('Tripa dentro al subir: te ayuda a juntar las piernas.', 'Tummy in as you rise: it helps you bring the legs together.'),
      d('Arriba, el talón de delante se adelanta y los muslos se cruzan.', 'At the top, the front heel comes forward and the thighs cross.')
    ]
  },
  echappe: {
    2: [
      d('Los dos pies se abren a la vez y a la misma distancia.', 'Both feet open at the same time and the same distance.'),
      d('Rodillas estiradas en el relevé.', 'Straight knees on the relevé.')
    ]
  },
  changement: {
    2: [
      d('Los pies cambian en el aire, no al aterrizar.', 'The feet change in the air, not on landing.'),
      d('Aterriza en una quinta limpia, en plié.', 'Land in a clean fifth, in plié.')
    ]
  },
  pirprep: {
    2: [
      d('Sube directo a retiré: la punta pasa por el tobillo y llega delante de la rodilla.', 'Rise straight to retiré: the toe passes the ankle and arrives in front of the knee.'),
      d('Brazos cerrados en primera, a la altura del diafragma.', 'Arms closed in first, at diaphragm height.'),
      d('Tripa dentro y costillas cerradas: sin eso no hay equilibrio.', 'Tummy in and ribs closed: without it there is no balance.')
    ],
    3: [d('La rodilla del retiré se mantiene abierta a la segunda, a la altura de la cadera o por debajo.', 'The retiré knee stays open to the side, at or below hip level.')]
  },
  develop: {
    2: [
      d('Pasa por retiré con la rodilla abierta.', 'Pass through retiré with the knee open.'),
      d('Estira la pierna sin que suba la cadera.', 'Unfold the leg without hitching the hip.')
    ],
    3: [
      d('Mantén la rodilla a la altura alcanzada mientras se estira la pierna: no la bajes para estirar.', 'Keep the knee at its height while the leg unfolds: do not lower it to straighten.'),
      d('Al lado, el talón mira hacia delante y la rotación sigue activa.', 'To the side, the heel faces forward and turnout stays active.')
    ]
  },
  pirouette: {
    2: [
      d('Vista: la cabeza mira el punto y gira la última.', 'Spotting: your head looks at the point and turns last.'),
      d('Retiré con la rodilla abierta a la segunda.', 'Retiré with the knee open to the side.'),
      d('El eje se sostiene desde el centro: tripa dentro y costillas cerradas.', 'Your axis is held from your centre: tummy in and ribs closed.')
    ],
    3: [d('Termina controlando: el final de la pirueta es parte de la pirueta.', 'Finish under control: the ending of the pirouette is part of the pirouette.')]
  },
  valse: {
    2: [
      d('Primer tiempo en plié hacia el lado; los otros dos en media punta.', 'First count in plié to the side; the other two on demi-pointe.'),
      d('Torso y cabeza acompañan el balanceo.', 'Torso and head go with the sway.')
    ]
  },
  pasdebourree: {
    2: [d('Pasos pequeños y rápidos con las rodillas estiradas en media punta.', 'Small, quick steps with straight knees on demi-pointe.')]
  },
  allegro: {
    2: [
      d('Aterriza siempre en plié, pasando por todo el pie.', 'Always land in plié, rolling through the whole foot.'),
      d('Pies estirados en el aire en cada salto.', 'Feet pointed in the air on every jump.')
    ]
  },
  retrel: {
    2: [
      d('En el retiré, la punta toca justo delante de la rodilla, sin presionarla.', 'In retiré, the toe touches just in front of the knee without pressing it.'),
      d('Pierna de apoyo estirada del todo en el relevé.', 'Supporting leg fully straight on the relevé.')
    ]
  },

  /* ---------- nivel avanzado ---------- */
  'b3-plie': {
    3: [
      d('En el cambré atrás, alarga la espalda hacia arriba antes de arquear: el arco empieza en la parte alta de la espalda.', 'In the backbend, lengthen upwards before arching: the curve starts in the upper back.'),
      d('Durante el cambré, la pelvis se queda encima de los pies; no empujes la cadera hacia delante.', 'During the cambré your pelvis stays over your feet; do not push your hips forward.'),
      d('Balance en quinta: talones adelantados hacia el público y muslos cruzados.', 'Balance in fifth: heels forward towards the audience and thighs crossed.')
    ]
  },
  'b3-tendu': {
    3: [
      d('En el plié de la cuarta, el peso se reparte entre las dos piernas y vuelve entero a la de apoyo al estirar.', 'In the fourth-position plié, weight is shared between both legs and returns fully to the supporting leg as you stretch.'),
      d('A doble velocidad el pie sigue pasando por todo el suelo: sin atajos.', 'At double speed the foot still passes through the floor: no shortcuts.')
    ]
  },
  'b3-degage': {
    3: [
      d('En los piqués, la punta rebota sin descargar peso y la pierna sigue estirada.', 'In the piqués, the toe rebounds without taking weight and the leg stays straight.'),
      d('En cloche, el torso compensa lo mínimo: la pierna se mueve, el cuerpo no.', 'In cloche, the torso compensates as little as possible: the leg moves, the body does not.')
    ]
  },
  'b3-rond': {
    3: [
      d('En el rond en l\'air, el muslo no se mueve: solo dibuja el óvalo la parte de debajo de la rodilla.', 'In rond en l\'air the thigh does not move: only the lower leg draws the oval.'),
      d('En el grand rond, la pierna pasa por la segunda sin perder altura y la cadera no se levanta.', 'In grand rond, the leg passes through second without losing height and the hip does not hitch.')
    ]
  },
  'b3-fondu': {
    3: [
      d('El relevé llega a la vez que la extensión, no antes ni después.', 'The relevé arrives with the extension, not before or after.'),
      d('A 90°, la pierna se sostiene con los músculos de debajo del muslo, no subiendo la cadera.', 'At 90°, the leg is held by the muscles under the thigh, not by hitching the hip.')
    ]
  },
  frappe: {
    3: [
      d('El acento va hacia fuera: el pie golpea el aire, no la pierna de apoyo.', 'The accent is outwards: the foot strikes the air, not the supporting leg.'),
      d('La punta roza el suelo en la salida: suena un pequeño toque.', 'The toe brushes the floor on the way out: you hear a small tap.')
    ]
  },
  petitbatt: {
    3: [
      d('Rodilla quieta y abierta; el movimiento sale solo de la parte baja de la pierna.', 'Knee still and open; the movement comes only from the lower leg.'),
      d('En relevé, el tobillo de apoyo no se tuerce aunque la otra pierna vaya rápida.', 'On relevé, the supporting ankle does not roll even though the other leg is fast.')
    ]
  },
  'b3-adagio': {
    3: [
      d('Sube la pierna manteniendo la cadera abajo: la altura sale de la fuerza, no de desplazar la pelvis.', 'Lift the leg with the hip kept down: height comes from strength, not from shifting the pelvis.'),
      d('Al soltar la barra, el eje ya estaba colocado: no se nota el momento en que la sueltas.', 'When you let go of the barre, your axis was already set: no one should notice the moment you let go.'),
      d('En attitude derrière, la rodilla queda más alta que el pie.', 'In attitude derrière, the knee is higher than the foot.')
    ]
  },
  'b3-grandbatt': {
    3: [
      d('En cloche, pasa por primera con los dos talones en línea y la pierna estirada.', 'In cloche, pass through first with both heels aligned and a straight leg.'),
      d('En el relevé, la pierna de apoyo sube a la vez que se lanza la otra.', 'On the relevé, the supporting leg rises as the other is thrown.')
    ]
  },
  'c3-adagio': {
    3: [
      d('Croisé y écarté se leen desde el público: comprueba la diagonal del cuerpo, no solo la de la pierna.', 'Croisé and écarté read from the audience: check the diagonal of your body, not just your leg.'),
      d('En la promenade, el talón de apoyo gira por pequeños desplazamientos sin perder la rotación.', 'In the promenade, the supporting heel turns in small shifts without losing turnout.')
    ]
  },
  dblpir: {
    3: [
      d('En la cuarta de preparación, el peso está más sobre la pierna de delante y los hombros van cuadrados.', 'In the fourth-position preparation, weight is mostly on the front leg and the shoulders are square.'),
      d('Brazos cerrados en primera, a la altura del diafragma, y codos sostenidos: no abras los brazos para girar más.', 'Arms closed in first at diaphragm height, elbows held: do not open the arms to turn more.'),
      d('En cada vuelta la cabeza encuentra el punto antes que el cuerpo.', 'On each turn your head finds the spot before the body.')
    ]
  },
  pirdedans: {
    3: [
      d('La pierna de trabajo pasa por la segunda y llega a retiré a la vez que subes, no después.', 'The working leg passes through second and reaches retiré as you rise, not after.'),
      d('Giras hacia la pierna de apoyo: la cadera de apoyo no se abre hacia atrás.', 'You turn towards the supporting leg: the supporting hip does not swing back.')
    ]
  },
  chaines: {
    3: [
      d('Piernas juntas y estiradas: cada medio giro cae sobre un pie en media punta.', 'Legs together and straight: each half turn lands on one foot on demi-pointe.'),
      d('Los brazos se abren y se cierran poco; la cabeza marca el final de la diagonal.', 'The arms open and close only slightly; the head spots the end of the diagonal.')
    ]
  },
  fouette: {
    3: [
      d('La pierna que se abre llega a 45° a la segunda, no más baja ni más alta, y siempre a la misma altura.', 'The opening leg reaches 45° to the side, not lower or higher, and always at the same height.'),
      d('El talón de apoyo baja en cada plié y vuelve a subir: no te quedes en media punta todo el rato.', 'The supporting heel lowers in every plié and rises again: do not stay on demi-pointe throughout.'),
      d('La tripa y el eje mandan: si te desplazas por la sala, frena y vuelve a la preparación sin giro.', 'Core and axis come first: if you travel across the room, stop and go back to the non-turning preparation.')
    ]
  },
  'p3-allegro': {
    3: [
      d('Para batir, las piernas se abren un poco antes de cruzarse: si no abren, no baten.', 'To beat, the legs open slightly before crossing: if they do not open, they cannot beat.'),
      d('El batido se hace con los muslos y las pantorrillas, no solo con los pies.', 'The beat comes from the thighs and calves, not just the feet.'),
      d('Aterrizaje siempre en quinta limpia, en plié y en silencio.', 'Always land in a clean fifth, in plié and quietly.')
    ]
  },
  sissonne: {
    3: [
      d('La sissonne sale de dos pies a la vez: las dos piernas empujan juntas.', 'The sissonne takes off from both feet together: both legs push at once.'),
      d('En la ouverte, la pierna libre se queda en la altura exacta al aterrizar.', 'In the ouverte, the free leg stays at the exact height on landing.')
    ]
  },
  pasdechat: {
    3: [d('Las dos rodillas abiertas a la segunda en el aire, un instante a la vez.', 'Both knees open to the side in the air, for an instant together.')]
  },
  grandjete: {
    3: [
      d('La pierna de delante se lanza estirada (grand battement), no se dobla y se estira.', 'The front leg is thrown straight (grand battement), it does not bend then straighten.'),
      d('Busca el punto más alto del salto con el torso arriba y los hombros abajo.', 'Find the highest point of the jump with the torso lifted and shoulders down.'),
      d('Aterriza en plié por la punta y el talón, con la pierna de atrás aún en arabesque.', 'Land in plié through toe and heel, the back leg still in arabesque.')
    ]
  },
  variation: {
    3: [
      d('Une los pasos: la salida de uno es la preparación del siguiente.', 'Join the steps: the end of one is the preparation for the next.'),
      d('Cara, mirada y brazos cuentan una intención; no es solo técnica.', 'Face, gaze and arms express an intention; it is not only technique.')
    ]
  },

  /* ========== FISICO ========== */
  heel: {
    1: [d('Tobillos rectos: el peso sobre el dedo gordo y el segundo.', 'Straight ankles: weight over the big and second toes.')],
    2: [d('Baja en 3 segundos, más despacio de lo que subes.', 'Lower over 3 seconds, slower than you rise.')]
  },
  squat: {
    1: [d('Rodillas sobre los pies, espalda larga.', 'Knees over your feet, long back.')],
    2: [d('El peso en los talones y en el centro del pie.', 'Weight on the heels and the middle of the foot.')]
  },
  bridge: {
    1: [d('Aprieta los glúteos para subir, no arquees la espalda.', 'Squeeze your glutes to lift; do not arch your back.')],
    2: [d('Las rodillas no se abren ni se cierran al subir.', 'Your knees do not fall in or out as you lift.')]
  },
  plank: {
    1: [d('Tripa dentro: la espalda no se hunde.', 'Tummy in: your back does not sag.')],
    2: [d('Empuja el suelo con los antebrazos: las escápulas no se juntan.', 'Push the floor away with your forearms: shoulder blades do not pinch.')]
  },
  balance: {
    1: [d('Pie de apoyo con los tres puntos en el suelo.', 'Standing foot with all three points on the floor.')],
    2: [d('Suelta la pared unos segundos si puedes.', 'Let go of the wall for a few seconds if you can.')]
  },
  deadbug: {
    1: [d('La zona lumbar pegada al suelo todo el rato.', 'Lower back stays on the floor the whole time.')]
  },
  heel1: {
    2: [d('El tobillo sube recto, sin torcerse hacia fuera.', 'The ankle rises straight, without rolling out.')]
  },
  pliesquat: {
    2: [d('Rodillas sobre el segundo dedo del pie y cóccix hacia el suelo.', 'Knees over the second toe, tailbone to the floor.')]
  },
  plankfull: {
    2: [d('Cabeza, cadera y talones en línea; respira.', 'Head, hips and heels in a line; breathe.')]
  },
  sideplank: {
    2: [d('La cadera no cae hacia el suelo.', 'Your hip does not drop towards the floor.')]
  },
  bridge1: {
    2: [d('Las caderas suben niveladas, sin inclinarse.', 'Hips rise level, without tipping.')]
  },
  superman: {
    2: [d('Mira al suelo: el cuello sigue largo.', 'Look at the floor: your neck stays long.')]
  },
  hops: {
    2: [d('Aterriza en silencio sobre la parte delantera del pie.', 'Land quietly on the front of the foot.')]
  },
  calfecc: {
    3: [d('5 segundos de bajada y tobillo recto de principio a fin.', '5 seconds on the way down and a straight ankle from start to finish.')]
  },
  pistol: {
    3: [d('Rodilla sobre el segundo dedo y pelvis nivelada.', 'Knee over the second toe and a level pelvis.')]
  },
  hollow: {
    3: [d('Lumbar pegada al suelo; si se despega, dobla las rodillas.', 'Lower back pressed down; if it lifts, bend your knees.')]
  },
  teaser: {
    3: [d('Baja y sube vértebra a vértebra, sin impulso.', 'Roll down and up vertebra by vertebra, without momentum.')]
  },
  sidelift: {
    3: [d('La cadera de arriba no rueda hacia atrás al subir.', 'The top hip does not roll back as you lift.')]
  },
  archlift: {
    3: [d('Las dos caderas se quedan en el suelo.', 'Both hips stay on the floor.')]
  },
  band: {
    3: [d('Tobillo, empeine y dedos, en ese orden; los dedos se alargan.', 'Ankle, instep and toes, in that order; the toes lengthen.')]
  },
  plyo: {
    3: [d('Última serie igual de limpia que la primera; si no, para.', 'Last set as clean as the first; if not, stop.')]
  },
  legholds: {
    3: [d('Cadera abajo y rotación activa aunque la pierna baje un poco.', 'Hip down and turnout active, even if the leg drops a little.')]
  },
  splits: {
    3: [d('Caderas cuadradas y sin rebotes.', 'Square hips and no bouncing.')]
  }
};

/* Indicacion para cualquier estiramiento. */
export const STRETCH_CUE = d('Estira hasta notar una tensión suave, nunca dolor. Respira hondo y suelta un poco más al soltar el aire.',
  'Stretch until you feel gentle tension, never pain. Breathe deeply and release a little more as you breathe out.');
export const STRETCH_IDS = ['neck', 'butterfly', 'fold', 'quad', 'cobra', 'child', 'feet', 'lunge', 'hamstring', 'stretch'];

/* Detalles para un ejercicio y nivel: el nivel exacto o el inferior mas cercano. */
export function detailsFor(id, level) {
  const byLevel = DETAILS[id];
  if (!byLevel) return STRETCH_IDS.includes(id) ? [STRETCH_CUE] : [];
  for (let l = level; l >= 1; l--) if (byLevel[l]) return byLevel[l];
  const up = Object.keys(byLevel).map(Number).sort((a, b) => a - b)[0];
  return byLevel[up] || [];
}
