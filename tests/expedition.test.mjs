import assert from "node:assert/strict";
import test from "node:test";
import { awardTransition, levelExperience, missionExperience, resumeLesson, stageComplete } from "../app/data/expedition.ts";
import { freshFirstLevel, rewardStage } from "../app/data/firstLevel.ts";
import { levelDefinitions } from "../app/data/levels.ts";
import { freshJourney, lessonIds, restoreJourney } from "../app/data/journey.ts";

test("resume follows a selected unfinished mission and survives reload without enforcing order", () => {
  const state = freshJourney();
  state.started = true;
  state.currentLesson = 5;
  state.levels["adoracion-libertad"] = { ...freshFirstLevel(), started: true, mediaDone: [0, 1], stage: 2, reading: 2, explored: [0, 1] };
  const restored = restoreJourney(JSON.stringify(state), null);
  assert.equal(resumeLesson(restored), 5);
  assert.equal(missionExperience(restored, 5).detail, `Lectura 3 de ${levelDefinitions[5].readings.length}`);
  restored.completed.push("adoracion-libertad");
  assert.equal(resumeLesson(restored), 0);
});

test("old achievements display full progress without inventing activity completion", () => {
  const state = restoreJourney(null, JSON.stringify(["leer-profecia"]));
  assert.equal(missionExperience(state, 1).percent, 100);
  assert.equal(missionExperience(state, 1).complete, true);
  assert.equal(state.levels["leer-profecia"], undefined);
  assert.equal(levelExperience(state.firstLevel, levelDefinitions[0]).percent, 0);
});

test("partial practice and statue exploration contribute to visible progress", () => {
  const definition = levelDefinitions[1];
  const state = { ...freshFirstLevel(), started: true, mediaDone: [0, 1], explored: definition.readings.map((_, i) => i), stage: 3 };
  const base = levelExperience(state, definition).percent;
  state.statueExplored.push(5);
  assert.ok(levelExperience(state, definition).percent > base);
  assert.equal(stageComplete(state, definition, 3), false);
  state.statueExplored = definition.explorationReadings.map((_, i) => i);
  assert.equal(stageComplete(state, definition, 3), true);
  const beforeMatching = levelExperience(state, definition).percent;
  state.matched.push(0, 1, 2);
  assert.ok(levelExperience(state, definition).percent > beforeMatching);
  const beforeClassification = levelExperience(state, definition).percent;
  state.classified[2] = [0, 1];
  assert.ok(levelExperience(state, definition).percent > beforeClassification);
});

test("a full mission reaches 100 only after claiming its reward", () => {
  for (const definition of levelDefinitions) {
    const state = { ...freshFirstLevel(), mediaDone: [0, 1], explored: definition.readings.map((_, i) => i), statueExplored: (definition.explorationReadings ?? []).map((_, i) => i), matched: definition.pairs.map((_, i) => i), solved: definition.tasks.map((task) => task.answer), classified: Object.fromEntries(definition.tasks.flatMap((task, i) => task.classification ? [[i, task.classification.cards.map((_, n) => n)]] : [])) };
    assert.ok(levelExperience(state, definition).percent < 100);
    assert.equal(stageComplete(state, definition, rewardStage(definition)), false);
    state.claimed = true;
    assert.equal(levelExperience(state, definition).percent, 100);
    assert.equal(stageComplete(state, definition, rewardStage(definition)), true);
  }
});


test("award feedback exists only for a newly completed mission, never for restored or replayed credit", () => {
  const before = freshJourney();
  const after = { ...before, completed: ["gran-conflicto"], currentLesson: 1 };
  assert.deepEqual(awardTransition(before, after, 0), { from: 0, to: 1 });
  assert.equal(awardTransition(after, after, 0), null);
  assert.equal(awardTransition(before, before, 0), null);
  const legacy = restoreJourney(null, JSON.stringify(["gran-conflicto"]));
  assert.equal(awardTransition(legacy, after, 0), null);
});

test("a final award stays on the completed destination and out-of-order completion returns to the pending mission", () => {
  const before = { ...freshJourney(), completed: lessonIds.slice(0, 7) };
  const after = { ...before, completed: [...before.completed, "venida-tierra-nueva"], currentLesson: 7 };
  assert.deepEqual(awardTransition(before, after, 7), { from: 7, to: 7 });
  assert.deepEqual(awardTransition(freshJourney(), { ...freshJourney(), completed: ["adoracion-libertad"] }, 5), { from: 5, to: 0 });
});
