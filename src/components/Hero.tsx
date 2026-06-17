"use client";

import { useLang } from "@/contexts/LanguageContext";

export default function Hero() {
  const { t } = useLang();

  const openPalette = () => window.dispatchEvent(new Event("open-command-palette"));

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
            <span className="h-3 w-3 border border-border bg-red" aria-hidden="true" />
            <span className="h-3 w-3 border border-border bg-amber" aria-hidden="true" />
            <span className="h-3 w-3 border border-border bg-cyan" aria-hidden="true" />
            <span className="ml-2 font-display text-base text-muted">{t.hero.prompt}</span>
          </div>

          {/* Body */}
          <div className="px-5 py-8 sm:px-8 sm:py-10">
            <p className="mb-6 text-sm text-cyan">
              <span aria-hidden="true">$ </span>
              {t.hero.boot}
            </p>

            {/* Wordmark — the only Press Start 2P heading */}
            <h1 className="mb-5 font-wordmark text-2xl leading-tight text-amber sm:text-4xl">
              {t.hero.name}
            </h1>

            {/* Identity line */}
            <p className="mb-4 font-display text-2xl text-fg sm:text-3xl">
              {t.hero.tagline}
              <span className="cursor-block" aria-hidden="true" />
            </p>

            {/* Description */}
            <p className="mb-8 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              {t.hero.description}
            </p>

            {/* ⌘K hint (desktop) + command button (mobile) */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <p className="hidden items-center gap-2 text-sm text-muted sm:flex">
                <kbd className="border border-border px-2 py-1 text-xs text-fg">⌘K</kbd>
                <span>{t.hero.cmdkHint}</span>
              </p>

              <button
                onClick={openPalette}
                className="inline-flex items-center justify-center gap-2 border border-amber px-5 py-2.5 text-sm text-amber hover:bg-amber hover:text-bg sm:hidden"
              >
                <span aria-hidden="true">&gt;</span>
                {t.hero.cmdkHintMobile}
              </button>

              <div className="flex gap-3">
                <a
                  href="#about"
                  className="border border-border px-4 py-2.5 text-sm text-fg hover:border-amber hover:text-amber"
                >
                  {t.hero.cta}
                </a>
                <a
                  href="#blog"
                  className="border border-border px-4 py-2.5 text-sm text-fg hover:border-amber hover:text-amber"
                >
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
