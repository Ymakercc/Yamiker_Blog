"use client";

import { useLang } from "@/contexts/LanguageContext";

export default function About() {
  const { t } = useLang();

  return (
    <section id="about" className="scroll-mt-16 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
          {/* Text */}
          <div>
            <p className="mb-3 font-display text-lg uppercase tracking-widest text-amber">
              <span aria-hidden="true">{"// "}</span>
              {t.about.subtitle}
            </p>
            <h2 className="mb-6 font-display text-4xl text-fg sm:text-5xl">{t.about.title}</h2>
            <p className="mb-10 max-w-prose text-sm leading-relaxed text-muted sm:text-base">
              {t.about.body}
            </p>

            <div>
              <h3 className="mb-4 font-display text-xl uppercase tracking-widest text-cyan">
                {t.about.skills}
              </h3>
              <ul className="flex flex-wrap gap-2.5">
                {t.about.skillList.map((skill) => (
                  <li
                    key={skill}
                    className="border border-border px-3 py-1.5 text-sm text-fg"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Visual — an ASCII "id card" panel */}
          <div className="md:pt-2">
            <div className="border border-border bg-surface shadow-pixel">
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <span className="font-display text-base text-muted">whoami</span>
                <span className="cursor-block" aria-hidden="true" />
              </div>
              <div className="p-6">
                <pre className="mb-5 select-none text-amber" aria-hidden="true">{`  __   __
  \\ \\ / /
   \\ V /
    | |   Yamiker
    |_|`}</pre>
                <dl className="space-y-2 text-sm">
                  <div className="flex gap-3">
                    <dt className="w-20 text-muted">user</dt>
                    <dd className="text-fg">Yamiker</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-20 text-muted">role</dt>
                    <dd className="text-fg">{t.hero.tagline}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-20 text-muted">status</dt>
                    <dd className="text-cyan">online</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
