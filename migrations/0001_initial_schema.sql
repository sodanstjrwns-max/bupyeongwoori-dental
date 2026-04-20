-- =============================================================
-- 부평우리치과 - Database Schema
-- =============================================================

-- ---------- Users ----------
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL, -- sha256
  role TEXT NOT NULL DEFAULT 'member', -- 'member' | 'admin'
  agreed_privacy INTEGER NOT NULL DEFAULT 0, -- 개인정보 동의
  agreed_marketing INTEGER NOT NULL DEFAULT 0, -- 마케팅 동의
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- ---------- Sessions ----------
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- ---------- Before/After ----------
CREATE TABLE IF NOT EXISTS before_after (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  treatment_slug TEXT NOT NULL, -- implant, esthetic, ortho, ...
  doctor_slug TEXT NOT NULL,
  age INTEGER,
  gender TEXT, -- 'M' | 'F' | 'N'
  region TEXT, -- 부평구 초지동
  region_city TEXT, -- 안산시 상록구 초지동 (full)
  treatment_period TEXT, -- '3개월', '6개월' 등
  summary TEXT,
  content TEXT, -- HTML
  -- 4장 이미지 (R2 키)
  before_pano_key TEXT, -- 파노라마 전
  after_pano_key TEXT,  -- 파노라마 후
  before_intra_key TEXT, -- 구내포토 전
  after_intra_key TEXT,  -- 구내포토 후
  is_published INTEGER NOT NULL DEFAULT 1,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_ba_slug ON before_after(slug);
CREATE INDEX IF NOT EXISTS idx_ba_treatment ON before_after(treatment_slug);
CREATE INDEX IF NOT EXISTS idx_ba_doctor ON before_after(doctor_slug);
CREATE INDEX IF NOT EXISTS idx_ba_region ON before_after(region);
CREATE INDEX IF NOT EXISTS idx_ba_published ON before_after(is_published);

-- ---------- Blog Posts ----------
CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL, -- HTML (h1/h2/h3 포함)
  cover_key TEXT, -- R2 key
  author_slug TEXT NOT NULL DEFAULT 'kim-jaein', -- doctor slug
  category TEXT, -- 일반, 임플란트, 심미, 교정, 사랑니 등
  tags TEXT, -- comma separated
  meta_description TEXT,
  meta_keywords TEXT,
  is_published INTEGER NOT NULL DEFAULT 1,
  view_count INTEGER NOT NULL DEFAULT 0,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_category ON blog_posts(category);

-- ---------- Notices ----------
CREATE TABLE IF NOT EXISTS notices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- HTML
  image_key TEXT, -- R2 key
  is_major INTEGER NOT NULL DEFAULT 0, -- 대공지 여부
  is_published INTEGER NOT NULL DEFAULT 1,
  view_count INTEGER NOT NULL DEFAULT 0,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_notices_published ON notices(is_published, is_major DESC, published_at DESC);

-- ---------- Glossary (백과사전) ----------
-- 정적 데이터 기반이나 DB 캐시 / 조회수 트래킹용
CREATE TABLE IF NOT EXISTS glossary_stats (
  slug TEXT PRIMARY KEY,
  view_count INTEGER NOT NULL DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ---------- Contact Logs ----------
CREATE TABLE IF NOT EXISTS contact_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT,
  treatment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
