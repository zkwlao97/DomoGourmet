# Domo Gourmet v23 Supabase patch

## 1) What changed
- Render Free의 비영속 로컬 파일 저장 대신 Supabase를 저장소로 쓸 수 있도록 `server.js`를 수정했습니다.
- `SUPABASE_URL`과 `SUPABASE_SECRET_KEY`가 있으면 Supabase를 우선 사용합니다.
- 없으면 기존처럼 `DATA_FILE_PATH` 파일 저장으로 동작합니다.
- `GET /api/health`에 `storageBackend`, `supabaseConfigured`가 표시됩니다.

## 2) Supabase SQL
Supabase SQL Editor에서 아래를 실행하세요.

```sql
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
```

## 3) Render environment variables
- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`
- `SUPABASE_TABLE=app_state`
- `SUPABASE_STORE_KEY=main`
- `HOTPEPPER_API_KEY`
- `GEMINI_API_KEY`

## 4) Important
- `SUPABASE_SECRET_KEY`는 브라우저 코드에 넣지 말고 Render 환경변수에만 넣으세요.
- Render Root Directory는 비워 두는 편이 안전합니다. 저장소 루트에 `server.js`, `package.json`, `public/index.html`이 바로 있어야 합니다.
- 배포 후 `GET /api/health`에서 `storageBackend: "supabase"`가 보여야 정상입니다.
