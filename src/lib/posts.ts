import fs from "fs";
import path from "path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";

/* Server-only blog engine. Reads Markdown from content/blog/<slug>.<lang>.md,
   compiles to HTML at build time, and derives metadata (reading time, TOC).
   Bilingual: every field is keyed by language; the client picks the active
   one. Do not import from client components (uses node:fs). */

export type Lang = "zh" | "en";
export const LANGS: Lang[] = ["zh", "en"];

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface PostMeta {
  slug: string;
  date: string; // ISO date, shared across languages
  title: Record<Lang, string>;
  excerpt: Record<Lang, string>;
  tags: Record<Lang, string[]>;
  reading: Record<Lang, number>; // minutes
}

export interface Post extends PostMeta {
  html: Record<Lang, string>;
  toc: Record<Lang, Heading[]>;
}

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

function fileFor(slug: string, lang: Lang) {
  return path.join(CONTENT_DIR, `${slug}.${lang}.md`);
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const slugs = new Set<string>();
  for (const f of fs.readdirSync(CONTENT_DIR)) {
    const m = /^(.+)\.(zh|en)\.md$/.exec(f);
    if (m) slugs.add(m[1]);
  }
  return [...slugs];
}

function readingMinutes(md: string, lang: Lang): number {
  const text = md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*`_\-[\]()!]/g, " ");
  if (lang === "zh") {
    const chars = (text.match(/[一-鿿]/g) || []).length;
    return Math.max(1, Math.round(chars / 400));
  }
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function extractToc(md: string): Heading[] {
  const slugger = new GithubSlugger();
  const out: Heading[] = [];
  let inFence = false;
  for (const line of md.split("\n")) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.*)$/.exec(line);
    if (m) {
      const level = m[1].length as 2 | 3;
      const text = m[2].replace(/[#*`_]/g, "").trim();
      out.push({ id: slugger.slug(text), text, level });
    }
  }
  return out;
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeStringify);

async function mdToHtml(md: string): Promise<string> {
  const file = await processor.process(md);
  return String(file);
}

function readRaw(
  slug: string,
  lang: Lang
): { data: Record<string, unknown>; content: string } | null {
  const fp = fileFor(slug, lang);
  if (!fs.existsSync(fp)) return null;
  const { data, content } = matter(fs.readFileSync(fp, "utf8"));
  return { data, content };
}

export function getPostMeta(slug: string): PostMeta | null {
  const zh = readRaw(slug, "zh");
  const en = readRaw(slug, "en");
  const primary = zh ?? en;
  if (!primary) return null;
  return {
    slug,
    date: String(primary.data.date ?? ""),
    title: {
      zh: String((zh ?? en)!.data.title ?? slug),
      en: String((en ?? zh)!.data.title ?? slug),
    },
    excerpt: {
      zh: String((zh ?? en)!.data.excerpt ?? ""),
      en: String((en ?? zh)!.data.excerpt ?? ""),
    },
    tags: {
      zh: ((zh ?? en)!.data.tags as string[]) ?? [],
      en: ((en ?? zh)!.data.tags as string[]) ?? [],
    },
    reading: {
      zh: readingMinutes((zh ?? en)!.content, "zh"),
      en: readingMinutes((en ?? zh)!.content, "en"),
    },
  };
}

export function getAllPostsMeta(): PostMeta[] {
  return getPostSlugs()
    .map(getPostMeta)
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<Post | null> {
  const meta = getPostMeta(slug);
  if (!meta) return null;
  const zh = readRaw(slug, "zh");
  const en = readRaw(slug, "en");
  return {
    ...meta,
    html: {
      zh: zh ? await mdToHtml(zh.content) : en ? await mdToHtml(en.content) : "",
      en: en ? await mdToHtml(en.content) : zh ? await mdToHtml(zh.content) : "",
    },
    toc: {
      zh: extractToc((zh ?? en)!.content),
      en: extractToc((en ?? zh)!.content),
    },
  };
}

