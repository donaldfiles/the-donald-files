-- The Donald Files — initial schema stub
-- Project ref (existing): rkudbltzydukizjtjonl
-- Apply via Supabase SQL editor or CLI. Enable Email auth in Dashboard → Authentication.

-- Articles
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  dek text,
  body text,
  category text not null check (category in ('REPORTS', 'ANALYSIS', 'TIMELINE', 'OPINION')),
  published_at timestamptz,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_published_idx
  on public.articles (published_at desc)
  where is_published = true;

-- Subscribers (emails collected from Subscribe form / Edge Function)
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);

-- Basic auth note:
-- Use Supabase Auth (email magic link or password) for /admin.
-- Restrict writes with RLS: public read published articles; only authenticated
-- service/admin roles insert/update articles and subscribers.

alter table public.articles enable row level security;
alter table public.subscribers enable row level security;

-- Public can read published articles
create policy "Public read published articles"
  on public.articles
  for select
  using (is_published = true);

-- Subscribers: no public select; inserts should go through Edge Function / service role
-- (policy intentionally omitted for insert — use service role server-side)
