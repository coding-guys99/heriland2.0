-- Heriland 3.0: run in the Heriland Supabase project SQL editor.
create table if not exists public.business_listings (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 name text not null check (length(trim(name)) between 2 and 120),
 category text not null,
 hometown text not null,
 service_areas text[] not null default '{}',
 description text not null default '',
 phone text,
 whatsapp text,
 website text,
 address text,
 status text not null default 'pending' check(status in ('pending','approved','rejected')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists business_listings_owner_idx on public.business_listings(owner_id);
create index if not exists business_listings_status_idx on public.business_listings(status);
alter table public.business_listings enable row level security;
revoke all on public.business_listings from anon,authenticated;
grant select on public.business_listings to anon,authenticated;
grant insert (owner_id,name,category,hometown,service_areas,description,phone,whatsapp,website,address)
 on public.business_listings to authenticated;
grant update (name,category,hometown,service_areas,description,phone,whatsapp,website,address)
 on public.business_listings to authenticated;
drop policy if exists "public approved listings" on public.business_listings;
create policy "public approved listings" on public.business_listings for select to anon using (status='approved');
drop policy if exists "owners read their listings" on public.business_listings;
create policy "owners read their listings" on public.business_listings for select to authenticated using (owner_id=(select auth.uid()));
drop policy if exists "owners submit listings" on public.business_listings;
create policy "owners submit listings" on public.business_listings for insert to authenticated
 with check (owner_id=(select auth.uid()) and status='pending');
drop policy if exists "owners edit listings" on public.business_listings;
create policy "owners edit listings" on public.business_listings for update to authenticated
 using(owner_id=(select auth.uid())) with check(owner_id=(select auth.uid()));
-- Owners cannot update status because status is excluded from UPDATE column grant.
-- Approve a verified listing as an authorized SQL editor / backend administrator:
-- update public.business_listings set status='approved' where id='<verified uuid>';
-- No admin credentials or elevated API keys belong in GitHub Pages.
