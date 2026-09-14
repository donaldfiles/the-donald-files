const MEMES = [
  {
    top: '$5,000 — VOID unless GOP wins',
    bot: 'both chambers · funding TBD · spend in USA or else',
    cap: 'SATIRE · desk-made check meme · NOT a fact · not a real check',
  },
  {
    top: 'Empty pool checklist',
    bot: 'CAUSE OF FAILURE: [ ] primer [ ] chemistry [x] vibes',
    cap: 'SATIRE · desk-made · NOT a fact · not a contractor finding',
  },
  {
    top: 'GIFT RECEIPT: one ballroom, half paid by you.',
    bot: '(no taxpayer dollars* · *asterisk means you)',
    cap: 'SATIRE · desk-made · NOT a fact · not a Clark Construction invoice',
  },
]

export function MemeRail() {
  return (
    <section className="meme-zone" aria-label="Satire meme zone">
      <div className="ugly-section-head">
        <h2>
          Meme <span className="slash">/</span> Zone
        </h2>
        <span className="section-note">SATIRE only · never reports</span>
      </div>
      <div className="meme-grid">
        {MEMES.map((m) => (
          <div className="meme-card" key={m.top}>
            <div className="satire-banner">⚠ SATIRE</div>
            <div className="meme-frame">
              <div className="top-caption">{m.top}</div>
              <div className="placeholder-art">[ meme art placeholder ]</div>
              <div className="bot-caption">{m.bot}</div>
            </div>
            <p className="meme-cap">{m.cap}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
