import assert from "node:assert/strict";
import test from "node:test";
import { clearAdventureStorage } from "../app/data/resetProgress.ts";
import { freshJourney, PROGRESS_KEY, LEGACY_KEY, restoreJourney } from "../app/data/journey.ts";
import { initialJourneyState, JOURNEY_STORAGE_KEY, journeyReducer, parseJourneyState } from "../app/data/danielJourney.ts";

test("reset clears adventure and legacy progress without touching unrelated storage", () => {
  const storage = new Map([
    [PROGRESS_KEY, JSON.stringify({ ...freshJourney(), completed: ["gran-conflicto", "leer-profecia"], unlockedAll: true })],
    [LEGACY_KEY, JSON.stringify(["gran-conflicto", "leer-profecia"])],
    [JOURNEY_STORAGE_KEY, "saved pilot"],
    ["unrelated-preference", "keep"],
  ]);
  assert.equal(clearAdventureStorage({ removeItem: (key) => storage.delete(key) }), true);
  assert.deepEqual([...storage], [["unrelated-preference", "keep"]]);
  assert.deepEqual(restoreJourney(storage.get(PROGRESS_KEY), storage.get(LEGACY_KEY)), freshJourney());
  assert.deepEqual(parseJourneyState(storage.get(JOURNEY_STORAGE_KEY)), initialJourneyState);
});

test("reset removes the Daniel card, unlike practice, and restores default guidance", () => {
  const old = { ...initialJourneyState, started: true, earnedCard: true, step: 3, order: [0], helpEnabled: false };
  assert.equal(journeyReducer(old, { type: "replay" }).earnedCard, true);
  const reset = journeyReducer(old, { type: "reset" });
  assert.deepEqual(reset, initialJourneyState);
  assert.deepEqual(parseJourneyState(JSON.stringify(reset)), initialJourneyState);
  assert.equal(old.earnedCard, true);
});

test("reset reports blocked storage and still attempts every owned key", () => {
  const attempted = [];
  assert.equal(clearAdventureStorage({ removeItem(key) { attempted.push(key); if (key === PROGRESS_KEY) throw new Error("denied"); } }), false);
  assert.deepEqual(attempted, [PROGRESS_KEY, LEGACY_KEY, JOURNEY_STORAGE_KEY]);
});
