# 한끼루트 일본

Hot Pepper 공식 API를 이용해 일본 여행 중 근처 식당을 찾고, 숙소와 방문지 기준으로 식당 동선을 짜는 웹앱입니다.

## 이번 버전에서 바뀐 점

- **음식 종류 또는 식당명 검색** 지원
- **숙소 이름 / 숙소 Google Maps 링크** 입력 지원
- 검색 결과를 **음식 / 식당명과 먼저 맞는 결과**와 **동선이 좋은 주변 추천**으로 나눠 표시
- 검색 결과 정렬 추가
  - 음식 / 식당명 일치 우선
  - 거리순
  - 추천 점수순
- 일정 화면에 **Day 카드 + 구간별 Google Maps 링크** 추가
- 추천 일정이 **하루 1개 지점**이 아니라 **오전 / 오후 방문지 + 아침 / 점심 / 저녁 식사** 흐름으로 바뀜
- **Gemini API 키가 있으면**
  - 상위 검색 결과 번역 보강
  - 일정 설명 자연어 보강

## 로컬 실행

### 1) `.env` 파일 만들기

프로젝트 루트에 `.env` 파일을 만듭니다.

```env
HOTPEPPER_API_KEY=발급받은_키
GEMINI_API_KEY=선택사항
PORT=3000
```

### 2) 서버 실행

```bash
npm start
```

또는

```bash
node server.js
```

### 3) 접속

```text
http://localhost:3000
```

## Gemini API 키 연결

선택 기능입니다. 없어도 사이트는 돌아갑니다.

- `.env`에 `GEMINI_API_KEY=...` 추가
- 서버 재시작
- 검색 결과 번역 보강과 일정 설명 보강에 자동 사용

## Render 무료 배포

### 방법 1: 대시보드에서 직접

1. GitHub에 이 폴더를 올립니다.
2. Render에서 **New > Web Service** 선택
3. 저장소 연결
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Environment Variables 추가
   - `HOTPEPPER_API_KEY`
   - `GEMINI_API_KEY` (선택)
7. 배포 완료 후 Render URL 접속

### 방법 2: `render.yaml` 사용

저장소 루트의 `render.yaml`을 그대로 두고 Render에서 Blueprint로 배포할 수 있습니다.

## 메모

- Google Maps는 길찾기 링크 용도로만 사용합니다.
- 리뷰 본문 스크래핑은 포함하지 않았습니다.
- 영업시간은 Hot Pepper 문자열을 해석하는 방식이라 100퍼센트 완벽하지 않을 수 있습니다.
- Gemini 번역은 상위 검색 결과 일부만 후처리해서 무료 티어 소모를 줄였습니다.
