-- KALA orders database.
-- Paste this whole file into Supabase → SQL Editor → New query → Run. Safe to run again.
-- Only the website's server functions (with the secret key) can read or write these tables:
-- row level security is on and there are no public policies.

-- one row per checkout; status: pending (awaiting payment) → paid → (cancelled / failed)
create table if not exists public.orders (
  id                  text primary key,                 -- KALA-XXXXXXX, shown to the customer
  status              text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled')),
  works               jsonb not null,                   -- [{ id, title, price }] price in rupees, from works.json
  amount              integer not null,                 -- total in paise (₹1 = 100)
  customer            jsonb not null,                   -- { name, email, phone, address, city, state, pin, country, note }
  razorpay_order_id   text unique,
  razorpay_payment_id text,
  shiprocket          jsonb,                            -- { ok, orderId, shipmentId } or { ok:false, error }
  notified            boolean not null default false,   -- artist email sent by the server
  problem             text,                             -- anything that needs the artist's attention
  created_at          timestamptz not null default now(),
  paid_at             timestamptz
);
create index if not exists orders_created_at on public.orders (created_at desc);

-- one row per painting that is being paid for (expires) or sold (sold = true)
create table if not exists public.holds (
  work_id    text primary key,
  order_id   text not null references public.orders (id) on delete cascade,
  expires_at timestamptz,
  sold       boolean not null default false
);

alter table public.orders enable row level security;
alter table public.holds  enable row level security;

-- Hold paintings while someone pays. Returns the ids that someone else already holds or bought
-- (empty = all held for this order). Atomic, so two buyers can never both get the same original.
create or replace function public.hold_works(p_order text, p_works text[], p_minutes int default 20)
returns text[]
language plpgsql
security definer
set search_path = public
as $$
declare
  taken text[];
begin
  delete from holds where not sold and expires_at < now() and work_id = any (p_works);

  insert into holds (work_id, order_id, expires_at)
  select w, p_order, now() + make_interval(mins => p_minutes)
  from unnest(p_works) as w
  on conflict (work_id) do nothing;

  select coalesce(array_agg(work_id), '{}') into taken
  from holds
  where work_id = any (p_works) and order_id <> p_order;

  if cardinality(taken) > 0 then
    delete from holds where order_id = p_order and not sold;
  end if;
  return taken;
end;
$$;

-- After payment: mark the order's paintings sold. Returns ids that another order had taken
-- in the meantime (should be empty; if not, the artist is told).
create or replace function public.sell_works(p_order text)
returns text[]
language plpgsql
security definer
set search_path = public
as $$
declare
  clash text[];
begin
  update holds set sold = true, expires_at = null where order_id = p_order;

  delete from holds h
  using orders o, jsonb_array_elements(o.works) as w
  where o.id = p_order and h.work_id = w ->> 'id' and h.order_id <> p_order and not h.sold and h.expires_at < now();

  insert into holds (work_id, order_id, sold, expires_at)
  select w ->> 'id', p_order, true, null
  from orders o, jsonb_array_elements(o.works) as w
  where o.id = p_order
  on conflict (work_id) do nothing;

  select coalesce(array_agg(w ->> 'id'), '{}') into clash
  from orders o, jsonb_array_elements(o.works) as w
  where o.id = p_order
    and not exists (select 1 from holds h where h.work_id = w ->> 'id' and h.order_id = p_order);
  return clash;
end;
$$;

-- the functions are for the server only
revoke execute on function public.hold_works(text, text[], int) from public, anon, authenticated;
revoke execute on function public.sell_works(text) from public, anon, authenticated;
grant execute on function public.hold_works(text, text[], int) to service_role;
grant execute on function public.sell_works(text) to service_role;
