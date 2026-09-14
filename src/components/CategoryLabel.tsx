export type Category = 'REPORTS' | 'ANALYSIS' | 'TIMELINE' | 'OPINION'

type Props = {
  category: Category
  className?: string
}

export function CategoryLabel({ category, className }: Props) {
  return (
    <span className={`category-label ${className ?? ''}`.trim()}>
      {category}
    </span>
  )
}
