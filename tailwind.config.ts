import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Press Start 2P — wordmark only, never body text
        wordmark: ["var(--font-press-start)", "monospace"],
        // VT323 — readable pixel font for headings / eyebrows
        display: ["var(--font-vt323)", "monospace"],
        // JetBrains Mono — body, code, data
        mono: ["var(--font-jetbrains)", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["var(--font-jetbrains)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        // The only palette — sourced from CSS variables in globals.css
        bg: "var(--bg)",
        surface: "var(--surface)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        amber: "var(--amber)",
        cyan: "var(--cyan)",
        red: "var(--red)",
        border: "var(--border)",
      },
      borderRadius: {
        none: "0",
        DEFAULT: "0",
        sm: "0",
        md: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
        full: "0",
      },
      boxShadow: {
        // Hard pixel offset shadows — never blurred and never colored
        pixel: "4px 4px 0 0 var(--border)",
        "pixel-sm": "2px 2px 0 0 var(--border)",
        none: "none",
      },
      animation: {
        blink: "blink 1s steps(1) infinite",
        "boot-in": "bootIn 0.18s steps(4) forwards",
      },
      keyframes: {
        blink: {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" },
        },
        bootIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
