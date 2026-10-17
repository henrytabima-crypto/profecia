export type GlossaryTopic = "Daniel" | "Apocalipsis" | "Santuario" | "Método";
export type GlossaryEvidence = "text" | "association" | "adventist";

export type GlossaryClaim = {
  evidence: GlossaryEvidence;
  meaning: string;
  references: string[];
};

export type GlossaryEntry = {
  id: string;
  term: string;
  aliases: string[];
  kind: "Símbolo" | "Poder" | "Tiempo profético" | "Estructura" | "Doctrina";
  topics: GlossaryTopic[];
  summary: string;
  claims: GlossaryClaim[];
  caution?: string;
  sourceIds?: string[];
};

export const glossarySources = {
  method: {
    label: "Métodos de estudio de la Biblia",
    kind: "Instituto de Investigación Bíblica (BRI)",
    url: "https://adventistbiblicalresearch.org/articles/metodos-de-estudio-de-la-biblia",
  },
  daniel: {
    label: "Cómo interpretar los símbolos",
    kind: "Instituto de Investigación Bíblica (BRI)",
    url: "https://adventistbiblicalresearch.org/articles/como-interpretar-los-simbolos",
  },
  yearDay: {
    label: "El santuario y su purificación",
    kind: "Instituto de Investigación Bíblica (BRI)",
    url: "https://adventistbiblicalresearch.org/articles/el-santuario-y-su-purificacion",
  },
  sanctuary: {
    label: "El santuario y su purificación",
    kind: "Instituto de Investigación Bíblica (BRI)",
    url: "https://adventistbiblicalresearch.org/articles/el-santuario-y-su-purificacion",
  },
  sanctuaryBelief: {
    label: "Ministerio de Cristo en el santuario celestial",
    kind: "Creencia oficial adventista",
    url: "https://institucional.adventistas.org/es/nuestras-crencias/24-el-ministerio-de-cristo-en-el-santuario-celestial/",
  },
  mark: {
    label: "Preguntas sobre la marca de la bestia y los eventos finales",
    kind: "Instituto de Investigación Bíblica (BRI)",
    url: "https://adventistbiblicalresearch.org/articles/respuestas-a-preguntas-sobre-la-marca-de-la-bestia-y-los-eventos-finalessup1sup",
  },
  trumpets: {
    label: "Métodos de estudio de la Biblia",
    kind: "Instituto de Investigación Bíblica (BRI)",
    url: "https://adventistbiblicalresearch.org/articles/metodos-de-estudio-de-la-biblia",
  },
  babylon: {
    label: "Símbolos y poderes proféticos",
    kind: "Instituto de Investigación Bíblica (BRI)",
    url: "https://adventistbiblicalresearch.org/articles/simbolos-y-poderes-profeticos",
  },
  sealing: {
    label: "El sello de Dios y la marca de la bestia",
    kind: "Instituto de Investigación Bíblica (BRI)",
    url: "https://adventistbiblicalresearch.org/articles/respuestas-a-preguntas-sobre-la-marca-de-la-bestia-y-los-eventos-finalessup1sup",
  },
} as const;

export const glossaryTopics: Array<"Todos" | GlossaryTopic> = [
  "Todos",
  "Daniel",
  "Apocalipsis",
  "Santuario",
  "Método",
];

export const glossaryEntries: GlossaryEntry[] = [
  {
    id: "bestia",
    term: "Bestia",
    aliases: ["animal", "reino", "imperio"],
    kind: "Poder",
    topics: ["Daniel", "Apocalipsis"],
    summary: "En las visiones apocalípticas, representa un rey, reino o poder imperial.",
    claims: [
      { evidence: "text", meaning: "Daniel identifica las bestias como reyes o reinos que se levantan y gobiernan.", references: ["Daniel 7:17, 23"] },
      { evidence: "association", meaning: "La bestia compuesta de Apocalipsis 13 reutiliza rasgos de los imperios de Daniel 7.", references: ["Apocalipsis 13:1–2", "Daniel 7:3–7"] },
    ],
    caution: "No toda bestia mencionada en la Biblia simboliza un reino; esta equivalencia pertenece al contexto de cada visión.",
    sourceIds: ["method", "daniel"],
  },
  {
    id: "cuerno",
    term: "Cuerno",
    aliases: ["rey", "autoridad", "poder gobernante"],
    kind: "Poder",
    topics: ["Daniel", "Apocalipsis"],
    summary: "Representa un rey, reino o autoridad gobernante dentro de una visión.",
    claims: [
      { evidence: "text", meaning: "Los intérpretes celestiales explican los cuernos como reyes o reinos.", references: ["Daniel 7:24", "Daniel 8:20–22", "Apocalipsis 17:12"] },
    ],
    caution: "El símbolo define la clase de poder; la identidad histórica de cada cuerno depende de su visión y contexto.",
    sourceIds: ["method", "daniel"],
  },
  {
    id: "cuerno-pequeno",
    term: "Cuerno pequeño",
    aliases: ["bestia del mar", "poder perseguidor", "papado"],
    kind: "Poder",
    topics: ["Daniel", "Apocalipsis"],
    summary: "Un poder político-religioso blasfemo y perseguidor que se levanta en la línea de los imperios.",
    claims: [
      { evidence: "association", meaning: "Daniel reúne crecimiento, arrogancia, persecución y oposición al gobierno de Dios en este poder.", references: ["Daniel 7:8, 20–25", "Daniel 8:9–12, 23–25"] },
      { evidence: "adventist", meaning: "La lectura historicista adventista relaciona su fase político-religiosa con el sistema papal y la bestia del mar.", references: ["Daniel 7:25", "Apocalipsis 13:1–8"] },
    ],
    caution: "Ningún versículo dice literalmente «papado». Es una identificación histórica de un sistema profético, no una condena de creyentes católicos individuales.",
    sourceIds: ["daniel", "mark"],
  },
  {
    id: "cabezas",
    term: "Cabezas",
    aliases: ["montes", "reyes", "poderes"],
    kind: "Poder",
    topics: ["Apocalipsis"],
    summary: "En Apocalipsis 17 representan montes y una sucesión de reyes o poderes.",
    claims: [
      { evidence: "text", meaning: "El ángel vincula las siete cabezas con siete montes y siete reyes.", references: ["Apocalipsis 17:9–10"] },
    ],
    caution: "Es la explicación de una visión concreta, no una definición automática para toda cabeza bíblica.",
    sourceIds: ["method", "babylon"],
  },
  {
    id: "aguas-mar-tierra",
    term: "Aguas, mar y tierra",
    aliases: ["pueblos", "multitudes", "naciones", "territorio"],
    kind: "Símbolo",
    topics: ["Daniel", "Apocalipsis"],
    summary: "Las aguas pueden representar pueblos; mar y tierra adquieren su sentido por el escenario de cada visión.",
    claims: [
      { evidence: "text", meaning: "Apocalipsis interpreta las aguas de la visión como pueblos, multitudes, naciones y lenguas.", references: ["Apocalipsis 17:15"] },
      { evidence: "association", meaning: "El mar turbulento de Daniel 7 es el escenario del que emergen poderes imperiales.", references: ["Daniel 7:2–3"] },
      { evidence: "adventist", meaning: "La tradición adventista ha leído la tierra de Apocalipsis 13 como un territorio comparativamente poco poblado.", references: ["Apocalipsis 13:11"] },
    ],
    caution: "«Tierra = territorio despoblado» es una inferencia historicista, no una definición dada por el texto.",
    sourceIds: ["method"],
  },
  {
    id: "vientos",
    term: "Vientos",
    aliases: ["guerra", "conflicto", "destrucción", "convulsión"],
    kind: "Símbolo",
    topics: ["Daniel", "Apocalipsis"],
    summary: "Según el contexto, pueden expresar conflicto, convulsión política o fuerzas destructivas.",
    claims: [
      { evidence: "association", meaning: "Los cuatro vientos agitan el escenario de los imperios y también aparecen retenidos para impedir daño.", references: ["Jeremías 49:36–37", "Daniel 7:2–3", "Apocalipsis 7:1–3"] },
    ],
    caution: "No existe una regla universal «viento = guerra»; otros pasajes hablan de dirección, Espíritu o viento literal.",
    sourceIds: ["method"],
  },
  {
    id: "mujer-fiel",
    term: "Mujer fiel",
    aliases: ["iglesia", "pueblo de Dios", "esposa"],
    kind: "Símbolo",
    topics: ["Apocalipsis"],
    summary: "Puede representar al pueblo del pacto de Dios o a la comunidad fiel.",
    claims: [
      { evidence: "association", meaning: "Profetas y apóstoles usan la imagen matrimonial para la relación de Dios con su pueblo.", references: ["Isaías 54:5–6", "2 Corintios 11:2", "Efesios 5:25–32"] },
      { evidence: "association", meaning: "La mujer de Apocalipsis 12 da a luz al Mesías y sus descendientes guardan los mandamientos de Dios.", references: ["Apocalipsis 12:1–6, 17"] },
    ],
    caution: "«Mujer = iglesia» es una asociación contextual, no una regla para toda mujer que aparece en la Biblia.",
    sourceIds: ["method"],
  },
  {
    id: "babilonia",
    term: "Ramera y Babilonia",
    aliases: ["gran ciudad", "apostasía", "falsa adoración"],
    kind: "Poder",
    topics: ["Apocalipsis"],
    summary: "Retrata infidelidad religiosa y una alianza coercitiva entre religión y poder político.",
    claims: [
      { evidence: "text", meaning: "El ángel identifica a la mujer de la visión como la gran ciudad que reina sobre los poderes de la tierra.", references: ["Apocalipsis 17:5, 18"] },
      { evidence: "association", meaning: "La prostitución profética comunica infidelidad al pacto; Babilonia amplía esa imagen a un sistema de engaño y coerción.", references: ["Ezequiel 16:15–22", "Apocalipsis 17:1–6", "Apocalipsis 18:2–4"] },
      { evidence: "adventist", meaning: "La lectura adventista ve un sistema religioso-político apóstata históricamente centrado en Roma y ampliado a sus aliados.", references: ["Apocalipsis 14:8", "Apocalipsis 17:1–6"] },
    ],
    caution: "El símbolo es más amplio que una sola institución y nunca debe usarse para despreciar a sus miembros individuales.",
    sourceIds: ["babylon", "method"],
  },
  {
    id: "dragon",
    term: "Dragón y serpiente antigua",
    aliases: ["diablo", "Satanás", "acusador"],
    kind: "Poder",
    topics: ["Apocalipsis"],
    summary: "Apocalipsis identifica directamente al dragón con el diablo y Satanás.",
    claims: [
      { evidence: "text", meaning: "La serpiente antigua, llamada diablo y Satanás, engaña y combate contra el pueblo de Dios.", references: ["Apocalipsis 12:9", "Apocalipsis 20:2"] },
      { evidence: "association", meaning: "El dragón actúa mediante agentes y poderes terrenales a los que entrega autoridad.", references: ["Apocalipsis 12:3–5", "Apocalipsis 13:2"] },
    ],
    caution: "Roma pagana puede aparecer como instrumento histórico del dragón; el dragón mismo es identificado como Satanás.",
  },
  {
    id: "cordero",
    term: "Cordero",
    aliases: ["Jesús", "Cristo", "Mesías", "sacrificio"],
    kind: "Símbolo",
    topics: ["Apocalipsis", "Santuario"],
    summary: "Representa a Jesucristo sacrificado, entronizado y victorioso.",
    claims: [
      { evidence: "text", meaning: "Juan señala a Jesús como el Cordero de Dios; Apocalipsis muestra al Cordero inmolado y digno de reinar.", references: ["Juan 1:29, 36", "Apocalipsis 5:5–10", "Apocalipsis 17:14"] },
    ],
    caution: "La imagen reúne sacrificio, autoridad y victoria; no comunica debilidad moral.",
  },
  {
    id: "estrellas",
    term: "Estrellas",
    aliases: ["ángeles", "mensajeros"],
    kind: "Símbolo",
    topics: ["Apocalipsis"],
    summary: "Su referente cambia por escena: pueden ser mensajeros o seres celestiales.",
    claims: [
      { evidence: "text", meaning: "Las siete estrellas en la mano de Cristo son los ángeles o mensajeros de las siete iglesias.", references: ["Apocalipsis 1:20"] },
      { evidence: "association", meaning: "Las estrellas arrastradas por el dragón se relacionan con sus ángeles caídos dentro del relato.", references: ["Apocalipsis 12:4, 7–9"] },
    ],
    caution: "El contexto controla el referente; incluso «ángel de la iglesia» admite discusión entre mensajero celestial o representante humano.",
  },
  {
    id: "candeleros",
    term: "Candeleros",
    aliases: ["iglesias", "testigos", "lámparas"],
    kind: "Símbolo",
    topics: ["Apocalipsis", "Santuario"],
    summary: "Representan comunidades o testigos llamados a portar luz.",
    claims: [
      { evidence: "text", meaning: "Los siete candeleros de la primera visión son las siete iglesias.", references: ["Apocalipsis 1:20"] },
      { evidence: "text", meaning: "Apocalipsis 11 llama candeleros a los dos testigos, mostrando que una imagen puede tener referentes relacionados pero distintos.", references: ["Apocalipsis 11:3–4"] },
    ],
    caution: "La segunda definición impide convertir el primer significado en una fórmula rígida.",
  },
  {
    id: "incienso",
    term: "Incienso",
    aliases: ["oraciones", "intercesión", "altar de incienso"],
    kind: "Símbolo",
    topics: ["Apocalipsis", "Santuario"],
    summary: "Representa las oraciones del pueblo de Dios presentadas ante Él.",
    claims: [
      { evidence: "text", meaning: "Las copas de incienso son las oraciones de los santos y el humo asciende con ellas ante Dios.", references: ["Salmo 141:2", "Apocalipsis 5:8", "Apocalipsis 8:3–4"] },
      { evidence: "association", meaning: "La tipología del santuario vincula la oración aceptable con mediación, sacrificio y presencia divina.", references: ["Levítico 16:12–13", "Efesios 5:2"] },
    ],
  },
  {
    id: "vestiduras-blancas",
    term: "Vestiduras blancas y lino fino",
    aliases: ["justicia", "pureza", "vindicación"],
    kind: "Símbolo",
    topics: ["Apocalipsis", "Santuario"],
    summary: "Comunican pureza, vindicación y justicia recibidas mediante Cristo.",
    claims: [
      { evidence: "text", meaning: "Las vestiduras son lavadas en la sangre del Cordero y el lino fino se relaciona con las acciones justas de los santos.", references: ["Apocalipsis 7:13–14", "Apocalipsis 19:8"] },
    ],
    caution: "No deben presentarse como justicia humana autosuficiente: la misma visión las vincula con la obra del Cordero.",
  },
  {
    id: "carnero-macho-cabrio",
    term: "Carnero y macho cabrío",
    aliases: ["Medopersia", "Grecia", "cuatro cuernos"],
    kind: "Poder",
    topics: ["Daniel"],
    summary: "Daniel 8 ofrece uno de los decodificadores más explícitos de la profecía bíblica.",
    claims: [
      { evidence: "text", meaning: "El carnero representa a Medopersia; el macho cabrío, a Grecia; su gran cuerno, al primer rey; y cuatro cuernos, a reinos sucesores.", references: ["Daniel 8:20–22"] },
    ],
    caution: "Los nombres de los cuatro sucesores concretos proceden de la reconstrucción histórica; la visión define su estructura general.",
    sourceIds: ["method", "daniel"],
  },
  {
    id: "estatua-metales",
    term: "Estatua y metales",
    aliases: ["oro", "plata", "bronce", "hierro", "barro", "reinos"],
    kind: "Estructura",
    topics: ["Daniel"],
    summary: "La imagen de Daniel 2 representa una sucesión de reinos humanos.",
    claims: [
      { evidence: "text", meaning: "La cabeza de oro es Nabucodonosor y su reino; otros reinos le suceden hasta la etapa dividida.", references: ["Daniel 2:37–43"] },
      { evidence: "association", meaning: "Daniel 5 y 8 permiten reconocer en la secuencia a Medopersia y Grecia; Daniel 7 amplía el cuarto reino.", references: ["Daniel 5:28", "Daniel 7:7, 23", "Daniel 8:20–21"] },
      { evidence: "adventist", meaning: "La lectura historicista identifica plata con Medopersia, bronce con Grecia, hierro con Roma y hierro-barro con la división posterior.", references: ["Daniel 2:39–43"] },
    ],
    caution: "Daniel 2 nombra directamente la cabeza de oro; las demás identidades se construyen comparando la secuencia de las visiones.",
    sourceIds: ["daniel"],
  },
  {
    id: "piedra",
    term: "Piedra no cortada por manos",
    aliases: ["roca", "reino de Dios", "Cristo"],
    kind: "Símbolo",
    topics: ["Daniel"],
    summary: "Representa el reino eterno que Dios establece y que sustituye a todo poder humano.",
    claims: [
      { evidence: "text", meaning: "Daniel interpreta la piedra como el reino indestructible establecido por Dios.", references: ["Daniel 2:44–45"] },
      { evidence: "association", meaning: "El Nuevo Testamento aplica a Cristo imágenes de piedra fundamental y piedra de juicio.", references: ["Mateo 21:42–44", "1 Pedro 2:4–8"] },
    ],
    caution: "La interpretación primaria dada en Daniel es «reino de Dios»; su relación personal con Cristo surge del testimonio bíblico más amplio.",
  },
  {
    id: "sello-de-dios",
    term: "Sello de Dios",
    aliases: ["sellamiento", "sábado", "Espíritu Santo", "nombre del Padre"],
    kind: "Doctrina",
    topics: ["Apocalipsis", "Método"],
    summary: "Expresa pertenencia, identidad y protección de quienes son de Dios.",
    claims: [
      { evidence: "text", meaning: "Los siervos de Dios reciben el sello; en la escena del Cordero llevan el nombre del Padre en la frente.", references: ["Apocalipsis 7:2–4", "Apocalipsis 14:1"] },
      { evidence: "association", meaning: "El Nuevo Testamento vincula el sellamiento con el Espíritu Santo y una relación auténtica con Cristo.", references: ["2 Corintios 1:21–22", "Efesios 1:13", "Efesios 4:30"] },
      { evidence: "adventist", meaning: "La interpretación adventista relaciona el sello escatológico con el sábado como señal de lealtad al Creador.", references: ["Éxodo 31:13, 17", "Ezequiel 20:12, 20", "Apocalipsis 14:7, 12"] },
    ],
    caution: "Apocalipsis no dice literalmente «el sello es el sábado». Esa conclusión sistemática no debe borrar la obra del Espíritu ni el carácter de Dios en su pueblo.",
    sourceIds: ["sealing", "mark"],
  },
  {
    id: "marca-bestia",
    term: "Marca e imagen de la bestia",
    aliases: ["marca de la bestia", "domingo", "frente", "mano", "666"],
    kind: "Doctrina",
    topics: ["Apocalipsis", "Método"],
    summary: "Señalan adoración, pertenencia y participación consciente en un orden religioso coercitivo.",
    claims: [
      { evidence: "text", meaning: "La marca aparece unida a adoración, lealtad y presión económica; quienes la rechazan permanecen fieles a Cristo.", references: ["Apocalipsis 13:15–17", "Apocalipsis 14:9–12", "Apocalipsis 20:4"] },
      { evidence: "association", meaning: "Frente y mano evocan convicción, identidad y conducta en contraste con la señal de pertenencia a Dios.", references: ["Deuteronomio 6:6–8", "Apocalipsis 14:1"] },
      { evidence: "adventist", meaning: "La postura adventista entiende la crisis final como una imposición del domingo y la imagen como una unión iglesia-Estado coercitiva.", references: ["Daniel 7:25", "Apocalipsis 13:11–17"] },
    ],
    caution: "No es una vacuna, microchip o tecnología específica. En la enseñanza adventista tampoco se recibe hoy simplemente por asistir a una iglesia el domingo: pertenece a una decisión final informada sobre adoración y lealtad.",
    sourceIds: ["mark"],
  },
  {
    id: "dia-ano",
    term: "Principio día-año",
    aliases: ["día profético", "año profético", "cronología"],
    kind: "Tiempo profético",
    topics: ["Daniel", "Apocalipsis", "Método"],
    summary: "En determinadas profecías simbólicas, un día del cuadro representa un año histórico.",
    claims: [
      { evidence: "text", meaning: "Números y Ezequiel contienen precedentes en los que Dios asigna un año por cada día dentro de una representación.", references: ["Números 14:34", "Ezequiel 4:5–6"] },
      { evidence: "adventist", meaning: "El historicismo lo aplica a períodos de visiones apocalípticas en miniatura, no a cada día mencionado en la Biblia.", references: ["Daniel 7:25", "Daniel 9:24–27"] },
    ],
    caution: "El contexto simbólico es indispensable; el principio no convierte automáticamente todo día bíblico en un año.",
    sourceIds: ["yearDay", "method"],
  },
  {
    id: "1260-dias",
    term: "1.260 días, 42 meses y tres tiempos y medio",
    aliases: ["1260 años", "tiempo tiempos medio tiempo", "538", "1798"],
    kind: "Tiempo profético",
    topics: ["Daniel", "Apocalipsis"],
    summary: "Expresiones paralelas para un período de persecución, testimonio y protección.",
    claims: [
      { evidence: "association", meaning: "Un tiempo, tiempos y medio tiempo; 42 meses; y 1.260 días describen períodos equivalentes dentro de visiones relacionadas.", references: ["Daniel 7:25", "Daniel 12:7", "Apocalipsis 11:2–3", "Apocalipsis 12:6, 14", "Apocalipsis 13:5"] },
      { evidence: "adventist", meaning: "Aplicando el principio día-año, la lectura adventista entiende 1.260 años, tradicionalmente situados entre 538 y 1798.", references: ["Números 14:34", "Ezequiel 4:6"] },
    ],
    caution: "La equivalencia interna de las expresiones es fuerte; su conversión a años y sus fechas pertenecen a la aplicación historicista.",
    sourceIds: ["yearDay", "daniel"],
  },
  {
    id: "santuario-expiacion",
    term: "Santuario y Día de la Expiación",
    aliases: ["purificación", "juicio investigador", "1844", "Yom Kippur"],
    kind: "Doctrina",
    topics: ["Daniel", "Santuario"],
    summary: "El santuario terrenal funciona como sombra pedagógica del ministerio celestial de Cristo.",
    claims: [
      { evidence: "text", meaning: "Hebreos presenta el santuario terrenal como copia y sombra, y a Cristo ministrando en el verdadero santuario celestial.", references: ["Levítico 16", "Hebreos 8:1–5", "Hebreos 9:23–24"] },
      { evidence: "adventist", meaning: "La doctrina adventista conecta la purificación de Daniel 8:14 con el juicio previo al advenimiento y el inicio de su fase final en 1844.", references: ["Daniel 7:9–14", "Daniel 8:13–14", "Daniel 9:24–27", "Apocalipsis 14:6–7"] },
    ],
    caution: "El santuario celestial es explícito en Hebreos; 1844 surge de relacionar varios pasajes, el principio día-año y el decreto de 457 a. C., no de un solo versículo.",
    sourceIds: ["sanctuary", "sanctuaryBelief", "yearDay"],
  },
  {
    id: "dos-testigos",
    term: "Dos testigos, olivos y candeleros",
    aliases: ["Antiguo Testamento", "Nuevo Testamento", "Escrituras"],
    kind: "Símbolo",
    topics: ["Apocalipsis"],
    summary: "Apocalipsis reúne tres imágenes para dos testigos proféticos que dan luz y testimonio.",
    claims: [
      { evidence: "text", meaning: "Los dos testigos son llamados olivos, candeleros y profetas dentro de la misma visión.", references: ["Apocalipsis 11:3–4, 10", "Zacarías 4:1–14"] },
      { evidence: "adventist", meaning: "La interpretación historicista adventista los relaciona con las Escrituras del Antiguo y Nuevo Testamento.", references: ["Salmo 119:105", "Juan 5:39"] },
    ],
    caution: "Apocalipsis 11 no dice literalmente «Antiguo y Nuevo Testamento»; esa identificación es tipológica e historicista.",
  },
  {
    id: "siete",
    term: "Siete y ciclos de siete",
    aliases: ["plenitud", "totalidad", "iglesias", "sellos", "trompetas"],
    kind: "Estructura",
    topics: ["Apocalipsis", "Método"],
    summary: "Con frecuencia comunica una serie completa o una totalidad literaria y teológica.",
    claims: [
      { evidence: "association", meaning: "El patrón de siete nace en la creación y estructura repetidamente iglesias, sellos, trompetas y otras escenas de Apocalipsis.", references: ["Génesis 2:2–3", "Apocalipsis 1:4, 12, 16", "Apocalipsis 5:1, 6", "Apocalipsis 8:2"] },
    ],
    caution: "Ningún versículo ofrece la fórmula universal «siete = perfección»; a veces también es un número literal, y las siete iglesias fueron congregaciones históricas reales.",
    sourceIds: ["method"],
  },
  {
    id: "trompeta",
    term: "Trompeta",
    aliases: ["alarma", "juicio", "advertencia", "llamado"],
    kind: "Símbolo",
    topics: ["Apocalipsis"],
    summary: "Puede anunciar alarma, intervención divina, juicio o un llamado al arrepentimiento.",
    claims: [
      { evidence: "association", meaning: "En la Biblia las trompetas convocan, advierten y acompañan la intervención de Dios.", references: ["Números 10:9", "Joel 2:1", "Amós 3:6", "1 Corintios 15:52"] },
      { evidence: "adventist", meaning: "La lectura adventista entiende las siete trompetas como advertencias y juicios dentro del flujo de la historia, distintos de las siete plagas finales.", references: ["Apocalipsis 8–11", "Apocalipsis 16"] },
    ],
    caution: "No existe consenso adventista final sobre la aplicación histórica de cada trompeta; sus identificaciones particulares deben permanecer marcadas como interpretación en estudio.",
    sourceIds: ["trumpets"],
  },
  {
    id: "dia-expiacion-juicio",
    term: "Juicio previo al advenimiento",
    aliases: ["juicio investigador", "libros", "Hijo del Hombre", "hora del juicio"],
    kind: "Doctrina",
    topics: ["Daniel", "Apocalipsis", "Santuario"],
    summary: "Una escena de juicio celestial que precede a la entrega del reino y a la venida de Cristo.",
    claims: [
      { evidence: "association", meaning: "Daniel ve abrirse los libros antes de que el Hijo del Hombre reciba el reino; Apocalipsis anuncia la hora del juicio antes de la cosecha final.", references: ["Daniel 7:9–14, 22, 26–27", "Apocalipsis 14:6–7, 14–16"] },
      { evidence: "adventist", meaning: "El adventismo relaciona estas escenas con la fase final del ministerio de Cristo simbolizada por la purificación del santuario.", references: ["Daniel 8:14", "Hebreos 9:23–28"] },
    ],
    caution: "La salvación descansa en la gracia y los méritos de Cristo; el juicio no enseña salvación por obras ni que Dios necesite descubrir información.",
    sourceIds: ["sanctuary", "sanctuaryBelief"],
  },
];
