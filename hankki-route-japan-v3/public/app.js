(function () {
  'use strict';

  const STORAGE = {
    query: 'hankkiRouteJapan.query.v4',
    plan: 'hankkiRouteJapan.plan.v4',
    admin: 'hankkiRouteJapan.admin.v4',
    adminSession: 'hankkiRouteJapan.adminSession.v4',
    forceDemo: 'hankkiRouteJapan.forceDemo.v4',
    basePoint: 'hankkiRouteJapan.basePoint.v4',
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
    오사카: '大阪',
    난바: '難波',
    도톤보리: '道頓堀',
    교토: '京都',
    후쿠오카: '福岡',
    하카타: '博多',
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

  const state = {
    apiAvailable: false,
    liveEnabled: false,
    forceDemo: readJson(STORAGE.forceDemo, false),
    currentQuery: readJson(STORAGE.query, {
      region: '아키하바라',
      base: '라디오회관',
      food: '라멘',
      startDate: toDateInput(new Date()),
      days: 3,
      minScore: 3,
    }),
    basePoint: readJson(STORAGE.basePoint, null),
    results: [],
    pool: [],
    plan: readJson(STORAGE.plan, createPlan(3)),
    adminNotes: readJson(STORAGE.admin, {}),
    adminSession: readJson(STORAGE.adminSession, { loggedIn: false }),
    searchSuggestions: [],
    feedback: '',
    sourceLabel: '데모 데이터',
  };

  const els = {};

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    cache();
    restoreInputs();
    bind();
    renderAdminState();
    renderBasePoint();
    renderPlan();
    renderAdminList();
    detectApi().then(function () {
      return search({ silent: true });
    }).catch(function () {
      showFeedback('초기 검색에 실패했습니다. 데모 데이터로 다시 시도해 주세요.', 'error');
    });
  }

  function cache() {
    ids([
      'mode-badge', 'api-status', 'region-input', 'base-input', 'food-input', 'start-date-input', 'days-input',
      'min-score-input', 'min-score-value', 'search-button', 'demo-button', 'auto-plan-button', 'search-feedback',
      'search-suggestions', 'base-point-box', 'region-insights', 'results-meta', 'results-list', 'booking-guide',
      'plan-warnings', 'plan-table-body', 'clear-plan-button', 'admin-panel', 'admin-restaurant-select',
      'admin-reason', 'admin-save-button', 'admin-list', 'admin-login-open', 'admin-logout-button', 'schedule-modal',
      'schedule-title', 'dialog-restaurant-id', 'dialog-date', 'dialog-slot', 'dialog-note', 'dialog-save',
      'dialog-cancel', 'admin-login-modal', 'admin-id-input', 'admin-password-input', 'admin-login-message',
      'admin-login-submit', 'admin-login-cancel'
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
    els.foodInput.value = q.food || '';
    els.startDateInput.value = q.startDate || toDateInput(new Date());
    els.daysInput.value = String(q.days || 3);
    els.minScoreInput.value = String(q.minScore || 3);
    els.minScoreValue.textContent = Number(els.minScoreInput.value).toFixed(1) + '점 이상';
    state.plan = resizePlan(state.plan, Number(els.daysInput.value || 3));
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

    els.autoPlanButton.addEventListener('click', autoFillPlan);
    els.clearPlanButton.addEventListener('click', clearPlan);

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

    els.dialogSave.addEventListener('click', saveSchedule);
    els.dialogCancel.addEventListener('click', closeScheduleModal);

    document.querySelectorAll('[data-close="schedule"]').forEach(function (node) {
      node.addEventListener('click', closeScheduleModal);
    });
    document.querySelectorAll('[data-close="admin"]').forEach(function (node) {
      node.addEventListener('click', closeAdminModal);
    });
  }

  function detectApi() {
    return fetch('/api/health').then(function (response) {
      if (!response.ok) throw new Error('health_failed');
      return response.json();
    }).then(function (json) {
      state.apiAvailable = true;
      state.liveEnabled = Boolean(json.hotpepperConfigured);
      if (state.forceDemo) {
        els.modeBadge.textContent = '데모 모드';
        els.apiStatus.textContent = '사용자님이 데모 모드로 전환해 두어 데모 데이터로 동작합니다.';
      } else if (state.liveEnabled) {
        els.modeBadge.textContent = '실시간 모드';
        els.apiStatus.textContent = 'Hot Pepper 실시간 검색이 연결되었습니다.';
      } else {
        els.modeBadge.textContent = '데모 모드';
        els.apiStatus.textContent = 'API 키가 없어 데모 데이터로 동작합니다.';
      }
    }).catch(function () {
      state.apiAvailable = false;
      state.liveEnabled = false;
      els.modeBadge.textContent = '데모 모드';
      els.apiStatus.textContent = '서버 응답이 없어 데모 데이터로 동작합니다.';
    });
  }

  function search(options) {
    options = options || {};

    const query = {
      region: String(els.regionInput.value || '').trim(),
      base: String(els.baseInput.value || '').trim(),
      food: String(els.foodInput.value || '').trim(),
      startDate: els.startDateInput.value || toDateInput(new Date()),
      days: clamp(parseInt(els.daysInput.value || '3', 10), 1, 10),
      minScore: Number(els.minScoreInput.value || 3),
    };

    state.currentQuery = query;
    saveJson(STORAGE.query, query);
    state.plan = resizePlan(state.plan, query.days);
    saveJson(STORAGE.plan, state.plan);
    renderPlan();

    showFeedback('관광지 기준으로 근처 식당을 다시 정리하는 중입니다.', 'loading');
    els.searchButton.disabled = true;
    els.demoButton.disabled = true;

    return resolveBasePoint(query.region, query.base).then(function (basePoint) {
      state.basePoint = basePoint;
      saveJson(STORAGE.basePoint, basePoint);
      renderBasePoint();
      return fetchRestaurants(query, basePoint);
    }).then(function (payload) {
      const augmentedPool = payload.pool.map(function (r) { return augmentRestaurant(r, state.basePoint, query.food); });
      let augmentedResults = payload.results.map(function (r) { return augmentRestaurant(r, state.basePoint, query.food); });
      let filterMessage = '';

      const scoreFiltered = augmentedResults.filter(function (r) {
        return r.travelScore >= query.minScore;
      });

      if (scoreFiltered.length) {
        augmentedResults = scoreFiltered;
      } else if (augmentedResults.length) {
        augmentedResults = augmentedResults.slice(0, 12);
        filterMessage = '최소 추천 점수를 만족하는 결과가 없어 가까운 후보를 우선 보여드립니다.';
      }

      state.pool = augmentedPool.sort(sortRestaurantsForDisplay(query.food));
      state.results = augmentedResults.sort(sortRestaurantsForDisplay(query.food));
      state.searchSuggestions = payload.suggestions;
      state.sourceLabel = payload.sourceLabel;
      state.feedback = buildFeedback(payload, filterMessage);
      renderEverything();
    }).catch(function (error) {
      console.error(error);
      showFeedback('검색 중 오류가 발생했습니다. 데모 데이터로 보기 버튼을 눌러 다시 시도해 주세요.', 'error');
    }).finally(function () {
      els.searchButton.disabled = false;
      els.demoButton.disabled = false;
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
    const liveTerms = buildLiveTerms(query.food).slice(0, 5);

    if (basePoint && basePoint.lat && basePoint.lng) {
      tasks.push({ lat: basePoint.lat, lng: basePoint.lng, range: 3, count: 50, start: 1 });
      tasks.push({ lat: basePoint.lat, lng: basePoint.lng, range: 3, count: 50, start: 51 });
      tasks.push({ lat: basePoint.lat, lng: basePoint.lng, range: 5, count: 50, start: 1 });
      if (regionTerm) {
        tasks.push({ lat: basePoint.lat, lng: basePoint.lng, range: 5, count: 30, start: 1, keyword: regionTerm });
      }
      liveTerms.forEach(function (term) {
        tasks.push({ lat: basePoint.lat, lng: basePoint.lng, range: 5, count: 40, start: 1, keyword: term });
      });
      if (query.food) {
        tasks.push({ keyword: buildKeyword(regionTerm || query.base, query.food), count: 40, start: 1 });
        getAlternativeFoodTerms(query.food).slice(0, 4).forEach(function (term) {
          tasks.push({ keyword: buildKeyword(regionTerm || query.base, term), count: 30, start: 1 });
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
      return item;
    });

    let results = scored.filter(function (item) { return item.matchScore >= 1; });
    let fallbackUsed = '';

    if (results.length < 5) {
      const relaxed = scored.filter(function (item) { return item.matchScore >= 0.45; });
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

  function resolveBasePoint(region, base) {
    const local = findPreset(base);
    if (local) return Promise.resolve(local);
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
    restaurant.nameKo = restaurant.nameKo || restaurant.nameOriginal || '이름 없음';
    restaurant.displayName = restaurant.nameOriginal && restaurant.nameOriginal !== restaurant.nameKo
      ? restaurant.nameKo + ' (' + restaurant.nameOriginal + ')'
      : restaurant.nameKo;
    restaurant.distanceKm = (basePoint && restaurant.lat && restaurant.lng)
      ? haversineKm(basePoint.lat, basePoint.lng, restaurant.lat, restaurant.lng)
      : null;
    restaurant.walkMinutes = parseWalkMinutes(restaurant.accessKo || restaurant.accessOriginal || '');
    restaurant.travelScore = calcTravelScore(restaurant);
    const match = scoreFoodMatch(restaurant, foodQuery);
    restaurant.matchScore = match.score;
    restaurant.matchTerms = match.terms;
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
    if (r.walkMinutes != null) {
      if (r.walkMinutes <= 5) score += 0.45;
      else if (r.walkMinutes <= 10) score += 0.2;
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
    if (r.walkMinutes != null) list.push('역 기준 도보 ' + r.walkMinutes + '분 정도입니다.');
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

  function sortRestaurantsForDisplay(foodQuery) {
    return function (a, b) {
      const foodActive = Boolean(foodQuery);
      if (foodActive) {
        const byMatch = (b.matchScore || 0) - (a.matchScore || 0);
        if (byMatch) return byMatch;
      }
      if (a.distanceKm != null && b.distanceKm != null) {
        const byDistance = a.distanceKm - b.distanceKm;
        if (byDistance) return byDistance;
      }
      return (b.travelScore || 0) - (a.travelScore || 0);
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
  }

  function renderResults() {
    const countText = state.results.length + '곳';
    els.resultsMeta.textContent = countText + ' · ' + state.sourceLabel;

    if (!state.results.length) {
      els.resultsList.innerHTML = '<div class="empty-state">검색 결과가 없습니다. 추천 검색어를 눌러 다시 찾아보시거나, 음식 키워드를 조금 넓게 입력해 주세요.</div>';
      return;
    }

    els.resultsList.innerHTML = state.results.map(function (r) {
      return '' +
        '<article class="result-card">' +
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
                '<span class="badge score">추천 ' + escapeHtml(String(r.travelScore.toFixed(1))) + '점</span>' +
                (r.distanceKm != null ? '<span class="badge distance">약 ' + escapeHtml(r.distanceKm.toFixed(2)) + 'km</span>' : '') +
                (r.adminNote ? '<span class="badge admin">관리자 추천</span>' : '') +
              '</div>' +
            '</div>' +
            '<div class="meta-line">' +
              badge(r.genreKo || r.genreOriginal) + badge(r.subGenreKo || r.subGenreOriginal) + badge(r.signatureMenu) +
              (r.matchTerms && r.matchTerms.length ? '<span class="badge match">검색 연관: ' + escapeHtml(r.matchTerms.join(', ')) + '</span>' : '') +
              (r.recommendedSlots.length ? '<span class="badge slot">추천 식사: ' + escapeHtml(r.recommendedSlots.join(' / ')) + '</span>' : '') +
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
              '<a class="btn btn-secondary" target="_blank" rel="noopener noreferrer" href="' + escapeHtml(buildDirectionsUrl(r, state.basePoint)) + '">구글맵 길찾기</a>' +
              (r.reservationUrl ? '<a class="btn btn-ghost" target="_blank" rel="noopener noreferrer" href="' + escapeHtml(r.reservationUrl) + '">예약 페이지</a>' : '') +
            '</div>' +
          '</div>' +
        '</article>';
    }).join('');

    els.resultsList.querySelectorAll('.result-add').forEach(function (button) {
      button.addEventListener('click', function () {
        openScheduleModal(button.getAttribute('data-id'));
      });
    });
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
    if (!state.basePoint) {
      els.basePointBox.innerHTML = '<div class="base-box">기준 장소를 아직 찾지 못했습니다. 지역 키워드 중심 검색으로도 사용할 수 있습니다.</div>';
      return;
    }
    const title = state.basePoint.nameOriginal && state.basePoint.nameKo !== state.basePoint.nameOriginal
      ? state.basePoint.nameKo + ' (' + state.basePoint.nameOriginal + ')'
      : (state.basePoint.nameKo || state.basePoint.nameOriginal || '기준 장소');
    const subtitle = state.basePoint.displayNameKo || state.basePoint.displayNameOriginal || '';
    els.basePointBox.innerHTML = '<div class="base-box"><strong>' + escapeHtml(title) + '</strong><br /><span class="muted">' + escapeHtml(subtitle) + '</span></div>';
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

    const row = state.plan[dayIndex - 1];
    row[slot] = {
      restaurantId: restaurant.id,
      restaurantName: restaurant.displayName,
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
    saveJson(STORAGE.plan, state.plan);
    renderPlan();
    els.planWarnings.innerHTML = '';
  }

  function renderPlan() {
    const days = clamp(parseInt(els.daysInput.value || '3', 10), 1, 10);
    state.plan = resizePlan(state.plan, days);
    saveJson(STORAGE.plan, state.plan);

    const tripStart = getTripStartDate();
    const rows = [];
    state.plan.forEach(function (day, index) {
      ['breakfast', 'lunch', 'dinner'].forEach(function (slot) {
        const item = day[slot];
        const rowDate = addDays(tripStart, index);
        rows.push('<tr>' +
          '<td><div class="plan-day"><strong>Day ' + (index + 1) + '</strong><span class="sub">' + escapeHtml(formatDisplayDate(rowDate)) + '</span></div></td>' +
          '<td>' + SLOT_INFO[slot].label + '</td>' +
          '<td>' + (item ? escapeHtml(item.restaurantName) : '<span class="muted">미정</span>') + '</td>' +
          '<td>' + (item ? escapeHtml(item.note || '') : '<span class="muted">-</span>') + '</td>' +
          '<td>' +
            '<div class="plan-actions">' +
              (item ? '<button class="small-button" data-open-restaurant="' + escapeHtml(item.restaurantId) + '">식당 보기</button>' : '<span class="muted">검색 결과에서 추가</span>') +
              (item ? '<button class="small-button danger" data-remove-slot="' + index + ':' + slot + '">삭제</button>' : '') +
            '</div>' +
          '</td>' +
        '</tr>');
      });
    });
    els.planTableBody.innerHTML = rows.join('');

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

    els.planTableBody.querySelectorAll('[data-open-restaurant]').forEach(function (button) {
      button.addEventListener('click', function () {
        const id = button.getAttribute('data-open-restaurant');
        const el = document.querySelector('.result-add[data-id="' + cssEscape(id) + '"]');
        if (el) {
          el.closest('.result-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  function autoFillPlan() {
    if (!state.results.length) {
      els.planWarnings.innerHTML = '<div class="message-box error">먼저 검색 결과를 만들어 주세요.</div>';
      return;
    }

    state.plan = createPlan(Number(els.daysInput.value || '3'));
    const slots = ['breakfast', 'lunch', 'dinner'];
    const tripStart = getTripStartDate();
    let cursor = 0;

    state.plan.forEach(function (day, dayIndex) {
      slots.forEach(function (slot) {
        let chosen = null;
        for (let i = cursor; i < state.results.length + cursor; i += 1) {
          const restaurant = state.results[i % state.results.length];
          const date = addDays(tripStart, dayIndex);
          const validation = validateRestaurantTime(restaurant, toDateInput(date), slot);
          if (validation.ok) {
            chosen = restaurant;
            cursor = i + 1;
            break;
          }
        }

        if (chosen) {
          day[slot] = {
            restaurantId: chosen.id,
            restaurantName: chosen.displayName,
            note: '자동 추천 일정',
            date: toDateInput(addDays(tripStart, dayIndex)),
          };
        }
      });
    });

    saveJson(STORAGE.plan, state.plan);
    renderPlan();
    els.planWarnings.innerHTML = '<div class="message-box success">현재 결과 기준으로 가능한 범위에서 일정을 채웠습니다.</div>';
  }

  function validateRestaurantTime(restaurant, dateInput, slot) {
    if (!dateInput) return { ok: false, message: '날짜를 선택해 주세요.' };
    const date = new Date(dateInput + 'T00:00:00');
    if (Number.isNaN(date.getTime())) return { ok: false, message: '날짜 형식이 올바르지 않습니다.' };

    const closedText = [restaurant.closeKo, restaurant.closeOriginal].join(' ');
    if (isClosedOnDate(closedText, date)) {
      return { ok: false, message: WEEKDAY_KO[date.getDay()] + '요일은 휴무로 보입니다.' };
    }

    const openText = [restaurant.openOriginal, restaurant.openKo].join(' / ');
    const ranges = extractTimeRanges(openText);
    if (ranges.length && !slotRangeOverlaps(ranges, SLOT_INFO[slot])) {
      return { ok: false, message: SLOT_INFO[slot].label + ' 시간대(' + SLOT_INFO[slot].start + ' ~ ' + SLOT_INFO[slot].end + ')에는 영업하지 않는 것으로 보입니다.' };
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
      new RegExp(ko + '(요일|요)?\\s*(휴무|정기\s*휴무|쉽니다)', 'i'),
      new RegExp('(휴무|정기\s*휴무|쉽니다)[^\n,]*' + ko + '(요일|요)?', 'i'),
      new RegExp(jp + '(曜)?\\s*(定休|休)', 'i'),
      new RegExp('(定休|休)[^\n,]*' + jp + '(曜)?', 'i'),
    ];

    return patterns.some(function (pattern) {
      return pattern.test(source);
    });
  }

  function extractTimeRanges(text) {
    const source = String(text || '');
    if (!source) return [];
    if (/24\s*시간|24時間|24h|24H/i.test(source)) {
      return [{ start: 0, end: 24 * 60 }];
    }

    const ranges = [];
    const re = /(?:(익일|翌日|다음날)\s*)?(\d{1,2})[:：](\d{2})\s*(?:~|〜|～|-|–|—|to|TO)\s*(?:(익일|翌日|다음날)\s*)?(\d{1,2})[:：](\d{2})/g;
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

  function slotRangeOverlaps(ranges, slotInfo) {
    const slotWindow = {
      start: toMinutes(slotInfo.start),
      end: toMinutes(slotInfo.end),
    };

    return ranges.some(function (range) {
      return overlap(range.start, range.end, slotWindow.start, slotWindow.end);
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
      list.push({ breakfast: null, lunch: null, dinner: null });
    }
    return list;
  }

  function resizePlan(plan, days) {
    const next = Array.isArray(plan) ? plan.slice(0, days) : [];
    while (next.length < days) next.push({ breakfast: null, lunch: null, dinner: null });
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
      closeAdminModal();
      return;
    }
    els.adminLoginMessage.textContent = '아이디 또는 비밀번호가 다릅니다.';
  }

  function logoutAdmin() {
    state.adminSession = { loggedIn: false };
    saveJson(STORAGE.adminSession, state.adminSession);
    renderAdminState();
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
    state.results = state.results.map(function (item) {
      item.adminNote = state.adminNotes[item.id] || '';
      return item;
    });
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
