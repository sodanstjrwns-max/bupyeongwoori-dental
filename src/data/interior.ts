// ============================================================
// 인테리어 사진 슬롯 (R2 키 기반)
// ============================================================
// 사용법:
//   1) Cloudflare R2 대시보드에서 bupyeongwoori-media 버킷에 업로드
//      예: interior/lobby.jpg, interior/surgery-1.jpg
//   2) 아래 src 필드에 R2 key 입력
//   3) 자동으로 /media/<key> 경로로 서빙됨

export type InteriorPhoto = {
  src?: string // R2 key (e.g., 'interior/lobby.jpg') or absolute URL or /static/path
  caption: string
  alt: string
  size: 'lg' | 'md' | 'sm' | 'xs' // mosaic span
}

export const INTERIOR_PHOTOS: InteriorPhoto[] = [
  { size: 'lg', caption: 'Lobby · 로비',          alt: '부평우리치과 로비 — 카페 라운지 무드',           src: undefined },
  { size: 'sm', caption: 'Air Shower · 에어샤워',  alt: '진료실 입장 전 감염관리 에어샤워',                src: undefined },
  { size: 'sm', caption: 'Surgery Room · 수술실',  alt: '6개의 독립 수술실 중 하나',                       src: undefined },
  { size: 'md', caption: 'Treatment Room',         alt: 'ZEISS EXTARO 300 미세현미경이 설치된 진료실',     src: undefined },
  { size: 'sm', caption: 'CBCT · 3D 진단실',       alt: '3D CT 정밀 진단 장비',                            src: undefined },
  { size: 'sm', caption: 'Sterilization · 멸균',   alt: '1:1 핸드피스 멸균 시스템',                        src: undefined },
  { size: 'md', caption: 'Recovery · 회복실',      alt: '수술 후 회복실',                                  src: undefined },
  { size: 'sm', caption: 'Consultation · 상담실',  alt: '프라이빗 1:1 상담실',                             src: undefined },
]

// 사진이 등록된 항목만 필터 (관리자가 src를 채우기 전에는 갤러리 자동 숨김)
export const PUBLISHED_INTERIOR_PHOTOS = INTERIOR_PHOTOS.filter((p) => Boolean(p.src))

// R2 key를 안전한 URL로 변환
export const interiorPhotoSrc = (src?: string): string | null => {
  if (!src) return null
  if (src.startsWith('http://') || src.startsWith('https://')) return src
  if (src.startsWith('/')) return src
  return `/media/${src}`
}
