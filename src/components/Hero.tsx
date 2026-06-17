"use client";

import { useCallback, useEffect, useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { useTypewriter } from "@/hooks/useTypewriter";
import { prefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Hero "power-on" sequence — the terminal boots in discrete steps:
 *   0: type `$ system ready`
 *   1: logo decodes in (pixel-in)
 *   2: type the identity line, block cursor parked at the end
 *   3: description, ⌘K hint and buttons step in, staggered
 * Reduced-motion collapses straight to the final state (handled in the hook
 * and the stage timers).
 */
export default function Hero() {
  const { t } = useLang();
  const [stage, setStage] = useState(0);

  const openPalette = () => window.dispatchEvent(new Event("open-command-palette"));

  const bumpTo = useCallback((s: number) => setStage((cur) => Math.max(cur, s)), []);

  // 0 → 1: boot line types, then the logo decodes in
  const boot = useTypewriter(t.hero.boot, { speed: 55, onDone: () => bumpTo(1) });

  // 1 → 2: hold for the logo's decode frames, then start the identity line
  useEffect(() => {
    if (stage < 1) return;
    const delay = prefersReducedMotion() ? 0 : 380;
    const id = window.setTimeout(() => bumpTo(2), delay);
    return () => window.clearTimeout(id);
  }, [stage, bumpTo]);

  // 2 → 3: identity line types, then the rest steps in
  const tag = useTypewriter(t.hero.tagline, {
    speed: 55,
    start: stage >= 2,
    onDone: () => bumpTo(3),
  });

  const revealed = stage >= 3;

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center px-4 pt-16 sm:px-6 lg:px-8"
    >
      <div className="w-full max-w-3xl">
        {/* Terminal window */}
        <div className="border border-border bg-surface shadow-pixel">
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <span className="term-dot h-3 w-3 border border-border bg-red" aria-hidden="true" />
            <span className="term-dot h-3 w-3 border border-border bg-amber" aria-hidden="true" />
            <span className="term-dot h-3 w-3 border border-border bg-cyan" aria-hidden="true" />
            <span className="ml-2 font-display text-base text-muted">{t.hero.prompt}</span>
          </div>

          {/* Body */}
          <div className="px-5 py-8 sm:px-8 sm:py-10">
            <p className="mb-6 text-sm text-cyan">
              <span aria-hidden="true">$ </span>
              {boot.text}
              {stage === 0 && <span className="cursor-block" aria-hidden="true" />}
            </p>

            {/* Wordmark — the only Press Start 2P heading; decodes in at stage 1 */}
            <h1
              className={`mb-5 font-wordmark text-2xl leading-tight text-amber sm:text-4xl ${
                stage >= 1 ? "logo-hero" : "opacity-0"
              }`}
            >
              {t.hero.name}
            </h1>

            {/* Identity line — types at stage 2, cursor parks at the end */}
            <p className="mb-4 min-h-[1.5em] font-display text-2xl text-fg sm:text-3xl">
              {tag.text}
              {stage >= 2 && <span className="cursor-block" aria-hidden="true" />}
            </p>

            {/* Description */}
            <p
              className={`mb-8 max-w-2xl text-sm leading-relaxed text-muted sm:text-base ${
                revealed ? "step-in" : "opacity-0"
              }`}
            >
              {t.hero.description}
            </p>

            {/* ⌘K hint (desktop) + command button (mobile) + CTAs, staggered */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <p
                className={`hidden items-center gap-2 text-sm text-muted sm:flex ${
                  revealed ? "step-in" : "opacity-0"
                }`}
                style={{ animationDelay: "80ms" }}
              >
                <kbd className="border border-border px-2 py-1 text-xs text-fg">⌘K</kbd>
                <span>{t.hero.cmdkHint}</span>
              </p>

              <button
                onClick={openPalette}
                className={`btn-pixel-amber btn-pixel inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm sm:hidden ${
                  revealed ? "step-in" : "opacity-0"
                }`}
                style={{ animationDelay: "80ms" }}
              >
                <span aria-hidden="true">&gt;</span>
                {t.hero.cmdkHintMobile}
              </button>

              <div
                className={`flex gap-3 ${revealed ? "step-in" : "opacity-0"}`}
                style={{ animationDelay: "160ms" }}
              >
                <a href="#about" className="btn-pixel px-4 py-2.5 text-sm text-fg">
                  {t.hero.cta}
                </a>
                <a href="#blog" className="btn-pixel px-4 py-2.5 text-sm text-fg">
                  {t.hero.blog}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
