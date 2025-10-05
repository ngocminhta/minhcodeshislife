import { serialize } from 'next-mdx-remote/serialize'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

export async function serializeMdxWithMath(source: string) {
  return await serialize(source, {
    mdxOptions: {
      remarkPlugins: [remarkMath as any],
      rehypePlugins: [rehypeKatex as any],
    },
  })
}
