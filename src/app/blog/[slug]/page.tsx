import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Article from "@/components/Article";
import ContentPage from "@/components/ContentPage";
import { getAllPostsMeta, getPost, getPostMeta, getPostSlugs } from "@/lib/posts";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = getPostMeta(slug);
  if (!meta) return {};
  return {
    title: meta.title.zh,
    description: meta.excerpt.zh,
    openGraph: { title: meta.title.zh, description: meta.excerpt.zh, type: "article" },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const all = getAllPostsMeta();
  const idx = all.findIndex((p) => p.slug === slug);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <ContentPage>
      <Article post={post} newer={newer} older={older} />
    </ContentPage>
  );
}
