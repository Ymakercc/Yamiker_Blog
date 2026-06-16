import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
    <html lang="zh" className="scroll-smooth">
      <body className={inter.variable}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
