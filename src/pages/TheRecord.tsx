import { CategoryLabel } from '../components/CategoryLabel'

const events = [
  { date: 'TBD', title: 'Timeline event placeholder', body: 'Documented entry — replace with The Record data.' },
  { date: 'TBD', title: 'Second milestone stub', body: 'Chronology placeholder.' },
  { date: 'TBD', title: 'Third milestone stub', body: 'Chronology placeholder.' },
]

export function TheRecord() {
  return (
    <div className="page">
      <header className="page-header">
        <CategoryLabel category="TIMELINE" />
        <h1>The Record</h1>
        <p className="dek">
          A factual timeline. Stub layout — wire to curated events next.
        </p>
      </header>
      <ol className="timeline">
        {events.map((e) => (
          <li key={e.title} className="timeline-item">
            <time className="meta">{e.date}</time>
            <h3>{e.title}</h3>
            <p className="dek">{e.body}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
