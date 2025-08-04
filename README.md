# Quizly - 퀴즈 생성 플랫폼

에스F레소 퀴즐리 디자인을 기반으로 제작된 React 애플리케이션입니다.

## 🚀 기능

- **문제 만들기**: 정리한 내용으로 문제를 생성
- **문제 모아보기**: 만든 문제들을 한 곳에서 관리
- **틀린문제 풀어보기**: 틀린 문제만 골라서 복습
- **검색 기능**: 텍스트 입력 또는 파일 업로드로 문제 생성

## 🛠 기술 스택

- **React 18** - 사용자 인터페이스 구축
- **TypeScript** - 타입 안정성
- **Styled Components** - CSS-in-JS 스타일링
- **Pretendard Font** - 한국어 최적화 폰트

## 📦 설치 및 실행

### 필수 요구사항

- Node.js 16.0.0 이상
- npm 또는 yarn

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm start
```

애플리케이션이 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

### 빌드

```bash
npm run build
```

## 🎨 디자인 시스템

### 색상

- **Primary Green**: #30A10E
- **Text Dark**: #222222
- **Text Gray**: #777777
- **Background**: #F8F9FA
- **White**: #FFFFFF
- **Border**: #EDEDED

### 타이포그래피

- **Font Family**: Pretendard
- **Heading**: 700 weight, 32px
- **Body**: 400-500 weight, 16-18px

### 컴포넌트

- **Header**: 네비게이션 탭과 로그인 버튼
- **SearchBar**: 검색 입력 필드
- **MenuCard**: 기능 카드 (문제 만들기, 모아보기, 틀린문제)
- **CharacterGroup**: 캐릭터 이미지 그룹
- **Footer**: 링크와 저작권 정보

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── Header.tsx          # 헤더 컴포넌트
│   ├── MainContent.tsx     # 메인 콘텐츠
│   ├── SearchBar.tsx       # 검색바
│   ├── MenuCard.tsx        # 메뉴 카드
│   ├── CharacterGroup.tsx  # 캐릭터 그룹
│   └── Footer.tsx          # 푸터
├── App.tsx                 # 메인 앱 컴포넌트
└── index.tsx              # 앱 진입점
```

## 🎯 주요 기능

### 반응형 디자인

- 데스크톱 최적화 레이아웃
- 호버 효과와 트랜지션
- 접근성 고려

### 사용자 경험

- 직관적인 네비게이션
- 시각적 피드백
- 일관된 디자인 시스템

## 📝 라이선스

© 2025 Quizly. All rights reserved.

## 👥 팀

**Team. 에스F레소**

문의: liz021229@gmail.com
