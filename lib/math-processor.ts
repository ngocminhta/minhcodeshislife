/**
 * Processes MDX content to handle LaTeX math expressions
 * Converts $$ blocks to HTML elements that can be rendered with KaTeX
 */

export function processMathExpressions(content: string): string {
  // Replace block math expressions ($$...$$) with HTML elements
  let processed = content.replace(/\$\$([\s\S]*?)\$\$/g, (match, mathContent) => {
    const cleanMath = mathContent.trim()
    return `<div class="math-block" data-math="${cleanMath}"></div>`
  })

  // Replace inline math expressions ($...$) with HTML elements
  processed = processed.replace(/\$([^$\n]+?)\$/g, (match, mathContent) => {
    const cleanMath = mathContent.trim()
    return `<span class="math-inline" data-math="${cleanMath}"></span>`
  })

  return processed
}
