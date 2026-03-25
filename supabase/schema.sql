-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Words table: tracks vocabulary state per user per language
create table if not exists public.words (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  word text not null,
  language text not null default 'es',
  state text not null check (state in ('learning', 'known')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, word, language)
);

-- Row Level Security
alter table public.words enable row level security;

create policy "Users can only access their own words"
  on public.words
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Index for fast lookups
create index if not exists words_user_language_idx on public.words(user_id, language);