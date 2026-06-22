"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";

// ── Line icons (24×24, stroke=currentColor) — read cleanly in both themes ──
const I = {
  about: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-6 8-6s8 2 8 6" />
    </>
  ),
  blog: (
    <>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M9 9h7M9 13h7M9 17h5" />
    </>
  ),
  projects: (
    <>
      <path d="M12 3l9 5-9 5-9-5z" />
      <path d="M3 13l9 5 9-5" />
    </>
  ),
  contact: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  github: (
    <>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </>
  ),
  command: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <polyline points="8 9 11 12 8 15" />
      <line x1="13" y1="15" x2="16" y2="15" />
    </>
  ),
} as const;

type IconKey = keyof typeof I;

function Icon({ name }: { name: IconKey }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className="h-6 w-6"
      aria-hidden="true"
    >
      {I[name]}
    </svg>
  );
}

export default function Portal() {
  const { t, lang } = useLang();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const locale = lang === "zh" ? "zh-CN" : "en-US";
  const timeStr = now
    ? now.toLocaleTimeString(locale, { hour12: false })
    : "--:--:--";
  const dateStr = now
    ? now.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      })
    : "";

  const openPalette = () =>
    window.dispatchEvent(new Event("open-command-palette"));

  // Navigation tiles — anchors scroll to sections; github opens external;
  // command opens the palette.
  const tiles: {
    key: IconKey;
    label: string;
    desc: string;
    href?: string;
    external?: boolean;
    onClick?: () => void;
  }[] = [
    { key: "about", label: t.portal.tiles.about, desc: t.portal.tileDesc.about, href: "/about" },
    { key: "blog", label: t.portal.tiles.blog, desc: t.portal.tileDesc.blog, href: "/blog" },
    { key: "projects", label: t.portal.tiles.projects, desc: t.portal.tileDesc.projects, href: "/projects" },
    { key: "contact", label: t.portal.tiles.contact, desc: t.portal.tileDesc.contact, href: "/contact" },
    { key: "github", label: t.portal.tiles.github, desc: t.portal.tileDesc.github, href: "https://github.com/yamiker", external: true },
    { key: "command", label: t.portal.tiles.command, desc: t.portal.tileDesc.command, onClick: openPalette },
  ];

  const socials = [
    { label: "GitHub", href: "https://github.com/yamiker", glyph: "{ }" },
    { label: "X", href: "https://x.com/yamiker", glyph: "//" },
    { label: "Email", href: `mailto:${t.contact.emailAddress}`, glyph: "@" },
  ];

  const tileClass =
    "group flex flex-col gap-2 border border-border bg-surface p-4 shadow-pixel-sm hover:border-amber focus-visible:border-amber";

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center px-4 pt-20 pb-12 sm:px-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          {/* ── LEFT: identity ───────────────────────────────────────── */}
          <div>
            <h1 className="mb-4 font-wordmark text-3xl leading-tight text-amber sm:text-4xl">
              {t.hero.name}
            </h1>
            <p className="mb-7 font-display text-2xl text-fg sm:text-3xl">
              {t.hero.tagline}
              <span className="cursor-block" aria-hidden="true" />
            </p>

            {/* Intro card — terminal window */}
            <div className="border border-border bg-surface shadow-pixel">
              <div className="flex items-center gap-2 border-b border-border px-3 py-2">
                <span className="term-dot h-3 w-3 border border-border bg-red" aria-hidden="true" />
                <span className="term-dot h-3 w-3 border border-border bg-amber" aria-hidden="true" />
                <span className="term-dot h-3 w-3 border border-border bg-cyan" aria-hidden="true" />
                <span className="ml-2 font-display text-base text-muted">{t.hero.prompt}</span>
              </div>
              <div className="px-5 py-6 sm:px-6">
                <p className="mb-3 font-display text-xl text-cyan">{t.portal.hello}</p>
                <p className="mb-6 max-w-prose text-sm leading-relaxed text-muted sm:text-base">
                  {t.portal.intro}
                </p>

                {/* Social icons */}
                <div className="flex items-center gap-2">
                  <span className="mr-1 text-xs uppercase tracking-widest text-muted">
                    {t.portal.socialHeading}
                  </span>
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      aria-label={s.label}
                      title={s.label}
                      className="btn-pixel-sm flex h-9 w-9 items-center justify-center font-display text-base text-cyan"
                    >
                      <span aria-hidden="true">{s.glyph}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: clock + navigation ────────────────────────────── */}
          <div className="space-y-5">
            {/* Clock card */}
            <div className="border border-border bg-surface px-5 py-5 shadow-pixel sm:px-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="mb-1 text-xs uppercase tracking-widest text-amber">
                    {dateStr || " "}
                  </p>
                  <p className="font-display text-5xl leading-none text-fg tabular-nums sm:text-6xl">
                    {timeStr}
                  </p>
                </div>
                <span className="flex items-center gap-2 text-sm text-cyan">
                  <span className="h-2 w-2 bg-cyan" aria-hidden="true" />
                  {t.portal.status}
                </span>
              </div>
            </div>

            {/* Navigation grid */}
            <div>
              <p className="mb-3 flex items-center gap-2 font-display text-lg uppercase tracking-widest text-amber">
                <span aria-hidden="true">{"// "}</span>
                {t.portal.navHeading}
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {tiles.map((tile) => {
                  if (tile.onClick) {
                    return (
                      <button
                        key={tile.key}
                        onClick={tile.onClick}
                        className={`${tileClass} text-left`}
                      >
                        <TileBody tile={tile} />
                      </button>
                    );
                  }
                  if (tile.external) {
                    return (
                      <a
                        key={tile.key}
                        href={tile.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={tileClass}
                      >
                        <TileBody tile={tile} />
                      </a>
                    );
                  }
                  return (
                    <Link key={tile.key} href={tile.href!} className={tileClass}>
                      <TileBody tile={tile} />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TileBody({
  tile,
}: {
  tile: { key: IconKey; label: string; desc: string };
}) {
  return (
    <>
      <span className="text-cyan group-hover:text-amber">
        <Icon name={tile.key} />
      </span>
      <span className="font-display text-lg text-fg">{tile.label}</span>
      <span className="text-xs text-muted">{tile.desc}</span>
    </>
  );
}
