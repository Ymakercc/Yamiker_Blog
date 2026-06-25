"use client";

import { useEffect, useRef } from "react";

/* ── Oscilloscope signal background ────────────────────────────────────────
   A few hair-thin amber waveform traces slowly undulate across the canvas,
   like signals on a scope. Crisp lines, redrawn each frame (no glow, no
   trails, no particles) — engineered and on-brand for a CRT terminal, never
   a screensaver. One primary trace reads brighter; the rest sit back.

   - Lightweight vanilla Canvas2D (no deps).
   - Honors prefers-reduced-motion (draws one static frame).
   - Pauses when the tab is hidden; re-reads --amber on theme change.        */

function readAmber(): [number, number, number] {
  const v =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--amber")
      .trim() || "#ffb000";
  const hex = v.replace("#", "");
  const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

// base / amp are fractions of height; f* are spatial freqs, s* temporal speeds.
type Trace = {
  base: number;
  amp: number;
  f1: number;
  f2: number;
  f3: number;
  s1: number;
  s2: number;
  s3: number;
  mod: number;
  alpha: number;
};

const TRACES: Trace[] = [
  // Primary signal — the brighter one.
  { base: 0.34, amp: 0.085, f1: 0.0060, f2: 0.0135, f3: 0.030, s1: 0.00022, s2: -0.00031, s3: 0.00045, mod: 0.00009, alpha: 0.2 },
  // Secondary, calmer.
  { base: 0.55, amp: 0.05, f1: 0.0092, f2: 0.0042, f3: 0.024, s1: -0.00017, s2: 0.00026, s3: -0.0004, mod: 0.00013, alpha: 0.12 },
  // Tertiary, far back.
  { base: 0.74, amp: 0.07, f1: 0.0048, f2: 0.011, f3: 0.027, s1: 0.00029, s2: 0.00019, s3: 0.00033, mod: 0.00007, alpha: 0.09 },
];

export default function Oscilloscope() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let [ar, ag, ab] = readAmber();

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawTrace = (tr: Trace, t: number) => {
      const baseY = tr.base * h;
      // Amplitude breathes slowly so the signal feels alive.
      const amp = tr.amp * h * (0.72 + 0.28 * Math.sin(t * tr.mod));
      ctx.beginPath();
      for (let x = 0; x <= w; x += 6) {
        const y =
          baseY +
          amp *
            (Math.sin(x * tr.f1 + t * tr.s1) * 0.62 +
              Math.sin(x * tr.f2 + t * tr.s2) * 0.30 +
              Math.sin(x * tr.f3 + t * tr.s3) * 0.13);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${ar},${ag},${ab},${tr.alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    let raf = 0;
    let running = !reduce;
    let t0 = performance.now();

    const frame = (now: number) => {
      const t = now - t0;
      ctx.clearRect(0, 0, w, h);
      for (const tr of TRACES) drawTrace(tr, t);
      if (running) raf = requestAnimationFrame(frame);
    };

    resize();
    if (reduce) {
      ctx.clearRect(0, 0, w, h);
      for (const tr of TRACES) drawTrace(tr, 0);
    } else {
      raf = requestAnimationFrame(frame);
    }

    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      resize();
    };
    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduce) {
        running = true;
        t0 = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    const mo = new MutationObserver(() => {
      [ar, ag, ab] = readAmber();
    });

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      mo.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 block h-full w-full"
    />
  );
}
