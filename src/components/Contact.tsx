"use client";

import { useLang } from "@/contexts/LanguageContext";

export default function Contact() {
  const { t } = useLang();

  const links = [
    { label: t.contact.email, href: `mailto:${t.contact.emailAddress}`, glyph: "@" },
    { label: t.contact.github, href: "https://github.com/yamiker", glyph: "{ }" },
    { label: t.contact.twitter, href: "https://x.com/yamiker", glyph: "//" },
  ];

  return (
    <section id="contact" className="scroll-mt-16 py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="border border-border bg-surface shadow-pixel">
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <span className="font-display text-base text-muted">{t.hero.prompt}</span>
          </div>

          <div className="p-6 sm:p-10">
            <p className="mb-3 font-display text-lg uppercase tracking-widest text-amber">
              <span aria-hidden="true">{"// "}</span>
              {t.contact.subtitle}
            </p>
            <h2 className="mb-8 font-display text-4xl text-fg sm:text-5xl">{t.contact.title}</h2>

            <ul className="flex flex-col gap-3">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="pressable group flex items-center gap-4 border border-border px-4 py-3 text-sm text-fg hover:border-amber hover:bg-amber hover:text-bg"
                  >
                    <span
                      className="w-8 text-center font-display text-lg text-cyan group-hover:text-bg"
                      aria-hidden="true"
                    >
                      {link.glyph}
                    </span>
                    <span className="flex-1">{link.label}</span>
                    <span aria-hidden="true">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
