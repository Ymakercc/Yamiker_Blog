import type { Metadata } from "next";
import { Press_Start_2P, VT323, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ParticleFlow from "@/components/ParticleFlow";
import PixelCursor from "@/components/PixelCursor";

// Wordmark only — never used for body copy
const pressStart = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-press-start",
  display: "swap",
});

// Headings / eyebrows — a readable pixel face
const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vt323",
  display: "swap",
});

// Body / code / data — monospaced, set at a comfortable line-height
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Yamiekr_Home | Yamiker's Personal Blog",
    template: "%s | Yamiekr_Home",
  },
  description:
    "Yamiker's personal homepage and blog — writing about software development, cloud-native technologies, and life. 开发者·写作者·探索者。",
  keywords: [
    "Yamiker",
    "Yamiekr_Home",
    "blog",
    "personal website",
    "Next.js",
    "TypeScript",
    "developer",
    "个人博客",
    "前端开发",
  ],
  authors: [{ name: "Yamiker" }],
  creator: "Yamiker",
  metadataBase: new URL("https://yamiker.cloud"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    alternateLocale: "en_US",
    url: "https://yamiker.cloud",
    siteName: "Yamiekr_Home",
    title: "Yamiekr_Home | Yamiker's Personal Blog",
    description:
      "Yamiker's personal homepage and blog — writing about software development, cloud-native technologies, and life.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Yamiekr_Home",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yamiekr_Home",
    description: "Yamiker's personal homepage and blog.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh"
      className={`${pressStart.variable} ${vt323.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen font-mono scanlines">
        <ParticleFlow />
        <PixelCursor />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
