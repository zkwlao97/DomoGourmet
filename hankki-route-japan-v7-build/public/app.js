(function () {
  'use strict';

  const STORAGE = {
  query: 'hankkiRouteJapan.query.v8',
  plan: 'hankkiRouteJapan.plan.v8',
  planStory: 'hankkiRouteJapan.planStory.v3',
  admin: 'hankkiRouteJapan.admin.v7',
  adminSession: 'hankkiRouteJapan.adminSession.v7',
  forceDemo: 'hankkiRouteJapan.forceDemo.v7',
  basePoint: 'hankkiRouteJapan.basePoint.v8',
  hotelPoint: 'hankkiRouteJapan.hotelPoint.v2',
  uiView: 'hankkiRouteJapan.uiView.v4',
  translationCache: 'hankkiRouteJapan.translationCache.v1',
};

  const SLOT_INFO = {
    breakfast: { label: '아침', start: '05:00', end: '11:00', center: '08:00' },
    lunch: { label: '점심', start: '11:00', end: '15:00', center: '13:00' },
    dinner: { label: '저녁', start: '17:00', end: '22:30', center: '19:00' },
  };

  const WEEKDAY_KO = ['일', '월', '화', '수', '목', '금', '토'];
  const WEEKDAY_JP = ['日', '月', '火', '水', '木', '金', '土'];

  const REGION_MAP = {
    도쿄: '東京',
    아키하바라: '秋葉原',
    아사쿠사: '浅草',
    우에노: '上野',
    시부야: '渋谷',
    신주쿠: '新宿',
    긴자: '銀座',
    오다이바: 'お台場',
    오사카: '大阪',
    난바: '難波',
    도톤보리: '道頓堀',
    교토: '京都',
    후쿠오카: '福岡',
    하카타: '博多',
    홋카이도: '北海道',
    삿포로: '札幌',
    가고시마: '鹿児島',
  };

  const PLACE_MAP = {
    '라디오회관': { nameKo: '라디오회관', nameOriginal: 'ラジオ会館', displayNameKo: '아키하바라 라디오회관', displayNameOriginal: '秋葉原 ラジオ会館', lat: 35.699693, lng: 139.77158 },
    '라디오 회관': { nameKo: '라디오회관', nameOriginal: 'ラジオ会館', displayNameKo: '아키하바라 라디오회관', displayNameOriginal: '秋葉原 ラジオ会館', lat: 35.699693, lng: 139.77158 },
    '센소지': { nameKo: '센소지', nameOriginal: '浅草寺', displayNameKo: '아사쿠사 센소지', displayNameOriginal: '浅草寺', lat: 35.714765, lng: 139.796655 },
    '도쿄스카이트리': { nameKo: '도쿄 스카이트리', nameOriginal: '東京スカイツリー', displayNameKo: '도쿄 스카이트리', displayNameOriginal: '東京スカイツリー', lat: 35.710063, lng: 139.8107 },
    '도쿄 스카이트리': { nameKo: '도쿄 스카이트리', nameOriginal: '東京スカイツリー', displayNameKo: '도쿄 스카이트리', displayNameOriginal: '東京スカイツリー', lat: 35.710063, lng: 139.8107 },
    '시부야 스크램블': { nameKo: '시부야 스크램블 교차로', nameOriginal: '渋谷スクランブル交差点', displayNameKo: '시부야 스크램블 교차로', displayNameOriginal: '渋谷スクランブル交差点', lat: 35.659494, lng: 139.700553 },
    '도톤보리': { nameKo: '도톤보리', nameOriginal: '道頓堀', displayNameKo: '오사카 도톤보리', displayNameOriginal: '道頓堀', lat: 34.668731, lng: 135.501295 },
    '오사카성': { nameKo: '오사카성', nameOriginal: '大阪城', displayNameKo: '오사카성', displayNameOriginal: '大阪城', lat: 34.687315, lng: 135.526202 },
    '오사카 성': { nameKo: '오사카성', nameOriginal: '大阪城', displayNameKo: '오사카성', displayNameOriginal: '大阪城', lat: 34.687315, lng: 135.526202 },
    '교토역': { nameKo: '교토역', nameOriginal: '京都駅', displayNameKo: '교토역', displayNameOriginal: '京都駅', lat: 34.985849, lng: 135.758766 },
    '기요미즈데라': { nameKo: '기요미즈데라', nameOriginal: '清水寺', displayNameKo: '기요미즈데라', displayNameOriginal: '清水寺', lat: 34.994856, lng: 135.785046 },
    '후시미이나리': { nameKo: '후시미 이나리 신사', nameOriginal: '伏見稲荷大社', displayNameKo: '후시미 이나리 신사', displayNameOriginal: '伏見稲荷大社', lat: 34.967146, lng: 135.772671 },
    '후시미 이나리': { nameKo: '후시미 이나리 신사', nameOriginal: '伏見稲荷大社', displayNameKo: '후시미 이나리 신사', displayNameOriginal: '伏見稲荷大社', lat: 34.967146, lng: 135.772671 },
    '하카타역': { nameKo: '하카타역', nameOriginal: '博多駅', displayNameKo: '하카타역', displayNameOriginal: '博多駅', lat: 33.590355, lng: 130.420616 },
    '하카타 역': { nameKo: '하카타역', nameOriginal: '博多駅', displayNameKo: '하카타역', displayNameOriginal: '博多駅', lat: 33.590355, lng: 130.420616 },
  };

  const FOOD_GROUPS = [
    {
      canonical: '라멘',
      aliases: ['라멘', '라면', 'ramen', 'ラーメン', '츠케멘', 'つけ麺', '돈코츠', '豚骨ラーメン'],
      liveTerms: ['ラーメン', 'つけ麺', '豚骨ラーメン'],
      suggestions: ['라멘', '츠케멘', '돈코츠 라멘', '우동'],
      broadTerms: ['라멘', '라면', '라멘집', '츠케멘', '돈코츠', '우동'],
    },
    {
      canonical: '스시',
      aliases: ['스시', '초밥', 'sushi', '寿司', '鮨', '해산물', '카이센'],
      liveTerms: ['寿司', '鮨', '海鮮'],
      suggestions: ['스시', '초밥', '해산물', '일식'],
      broadTerms: ['스시', '초밥', '오마카세', '해산물', '일식'],
    },
    {
      canonical: '오마카세',
      aliases: ['오마카세', '오마카쎄', 'おまかせ', 'omakase', '코스', '코스요리'],
      liveTerms: ['おまかせ', '寿司', '鮨', '海鮮', '和食'],
      suggestions: ['스시', '초밥', '해산물', '일식'],
      broadTerms: ['오마카세', '스시', '초밥', '코스', '해산물', '일식'],
    },
    {
      canonical: '치킨난반',
      aliases: ['치킨난반', '치킨 난반', 'チキン南蛮', '가라아게', '唐揚げ', '치킨', '닭', '야키토리', '焼き鳥'],
      liveTerms: ['チキン南蛮', '唐揚げ', '焼き鳥', '定食'],
      suggestions: ['치킨난반', '가라아게', '야키토리', '정식'],
      broadTerms: ['치킨', '치킨난반', '가라아게', '야키토리', '닭', '정식'],
    },
    {
      canonical: '야키니쿠',
      aliases: ['야키니쿠', '고기', '焼肉', '규카츠', '牛カツ', '스테이크', '와규'],
      liveTerms: ['焼肉', '牛カツ', 'ステーキ'],
      suggestions: ['야키니쿠', '규카츠', '스테이크', '돈카츠'],
      broadTerms: ['야키니쿠', '규카츠', '고기', '스테이크', '와규', '돈카츠'],
    },
    {
      canonical: '덴동',
      aliases: ['덴동', '텐동', '튀김덮밥', '天丼', '天ぷら', '튀김'],
      liveTerms: ['天丼', '天ぷら'],
      suggestions: ['덴동', '튀김', '우동'],
      broadTerms: ['덴동', '튀김', '텐동', '우동'],
    },
    {
      canonical: '장어',
      aliases: ['장어', '우나기', 'うなぎ', '장어덮밥'],
      liveTerms: ['うなぎ'],
      suggestions: ['장어', '덮밥', '스시'],
      broadTerms: ['장어', '우나기', '덮밥', '해산물'],
    },
    {
      canonical: '오코노미야키',
      aliases: ['오코노미야키', 'お好み焼き', '타코야키', 'たこ焼き'],
      liveTerms: ['お好み焼き', 'たこ焼き'],
      suggestions: ['오코노미야키', '타코야키', '이자카야'],
      broadTerms: ['오코노미야키', '타코야키', '이자카야'],
    },
    {
      canonical: '카페',
      aliases: ['카페', '디저트', '커피', 'cafe', 'カフェ', '팬케이크'],
      liveTerms: ['カフェ', '喫茶店'],
      suggestions: ['카페', '디저트', '팬케이크'],
      broadTerms: ['카페', '디저트', '커피', '팬케이크'],
    },
    {
      canonical: '소바',
      aliases: ['소바', 'そば', '우동', 'うどん'],
      liveTerms: ['そば', 'うどん'],
      suggestions: ['소바', '우동', '정식'],
      broadTerms: ['소바', '우동', '정식'],
    },
  ];

  const REGION_TRAVEL_SPOTS = {
    도쿄: [
      { nameKo: '센소지', nameOriginal: '浅草寺', query: '東京都 浅草寺', area: '아사쿠사', priority: 100 },
      { nameKo: '도쿄 스카이트리', nameOriginal: '東京スカイツリー', query: '東京都 東京スカイツリー', area: '아사쿠사', priority: 98 },
      { nameKo: '우에노 공원', nameOriginal: '上野公園', query: '東京都 上野公園', area: '우에노', priority: 96 },
      { nameKo: '아메요코', nameOriginal: 'アメ横', query: '東京都 アメ横', area: '우에노', priority: 94 },
      { nameKo: '아키하바라 라디오회관', nameOriginal: '秋葉原 ラジオ会館', query: '東京都 秋葉原 ラジオ会館', area: '아키하바라', priority: 92 },
      { nameKo: '도쿄 타워', nameOriginal: '東京タワー', query: '東京都 東京タワー', area: '미나토', priority: 90 },
      { nameKo: '도쿄도청 전망대', nameOriginal: '東京都庁展望室', query: '東京都庁 展望室', area: '신주쿠', priority: 88 },
      { nameKo: '시부야 스크램블 교차로', nameOriginal: '渋谷スクランブル交差点', query: '東京都 渋谷スクランブル交差点', area: '시부야', priority: 86 },
      { nameKo: '시부야 스카이', nameOriginal: 'SHIBUYA SKY', query: '東京都 SHIBUYA SKY', area: '시부야', priority: 84 },
      { nameKo: '메이지 신궁', nameOriginal: '明治神宮', query: '東京都 明治神宮', area: '하라주쿠', priority: 82 },
      { nameKo: '오다이바', nameOriginal: 'お台場', query: '東京都 お台場', area: '오다이바', priority: 80 },
      { nameKo: '긴자', nameOriginal: '銀座', query: '東京都 銀座', area: '긴자', priority: 78 },
    ],
    아키하바라: [
      { nameKo: '아키하바라 라디오회관', nameOriginal: '秋葉原 ラジオ会館', query: '東京都 秋葉原 ラジオ会館', area: '아키하바라', priority: 100 },
      { nameKo: '우에노 공원', nameOriginal: '上野公園', query: '東京都 上野公園', area: '우에노', priority: 90 },
      { nameKo: '센소지', nameOriginal: '浅草寺', query: '東京都 浅草寺', area: '아사쿠사', priority: 88 },
      { nameKo: '도쿄 스카이트리', nameOriginal: '東京スカイツリー', query: '東京都 東京スカイツリー', area: '아사쿠사', priority: 86 },
      { nameKo: '시부야 스카이', nameOriginal: 'SHIBUYA SKY', query: '東京都 SHIBUYA SKY', area: '시부야', priority: 74 },
      { nameKo: '도쿄 타워', nameOriginal: '東京タワー', query: '東京都 東京タワー', area: '미나토', priority: 70 },
    ],
    오사카: [
      { nameKo: '도톤보리', nameOriginal: '道頓堀', query: '大阪 道頓堀', area: '난바', priority: 100 },
      { nameKo: '신사이바시', nameOriginal: '心斎橋', query: '大阪 心斎橋', area: '난바', priority: 96 },
      { nameKo: '구로몬 시장', nameOriginal: '黒門市場', query: '大阪 黒門市場', area: '난바', priority: 94 },
      { nameKo: '오사카성', nameOriginal: '大阪城', query: '大阪城', area: '오사카성', priority: 92 },
      { nameKo: '우메다 스카이 빌딩', nameOriginal: '梅田スカイビル', query: '大阪 梅田スカイビル', area: '우메다', priority: 88 },
      { nameKo: '츠텐카쿠', nameOriginal: '通天閣', query: '大阪 通天閣', area: '신세카이', priority: 86 },
      { nameKo: '유니버설 스튜디오 재팬', nameOriginal: 'ユニバーサル・スタジオ・ジャパン', query: '大阪 ユニバーサル・スタジオ・ジャパン', area: '베이', priority: 84 },
      { nameKo: '오사카 해유관', nameOriginal: '海遊館', query: '大阪 海遊館', area: '베이', priority: 82 },
    ],
    난바: [
      { nameKo: '도톤보리', nameOriginal: '道頓堀', query: '大阪 道頓堀', area: '난바', priority: 100 },
      { nameKo: '신사이바시', nameOriginal: '心斎橋', query: '大阪 心斎橋', area: '난바', priority: 96 },
      { nameKo: '구로몬 시장', nameOriginal: '黒門市場', query: '大阪 黒門市場', area: '난바', priority: 94 },
      { nameKo: '츠텐카쿠', nameOriginal: '通天閣', query: '大阪 通天閣', area: '신세카이', priority: 88 },
      { nameKo: '오사카성', nameOriginal: '大阪城', query: '大阪城', area: '오사카성', priority: 78 },
    ],
    교토: [
      { nameKo: '기요미즈데라', nameOriginal: '清水寺', query: '京都 清水寺', area: '히가시야마', priority: 100 },
      { nameKo: '후시미 이나리 신사', nameOriginal: '伏見稲荷大社', query: '京都 伏見稲荷大社', area: '후시미', priority: 98 },
      { nameKo: '니시키 시장', nameOriginal: '錦市場', query: '京都 錦市場', area: '가와라마치', priority: 94 },
      { nameKo: '아라시야마 대나무숲', nameOriginal: '嵐山竹林の小径', query: '京都 嵐山竹林の小径', area: '아라시야마', priority: 92 },
      { nameKo: '금각사', nameOriginal: '金閣寺', query: '京都 金閣寺', area: '기타', priority: 88 },
      { nameKo: '교토역', nameOriginal: '京都駅', query: '京都駅', area: '교토역', priority: 86 },
      { nameKo: '기온', nameOriginal: '祇園', query: '京都 祇園', area: '기온', priority: 84 },
    ],
    후쿠오카: [
      { nameKo: '하카타역', nameOriginal: '博多駅', query: '福岡 博多駅', area: '하카타', priority: 100 },
      { nameKo: '캐널시티 하카타', nameOriginal: 'キャナルシティ博多', query: '福岡 キャナルシティ博多', area: '하카타', priority: 96 },
      { nameKo: '텐진', nameOriginal: '天神', query: '福岡 天神', area: '텐진', priority: 94 },
      { nameKo: '오호리 공원', nameOriginal: '大濠公園', query: '福岡 大濠公園', area: '오호리', priority: 90 },
      { nameKo: '후쿠오카 타워', nameOriginal: '福岡タワー', query: '福岡 福岡タワー', area: '모모치', priority: 86 },
      { nameKo: '모모치 해변', nameOriginal: 'シーサイドももち', query: '福岡 シーサイドももち', area: '모모치', priority: 84 },
    ],
    하카타: [
      { nameKo: '하카타역', nameOriginal: '博多駅', query: '福岡 博多駅', area: '하카타', priority: 100 },
      { nameKo: '캐널시티 하카타', nameOriginal: 'キャナルシティ博多', query: '福岡 キャナルシティ博多', area: '하카타', priority: 96 },
      { nameKo: '텐진', nameOriginal: '天神', query: '福岡 天神', area: '텐진', priority: 88 },
      { nameKo: '오호리 공원', nameOriginal: '大濠公園', query: '福岡 大濠公園', area: '오호리', priority: 84 },
    ],
    홋카이도: [
      { nameKo: '오도리 공원', nameOriginal: '大通公園', query: '札幌 大通公園', area: '삿포로 중심', priority: 100 },
      { nameKo: '삿포로 시계탑', nameOriginal: '札幌時計台', query: '札幌 時計台', area: '삿포로 중심', priority: 96 },
      { nameKo: '삿포로 TV 타워', nameOriginal: 'さっぽろテレビ塔', query: '札幌 さっぽろテレビ塔', area: '삿포로 중심', priority: 94 },
      { nameKo: '스스키노', nameOriginal: 'すすきの', query: '札幌 すすきの', area: '스스키노', priority: 92 },
      { nameKo: '니조 시장', nameOriginal: '二条市場', query: '札幌 二条市場', area: '삿포로 중심', priority: 88 },
      { nameKo: '모이와산 로프웨이', nameOriginal: 'もいわ山ロープウェイ', query: '札幌 もいわ山ロープウェイ', area: '모이와', priority: 82 },
    ],
    삿포로: [
      { nameKo: '오도리 공원', nameOriginal: '大通公園', query: '札幌 大通公園', area: '삿포로 중심', priority: 100 },
      { nameKo: '삿포로 시계탑', nameOriginal: '札幌時計台', query: '札幌 時計台', area: '삿포로 중심', priority: 96 },
      { nameKo: '삿포로 TV 타워', nameOriginal: 'さっぽろテレビ塔', query: '札幌 さっぽろテレビ塔', area: '삿포로 중심', priority: 94 },
      { nameKo: '스스키노', nameOriginal: 'すすきの', query: '札幌 すすきの', area: '스스키노', priority: 92 },
      { nameKo: '니조 시장', nameOriginal: '二条市場', query: '札幌 二条市場', area: '삿포로 중심', priority: 88 },
    ],
    가고시마: [
      { nameKo: '텐몬칸', nameOriginal: '天文館', query: '鹿児島 天文館', area: '텐몬칸', priority: 100 },
      { nameKo: '가고시마 중앙역', nameOriginal: '鹿児島中央駅', query: '鹿児島中央駅', area: '가고시마 중앙역', priority: 96 },
      { nameKo: '시로야마 전망대', nameOriginal: '城山展望台', query: '鹿児島 城山展望台', area: '시로야마', priority: 94 },
      { nameKo: '센간엔', nameOriginal: '仙巌園', query: '鹿児島 仙巌園', area: '센간엔', priority: 92 },
      { nameKo: '사쿠라지마 페리 터미널', nameOriginal: '桜島フェリー', query: '鹿児島 桜島フェリー', area: '워터프론트', priority: 88 },
      { nameKo: '돌핀포트 워터프런트', nameOriginal: 'ドルフィンポート跡地', query: '鹿児島 ウォーターフロントパーク', area: '워터프론트', priority: 84 },
    ],
  };

  const state = {
  apiAvailable: false,
  liveEnabled: false,
  geminiAvailable: false,
  forceDemo: readJson(STORAGE.forceDemo, false),
  currentQuery: readJson(STORAGE.query, {
    region: '',
    base: '',
    mapsLink: '',
    hotel: '',
    hotelMapsLink: '',
    food: '',
    startDate: toDateInput(new Date()),
    days: 3,
    minScore: 3,
    sort: 'food',
  }),
  basePoint: readJson(STORAGE.basePoint, null),
  hotelPoint: readJson(STORAGE.hotelPoint, null),
  results: [],
  pool: [],
  plan: readJson(STORAGE.plan, createPlan(3)),
  adminNotes: readJson(STORAGE.admin, {}),
  adminSession: readJson(STORAGE.adminSession, { loggedIn: false }),
  searchSuggestions: [],
  feedback: '',
  sourceLabel: '데모 데이터',
  uiView: readJson(STORAGE.uiView, 'search'),
  pagination: { page: 1, perPage: 8 },
  planStory: readJson(STORAGE.planStory, { type: '', overview: '', days: [], aiUsed: false }),
  pendingAdminRestaurantId: '',
  translations: readJson(STORAGE.translationCache, {}),
  translationInFlight: false,
};

  const els = {};

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    cache();
    restoreInputs();
    bind();
    setView(state.uiView || 'search', false);
    renderAdminState();
    renderBasePoint();
    renderPlan();
    renderPlanStory();
    renderAdminList();
    detectApi().then(function () {
      return search({ silent: true });
    }).catch(function () {
      showFeedback('초기 검색에 실패했습니다. 데모 데이터로 다시 시도해 주세요.', 'error');
    });
  }

  function cache() {
    ids([
'mode-badge', 'api-status', 'region-input', 'base-input', 'maps-link-input', 'food-input', 'hotel-input', 'hotel-maps-link-input', 'start-date-input', 'days-input',
'min-score-input', 'min-score-value', 'search-button', 'demo-button', 'auto-plan-button', 'search-feedback',
'search-suggestions', 'base-point-box', 'region-insights', 'results-meta', 'results-list', 'results-pagination', 'booking-guide',
'plan-warnings', 'plan-table-body', 'plan-route-cards', 'clear-plan-button', 'admin-panel', 'admin-restaurant-select',
'admin-reason', 'admin-save-button', 'admin-list', 'admin-login-open', 'admin-logout-button', 'schedule-modal',
'schedule-title', 'dialog-restaurant-id', 'dialog-date', 'dialog-slot', 'dialog-note', 'dialog-save',
'dialog-cancel', 'admin-login-modal', 'admin-id-input', 'admin-password-input', 'admin-login-message',
'admin-login-submit', 'admin-login-cancel', 'nav-search-view', 'nav-plan-view', 'open-plan-button', 'back-to-search-button',
'search-view', 'plan-view', 'plan-summary', 'plan-story', 'sort-select',
'admin-recommend-modal', 'admin-recommend-title', 'admin-recommend-restaurant-id', 'admin-recommend-reason',
'admin-recommend-save', 'admin-recommend-remove', 'admin-recommend-cancel', 'admin-recommend-message',
'plan-option-modal', 'plan-option-message', 'plan-option-generate', 'plan-option-cancel',
'plan-extra-places', 'plan-use-ai', 'plan-ai-state'
    ]).forEach(function (pair) {
      els[pair.key] = pair.value;
    });
  }

  function ids(list) {
    return list.map(function (id) {
      return { key: camel(id), value: document.getElementById(id) };
    });
  }

  function camel(id) {
    return id.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); });
  }

  function restoreInputs() {
  const q = state.currentQuery;
  els.regionInput.value = q.region || '';
  els.baseInput.value = q.base || '';
  els.mapsLinkInput.value = q.mapsLink || '';
  els.foodInput.value = q.food || '';
  if (els.hotelInput) els.hotelInput.value = q.hotel || '';
  if (els.hotelMapsLinkInput) els.hotelMapsLinkInput.value = q.hotelMapsLink || '';
  els.startDateInput.value = q.startDate || toDateInput(new Date());
  els.daysInput.value = String(q.days || 3);
  els.minScoreInput.value = String(q.minScore || 3);
  if (els.sortSelect) els.sortSelect.value = q.sort || 'food';
  els.minScoreValue.textContent = Number(els.minScoreInput.value).toFixed(1) + '점 이상';
  state.plan = resizePlan(state.plan, Number(els.daysInput.value || 3));
  syncViewFromHash();
}

  function readQueryFromInputs() {
    return {
      region: String((els.regionInput && els.regionInput.value) || '').trim(),
      base: String((els.baseInput && els.baseInput.value) || '').trim(),
      mapsLink: String((els.mapsLinkInput && els.mapsLinkInput.value) || '').trim(),
      hotel: String((els.hotelInput && els.hotelInput.value) || '').trim(),
      hotelMapsLink: String((els.hotelMapsLinkInput && els.hotelMapsLinkInput.value) || '').trim(),
      food: String((els.foodInput && els.foodInput.value) || '').trim(),
      startDate: (els.startDateInput && els.startDateInput.value) || toDateInput(new Date()),
      days: clamp(parseInt((els.daysInput && els.daysInput.value) || '3', 10), 1, 10),
      minScore: Number((els.minScoreInput && els.minScoreInput.value) || 3),
      sort: String((els.sortSelect && els.sortSelect.value) || 'food'),
    };
  }

  function syncQueryFromInputs(persist) {
    const query = readQueryFromInputs();
    state.currentQuery = query;
    if (persist !== false) saveJson(STORAGE.query, query);
    return query;
  }

  function bind() {
    els.minScoreInput.addEventListener('input', function () {
      els.minScoreValue.textContent = Number(els.minScoreInput.value).toFixed(1) + '점 이상';
    });

    els.searchButton.addEventListener('click', function () {
      state.forceDemo = false;
      saveJson(STORAGE.forceDemo, false);
      search();
    });

    els.demoButton.addEventListener('click', function () {
      state.forceDemo = true;
      saveJson(STORAGE.forceDemo, true);
      search();
    });

    els.autoPlanButton.addEventListener('click', openPlanOptionModal);
    els.clearPlanButton.addEventListener('click', clearPlan);
    if (els.sortSelect) els.sortSelect.addEventListener('change', function () {
      state.currentQuery.sort = els.sortSelect.value || 'food';
      saveJson(STORAGE.query, state.currentQuery);
      state.pagination.page = 1;
      renderResults();
    });

    if (els.navSearchView) els.navSearchView.addEventListener('click', function () { setView('search'); });
    if (els.navPlanView) els.navPlanView.addEventListener('click', function () { setView('plan'); });
    if (els.openPlanButton) els.openPlanButton.addEventListener('click', function () { setView('plan'); });
    if (els.backToSearchButton) els.backToSearchButton.addEventListener('click', function () { setView('search'); });
    window.addEventListener('hashchange', syncViewFromHash);

    document.querySelectorAll('[data-food]').forEach(function (button) {
      button.addEventListener('click', function () {
        els.foodInput.value = button.getAttribute('data-food') || '';
        state.forceDemo = false;
        saveJson(STORAGE.forceDemo, false);
        search();
      });
    });

    els.adminLoginOpen.addEventListener('click', openAdminModal);
    els.adminLogoutButton.addEventListener('click', logoutAdmin);
    els.adminLoginSubmit.addEventListener('click', submitAdminLogin);
    els.adminLoginCancel.addEventListener('click', closeAdminModal);
    els.adminSaveButton.addEventListener('click', saveAdminNote);
    if (els.adminRecommendSave) els.adminRecommendSave.addEventListener('click', saveAdminRecommendationFromModal);
    if (els.adminRecommendRemove) els.adminRecommendRemove.addEventListener('click', removeAdminRecommendationFromModal);
    if (els.adminRecommendCancel) els.adminRecommendCancel.addEventListener('click', closeAdminRecommendModal);
    if (els.planOptionGenerate) els.planOptionGenerate.addEventListener('click', submitPlanOptionModal);
    if (els.planOptionCancel) els.planOptionCancel.addEventListener('click', closePlanOptionModal);

    els.dialogSave.addEventListener('click', saveSchedule);
    els.dialogCancel.addEventListener('click', closeScheduleModal);

    document.querySelectorAll('[data-close="schedule"]').forEach(function (node) {
      node.addEventListener('click', closeScheduleModal);
    });
    document.querySelectorAll('[data-close="admin"]').forEach(function (node) {
      node.addEventListener('click', closeAdminModal);
    });
    document.querySelectorAll('[data-close="admin-recommend"]').forEach(function (node) {
      node.addEventListener('click', closeAdminRecommendModal);
    });
    document.querySelectorAll('[data-close="plan-option"]').forEach(function (node) {
      node.addEventListener('click', closePlanOptionModal);
    });
  }

  function syncViewFromHash() {
    if (window.location.hash === '#plan') {
      setView('plan', false);
    } else if (window.location.hash === '#search') {
      setView('search', false);
    }
  }

  function setView(view, updateHash) {
    view = view === 'plan' ? 'plan' : 'search';
    state.uiView = view;
    saveJson(STORAGE.uiView, view);
    toggleHidden(els.searchView, view !== 'search');
    toggleHidden(els.planView, view !== 'plan');
    if (els.navSearchView) els.navSearchView.classList.toggle('active', view === 'search');
    if (els.navPlanView) els.navPlanView.classList.toggle('active', view === 'plan');
    if (updateHash !== false) {
      const targetHash = view === 'plan' ? '#plan' : '#search';
      if (window.location.hash !== targetHash) {
        history.replaceState(null, '', targetHash);
      }
    }
    if (view === 'plan') {
      renderPlanSummary();
    }
  }

  function detectApi() {
    return fetch('/api/health').then(function (response) {
      if (!response.ok) throw new Error('health_failed');
      return response.json();
    }).then(function (json) {
      state.apiAvailable = true;
      state.liveEnabled = Boolean(json.hotpepperConfigured);
      state.geminiAvailable = Boolean(json.geminiConfigured);
      if (state.forceDemo) {
        els.modeBadge.textContent = '데모 모드';
        els.apiStatus.textContent = '사용자님이 데모 모드로 전환해 두어 데모 데이터로 동작합니다.';
      } else if (state.liveEnabled) {
        els.modeBadge.textContent = '실시간 모드';
        els.apiStatus.textContent = 'Hot Pepper 실시간 검색이 연결되었습니다.' + (state.geminiAvailable ? ' Gemini 일정 설명도 사용할 수 있습니다.' : '');
      } else {
        els.modeBadge.textContent = '데모 모드';
        els.apiStatus.textContent = 'API 키가 없어 데모 데이터로 동작합니다.';
      }
    }).catch(function () {
      state.apiAvailable = false;
      state.liveEnabled = false;
      state.geminiAvailable = false;
      els.modeBadge.textContent = '데모 모드';
      els.apiStatus.textContent = '서버 응답이 없어 데모 데이터로 동작합니다.';
    });
  }

  function search(options) {
  options = options || {};

  const query = syncQueryFromInputs(true);
  state.plan = resizePlan(state.plan, query.days);
  saveJson(STORAGE.plan, state.plan);
  renderPlan();

  state.pagination.page = 1;
  showFeedback('검색 중입니다. 기준 장소와 숙소를 확인하고 있습니다.', 'info');
  els.searchButton.disabled = true;

  return Promise.all([
    resolveBasePoint(query.region, query.base, query.mapsLink),
    resolveBasePoint(query.region, query.hotel, query.hotelMapsLink),
  ]).then(function (points) {
    state.basePoint = points[0] || null;
    state.hotelPoint = points[1] || null;
    saveJson(STORAGE.basePoint, state.basePoint);
    saveJson(STORAGE.hotelPoint, state.hotelPoint);
    renderBasePoint();
    return fetchRestaurants(query, state.basePoint);
  }).then(function (payload) {
    const rawPool = payload.pool.map(function (r) { return augmentRestaurant(r, state.basePoint, query.food); });
    const rawResults = payload.results.map(function (r) { return augmentRestaurant(r, state.basePoint, query.food); });

    const augmentedPool = rawPool.filter(function (r) { return !isLikelyClosedRestaurant(r); });
    let augmentedResults = rawResults.filter(function (r) { return !isLikelyClosedRestaurant(r); });

    const scoreFiltered = augmentedResults.filter(function (r) {
      return (r.travelScore || 0) >= query.minScore;
    });

    if (scoreFiltered.length) {
      augmentedResults = scoreFiltered;
    }

    state.pool = augmentedPool;
    state.results = mergeById(augmentedResults, augmentedPool).sort(sortRestaurantsForDisplay(query.food, query.sort));
    state.searchSuggestions = payload.suggestions;
    state.sourceLabel = payload.sourceLabel || '검색 결과';
    renderEverything();
    maybeTranslateVisibleResults();
    showFeedback(buildFeedback(payload, scoreFiltered.length ? '' : '검색 폭을 넓혀 주변 추천도 함께 보여드립니다.'), 'success');
  }).catch(function (error) {
    console.error(error);
    showFeedback('검색 중 문제가 생겼습니다. 데모 데이터 보기로 먼저 확인해 주세요.', 'error');
  }).finally(function () {
    els.searchButton.disabled = false;
    if (!options.silent && state.results.length === 0 && state.searchSuggestions.length === 0) {
      renderSuggestions(['라멘', '스시', '오마카세', '치킨난반', '규카츠']);
    }
  });
}

  function fetchRestaurants(query, basePoint) {
    const canUseLive = state.apiAvailable && state.liveEnabled && !state.forceDemo;

    if (!canUseLive) {
      return Promise.resolve(fetchDemo(query, basePoint));
    }

    const tasks = buildSearchTasks(query, basePoint);
    return runSearchTasks(tasks).then(function (pool) {
      const evaluated = evaluatePool(pool, query);
      return {
        pool: pool,
        results: evaluated.results,
        suggestions: evaluated.suggestions,
        sourceLabel: 'Hot Pepper 공식 API',
        fallbackUsed: evaluated.fallbackUsed,
      };
    }).catch(function (error) {
      console.error(error);
      const demo = fetchDemo(query, basePoint);
      demo.sourceLabel = '데모 데이터(실시간 실패 대체)';
      return demo;
    });
  }

  function buildSearchTasks(query, basePoint) {
    const tasks = [];
    const regionTerm = REGION_MAP[query.region] || query.region || '';
    const liveTerms = buildLiveTerms(query.food).slice(0, 6);
    const broadTerms = getAlternativeFoodTerms(query.food).slice(0, 6);
    const looksLikeSpecificStore = Boolean(query.food && (query.food.length >= 4 || /店|館|ホテ|hotel|호텔|라멘|스시|いち|一蘭|屋|亭/i.test(query.food)));

    if (basePoint && basePoint.lat && basePoint.lng) {
      tasks.push({ lat: basePoint.lat, lng: basePoint.lng, range: 2, count: 50, start: 1 });
      tasks.push({ lat: basePoint.lat, lng: basePoint.lng, range: 3, count: 50, start: 1 });
      tasks.push({ lat: basePoint.lat, lng: basePoint.lng, range: 3, count: 50, start: 51 });
      tasks.push({ lat: basePoint.lat, lng: basePoint.lng, range: 5, count: 50, start: 1 });
      if (regionTerm) {
        tasks.push({ lat: basePoint.lat, lng: basePoint.lng, range: 5, count: 40, start: 1, keyword: regionTerm });
      }
      liveTerms.forEach(function (term) {
        tasks.push({ lat: basePoint.lat, lng: basePoint.lng, range: 5, count: 40, start: 1, keyword: term });
        if (regionTerm) tasks.push({ keyword: buildKeyword(regionTerm, term), count: 40, start: 1 });
      });
      if (query.food) {
        tasks.push({ keyword: buildKeyword(regionTerm || query.base, query.food), count: 50, start: 1 });
        tasks.push({ keyword: query.food, count: 50, start: 1 });
        if (looksLikeSpecificStore) {
          tasks.push({ keyword: query.food, count: 50, start: 51 });
        }
        broadTerms.forEach(function (term) {
          tasks.push({ keyword: buildKeyword(regionTerm || query.base, term), count: 40, start: 1 });
        });
      }
    } else {
      if (regionTerm) {
        tasks.push({ keyword: regionTerm, count: 50, start: 1 });
        tasks.push({ keyword: regionTerm, count: 50, start: 51 });
      }
      if (query.food) {
        liveTerms.forEach(function (term) {
          tasks.push({ keyword: buildKeyword(regionTerm, term), count: 40, start: 1 });
        });
        tasks.push({ keyword: query.food, count: 50, start: 1 });
      }
    }

    return tasks.filter(function (task, index, all) {
      const key = JSON.stringify(task);
      return all.findIndex(function (item) { return JSON.stringify(item) === key; }) === index;
    });
  }

  function runSearchTasks(tasks) {
    let chain = Promise.resolve([]);
    tasks.forEach(function (task) {
      chain = chain.then(function (acc) {
        return callSearchApi(task).then(function (rows) {
          return mergeById(acc, rows);
        }).catch(function () {
          return acc;
        });
      });
    });
    return chain;
  }

  function evaluatePool(pool, query) {
    const suggestions = buildSuggestions(query.food, pool);
    if (!query.food) {
      return {
        results: pool.slice(),
        suggestions: suggestions,
        fallbackUsed: '',
      };
    }

    const scored = pool.map(function (item) {
      const match = scoreFoodMatch(item, query.food);
      item.matchScore = match.score;
      item.matchTerms = match.terms;
      const normalizedQuery = normalize(query.food);
      const normalizedName = normalize([item.nameKo, item.nameOriginal].join(' '));
      item.nameExact = Boolean(normalizedQuery && normalizedName.includes(normalizedQuery));
      return item;
    });

    let results = scored.filter(function (item) { return item.nameExact || item.matchScore >= 1; });
    let fallbackUsed = '';

    if (results.length < 6) {
      const relaxed = scored.filter(function (item) { return item.nameExact || item.matchScore >= 0.45; });
      if (relaxed.length > results.length) {
        results = relaxed;
        fallbackUsed = '확장 검색어';
      }
    }

    if (!results.length && scored.length) {
      results = scored.slice();
      fallbackUsed = '주변 추천';
    }

    return {
      results: results,
      suggestions: suggestions,
      fallbackUsed: fallbackUsed,
    };
  }

  function fetchDemo(query, basePoint) {
    const pool = getDemoPool(query.region, basePoint);
    const evaluated = evaluatePool(pool.map(function (item) { return Object.assign({}, item); }), query);
    return {
      pool: pool,
      results: evaluated.results,
      suggestions: evaluated.suggestions,
      sourceLabel: '데모 데이터',
      fallbackUsed: evaluated.fallbackUsed,
    };
  }

  function callSearchApi(params) {
    const url = new URL('/api/search', window.location.origin);
    Object.keys(params).forEach(function (key) {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        url.searchParams.set(key, String(params[key]));
      }
    });

    return fetch(url.toString()).then(function (response) {
      if (!response.ok) throw new Error('search_failed');
      return response.json();
    }).then(function (json) {
      return Array.isArray(json.results) ? json.results : [];
    });
  }

  function resolveBasePoint(region, base, mapsLink) {
    const local = findPreset(base);
    if (local) return Promise.resolve(Object.assign({ source: 'preset' }, local));

    if (mapsLink) {
      const url = new URL('/api/resolve-map-link', window.location.origin);
      url.searchParams.set('url', mapsLink);
      return fetch(url.toString()).then(function (response) {
        if (!response.ok) throw new Error('map_link_failed');
        return response.json();
      }).then(function (json) {
        if (json.place) return json.place;
        return resolveBasePoint(region, base, '');
      }).catch(function () {
        return resolveBasePoint(region, base, '');
      });
    }

    const regionPart = REGION_MAP[region] || region || '';
    const basePart = base || '';
    const combined = [regionPart, basePart].filter(Boolean).join(' ');
    if (!combined.trim()) return Promise.resolve(null);

    const url = new URL('/api/geocode', window.location.origin);
    url.searchParams.set('q', combined);
    return fetch(url.toString()).then(function (response) {
      if (!response.ok) throw new Error('geocode_failed');
      return response.json();
    }).then(function (json) {
      return json.place || null;
    }).catch(function () {
      return null;
    });
  }

  function findPreset(text) {
    const key = normalize(text);
    if (!key) return null;
    const foundKey = Object.keys(PLACE_MAP).find(function (item) {
      return normalize(item) === key || normalize(item).includes(key) || key.includes(normalize(item));
    });
    return foundKey ? PLACE_MAP[foundKey] : null;
  }

  function augmentRestaurant(item, basePoint, foodQuery) {
    const restaurant = Object.assign({}, item);
    const cached = state.translations[restaurant.id] || {};
    restaurant.nameKo = cached.nameKo || restaurant.nameKo || restaurant.nameOriginal || '이름 없음';
    restaurant.catchCopyKo = cached.catchCopyKo || restaurant.catchCopyKo || restaurant.catchCopyOriginal || '';
    restaurant.accessKo = cached.accessKo || restaurant.accessKo || restaurant.accessOriginal || '';
    restaurant.openKo = cached.openKo || restaurant.openKo || restaurant.openOriginal || '';
    restaurant.closeKo = cached.closeKo || restaurant.closeKo || restaurant.closeOriginal || '';
    restaurant.signatureMenu = cached.signatureMenuKo || restaurant.signatureMenu || '';
    restaurant.displayName = restaurant.nameOriginal && restaurant.nameOriginal !== restaurant.nameKo
      ? restaurant.nameKo + ' (' + restaurant.nameOriginal + ')'
      : restaurant.nameKo;
    restaurant.distanceKm = (basePoint && restaurant.lat && restaurant.lng)
      ? haversineKm(basePoint.lat, basePoint.lng, restaurant.lat, restaurant.lng)
      : null;
    restaurant.hotelDistanceKm = (state.hotelPoint && restaurant.lat && restaurant.lng)
      ? haversineKm(state.hotelPoint.lat, state.hotelPoint.lng, restaurant.lat, restaurant.lng)
      : null;
    restaurant.walkMinutes = parseWalkMinutes(restaurant.accessKo || restaurant.accessOriginal || '');
    restaurant.estimatedWalkMinutes = restaurant.walkMinutes || estimateWalkMinutesFromDistance(restaurant.distanceKm);
    restaurant.travelScore = calcTravelScore(restaurant);
    const match = scoreFoodMatch(restaurant, foodQuery);
    restaurant.matchScore = match.score;
    restaurant.matchTerms = match.terms;
    const normalizedQuery = normalize(foodQuery || '');
    const normalizedName = normalize([restaurant.nameKo, restaurant.nameOriginal].join(' '));
    const normalizedFoodText = normalize([restaurant.genreKo, restaurant.genreOriginal, restaurant.subGenreKo, restaurant.subGenreOriginal, restaurant.signatureMenu].join(' '));
    restaurant.nameExact = Boolean(normalizedQuery && normalizedName.includes(normalizedQuery));
    restaurant.foodExact = Boolean(normalizedQuery && normalizedFoodText.includes(normalizedQuery));
    restaurant.exactBucket = restaurant.nameExact || restaurant.foodExact;
    restaurant.goodPoints = buildGoodPoints(restaurant);
    restaurant.badPoints = buildBadPoints(restaurant);
    restaurant.recommendedSlots = estimateMealSlots(restaurant);
    restaurant.adminNote = state.adminNotes[restaurant.id] || '';
    restaurant.reservationUrl = restaurant.reservationUrl || restaurant.url || '';
    return restaurant;
  }

  function calcTravelScore(r) {
    let score = 2.7;
    if (r.distanceKm != null) {
      if (r.distanceKm <= 0.35) score += 1.1;
      else if (r.distanceKm <= 0.8) score += 0.8;
      else if (r.distanceKm <= 1.4) score += 0.45;
      else if (r.distanceKm <= 2.4) score += 0.15;
      else score -= 0.15;
    }
    if (r.estimatedWalkMinutes != null) {
      if (r.estimatedWalkMinutes <= 5) score += 0.45;
      else if (r.estimatedWalkMinutes <= 10) score += 0.2;
    }
    if (r.englishMenu) score += 0.35;
    if (r.card) score += 0.2;
    if (r.noSmoking) score += 0.25;
    if (r.wifi) score += 0.15;
    if (r.privateRoom) score += 0.12;
    if (r.kids) score += 0.08;
    if (r.lunch) score += 0.12;
    if (r.lateNight) score += 0.08;
    if ((r.signatureMenu || '').includes('오마카세')) score += 0.18;
    if ((r.signatureMenu || '').includes('라멘')) score += 0.08;
    return Math.max(1, Math.min(5, Number(score.toFixed(1))));
  }

  function buildGoodPoints(r) {
    const list = [];
    if (r.distanceKm != null) list.push('기준 장소에서 약 ' + r.distanceKm.toFixed(2) + 'km 거리입니다.');
    if (r.hotelDistanceKm != null) list.push('숙소 기준으로는 약 ' + r.hotelDistanceKm.toFixed(2) + 'km입니다.');
    if (r.walkMinutes != null) list.push('접근 정보 기준 도보 ' + r.walkMinutes + '분 정도입니다.');
    else if (r.estimatedWalkMinutes != null) list.push('직선거리 기준 도보 약 ' + formatMinutes(r.estimatedWalkMinutes) + ' 정도로 추정됩니다.');
    if (r.signatureMenu) list.push('대표 메뉴는 ' + r.signatureMenu + ' 쪽으로 보입니다.');
    if (r.englishMenu) list.push('영어 메뉴 가능 정보가 있습니다.');
    if (r.noSmoking) list.push('금연 정보가 있어 여행 중 쉬기 편합니다.');
    if (r.card) list.push('카드 결제가 가능합니다.');
    if (r.lunch) list.push('점심 시간 이용이 가능합니다.');
    if (r.lateNight) list.push('저녁 늦게까지 운영해 일정 마감용으로 좋습니다.');
    if (r.wifi) list.push('와이파이 정보가 있습니다.');
    return unique(list).slice(0, 4);
  }

  function buildBadPoints(r) {
    const list = [];
    if (!r.englishMenu) list.push('영어 메뉴 여부가 확인되지 않았습니다.');
    if (!r.noSmoking) list.push('금연 정보가 불명확하거나 흡연 가능일 수 있습니다.');
    if (!r.card) list.push('카드 결제 정보가 불명확합니다.');
    if (r.distanceKm != null && r.distanceKm > 1.2) list.push('관광지 기준으로는 약간 이동 거리가 있습니다.');
    if (r.closeKo || r.closeOriginal) list.push('휴무일은 실제 방문 전 한 번 더 확인해 주세요.');
    return unique(list).slice(0, 4);
  }

  function sortRestaurantsForDisplay(foodQuery, sortMode) {
  sortMode = sortMode || (state.currentQuery && state.currentQuery.sort) || 'food';
  return function (a, b) {
    if (sortMode === 'distance') {
      const ad = a.distanceKm == null ? 999 : a.distanceKm;
      const bd = b.distanceKm == null ? 999 : b.distanceKm;
      if (ad !== bd) return ad - bd;
    }
    if (sortMode === 'score') {
      if ((b.travelScore || 0) !== (a.travelScore || 0)) return (b.travelScore || 0) - (a.travelScore || 0);
    }
    const aExact = (a.foodExact ? 3 : 0) + (a.nameExact ? 4 : 0);
    const bExact = (b.foodExact ? 3 : 0) + (b.nameExact ? 4 : 0);
    if (bExact !== aExact) return bExact - aExact;
    if ((b.matchScore || 0) !== (a.matchScore || 0)) return (b.matchScore || 0) - (a.matchScore || 0);
    if ((b.adminNote ? 1 : 0) !== (a.adminNote ? 1 : 0)) return (b.adminNote ? 1 : 0) - (a.adminNote ? 1 : 0);
    if ((b.travelScore || 0) !== (a.travelScore || 0)) return (b.travelScore || 0) - (a.travelScore || 0);
    const ad = a.distanceKm == null ? 999 : a.distanceKm;
    const bd = b.distanceKm == null ? 999 : b.distanceKm;
    return ad - bd;
  };
}

  function renderEverything() {
    showFeedback(state.feedback || '검색이 완료되었습니다.', 'success');
    renderSuggestions(state.searchSuggestions);
    renderResults();
    renderBasePoint();
    renderInsights();
    renderAdminOptions();
    renderAdminList();
    renderPlanSummary();
    renderPlanStory();
  }

  function renderResults() {
    const total = state.results.length;
    const perPage = state.pagination.perPage;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    state.pagination.page = clamp(state.pagination.page, 1, totalPages);
    const startIndex = (state.pagination.page - 1) * perPage;
    const pageItems = state.results.slice(startIndex, startIndex + perPage);
    const exactItems = pageItems.filter(function (item) { return item.exactBucket || item.matchScore >= 1.8; });
    const nearbyItems = pageItems.filter(function (item) { return !(item.exactBucket || item.matchScore >= 1.8); });

    els.resultsMeta.textContent = '총 ' + total + '곳 · ' + state.pagination.page + ' / ' + totalPages + ' 페이지 · ' + state.sourceLabel;

    if (!total) {
      els.resultsList.innerHTML = '<div class="empty-state">검색 결과가 없습니다. 추천 검색어를 눌러 다시 찾아보시거나, 음식 키워드 또는 식당명을 조금 넓게 입력해 주세요.</div>';
      renderPagination();
      return;
    }

    const sections = [];
    if (exactItems.length) {
      sections.push('<section class="result-section"><div class="result-section-head"><strong>음식 / 식당명과 먼저 맞는 결과</strong><span>검색어와 직접 맞닿은 식당부터 먼저 보여드립니다.</span></div><div class="result-section-list">' + exactItems.map(renderResultCardHtml).join('') + '</div></section>');
    }
    if (nearbyItems.length) {
      sections.push('<section class="result-section"><div class="result-section-head"><strong>동선이 좋은 주변 추천</strong><span>검색어와 완전 일치하지 않아도 여행 동선이 좋은 후보를 함께 보여드립니다.</span></div><div class="result-section-list">' + nearbyItems.map(renderResultCardHtml).join('') + '</div></section>');
    }

    els.resultsList.innerHTML = sections.join('');

    els.resultsList.querySelectorAll('.result-add').forEach(function (button) {
      button.addEventListener('click', function () {
        openScheduleModal(button.getAttribute('data-id'));
      });
    });
    els.resultsList.querySelectorAll('.result-admin-recommend').forEach(function (button) {
      button.addEventListener('click', function () {
        openAdminRecommendModal(button.getAttribute('data-id'));
      });
    });

    renderPagination();
    maybeTranslateVisibleResults();
  }

  function renderResultCardHtml(r) {
    const distanceLabel = r.distanceKm != null ? '기준 장소에서 약 ' + r.distanceKm.toFixed(2) + 'km' : '';
    const hotelDistanceLabel = r.hotelDistanceKm != null ? '숙소에서 약 ' + r.hotelDistanceKm.toFixed(2) + 'km' : '';
    const walkEstimate = r.estimatedWalkMinutes ? '도보 추정 ' + formatMinutes(r.estimatedWalkMinutes) : '';
    return '' +
      '<article class="result-card" data-result-id="' + escapeHtml(r.id) + '">' +
        '<div class="result-image">' +
          (r.photo ? '<img src="' + escapeHtml(r.photo) + '" alt="' + escapeHtml(r.displayName) + '" />' : '<div class="placeholder-image">맛집</div>') +
        '</div>' +
        '<div class="result-main">' +
          '<div class="result-top">' +
            '<div>' +
              '<h3 class="result-title">' + escapeHtml(r.displayName) + '</h3>' +
              '<div class="subline">' + escapeHtml([r.regionKo || r.regionOriginal, r.areaKo || r.areaOriginal].filter(Boolean).join(' · ')) + '</div>' +
            '</div>' +
            '<div class="badge-row">' +
              '<span class="badge score">추천 ' + escapeHtml(String((r.travelScore || 0).toFixed(1))) + '점</span>' +
              (r.foodExact ? '<span class="badge match">음식 일치</span>' : '') +
              (r.nameExact ? '<span class="badge match">식당명 일치</span>' : '') +
              (r.adminNote ? '<span class="badge admin">관리자 추천</span>' : '') +
            '</div>' +
          '</div>' +
          '<div class="metric-strip">' +
            (distanceLabel ? '<div class="metric-card"><span>기준 장소</span><strong>' + escapeHtml(distanceLabel) + '</strong></div>' : '') +
            (hotelDistanceLabel ? '<div class="metric-card"><span>숙소 기준</span><strong>' + escapeHtml(hotelDistanceLabel) + '</strong></div>' : '') +
            (walkEstimate ? '<div class="metric-card"><span>대략 이동 시간</span><strong>' + escapeHtml(walkEstimate) + '</strong></div>' : '') +
            '<div class="metric-card"><span>추천 식사 시간</span><strong>' + escapeHtml(r.recommendedSlots.length ? r.recommendedSlots.join(' / ') : '직접 확인 필요') + '</strong></div>' +
          '</div>' +
          '<div class="meta-line">' +
            badge(r.genreKo || r.genreOriginal) + badge(r.subGenreKo || r.subGenreOriginal) + badge(r.signatureMenu) +
            (r.matchTerms && r.matchTerms.length ? '<span class="badge match">검색 연관: ' + escapeHtml(r.matchTerms.join(', ')) + '</span>' : '') +
          '</div>' +
          '<div class="summary-grid">' +
            '<div class="summary-box"><strong>좋은 점</strong><ul>' + listHtml(r.goodPoints) + '</ul></div>' +
            '<div class="summary-box"><strong>주의할 점</strong><ul>' + listHtml(r.badPoints) + '</ul></div>' +
          '</div>' +
          (r.adminNote ? '<div class="message-inline"><strong>관리자 추천 이유</strong><br />' + escapeHtml(r.adminNote) + '</div>' : '') +
          '<div class="meta-list">' +
            meta('주소', r.addressKo || r.addressOriginal) +
            meta('접근', r.accessKo || r.accessOriginal) +
            meta('운영시간', r.openKo || r.openOriginal) +
            meta('휴무', r.closeKo || r.closeOriginal) +
            meta('예산', r.budgetKo || r.budgetOriginal) +
            meta('예약', r.reservationUrl ? '가능' : '별도 확인') +
          '</div>' +
          '<div class="action-row compact-top">' +
            '<button class="btn btn-primary result-add" data-id="' + escapeHtml(r.id) + '">일정에 추가</button>' +
            '<a class="btn btn-secondary" target="_blank" rel="noopener noreferrer" href="' + escapeHtml(buildDirectionsUrl(r, state.basePoint)) + '">기준 장소에서 길찾기</a>' +
            (state.hotelPoint ? '<a class="btn btn-secondary" target="_blank" rel="noopener noreferrer" href="' + escapeHtml(buildDirectionsUrl(r, state.hotelPoint)) + '">숙소에서 길찾기</a>' : '') +
            (r.reservationUrl ? '<a class="btn btn-ghost" target="_blank" rel="noopener noreferrer" href="' + escapeHtml(r.reservationUrl) + '">예약 페이지</a>' : '') +
            (state.adminSession.loggedIn ? '<button class="btn btn-admin result-admin-recommend" data-id="' + escapeHtml(r.id) + '">' + (r.adminNote ? '추천 수정' : '관리자 추천') + '</button>' : '') +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function renderPagination() {
    const total = state.results.length;
    const totalPages = Math.max(1, Math.ceil(total / state.pagination.perPage));
    if (!els.resultsPagination) return;
    if (totalPages <= 1) {
      els.resultsPagination.innerHTML = '';
      return;
    }

    const buttons = [];
    buttons.push('<button class="page-button" data-page-action="prev" ' + (state.pagination.page <= 1 ? 'disabled' : '') + '>이전</button>');
    for (let page = 1; page <= totalPages; page += 1) {
      if (page === 1 || page === totalPages || Math.abs(page - state.pagination.page) <= 1) {
        buttons.push('<button class="page-button ' + (page === state.pagination.page ? 'active' : '') + '" data-page="' + page + '">' + page + '</button>');
      } else if (Math.abs(page - state.pagination.page) === 2) {
        buttons.push('<span class="page-gap">…</span>');
      }
    }
    buttons.push('<button class="page-button" data-page-action="next" ' + (state.pagination.page >= totalPages ? 'disabled' : '') + '>다음</button>');
    els.resultsPagination.innerHTML = buttons.join('');

    els.resultsPagination.querySelectorAll('[data-page]').forEach(function (button) {
      button.addEventListener('click', function () {
        state.pagination.page = Number(button.getAttribute('data-page') || 1);
        renderResults();
        window.scrollTo({ top: Math.max(0, els.resultsList.getBoundingClientRect().top + window.scrollY - 120), behavior: 'smooth' });
      });
    });
    els.resultsPagination.querySelectorAll('[data-page-action]').forEach(function (button) {
      button.addEventListener('click', function () {
        const action = button.getAttribute('data-page-action');
        if (action === 'prev') state.pagination.page -= 1;
        if (action === 'next') state.pagination.page += 1;
        state.pagination.page = clamp(state.pagination.page, 1, totalPages);
        renderResults();
        window.scrollTo({ top: Math.max(0, els.resultsList.getBoundingClientRect().top + window.scrollY - 120), behavior: 'smooth' });
      });
    });
  }

  function renderPlanSummary() {
    if (!els.planSummary) return;
    const filled = state.plan.reduce(function (acc, day) {
      return acc + ['breakfast', 'lunch', 'dinner'].filter(function (slot) { return Boolean(day[slot]); }).length;
    }, 0);
    const total = state.plan.length * 3;
    const baseName = state.basePoint ? formatPointName(state.basePoint) : '기준 장소 미설정';
    const hotelName = state.hotelPoint ? formatPointName(state.hotelPoint) : '숙소 미설정';
    els.planSummary.innerHTML = '' +
      '<div class="plan-summary-box">' +
        '<strong>기준 장소 · ' + escapeHtml(baseName) + '</strong>' +
        '<span>총 ' + filled + ' / ' + total + '칸 채움</span>' +
      '</div>' +
      '<div class="plan-summary-box soft">' +
        '<strong>숙소 · ' + escapeHtml(hotelName) + '</strong>' +
        '<span>숙소를 입력하면 숙소 ↔ 식당 동선 링크를 함께 보여드립니다.</span>' +
      '</div>';
  }

  function formatMinutes(totalMinutes) {
    if (!totalMinutes) return '정보 없음';
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (!hours) return minutes + '분';
    if (!minutes) return hours + '시간';
    return hours + '시간 ' + minutes + '분';
  }

  function meta(label, value) {
    if (!value) return '';
    return '<div class="meta-item"><strong>' + escapeHtml(label) + '</strong><br />' + escapeHtml(String(value)) + '</div>';
  }

  function badge(text) {
    return text ? '<span class="badge">' + escapeHtml(text) + '</span>' : '';
  }

  function listHtml(items) {
    if (!items || !items.length) return '<li>정보 없음</li>';
    return items.map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join('');
  }

  function renderBasePoint() {
    const rows = [];
    if (state.basePoint) {
      rows.push('<div class="base-box"><strong>기준 장소</strong><div class="base-title">' + escapeHtml(formatPointName(state.basePoint)) + '</div>' +
        (state.basePoint.displayNameKo ? '<div class="base-sub">' + escapeHtml(state.basePoint.displayNameKo) + '</div>' : '') +
        '</div>');
    }
    if (state.hotelPoint) {
      rows.push('<div class="base-box"><strong>숙소</strong><div class="base-title">' + escapeHtml(formatPointName(state.hotelPoint)) + '</div>' +
        (state.hotelPoint.displayNameKo ? '<div class="base-sub">' + escapeHtml(state.hotelPoint.displayNameKo) + '</div>' : '') +
        '</div>');
    }
    if (!rows.length) {
      els.basePointBox.innerHTML = '<div class="base-box">기준 장소와 숙소를 아직 찾지 못했습니다. 지역 키워드 중심 검색으로도 사용할 수 있습니다.</div>';
      renderPlanSummary();
      return;
    }
    els.basePointBox.innerHTML = rows.join('');
    renderPlanSummary();
  }

  function renderInsights() {
    if (!state.pool.length) {
      els.regionInsights.innerHTML = '<div class="insight-box">검색 결과가 생기면 지역별로 자주 보이는 음식 종류를 요약해드립니다.</div>';
      return;
    }

    const counts = {};
    state.pool.forEach(function (item) {
      [item.genreKo || item.genreOriginal, item.subGenreKo || item.subGenreOriginal, item.signatureMenu].forEach(function (label) {
        if (!label) return;
        String(label).split('·').forEach(function (raw) {
          const key = raw.trim();
          if (!key) return;
          counts[key] = (counts[key] || 0) + 1;
        });
      });
    });

    const top = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; }).slice(0, 5);
    if (!top.length) {
      els.regionInsights.innerHTML = '<div class="insight-box">지역 인사이트를 만들 데이터가 부족합니다.</div>';
      return;
    }

    els.regionInsights.innerHTML = top.map(function (label) {
      return '<div class="insight-box"><strong>' + escapeHtml(label) + '</strong><br /><span class="muted">검색 결과 ' + escapeHtml(String(counts[label])) + '곳에서 확인되었습니다.</span></div>';
    }).join('');
  }

  function showFeedback(text, tone) {
    const cls = tone ? 'message-box ' + tone : 'message-box';
    els.searchFeedback.innerHTML = '<div class="' + cls + '">' + escapeHtml(text) + '</div>';
  }

  function buildFeedback(payload, filterMessage) {
    const messages = [];
    if (state.basePoint) {
      messages.push('기준 장소는 ' + formatPointName(state.basePoint) + '입니다.');
      if (state.currentQuery.mapsLink) messages.push('Google Maps 링크를 우선 기준점으로 사용했습니다.');
    } else if (state.currentQuery.region) {
      messages.push('기준 장소를 찾지 못해 지역 중심으로 검색했습니다.');
    }
    if (payload.fallbackUsed === '확장 검색어') {
      messages.push('입력하신 음식이 적게 잡혀 비슷한 장르와 확장 검색어까지 함께 반영했습니다.');
    }
    if (payload.fallbackUsed === '주변 추천') {
      messages.push('정확히 일치하는 음식이 적어 주변에서 동선이 좋은 식당도 함께 보여드립니다.');
    }
    if (filterMessage) messages.push(filterMessage);
    if (!state.results.length) {
      messages.push('조건에 맞는 결과가 없었습니다. 추천 검색어를 눌러 다시 시도해 주세요.');
    }
    return messages.join(' ');
  }

  function renderSuggestions(suggestions) {
    suggestions = Array.isArray(suggestions) ? suggestions : [];
    if (!suggestions.length) {
      els.searchSuggestions.innerHTML = '';
      return;
    }
    els.searchSuggestions.innerHTML = '<div class="suggestion-row">' + suggestions.map(function (term) {
      return '<button type="button" class="suggestion-chip" data-suggest="' + escapeHtml(term) + '">' + escapeHtml(term) + '</button>';
    }).join('') + '</div>';
    els.searchSuggestions.querySelectorAll('[data-suggest]').forEach(function (button) {
      button.addEventListener('click', function () {
        els.foodInput.value = button.getAttribute('data-suggest') || '';
        state.forceDemo = false;
        saveJson(STORAGE.forceDemo, false);
        search();
      });
    });
  }

  function getDemoPool(region, basePoint) {
    const rows = (window.DEMO_RESTAURANTS || []).map(function (item) { return Object.assign({}, item); });
    if (basePoint) {
      const near = rows.filter(function (item) {
        return haversineKm(basePoint.lat, basePoint.lng, item.lat, item.lng) <= 3.6;
      });
      if (near.length) return near;
    }
    if (!region) return rows;
    const normalizedRegion = normalize(region);
    return rows.filter(function (item) {
      const hay = normalize([item.regionKo, item.regionOriginal, item.areaKo, item.areaOriginal].join(' '));
      return hay.includes(normalizedRegion) || normalizedRegion.includes(normalize(item.regionKo || '')) || normalizedRegion.includes(normalize(item.regionOriginal || ''));
    });
  }

  function buildSuggestions(food, pool) {
    const base = getAlternativeFoodTerms(food);
    const discovered = pool.slice(0, 30).map(function (item) {
      return item.signatureMenu || item.genreKo || item.genreOriginal;
    }).filter(Boolean);
    return unique(base.concat(discovered)).filter(function (term) {
      return normalize(term) !== normalize(food || '');
    }).slice(0, 8);
  }

  function getFoodGroup(food) {
    if (!food) return null;
    const normalizedFood = normalize(food);
    return FOOD_GROUPS.find(function (group) {
      return group.aliases.some(function (alias) {
        const n = normalize(alias);
        return n === normalizedFood || n.includes(normalizedFood) || normalizedFood.includes(n);
      });
    }) || null;
  }

  function getAlternativeFoodTerms(food) {
    const group = getFoodGroup(food);
    return group ? group.suggestions.slice() : [];
  }

  function buildLiveTerms(food) {
    const group = getFoodGroup(food);
    if (!food) return [];
    return group ? unique([food].concat(group.liveTerms)) : [food];
  }

  function buildBroadTerms(food) {
    const group = getFoodGroup(food);
    if (!food) return [];
    return group ? unique([food].concat(group.aliases, group.suggestions, group.broadTerms || [])) : [food];
  }

  function scoreFoodMatch(item, food) {
    if (!food) return { score: 1, terms: [] };

    const broadTerms = buildBroadTerms(food);
    const textAll = normalize([
      item.nameKo, item.nameOriginal, item.genreKo, item.genreOriginal, item.subGenreKo, item.subGenreOriginal,
      item.catchCopyKo, item.catchCopyOriginal, item.signatureMenu, item.searchText
    ].join(' '));
    const nameGenreText = normalize([
      item.nameKo, item.nameOriginal, item.genreKo, item.genreOriginal, item.subGenreKo, item.subGenreOriginal, item.signatureMenu
    ].join(' '));

    let score = 0;
    const matched = [];

    broadTerms.forEach(function (term) {
      const normalizedTerm = normalize(term);
      if (!normalizedTerm) return;
      if (nameGenreText.includes(normalizedTerm)) {
        score += normalizedTerm.length >= 4 ? 1.5 : 1.2;
        matched.push(term);
      } else if (textAll.includes(normalizedTerm)) {
        score += normalizedTerm.length >= 4 ? 0.9 : 0.6;
        matched.push(term);
      }
    });

    const group = getFoodGroup(food);
    if (group && normalize(group.canonical) !== normalize(food)) {
      const canonical = normalize(group.canonical);
      if (nameGenreText.includes(canonical)) score += 0.8;
    }

    return {
      score: Number(score.toFixed(2)),
      terms: unique(matched).slice(0, 3),
    };
  }

  function buildKeyword(region, food) {
    return [region || '', food || ''].filter(Boolean).join(' ').trim();
  }

  function mergeById(a, b) {
    const map = new Map();
    a.concat(b).forEach(function (item) {
      if (!item || !item.id) return;
      map.set(item.id, Object.assign({}, map.get(item.id) || {}, item));
    });
    return Array.from(map.values());
  }

  function unique(list) {
    return Array.from(new Set((list || []).map(function (item) { return String(item).trim(); }).filter(Boolean)));
  }

  function formatPointName(point) {
    if (!point) return '기준 장소';
    return point.nameOriginal && point.nameKo !== point.nameOriginal
      ? point.nameKo + ' (' + point.nameOriginal + ')'
      : (point.nameKo || point.nameOriginal || '기준 장소');
  }

  function buildDirectionsUrl(restaurant, origin) {
    const dest = restaurant.lat && restaurant.lng
      ? restaurant.lat + ',' + restaurant.lng
      : encodeURIComponent([restaurant.nameOriginal || restaurant.nameKo, restaurant.addressOriginal || restaurant.addressKo].join(' ').trim());
    if (origin && origin.lat && origin.lng) {
      return 'https://www.google.com/maps/dir/?api=1&origin=' + origin.lat + ',' + origin.lng + '&destination=' + dest;
    }
    return 'https://www.google.com/maps/dir/?api=1&destination=' + dest;
  }

  function estimateMealSlots(restaurant) {
    const ranges = extractTimeRanges([restaurant.openOriginal, restaurant.openKo].join(' / '));
    if (!ranges.length) return [];
    return Object.keys(SLOT_INFO).filter(function (slot) {
      return slotRangeOverlaps(ranges, SLOT_INFO[slot]);
    }).map(function (slot) {
      return SLOT_INFO[slot].label;
    });
  }

  function openScheduleModal(id) {
    const restaurant = findRestaurant(id);
    if (!restaurant) return;
    els.dialogRestaurantId.value = restaurant.id;
    els.scheduleTitle.textContent = restaurant.displayName + ' 일정에 추가';
    els.dialogDate.value = els.startDateInput.value || toDateInput(new Date());
    els.dialogSlot.value = 'lunch';
    els.dialogNote.value = '';
    showModal(els.scheduleModal);
  }

  function closeScheduleModal() {
    hideModal(els.scheduleModal);
  }

  function saveSchedule() {
    const id = els.dialogRestaurantId.value;
    const restaurant = findRestaurant(id);
    if (!restaurant) return closeScheduleModal();

    const date = els.dialogDate.value;
    const slot = els.dialogSlot.value;
    const note = String(els.dialogNote.value || '').trim();
    const validation = validateRestaurantTime(restaurant, date, slot);
    if (!validation.ok) {
      els.planWarnings.innerHTML = '<div class="message-box error">' + escapeHtml(validation.message) + '</div>';
      return;
    }

    const dayIndex = computeDayIndex(date, getTripStartDate());
    if (dayIndex < 1 || dayIndex > state.plan.length) {
      els.planWarnings.innerHTML = '<div class="message-box error">일정표 범위를 벗어난 날짜입니다. 여행 시작일이나 여행 일수를 확인해 주세요.</div>';
      return;
    }

    const targetDay = state.plan[dayIndex - 1];
    targetDay.hotel = state.hotelPoint ? makePointDisplay(state.hotelPoint) : null;
    targetDay[slot] = {
      restaurantId: restaurant.id,
      restaurantName: restaurant.displayName,
      restaurantUrl: restaurant.url || restaurant.reservationUrl || '',
      restaurantLat: restaurant.lat || null,
      restaurantLng: restaurant.lng || null,
      note: note || (state.basePoint ? formatPointName(state.basePoint) + ' 방문 후' : ''),
      date: date,
    };

    saveJson(STORAGE.plan, state.plan);
    renderPlan();
    els.planWarnings.innerHTML = '<div class="message-box success">일정에 추가했습니다.</div>';
    closeScheduleModal();
  }

  function clearPlan() {
    if (!window.confirm('일정표를 모두 비우시겠습니까?')) return;
    state.plan = createPlan(Number(els.daysInput.value || 3));
    state.planStory = { type: '', overview: '', days: [], aiUsed: false };
    saveJson(STORAGE.plan, state.plan);
    saveJson(STORAGE.planStory, state.planStory);
    renderPlan();
    renderPlanStory();
    els.planWarnings.innerHTML = '';
  }

  function renderPlan() {
    const days = clamp(parseInt(els.daysInput.value || '3', 10), 1, 10);
    state.plan = resizePlan(state.plan, days);
    saveJson(STORAGE.plan, state.plan);

    const tripStart = getTripStartDate();
    const rows = [];
    const cards = [];
    state.plan.forEach(function (day, index) {
      day.hotel = day.hotel || (state.hotelPoint ? makePointDisplay(state.hotelPoint) : null);
      ['breakfast', 'lunch', 'dinner'].forEach(function (slot) {
        const item = day[slot];
        const rowDate = addDays(tripStart, index);
        rows.push('<tr>' +
          '<td><div class="plan-day"><strong>Day ' + (index + 1) + '</strong><span class="sub">' + escapeHtml(formatDisplayDate(rowDate)) + '</span></div></td>' +
          '<td>' + SLOT_INFO[slot].label + '</td>' +
          '<td>' + (item ? escapeHtml(item.restaurantName) : '<span class="muted">미정</span>') + '</td>' +
          '<td>' + (item ? escapeHtml(item.note || '') : '<span class="muted">-</span>') + '</td>' +
          '<td><div class="plan-actions">' +
            (item ? '<button class="small-button" data-open-restaurant="' + escapeHtml(item.restaurantId) + '">식당 보기</button>' : '<span class="muted">검색 결과에서 추가</span>') +
            (item ? '<button class="small-button danger" data-remove-slot="' + index + ':' + slot + '">삭제</button>' : '') +
          '</div></td>' +
        '</tr>');
      });

      cards.push(renderPlanDayCard(day, index + 1, addDays(tripStart, index)));
    });
    els.planTableBody.innerHTML = rows.join('');
    if (els.planRouteCards) els.planRouteCards.innerHTML = cards.join('');

    els.planTableBody.querySelectorAll('[data-remove-slot]').forEach(function (button) {
      button.addEventListener('click', function () {
        const parts = String(button.getAttribute('data-remove-slot') || '').split(':');
        const dayIndex = parseInt(parts[0], 10);
        const slot = parts[1];
        if (!state.plan[dayIndex]) return;
        state.plan[dayIndex][slot] = null;
        saveJson(STORAGE.plan, state.plan);
        renderPlan();
      });
    });

    if (els.planRouteCards) {
      els.planRouteCards.querySelectorAll('[data-open-restaurant]').forEach(function (button) {
        button.addEventListener('click', function () {
          const id = button.getAttribute('data-open-restaurant');
          openRestaurantFromPlan(id);
        });
      });
    }

    els.planTableBody.querySelectorAll('[data-open-restaurant]').forEach(function (button) {
      button.addEventListener('click', function () {
        const id = button.getAttribute('data-open-restaurant');
        openRestaurantFromPlan(id);
      });
    });
  }

  function renderPlanDayCard(day, dayNumber, date) {
    const visitHtml = (day.visits || []).map(function (visit, idx) {
      return '<div class="route-chip">' + escapeHtml((idx === 0 ? '오전' : '오후') + ' 방문지 · ' + formatPointName(visit)) + '</div>';
    }).join('');
    const steps = [];
    const hotel = day.hotel || state.hotelPoint || null;
    if (hotel && day.breakfast && day.breakfast.restaurantLat && day.breakfast.restaurantLng) {
      steps.push(renderRouteStep('숙소 → 아침', hotel, { lat: day.breakfast.restaurantLat, lng: day.breakfast.restaurantLng, nameKo: day.breakfast.restaurantName, nameOriginal: day.breakfast.restaurantName }));
    }
    if (day.visits && day.visits[0] && day.lunch && day.lunch.restaurantLat && day.lunch.restaurantLng) {
      steps.push(renderRouteStep('오전 방문지 → 점심', day.visits[0], { lat: day.lunch.restaurantLat, lng: day.lunch.restaurantLng, nameKo: day.lunch.restaurantName, nameOriginal: day.lunch.restaurantName }));
    }
    if (day.visits && day.visits[1] && day.dinner && day.dinner.restaurantLat && day.dinner.restaurantLng) {
      steps.push(renderRouteStep('오후 방문지 → 저녁', day.visits[1], { lat: day.dinner.restaurantLat, lng: day.dinner.restaurantLng, nameKo: day.dinner.restaurantName, nameOriginal: day.dinner.restaurantName }));
    }
    if (hotel && day.dinner && day.dinner.restaurantLat && day.dinner.restaurantLng) {
      steps.push(renderRouteStep('저녁 → 숙소', { lat: day.dinner.restaurantLat, lng: day.dinner.restaurantLng, nameKo: day.dinner.restaurantName, nameOriginal: day.dinner.restaurantName }, hotel));
    }
    return '<article class="day-route-card">' +
      '<div class="day-route-head"><strong>Day ' + dayNumber + '</strong><span>' + escapeHtml(formatDisplayDate(date)) + '</span></div>' +
      (hotel ? '<div class="route-chip hotel">숙소 · ' + escapeHtml(formatPointName(hotel)) + '</div>' : '') +
      (visitHtml ? '<div class="route-chip-row">' + visitHtml + '</div>' : '') +
      '<div class="route-meal-list">' +
        renderMealLine('아침', day.breakfast) +
        renderMealLine('점심', day.lunch) +
        renderMealLine('저녁', day.dinner) +
      '</div>' +
      (steps.length ? '<div class="route-step-list">' + steps.join('') + '</div>' : '<div class="muted small">숙소나 방문지를 입력하면 구간별 길찾기 링크가 함께 보입니다.</div>') +
    '</article>';
  }

  function renderMealLine(label, item) {
    if (!item) return '<div class="route-meal"><strong>' + escapeHtml(label) + '</strong><span class="muted">미정</span></div>';
    return '<div class="route-meal"><strong>' + escapeHtml(label) + '</strong><span>' + escapeHtml(item.restaurantName) + '</span>' +
      '<div class="route-inline-actions"><button class="small-button" data-open-restaurant="' + escapeHtml(item.restaurantId) + '">식당 보기</button></div></div>';
  }

  function renderRouteStep(label, origin, destination) {
    return '<a class="route-step" target="_blank" rel="noopener noreferrer" href="' + escapeHtml(buildPointDirectionsUrl(origin, destination)) + '">' +
      '<strong>' + escapeHtml(label) + '</strong><span>' + escapeHtml(formatPointName(origin)) + ' → ' + escapeHtml(formatPointName(destination)) + '</span></a>';
  }

  function autoFillPlan() {
    if (!state.results.length) {
      els.planWarnings.innerHTML = '<div class="message-box error">먼저 검색 결과를 만들어 주세요.</div>';
      return;
    }

    state.plan = createPlan(Number(els.daysInput.value || '3'));
    const slots = ['breakfast', 'lunch', 'dinner'];
    const tripStart = getTripStartDate();
    const usedRestaurantIds = new Set();
    let previousGenre = '';

    state.plan.forEach(function (day, dayIndex) {
      slots.forEach(function (slot) {
        const date = addDays(tripStart, dayIndex);
        const ranked = state.results.map(function (restaurant) {
          return {
            restaurant: restaurant,
            score: scoreRestaurantForPlan(restaurant, slot, date, previousGenre, usedRestaurantIds),
          };
        }).filter(function (item) {
          return Number.isFinite(item.score);
        }).sort(function (a, b) {
          return b.score - a.score;
        });

        const best = ranked[0];
        if (!best) return;
        const chosen = best.restaurant;
        usedRestaurantIds.add(chosen.id);
        previousGenre = chosen.genreKo || chosen.genreOriginal || previousGenre;
        day[slot] = {
          restaurantId: chosen.id,
          restaurantName: chosen.displayName,
          note: buildPlanReason(chosen, slot),
          date: toDateInput(date),
        };
      });
    });

    saveJson(STORAGE.plan, state.plan);
    setPlanStory(buildRuleBasedPlanStory('nearby-current', state.plan, state.basePoint ? [state.basePoint] : [], '현재 검색 결과를 기준으로 가까운 식당을 우선 배치했습니다.'));
    renderPlan();
    renderPlanSummary();
    els.planWarnings.innerHTML = '<div class="message-box success">추천 규칙 기준으로 일정을 채웠습니다. 정확한 동선과 실제 영업 여부는 구글맵과 공식 예약 페이지에서 한 번 더 확인해 주세요.</div>';
  }

  function scoreRestaurantForPlan(restaurant, slot, date, previousGenre, usedRestaurantIds) {
    if (usedRestaurantIds.has(restaurant.id)) return -Infinity;
    const validation = validateRestaurantTime(restaurant, toDateInput(date), slot);
    if (!validation.ok) return -Infinity;

    let score = (restaurant.travelScore || 0) * 10;
    const distanceBase = (slot === 'breakfast' || slot === 'dinner') && restaurant.hotelDistanceKm != null
      ? restaurant.hotelDistanceKm
      : restaurant.distanceKm;

    if (distanceBase != null) {
      if (distanceBase <= 0.5) score += 9;
      else if (distanceBase <= 1.0) score += 6;
      else if (distanceBase <= 1.8) score += 3;
      else score -= 2;
    }
    if (restaurant.adminNote) score += 4;
    if (restaurant.reservationUrl && slot === 'dinner') score += 1.2;
    if (previousGenre && normalize(previousGenre) === normalize(restaurant.genreKo || restaurant.genreOriginal || '')) score -= 2.5;

    const text = normalize([restaurant.genreKo, restaurant.genreOriginal, restaurant.subGenreKo, restaurant.subGenreOriginal, restaurant.signatureMenu, restaurant.nameKo, restaurant.nameOriginal].join(' '));
    if (slot === 'breakfast') {
      if (/카페|coffee|喫茶|カフェ|모닝|朝食|브런치|샌드|토스트|우동|소바|정식/.test(text)) score += 7;
      if (/이자카야|焼肉|야키니쿠|오마카세|스테이크/.test(text)) score -= 5;
      if (restaurant.lunch) score += 1;
      if (restaurant.hotelDistanceKm != null && restaurant.hotelDistanceKm <= 0.8) score += 3;
    }
    if (slot === 'lunch') {
      if (/라멘|카레|정식|돈카츠|규카츠|스시|덮밥|우동|소바/.test(text)) score += 6;
      if (restaurant.lunch) score += 3;
    }
    if (slot === 'dinner') {
      if (/이자카야|야키토리|야키니쿠|오마카세|스시|스테이크|다이닝|바|焼肉|居酒屋/.test(text)) score += 7;
      if (restaurant.lateNight) score += 3;
      if (restaurant.hotelDistanceKm != null && restaurant.hotelDistanceKm <= 1.2) score += 2;
    }

    if (restaurant.matchScore) score += Math.min(restaurant.matchScore * 2.2, 6);
    return score;
  }

  function buildPlanReason(restaurant, slot) {
    const parts = ['추천 일정'];
    if (slot === 'breakfast') parts.push('아침 시간대 영업 확인');
    if (slot === 'lunch') parts.push('점심 방문 적합');
    if (slot === 'dinner') parts.push('저녁 동선 적합');
    if (restaurant.distanceKm != null) parts.push('기준점에서 ' + restaurant.distanceKm.toFixed(2) + 'km');
    if ((slot === 'breakfast' || slot === 'dinner') && restaurant.hotelDistanceKm != null) parts.push('숙소에서 ' + restaurant.hotelDistanceKm.toFixed(2) + 'km');
    return parts.join(' · ');
  }

  function validateRestaurantTime(restaurant, dateInput, slot) {
    if (!dateInput) return { ok: false, message: '날짜를 선택해 주세요.' };
    const date = new Date(dateInput + 'T00:00:00');
    if (Number.isNaN(date.getTime())) return { ok: false, message: '날짜 형식이 올바르지 않습니다.' };

    const closedText = [restaurant.closeKo, restaurant.closeOriginal].join(' ');
    if (isClosedOnDate(closedText, date)) {
      return { ok: false, message: WEEKDAY_KO[date.getDay()] + '요일은 휴무로 보입니다.' };
    }

    const openText = normalizeTimeText([restaurant.openOriginal, restaurant.openKo].join(' / '));
    const ranges = extractTimeRanges(openText);
    if (ranges.length && !slotRangeOverlaps(ranges, SLOT_INFO[slot])) {
      return { ok: false, message: SLOT_INFO[slot].label + ' 시간대(' + SLOT_INFO[slot].start + ' ~ ' + SLOT_INFO[slot].end + ')에는 영업하지 않는 것으로 보입니다.' };
    }

    if (!ranges.length) {
      const hint = inferMealAvailabilityFromText(openText, slot);
      if (hint === false) {
        return { ok: false, message: SLOT_INFO[slot].label + ' 시간대로 보이는 영업 정보가 확인되지 않았습니다.' };
      }
    }

    return { ok: true };
  }

  function isClosedOnDate(text, date) {
    const source = String(text || '');
    if (!source) return false;
    if (/연중무휴|無休|휴무없음/i.test(source)) return false;
    if (/비정기\s*휴무|不定休/i.test(source)) return false;

    const ko = WEEKDAY_KO[date.getDay()];
    const jp = WEEKDAY_JP[date.getDay()];
    const patterns = [
      new RegExp(ko + '(요일|요)?\s*(휴무|정기\s*휴무|쉽니다)', 'i'),
      new RegExp('(휴무|정기\s*휴무|쉽니다)[^\n,]*' + ko + '(요일|요)?', 'i'),
      new RegExp(jp + '(曜)?\s*(定休|休)', 'i'),
      new RegExp('(定休|休)[^\n,]*' + jp + '(曜)?', 'i'),
    ];

    return patterns.some(function (pattern) {
      return pattern.test(source);
    });
  }

  function normalizeTimeText(text) {
    return String(text || '')
      .replace(/[０-９]/g, function (char) { return String.fromCharCode(char.charCodeAt(0) - 65248); })
      .replace(/[：]/g, ':')
      .replace(/[〜～–—]/g, '~')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function extractTimeRanges(text) {
    const source = String(text || '');
    if (!source) return [];
    if (/24\s*시간|24時間|24h|24H/i.test(source)) {
      return [{ start: 0, end: 24 * 60 }];
    }

    const ranges = [];
    const re = /(?:(익일|翌日|다음날)\s*)?(\d{1,2})[:](\d{2})\s*(?:~|-|to|TO)\s*(?:(익일|翌日|다음날)\s*)?(\d{1,2})[:](\d{2})/g;
    let match;
    while ((match = re.exec(source))) {
      let start = toMinutes(match[2] + ':' + match[3]);
      let end = toMinutes(match[5] + ':' + match[6]);
      if (!Number.isFinite(start) || !Number.isFinite(end)) continue;
      if (match[1]) start += 24 * 60;
      if (match[4]) end += 24 * 60;
      if (end <= start) end += 24 * 60;
      ranges.push({ start: start, end: end });
    }

    return ranges;
  }

  function inferMealAvailabilityFromText(text, slot) {
    const source = String(text || '');
    if (!source) return null;
    const hasBreakfast = /모닝|아침|조식|朝食|モーニング|breakfast/i.test(source);
    const hasLunch = /점심|런치|ランチ|lunch/i.test(source);
    const hasDinner = /저녁|디너|석식|ディナー|dinner|夜/i.test(source);

    if (slot === 'breakfast' && !hasBreakfast && (hasLunch || hasDinner)) return false;
    if (slot === 'lunch' && !hasLunch && hasDinner && !hasBreakfast) return false;
    if (slot === 'dinner' && !hasDinner && hasBreakfast && !hasLunch) return false;
    return null;
  }

  function slotRangeOverlaps(ranges, slotInfo) {
    const slotWindow = {
      start: toMinutes(slotInfo.start),
      end: toMinutes(slotInfo.end),
    };

    return ranges.some(function (range) {
      return overlap(range.start, range.end, slotWindow.start, slotWindow.end)
        || overlap(range.start, range.end, slotWindow.start + 1440, slotWindow.end + 1440);
    });
  }

  function overlap(aStart, aEnd, bStart, bEnd) {
    return aStart < bEnd && aEnd > bStart;
  }

  function findRestaurant(id) {
    const found = state.results.find(function (item) { return item.id === id; }) || state.pool.find(function (item) { return item.id === id; });
    return found ? augmentRestaurant(found, state.basePoint, state.currentQuery.food) : null;
  }

  function createPlan(days) {
    const list = [];
    for (let i = 0; i < days; i += 1) {
      list.push({ breakfast: null, lunch: null, dinner: null, hotel: null, visits: [] });
    }
    return list;
  }

  function resizePlan(plan, days) {
    const next = Array.isArray(plan) ? plan.slice(0, days) : [];
    next.forEach(function (day) {
      if (!('hotel' in day)) day.hotel = null;
      if (!Array.isArray(day.visits)) day.visits = [];
    });
    while (next.length < days) next.push({ breakfast: null, lunch: null, dinner: null, hotel: null, visits: [] });
    return next;
  }

  function renderAdminState() {
    const loggedIn = Boolean(state.adminSession && state.adminSession.loggedIn);
    toggleHidden(els.adminPanel, !loggedIn);
    toggleHidden(els.adminLogoutButton, !loggedIn);
    toggleHidden(els.adminLoginOpen, loggedIn);
  }

  function openAdminModal() {
    els.adminIdInput.value = '';
    els.adminPasswordInput.value = '';
    els.adminLoginMessage.textContent = '';
    showModal(els.adminLoginModal);
  }

  function closeAdminModal() {
    hideModal(els.adminLoginModal);
  }

  function submitAdminLogin() {
    const id = String(els.adminIdInput.value || '').trim();
    const password = String(els.adminPasswordInput.value || '').trim();
    if (id === 'admin' && password === 'admin') {
      state.adminSession = { loggedIn: true };
      saveJson(STORAGE.adminSession, state.adminSession);
      renderAdminState();
      renderAdminOptions();
      renderAdminList();
      renderResults();
      closeAdminModal();
      return;
    }
    els.adminLoginMessage.textContent = '아이디 또는 비밀번호가 다릅니다.';
  }

  function logoutAdmin() {
    state.adminSession = { loggedIn: false };
    saveJson(STORAGE.adminSession, state.adminSession);
    renderAdminState();
    renderResults();
  }

  function renderAdminOptions() {
    if (!state.adminSession.loggedIn) return;
    const options = ['<option value="">식당을 선택해 주세요</option>'].concat(state.results.map(function (item) {
      return '<option value="' + escapeHtml(item.id) + '">' + escapeHtml(item.displayName) + '</option>';
    }));
    els.adminRestaurantSelect.innerHTML = options.join('');
  }

  function saveAdminNote() {
    if (!state.adminSession.loggedIn) return;
    const id = els.adminRestaurantSelect.value;
    const reason = String(els.adminReason.value || '').trim();
    if (!id || !reason) {
      els.adminList.innerHTML = '<li>식당과 추천 이유를 모두 입력해 주세요.</li>';
      return;
    }
    state.adminNotes[id] = reason;
    saveJson(STORAGE.admin, state.adminNotes);
    els.adminReason.value = '';
    applyAdminNotesToCollections();
    renderResults();
    renderAdminList();
  }

  function renderAdminList() {
    if (!state.adminSession.loggedIn) return;
    const entries = Object.keys(state.adminNotes);
    if (!entries.length) {
      els.adminList.innerHTML = '<li>저장된 관리자 추천이 아직 없습니다.</li>';
      return;
    }
    els.adminList.innerHTML = entries.map(function (id) {
      const restaurant = findRestaurant(id);
      const label = restaurant ? restaurant.displayName : id;
      return '<li><strong>' + escapeHtml(label) + '</strong><br />' + escapeHtml(state.adminNotes[id]) + '</li>';
    }).join('');
  }

  function renderPlanStory() {
    if (!els.planStory) return;
    const story = state.planStory || {};
    if (!story.overview && !(story.days && story.days.length)) {
      els.planStory.innerHTML = '<div class="story-box empty">추천으로 일정 짜기를 누르면 왜 이런 일정이 나왔는지 함께 보여드립니다.</div>';
      return;
    }

    const headerBits = [];
    if (story.type === 'nearby-multi') headerBits.push('입력한 방문 후보 중심');
    if (story.type === 'regional-auto') headerBits.push('지역 자동 코스');
    if (story.type === 'nearby-current') headerBits.push('현재 검색 결과 기반');
    if (story.aiUsed) headerBits.push('Gemini 설명 사용');

    const daysHtml = (story.days || []).map(function (day) {
      return '<div class="story-day">' +
        '<strong>Day ' + escapeHtml(String(day.day)) + '</strong>' +
        (day.title ? '<span class="story-day-title">' + escapeHtml(day.title) + '</span>' : '') +
        (day.why ? '<p>' + escapeHtml(day.why) + '</p>' : '') +
      '</div>';
    }).join('');

    els.planStory.innerHTML = '' +
      '<div class="story-box">' +
        '<div class="story-head"><strong>추천 일정 설명</strong>' +
        (headerBits.length ? '<span class="story-mode">' + escapeHtml(headerBits.join(' · ')) + '</span>' : '') +
        '</div>' +
        (story.overview ? '<p class="story-overview">' + escapeHtml(story.overview) + '</p>' : '') +
        (daysHtml ? '<div class="story-days">' + daysHtml + '</div>' : '') +
      '</div>';
  }

  function setPlanStory(story) {
    state.planStory = story || { type: '', overview: '', days: [], aiUsed: false };
    saveJson(STORAGE.planStory, state.planStory);
    renderPlanStory();
  }

  function isLikelyClosedRestaurant(restaurant) {
    if (!restaurant) return false;
    const source = [
      restaurant.nameKo, restaurant.nameOriginal, restaurant.catchCopyKo, restaurant.catchCopyOriginal,
      restaurant.openKo, restaurant.openOriginal, restaurant.closeKo, restaurant.closeOriginal,
      restaurant.searchText
    ].filter(Boolean).join(' ');
    return /(폐업|영업종료|장기휴업|휴업중|閉店|閉業|営業終了|掲載終了|掲載保留|長期休業|休業中|閉店しました|閉業しました)/i.test(source);
  }

  function openRestaurantFromPlan(id) {
    if (!id) return;
    let index = state.results.findIndex(function (item) { return item.id === id; });

    if (index < 0) {
      const poolItem = state.pool.find(function (item) { return item.id === id; });
      if (poolItem) {
        const augmented = augmentRestaurant(poolItem, state.basePoint, state.currentQuery.food);
        state.results = mergeById([augmented], state.results).sort(sortRestaurantsForDisplay(state.currentQuery.food));
        index = state.results.findIndex(function (item) { return item.id === id; });
      }
    }

    const target = findRestaurant(id);
    if (index < 0 && target && target.url) {
      window.open(target.url, '_blank', 'noopener,noreferrer');
      return;
    }
    if (index < 0) return;

    state.pagination.page = Math.floor(index / state.pagination.perPage) + 1;
    setView('search');
    renderResults();
    window.requestAnimationFrame(function () {
      const card = document.querySelector('[data-result-id="' + cssEscape(id) + '"]');
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('pulse-highlight');
        window.setTimeout(function () {
          card.classList.remove('pulse-highlight');
        }, 1800);
      }
    });
  }

  function openAdminRecommendModal(id) {
    if (!state.adminSession.loggedIn) {
      openAdminModal();
      return;
    }
    const restaurant = findRestaurant(id);
    if (!restaurant) return;
    state.pendingAdminRestaurantId = id;
    els.adminRecommendRestaurantId.value = id;
    els.adminRecommendTitle.textContent = restaurant.displayName + ' 추천 설정';
    els.adminRecommendReason.value = state.adminNotes[id] || '';
    els.adminRecommendMessage.textContent = '';
    showModal(els.adminRecommendModal);
  }

  function closeAdminRecommendModal() {
    hideModal(els.adminRecommendModal);
  }

  function saveAdminRecommendationFromModal() {
    if (!state.adminSession.loggedIn) return;
    const id = String(els.adminRecommendRestaurantId.value || '').trim();
    const reason = String(els.adminRecommendReason.value || '').trim();
    if (!id || !reason) {
      els.adminRecommendMessage.textContent = '추천 이유를 입력해 주세요.';
      return;
    }
    state.adminNotes[id] = reason;
    saveJson(STORAGE.admin, state.adminNotes);
    applyAdminNotesToCollections();
    renderResults();
    renderAdminOptions();
    renderAdminList();
    closeAdminRecommendModal();
  }

  function removeAdminRecommendationFromModal() {
    const id = String(els.adminRecommendRestaurantId.value || '').trim();
    if (!id) return;
    delete state.adminNotes[id];
    saveJson(STORAGE.admin, state.adminNotes);
    applyAdminNotesToCollections();
    renderResults();
    renderAdminOptions();
    renderAdminList();
    closeAdminRecommendModal();
  }

  function applyAdminNotesToCollections() {
    state.results = state.results.map(function (item) {
      item.adminNote = state.adminNotes[item.id] || '';
      return item;
    });
    state.pool = state.pool.map(function (item) {
      item.adminNote = state.adminNotes[item.id] || '';
      return item;
    });
  }

  function openPlanOptionModal() {
    if (els.planExtraPlaces) {
      const currentLine = [state.currentQuery.base || '', state.currentQuery.mapsLink || ''].filter(Boolean).join('\n');
      els.planExtraPlaces.value = currentLine;
    }
    if (els.planUseAi) {
      els.planUseAi.checked = false;
      els.planUseAi.disabled = !state.geminiAvailable;
    }
    if (els.planAiState) {
      const hotelText = state.hotelPoint ? ' 숙소 기준 경로도 함께 계산합니다.' : ' 숙소를 입력하면 더 체계적인 동선을 만들어 드립니다.';
      els.planAiState.textContent = state.geminiAvailable
        ? 'Gemini API 키가 연결되어 있으면 여행 이유 설명과 번역을 더 자연스럽게 만들어 드립니다.' + hotelText
        : 'Gemini API 키가 없어서 지금은 규칙 기반 설명과 번역으로 동작합니다.' + hotelText;
    }
    if (els.planOptionMessage) els.planOptionMessage.textContent = '';
    showModal(els.planOptionModal);
  }

  function closePlanOptionModal() {
    hideModal(els.planOptionModal);
  }

  function getSelectedPlanMode() {
    var checked = document.querySelector('input[name="plan-mode"]:checked');
    return checked ? checked.value : 'nearby';
  }

  function submitPlanOptionModal() {
    syncQueryFromInputs(true);
    const mode = getSelectedPlanMode();
    const useAi = Boolean(els.planUseAi && els.planUseAi.checked && state.geminiAvailable);
    if (els.planOptionGenerate) els.planOptionGenerate.disabled = true;
    const task = mode === 'full'
      ? generateRegionalAutoPlan(useAi)
      : generateNearbyPlacePlan(useAi);

    task.then(function () {
      closePlanOptionModal();
      setView('plan');
    }).catch(function (error) {
      console.error(error);
      if (els.planOptionMessage) {
        els.planOptionMessage.textContent = error && error.message ? error.message : '추천 일정 생성 중 오류가 발생했습니다.';
      }
    }).finally(function () {
      if (els.planOptionGenerate) els.planOptionGenerate.disabled = false;
    });
  }

  function parsePlaceLines(text) {
    return unique(String(text || '').split(/\r?\n/).map(function (line) { return line.trim(); }).filter(Boolean));
  }

  function makePointDisplay(point) {
    return {
      nameKo: point.nameKo || point.displayNameKo || '기준 장소',
      nameOriginal: point.nameOriginal || point.displayNameOriginal || '',
      displayNameKo: point.displayNameKo || point.nameKo || '기준 장소',
      displayNameOriginal: point.displayNameOriginal || point.nameOriginal || '',
      lat: point.lat,
      lng: point.lng,
      source: point.source || 'manual',
      area: point.area || '',
      priority: point.priority || 0,
      autoAdded: Boolean(point.autoAdded),
      query: point.query || '',
    };
  }

  function resolvePointLine(line) {
    if (!line) return Promise.resolve(null);
    if (/^https?:\/\//i.test(line)) {
      return resolveBasePoint(state.currentQuery.region, '', line);
    }
    return resolveBasePoint(state.currentQuery.region, line, '');
  }

  function fetchCandidatesAroundPoint(point, foodQuery) {
    const localQuery = Object.assign({}, state.currentQuery, { food: foodQuery || '' });
    return fetchRestaurants(localQuery, point).then(function (payload) {
      const results = (payload.results || []).map(function (item) {
        return augmentRestaurant(item, point, localQuery.food);
      }).filter(function (item) {
        return !isLikelyClosedRestaurant(item);
      }).sort(sortRestaurantsForDisplay(localQuery.food));
      return {
        point: point,
        results: results,
      };
    });
  }

  function chooseRestaurantForSlot(list, slot, date, previousGenre, usedRestaurantIds) {
    const ranked = list.map(function (restaurant) {
      return {
        restaurant: restaurant,
        score: scoreRestaurantForPlan(restaurant, slot, date, previousGenre, usedRestaurantIds),
      };
    }).filter(function (item) {
      return Number.isFinite(item.score);
    }).sort(function (a, b) {
      return b.score - a.score;
    });
    return ranked.length ? ranked[0].restaurant : null;
  }

  function pointKey(point) {
    if (!point) return '';
    return [normalize(formatPointName(point)), Number(point.lat || 0).toFixed(4), Number(point.lng || 0).toFixed(4)].join('|');
  }

  function distanceBetweenPoints(a, b) {
    if (!a || !b || !Number.isFinite(Number(a.lat)) || !Number.isFinite(Number(a.lng)) || !Number.isFinite(Number(b.lat)) || !Number.isFinite(Number(b.lng))) {
      return NaN;
    }
    return haversineKm(Number(a.lat), Number(a.lng), Number(b.lat), Number(b.lng));
  }

  function findRegionCatalog(region) {
    const key = Object.keys(REGION_TRAVEL_SPOTS).find(function (item) {
      return normalize(item) === normalize(region || '') || normalize(item).includes(normalize(region || '')) || normalize(region || '').includes(normalize(item));
    });
    return key ? REGION_TRAVEL_SPOTS[key] : [];
  }

  function resolveCatalogSpot(entry, region) {
    if (!entry) return Promise.resolve(null);
    if (entry.lat && entry.lng) {
      return Promise.resolve(makePointDisplay(Object.assign({ source: 'catalog' }, entry)));
    }
    const queryText = entry.query || entry.nameOriginal || entry.nameKo || '';
    return resolveBasePoint(region, queryText, '').then(function (point) {
      if (!point) return null;
      return makePointDisplay(Object.assign({}, point, {
        nameKo: entry.nameKo || point.nameKo,
        nameOriginal: entry.nameOriginal || point.nameOriginal,
        displayNameKo: entry.displayNameKo || point.displayNameKo || entry.nameKo || point.nameKo,
        displayNameOriginal: entry.displayNameOriginal || point.displayNameOriginal || entry.nameOriginal || point.nameOriginal,
        area: entry.area || '',
        priority: entry.priority || 0,
        source: 'catalog',
        query: queryText,
      }));
    }).catch(function () {
      return null;
    });
  }

  function buildExpandedPointSet(initialPoints, region, targetCount) {
    const seedPoints = uniquePoints(initialPoints || []);
    const catalog = findRegionCatalog(region);
    const safeTarget = Math.max(targetCount || 0, seedPoints.length || 0);
    if (!catalog.length) {
      return Promise.resolve({ points: seedPoints, addedCount: 0, seedCount: seedPoints.length });
    }

    return Promise.all(catalog.map(function (entry) { return resolveCatalogSpot(entry, region); })).then(function (rows) {
      const catalogPoints = uniquePoints(rows.filter(Boolean));
      const used = {};
      const result = [];

      function addPoint(point, autoAdded) {
        const normalized = pointKey(point);
        if (!normalized || used[normalized]) return false;
        used[normalized] = true;
        result.push(makePointDisplay(Object.assign({}, point, { autoAdded: Boolean(autoAdded) })));
        return true;
      }

      seedPoints.forEach(function (point) { addPoint(point, false); });

      function remainingCatalog() {
        return catalogPoints.filter(function (point) { return !used[pointKey(point)]; });
      }

      if (seedPoints.length) {
        seedPoints.forEach(function (seed) {
          if (result.length >= safeTarget) return;
          const candidate = remainingCatalog().sort(function (a, b) {
            const ad = distanceBetweenPoints(seed, a);
            const bd = distanceBetweenPoints(seed, b);
            if (Number.isFinite(ad) && Number.isFinite(bd) && ad !== bd) return ad - bd;
            if ((b.priority || 0) !== (a.priority || 0)) return (b.priority || 0) - (a.priority || 0);
            return String(a.area || '').localeCompare(String(b.area || ''));
          })[0];
          if (candidate) addPoint(candidate, true);
        });
      }

      remainingCatalog().sort(function (a, b) {
        const ad = seedPoints.length ? Math.min.apply(null, seedPoints.map(function (seed) { return distanceBetweenPoints(seed, a); }).filter(Number.isFinite)) : NaN;
        const bd = seedPoints.length ? Math.min.apply(null, seedPoints.map(function (seed) { return distanceBetweenPoints(seed, b); }).filter(Number.isFinite)) : NaN;
        if (Number.isFinite(ad) && Number.isFinite(bd) && ad !== bd) return ad - bd;
        if ((b.priority || 0) !== (a.priority || 0)) return (b.priority || 0) - (a.priority || 0);
        return String(a.area || '').localeCompare(String(b.area || ''));
      }).forEach(function (point) {
        if (result.length < safeTarget) addPoint(point, true);
      });

      return {
        points: uniquePoints(result),
        addedCount: Math.max(0, result.length - seedPoints.length),
        seedCount: seedPoints.length,
      };
    });
  }

  function ensureRegionalSeed(region) {
    if (!region) return Promise.resolve([]);
    return resolveBasePoint(region, '', '').then(function (point) {
      return point ? [makePointDisplay(Object.assign({}, point, { source: 'region-center' }))] : [];
    }).catch(function () {
      return [];
    });
  }

  function generateNearbyPlacePlan(useAi) {
    const liveQuery = syncQueryFromInputs(true);
    const lines = parsePlaceLines(els.planExtraPlaces ? els.planExtraPlaces.value : '');
    const defaults = [];
    if (liveQuery.mapsLink) defaults.push(liveQuery.mapsLink);
    if (liveQuery.base) defaults.push(liveQuery.base);
    const inputs = lines.length ? lines : defaults;
    const fallbackPoint = state.basePoint ? [makePointDisplay(state.basePoint)] : [];
    const targetCount = Math.max(liveQuery.days * 2, inputs.length || fallbackPoint.length || 1);

    return Promise.all(inputs.map(resolvePointLine)).then(function (resolved) {
      let points = resolved.filter(Boolean).map(makePointDisplay);
      if (!points.length) points = fallbackPoint;
      const expansion = points.length
        ? Promise.resolve({ points: points, addedCount: 0, seedCount: points.length })
        : ensureRegionalSeed(liveQuery.region).then(function (regionSeed) {
            return { points: regionSeed, addedCount: 0, seedCount: regionSeed.length };
          });
      return expansion;
    }).then(function (seedPayload) {
      if (!seedPayload.points.length) {
        throw new Error('방문 후보 장소나 Google Maps 링크를 하나 이상 넣어 주세요. 지역만 입력했다면 자동 코스 모드를 사용해 주세요.');
      }
      return buildExpandedPointSet(seedPayload.points, liveQuery.region, targetCount).then(function (expanded) {
        return Promise.all(expanded.points.map(function (point) {
          return fetchCandidatesAroundPoint(point, liveQuery.food || '');
        })).then(function (groups) {
          const overview = expanded.addedCount > 0
            ? '입력한 방문 후보를 우선 배치하고, 빈 시간대는 ' + (liveQuery.region || '해당 지역') + '에서 많이 가는 장소를 추가로 보강해 일정으로 만들었습니다.'
            : '입력한 방문 후보를 오전 / 오후 방문지로 나누고, 각 지점 근처 식당과 숙소 동선을 함께 묶어 일정으로 만들었습니다.';
          return fillPlanFromPointGroups(groups, {
            type: 'nearby-multi',
            useAi: useAi,
            overviewSeed: overview,
          });
        });
      });
    });
  }

  function generateRegionalAutoPlan(useAi) {
    const liveQuery = syncQueryFromInputs(true);
    const days = clamp(parseInt(els.daysInput.value || '3', 10), 1, 10);
    const targetCount = Math.max(days * 2, 2);
    const lines = parsePlaceLines(els.planExtraPlaces ? els.planExtraPlaces.value : '');

    return Promise.all(lines.map(resolvePointLine)).then(function (resolved) {
      const seedPoints = uniquePoints(resolved.filter(Boolean).map(makePointDisplay));
      if (seedPoints.length) {
        return { points: seedPoints, seedCount: seedPoints.length };
      }
      if (findRegionCatalog(liveQuery.region).length) {
        return { points: [], seedCount: 0 };
      }
      return ensureRegionalSeed(liveQuery.region).then(function (seed) {
        return { points: seed, seedCount: seed.length };
      });
    }).then(function (seedPayload) {
      return buildExpandedPointSet(seedPayload.points, liveQuery.region, targetCount).then(function (expanded) {
        let finalPoints = expanded.points;
        if (!finalPoints.length && state.basePoint) finalPoints = [makePointDisplay(state.basePoint)];
        if (!finalPoints.length) {
          throw new Error('이 지역은 아직 자동 여행 코스 템플릿이 부족합니다. 지역명이나 가고 싶은 장소를 한두 개 더 적어 주세요.');
        }
        return Promise.all(finalPoints.map(function (point) {
          return fetchCandidatesAroundPoint(point, '');
        })).then(function (groups) {
          const overview = seedPayload.seedCount
            ? (liveQuery.region || '입력한 지역') + '에서 사용자가 넣은 장소를 먼저 살리고, 가까운 인기 장소를 추가로 보강해 하루 2 ~ 3개의 동선으로 나눴습니다.'
            : (liveQuery.region || '입력한 지역') + '에서 많이 가는 장소를 중심으로 오전 / 오후 방문지를 나누고, 근처 식당과 숙소 동선을 함께 섞어 일정으로 만들었습니다.';
          return fillPlanFromPointGroups(groups, {
            type: 'regional-auto',
            useAi: useAi,
            overviewSeed: overview,
          });
        });
      });
    });
  }

  function fillPlanFromPointGroups(pointGroups, options) {
    options = options || {};
    if (!pointGroups.length) throw new Error('추천 일정에 쓸 기준 장소를 만들지 못했습니다.');

    const days = clamp(parseInt(els.daysInput.value || '3', 10), 1, 10);
    const tripStart = getTripStartDate();
    const usedRestaurantIds = new Set();
    let previousGenre = '';
    state.plan = createPlan(days);

    const storyDays = [];
    for (var dayIndex = 0; dayIndex < days; dayIndex += 1) {
      const morningGroup = pointGroups[(dayIndex * 2) % pointGroups.length];
      const afternoonGroup = pointGroups[(dayIndex * 2 + 1) % pointGroups.length] || morningGroup;
      const morningPoint = morningGroup.point;
      const afternoonPoint = afternoonGroup.point;
      const breakfastSource = state.hotelPoint ? state.results : (morningGroup.results && morningGroup.results.length ? morningGroup.results : state.results);
      const lunchSource = morningGroup.results && morningGroup.results.length ? morningGroup.results : state.results;
      const dinnerSource = afternoonGroup.results && afternoonGroup.results.length ? afternoonGroup.results : state.results;
      const date = addDays(tripStart, dayIndex);

      state.plan[dayIndex].hotel = state.hotelPoint ? makePointDisplay(state.hotelPoint) : null;
      state.plan[dayIndex].visits = uniquePoints([morningPoint, afternoonPoint]);

      var breakfast = chooseRestaurantForSlot(breakfastSource, 'breakfast', date, previousGenre, usedRestaurantIds);
      if (breakfast) {
        usedRestaurantIds.add(breakfast.id);
        previousGenre = breakfast.genreKo || breakfast.genreOriginal || previousGenre;
        state.plan[dayIndex].breakfast = makePlanMeal(breakfast, date, '숙소 출발 전후 아침 식사');
      }

      var lunch = chooseRestaurantForSlot(lunchSource, 'lunch', date, previousGenre, usedRestaurantIds);
      if (lunch) {
        usedRestaurantIds.add(lunch.id);
        previousGenre = lunch.genreKo || lunch.genreOriginal || previousGenre;
        state.plan[dayIndex].lunch = makePlanMeal(lunch, date, formatPointName(morningPoint) + ' 근처 점심');
      }

      var dinner = chooseRestaurantForSlot(dinnerSource, 'dinner', date, previousGenre, usedRestaurantIds);
      if (dinner) {
        usedRestaurantIds.add(dinner.id);
        previousGenre = dinner.genreKo || dinner.genreOriginal || previousGenre;
        state.plan[dayIndex].dinner = makePlanMeal(dinner, date, formatPointName(afternoonPoint) + ' 근처 저녁');
      }

      storyDays.push({
        day: dayIndex + 1,
        title: formatPointName(morningPoint) + (afternoonPoint && normalize(formatPointName(afternoonPoint)) !== normalize(formatPointName(morningPoint)) ? ' → ' + formatPointName(afternoonPoint) : ''),
        why: '오전에는 ' + formatPointName(morningPoint) + ', 오후에는 ' + formatPointName(afternoonPoint) + ' 쪽을 보도록 나누고, 각 지점 근처에서 식사 시간을 맞추기 쉬운 곳을 우선 골랐습니다.',
        visitPlace: formatPointName(morningPoint),
      });
    }

    saveJson(STORAGE.plan, state.plan);
    renderPlan();

    return maybeEnhancePlanStoryWithAi({
      type: options.type || 'nearby-multi',
      aiUsed: false,
      overview: options.overviewSeed || '추천 일정 설명',
      days: storyDays,
    }, options.useAi);
  }

  function maybeEnhancePlanStoryWithAi(baseStory, useAi) {
    if (!useAi || !state.geminiAvailable) {
      setPlanStory(baseStory);
      els.planWarnings.innerHTML = '<div class="message-box success">추천 일정을 만들었습니다. 설명은 규칙 기반으로 작성했습니다.</div>';
      return Promise.resolve(baseStory);
    }

    const payload = {
      region: state.currentQuery.region || '',
      days: state.plan.map(function (day, index) {
        return {
          day: index + 1,
          breakfast: day.breakfast ? day.breakfast.restaurantName : '',
          lunch: day.lunch ? day.lunch.restaurantName : '',
          dinner: day.dinner ? day.dinner.restaurantName : '',
          note: [day.breakfast && day.breakfast.note, day.lunch && day.lunch.note, day.dinner && day.dinner.note].filter(Boolean)[0] || '',
          title: baseStory.days[index] ? baseStory.days[index].title : '',
        };
      }),
      type: baseStory.type,
      overview: baseStory.overview,
    };

    return fetch('/api/ai/trip-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(function (response) {
      if (!response.ok) throw new Error('ai_plan_failed');
      return response.json();
    }).then(function (json) {
      const nextStory = {
        type: baseStory.type,
        aiUsed: true,
        overview: json.overview || baseStory.overview,
        days: Array.isArray(json.days) && json.days.length ? json.days : baseStory.days,
      };
      setPlanStory(nextStory);
      els.planWarnings.innerHTML = '<div class="message-box success">Gemini 설명을 붙여 추천 일정을 만들었습니다.</div>';
      return nextStory;
    }).catch(function () {
      setPlanStory(baseStory);
      els.planWarnings.innerHTML = '<div class="message-box success">추천 일정은 만들었지만 Gemini 설명은 불러오지 못했습니다. 규칙 기반 설명으로 대체했습니다.</div>';
      return baseStory;
    });
  }

  function buildRuleBasedPlanStory(type, plan, points, overview) {
    const days = plan.map(function (day, index) {
      const point = points[index % Math.max(1, points.length)] || state.basePoint || null;
      const mealNames = [day.breakfast, day.lunch, day.dinner].filter(Boolean).map(function (item) { return item.restaurantName; });
      return {
        day: index + 1,
        title: point ? formatPointName(point) : '추천 동선',
        why: mealNames.length ? '선정 식당: ' + mealNames.join(' → ') : '해당 날짜에 맞는 영업시간 식당을 우선 배치했습니다.',
      };
    });
    return {
      type: type || 'nearby-current',
      aiUsed: false,
      overview: overview || '현재 검색 결과와 영업시간을 기준으로 무난한 일정을 골랐습니다.',
      days: days,
    };
  }

  
  function maybeTranslateVisibleResults() {
    if (!state.geminiAvailable || state.translationInFlight || !state.results.length) return;
    const startIndex = (state.pagination.page - 1) * state.pagination.perPage;
    const pageItems = state.results.slice(startIndex, startIndex + state.pagination.perPage);
    const pending = pageItems.filter(function (item) {
      return item && item.id && !state.translations[item.id] && (item.nameOriginal || item.catchCopyOriginal || item.accessOriginal || item.openOriginal || item.closeOriginal);
    }).slice(0, 6);
    if (!pending.length) return;

    state.translationInFlight = true;
    fetch('/api/ai/translate-restaurants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurants: pending.map(function (item) {
          return {
            id: item.id,
            nameOriginal: item.nameOriginal || '',
            catchCopyOriginal: item.catchCopyOriginal || '',
            accessOriginal: item.accessOriginal || '',
            openOriginal: item.openOriginal || '',
            closeOriginal: item.closeOriginal || '',
            signatureMenu: item.signatureMenu || '',
          };
        }),
      }),
    }).then(function (response) {
      if (!response.ok) throw new Error('ai_translate_failed');
      return response.json();
    }).then(function (json) {
      const items = Array.isArray(json.restaurants) ? json.restaurants : [];
      items.forEach(function (row) {
        if (!row || !row.id) return;
        state.translations[row.id] = {
          nameKo: row.nameKo || '',
          catchCopyKo: row.catchCopyKo || '',
          accessKo: row.accessKo || '',
          openKo: row.openKo || '',
          closeKo: row.closeKo || '',
          signatureMenuKo: row.signatureMenuKo || '',
        };
      });
      saveJson(STORAGE.translationCache, state.translations);
      state.results = state.results.map(function (item) { return augmentRestaurant(item, state.basePoint, state.currentQuery.food); });
      state.pool = state.pool.map(function (item) { return augmentRestaurant(item, state.basePoint, state.currentQuery.food); });
      renderResults();
    }).catch(function () {
      // ignore translation errors
    }).finally(function () {
      state.translationInFlight = false;
    });
  }

  function uniquePoints(points) {
    const seen = {};
    return (points || []).filter(Boolean).filter(function (point) {
      const key = [point.lat, point.lng, normalize(formatPointName(point))].join('|');
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    }).map(makePointDisplay);
  }

  function makePlanMeal(restaurant, date, note) {
    return {
      restaurantId: restaurant.id,
      restaurantName: restaurant.displayName,
      restaurantUrl: restaurant.url || restaurant.reservationUrl || '',
      restaurantLat: restaurant.lat || null,
      restaurantLng: restaurant.lng || null,
      note: note || '',
      date: toDateInput(date),
    };
  }

  function buildPointDirectionsUrl(origin, destination) {
    var originValue = origin && origin.lat && origin.lng
      ? origin.lat + ',' + origin.lng
      : encodeURIComponent([origin && (origin.nameOriginal || origin.nameKo || ''), origin && (origin.addressOriginal || origin.addressKo || '')].join(' ').trim());
    var destValue = destination && destination.lat && destination.lng
      ? destination.lat + ',' + destination.lng
      : encodeURIComponent([destination && (destination.nameOriginal || destination.nameKo || ''), destination && (destination.addressOriginal || destination.addressKo || '')].join(' ').trim());
    return 'https://www.google.com/maps/dir/?api=1&origin=' + originValue + '&destination=' + destValue;
  }

function showModal(node) {
    if (!node) return;
    node.classList.remove('hidden');
    node.setAttribute('aria-hidden', 'false');
  }

  function hideModal(node) {
    if (!node) return;
    node.classList.add('hidden');
    node.setAttribute('aria-hidden', 'true');
  }

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function saveJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // ignore localStorage errors
    }
  }

  function normalize(text) {
    return String(text || '').toLowerCase().replace(/\s+/g, '').replace(/[()（）._-]/g, '');
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function toggleHidden(node, hidden) {
    if (!node) return;
    node.classList.toggle('hidden', Boolean(hidden));
  }

  function clamp(value, min, max) {
    if (Number.isNaN(value)) return min;
    return Math.max(min, Math.min(max, value));
  }

  function haversineKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLng = deg2rad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function deg2rad(value) {
    return value * (Math.PI / 180);
  }

  function parseWalkMinutes(text) {
    const m = String(text || '').match(/도보\s*(\d+)분|徒歩\s*(\d+)分/);
    return m ? parseInt(m[1] || m[2], 10) : null;
  }

  function estimateWalkMinutesFromDistance(distanceKm) {
    if (distanceKm == null || !Number.isFinite(distanceKm)) return null;
    return Math.max(1, Math.round((distanceKm / 4.2) * 60));
  }

  function toMinutes(hm) {
    const parts = String(hm).split(':');
    const hour = parseInt(parts[0], 10);
    const minute = parseInt(parts[1], 10);
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) return NaN;
    return hour * 60 + minute;
  }

  function computeDayIndex(dateInput, tripStartDate) {
    const selected = new Date(dateInput + 'T00:00:00');
    const start = new Date(tripStartDate);
    start.setHours(0, 0, 0, 0);
    return Math.floor((selected - start) / 86400000) + 1;
  }

  function addDays(date, delta) {
    const next = new Date(date);
    next.setDate(next.getDate() + delta);
    return next;
  }

  function getTripStartDate() {
    const raw = els.startDateInput.value || toDateInput(new Date());
    return new Date(raw + 'T00:00:00');
  }

  function toDateInput(date) {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }

  function formatDisplayDate(date) {
    return date.getFullYear() + '.' + String(date.getMonth() + 1).padStart(2, '0') + '.' + String(date.getDate()).padStart(2, '0') + ' (' + WEEKDAY_KO[date.getDay()] + ')';
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === 'function') {
      return window.CSS.escape(value);
    }
    return String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
  }
})();
