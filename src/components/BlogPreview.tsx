"use client";

import { useLang } from "@/contexts/LanguageContext";

export default function BlogPreview() {
  const { t } = useLang();

  return (
    <section id="blog" className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-accent-600 uppercase tracking-widest mb-3">
            {t.blog.subtitle}
          </p>
          <h2 className="text-4xl font-bold text-slate-900">{t.blog.title}</h2>
        </div>

        {/* Posts grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {t.blog.posts.map((post, idx) => (
            <article
              key={idx}
              className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Color bar */}
              <div
                className={`h-1 w-full ${
                  idx === 0
                    ? "bg-gradient-to-r from-accent-400 to-accent-600"
                    : idx === 1
                    ? "bg-gradient-to-r from-violet-400 to-violet-600"
                    : "bg-gradient-to-r from-emerald-400 to-emerald-600"
                }`}
              />

              <div className="p-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className="font-bold text-slate-900 text-lg leading-snug mb-3 group-hover:text-accent-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <time className="text-xs text-slate-400">{post.date}</time>
                  <a
                    href="#"
                    className="text-xs font-semibold text-accent-600 hover:text-accent-700 flex items-center gap-1 transition-colors"
                  >
                    {t.blog.readMore}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View all */}
        <div className="text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:border-accent-400 hover:text-accent-600 transition-all"
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
