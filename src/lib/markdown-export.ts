// ============================================================
// AEO: 콘텐츠 → 마크다운 변환기
// LLM 크롤러(GPTBot/ClaudeBot/PerplexityBot)는 마크다운을 가장 잘 소화한다.
// /treatments/:slug.md, /glossary/:slug.md, /blog/:slug.md 및 /llms-full.txt에서 사용
// ============================================================
import { CLINIC } from './constants'
import type { TreatmentDetail } from '../data/treatments'
import type { GlossaryTerm } from '../data/glossary'

const base = () => `https://${CLINIC.domain}`

/** HTML → 플레인 마크다운 텍스트 (간이 변환 — Workers 경량 구현) */
export function htmlToMarkdown(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, '\n')
    .replace(/<h2[^>]*>/gi, '\n## ')
    .replace(/<h3[^>]*>/gi, '\n### ')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, '**$2**')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<img[^>]*alt="([^"]*)"[^>]*>/gi, '(이미지: $1)')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** 공통 푸터 — 출처/검수/연락처 (LLM 인용 유도) */
export function mdFooter(reviewerName?: string, reviewerTitle?: string): string {
  return [
    '',
    '---',
    '',
    `**출처**: ${CLINIC.name} (${base()})`,
    `**의학 검수**: ${reviewerTitle ?? '대표원장'} ${reviewerName ?? CLINIC.representative} (통합치의학과 전문의)`,
    `**주소**: ${CLINIC.address} (부평역 26번 출구 도보 1분)`,
    `**전화**: ${CLINIC.phone}`,
    '',
    '> 본 정보는 일반적인 의료 정보이며, 개인별 진단·치료는 반드시 전문의 상담을 거쳐야 합니다.',
  ].join('\n')
}

/** 진료과목 → 마크다운 */
export function treatmentToMarkdown(t: TreatmentDetail, doctorName?: string, doctorTitle?: string): string {
  const lines: string[] = [
    `# ${t.name} (${t.nameEn})`,
    '',
    `> ${t.tagline}`,
    '',
    `**페이지**: ${base()}/treatments/${t.slug}`,
    '',
    '## 개요',
    '',
    t.overview,
    '',
  ]

  if (t.whyUs?.length) {
    lines.push(`## ${CLINIC.name} ${t.name}의 차별점`, '')
    for (const w of t.whyUs) lines.push(`- **${w.title}**: ${w.desc}`)
    lines.push('')
  }

  if (t.process?.length) {
    lines.push('## 치료 과정', '')
    for (const p of t.process) lines.push(`${p.step}. **${p.title}** — ${p.desc}`)
    lines.push('')
  }

  for (const s of t.sections) {
    lines.push(`## ${s.heading}`, '')
    for (const b of s.body) lines.push(b, '')
    if (s.bullets?.length) {
      for (const bl of s.bullets) lines.push(`- ${bl}`)
      lines.push('')
    }
  }

  if (t.devices?.length) {
    lines.push('## 사용 장비', '')
    for (const d of t.devices) lines.push(`- ${d}`)
    lines.push('')
  }

  if (t.priceNote) {
    lines.push('## 비용 안내', '', t.priceNote, '')
  }

  if (t.faqs?.length) {
    lines.push('## 자주 묻는 질문 (FAQ)', '')
    for (const f of t.faqs) {
      lines.push(`### Q. ${f.q}`, '', f.a, '')
    }
  }

  lines.push(mdFooter(doctorName, doctorTitle))
  return lines.join('\n')
}

/** 백과사전 용어 → 마크다운 */
export function glossaryToMarkdown(term: GlossaryTerm): string {
  const lines: string[] = [
    `# ${term.term}${term.termEn ? ` (${term.termEn})` : ''}`,
    '',
    `> ${term.definition}`,
    '',
    `**페이지**: ${base()}/glossary/${term.slug}`,
    `**분류**: 치과 백과사전 / ${term.category}`,
    '',
  ]
  if (term.body) {
    lines.push('## 상세 설명', '', htmlToMarkdown(term.body), '')
  }
  if (term.relatedTreatments?.length) {
    lines.push('## 관련 진료', '')
    for (const s of term.relatedTreatments) lines.push(`- ${base()}/treatments/${s}`)
    lines.push('')
  }
  lines.push(mdFooter())
  return lines.join('\n')
}

/** 블로그 포스트(DB row) → 마크다운 */
export function blogToMarkdown(post: {
  slug: string
  title: string
  excerpt?: string | null
  content: string
  category?: string | null
  published_at: string
  updated_at?: string | null
}, authorName?: string, authorTitle?: string): string {
  const lines: string[] = [
    `# ${post.title}`,
    '',
    ...(post.excerpt ? [`> ${post.excerpt}`, ''] : []),
    `**페이지**: ${base()}/blog/${post.slug}`,
    `**발행일**: ${post.published_at?.slice(0, 10)}`,
    ...(post.updated_at && post.updated_at > post.published_at ? [`**수정일**: ${post.updated_at.slice(0, 10)}`] : []),
    ...(post.category ? [`**카테고리**: ${post.category}`] : []),
    '',
    htmlToMarkdown(post.content),
  ]
  lines.push(mdFooter(authorName, authorTitle))
  return lines.join('\n')
}
