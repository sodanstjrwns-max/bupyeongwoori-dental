// ============================================================
// 자동 SEO 최적화 — 포스팅 작성 시 빈 필드 자동 채우기
// (관리자가 깜빡하고 비워둬도 SEO/AEO가 100% 작동하도록)
// ============================================================
import { CLINIC } from './constants'

const stripHtml = (html: string): string =>
  (html || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim()

const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + '…' : s)

/**
 * 한글/영문 슬러그 자동 생성 (한글은 그대로 둠 — Google은 한글 URL OK)
 */
export function autoSlug(title: string, fallbackId?: number): string {
  const base = (title || '').trim()
    .toLowerCase()
    .replace(/[^\w가-힣\s-]/g, '') // 한글·영문·숫자·하이픈만
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  if (base && base.length >= 2) return base.slice(0, 80)
  return `post-${fallbackId ?? Date.now()}`
}

/**
 * 블로그 포스트 — 빈 필드 자동 채우기
 * - excerpt가 비어있으면 content 첫 160자
 * - meta_description이 비어있으면 excerpt 또는 content 요약
 * - meta_keywords가 비어있으면 category + tags + 기본 키워드
 */
export function autoFillBlogSeo(input: {
  title: string
  excerpt?: string | null
  content?: string | null
  category?: string | null
  tags?: string | null
  meta_description?: string | null
  meta_keywords?: string | null
}) {
  const title = (input.title || '').trim()
  const contentText = stripHtml(input.content || '')

  // excerpt 자동
  let excerpt = (input.excerpt || '').trim()
  if (!excerpt && contentText) excerpt = clip(contentText, 160)

  // meta_description 자동 (150자 권장)
  let metaDesc = (input.meta_description || '').trim()
  if (!metaDesc) {
    const source = excerpt || contentText || `${title} | ${CLINIC.name}`
    metaDesc = clip(source, 150)
  }

  // meta_keywords 자동
  let metaKw = (input.meta_keywords || '').trim()
  if (!metaKw) {
    const parts = [
      input.category,
      ...(input.tags ? input.tags.split(',').map((t) => t.trim()) : []),
      '부평치과',
      '부평우리치과',
      '부평역치과',
      '부평 임플란트',
      '부평 교정',
      '부평 라미네이트',
    ].filter(Boolean) as string[]
    // 중복 제거
    metaKw = Array.from(new Set(parts)).slice(0, 12).join(', ')
  }

  return {
    excerpt: excerpt || null,
    meta_description: metaDesc || null,
    meta_keywords: metaKw || null,
  }
}

/**
 * 비포애프터 — 빈 필드 자동 채우기
 * - summary가 비어있으면 "[진료명] 케이스 — [제목]"
 */
export function autoFillBaSeo(input: {
  title: string
  summary?: string | null
  content?: string | null
  treatment_name?: string | null
}) {
  const title = (input.title || '').trim()
  const contentText = stripHtml(input.content || '')
  let summary = (input.summary || '').trim()
  if (!summary) {
    if (contentText) {
      summary = clip(contentText, 150)
    } else {
      summary = `${input.treatment_name ?? '진료'} 실제 케이스 — ${title}. ${CLINIC.name}의 검증된 진료 결과를 확인하세요.`
    }
  }
  return { summary: clip(summary, 200) }
}

/**
 * IndexNow 발사용 URL 묶음 빌더 — 항상 sitemap.xml + 메인 + 카테고리 인덱스까지
 */
export function buildIndexNowUrls(opts: {
  detailPath: string  // 예: /blog/my-post 또는 /before-after/case-1
  listPath: string    // 예: /blog 또는 /before-after
  alsoPingHome?: boolean
}): string[] {
  const urls = [
    opts.detailPath,
    opts.listPath,
    '/sitemap.xml',
    '/sitemap-blog.xml',
    '/sitemap-ba.xml',
    '/sitemap-notices.xml',
    '/sitemap-pages.xml',
  ]
  if (opts.alsoPingHome) urls.unshift('/')
  // 중복 제거
  return Array.from(new Set(urls))
}
