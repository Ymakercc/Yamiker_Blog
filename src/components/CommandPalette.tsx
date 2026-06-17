"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/contexts/LanguageContext";

/**
 * Signature interaction: a pixel-bordered terminal command palette.
 * Open with ⌘K / Ctrl-K on desktop, or via the "open-command-palette"
 * window event dispatched by the mobile command button in the Navbar.
 */

type Command = {
  id: string;
  label: string;
  hint: string;
  keywords: string;
  run: () => void;
};

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

export default function CommandPalette() {
  const { t, toggleLang } = useLang();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const commands = useMemo<Command[]>(() => {
    const nav = (id: string) => () => {
      close();
      scrollToId(id);
    };
    return [
      { id: "home", label: t.cmd.goHome, hint: t.cmd.sectionNav, keywords: "home 首页 home top", run: nav("home") },
      { id: "about", label: t.cmd.goAbout, hint: t.cmd.sectionNav, keywords: "about 关于", run: nav("about") },
      { id: "blog", label: t.cmd.goBlog, hint: t.cmd.sectionNav, keywords: "blog 博客 posts", run: nav("blog") },
      { id: "projects", label: t.cmd.goProjects, hint: t.cmd.sectionNav, keywords: "projects 项目 work", run: nav("projects") },
      { id: "contact", label: t.cmd.goContact, hint: t.cmd.sectionNav, keywords: "contact 联系 email", run: nav("contact") },
      {
        id: "lang",
        label: t.cmd.toggleLang,
        hint: t.cmd.sectionAction,
        keywords: "language lang 语言 切换 english 中文 i18n",
        run: () => {
          toggleLang();
          close();
        },
      },
      {
        id: "close",
        label: t.cmd.close,
        hint: t.cmd.sectionAction,
        keywords: "close 关闭 exit quit esc",
        run: close,
      },
    ];
  }, [t, toggleLang, close]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.keywords.toLowerCase().includes(q),
    );
  }, [commands, query]);

  // Global open shortcut + mobile-button event
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpen);
    };
  }, []);

  // Focus input + lock scroll while open
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 0);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(id);
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Keep active index in range as the filtered list changes
  useEffect(() => {
    setActive((i) => Math.min(i, Math.max(0, filtered.length - 1)));
  }, [filtered.length]);

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (filtered.length ? (i + 1) % filtered.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[active]?.run();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[18vh] sm:pt-[22vh]"
      role="dialog"
      aria-modal="true"
      aria-label={t.cmd.open}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={close}
        className="absolute inset-0 bg-bg/80"
      />

      {/* Terminal box */}
      <div className="relative w-full max-w-xl border border-border bg-surface shadow-pixel animate-boot-in">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-xs text-muted">
          <span className="inline-block h-3 w-3 border border-border bg-red" aria-hidden="true" />
          <span className="inline-block h-3 w-3 border border-border bg-amber" aria-hidden="true" />
          <span className="inline-block h-3 w-3 border border-border bg-cyan" aria-hidden="true" />
          <span className="ml-2 font-display text-base text-fg">{t.cmd.title}</span>
        </div>

        {/* Prompt + input */}
        <div className="flex items-center gap-2 border-b border-border px-3 py-3">
          <span className="select-none text-amber" aria-hidden="true">
            &gt;
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder={t.cmd.placeholder}
            spellCheck={false}
            autoComplete="off"
            aria-label={t.cmd.placeholder}
            className="w-full bg-transparent text-fg placeholder:text-muted focus:outline-none"
          />
          <span className="cursor-block" aria-hidden="true" />
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted">{t.cmd.empty}</p>
        ) : (
          <ul ref={listRef} role="listbox" aria-label={t.cmd.open} className="max-h-[44vh] overflow-y-auto py-1">
            {filtered.map((c, i) => {
              const selected = i === active;
              return (
                <li key={c.id} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onMouseMove={() => setActive(i)}
                    onClick={() => c.run()}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm ${
                      selected ? "bg-amber text-bg" : "text-fg"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span aria-hidden="true">{selected ? "▌" : " "}</span>
                      {c.label}
                    </span>
                    <span
                      className={`font-display text-sm ${selected ? "text-bg" : "text-muted"}`}
                    >
                      {c.hint}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Footer hint */}
        <div className="border-t border-border px-3 py-2 text-xs text-muted">{t.cmd.hint}</div>
      </div>
    </div>
  );
}
