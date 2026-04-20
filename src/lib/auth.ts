// =============================================================
// 인증 유틸 (Cloudflare Workers, Web Crypto API 사용)
// =============================================================
import type { Context } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'

export type Bindings = {
  DB: D1Database
  R2?: R2Bucket
  KV?: KVNamespace
  ADMIN_EMAIL?: string
  ADMIN_PASSWORD?: string
}

// SHA-256 해싱
export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// 랜덤 토큰 (세션용)
export function generateToken(bytes: number = 32): string {
  const arr = new Uint8Array(bytes)
  crypto.getRandomValues(arr)
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// 세션 토큰 → 사용자
export async function getUserFromSession(c: Context<{ Bindings: Bindings }>) {
  const token = getCookie(c, 'session')
  if (!token) return null
  try {
    const row = await c.env.DB.prepare(
      `SELECT u.id, u.email, u.name, u.phone, u.role
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ? AND s.expires_at > datetime('now')
       LIMIT 1`
    )
      .bind(token)
      .first<{ id: number; email: string; name: string; phone: string; role: string }>()
    return row ?? null
  } catch (e) {
    return null
  }
}

// 세션 생성
export async function createSession(
  c: Context<{ Bindings: Bindings }>,
  userId: number
): Promise<string> {
  const token = generateToken()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30일
  await c.env.DB.prepare(
    `INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)`
  )
    .bind(token, userId, expiresAt.toISOString().replace('T', ' ').slice(0, 19))
    .run()
  setCookie(c, 'session', token, {
    httpOnly: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    secure: true,
  })
  return token
}

// 세션 제거
export async function destroySession(c: Context<{ Bindings: Bindings }>) {
  const token = getCookie(c, 'session')
  if (token) {
    try {
      await c.env.DB.prepare(`DELETE FROM sessions WHERE token = ?`).bind(token).run()
    } catch {}
  }
  deleteCookie(c, 'session', { path: '/' })
}

// 관리자 체크
export async function requireAdmin(c: Context<{ Bindings: Bindings }>) {
  const user = await getUserFromSession(c)
  if (!user || user.role !== 'admin') return null
  return user
}

// 이메일 형식
export function isValidEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

// 전화번호 정규화 (숫자만)
export function normalizePhone(p: string): string {
  return p.replace(/[^0-9]/g, '')
}

// 전화 형식 (010-0000-0000)
export function formatPhone(p: string): string {
  const n = normalizePhone(p)
  if (n.length === 11) return `${n.slice(0, 3)}-${n.slice(3, 7)}-${n.slice(7)}`
  if (n.length === 10) return `${n.slice(0, 3)}-${n.slice(3, 6)}-${n.slice(6)}`
  return p
}
