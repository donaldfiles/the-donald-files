-- The Donald Files: daily digest (applied 2026-10-21 via the Supabase connector).
-- Standing rule: explicit grants, RLS on, no anon/authenticated table access.
-- The digest Worker and digest/set-intro.mjs use the public key plus a shared digest secret,
-- whose sha256 lives in private.df_config ('digest_secret_sha256', inserted out of band, never committed).

create table public.digest_intros (
  digest_date date primary key,
  intro text not null check (length(intro) between 1 and 280),
  updated_at timestamptz not null default now()
);

create table public.digest_sends (
  id bigint generated always as identity primary key,
  digest_date date not null,
  subscriber_id uuid not null references public.newsletter_subscribers (id) on delete cascade,
  test boolean not null default false,
  status text not null check (status in ('sent', 'failed')),
  resend_id text,
  error text,
  items int,
  created_at timestamptz not null default now(),
  unique (digest_date, subscriber_id)
);

alter table public.digest_intros enable row level security;
alter table public.digest_sends enable row level security;
revoke all on public.digest_intros, public.digest_sends from public, anon, authenticated;
grant select, insert, update, delete on public.digest_intros, public.digest_sends to service_role;
grant usage, select on sequence public.digest_sends_id_seq to service_role;
revoke truncate, references, trigger on public.digest_intros, public.digest_sends from service_role;

create or replace function private.df_check_digest_secret(p_secret text)
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce(
    (select value from private.df_config where key = 'digest_secret_sha256')
      = encode(extensions.digest(coalesce(p_secret, ''), 'sha256'), 'hex'),
    false)
$$;
revoke all on function private.df_check_digest_secret(text) from public, anon, authenticated;

create or replace function public.df_digest_set_intro(p_secret text, p_date date, p_intro text)
returns jsonb language plpgsql volatile security definer set search_path = '' as $$
begin
  if not private.df_check_digest_secret(p_secret) then raise exception 'forbidden' using errcode = '42501'; end if;
  if p_intro is null or length(trim(p_intro)) = 0 then
    delete from public.digest_intros where digest_date = p_date;
    return jsonb_build_object('result', 'cleared', 'date', p_date);
  end if;
  insert into public.digest_intros (digest_date, intro) values (p_date, trim(p_intro))
    on conflict (digest_date) do update set intro = excluded.intro, updated_at = now();
  return jsonb_build_object('result', 'saved', 'date', p_date);
end $$;

-- Recipients for p_date: confirmed, not yet sent for that date. p_test = true returns ONLY rows with source 'test'
-- (and real sends never include them), so a test run can never reach a real subscriber.
create or replace function public.df_digest_prepare(p_secret text, p_date date, p_test boolean default false)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if not private.df_check_digest_secret(p_secret) then raise exception 'forbidden' using errcode = '42501'; end if;
  return jsonb_build_object(
    'intro', (select intro from public.digest_intros where digest_date = p_date),
    'recipients', coalesce((
      select jsonb_agg(jsonb_build_object('id', s.id, 'email', s.email) order by s.confirmed_at)
      from public.newsletter_subscribers s
      where s.status = 'confirmed'
        and (case when p_test then s.source = 'test' else s.source is distinct from 'test' end)
        and not exists (select 1 from public.digest_sends d where d.digest_date = p_date and d.subscriber_id = s.id and d.status = 'sent')
    ), '[]'::jsonb));
end $$;

-- p_rows: [{subscriber_id, status, resend_id, error}]
create or replace function public.df_digest_log(p_secret text, p_date date, p_rows jsonb, p_test boolean default false, p_items int default null)
returns jsonb language plpgsql volatile security definer set search_path = '' as $$
declare n int;
begin
  if not private.df_check_digest_secret(p_secret) then raise exception 'forbidden' using errcode = '42501'; end if;
  insert into public.digest_sends (digest_date, subscriber_id, test, status, resend_id, error, items)
    select p_date, (r->>'subscriber_id')::uuid, p_test, r->>'status', r->>'resend_id', left(r->>'error', 500), p_items
    from jsonb_array_elements(p_rows) r
  on conflict (digest_date, subscriber_id) do update
    set status = excluded.status, resend_id = excluded.resend_id, error = excluded.error, created_at = now()
    where public.digest_sends.status <> 'sent';
  get diagnostics n = row_count;
  return jsonb_build_object('logged', n);
end $$;

-- Count only, no emails.
create or replace function public.df_digest_stats(p_secret text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if not private.df_check_digest_secret(p_secret) then raise exception 'forbidden' using errcode = '42501'; end if;
  return jsonb_build_object('confirmed', (select count(*) from public.newsletter_subscribers where status = 'confirmed' and source is distinct from 'test'));
end $$;

revoke all on function public.df_digest_set_intro(text, date, text) from public, authenticated;
revoke all on function public.df_digest_prepare(text, date, boolean) from public, authenticated;
revoke all on function public.df_digest_log(text, date, jsonb, boolean, int) from public, authenticated;
revoke all on function public.df_digest_stats(text) from public, authenticated;
grant execute on function public.df_digest_set_intro(text, date, text) to anon, service_role;
grant execute on function public.df_digest_prepare(text, date, boolean) to anon, service_role;
grant execute on function public.df_digest_log(text, date, jsonb, boolean, int) to anon, service_role;
grant execute on function public.df_digest_stats(text) to anon, service_role;
