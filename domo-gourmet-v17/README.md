# Domo Gourmet Japan

## 실행

```bash
npm start
```

또는

```bash
node server.js
```

## 환경변수

- `HOTPEPPER_API_KEY`: Hot Pepper API 키
- `GEMINI_API_KEY`: Gemini API 키
- `GEMINI_MODEL_CANDIDATES`: Gemini fallback 모델 목록
- `DATA_FILE_PATH`: 관리자 추천/수동 등록/캐시 저장 경로

기본값은 `./data/store.json` 입니다.

## Render

- 루트 디렉터리가 프로젝트 폴더라면 그대로 배포
- 저장소 안에 이 폴더가 하위 폴더로 들어 있으면 Render의 Root Directory를 해당 폴더명으로 지정
- Free Render는 로컬 파일 저장이 영구 보존되지 않음
