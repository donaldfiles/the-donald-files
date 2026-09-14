import { CaseCard } from '../components/CaseCard'
import { getPublishedReports } from '../content/articles'

export function Reports() {
  const reports = getPublishedReports()

  return (
    <div className="page">
      <header className="page-header">
        <div className="file-label">
          FILE // <span>REPORTS</span>
        </div>
        <h1>Reports</h1>
        <p className="dek">
          Documented investigations with primary SOURCE FILES //.
        </p>
      </header>

      <div className="section-head">
        <h2>LATEST FILES //</h2>
        <span className="count">
          {String(reports.length).padStart(2, '0')} OPEN
        </span>
      </div>

      <div className="dossier-stack">
        {reports.map((item, i) => (
          <CaseCard key={item.slug} article={item} index={i} lead={i === 0} />
        ))}
      </div>
    </div>
  )
}
