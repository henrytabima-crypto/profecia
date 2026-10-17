import assert from "node:assert/strict";
import test from "node:test";
import { applyGuideChoice, freshGuide, guideComplete, restoreGuide } from "../app/data/guidedProgress.ts";
import { missionGuides } from "../app/data/missionGuides.ts";

const activity = {
  title: "Relaciona las pistas",
  instruction: "Completa las dos conexiones.",
  rounds: [
    { prompt: "Primera", options: ["A", "B"], answer: 1, hint: "Pista uno", explanation: "Conexión uno", reference: "Daniel 2" },
    { prompt: "Segunda", options: ["C", "D", "E"], answer: 0, hint: "Pista dos", explanation: "Conexión dos", reference: "Daniel 7" },
  ],
};

test("every mission has playable discovery and connection rounds that complete one choice at a time", () => {
  assert.equal(missionGuides.length, 8);
  for (const [index, guide] of missionGuides.entries()) {
    for (const stage of ["discover", "connect"]) {
      const configured = guide[stage];
      assert.ok(configured.rounds.length > 0, `mission ${index + 1} ${stage} needs a challenge`);
      let state = freshGuide();
      assert.equal(guideComplete(state, configured), false);
      for (const [roundIndex, round] of configured.rounds.entries()) {
        const previous = state;
        assert.ok(Number.isInteger(round.answer) && round.answer >= 0 && round.answer < round.options.length);
        state = applyGuideChoice(state, round.answer, configured);
        assert.equal(state.solved.length, roundIndex + 1);
        assert.equal(previous.solved.length, roundIndex);
        assert.equal(guideComplete(state, configured), roundIndex === configured.rounds.length - 1);
        assert.deepEqual(restoreGuide(state, configured), state);
      }
      assert.equal(applyGuideChoice(state, 0, configured), state, "completed activity cannot earn duplicate answers");
    }
  }
});

test("wrong choices show a hint and preserve earlier correct connections", () => {
  const first = applyGuideChoice(freshGuide(), 1, activity);
  const wrong = applyGuideChoice(first, 2, activity);
  assert.deepEqual(wrong, { solved: [1], showHint: true, wrong: true });
  assert.deepEqual(first, { solved: [1], showHint: false, wrong: false });
  assert.equal(guideComplete(wrong, activity), false);
  assert.deepEqual(restoreGuide(wrong, activity), wrong);
  const corrected = applyGuideChoice(wrong, 0, activity);
  assert.deepEqual(corrected, { solved: [1, 0], showHint: false, wrong: false });
  assert.equal(guideComplete(corrected, activity), true);
});

test("invalid choices cannot advance or fabricate an error", () => {
  const state = freshGuide();
  for (const choice of [-1, 2, 0.5, NaN, Infinity, "1", null, undefined]) {
    assert.equal(applyGuideChoice(state, choice, activity), state);
  }
  assert.equal(guideComplete(undefined, activity), false);
  assert.deepEqual(freshGuide(), state);
  assert.notEqual(freshGuide().solved, state.solved);
});

test("restoration accepts only a correct prefix and creates an independent answer list", () => {
  const partial = { solved: [1], showHint: true, wrong: false };
  const restored = restoreGuide(partial, activity);
  assert.deepEqual(restored, partial);
  assert.notEqual(restored.solved, partial.solved);
  for (const value of [null, false, [], "{}", {}, { solved: [1] }, { solved: [0], showHint: false, wrong: false }, { solved: [1, 1], showHint: false, wrong: false }, { solved: [1, 0, 0], showHint: false, wrong: false }, { solved: ["1"], showHint: false, wrong: false }, { solved: [1], showHint: "yes", wrong: false }]) {
    assert.deepEqual(restoreGuide(value, activity), freshGuide());
  }
  assert.deepEqual(restoreGuide({ solved: [1], showHint: false, wrong: true }, activity), { solved: [1], showHint: true, wrong: true });
  assert.deepEqual(restoreGuide({ solved: [1, 0], showHint: true, wrong: true }, activity), { solved: [1, 0], showHint: false, wrong: false });
});

test("empty or invalid activities and forged answer prefixes never count as complete", () => {
  const empty = { ...activity, rounds: [] };
  const invalid = { ...activity, rounds: [{ ...activity.rounds[0], answer: 5 }] };
  assert.equal(guideComplete(freshGuide(), empty), false);
  assert.equal(guideComplete({ solved: [0, 0], showHint: false, wrong: false }, activity), false);
  assert.equal(guideComplete({ solved: Array(2), showHint: false, wrong: false }, activity), false);
  assert.equal(guideComplete({ solved: [5], showHint: false, wrong: false }, invalid), false);
  assert.deepEqual(applyGuideChoice({ solved: [0], showHint: false, wrong: false }, 0, activity), freshGuide());
  assert.deepEqual(restoreGuide({ solved: [5], showHint: false, wrong: false }, invalid), freshGuide());
});
