"use client";

import { useEffect, useRef } from "react";

/* ── Generative phosphor flow field ───────────────────────────────────────
   Ambient sci-fi background, kept restrained. Amber energy points drift along
   a slow noise flow field, leaving glowing comet trails; a faint vertical
   "scan sweep" passes across very slowly, like a sensor / CRT refresh. Reads
   as a living single-phosphor CRT — present, but never showy. The operable
   terminal is still the signature; this only sets the mood.

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

    // Pre-rendered radial glow sprite for particle heads (cheap drawImage).
    // Small + low-alpha: crisp energy points, not big bokeh blobs.
    const GLOW = 9;
    const glow = document.createElement("canvas");
    glow.width = glow.height = GLOW;
    const gctx = glow.getContext("2d")!;
    const buildGlow = () => {
      gctx.clearRect(0, 0, GLOW, GLOW);
      const r = GLOW / 2;
      const grad = gctx.createRadialGradient(r, r, 0, r, r, r);
      grad.addColorStop(0, `rgba(${ar},${ag},${ab},0.5)`);
      grad.addColorStop(0.5, `rgba(${ar},${ag},${ab},0.12)`);
      grad.addColorStop(1, `rgba(${ar},${ag},${ab},0)`);
      gctx.fillStyle = grad;
      gctx.fillRect(0, 0, GLOW, GLOW);
    };
    buildGlow();

    const count = () =>
      Math.round(Math.min(140, Math.max(56, (w * h) / 14000)));

    const seed = () => {
      parts = Array.from({ length: count() }, () => {
        const x = Math.random() * w;
        const y = Math.random() * h;
        return { x, y, px: x, py: y, sp: 0.25 + Math.random() * 0.75 };
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
    const SWEEP_MS = 26000;

    const frame = (now: number) => {
      const t = now - t0;

      // Fade previous frame toward transparent (keeps canvas see-through).
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.07)";
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "lighter";

      // Slow vertical scan sweep — the one overt sci-fi gesture, barely there.
      const band = w * 0.14;
      const sx = ((t % SWEEP_MS) / SWEEP_MS) * (w + 2 * band) - band;
      const sweep = ctx.createLinearGradient(sx - band, 0, sx + band, 0);
      sweep.addColorStop(0, `rgba(${ar},${ag},${ab},0)`);
      sweep.addColorStop(0.5, `rgba(${ar},${ag},${ab},0.022)`);
      sweep.addColorStop(1, `rgba(${ar},${ag},${ab},0)`);
      ctx.fillStyle = sweep;
      ctx.fillRect(sx - band, 0, band * 2, h);

      // Trails.
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${ar},${ag},${ab},0.18)`;
      ctx.beginPath();
      for (const p of parts) {
        const a = angle(p.x, p.y, t);
        p.px = p.x;
        p.py = p.y;
        p.x += Math.cos(a) * p.sp;
        p.y += Math.sin(a) * p.sp;
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

      // Glowing heads (energy points).
      const o = GLOW / 2;
      for (const p of parts) ctx.drawImage(glow, p.x - o, p.y - o);

      if (running) raf = requestAnimationFrame(frame);
    };

    resize();

    if (reduce) {
      // Static frame: a sparse glowing scatter, no motion.
      ctx.globalCompositeOperation = "lighter";
      const o = GLOW / 2;
      for (const p of parts) ctx.drawImage(glow, p.x - o, p.y - o);
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
      buildGlow();
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
