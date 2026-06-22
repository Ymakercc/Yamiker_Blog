"use client";

import { useEffect, useRef } from "react";

// ── Noise flow field ───────────────────────────────────────────────────────
// Multi-octave sin approximation with domain warping:
// warp the input coords by a secondary noise layer first, then sample the
// angle field. This breaks the visible repetition and creates genuinely
// organic swirling without a full Simplex implementation.
const S = 0.0022;

function warpedAngle(px: number, py: number, t: number): number {
  // Layer 1 — large-scale warp vectors
  const wx = Math.sin(px * S * 0.6 + t * 0.00045) * 180;
  const wy = Math.cos(py * S * 0.6 - t * 0.00038) * 180;
  // Layer 2 — sample angle at warped position
  const x = px + wx;
  const y = py + wy;
  return (
    Math.sin(x * S + t * 0.00062) * Math.cos(y * S * 0.85 - t * 0.00041) +
    Math.sin(x * S * 2.1 - y * S * 1.4 + t * 0.00033) * 0.55 +
    Math.cos(x * S * 0.7 + y * S * 1.9 - t * 0.00058) * 0.32
  ) * Math.PI * 1.4;
}

// ── Config ─────────────────────────────────────────────────────────────────
const N = 190;       // particle count
const SPEED = 1.25;  // base pixels per frame
const FADE = 0.038;  // trail fade per frame → ~26 frames (~0.43 s) of trail
const MOUSE_R = 110; // mouse repulsion radius
const MOUSE_F = 0.55; // repulsion force multiplier

// ── Types ──────────────────────────────────────────────────────────────────
type Particle = {
  x: number; y: number;
  life: number; maxLife: number;
  cyan: boolean;
};

// Mouse position (module-level, avoids React state overhead)
let MX = -9999;
let MY = -9999;

export default function ParticleFlow() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let W = 0, H = 0;
    let lastGlitch = 0;    // timestamp of last glitch event
    let glitchUntil = 0;   // timestamp when current glitch ends

    const spawn = (): Particle => ({
      x: Math.random() * W,
      y: Math.random() * H,
      life: 0,
      maxLife: 140 + Math.random() * 260,
      cyan: Math.random() < 0.16,
    });

    let ps: Particle[] = [];

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, W, H);
      ps = Array.from({ length: N }, spawn);
    };

    resize();
    window.addEventListener("resize", resize);

    // ── Main render loop ───────────────────────────────────────────────────
    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);

      // Fade trail — black disappears in screen blend mode
      ctx.fillStyle = `rgba(0,0,0,${FADE})`;
      ctx.fillRect(0, 0, W, H);

      ctx.lineWidth = 1;

      for (const p of ps) {
        let angle = warpedAngle(p.x, p.y, t);

        // Mouse repulsion — deflect angle away from cursor
        const dx = p.x - MX;
        const dy = p.y - MY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_R && dist > 0) {
          const push = ((1 - dist / MOUSE_R) ** 2) * MOUSE_F;
          const radial = Math.atan2(dy, dx);
          angle += (radial - angle) * push;
        }

        // Smooth speed variation across the canvas
        const speed =
          SPEED +
          Math.sin(p.x * 0.006 + p.y * 0.004 + t * 0.0007) * 0.45;

        const nx = p.x + Math.cos(angle) * speed;
        const ny = p.y + Math.sin(angle) * speed;

        // Fade in / sustain / fade out over lifetime
        const ratio = p.life / p.maxLife;
        const alpha =
          ratio < 0.08
            ? ratio / 0.08
            : ratio > 0.82
              ? (1 - ratio) / 0.18
              : 1.0;

        ctx.strokeStyle = p.cyan
          ? `rgba(95,215,215,${(alpha * 0.72).toFixed(2)})`
          : `rgba(255,165,31,${(alpha * 0.58).toFixed(2)})`;

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(nx, ny);
        ctx.stroke();

        p.x = nx;
        p.y = ny;
        p.life++;

        if (
          p.life >= p.maxLife ||
          nx < -4 || nx > W + 4 ||
          ny < -4 || ny > H + 4
        ) {
          Object.assign(p, spawn());
        }
      }

      // ── Occasional CRT glitch — a 1–2 px horizontal slice that shifts ──
      // fires once every ~12–25 s, lasts 80 ms
      if (t - lastGlitch > 12000 + Math.random() * 13000) {
        lastGlitch = t;
        glitchUntil = t + 80;
      }
      if (t < glitchUntil) {
        const gy = Math.random() * H;
        const gh = 1 + Math.floor(Math.random() * 3);
        const shift = (Math.random() - 0.5) * 24;
        try {
          const band = ctx.getImageData(0, gy, W, gh);
          ctx.putImageData(band, shift, gy);
          // Cyan tint on the glitch band
          ctx.fillStyle = "rgba(95,215,215,0.08)";
          ctx.fillRect(shift, gy, W, gh);
        } catch {
          // getImageData can fail cross-origin; silently skip
        }
      }
    };

    raf = requestAnimationFrame(frame);

    const onMouse = (e: MouseEvent) => {
      MX = e.clientX;
      MY = e.clientY;
    };
    const onLeave = () => {
      MX = -9999;
      MY = -9999;
    };
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(frame);
    };

    document.addEventListener("mousemove", onMouse, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMouse);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0, mixBlendMode: "screen", opacity: 0.52 }}
    />
  );
}
