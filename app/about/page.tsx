'use client'

import { useEffect } from 'react'
import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'About' })

export default function Page() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainContent = coreContent(author)

  useEffect(() => {
    const script = document.createElement('script')
    script.id = 'mapmyvisitors'
    script.src =
      'https://mapmyvisitors.com/map.js?cl=00a8a6&w=600&t=n&d=pKKZTdFPHnSz1RFJCa8YtBZsitTt46PnNhFggOG30ps&co=ffffff&cmo=3acc3a&cmn=ff5353&ct=cdd4d9'
    script.type = 'text/javascript'
    script.async = true

    const container = document.getElementById('mapmyvisitors-container')
    if (container && !document.getElementById('mapmyvisitors')) {
      container.appendChild(script)
    }
  }, [])

  return (
    <>
      <AuthorLayout content={mainContent}>
        <MDXLayoutRenderer code={author.body.code} />
        {/* Embed map below author content */}
        <div id="mapmyvisitors-container" className="mt-10 text-center" />
      </AuthorLayout>
    </>
  )
}
