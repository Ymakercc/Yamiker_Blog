"use client";

import { useEffect, useState } from "react";

// ── Shape of the anonymized summary the VPS publishes to /data ──────────────
type HourBucket = { h: string; c: number };
type DayBucket = { d: string; c: number };
type Summary = {
  schema: string;
  generated_at: number;
  generated_iso: string;
  current: {
    active_sessions: number;
    claude_procs_now: number;
    hermes_high_load: boolean | null;
  };
  totals: {
    events_24h: number;
    events_7d: number;
    alerts_24h: number;
    alerts_7d: number;
  };
  invocations_by_hour: HourBucket[];
  events_by_day: DayBucket[];
  alerts_by_type: Record<string, number>;
  alerts_by_severity: Record<string, number>;
  monitor: { version: string; interval_hint_sec: number };
  privacy: string;
};

const SEV_COLOR: Record<string, string> = {
  critical: "var(--amber)",
  warning: "var(--fg)",
  info: "var(--muted)",
};

function StatCard({ label, value, accent }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div className="border border-border bg-surface p-3 shadow-pixel-sm">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted">{label}</div>
      <div
        className="mt-1 font-mono text-2xl"
        style={{ color: accent ? "var(--amber)" : "var(--fg)" }}
      >
        {value}
      </div>
    </div>
  );
}

// Lightweight inline bar chart (no chart lib — matches the zero-dependency vibe)
function BarChart({
  data,
  labelEvery,
}: {
  data: { label: string; value: number }[];
  labelEvery: number;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex h-32 items-end gap-[3px]">
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        return (
          <div key={i} className="flex flex-1 flex-col items-center justify-end" title={`${d.label}: ${d.value}`}>
            <div
              className="w-full"
              style={{
                height: `${Math.max(pct, d.value > 0 ? 6 : 2)}%`,
                background: d.value > 0 ? "var(--amber)" : "var(--border)",
                opacity: d.value > 0 ? 1 : 0.5,
              }}
            />
            <div className="mt-1 h-3 font-mono text-[8px] text-muted">
              {i % labelEvery === 0 ? d.label : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function MonitorPanel() {
  const [data, setData] = useState<Summary | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () => {
      // cache-bust so a redeploy's fresh file is picked up
      fetch(`/data/claude-monitor.json?t=${Date.now()}`, { cache: "no-store" })
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
        .then((j: Summary) => {
          if (alive) {
            setData(j);
            setErr(null);
          }
        })
        .catch((e) => alive && setErr(String(e)));
    };
    load();
    const id = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-16 pt-16">
      <header className="mb-6 border-b border-border pb-3">
        <h1 className="font-departure text-2xl text-amber">CLAUDE-CODE · TELEMETRY</h1>
        <p className="mt-1 font-mono text-[11px] text-muted">
          匿名聚合遥测 · anonymized aggregate only — 不含用户/路径/命令/进程标识
        </p>
      </header>

      {err && (
        <div className="border border-border bg-surface p-4 font-mono text-sm text-muted">
          数据暂不可用 ({err})。面板每小时由 VPS 发布一次。
        </div>
      )}

      {!err && !data && (
        <div className="font-mono text-sm text-muted">载入遥测数据…</div>
      )}

      {data && (
        <div className="space-y-8">
          {/* 概览卡片 */}
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="活跃会话" value={data.current.active_sessions} accent />
            <StatCard label="调用 / 24h" value={data.totals.events_24h} />
            <StatCard label="调用 / 7d" value={data.totals.events_7d} />
            <StatCard
              label="告警 / 7d"
              value={data.totals.alerts_7d}
              accent={data.totals.alerts_7d > 0}
            />
          </section>

          {/* 24 小时调用趋势 */}
          <section>
            <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted">
              近 24 小时调用 · by hour
            </h2>
            <div className="border border-border bg-surface p-4 shadow-pixel">
              <BarChart
                data={data.invocations_by_hour.map((b) => ({
                  label: b.h.slice(11, 13),
                  value: b.c,
                }))}
                labelEvery={3}
              />
            </div>
          </section>

          {/* 7 天调用 */}
          <section>
            <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-muted">
              近 7 天调用 · by day
            </h2>
            <div className="border border-border bg-surface p-4 shadow-pixel">
              <BarChart
                data={data.events_by_day.map((b) => ({
                  label: b.d.slice(5),
                  value: b.c,
                }))}
                labelEvery={1}
              />
            </div>
          </section>

          {/* 告警分布 */}
          <section className="grid gap-3 sm:grid-cols-2">
            <div className="border border-border bg-surface p-4 shadow-pixel-sm">
              <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">
                告警 · by severity
              </h2>
              {Object.keys(data.alerts_by_severity).length === 0 ? (
                <p className="font-mono text-sm text-muted">✓ 7 天内无告警</p>
              ) : (
                <ul className="space-y-1 font-mono text-sm">
                  {Object.entries(data.alerts_by_severity).map(([k, v]) => (
                    <li key={k} className="flex justify-between">
                      <span style={{ color: SEV_COLOR[k] ?? "var(--fg)" }}>{k}</span>
                      <span className="text-fg">{v}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="border border-border bg-surface p-4 shadow-pixel-sm">
              <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">
                告警 · by type
              </h2>
              {Object.keys(data.alerts_by_type).length === 0 ? (
                <p className="font-mono text-sm text-muted">—</p>
              ) : (
                <ul className="space-y-1 font-mono text-sm">
                  {Object.entries(data.alerts_by_type).map(([k, v]) => (
                    <li key={k} className="flex justify-between">
                      <span className="text-muted">{k}</span>
                      <span className="text-fg">{v}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <footer className="border-t border-border pt-3 font-mono text-[10px] text-muted">
            monitor v{data.monitor.version} · 数据生成于 {data.generated_iso}
            {data.current.hermes_high_load ? " · ⚠ host high-load" : ""}
          </footer>
        </div>
      )}
    </main>
  );
}
