"use client";

import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";
import type { PostMeta } from "@/lib/posts";

export default function BlogList({ posts }: { posts: PostMeta[] }) {
  const { t, lang } = useLang();
  const listRef = useRevealOnScroll<HTMLUListElement>();
  const readLabel = lang === "zh" ? "分钟" : "min read";

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

        {/* Posts — a clean reading list, stepped in on scroll */}
        <ul ref={listRef} className="border-t border-border">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-border">
              <Link
                href={`/blog/${post.slug}`}
                className="group block px-1 py-6 hover:bg-surface focus-visible:bg-surface"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-3 text-xs text-muted">
                      <time dateTime={post.date}>{post.date}</time>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        {post.reading[lang]} {readLabel}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex flex-wrap gap-2">
                        {post.tags[lang].map((tag) => (
                          <span key={tag} className="text-cyan">
                            #{tag}
                          </span>
                        ))}
                      </span>
                    </div>
                    <h3 className="mb-2 font-display text-2xl leading-snug text-fg group-hover:text-amber">
                      {post.title[lang]}
                    </h3>
                    <p className="max-w-2xl text-sm leading-relaxed text-muted">
                      {post.excerpt[lang]}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm text-amber opacity-0 group-hover:opacity-100 sm:pt-1">
                    {t.blog.readMore} →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
