import type { Metadata } from "next";
import BlogPreview from "@/components/BlogPreview";

export const metadata: Metadata = {
  title: "博客",
  description: "Yamiker 的博客 — 记录思考，分享所得。",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <BlogPreview />
    </div>
  );
}
