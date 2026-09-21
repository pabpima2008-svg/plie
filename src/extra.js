// Contenido nuevo: clase de Fisico (fuerza) y lecciones de Teoria.

export const FUERZA = {
  id: 'fuerza',
  color: 'mint',
  title: { es: 'Fuerza para bailar', en: 'Strength for dancing' },
  subtitle: {
    es: 'Pies, piernas y abdomen fuertes para bailar mejor y con menos riesgo.',
    en: 'Strong feet, legs and core to dance better and with less risk.'
  },
  exercises: [
    {
      id: 'f-warm',
      dur: 90,
      bpm: 0,
      name: { es: 'Calentamiento activo', en: 'Active warm-up' },
      steps: {
        es: [
          'Marcha en el sitio moviendo los brazos con suavidad.',
          'Círculos con los hombros y con los tobillos.',
          'Respira profundo: coge aire por la nariz y suéltalo despacio.'
        ],
        en: [
          'March on the spot, swinging your arms gently.',
          'Roll your shoulders and circle your ankles.',
          'Breathe deeply: in through your nose, out slowly.'
        ]
      },
      tip: {
        es: 'Empieza suave. El cuerpo tiene que entrar en calor poco a poco.',
        en: 'Start gently. Your body needs to warm up gradually.'
      }
    },
    {
      id: 'heel',
      dur: 120,
      bpm: 50,
      name: { es: 'Elevaciones de talones', en: 'Heel raises' },
      steps: {
        es: [
          'De pie, pies en paralelo y separados como la anchura de tus caderas. Apoya una mano en una pared o silla.',
          'Sube despacio sobre la parte delantera de los pies, todo lo alto que puedas sin que los tobillos se tuerzan.',
          'Mantén arriba un momento y baja muy despacio, sin dejarte caer.',
          'Repite unas 10 veces, descansa y haz otra serie.'
        ],
        en: [
          'Stand with your feet parallel, hip-width apart. Rest one hand on a wall or chair.',
          'Slowly rise onto the balls of your feet, as high as you can without your ankles rolling.',
          'Hold for a moment at the top and lower very slowly, without dropping.',
          'Repeat about 10 times, rest, then do another set.'
        ]
      },
      tip: {
        es: 'Bajar despacio es lo que más fortalece las pantorrillas y los tobillos.',
        en: 'Lowering slowly is what strengthens your calves and ankles most.'
      }
    },
    {
      id: 'squat',
      dur: 120,
      bpm: 50,
      name: { es: 'Sentadillas suaves', en: 'Gentle squats' },
      steps: {
        es: [
          'Pies paralelos, separados como la anchura de tus caderas.',
          'Siéntate hacia atrás como si fueras a sentarte en una silla, con la espalda larga.',
          'Las rodillas siguen la dirección de los pies y no pasan hacia dentro.',
          'Sube empujando el suelo con los pies. Repite unas 8 veces.'
        ],
        en: [
          'Feet parallel, hip-width apart.',
          'Sit back as if sitting on a chair, keeping your back long.',
          'Your knees follow the direction of your feet and do not fall inwards.',
          'Push through the floor to stand up. Repeat about 8 times.'
        ]
      },
      tip: {
        es: 'No hace falta bajar mucho. Mejor pocas veces y bien hechas.',
        en: 'You do not need to go low. A few good ones are better than many poor ones.'
      }
    },
    {
      id: 'bridge',
      dur: 90,
      bpm: 0,
      name: { es: 'Puente de glúteos', en: 'Glute bridge' },
      steps: {
        es: [
          'Túmbate boca arriba con las rodillas dobladas y los pies apoyados en el suelo.',
          'Aprieta los glúteos y sube las caderas hasta que el cuerpo haga una línea desde las rodillas hasta los hombros.',
          'Mantén 2 segundos y baja despacio.',
          'Repite unas 10 veces.'
        ],
        en: [
          'Lie on your back with your knees bent and feet flat on the floor.',
          'Squeeze your bottom and lift your hips until your body makes a line from knees to shoulders.',
          'Hold for 2 seconds and lower slowly.',
          'Repeat about 10 times.'
        ]
      },
      tip: {
        es: 'Si notas la espalda baja, sube menos y aprieta más los glúteos.',
        en: 'If you feel your lower back, lift less and squeeze your bottom more.'
      }
    },
    {
      id: 'plank',
      dur: 60,
      bpm: 0,
      name: { es: 'Plancha suave', en: 'Gentle plank' },
      steps: {
        es: [
          'Apoya los antebrazos y las rodillas en el suelo, con los codos bajo los hombros.',
          'Alarga el cuerpo en una línea desde la cabeza hasta las rodillas.',
          'Aprieta el abdomen y respira con calma.',
          'Mantén 15 a 20 segundos, descansa y repite. Si te sientes fuerte, apoya los pies en lugar de las rodillas.'
        ],
        en: [
          'Rest on your forearms and knees, elbows under your shoulders.',
          'Lengthen your body into a line from head to knees.',
          'Engage your tummy muscles and breathe calmly.',
          'Hold for 15 to 20 seconds, rest and repeat. If you feel strong, rest on your toes instead of your knees.'
        ]
      },
      tip: {
        es: 'Que no se hunda la espalda. Si se hunde, descansa.',
        en: 'Do not let your back sag. If it does, take a rest.'
      }
    },
    {
      id: 'balance',
      dur: 90,
      bpm: 0,
      name: { es: 'Equilibrio a un pie', en: 'One-leg balance' },
      steps: {
        es: [
          'De pie junto a la barra o una pared. Apoya una mano.',
          'Lleva un pie hasta el tobillo o la pantorrilla de la otra pierna, con la rodilla abierta hacia el lado (retiré).',
          'Mantén el equilibrio unos segundos mirando un punto fijo.',
          'Baja y cambia de pierna.'
        ],
        en: [
          'Stand next to the barre or a wall. Rest one hand on it.',
          'Bring one foot to the ankle or calf of the other leg, with the knee open to the side (retiré).',
          'Hold your balance for a few seconds, looking at a fixed point.',
          'Lower and switch legs.'
        ]
      },
      tip: {
        es: 'Apoya el pie en el tobillo o la pantorrilla, nunca en la rodilla.',
        en: 'Rest your foot on the ankle or calf, never on the knee.'
      }
    },
    {
      id: 'deadbug',
      dur: 90,
      bpm: 0,
      name: { es: 'Abdominales suaves', en: 'Gentle core work' },
      steps: {
        es: [
          'Túmbate boca arriba con las rodillas dobladas y los brazos hacia el techo.',
          'Aprieta el abdomen para que la espalda baja se apoye en el suelo.',
          'Baja despacio un brazo hacia atrás y la pierna contraria estirada, sin que se arquee la espalda.',
          'Vuelve y cambia de lado. Repite unas 8 veces por lado.'
        ],
        en: [
          'Lie on your back with your knees bent and arms reaching to the ceiling.',
          'Engage your tummy so your lower back rests on the floor.',
          'Slowly lower one arm back and the opposite leg straight, without arching your back.',
          'Return and switch sides. Repeat about 8 times per side.'
        ]
      },
      tip: {
        es: 'Muévete despacio. La calidad importa más que la velocidad.',
        en: 'Move slowly. Quality matters more than speed.'
      }
    }
  ]
};

/* ------------------------------------------------------------------
   TEORIA: lecciones cortas con tarjetas y un mini test al final.
   card.anim = animacion de la sombra mientras se lee la tarjeta.
   quiz: options[0..2], answer = indice correcto.
   ------------------------------------------------------------------ */
export const THEORY = [
  {
    id: 'posiciones',
    color: 'lilac',
    mins: 3,
    title: { es: 'Las posiciones', en: 'The positions' },
    subtitle: { es: 'El abecedario del ballet: pies y brazos.', en: 'The ABC of ballet: feet and arms.' },
    cards: [
      {
        anim: 'coach',
        title: { es: 'Por qué hay posiciones', en: 'Why there are positions' },
        text: {
          es: 'Todo el ballet parte de unas posiciones básicas de pies y de brazos. Son como el abecedario: con ellas se forman todos los pasos.',
          en: 'All of ballet starts from a few basic positions of the feet and arms. They are like the alphabet: every step is built from them.'
        }
      },
      {
        anim: 'stand',
        title: { es: 'Primera posición', en: 'First position' },
        text: {
          es: 'Talones juntos y puntas hacia fuera, sin forzar. Es la posición de partida de casi todos los ejercicios.',
          en: 'Heels together and toes turned out, without forcing. It is the starting position of almost every exercise.'
        }
      },
      {
        anim: 'plie',
        title: { es: 'Segunda posición', en: 'Second position' },
        text: {
          es: 'Como la primera, pero con los pies separados un poco más que el ancho de los hombros. El peso se reparte por igual en los dos pies.',
          en: 'Like first, but with your feet a little wider than your shoulders. Your weight is shared equally between both feet.'
        }
      },
      {
        anim: 'stand',
        title: { es: 'Tercera, cuarta y quinta', en: 'Third, fourth and fifth' },
        text: {
          es: 'En estas posiciones los pies se colocan uno delante del otro. En la quinta van cruzados y pegados. Se aprenden con un profesor, cuando la primera y la segunda ya te resultan cómodas.',
          en: 'In these positions one foot is placed in front of the other. In fifth they are crossed and touching. They are best learned with a teacher, once first and second feel comfortable.'
        }
      },
      {
        anim: 'portdebras',
        title: { es: 'Posiciones de brazos', en: 'Arm positions' },
        text: {
          es: 'Los brazos también tienen posiciones: abajo, delante del pecho (primera), a los lados (segunda) y sobre la cabeza (en haut). Siempre redondeados y sin tensión.',
          en: 'Arms have positions too: down, in front of the chest (first), out to the sides (second) and above the head (en haut). Always rounded and relaxed.'
        }
      }
    ],
    quiz: [
      {
        q: { es: '¿Cómo están los talones en primera posición?', en: 'How are the heels in first position?' },
        options: { es: ['Juntos', 'Separados', 'Cruzados'], en: ['Together', 'Apart', 'Crossed'] },
        answer: 0
      },
      {
        q: { es: 'En segunda posición los pies están...', en: 'In second position the feet are...' },
        options: {
          es: ['Cruzados', 'Separados un poco más que los hombros', 'Pegados'],
          en: ['Crossed', 'A little wider than the shoulders', 'Touching']
        },
        answer: 1
      },
      {
        q: { es: '¿Cómo deben estar los brazos?', en: 'How should the arms be?' },
        options: {
          es: ['Rígidos y rectos', 'Pegados a las orejas', 'Redondeados y sin tensión'],
          en: ['Stiff and straight', 'Squeezed against the ears', 'Rounded and relaxed']
        },
        answer: 2
      }
    ]
  },
  {
    id: 'vocabulario',
    color: 'pink',
    mins: 3,
    title: { es: 'Vocabulario básico', en: 'Basic vocabulary' },
    subtitle: { es: 'Las palabras francesas que más vas a oír.', en: 'The French words you will hear most.' },
    cards: [
      {
        anim: 'coach',
        title: { es: 'El francés del ballet', en: 'The French of ballet' },
        text: {
          es: 'Los pasos tienen nombres en francés porque el ballet clásico se formalizó en la corte francesa hace siglos. Con unas pocas palabras entenderás cualquier clase.',
          en: 'Steps have French names because classical ballet was formalised at the French court centuries ago. A few words will help you follow any class.'
        }
      },
      {
        anim: 'plie',
        title: { es: 'Plié, tendu, dégagé', en: 'Plié, tendu, dégagé' },
        text: {
          es: 'Plié significa "doblado": doblar las rodillas. Tendu, "estirado": el pie se desliza y se estira. Dégagé, "soltado": como el tendu, pero el pie se despega un poco del suelo.',
          en: 'Plié means "bent": bending the knees. Tendu, "stretched": the foot slides out and stretches. Dégagé, "disengaged": like a tendu, but the foot lifts slightly off the floor.'
        }
      },
      {
        anim: 'releve',
        title: { es: 'Rond de jambe, relevé, sauté', en: 'Rond de jambe, relevé, sauté' },
        text: {
          es: 'Rond de jambe: "círculo de pierna". Relevé: "levantado", subir a media punta. Sauté: "saltado", un salto.',
          en: 'Rond de jambe: "circle of the leg". Relevé: "raised", rising onto demi-pointe. Sauté: "jumped", a jump.'
        }
      },
      {
        anim: 'portdebras',
        title: { es: 'Port de bras, barre, centre', en: 'Port de bras, barre, centre' },
        text: {
          es: 'Port de bras: la forma de llevar y mover los brazos. Barre: la barra, donde empieza la clase. Centre: el centro, ejercicios sin barra.',
          en: 'Port de bras: the way of carrying and moving the arms. Barre: the barre, where class begins. Centre: the centre, exercises away from the barre.'
        }
      },
      {
        anim: 'rond',
        title: { es: 'En dehors, en dedans, à terre', en: 'En dehors, en dedans, à terre' },
        text: {
          es: 'En dehors: "hacia fuera". En dedans: "hacia dentro". À terre: "en el suelo". Así, un rond de jambe à terre es un círculo con la pierna sin despegar el pie del suelo.',
          en: 'En dehors: "outwards". En dedans: "inwards". À terre: "on the ground". So a rond de jambe à terre is a leg circle with the toe staying on the floor.'
        }
      }
    ],
    quiz: [
      {
        q: { es: '¿Qué significa plié?', en: 'What does plié mean?' },
        options: { es: ['Saltado', 'Doblado', 'Girado'], en: ['Jumped', 'Bent', 'Turned'] },
        answer: 1
      },
      {
        q: { es: 'Relevé es...', en: 'Relevé is...' },
        options: {
          es: ['Deslizar el pie', 'Hacer un círculo', 'Subir a media punta'],
          en: ['Sliding the foot', 'Making a circle', 'Rising onto demi-pointe']
        },
        answer: 2
      },
      {
        q: { es: 'À terre significa...', en: 'À terre means...' },
        options: { es: ['En el suelo', 'En el aire', 'Hacia dentro'], en: ['On the ground', 'In the air', 'Inwards'] },
        answer: 0
      }
    ]
  },
  {
    id: 'postura',
    color: 'peach',
    mins: 3,
    title: { es: 'Postura y alineación', en: 'Posture and alignment' },
    subtitle: { es: 'Cómo colocar el cuerpo para bailar bien y sin daño.', en: 'How to place your body to dance well and safely.' },
    cards: [
      {
        anim: 'posture',
        title: { es: 'Crecer hacia arriba', en: 'Growing tall' },
        text: {
          es: 'Imagina que un hilo tira suavemente de la parte alta de tu cabeza. La espalda se alarga, sin arquear ni encorvar.',
          en: 'Imagine a string gently pulling the top of your head upwards. Your back lengthens, without arching or rounding.'
        }
      },
      {
        anim: 'shrug',
        title: { es: 'Hombros y cuello', en: 'Shoulders and neck' },
        text: {
          es: 'Los hombros están bajos y relajados, lejos de las orejas. El cuello es largo y la mirada va al frente.',
          en: 'Your shoulders are low and relaxed, away from your ears. Your neck is long and your eyes look ahead.'
        }
      },
      {
        anim: 'stand',
        title: { es: 'La rotación sale de la cadera', en: 'Turnout comes from the hips' },
        text: {
          es: 'Las puntas hacia fuera no se consiguen girando los pies, sino desde las caderas. Gira solo hasta donde puedas sin que las rodillas se tuerzan hacia dentro.',
          en: 'Turned-out feet do not come from twisting the feet, but from the hips. Turn out only as far as you can without your knees falling inwards.'
        }
      },
      {
        anim: 'plie',
        title: { es: 'Rodillas sobre los pies', en: 'Knees over your feet' },
        text: {
          es: 'Cuando doblas las rodillas, deben seguir la misma dirección que los pies. Si se van hacia dentro, gira menos.',
          en: 'When you bend your knees, they should follow the same direction as your feet. If they fall inwards, turn out less.'
        }
      },
      {
        anim: 'releve',
        title: { es: 'Reparte el peso', en: 'Share your weight' },
        text: {
          es: 'El peso se reparte entre los dos pies: talón, base del dedo gordo y base del dedo pequeño. Así el pie no se cae hacia dentro ni hacia fuera.',
          en: 'Your weight is shared between both feet: heel, base of the big toe and base of the little toe. This keeps the foot from rolling in or out.'
        }
      }
    ],
    quiz: [
      {
        q: { es: 'La rotación hacia fuera sale de...', en: 'Turnout comes from...' },
        options: { es: ['Los pies', 'Las caderas', 'Las rodillas'], en: ['The feet', 'The hips', 'The knees'] },
        answer: 1
      },
      {
        q: { es: 'Las rodillas deben mirar...', en: 'Your knees should point...' },
        options: {
          es: ['Hacia dentro', 'Hacia el techo', 'En la misma dirección que los pies'],
          en: ['Inwards', 'Up to the ceiling', 'The same way as your feet']
        },
        answer: 2
      },
      {
        q: { es: 'Los hombros deben estar...', en: 'Your shoulders should be...' },
        options: {
          es: ['Bajos y relajados', 'Pegados a las orejas', 'Tensos y hacia atrás'],
          en: ['Low and relaxed', 'Up by your ears', 'Tense and pulled back']
        },
        answer: 0
      }
    ]
  },
  {
    id: 'la-clase',
    color: 'mint',
    mins: 3,
    title: { es: 'Cómo es una clase', en: 'What a class is like' },
    subtitle: { es: 'Barra, centro, saltos y reverencia.', en: 'Barre, centre, jumps and bow.' },
    cards: [
      {
        anim: 'coach',
        title: { es: 'Las partes de la clase', en: 'The parts of a class' },
        text: {
          es: 'Una clase de ballet sigue casi siempre el mismo orden: barra, centro, saltos y, al final, la reverencia. Está pensada para calentar el cuerpo poco a poco.',
          en: 'A ballet class almost always follows the same order: barre, centre, jumps and, at the end, the bow. It is designed to warm the body up gradually.'
        }
      },
      {
        anim: 'plie',
        title: { es: 'La barra', en: 'The barre' },
        text: {
          es: 'Se empieza con pliés y se sigue con tendus, dégagés, ronds de jambe y relevés. La barra ayuda a mantener el equilibrio mientras aprendes.',
          en: 'It starts with pliés and continues with tendus, dégagés, ronds de jambe and relevés. The barre helps your balance while you learn.'
        }
      },
      {
        anim: 'portdebras',
        title: { es: 'El centro', en: 'The centre' },
        text: {
          es: 'En el centro repites ejercicios sin la barra: los brazos cobran más protagonismo y tienes que sostener tu propio equilibrio.',
          en: 'In the centre you repeat exercises without the barre: the arms take a bigger role and you must hold your own balance.'
        }
      },
      {
        anim: 'saute',
        title: { es: 'Los saltos', en: 'The jumps' },
        text: {
          es: 'Al final del calentamiento llegan los saltos. Se aterriza con suavidad: primero los dedos, luego el talón y terminando en plié.',
          en: 'Jumps come after the body is warm. You land softly: toes first, then heels, finishing in plié.'
        }
      },
      {
        anim: 'bow',
        title: { es: 'La reverencia', en: 'The révérence' },
        text: {
          es: 'La clase termina agradeciendo al profesor con una reverencia. También es buena costumbre llegar con tiempo, con ropa cómoda y el pelo recogido.',
          en: 'Class ends by thanking the teacher with a bow. It is also good manners to arrive on time, in comfortable clothes and with your hair tied back.'
        }
      }
    ],
    quiz: [
      {
        q: { es: '¿Con qué ejercicio suele empezar la barra?', en: 'Which exercise usually starts the barre?' },
        options: { es: ['Un salto', 'El plié', 'Un giro'], en: ['A jump', 'The plié', 'A turn'] },
        answer: 1
      },
      {
        q: { es: '¿Cómo termina la clase?', en: 'How does class end?' },
        options: { es: ['Con la reverencia', 'Con los pliés', 'Con el calentamiento'], en: ['With the bow', 'With pliés', 'With the warm-up'] },
        answer: 0
      },
      {
        q: { es: 'El centro son ejercicios...', en: 'The centre is exercises...' },
        options: { es: ['En el suelo', 'Solo de saltos', 'Sin barra'], en: ['On the floor', 'Only jumps', 'Away from the barre'] },
        answer: 2
      }
    ]
  },
  {
    id: 'cuida-tu-cuerpo',
    color: 'peach',
    mins: 3,
    title: { es: 'Cuida tu cuerpo', en: 'Look after your body' },
    subtitle: { es: 'Bailar con seguridad y sin lesiones.', en: 'Dancing safely and avoiding injury.' },
    cards: [
      {
        anim: 'march',
        title: { es: 'Calienta siempre', en: 'Always warm up' },
        text: {
          es: 'Antes de bailar, prepara los músculos con unos minutos de calentamiento. Un cuerpo frío se lesiona con más facilidad.',
          en: 'Before dancing, prepare your muscles with a few minutes of warming up. A cold body is more likely to get injured.'
        }
      },
      {
        anim: 'coach',
        title: { es: 'Esfuerzo o dolor', en: 'Effort or pain' },
        text: {
          es: 'Notar que los músculos trabajan es normal. Un dolor agudo, en una articulación o que no se va no lo es: para y avisa a un adulto o a un profesional.',
          en: 'Feeling your muscles work is normal. Sharp pain, pain in a joint or pain that does not go away is not: stop and tell an adult or a professional.'
        }
      },
      {
        anim: 'stand',
        title: { es: 'Ropa y suelo', en: 'Clothes and floor' },
        text: {
          es: 'Baila en un suelo firme que no resbale, con calcetines antideslizantes o zapatillas de ballet, y con ropa que te deje moverte.',
          en: 'Dance on a firm, non-slip floor, in non-slip socks or ballet shoes, and in clothes that let you move.'
        }
      },
      {
        anim: 'neck',
        title: { es: 'Bebe y descansa', en: 'Drink and rest' },
        text: {
          es: 'Bebe agua y descansa entre ejercicios. Si eres joven, tu cuerpo aún está creciendo: ve con calma y no te compares con nadie.',
          en: 'Drink water and rest between exercises. If you are young, your body is still growing: take it easy and do not compare yourself with anyone.'
        }
      },
      {
        anim: 'releve',
        title: { es: 'Las puntas', en: 'Pointe work' },
        text: {
          es: 'Las zapatillas de punta exigen mucha fuerza y años de práctica. Solo se empiezan cuando un profesor lo decide, y normalmente no antes de los 11 o 12 años.',
          en: 'Pointe shoes demand a lot of strength and years of practice. They are started only when a teacher decides, and usually not before age 11 or 12.'
        }
      }
    ],
    quiz: [
      {
        q: { es: 'Si sientes un dolor agudo, ¿qué haces?', en: 'If you feel a sharp pain, what do you do?' },
        options: {
          es: ['Sigues igual', 'Paras y avisas a un adulto', 'Bailas más rápido'],
          en: ['Carry on', 'Stop and tell an adult', 'Dance faster']
        },
        answer: 1
      },
      {
        q: { es: 'Antes de bailar...', en: 'Before dancing...' },
        options: { es: ['Calientas', 'Te sientas', 'No hace falta nada'], en: ['You warm up', 'You sit down', 'Nothing is needed'] },
        answer: 0
      },
      {
        q: { es: 'Las puntas se empiezan cuando...', en: 'Pointe work starts when...' },
        options: {
          es: ['Tú quieras', 'Un profesor lo decide', 'Compras las zapatillas'],
          en: ['You feel like it', 'A teacher decides', 'You buy the shoes']
        },
        answer: 1
      }
    ]
  }
];
