import { firstLevelDefinition, type LevelDefinition } from "./firstLevel.ts";
import { modules } from "./studies.ts";
import { finalReadings, missionGuides } from "./missionGuides.ts";
import { challenges } from "./challenges.ts";
import { empireLayers } from "./statueExploration.ts";

const placeholderMedia = { id: "GtZcbpFiXmA", provisional: true };
const infographicPaths = [
  "/infographics/el-gran-conflicto.png", "/infographics/como-leer-la-profecia.png",
  "/infographics/daniel-8-9-1844.png", "/infographics/santuario-juicio.png",
  "/infographics/tres-angeles.png", "/infographics/adoracion-libertad.png",
  "/infographics/muerte-discernimiento.png", "/infographics/venida-tierra-nueva.png",
];
const publishedMedia: Record<number, { video: string; podcast?: string; podcastProvisional?: boolean }> = {
  2: { video: "gPQgOm1j-R4", podcast: "1YlyRMkLsTM" },
  3: { video: "XRCaOHvU0Oo", podcast: "WbUWmffgfQ4" },
  4: { video: "EyKPgoNiIHQ", podcast: "YpHngjj4D7k" },
  5: { video: "E5SRR-kQw9k", podcast: "yB4sRoGvnH4" },
  6: { video: "OSUkjNnLyOA", podcast: "TpkgdXcDMf4" },
  7: { video: "INg06p9U_0k", podcast: "UZDHh46wJfQ" },
};

export const levelDefinitions: LevelDefinition[] = modules.map((module, index) => {
  if (index === 0) return firstLevelDefinition;
  const guide = missionGuides[index];
  const rounds = [...guide.discover.rounds, ...guide.connect.rounds];
  const challenge = challenges[index];
  const published = publishedMedia[index];
  return {
    index, title: module.title, badge: challenge.badge, summary: module.summary,
    media: {
      video: published?.video ? { id: published.video, provisional: false } : { ...placeholderMedia },
      podcast: published?.podcast ? { id: published.podcast, provisional: published.podcastProvisional ?? false } : { ...placeholderMedia },
      transcript: null, infographic: infographicPaths[index],
    },
    readings: [
      ...rounds.map((round) => ({ title: round.reference, reference: round.reference, text: round.preparation ?? round.explanation })),
      { title: finalReadings[index].preparationLabel ?? "La idea central", reference: finalReadings[index].reference, text: finalReadings[index].preparation ?? challenge.explanation },
    ],
    tasks: [...rounds.map((round) => ({ ...round, kind: "Elige" as const, card: null })), {
      kind: "Elige", prompt: challenge.question, card: null, options: challenge.options,
      answer: challenge.answer, hint: guide.finalHint, explanation: challenge.explanation,
    }],
    pairs: [], pairOrder: [],
  };
});

levelDefinitions[1] = {
  ...levelDefinitions[1],
  media: {
    video: { id: "o0aBVL9mu9Y", provisional: false },
    podcast: { id: "TlICMUPaeLU", provisional: false },
    transcript: null,
    infographic: "/infographics/como-leer-la-profecia.png",
  },
  exploration: "statue",
  explorationReadings: empireLayers.map((part) => ({ title: `${part.part}: ${part.material}`, reference: part.verse, text: part.insight })),
  pairs: empireLayers.map((part) => ({ passage: part.material, description: part.title, hint: part.insight })),
  pairOrder: [3, 0, 5, 1, 4, 2],
  tasks: [
    { kind: "Elige", prompt: challenges[1].question, card: null, options: challenges[1].options, answer: challenges[1].answer, hint: missionGuides[1].finalHint, explanation: challenges[1].explanation },
    { kind: "Conecta", prompt: "Conecta los materiales con sus significados.", card: null, options: [], answer: 1, hint: "Repasa las partes de la estatua.", explanation: "Esta lectura historicista relaciona los materiales con la sucesión de reinos y culmina en el reino de Dios." },
    { kind: "Clasifica", prompt: "Ubica cada tarjeta en su categoría.", card: null, options: [], answer: 0, hint: "Distingue la descripción del pasaje de su interpretación histórica.", explanation: "Daniel describe los símbolos. La lectura historicista relaciona algunos de ellos con poderes históricos.", classification: {
      categories: ["Texto bíblico", "Interpretación histórica"],
      cards: [
        { text: "Daniel identifica al rey de Babilonia con la cabeza de oro.", category: 0, hint: "Daniel 2:38 da esta identificación al explicar el sueño." },
        { text: "La lectura historicista relaciona las piernas de hierro con Roma.", category: 1, hint: "Daniel 2 describe el hierro, pero no nombra a Roma." },
        { text: "Daniel 2 dice que los pies mezclan hierro y barro.", category: 0, hint: "Los materiales aparecen en Daniel 2:41–43." },
        { text: "La interpretación historicista relaciona los pies con Europa dividida.", category: 1, hint: "El pasaje describe división; el nombre Europa pertenece a la identificación histórica." },
      ],
    } },
    { kind: "Elige", prompt: "¿Qué representa la piedra en el desenlace?", card: null, options: ["Otro imperio humano", "El reino que Dios establece para siempre", "Una fecha para el fin del mundo"], answer: 1, hint: "Daniel 2:44 habla de un reino que nunca será destruido.", explanation: "La piedra dirige la mirada al reino de Dios. Ese es el horizonte del sueño, más allá de la sucesión de poderes humanos." },
  ],
};
