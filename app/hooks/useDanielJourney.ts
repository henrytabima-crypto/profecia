"use client";

import { useCallback, useEffect, useState } from "react";
import { initialJourneyState, JOURNEY_STORAGE_KEY, journeyReducer, parseJourneyState } from "../data/danielJourney";

export function useDanielJourney() {
  const [state, setState] = useState(initialJourneyState);
  const [ready, setReady] = useState(false);
  const [persistent, setPersistent] = useState(true);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Restore browser-only progress after the server render.
      setState(parseJourneyState(window.localStorage.getItem(JOURNEY_STORAGE_KEY)));
    } catch {
      setPersistent(false);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(state));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Report whether the browser accepted the persisted progress.
      setPersistent(true);
    } catch {
      setPersistent(false);
    }
  }, [state, ready]);

  const dispatch = useCallback((action: Parameters<typeof journeyReducer>[1]) => {
    setState((current) => journeyReducer(current, action));
  }, []);

  return { state, dispatch, ready, persistent };
}
