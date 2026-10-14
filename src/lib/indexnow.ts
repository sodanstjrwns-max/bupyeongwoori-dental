/**
 * IndexNow API 통합
 * - Bing, Yandex, Seznam 등 IndexNow 지원 검색엔진에 즉시 색인 요청
 * - 키 파일: 사이트 루트 /{INDEXNOW_KEY}.txt 에 동일한 키 텍스트 노출 필요
 *   (키 파일이 /static/ 하위에 있으면 /static/* URL만 제출 가능 — 루트 필수)
 * - 호출 비동기(fire-and-forget) — 관리자 응답 지연 없음
 */

// 2026-10-14: 기존 키(900093ba…)는 키 파일이 정상(200 text/plain)인데도 api.indexnow.org·Bing이
// 403 UserForbiddedToAccessSite 를 반환(Yandex·네이버는 수락) → 새 키로 교체. 옛 키 파일은 public/ 에 보존.
export const INDEXNOW_KEY = 'd235d0807a8e34a5a382b8d9a84699cd'
const HOST = 'wooridc.kr'
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`
// IndexNow 통합 엔드포인트 (Bing이 Yandex 등으로 자동 전파)
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow'

/**
 * 단일 또는 다수 URL을 IndexNow에 핑
 * @param urls 절대 URL 또는 경로 배열 (경로면 자동으로 https://wooridc.kr 보강)
 * @returns 응답 상태 (실패해도 throw 안 함 — 어드민 흐름 막지 않음)
 */
export async function pingIndexNow(urls: string | string[]): Promise<{ ok: boolean; status?: number; error?: string }> {
  const urlList = (Array.isArray(urls) ? urls : [urls])
    .filter(Boolean)
    .map((u) => (u.startsWith('http') ? u : `https://${HOST}${u.startsWith('/') ? '' : '/'}${u}`))

  if (urlList.length === 0) return { ok: false, error: 'no urls' }

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList,
      }),
    })
    // 200/202 모두 정상 — Bing은 202 Accepted 반환
    return { ok: res.status >= 200 && res.status < 300, status: res.status }
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e) }
  }
}

/**
 * fire-and-forget: 관리자 응답 흐름 차단 없이 백그라운드 핑
 * Cloudflare Workers의 ctx.waitUntil 또는 단순 무대기 호출 둘 다 지원
 */
export function pingIndexNowAsync(urls: string | string[], waitUntil?: (p: Promise<unknown>) => void): void {
  const p = pingIndexNow(urls).catch(() => {})
  if (waitUntil) waitUntil(p)
}
