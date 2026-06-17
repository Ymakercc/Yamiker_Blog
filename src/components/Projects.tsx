"use client";

import { useLang } from "@/contexts/LanguageContext";

export default function Projects() {
  const { t } = useLang();

  return (
    <section id="projects" className="scroll-mt-16 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <p className="mb-3 font-display text-lg uppercase tracking-widest text-amber">
            <span aria-hidden="true">{"// "}</span>
            {t.projects.subtitle}
          </p>
          <h2 className="font-display text-4xl text-fg sm:text-5xl">{t.projects.title}</h2>
        </div>

        {/* Cartridge panels */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {t.projects.items.map((project, idx) => (
            <article
              key={idx}
              className="flex flex-col border border-border bg-surface shadow-pixel"
            >
              {/* Cartridge header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-2">
                <span className="font-display text-base text-muted">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="h-2.5 w-6 border border-border bg-amber" aria-hidden="true" />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-3 font-display text-2xl text-fg">{project.name}</h3>
                <p className="mb-5 flex-1 text-sm leading-relaxed text-muted">
                  {project.description}
                </p>

                <ul className="mb-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li key={tag} className="text-xs text-cyan">
                      #{tag}
                    </li>
                  ))}
                </ul>

                <a
                  href={project.url}
                  target={project.url.startsWith("http") ? "_blank" : undefined}
                  rel={project.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex w-fit items-center gap-2 border border-border px-3 py-1.5 text-xs text-fg hover:border-amber hover:text-amber"
                >
                  {t.projects.liveDemo}
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
