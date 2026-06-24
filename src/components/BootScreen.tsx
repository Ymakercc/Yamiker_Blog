"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/contexts/LanguageContext";

/* ── First-load boot sequence ────────────────────────────────────────────
   A terminal "power-on self-test": prints system log lines one by one,
   fills a block progress bar, then dims out to reveal the dashboard.

   - Plays once per browser session (sessionStorage), so navigating back to
     the home page doesn't replay it.
   - Honours prefers-reduced-motion: skips instantly, no flash.
   - Pure stepped motion (steps()), matching the site's pixel-terminal feel.   */

const SESSION_KEY = "yk-booted";

const BOOT_LINES: { ok?: boolean; text: string }[] = [
  { text: "yamiker.cloud // pixel-terminal" },
  { ok: true, text: "mounting filesystem" },
  { ok: true, text: "loading routes  /about /blog /projects /contact" },
  { ok: true, text: "theme engine    pixel · glass" },
  { ok: true, text: "establishing secure link" },
];

const BAR_CELLS = 22;
const LINE_GAP = 170; // ms between printed lines
const BAR_DURATION = 1300; // ms for the progress bar to fill
const HOLD = 1550; // ms before the overlay dims out

export default function BootScreen({ onDone }: { onDone: () => void }) {
  const { lang } = useLang();
  const [shown, setShown] = useState(0);
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
      onDone();
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          if (!cancelled) setShown(i + 1);
        }, 140 + i * LINE_GAP)
      );
    });

    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(100, Math.round(((t - start) / BAR_DURATION) * 100));
      if (!cancelled) setPct(p);
      if (p < 100 && !cancelled) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    timers.push(
      setTimeout(() => {
        if (cancelled) return;
        window.sessionStorage?.setItem(SESSION_KEY, "1");
        setClosing(true);
        timers.push(setTimeout(onDone, 280));
      }, HOLD)
    );

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
    };
  }, [onDone]);

  const filled = Math.round((pct / 100) * BAR_CELLS);
  const ready = pct >= 100;

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-bg px-6 ${
        closing ? "boot-out" : ""
      }`}
      role="status"
      aria-live="polite"
      aria-label={lang === "zh" ? "正在载入" : "Loading"}
    >
      <div className="w-full max-w-md font-display text-sm leading-relaxed">
        {BOOT_LINES.slice(0, shown).map((line, i) => (
          <p key={i} className="step-in">
            {line.ok ? (
              <span className="text-cyan">[ ok ]&nbsp;&nbsp;</span>
            ) : (
              <span className="text-amber" aria-hidden="true">
                &gt;&nbsp;
              </span>
            )}
            <span className={line.ok ? "text-fg" : "text-amber"}>
              {line.text}
            </span>
          </p>
        ))}

        {/* Progress bar — appears once the log lines are done printing */}
        {shown >= BOOT_LINES.length && (
          <div className="step-in mt-4 flex items-center gap-3 text-fg">
            <span className="text-cyan" aria-hidden="true">
              [{"█".repeat(filled)}
              <span className="text-border">
                {"█".repeat(BAR_CELLS - filled)}
              </span>
              ]
            </span>
            <span className="tabular-nums text-muted">
              {String(pct).padStart(3, " ")}%
            </span>
          </div>
        )}

        {ready && (
          <p className="step-in mt-3 text-amber">
            <span className="cursor-block align-middle" aria-hidden="true" />
            &nbsp;{lang === "zh" ? "就绪" : "READY"}
          </p>
        )}
      </div>
    </div>
  );
}
