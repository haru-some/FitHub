# 🏋️‍♂️ FitHub - 소셜 피트니스 플랫폼

<p align="left">
  <img src="./docs/fithub.png" alt="FitHub" width="500"/>
</p>

> **기록, 소통, 실천이 연결되는 통합 피트니스 플랫폼**

FitHub는 운동 기록, 목표 관리, 커뮤니티 소통, 상품 거래를 한 번에 지원하는 웹 기반 소셜 피트니스 플랫폼입니다.  
사용자 중심의 운동 데이터를 효율적으로 시각화하고, 실시간 소통과 구매 경험까지 아우르는 통합 서비스를 제공합니다.

React 기반 CSR(Client Side Rendering)과 Spring Boot 기반 RESTful API 서버를 활용하여 SPA 아키텍처를 구성하고,  
실시간 상호작용과 기술 확장성을 고려한 구조로 개발하였습니다.


---
<br>

## 🛠️ 개발환경 및 기술 스택

> Java 17, Spring Boot 3.4.3, MyBatis, Oracle 11g XE, React, Recoil, Node.js, AWS EC2, GitHub Actions 기반 개발

| 구분 | 내용 |
|--------|---------|
| **Language** | Java 17, JavaScript, SQL |
| **Frontend** | React, Recoil, React Router, Axios, MUI |
| **Backend** | Spring Boot 3.4.3, Spring Security, MyBatis |
| **Database & Tools** | Oracle 11g XE, SQL Developer, STS4, VS Code, Swagger |
| **Infra & DevOps** | AWS EC2, GitHub Actions, Google Cloud Console |
| **협업 도구** | GitHub, Notion, Figma, ERDCloud, GitMind |
| **마크업 & 스타일링** | HTML5, CSS, MUI |

---
<br>

## 📌 주요 기능 요약

> 🧩 **#FullStack #SpringBoot #React #MyBatis #JWT #OAuth #WebSocket #CI/CD #OracleDB**

&nbsp;&nbsp;&nbsp;🧾 **회원가입 / 로그인 / 소셜 로그인 (OAuth2)**  
&nbsp;&nbsp;&nbsp;🔑 **JWT 기반 인증 시스템 및 토큰 재발급**  
&nbsp;&nbsp;&nbsp;🧍‍♂️ **마이페이지&nbsp;:&nbsp;정보 수정 / 비밀번호 변경 / 탈퇴 / 이미지 업로드**  
&nbsp;&nbsp;&nbsp;🏃 **My Fit&nbsp;:&nbsp;루틴 생성, 운동 기록, 통계 시각화, AI 분석**  
&nbsp;&nbsp;&nbsp;📝 **커뮤니티&nbsp;:&nbsp;게시글, 댓글, 좋아요, 검색, 팔로우, DM 실시간 채팅**  
&nbsp;&nbsp;&nbsp;🛒 **마켓&nbsp;:&nbsp;상품 등록/수정/삭제, 장바구니, 결제, 리뷰**  
&nbsp;&nbsp;&nbsp;🛠 **관리자&nbsp;:&nbsp;회원 관리, 게시물/댓글 관리, 통계, 광고 랜덤 출력, 문의 채팅**

---
<br>

## ⚙️ 아키텍처 및 핵심 구조

- **SPA 구조** : React + Recoil 기반 CSR  
- **JWT 인증** : AccessToken + RefreshToken 전략 / Interceptor 적용  
- **Spring Boot** : RESTful API 서버 / MyBatis 기반 DB 접근  
- **CI 구성** : GitHub Actions 기반 자동 빌드 및 테스트  
- **배포** : AWS EC2 수동 배포 / 환경변수 관리  

---
<br>

## 💡 기능 상세 설명

### &nbsp;&nbsp;&nbsp;👤 회원 시스템
- 아이디 중복 확인, 비밀번호 정규식 검증  
- 이메일 인증번호 발송 + 검증, 주소 검색 API 연동  
- MUI 기반 UI 구성 + SweetAlert 토스트 알림 적용  

---

### &nbsp;&nbsp;&nbsp;🏃 My Fit
- 요일별 루틴 작성 및 날짜별 기록 저장  
- 운동 시간 및 메모 기록 → AI 요약 결과 제공  
- 루틴/기록 별 통계 제공 (그래프 & 요약형 전환)  

---

### &nbsp;&nbsp;&nbsp;🗣 커뮤니티 & DM
- 게시글/댓글 CRUD 및 좋아요, 팔로우 기능  
- 팔로잉 유저 중심의 피드 구성  
- WebSocket 기반 1:1 실시간 채팅방 구성  

---

### &nbsp;&nbsp;&nbsp;🛍 마켓
- 관리자 상품 등록 → 회원이 장바구니 담기 / 구매  
- 구매 내역 확인 및 리뷰 작성, 삭제 가능  
- 결제 및 매출 통계 DB 연동 처리  

---

### &nbsp;&nbsp;&nbsp;🛠 관리자
- 회원 등급 관리(일반/관리자/경고/블랙), 강제 탈퇴  
- 게시글 및 댓글 모니터링 및 제재  
- Google Analytics 연동 + DB 기반 매출 통계 시각화  
- 광고 등록 및 랜덤 노출, 실시간 문의 채팅 대응  

---
<br>

## 🧠 트러블 슈팅 사례

&nbsp;&nbsp;&nbsp; 🔄 **JWT 재인증 문제 해결**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - 앱 재로드 시 accessToken 소멸 문제 → refreshToken 활용해 자동 재발급 처리  

&nbsp;&nbsp;&nbsp; 🖼 **이미지 삭제 처리 문제 해결**  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; - 프로필 이미지 재등록 시, 기존 이미지 남는 현상 → FormData에서 명확한 상태값 전달로 해결  

---
<br><br>

## 📆 개발 일정

| 구분 | 기간 | 내용 |
|-------|-------|---------|
| 기획 및 조사 | 03.19 ~ 03.24 | 서비스 분석, ERD 구조 수립 |
| 디자인 설계 | 03.24 ~ 03.27 | Figma 기반 와이어프레임 작성 |
| 기능 구현 | 03.26 ~ 04.08 | 프론트/백엔드 모듈 병렬 개발 |
| 통합 테스트 | 04.08 ~ 04.15 | 기능 연결, 오류 수정 및 QA |
| 발표 준비 | 04.14 ~ 04.17 | 최종 보고서 작성 및 발표 리허설 |

---
<br>

## 🤝 팀 구성 및 역할

| 이름 | 담당 파트 | 담당 기능 |
|-------|------|------------|
| **최승현** | Member | 로그인, 회원가입, 소셜 로그인, JWT 인증, 마이페이지, 공통 레이아웃, 메인페이지, 문서화 |
| 전한기 | My Fit | 루틴 등록, 운동 기록, 활동 로그, 통계, DM |
| 나한빈 | Community | 커뮤니티 CRUD, 댓글, 좋아요, 팔로우 기능 |
| 정호균 | Market | 마켓 상품 관리, 장바구니, 결제, 리뷰 |
| 양현석 | Admin | 관리자 기능 전체 (회원/게시물/통계/광고/채팅) |

---
<br>

## 🎓 프로젝트를 통해 성장한 점

- JWT 인증과 OAuth를 직접 구현하며 인증 시스템에 대한 깊은 이해를 얻음  
- SPA 구조에서 전역 상태 관리(Recoil)와 컴포넌트 분리 전략을 명확히 설계함  
- 실시간 WebSocket 기반 채팅 기능을 처음 도입하며 데이터 흐름을 설계함  
- MyBatis + Oracle 조합으로 실전형 SQL 튜닝 및 매핑 역량 향상  

---
<br>

## 🔗 프로젝트 링크

- 🔗 [GitHub Repository](https://github.com/haru-some/FitHub)  
- 📑 [Notion 프로젝트 상세보기](https://ubertech.notion.site/project-fithub)  
- 🎨 [Figma 와이어프레임](https://www.figma.com/design/OSrMPywXNgLBfsVaFrVCUc/FitHub)  
- 🧠 [ERD 전체 구성](https://www.erdcloud.com/p/RN4KimsQuj8Xq65aK)  
- 📌 [GitMind 흐름도](https://gitmind.com/app/docs/mnm9yxj0)  
- 📘 [프로젝트 개발 보고서 보기 (PDF)](./docs/FitHub_Project_development_report.pdf)  

---
<br>

<p align="center">
  💪 <strong>사용자 중심의 운동 경험을 위해 고민하고 구현한 결과물입니다. 성실하게 만들었습니다. 감사합니다.</strong> 💪
</p>

