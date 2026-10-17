import assert from "node:assert/strict";
import test from "node:test";
import {
  initialJourneyState,
  journeyReducer,
  parseJourneyState,
} from "../app/data/danielJourney.ts";

const select = (state, index) => journeyReducer(state, { type: "select", index });
const advance = (state) => journeyReducer(state, { type: "advance" });
const start = () => journeyReducer(initialJourneyState, { type: "start" });
const reload = (state) => parseJourneyState(JSON.stringify(state));

function reachOrder() {
  let state = start();
  for (const index of [0, 1, 2]) state = advance(select(state, index));
  return state;
}

test("completes the five challenges, requiring an explicit advance after each explanation", () => {
  let state = start();
  for (const [step, answer] of [[0, 0], [1, 1], [2, 2]]) {
    assert.equal(state.step, step);
    assert.equal(advance(state), state, "unanswered challenges cannot be skipped");
    state = select(state, answer);
    assert.equal(state.solved, true);
    assert.equal(state.feedback, "correct");
    assert.equal(state.step, step, "the explanation remains available until advance");
    state = advance(state);
  }
  for (const index of [0, 1, 2]) state = select(state, index);
  assert.equal(state.solved, true);
  assert.equal(state.step, 3);
  state = advance(state);
  state = select(state, 5);
  assert.equal(state.step, 4);
  assert.equal(state.earnedCard, false, "the final explanation precedes collecting the card");
  state = advance(state);
  assert.equal(state.step, 5);
  assert.equal(state.earnedCard, true);
  assert.equal(state.solved, false);
  assert.equal(select(state, 0), state);
  assert.equal(advance(state), state);
  assert.deepEqual(reload(state), state);
});

test("wrong answers enable a hint and can be retried without losing the current stage", () => {
  let state = select(start(), 2);
  assert.equal(state.feedback, "incorrect");
  assert.equal(state.showHint, true);
  assert.equal(state.solved, false);
  assert.equal(state.step, 0);
  assert.equal(advance(state), state);
  state = select(state, 0);
  assert.equal(state.solved, true);
  assert.equal(state.feedback, "correct");
  assert.equal(state.showHint, false);
  assert.equal(select(state, 2), state, "an answer cannot change a solved challenge");
});

test("ordering advances after each correct choice and preserves correct choices on mistakes", () => {
  let state = reachOrder();
  state = select(state, 2);
  assert.deepEqual(state.order, []);
  state = select(state, 0);
  assert.deepEqual(state.order, [0]);
  assert.equal(state.solved, false);
  assert.equal(state.feedback, "idle");
  state = select(state, 2);
  assert.deepEqual(state.order, [0]);
  assert.equal(state.feedback, "incorrect");
  assert.deepEqual(reload(state), state);
  state = select(reload(state), 1);
  assert.deepEqual(state.order, [0, 1]);
  assert.equal(state.solved, false);
  assert.equal(advance(state), state);
  state = select(state, 0);
  assert.deepEqual(state.order, [0, 1]);
  state = select(state, 2);
  assert.deepEqual(state.order, [0, 1, 2]);
  assert.equal(state.solved, true);
  assert.equal(select(state, 2), state);
});

test("storage roundtrips all reachable states, including hints and partial ordering", () => {
  let state = initialJourneyState;
  const actions = [
    { type: "toggle-help" }, { type: "start" }, { type: "hint" },
    { type: "select", index: 1 }, { type: "select", index: 0 }, { type: "advance" },
    { type: "select", index: 1 }, { type: "advance" },
    { type: "select", index: 2 }, { type: "advance" },
    { type: "select", index: 0 }, { type: "hint" },
    { type: "select", index: 1 }, { type: "select", index: 2 },
    { type: "advance" }, { type: "select", index: 5 }, { type: "advance" },
    { type: "toggle-help" }, { type: "replay" },
  ];
  for (const action of actions) {
    state = journeyReducer(state, action);
    assert.deepEqual(reload(state), state, `roundtrip after ${JSON.stringify(action)}`);
  }
});

test("start resumes progress, replay resets progress, and the learner controls help", () => {
  let state = select(reachOrder(), 0);
  assert.equal(journeyReducer(state, { type: "start" }), state);
  state = journeyReducer(state, { type: "toggle-help" });
  assert.equal(state.helpEnabled, false);
  const reset = journeyReducer(state, { type: "replay" });
  assert.deepEqual(reset, { ...initialJourneyState, started: true, helpEnabled: false });
  assert.deepEqual(state.order, [0], "replay must not mutate the previous state");
  assert.equal(select(initialJourneyState, 0), initialJourneyState);
  assert.equal(journeyReducer(initialJourneyState, { type: "hint" }), initialJourneyState);
});

test("an earned card survives practice and reload without creating another reward", () => {
  let state = reachOrder();
  for (const index of [0, 1, 2]) state = select(state, index);
  state = advance(select(advance(state), 5));
  assert.equal(state.earnedCard, true);
  assert.equal(advance(state), state, "repeated collection cannot grant a second reward");
  state = journeyReducer(state, { type: "replay" });
  assert.equal(state.step, 0);
  assert.equal(state.earnedCard, true);
  state = select(state, 1);
  assert.deepEqual(reload(state), state, "a mistake during practice must not remove the earned card");
  for (const index of [0, 1, 2]) state = advance(select(reload(state), index));
  state = select(state, 0);
  assert.equal(reload(state).earnedCard, true, "the card also survives a partially rebuilt sequence");
  for (const index of [1, 2]) state = select(state, index);
  state = advance(select(advance(state), 5));
  assert.equal(state.step, 5);
  assert.equal(state.earnedCard, true, "repeating the journey retains the same boolean reward");
  assert.deepEqual(reload(state), state);
});

test("corrupt or contradictory stored data cannot unlock progress", () => {
  for (const raw of [null, "", "{broken", "null", "true", "[]", "{}", "5"]) {
    assert.deepEqual(parseJourneyState(raw), initialJourneyState);
  }
  const invalid = [
    { version: 2 }, { started: "yes" }, { earnedCard: undefined }, { earnedCard: "true" }, { earnedCard: true }, { step: 6 }, { step: -1 }, { step: 0.5 },
    { solved: "true" }, { helpEnabled: 1 }, { showHint: null }, { feedback: "done" }, { feedback: ["idle"] },
    { order: null }, { order: [0] }, { solved: true },
    { started: true, solved: true, feedback: "correct", showHint: true },
    { started: true, feedback: "incorrect", showHint: false },
    { step: 2 },
    { started: true, step: 3, order: [1] },
    { started: true, step: 3, order: [0, 2] },
    { started: true, step: 3, order: ["0"] },
    { started: true, step: 3, order: [0, 1, 2] },
    { started: true, step: 3, order: [0], solved: true, feedback: "correct" },
    { started: true, step: 3, order: [0, 1, 2, 0], solved: true, feedback: "correct" },
    { started: true, step: 5, solved: true, feedback: "correct" },
    { started: true, step: 5, showHint: true },
    { started: true, step: 5, earnedCard: false },
  ];
  for (const value of invalid) {
    assert.deepEqual(parseJourneyState(JSON.stringify({ ...initialJourneyState, ...value })), initialJourneyState, JSON.stringify(value));
  }
});

test("ignores invalid selection values and isolates restored state arrays", () => {
  const state = start();
  for (const index of [-1, 6, NaN, Infinity, 0.5, "0"]) assert.equal(select(state, index), state);
  const restored = parseJourneyState(null);
  restored.order.push(0);
  assert.deepEqual(initialJourneyState.order, []);
  assert.deepEqual(parseJourneyState(null).order, []);
});
