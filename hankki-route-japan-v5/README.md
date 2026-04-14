# 한끼루트 일본

Hot Pepper 공식 API를 이용해 일본 여행 중 근처 식당을 찾고, 일정표까지 정리하는 간단한 웹앱입니다.

## 이번 버전에서 바뀐 점

- 검색 결과 카드에서 **관리자 추천 저장 / 수정** 가능
- 일정표의 **식당 보기** 버튼이 검색 결과 카드 위치로 이동
- 폐업 / 장기 휴업으로 보이는 키워드가 포함된 후보를 1차 제외
- **추천으로 일정 짜기**를 두 가지 모드로 분리
  - 방문 후보 장소 / Google Maps 링크 중심
  - 지역 기준 자동 여행 코스
- **Gemini API 키가 있으면** 추천 일정 설명을 더 자연스럽게 생성

## 로컬 실행

### 1) `.env` 파일 만들기

`.env.example`을 참고해서 프로젝트 루트에 `.env` 파일을 만듭니다.

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
- 추천으로 일정 짜기 모달에서 **Gemini로 일정 설명 더 자연스럽게 만들기** 체크

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

이 저장소 루트의 `render.yaml`을 그대로 두고 Render에서 Blueprint로 배포할 수 있습니다.

## 메모

- Google Maps는 길찾기 링크 용도로만 사용합니다.
- 리뷰 본문 스크래핑은 포함하지 않았습니다.
- 영업시간은 Hot Pepper 문자열을 해석하는 방식이라 100퍼센트 완벽하지 않을 수 있습니다.
