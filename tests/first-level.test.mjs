import assert from "node:assert/strict";
import test from "node:test";
import { connectFirstLevel, firstLevelComplete, firstLevelReach, firstLevelTasks, freshFirstLevel, restoreFirstLevel } from "../app/data/firstLevel.ts";
import { claimFirstLevel, freshJourney, restoreJourney, resourceUnlocked, resources } from "../app/data/journey.ts";

const resolved = () => ({ ...freshFirstLevel(), started: true, stage: 3, mediaDone: [0, 1], explored: [0, 1, 2], reading: 2, task: 3, classified: { 2: [0, 1, 2, 3] }, matched: [0, 1, 2], solved: firstLevelTasks.map((task) => task.answer) });

test("media steps accept a voluntary continue without requiring playback time", () => {
  const fresh = freshFirstLevel();
  assert.equal(firstLevelReach(fresh), 0);
  assert.equal(firstLevelReach({ ...fresh, mediaDone: [0] }), 1);
  assert.equal(firstLevelReach({ ...fresh, mediaDone: [0, 1] }), 2);
  assert.equal(firstLevelReach(resolved()), 3);
});

test("restoration preserves partial exercises, exploration, and separate playback positions", () => {
  const partial = { ...resolved(), stage: 3, task: 2, solved: [1, 1], positions: { "video:GtZcbpFiXmA": 45, "podcast:GtZcbpFiXmA": 123 } };
  const journey = { ...freshJourney(), firstLevel: partial };
  assert.deepEqual(restoreJourney(JSON.stringify(journey), null).firstLevel, partial);
  assert.equal(firstLevelComplete(partial), false);
  assert.equal(claimFirstLevel(journey), journey);
});

test("an incorrect or missing activity cannot earn a reward, even after exploring all content", () => {
  for (let i = 0; i < firstLevelTasks.length; i++) {
    const firstLevel = resolved();
    firstLevel.solved[i] = 99;
    const state = { ...freshJourney(), firstLevel };
    assert.equal(claimFirstLevel(state), state);
  }
  for (const field of ["mediaDone", "explored"]) {
    const state = { ...freshJourney(), firstLevel: { ...resolved(), [field]: [] } };
    assert.equal(claimFirstLevel(state), state);
  }
});

test("claiming adds one achievement and its collection item; revisiting never duplicates it", () => {
  const initial = { ...freshJourney(), firstLevel: resolved() };
  const claimed = claimFirstLevel(initial);
  assert.deepEqual(claimed.completed, ["gran-conflicto"]);
  assert.equal(claimed.firstLevel.stage, 4);
  assert.equal(claimed.firstLevel.claimed, true);
  assert.equal(resourceUnlocked(claimed, resources[0]), true);
  assert.deepEqual(restoreJourney(JSON.stringify(claimed), null).firstLevel, claimed.firstLevel);
  assert.deepEqual(claimFirstLevel(claimed).completed, claimed.completed);
  const legacy = { ...initial, completed: ["gran-conflicto", "leer-profecia"] };
  assert.deepEqual(claimFirstLevel(legacy).completed, legacy.completed);
});

test("malformed storage cannot skip unresolved questions or invent a collected reward", () => {
  const restored = restoreFirstLevel({ ...resolved(), stage: 900, task: 900, solved: [1, 0, 0, 1, 2], claimed: true, positions: { "video:GtZcbpFiXmA": -1, "podcast:GtZcbpFiXmA": Infinity, invalid: 45 } });
  assert.deepEqual(restored.solved, [1]);
  assert.equal(restored.task, 1);
  assert.equal(restored.stage, 3);
  assert.equal(restored.claimed, false);
  assert.deepEqual(restored.positions, {});
  assert.deepEqual(restoreFirstLevel(null), freshFirstLevel());
  assert.deepEqual(restoreJourney(null, JSON.stringify(["gran-conflicto"])).firstLevel, freshFirstLevel());
});


test("matching accepts only corresponding pairs and requires all three connections", () => {
  let state = { ...resolved(), matched: [], solved: [1], task: 1 };
  assert.equal(connectFirstLevel(state, 0, 2), state);
  state = connectFirstLevel(state, 0, 0);
  assert.deepEqual(state.matched, [0]);
  assert.deepEqual(state.solved, [1]);
  assert.equal(connectFirstLevel(state, 0, 0), state);
  assert.equal(connectFirstLevel(state, 8, 8), state);
  state = restoreFirstLevel(state);
  assert.deepEqual(state.matched, [0]);
  state = connectFirstLevel(state, 2, 2);
  assert.deepEqual(state.solved, [1]);
  state = connectFirstLevel(state, 1, 1);
  assert.deepEqual(state.solved, [1, 1]);
  assert.deepEqual(restoreFirstLevel(state), state);
});

test("partial connections cannot mark the matching activity complete", () => {
  const incomplete = { ...resolved(), matched: [0, 2], claimed: true };
  assert.equal(firstLevelComplete(incomplete), false);
  assert.deepEqual(restoreFirstLevel(incomplete).solved, [1]);
  assert.equal(restoreFirstLevel(incomplete).claimed, false);
});

test("previously completed activity retains earned credit on migration", () => {
  const legacy = { ...resolved(), claimed: true, stage: 4, task: 4, solved: [1, 1, 0, 1, 2] };
  delete legacy.activityVersion;
  delete legacy.classified;
  delete legacy.matched;
  const restored = restoreFirstLevel(legacy);
  assert.equal(restored.claimed, true);
  assert.deepEqual(restored.matched, [0, 1, 2]);
});
