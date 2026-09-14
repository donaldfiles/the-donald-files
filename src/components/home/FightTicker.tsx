const TICKER_ITEMS = [
  'IRAN WAR TALK VS. THE DOCUMENTS',
  'SAVE ACT + SCOTUS: READ THE FILINGS',
  '$5,000 “DIVIDEND” — WHERE’S THE OFFSET?',
  'HOLIDAY CASH PROMISE MEETS THE BUDGET MATH',
  'PICKAXE MOUNTAIN: NARRATIVE VS. PAPER TRAIL',
  'TRUTH POSTS ENTERED AS EXHIBITS — NOT ENDORSEMENTS',
  'NEVADA U.S. ATTORNEY: READ THE 9TH CIRCUIT',
]

export function FightTicker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div className="fight-ticker" aria-label="Fight ticker">
      <div className="ticker-label">FIGHT ▸</div>
      <div className="ticker-track">
        <div className="ticker-inner">
          {doubled.map((item, i) => (
            <span key={`${item}-${i}`}>
              {item}
              <span className="sep" aria-hidden="true">
                ◆
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
