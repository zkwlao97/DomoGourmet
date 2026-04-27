create table if not exists public.app_state (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.app_state (key, data)
values (
  'main',
  '{
    "adminNotes": {},
    "customRestaurants": {},
    "recommendedRestaurants": {},
    "suggestedPlaces": {},
    "themePlaces": {},
    "themeTemplates": {},
    "contentPosts": {},
    "communityPosts": {},
    "updatedAt": "1970-01-01T00:00:00.000Z"
  }'::jsonb
)
on conflict (key) do nothing;
