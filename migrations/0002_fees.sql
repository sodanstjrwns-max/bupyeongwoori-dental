-- =============================================================
-- 부평우리치과 - 비급여 수가(진료비) 테이블 + 시드
-- 관리자(/admin/fees)가 직접 편집하고 항목별 공개/비공개(is_published)를 정한다.
-- 공개 페이지(/visit#pricing)는 is_published=1 항목만 노출.
-- 시드는 기존 하드코딩 데이터(src/pages/visit.tsx FEE_SEED)를 그대로 담는다.
--   category(=분류) / name(=항목) / price(=금액 표기) / is_published(=공개여부)
--   sort_group·sort_order(=정렬)
-- 신규 테이블 CREATE + INSERT 이므로 단일 파일로 안전.
-- =============================================================

CREATE TABLE IF NOT EXISTS fees (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  category     TEXT    NOT NULL,
  name         TEXT    NOT NULL,
  price        TEXT    NOT NULL,
  is_published INTEGER NOT NULL DEFAULT 1,
  sort_group   INTEGER NOT NULL DEFAULT 0,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_fees_group_order ON fees(sort_group, sort_order);
CREATE INDEX IF NOT EXISTS idx_fees_published   ON fees(is_published);

-- ---------- Seed (전 항목 공개) ----------
INSERT INTO fees (category, name, price, is_published, sort_group, sort_order) VALUES
 ('인레이', 'Ceramic Inlay (세라믹 인레이)', '250,000원', 1, 1, 0),
 ('레진', '전치부 레진', '200,000원', 1, 2, 0),
 ('레진', '구치부 레진', '100,000원', 1, 2, 1),
 ('레진', 'C/A (치경부 마모 수복)', '70,000원', 1, 2, 2),
 ('레진', 'Diastema (치아 사이 공간 수복)', '200,000원', 1, 2, 3),
 ('레진', '레진 빌드업', '300,000원', 1, 2, 4),
 ('보존', 'Core (코어)', '50,000원', 1, 3, 0),
 ('보존', 'Casting Post (캐스팅 포스트)', '200,000원', 1, 3, 1),
 ('보존', 'Post (포스트)', '150,000원', 1, 3, 2),
 ('크라운', 'Zirconia 전치부 (앞니 지르코니아)', '600,000원', 1, 4, 0),
 ('크라운', 'Zirconia (지르코니아)', '450,000원', 1, 4, 1),
 ('크라운', 'PFM (도재금속관)', '420,000원', 1, 4, 2),
 ('임플란트', 'Straumann (스트라우만, 스위스)', '1,300,000원', 1, 5, 0),
 ('임플란트', 'SIC (스위스)', '990,000원', 1, 5, 1),
 ('임플란트', 'Osstem / Point (오스템 / 포인트)', '580,000원', 1, 5, 2),
 ('임플란트', 'MEGAGEN (메가젠)', '690,000원', 1, 5, 3),
 ('임플란트', 'Neo (CUS ZIR)', '500,000원', 1, 5, 4),
 ('임플란트', '기본 뼈이식', '300,000원 ~', 1, 5, 5),
 ('임플란트', '상악동 수술', '500,000원 ~', 1, 5, 6),
 ('임플란트 보철물', 'Zirconia Crown 변경 시', '500,000원', 1, 6, 0),
 ('임플란트 보철물', 'Pontic (Zirconia)', '400,000원', 1, 6, 1),
 ('임플란트 보철물', 'Pontic (PFM)', '300,000원', 1, 6, 2),
 ('틀니', 'RPD (부분 틀니)', '1,500,000원', 1, 7, 0),
 ('틀니', 'FULL (전체 틀니)', '2,000,000원', 1, 7, 1),
 ('교정', '교정 진단', '100,000원', 1, 8, 0),
 ('교정', 'Metal Crown (교정용 메탈 크라운)', '100,000원', 1, 8, 1),
 ('교정', 'Clippy-C (클리피 씨, 자가결찰)', '3,200,000원', 1, 8, 2),
 ('교정', '인비절라인 (Invisalign)', '6,500,000원', 1, 8, 3),
 ('교정', '투명 교정', '4,500,000원 ~', 1, 8, 4),
 ('교정', '설측 교정', '5,000,000원 ~', 1, 8, 5),
 ('교정', '미니스크류', '100,000원', 1, 8, 6),
 ('교정', '일반 월 조정료', '50,000원', 1, 8, 7),
 ('교정', '인비절라인 / 인코그니토 월 조정료', '70,000원', 1, 8, 8),
 ('교정', '유지장치 (리테이너)', '400,000원', 1, 8, 9),
 ('기타', '나이트가드 (Night Guard)', '400,000원', 1, 9, 0);
