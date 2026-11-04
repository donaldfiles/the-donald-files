-- One shared rule for every subscriber count/report: internal addresses are never counted.
-- Internal = donaldfiles+<tag>@proton.me (QA plus-addresses) and the owner's dearziva.co.za address.
-- Counts only: digest delivery to these addresses is unchanged.
create or replace function public.df_is_internal_email(p_email text)
returns boolean language sql immutable set search_path = '' as $$
  select coalesce(lower(p_email) like 'donaldfiles+%@proton.me' or lower(p_email) like '%@dearziva.co.za', false)
$$;

create or replace function public.df_digest_stats(p_secret text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if not private.df_check_digest_secret(p_secret) then raise exception 'forbidden' using errcode = '42501'; end if;
  return jsonb_build_object('confirmed', (select count(*) from public.newsletter_subscribers
    where status = 'confirmed' and source is distinct from 'test' and not public.df_is_internal_email(email)));
end $$;
