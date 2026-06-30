import type { Metadata } from "next";
import BlogList from "@/components/BlogList";
import ContentPage from "@/components/ContentPage";
import { getAllPostsMeta } from "@/lib/posts";

export const metadata: Metadata = {
  title: "博客",
  description: "Yamiker 的博客 — 记录思考，分享所得。",
};

export default function BlogPage() {
  const posts = getAllPostsMeta();
  return (
    <ContentPage>
      <BlogList posts={posts} />
    </ContentPage>
  );
}
