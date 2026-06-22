"use client";

import { useEffect, useRef } from "react";

const CHARS = "01010101$>_|;.!/[]{}#01".split("");
const COL = 20;
const FPS = 12;

export default function MatrixRain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Drop = { y: number; speed: number };
    let drops: Drop[] = [];
    let raf: number;
    let last = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const n = Math.ceil(canvas.width / COL);
      drops = Array.from({ length: n }, (_, i) => ({
        y: drops[i]?.y ?? Math.random() * -(canvas.height / COL),
        speed: 0.35 + Math.random() * 0.55,
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (t - last < 1000 / FPS) return;
      last = t;

      // Fade previous frame; black = transparent in screen blend mode
      ctx.fillStyle = "rgba(0,0,0,0.13)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${COL - 4}px "JetBrains Mono", monospace`;
      ctx.textAlign = "center";

      const n = Math.ceil(canvas.width / COL);
      for (let i = 0; i < n; i++) {
        const d = drops[i];
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * COL + COL / 2;
        const y = Math.round(d.y) * COL;

        // ~10% chance of cyan head char, rest amber
        const isCyan = Math.random() < 0.1;
        ctx.fillStyle = isCyan
          ? "rgba(95,215,215,0.9)"
          : "rgba(255,165,31,0.8)";
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.972) {
          d.y = 0;
          d.speed = 0.35 + Math.random() * 0.55;
        }
        d.y += d.speed;
      }
    };

    raf = requestAnimationFrame(tick);

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0, mixBlendMode: "screen", opacity: 0.22 }}
    />
  );
}
