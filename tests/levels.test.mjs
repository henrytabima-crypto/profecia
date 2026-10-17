import assert from "node:assert/strict";
import test from "node:test";
import { existsSync } from "node:fs";
import { levelDefinitions } from "../app/data/levels.ts";
import { classifyLevelCard, connectFirstLevel, exploreStatuePart, firstLevelComplete, firstLevelReach, freshFirstLevel, levelStages, practiceStage, rewardStage, levelTaskComplete, restoreFirstLevel } from "../app/data/firstLevel.ts";
import { claimLevel, freshJourney, lessonIds, levelProgress, restoreJourney } from "../app/data/journey.ts";

function completedProgress(definition) {
  return { ...freshFirstLevel(), started: true, stage: practiceStage(definition), mediaDone: [0, 1],
    statueExplored: (definition.explorationReadings ?? []).map((_, i) => i), statuePart: 0,
    explored: definition.readings.map((_, i) => i), reading: definition.readings.length - 1,
    solved: definition.tasks.map((task) => task.answer), task: definition.tasks.length - 1,
    matched: definition.pairs.map((_, i) => i),
    classified: Object.fromEntries(definition.tasks.flatMap((task, i) => task.classification ? [[i, task.classification.cards.map((_, n) => n)]] : [])) };
}

test("the second study adds statue exploration between reading and practice", () => {
  assert.deepEqual(levelStages(levelDefinitions[0]), ["Mira", "Escucha", "Lee", "Practica", "Tu premio"]);
  const definition = levelDefinitions[1];
  assert.deepEqual(levelStages(definition), ["Mira", "Escucha", "Lee", "Explora", "Practica", "Tu premio"]);
  const progress = { ...completedProgress(definition), explored: [], statueExplored: [] };
  assert.equal(firstLevelReach(progress, definition), 2);
  assert.equal(firstLevelComplete(progress, definition), false);
  progress.explored = definition.readings.map((_, i) => i);
  assert.equal(firstLevelReach(progress, definition), 3);
  progress.statueExplored = definition.explorationReadings.map((_, i) => i);
  assert.equal(firstLevelReach(progress, definition), 4);
  assert.equal(firstLevelComplete(progress, definition), true);
});

test("all levels share the base flow and award an existing infographic", () => {
  for (const definition of levelDefinitions) {
    assert.deepEqual(levelStages(definition).filter((stage) => stage !== "Explora"), ["Mira", "Escucha", "Lee", "Practica", "Tu premio"]);
    assert.ok(definition.media.video?.id);
    assert.ok(definition.media.podcast?.id);
    assert.ok(definition.readings.length);
    assert.ok(definition.tasks.length);
    assert.ok(definition.media.infographic);
    assert.ok(existsSync(new URL('../public' + definition.media.infographic, import.meta.url)));
  }
});

test("statue selections accumulate in the same view without advancing, duplicates, or lost progress", () => {
  const definition = levelDefinitions[1];
  let progress = { ...completedProgress(definition), stage: 3, statueExplored: [], solved: [], task: 0 };
  assert.equal(exploreStatuePart(progress, -1, definition), progress);
  assert.equal(exploreStatuePart(progress, 6, definition), progress);
  assert.equal(exploreStatuePart(progress, 1.5, definition), progress);
  assert.equal(exploreStatuePart(progress, 0, levelDefinitions[0]), progress);
  for (const part of [4, 1, 5, 0, 3, 2]) {
    progress = exploreStatuePart(progress, part, definition);
    assert.equal(progress.stage, 3);
    assert.equal(progress.statuePart, part);
    assert.equal(exploreStatuePart(progress, part, definition), progress);
    assert.deepEqual(restoreFirstLevel(progress, definition), progress);
    assert.equal(firstLevelReach(progress, definition), progress.statueExplored.length === 6 ? 4 : 3);
  }
  const revisit = exploreStatuePart(progress, 4, definition);
  assert.equal(revisit.statueExplored.length, 6);
  assert.equal(revisit.stage, 3);
  const reading = { ...progress, stage: 2 };
  assert.equal(exploreStatuePart(reading, 0, definition), reading);
});

test("old statue progress migrates separately from reading and preserves an earned reward", () => {
  const definition = levelDefinitions[1];
  const legacy = { ...completedProgress(definition), explored: [0, 2, 5], reading: 2, stage: 2 };
  delete legacy.flowVersion;
  delete legacy.statueExplored;
  delete legacy.statuePart;
  const partial = restoreFirstLevel(legacy, definition);
  assert.deepEqual(partial.explored, []);
  assert.deepEqual(partial.statueExplored, [0, 2, 5]);
  assert.equal(partial.statuePart, 2);
  assert.equal(partial.stage, 2);
  assert.deepEqual(restoreFirstLevel(partial, definition), partial);
  const earned = restoreFirstLevel({ ...legacy, explored: [0, 1, 2, 3, 4, 5], claimed: true, stage: 4 }, definition);
  assert.equal(earned.claimed, true);
  assert.equal(earned.stage, 5);
  assert.deepEqual(earned.explored, definition.readings.map((_, i) => i));
});

test("all eight levels can complete, persist, and award exactly one achievement independently", () => {
  let journey = freshJourney();
  for (const definition of levelDefinitions) {
    const progress = completedProgress(definition);
    journey = definition.index === 0 ? { ...journey, firstLevel: progress }
      : { ...journey, levels: { ...journey.levels, [lessonIds[definition.index]]: progress } };
    journey = claimLevel(journey, definition.index);
    assert.equal(levelProgress(journey, definition.index).stage, rewardStage(definition));
    assert.equal(levelProgress(journey, definition.index).claimed, true);
    const saved = restoreJourney(JSON.stringify(journey), null);
    assert.deepEqual(saved, journey);
    assert.deepEqual(claimLevel(saved, definition.index), journey);
  }
  assert.deepEqual(journey.completed, lessonIds);
});

test("statue exploration requires all six parts, even when visited out of order", () => {
  const definition = levelDefinitions[1];
  assert.equal(definition.explorationReadings.length, 6);
  const progress = { ...completedProgress(definition), statueExplored: [5, 1, 4, 2, 0] };
  assert.equal(firstLevelReach(progress, definition), 3);
  assert.equal(firstLevelComplete(progress, definition), false);
  const journey = { ...freshJourney(), levels: { "leer-profecia": progress } };
  assert.equal(claimLevel(journey, 1), journey);
  progress.statueExplored.push(3);
  assert.equal(firstLevelReach(progress, definition), 4);
  assert.equal(firstLevelComplete(progress, definition), true);
});

test("six statue pairs persist partial progress and errors never erase correct connections", () => {
  const definition = levelDefinitions[1];
  let progress = { ...completedProgress(definition), matched: [], solved: [definition.tasks[0].answer], task: 1 };
  for (const i of [5, 2, 0, 4, 1, 3]) {
    assert.equal(connectFirstLevel(progress, i, (i + 1) % 6, definition), progress);
    progress = connectFirstLevel(progress, i, i, definition);
    assert.equal(progress.solved.length, progress.matched.length === 6 ? 2 : 1);
    assert.deepEqual(restoreFirstLevel(progress, definition), progress);
  }
});

test("each level validates its own task and exploration boundaries", () => {
  for (const definition of levelDefinitions) {
    const progress = completedProgress(definition);
    progress.solved[0] = 99;
    progress.stage = 4;
    progress.claimed = true;
    const restored = restoreFirstLevel(progress, definition);
    assert.equal(restored.claimed, false);
    assert.equal(restored.task, 0);
    assert.equal(restored.stage, practiceStage(definition));
    assert.deepEqual(restored.solved, []);
  }
});

test("older achievements survive without inventing multimedia viewing or statue exploration", () => {
  const saved = { version: 1, completed: ["leer-profecia", "santuario-juicio"] };
  const restored = restoreJourney(JSON.stringify(saved), null);
  assert.deepEqual(restored.completed, saved.completed);
  assert.deepEqual(levelProgress(restored, 1), freshFirstLevel());
  assert.equal(restored.firstLevel.claimed, false);
});

for (const definition of levelDefinitions.slice(0, 2)) {
  test(`level ${definition.index + 1}: classification saves each card and requires all four correct placements`, () => {
    let progress = { ...completedProgress(definition), task: 2, classified: {}, solved: definition.tasks.slice(0, 2).map((task) => task.answer) };
    const cards = definition.tasks[2].classification.cards;
    assert.equal(classifyLevelCard(progress, 2, 99, 0, definition), progress);
    assert.equal(classifyLevelCard(progress, 1, 0, 0, definition), progress);
    for (const n of [3, 0, 2, 1]) {
      assert.equal(classifyLevelCard(progress, 2, n, 1 - cards[n].category, definition), progress);
      progress = classifyLevelCard(progress, 2, n, cards[n].category, definition);
      assert.equal(classifyLevelCard(progress, 2, n, cards[n].category, definition), progress);
      assert.equal(levelTaskComplete(progress, 2, definition), progress.classified[2].length === 4);
      assert.deepEqual(restoreFirstLevel(progress, definition), progress);
    }
    const incomplete = { ...completedProgress(definition), classified: { 2: [0, 0, 2, 99, -1] }, claimed: true };
    const restored = restoreFirstLevel(incomplete, definition);
    assert.deepEqual(restored.classified, { 2: [0, 2] });
    assert.equal(restored.claimed, false);
    assert.equal(firstLevelComplete(incomplete, definition), false);
    assert.equal(restored.solved.length, 2);
  });

  test(`level ${definition.index + 1}: old single-card progress migrates without losing earned credit`, () => {
    const legacy = { ...completedProgress(definition), claimed: true, stage: 4, task: 4,
      solved: [definition.tasks[0].answer, definition.tasks[1].answer, 0, 1, definition.tasks[3].answer] };
    delete legacy.activityVersion;
    delete legacy.classified;
    const complete = restoreFirstLevel(legacy, definition);
    assert.equal(complete.claimed, true);
    assert.equal(complete.task, 3);
    assert.deepEqual(complete.classified, { 2: [0, 1, 2, 3] });
    const partial = restoreFirstLevel({ ...legacy, task: 3, solved: legacy.solved.slice(0, 3) }, definition);
    assert.equal(partial.claimed, false);
    assert.equal(partial.task, 2);
    assert.deepEqual(partial.classified, { 2: [0] });
    assert.equal(levelTaskComplete(partial, 2, definition), false);
  });
}
