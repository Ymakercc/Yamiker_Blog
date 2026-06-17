"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Reveals a container's direct children with a one-shot, staggered step-in
 * the first time it scrolls into view (IntersectionObserver, no parallax).
 *
 * The hiding class (`reveal-group`) is applied here in JS and only when motion
 * is allowed — so reduced-motion users and no-JS render see content fully
 * visible with no hidden state to get stuck in.
 */
export function useRevealOnScroll<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    el.classList.add("reveal-group");

    const io = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-revealed");
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}
