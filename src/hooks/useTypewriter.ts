"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./usePrefersReducedMotion";

interface TypewriterOptions {
  /** Per-character delay in ms (≈40–60 reads like a terminal). */
  speed?: number;
  /** Delay before the first character, in ms. */
  startDelay?: number;
  /** Gate typing — stays empty until true, then types once. */
  start?: boolean;
  /** Fired once the full string has been appended. */
  onDone?: () => void;
}

/**
 * Character-by-character typewriter driven entirely in JS (not CSS width),
 * so multi-byte text — Chinese included — appends one glyph at a time.
 * Under prefers-reduced-motion it resolves to the full string immediately.
 */
export function useTypewriter(text: string, options: TypewriterOptions = {}) {
  const { speed = 50, startDelay = 0, start = true } = options;
  const [output, setOutput] = useState("");
  const [done, setDone] = useState(false);

  // Keep onDone fresh without re-running the typing effect.
  const onDoneRef = useRef(options.onDone);
  onDoneRef.current = options.onDone;

  useEffect(() => {
    if (!start) return;

    // Array.from splits by code point, so each CJK glyph is one step.
    const chars = Array.from(text);

    if (prefersReducedMotion()) {
      setOutput(text);
      setDone(true);
      onDoneRef.current?.();
      return;
    }

    setOutput("");
    setDone(false);
    let i = 0;
    let tickTimer = 0;

    const tick = () => {
      i += 1;
      setOutput(chars.slice(0, i).join(""));
      if (i >= chars.length) {
        setDone(true);
        onDoneRef.current?.();
        return;
      }
      tickTimer = window.setTimeout(tick, speed);
    };

    const startTimer = window.setTimeout(tick, startDelay);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(tickTimer);
    };
  }, [text, start, speed, startDelay]);

  return { text: output, done };
}
