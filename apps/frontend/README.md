# 📊 Datarize 쇼핑몰 구매 데이터 대시보드

쇼핑몰의 구매 데이터를 시각화하고 분석할 수 있는 대시보드 애플리케이션입니다.

## 🛠 Tech Stack

### Frontend
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구 및 개발 서버
- **TailwindCSS 4** - 유틸리티 기반 CSS 프레임워크
- **React Query (@tanstack/react-query)** - 서버 상태 관리
- **Zustand** - 클라이언트 상태 관리 (모달)
- **React Router DOM** - 라우팅
- **Recharts** - 차트 라이브러리
- **Framer Motion** - 애니메이션
- **dayjs** - 날짜 처리
- **Lucide React** - 아이콘

### Development & Testing
- **Vitest** - 테스트 프레임워크
- **React Testing Library** - React 컴포넌트 테스트
- **jsdom** - DOM 시뮬레이션
- **BiomeJS** - 린터 및 포맷터
- **ESLint** - 추가 린팅

### Backend (제공됨)
- **Node.js 20.13.1** - 런타임
- **Koa.js** - 웹 프레임워크
- **TypeScript** - 타입 안전성

## 🚀 프로젝트 시작하기

### 사전 요구사항
- Node.js 20.13.1
- Yarn 1.22.22

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone <repository-url>
   cd datarize-fe-assignments
   ```

2. **의존성 설치**
   ```bash
   cd apps
   yarn install
   ```

3. **개발 서버 실행**
   ```bash
   # 백엔드 서버 실행 (포트 4000)
   yarn start-server
   
   # 프론트엔드 개발 서버 실행 (포트 5173)
   yarn start-client
   ```

4. **애플리케이션 접속**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

### 프로덕션 빌드
```bash
cd apps/frontend
yarn build
yarn preview
```

## 🧪 테스트

### 테스트 실행
```bash
cd apps/frontend

# 전체 테스트 실행
yarn test

# 테스트 UI로 실행
yarn test:ui

# 한 번만 실행
yarn test:run
```

### 테스트 커버리지
- **API 서비스**: 14개 테스트 (네트워크 에러, 파라미터 처리)
- **컴포넌트**: 16개 테스트 (렌더링, 사용자 상호작용)
- **커스텀 훅**: 15개 테스트 (데이터 페칭, 상태 관리)
- **총 45개 테스트** 모두 통과

## 🏗 프로젝트 아키텍처

### 폴더 구조
```
src/
├── components/          # UI 컴포넌트
│   ├── charts/         # 차트 컴포넌트
│   ├── common/         # 재사용 가능한 공통 컴포넌트
│   ├── dashboard/      # 대시보드 전용 컴포넌트
│   └── ui/            # 기본 UI 컴포넌트
├── hooks/              # 커스텀 훅
├── pages/              # 페이지 컴포넌트
├── services/           # API 서비스 레이어
├── types/              # TypeScript 타입 정의
└── test/               # 테스트 설정
```

### 아키텍처 패턴

#### 1. **컴포넌트 계층 구조**
- **Pages**: 라우팅 레벨 컴포넌트
- **Dashboard**: 대시보드 도메인 컴포넌트
- **Common**: 재사용 가능한 컴포넌트
- **UI**: 기본 UI 컴포넌트

#### 2. **상태 관리**
- **React Query**: 서버 상태 (캐싱, 동기화)
- **Zustand**: 클라이언트 상태 (모달 관리)
- **React State**: 컴포넌트 로컬 상태

#### 3. **데이터 흐름**
```
API Layer → React Query → Custom Hooks → Components
```

#### 4. **타입 안전성**
- 엄격한 TypeScript 설정
- API 응답 타입 정의
- 컴포넌트 Props 타입 정의

## 💡 문제 해결 전략

### 1. **과제 요구사항 분석**
- ✅ 가격대별 구매 빈도 차트 (날짜 필터링)
- ✅ 고객별 구매 금액 정렬 테이블 (기본: ID 정렬)
- ✅ 고객 상세 정보 모달
- ✅ 검색 기능
- ✅ 유닛 테스트

### 2. **UX/UI 개선 전략**

#### 🎯 **에러 처리 UX 개선**
- **검색 결과 없음**: 빨간 에러 → 회색 안내 메시지
- **네트워크 에러**: 명확한 에러 메시지 표시
- **재시도 로직**: React Query 재시도 비활성화로 빠른 피드백

#### 🎯 **데이터 입력 UX 개선**
- **DateRangePicker**: 확인 버튼 클릭 시에만 API 호출
- **실시간 검증**: 잘못된 날짜 범위 즉시 피드백
- **취소 기능**: 변경사항 되돌리기 가능

#### 🎯 **가독성 개선**
- **가격 표시**: "0 - 20000" → "0원 ~ 2만원"
- **한국어 현지화**: 자연스러운 한국어 표현
- **만원 단위**: 직관적인 금액 표시



## 📝 API 명세

### Endpoints
- `GET /api/customers` - 고객 목록 (정렬, 검색)
- `GET /api/customers/:id/purchases` - 고객별 구매 내역
- `GET /api/purchase-frequency` - 가격대별 구매 빈도

### Query Parameters
- `sortBy`: "asc" | "desc" (구매금액 정렬)
- `name`: string (고객명 검색)
- `from`, `to`: ISO 8601 날짜 (기간 필터)
