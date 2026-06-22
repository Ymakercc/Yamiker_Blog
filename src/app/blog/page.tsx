import type { Metadata } from "next";
import BlogPreview from "@/components/BlogPreview";
import ContentPage from "@/components/ContentPage";

export const metadata: Metadata = {
  title: "博客",
  description: "Yamiker 的博客 — 记录思考，分享所得。",
};

export default function BlogPage() {
  return (
    <ContentPage>
      <BlogPreview />
    </ContentPage>
  );
}
