import { Link } from 'react-router-dom'

/** Desk-made satire memes. Each one links to the sourced report it riffs on. */
const MEMES = [
  {
    src: '/memes/satire-01-dividend-void.webp',
    alt: 'Satire meme: an oversized fake check made out to “American Voter” for the $5,000 “Trump dividend,” stamped VOID, with fine print saying it’s valid only if the GOP keeps Congress.',
    to: '/reports/trump-dividend-5000-gop-congress/',
    label: 'The $5,000 “Trump dividend”',
  },
  {
    src: '/memes/satire-02-colossus-hiring.webp',
    alt: 'Satire meme: a torn “Now Hiring: 30-ft bronze ego” poster riffing on Trump’s giant George Washington statue plan, with bullet points like “apply via Truth Social.”',
    to: '/reports/truth-social-colossus-smithsonian-washington/',
    label: 'The 30-foot Washington “Colossus”',
  },
  {
    src: '/memes/satire-03-ballroom-gift-receipt.webp',
    alt: 'Satire meme: a gift receipt for “1x East Wing Ballroom” marked “Gift — No Taxpayer Dollars*,” with the asterisk pointing to the taxpayer-funded share.',
    to: '/reports/truth-social-white-house-dump-ballroom/',
    label: 'The ballroom “gift”',
  },
]

export function MemeRail() {
  return (
    <section className="meme-zone" aria-label="Satire memes">
      <div className="ugly-section-head">
        <h2>
          Meme <span className="slash">/</span> Zone
        </h2>
        <span className="section-note">Desk-made satire · tap for the real file</span>
      </div>
      <div className="meme-grid">
        {MEMES.map((m) => (
          <figure className="meme-card" key={m.src}>
            <Link to={m.to} className="meme-link" aria-label={`${m.label}: read the report`}>
              <img src={m.src} alt={m.alt} width={960} height={540} loading="lazy" decoding="async" />
            </Link>
            <figcaption className="meme-cap">
              <span className="meme-tag">satire</span>
              <Link to={m.to}>{m.label} →</Link>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
