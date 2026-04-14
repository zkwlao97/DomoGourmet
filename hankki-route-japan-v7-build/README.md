# 한끼루트 일본

Hot Pepper 공식 API를 이용해 일본 여행 중 근처 식당을 찾고, 숙소와 방문지를 기준으로 음식 중심 일정을 짜는 웹앱입니다.

## 이번 버전에서 바뀐 점

- 지역 / 기준 장소 / 음식 입력값 기본값 제거
- `추천으로 일정 짜기`를 누를 때 **현재 입력한 값**을 바로 반영
- **가고시마 / 삿포로 / 홋카이도** 등 지역 자동 일정 템플릿 확장
- 사용자가 넣은 방문지 외에 **가까운 인기 장소를 자동 보강**
- 같은 장소가 반복되지 않도록 자동 일정 로직 개선
- 음식 검색과 식당명 검색은 기존처럼 유지

## 로컬 실행

### 1) `.env` 파일 만들기

프로젝트 루트에 `.env` 파일을 만들고 아래처럼 넣어 주세요.

```env
HOTPEPPER_API_KEY=발급받은_키
GEMINI_API_KEY=선택사항
PORT=3000
```

### 2) 실행

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

## Render 무료 배포

1. GitHub에 이 폴더를 올립니다.
2. Render에서 **New > Web Service** 선택
3. 저장소 연결
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Environment Variables 추가
   - `HOTPEPPER_API_KEY`
   - `GEMINI_API_KEY` (선택)
7. 배포 후 Render URL 접속

## 메모

- Google Maps는 길찾기 링크 용도로만 사용합니다.
- 리뷰 본문 스크래핑은 포함하지 않았습니다.
- 영업시간은 Hot Pepper 문자열을 해석하는 방식이라 100퍼센트 완벽하지 않을 수 있습니다.
- Gemini는 일정 설명과 번역 보강용이며, 인기 관광지 추천은 우선 내장 데이터로 처리합니다.
