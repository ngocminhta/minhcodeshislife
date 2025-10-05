'use client'

import { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface MDXWithMathProps {
  children: React.ReactNode
}

export default function MDXWithMath({ children }: MDXWithMathProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    
    // Find all math expressions with data-math attribute and render them with KaTeX
    const mathBlocks = container.querySelectorAll('.math-block[data-math]')
    mathBlocks.forEach((block) => {
      const mathExpression = block.getAttribute('data-math')
      if (mathExpression) {
        try {
          katex.render(mathExpression, block as HTMLElement, {
            displayMode: true,
            throwOnError: false,
          })
        } catch (error) {
          console.error('KaTeX rendering error:', error)
          // Fallback: show the raw expression
          block.textContent = mathExpression
        }
      }
    })

    // Find all inline math expressions with data-math attribute and render them with KaTeX
    const mathInline = container.querySelectorAll('.math-inline[data-math]')
    mathInline.forEach((inline) => {
      const mathExpression = inline.getAttribute('data-math')
      if (mathExpression) {
        try {
          katex.render(mathExpression, inline as HTMLElement, {
            displayMode: false,
            throwOnError: false,
          })
        } catch (error) {
          console.error('KaTeX rendering error:', error)
          // Fallback: show the raw expression
          inline.textContent = mathExpression
        }
      }
    })
  }, [children])

  return (
    <div ref={containerRef}>
      {children}
    </div>
  )
}