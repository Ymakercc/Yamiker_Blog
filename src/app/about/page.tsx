import type { Metadata } from "next";
import About from "@/components/About";

export const metadata: Metadata = {
  title: "关于",
  description: "关于 Yamiker — 开发者、写作者、探索者。",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <About />
    </div>
  );
}
