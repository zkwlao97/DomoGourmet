#!/usr/bin/env node
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { createClient } = require('@supabase/supabase-js');

const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const ENV_PATH = path.join(ROOT, '.env');
loadDotEnv(ENV_PATH);

const PORT = Number(process.env.PORT || 3000);
const HOTPEPPER_API_KEY = String(process.env.HOTPEPPER_API_KEY || '').trim();
const GEMINI_API_KEY = String(process.env.GEMINI_API_KEY || '').trim();
const DATA_FILE_PATH = path.resolve(String(process.env.DATA_FILE_PATH || path.join(ROOT, 'data', 'store.json')).trim());
const GEMINI_MODEL_CANDIDATES = String(process.env.GEMINI_MODEL_CANDIDATES || 'gemini-3-flash-preview,gemini-2.5-flash,gemini-3.1-flash-lite-preview,gemini-2.5-flash-lite,gemini-2.0-flash,gemini-2.0-flash-lite').split(',').map((item) => item.trim()).filter(Boolean);
const SUPABASE_URL = String(process.env.SUPABASE_URL || '').trim();
const SUPABASE_SECRET_KEY = String(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
const SUPABASE_TABLE = String(process.env.SUPABASE_TABLE || 'app_state').trim() || 'app_state';
const SUPABASE_STORE_KEY = String(process.env.SUPABASE_STORE_KEY || 'main').trim() || 'main';
const STORAGE_BACKEND = SUPABASE_URL && SUPABASE_SECRET_KEY ? 'supabase' : 'file';
const supabase = STORAGE_BACKEND === 'supabase' ? createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, { auth: { persistSession: false } }) : null;
let STORE_CACHE = null;
let STORE_INIT_PROMISE = null;
let STORE_SAVE_QUEUE = Promise.resolve();

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const LANDMARKS = [
  { keys: ['라디오회관', '라디오 회관', 'radio kaikan', 'ラジオ会館'], nameKo: '라디오회관', nameOriginal: 'ラジオ会館', lat: 35.699693, lng: 139.77158 },
  { keys: ['아키하바라역', '아키하바라 역', '秋葉原駅'], nameKo: '아키하바라역', nameOriginal: '秋葉原駅', lat: 35.698683, lng: 139.774219 },
  { keys: ['센소지', 'sensoji', '浅草寺'], nameKo: '센소지', nameOriginal: '浅草寺', lat: 35.714765, lng: 139.796655 },
  { keys: ['도쿄스카이트리', '도쿄 스카이트리', '東京スカイツリー'], nameKo: '도쿄 스카이트리', nameOriginal: '東京スカイツリー', lat: 35.710063, lng: 139.8107 },
  { keys: ['시부야 스크램블', '시부야스크램블', '渋谷スクランブル交差点'], nameKo: '시부야 스크램블 교차로', nameOriginal: '渋谷スクランブル交差点', lat: 35.659494, lng: 139.700553 },
  { keys: ['도톤보리', '道頓堀'], nameKo: '도톤보리', nameOriginal: '道頓堀', lat: 34.668731, lng: 135.501295 },
  { keys: ['오사카성', '오사카 성', '大阪城'], nameKo: '오사카성', nameOriginal: '大阪城', lat: 34.687315, lng: 135.526202 },
  { keys: ['교토역', '교토 역', '京都駅'], nameKo: '교토역', nameOriginal: '京都駅', lat: 34.985849, lng: 135.758766 },
  { keys: ['기요미즈데라', '清水寺'], nameKo: '기요미즈데라', nameOriginal: '清水寺', lat: 34.994856, lng: 135.785046 },
  { keys: ['후시미이나리', '후시미 이나리', '伏見稲荷大社'], nameKo: '후시미 이나리 신사', nameOriginal: '伏見稲荷大社', lat: 34.967146, lng: 135.772671 },
  { keys: ['하카타역', '하카타 역', '博多駅'], nameKo: '하카타역', nameOriginal: '博多駅', lat: 33.590355, lng: 130.420616 },
];

const GENRE_MAP = new Map([
  ['ラーメン', '라멘'], ['つけ麺', '츠케멘'], ['寿司', '스시'], ['鮨', '스시'], ['海鮮', '해산물'], ['和食', '일식'],
  ['居酒屋', '이자카야'], ['焼肉', '야키니쿠'], ['焼き鳥', '야키토리'], ['串焼き', '꼬치구이'], ['カフェ', '카페'],
  ['喫茶店', '카페'], ['うどん', '우동'], ['そば', '소바'], ['天ぷら', '튀김'], ['天丼', '덴동'], ['牛カツ', '규카츠'],
  ['とんかつ', '돈카츠'], ['しゃぶしゃぶ', '샤부샤부'], ['すき焼き', '스키야키'], ['お好み焼き', '오코노미야키'],
  ['たこ焼き', '타코야키'], ['うなぎ', '장어'], ['定食', '정식'], ['韓国料理', '한식'], ['中華', '중식'], ['洋食', '양식'],
  ['ビストロ', '비스트로'], ['バー', '바'], ['ダイニングバー', '다이닝 바'], ['ステーキ', '스테이크'], ['オムライス', '오므라이스'],
  ['カレー', '카레'], ['丼', '덮밥'], ['もつ鍋', '모츠나베'], ['鍋', '전골'], ['ハンバーグ', '함박스테이크'], ['パスタ', '파스타'],
]);

const PHRASE_MAP = [
  ['東京都', '도쿄도 '], ['大阪府', '오사카부 '], ['京都府', '교토부 '], ['福岡県', '후쿠오카현 '], ['北海道', '홋카이도 '],
  ['千代田区', '치요다구 '], ['台東区', '다이토구 '], ['渋谷区', '시부야구 '], ['新宿区', '신주쿠구 '], ['中央区', '주오구 '],
  ['下京区', '시모교구 '], ['東山区', '히가시야마구 '], ['博多区', '하카타구 '], ['秋葉原', '아키하바라'], ['浅草', '아사쿠사'],
  ['上野', '우에노'], ['渋谷', '시부야'], ['新宿', '신주쿠'], ['銀座', '긴자'], ['難波', '난바'], ['道頓堀', '도톤보리'],
  ['京都', '교토'], ['博多', '하카타'], ['福岡', '후쿠오카'], ['鹿児島', '가고시마'], ['札幌', '삿포로'], ['天文館', '텐몬칸'], ['桜島', '사쿠라지마'], ['仙巌園', '센간엔'], ['城山展望台', '시로야마 전망대'], ['大通公園', '오도리 공원'], ['すすきの', '스스키노'], ['駅前', '역 앞'], ['駅', '역'], ['徒歩', '도보 '], ['分', '분'],
  ['より', '에서 '], ['約', '약 '], ['無休', '연중무휴'], ['年中無休', '연중무휴'], ['不定休', '비정기 휴무'],
  ['定休日', '정기 휴무'], ['定休', '휴무'], ['個室', '개별룸'], ['禁煙', '금연'], ['喫煙', '흡연 가능'],
  ['カード', '카드 결제'], ['ランチ', '점심 운영'], ['深夜', '심야 영업'], ['英語', '영어'], ['予約', '예약'],
  ['営業', '영업'], ['翌', '익일 '], ['月曜', '월요일'], ['火曜', '화요일'], ['水曜', '수요일'], ['木曜', '목요일'],
  ['金曜', '금요일'], ['土曜', '토요일'], ['日曜', '일요일'], ['祝日', '공휴일'], ['～', ' ~ '], ['〜', ' ~ '],
];

const server = http.createServer(async (req, res) => {
  try {
    await ensureStoreReady();
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/api/health') {
      return sendJson(res, 200, {
        ok: true,
        hotpepperConfigured: Boolean(HOTPEPPER_API_KEY),
        geminiConfigured: Boolean(GEMINI_API_KEY),
        geminiModels: GEMINI_MODEL_CANDIDATES,
        dataFilePath: DATA_FILE_PATH,
        storageBackend: STORAGE_BACKEND,
        supabaseConfigured: STORAGE_BACKEND === 'supabase',
        mode: HOTPEPPER_API_KEY ? 'live-ready' : 'demo-only',
      });
    }

    if (url.pathname === '/api/geocode') {
      return await handleGeocode(url, res);
    }

    if (url.pathname === '/api/resolve-map-link') {
      return await handleResolveMapLink(url, res);
    }

    if (url.pathname === '/api/search') {
      return await handleSearch(url, res);
    }


    if (req.method === 'POST' && url.pathname === '/api/auth/signup') {
      return await handleAuthSignup(req, res);
    }

    if (req.method === 'POST' && url.pathname === '/api/auth/login') {
      return await handleAuthLogin(req, res);
    }

    if (req.method === 'POST' && url.pathname === '/api/community/post/delete') {
      return await handleCommunityPostDelete(req, res);
    }

    if (url.pathname === '/api/store-public') {
      return await handleStorePublic(res);
    }

    if (req.method === 'POST' && url.pathname === '/api/admin/recommend') {
      return await handleAdminRecommend(req, res);
    }

    if (req.method === 'POST' && url.pathname === '/api/admin/recommend/remove') {
      return await handleAdminRecommendRemove(req, res);
    }

    if (req.method === 'POST' && url.pathname === '/api/admin/custom-restaurant') {
      return await handleAdminCustomRestaurant(req, res);
    }

    if (req.method === 'POST' && url.pathname === '/api/admin/custom-restaurant/delete') {
      return await handleAdminCustomRestaurantDelete(req, res);
    }

    if (req.method === 'POST' && url.pathname === '/api/admin/theme-place') {
      return await handleAdminThemePlace(req, res);
    }

    if (req.method === 'POST' && url.pathname === '/api/admin/theme-template') {
      return await handleAdminThemeTemplate(req, res);
    }

    if (req.method === 'POST' && url.pathname === '/api/admin/content-post') {
      return await handleAdminContentPost(req, res);
    }

    if (req.method === 'POST' && url.pathname === '/api/community/post') {
      return await handleCommunityPost(req, res);
    }

    if (req.method === 'POST' && url.pathname === '/api/store/cache-places') {
      return await handleStoreCachePlaces(req, res);
    }

    if (req.method === 'POST' && url.pathname === '/api/ai/trip-plan') {
      return await handleAiTripPlan(req, res);
    }

    if (req.method === 'POST' && url.pathname === '/api/ai/suggest-places') {
      return await handleAiSuggestPlaces(req, res);
    }

    if (req.method === 'POST' && url.pathname === '/api/ai/translate-restaurants') {
      return await handleAiRestaurantTranslation(req, res);
    }

    return serveStatic(url.pathname, res);
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, { ok: false, error: 'server_error', message: error.message });
  }
});

server.listen(PORT, async () => {
  try {
    await ensureStoreReady();
  } catch (error) {
    console.error('Failed to initialize store backend:', error);
  }
  console.log(`DomoGourmet Japan running at http://localhost:${PORT}`);
  console.log(`STORAGE_BACKEND: ${STORAGE_BACKEND}`);
  console.log(`DATA_FILE_PATH: ${DATA_FILE_PATH}`);
  if (STORAGE_BACKEND === 'supabase') {
    console.log(`SUPABASE_TABLE: ${SUPABASE_TABLE} / key=${SUPABASE_STORE_KEY}`);
  }
  if (!HOTPEPPER_API_KEY) {
    console.log('HOTPEPPER_API_KEY not found. Demo mode only.');
  }
});

async function handleGeocode(url, res) {
  const q = String(url.searchParams.get('q') || '').trim();
  if (!q) return sendJson(res, 400, { ok: false, error: 'missing_query' });

  const preset = findLandmark(q);
  if (preset) {
    return sendJson(res, 200, { ok: true, source: 'preset', place: preset });
  }

  const place = await geocodeJapanQuery(q);
  return sendJson(res, 200, { ok: true, source: 'nominatim', place });
}

async function handleResolveMapLink(url, res) {
  const raw = String(url.searchParams.get('url') || '').trim();
  if (!raw) return sendJson(res, 400, { ok: false, error: 'missing_url' });

  const parsed = safeParseUrl(raw);
  if (!parsed) return sendJson(res, 400, { ok: false, error: 'invalid_url' });

  const allowedHosts = ['google.com', 'www.google.com', 'maps.google.com', 'maps.app.goo.gl', 'goo.gl'];
  const host = parsed.hostname.toLowerCase();
  if (!allowedHosts.some((item) => host === item || host.endsWith('.' + item))) {
    return sendJson(res, 400, { ok: false, error: 'unsupported_host' });
  }

  let finalUrl = raw;
  try {
    const response = await fetch(raw, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'HankkiRouteJapan/1.4',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    finalUrl = response.url || raw;
    try { response.body?.cancel?.(); } catch (error) { }
  } catch (error) {
    finalUrl = raw;
  }

  const place = await extractPlaceFromMapUrl(raw, finalUrl);
  return sendJson(res, 200, { ok: true, source: 'google-maps-link', place });
}

async function extractPlaceFromMapUrl(rawUrl, finalUrl) {
  const raw = safeParseUrl(rawUrl);
  const finalParsed = safeParseUrl(finalUrl || rawUrl);
  const name = extractMapName(finalParsed || raw) || extractMapName(raw);
  let coords = extractCoordsFromMapUrl(finalParsed || raw) || extractCoordsFromMapUrl(raw);

  if (!coords) {
    const queryText = extractQueryText(finalParsed || raw) || extractQueryText(raw);
    if (queryText) {
      const geocoded = await geocodeJapanQuery(queryText);
      if (geocoded) {
        return {
          ...geocoded,
          source: 'google-maps-link',
          nameKo: geocoded.nameKo || localizeLoose(queryText),
          nameOriginal: geocoded.nameOriginal || queryText,
        };
      }
    }
    return null;
  }

  const displayOriginal = [name, extractQueryText(finalParsed || raw)].filter(Boolean)[0] || 'Google Maps 링크 기준점';
  return {
    nameKo: localizeLoose(name || displayOriginal || '지도 링크 기준점') || '지도 링크 기준점',
    nameOriginal: name || displayOriginal || 'Google Maps Point',
    displayNameKo: localizeLoose(displayOriginal || name || '지도 링크 기준점') || '지도 링크 기준점',
    displayNameOriginal: displayOriginal || name || 'Google Maps Point',
    lat: coords.lat,
    lng: coords.lng,
    source: 'google-maps-link',
  };
}

function extractCoordsFromMapUrl(parsedUrl) {
  if (!parsedUrl) return null;
  const source = parsedUrl.toString();

  let match = source.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (match) return { lat: Number(match[1]), lng: Number(match[2]) };

  match = source.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (match) return { lat: Number(match[1]), lng: Number(match[2]) };

  for (const key of ['q', 'query', 'destination', 'origin', 'center', 'll']) {
    const value = parsedUrl.searchParams.get(key);
    if (!value) continue;
    const pair = value.match(/(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
    if (pair) return { lat: Number(pair[1]), lng: Number(pair[2]) };
  }

  return null;
}

function extractMapName(parsedUrl) {
  if (!parsedUrl) return '';
  const parts = parsedUrl.pathname.split('/').filter(Boolean);
  const placeIndex = parts.findIndex((part) => part === 'place');
  if (placeIndex >= 0 && parts[placeIndex + 1]) {
    return decodeURIComponent(parts[placeIndex + 1]).replace(/\+/g, ' ').trim();
  }
  const q = parsedUrl.searchParams.get('q') || parsedUrl.searchParams.get('query');
  if (q && !/^-?\d+\.\d+\s*,\s*-?\d+\.\d+$/.test(q)) return q.trim();
  return '';
}

function extractQueryText(parsedUrl) {
  if (!parsedUrl) return '';
  for (const key of ['q', 'query', 'destination']) {
    const value = parsedUrl.searchParams.get(key);
    if (value && !/^-?\d+\.\d+\s*,\s*-?\d+\.\d+$/.test(value)) return value.trim();
  }
  return '';
}

function safeParseUrl(value) {
  try {
    return new URL(value);
  } catch (error) {
    return null;
  }
}


function defaultStore() {
  return {
    adminNotes: {},
    customRestaurants: {},
    recommendedRestaurants: {},
    suggestedPlaces: {},
    themePlaces: {},
    themeTemplates: {},
    contentPosts: {},
    communityPosts: {},
    users: {},
    usernames: {},
    updatedAt: new Date().toISOString(),
  };
}

function ensureStoreShape(value) {
  const base = defaultStore();
  const raw = value && typeof value === 'object' ? value : {};
  base.adminNotes = raw.adminNotes && typeof raw.adminNotes === 'object' ? raw.adminNotes : {};
  base.customRestaurants = raw.customRestaurants && typeof raw.customRestaurants === 'object' ? raw.customRestaurants : {};
  base.recommendedRestaurants = raw.recommendedRestaurants && typeof raw.recommendedRestaurants === 'object' ? raw.recommendedRestaurants : {};
  base.suggestedPlaces = raw.suggestedPlaces && typeof raw.suggestedPlaces === 'object' ? raw.suggestedPlaces : {};
  base.themePlaces = raw.themePlaces && typeof raw.themePlaces === 'object' ? raw.themePlaces : {};
  base.themeTemplates = raw.themeTemplates && typeof raw.themeTemplates === 'object' ? raw.themeTemplates : {};
  base.contentPosts = raw.contentPosts && typeof raw.contentPosts === 'object' ? raw.contentPosts : {};
  base.communityPosts = raw.communityPosts && typeof raw.communityPosts === 'object' ? raw.communityPosts : {};
  base.users = raw.users && typeof raw.users === 'object' ? raw.users : {};
  base.usernames = raw.usernames && typeof raw.usernames === 'object' ? raw.usernames : {};
  base.updatedAt = raw.updatedAt || base.updatedAt;
  return base;
}


async function ensureStoreReady() {
  if (STORE_CACHE) return STORE_CACHE;
  if (!STORE_INIT_PROMISE) {
    STORE_INIT_PROMISE = initializeStore();
  }
  return STORE_INIT_PROMISE;
}

async function initializeStore() {
  const loaded = await loadStoreFromBackend();
  STORE_CACHE = ensureStoreShape(loaded);
  return STORE_CACHE;
}

async function loadStoreFromBackend() {
  if (STORAGE_BACKEND === 'supabase' && supabase) {
    try {
      const { data, error } = await supabase
        .from(SUPABASE_TABLE)
        .select('data')
        .eq('key', SUPABASE_STORE_KEY)
        .maybeSingle();
      if (error) {
        console.error('Supabase load error:', error);
        return defaultStore();
      }
      if (!data || !data.data) {
        const initial = defaultStore();
        await persistStoreToBackend(initial);
        return initial;
      }
      return ensureStoreShape(data.data);
    } catch (error) {
      console.error('Supabase load exception:', error);
      return defaultStore();
    }
  }

  try {
    if (!fs.existsSync(DATA_FILE_PATH)) return defaultStore();
    const raw = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    return ensureStoreShape(raw ? JSON.parse(raw) : {});
  } catch (error) {
    console.error('Failed to load store:', error);
    return defaultStore();
  }
}

async function persistStoreToBackend(store) {
  const next = ensureStoreShape(store);
  next.updatedAt = new Date().toISOString();

  if (STORAGE_BACKEND === 'supabase' && supabase) {
    const payload = {
      key: SUPABASE_STORE_KEY,
      data: next,
      updated_at: next.updatedAt,
    };
    const { error } = await supabase.from(SUPABASE_TABLE).upsert(payload, { onConflict: 'key' });
    if (error) {
      throw error;
    }
    return next;
  }

  fs.mkdirSync(path.dirname(DATA_FILE_PATH), { recursive: true });
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(next, null, 2), 'utf8');
  return next;
}

function loadStore() {
  return ensureStoreShape(STORE_CACHE || defaultStore());
}

function saveStore(store) {
  const next = ensureStoreShape(store);
  next.updatedAt = new Date().toISOString();
  STORE_CACHE = next;
  STORE_SAVE_QUEUE = STORE_SAVE_QUEUE
    .then(() => persistStoreToBackend(next))
    .catch((error) => {
      console.error('Failed to persist store:', error);
    });
  return next;
}

async function flushStoreSave() {
  try {
    await STORE_SAVE_QUEUE;
  } catch (error) {
    console.error('flushStoreSave error:', error);
  }
}

function summarizeStore(store) {
  const safe = ensureStoreShape(store);
  return {
    adminNotes: safe.adminNotes,
    customRestaurants: Object.values(safe.customRestaurants || {}),
    recommendedRestaurants: Object.values(safe.recommendedRestaurants || {}),
    suggestedPlaces: safe.suggestedPlaces || {},
    themePlaces: Object.values(safe.themePlaces || {}).sort((a, b) => String(a.regionKo || a.regionOriginal || '').localeCompare(String(b.regionKo || b.regionOriginal || '')) || String(a.nameKo || a.nameOriginal || '').localeCompare(String(b.nameKo || b.nameOriginal || ''))),
    themeTemplates: Object.values(safe.themeTemplates || {}).sort((a, b) => String(a.regionKo || a.regionOriginal || '').localeCompare(String(b.regionKo || b.regionOriginal || '')) || String(a.title || '').localeCompare(String(b.title || ''))),
    contentPosts: Object.values(safe.contentPosts || {}).sort((a, b) => String(b.updatedAt || b.createdAt || '').localeCompare(String(a.updatedAt || a.createdAt || ''))),
    communityPosts: Object.values(safe.communityPosts || {}).sort((a, b) => String(b.updatedAt || b.createdAt || '').localeCompare(String(a.updatedAt || a.createdAt || ''))),
    updatedAt: safe.updatedAt,
    dataFilePath: DATA_FILE_PATH,
  };
}


function sanitizeRecommendedRestaurant(restaurant) {
  if (!restaurant || typeof restaurant !== 'object') return null;
  return {
    id: String(restaurant.id || '').trim(),
    source: String(restaurant.source || 'recommended-admin').trim() || 'recommended-admin',
    customRegistered: Boolean(restaurant.customRegistered),
    nameOriginal: String(restaurant.nameOriginal || '').trim(),
    nameKo: String(restaurant.nameKo || '').trim(),
    regionOriginal: String(restaurant.regionOriginal || '').trim(),
    regionKo: String(restaurant.regionKo || '').trim(),
    areaOriginal: String(restaurant.areaOriginal || '').trim(),
    areaKo: String(restaurant.areaKo || '').trim(),
    addressOriginal: String(restaurant.addressOriginal || '').trim(),
    addressKo: String(restaurant.addressKo || '').trim(),
    lat: Number(restaurant.lat || 0),
    lng: Number(restaurant.lng || 0),
    genreOriginal: String(restaurant.genreOriginal || '').trim(),
    genreKo: String(restaurant.genreKo || '').trim(),
    subGenreOriginal: String(restaurant.subGenreOriginal || '').trim(),
    subGenreKo: String(restaurant.subGenreKo || '').trim(),
    accessOriginal: String(restaurant.accessOriginal || '').trim(),
    accessKo: String(restaurant.accessKo || '').trim(),
    catchCopyOriginal: String(restaurant.catchCopyOriginal || '').trim(),
    catchCopyKo: String(restaurant.catchCopyKo || '').trim(),
    openOriginal: String(restaurant.openOriginal || '').trim(),
    openKo: String(restaurant.openKo || '').trim(),
    closeOriginal: String(restaurant.closeOriginal || '').trim(),
    closeKo: String(restaurant.closeKo || '').trim(),
    budgetOriginal: String(restaurant.budgetOriginal || '').trim(),
    budgetKo: String(restaurant.budgetKo || '').trim(),
    stationNameOriginal: String(restaurant.stationNameOriginal || '').trim(),
    stationNameKo: String(restaurant.stationNameKo || '').trim(),
    url: String(restaurant.url || '').trim(),
    reservationUrl: String(restaurant.reservationUrl || '').trim(),
    photo: String(restaurant.photo || '').trim(),
    wifi: String(restaurant.wifi || '').trim(),
    englishMenu: String(restaurant.englishMenu || '').trim(),
    card: String(restaurant.card || '').trim(),
    noSmoking: String(restaurant.noSmoking || '').trim(),
    privateRoom: String(restaurant.privateRoom || '').trim(),
    kids: String(restaurant.kids || '').trim(),
    lunch: String(restaurant.lunch || '').trim(),
    lateNight: String(restaurant.lateNight || '').trim(),
    pet: String(restaurant.pet || '').trim(),
    signatureMenu: String(restaurant.signatureMenu || '').trim(),
    searchText: String(restaurant.searchText || '').trim(),
  };
}

async function fetchRestaurantById(restaurantId) {
  if (!HOTPEPPER_API_KEY || !restaurantId) return null;
  const hp = new URL('https://webservice.recruit.co.jp/hotpepper/gourmet/v1/');
  hp.searchParams.set('key', HOTPEPPER_API_KEY);
  hp.searchParams.set('format', 'json');
  hp.searchParams.set('id', restaurantId);
  hp.searchParams.set('count', '1');
  const response = await fetch(hp, {
    headers: { 'User-Agent': 'HankkiRouteJapan/1.1', 'Accept': 'application/json' },
  });
  if (!response.ok) return null;
  const json = await response.json();
  const shops = Array.isArray(json?.results?.shop) ? json.results.shop : [];
  if (!shops.length) return null;
  return sanitizeRecommendedRestaurant(mapShop(shops[0]));
}


function sanitizeRoutePlace(place) {
  if (!place || typeof place !== 'object') return null;
  return {
    id: String(place.id || '').trim() || ('place-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)),
    nameKo: String(place.nameKo || place.displayNameKo || '').trim(),
    nameOriginal: String(place.nameOriginal || place.displayNameOriginal || '').trim(),
    displayNameKo: String(place.displayNameKo || place.nameKo || '').trim(),
    displayNameOriginal: String(place.displayNameOriginal || place.nameOriginal || '').trim(),
    regionKo: String(place.regionKo || '').trim(),
    regionOriginal: String(place.regionOriginal || '').trim(),
    areaKo: String(place.areaKo || '').trim(),
    areaOriginal: String(place.areaOriginal || '').trim(),
    themes: Array.isArray(place.themes) ? place.themes.map((item) => String(item || '').trim()).filter(Boolean) : String(place.themes || '').split(',').map((item) => item.trim()).filter(Boolean),
    lat: Number(place.lat || 0),
    lng: Number(place.lng || 0),
    mapLink: String(place.mapLink || place.url || '').trim(),
    imageUrl: String(place.imageUrl || '').trim(),
    description: String(place.description || '').trim(),
    query: String(place.query || place.nameOriginal || place.nameKo || '').trim(),
  };
}

function sanitizeThemeTemplate(template) {
  if (!template || typeof template !== 'object') return null;
  return {
    id: String(template.id || '').trim() || ('template-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)),
    title: String(template.title || '').trim(),
    regionKo: String(template.regionKo || '').trim(),
    regionOriginal: String(template.regionOriginal || '').trim(),
    description: String(template.description || '').trim(),
    themes: Array.isArray(template.themes) ? template.themes.map((item) => String(item || '').trim()).filter(Boolean) : String(template.themes || '').split(',').map((item) => item.trim()).filter(Boolean),
    wantedFoods: Array.isArray(template.wantedFoods) ? template.wantedFoods.map((item) => String(item || '').trim()).filter(Boolean) : String(template.wantedFoods || '').split(',').map((item) => item.trim()).filter(Boolean),
    placeIds: Array.isArray(template.placeIds) ? template.placeIds.map((item) => String(item || '').trim()).filter(Boolean) : [],
    createdAt: String(template.createdAt || '').trim() || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function sanitizeContentPost(post) {
  if (!post || typeof post !== 'object') return null;
  return {
    id: String(post.id || '').trim() || ('content-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)),
    title: String(post.title || '').trim(),
    category: String(post.category || '').trim(),
    summary: String(post.summary || '').trim(),
    body: String(post.body || '').trim(),
    regionKo: String(post.regionKo || '').trim(),
    regionOriginal: String(post.regionOriginal || '').trim(),
    coverImage: String(post.coverImage || '').trim(),
    themes: Array.isArray(post.themes) ? post.themes.map((item) => String(item || '').trim()).filter(Boolean) : String(post.themes || '').split(',').map((item) => item.trim()).filter(Boolean),
    routePlaces: Array.isArray(post.routePlaces) ? post.routePlaces.map(sanitizeRoutePlace).filter(Boolean) : [],
    createdAt: String(post.createdAt || '').trim() || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: 'admin',
  };
}

function sanitizeCommunityPost(post) {
  if (!post || typeof post !== 'object') return null;
  return {
    id: String(post.id || '').trim() || ('community-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)),
    nickname: String(post.nickname || '익명').trim() || '익명',
    title: String(post.title || '').trim(),
    body: String(post.body || '').trim(),
    regionKo: String(post.regionKo || '').trim(),
    regionOriginal: String(post.regionOriginal || '').trim(),
    themes: Array.isArray(post.themes) ? post.themes.map((item) => String(item || '').trim()).filter(Boolean) : String(post.themes || '').split(',').map((item) => item.trim()).filter(Boolean),
    routePlaces: Array.isArray(post.routePlaces) ? post.routePlaces.map(sanitizeRoutePlace).filter(Boolean) : [],
    createdAt: String(post.createdAt || '').trim() || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    author: 'community',
    authorEmail: String(post.authorEmail || '').trim().toLowerCase(),
    authorId: String(post.authorId || '').trim(),
    authorRole: String(post.authorRole || 'user').trim() || 'user',
  };
}


function sanitizeUserAccount(user) {
  if (!user || typeof user !== 'object') return null;
  const email = String(user.email || '').trim().toLowerCase();
  if (!email) return null;
  return {
    id: String(user.id || ('user-' + Math.random().toString(36).slice(2, 10))).trim(),
    email,
    password: String(user.password || '').trim(),
    username: String(user.username || user.handle || email.split('@')[0] || '').trim().toLowerCase(),
    nickname: String(user.nickname || user.username || email.split('@')[0] || '여행자').trim() || '여행자',
    role: String(user.role || 'user').trim() || 'user',
    createdAt: String(user.createdAt || '').trim() || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function publicUser(user) {
  if (!user) return null;
  return {
    id: String(user.id || '').trim(),
    email: String(user.email || '').trim(),
    username: String(user.username || '').trim(),
    nickname: String(user.nickname || '').trim(),
    role: String(user.role || 'user').trim() || 'user',
  };
}

async function handleAuthSignup(req, res) {
  const body = await readJsonBody(req);
  const email = String(body?.email || '').trim().toLowerCase();
  const username = String(body?.username || body?.id || '').trim().toLowerCase();
  const password = String(body?.password || '').trim();
  let nickname = String(body?.nickname || '').trim();
  if (!email || !username || !password) {
    return sendJson(res, 400, { ok: false, error: 'missing_fields', message: '이메일, 아이디, 비밀번호를 입력해 주세요.' });
  }
  if (email === 'admin' || username === 'admin') {
    return sendJson(res, 400, { ok: false, error: 'reserved_identifier', message: '사용할 수 없는 아이디입니다.' });
  }
  if (!nickname) nickname = username || email.split('@')[0] || '여행자';
  const store = loadStore();
  store.users = store.users || {};
  store.usernames = store.usernames || {};
  if ((store.users && store.users[email]) || (store.usernames && store.usernames[username])) {
    return sendJson(res, 409, { ok: false, error: 'already_exists', message: '이미 존재하는 이메일 또는 아이디입니다.' });
  }
  const user = sanitizeUserAccount({ email, username, password, nickname, role: 'user' });
  store.users[email] = user;
  store.usernames[username] = email;
  saveStore(store);
  await flushStoreSave();
  return sendJson(res, 200, { ok: true, user: publicUser(user), ...summarizeStore(loadStore()) });
}

async function handleAuthLogin(req, res) {
  const body = await readJsonBody(req);
  const identifier = String(body?.email || body?.identifier || body?.username || '').trim().toLowerCase();
  const password = String(body?.password || '').trim();
  if (!identifier || !password) {
    return sendJson(res, 400, { ok: false, error: 'missing_fields', message: '이메일 또는 아이디와 비밀번호를 입력해 주세요.' });
  }
  if (identifier === 'admin' && password === 'admin') {
    return sendJson(res, 200, { ok: true, user: { id: 'admin', email: 'admin', username: 'admin', nickname: '관리자', role: 'admin' } });
  }
  const store = loadStore();
  const email = (store.usernames && store.usernames[identifier]) || identifier;
  let user = store.users[email];
  if (!user) {
    user = Object.values(store.users || {}).find((item) => String(item.username || '').trim().toLowerCase() === identifier) || null;
  }
  if (!user || String(user.password || '') !== password) {
    return sendJson(res, 401, { ok: false, error: 'invalid_credentials', message: '이메일 또는 아이디, 비밀번호를 확인해 주세요.' });
  }
  return sendJson(res, 200, { ok: true, user: publicUser(user) });
}

async function handleCommunityPostDelete(req, res) {
  const body = await readJsonBody(req);
  const postId = String(body?.postId || '').trim();
  const actorEmail = String(body?.actor?.email || '').trim().toLowerCase();
  const actorRole = String(body?.actor?.role || 'user').trim() || 'user';
  if (!postId) return sendJson(res, 400, { ok: false, error: 'missing_post_id' });
  const store = loadStore();
  const post = store.communityPosts[postId];
  if (!post) return sendJson(res, 404, { ok: false, error: 'not_found' });
  const allowed = actorRole === 'admin' || (actorEmail && actorEmail === String(post.authorEmail || '').trim().toLowerCase());
  if (!allowed) return sendJson(res, 403, { ok: false, error: 'forbidden', message: '본인 글만 삭제할 수 있습니다.' });
  delete store.communityPosts[postId];
  saveStore(store);
  return sendJson(res, 200, { ok: true, ...summarizeStore(store) });
}

async function handleAdminThemePlace(req, res) {
  const body = await readJsonBody(req);
  const place = sanitizeRoutePlace(body?.place);
  if (!place || !(place.nameKo || place.nameOriginal || place.query)) {
    return sendJson(res, 400, { ok: false, error: 'missing_place' });
  }
  const store = loadStore();
  store.themePlaces[place.id] = Object.assign({}, place, { createdAt: store.themePlaces[place.id]?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() });
  saveStore(store);
  return sendJson(res, 200, { ok: true, place: store.themePlaces[place.id], ...summarizeStore(store) });
}

async function handleAdminThemeTemplate(req, res) {
  const body = await readJsonBody(req);
  const template = sanitizeThemeTemplate(body?.template);
  if (!template || !template.title || !template.placeIds.length) {
    return sendJson(res, 400, { ok: false, error: 'missing_template' });
  }
  const store = loadStore();
  store.themeTemplates[template.id] = template;
  saveStore(store);
  return sendJson(res, 200, { ok: true, template: store.themeTemplates[template.id], ...summarizeStore(store) });
}

async function handleAdminContentPost(req, res) {
  const body = await readJsonBody(req);
  const post = sanitizeContentPost(body?.post);
  if (!post || !post.title || !post.routePlaces.length) {
    return sendJson(res, 400, { ok: false, error: 'missing_post' });
  }
  const store = loadStore();
  store.contentPosts[post.id] = post;
  saveStore(store);
  return sendJson(res, 200, { ok: true, post: store.contentPosts[post.id], ...summarizeStore(store) });
}

async function handleCommunityPost(req, res) {
  const body = await readJsonBody(req);
  const post = sanitizeCommunityPost(body?.post);
  if (!post || !post.title || !post.body) {
    return sendJson(res, 400, { ok: false, error: 'missing_post' });
  }
  const store = loadStore();
  store.communityPosts[post.id] = post;
  saveStore(store);
  return sendJson(res, 200, { ok: true, post: store.communityPosts[post.id], ...summarizeStore(store) });
}

async function hydrateMissingRecommendedRestaurants(store) {
  const safe = ensureStoreShape(store);
  const missingIds = Object.keys(safe.adminNotes || {}).filter((id) => {
    if (!id) return false;
    if (safe.recommendedRestaurants && safe.recommendedRestaurants[id]) return false;
    return true;
  });
  if (!missingIds.length) return safe;
  let changed = false;
  for (const id of missingIds) {
    if (safe.customRestaurants && safe.customRestaurants[id]) {
      safe.recommendedRestaurants[id] = sanitizeRecommendedRestaurant(safe.customRestaurants[id]);
      changed = true;
      continue;
    }
    const fetched = await fetchRestaurantById(id);
    if (fetched) {
      safe.recommendedRestaurants[id] = fetched;
      changed = true;
    }
  }
  if (changed) return saveStore(safe);
  return safe;
}

async function handleStorePublic(res) {
  const store = await hydrateMissingRecommendedRestaurants(await ensureStoreReady());
  return sendJson(res, 200, { ok: true, ...summarizeStore(store) });
}

async function handleAdminRecommend(req, res) {
  const body = await readJsonBody(req);
  const restaurantId = String(body?.restaurantId || '').trim();
  const reason = String(body?.reason || '').trim();
  if (!restaurantId || !reason) {
    return sendJson(res, 400, { ok: false, error: 'missing_fields' });
  }
  const store = loadStore();
  store.adminNotes[restaurantId] = reason;
  const snapshot = sanitizeRecommendedRestaurant(body?.restaurant);
  if (snapshot && snapshot.id) {
    store.recommendedRestaurants[restaurantId] = snapshot;
  } else if (store.customRestaurants && store.customRestaurants[restaurantId]) {
    store.recommendedRestaurants[restaurantId] = sanitizeRecommendedRestaurant(store.customRestaurants[restaurantId]);
  }
  saveStore(store);
  return sendJson(res, 200, { ok: true, ...summarizeStore(store) });
}

async function handleAdminRecommendRemove(req, res) {
  const body = await readJsonBody(req);
  const restaurantId = String(body?.restaurantId || '').trim();
  if (!restaurantId) {
    return sendJson(res, 400, { ok: false, error: 'missing_fields' });
  }
  const store = loadStore();
  delete store.adminNotes[restaurantId];
  if (store.recommendedRestaurants) delete store.recommendedRestaurants[restaurantId];
  saveStore(store);
  return sendJson(res, 200, { ok: true, ...summarizeStore(store) });
}

async function handleAdminCustomRestaurant(req, res) {
  const body = await readJsonBody(req);
  const restaurant = body?.restaurant && typeof body.restaurant === 'object' ? body.restaurant : null;
  if (!restaurant) {
    return sendJson(res, 400, { ok: false, error: 'missing_restaurant' });
  }
  const id = String(restaurant.id || '').trim() || 'custom-' + Date.now();
  const nameOriginal = String(restaurant.nameOriginal || '').trim();
  const nameKo = String(restaurant.nameKo || '').trim() || nameOriginal;
  const genreKo = String(restaurant.genreKo || '').trim();
  const store = loadStore();
  store.customRestaurants[id] = {
    id,
    source: 'custom-admin',
    customRegistered: true,
    nameOriginal,
    nameKo,
    regionOriginal: String(restaurant.regionOriginal || '').trim(),
    regionKo: String(restaurant.regionKo || '').trim(),
    areaOriginal: String(restaurant.areaOriginal || '').trim(),
    areaKo: String(restaurant.areaKo || '').trim(),
    addressOriginal: String(restaurant.addressOriginal || '').trim(),
    addressKo: String(restaurant.addressKo || '').trim(),
    lat: Number(restaurant.lat || 0),
    lng: Number(restaurant.lng || 0),
    genreOriginal: String(restaurant.genreOriginal || genreKo).trim(),
    genreKo,
    subGenreOriginal: String(restaurant.subGenreOriginal || '').trim(),
    subGenreKo: String(restaurant.subGenreKo || '').trim(),
    accessOriginal: String(restaurant.accessOriginal || '').trim(),
    accessKo: String(restaurant.accessKo || '').trim(),
    catchCopyOriginal: String(restaurant.catchCopyOriginal || '').trim(),
    catchCopyKo: String(restaurant.catchCopyKo || '').trim(),
    openOriginal: String(restaurant.openOriginal || '').trim(),
    openKo: String(restaurant.openKo || '').trim(),
    closeOriginal: String(restaurant.closeOriginal || '').trim(),
    closeKo: String(restaurant.closeKo || '').trim(),
    budgetOriginal: String(restaurant.budgetOriginal || '').trim(),
    budgetKo: String(restaurant.budgetKo || '').trim(),
    stationNameOriginal: String(restaurant.stationNameOriginal || '').trim(),
    stationNameKo: String(restaurant.stationNameKo || '').trim(),
    url: String(restaurant.url || '').trim(),
    reservationUrl: String(restaurant.reservationUrl || '').trim(),
    photo: String(restaurant.photo || '').trim(),
    wifi: Boolean(restaurant.wifi),
    englishMenu: Boolean(restaurant.englishMenu),
    card: Boolean(restaurant.card),
    noSmoking: Boolean(restaurant.noSmoking),
    privateRoom: Boolean(restaurant.privateRoom),
    kids: Boolean(restaurant.kids),
    lunch: Boolean(restaurant.lunch),
    lateNight: Boolean(restaurant.lateNight),
    pet: Boolean(restaurant.pet),
    signatureMenu: String(restaurant.signatureMenu || '').trim(),
    searchText: String(restaurant.searchText || [nameOriginal, nameKo, genreKo, restaurant.regionKo, restaurant.areaKo, restaurant.signatureMenu].filter(Boolean).join(' | ')).trim(),
  };
  saveStore(store);
  return sendJson(res, 200, { ok: true, restaurant: store.customRestaurants[id], ...summarizeStore(store) });
}

async function handleAdminCustomRestaurantDelete(req, res) {
  const body = await readJsonBody(req);
  const restaurantId = String(body?.restaurantId || '').trim();
  if (!restaurantId) {
    return sendJson(res, 400, { ok: false, error: 'missing_fields' });
  }
  const store = loadStore();
  delete store.customRestaurants[restaurantId];
  delete store.adminNotes[restaurantId];
  if (store.recommendedRestaurants) delete store.recommendedRestaurants[restaurantId];
  saveStore(store);
  return sendJson(res, 200, { ok: true, ...summarizeStore(store) });
}

async function handleStoreCachePlaces(req, res) {
  const body = await readJsonBody(req);
  const region = String(body?.region || '').trim();
  const source = String(body?.source || 'user').trim() || 'user';
  const places = Array.isArray(body?.places) ? body.places : [];
  if (!region || !places.length) {
    return sendJson(res, 400, { ok: false, error: 'missing_fields' });
  }
  const store = loadStore();
  const existing = Array.isArray(store.suggestedPlaces[region]) ? store.suggestedPlaces[region] : [];
  const merged = [...existing];
  const seen = new Set(existing.map((item) => normalize([item.query, item.nameOriginal, item.nameKo].filter(Boolean).join(' '))));
  for (const raw of places) {
    if (!raw || typeof raw !== 'object') continue;
    const row = {
      nameKo: String(raw.nameKo || '').trim(),
      nameOriginal: String(raw.nameOriginal || '').trim(),
      displayNameKo: String(raw.displayNameKo || raw.nameKo || '').trim(),
      displayNameOriginal: String(raw.displayNameOriginal || raw.nameOriginal || '').trim(),
      query: String(raw.query || raw.nameOriginal || raw.nameKo || '').trim(),
      area: String(raw.area || '').trim(),
      lat: Number(raw.lat || 0),
      lng: Number(raw.lng || 0),
      source,
      savedAt: new Date().toISOString(),
    };
    const key = normalize([row.query, row.nameOriginal, row.nameKo].filter(Boolean).join(' '));
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push(row);
  }
  store.suggestedPlaces[region] = merged.slice(0, 120);
  saveStore(store);
  return sendJson(res, 200, { ok: true, region, places: store.suggestedPlaces[region], ...summarizeStore(store) });
}

async function handleAiSuggestPlaces(req, res) {
  if (!GEMINI_API_KEY) {
    return sendJson(res, 400, { ok: false, error: 'gemini_not_configured' });
  }

  const body = await readJsonBody(req);
  const region = String(body?.region || '').trim();
  const existingPlaces = Array.isArray(body?.existingPlaces)
    ? body.existingPlaces.slice(0, 30).map((item) => String(item || '').trim()).filter(Boolean)
    : [];
  const neededCount = clamp(parseInt(body?.neededCount || '4', 10), 1, 12);
  if (!region) {
    return sendJson(res, 400, { ok: false, error: 'missing_region' });
  }

  const prompt = [
    '당신은 한국 여행자를 위한 일본 여행지 추천 도우미입니다.',
    '반드시 JSON만 반환하세요.',
    'JSON 형식: {"overview":"짧은 설명","places":[{"nameKo":"...","nameOriginal":"...","query":"일본어 또는 일본 지역명 포함 검색문","area":"세부 지역"}]}',
    '사용자가 이미 넣은 장소와 겹치지 않게 추천하세요.',
    '입력한 지역 안에서만 추천하세요. 다른 도시는 절대 섞지 마세요.',
    '관광객이 많이 가는 대표 장소 위주로 추천하세요.',
    'place 개수는 정확히 ' + String(neededCount) + '개에 가깝게 반환하세요.',
    '입력 정보:',
    JSON.stringify({ region, existingPlaces, neededCount }),
  ].join(String.fromCharCode(10));

  let gemini;
  try {
    gemini = await callGeminiWithFallback(prompt, { temperature: 0.4 });
  } catch (error) {
    return sendJson(res, 502, { ok: false, error: 'gemini_request_failed', detail: String(error.message || error).slice(0, 400) });
  }

  const parsed = safeParseModelJson(gemini.text);
  if (!parsed) {
    return sendJson(res, 502, { ok: false, error: 'gemini_invalid_json' });
  }

  const places = Array.isArray(parsed.places) ? parsed.places.map((item) => ({
    nameKo: String(item.nameKo || '').trim(),
    nameOriginal: String(item.nameOriginal || '').trim(),
    query: String(item.query || item.nameOriginal || item.nameKo || '').trim(),
    area: String(item.area || '').trim(),
  })).filter((item) => item.query || item.nameOriginal || item.nameKo) : [];

  const store = loadStore();
  const existing = Array.isArray(store.suggestedPlaces[region]) ? store.suggestedPlaces[region] : [];
  const seen = new Set(existing.map((item) => normalize([item.query, item.nameOriginal, item.nameKo].filter(Boolean).join(' '))));
  const merged = [...existing];
  for (const place of places) {
    const key = normalize([place.query, place.nameOriginal, place.nameKo].filter(Boolean).join(' '));
    if (!key || seen.has(key)) continue;
    seen.add(key);
    merged.push({ ...place, source: 'gemini', savedAt: new Date().toISOString() });
  }
  store.suggestedPlaces[region] = merged.slice(0, 120);
  saveStore(store);

  return sendJson(res, 200, {
    ok: true,
    model: gemini.model,
    overview: String(parsed.overview || '').trim(),
    places,
    suggestedPlaces: store.suggestedPlaces[region],
  });
}

function buildGeminiGenerationConfig(model, generationConfig) {
  const config = { ...(generationConfig || {}) };
  const thinkingConfig = { ...(config.thinkingConfig || {}) };
  if (/^gemini-3/i.test(model)) {
    if (!thinkingConfig.thinkingLevel) thinkingConfig.thinkingLevel = 'minimal';
  } else if (/^gemini-2\.5/i.test(model)) {
    if (typeof thinkingConfig.thinkingBudget !== 'number') thinkingConfig.thinkingBudget = 0;
  }
  if (Object.keys(thinkingConfig).length) config.thinkingConfig = thinkingConfig;
  if (typeof config.temperature !== 'number') config.temperature = 0.35;
  return config;
}

async function callGeminiWithFallback(prompt, generationConfig) {
  if (!GEMINI_API_KEY) {
    throw new Error('gemini_not_configured');
  }
  let lastError = new Error('gemini_request_failed');
  for (const model of GEMINI_MODEL_CANDIDATES) {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const finalConfig = buildGeminiGenerationConfig(model, generationConfig);
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'x-goog-api-key': GEMINI_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: finalConfig,
        }),
      });
      if (!response.ok) {
        const detail = await response.text().catch(() => '');
        lastError = new Error(detail || `model_failed:${model}`);
        if (response.status === 401 || response.status === 403) break;
        continue;
      }
      const json = await response.json();
      const text = extractGeminiText(json);
      if (!text) {
        lastError = new Error(`empty_response:${model}`);
        continue;
      }
      return { model, text, raw: json };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

async function geocodeJapanQuery(q) {
  const geo = new URL('https://nominatim.openstreetmap.org/search');
  geo.searchParams.set('format', 'jsonv2');
  geo.searchParams.set('limit', '1');
  geo.searchParams.set('countrycodes', 'jp');
  geo.searchParams.set('q', q);

  const response = await fetch(geo, {
    headers: {
      'User-Agent': 'HankkiRouteJapan/1.4',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) return null;
  const json = await response.json();
  const top = Array.isArray(json) ? json[0] : null;
  if (!top) return null;

  const nameOriginal = String(top.name || String(top.display_name || '').split(',')[0] || q).trim();
  const displayNameOriginal = String(top.display_name || nameOriginal).trim();
  return {
    nameKo: localizeLoose(nameOriginal),
    nameOriginal,
    displayNameKo: localizeLoose(displayNameOriginal),
    displayNameOriginal,
    lat: Number(top.lat || 0),
    lng: Number(top.lon || 0),
  };
}

async function handleSearch(url, res) {
  if (!HOTPEPPER_API_KEY) {
    return sendJson(res, 200, { ok: true, source: 'demo-fallback', results: [] });
  }

  const keyword = String(url.searchParams.get('keyword') || '').trim();
  const lat = String(url.searchParams.get('lat') || '').trim();
  const lng = String(url.searchParams.get('lng') || '').trim();
  const range = clamp(parseInt(url.searchParams.get('range') || '4', 10), 1, 5);
  const count = clamp(parseInt(url.searchParams.get('count') || '50', 10), 1, 100);
  const start = clamp(parseInt(url.searchParams.get('start') || '1', 10), 1, 1000);

  const hp = new URL('https://webservice.recruit.co.jp/hotpepper/gourmet/v1/');
  hp.searchParams.set('key', HOTPEPPER_API_KEY);
  hp.searchParams.set('format', 'json');
  hp.searchParams.set('count', String(count));
  hp.searchParams.set('start', String(start));
  hp.searchParams.set('order', '4');
  if (keyword) hp.searchParams.set('keyword', keyword);
  if (lat && lng) {
    hp.searchParams.set('lat', lat);
    hp.searchParams.set('lng', lng);
    hp.searchParams.set('range', String(range));
  }

  const response = await fetch(hp, {
    headers: {
      'User-Agent': 'HankkiRouteJapan/1.1',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    return sendJson(res, response.status, { ok: false, error: 'hotpepper_failed' });
  }

  const json = await response.json();
  const shops = Array.isArray(json?.results?.shop) ? json.results.shop : [];
  const results = shops.map(mapShop);
  return sendJson(res, 200, { ok: true, source: 'hotpepper', results, count: results.length });
}

function mapShop(shop) {
  const genreOriginal = shop.genre?.name || '';
  const subGenreOriginal = shop.sub_genre?.name || '';
  const addressOriginal = shop.address || '';
  const openOriginal = shop.open || '';
  const closeOriginal = shop.close || '';
  const accessOriginal = shop.access || shop.mobile_access || '';
  const catchOriginal = shop.catch || shop.genre?.catch || '';
  const budgetOriginal = shop.budget?.average || shop.budget?.name || '';

  return {
    id: String(shop.id || ''),
    nameOriginal: String(shop.name || '').trim(),
    nameKo: localizeShopName(shop.name || ''),
    regionOriginal: String(shop.large_area?.name || '').trim(),
    regionKo: localizeLoose(shop.large_area?.name || ''),
    areaOriginal: String(shop.middle_area?.name || shop.small_area?.name || shop.station_name || '').trim(),
    areaKo: localizeLoose(shop.middle_area?.name || shop.small_area?.name || shop.station_name || ''),
    addressOriginal,
    addressKo: localizeLoose(addressOriginal),
    lat: Number(shop.lat || 0),
    lng: Number(shop.lng || 0),
    genreOriginal,
    genreKo: localizeGenre(genreOriginal),
    subGenreOriginal,
    subGenreKo: localizeGenre(subGenreOriginal),
    accessOriginal,
    accessKo: localizeLoose(accessOriginal),
    catchCopyOriginal: catchOriginal,
    catchCopyKo: localizeLoose(catchOriginal),
    openOriginal,
    openKo: localizeLoose(openOriginal),
    closeOriginal,
    closeKo: localizeLoose(closeOriginal),
    budgetOriginal,
    budgetKo: localizeLoose(budgetOriginal),
    stationNameOriginal: String(shop.station_name || '').trim(),
    stationNameKo: localizeLoose(shop.station_name || ''),
    url: shop.urls?.pc || shop.urls?.mobile || '',
    photo: shop.photo?.pc?.l || shop.photo?.pc?.m || shop.photo?.mobile?.l || '',
    wifi: normalizeFlag(shop.wifi),
    englishMenu: normalizeFlag(shop.english),
    card: normalizeFlag(shop.card),
    noSmoking: normalizeFlag(shop.non_smoking),
    privateRoom: normalizeFlag(shop.private_room),
    kids: normalizeFlag(shop.child),
    lunch: normalizeFlag(shop.lunch),
    lateNight: normalizeFlag(shop.midnight),
    pet: normalizeFlag(shop.pet),
    signatureMenu: inferSignatureMenu(shop),
    searchText: [
      shop.name,
      genreOriginal,
      subGenreOriginal,
      catchOriginal,
      accessOriginal,
      addressOriginal,
      inferSignatureMenu(shop),
      localizeLoose(shop.name || ''),
      localizeGenre(genreOriginal),
      localizeGenre(subGenreOriginal),
      localizeLoose(catchOriginal),
    ].filter(Boolean).join(' | '),
  };
}

function localizeGenre(text) {
  const source = String(text || '').trim();
  if (!source) return '';
  const pieces = source.split(/[\/・,，、｜|]/).map((part) => part.trim()).filter(Boolean);
  const mapped = pieces.map((part) => GENRE_MAP.get(part) || localizeLoose(part));
  return mapped.join(' · ');
}

function localizeShopName(text) {
  const source = String(text || '').trim();
  if (!source) return '';
  let name = source;
  for (const [jp, ko] of GENRE_MAP.entries()) {
    name = name.split(jp).join(ko);
  }
  for (const [jp, ko] of PHRASE_MAP) {
    if (jp.length >= 2) {
      name = name.split(jp).join(ko);
    }
  }
  return tidyText(name);
}

function localizeLoose(text) {
  let value = String(text || '').trim();
  if (!value) return '';
  for (const [jp, ko] of PHRASE_MAP) {
    value = value.split(jp).join(ko);
  }
  for (const [jp, ko] of GENRE_MAP.entries()) {
    value = value.split(jp).join(ko);
  }
  return tidyText(value);
}

function tidyText(text) {
  return String(text || '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.)])/g, '$1')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .trim();
}

function inferSignatureMenu(shop) {
  const text = `${shop.name || ''} ${shop.catch || ''} ${shop.genre?.name || ''} ${shop.sub_genre?.name || ''}`;
  const rules = [
    ['오마카세', ['おまかせ', 'omakase']],
    ['스시', ['寿司', '鮨', 'スシ']],
    ['라멘', ['ラーメン', 'らーめん']],
    ['츠케멘', ['つけ麺']],
    ['야키니쿠', ['焼肉']],
    ['야키토리', ['焼き鳥']],
    ['치킨난반', ['チキン南蛮']],
    ['가라아게', ['唐揚げ']],
    ['돈카츠', ['とんかつ', 'トンカツ']],
    ['규카츠', ['牛カツ']],
    ['덴동', ['天丼']],
    ['장어', ['うなぎ']],
    ['오코노미야키', ['お好み焼き']],
    ['타코야키', ['たこ焼き']],
    ['샤부샤부', ['しゃぶしゃぶ']],
    ['스키야키', ['すき焼き']],
    ['카레', ['カレー']],
    ['모츠나베', ['もつ鍋']],
  ];
  const low = text.toLowerCase();
  const hit = rules.find((rule) => rule[1].some((term) => low.includes(String(term).toLowerCase())));
  return hit ? hit[0] : localizeGenre(shop.genre?.name || '') || '';
}

function normalizeFlag(value) {
  const text = String(value || '').trim();
  if (!text) return false;
  return !/なし|無|利用不可|not|不明|不可/i.test(text);
}

function findLandmark(query) {
  const normalized = normalize(query);
  return LANDMARKS.find((item) => item.keys.some((key) => normalize(key) === normalized || normalize(key).includes(normalized) || normalized.includes(normalize(key)))) || null;
}

function normalize(text) {
  return String(text || '').toLowerCase().replace(/\s+/g, '').replace(/[()（）._-]/g, '');
}

function clamp(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
}


async function handleAiRestaurantTranslation(req, res) {
  if (!GEMINI_API_KEY) {
    return sendJson(res, 400, { ok: false, error: 'gemini_not_configured' });
  }

  const body = await readJsonBody(req);
  const restaurants = Array.isArray(body?.restaurants) ? body.restaurants.slice(0, 8) : [];
  if (!restaurants.length) {
    return sendJson(res, 200, { ok: true, restaurants: [] });
  }

  const prompt = [
    '당신은 일본 식당 정보를 한국어로 자연스럽게 옮기는 번역 도우미입니다.',
    '반드시 JSON만 반환하세요.',
    'JSON 형식: {"restaurants":[{"id":"...","nameKo":"...","catchCopyKo":"...","accessKo":"...","openKo":"...","closeKo":"...","signatureMenuKo":"..."}]}',
    '가게 이름은 가능한 한 한국어 발음 / 관용 표기로 적고, 원문은 보내는 쪽에서 따로 붙입니다.',
    '영업시간, 휴무, 접근 문구는 한국 여행자가 읽기 쉽게 짧고 자연스럽게 번역하세요.',
    '내용을 꾸며내지 말고, 정보가 부족하면 빈 문자열로 두세요.',
    '입력:',
    JSON.stringify({ restaurants }),
  ].join(String.fromCharCode(10));

  let gemini;
  try {
    gemini = await callGeminiWithFallback(prompt, { temperature: 0.2 });
  } catch (error) {
    return sendJson(res, 502, { ok: false, error: 'gemini_request_failed', detail: String(error.message || error).slice(0, 400) });
  }

  const parsed = safeParseModelJson(gemini.text);
  if (!parsed) {
    return sendJson(res, 502, { ok: false, error: 'gemini_invalid_json' });
  }

  const rows = Array.isArray(parsed.restaurants) ? parsed.restaurants : [];
  return sendJson(res, 200, {
    ok: true,
    model: gemini.model,
    restaurants: rows.map((item) => ({
      id: String(item.id || '').trim(),
      nameKo: String(item.nameKo || '').trim(),
      catchCopyKo: String(item.catchCopyKo || '').trim(),
      accessKo: String(item.accessKo || '').trim(),
      openKo: String(item.openKo || '').trim(),
      closeKo: String(item.closeKo || '').trim(),
      signatureMenuKo: String(item.signatureMenuKo || '').trim(),
    })).filter((item) => item.id),
  });
}

async function handleAiTripPlan(req, res) {
  if (!GEMINI_API_KEY) {
    return sendJson(res, 400, { ok: false, error: 'gemini_not_configured' });
  }

  const body = await readJsonBody(req);
  const days = Array.isArray(body?.days) ? body.days : [];
  const region = String(body?.region || '').trim();
  const type = String(body?.type || '').trim();
  const overviewSeed = String(body?.overview || '').trim();

  const prompt = [
    '당신은 한국어로 답하는 일본 여행 일정 정리 도우미입니다.',
    '반드시 JSON만 반환하세요.',
    'JSON 형식: {"overview":"문장", "days":[{"day":1,"title":"제목","why":"설명"}] }',
    '과장하지 말고, 제공된 식당명과 제목만 사용하세요.',
    '설명은 한국어로 자연스럽고 짧게 작성하세요.',
    '각 day의 why는 1 ~ 2문장으로 작성하세요.',
    '입력 정보:',
    JSON.stringify({ region, type, overviewSeed, days }),
  ].join(String.fromCharCode(10));

  let gemini;
  try {
    gemini = await callGeminiWithFallback(prompt, { temperature: 0.5 });
  } catch (error) {
    return sendJson(res, 502, { ok: false, error: 'gemini_request_failed', detail: String(error.message || error).slice(0, 400) });
  }

  const parsed = safeParseModelJson(gemini.text);
  if (!parsed) {
    return sendJson(res, 502, { ok: false, error: 'gemini_invalid_json' });
  }

  return sendJson(res, 200, {
    ok: true,
    model: gemini.model,
    overview: String(parsed.overview || overviewSeed || '').trim(),
    days: Array.isArray(parsed.days) ? parsed.days.map((item, index) => ({
      day: Number(item.day || index + 1),
      title: String(item.title || '').trim(),
      why: String(item.why || '').trim(),
    })) : [],
  });
}

function extractGeminiText(payload) {
  const candidates = Array.isArray(payload?.candidates) ? payload.candidates : [];
  const parts = Array.isArray(candidates[0]?.content?.parts) ? candidates[0].content.parts : [];
  return parts.map((part) => String(part.text || '')).join('\n').trim();
}

function safeParseModelJson(text) {
  const raw = String(text || '').trim();
  if (!raw) return null;
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch (error) {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch (error2) {
        return null;
      }
    }
    return null;
  }
}

async function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function serveStatic(rawPath, res) {
  const pathname = rawPath === '/' ? '/index.html' : rawPath;
  const safe = path.normalize(path.join(PUBLIC_DIR, pathname));
  if (!safe.startsWith(PUBLIC_DIR)) {
    return sendText(res, 403, 'Forbidden', 'text/plain; charset=utf-8');
  }
  fs.readFile(safe, (err, data) => {
    if (err) {
      return sendText(res, 404, 'Not Found', 'text/plain; charset=utf-8');
    }
    const ext = path.extname(safe).toLowerCase();
    return sendBytes(res, 200, data, MIME[ext] || 'application/octet-stream');
  });
}

function sendJson(res, statusCode, value) {
  const body = Buffer.from(JSON.stringify(value));
  sendBytes(res, statusCode, body, 'application/json; charset=utf-8');
}

function sendText(res, statusCode, text, contentType) {
  sendBytes(res, statusCode, Buffer.from(String(text)), contentType);
}

function sendBytes(res, statusCode, body, contentType) {
  res.writeHead(statusCode, {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
    'Content-Length': body.length,
  });
  res.end(body);
}

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx < 0) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
