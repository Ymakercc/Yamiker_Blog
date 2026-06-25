"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";
import BootScreen from "@/components/BootScreen";
import Terminal from "@/components/Terminal";

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
  const [booting, setBooting] = useState(true);
  const finishBoot = useCallback(() => setBooting(false), []);
  const [now, setNow] = useState<Date | null>(null);
  const [quote, setQuote] = useState<string>(t.portal.quotes[0]);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Re-pick a random quote on mount and whenever the language changes.
  useEffect(() => {
    const q = t.portal.quotes;
    setQuote(q[Math.floor(Math.random() * q.length)]);
  }, [t]);

  // Clock always shows US Eastern time, regardless of the visitor's timezone.
  const TZ = "America/New_York";
  const locale = lang === "zh" ? "zh-CN" : "en-US";
  const timeStr = now
    ? now.toLocaleTimeString(locale, { hour12: false, timeZone: TZ })
    : "--:--:--";
  const dateStr = now
    ? now.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
        timeZone: TZ,
      })
    : "";

  const openPalette = () =>
    window.dispatchEvent(new Event("open-command-palette"));

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
    "group flex flex-col justify-center gap-1.5 border border-border bg-surface p-4 shadow-pixel-sm hover:border-amber focus-visible:border-amber";

  return (
    <>
      {booting && <BootScreen onDone={finishBoot} />}
      <section
        id="home"
        className="relative min-h-screen px-4 pb-6 pt-16 sm:px-6 lg:h-screen lg:overflow-hidden lg:px-8"
      >
        {/* Mobile: a single vertical flow (terminal → tiles → ambient → footer).
            Desktop: the bento grid, restored via explicit grid placement. */}
        <div
          className={`mx-auto flex h-full max-w-7xl flex-col gap-4 lg:grid lg:grid-cols-3 lg:content-center ${
            booting ? "" : "step-in"
          }`}
        >
          {/* Identity card — terminal hero */}
          <div className="order-1 flex flex-col border border-border bg-surface shadow-pixel lg:order-none lg:col-span-2 lg:col-start-1 lg:row-start-1">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
              <span className="term-dot h-3 w-3 border border-border bg-red" aria-hidden="true" />
              <span className="term-dot h-3 w-3 border border-border bg-amber" aria-hidden="true" />
              <span className="term-dot h-3 w-3 border border-border bg-cyan" aria-hidden="true" />
              <span className="ml-2 font-display text-base text-muted">{t.hero.prompt}</span>
            </div>

            <Terminal banner={
              <>
              <div>
                <h1 className="mb-3 font-wordmark text-3xl leading-tight text-amber sm:text-4xl">
                  {t.hero.name}
                </h1>
                <p className="mb-5 font-display text-2xl text-fg sm:text-3xl">
                  {t.hero.tagline}
                  <span className="cursor-block" aria-hidden="true" />
                </p>
                <p className="mb-2 font-display text-xl text-cyan">{t.portal.hello}</p>
                <p className="max-w-prose text-sm leading-relaxed text-muted sm:text-base">
                  {t.portal.intro}
                </p>
              </div>

              {/* Tech stack */}
              <div>
                <p className="mb-2.5 font-display text-sm uppercase tracking-widest text-amber">
                  <span aria-hidden="true">{"// "}</span>
                  {t.about.skills}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {t.about.skillList.map((skill) => (
                    <li key={skill} className="border border-border px-2.5 py-1 text-xs text-fg">
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Socials */}
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
              </>
            } />
          </div>

          {/* Ambient: clock + quote — a compact 2-up band on mobile, the right
              column on desktop. Demoted below the nav tiles on phones. */}
          <div className="order-3 grid grid-cols-2 gap-3 lg:order-none lg:col-start-3 lg:row-start-1 lg:flex lg:flex-col lg:gap-4">
            {/* Clock */}
            <div className="border border-border bg-surface px-4 py-4 shadow-pixel lg:px-5 lg:py-5">
              <div className="mb-1 flex items-center justify-between text-[11px] sm:text-xs">
                <span className="uppercase tracking-widest text-muted">
                  {t.portal.localTimeLabel}
                </span>
                <span className="flex items-center gap-1.5 text-cyan">
                  <span className="h-2 w-2 bg-cyan" aria-hidden="true" />
                  {t.portal.status}
                </span>
              </div>
              <p className="font-display text-3xl leading-none text-fg tabular-nums sm:text-4xl lg:text-6xl">
                {timeStr}
              </p>
              <p className="mt-2 text-[11px] tracking-wide text-amber sm:text-xs">{dateStr || " "}</p>
            </div>

            {/* Quote */}
            <div className="flex min-h-0 flex-1 flex-col justify-center border border-border bg-surface px-4 py-4 shadow-pixel lg:px-5 lg:py-6">
              <span className="font-display text-2xl leading-none text-amber lg:text-3xl" aria-hidden="true">
                &ldquo;
              </span>
              <p className="px-1 text-sm leading-relaxed text-fg lg:text-lg">{quote}</p>
              <span className="self-end font-display text-2xl leading-none text-amber lg:text-3xl" aria-hidden="true">
                &rdquo;
              </span>
            </div>
          </div>

        {/* ── Navigation tiles — promoted right under the hero on mobile ── */}
        <div className="order-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:order-none lg:col-span-3 lg:col-start-1 lg:row-start-2 lg:grid-cols-6">
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

        {/* Minimal footer line — keeps everything inside one screen */}
        <p className="order-4 text-center text-[11px] tracking-wide text-muted lg:order-none lg:col-span-3 lg:col-start-1 lg:row-start-3">
          {t.footer.copy}
        </p>
        </div>
      </section>
    </>
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
