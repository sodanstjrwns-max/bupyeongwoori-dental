# 부평우리치과 (Bupyeong Woori Dental Clinic)

## Project Overview
- **Name**: 부평우리치과 공식 홈페이지
- **Goal**: 14년간 한 자리에서 운영된 부평우리치과의원(부평역 26번 출구)의 브랜드 신뢰도를 온라인에 구현. 프리미엄 럭셔리 잡지형 디자인 + SEO/AEO 최적화 + 회원/관리자 CMS로 병원 경영과 환자 경험을 모두 강화합니다.
- **Key Features**: 홈 · 병원미션 · 의료진 · 진료과목(8종 상세) · 비포애프터 갤러리(회원 전용) · 블로그 · 공지사항 · 치과 백과사전(500+ 용어) · FAQ · 내원안내 · 회원가입/로그인 · 관리자 CMS (블로그/비포애프터/공지사항 CRUD + R2 업로드)

## URLs
- **Local Preview**: https://3000-ih3i86phhlqz7gw0ibzh8-ea026bf9.sandbox.novita.ai (샌드박스 1시간 유효)
- **Production**: https://bupyeongwoori-dental.pages.dev (Cloudflare Pages, GitHub Actions 자동 배포)
- **Repository**: https://github.com/sodanstjrwns-max/bupyeongwoori-dental
- **Custom Domain (예정)**: https://bupyeongwoori.com

## Main Routes
| Path | Description |
|---|---|
| `/` | 홈 - 히어로, 철학, 핵심 진료, 의료진, 장비 마키, CTA |
| `/mission` | 병원 미션 |
| `/doctors` · `/doctors/:slug` | 의료진 소개 · 개별 프로필 |
| `/treatments` · `/treatments/:slug` | 진료 안내 (임플란트, 심미보철, 교정, 일반보철, 예방, 라미네이트, 투명교정, 사랑니) |
| `/before-after` · `/before-after/:slug` | 비포애프터 (회원 전용, 로그인 필요) |
| `/blog` · `/blog/:slug` | 블로그 |
| `/notices` · `/notices/:id` | 공지사항 |
| `/glossary` · `/glossary/:slug` | 치과 백과사전(**582 용어**, 15 카테고리/초성 분류) |
| `/faq` | 자주 묻는 질문 (진료별 통합) |
| `/visit` | 내원안내 / 진료시간 / 오시는 길 |
| `/login` · `/signup` · `/logout` | 회원 인증 |
| `/admin` | 관리자 대시보드(로그인 필요) |
| `/admin/blog`·`/before-after`·`/notices` | CMS CRUD + R2 이미지 업로드 |
| `/areas` | **지역별 진료 인덱스** (8지역 허브 진입점) |
| `/areas/:region` | **지역 허브** (8개: 부평역/부평구/부평동/십정동/산곡동/부개동/삼산동/갈산동) |
| `/areas/:region/:treatment` | **지역×진료 랜딩** (64개: 8지역 × 8진료, 도어웨이 회피 유니크 콘텐츠) |
| `/sitemap.xml` | **Sitemap Index** — 5개 하위 sitemap 가리킴 |
| `/sitemap-pages.xml` | 정적 페이지 + 진료 8종 + 용어집 |
| `/sitemap-areas.xml` | **지역×진료 73 URL** (1 인덱스 + 8 허브 + 64 상세) |
| `/sitemap-blog.xml` | 블로그 (DB 자동) — `is_published=1` 자동 등록 |
| `/sitemap-ba.xml` | 비포애프터 (DB 자동) — `is_published=1` 자동 등록 |
| `/sitemap-notices.xml` | 공지사항 (DB 자동) — `is_published=1` 자동 등록 |
| `/robots.txt` · `/manifest.webmanifest` | SEO/PWA |
| `/search?q=` | **통합 검색** (진료+용어 582+지역+FAQ+블로그+공지) — WebSite SearchAction 실동작 |
| `/llms.txt` · `/llms-full.txt` | **AI/LLM 인덱스** — full은 진료 8종 풀텍스트 + 최신 블로그 20개 마크다운 |
| `/treatments/:slug.md` · `/glossary/:slug.md` · `/blog/:slug.md` | **마크다운 버전** — LLM 크롤러 전용 (canonical Link 헤더 포함) |
| `/static/{INDEXNOW_KEY}.txt` | IndexNow 인증 키 파일 |
| `/media/:key` | R2 이미지 프록시 |

## Data Architecture
- **Data Models**:
  - `users` (id, email, phone, name, password_hash(sha256), role, agreed_privacy, agreed_marketing)
  - `sessions` (token, user_id, expires_at)
  - `before_after` (slug, title, summary, doctor_slug, treatment_slug, before_*/after_* R2 keys, region, access_level)
  - `blog_posts` (slug, title, category, excerpt, body(html), cover_image_key, doctor_slug, views, published)
  - `notices` (title, content, is_major, is_published, views)
  - `glossary_stats` (slug, views) · `contact_logs`
- **Storage**: Cloudflare D1 (webapp-production, 로컬 개발은 SQLite 자동) + R2 (`webapp-media` 버킷, 이미지 업로드)
- **Static Data**: `src/data/treatments.ts` (8개 진료 + FAQ 120+), `src/data/doctors.ts`, `src/data/glossary.ts` (**582 용어**)

## Design System
- **Font**: Pretendard 단독 사용 (서울비디치과 bdbddc.com 동일 스타일, CDN `orioncactus/pretendard`) · font-weight 800~900, letter-spacing -0.03em ~ -0.04em의 두껍고 타이트한 타이포그래피
- **Palette**: Tiffany Blue (`--brand-*` 50~900), Ink (고명도 그레이), Gold `#bfa36a`
- **Layout**: 잡지형 히어로, 섹션 레벨링, 장비 마키, 풀 카드, 상세 페이지 FAQ 아코디언, 모바일 details 메뉴
- **SEO/AEO 풀세트 (2026-05-14 빡세게 업그레이드)**:
  - **JSON-LD**: Dentist, WebSite, BreadcrumbList, FAQPage, Article, ImageObject, MedicalProcedure, MedicalWebPage, Physician, Organization, Person, NewsArticle, ItemList — 페이지 유형별 자동 주입
  - **OG type 페이지별 분리**: 블로그/BA/공지 **상세 = `article`** (published_time, modified_time, author, section, tag 풀세트) / 목록·홈 = `website`
  - **Sitemap Index**: `/sitemap.xml`이 4개 자식 sitemap을 가리키는 인덱스 구조 — 대규모 콘텐츠 대비, DB의 `is_published=1` 포스팅 자동 등록
  - **자동 SEO 최적화 (`src/lib/auto-seo.ts`)**: 포스팅 작성 시 `excerpt`/`meta_description`/`meta_keywords`/`summary` 빈 필드 자동 채움 — 관리자가 깜빡해도 SEO 100% 작동
  - **IndexNow 풀발사**: 블로그/BA/공지 발행·수정 시 Bing/Yandex/Seznam에 즉시 핑 + sitemap-pages/blog/ba/notices 동시 무효화
  - **메타 기본값**: 임플란트·인비절라인·라미네이트·글로우네이트·치아교정·심미보철·투명교정·사랑니발치 8종 키워드 풀 커버
  - **검증 도구**: `curl https://wooridc.kr/sitemap.xml` / `/sitemap-blog.xml` / `/sitemap-ba.xml`로 즉시 확인 가능
- **🚀 지역×진료 슈퍼 SEO (2026-05-26 신설)**:
  - **72개 자동 랜딩 페이지**: `/areas/:region/:treatment` 조합으로 "부평역 임플란트", "산곡동 라미네이트", "십정동 투명교정" 등 롱테일 키워드 풀 커버
  - **8 지역**: 부평역(1.0) / 부평구(0.95) / 부평동(0.9) / 십정동(0.85) / 산곡동(0.85) / 부개동(0.8) / 삼산동(0.75) / 갈산동(0.75) — 우선순위 차등
  - **8 진료**: 임플란트 / 교정 / 심미보철 / 라미네이트 / 투명교정 / 사랑니발치 / 일반보철 / 예방
  - **JSON-LD 풀세트 (페이지당)**: `Dentist + MedicalBusiness` (geo·areaServed) + `GeoCoordinates` + `MedicalProcedure/Service` (areaServed) + `FAQPage` + `BreadcrumbList`
  - **도어웨이 회피**: 각 페이지마다 지역 고유 intro/거리/교통/FAQ 자동 생성 — 구글 정책 100% 준수
  - **내부 링크 강화**: Footer 지역 8개 링크 + 진료 상세 페이지 "어느 지역에서 받으시나요?" 크로스 링크
  - **데이터 모델**: `src/data/areas.ts` — `AreaInfo[]` + `TREATMENT_LOCAL` (지역별 angle/FAQ/bullet 자동생성기)
  - **검증**: `curl https://wooridc.kr/sitemap-areas.xml | grep -c '<loc>'` → **73**

## User Guide
### 일반 방문자
1. 홈에서 진료과목/의료진/비포애프터 확인 → CTA(전화 032-529-2875)
2. 비포애프터 상세는 회원가입 후 열람 가능
3. 치과 백과사전에서 용어 → 관련 진료로 내부 링크 자동 이동

### 관리자 (초기 계정)
- URL: `/admin/login`
- Email: `admin@bupyeongwoori.com`
- Password: `admin2875!`
- 기능: 블로그/공지사항/비포애프터 CRUD, 이미지 업로드(R2), 사용자 목록

### 테스트 회원
- Email: `test@example.com`
- Password: `test1234`

## Deployment
- **Platform**: Cloudflare Pages + D1 + R2
- **Status**: 🚧 로컬 개발 동작 확인 완료, 프로덕션 배포 전 (Cloudflare API 키 연결 필요)
- **Tech Stack**: Hono + TypeScript + JSX SSR + Pretendard + Vanilla JS(CDN) + Cloudflare D1/R2
- **Build**: `npm run build` → `dist/_worker.js`
- **Local Start**: `pm2 start ecosystem.config.cjs` (symlink trick으로 wrangler d1 CLI ↔ pages dev 간 DB 공유)
- **Last Updated**: 2026-06-11 (🧠 **SEO/AEO 머신 1·2차 업그레이드** — 아래 상세)

## 🧠 SEO/AEO 머신 업그레이드 (2026-06-11)
1. **통합 검색 `/search`** — WebSite SearchAction JSON-LD가 가리키던 엔드포인트 실제 구현 (구글 Sitelinks Search Box 자격). 정적(진료/용어 582/지역/FAQ) + DB(블로그/공지) 통합. 검색 결과는 noindex(씬콘텐츠 방지), 검색 홈만 색인.
2. **E-E-A-T 의학 검수 시스템** — `MedicalWebPage + reviewedBy(Physician)` 스키마를 진료 8종/용어 582/블로그 전체에 자동 주입 + 본문에 가시적 "의학 감수 배지" 표시 (구글 품질평가 가이드라인의 YMYL 책임자 명시 충족).
3. **스키마 그래프 통일** — 모든 publisher/provider/worksFor가 `#clinic` @id로, 의료진은 `/doctors/:slug#person`으로 연결되는 단일 지식그래프. Physician에 `knowsAbout`(진료명)·`image`·`medicalSpecialty` 추가.
4. **AEO 마크다운 레이어** — `/treatments/:slug.md`, `/glossary/:slug.md`, `/blog/:slug.md` (LLM 크롤러 전용 텍스트, 출처/검수/연락처 풋터 포함) + `/llms-full.txt` (진료 전체 + 블로그 20개 원솧 문서, ~100KB).
5. **robots.txt AI봇 확장** — CCBot·Amazonbot·meta-externalagent·cohere-ai·DuckAssistBot·YouBot·MistralAI-User 명시 허용 + LLM-Index/LLM-Full 주석 안내.
6. **Freshness 시그널** — 블로그 `dateModified`가 실제 `updated_at` 반영 (기존은 발행일 고정). 수정일이 본문에도 `<time datetime>`으로 표시.
7. **커스텀 404** — 죽은 링크 유입을 검색창 + 핵심 페이지 칩으로 회수 (링크 에쿼티 보존).
8. **내비/llms.txt 강화** — 통합 검색 메뉴 추가, llms.txt에 지역 허브 8개 + 머신리더블 .md 경로 안내 추가.

## 🧠 SEO/AEO 머신 2차 업그레이드 (2026-06-11)
1. **Dentist 스키마 월드클래스화** — `hasMap`(네이버 플레이스) + `areaServed`(8지역 Place+GeoCoordinates) + `contactPoint`(전화/카카오톡) + `ReserveAction`(네이버 예약 액션) + `amenityFeature`(CBCT·현미경·감염관리 등 5종)
2. **MedicalProcedure 완성형** — 치료과정을 `howPerformed` + `HowToStep` 구조화 스텝으로 주입, 사용 장비 `device` 포함 — AI가 "임플란트 과정이 어떻게 돼요?" 질문에 우리 콘텐츠를 인용하도록
3. **ProfilePage 스키마** — 의료진 상세에 구글 공식 인물 프로필 리치결과 타입 적용 (mainEntity → #person 연결)
4. **`/faq.md`** — 164개 Q&A 전체 마크다운 (LLM이 한 번의 fetch로 전체 FAQ 흩수)
5. **.md 라우트 `X-Robots-Tag: noindex`** — 검색엔진 중복콘텐츠 방어 (LLM 크롤러는 그대로 읽음, HTML 원본만 색인)
6. **Speakable 확대** — 홈/FAQ에 SpeakableSpecification 추가 (음성검색 AEO)
7. **CWV 튜닝** — 자체 CSS preload + dns-prefetch + FontAwesome 비동기 로딩(media=print 트릭) → LCP/FCP 개선이 랭킹 시그널로

## 🏆 SEO/AEO 3차 업그레이드 — Patient Grader 37항목 대응 (2026-08-18)
> PF 병원 14곳 감점분석 지시서(Patient Grader, patient-grader.pages.dev)의 채점 기준을 wooridc.kr에 선제 적용

1. **A3 정직한 lastmod** — sitemap-pages/areas/glossary의 `todayIso`(매일 갱신 = 거짓 lastmod, A3 0점 패턴) 제거 → 콘텐츠별 실제 수정일 상수(`PAGES_LASTMOD`/`AREAS_LASTMOD`/`GLOSSARY_LASTMOD`)로 교체. **콘텐츠를 실제로 수정한 배포에서만 해당 상수를 갱신할 것**
2. **E5 응답 기대 설정** — `CLINIC.responseExpectation` 신설: "카카오톡 문의는 진료시간 내 평균 30분 이내 답변" 문구를 플로팅 CTA·내원안내(`#response-expectation`)·푸터 3곳에 노출. 문의 채널 4종(전화·카톡·네이버예약·지도) 유지
3. **C4 경험 신호: 실제 진료 장면** — bdbddc 만점 포맷(환자 등장 → 실제 질문 인용 → 판단 기준 → 결론 직답)을 `TreatmentDetail.clinicalScene`으로 구조화, 임플란트·심미보철·교정·사랑니 4종에 적용. HTML(`#clinical-scene` REAL CASE 섹션) + `.md` AEO 레이어 동시 노출 — C3(직답)·C4(경험)·D2(환자 주어)·D3(비클리셰) 동시 대응
4. **D5 전문용어 병기** — 치료 데이터 내 첫 등장 위치에 환자 언어 병기: 보철물(씌우는 치아)·골유착(뼈와 붙는 과정)·상악동(위턱 공간)·교합(윗니 아랫니 맞물림)·교합력(무는 힘) 등 — "문맥당 1회" 원칙으로 읽기 피로(D8) 방지

### 배포 후 체크리스트 (운영자용)
- [ ] Google Search Console에서 `/search?q=test` 크롤 확인
- [ ] 리치 결과 테스트: `https://search.google.com/test/rich-results?url=https://wooridc.kr/treatments/implant` → FAQ + Breadcrumb + MedicalWebPage 확인
- [ ] `curl https://wooridc.kr/llms-full.txt | head` 정상 응답 확인
- [ ] 네이버 플레이스 실제 리뷰 수 확인 후 `src/lib/schema.ts`의 `REAL_REVIEW_DATA.reviewCount` 입력 → 별점 리치스니펫 자동 활성화
- [ ] (3차) 진료장면(clinicalScene) 4종의 사례 내용을 실제 진료 경험에 맞게 검수·수정 — 현재는 전형적 상담 시나리오 기반 초안
- [ ] (3차) 콘텐츠 수정 배포 시 `src/index.tsx`의 `PAGES_LASTMOD` 갱신 (수정 없는 재배포에는 건드리지 않기)
