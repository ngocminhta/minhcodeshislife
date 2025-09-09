import 'css/prism.css'
import 'katex/dist/katex.css'

import PageTitle from '@/components/PageTitle'
import { components } from '@/components/MDXComponents'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPostSummaries, getRawPostBySlug } from '@/lib/content'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { notFound } from 'next/navigation'

const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] }
}): Promise<Metadata | undefined> {
  const slug = decodeURI(params.slug.join('/'))
  const post = getRawPostBySlug(slug)
  const authorDetails: { name: string }[] = []
  if (!post) return

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  let imageList = [siteMetadata.socialBanner]
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img.includes('http') ? img : siteMetadata.siteUrl + img,
    }
  })

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: './',
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: imageList,
    },
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Page({ params }: { params: { slug: string[] } }) {
  const slug = decodeURI(params.slug.join('/'))
  const summaries = getAllPostSummaries()
  const index = summaries.findIndex((p) => p.slug === slug)
  if (index === -1) return notFound()
  const prev = summaries[index + 1]
  const next = summaries[index - 1]
  const post = getRawPostBySlug(slug)
  if (!post) return notFound()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.lastmod || post.date,
  }

  const Layout = layouts[(post.layout as keyof typeof layouts) || defaultLayout]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout
        content={{ slug: post.slug, date: post.date, title: post.title, tags: post.tags }}
        authorDetails={[]}
        next={next as unknown as { slug: string; title: string }}
        prev={prev as unknown as { slug: string; title: string }}
      >
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <MDXRemote source={post.body} components={components as any} />
      </Layout>
    </>
  )
}
