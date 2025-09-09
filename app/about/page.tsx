import { MDXRemote } from 'next-mdx-remote/rsc'
import AuthorLayout from '@/layouts/AuthorLayout'
import { genPageMetadata } from 'app/seo'
import { getAuthorMdx } from '@/lib/content'
import { components } from '@/components/MDXComponents'

export const metadata = genPageMetadata({ title: 'About' })

export default function Page() {
  const author = getAuthorMdx('default')
  const mainContent = { name: 'About', slug: 'default' }
  return (
    <>
      <AuthorLayout content={mainContent as unknown as { name: string }}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {author && <MDXRemote source={author.body} components={components as any} />}
      </AuthorLayout>
    </>
  )
}
