import { MetadataRoute } from 'next'
import { getAllPostSummaries } from '@/lib/content'
import siteMetadata from '@/data/siteMetadata'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  const blogRoutes = getAllPostSummaries().map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.date,
  }))

  const routes = ['', 'blog', 'projects', 'tags'].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogRoutes]
}
