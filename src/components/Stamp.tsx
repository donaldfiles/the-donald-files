export type StampVariant = 'fact' | 'analysis' | 'opinion' | 'source' | 'report'

const labels: Record<StampVariant, string> = {
  fact: 'FACT',
  analysis: 'ANALYSIS',
  opinion: 'OPINION',
  source: 'SOURCE',
  report: 'REPORT',
}

type Props = {
  variant: StampVariant
  className?: string
}

export function Stamp({ variant, className }: Props) {
  return (
    <span className={`stamp stamp-${variant} ${className ?? ''}`.trim()}>
      {labels[variant]}
    </span>
  )
}
