/* ------------------------------------------------------------------
   NIVEL 3 · AVANZADO: combinaciones (enchaînements) de barra y centro,
   giros, batterie, grand allegro y preparacion fisica exigente.
   Pensado para bailarinas y bailarines con muchos anos de clase.
   ------------------------------------------------------------------ */
const E = (id, bpm, anim, name, steps, tip) => ({
  id, dur: 180, bpm, anim, adv: true,
  name: { es: name[0], en: name[1] },
  steps: { es: steps[0], en: steps[1] },
  tip: { es: tip[0], en: tip[1] }
});

export const ADV_EXERCISES = [
  /* ================= BARRA ================= */
  E('b3-plie', 56, 'cambre', ['Pliés con port de bras y cambré', 'Pliés with port de bras and cambré'], [[
    'Primera: 2 demi-pliés (2 tiempos cada uno) y 1 grand plié (4 tiempos). Port de bras al frente con la cabeza siguiendo la mano.',
    'Repite en segunda, cuarta y quinta. En segunda el grand plié se hace sin despegar los talones.',
    'Tras cada posición, cambré hacia delante y hacia atrás en 8 tiempos, con la espalda alargándose antes de arquearse.',
    'Termina con un relevé en quinta, balance soltando la barra, 4 tiempos, y cierra en demi-plié.'
  ], [
    'First: 2 demi-pliés (2 counts each) and 1 grand plié (4 counts). Port de bras forward with the head following the hand.',
    'Repeat in second, fourth and fifth. In second, the grand plié keeps the heels down.',
    'After each position, cambré forward and back over 8 counts, lengthening the spine before it arches.',
    'Finish with a relevé in fifth, balance off the barre for 4 counts and close in demi-plié.'
  ]], ['El grand plié no se "cae" abajo: la resistencia en la bajada es igual que en la subida.', 'Do not drop into the grand plié: the resistance going down equals the resistance coming up.']),
  E('b3-tendu', 88, 'tendu', ['Tendus en croix con plié y relevé', 'Tendus en croix with plié and relevé'], [[
    'Desde quinta: tendu delante, cierra; tendu con demi-plié en la cuarta abierta, estira y cierra. 4 tiempos.',
    'Repite al lado, detrás y al lado (en croix), 16 tiempos en total.',
    'Segunda frase a doble velocidad: 3 tendus rápidos y un relevé en quinta en cada dirección.',
    'Termina con tendu a la segunda, relevé de la pierna de apoyo y balance con los brazos en quinta (en haut).'
  ], [
    'From fifth: tendu front, close; tendu with demi-plié in open fourth, stretch and close. 4 counts.',
    'Repeat to the side, back and side (en croix), 16 counts in total.',
    'Second phrase at double speed: 3 quick tendus and a relevé in fifth in each direction.',
    'Finish with tendu à la seconde, relevé on the supporting leg and balance with arms in fifth (en haut).'
  ]], ['El cierre en quinta es tan importante como la salida: talón delante, cruzado y apretado.', 'The close into fifth matters as much as the exit: heel forward, crossed and pressed.']),
  E('b3-degage', 96, 'degage', ['Dégagés con piqué y en cloche', 'Dégagés with piqué and en cloche'], [[
    'Dégagés en croix: 3 dégagés a 25° y cierre, 4 tiempos por dirección.',
    'Piqués: desde el dégagé, la punta pica el suelo 3 veces sin descargar peso y cierra.',
    'En cloche: la pierna pasa por primera como una campana, delante y detrás, 8 veces.',
    'Termina con passé en relevé y balance de 4 tiempos.'
  ], [
    'Dégagés en croix: 3 dégagés at 25° and close, 4 counts per direction.',
    'Piqués: from the dégagé, the toe taps the floor 3 times without taking weight, then closes.',
    'En cloche: the leg swings through first like a bell, front and back, 8 times.',
    'Finish with passé on relevé and a 4-count balance.'
  ]], ['En cloche la cadera no acompaña a la pierna: el torso queda quieto.', 'In en cloche the hip does not follow the leg: the torso stays still.']),
  E('b3-rond', 60, 'enlair', ['Rond de jambe à terre y en l\'air', 'Rond de jambe à terre and en l\'air'], [[
    'Preparación en demi-plié y 4 ronds de jambe à terre en dehors, 4 en dedans.',
    'Pierna a la segunda a 45° y 4 ronds de jambe en l\'air: el muslo quieto, solo dibuja el óvalo la parte baja de la pierna.',
    'Grand rond de jambe en l\'air (a 90°) de delante hacia atrás pasando por la segunda, 4 tiempos, y a la inversa.',
    'Cambré hacia atrás con la pierna en tendu delante (port de bras en fondu si lo dominas) y balance en attitude.'
  ], [
    'Prepare in demi-plié and do 4 ronds de jambe à terre en dehors, 4 en dedans.',
    'Leg à la seconde at 45° and 4 ronds de jambe en l\'air: the thigh stays still, only the lower leg draws the oval.',
    'Grand rond de jambe en l\'air (at 90°) front to back through second, 4 counts, then reverse.',
    'Cambré back with the leg in tendu front (port de bras in fondu if you master it) and balance in attitude.'
  ]], ['En el rond en l\'air el óvalo siempre toca la pantorrilla de apoyo a la altura de la rodilla o por debajo.', 'In rond en l\'air the oval always comes back to the supporting calf, at or below knee height.']),
  E('b3-fondu', 60, 'fondu', ['Fondus a 90° en relevé', 'Fondus at 90° on relevé'], [[
    'Fondu delante a 45°, cierra en cou-de-pied; fondu al lado con relevé de la pierna de apoyo.',
    'Repite en croix, 4 tiempos cada uno, acabando en media punta en cada extensión.',
    'Segunda frase a 90°: fondu, relevé, demi-plié en la extensión y vuelta a cou-de-pied.',
    'Termina con un développé a la segunda en relevé y balance de 4 tiempos.'
  ], [
    'Fondu front at 45°, close to cou-de-pied; fondu to the side with relevé on the supporting leg.',
    'Repeat en croix, 4 counts each, ending on demi-pointe in every extension.',
    'Second phrase at 90°: fondu, relevé, demi-plié in the extension and back to cou-de-pied.',
    'Finish with a développé à la seconde on relevé and a 4-count balance.'
  ]], ['Las dos rodillas se estiran exactamente a la vez, ni antes ni después.', 'Both knees straighten at exactly the same moment, not before or after.']),
  E('frappe', 104, 'frappe', ['Frappés simples y dobles', 'Single and double frappés'], [[
    'Pie flexionado o estirado en cou-de-pied, según tu escuela, delante del tobillo.',
    'Frappé: el pie sale con acento hacia fuera, la punta roza el suelo y queda estirada a 25°. El acento es hacia fuera, no hacia dentro.',
    'Frappés dobles: el pie bate delante y detrás del tobillo antes de salir.',
    'En croix: 3 frappés simples y 1 doble por dirección. Termina en relevé.'
  ], [
    'Foot flexed or pointed at cou-de-pied, depending on your school, in front of the ankle.',
    'Frappé: the foot strikes outwards, the toe brushes the floor and stays pointed at 25°. The accent is out, not in.',
    'Double frappés: the foot beats front and back of the ankle before going out.',
    'En croix: 3 single frappés and 1 double per direction. Finish on relevé.'
  ]], ['Solo trabaja de la rodilla hacia abajo: el muslo no se mueve.', 'Only the leg below the knee works: the thigh does not move.']),
  E('petitbatt', 120, 'petitbatt', ['Petits battements sur le cou-de-pied', 'Petits battements sur le cou-de-pied'], [[
    'Pie en cou-de-pied envolvente, rodilla abierta a la segunda y quieta.',
    'Bate el pie delante y detrás del tobillo muy rápido, con acento delante.',
    '8 tiempos con acento delante, 8 con acento detrás, 8 en relevé.',
    'Termina con balance en cou-de-pied y cierra en quinta.'
  ], [
    'Foot in wrapped cou-de-pied, knee open to the side and still.',
    'Beat the foot front and back of the ankle very fast, accenting the front.',
    '8 counts accenting front, 8 accenting back, 8 on relevé.',
    'Finish with a balance in cou-de-pied and close in fifth.'
  ]], ['Rapidez sin tensión: el tobillo suelto, la rodilla inmóvil.', 'Speed without tension: loose ankle, motionless knee.']),
  E('b3-adagio', 50, 'adagio', ['Adagio de barra', 'Barre adagio'], [[
    'Développé delante a 90° o más en 4 tiempos, mantén 2, baja en 2. Repite al lado y detrás (en arabesque).',
    'Développé a la segunda con relevé, mantén la pierna y suelta la barra 4 tiempos.',
    'Pasa la pierna de la segunda a la arabesque en grand rond lento, sin bajar la altura.',
    'Termina con cambré lateral hacia la barra y hacia fuera, y balance en attitude derrière.'
  ], [
    'Développé front to 90° or higher over 4 counts, hold 2, lower 2. Repeat to the side and back (in arabesque).',
    'Développé à la seconde with relevé, hold the leg and let go of the barre for 4 counts.',
    'Take the leg from second to arabesque in a slow grand rond without losing height.',
    'Finish with a side cambré towards and away from the barre, and a balance in attitude derrière.'
  ]], ['La altura sale de la fuerza de debajo del muslo, no de subir la cadera.', 'Height comes from the strength under the thigh, not from hitching the hip.']),
  E('b3-grandbatt', 88, 'grandbatt', ['Grand battement en croix y en cloche', 'Grand battement en croix and en cloche'], [[
    '2 grands battements por dirección pasando por tendu, en croix, 16 tiempos.',
    'Grand battement en cloche: delante y detrás pasando por primera, 8 veces.',
    'Grand battement con relevé en la pierna de apoyo en cada lanzamiento (4 a la segunda).',
    'Termina en quinta, relevé, y cierra en demi-plié.'
  ], [
    '2 grands battements per direction through tendu, en croix, 16 counts.',
    'Grand battement en cloche: front and back through first, 8 times.',
    'Grand battement with relevé on the supporting leg on every throw (4 to the side).',
    'Finish in fifth, relevé, and close in demi-plié.'
  ]], ['La pierna sube con impulso y baja con control, marcando el tendu antes de cerrar.', 'The leg goes up with impulse and comes down with control, showing the tendu before closing.']),

  /* ================= CENTRO ================= */
  E('c3-adagio', 50, 'adagio', ['Adagio en el centro', 'Centre adagio'], [[
    'Desde quinta croisé: développé croisé devant a 90°, plié, y pas de bourrée a la otra diagonal.',
    'Développé écarté, mantén 2 tiempos, y lleva la pierna a arabesque (primera arabesque) por la segunda.',
    'Promenade lenta en arabesque o attitude (un cuarto de vuelta) si la dominas; si no, balance en arabesque.',
    'Termina con una pirueta en dehors desde cuarta y cierra en quinta, brazos en bajo.'
  ], [
    'From fifth croisé: développé croisé devant to 90°, plié, and pas de bourrée to the other diagonal.',
    'Développé écarté, hold 2 counts, and take the leg through second into arabesque (first arabesque).',
    'Slow promenade in arabesque or attitude (a quarter turn) if you master it; if not, balance in arabesque.',
    'Finish with a pirouette en dehors from fourth and close in fifth, arms low.'
  ]], ['En el adagio los brazos respiran con la música: nunca llegan antes que la pierna.', 'In adagio the arms breathe with the music: they never arrive before the leg.']),
  E('dblpir', 60, 'dblpir', ['Pirueta doble en dehors', 'Double pirouette en dehors'], [[
    'Preparación en cuarta: pierna de delante en demi-plié, la de atrás estirada y el peso sobre la de delante; brazos en tercera.',
    'Empuja el suelo con las dos piernas a la vez y sube directo a retiré en relevé; los brazos cierran en primera.',
    'Usa la vista dos veces: la cabeza gira la última y encuentra el punto antes que el cuerpo.',
    'Termina en cuarta detrás o en quinta, en demi-plié controlado. Haz 4 por lado; si pierdes el eje, vuelve a la simple.'
  ], [
    'Preparation in fourth: front leg in demi-plié, back leg straight, weight over the front leg; arms in third.',
    'Push the floor with both legs at once and rise straight into retiré on relevé; the arms close in first.',
    'Spot twice: the head turns last and finds the point before the body.',
    'Finish in fourth behind or in fifth, in a controlled demi-plié. Do 4 per side; if you lose your axis, go back to singles.'
  ]], ['El giro no sale de los brazos ni de los hombros: sale del empuje de las piernas y del eje.', 'The turn does not come from the arms or shoulders: it comes from the push of the legs and your axis.']),
  E('pirdedans', 60, 'pirdedans', ['Pirueta en dedans', 'Pirouette en dedans'], [[
    'Preparación en cuarta con la pierna de delante en plié; la de atrás estirada o en tendu à la seconde.',
    'La pierna de trabajo pasa por la segunda a retiré mientras subes a relevé sobre la de delante.',
    'Giras hacia la pierna de apoyo. Brazos: uno abre y los dos cierran juntos en primera.',
    'Cierra en quinta detrás. Empieza con simples y pasa a dobles solo si la simple está limpia.'
  ], [
    'Preparation in fourth with the front leg in plié; back leg straight or in tendu à la seconde.',
    'The working leg passes through second to retiré as you rise to relevé on the front leg.',
    'You turn towards the supporting leg. Arms: one opens and both close together in first.',
    'Close in fifth behind. Start with singles and go to doubles only when the single is clean.'
  ]], ['No gires el hombro antes de tiempo: el torso llega de frente al retiré.', 'Do not turn the shoulder early: the torso arrives square to the retiré.']),
  E('chaines', 0, 'chaines', ['Chaînés y piqués en diagonal', 'Chaînés and piqués on the diagonal'], [[
    'Necesitas unos 4 metros libres en diagonal y un suelo que no resbale. Si no los tienes, hazlos en el sitio a media velocidad.',
    'Chaînés: pies juntos en relevé, medio giro con cada pie, sin separar las piernas. La vista marca el final de la diagonal.',
    'Piqués en dedans: pica sobre la pierna estirada directo a relevé, la otra a retiré, y gira hacia la pierna de apoyo.',
    '8 chaînés y 4 piqués por lado. Termina en cuarta, en plié y con los brazos abiertos.'
  ], [
    'You need about 4 metres of clear diagonal and a non-slip floor. If you do not have them, do them on the spot at half speed.',
    'Chaînés: feet together on relevé, half a turn on each foot, legs not separating. Spot the end of the diagonal.',
    'Piqués en dedans: step straight onto a straight leg on relevé, the other to retiré, and turn towards the supporting leg.',
    '8 chaînés and 4 piqués per side. Finish in fourth, in plié, arms open.'
  ]], ['Si te mareas, para, mira un punto fijo y respira antes de seguir.', 'If you get dizzy, stop, look at a fixed point and breathe before continuing.']),
  E('fouette', 72, 'fouette', ['Preparación de fouettés', 'Fouetté preparation'], [[
    'Sin girar: en demi-plié sobre la pierna de apoyo, la otra se abre al frente y a la segunda a 45°.',
    'La pierna de trabajo se recoge a retiré mientras subes a relevé. Plié, abre, relevé, retiré: 8 veces seguidas.',
    'Añade un cuarto de vuelta en cada relevé, después media vuelta. Solo cuando esté limpio, intenta un fouetté completo.',
    'Descansa entre series. No los hagas cansada o cansado ni en un suelo que resbale.'
  ], [
    'Without turning: in demi-plié on the supporting leg, the other opens front then to second at 45°.',
    'The working leg whips into retiré as you rise to relevé. Plié, open, relevé, retiré: 8 times in a row.',
    'Add a quarter turn on each relevé, then a half turn. Only when it is clean, try a full fouetté.',
    'Rest between sets. Do not do them when tired or on a slippery floor.'
  ]], ['El plié de cada fouetté es el motor: si no bajas, no giras.', 'The plié in each fouetté is the engine: no plié, no turn.']),
  E('p3-allegro', 88, 'entrechat', ['Petit allegro con batterie', 'Petit allegro with batterie'], [[
    'Glissade, assemblé, glissade, assemblé; 3 changements y royale (changement batido). 8 tiempos por frase.',
    'Entrechat quatre: desde quinta, las piernas se cruzan dos veces en el aire y aterrizas en la misma quinta.',
    'Échappé sauté a la segunda y cierra con entrechat quatre, 4 veces.',
    'Termina con 8 sautés en primera y 8 en quinta sin parar, y un plié de recepción largo.'
  ], [
    'Glissade, assemblé, glissade, assemblé; 3 changements and a royale (beaten changement). 8 counts per phrase.',
    'Entrechat quatre: from fifth, the legs cross twice in the air and you land in the same fifth.',
    'Échappé sauté to second and close with entrechat quatre, 4 times.',
    'Finish with 8 sautés in first and 8 in fifth without stopping, and a long landing plié.'
  ]], ['Para batir hay que abrir: las piernas se separan un poco antes de cruzarse.', 'To beat you must open: the legs separate slightly before crossing.']),
  E('sissonne', 80, 'sissonne', ['Sissonnes fermées y ouvertes', 'Sissonnes fermées and ouvertes'], [[
    'Sissonne fermée: desde quinta en plié, salta abriendo las piernas en tijera y aterriza sobre una con la otra cerrando a quinta enseguida.',
    'Sissonne ouverte: igual, pero la pierna libre se queda abierta a 45° o a 90° al aterrizar.',
    'Combinación: 2 fermées de lado, 1 ouverte en arabesque y pas de bourrée. Repite al otro lado.',
    'Aterriza siempre por la punta y el metatarso hasta el talón, en plié.'
  ], [
    'Sissonne fermée: from fifth in plié, jump opening the legs like scissors and land on one with the other closing to fifth straight away.',
    'Sissonne ouverte: the same, but the free leg stays open at 45° or 90° on landing.',
    'Combination: 2 fermées to the side, 1 ouverte in arabesque and pas de bourrée. Repeat to the other side.',
    'Always land through the toes and ball of the foot to the heel, in plié.'
  ]], ['Las dos piernas salen del suelo a la vez: la sissonne nace de dos pies.', 'Both legs leave the floor together: a sissonne takes off from two feet.']),
  E('pasdechat', 80, 'pasdechat', ['Pas de chat', 'Pas de chat'], [[
    'Desde quinta, la pierna de atrás sube a retiré y saltas; en el aire la otra también sube a retiré.',
    'Las dos rodillas abiertas a la vez, un instante, como un gato que salta.',
    'Aterriza sobre la primera pierna y cierra la segunda en quinta delante, en plié.',
    '4 por lado con un pas de bourrée entre medias.'
  ], [
    'From fifth, the back leg lifts to retiré and you jump; in the air the other also lifts to retiré.',
    'Both knees open at once for an instant, like a jumping cat.',
    'Land on the first leg and close the second into fifth front, in plié.',
    '4 per side with a pas de bourrée in between.'
  ]], ['El torso se queda arriba y tranquilo: las piernas hacen el trabajo.', 'The torso stays lifted and calm: the legs do the work.']),
  E('grandjete', 0, 'grandjete', ['Grand allegro: grand jeté', 'Grand allegro: grand jeté'], [[
    'Solo con espacio amplio (unos 5 metros) y suelo adecuado. Si no lo tienes, practica la preparación en el sitio.',
    'Preparación: pas couru o glissade, y lanza la pierna de delante estirada (grand battement) mientras empujas con la de atrás.',
    'En el aire las dos piernas buscan el espagat, con el torso arriba y los brazos en arabesque.',
    'Aterriza sobre la pierna de delante en plié, con la de atrás en arabesque. 4 por lado.'
  ], [
    'Only with plenty of space (about 5 metres) and a suitable floor. If not, practise the preparation on the spot.',
    'Preparation: pas couru or glissade, then throw the front leg straight (grand battement) as you push off the back leg.',
    'In the air both legs reach for the split, torso lifted and arms in arabesque.',
    'Land on the front leg in plié, with the back leg in arabesque. 4 per side.'
  ]], ['La altura nace del plié y del empuje, no de lanzar el torso hacia atrás.', 'Height comes from the plié and the push, not from throwing the torso back.']),
  E('variation', 90, 'balance', ['Enchaînement final', 'Final enchaînement'], [[
    'Frase 1 (8 tiempos): balancé, balancé, pas de bourrée y pirueta doble en dehors desde cuarta.',
    'Frase 2 (8 tiempos): glissade, assemblé, sissonne ouverte en arabesque, pas de bourrée.',
    'Frase 3 (8 tiempos): 4 chaînés o 2 piqués, y cuarta en plié con los brazos abiertos.',
    'Frase 4 (8 tiempos): développé croisé devant, relevé, balance y reverencia. Repite al otro lado.'
  ], [
    'Phrase 1 (8 counts): balancé, balancé, pas de bourrée and a double pirouette en dehors from fourth.',
    'Phrase 2 (8 counts): glissade, assemblé, sissonne ouverte in arabesque, pas de bourrée.',
    'Phrase 3 (8 counts): 4 chaînés or 2 piqués, and fourth in plié with arms open.',
    'Phrase 4 (8 counts): développé croisé devant, relevé, balance and a bow. Repeat to the other side.'
  ]], ['Baila la frase entera, no pasos sueltos: une cada paso al siguiente con la música.', 'Dance the whole phrase, not separate steps: join each step to the next with the music.']),

  /* ================= FISICO AVANZADO ================= */
  E('calfecc', 50, 'heelraise', ['Bajada lenta de talón en escalón', 'Slow heel drops on a step'], [[
    'De pie sobre el borde de un escalón con la parte delantera del pie, sujetándote a la pared.',
    'Sube a media punta con las dos piernas y baja muy despacio con una sola (5 segundos), hasta pasar un poco por debajo del escalón.',
    'Tobillo recto todo el recorrido: no dejes que se caiga hacia fuera.',
    '3 series de 8 por pierna.'
  ], [
    'Stand on the edge of a step on the balls of your feet, holding the wall.',
    'Rise to demi-pointe on both legs and lower very slowly on one (5 seconds), just below the step.',
    'Keep the ankle straight all the way: do not let it roll outwards.',
    '3 sets of 8 per leg.'
  ]], ['Es el mejor ejercicio para tobillos fuertes y para prevenir lesiones del tendón de Aquiles.', 'It is the best exercise for strong ankles and to help prevent Achilles problems.']),
  E('pistol', 40, 'pistol', ['Sentadilla a una pierna', 'Single-leg squat'], [[
    'De pie sobre una pierna delante de una silla, la otra estirada un poco hacia delante.',
    'Baja despacio hasta rozar la silla con los glúteos, con la rodilla alineada sobre el segundo dedo del pie.',
    'Sube sin impulso, apretando el glúteo de la pierna de apoyo.',
    '3 series de 6 por pierna.'
  ], [
    'Stand on one leg in front of a chair, the other stretched slightly forward.',
    'Lower slowly until your glutes brush the chair, knee aligned over the second toe.',
    'Rise without bouncing, squeezing the glute of the standing leg.',
    '3 sets of 6 per leg.'
  ]], ['Si la rodilla se va hacia dentro, baja menos.', 'If the knee caves in, go less deep.']),
  E('hollow', 0, 'coach', ['Posición hueca', 'Hollow hold'], [[
    'Túmbate boca arriba, pega la zona lumbar al suelo.',
    'Levanta hombros y piernas estiradas unos centímetros, brazos junto a las orejas.',
    'Mantén 20 a 30 segundos respirando.',
    '4 series. Si la espalda se despega del suelo, dobla las rodillas.'
  ], [
    'Lie on your back and press your lower back into the floor.',
    'Lift your shoulders and straight legs a few centimetres, arms by your ears.',
    'Hold for 20 to 30 seconds, breathing.',
    '4 sets. If your back lifts off the floor, bend your knees.'
  ]], ['Es la "tripa dentro" de la barra, pero tumbada: la misma conexión que necesitas para girar.', 'It is the barre\'s "tummy in", lying down: the same connection you need to turn.']),
  E('teaser', 0, 'coach', ['Teaser de Pilates', 'Pilates teaser'], [[
    'Sentado en V: tronco y piernas estiradas a 45°, brazos paralelos a las piernas.',
    'Baja el tronco vértebra a vértebra hasta casi tocar el suelo, sin mover las piernas.',
    'Vuelve a subir en V sin impulso.',
    '3 series de 6.'
  ], [
    'Sit in a V: torso and straight legs at 45°, arms parallel to the legs.',
    'Roll the torso down vertebra by vertebra until almost touching the floor, legs still.',
    'Come back up to the V without momentum.',
    '3 sets of 6.'
  ]], ['Si tiras del cuello, pon las manos detrás de los muslos.', 'If you pull on your neck, hold behind your thighs.']),
  E('sidelift', 0, 'coach', ['Elevaciones a la segunda tumbada', 'Side-lying à la seconde lifts'], [[
    'Túmbate de lado con la pierna de abajo doblada y la de arriba estirada y rotada hacia fuera.',
    'Sube la pierna a la segunda, lo más alto posible sin que la cadera se vaya hacia atrás.',
    'Mantén 3 segundos arriba y baja despacio.',
    '3 series de 10 por lado.'
  ], [
    'Lie on your side with the bottom leg bent and the top leg straight and turned out.',
    'Lift the leg à la seconde, as high as you can without the hip rolling back.',
    'Hold 3 seconds at the top and lower slowly.',
    '3 sets of 10 per side.'
  ]], ['Es la fuerza que sostiene tus développés a 90°.', 'This is the strength that holds your développés at 90°.']),
  E('archlift', 0, 'coach', ['Arabesque tumbada', 'Prone arabesque lifts'], [[
    'Boca abajo, frente sobre las manos y abdomen activo.',
    'Levanta una pierna estirada y rotada, sin girar la cadera ni despegarla del suelo.',
    'Mantén 3 segundos y baja.',
    '3 series de 10 por pierna.'
  ], [
    'Lie on your tummy, forehead on your hands, core active.',
    'Lift one straight, turned-out leg without twisting or lifting the hip off the floor.',
    'Hold 3 seconds and lower.',
    '3 sets of 10 per leg.'
  ]], ['La pierna sube desde el glúteo y los isquios, no arqueando la zona lumbar.', 'The leg lifts from the glute and hamstring, not by arching the lower back.']),
  E('band', 0, 'coach', ['Pies con banda elástica', 'Feet with a resistance band'], [[
    'Sentado con las piernas estiradas y una banda elástica en la planta del pie.',
    'Estira el pie en tres tiempos: tobillo, empeine y dedos, contra la resistencia.',
    'Vuelve en orden inverso: dedos, empeine y tobillo.',
    '3 series de 12 por pie. Sin banda, hazlo igual y despacio.'
  ], [
    'Sit with legs straight and a resistance band around the sole of your foot.',
    'Point the foot in three stages against the band: ankle, instep, toes.',
    'Return in reverse: toes, instep, ankle.',
    '3 sets of 12 per foot. Without a band, do it the same way, slowly.'
  ]], ['Los dedos se alargan, nunca se encogen como un puño.', 'The toes lengthen, never curl like a fist.']),
  E('plyo', 120, 'saute', ['Resistencia de saltos', 'Jump endurance'], [[
    '16 sautés en primera, 16 en segunda y 16 changements seguidos.',
    'Descansa 30 segundos y repite 3 veces.',
    'Cada aterrizaje pasa por el metatarso hasta el talón, en plié y en silencio.',
    'Si notas dolor en espinillas o tobillos, para.'
  ], [
    '16 sautés in first, 16 in second and 16 changements in a row.',
    'Rest 30 seconds and repeat 3 times.',
    'Every landing rolls through the ball of the foot to the heel, in plié and quietly.',
    'If you feel pain in your shins or ankles, stop.'
  ]], ['La calidad de la última serie debe ser igual que la de la primera.', 'The last set must look as good as the first.']),
  E('legholds', 0, 'develop', ['Extensiones sin manos', 'Unsupported extensions'], [[
    'De pie sin barra, développé a la segunda y suelta la mano de la pierna: mantenla solo con fuerza.',
    'Aguanta 8 tiempos, baja 4 tiempos.',
    'Repite delante y en arabesque.',
    '2 veces por dirección y pierna.'
  ], [
    'Standing without the barre, développé à la seconde and let go of the leg: hold it with strength alone.',
    'Hold for 8 counts, lower over 4.',
    'Repeat to the front and in arabesque.',
    '2 times per direction and leg.'
  ]], ['Mejor 10 cm más baja y sostenida que alta y torcida.', 'Better 10 cm lower and held than high and twisted.']),
  E('splits', 0, 'coach', ['Trabajo de espagat', 'Split work'], [[
    'Solo con el cuerpo bien caliente. Estocada baja con la rodilla de atrás en el suelo.',
    'Desliza el pie de delante hacia delante sin forzar, con las caderas mirando al frente.',
    'Mantén 30 segundos respirando en el punto de estiramiento suave. Nada de rebotes.',
    'Cambia de pierna y termina con el espagat lateral solo si tu profesor lo trabaja contigo.'
  ], [
    'Only when your body is fully warm. Low lunge with the back knee on the floor.',
    'Slide the front foot forward without forcing, hips square to the front.',
    'Hold 30 seconds, breathing at the point of gentle stretch. No bouncing.',
    'Switch legs and finish with the side split only if your teacher works on it with you.'
  ]], ['Pon cojines debajo de la cadera: el espagat se gana con semanas, no forzando un día.', 'Put cushions under your hips: splits are earned over weeks, not by forcing one day.'])
];
