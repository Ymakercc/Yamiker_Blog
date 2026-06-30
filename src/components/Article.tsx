"use client";

import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";
import type { Post, PostMeta } from "@/lib/posts";

export default function Article({
  post,
  newer,
  older,
}: {
  post: Post;
  newer: PostMeta | null; // more recent (sorted desc → previous in list)
  older: PostMeta | null;
}) {
  const { lang } = useLang();
  const L = lang === "zh"
    ? { back: "← 返回博客", read: "分钟", toc: "目录", newer: "较新", older: "较早" }
    : { back: "← Back to blog", read: "min read", toc: "Contents", newer: "Newer", older: "Older" };

  const toc = post.toc[lang];

  return (
    <article className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="nav-link inline-block pl-3 text-sm text-muted hover:text-amber"
        >
          {L.back}
        </Link>

        {/* Header */}
        <header className="mb-10 mt-6 border-b border-border pb-8">
          <h1 className="font-display text-4xl leading-tight text-amber sm:text-5xl">
            {post.title[lang]}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted">
            <time dateTime={post.date}>{post.date}</time>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {post.reading[lang]} {L.read}
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
        </header>

        {/* Body + table of contents */}
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_200px] lg:gap-12">
          <div
            className="prose-terminal min-w-0"
            dangerouslySetInnerHTML={{ __html: post.html[lang] }}
          />

          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <p className="mb-3 font-display text-xs uppercase tracking-widest text-amber">
                  <span aria-hidden="true">{"// "}</span>
                  {L.toc}
                </p>
                <ul className="space-y-1.5 border-l border-border text-sm">
                  {toc.map((h) => (
                    <li key={h.id} className={h.level === 3 ? "pl-7" : "pl-4"}>
                      <a
                        href={`#${h.id}`}
                        className="block text-muted hover:text-amber"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}
        </div>

        {/* Prev / next */}
        {(newer || older) && (
          <nav className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
            {newer ? (
              <Link
                href={`/blog/${newer.slug}`}
                className="group border border-border bg-surface p-4 shadow-pixel-sm hover:border-amber"
              >
                <span className="text-xs uppercase tracking-widest text-muted">
                  ↑ {L.newer}
                </span>
                <span className="mt-1 block font-display text-lg text-fg group-hover:text-amber">
                  {newer.title[lang]}
                </span>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
            {older && (
              <Link
                href={`/blog/${older.slug}`}
                className="group border border-border bg-surface p-4 text-right shadow-pixel-sm hover:border-amber"
              >
                <span className="text-xs uppercase tracking-widest text-muted">
                  {L.older} ↓
                </span>
                <span className="mt-1 block font-display text-lg text-fg group-hover:text-amber">
                  {older.title[lang]}
                </span>
              </Link>
            )}
          </nav>
        )}
      </div>
    </article>
  );
}
