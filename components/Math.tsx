'use client'

import 'katex/dist/katex.min.css'
import { DetailedHTMLProps, HTMLAttributes } from 'react'
import { InlineMath, BlockMath } from 'react-katex'

type MathProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  inline?: boolean
  children: string
}

const Math = ({ inline = false, children, ...rest }: MathProps) => {
  try {
    if (inline) {
      return <InlineMath math={children} {...rest} />
    }
    return <BlockMath math={children} {...rest} />
  } catch (error) {
    console.error('Math rendering error:', error)
    return <code>{children}</code>
  }
}

export default Math
