"use client";

import { useLang } from "@/contexts/LanguageContext";

export default function Projects() {
  const { t } = useLang();

  return (
    <section id="projects" className="relative py-28 overflow-hidden">
      <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-fuchsia-500/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="inline-flex items-center gap-2 text-xs font-semibold text-accent-300 uppercase tracking-widest mb-4 glass rounded-full px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
            {t.projects.subtitle}
          </p>
          <h2 className="text-4xl font-bold text-white">{t.projects.title}</h2>
        </div>

        {/* Projects list */}
        <div className="space-y-5">
          {t.projects.items.map((project, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col sm:flex-row gap-6 p-6 sm:p-7 rounded-3xl glass hover:border-accent-400/40 hover:shadow-glow hover:-translate-y-1 transition-all duration-300"
            >
              {/* Index */}
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl gradient-border bg-gradient-to-br from-accent-500 via-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-black text-lg shadow-glow">
                {String(idx + 1).padStart(2, "0")}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-white text-xl group-hover:text-accent-300 transition-colors">
                    {project.name}
                  </h3>
                  <div className="flex gap-2">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white/5 text-accent-300 border border-white/10 hover:bg-accent-500/10 hover:border-accent-400/40 hover:text-accent-200 transition-colors flex items-center gap-1.5"
                    >
                      {t.projects.liveDemo}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
