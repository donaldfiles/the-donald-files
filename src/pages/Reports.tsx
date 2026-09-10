import { CategoryLabel } from '../components/CategoryLabel'

export function Reports() {
  return (
    <div className="page">
      <header className="page-header">
        <CategoryLabel category="REPORTS" />
        <h1>Reports</h1>
        <p className="dek">
          Documented investigations. Placeholders until Supabase articles load.
        </p>
      </header>
      <ul className="article-list">
        <li className="article-card">
          <CategoryLabel category="REPORTS" />
          <h3>Report stub #1</h3>
          <p className="dek">Replace with published report from the database.</p>
        </li>
        <li className="article-card">
          <CategoryLabel category="REPORTS" />
          <h3>Report stub #2</h3>
          <p className="dek">Replace with published report from the database.</p>
        </li>
      </ul>
    </div>
  )
}
