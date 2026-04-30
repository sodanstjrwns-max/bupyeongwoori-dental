#!/usr/bin/env node
// OG 메타데이터 일괄 검증 스크립트
// Usage: node scripts/og-audit.mjs [base_url]

const BASE = process.argv[2] || 'https://wooridc.kr'

const PAGES = [
  { path: '/', label: '홈' },
  { path: '/mission', label: '미션' },
  { path: '/doctors', label: '의료진' },
  { path: '/treatments', label: '진료과목' },
  { path: '/treatments/implant', label: '진료-임플란트' },
  { path: '/before-after', label: '비포애프터' },
  { path: '/blog', label: '블로그' },
  { path: '/notices', label: '공지사항' },
  { path: '/visit', label: '내원안내' },
  { path: '/faq', label: 'FAQ' },
  { path: '/glossary', label: '백과사전' },
  { path: '/login', label: '로그인' },
  { path: '/signup', label: '회원가입' },
]

const REQUIRED_TAGS = [
  'og:title', 'og:description', 'og:image', 'og:url', 'og:type',
  'og:site_name', 'twitter:card', 'twitter:title', 'twitter:description',
  'twitter:image',
]

function extractMeta(html, key) {
  // og:* (property) and twitter:* (name) 둘 다 매칭
  const r1 = new RegExp(`<meta[^>]*property=["']${key}["'][^>]*content=["']([^"']*)["']`, 'i')
  const r2 = new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${key}["']`, 'i')
  const r3 = new RegExp(`<meta[^>]*name=["']${key}["'][^>]*content=["']([^"']*)["']`, 'i')
  const r4 = new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${key}["']`, 'i')
  return (html.match(r1) || html.match(r2) || html.match(r3) || html.match(r4) || [, null])[1]
}

function extractCanonical(html) {
  const r = /<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i
  return (html.match(r) || [, null])[1]
}

function extractTitle(html) {
  const r = /<title>([^<]*)<\/title>/i
  return (html.match(r) || [, null])[1]
}

function extractMetaDescription(html) {
  const r1 = /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i
  const r2 = /<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i
  return (html.match(r1) || html.match(r2) || [, null])[1]
}

async function fetchImageMeta(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' })
    return {
      ok: res.ok,
      status: res.status,
      contentType: res.headers.get('content-type'),
      contentLength: res.headers.get('content-length'),
    }
  } catch (e) {
    return { ok: false, status: 0, error: e.message }
  }
}

async function audit(page) {
  const url = BASE + page.path
  const result = {
    path: page.path, label: page.label, url,
    issues: [], warnings: [], passes: [],
  }

  let html
  try {
    const res = await fetch(url, { redirect: 'manual' })
    if (res.status >= 400) {
      result.issues.push(`HTTP ${res.status}`)
      return result
    }
    if (res.status >= 300 && res.status < 400) {
      result.warnings.push(`Redirect: ${res.status} → ${res.headers.get('location')}`)
    }
    html = await res.text()
  } catch (e) {
    result.issues.push(`Fetch failed: ${e.message}`)
    return result
  }

  // 모든 태그 추출
  result.title = extractTitle(html)
  result.description = extractMetaDescription(html)
  result.canonical = extractCanonical(html)
  result.meta = {}
  for (const tag of REQUIRED_TAGS) {
    result.meta[tag] = extractMeta(html, tag)
  }

  // 검증 1: 필수 태그 존재
  for (const tag of REQUIRED_TAGS) {
    if (!result.meta[tag]) {
      result.issues.push(`Missing: ${tag}`)
    } else {
      result.passes.push(tag)
    }
  }

  // 검증 2: title 길이
  if (result.title) {
    if (result.title.length > 60) result.warnings.push(`Title 길이 초과 (${result.title.length}>60)`)
    if (result.title.length < 10) result.warnings.push(`Title 너무 짧음 (${result.title.length}<10)`)
  } else {
    result.issues.push('No <title>')
  }

  // 검증 3: description 길이
  if (result.description) {
    if (result.description.length > 160) result.warnings.push(`Description 길이 초과 (${result.description.length}>160)`)
    if (result.description.length < 50) result.warnings.push(`Description 너무 짧음 (${result.description.length}<50)`)
  } else {
    result.issues.push('No meta description')
  }

  // 검증 4: og:url == canonical
  if (result.meta['og:url'] && result.canonical && result.meta['og:url'] !== result.canonical) {
    result.warnings.push(`og:url ≠ canonical (${result.meta['og:url']} vs ${result.canonical})`)
  }

  // 검증 5: og:image 절대 URL + 200 응답 + content-type
  const ogImg = result.meta['og:image']
  if (ogImg) {
    if (!ogImg.startsWith('http')) {
      result.issues.push(`og:image 상대 URL (${ogImg})`)
    } else {
      const meta = await fetchImageMeta(ogImg)
      result.imageMeta = meta
      if (!meta.ok) {
        result.issues.push(`og:image HTTP ${meta.status}`)
      } else {
        if (!meta.contentType || !meta.contentType.startsWith('image/')) {
          result.issues.push(`og:image 비-이미지 (${meta.contentType})`)
        }
        const size = parseInt(meta.contentLength || '0', 10)
        if (size > 0 && size > 8 * 1024 * 1024) result.warnings.push(`og:image >8MB`)
        if (size > 0 && size < 5 * 1024) result.warnings.push(`og:image <5KB (저품질)`)
      }
    }
  }

  // 검증 6: og:type 적정성
  const ogType = result.meta['og:type']
  if (ogType && !['website', 'article', 'profile', 'business.business'].includes(ogType)) {
    result.warnings.push(`og:type 비표준 (${ogType})`)
  }

  // 검증 7: twitter:card 값
  const twCard = result.meta['twitter:card']
  if (twCard && !['summary', 'summary_large_image', 'app', 'player'].includes(twCard)) {
    result.warnings.push(`twitter:card 비표준 (${twCard})`)
  }

  // 검증 8: 도메인 정합성
  if (result.canonical && !result.canonical.includes(new URL(BASE).hostname)) {
    result.issues.push(`canonical 외부 도메인 (${result.canonical})`)
  }
  if (ogImg && !ogImg.includes(new URL(BASE).hostname)) {
    result.warnings.push(`og:image 외부 도메인 (${ogImg})`)
  }

  return result
}

function printReport(results) {
  console.log('\n' + '='.repeat(80))
  console.log(`OG META AUDIT REPORT — ${BASE}`)
  console.log(`Generated: ${new Date().toISOString()}`)
  console.log('='.repeat(80))

  let totalIssues = 0, totalWarnings = 0
  for (const r of results) {
    const status = r.issues.length === 0 ? (r.warnings.length === 0 ? '✅' : '⚠️ ') : '❌'
    console.log(`\n${status} [${r.label}] ${r.path}`)
    console.log(`   Title: ${r.title?.slice(0, 70) || '(none)'}${r.title && r.title.length > 70 ? '…' : ''}`)
    console.log(`   Desc:  ${(r.description || '(none)').slice(0, 80)}${r.description && r.description.length > 80 ? '…' : ''}`)
    console.log(`   OGImg: ${r.meta?.['og:image'] || '(none)'}`)
    if (r.imageMeta) {
      console.log(`          → HTTP ${r.imageMeta.status} ${r.imageMeta.contentType} ${r.imageMeta.contentLength}B`)
    }
    if (r.issues.length) {
      console.log(`   ❌ Issues:   ${r.issues.join(' | ')}`)
      totalIssues += r.issues.length
    }
    if (r.warnings.length) {
      console.log(`   ⚠️  Warnings: ${r.warnings.join(' | ')}`)
      totalWarnings += r.warnings.length
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log(`SUMMARY: ${results.length} pages | ${totalIssues} issues | ${totalWarnings} warnings`)
  console.log('='.repeat(80) + '\n')

  return { totalIssues, totalWarnings }
}

async function main() {
  console.log(`Auditing ${PAGES.length} pages on ${BASE}...`)
  const results = []
  for (const p of PAGES) {
    process.stdout.write(`  ${p.path} ... `)
    const r = await audit(p)
    results.push(r)
    console.log(r.issues.length === 0 ? (r.warnings.length === 0 ? 'PASS' : 'WARN') : 'FAIL')
  }
  const { totalIssues } = printReport(results)

  // JSON 출력
  const fs = await import('fs')
  fs.writeFileSync('/tmp/og-audit-report.json', JSON.stringify(results, null, 2))
  console.log('JSON 리포트: /tmp/og-audit-report.json')

  process.exit(totalIssues > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(2) })
