#!/usr/bin/env node
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const ENV_PATH = path.join(ROOT, '.env');
loadDotEnv(ENV_PATH);

const PORT = Number(process.env.PORT || 3000);
const HOTPEPPER_API_KEY = String(process.env.HOTPEPPER_API_KEY || '').trim();

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
  ['京都', '교토'], ['博多', '하카타'], ['福岡', '후쿠오카'], ['駅前', '역 앞'], ['駅', '역'], ['徒歩', '도보 '], ['分', '분'],
  ['より', '에서 '], ['約', '약 '], ['無休', '연중무휴'], ['年中無休', '연중무휴'], ['不定休', '비정기 휴무'],
  ['定休日', '정기 휴무'], ['定休', '휴무'], ['個室', '개별룸'], ['禁煙', '금연'], ['喫煙', '흡연 가능'],
  ['カード', '카드 결제'], ['ランチ', '점심 운영'], ['深夜', '심야 영업'], ['英語', '영어'], ['予約', '예약'],
  ['営業', '영업'], ['翌', '익일 '], ['月曜', '월요일'], ['火曜', '화요일'], ['水曜', '수요일'], ['木曜', '목요일'],
  ['金曜', '금요일'], ['土曜', '토요일'], ['日曜', '일요일'], ['祝日', '공휴일'], ['～', ' ~ '], ['〜', ' ~ '],
];

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/api/health') {
      return sendJson(res, 200, {
        ok: true,
        hotpepperConfigured: Boolean(HOTPEPPER_API_KEY),
        mode: HOTPEPPER_API_KEY ? 'live-ready' : 'demo-only',
      });
    }

    if (url.pathname === '/api/geocode') {
      return await handleGeocode(url, res);
    }

    if (url.pathname === '/api/search') {
      return await handleSearch(url, res);
    }

    return serveStatic(url.pathname, res);
  } catch (error) {
    console.error(error);
    return sendJson(res, 500, { ok: false, error: 'server_error', message: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`Hankki Route Japan running at http://localhost:${PORT}`);
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

  const geo = new URL('https://nominatim.openstreetmap.org/search');
  geo.searchParams.set('format', 'jsonv2');
  geo.searchParams.set('limit', '1');
  geo.searchParams.set('countrycodes', 'jp');
  geo.searchParams.set('q', q);

  const response = await fetch(geo, {
    headers: {
      'User-Agent': 'HankkiRouteJapan/1.1',
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    return sendJson(res, response.status, { ok: false, error: 'geocode_failed' });
  }

  const json = await response.json();
  const top = Array.isArray(json) ? json[0] : null;
  if (!top) return sendJson(res, 200, { ok: true, source: 'nominatim', place: null });

  const nameOriginal = String(top.name || String(top.display_name || '').split(',')[0] || q).trim();
  const displayNameOriginal = String(top.display_name || nameOriginal).trim();
  const place = {
    nameKo: localizeLoose(nameOriginal),
    nameOriginal,
    displayNameKo: localizeLoose(displayNameOriginal),
    displayNameOriginal,
    lat: Number(top.lat || 0),
    lng: Number(top.lon || 0),
  };
  return sendJson(res, 200, { ok: true, source: 'nominatim', place });
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
