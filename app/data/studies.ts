export type Source = {
  label: string;
  kind: "Biblia" | "Iglesia Adventista" | "Elena G. de White" | "Esteban Bohr" | "Investigación bíblica" | "Contexto histórico";
  url?: string;
};

export type StudyModule = {
  id: string;
  number: string;
  title: string;
  eyebrow: string;
  summary: string;
  question: string;
  duration: string;
  notebookUrl: string;
  tags: string[];
  verses: string[];
  observations: string[];
  sources: Source[];
};

export const modules: StudyModule[] = [
  {
    id: "gran-conflicto",
    number: "01",
    title: "El gran conflicto",
    eyebrow: "La llave de lectura",
    summary: "La historia bíblica presenta un conflicto acerca del carácter de Dios, la libertad y las consecuencias del pecado.",
    question: "¿Cómo cambia nuestra lectura de la profecía cuando Cristo —y no el miedo— ocupa el centro?",
    duration: "14 min",
    notebookUrl: "https://notebook.google.com/notebook/f4668d2f-17d2-4797-b44e-122e9109e13d",
    tags: ["Biblia", "Esperanza"],
    verses: ["Apocalipsis 12:7–12", "Génesis 3:1–15", "Efesios 6:10–18"],
    observations: [
      "Apocalipsis 12 coloca detrás de la historia visible un conflicto de alcance cósmico.",
      "La cruz presenta la victoria decisiva de Cristo y revela el carácter de Dios.",
      "La profecía culmina en restauración, justicia transparente y el fin definitivo del mal.",
    ],
    sources: [
      { label: "Apocalipsis 12 · RVR1960", kind: "Biblia", url: "https://www.bible.com/es/bible/149/REV.12.RVR1960" },
      { label: "Creencia 8 · El gran conflicto", kind: "Iglesia Adventista", url: "https://institucional.adventistas.org/es/nuestras-crencias/8-el-gran-conflicto/" },
      { label: "El conflicto de los siglos · cap. 30", kind: "Elena G. de White", url: "https://text.egwwritings.org/read/1710.2276" },
      { label: "Descubriendo los misterios de Génesis", kind: "Esteban Bohr", url: "https://sumtvlatino.org/programas/descubriendo-los-misterios-de-genesis" },
      { label: "El evangelio de Jesucristo y el Imperio romano", kind: "Contexto histórico", url: "https://revistas.comillas.edu/estudioseclesiasticos/es/article/view/8243" },
    ],
  },
  {
    id: "leer-profecia",
    number: "02",
    title: "Cómo leer la profecía",
    eyebrow: "Método antes que titulares",
    summary: "Contexto, símbolos y paralelos bíblicos permiten estudiar Daniel y Apocalipsis sin especulación apresurada.",
    question: "¿Qué cambia cuando dejamos que las estructuras del texto guíen la interpretación?",
    duration: "16 min",
    notebookUrl: "https://notebook.google.com/notebook/f8df7d61-e213-44f2-9af3-b8078f531249",
    tags: ["Daniel", "Apocalipsis"],
    verses: ["Daniel 2 y 7", "Apocalipsis 1:1–3", "2 Pedro 1:19–21"],
    observations: [
      "Daniel 2 y 7 repiten y amplían una secuencia histórica desde perspectivas complementarias.",
      "Los símbolos deben estudiarse primero en su contexto literario, bíblico e histórico.",
      "El principio día-año se argumenta para períodos apocalípticos simbólicos; no se aplica mecánicamente a toda cifra.",
    ],
    sources: [
      { label: "Daniel 2 · RVR1960", kind: "Biblia", url: "https://www.bible.com/es/bible/149/DAN.2.RVR1960" },
      { label: "Creencia 1 · Las Sagradas Escrituras", kind: "Iglesia Adventista", url: "https://institucional.adventistas.org/es/nuestras-crencias/1-las-escrituras-sagradas/" },
      { label: "Métodos de estudio de la Biblia", kind: "Investigación bíblica", url: "https://adventistbiblicalresearch.org/articles/metodos-de-estudio-de-la-biblia" },
      { label: "El conflicto de los siglos · cap. 38", kind: "Elena G. de White", url: "https://text.egwwritings.org/read/1710.2712" },
      { label: "15 principios de interpretación", kind: "Esteban Bohr", url: "https://sumtvlatino.org/programas/15-principios-de-interpretacion-como-estudiar-las-profecias-por-si-mismo" },
      { label: "La teoría histórica de los cuatro imperios", kind: "Contexto histórico", url: "https://dialnet.unirioja.es/servlet/articulo?codigo=5026720" },
    ],
  },
  {
    id: "daniel-ocho-nueve",
    number: "03",
    title: "Daniel 8–9 y 1844",
    eyebrow: "Mesías, tiempo y santuario",
    summary: "La lectura historicista adventista conecta las setenta semanas, las 2.300 tardes-mañanas y la purificación del santuario.",
    question: "¿Cómo se construye la cronología y por qué 1844 no significaba el regreso de Cristo?",
    duration: "20 min",
    notebookUrl: "https://notebook.google.com/notebook/ffbec6d1-94be-43ae-9d98-1ac689c83dca",
    tags: ["Daniel", "Historia"],
    verses: ["Daniel 8:13–14", "Daniel 9:20–27", "Hebreos 9:23–28"],
    observations: [
      "La interpretación adventista relaciona Daniel 8 y 9 como una sola secuencia explicativa.",
      "El decreto de 457 a. C. funciona como punto de partida; el cálculo debe considerar que no existe año cero.",
      "Después del Gran Chasco, el foco pasó de un evento en la Tierra al ministerio de Cristo en el santuario celestial.",
    ],
    sources: [
      { label: "Daniel 8 · RVR1960", kind: "Biblia", url: "https://www.bible.com/es/bible/149/DAN.8.RVR1960" },
      { label: "Daniel 9 · RVR1960", kind: "Biblia", url: "https://www.bible.com/es/bible/149/DAN.9.RVR1960" },
      { label: "Creencia 24 · El santuario celestial", kind: "Iglesia Adventista", url: "https://institucional.adventistas.org/es/nuestras-crencias/24-el-ministerio-de-cristo-en-el-santuario-celestial/" },
      { label: "El santuario y su purificación", kind: "Investigación bíblica", url: "https://adventistbiblicalresearch.org/articles/el-santuario-y-su-purificacion" },
      { label: "El conflicto de los siglos · cap. 24", kind: "Elena G. de White", url: "https://text.egwwritings.org/read/1710.1914" },
      { label: "El movimiento millerita y el Gran Chasco", kind: "Contexto histórico", url: "https://noticias.adventistas.org/es/columna/edegar.link/el-movimiento-millerita-y-el-gran-chasco/" },
    ],
  },
  {
    id: "santuario-juicio",
    number: "04",
    title: "Santuario y juicio",
    eyebrow: "Gracia, intercesión y justicia",
    summary: "El santuario conecta el sacrificio de Cristo, su intercesión y el juicio previo a la Segunda Venida.",
    question: "¿Puede el juicio ser una buena noticia para quien confía en Cristo?",
    duration: "18 min",
    notebookUrl: "https://notebook.google.com/notebook/03d5b4a6-e253-4245-9346-e59a0d074179",
    tags: ["Daniel", "Esperanza"],
    verses: ["Levítico 16", "Daniel 7:9–14", "Hebreos 7–10"],
    observations: [
      "El santuario terrenal sirve como tipo pedagógico del ministerio salvador de Cristo.",
      "Daniel 7 presenta juicio, apertura de libros y recepción del reino por el Hijo del Hombre.",
      "La salvación descansa en la gracia y los méritos de Cristo; el juicio no es salvación por obras.",
    ],
    sources: [
      { label: "Levítico 16 · RVR1960", kind: "Biblia", url: "https://www.bible.com/es/bible/149/LEV.16.RVR1960" },
      { label: "Hebreos 9 · RVR1960", kind: "Biblia", url: "https://www.bible.com/es/bible/149/HEB.9.RVR1960" },
      { label: "Creencia 24 · El santuario celestial", kind: "Iglesia Adventista", url: "https://institucional.adventistas.org/es/nuestras-crencias/24-el-ministerio-de-cristo-en-el-santuario-celestial/" },
      { label: "La actividad de Cristo en el santuario", kind: "Investigación bíblica", url: "https://adventistbiblicalresearch.org/articles/la-actividad-de-cristo-en-el-santuario" },
      { label: "El conflicto de los siglos · cap. 29", kind: "Elena G. de White", url: "https://text.egwwritings.org/publication.php?bookCode=CS&pagenumber=471&pubtype=Book" },
      { label: "Objetos del Santuario en la historia judía", kind: "Contexto histórico", url: "https://www.cultura.gob.es/msefardi/colecciones/piezas-destacadas/repostero.html" },
    ],
  },
  {
    id: "tres-angeles",
    number: "05",
    title: "Los tres ángeles",
    eyebrow: "Evangelio, adoración y misión",
    summary: "Apocalipsis 14 reúne el evangelio eterno, el juicio, la adoración al Creador y una invitación a la fidelidad.",
    question: "¿Por qué el mensaje final comienza con el evangelio eterno?",
    duration: "17 min",
    notebookUrl: "https://notebook.google.com/notebook/4352a0ca-086c-409c-ac43-02122d791896",
    tags: ["Apocalipsis", "Esperanza"],
    verses: ["Apocalipsis 10", "Apocalipsis 12:17", "Apocalipsis 14:6–12"],
    observations: [
      "El evangelio eterno enmarca cada advertencia y evita una lectura centrada en el temor.",
      "Juicio, creación y adoración aparecen unidos en el primer mensaje.",
      "La misión remanente no declara que todo adventista esté salvo ni que todo no adventista esté perdido.",
    ],
    sources: [
      { label: "Apocalipsis 14 · RVR1960", kind: "Biblia", url: "https://www.bible.com/es/bible/149/REV.14.RVR1960" },
      { label: "Creencia 13 · Remanente y misión", kind: "Iglesia Adventista", url: "https://institucional.adventistas.org/es/nuestras-crencias/13-el-remanente-y-su-mision/" },
      { label: "Profecía cumplida", kind: "Investigación bíblica", url: "https://adventistbiblicalresearch.org/articles/profecia-cumplida" },
      { label: "El conflicto de los siglos · cap. 39", kind: "Elena G. de White", url: "https://text.egwwritings.org/read/1710.2757" },
      { label: "El mensaje de los tres ángeles", kind: "Esteban Bohr", url: "https://sumtvlatino.org/programas/el-mensaje-de-los-tres-angeles" },
      { label: "Orígenes adventistas en Bucaramanga, 1928–1946", kind: "Contexto histórico", url: "https://historiayespacio.univalle.edu.co/index.php/historia_y_espacio/article/view/10796" },
    ],
  },
  {
    id: "adoracion-libertad",
    number: "06",
    title: "Adoración y libertad",
    eyebrow: "Conciencia frente a coerción",
    summary: "Daniel 3 y Apocalipsis 13 muestran un conflicto de adoración donde la fidelidad y la libertad de conciencia son decisivas.",
    question: "¿Cómo hablar de poderes y sistemas sin atacar a las personas que pertenecen a ellos?",
    duration: "19 min",
    notebookUrl: "https://notebook.google.com/notebook/1c8d519c-e3a3-4534-9872-6c41f2ec16db",
    tags: ["Apocalipsis", "Historia"],
    verses: ["Daniel 3", "Daniel 7:25", "Apocalipsis 13–14"],
    observations: [
      "Daniel 3 ofrece un patrón bíblico de adoración impuesta por poder político.",
      "La lectura adventista relaciona la señal del Creador, la ley de Dios y la lealtad en el conflicto final.",
      "No existe base responsable para identificar automáticamente chips, vacunas o monedas digitales como la marca de la bestia.",
    ],
    sources: [
      { label: "Daniel 3 · RVR1960", kind: "Biblia", url: "https://www.bible.com/es/bible/149/DAN.3.RVR1960" },
      { label: "Apocalipsis 13 · RVR1960", kind: "Biblia", url: "https://www.bible.com/es/bible/149/REV.13.RVR1960" },
      { label: "Libertad religiosa", kind: "Iglesia Adventista", url: "https://institucional.adventistas.org/es/quienes-somos/mision-y-servicio/libertad-religiosa/" },
      { label: "Marca de la bestia y eventos finales", kind: "Investigación bíblica", url: "https://adventistbiblicalresearch.org/articles/respuestas-a-preguntas-sobre-la-marca-de-la-bestia-y-los-eventos-finalessup1sup" },
      { label: "El conflicto de los siglos · cap. 36", kind: "Elena G. de White", url: "https://text.egwwritings.org/read/1710.2585" },
      { label: "Declaración Universal · libertad de conciencia", kind: "Contexto histórico", url: "https://www.un.org/es/about-us/universal-declaration-of-human-rights" },
    ],
  },
  {
    id: "muerte-discernimiento",
    number: "07",
    title: "Muerte y discernimiento",
    eyebrow: "Esperanza frente al engaño",
    summary: "La esperanza bíblica descansa en la resurrección, mientras la Escritura se convierte en criterio de discernimiento.",
    question: "¿Cómo puede la doctrina de la resurrección sostener a una persona en duelo?",
    duration: "15 min",
    notebookUrl: "https://notebook.google.com/notebook/6ebd6b35-a681-4de2-bcc9-7e364eb245d6",
    tags: ["Biblia", "Esperanza"],
    verses: ["Eclesiastés 9:5–10", "Juan 11:11–14", "1 Tesalonicenses 4:13–18"],
    observations: [
      "La muerte es descrita como sueño hasta la resurrección en la venida de Cristo.",
      "Isaías 8 dirige toda experiencia espiritual hacia la prueba de la revelación bíblica.",
      "El discernimiento religioso nunca debe usarse para estigmatizar el duelo o los problemas de salud mental.",
    ],
    sources: [
      { label: "Eclesiastés 9 · RVR1960", kind: "Biblia", url: "https://www.bible.com/es/bible/149/ECC.9.RVR1960" },
      { label: "1 Tesalonicenses 4 · RVR1960", kind: "Biblia", url: "https://www.bible.com/es/bible/149/1TH.4.RVR1960" },
      { label: "Creencia 26 · Muerte y resurrección", kind: "Iglesia Adventista", url: "https://institucional.adventistas.org/es/nuestras-crencias/26-la-muerte-y-la-resurreccion/" },
      { label: "El conflicto de los siglos · cap. 35", kind: "Elena G. de White", url: "https://text.egwwritings.org/read/1710.2539" },
      { label: "Los inicios del espiritismo en España", kind: "Contexto histórico", url: "https://asclepio.revistas.csic.es/index.php/asclepio/article/view/22" },
    ],
  },
  {
    id: "venida-tierra-nueva",
    number: "08",
    title: "Venida y Tierra Nueva",
    eyebrow: "El final es un comienzo",
    summary: "La Segunda Venida visible, el milenio, el fin del pecado y la Tierra Nueva forman el horizonte de esperanza.",
    question: "¿Qué clase de vida presente inspira la promesa de una creación restaurada?",
    duration: "16 min",
    notebookUrl: "https://notebook.google.com/notebook/753006c4-4260-4002-8ce8-1331ae25b0e3",
    tags: ["Apocalipsis", "Esperanza"],
    verses: ["Juan 14:1–3", "1 Tesalonicenses 4:13–18", "Apocalipsis 19–22"],
    observations: [
      "La venida de Cristo se presenta como personal, visible y universal; su fecha no ha sido revelada.",
      "La lectura adventista sitúa el milenio en el cielo entre las dos resurrecciones.",
      "El relato concluye con el fin del mal y la presencia de Dios en una creación renovada.",
    ],
    sources: [
      { label: "Apocalipsis 20 · RVR1960", kind: "Biblia", url: "https://www.bible.com/es/bible/149/REV.20.RVR1960" },
      { label: "Apocalipsis 21 · RVR1960", kind: "Biblia", url: "https://www.bible.com/es/bible/149/REV.21.RVR1960" },
      { label: "Creencia 25 · La Segunda Venida", kind: "Iglesia Adventista", url: "https://institucional.adventistas.org/es/nuestras-crencias/25-la-segunda-venida-de-cristo/" },
      { label: "Creencia 27 · El milenio", kind: "Iglesia Adventista", url: "https://institucional.adventistas.org/es/nuestras-crencias/27-el-milenio-y-el-fin-del-pecado/" },
      { label: "Creencia 28 · La Tierra Nueva", kind: "Iglesia Adventista", url: "https://institucional.adventistas.org/es/nuestras-crencias/28-la-tierra-nueva/" },
      { label: "El conflicto de los siglos · cap. 43", kind: "Elena G. de White", url: "https://text.egwwritings.org/read/1710.3009" },
      { label: "La Gran Cadena Profética", kind: "Esteban Bohr", url: "https://sumtvlatino.org/programas/la-gran-cadena-profetica" },
      { label: "Una tipología histórica de las profecías milenaristas", kind: "Contexto histórico", url: "https://revistas.ucm.es/index.php/ILUR/es/article/view/37701" },
    ],
  },
];

