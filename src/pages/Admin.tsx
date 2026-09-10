export function Admin() {
  return (
    <div className="page admin">
      <header className="page-header">
        <h1>Admin</h1>
        <p className="dek">
          Stub only. Wire Supabase Auth (email) + RLS before publishing tools.
        </p>
      </header>
      <div className="admin-panel">
        <p>
          Future: sign-in, draft articles, publish to <code>articles</code>,
          export <code>subscribers</code>.
        </p>
        <p className="meta">Route: /admin — not linked in public nav.</p>
      </div>
    </div>
  )
}
