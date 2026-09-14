type Props = {
  fileLabel?: string
  meta?: string
}

export function DossierMasthead({
  fileLabel = 'HOME',
  meta = 'VOL. 01 · ISSUE 09 · 2026',
}: Props) {
  return (
    <header className="dossier-masthead">
      <div className="masthead-chrome">
        <div className="file-label">
          FILE // <span>{fileLabel}</span>
        </div>
        <div className="masthead-meta">{meta}</div>
      </div>
      <h1>THE DONALD FILES</h1>
      <p className="tagline">Brutal. Factual. Documented.</p>
    </header>
  )
}
