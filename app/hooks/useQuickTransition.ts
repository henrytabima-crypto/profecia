"use client";

import { useLayoutEffect, useRef } from "react";

type TransitionOptions = { onMount?: boolean; distance?: number; duration?: number };

/** Animate the new content immediately; never defer state, focus or interaction. */
export default function useQuickTransition<T extends HTMLElement>(
  changeKey: string | number,
  { onMount = false, distance = 6, duration = 140 }: TransitionOptions = {},
) {
  const target = useRef<T>(null);
  const previous = useRef(changeKey);

  useLayoutEffect(() => {
    const changed = previous.current !== changeKey;
    previous.current = changeKey;
    const element = target.current;
    if ((!changed && !onMount) || !element || typeof element.animate !== "function") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    // Opacity-only transitions also work around descendants with fixed positioning.
    const frames: Keyframe[] = distance === 0
      ? [{ opacity: 0.45 }, { opacity: 1 }]
      : [
        { opacity: 0.45, transform: `translateY(${distance}px)` },
        { opacity: 1, transform: "translateY(0)" },
      ];
    const animation = element.animate(
      frames,
      { duration, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)" },
    );
    animation.id = "quick-transition";
    const cancel = () => animation.cancel();
    reducedMotion.addEventListener("change", cancel);
    return () => {
      cancel();
      reducedMotion.removeEventListener("change", cancel);
    };
  }, [changeKey, onMount, distance, duration]);

  return target;
}
