import { Link } from 'react-router-dom'
import { CategoryLabel } from '../components/CategoryLabel'
import { getPublishedReports } from '../content/articles'

export function Reports() {
  const reports = getPublishedReports()

  return (
    <div className="page">
      <header className="page-header">
        <CategoryLabel category="REPORTS" />
        <h1>Reports</h1>
        <p className="dek">
          Documented investigations with primary SOURCE FILES.
        </p>
      </header>
      <ul className="article-list">
        {reports.map((item) => (
          <li key={item.slug} className="article-card">
            <CategoryLabel category={item.category} />
            <h3>
              <Link to={`/reports/${item.slug}`}>{item.title}</Link>
            </h3>
            <p className="dek">{item.dek}</p>
            <p className="meta">{item.date}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
