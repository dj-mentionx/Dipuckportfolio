create table if not exists mentions (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  model text not null,
  response text not null,
  mentions_dipuck boolean not null default false,
  score_delta int not null default 0,
  fetched_at timestamptz not null default now()
);

create index if not exists mentions_query_model_fetched_idx
  on mentions (query, model, fetched_at desc);

create table if not exists share_requests (
  id uuid primary key default gen_random_uuid(),
  ip_hash text not null,
  requested_at timestamptz not null default now()
);

create index if not exists share_requests_ip_day_idx
  on share_requests (ip_hash, requested_at);
