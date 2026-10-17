import type { GuideActivity } from "./missionGuides";

export type GuideProgress = {
  solved: number[];
  showHint: boolean;
  wrong: boolean;
};

export function freshGuide(): GuideProgress {
  return { solved: [], showHint: false, wrong: false };
}

function validActivity(activity: GuideActivity): boolean {
  return activity.rounds.length > 0 && activity.rounds.every((round) =>
    Number.isInteger(round.answer) && round.answer >= 0 && round.answer < round.options.length,
  );
}

function validPrefix(solved: unknown, activity: GuideActivity): solved is number[] {
  return validActivity(activity) && Array.isArray(solved) && solved.length <= activity.rounds.length &&
    Array.from(solved).every((answer, index) => Number.isInteger(answer) && answer === activity.rounds[index].answer);
}

export function guideComplete(state: GuideProgress | undefined, activity: GuideActivity): boolean {
  return !!state && validPrefix(state.solved, activity) && state.solved.length === activity.rounds.length;
}

export function applyGuideChoice(state: GuideProgress, index: number, activity: GuideActivity): GuideProgress {
  if (!validPrefix(state.solved, activity)) return freshGuide();
  const round = activity.rounds[state.solved.length];
  if (!round || !Number.isInteger(index) || index < 0 || index >= round.options.length) return state;
  if (index !== round.answer) return { ...state, showHint: true, wrong: true };
  return { solved: [...state.solved, index], showHint: false, wrong: false };
}

export function restoreGuide(value: unknown, activity: GuideActivity): GuideProgress {
  if (!value || typeof value !== "object" || Array.isArray(value)) return freshGuide();
  const candidate = value as Record<string, unknown>;
  if (!validPrefix(candidate.solved, activity) || typeof candidate.showHint !== "boolean" || typeof candidate.wrong !== "boolean") return freshGuide();
  const complete = candidate.solved.length === activity.rounds.length;
  return {
    solved: [...candidate.solved],
    showHint: !complete && (candidate.showHint || candidate.wrong),
    wrong: !complete && candidate.wrong,
  };
}
