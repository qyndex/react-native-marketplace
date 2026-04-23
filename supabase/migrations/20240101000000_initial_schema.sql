-- Marketplace schema: profiles, listings, messages, favorites
-- Designed for a peer-to-peer marketplace (think Craigslist/OfferUp)

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  email       text not null,
  full_name   text not null default '',
  avatar_url  text,
  bio         text default '',
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Anyone can view profiles
create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Users can insert their own profile (for trigger/signup)
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ============================================================
-- LISTINGS
-- ============================================================
create table if not exists public.listings (
  id          uuid primary key default gen_random_uuid(),
  seller_id   uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  description text not null default '',
  price       numeric(10,2) not null check (price >= 0),
  category    text not null default 'Other',
  image_urls  text[] not null default '{}',
  status      text not null default 'active' check (status in ('active', 'sold', 'draft', 'archived')),
  created_at  timestamptz not null default now()
);

alter table public.listings enable row level security;

-- Active listings are readable by everyone
create policy "Active listings are publicly readable"
  on public.listings for select
  using (status = 'active' or seller_id = auth.uid());

-- Sellers can insert their own listings
create policy "Sellers can create listings"
  on public.listings for insert
  with check (auth.uid() = seller_id);

-- Sellers can update their own listings
create policy "Sellers can update own listings"
  on public.listings for update
  using (auth.uid() = seller_id)
  with check (auth.uid() = seller_id);

-- Sellers can delete their own listings
create policy "Sellers can delete own listings"
  on public.listings for delete
  using (auth.uid() = seller_id);

-- Index for category filtering and search
create index if not exists idx_listings_category on public.listings(category) where status = 'active';
create index if not exists idx_listings_seller on public.listings(seller_id);
create index if not exists idx_listings_status on public.listings(status);

-- ============================================================
-- MESSAGES
-- ============================================================
create table if not exists public.messages (
  id            uuid primary key default gen_random_uuid(),
  sender_id     uuid not null references public.profiles(id) on delete cascade,
  recipient_id  uuid not null references public.profiles(id) on delete cascade,
  listing_id    uuid references public.listings(id) on delete set null,
  content       text not null,
  read          boolean not null default false,
  created_at    timestamptz not null default now()
);

alter table public.messages enable row level security;

-- Users can only read messages they sent or received
create policy "Users can read own messages"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = recipient_id);

-- Users can send messages (insert as sender)
create policy "Users can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id);

-- Recipients can mark messages as read
create policy "Recipients can update read status"
  on public.messages for update
  using (auth.uid() = recipient_id)
  with check (auth.uid() = recipient_id);

create index if not exists idx_messages_sender on public.messages(sender_id);
create index if not exists idx_messages_recipient on public.messages(recipient_id);
create index if not exists idx_messages_listing on public.messages(listing_id);

-- ============================================================
-- FAVORITES
-- ============================================================
create table if not exists public.favorites (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  listing_id  uuid not null references public.listings(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique(user_id, listing_id)
);

alter table public.favorites enable row level security;

-- Users can only see their own favorites
create policy "Users can read own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

-- Users can add favorites
create policy "Users can add favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

-- Users can remove favorites
create policy "Users can remove favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);

create index if not exists idx_favorites_user on public.favorites(user_id);
create index if not exists idx_favorites_listing on public.favorites(listing_id);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', null)
  );
  return new;
end;
$$;

-- Trigger fires after each new auth.users row
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
