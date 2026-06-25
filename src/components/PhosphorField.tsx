"use client";

import { useEffect, useRef } from "react";

/* ── Generative phosphor flow field ───────────────────────────────────────
   Ambient background: sparse amber particles drift along a slow noise flow
   field, leaving faint glowing trails — a living single-phosphor CRT haze.
   Replaces the generic blurred aurora orbs. Deliberately quiet: the operable
   terminal is the signature; this only whispers underneath it.

   - Lightweight vanilla Canvas2D (no p5/deps) — keeps the bundle lean.
   - Honors prefers-reduced-motion (renders one static frame).
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

type Particle = { x: number; y: number; px: number; py: number; sp: number };

export default function PhosphorField() {
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
    let parts: Particle[] = [];

    const count = () =>
      Math.round(Math.min(180, Math.max(56, (w * h) / 12000)));

    const seed = () => {
      parts = Array.from({ length: count() }, () => {
        const x = Math.random() * w;
        const y = Math.random() * h;
        return { x, y, px: x, py: y, sp: 0.25 + Math.random() * 0.7 };
      });
    };

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      seed();
    };

    // Smooth, cheap flow field (layered sines — no noise library needed).
    const angle = (x: number, y: number, t: number) => {
      const s = 0.0016;
      return (
        (Math.sin(x * s + t * 0.00018) +
          Math.cos(y * s - t * 0.00012) +
          Math.sin((x + y) * s * 0.6 + t * 0.00007)) *
        Math.PI
      );
    };

    let raf = 0;
    let running = !reduce;
    let t0 = performance.now();

    const frame = (now: number) => {
      const t = now - t0;
      // Fade previous trails toward transparent (keeps canvas see-through).
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.04)";
      ctx.fillRect(0, 0, w, h);

      // Additive amber streaks.
      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${ar},${ag},${ab},0.2)`;
      ctx.beginPath();
      for (const p of parts) {
        const a = angle(p.x, p.y, t);
        p.px = p.x;
        p.py = p.y;
        p.x += Math.cos(a) * p.sp;
        p.y += Math.sin(a) * p.sp;
        // Wrap at edges; skip the seam segment so it doesn't streak across.
        let wrapped = false;
        if (p.x < 0) { p.x += w; wrapped = true; }
        else if (p.x > w) { p.x -= w; wrapped = true; }
        if (p.y < 0) { p.y += h; wrapped = true; }
        else if (p.y > h) { p.y -= h; wrapped = true; }
        if (wrapped) continue;
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();

      if (running) raf = requestAnimationFrame(frame);
    };

    resize();

    if (reduce) {
      // Static frame: a sparse glowing scatter, no motion.
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = `rgba(${ar},${ag},${ab},0.18)`;
      for (const p of parts) ctx.fillRect(p.x, p.y, 1.4, 1.4);
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
