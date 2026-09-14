import type { SourceFile } from '../content/articles'
import { Stamp } from './Stamp'

type Props = {
  sources: SourceFile[]
}

export function SourceFiles({ sources }: Props) {
  if (!sources.length) return null

  return (
    <section className="exhibits source-files" aria-labelledby="sources-title">
      <h2 id="sources-title" className="exhibits-head">
        SOURCE FILES //
      </h2>
      <div className="exhibit-list">
        {sources.map((source, i) => (
          <a
            key={source.url}
            className="exhibit-item"
            href={source.url}
            target="_blank"
            rel="noreferrer noopener"
          >
            <span className="exhibit-id">
              EX-{String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <div className="exhibit-title">{source.label}</div>
              <div className="exhibit-sub">
                <Stamp variant="source" /> EXTERNAL
              </div>
            </div>
            <span className="exhibit-clip">OPEN ↗</span>
          </a>
        ))}
      </div>
    </section>
  )
}
