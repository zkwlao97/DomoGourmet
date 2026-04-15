# 도모구루메 재팬 v13

## 이번 수정
- 일정표 카드와 표의 글자 정리를 개선했습니다.
- 식당명은 본문 / 원문을 분리해서 더 읽기 쉽게 보이도록 했습니다.
- 일정표 카드 폭을 넓혀 일본어 식당명이 글자 단위로 지저분하게 줄바꿈되는 문제를 줄였습니다.
- Gemini 모델 fallback 기본 순서를 확대했습니다.

## Gemini 기본 fallback 순서
1. gemini-3-flash-preview
2. gemini-2.5-flash
3. gemini-3.1-flash-lite-preview
4. gemini-2.5-flash-lite
5. gemini-2.0-flash
6. gemini-2.0-flash-lite

`.env`에서 직접 바꿀 수 있습니다.

```env
GEMINI_MODEL_CANDIDATES=gemini-3-flash-preview,gemini-2.5-flash,gemini-3.1-flash-lite-preview,gemini-2.5-flash-lite,gemini-2.0-flash,gemini-2.0-flash-lite
```

## 실행
```bash
npm start
```
또는
```bash
node server.js
```
