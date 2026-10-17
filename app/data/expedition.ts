import { levelStages, levelTaskComplete, statueComplete, type FirstLevelProgress, type LevelDefinition } from "./firstLevel.ts";
import { canOpenLesson, lessonIds, levelProgress, nextLesson, type Journey } from "./journey.ts";
import { levelDefinitions } from "./levels.ts";

/** Derived UI only: preserve existing storage, achievements and open access. */
export function stageComplete(state: FirstLevelProgress, definition: LevelDefinition, stage: number): boolean {
  const stages = levelStages(definition);
  if (stage < 2) return state.mediaDone.includes(stage);
  if (stage === 2) return definition.readings.every((_, i) => state.explored.includes(i));
  if (stage === stages.length - 1) return state.claimed;
  if (stage === stages.length - 2) return definition.tasks.every((_, i) => levelTaskComplete(state, i, definition));
  return statueComplete(state, definition);
}

export function levelExperience(state: FirstLevelProgress, definition: LevelDefinition) {
  const stages = levelStages(definition);
  const practice = stages.length - 2;
  const exploration = definition.explorationReadings ?? [];
  // Each activity contributes one unit; partial matching and classification count too.
  const taskUnits = definition.tasks.reduce((sum, task, i) => sum + (levelTaskComplete(state, i, definition) ? 1
    : task.classification ? task.classification.cards.filter((_, n) => state.classified[i]?.includes(n)).length / task.classification.cards.length
    : task.kind === "Conecta" && definition.pairs.length ? definition.pairs.filter((_, n) => state.matched.includes(n)).length / definition.pairs.length : 0), 0);
  const total = 3 + definition.readings.length + exploration.length + definition.tasks.length;
  const done = [0, 1].filter((n) => state.mediaDone.includes(n)).length
    + definition.readings.filter((_, i) => state.explored.includes(i)).length
    + exploration.filter((_, i) => state.statueExplored.includes(i)).length + taskUnits + Number(state.claimed);
  const stage = stages[state.stage];
  const detail = state.stage === 2 ? `Lectura ${state.reading + 1} de ${definition.readings.length}`
    : state.stage === practice ? `Actividad ${state.task + 1} de ${definition.tasks.length}`
    : definition.exploration === "statue" && state.stage === 3 ? `${state.statueExplored.length} de ${exploration.length} partes exploradas`
    : state.claimed ? "Premio conseguido" : "A tu ritmo";
  return { percent: Math.min(state.claimed ? 100 : 99, Math.round(done / total * 100)), stage, detail };
}

export function resumeLesson(state: Journey): number {
  return canOpenLesson(state, state.currentLesson) && !state.completed.includes(lessonIds[state.currentLesson]) ? state.currentLesson : nextLesson(state);
}

export function missionExperience(state: Journey, index: number) {
  const progress = levelProgress(state, index);
  const experience = levelExperience(progress, levelDefinitions[index]);
  const complete = state.completed.includes(lessonIds[index]);
  return { ...experience, complete, started: progress.started || experience.percent > 0, percent: complete ? 100 : experience.percent };
}

export type AwardTransition = { from: number; to: number };

/** Ephemeral feedback for a newly earned achievement; never restore from storage. */
export function awardTransition(before: Journey, after: Journey, index: number): AwardTransition | null {
  const id = lessonIds[index];
  return id && !before.completed.includes(id) && after.completed.includes(id)
    ? { from: index, to: resumeLesson(after) } : null;
}
