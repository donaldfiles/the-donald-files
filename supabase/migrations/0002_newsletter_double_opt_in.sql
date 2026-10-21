-- The Donald Files: newsletter double opt-in (applied 2026-10-21 via the Supabase connector).
-- Standing rule: explicit grants, RLS on, no anon/authenticated table access.
-- The Cloudflare Pages Functions (functions/api/*) reach the data only through the
-- three SECURITY DEFINER RPCs below. Each RPC requires a shared secret whose sha256
-- is kept in private.df_config. That row is inserted out of band and is never committed.
-- Note: 0001_init.sql was a stub and was never applied.

create extension if not exists pgcrypto with schema extensions;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.df_config (
  key text primary key,
  value text not null
);
revoke all on private.df_config from public, anon, authenticated;

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email) and length(email) <= 254),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'unsubscribed')),
  confirm_token_hash text unique,
  source text,
  ip_hash text,
  created_at timestamptz not null default now(),
  last_sent_at timestamptz,
  send_count int not null default 0,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz
);

create table public.newsletter_attempts (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  created_at timestamptz not null default now()
);
create index newsletter_attempts_ip_time on public.newsletter_attempts (ip_hash, created_at desc);

alter table public.newsletter_subscribers enable row level security;
alter table public.newsletter_attempts enable row level security;
-- No policies: anon/authenticated get nothing even if a grant were added later.
revoke all on public.newsletter_subscribers from public, anon, authenticated;
revoke all on public.newsletter_attempts from public, anon, authenticated;
grant select, insert, update, delete on public.newsletter_subscribers to service_role;
grant select, insert, update, delete on public.newsletter_attempts to service_role;
grant usage, select on sequence public.newsletter_attempts_id_seq to service_role;
-- Supabase default privileges also hand service_role TRUNCATE/REFERENCES/TRIGGER; strip them.
revoke truncate, references, trigger on public.newsletter_subscribers, public.newsletter_attempts from service_role;

create or replace function private.df_check_secret(p_secret text)
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce(
    (select value from private.df_config where key = 'rpc_secret_sha256')
      = encode(extensions.digest(coalesce(p_secret, ''), 'sha256'), 'hex'),
    false)
$$;
revoke all on function private.df_check_secret(text) from public, anon, authenticated;

-- Returns {result: send|already_confirmed|cooldown|rate_limited|invalid_email, id}
create or replace function public.df_subscribe(
  p_secret text, p_email text, p_ip_hash text, p_confirm_hash text, p_source text default 'web')
returns jsonb language plpgsql volatile security definer set search_path = '' as $$
declare
  v_email text := lower(trim(coalesce(p_email, '')));
  v_row public.newsletter_subscribers;
  v_recent int;
begin
  if not private.df_check_secret(p_secret) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if length(v_email) > 254 or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    return jsonb_build_object('result', 'invalid_email');
  end if;
  delete from public.newsletter_attempts where created_at < now() - interval '1 day';
  select count(*) into v_recent from public.newsletter_attempts
    where ip_hash = p_ip_hash and created_at > now() - interval '1 hour';
  if v_recent >= 5 then
    return jsonb_build_object('result', 'rate_limited');
  end if;
  insert into public.newsletter_attempts (ip_hash) values (coalesce(p_ip_hash, 'unknown'));

  select * into v_row from public.newsletter_subscribers where email = v_email for update;
  if not found then
    insert into public.newsletter_subscribers (email, confirm_token_hash, source, ip_hash, last_sent_at, send_count)
      values (v_email, p_confirm_hash, left(p_source, 64), p_ip_hash, now(), 1)
      returning * into v_row;
    return jsonb_build_object('result', 'send', 'id', v_row.id);
  end if;
  if v_row.status = 'confirmed' then
    return jsonb_build_object('result', 'already_confirmed');
  end if;
  if v_row.last_sent_at > now() - interval '10 minutes' or v_row.send_count >= 5 then
    return jsonb_build_object('result', 'cooldown');
  end if;
  update public.newsletter_subscribers
    set status = 'pending', confirm_token_hash = p_confirm_hash, last_sent_at = now(),
        send_count = send_count + 1, unsubscribed_at = null
    where id = v_row.id;
  return jsonb_build_object('result', 'send', 'id', v_row.id);
end $$;

-- Returns {result: confirmed|already|expired|invalid, id}
create or replace function public.df_confirm(p_secret text, p_token_hash text)
returns jsonb language plpgsql volatile security definer set search_path = '' as $$
declare v_row public.newsletter_subscribers;
begin
  if not private.df_check_secret(p_secret) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  select * into v_row from public.newsletter_subscribers where confirm_token_hash = p_token_hash for update;
  if not found then return jsonb_build_object('result', 'invalid'); end if;
  if v_row.status = 'confirmed' then return jsonb_build_object('result', 'already', 'id', v_row.id); end if;
  if v_row.last_sent_at < now() - interval '7 days' then return jsonb_build_object('result', 'expired'); end if;
  update public.newsletter_subscribers
    set status = 'confirmed', confirmed_at = now(), unsubscribed_at = null
    where id = v_row.id;
  return jsonb_build_object('result', 'confirmed', 'id', v_row.id);
end $$;

-- Unsubscribe links carry id + HMAC (checked in the Pages Function). Returns {result: unsubscribed|invalid}
create or replace function public.df_unsubscribe(p_secret text, p_id uuid)
returns jsonb language plpgsql volatile security definer set search_path = '' as $$
begin
  if not private.df_check_secret(p_secret) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  update public.newsletter_subscribers
    set status = 'unsubscribed', unsubscribed_at = now(), confirm_token_hash = null
    where id = p_id;
  if not found then return jsonb_build_object('result', 'invalid'); end if;
  return jsonb_build_object('result', 'unsubscribed');
end $$;

revoke all on function public.df_subscribe(text, text, text, text, text) from public, authenticated;
revoke all on function public.df_confirm(text, text) from public, authenticated;
revoke all on function public.df_unsubscribe(text, uuid) from public, authenticated;
grant execute on function public.df_subscribe(text, text, text, text, text) to anon, service_role;
grant execute on function public.df_confirm(text, text) to anon, service_role;
grant execute on function public.df_unsubscribe(text, uuid) to anon, service_role;
