import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type RawPost = {
  slug: string
  title: string
  date: string
  lastmod?: string
  summary: string
  tags: string[]
  draft?: boolean
  images?: string[] | string
  authors?: string[]
  layout?: string
  toc?: unknown
  body: string
}

const BLOG_DIR = path.join(process.cwd(), 'data', 'blog')
const AUTHORS_DIR = path.join(process.cwd(), 'data', 'authors')

function walkMdxFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...walkMdxFiles(fullPath))
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.mdx')) {
      files.push(fullPath)
    }
  }
  return files
}

function filePathToSlug(filePath: string): string {
  const rel = path.relative(BLOG_DIR, filePath)
  const noExt = rel.replace(/\.mdx$/i, '')
  return noExt.replace(/\\/g, '/')
}

export function getAllRawPosts(): RawPost[] {
  const files = walkMdxFiles(BLOG_DIR)
  const posts: RawPost[] = files.map((fullPath) => {
    const fileContent = fs.readFileSync(fullPath, 'utf8')
    const { content, data } = matter(fileContent)
    const imagesValue =
      Array.isArray((data as Record<string, unknown>).images) ||
      typeof (data as Record<string, unknown>).images === 'string'
        ? ((data as Record<string, unknown>).images as string[] | string)
        : undefined
    return {
      slug: filePathToSlug(fullPath),
      title: String(data.title ?? ''),
      date: String(data.date ?? ''),
      lastmod: data.lastmod ? String(data.lastmod) : undefined,
      summary: String(data.summary ?? ''),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      draft: Boolean(data.draft ?? false),
      images: imagesValue,
      authors: Array.isArray(data.authors) ? data.authors.map(String) : undefined,
      layout: data.layout ? String(data.layout) : undefined,
      toc: (data as Record<string, unknown>).toc,
      body: content,
    }
  })
  return posts
}

export type PostSummary = Pick<RawPost, 'slug' | 'title' | 'date' | 'summary' | 'tags'>

export function getAllPostSummaries(): PostSummary[] {
  return getAllRawPosts()
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date > b.date ? -1 : 1))
    .map(({ slug, title, date, summary, tags }) => ({ slug, title, date, summary, tags }))
}

export function getRawPostBySlug(slug: string): RawPost | null {
  const fullPath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(fullPath)) return null
  const fileContent = fs.readFileSync(fullPath, 'utf8')
  const { content, data } = matter(fileContent)
  const imagesValue =
    Array.isArray((data as Record<string, unknown>).images) ||
    typeof (data as Record<string, unknown>).images === 'string'
      ? ((data as Record<string, unknown>).images as string[] | string)
      : undefined
  return {
    slug,
    title: String(data.title ?? ''),
    date: String(data.date ?? ''),
    lastmod: data.lastmod ? String(data.lastmod) : undefined,
    summary: String(data.summary ?? ''),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: Boolean(data.draft ?? false),
    images: imagesValue,
    authors: Array.isArray(data.authors) ? data.authors.map(String) : undefined,
    layout: data.layout ? String(data.layout) : undefined,
    toc: (data as Record<string, unknown>).toc,
    body: content,
  }
}

export function getAuthorMdx(slug: string): { body: string; data: Record<string, unknown> } | null {
  const fullPath = path.join(AUTHORS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(fullPath)) return null
  const fileContent = fs.readFileSync(fullPath, 'utf8')
  const { content, data } = matter(fileContent)
  return { body: content, data: data as Record<string, unknown> }
}
