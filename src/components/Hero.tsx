"use client";

import { useLang } from "@/contexts/LanguageContext";

export default function Hero() {
  const { t } = useLang();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-accent-50"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent-100 opacity-40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-violet-100 opacity-40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-accent-50 to-violet-50 opacity-30 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Avatar placeholder */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-400 to-violet-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl ring-4 ring-white">
            Y
          </div>
        </div>

        {/* Greeting */}
        <p className="text-lg text-slate-500 mb-2 animate-fade-in">
          {t.hero.greeting}
        </p>

        {/* Name */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-4 animate-slide-up">
          <span className="gradient-text">{t.hero.name}</span>
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl font-medium text-slate-500 mb-6 animate-slide-up">
          {t.hero.tagline}
        </p>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed mb-10 animate-fade-in">
          {t.hero.description}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <a
            href="#about"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold text-sm shadow-lg hover:shadow-accent-200 hover:scale-105 transition-all duration-200"
          >
            {t.hero.cta}
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
          <a
            href="#blog"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border-2 border-slate-200 text-slate-700 font-semibold text-sm hover:border-accent-400 hover:text-accent-600 hover:scale-105 transition-all duration-200"
          >
            {t.hero.blog}
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
