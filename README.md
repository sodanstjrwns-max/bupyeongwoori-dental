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
- **Last Updated**: 2026-05-26 (🚀 **지역×진료 슈퍼 SEO 풀세트** — 72개 자동 랜딩 페이지, MedicalBusiness+GeoCoordinates+Service JSON-LD, 도어웨이 회피, 내부 링크 강화, sitemap-areas.xml 신설, IndexNow 75개 URL 발사)
