// Contenido de las clases. Cada texto tiene version es / en.
// dur = segundos, bpm = ritmo del metronomo (0 = sin metronomo).

export const CLASSES = [
  {
    id: 'barra-basica',
    color: 'pink',
    title: { es: 'Barra para principiantes', en: 'Beginner barre' },
    subtitle: {
      es: 'Tu primera clase: calentamiento, barra y estiramiento.',
      en: 'Your first class: warm-up, barre and stretching.'
    },
    exercises: [
      {
        id: 'warmup',
        dur: 150,
        bpm: 0,
        name: { es: 'Calentamiento', en: 'Warm-up' },
        steps: {
          es: [
            'Marcha suave en el sitio, subiendo bien las rodillas.',
            'Haz círculos con los hombros hacia atrás, sin subirlos a las orejas.',
            'Inclina la cabeza despacio hacia un lado y hacia el otro.',
            'Círculos con los tobillos: un pie y luego el otro.'
          ],
          en: [
            'March gently on the spot, lifting your knees.',
            'Roll your shoulders backwards without lifting them to your ears.',
            'Slowly tilt your head to one side, then the other.',
            'Ankle circles: one foot, then the other.'
          ]
        },
        tip: {
          es: 'Respira con calma. Nada de rebotar ni forzar.',
          en: 'Breathe calmly. No bouncing and no forcing.'
        }
      },
      {
        id: 'posture',
        dur: 90,
        bpm: 0,
        name: { es: 'Postura y primera posición', en: 'Posture and first position' },
        steps: {
          es: [
            'Pies juntos, talones unidos y puntas hacia fuera solo hasta donde te sea cómodo (primera posición).',
            'Las rodillas miran en la misma dirección que los pies.',
            'Estírate hacia arriba, como si un hilo tirara de tu cabeza. Hombros relajados.',
            'Cuello largo y mirada al frente. Apoya una mano en la barra o en una silla firme.'
          ],
          en: [
            'Feet together, heels touching, toes turned out only as far as is comfortable (first position).',
            'Your knees point the same way as your feet.',
            'Grow tall, as if a string is pulling the top of your head up. Relax your shoulders.',
            'Long neck, eyes forward. Rest one hand on the barre or a sturdy chair.'
          ]
        },
        tip: {
          es: 'La barra es para el equilibrio: no te cuelgues de ella.',
          en: 'The barre is for balance: do not hang on it.'
        }
      },
      {
        id: 'plie',
        dur: 180,
        bpm: 60,
        name: { es: 'Pliés', en: 'Pliés' },
        steps: {
          es: [
            'En primera posición, dobla las rodillas hacia fuera, sobre los dedos de los pies, sin despegar los talones (demi-plié).',
            'Baja en 4 tiempos y sube en 4 tiempos, con la espalda recta.',
            'Repite en segunda posición: pies separados un poco más que el ancho de tus hombros.',
            'Quédate en demi-plié (medio plié). El plié profundo se aprende mejor con un profesor.'
          ],
          en: [
            'In first position, bend your knees outwards, over your toes, keeping your heels down (demi-plié).',
            'Go down for 4 counts and up for 4 counts, back straight.',
            'Repeat in second position: feet a little wider than your shoulders.',
            'Stay in demi-plié (half bend). The deep plié is best learned with a teacher.'
          ]
        },
        tip: {
          es: 'Rodillas siempre sobre los dedos de los pies, nunca hacia dentro.',
          en: 'Knees always over your toes, never falling inwards.'
        }
      },
      {
        id: 'tendu',
        dur: 180,
        bpm: 72,
        name: { es: 'Tendus', en: 'Tendus' },
        steps: {
          es: [
            'Desde primera posición, desliza un pie hacia delante por el suelo hasta estirar la rodilla y el empeine. La punta sigue tocando el suelo.',
            'Vuelve a primera deslizando el pie de nuevo, sin levantarlo.',
            'Repite hacia el lado y después hacia atrás.',
            'Mantén las caderas rectas y el peso sobre la pierna de apoyo.'
          ],
          en: [
            'From first position, slide one foot forward along the floor until your knee and instep are stretched. Your toe stays on the floor.',
            'Slide the foot back to first position without lifting it.',
            'Repeat to the side, then to the back.',
            'Keep your hips level and your weight over the supporting leg.'
          ]
        },
        tip: {
          es: 'Imagina que tu pie pinta una línea en el suelo.',
          en: 'Imagine your foot is painting a line on the floor.'
        }
      },
      {
        id: 'degage',
        dur: 120,
        bpm: 80,
        name: { es: 'Dégagés', en: 'Dégagés' },
        steps: {
          es: [
            'Igual que el tendu, pero al final la punta se despega del suelo unos pocos centímetros.',
            'Sale rápido y limpio, y vuelve con control.',
            'Rodilla y empeine estirados; la pierna de apoyo firme.',
            'Hazlo hacia delante, al lado y hacia atrás.'
          ],
          en: [
            'Like a tendu, but at the end your toe lifts a few centimetres off the floor.',
            'Go out quickly and cleanly, and come back with control.',
            'Knee and instep stretched; supporting leg firm.',
            'Do it to the front, side and back.'
          ]
        },
        tip: {
          es: 'Que suene ligero: sin golpear el suelo.',
          en: 'Keep it light: do not slap the floor.'
        }
      },
      {
        id: 'rond',
        dur: 150,
        bpm: 60,
        name: { es: 'Rond de jambe a terre', en: 'Rond de jambe à terre' },
        steps: {
          es: [
            'Empieza con un tendu hacia delante.',
            'Dibuja un semicírculo en el suelo con la punta: delante, lado, atrás (en dehors).',
            'Las caderas se quedan quietas y niveladas.',
            'Vuelve a primera y prueba al revés: de atrás hacia delante (en dedans).'
          ],
          en: [
            'Start with a tendu to the front.',
            'Draw a half circle on the floor with your toe: front, side, back (en dehors).',
            'Keep your hips still and level.',
            'Return to first and try the reverse: from back to front (en dedans).'
          ]
        },
        tip: {
          es: 'Solo se mueve la pierna; el resto del cuerpo, quieto.',
          en: 'Only the leg moves; the rest of your body stays still.'
        }
      },
      {
        id: 'releve',
        dur: 120,
        bpm: 60,
        name: { es: 'Relevés', en: 'Relevés' },
        steps: {
          es: [
            'En primera posición, sube despacio sobre la parte delantera de los pies (media punta). Sin zapatillas de punta.',
            'Sube en 2 tiempos, mantén 2 tiempos y baja en 2 tiempos.',
            'Tobillos rectos: no los dejes caer hacia fuera.',
            'Baja con control hasta apoyar los talones, con las rodillas suaves.'
          ],
          en: [
            'In first position, slowly rise onto the balls of your feet (demi-pointe). No pointe shoes.',
            'Rise for 2 counts, hold for 2 counts and lower for 2 counts.',
            'Keep your ankles straight: do not let them roll outwards.',
            'Lower with control until your heels touch the floor, knees soft.'
          ]
        },
        tip: {
          es: 'Las zapatillas de punta son para más adelante y siempre con un profesor.',
          en: 'Pointe shoes are for later on, and always with a teacher.'
        }
      },
      {
        id: 'stretch',
        dur: 180,
        bpm: 0,
        name: { es: 'Estiramiento final', en: 'Final stretch' },
        steps: {
          es: [
            'Siéntate en el suelo con las plantas de los pies juntas (mariposa) y la espalda larga.',
            'Inclínate hacia delante desde las caderas, sin encorvarte y sin rebotar.',
            'Después estira las piernas y alcanza los pies con calma.',
            'Respira hondo y relájate.'
          ],
          en: [
            'Sit on the floor with the soles of your feet together (butterfly), back long.',
            'Lean forward from your hips, without rounding your back and without bouncing.',
            'Then straighten your legs and reach towards your feet calmly.',
            'Take a deep breath and relax.'
          ]
        },
        tip: {
          es: 'Estirar no debe doler. Si duele, sal un poco de la postura.',
          en: 'Stretching should not hurt. If it does, ease out of the pose a little.'
        }
      }
    ]
  },
  {
    id: 'estiramientos',
    color: 'lilac',
    title: { es: 'Estiramientos suaves', en: 'Gentle stretching' },
    subtitle: {
      es: 'Diez minutos para soltar el cuerpo antes o después de bailar.',
      en: 'Ten minutes to loosen up before or after dancing.'
    },
    exercises: [
      {
        id: 'neck',
        dur: 60,
        bpm: 0,
        name: { es: 'Cuello y hombros', en: 'Neck and shoulders' },
        steps: {
          es: [
            'De pie o sentado, con la espalda larga.',
            'Deja caer la oreja hacia el hombro, despacio, y cambia de lado.',
            'Sube los hombros hacia las orejas y suéltalos con un suspiro.',
            'Repite unas cuantas veces, sin prisa.'
          ],
          en: [
            'Standing or sitting, back long.',
            'Slowly let one ear drop towards your shoulder, then switch sides.',
            'Lift your shoulders towards your ears and drop them with a sigh.',
            'Repeat a few times, no rush.'
          ]
        },
        tip: {
          es: 'Nunca gires el cuello con fuerza.',
          en: 'Never force your neck round.'
        }
      },
      {
        id: 'butterfly',
        dur: 90,
        bpm: 0,
        name: { es: 'Mariposa', en: 'Butterfly' },
        steps: {
          es: [
            'Sentado, junta las plantas de los pies y acerca los talones.',
            'Espalda larga, hombros relajados.',
            'Deja que las rodillas bajen solas hacia el suelo, sin empujarlas con las manos.',
            'Respira hondo y mantén.'
          ],
          en: [
            'Sit with the soles of your feet together and bring your heels in.',
            'Long back, relaxed shoulders.',
            'Let your knees drop towards the floor on their own; do not push them down with your hands.',
            'Breathe deeply and hold.'
          ]
        },
        tip: {
          es: 'Si las rodillas quedan altas, está bien. Cada cuerpo es distinto.',
          en: 'If your knees stay high, that is fine. Every body is different.'
        }
      },
      {
        id: 'fold',
        dur: 90,
        bpm: 0,
        name: { es: 'Flexión hacia delante', en: 'Forward fold' },
        steps: {
          es: [
            'Sentado con las piernas estiradas y los pies flexionados.',
            'Estira los brazos hacia delante y alarga la espalda.',
            'Inclínate desde las caderas, sin encorvar la espalda.',
            'Baja solo hasta donde notes un estiramiento suave.'
          ],
          en: [
            'Sit with your legs straight and your feet flexed.',
            'Reach your arms forward and lengthen your back.',
            'Fold from your hips without rounding your back.',
            'Go only as far as you feel a gentle stretch.'
          ]
        },
        tip: {
          es: 'No importa llegar a los pies. Importa la espalda larga.',
          en: 'Reaching your feet does not matter. A long back does.'
        }
      },
      {
        id: 'quad',
        dur: 90,
        bpm: 0,
        name: { es: 'Muslo delantero', en: 'Front of the thigh' },
        steps: {
          es: [
            'De pie, apóyate en una pared o una silla.',
            'Dobla una rodilla y sujeta el pie con la mano del mismo lado.',
            'Lleva el talón hacia el glúteo con las rodillas juntas.',
            'Mantén unos segundos y cambia de pierna.'
          ],
          en: [
            'Stand, holding a wall or chair for balance.',
            'Bend one knee and hold your foot with the hand on the same side.',
            'Bring your heel towards your bottom, knees together.',
            'Hold for a few seconds, then switch legs.'
          ]
        },
        tip: {
          es: 'Mantén la cadera recta, sin arquear la espalda.',
          en: 'Keep your hips straight; do not arch your back.'
        }
      },
      {
        id: 'cobra',
        dur: 60,
        bpm: 0,
        name: { es: 'Cobra suave', en: 'Gentle cobra' },
        steps: {
          es: [
            'Tumbado boca abajo, con las manos junto a los hombros.',
            'Empuja suavemente con las manos y levanta el pecho, mirando al frente.',
            'Las caderas se quedan en el suelo.',
            'Baja despacio.'
          ],
          en: [
            'Lie on your tummy with your hands beside your shoulders.',
            'Gently press up with your hands and lift your chest, looking forward.',
            'Keep your hips on the floor.',
            'Lower down slowly.'
          ]
        },
        tip: {
          es: 'Sube poco. No debe doler la espalda baja.',
          en: 'Only go a little way up. Your lower back should not hurt.'
        }
      },
      {
        id: 'child',
        dur: 60,
        bpm: 0,
        name: { es: 'Postura del niño', en: "Child's pose" },
        steps: {
          es: [
            'De rodillas, siéntate sobre los talones.',
            'Baja el pecho hacia el suelo y estira los brazos hacia delante.',
            'Frente apoyada, cuello relajado.',
            'Respira y suelta la espalda.'
          ],
          en: [
            'Kneel and sit back on your heels.',
            'Lower your chest towards the floor and reach your arms forward.',
            'Forehead down, neck relaxed.',
            'Breathe and let your back release.'
          ]
        },
        tip: {
          es: 'Si te molestan las rodillas, pon una toalla doblada debajo.',
          en: 'If your knees hurt, put a folded towel underneath.'
        }
      },
      {
        id: 'feet',
        dur: 90,
        bpm: 0,
        name: { es: 'Pies y tobillos', en: 'Feet and ankles' },
        steps: {
          es: [
            'Sentado con las piernas estiradas.',
            'Estira los pies (punta) y flexiónalos (talón) despacio, varias veces.',
            'Haz círculos con los tobillos en los dos sentidos.',
            'Masajea las plantas con los pulgares.'
          ],
          en: [
            'Sit with your legs straight.',
            'Slowly point and flex your feet several times.',
            'Draw circles with your ankles in both directions.',
            'Massage the soles of your feet with your thumbs.'
          ]
        },
        tip: {
          es: 'Unos pies y tobillos fuertes son la base de todo.',
          en: 'Strong feet and ankles are the foundation of everything.'
        }
      }
    ]
  },
  {
    id: 'centro',
    color: 'peach',
    title: { es: 'Centro y equilibrio', en: 'Centre and balance' },
    subtitle: {
      es: 'Sin barra: brazos, equilibrio, pasos y reverencia.',
      en: 'Away from the barre: arms, balance, steps and bow.'
    },
    exercises: [
      {
        id: 'c-warm',
        dur: 90,
        bpm: 0,
        name: { es: 'Calentamiento corto', en: 'Short warm-up' },
        steps: {
          es: [
            'Marcha suave en el sitio.',
            'Círculos con los hombros y con los tobillos.',
            'Haz dos o tres pliés pequeños en primera posición.',
            'Estírate hacia arriba y respira.'
          ],
          en: [
            'March gently on the spot.',
            'Roll your shoulders and circle your ankles.',
            'Do two or three small pliés in first position.',
            'Reach tall and breathe.'
          ]
        },
        tip: {
          es: 'Si vienes de la clase de barra, puedes saltarte este.',
          en: 'If you just did the barre class you can skip this one.'
        }
      },
      {
        id: 'port',
        dur: 150,
        bpm: 60,
        name: { es: 'Port de bras', en: 'Port de bras' },
        steps: {
          es: [
            'Brazos abajo, redondeados, ante los muslos (posición baja).',
            'Sube los brazos redondeados delante del pecho (primera).',
            'Ábrelos hacia los lados, con los codos suaves (segunda).',
            'Súbelos redondeados sobre la cabeza y vuelve a bajarlos despacio.'
          ],
          en: [
            'Arms down and rounded in front of your thighs (low position).',
            'Lift them rounded in front of your chest (first).',
            'Open them to the sides with soft elbows (second).',
            'Lift them rounded above your head, then lower slowly.'
          ]
        },
        tip: {
          es: 'Imagina que sujetas un globo grande con los brazos.',
          en: 'Imagine you are holding a big balloon with your arms.'
        }
      },
      {
        id: 'c-releve',
        dur: 120,
        bpm: 60,
        name: { es: 'Relevés en equilibrio', en: 'Balancing relevés' },
        steps: {
          es: [
            'En primera posición, brazos en segunda.',
            'Sube a media punta en 2 tiempos y mantén el equilibrio.',
            'Mira un punto fijo delante de ti.',
            'Baja con control.'
          ],
          en: [
            'In first position with your arms in second.',
            'Rise to demi-pointe in 2 counts and hold your balance.',
            'Look at a fixed point in front of you.',
            'Lower with control.'
          ]
        },
        tip: {
          es: 'Aprieta el abdomen ligeramente: te da estabilidad.',
          en: 'Gently engage your tummy muscles: it gives you stability.'
        }
      },
      {
        id: 'walk',
        dur: 120,
        bpm: 72,
        name: { es: 'Pasos en media punta', en: 'Steps on demi-pointe' },
        steps: {
          es: [
            'Camina por la sala sobre la parte delantera de los pies.',
            'Pasos pequeños y suaves, como sobre nubes.',
            'Brazos redondeados y hombros relajados.',
            'Cuando termine la cuenta, para en primera posición.'
          ],
          en: [
            'Walk around the room on the balls of your feet.',
            'Small, soft steps, as if walking on clouds.',
            'Rounded arms and relaxed shoulders.',
            'When the count ends, stop in first position.'
          ]
        },
        tip: {
          es: 'Cuidado con los obstáculos. Despeja el espacio antes.',
          en: 'Watch out for obstacles. Clear the space first.'
        }
      },
      {
        id: 'saute',
        dur: 120,
        bpm: 80,
        name: { es: 'Sautés en primera', en: 'Sautés in first' },
        steps: {
          es: [
            'En primera posición, haz un demi-plié.',
            'Empuja el suelo con los pies y salta estirando los pies en el aire.',
            'Aterriza suave: primero los dedos, luego el talón, terminando en plié.',
            'Repite unas cuantas veces sin parar.'
          ],
          en: [
            'In first position, do a demi-plié.',
            'Push through the floor and jump, stretching your feet in the air.',
            'Land softly: toes first, then heels, finishing in plié.',
            'Repeat a few times without stopping.'
          ]
        },
        tip: {
          es: 'Si el suelo es duro o resbala, salta menos o descansa.',
          en: 'If the floor is hard or slippery, jump less or rest.'
        }
      },
      {
        id: 'bow',
        dur: 90,
        bpm: 0,
        name: { es: 'Reverencia', en: 'Révérence (bow)' },
        steps: {
          es: [
            'Pies en primera posición, mirada al frente.',
            'Lleva un pie atrás en un tendu y baja un poco en plié.',
            'Inclina la cabeza y un brazo hacia fuera como saludando.',
            'Vuelve a subir despacio y sonríe.'
          ],
          en: [
            'Feet in first position, eyes forward.',
            'Take one foot back in a tendu and bend a little.',
            'Tilt your head and open one arm out as if greeting.',
            'Rise slowly and smile.'
          ]
        },
        tip: {
          es: 'En ballet, al acabar la clase se da las gracias con una reverencia.',
          en: 'In ballet, you thank your teacher with a bow at the end of class.'
        }
      }
    ]
  }
];

/* ------------------------------------------------------------------
   Secciones y animaciones de la sombra (guia) para cada ejercicio.
   Secciones: 'tecnica' y 'fisico' (la teoria son lecciones aparte).
   ------------------------------------------------------------------ */
import { FUERZA, THEORY } from './extra.js';
CLASSES.push(FUERZA);
export { THEORY };

const META = {
  'barra-basica': {
    section: 'tecnica', order: 1,
    anims: { warmup: 'march', posture: 'posture', plie: 'plie', tendu: 'tendu', degage: 'degage', rond: 'rond', releve: 'releve', stretch: 'coach' }
  },
  centro: {
    section: 'tecnica', order: 2,
    anims: { 'c-warm': 'march', port: 'portdebras', 'c-releve': 'releve2', walk: 'walk', saute: 'saute', bow: 'bow' }
  },
  fuerza: {
    section: 'fisico', order: 1,
    anims: { 'f-warm': 'march', heel: 'heelraise', squat: 'squat', bridge: 'coach', plank: 'coach', balance: 'retire', deadbug: 'coach' }
  },
  estiramientos: {
    section: 'fisico', order: 2,
    anims: { neck: 'neck', butterfly: 'coach', fold: 'coach', quad: 'coach', cobra: 'coach', child: 'coach', feet: 'coach' }
  }
};
for (const c of CLASSES) {
  const m = META[c.id];
  c.section = m.section;
  c.order = m.order;
  for (const e of c.exercises) e.anim = m.anims[e.id] || 'coach';
}

export const SECTIONS = ['teoria', 'tecnica', 'fisico'];
export const classesOf = (section) => CLASSES.filter((c) => c.section === section).sort((a, b) => a.order - b.order);
