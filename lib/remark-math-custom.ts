import { visit } from 'unist-util-visit'
import type { Root, Text } from 'mdast'

/**
 * Custom remark plugin to handle LaTeX math expressions
 * Converts $$ blocks to HTML elements that won't cause MDX parsing issues
 */
export function remarkMathCustom() {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text, index: number, parent: any) => {
      if (!node.value.includes('$$')) return

      const text = node.value
      const parts = text.split(/(\$\$[\s\S]*?\$\$)/g)
      
      if (parts.length === 1) return

      const newNodes: any[] = []
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        
        if (part.startsWith('$$') && part.endsWith('$$')) {
          // This is a math block
          const mathContent = part.slice(2, -2).trim()
          newNodes.push({
            type: 'html',
            value: `<div class="math-block" data-math="${mathContent}"></div>`
          })
        } else if (part) {
          // This is regular text
          newNodes.push({
            type: 'text',
            value: part
          })
        }
      }
      
      if (newNodes.length > 0) {
        parent.children.splice(index, 1, ...newNodes)
      }
    })
  }
}
