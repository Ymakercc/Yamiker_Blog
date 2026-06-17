"use client";

import { useLang } from "@/contexts/LanguageContext";

export default function BlogPreview() {
  const { t } = useLang();

  return (
    <section id="blog" className="scroll-mt-16 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <p className="mb-3 font-display text-lg uppercase tracking-widest text-amber">
            <span aria-hidden="true">{"// "}</span>
            {t.blog.subtitle}
          </p>
          <h2 className="font-display text-4xl text-fg sm:text-5xl">{t.blog.title}</h2>
        </div>

        {/* Posts — a clean reading list */}
        <ul className="border-t border-border">
          {t.blog.posts.map((post, idx) => (
            <li key={idx} className="border-b border-border">
              <a
                href="#"
                className="group block px-1 py-6 hover:bg-surface focus-visible:bg-surface"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-muted">
                      <time>{post.date}</time>
                      <span aria-hidden="true">·</span>
                      <span className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span key={tag} className="text-cyan">
                            #{tag}
                          </span>
                        ))}
                      </span>
                    </div>
                    <h3 className="mb-2 font-display text-2xl leading-snug text-fg group-hover:text-amber">
                      {post.title}
                    </h3>
                    <p className="max-w-2xl text-sm leading-relaxed text-muted">
                      {post.excerpt}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm text-amber opacity-0 group-hover:opacity-100 sm:pt-1">
                    {t.blog.readMore} →
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>

        {/* View all */}
        <div className="mt-10">
          <a
            href="#"
            className="inline-flex items-center gap-2 border border-border px-5 py-2.5 text-sm text-fg hover:border-amber hover:text-amber"
          >
            {t.blog.viewAll}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
