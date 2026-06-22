"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/contexts/LanguageContext";
import { fuzzyMatch } from "@/lib/fuzzy";

/**
 * Signature interaction: a pixel-bordered terminal command palette.
 * Open with ⌘K / Ctrl-K on desktop, or via the "open-command-palette"
 * window event dispatched by the mobile command button in the Navbar.
 *
 * Type to fuzzy-filter; matched fragments of each command are lit in amber.
 * ↑/↓ move, Enter runs, Esc closes, hover selects.
 */

type Command = {
  id: string;
  /** The literal terminal command, e.g. "goto blog". */
  name: string;
  /** Localized one-line description shown on the right. */
  desc: string;
  /** Extra match terms (incl. Chinese) that don't show but do filter. */
  keywords: string;
  run: () => void;
};

/** Render `text`, lighting the matched character indices in amber. */
function Highlight({ text, indices }: { text: string; indices: number[] }) {
  if (!indices.length) return <>{text}</>;
  const set = new Set(indices);
  return (
    <>
      {Array.from(text).map((ch, i) =>
        set.has(i) ? (
          <span key={i} className="text-amber">
            {ch}
          </span>
        ) : (
          <span key={i}>{ch}</span>
        ),
      )}
    </>
  );
}

export default function CommandPalette() {
  const { t, toggleLang } = useLang();
  const router = useRouter();
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
    const goto = (path: string) => () => {
      close();
      router.push(path);
    };
    return [
      { id: "home", name: "goto home", desc: t.cmd.desc.home, keywords: "home 首页 顶部 top", run: goto("/") },
      { id: "about", name: "goto about", desc: t.cmd.desc.about, keywords: "about 关于 me", run: goto("/about") },
      { id: "blog", name: "goto blog", desc: t.cmd.desc.blog, keywords: "blog 博客 文章 posts writing", run: goto("/blog") },
      { id: "projects", name: "goto projects", desc: t.cmd.desc.projects, keywords: "projects 项目 作品 work", run: goto("/projects") },
      { id: "contact", name: "goto contact", desc: t.cmd.desc.contact, keywords: "contact 联系 email 邮件", run: goto("/contact") },
      { id: "tools", name: "open tools", desc: t.cmd.desc.tools, keywords: "tools 工具 小工具 devtool 项目", run: goto("/projects") },
      {
        id: "lang",
        name: "switch lang",
        desc: t.cmd.desc.lang,
        keywords: "lang language 语言 切换 中文 english i18n",
        run: () => {
          toggleLang();
          close();
        },
      },
      {
        id: "github",
        name: "social github",
        desc: t.cmd.desc.github,
        keywords: "github social git 外链 仓库 repo code",
        run: () => {
          window.open("https://github.com/yamiker", "_blank", "noopener,noreferrer");
          close();
        },
      },
    ];
  }, [t, toggleLang, close, router]);

  // Fuzzy filter on the command name, with a keyword fallback (covers Chinese).
  const results = useMemo(() => {
    const raw = query.trim();
    if (!raw) return commands.map((c) => ({ c, indices: [] as number[] }));
    const q = raw.toLowerCase().replace(/\s+/g, "");
    return commands
      .map((c) => {
        const fm = fuzzyMatch(raw, c.name);
        const kw = c.keywords.toLowerCase().includes(q);
        const matched = fm.matched || kw;
        return {
          c,
          indices: fm.matched ? fm.indices : [],
          score: fm.matched ? fm.score : kw ? 0 : -1,
          matched,
        };
      })
      .filter((r) => r.matched)
      .sort((a, b) => b.score - a.score);
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
    setActive((i) => Math.min(i, Math.max(0, results.length - 1)));
  }, [results.length]);

  // Keep the active row scrolled into view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[active]?.c.run();
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
      {/* Backdrop — dim the page behind */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={close}
        className="dim-in absolute inset-0 bg-bg/80"
      />

      {/* Terminal box */}
      <div className="palette-in relative w-full max-w-xl border border-border bg-surface shadow-pixel">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-xs text-muted">
          <span className="term-dot inline-block h-3 w-3 border border-border bg-red" aria-hidden="true" />
          <span className="term-dot inline-block h-3 w-3 border border-border bg-amber" aria-hidden="true" />
          <span className="term-dot inline-block h-3 w-3 border border-border bg-cyan" aria-hidden="true" />
          <span className="ml-2 font-display text-base text-fg">{t.cmd.title}</span>
        </div>

        {/* Prompt + input */}
        <div className="step-in flex items-center gap-2 border-b border-border px-3 py-3" style={{ animationDelay: "40ms" }}>
          <span className="select-none whitespace-nowrap text-sm text-cyan" aria-hidden="true">
            {t.cmd.prompt}
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
        {results.length === 0 ? (
          <p className="step-in px-4 py-6 text-sm text-muted" style={{ animationDelay: "90ms" }}>
            <span className="text-cyan" aria-hidden="true">
              {t.cmd.prompt}{" "}
            </span>
            <span className="text-fg">{query.trim() || "?"}</span>
            <span className="text-red">: {t.cmd.notFound}</span>
          </p>
        ) : (
          <ul
            ref={listRef}
            role="listbox"
            aria-label={t.cmd.open}
            className="step-in max-h-[44vh] overflow-y-auto py-1"
            style={{ animationDelay: "90ms" }}
          >
            {results.map(({ c, indices }, i) => {
              const selected = i === active;
              return (
                <li key={c.id} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    data-idx={i}
                    onMouseMove={() => setActive(i)}
                    onClick={() => c.run()}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm ${
                      selected ? "bg-amber text-bg" : "text-fg"
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="select-none" aria-hidden="true">
                        {selected ? "▌" : ">"}
                      </span>
                      <span className="truncate">
                        {selected ? c.name : <Highlight text={c.name} indices={indices} />}
                      </span>
                    </span>
                    <span className={`flex shrink-0 items-center gap-2 font-display text-sm ${selected ? "text-bg" : "text-muted"}`}>
                      {c.desc}
                      {selected && <span aria-hidden="true">↵</span>}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Footer hint */}
        <div className="step-in border-t border-border px-3 py-2 text-xs text-muted" style={{ animationDelay: "130ms" }}>
          {t.cmd.hint}
        </div>
      </div>
    </div>
  );
}
