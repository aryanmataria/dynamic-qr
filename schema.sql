-- Run this once in Supabase: Project > SQL Editor > New query > paste > Run

create table if not exists qr_codes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  business_name text,
  destination_url text,
  scan_count integer default 0,
  last_scanned_at timestamptz,
  created_at timestamptz default now()
);

-- Optional: an index to make slug lookups fast (slug is already unique so
-- Postgres auto-indexes it, this is just here for clarity/future columns)
create index if not exists idx_qr_codes_slug on qr_codes (slug);
