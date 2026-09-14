const EXHIBITS = [
  {
    tag: 'EXHIBIT A · MOCK',
    body: '“Iran is weak — everybody knows it. Midterms will be the greatest…”',
    foot: 'Mock exhibit · not a real scrape · attitude only',
  },
  {
    tag: 'EXHIBIT B · MOCK',
    body: '“$5,000 for every household — the Fake News won’t tell you…”',
    foot: 'Mock exhibit · labeled for the record',
  },
  {
    tag: 'EXHIBIT C · MOCK',
    body: '“SAVE Act now. Courts will do the right thing. Watch…”',
    foot: 'Mock exhibit · compare to filings below',
  },
]

export function TruthStrip() {
  return (
    <section className="truth-strip" aria-label="Truth Social exhibits">
      <div className="truth-head">
        <h2>Truth Social — In The Face</h2>
        <span className="truth-badge">EXHIBIT RAIL · MOCK POSTS</span>
      </div>
      <div className="truth-rail">
        {EXHIBITS.map((ex) => (
          <div className="truth-post" key={ex.tag}>
            <span className="exhibit-tag">{ex.tag}</span>
            <div className="truth-handle">
              <strong>@placeholder</strong> · mocked post
            </div>
            <p className="truth-body">{ex.body}</p>
            <div className="truth-foot">{ex.foot}</div>
          </div>
        ))}
      </div>
      <div className="mock-note">
        All Truth Social items on this page are MOCK / EXHIBIT placeholders —
        not live feeds, not endorsements. Pending Reed clearance for Ink’s
        first TS drop.
      </div>
    </section>
  )
}
