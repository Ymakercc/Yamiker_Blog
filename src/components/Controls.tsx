"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * Floating control cluster (top-right) — replaces the old full-width navbar.
 * Holds the site-wide actions: home, command palette, theme, language.
 */
export default function Controls() {
  const { t, toggleLang } = useLang();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const openPalette = () =>
    window.dispatchEvent(new Event("open-command-palette"));

  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-2">
      {/* Home — hidden on the home page itself */}
      {pathname !== "/" && (
        <Link
          href="/"
          aria-label={t.nav.home}
          title={t.nav.home}
          className="btn-pixel-sm flex h-9 w-9 items-center justify-center text-base text-fg"
        >
          <span aria-hidden="true">⌂</span>
        </Link>
      )}

      <button
        onClick={openPalette}
        aria-label={t.cmd.open}
        title={t.cmd.open}
        className="btn-pixel-sm flex h-9 items-center px-2.5 text-xs text-muted"
      >
        <span aria-hidden="true">⌘K</span>
      </button>

      <button
        onClick={toggleTheme}
        aria-label={t.theme.toggle}
        title={t.theme.toggle}
        className="btn-pixel-sm flex h-9 items-center gap-1.5 px-2.5 text-sm text-fg"
      >
        <span aria-hidden="true">{theme === "pixel" ? "▦" : "◐"}</span>
        <span className="hidden sm:inline">
          {theme === "pixel" ? t.theme.pixel : t.theme.glass}
        </span>
      </button>

      <button
        onClick={toggleLang}
        aria-label="Toggle language"
        className="btn-pixel-sm flex h-9 items-center px-2.5 text-sm text-fg"
      >
        {t.langToggle}
      </button>
    </div>
  );
}
