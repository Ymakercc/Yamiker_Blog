"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { useLang } from "@/contexts/LanguageContext";

/* ── Operable home terminal ───────────────────────────────────────────────
   Turns the identity card into a real shell. The static identity (passed as
   `banner`) is the login scrollback; a persistent prompt below it accepts
   commands that actually do things — navigation, theme, language. Coexists
   with the ⌘K command palette (palette = quick tool, this = the signature).

   Step 1 scope: help / whoami / ls / cd / clear / theme / lang + bare section
   names. Richer output (cat, tab-completion) comes next.                    */

type Entry = { input: string; output: ReactNode };

const ROUTES: Record<string, string> = {
  about: "/about",
  blog: "/blog",
  projects: "/projects",
  contact: "/contact",
  home: "/",
  "~": "/",
  "/": "/",
  "..": "/",
};

const SECTIONS = ["about", "blog", "projects", "contact"] as const;

export default function Terminal({ banner }: { banner: ReactNode }) {
  const router = useRouter();
  const { theme, setTheme, toggleTheme } = useTheme();
  const { lang, toggleLang } = useLang();

  const [value, setValue] = useState("");
  const [history, setHistory] = useState<Entry[]>([]);
  const [cmdHist, setCmdHist] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the newest output in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history]);

  const focusInput = () => inputRef.current?.focus();

  const go = (path: string): ReactNode => {
    router.push(path);
    return <span className="text-muted">→ {path}</span>;
  };

  function execute(raw: string): ReactNode | "CLEAR" {
    const line = raw.trim();
    if (!line) return null;
    const [cmd, ...args] = line.split(/\s+/);
    const c = cmd.toLowerCase();

    switch (c) {
      case "help":
        return (
          <div className="grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-0.5 text-muted">
            {[
              ["help", "list commands"],
              ["whoami", "about the author"],
              ["ls", "list sections"],
              ["cd <s>", "open a section"],
              ["theme", "switch theme [pixel|glass]"],
              ["lang", "switch language [zh|en]"],
              ["clear", "clear the screen"],
            ].map(([k, v]) => (
              <div key={k} className="contents">
                <span className="text-amber">{k}</span>
                <span>{v}</span>
              </div>
            ))}
            <div className="col-span-2 mt-1 text-muted/80">
              tip: type a section name directly — {SECTIONS.join(", ")}
            </div>
          </div>
        );

      case "whoami":
        return (
          <div className="text-fg">
            <span className="text-amber">Yamiker</span> — developer · writer ·
            explorer
            <div className="text-muted">
              sections: {SECTIONS.join("  ")} · run `help` for commands
            </div>
          </div>
        );

      case "ls":
        return (
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {SECTIONS.map((s) => (
              <button
                key={s}
                onClick={() => runCommand(s)}
                className="text-cyan hover:text-amber"
              >
                {s}/
              </button>
            ))}
          </div>
        );

      case "cd": {
        const target = (args[0] ?? "").toLowerCase();
        if (!target || target === "~" || target === "/")
          return go("/");
        const path = ROUTES[target];
        if (path) return go(path);
        return (
          <span className="text-red">cd: no such section: {args[0]}</span>
        );
      }

      case "theme": {
        const a = (args[0] ?? "").toLowerCase();
        if (a === "pixel" || a === "glass") {
          setTheme(a);
          return <span className="text-muted">theme → {a}</span>;
        }
        toggleTheme();
        return (
          <span className="text-muted">
            theme → {theme === "pixel" ? "glass" : "pixel"}
          </span>
        );
      }

      case "lang": {
        const a = (args[0] ?? "").toLowerCase();
        if (!a || a !== lang) toggleLang();
        return (
          <span className="text-muted">
            lang → {!a || a !== lang ? (lang === "zh" ? "en" : "zh") : lang}
          </span>
        );
      }

      case "clear":
        return "CLEAR";

      default:
        // Bare section name as a shortcut for `cd`.
        if (ROUTES[c]) return go(ROUTES[c]);
        return (
          <span className="text-red">
            command not found: {c} — type `help`
          </span>
        );
    }
  }

  function runCommand(raw: string) {
    const result = execute(raw);
    if (result === "CLEAR") {
      setHistory([]);
    } else {
      setHistory((h) => [...h, { input: raw, output: result }]);
    }
    if (raw.trim()) setCmdHist((h) => [...h, raw]);
    setHistIdx(null);
    setValue("");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!cmdHist.length) return;
      const i = histIdx === null ? cmdHist.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(i);
      setValue(cmdHist[i]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === null) return;
      const i = histIdx + 1;
      if (i >= cmdHist.length) {
        setHistIdx(null);
        setValue("");
      } else {
        setHistIdx(i);
        setValue(cmdHist[i]);
      }
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col" onClick={focusInput}>
      {/* Scrollback: identity banner + command transcript */}
      <div
        ref={scrollRef}
        className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6 sm:p-8"
      >
        {banner}

        {history.map((e, i) => (
          <div key={i} className="text-sm sm:text-base">
            <div className="flex gap-2">
              <span className="shrink-0 text-amber" aria-hidden="true">
                $
              </span>
              <span className="text-fg">{e.input}</span>
            </div>
            {e.output != null && <div className="mt-1 pl-4">{e.output}</div>}
          </div>
        ))}
      </div>

      {/* Persistent prompt */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runCommand(value);
        }}
        className="flex items-center gap-2 border-t border-border px-6 py-3 sm:px-8"
      >
        <span className="shrink-0 font-display text-base text-amber" aria-hidden="true">
          $
        </span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          aria-label="terminal command input"
          placeholder="type `help`"
          className="w-full bg-transparent font-mono text-sm text-fg outline-none placeholder:text-muted/60 sm:text-base"
          style={{ caretColor: "var(--amber)" }}
        />
      </form>
    </div>
  );
}
