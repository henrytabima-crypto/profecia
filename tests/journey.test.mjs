import assert from "node:assert/strict";
import test from "node:test";
import { canOpenLesson, challenges, completeLesson, firstUnfinishedStep, freshJourney, lessonIds, nextLesson, resources, resourceUnlocked, restoreJourney } from "../app/data/journey.ts";
import { applyGuideChoice, freshGuide } from "../app/data/guidedProgress.ts";
import { missionGuides } from "../app/data/missionGuides.ts";
import { modules } from "../app/data/studies.ts";

test("mission ordering and rewards correspond to the preserved study catalog", () => {
  assert.deepEqual(lessonIds, modules.map((lesson) => lesson.id));
  assert.equal(challenges.length, modules.length);
  assert.equal(missionGuides.length, modules.length);
  assert.equal(new Set(resources.map((resource) => resource.id)).size, resources.length);
  assert.ok(resources.every((resource) => resource.lesson >= -1 && resource.lesson < modules.length));
});

function solveGuide(activity) {
  return activity.rounds.reduce((state, round) => applyGuideChoice(state, round.answer, activity), freshGuide());
}

function solve(state, index) {
  const id = lessonIds[index];
  return {
    ...state,
    steps: { ...state.steps, [id]: 2 },
    answers: index === 1 ? { ...state.answers } : { ...state.answers, [id]: challenges[index].answer },
    guides: { ...state.guides, [`${id}:discover`]: solveGuide(missionGuides[index].discover), [`${id}:connect`]: solveGuide(missionGuides[index].connect) },
  };
}

function finishSolved(state, index) {
  return completeLesson(solve(state, index), index, index === 1 ? { earnedCard: true } : undefined);
}

test("a new expedition exposes every mission while rewards still require completion", () => {
  const state = freshJourney();
  assert.deepEqual(lessonIds.map((_, index) => canOpenLesson(state, index)), [true, true, true, true, true, true, true, true]);
  assert.deepEqual(resources.filter((item) => resourceUnlocked(state, item)).map((item) => item.id), ["sources"]);
  assert.equal(canOpenLesson(state, -1), false);
  assert.equal(canOpenLesson(state, 8), false);
  assert.equal(canOpenLesson(state, 0.5), false);
});

test("finishing requires an accessible mission and its solved checkpoint", () => {
  const initial = freshJourney();
  assert.equal(completeLesson(initial, 0), initial);
  assert.equal(completeLesson(solve(initial, 1), 1).completed.length, 0);
  assert.equal(completeLesson(solve(initial, 0), 0).completed.length, 1);
  const wrong = solve(initial, 0); wrong.answers[lessonIds[0]] = 0;
  assert.equal(completeLesson(wrong, 0), wrong);
  const skipped = solve(initial, 0); skipped.steps[lessonIds[0]] = 0;
  assert.equal(completeLesson(skipped, 0), skipped);
});

test("each completed mission unlocks the next and its matching resource through the ending", () => {
  let state = freshJourney();
  for (let index = 0; index < 8; index++) {
    const previous = state;
    state = finishSolved(state, index);
    assert.equal(state.completed.length, index + 1);
    assert.equal(previous.completed.length, index);
    assert.equal(nextLesson(state), Math.min(index + 1, 7));
    assert.equal(canOpenLesson(state, Math.min(index + 1, 7)), true);
    for (const resource of resources) assert.equal(resourceUnlocked(state, resource), resource.lesson <= index);
    assert.equal(completeLesson(state, index), state, "replay must not duplicate achievements");
    state = restoreJourney(JSON.stringify(state), null);
  }
  assert.equal(state.completed.length, 8);
  assert.equal(resources.every((resource) => resourceUnlocked(state, resource)), true);
});

test("the Daniel mission requires its earned card and final mission step without inventing an answer", () => {
  const state = solve(finishSolved(freshJourney(), 0), 1);
  const id = lessonIds[1];
  assert.equal(completeLesson(state, 1), state);
  assert.equal(completeLesson(state, 1, { earnedCard: false }), state, "partial Daniel progress earns no mission");
  const oldAnswer = { ...state, answers: { ...state.answers, [id]: challenges[1].answer } };
  assert.equal(completeLesson(oldAnswer, 1), oldAnswer, "an old quiz answer cannot replace the guided challenge");
  const skipped = { ...state, steps: { ...state.steps, [id]: 1 } };
  assert.equal(completeLesson(skipped, 1, { earnedCard: true }), skipped);

  const earned = completeLesson(state, 1, { earnedCard: true });
  assert.deepEqual(earned.completed, [lessonIds[0], id]);
  assert.deepEqual(earned.answers, state.answers);
  assert.equal(earned.answers[id], undefined);
  assert.equal(earned.currentLesson, 2);
  assert.equal(resourceUnlocked(earned, resources.find((item) => item.id === "daniel")), true);
  assert.deepEqual(state.completed, [lessonIds[0]], "completion must preserve its input");
  assert.equal(completeLesson(earned, 1, { earnedCard: true }), earned, "replaying does not duplicate the mission");
  assert.equal(completeLesson(earned, 1, { earnedCard: false }), earned, "a later replay never revokes the mission");
});

test("Daniel can be completed out of order but still requires its earned card", () => {
  const state = solve(freshJourney(), 1);
  assert.equal(completeLesson(state, 1), state);
  assert.equal(completeLesson(state, 1, { earnedCard: false }), state);
  const earned = completeLesson(state, 1, { earnedCard: true });
  assert.deepEqual(earned.completed, [lessonIds[1]]);
  assert.equal(nextLesson(earned), 0);
  assert.equal(canOpenLesson(earned, 2), true);
  assert.equal(resourceUnlocked(earned, resources.find((item) => item.id === "daniel")), true);
  assert.equal(resourceUnlocked(earned, resources.find((item) => item.id === "glossary")), false);
});

test("previously completed Daniel missions survive restoration without granting new completions", () => {
  const id = lessonIds[1];
  const legacy = JSON.stringify([id]);
  const state = restoreJourney(null, legacy);
  assert.deepEqual(state.completed, [id]);
  assert.equal(resourceUnlocked(state, resources.find((item) => item.id === "daniel")), true);
  assert.equal(completeLesson(state, 1), state);
  assert.equal(completeLesson(state, 1, { earnedCard: false }), state);
  assert.deepEqual(restoreJourney(JSON.stringify(state), legacy).completed, [id]);

  const unfinished = { ...freshJourney(), steps: { [id]: 2 }, answers: { [id]: challenges[1].answer } };
  assert.deepEqual(restoreJourney(JSON.stringify(unfinished), null).completed, []);
});

test("migrates sparse old progress without inventing completions or removing rewards", () => {
  const legacy = JSON.stringify([lessonIds[3], "deleted-lesson", lessonIds[3], lessonIds[7]]);
  const state = restoreJourney(null, legacy);
  assert.deepEqual(state.completed, [lessonIds[3], lessonIds[7]]);
  assert.equal(state.started, true);
  assert.equal(nextLesson(state), 0);
  assert.equal(canOpenLesson(state, 0), true);
  assert.equal(canOpenLesson(state, 3), true);
  assert.equal(canOpenLesson(state, 2), true);
  assert.equal(resourceUnlocked(state, resources.find((item) => item.id === "sanctuary")), true);
  assert.equal(restoreJourney(JSON.stringify(state), legacy).completed.length, 2);
});

test("restores an unfinished mission at its current step and preserves explored connections", () => {
  const state = { ...freshJourney(), started: true, currentLesson: 0, steps: { [lessonIds[0]]: 1 }, answers: { [lessonIds[0]]: 1 }, guides: { [`${lessonIds[0]}:discover`]: solveGuide(missionGuides[0].discover) }, helpEnabled: false, exploredVisuals: ["empire-babylon", "sanctuary-ark"] };
  assert.deepEqual(restoreJourney(JSON.stringify(state), null), state);
  assert.equal(firstUnfinishedStep(state, 0), 1);
});

test("every mission requires both guided activities even with a correct final answer or free exploration", () => {
  for (const [index, id] of lessonIds.entries()) {
    const solved = solve({ ...freshJourney(), unlockedAll: true }, index);
    const evidence = index === 1 ? { earnedCard: true } : undefined;
    for (const missing of ["discover", "connect"]) {
      const state = { ...solved, guides: { ...solved.guides, [`${id}:${missing}`]: freshGuide() } };
      assert.equal(completeLesson(state, index, evidence), state, `${id} cannot skip ${missing}`);
    }
    const legacyStep = { ...solved, guides: {} };
    assert.equal(completeLesson(legacyStep, index, evidence), legacyStep);
    assert.equal(firstUnfinishedStep(legacyStep, index), 0);
    assert.deepEqual(completeLesson(solved, index, evidence).completed, [id]);
  }
});

test("the next unfinished stage follows actual guided progress and respects completed legacy lessons", () => {
  const id = lessonIds[0];
  const initial = { ...freshJourney(), steps: { [id]: 2 } };
  assert.equal(firstUnfinishedStep(initial, 0), 0);
  const discovered = { ...initial, guides: { [`${id}:discover`]: solveGuide(missionGuides[0].discover) } };
  assert.equal(firstUnfinishedStep(discovered, 0), 1);
  const connected = { ...discovered, guides: { ...discovered.guides, [`${id}:connect`]: solveGuide(missionGuides[0].connect) } };
  assert.equal(firstUnfinishedStep(connected, 0), 2);
  assert.equal(firstUnfinishedStep({ ...initial, completed: [id] }, 0), 2);
  assert.equal(firstUnfinishedStep({ ...freshJourney(), completed: [id] }, 0), 0);
  assert.equal(firstUnfinishedStep(initial, -1), 0);
  assert.equal(firstUnfinishedStep(initial, 8), 0);
});

test("restoration validates ordered guide prefixes and retains help preferences without accepting skipped discovery", () => {
  const id = lessonIds[0];
  const activity = missionGuides[0].connect;
  const partial = applyGuideChoice(freshGuide(), activity.rounds[0].answer, activity);
  const saved = {
    ...freshJourney(),
    helpEnabled: false,
    guides: {
      [`${id}:discover`]: solveGuide(missionGuides[0].discover),
      [`${id}:connect`]: partial,
      [`${lessonIds[1]}:connect`]: solveGuide(missionGuides[1].connect),
      "unknown:discover": solveGuide(missionGuides[0].discover),
    },
  };
  const restored = restoreJourney(JSON.stringify(saved), null);
  assert.equal(restored.helpEnabled, false);
  assert.deepEqual(restored.guides, { [`${id}:discover`]: saved.guides[`${id}:discover`], [`${id}:connect`]: partial });
  assert.deepEqual(restored.completed, []);

  const malformed = { ...saved, helpEnabled: "false", guides: { [`${id}:discover`]: { solved: [999], showHint: false, wrong: false }, [`${id}:connect`]: solveGuide(activity) } };
  const rejected = restoreJourney(JSON.stringify(malformed), null);
  assert.equal(rejected.helpEnabled, true);
  assert.deepEqual(rejected.guides, { [`${id}:discover`]: freshGuide() });
  assert.equal(firstUnfinishedStep(rejected, 0), 0);
});

test("fresh journey starts over with independent empty progress and guided help enabled", () => {
  const completed = lessonIds.reduce((state, _, index) => finishSolved(state, index), freshJourney());
  assert.equal(completed.completed.length, 8);
  const reset = freshJourney();
  assert.deepEqual(reset.completed, []);
  assert.deepEqual(reset.guides, {});
  assert.deepEqual(reset.steps, {});
  assert.deepEqual(reset.answers, {});
  assert.equal(reset.started, false);
  assert.equal(reset.unlockedAll, false);
  assert.equal(reset.helpEnabled, true);
  assert.equal(reset.currentLesson, 0);
  assert.equal(firstUnfinishedStep(reset, 0), 0);
  assert.equal(completed.completed.length, 8, "reset does not mutate its previous value");
});

test("free exploration opens every guide and resource without awarding achievements", () => {
  const state = { ...freshJourney(), unlockedAll: true };
  assert.ok(lessonIds.every((_, index) => canOpenLesson(state, index)));
  assert.ok(resources.every((item) => resourceUnlocked(state, item)));
  assert.deepEqual(state.completed, []);
  const restored = restoreJourney(JSON.stringify(state), null);
  assert.equal(restored.unlockedAll, true);
  const earned = completeLesson(solve(restored, 4), 4);
  assert.deepEqual(earned.completed, [lessonIds[4]]);
  const guided = { ...earned, unlockedAll: false };
  assert.equal(canOpenLesson(guided, 6), true);
  assert.equal(canOpenLesson(guided, 0), true);
  assert.equal(canOpenLesson(guided, 4), true);
  assert.equal(resourceUnlocked(guided, resources.find((item) => item.id === "messages")), true);
});

test("malformed storage, stale IDs and unsupported versions recover safely", () => {
  for (const raw of ["{", "null", "true", "3", '"hello"', "[]", '{"completed": {}}']) assert.deepEqual(restoreJourney(raw, raw), freshJourney());
  const dirty = restoreJourney(JSON.stringify({ version: 1, started: "true", unlockedAll: "yes", completed: [lessonIds[0], lessonIds[0], null, "unknown"], currentLesson: 99, steps: { [lessonIds[0]]: 9, [lessonIds[1]]: 1 }, answers: { [lessonIds[0]]: -1 }, exploredVisuals: ["empire-babylon", "empire-babylon", {}, "invalid"] }), null);
  assert.deepEqual(dirty.completed, [lessonIds[0]]);
  assert.equal(dirty.unlockedAll, false);
  assert.equal(dirty.currentLesson, 1);
  assert.deepEqual(dirty.steps, { [lessonIds[1]]: 1 });
  assert.deepEqual(dirty.answers, {});
  assert.deepEqual(dirty.exploredVisuals, ["empire-babylon"]);
  assert.deepEqual(restoreJourney('{"version":99,"unlockedAll":true}', null), freshJourney());
});
