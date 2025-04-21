# 🏋️‍♂️ FitHub - 소셜 피트니스 플랫폼

> **기록, 소통, 실천이 연결되는 통합 피트니스 플랫폼**

FitHub는 사용자의 운동 기록과 목표 관리를 기반으로, 커뮤니티 소통 및 운동 상품 거래 기능을 통합한 **웹 기반 소셜 피트니스 플랫폼**입니다.  
React 기반 CSR과 Spring Boot 기반 RESTful API 서버를 활용해 빠르고 유연한 사용자 경험을 제공하며, SPA 아키텍처를 통해 실시간 상호작용과 확장성을 고려한 구조로 개발되었습니다.

---

## 🛠️ 개발환경 및 기술 스택

> **Java 17, Spring Boot 3.4.3, MyBatis, Oracle 11g XE, React, Recoil, Node.js, AWS EC2, GitHub Actions 기반 개발**

| 구분 | 내용 |
|------|------|
| **Language** | Java 17, JavaScript, SQL |
| **Frontend** | React, Recoil, React Router, Axios, MUI |
| **Backend** | Spring Boot, Spring Security, MyBatis |
| **Database & Tools** | Oracle 11g XE, SQL Developer, STS4, VS Code, Swagger |
| **Infra & DevOps** | AWS EC2, GitHub Actions, Google Cloud Console |
| **협업 도구** | GitHub, Notion, Figma, ERDCloud, GitMind |
| **마크업 & 스타일링** | HTML5, CSS, MUI |

---

## 📌 주요 기능 소개

### 🔐 사용자 인증 및 회원 시스템
- JWT 기반 로그인 / 소셜 로그인 (Google, Kakao OAuth)
- 이메일 인증, 비밀번호 변경, 아이디·비밀번호 찾기
- 마이페이지에서 개인정보 및 프로필 수정, 회원 탈퇴

### 🏃 My Fit (운동 루틴 및 기록)
- 요일 기반 루틴 생성 및 실시간 기록
- 루틴 수행 시 AI 요약 제공 (소모 칼로리 등)
- 내 운동 통계 요약, 그래프 시각화 기능

### 👥 커뮤니티
- 게시글 작성, 수정, 삭제, 검색 (TextEditor 사용)
- 댓글, 좋아요, 팔로우 기능
- 회원 간 1:1 실시간 다이렉트 메시지 (WebSocket)

### 🛒 마켓
- 운동 상품 등록/수정/삭제 (관리자)
- 장바구니, 결제, 구매 내역 확인
- 리뷰 등록/조회/삭제 기능

### 🛠 관리자 기능
- 회원 등급 및 경고/강제 탈퇴 관리
- 커뮤니티 게시글 및 댓글 모니터링
- Google Analytics 및 DB 기반 통계 시각화
- 실시간 문의 채팅 응대 및 광고 랜덤 출력

---

## 🗂️ 프로젝트 구조 및 아키텍처

- **SPA 구조**: React 기반 CSR + Recoil 상태관리
- **API 구조**: Spring Boot + MyBatis 기반 RESTful API 설계
- **JWT 인증**: Interceptor 및 토큰 재발급 흐름 설계
- **CI/CD**: GitHub Actions 기반 CI 구성 (자동 빌드 및 테스트)
- **서버 운영**: AWS EC2 기반 배포

---

## 📆 개발 일정

| 구분 | 기간 | 내용 |
|------|------|------|
| 기획 및 조사 | 03.19 ~ 03.24 | 서비스 분석, ERD 구조 수립 |
| 디자인 설계 | 03.24 ~ 03.27 | Figma 기반 와이어프레임 작성 |
| 구현 단계 | 03.26 ~ 04.08 | FE·BE 기능 개발 및 DB 구축 |
| 통합 테스트 | 04.08 ~ 04.15 | API 연동, 오류 수정 및 QA |
| 문서화 및 발표 | 04.14 ~ 04.17 | 보고서, 발표 자료 정리 |

---

## 🤝 팀 구성 및 역할

| 이름 | 역할 | 담당 기능 |
|------|------|-----------|
| **최승현** | Member | 로그인, 회원가입, JWT 인증, 마이페이지, 소셜 로그인, 공통 레이아웃, 메인페이지, 프로젝트 문서화 |
| 전한기 | My Fit | 루틴 등록, 운동 기록, 활동 로그, 운동 통계, DM |
| 나한빈 | Community | 게시글 CRUD, 댓글, 좋아요, 팔로우 |
| 정호균 | Market | 상품 관리, 장바구니, 리뷰, 구매 |
| 양현석 | Admin | 관리자 기능 (회원 관리, 통계, 채팅, 광고) |

---

## 📈 트러블 슈팅 주요 사례

- **JWT 재인증 문제**  
  새로고침 시 accessToken이 초기화되는 문제를 `recoil-persist`와 `refreshToken` 재요청 흐름으로 해결

- **이미지 업로드 비동기 처리**  
  FormData 조건 분기 및 "null" 전달 방식으로 파일/DB/화면 상태 동기화

---

## 🔗 프로젝트 링크

- 🔗 GitHub Repository: [https://github.com/haru-some/FitHub](https://github.com/haru-some/FitHub)
- 📑 Notion: [https://ubertech.notion.site/project-fithub](https://ubertech.notion.site/project-fithub)
- 🎨 Figma 와이어프레임: [https://www.figma.com/design/OSrMPywXNgLBfsVaFrVCUc/FitHub](https://www.figma.com/design/OSrMPywXNgLBfsVaFrVCUc/FitHub)
- 🧠 ERD: [https://www.erdcloud.com/p/RN4KimsQuj8Xq65aK](https://www.erdcloud.com/p/RN4KimsQuj8Xq65aK)
- 📌 GitMind 흐름도: [https://gitmind.com/app/docs/mnm9yxj0](https://gitmind.com/app/docs/mnm9yxj0)
