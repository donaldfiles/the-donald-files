const MEMES = [
  {
    top: 'GIFT RECEIPT: one ballroom, half paid by you.',
    bot: '(no taxpayer dollars* · *asterisk means you)',
    cap: 'SATIRE · desk-made · NOT a fact · not a Clark Construction invoice',
  },
  {
    top: 'FOREIGN POLICY IN THREE WORDS: FAFO',
    bot: '(official soundtrack)',
    cap: 'SATIRE · desk-made · NOT a fact · not a State Dept briefing',
  },
  {
    top: 'TRUMPPALOOZA 1 — NFL 0',
    bot: '*projections subject to vibes*',
    cap: 'SATIRE · desk-made scoreboard · NOT a fact · not Nielsen',
  },
  {
    top: 'Empty pool checklist',
    bot: 'CAUSE OF FAILURE: [ ] primer [ ] chemistry [x] vibes',
    cap: 'SATIRE · desk-made · NOT a fact · not a contractor finding',
  },
  {
    top: 'NOW HIRING: 30-ft bronze ego',
    bot: 'must tower over Infinity · apply via Truth Social',
    cap: 'SATIRE · desk-made · NOT a fact · not a Smithsonian listing',
  },
  {
    top: '$5,000 — VOID unless GOP wins',
    bot: 'both chambers · funding TBD · spend in USA or else',
    cap: 'SATIRE · desk-made check meme · NOT a fact · not a real check',
  },
  {
    top: 'When the press release',
    bot: 'meets the FOIA dump',
    cap: 'SATIRE · not a report · shareable scrap',
  },
  {
    top: '“Dividend” energy',
    bot: 'CBO has entered the chat',
    cap: 'SATIRE · labeled · not sourced claim',
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
