"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

/* ── Live system status bar ───────────────────────────────────────────────
   A persistent top strip, styled like a tmux / OS menu bar. The LEFT side
   reports real, live system state (so each segment encodes true info, not
   decoration); the RIGHT side folds in the site-wide controls so there is a
   single cohesive bar instead of separate floating widgets.

   Segments are progressively hidden on narrow screens — status + clock +
   controls always survive; uptime / path / commit drop first.            */

// Site went live 2026-06-24 (UTC). Uptime counts up from here.
const LAUNCH_UTC = Date.UTC(2026, 5, 24, 0, 0, 0);
const TZ = "America/New_York";
const REPO = "Ymakercc/Yamiker_Blog";

function fmtUptime(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d}d ${pad(h)}:${pad(m)}:${pad(sec)}`;
}

export default function StatusBar() {
  const { t, lang, toggleLang } = useLang();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const [now, setNow] = useState<number | null>(null);
  const [sha, setSha] = useState<string | null>(null);

  // Live clock + uptime tick.
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Latest commit SHA — real data from GitHub, cached for the session so we
  // don't hammer the unauthenticated 60/hr rate limit. Degrades silently.
  useEffect(() => {
    const cached = sessionStorage.getItem("yk-commit");
    if (cached) {
      setSha(cached);
      return;
    }
    fetch(`https://api.github.com/repos/${REPO}/commits?per_page=1`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        const s: string | undefined = d?.[0]?.sha?.slice(0, 7);
        if (s) {
          setSha(s);
          sessionStorage.setItem("yk-commit", s);
        }
      })
      .catch(() => {});
  }, []);

  const locale = lang === "zh" ? "zh-CN" : "en-US";
  const clock =
    now !== null
      ? new Date(now).toLocaleTimeString(locale, {
          hour12: false,
          timeZone: TZ,
        })
      : "--:--:--";
  const uptime = now !== null ? fmtUptime(now - LAUNCH_UTC) : "--d --:--:--";
  const cwd = pathname === "/" ? "~" : `~${pathname}`;

  const sep = <span className="text-border" aria-hidden="true">│</span>;
  const btn =
    "flex h-6 items-center px-1.5 text-[11px] uppercase tracking-wide text-muted hover:text-amber focus-visible:text-amber";

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex h-8 items-center gap-2.5 border-b border-border bg-surface px-3 font-display text-xs leading-none text-muted sm:gap-3 sm:px-4"
      role="banner"
    >
      {/* ── LEFT: live system state ── */}
      <span className="flex items-center gap-1.5 text-amber" title={t.portal.status}>
        <span className="h-1.5 w-1.5 bg-amber shadow-[0_0_6px_var(--amber)]" aria-hidden="true" />
        ONLINE
      </span>

      {sep}
      <span className="hidden tabular-nums sm:inline" title="uptime">
        <span className="text-muted">UP </span>
        <span className="text-fg">{uptime}</span>
      </span>

      <span className="hidden md:inline">{sep}</span>
      <span className="hidden text-fg md:inline" title="path">
        {cwd}
      </span>

      {/* ── RIGHT: data + controls ── */}
      <div className="ml-auto flex items-center gap-2.5 sm:gap-3">
        {sha && (
          <>
            <a
              href={`https://github.com/${REPO}/commit/${sha}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden tabular-nums text-muted hover:text-amber sm:inline"
              title="latest commit"
            >
              @{sha}
            </a>
            {sep}
          </>
        )}

        <span className="tabular-nums text-fg" title={`${t.portal.localTimeLabel} (EST)`}>
          <span className="hidden text-muted sm:inline">EST </span>
          {clock}
        </span>

        {sep}

        {/* Controls — folded in from the old floating cluster */}
        <nav className="flex items-center gap-0.5" aria-label="Site controls">
          {pathname !== "/" && (
            <Link href="/" aria-label={t.nav.home} title={t.nav.home} className={btn}>
              <span aria-hidden="true">⌂</span>
            </Link>
          )}
          <button onClick={() => window.dispatchEvent(new Event("open-command-palette"))} className={btn} title={t.cmd.open}>
            <span aria-hidden="true">⌘K</span>
          </button>
          <button onClick={toggleTheme} className={btn} title={t.theme.toggle} aria-label={t.theme.toggle}>
            <span aria-hidden="true">{theme === "pixel" ? "▦" : "◐"}</span>
            <span className="ml-1 hidden lg:inline">
              {theme === "pixel" ? t.theme.pixel : t.theme.glass}
            </span>
          </button>
          <button onClick={toggleLang} className={btn} aria-label="Toggle language">
            {t.langToggle}
          </button>
        </nav>
      </div>
    </header>
  );
}
