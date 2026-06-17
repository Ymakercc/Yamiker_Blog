"use client";

import { useLang } from "@/contexts/LanguageContext";

export default function Hero() {
  const { t } = useLang();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Grid + gradient backdrop */}
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -right-24 w-[34rem] h-[34rem] rounded-full bg-accent-500/20 blur-3xl animate-glow-pulse" />
        <div className="absolute -bottom-48 -left-24 w-[34rem] h-[34rem] rounded-full bg-violet-500/20 blur-3xl animate-glow-pulse [animation-delay:2s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full spotlight opacity-40 blur-3xl animate-spin-slow" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Avatar */}
        <div className="mb-8 flex justify-center">
          <div className="relative animate-float">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-400 to-violet-500 blur-xl opacity-70" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-accent-400 via-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-3xl font-black shadow-glow-lg ring-1 ring-white/20">
              Y
            </div>
          </div>
        </div>

        {/* Availability badge */}
        <div className="mb-6 flex justify-center animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {t.hero.greeting}
          </span>
        </div>

        {/* Name */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-5 animate-slide-up">
          <span className="gradient-text-animated">{t.hero.name}</span>
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl font-semibold text-slate-300 mb-6 animate-slide-up">
          {t.hero.tagline}
        </p>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed mb-10 animate-fade-in text-balance">
          {t.hero.description}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <a
            href="#about"
            className="group relative inline-flex items-center justify-center px-7 py-3 rounded-full bg-gradient-to-r from-accent-500 to-violet-500 text-white font-semibold text-sm shadow-glow hover:shadow-glow-lg hover:scale-105 transition-all duration-200 overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              {t.hero.cta}
              <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
          <a
            href="#blog"
            className="group inline-flex items-center justify-center px-7 py-3 rounded-full glass text-slate-200 font-semibold text-sm hover:text-white hover:border-accent-400/60 hover:shadow-glow transition-all duration-200"
          >
            {t.hero.blog}
            <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute -bottom-16 sm:-bottom-24 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
