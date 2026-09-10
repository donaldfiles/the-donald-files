import type { CSSProperties } from 'react'

export type Category = 'REPORTS' | 'ANALYSIS' | 'TIMELINE' | 'OPINION'

const accents: Record<Category, string> = {
  REPORTS: '#C0001A',
  ANALYSIS: '#E8A000',
  TIMELINE: '#333333',
  OPINION: '#555555',
}

type Props = {
  category: Category
  className?: string
}

export function CategoryLabel({ category, className }: Props) {
  const style: CSSProperties = {
    color: accents[category],
    borderColor: accents[category],
  }

  return (
    <span className={`category-label ${className ?? ''}`.trim()} style={style}>
      {category}
    </span>
  )
}
