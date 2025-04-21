# 🏋️‍♂️ FitHub - 소셜 피트니스 플랫폼

> **기록, 소통, 실천이 연결되는 통합 피트니스 플랫폼**

FitHub는 사용자의 운동 기록과 목표 관리를 기반으로, 커뮤니티 소통 및 운동 상품 거래 기능을
통합한 웹 기반 소셜 피트니스 플랫폼입니다.  
React 기반 CSR(Client Side Rendering)과 Spring Boot 기반 RESTful API 서버를 활용하여 SPA 아키텍처를 구성하고,
실시간 상호작용과 기술 확장성을 고려한 구조로 개발하였습니다.

---

## 🛠️ 개발환경 및 기술 스택

> Java 17, Spring Boot, MyBatis, Oracle 11g XE, React, Recoil, Node.js, AWS EC2, GitHub Actions 기반 개발

| 구분 | 내용 |
|--------|---------|
| **Language** | Java 17, JavaScript, SQL |
| **Frontend** | React, Recoil, React Router, Axios, MUI |
| **Backend** | Spring Boot, Spring Security, MyBatis |
| **Database & Tools** | Oracle 11g XE, SQL Developer, STS4, VS Code, Swagger |
| **Infra & DevOps** | AWS EC2, GitHub Actions, Google Cloud Console |
| **협업 도구** | GitHub, Notion, Figma, ERDCloud, GitMind |
| **마크업 & 스타일링** | HTML5, CSS, MUI |

---

## 📌 주요 기능 요약

- 🧾 **회원가입 / 로그인 / 소셜 로그인 (OAuth2)**
- 🔑 **JWT 기반 인증 시스템 및 토큰 재발급**
- 🧍‍♂️ **마이페이지: 정보 수정 / 비밀번호 변경 / 탈퇴 / 이미지 업로드**
- 🏃 **My Fit: 루틴 생성, 운동 기록, 통계 시각화, AI 분석**
- 📝 **커뮤니티: 게시글, 댓글, 좋아요, 검색, 팔로우, DM 실시간 채팅**
- 🛒 **마켓: 상품 등록/수정/삭제, 장바구니, 결제, 리뷰**
- 🛠 **관리자: 회원 관리, 게시물/댓글 관리, 통계, 광고 랜덤 출력, 문의 채팅**

---

## ⚙️ 아키텍처 및 핵심 구조

- **SPA 구조**: React + Recoil 기반 CSR
- **JWT 인증**: AccessToken + RefreshToken 전략 / Interceptor 적용
- **Spring Boot**: RESTful API 서버 / MyBatis 기반 DB 접근
- **CI 구성**: GitHub Actions 기반 자동 빌드 및 테스트
- **배포**: AWS EC2 수동 배포 / 환경변수 관리

---

## 💡 기능 상세 설명

### 👤 회원 시스템
- 아이디 중복 확인, 비밀번호 정규식 검증
- 이메일 인증번호 발송 + 검증, 주소 검색 API 연동
- MUI 기반 UI 구성 + SweetAlert 토스트 알림 적용

### 🏃 My Fit
- 요일별 루틴 작성 및 날짜별 기록 저장
- 운동 시간 및 메모 기록 → AI 요약 결과 제공
- 루틴/기록 별 통계 제공 (그래프 & 요약형 전환)

### 🗣 커뮤니티 & DM
- 게시글/댓글 CRUD 및 좋아요, 팔로우 기능
- 팔로잉 유저 중심의 피드 구성
- WebSocket 기반 1:1 실시간 채팅방 구성

### 🛍 마켓
- 관리자 상품 등록 → 회원이 장바구니 담기 / 구매
- 구매 내역 확인 및 리뷰 작성, 삭제 가능
- 결제 및 매출 통계 DB 연동 처리

### 🛠 관리자
- 회원 등급 관리(일반/관리자/경고/블랙), 강제 탈퇴
- 게시글 및 댓글 모니터링 및 제재
- Google Analytics 연동 + DB 기반 매출 통계 시각화
- 광고 등록 및 랜덤 노출, 실시간 문의 채팅 대응

---

## 🧠 트러블 슈팅 사례

- 🔄 **JWT 재인증 문제 해결**: 앱 재로드 시 accessToken 소멸 문제 → refreshToken 활용해 자동 재발급 처리
- 🖼 **이미지 삭제 처리 문제 해결**: 프로필 이미지 재등록 시, 기존 이미지 남는 현상 → FormData에서 명확한 상태값 전달로 해결

---

## 📆 개발 일정

| 구분 | 기간 | 내용 |
|-------|-------|---------|
| 기획 및 조사 | 03.19 ~ 03.24 | 서비스 분석, ERD 구조 수립 |
| 디자인 설계 | 03.24 ~ 03.27 | Figma 기반 와이어프레임 작성 |
| 기능 구현 | 03.26 ~ 04.08 | 프론트/백엔드 모듈 병렬 개발 |
| 통합 테스트 | 04.08 ~ 04.15 | 기능 연결, 오류 수정 및 QA |
| 발표 준비 | 04.14 ~ 04.17 | 최종 보고서 작성 및 발표 리허설 |

---

## 🤝 팀 구성 및 역할

| 이름 | 역할 | 담당 기능 |
|-------|------|------------|
| **최승현** | Member | 로그인, 회원가입, 소셜 로그인, JWT 인증, 마이페이지, 공통 레이아웃, 메인페이지, 문서화 |
| 전한기 | My Fit | 루틴 등록, 운동 기록, 활동 로그, 통계, DM |
| 나한빈 | Community | 커뮤니티 CRUD, 댓글, 좋아요, 팔로우 기능 |
| 정호균 | Market | 마켓 상품 관리, 장바구니, 결제, 리뷰 |
| 양현석 | Admin | 관리자 기능 전체 (회원/게시물/통계/광고/채팅) |

---

## 🔗 프로젝트 링크

- 🔗 GitHub Repository: [https://github.com/haru-some/FitHub](https://github.com/haru-some/FitHub)
- 📑 Notion 포트폴리오: [https://ubertech.notion.site/project-fithub](https://ubertech.notion.site/project-fithub)
- 🎨 Figma 와이어프레임: [Figma 바로가기](https://www.figma.com/design/OSrMPywXNgLBfsVaFrVCUc/FitHub)
- 🧠 ERD: [ERD 바로가기 ](https://www.erdcloud.com/p/RN4KimsQuj8Xq65aK)
- 📌 GitMind 흐름도: [깃마인드 바로가기](https://gitmind.com/app/docs/mnm9yxj0)
- 📘 프로젝트 개발 보고서 (PDF): [다운로드](./docs/FitHub_프로젝트_개발보고서.pdf)

