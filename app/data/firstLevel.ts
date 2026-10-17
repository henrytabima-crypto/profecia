// Replace each asset independently when the final NotebookLM exports are ready.
export const firstLevelMedia = {
  video: { id: "HBR7xkYm2MU", provisional: false },
  podcast: { id: "soWk2TCDX2Q", provisional: false },
  transcript: null as string | null,
  infographic: "/infographics/el-gran-conflicto.png" as string | null,
};

export const firstLevelReadings = [
  { title: "Un conflicto de confianza", reference: "Génesis 3:1–15", text: "Génesis 3 presenta el engaño y la ruptura de la confianza. El relato también contiene una promesa de victoria sobre la serpiente. La historia del mal se acompaña, desde el comienzo, de una esperanza." },
  { title: "La victoria del Cordero", reference: "Apocalipsis 12:7–12", text: "Apocalipsis 12 describe una guerra en el cielo e identifica al adversario con el dragón y la serpiente antigua. El pasaje sitúa la victoria en la sangre del Cordero y en el testimonio fiel. Cristo ocupa el centro de esta lectura." },
  { title: "Una lectura que conduce a la esperanza", reference: "Apocalipsis 21:1–4", text: "La interpretación adventista reúne estos pasajes bajo el nombre «gran conflicto»: una controversia acerca del carácter de Dios, la libertad y las consecuencias del pecado. Es una síntesis doctrinal de varios textos. El horizonte del relato bíblico es la restauración y el fin del mal." },
];

export const firstLevelTasks = [
  { kind: "Elige", prompt: "¿Qué ocupa el centro de esta lectura de la profecía?", card: null, options: ["El miedo al futuro", "Cristo y su obra de restauración", "Las noticias del día"], answer: 1, hint: "Recuerda quién trae la victoria y la esperanza en el relato.", explanation: "Cristo y su obra de restauración dan sentido al recorrido. La profecía invita a la confianza y a la esperanza." },
  { kind: "Conecta", prompt: "Conecta cada pasaje con lo que describe.", card: null, options: [], answer: 1, hint: "Piensa en la serpiente y en lo que ocurre al comienzo de la historia bíblica.", explanation: "Génesis 3 relaciona el engaño y la ruptura de confianza con una primera promesa de victoria sobre la serpiente." },
  { kind: "Clasifica", prompt: "Ubica cada tarjeta en su categoría.", card: null, options: [], answer: 0, hint: "Distingue lo que describe un pasaje de la interpretación que reúne varios textos.", explanation: "El texto bíblico y su interpretación se relacionan, pero conviene reconocer qué aporta cada uno.", classification: {
    categories: ["Texto bíblico", "Interpretación adventista"],
    cards: [
      { text: "Apocalipsis 12 describe una guerra en el cielo.", category: 0, hint: "La escena aparece directamente en Apocalipsis 12:7." },
      { text: "El gran conflicto reúne varios pasajes en un marco sobre el carácter de Dios y la libertad.", category: 1, hint: "Es una síntesis doctrinal que relaciona varios textos." },
      { text: "Apocalipsis 21 anuncia que ya no habrá muerte ni dolor.", category: 0, hint: "Esta promesa se encuentra en Apocalipsis 21:4." },
      { text: "La lectura adventista relaciona Génesis 3 y Apocalipsis 12 como partes del gran conflicto.", category: 1, hint: "La tarjeta propone una conexión entre dos pasajes." },
    ],
  } },
  { kind: "Elige", prompt: "¿Hacia qué horizonte nos dirige este recorrido?", card: null, options: ["A calcular una fecha para el fin", "A vivir pendientes del miedo", "A la restauración y al fin del mal"], answer: 2, hint: "Vuelve a la promesa de una creación donde ya no hay muerte ni dolor.", explanation: "La esperanza culmina en la restauración. Apocalipsis 21 presenta una vida con Dios, sin muerte ni dolor." },
] as const;

export const firstLevelPairs = [
  { passage: "Génesis 3", description: "El engaño y una primera promesa de victoria sobre la serpiente.", hint: "Recuerda la serpiente y la promesa al comienzo de la historia." },
  { passage: "Apocalipsis 12", description: "La guerra en el cielo y la victoria por la sangre del Cordero.", hint: "Busca la escena del dragón y la victoria del Cordero." },
  { passage: "Apocalipsis 21", description: "Una creación restaurada, sin muerte ni dolor.", hint: "Este pasaje mira hacia la restauración final." },
] as const;
export const firstLevelPairOrder = [2, 0, 1] as const;
export type Classification = {
  categories: readonly [string, string];
  cards: ReadonlyArray<{ text: string; category: number; hint: string }>;
};
export type LevelDefinition = {
  index: number;
  title: string;
  badge: string;
  summary: string;
  media: { video: { id: string; provisional: boolean } | null; podcast: { id: string; provisional: boolean } | null; transcript: string | null; infographic: string | null };
  readings: ReadonlyArray<{ title: string; reference: string; text: string }>;
  tasks: ReadonlyArray<{ kind: "Elige" | "Conecta" | "Clasifica"; prompt: string; card: string | null; options: readonly string[]; answer: number; hint: string; explanation: string; classification?: Classification }>;
  pairs: ReadonlyArray<{ passage: string; description: string; hint: string }>;
  pairOrder: readonly number[];
  exploration?: "statue";
  explorationReadings?: LevelDefinition["readings"];
};
export const firstLevelDefinition: LevelDefinition = {
  index: 0, title: "El gran conflicto", badge: "La primera luz",
  summary: "Cristo en el centro. Una historia que conduce a la esperanza y la restauración.",
  media: firstLevelMedia, readings: firstLevelReadings, tasks: firstLevelTasks,
  pairs: firstLevelPairs, pairOrder: firstLevelPairOrder,
};

export function connectFirstLevel(state: FirstLevelProgress, passage: number, description: number, definition = firstLevelDefinition): FirstLevelProgress {
  const { pairs, tasks } = definition;
  if (passage !== description || !pairs[passage] || (state.matched ?? []).includes(passage)) return state;
  const matched = [...(state.matched ?? []), passage];
  const solved = [...state.solved];
  const matchingTask = tasks.findIndex((task) => task.kind === "Conecta");
  if (matchingTask < 0) return state;
  if (matched.length === pairs.length) solved[matchingTask] = tasks[matchingTask].answer;
  return { ...state, matched, solved };
}

export type FirstLevelProgress = {
  activityVersion: 2;
  flowVersion: 2;
  statueExplored: number[];
  statuePart: number;
  classified: Record<string, number[]>;
  started: boolean;
  stage: number;
  mediaDone: number[];
  positions: Record<string, number>;
  explored: number[];
  reading: number;
  task: number;
  solved: number[];
  matched: number[];
  claimed: boolean;
};
export const freshFirstLevel = (): FirstLevelProgress => ({ activityVersion: 2, flowVersion: 2, statueExplored: [], statuePart: 0, classified: {}, started: false, stage: 0, mediaDone: [], positions: {}, explored: [], reading: 0, task: 0, solved: [], matched: [], claimed: false });
export function levelTaskComplete(state: FirstLevelProgress, index: number, definition = firstLevelDefinition): boolean {
  const task = definition.tasks[index];
  return Boolean(task && state.solved[index] === task.answer && (!task.classification || task.classification.cards.every((_, i) => state.classified?.[index]?.includes(i))));
}

export function classifyLevelCard(state: FirstLevelProgress, taskIndex: number, cardIndex: number, category: number, definition = firstLevelDefinition): FirstLevelProgress {
  const task = definition.tasks[taskIndex];
  const card = task?.classification?.cards[cardIndex];
  const placed = state.classified?.[taskIndex] ?? [];
  if (state.task !== taskIndex || !Number.isInteger(cardIndex) || !card || card.category !== category || placed.includes(cardIndex)) return state;
  const next = [...placed, cardIndex];
  const solved = [...state.solved];
  if (next.length === task.classification!.cards.length) solved[taskIndex] = task.answer;
  return { ...state, classified: { ...state.classified, [taskIndex]: next }, solved };
}

export function levelStages(definition = firstLevelDefinition): string[] {
  return ["Mira", "Escucha", "Lee", ...(definition.exploration === "statue" ? ["Explora"] : []), "Practica", "Tu premio"];
}
export function practiceStage(definition = firstLevelDefinition): number { return levelStages(definition).length - 2; }
export function rewardStage(definition = firstLevelDefinition): number { return levelStages(definition).length - 1; }
export function statueComplete(state: FirstLevelProgress, definition = firstLevelDefinition): boolean {
  return (definition.explorationReadings ?? []).every((_, i) => state.statueExplored?.includes(i));
}
export function exploreStatuePart(state: FirstLevelProgress, part: number, definition = firstLevelDefinition): FirstLevelProgress {
  if (definition.exploration !== "statue" || state.stage !== 3 || !Number.isInteger(part) || !definition.explorationReadings?.[part]) return state;
  if (state.statuePart === part && state.statueExplored.includes(part)) return state;
  return { ...state, started: true, statuePart: part, statueExplored: [...new Set([...state.statueExplored, part])] };
}
export function firstLevelComplete(state: FirstLevelProgress, definition = firstLevelDefinition): boolean {
  const { pairs, readings, tasks } = definition;
  return statueComplete(state, definition) && pairs.every((_, i) => state.matched?.includes(i)) && [0, 1].every((n) => state.mediaDone.includes(n)) && readings.every((_, i) => state.explored.includes(i)) && tasks.every((task, i) => levelTaskComplete(state, i, definition));
}
export function firstLevelReach(state: FirstLevelProgress, definition = firstLevelDefinition): number {
  if (!state.mediaDone.includes(0)) return 0;
  if (!state.mediaDone.includes(1)) return 1;
  if (!definition.readings.every((_, i) => state.explored.includes(i))) return 2;
  if (!statueComplete(state, definition)) return 3;
  return state.claimed && firstLevelComplete(state, definition) ? rewardStage(definition) : practiceStage(definition);
}
export function restoreFirstLevel(value: unknown, definition = firstLevelDefinition): FirstLevelProgress {
  const { readings, tasks, pairs } = definition;
  const state = freshFirstLevel();
  if (!value || typeof value !== "object" || Array.isArray(value)) return state;
  let saved = value as Record<string, unknown>;
  // The original second level used statue exploration in place of reading.
  if (saved.flowVersion !== 2 && definition.exploration === "statue") {
    const earned = saved.claimed === true;
    saved = { ...saved, statueExplored: saved.explored, statuePart: saved.reading,
      explored: earned ? readings.map((_, i) => i) : [], reading: 0,
      stage: typeof saved.stage === "number" && saved.stage >= 2 ? earned ? rewardStage(definition) : 2 : saved.stage };
  }
  // Earlier levels 1–2 had two single-card tasks at positions 2 and 3.
  if (saved.activityVersion !== 2 && definition.index < 2 && Array.isArray(saved.solved)) {
    const old = saved.solved;
    const prefixValid = old[0] === tasks[0].answer && old[1] === tasks[1].answer;
    const firstCardDone = prefixValid && old[2] === 0;
    const bothDone = firstCardDone && old[3] === 1;
    const migratedSolved = old.slice(0, 2);
    if (bothDone) {
      migratedSolved.push(tasks[2].answer);
      if (old[4] === tasks[3].answer) migratedSolved.push(tasks[3].answer);
    }
    saved = { ...saved, solved: migratedSolved,
      classified: firstCardDone ? { 2: bothDone ? tasks[2].classification!.cards.map((_, i) => i) : [0] } : {},
      task: typeof saved.task === "number" ? saved.task >= 4 ? 3 : Math.min(saved.task, 2) : 0 };
  }
  const indices = (value: unknown, max: number) => Array.isArray(value) ? [...new Set(value.filter((n): n is number => Number.isInteger(n) && n >= 0 && n < max))] : [];
  const bounded = (value: unknown, max: number) => typeof value === "number" && Number.isInteger(value) ? Math.max(0, Math.min(value, max)) : 0;
  state.started = saved.started === true;
  state.mediaDone = indices(saved.mediaDone, 2);
  state.explored = indices(saved.explored, readings.length);
  state.reading = bounded(saved.reading, readings.length - 1);
  state.statueExplored = indices(saved.statueExplored, definition.explorationReadings?.length ?? 0);
  state.statuePart = bounded(saved.statuePart, Math.max(0, (definition.explorationReadings?.length ?? 1) - 1));
  // Preserve credit earned with the earlier single-pair activity.
  state.matched = definition.index === 0 && saved.matched === undefined && Array.isArray(saved.solved) && saved.solved[0] === tasks[0].answer && saved.solved[1] === tasks[1].answer
    ? pairs.map((_, i) => i) : indices(saved.matched, pairs.length);
  for (const [i, task] of tasks.entries()) {
    if (task.classification && saved.classified && typeof saved.classified === "object" && !Array.isArray(saved.classified)) {
      const placed = indices((saved.classified as Record<string, unknown>)[i], task.classification.cards.length);
      if (placed.length) state.classified[i] = placed;
    }
  }
  if (Array.isArray(saved.solved)) {
    for (const [i, task] of tasks.entries()) {
      if (saved.solved[i] !== task.answer || (task.kind === "Conecta" && state.matched.length !== pairs.length) || (task.classification && !task.classification.cards.every((_, n) => state.classified[i]?.includes(n)))) break;
      state.solved.push(task.answer);
    }
  }
  state.task = bounded(saved.task, Math.min(state.solved.length, tasks.length - 1));
  if (saved.positions && typeof saved.positions === "object") {
    for (const [key, seconds] of Object.entries(saved.positions)) {
      if (/^(video|podcast):[a-zA-Z0-9_-]{11}$/.test(key) && typeof seconds === "number" && Number.isFinite(seconds) && seconds >= 0 && seconds < 86400) state.positions[key] = Math.floor(seconds);
    }
  }
  state.claimed = saved.claimed === true && firstLevelComplete(state, definition);
  state.stage = bounded(saved.stage, firstLevelReach(state, definition));
  return state;
}
