export const JOURNEY_STORAGE_KEY = "profecia-daniel-journey-v1";

export const JOURNEY_PARTS = [
  { index: 0, material: "Oro", name: "Babilonia", part: "Cabeza" },
  { index: 1, material: "Plata", name: "Medopersia", part: "Pecho y brazos" },
  { index: 2, material: "Bronce", name: "Grecia", part: "Vientre y muslos" },
  { index: 3, material: "Hierro", name: "Roma", part: "Piernas" },
  { index: 4, material: "Hierro y barro", name: "Reino dividido", part: "Pies" },
  { index: 5, material: "Piedra", name: "Reino de Dios", part: "Piedra" },
];

type JourneyStep = {
  id: string;
  title: string;
  instruction: string;
  hint: string;
  successTitle: string;
  explanation: string;
  reference: string;
  sourceUrl: string;
  kind: "scene" | "choice" | "order";
  options?: { index: number; label: string }[];
};

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: "gold",
    title: "El comienzo del sueño",
    instruction: "Encuentra la parte de oro. Tócala en la estatua o elígela en la lista.",
    hint: "Busca la cabeza, en la parte más alta de la estatua.",
    successTitle: "Encontraste el punto de partida",
    explanation: "Daniel identifica al rey Nabucodonosor con la cabeza de oro. Babilonia es el comienzo de esta secuencia: la identificación se apoya en la explicación del propio pasaje.",
    reference: "Daniel 2:37–38",
    sourceUrl: "https://www.bible.com/es/bible/149/DAN.2.RVR1960",
    kind: "scene",
  },
  {
    id: "silver",
    title: "El siguiente reino",
    instruction: "Debajo del oro aparece otro metal. Encuentra la plata.",
    hint: "Observa el pecho y los dos brazos, justo debajo de la cabeza.",
    successTitle: "Seguiste la secuencia",
    explanation: "Daniel 2 anuncia otro reino después de Babilonia. La lectura historicista relaciona el pecho y los brazos de plata con Medopersia, nombrada en Daniel 8:20 al interpretar otra visión.",
    reference: "Daniel 2:32, 39; 8:20",
    sourceUrl: "https://www.bible.com/es/bible/149/DAN.8.RVR1960",
    kind: "scene",
  },
  {
    id: "greece",
    title: "Conecta las visiones",
    instruction: "Según la lectura historicista, ¿qué reino sigue a Medopersia?",
    hint: "Daniel 8:20–21 nombra a los reyes de Media y Persia y después al rey de Grecia.",
    successTitle: "Conectaste dos pasajes",
    explanation: "Grecia sigue a Medopersia en esta lectura. Daniel 8 nombra ambos poderes; la interpretación historicista relaciona esa sucesión con la plata y el bronce de Daniel 2. El capítulo 2 no da por sí solo estos dos nombres.",
    reference: "Daniel 2:39; 8:20–21",
    sourceUrl: "https://www.bible.com/es/bible/149/DAN.8.RVR1960",
    kind: "choice",
    options: [
      { index: 2, label: "Grecia" },
      { index: 0, label: "Babilonia" },
    ],
  },
  {
    id: "sequence",
    title: "Reconstruye el recorrido",
    instruction: "Elige los tres primeros reinos en orden. Cada acierto conserva tu avance.",
    hint: "Empieza por Babilonia. Después van Medopersia y Grecia: oro, plata y bronce.",
    successTitle: "Reconstruiste los tres primeros reinos",
    explanation: "La secuencia que acabas de recorrer es Babilonia → Medopersia → Grecia. Babilonia se identifica en Daniel 2; Medopersia y Grecia se relacionan con esa secuencia mediante la lectura historicista de Daniel 8.",
    reference: "Daniel 2:37–39; 8:20–21",
    sourceUrl: "https://www.bible.com/es/bible/149/DAN.8.RVR1960",
    kind: "order",
    options: [
      { index: 2, label: "Grecia" },
      { index: 0, label: "Babilonia" },
      { index: 1, label: "Medopersia" },
    ],
  },
  {
    id: "stone",
    title: "El sentido del desenlace",
    instruction: "La piedra no fue cortada por mano humana. ¿Qué representa en la explicación de Daniel?",
    hint: "Daniel 2:44 dice que el Dios del cielo levantará un reino que no será destruido.",
    successTitle: "Llegaste al centro del mensaje",
    explanation: "La piedra representa el reino que Dios establece y que permanece para siempre. El desenlace dirige la atención al reino de Dios, más allá de la sucesión de poderes humanos.",
    reference: "Daniel 2:44–45",
    sourceUrl: "https://www.bible.com/es/bible/149/DAN.2.RVR1960",
    kind: "choice",
    options: [
      { index: 3, label: "Otro imperio humano" },
      { index: 5, label: "El reino de Dios" },
    ],
  },
];

export type JourneyState = {
  version: 1;
  started: boolean;
  earnedCard: boolean;
  step: number;
  solved: boolean;
  order: number[];
  helpEnabled: boolean;
  showHint: boolean;
  feedback: "idle" | "incorrect" | "correct";
};

export type JourneyAction =
  | { type: "start" | "advance" | "hint" | "toggle-help" | "replay" | "reset" }
  | { type: "select"; index: number };

export const initialJourneyState: JourneyState = {
  version: 1,
  started: false,
  earnedCard: false,
  step: 0,
  solved: false,
  order: [],
  helpEnabled: true,
  showHint: false,
  feedback: "idle",
};

const ORDER_STEP = 3;
const ORDER_ANSWER = [0, 1, 2];
const ANSWERS = [0, 1, 2, null, 5];

function freshJourneyState(): JourneyState {
  return { ...initialJourneyState, order: [] };
}

export function journeyReducer(state: JourneyState, action: JourneyAction): JourneyState {
  switch (action.type) {
    case "reset":
      return freshJourneyState();
    case "start":
      return state.started ? state : { ...state, started: true };
    case "replay":
      return { ...freshJourneyState(), started: true, earnedCard: state.earnedCard, helpEnabled: state.helpEnabled };
    case "toggle-help":
      return { ...state, helpEnabled: !state.helpEnabled };
    case "hint":
      return !state.started || state.solved || state.step >= JOURNEY_STEPS.length
        ? state
        : { ...state, showHint: true };
    case "advance":
      return !state.started || !state.solved || state.step >= JOURNEY_STEPS.length
        ? state
        : {
          ...state,
          step: state.step + 1,
          earnedCard: state.earnedCard || state.step === JOURNEY_STEPS.length - 1,
          solved: false,
          order: [],
          showHint: false,
          feedback: "idle",
        };
    case "select": {
      if (!state.started || state.solved || state.step >= JOURNEY_STEPS.length) return state;
      if (!Number.isInteger(action.index) || action.index < 0 || action.index >= JOURNEY_PARTS.length) return state;

      const expected = state.step === ORDER_STEP ? ORDER_ANSWER[state.order.length] : ANSWERS[state.step];
      if (action.index !== expected) return { ...state, showHint: true, feedback: "incorrect" };

      const order = state.step === ORDER_STEP ? [...state.order, action.index] : state.order;
      const solved = state.step !== ORDER_STEP || order.length === ORDER_ANSWER.length;
      return { ...state, order, solved, showHint: false, feedback: solved ? "correct" : "idle" };
    }
    default:
      return state;
  }
}

/** Restore reachable states only; malformed storage never earns progress. */
export function parseJourneyState(raw: string | null): JourneyState {
  if (!raw) return freshJourneyState();

  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return freshJourneyState();
    const candidate = value as Record<string, unknown>;
    if (
      candidate.version !== 1 ||
      typeof candidate.started !== "boolean" ||
      typeof candidate.earnedCard !== "boolean" ||
      typeof candidate.step !== "number" || !Number.isInteger(candidate.step) ||
      candidate.step < 0 || candidate.step > JOURNEY_STEPS.length ||
      typeof candidate.solved !== "boolean" ||
      !Array.isArray(candidate.order) ||
      typeof candidate.helpEnabled !== "boolean" ||
      typeof candidate.showHint !== "boolean" ||
      typeof candidate.feedback !== "string" ||
      !["idle", "incorrect", "correct"].includes(candidate.feedback)
    ) return freshJourneyState();

    const state: JourneyState = {
      version: 1,
      started: candidate.started,
      earnedCard: candidate.earnedCard,
      step: candidate.step,
      solved: candidate.solved,
      order: [...candidate.order],
      helpEnabled: candidate.helpEnabled,
      showHint: candidate.showHint,
      feedback: candidate.feedback as JourneyState["feedback"],
    };

    const validOrder = state.step === ORDER_STEP
      ? state.order.length <= ORDER_ANSWER.length && state.order.every((index, position) => index === ORDER_ANSWER[position])
      : state.order.length === 0;
    if (!validOrder) return freshJourneyState();
    if (!state.started && (state.earnedCard || state.step !== 0 || state.solved || state.showHint || state.feedback !== "idle")) return freshJourneyState();
    if (state.step === JOURNEY_STEPS.length) {
      return state.started && state.earnedCard && !state.solved && state.order.length === 0 && !state.showHint && state.feedback === "idle"
        ? state
        : freshJourneyState();
    }
    if (state.step === ORDER_STEP && state.solved !== (state.order.length === ORDER_ANSWER.length)) return freshJourneyState();
    if (state.solved !== (state.feedback === "correct")) return freshJourneyState();
    if (state.solved && state.showHint) return freshJourneyState();
    if (state.feedback === "incorrect" && !state.showHint) return freshJourneyState();
    return state;
  } catch {
    return freshJourneyState();
  }
}
