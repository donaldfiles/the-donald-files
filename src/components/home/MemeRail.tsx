const MEMES = [
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
  {
    top: 'Pickaxe Mountain',
    bot: 'vs. the actual map',
    cap: 'SATIRE · attitude chrome only',
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
