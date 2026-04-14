# 도모구루메 재팬 v9

## 실행

```bash
npm start
```

또는

```bash
node server.js
```

## 환경변수

- `HOTPEPPER_API_KEY` : Hot Pepper Gourmet API 키
- `GEMINI_API_KEY` : 선택 사항. 일정 설명 및 일부 번역 보정
- `GEMINI_MODEL_CANDIDATES` : Gemini 모델 자동 fallback 순서
- `DATA_FILE_PATH` : 관리자 추천 / 수동 등록 식당 저장 파일 경로
- `PORT` : 기본 3000

## 이번 버전 핵심

- 관리자 추천 전용 탭 추가
- 관리자 전용 페이지 추가
- Google Maps 링크 기반 수동 식당 등록
- Hot Pepper + 관리자 등록 식당 통합 검색
- 일정 추가 시 모달 내부 영업시간 오류 표시
- 정렬 변경 즉시 반영
- 식당 보기 버튼 개선
- 숙소 기준 동선 유지
- 지역 자동 코스의 중복 반복 완화
- 원하는 음식 기반 자동 일정 반영
- Gemini 여러 모델 자동 fallback

## 데이터 저장

로컬 PC에서는 `DATA_FILE_PATH`를 프로젝트 폴더 밖 경로로 잡으면 코드 파일을 새로 받아도 추천 / 등록 식당 데이터가 유지됩니다.

예:

```env
DATA_FILE_PATH=C:\hankki-route-japan-data\store.json
```

## Render 주의

Render free web service는 로컬 파일시스템이 영구 저장되지 않으므로, 배포 환경에서 관리자 데이터까지 유지하려면 외부 DB를 붙이는 편이 좋습니다.


## v9 추가 변경

- 추천 일정 모달에서 기본적으로 기존 검색 정보를 비우고 새로 입력하도록 변경
- 체크박스로 기존 검색 지역 / 숙소 / 일정 정보를 가져오기 가능
- 자동 일정 시 기존 검색 결과와 섞이지 않도록 별도 일정 컨텍스트 사용
- 하단 고정 화면 이동 도크 추가
- 관리자 페이지에 실제 데이터 저장 파일 경로 표시
- 서버 시작 시 `DATA_FILE_PATH` 파일 자동 생성
