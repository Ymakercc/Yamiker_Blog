"use client";

import { useLang } from "@/contexts/LanguageContext";

const accents = [
  {
    bar: "from-accent-400 to-accent-600",
    glow: "group-hover:shadow-glow",
    ring: "group-hover:border-accent-400/40",
  },
  {
    bar: "from-violet-400 to-violet-600",
    glow: "group-hover:shadow-glow-violet",
    ring: "group-hover:border-violet-400/40",
  },
  {
    bar: "from-fuchsia-400 to-pink-600",
    glow: "group-hover:shadow-glow-violet",
    ring: "group-hover:border-fuchsia-400/40",
  },
];

export default function BlogPreview() {
  const { t } = useLang();

  return (
    <section id="blog" className="relative py-28 overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="inline-flex items-center gap-2 text-xs font-semibold text-accent-300 uppercase tracking-widest mb-4 glass rounded-full px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
            {t.blog.subtitle}
          </p>
          <h2 className="text-4xl font-bold text-white">{t.blog.title}</h2>
        </div>

        {/* Posts grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 mb-12">
          {t.blog.posts.map((post, idx) => {
            const a = accents[idx % accents.length];
            return (
              <article
                key={idx}
                className={`group relative rounded-3xl glass overflow-hidden hover:-translate-y-1.5 transition-all duration-300 ${a.glow} ${a.ring}`}
              >
                {/* Color bar */}
                <div className={`h-1 w-full bg-gradient-to-r ${a.bar}`} />

                <div className="p-6">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-white text-lg leading-snug mb-3 group-hover:text-accent-300 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-slate-400 text-sm leading-relaxed mb-5 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <time className="text-xs text-slate-500">{post.date}</time>
                    <a
                      href="#"
                      className="text-xs font-semibold text-accent-300 hover:text-accent-200 flex items-center gap-1 transition-colors"
                    >
                      {t.blog.readMore}
                      <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* View all */}
        <div className="text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-slate-200 font-semibold text-sm hover:text-white hover:border-accent-400/60 hover:shadow-glow transition-all"
          >
            {t.blog.viewAll}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
