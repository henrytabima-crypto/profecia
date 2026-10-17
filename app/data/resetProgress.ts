import { JOURNEY_STORAGE_KEY } from "./danielJourney.ts";
import { LEGACY_KEY, PROGRESS_KEY } from "./journey.ts";

/** Clear only this adventure, including the legacy data that could restore old achievements. */
export function clearAdventureStorage(storage: Pick<Storage, "removeItem">): boolean {
  let cleared = true;
  for (const key of [PROGRESS_KEY, LEGACY_KEY, JOURNEY_STORAGE_KEY]) {
    try { storage.removeItem(key); } catch { cleared = false; }
  }
  return cleared;
}
