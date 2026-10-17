import { levelDefinitions } from "./levels.ts";
import type { JourneyState } from "./danielJourney";
import { guideComplete, restoreGuide, type GuideProgress } from "./guidedProgress.ts";
import { missionGuides } from "./missionGuides.ts";
import { freshFirstLevel, restoreFirstLevel, firstLevelComplete, rewardStage, type FirstLevelProgress } from "./firstLevel.ts";

export const PROGRESS_KEY = "profecia-aventura-v1";
export const LEGACY_KEY = "profecia-estudios-completados";

export const lessonIds = ["gran-conflicto", "leer-profecia", "daniel-ocho-nueve", "santuario-juicio", "tres-angeles", "adoracion-libertad", "muerte-discernimiento", "venida-tierra-nueva"];

export const resources = [
  { id: "glossary", title: "Diccionario de símbolos", kind: "Herramienta", description: "Descubre el significado de 26 símbolos y sus pasajes bíblicos.", lesson: 0, glyph: "✧" },
  { id: "daniel", title: "La estatua de Daniel", kind: "Exploración 3D", description: "Gira la estatua y descubre la historia detrás de cada material.", lesson: 1, glyph: "◈" },
  { id: "timeline", title: "La cadena profética", kind: "Cronología", description: "Conecta los reinos y compara las visiones de Daniel.", lesson: 2, glyph: "⌁" },
  { id: "sanctuary", title: "El santuario", kind: "Exploración 3D", description: "Entra al atrio, recorre sus objetos y explora sus conexiones.", lesson: 3, glyph: "⌂" },
  { id: "messages", title: "Panoramas de Apocalipsis", kind: "Mapa interactivo", description: "Conecta iglesias, sellos, trompetas y el desenlace del relato.", lesson: 4, glyph: "◎" },
  { id: "sources", title: "La brújula del estudio", kind: "Siempre disponible", description: "Consulta el método, las fuentes y las claves para una lectura responsable.", lesson: -1, glyph: "✦" },
] as const;
export type ResourceId = typeof resources[number]["id"];

import { challenges } from "./challenges.ts";
export { challenges } from "./challenges.ts";

export type Journey = {
  version: 1;
  started: boolean;
  completed: string[];
  unlockedAll: boolean;
  currentLesson: number;
  steps: Record<string, number>;
  answers: Record<string, number>;
  guides: Record<string, GuideProgress>;
  helpEnabled: boolean;
  exploredVisuals: string[];
  firstLevel: FirstLevelProgress;
  levels: Record<string, FirstLevelProgress>;
};

export function freshJourney(): Journey {
  return { version: 1, started: false, completed: [], unlockedAll: false, currentLesson: 0, steps: {}, answers: {}, guides: {}, helpEnabled: true, exploredVisuals: [], firstLevel: freshFirstLevel(), levels: {} };
}

function parse(raw: string | null): unknown {
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}
function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
function knownLessons(value: unknown): string[] {
  return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === "string" && lessonIds.includes(id)))] : [];
}
export function nextLesson(state: Journey): number {
  const index = lessonIds.findIndex((id) => !state.completed.includes(id));
  return index < 0 ? lessonIds.length - 1 : index;
}
export function canOpenLesson(_state: Journey, index: number): boolean {
  return Number.isInteger(index) && index >= 0 && index < lessonIds.length;
}
export function resourceUnlocked(state: Journey, resource: typeof resources[number]): boolean {
  return resource.lesson < 0 || state.unlockedAll || state.completed.includes(lessonIds[resource.lesson]);
}

export function firstUnfinishedStep(state: Journey, index: number): number {
  const id = lessonIds[index];
  const guide = missionGuides[index];
  if (!id || !guide) return 0;
  if (state.completed.includes(id)) return state.steps[id] ?? 0;
  if (!guideComplete(state.guides[`${id}:discover`], guide.discover)) return 0;
  if (!guideComplete(state.guides[`${id}:connect`], guide.connect)) return 1;
  return 2;
}

export function restoreJourney(raw: string | null, legacy: string | null): Journey {
  const parsed = record(parse(raw));
  const saved = parsed.version === 1 ? parsed : {};
  const state = freshJourney();
  // Include the old site's progress without ever writing to its storage key.
  state.completed = knownLessons([...knownLessons(saved.completed), ...knownLessons(parse(legacy))]);
  state.started = saved.started === true || state.completed.length > 0;
  state.unlockedAll = saved.unlockedAll === true;
  state.helpEnabled = typeof saved.helpEnabled === "boolean" ? saved.helpEnabled : true;
  state.firstLevel = restoreFirstLevel(saved.firstLevel);
  for (const [index, id] of lessonIds.entries()) {
    if (index > 0 && Object.hasOwn(record(saved.levels), id)) state.levels[id] = restoreFirstLevel(record(saved.levels)[id], levelDefinitions[index]);
    const step = record(saved.steps)[id];
    const answer = record(saved.answers)[id];
    if (typeof step === "number" && Number.isInteger(step) && step >= 0 && step <= 2) state.steps[id] = step;
    if (typeof answer === "number" && Number.isInteger(answer) && answer >= 0 && answer <= 2) state.answers[id] = answer;
    const guides = record(saved.guides);
    const discoverKey = `${id}:discover`;
    const connectKey = `${id}:connect`;
    if (Object.hasOwn(guides, discoverKey)) state.guides[discoverKey] = restoreGuide(guides[discoverKey], missionGuides[index].discover);
    if (Object.hasOwn(guides, connectKey) && guideComplete(state.guides[discoverKey], missionGuides[index].discover)) {
      state.guides[connectKey] = restoreGuide(guides[connectKey], missionGuides[index].connect);
    }
  }
  state.exploredVisuals = Array.isArray(saved.exploredVisuals)
    ? [...new Set(saved.exploredVisuals.filter((id): id is string => typeof id === "string" && /^(empire|sanctuary|revelation)-[a-zA-Z0-9-]+$/.test(id)))].slice(0, 100) : [];
  state.currentLesson = typeof saved.currentLesson === "number" && canOpenLesson(state, saved.currentLesson) ? saved.currentLesson : nextLesson(state);
  return state;
}

export function completeLesson(state: Journey, index: number, daniel?: Pick<JourneyState, "earnedCard">): Journey {
  const id = lessonIds[index];
  if (!canOpenLesson(state, index) || state.completed.includes(id) || state.steps[id] !== 2) return state;
  if (firstUnfinishedStep(state, index) !== 2) return state;
  const solved = index === 1 ? daniel?.earnedCard === true : state.answers[id] === challenges[index].answer;
  if (!solved) return state;
  const next = { ...state, started: true, completed: [...state.completed, id] };
  return { ...next, currentLesson: nextLesson(next) };
}

export function claimFirstLevel(state: Journey): Journey {
  const progress = restoreFirstLevel(state.firstLevel);
  if (!firstLevelComplete(progress)) return state;
  const next = { ...state, started: true, completed: [...new Set([...state.completed, lessonIds[0]])], firstLevel: { ...progress, claimed: true, stage: 4 } };
  return { ...next, currentLesson: nextLesson(next) };
}


export function levelProgress(state: Journey, index: number): FirstLevelProgress {
  return restoreFirstLevel(index === 0 ? state.firstLevel : state.levels?.[lessonIds[index]], levelDefinitions[index]);
}

export function claimLevel(state: Journey, index: number): Journey {
  const definition = levelDefinitions[index];
  if (!definition) return state;
  if (index === 0) return claimFirstLevel(state);
  const progress = levelProgress(state, index);
  if (!firstLevelComplete(progress, definition)) return state;
  const id = lessonIds[index];
  const next = { ...state, started: true, completed: [...new Set([...state.completed, id])],
    levels: { ...state.levels, [id]: { ...progress, claimed: true, stage: rewardStage(definition) } } };
  return { ...next, currentLesson: nextLesson(next) };
}
