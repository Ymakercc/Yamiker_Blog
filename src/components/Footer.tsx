"use client";

import { useLang } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-xs text-muted sm:flex-row sm:px-6 lg:px-8">
        <p className="flex items-center gap-2">
          <span className="font-wordmark text-[8px] text-amber">Y</span>
          <span>{t.footer.copy}</span>
        </p>
        <p>{t.footer.builtWith}</p>
      </div>
    </footer>
  );
}
