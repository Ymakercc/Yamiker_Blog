"use client";

import { useLang } from "@/contexts/LanguageContext";

export default function Projects() {
  const { t } = useLang();

  return (
    <section id="projects" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-accent-600 uppercase tracking-widest mb-3">
            {t.projects.subtitle}
          </p>
          <h2 className="text-4xl font-bold text-slate-900">{t.projects.title}</h2>
        </div>

        {/* Projects list */}
        <div className="space-y-6">
          {t.projects.items.map((project, idx) => (
            <div
              key={idx}
              className="group flex flex-col sm:flex-row gap-6 p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md hover:border-accent-100 transition-all duration-300"
            >
              {/* Index */}
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-accent-400 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {String(idx + 1).padStart(2, "0")}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-slate-900 text-xl group-hover:text-accent-600 transition-colors">
                    {project.name}
                  </h3>
                  <div className="flex gap-2">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold px-3 py-1.5 rounded-full bg-accent-50 text-accent-600 border border-accent-100 hover:bg-accent-100 transition-colors flex items-center gap-1"
                    >
                      {t.projects.liveDemo}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed mb-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-2 py-0.5 rounded-full bg-white text-slate-500 border border-slate-200"
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
