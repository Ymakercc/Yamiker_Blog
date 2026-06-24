"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/contexts/LanguageContext";

/* ── First-load boot sequence ────────────────────────────────────────────
   A terminal "power-on self-test", printed from the top-left corner: log
   lines appear one by one, a block progress bar fills, then it dims out to
   reveal the dashboard.

   - Plays once per browser session (sessionStorage), so navigating back to
     the home page doesn't replay it.
   - Honours prefers-reduced-motion: skips instantly, no flash.
   - The effect runs ONCE on mount: onDone is held in a ref so a parent
     re-render (the home clock ticks every second) can't restart it.       */

const SESSION_KEY = "yk-booted";

const PROMPT = "visitor@yamiker.cloud:~$ ./boot.sh";

const BOOT_LINES = [
  "mounting filesystem",
  "loading routes  /about /blog /projects /contact",
  "theme engine    pixel · glass",
  "establishing secure link",
  "rendering dashboard",
];

const BAR_CELLS = 24;
const START_DELAY = 260; // ms before the first line prints
const LINE_GAP = 260; // ms between log lines
const BAR_DURATION = 900; // ms for the progress bar to fill
const READY_HOLD = 480; // ms to hold on READY before dimming out
const FADE = 300; // ms dim-out

export default function BootScreen({ onDone }: { onDone: () => void }) {
  const { lang } = useLang();
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const [shown, setShown] = useState(0); // number of log lines printed
  const [pct, setPct] = useState(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const seen =
      typeof window !== "undefined" &&
      window.sessionStorage?.getItem(SESSION_KEY);

    // Already booted this session, or the visitor wants less motion → skip.
    if (reduced || seen) {
      onDoneRef.current();
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const linesDoneAt = START_DELAY + BOOT_LINES.length * LINE_GAP;

    BOOT_LINES.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          if (!cancelled) setShown(i + 1);
        }, START_DELAY + (i + 1) * LINE_GAP)
      );
    });

    // Progress bar fills only after the log lines have finished printing.
    const mountTime = performance.now();
    let raf = 0;
    const tick = () => {
      if (cancelled) return;
      const elapsed = performance.now() - mountTime - linesDoneAt;
      const p = Math.max(0, Math.min(100, Math.round((elapsed / BAR_DURATION) * 100)));
      setPct(p);
      if (p < 100) raf = requestAnimationFrame(tick);
    };
    timers.push(
      setTimeout(() => {
        if (!cancelled) raf = requestAnimationFrame(tick);
      }, linesDoneAt)
    );

    timers.push(
      setTimeout(() => {
        if (cancelled) return;
        window.sessionStorage?.setItem(SESSION_KEY, "1");
        setClosing(true);
        timers.push(setTimeout(() => onDoneRef.current(), FADE));
      }, linesDoneAt + BAR_DURATION + READY_HOLD)
    );

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
    };
    // Mount-once: intentionally empty deps. onDone is read through a ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filled = Math.round((pct / 100) * BAR_CELLS);
  const ready = pct >= 100;
  const linesDone = shown >= BOOT_LINES.length;

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-start justify-start bg-bg ${
        closing ? "boot-out" : ""
      }`}
      role="status"
      aria-live="polite"
      aria-label={lang === "zh" ? "正在载入" : "Loading"}
    >
      <div className="w-full max-w-2xl p-6 font-display text-base leading-relaxed sm:p-10 sm:text-lg">
        {/* Prompt line */}
        <p className="text-cyan">
          {PROMPT}
          {shown === 0 && <span className="cursor-block align-middle" aria-hidden="true" />}
        </p>

        {/* Boot log */}
        {BOOT_LINES.slice(0, shown).map((line, i) => (
          <p key={i} className="step-in">
            <span className="text-amber" aria-hidden="true">
              &gt;&nbsp;
            </span>
            <span className="text-fg">{line}</span>
            <span className="text-cyan">&nbsp;&nbsp;[ ok ]</span>
          </p>
        ))}

        {/* Progress bar — after the log lines finish printing */}
        {linesDone && (
          <p className="step-in mt-4 text-fg">
            <span className="text-cyan" aria-hidden="true">
              [{"█".repeat(filled)}
              <span className="text-border">{"█".repeat(BAR_CELLS - filled)}</span>]
            </span>
            <span className="ml-3 tabular-nums text-muted">
              {String(pct).padStart(3, " ")}%
            </span>
          </p>
        )}

        {ready && (
          <p className="step-in mt-3 text-amber">
            {lang === "zh" ? "就绪" : "READY"}
            <span className="cursor-block align-middle" aria-hidden="true" />
          </p>
        )}
      </div>
    </div>
  );
}
