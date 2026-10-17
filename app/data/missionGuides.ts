export type GuideRound = {
  prompt: string;
  options: string[];
  answer: number;
  hint: string;
  explanation: string;
  reference: string;
  preparation?: string;
  preparationLabel?: string;
  referenceLabel?: string;
};

export type GuideActivity = {
  title: string;
  instruction: string;
  rounds: GuideRound[];
};

// Same order as lessonIds and the study catalog: one discovery, then three connections.
export const missionGuides: Array<{ discover: GuideActivity; connect: GuideActivity; finalHint: string }> = [
  {
    discover: {
      title: "Encuentra la primera luz",
      instruction: "Elige una respuesta y descubre por qué. En este primer reto te mostramos dónde empezar.",
      rounds: [
        {
          prompt: "Apocalipsis 12 relaciona la victoria con el Cordero. ¿A quién dirige nuestra atención?",
          options: ["A Cristo y su victoria", "Al poder de un imperio humano"],
          answer: 0,
          hint: "Busca la opción que pone a Cristo en el centro.",
          explanation: "La victoria se vincula con la sangre del Cordero y el testimonio. Esta es la primera clave del recorrido: estudiar la profecía desde la obra de Cristo.",
          reference: "Apocalipsis 12:10–11",
        },
      ],
    },
    connect: {
      title: "Reconoce las piezas del conflicto",
      instruction: "Relaciona cada escena con su sentido. Conservas cada conexión que aciertes.",
      rounds: [
        {
          prompt: "El dragón aparece como engañador en Apocalipsis 12. ¿Con qué acción se relaciona?",
          options: ["Restaurar la creación", "Engañar al mundo", "Dar el reino al Hijo del Hombre"],
          answer: 1,
          hint: "Observa cómo el versículo 9 describe lo que hace el dragón.",
          explanation: "El pasaje identifica al dragón con el diablo y Satanás y describe su engaño. La imagen sitúa el conflicto más allá de los acontecimientos visibles.",
          reference: "Apocalipsis 12:9",
        },
        {
          prompt: "La sangre del Cordero y el testimonio aparecen juntos. ¿Qué explican en esta escena?",
          options: ["La fecha del regreso de Cristo", "El tamaño de un ejército", "La victoria frente al acusador"],
          answer: 2,
          hint: "En el versículo 11, busca por medio de qué vencen.",
          explanation: "La escena atribuye la victoria a la sangre del Cordero y al testimonio. No invita a calcular una fecha ni a medir fuerzas militares.",
          reference: "Apocalipsis 12:10–11",
        },
        {
          prompt: "Efesios 6 describe una armadura espiritual. ¿Qué actitud encaja con esa imagen?",
          options: ["Mantenerse firme con verdad, fe y oración", "Tratar a las personas como enemigos que hay que atacar", "Abandonar toda esperanza ante el conflicto"],
          answer: 0,
          hint: "Busca los elementos de la armadura y el llamado a orar.",
          explanation: "La verdad, la justicia, la fe y la oración forman parte de esta respuesta espiritual. El pasaje aclara que la lucha no es contra personas de carne y sangre.",
          reference: "Efesios 6:12–18",
        },
      ],
    },
    finalHint: "Vuelve a la conexión entre el Cordero y la victoria. El centro del recorrido es Cristo y la restauración que trae.",
  },
  {
    discover: {
      title: "Aprende a mirar el texto",
      instruction: "Busca la invitación con la que comienza Apocalipsis.",
      rounds: [
        {
          prompt: "Apocalipsis 1:3 une leer, oír y guardar. ¿Qué manera de estudiar propone?",
          options: ["Adivinar fechas a partir de noticias", "Escuchar el mensaje y tomarlo en serio"],
          answer: 1,
          hint: "Fíjate en las acciones de quienes reciben el mensaje.",
          explanation: "La apertura llama a leer, oír y guardar lo escrito. Antes de buscar conexiones, conviene atender al mensaje que el propio libro presenta.",
          reference: "Apocalipsis 1:1–3",
        },
      ],
    },
    connect: {
      title: "Deja que el pasaje explique",
      instruction: "Une cada símbolo o estructura con la explicación que le corresponde.",
      rounds: [
        {
          prompt: "Daniel le dice a Nabucodonosor que él es la cabeza de oro. ¿Qué clase de evidencia tenemos aquí?",
          options: ["Una identificación dada dentro del pasaje", "Una semejanza con una noticia actual", "Una fecha calculada fuera del texto"],
          answer: 0,
          hint: "La explicación la da Daniel al hablar con el rey.",
          explanation: "Daniel identifica a Nabucodonosor con la cabeza de oro dentro de la interpretación del sueño. La identificación procede del propio pasaje.",
          reference: "Daniel 2:37–38",
        },
        {
          prompt: "Daniel 7 explica sus cuatro bestias. ¿Con qué las relaciona?",
          options: ["Cuatro estaciones del año", "Cuatro reyes o reinos", "Cuatro materiales del santuario"],
          answer: 1,
          hint: "Lee la explicación del versículo 17 y cómo se describe la cuarta bestia en el 23.",
          explanation: "La propia visión relaciona las bestias con reyes y reinos. Este significado pertenece al contexto de Daniel 7; no convierte a todo animal bíblico en un reino.",
          reference: "Daniel 7:17, 23",
        },
        {
          prompt: "Daniel 2 y 7 muestran una sucesión de reinos y el reino de Dios. ¿Cómo los compara esta guía?",
          options: ["Como relatos que no pueden compararse", "Como una lista de noticias por adivinar", "Como panoramas que repiten y amplían el recorrido"],
          answer: 2,
          hint: "Busca el recorrido compartido y observa qué detalles añade cada visión.",
          explanation: "Esta guía emplea la repetición y ampliación para comparar las visiones. Conserva sus diferencias: la estatua y las bestias presentan perspectivas complementarias.",
          reference: "Daniel 2:37–44; 7:17–18",
        },
      ],
    },
    finalHint: "Empieza por el contexto y la explicación del propio pasaje. En el sueño de Daniel, sigue los materiales y observa cómo termina el recorrido.",
  },
  {
    discover: {
      title: "Encuentra el asunto de la visión",
      instruction: "Relaciona la pregunta de Daniel 8 con el tema del pasaje.",
      rounds: [
        {
          prompt: "Daniel 8:13–14 menciona las 2.300 tardes y mañanas. ¿Qué tema aparece en esa conversación?",
          options: ["El santuario", "La construcción de un palacio"],
          answer: 0,
          hint: "Busca qué lugar se menciona en la pregunta y en la respuesta.",
          explanation: "El diálogo trata del santuario y de lo que ocurre con él. Identificar primero este asunto evita reducir la visión a una cifra aislada.",
          reference: "Daniel 8:13–14",
        },
      ],
    },
    connect: {
      title: "Une tiempo, Mesías y santuario",
      instruction: "Conecta tres detalles de los pasajes antes de interpretar la cronología.",
      rounds: [
        {
          prompt: "Daniel 9:25 habla de una orden. ¿Qué acción señala esa orden?",
          options: ["Levantar otra estatua de oro", "Restaurar y edificar Jerusalén", "Anunciar una fecha moderna para el regreso de Cristo"],
          answer: 1,
          hint: "Observa el lugar que se debe restaurar y edificar.",
          explanation: "El pasaje menciona la orden para restaurar y edificar Jerusalén. Su identificación histórica y el cálculo cronológico requieren argumentos adicionales, que esta guía presenta como interpretación.",
          reference: "Daniel 9:25",
        },
        {
          prompt: "Junto al tiempo profético, Daniel 9:25–26 menciona a una figura central. ¿A quién?",
          options: ["Al dragón", "Al rey de una noticia actual", "Al Mesías"],
          answer: 2,
          hint: "Busca la figura que recibe el nombre de Mesías en ambos versículos.",
          explanation: "El Mesías ocupa un lugar central en el pasaje. La lectura del tiempo profético conserva esa conexión con su obra.",
          reference: "Daniel 9:25–26",
        },
        {
          prompt: "Hebreos 9:24 sitúa a Cristo en el cielo. ¿Qué hace allí según el pasaje?",
          options: ["Se presenta por nosotros ante Dios", "Anuncia un nuevo imperio terrestre", "Deja de ocuparse de la humanidad"],
          answer: 0,
          hint: "Presta atención a las palabras que explican por quién se presenta.",
          explanation: "Hebreos describe a Cristo presentándose por nosotros ante Dios. Este ministerio celestial es parte del enfoque que la interpretación adventista relaciona con el santuario.",
          reference: "Hebreos 9:23–28",
        },
      ],
    },
    finalHint: "La guía distingue una expectativa sobre la Tierra del estudio del ministerio celestial de Cristo. Recuerda hacia dónde se dirigió ese estudio después del Gran Chasco.",
  },
  {
    discover: {
      title: "Observa la escena del juicio",
      instruction: "Encuentra un detalle que Daniel describe en su visión.",
      rounds: [
        {
          prompt: "Cuando se establece el juicio en Daniel 7, ¿qué ocurre con los libros?",
          options: ["Desaparecen de la escena", "Se abren"],
          answer: 1,
          hint: "Busca el final de Daniel 7:10.",
          explanation: "Daniel presenta un tribunal y la apertura de libros. La guía relaciona esta escena con la justicia y con el reino que recibe el Hijo del Hombre.",
          reference: "Daniel 7:9–10",
        },
      ],
    },
    connect: {
      title: "Sigue el ministerio de Cristo",
      instruction: "Une las imágenes del santuario y del juicio con lo que explican los pasajes.",
      rounds: [
        {
          prompt: "Hebreos 9:24 compara un santuario hecho por manos humanas con una realidad mayor. ¿Cuál?",
          options: ["Un palacio real", "Una ciudad amurallada", "El cielo, donde Cristo se presenta por nosotros"],
          answer: 2,
          hint: "El pasaje distingue la figura terrenal del lugar al que entró Cristo.",
          explanation: "El santuario terrenal sirve como figura pedagógica. Hebreos dirige la atención a Cristo, que se presenta por nosotros en el cielo.",
          reference: "Hebreos 9:24",
        },
        {
          prompt: "Hebreos 9:28 habla de la ofrenda de Cristo. ¿Qué destaca?",
          options: ["Se ofreció una vez para llevar los pecados", "Debe repetir su sacrificio cada día", "Su obra depende de que sepamos todas las fechas"],
          answer: 0,
          hint: "Busca cuántas veces se ofreció y para qué.",
          explanation: "El pasaje destaca la ofrenda de Cristo una vez para llevar los pecados. La confianza de esta guía descansa en su obra salvadora.",
          reference: "Hebreos 9:28",
        },
        {
          prompt: "En Daniel 7, alguien recibe dominio y un reino que permanece. ¿Quién es?",
          options: ["La cuarta bestia", "El Hijo del Hombre", "Un nuevo rey de Babilonia"],
          answer: 1,
          hint: "Observa quién se acerca al Anciano de días.",
          explanation: "El Hijo del Hombre recibe dominio, gloria y reino. La escena une el juicio con un horizonte de gobierno duradero.",
          reference: "Daniel 7:13–14",
        },
      ],
    },
    finalHint: "Vuelve a la ofrenda y al ministerio de Cristo. El juicio no transforma la salvación en un premio que ganamos acumulando obras.",
  },
  {
    discover: {
      title: "Escucha el alcance del mensaje",
      instruction: "Identifica a quién se dirige el primer anuncio de Apocalipsis 14.",
      rounds: [
        {
          prompt: "El ángel lleva el evangelio eterno. ¿A quién se anuncia?",
          options: ["A toda nación, pueblo y lengua", "Solo a una pequeña élite"],
          answer: 0,
          hint: "Observa cuántos pueblos y lenguas abarca el versículo 6.",
          explanation: "El anuncio tiene alcance universal. Su comienzo es el evangelio eterno, que enmarca las advertencias posteriores.",
          reference: "Apocalipsis 14:6",
        },
      ],
    },
    connect: {
      title: "Conecta las voces del anuncio",
      instruction: "Relaciona cada parte del mensaje con la idea que destaca.",
      rounds: [
        {
          prompt: "El primer ángel menciona a quien hizo el cielo, la tierra y el mar. ¿A qué invita?",
          options: ["A fijar una fecha para el fin", "A adorar al Creador", "A adorar un poder humano"],
          answer: 1,
          hint: "Busca la acción que acompaña la mención de la creación.",
          explanation: "El primer mensaje une juicio, creación y adoración. La invitación a adorar se dirige al Creador.",
          reference: "Apocalipsis 14:7",
        },
        {
          prompt: "El segundo ángel menciona a Babilonia. ¿Qué anuncio hace?",
          options: ["Que su poder durará para siempre", "Que es el nombre del Creador", "Que ha caído"],
          answer: 2,
          hint: "La declaración del versículo 8 repite lo ocurrido con Babilonia.",
          explanation: "El segundo mensaje anuncia la caída de Babilonia. Reconocer esa declaración es un primer paso antes de estudiar su simbolismo y aplicación.",
          reference: "Apocalipsis 14:8",
        },
        {
          prompt: "Al terminar esta secuencia, Apocalipsis 14:12 destaca la perseverancia. ¿Con qué la relaciona?",
          options: ["Con guardar los mandamientos de Dios y la fe de Jesús", "Con acertar todas las fechas", "Con condenar a quien piensa diferente"],
          answer: 0,
          hint: "Busca las dos expresiones que describen a quienes perseveran.",
          explanation: "El pasaje une perseverancia, mandamientos de Dios y fe de Jesús. Esta descripción orienta hacia la fidelidad y no autoriza condenar a personas por su pertenencia religiosa.",
          reference: "Apocalipsis 14:12",
        },
      ],
    },
    finalHint: "Regresa al comienzo del versículo 6: antes de las advertencias aparece el evangelio eterno.",
  },
  {
    discover: {
      title: "Reconoce la presión",
      instruction: "Distingue una invitación libre de una orden acompañada de amenaza.",
      rounds: [
        {
          prompt: "En Daniel 3 se exige adorar una estatua bajo amenaza de castigo. ¿Qué clase de situación es?",
          options: ["Una elección sin presión", "Adoración impuesta"],
          answer: 1,
          hint: "Observa qué se anuncia para quien no se arrodille.",
          explanation: "La orden une adoración y castigo. Daniel 3 ofrece el patrón bíblico de una autoridad que intenta imponer una práctica religiosa.",
          reference: "Daniel 3:5–6",
        },
      ],
    },
    connect: {
      title: "Une fidelidad y conciencia",
      instruction: "Relaciona las escenas de presión con decisiones que respetan la conciencia.",
      rounds: [
        {
          prompt: "Los tres jóvenes creen que Dios puede librarlos, pero añaden que seguirán fieles aunque no lo haga. ¿Qué expresa esa decisión?",
          options: ["Fidelidad incluso sin garantía de rescate", "Una promesa de que nunca habrá dificultades", "Aceptación de la adoración impuesta"],
          answer: 0,
          hint: "Lee lo que mantienen después de decir que Dios puede librarlos.",
          explanation: "Los jóvenes rechazan la adoración a la estatua sin convertir su fidelidad en un trato condicionado al rescate. La escena toma en serio su decisión de conciencia.",
          reference: "Daniel 3:16–18",
        },
        {
          prompt: "Apocalipsis 13 vincula adoración, amenaza y restricciones para comprar o vender. ¿Qué relación conviene observar primero?",
          options: ["La semejanza con cualquier objeto tecnológico", "La presión ejercida para obtener lealtad", "Una fecha que el pasaje no ofrece"],
          answer: 1,
          hint: "Lee juntas las exigencias de adoración y las consecuencias de no cumplirlas.",
          explanation: "El contexto describe un sistema de presión y adoración. La guía parte de esa relación; no identifica automáticamente una tecnología actual con la marca.",
          reference: "Apocalipsis 13:15–17",
        },
        {
          prompt: "Al aplicar el contraste de Daniel 3 a una conversación religiosa, ¿qué conducta respeta la conciencia?",
          options: ["Amenazar para obtener acuerdo", "Ridiculizar a quien se niega", "Permitir que la otra persona discrepe sin coacción"],
          answer: 2,
          hint: "Evita repetir la presión que el relato muestra contra quienes no adoran la estatua.",
          explanation: "Esta es una aplicación del contraste de la historia: sostener una convicción no exige obligar a otros. La guía propone tratar con respeto a las personas aunque haya desacuerdo religioso.",
          reference: "Daniel 3:16–18",
        },
      ],
    },
    finalHint: "Distingue el análisis de un sistema del trato a una persona. La libertad de conciencia también pertenece a quienes no comparten tus creencias.",
  },
  {
    discover: {
      title: "Escucha la imagen de Jesús",
      instruction: "Relaciona las palabras de Jesús con la explicación que él mismo da.",
      rounds: [
        {
          prompt: "Jesús dice que Lázaro duerme y después aclara que ha muerto. ¿Qué imagen utiliza para hablar de la muerte?",
          options: ["El sueño", "Un viaje que permite fijar el día del regreso"],
          answer: 0,
          hint: "Compara lo que Jesús dice en los versículos 11 y 14.",
          explanation: "Jesús usa la imagen del sueño y aclara su sentido. En esta guía, esa imagen conduce a la esperanza de la resurrección.",
          reference: "Juan 11:11–14",
        },
      ],
    },
    connect: {
      title: "Conecta esperanza y cuidado",
      instruction: "Une cada pasaje con una forma de comprender y acompañar.",
      rounds: [
        {
          prompt: "En 1 Tesalonicenses 4, ¿qué ocurre con quienes murieron en Cristo cuando él desciende?",
          options: ["Se revela una fecha para calcular", "Resucitan", "Quedan fuera de toda esperanza"],
          answer: 1,
          hint: "Busca lo que el versículo 16 afirma de los muertos en Cristo.",
          explanation: "El pasaje sitúa la resurrección en la venida del Señor. Allí coloca la esperanza del reencuentro, sin ofrecer una fecha para calcular.",
          reference: "1 Tesalonicenses 4:13–17",
        },
        {
          prompt: "Después de hablar de la resurrección, Pablo pide animarse unos a otros. ¿Qué respuesta encaja al acompañar un duelo?",
          options: ["Exigir que la persona deje de sentir tristeza", "Juzgar su fe por sus lágrimas", "Escuchar y acompañar con esperanza"],
          answer: 2,
          hint: "La invitación final del pasaje es de consuelo mutuo.",
          explanation: "Pablo reconoce la tristeza y ofrece esperanza, y termina invitando al consuelo. La aplicación de esta guía es acompañar con cuidado, sin juzgar a quien está de duelo.",
          reference: "1 Tesalonicenses 4:13, 18",
        },
        {
          prompt: "Eclesiastés 9 contrasta la vida y la muerte. ¿En qué momento sitúa el trabajo y las acciones que podemos realizar?",
          options: ["Durante la vida, mientras tenemos oportunidad", "Después de morir, como si nada hubiera cambiado", "Únicamente cuando sepamos una fecha para el fin"],
          answer: 0,
          hint: "El versículo 10 invita a actuar con empeño y contrasta esa posibilidad con la muerte.",
          explanation: "El pasaje invita a hacer con empeño lo que tenemos a mano durante la vida. Esta guía une ese valor del presente con la esperanza futura de la resurrección.",
          reference: "Eclesiastés 9:5–10",
        },
      ],
    },
    finalHint: "Une la imagen del sueño con lo que 1 Tesalonicenses 4 anuncia en la venida de Cristo: la resurrección.",
  },
  {
    discover: {
      title: "Encuentra el horizonte",
      instruction: "Identifica la promesa que cierra el recorrido con esperanza.",
      rounds: [
        {
          prompt: "Apocalipsis 21:4 describe la creación renovada. ¿Qué anuncia sobre el dolor y la muerte?",
          options: ["Que continuarán para siempre", "Que dejarán de existir"],
          answer: 1,
          hint: "Observa las cosas que el pasaje dice que ya no habrá.",
          explanation: "La visión anuncia el fin de la muerte, el llanto y el dolor. Ese horizonte de restauración da sentido al recorrido de esta guía.",
          reference: "Apocalipsis 21:1–4",
        },
      ],
    },
    connect: {
      title: "Une las promesas del reencuentro",
      instruction: "Conecta tres promesas que explican hacia dónde se dirige la esperanza.",
      rounds: [
        {
          prompt: "Jesús promete volver en Juan 14. ¿Para qué dice que volverá?",
          options: ["Para revelar una nueva fecha secreta", "Para dejar solos a sus discípulos", "Para recibirlos y que estén con él"],
          answer: 2,
          hint: "Busca el propósito de la promesa en el versículo 3.",
          explanation: "La promesa se centra en estar con Jesús. El pasaje ofrece confianza y un destino compartido con él.",
          reference: "Juan 14:1–3",
        },
        {
          prompt: "1 Tesalonicenses 4 une resurrección y encuentro con el Señor. ¿Cómo describe lo que sigue?",
          options: ["Estar siempre con el Señor", "Comenzar otro conflicto sin fin", "Perder toda relación con quienes resucitan"],
          answer: 0,
          hint: "Lee la frase que cierra el versículo 17.",
          explanation: "El encuentro culmina en estar siempre con el Señor. La esperanza del pasaje es relacional y permite consolarse mutuamente.",
          reference: "1 Tesalonicenses 4:16–18",
        },
        {
          prompt: "En Apocalipsis 21:3 se anuncia la morada de Dios. ¿Con quién habitará?",
          options: ["Solo con los gobernantes de un imperio", "Con la humanidad, como su Dios", "Lejos de la creación renovada"],
          answer: 1,
          hint: "Observa con quién estará Dios y quiénes serán su pueblo.",
          explanation: "La visión anuncia la presencia de Dios con su pueblo. El final del relato es una vida restaurada en su compañía.",
          reference: "Apocalipsis 21:3–4",
        },
      ],
    },
    finalHint: "Recuerda qué desaparece y quién habita con su pueblo en Apocalipsis 21. El horizonte es la restauración y la vida con Dios.",
  },
];

// Short readings for the final question. Historical context and applications
// are identified separately from the biblical text shown above them.
export const finalReadings: Array<Pick<GuideRound, "reference" | "preparation" | "preparationLabel" | "referenceLabel">> = [
  { reference: "Apocalipsis 12:10–11; 21:3–4" },
  { reference: "Daniel 7:17, 23", preparation: "Antes de interpretar un símbolo, exploramos su contexto literario, bíblico e histórico. El texto y sus paralelos orientan la interpretación." },
  { reference: "Hebreos 9:24", referenceLabel: "Pasaje sobre el ministerio de Cristo", preparationLabel: "Contexto histórico adventista", preparation: "Después del Gran Chasco, el estudio adventista pasó de esperar un acontecimiento en la Tierra a estudiar el ministerio celestial de Cristo. Hebreos describe ese ministerio; no relata el episodio histórico del Gran Chasco." },
  { reference: "Hebreos 10:10, 14", preparation: "La salvación descansa en la gracia y los méritos de Cristo. Su ofrenda y su ministerio sostienen la confianza; el juicio no convierte la salvación en un logro por obras." },
  { reference: "Apocalipsis 14:6–7" },
  { reference: "Daniel 3:16–18", preparationLabel: "Aplicación de la guía", preparation: "Daniel 3 presenta fidelidad frente a una orden de adoración impuesta. La aplicación de esta guía es respetar a cada persona y su libertad de conciencia, también cuando pertenece a otra tradición religiosa." },
  { reference: "1 Tesalonicenses 4:16–18", preparation: "La esperanza frente a la muerte descansa en la resurrección en la venida de Cristo. Esta promesa permite acompañar el duelo con esperanza." },
  { reference: "Apocalipsis 21:3–4" },
];
