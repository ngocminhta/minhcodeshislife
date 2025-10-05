import { remark } from 'remark'
import { remarkMathCustom } from './remark-math-custom'

/**
 * Process MDX content with custom remark plugins
 */
export async function processMdxContent(content: string): Promise<string> {
  const processor = remark().use(remarkMathCustom)
  const result = await processor.process(content)
  return String(result)
}
