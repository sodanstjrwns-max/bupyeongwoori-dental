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
| `/sitemap.xml` · `/robots.txt` · `/manifest.webmanifest` | SEO/PWA |
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
- **SEO**: JSON-LD (Dentist, WebSite, Breadcrumb, FAQPage, Article, Physician), OG, Twitter, canonical, robots, sitemap

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
- **Last Updated**: 2026-04-20
