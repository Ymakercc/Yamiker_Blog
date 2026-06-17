"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LanguageContext";

export default function Navbar() {
  const { t, toggleLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { href: "#about", label: t.nav.about },
    { href: "#blog", label: t.nav.blog },
    { href: "#projects", label: t.nav.projects },
    { href: "#contact", label: t.nav.contact },
  ];

  const openPalette = () => window.dispatchEvent(new Event("open-command-palette"));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b bg-bg ${
        scrolled ? "border-border" : "border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Wordmark — Press Start 2P, small */}
        <a
          href="#home"
          className="link-invert px-1 py-1 font-wordmark text-[10px] text-fg sm:text-xs"
        >
          Yamiekr_Home
        </a>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 text-sm md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="link-invert px-3 py-1.5 text-fg">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Desktop: ⌘K hint button */}
          <button
            onClick={openPalette}
            className="hidden items-center gap-2 border border-border px-3 py-1.5 text-xs text-muted hover:border-amber hover:text-amber sm:inline-flex"
            aria-label={t.cmd.open}
          >
            <span aria-hidden="true">⌘K</span>
          </button>

          <button
            onClick={toggleLang}
            className="border border-border px-3 py-1.5 text-sm text-fg hover:border-amber hover:text-amber"
            aria-label="Toggle language"
          >
            {t.langToggle}
          </button>

          {/* Mobile hamburger */}
          <button
            className="border border-border p-2 text-fg hover:border-amber hover:text-amber md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border bg-bg md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-3 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="link-invert block px-3 py-2.5 text-fg"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  openPalette();
                }}
                className="link-invert block w-full px-3 py-2.5 text-left text-amber"
              >
                {`> ${t.cmd.open}`}
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
