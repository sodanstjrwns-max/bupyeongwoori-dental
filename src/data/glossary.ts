// ============================================================
// 치과 백과사전 (500+ 용어) - SEO/내부링크 자동화
// ============================================================

export type GlossaryTerm = {
  slug: string
  term: string // 한국어
  termEn?: string // 영문
  category: GlossaryCategory
  definition: string // 짧은 정의 (1~2문장)
  body?: string // 상세 설명 (HTML)
  relatedTreatments?: string[] // 관련 진료 slug
  relatedTerms?: string[] // 관련 용어 slug
  keywords?: string // SEO

  // --- 레거시 호환 필드 (alias) ---
  short?: string // = definition
  treatments?: string[] // = relatedTreatments
  related?: string[] // = relatedTerms
}

export type GlossaryCategory =
  | 'anatomy' // 해부학
  | 'implant' // 임플란트
  | 'prosthesis' // 보철
  | 'orthodontics' // 교정
  | 'surgery' // 외과
  | 'endodontics' // 근관
  | 'periodontics' // 치주
  | 'prevention' // 예방
  | 'pediatric' // 소아
  | 'esthetic' // 심미
  | 'material' // 재료
  | 'device' // 장비
  | 'procedure' // 술식
  | 'pathology' // 병리
  | 'other' // 기타

export const CATEGORIES: { key: GlossaryCategory; label: string; description: string }[] = [
  { key: 'anatomy', label: '치아 해부', description: '치아와 구강 구조의 기본 용어' },
  { key: 'implant', label: '임플란트', description: '임플란트 관련 용어 모음' },
  { key: 'prosthesis', label: '보철', description: '크라운·브릿지·보철 관련 용어' },
  { key: 'esthetic', label: '심미', description: '라미네이트·미백·심미 치료 용어' },
  { key: 'orthodontics', label: '교정', description: '치아교정과 관련된 용어' },
  { key: 'surgery', label: '구강외과', description: '발치·수술 관련 용어' },
  { key: 'endodontics', label: '신경치료', description: '근관 치료(신경치료) 관련 용어' },
  { key: 'periodontics', label: '치주', description: '잇몸·치주질환 관련 용어' },
  { key: 'prevention', label: '예방', description: '스케일링·예방 치료 용어' },
  { key: 'pediatric', label: '소아치과', description: '어린이 치과 관련 용어' },
  { key: 'material', label: '재료', description: '치과 재료에 관한 용어' },
  { key: 'device', label: '장비', description: '치과 장비·진단 기기 용어' },
  { key: 'procedure', label: '술식', description: '치과 진료 술식 용어' },
  { key: 'pathology', label: '병리', description: '구강 질환·병리 관련 용어' },
  { key: 'other', label: '기타', description: '그 외 치과 관련 용어' },
]

// ============================================================
// 시드 용어 (수동 작성) — 중요 용어는 상세 설명 포함
// 총 500+ 개를 위해 시드(상세) + 자동생성(간단) 조합
// ============================================================

type Seed = Omit<GlossaryTerm, 'slug'> & { slug?: string }

const SEEDS: GlossaryTerm[] = [
  // ---------- 치아 기초 해부 ----------
  { slug: 'tooth', term: '치아', termEn: 'Tooth', category: 'anatomy',
    definition: '음식을 씹고 발음을 돕는 구강 내 경조직 기관. 성인은 사랑니 포함 28~32개를 갖습니다.',
    body: '<p>치아는 외부의 <strong>법랑질(Enamel)</strong>, 그 아래 <strong>상아질(Dentin)</strong>, 중심부의 <strong>치수(Pulp, 신경·혈관)</strong>, 그리고 뿌리를 감싸는 <strong>백악질(Cementum)</strong>로 구성됩니다. 한 번 손상된 치질은 스스로 재생되지 않으므로 예방과 조기 치료가 중요합니다.</p>',
    relatedTerms: ['enamel', 'dentin', 'pulp', 'cementum', 'root'],
    relatedTreatments: ['general-prosthesis', 'prevention'] },
  { slug: 'enamel', term: '법랑질', termEn: 'Enamel', category: 'anatomy',
    definition: '치아 가장 바깥층의 인체 최강의 경조직. 한 번 손상되면 재생되지 않습니다.',
    body: '<p>법랑질은 무기질 함량이 <strong>96% 이상</strong>으로 인체에서 가장 단단한 조직입니다. 충치·마모·산식증 등으로 손상되면 회복되지 않으므로, <a href="/treatments/prevention">정기 검진과 예방 치료</a>가 필수입니다.</p>',
    relatedTerms: ['tooth', 'dentin', 'caries', 'erosion'] },
  { slug: 'dentin', term: '상아질', termEn: 'Dentin', category: 'anatomy',
    definition: '법랑질 아래 치아 본체를 이루는 조직. 손상 시 시린 증상이 나타날 수 있습니다.',
    relatedTerms: ['tooth', 'enamel', 'pulp', 'sensitivity'] },
  { slug: 'pulp', term: '치수', termEn: 'Dental Pulp', category: 'anatomy',
    definition: '치아 내부의 신경·혈관 조직. 염증이 생기면 극심한 통증과 함께 신경치료가 필요합니다.',
    relatedTerms: ['tooth', 'dentin', 'rct', 'pulpitis'],
    relatedTreatments: ['general-prosthesis'] },
  { slug: 'cementum', term: '백악질', termEn: 'Cementum', category: 'anatomy',
    definition: '치아 뿌리를 감싸는 얇은 경조직으로 치주인대를 매개로 잇몸뼈와 치아를 연결합니다.',
    relatedTerms: ['tooth', 'root', 'pdl'] },
  { slug: 'root', term: '치근', termEn: 'Tooth Root', category: 'anatomy',
    definition: '잇몸뼈 속에 묻혀 있는 치아의 뿌리 부분. 앞니는 1개, 어금니는 2~3개의 치근을 갖습니다.',
    relatedTerms: ['tooth', 'cementum', 'apex', 'pdl'] },

  // ---------- Implant 핵심 ----------
  { slug: 'implant', term: '임플란트', termEn: 'Dental Implant', category: 'implant',
    definition: '치아를 잃은 자리에 인공 치근(픽스쳐)을 식립하고 그 위에 보철물을 올려 자연치와 유사한 기능을 회복하는 치료.',
    body: '<p>임플란트는 크게 <strong>픽스쳐(인공 치근)</strong>, <strong>어버트먼트(지대주)</strong>, <strong>보철물(크라운)</strong> 세 부분으로 구성됩니다. 잇몸뼈에 티타늄 재질의 픽스쳐를 식립하여 골유착(Osseointegration)이 일어나면, 그 위에 어버트먼트와 크라운을 순차적으로 연결합니다.</p><p>관리 상태에 따라 <strong>20년 이상</strong> 사용 가능하며, 부평우리치과는 <a href="/treatments/implant">스트라우만·오스템·네오 공식 자문의 자격</a>을 바탕으로 정밀한 임플란트를 제공합니다.</p>',
    relatedTreatments: ['implant'], relatedTerms: ['osseointegration', 'fixture', 'abutment', 'cbct', 'bone-graft'],
    keywords: '임플란트, 부평 임플란트, 인공치아, 픽스쳐' },
  { slug: 'osseointegration', term: '골유착', termEn: 'Osseointegration', category: 'implant',
    definition: '임플란트 픽스쳐와 잇몸뼈가 분자 수준에서 직접 결합하는 현상. 임플란트 성공의 핵심.',
    body: '<p>골유착은 1960년대 브로네마크 교수가 발견한 현상으로, 티타늄 표면에 뼈세포가 달라붙어 결합하는 것을 말합니다. 통상 식립 후 <strong>2~6개월</strong>이 걸리며, 흡연·당뇨 등이 실패 요인이 됩니다.</p>',
    relatedTreatments: ['implant'], relatedTerms: ['implant', 'fixture', 'titanium'] },
  { slug: 'fixture', term: '픽스쳐', termEn: 'Fixture', category: 'implant',
    definition: '임플란트의 뿌리 역할을 하는 부분. 티타늄으로 제작되며 잇몸뼈에 식립된다.',
    relatedTreatments: ['implant'], relatedTerms: ['implant', 'osseointegration', 'titanium'] },
  { slug: 'abutment', term: '어버트먼트', termEn: 'Abutment', category: 'implant',
    definition: '픽스쳐 위에 연결되어 크라운을 지탱하는 지대주. 개인맞춤 또는 기성품이 있다.',
    relatedTreatments: ['implant'], relatedTerms: ['implant', 'fixture', 'crown'] },
  { slug: 'bone-graft', term: '뼈이식', termEn: 'Bone Graft', category: 'surgery',
    definition: '임플란트 식립을 위해 부족한 잇몸뼈를 보충하는 수술. 자가골·동종골·합성골 등을 사용.',
    body: '<p>임플란트를 식립할 자리에 잇몸뼈의 양이나 두께가 부족한 경우 시행합니다. <strong>수직 골이식</strong>(높이 증강)과 <strong>수평 골이식</strong>(두께 증강)이 있으며, 임플란트 동시 식립 또는 단계적 식립이 가능합니다.</p>',
    relatedTreatments: ['implant'], relatedTerms: ['gbr', 'sinus-lift', 'implant'] },
  { slug: 'gbr', term: 'GBR 골유도재생술', termEn: 'Guided Bone Regeneration', category: 'surgery',
    definition: '차폐막(멤브레인)을 사용해 특정 부위에만 뼈 조직이 자라도록 유도하는 골이식 술식.',
    relatedTreatments: ['implant'], relatedTerms: ['bone-graft', 'implant'] },
  { slug: 'sinus-lift', term: '상악동거상술', termEn: 'Sinus Lift', category: 'surgery',
    definition: '상악 어금니 위의 상악동(부비동) 바닥을 올려 뼈 공간을 확보하는 수술.',
    body: '<p>상악 어금니 부위는 상악동이라는 빈 공간과 가까워 잇몸뼈가 부족한 경우가 많습니다. 상악동의 점막을 조심스럽게 들어 올리고 그 아래에 뼈이식재를 넣어 공간을 확보합니다. <strong>측방 접근법</strong>과 <strong>치조정 접근법(크레스탈)</strong>이 있습니다.</p>',
    relatedTreatments: ['implant'], relatedTerms: ['bone-graft', 'implant'] },
  { slug: 'all-on-4', term: '올온포', termEn: 'All-on-4', category: 'implant',
    definition: '한 턱 전체(14개 치아)를 4개의 임플란트로 지지하는 전악 임플란트 방식.',
    relatedTreatments: ['implant'], relatedTerms: ['implant', 'all-on-6', 'full-mouth'] },
  { slug: 'all-on-6', term: '올온식스', termEn: 'All-on-6', category: 'implant',
    definition: '한 턱 전체를 6개의 임플란트로 지지하는 전악 임플란트. 뼈가 충분할 때 더 안정적.',
    relatedTreatments: ['implant'], relatedTerms: ['implant', 'all-on-4'] },
  { slug: 'immediate-implant', term: '즉시 식립', termEn: 'Immediate Implant', category: 'implant',
    definition: '발치와 동시에 임플란트를 식립하는 술식. 치료 기간을 단축시킨다.',
    relatedTreatments: ['implant'], relatedTerms: ['implant', 'extraction'] },
  { slug: 'navigation-implant', term: '네비게이션 임플란트', termEn: 'Guided Implant Surgery', category: 'implant',
    definition: 'CBCT와 구강스캔 데이터로 설계한 3D 수술 가이드를 이용해 정확한 위치·각도로 임플란트를 식립하는 디지털 수술법.',
    relatedTreatments: ['implant'], relatedTerms: ['cbct', 'implant'] },
  { slug: 'mini-implant', term: '미니 임플란트', termEn: 'Mini Implant', category: 'implant',
    definition: '일반 임플란트보다 지름이 작은 임플란트. 주로 틀니 고정용으로 사용.',
    relatedTreatments: ['implant'], relatedTerms: ['implant', 'denture'] },
  { slug: 'peri-implantitis', term: '임플란트 주위염', termEn: 'Peri-implantitis', category: 'pathology',
    definition: '임플란트 주변 잇몸·뼈에 생기는 염증. 방치 시 임플란트 탈락의 원인.',
    relatedTreatments: ['implant'], relatedTerms: ['implant', 'gingivitis', 'periodontitis'] },

  // ---------- Prosthesis 핵심 ----------
  { slug: 'crown', term: '크라운', termEn: 'Crown', category: 'prosthesis',
    definition: '손상된 치아 전체를 덮어 보호·복원하는 보철물. 금·지르코니아·올세라믹 등 재료가 있다.',
    body: '<p>치아의 변색·파절·충치가 심하거나 신경치료 후 보호가 필요할 때 사용합니다. 재료에 따라 <a href="/glossary/zirconia">지르코니아</a>, <a href="/glossary/emax">e.max</a>, PFM(금속+도자기), 금 등으로 나뉩니다.</p>',
    relatedTreatments: ['esthetic', 'general-prosthesis'], relatedTerms: ['zirconia', 'emax', 'veneer', 'margin'] },
  { slug: 'bridge', term: '브릿지', termEn: 'Bridge', category: 'prosthesis',
    definition: '없어진 치아 자리를 양 옆 치아에 연결한 보철로 복구하는 방식.',
    relatedTreatments: ['general-prosthesis'], relatedTerms: ['crown', 'implant'] },
  { slug: 'inlay', term: '인레이', termEn: 'Inlay', category: 'prosthesis',
    definition: '치아의 일부분만 파낸 후 기공소에서 제작한 보철물로 채우는 방식.',
    relatedTreatments: ['general-prosthesis'], relatedTerms: ['onlay', 'resin'] },
  { slug: 'onlay', term: '온레이', termEn: 'Onlay', category: 'prosthesis',
    definition: '인레이보다 넓은 범위를 복원하며, 치아의 교두(씹는 면 돌기)까지 덮는 보철.',
    relatedTreatments: ['general-prosthesis'], relatedTerms: ['inlay', 'crown'] },
  { slug: 'veneer', term: '베니어', termEn: 'Veneer', category: 'esthetic',
    definition: '치아 앞면을 얇게 삭제한 뒤 얇은 세라믹을 부착하는 심미 보철.',
    relatedTreatments: ['laminate'], relatedTerms: ['laminate', 'emax', 'shade-matching'] },
  { slug: 'laminate', term: '라미네이트', termEn: 'Laminate', category: 'esthetic',
    definition: '베니어의 다른 이름. 치아 앞면을 0.3~0.7mm 삭제 후 얇은 세라믹을 접착하는 심미치료.',
    relatedTreatments: ['laminate'], relatedTerms: ['veneer', 'emax'] },
  { slug: 'zirconia', term: '지르코니아', termEn: 'Zirconia', category: 'material',
    definition: '지르코늄 기반 세라믹 보철 재료. 강도가 매우 높아 어금니에 적합.',
    relatedTreatments: ['esthetic', 'general-prosthesis'], relatedTerms: ['crown', 'emax', 'all-ceramic'] },
  { slug: 'emax', term: 'e.max', termEn: 'IPS e.max', category: 'material',
    definition: '리튬 디실리케이트 기반의 유리세라믹. 투명도가 뛰어나 앞니에 적합.',
    relatedTreatments: ['esthetic', 'laminate'], relatedTerms: ['lithium-disilicate', 'all-ceramic'] },
  { slug: 'lithium-disilicate', term: '리튬 디실리케이트', termEn: 'Lithium Disilicate', category: 'material',
    definition: 'e.max의 주성분. 강도와 심미성을 모두 갖춘 치과 세라믹 재료.',
    relatedTerms: ['emax', 'zirconia'] },
  { slug: 'all-ceramic', term: '올세라믹', termEn: 'All-Ceramic', category: 'prosthesis',
    definition: '금속 없이 세라믹 재료만으로 제작된 보철. 심미성이 뛰어나고 알레르기 위험이 적다.',
    relatedTerms: ['emax', 'zirconia', 'crown'] },
  { slug: 'pfm', term: 'PFM', termEn: 'Porcelain Fused to Metal', category: 'prosthesis',
    definition: '금속 코핑 위에 도자기를 올린 보철. 강도와 가격의 균형이 좋으나 변두리에 금속 라인이 보일 수 있음.',
    relatedTerms: ['crown', 'metal-bridge'] },
  { slug: 'margin', term: '마진', termEn: 'Margin', category: 'procedure',
    definition: '치아와 보철물의 경계. 마진의 정밀도가 보철의 장기 예후를 결정한다.',
    relatedTerms: ['crown', 'microscope'] },
  { slug: 'shade-matching', term: '셰이드 매칭', termEn: 'Shade Matching', category: 'esthetic',
    definition: '주변 자연치의 색상·투명도·표면 질감을 보철물에 정확히 구현하는 작업.',
    relatedTreatments: ['esthetic', 'laminate'], relatedTerms: ['veneer', 'crown'] },

  // ---------- Orthodontics ----------
  { slug: 'orthodontics', term: '치아교정', termEn: 'Orthodontics', category: 'orthodontics',
    definition: '치아·턱뼈의 위치를 교정해 부정교합을 바로잡고 심미·기능을 개선하는 치료.',
    relatedTreatments: ['ortho'], relatedTerms: ['invisalign', 'bracket', 'malocclusion'] },
  { slug: 'invisalign', term: '인비절라인', termEn: 'Invisalign', category: 'orthodontics',
    definition: '투명한 플라스틱 장치(얼라이너)를 2주마다 교체하며 치아를 이동시키는 투명교정 브랜드.',
    body: '<p>부평우리치과 대표원장은 <a href="/doctors/kim-jaein">Invisalign 우수인증의사</a> 자격을 보유하고 있습니다. 장치의 탈착이 가능해 식사·양치가 자유로우며, 발치·비발치 모두 대응 가능합니다.</p>',
    relatedTreatments: ['ortho', 'clear-aligner'], relatedTerms: ['clear-aligner', 'aligner', 'orthodontics'] },
  { slug: 'clear-aligner', term: '클리어 얼라이너', termEn: 'Clear Aligner', category: 'orthodontics',
    definition: '투명교정 장치의 총칭. 인비절라인 외에도 클리어코렉트, 국내 브랜드 등이 있다.',
    relatedTreatments: ['clear-aligner', 'ortho'], relatedTerms: ['invisalign', 'aligner'] },
  { slug: 'aligner', term: '얼라이너', termEn: 'Aligner', category: 'orthodontics',
    definition: '투명교정에서 사용하는 개별 단계의 플라스틱 장치.',
    relatedTerms: ['clear-aligner', 'invisalign'] },
  { slug: 'bracket', term: '브라켓', termEn: 'Bracket', category: 'orthodontics',
    definition: '고정식 교정에서 치아에 부착되는 장치. 와이어를 고정하는 역할.',
    relatedTreatments: ['ortho'], relatedTerms: ['wire', 'orthodontics'] },
  { slug: 'wire', term: '와이어', termEn: 'Archwire', category: 'orthodontics',
    definition: '브라켓을 통해 치아에 힘을 전달하는 금속선. 단계적으로 더 강한 것으로 교체된다.',
    relatedTerms: ['bracket', 'orthodontics'] },
  { slug: 'retainer', term: '유지장치', termEn: 'Retainer', category: 'orthodontics',
    definition: '교정 후 치아 재발을 막기 위해 평생 착용하는 장치.',
    body: '<p>교정 후 치아는 원래 위치로 돌아가려는 경향이 있습니다. 유지장치를 꾸준히 착용하지 않으면 재발(Relapse)이 생길 수 있어, 평생 관리가 필요합니다. 가철식·고정식이 있습니다.</p>',
    relatedTreatments: ['ortho'], relatedTerms: ['orthodontics', 'relapse'] },
  { slug: 'malocclusion', term: '부정교합', termEn: 'Malocclusion', category: 'pathology',
    definition: '위·아래 치아의 맞물림이 비정상적인 상태.',
    relatedTreatments: ['ortho'], relatedTerms: ['overbite', 'underbite', 'crossbite'] },
  { slug: 'overbite', term: '과개교합', termEn: 'Overbite', category: 'pathology',
    definition: '위 앞니가 아래 앞니를 지나치게 많이 덮는 부정교합.',
    relatedTerms: ['malocclusion', 'underbite'] },
  { slug: 'underbite', term: '반대교합', termEn: 'Underbite', category: 'pathology',
    definition: '아래 치아가 위 치아보다 앞으로 튀어나온 상태. "주걱턱"과 관련.',
    relatedTerms: ['malocclusion', 'overbite', 'crossbite'] },
  { slug: 'crossbite', term: '교차교합', termEn: 'Crossbite', category: 'pathology',
    definition: '위아래 치아의 좌우 관계가 뒤집혀 있는 부정교합.',
    relatedTerms: ['malocclusion'] },
  { slug: 'openbite', term: '개방교합', termEn: 'Open Bite', category: 'pathology',
    definition: '어금니가 닿을 때 앞니가 서로 닿지 않는 부정교합.',
    relatedTerms: ['malocclusion'] },
  { slug: 'partial-ortho', term: '부분교정', termEn: 'Partial Orthodontics', category: 'orthodontics',
    definition: '앞니 등 일부 치아만 교정하는 방식. 기간·비용이 전체 교정보다 적다.',
    relatedTreatments: ['ortho'], relatedTerms: ['orthodontics'] },
  { slug: 'lingual-ortho', term: '설측교정', termEn: 'Lingual Orthodontics', category: 'orthodontics',
    definition: '브라켓을 치아의 안쪽(혀쪽)에 붙이는 교정. 겉에서 보이지 않는 장점.',
    relatedTerms: ['bracket', 'orthodontics'] },

  // ---------- Anatomy ----------
  { slug: 'incisor', term: '절치(앞니)', termEn: 'Incisor', category: 'anatomy',
    definition: '입 정면에 위치한 치아로, 음식을 자르는 역할. 상하 각 4개.' },
  { slug: 'canine', term: '견치(송곳니)', termEn: 'Canine', category: 'anatomy',
    definition: '앞니 옆에 위치한 뾰족한 치아. 음식을 찢는 역할.' },
  { slug: 'premolar', term: '소구치', termEn: 'Premolar', category: 'anatomy',
    definition: '견치와 대구치 사이의 치아. 상하 각 4개씩 있다.' },
  { slug: 'molar', term: '대구치(어금니)', termEn: 'Molar', category: 'anatomy',
    definition: '입 안쪽의 큰 치아. 음식을 씹어 부수는 역할.' },
  { slug: 'wisdom-tooth', term: '사랑니', termEn: 'Wisdom Tooth', category: 'anatomy',
    definition: '맨 안쪽 세 번째 대구치. 17~25세에 나오며 매복되거나 염증을 일으키는 경우가 많다.',
    relatedTreatments: ['wisdom-tooth'], relatedTerms: ['impaction', 'pericoronitis'] },
  { slug: 'enamel', term: '법랑질', termEn: 'Enamel', category: 'anatomy',
    definition: '치아의 가장 바깥 층. 인체에서 가장 단단한 조직이며 95%가 무기질.' },
  { slug: 'dentin', term: '상아질', termEn: 'Dentin', category: 'anatomy',
    definition: '법랑질 아래의 누런색 층. 법랑질보다 약하며 시림의 원인이 되는 부위.' },
  { slug: 'pulp', term: '치수', termEn: 'Pulp', category: 'anatomy',
    definition: '치아 내부의 신경·혈관 조직. 치수에 염증이 생기면 신경치료가 필요.',
    relatedTerms: ['root-canal', 'pulpitis'] },
  { slug: 'cementum', term: '백악질', termEn: 'Cementum', category: 'anatomy',
    definition: '치아뿌리 표면을 덮는 얇은 층. 치주인대와 결합한다.' },
  { slug: 'root', term: '치근', termEn: 'Root', category: 'anatomy',
    definition: '치아의 뿌리 부분. 잇몸뼈에 박혀 있다.' },
  { slug: 'crown-anatomy', term: '치관', termEn: 'Crown (Anatomy)', category: 'anatomy',
    definition: '치아에서 잇몸 위로 보이는 부분. 보철 용어 "크라운"과 구별.' },
  { slug: 'periodontal-ligament', term: '치주인대', termEn: 'Periodontal Ligament', category: 'anatomy',
    definition: '치아뿌리와 잇몸뼈를 연결하는 인대. 치아에 가해지는 힘을 흡수한다.' },
  { slug: 'alveolar-bone', term: '치조골', termEn: 'Alveolar Bone', category: 'anatomy',
    definition: '치아뿌리를 감싸는 잇몸뼈.' },
  { slug: 'gingiva', term: '치은', termEn: 'Gingiva', category: 'anatomy',
    definition: '치아를 둘러싼 잇몸 조직.' },
  { slug: 'mandible', term: '하악', termEn: 'Mandible', category: 'anatomy',
    definition: '아래턱뼈. 움직이는 유일한 얼굴뼈.' },
  { slug: 'maxilla', term: '상악', termEn: 'Maxilla', category: 'anatomy',
    definition: '위턱뼈. 상악동(부비동)과 연결된다.' },
  { slug: 'tmj', term: '턱관절', termEn: 'Temporomandibular Joint', category: 'anatomy',
    definition: '아래턱과 머리뼈를 연결하는 관절. 문제 시 TMD(턱관절 장애)가 발생.' },

  // ---------- Surgery ----------
  { slug: 'extraction', term: '발치', termEn: 'Tooth Extraction', category: 'surgery',
    definition: '치아를 뽑는 치료. 충치·외상·부정교합·매복 등의 이유로 시행.',
    relatedTreatments: ['wisdom-tooth'], relatedTerms: ['wisdom-tooth', 'dry-socket'] },
  { slug: 'impaction', term: '매복', termEn: 'Impaction', category: 'pathology',
    definition: '치아가 정상적으로 맹출하지 못하고 잇몸이나 뼈 속에 갇힌 상태. 주로 사랑니에서 발생.',
    relatedTreatments: ['wisdom-tooth'], relatedTerms: ['wisdom-tooth', 'extraction'] },
  { slug: 'dry-socket', term: '드라이 소켓', termEn: 'Dry Socket', category: 'pathology',
    definition: '발치 후 혈병이 떨어져 나가 뼈가 노출되는 상태. 심한 통증을 유발.',
    relatedTerms: ['extraction', 'wisdom-tooth'] },
  { slug: 'pericoronitis', term: '치관주위염', termEn: 'Pericoronitis', category: 'pathology',
    definition: '매복된 사랑니 주변 잇몸의 염증. 통증·부종·발열을 동반.',
    relatedTreatments: ['wisdom-tooth'], relatedTerms: ['wisdom-tooth', 'impaction'] },
  { slug: 'apicoectomy', term: '치근단절제술', termEn: 'Apicoectomy', category: 'surgery',
    definition: '신경치료 후에도 치아뿌리 끝에 염증이 남을 때 뿌리 끝 일부를 절제하는 수술.',
    relatedTerms: ['root-canal', 'root'] },
  { slug: 'frenectomy', term: '소대절제술', termEn: 'Frenectomy', category: 'surgery',
    definition: '입술이나 혀의 소대(Frenum)를 절개하는 수술. 설소대 단축증 등에 시행.' },
  { slug: 'crown-lengthening', term: '치관확장술', termEn: 'Crown Lengthening', category: 'surgery',
    definition: '잇몸을 낮춰 치아의 노출 부위를 넓히는 수술. 거미스마일 개선 또는 보철을 위해 시행.',
    relatedTerms: ['gummy-smile', 'crown'] },
  { slug: 'sedation-dentistry', term: '수면진료', termEn: 'Sedation Dentistry', category: 'procedure',
    definition: '치과 공포증이 심한 환자를 위해 의식하진정제를 사용해 편안하게 진료받도록 하는 방식.' },
  { slug: 'anesthesia-local', term: '국소마취', termEn: 'Local Anesthesia', category: 'procedure',
    definition: '치료 부위만 마취하는 방식. 대부분의 치과 시술에 사용.' },

  // ---------- Endodontics ----------
  { slug: 'root-canal', term: '신경치료(근관치료)', termEn: 'Root Canal Treatment', category: 'endodontics',
    definition: '치수에 염증이 생겼을 때 신경·혈관을 제거하고 내부를 봉쇄하는 치료.',
    body: '<p>충치가 깊어 신경까지 침범하거나 외상으로 신경이 손상된 경우 시행합니다. 치료 후에는 치아가 약해지므로 대부분 <a href="/glossary/crown">크라운</a>으로 보호해야 합니다.</p>',
    relatedTerms: ['pulp', 'pulpitis', 'crown'] },
  { slug: 'pulpitis', term: '치수염', termEn: 'Pulpitis', category: 'pathology',
    definition: '치아 내부 신경(치수)의 염증. 심한 통증의 가장 흔한 원인.',
    relatedTerms: ['pulp', 'root-canal', 'cavity'] },
  { slug: 'apical-lesion', term: '치근단 병변', termEn: 'Apical Lesion', category: 'pathology',
    definition: '치아뿌리 끝에 생긴 염증성 병변. 신경치료 실패 또는 재발로 인해 발생.',
    relatedTerms: ['root-canal', 'apicoectomy'] },
  { slug: 'gutta-percha', term: '구타퍼차', termEn: 'Gutta-percha', category: 'material',
    definition: '신경치료 시 근관을 채우는 고무상 재료.',
    relatedTerms: ['root-canal'] },

  // ---------- Periodontics ----------
  { slug: 'gingivitis', term: '치은염', termEn: 'Gingivitis', category: 'pathology',
    definition: '잇몸에만 국한된 염증. 적절한 관리로 회복 가능하며 방치 시 치주염으로 진행.',
    relatedTerms: ['periodontitis', 'plaque'] },
  { slug: 'periodontitis', term: '치주염', termEn: 'Periodontitis', category: 'pathology',
    definition: '잇몸뿐 아니라 치주인대·치조골까지 염증이 진행된 상태. 성인 치아 상실의 주요 원인.',
    relatedTerms: ['gingivitis', 'scaling', 'root-planing'] },
  { slug: 'scaling', term: '스케일링', termEn: 'Scaling', category: 'prevention',
    definition: '치아 표면의 치석과 치태를 제거하는 시술. 만 19세 이상 연 1회 건강보험 적용.',
    relatedTreatments: ['prevention'], relatedTerms: ['calculus', 'plaque'] },
  { slug: 'root-planing', term: '치근활택술', termEn: 'Root Planing', category: 'periodontics',
    definition: '잇몸 속 치아뿌리 표면의 치석을 제거하고 매끄럽게 다듬는 치주치료.',
    relatedTerms: ['scaling', 'periodontitis'] },
  { slug: 'plaque', term: '치태', termEn: 'Plaque', category: 'pathology',
    definition: '치아 표면에 형성되는 세균 막. 치석의 전 단계.',
    relatedTerms: ['calculus', 'gingivitis'] },
  { slug: 'calculus', term: '치석', termEn: 'Calculus / Tartar', category: 'pathology',
    definition: '치태가 굳어져 돌처럼 단단해진 상태. 칫솔로 제거되지 않으며 스케일링이 필요.',
    relatedTerms: ['plaque', 'scaling'] },
  { slug: 'periodontal-pocket', term: '치주낭', termEn: 'Periodontal Pocket', category: 'pathology',
    definition: '잇몸과 치아 사이의 공간이 비정상적으로 깊어진 상태. 치주염의 지표.',
    relatedTerms: ['periodontitis', 'scaling'] },
  { slug: 'gum-recession', term: '잇몸퇴축', termEn: 'Gingival Recession', category: 'pathology',
    definition: '잇몸이 내려가서 치아뿌리가 드러나는 현상. 시림·심미 문제를 유발.' },

  // ---------- Prevention ----------
  { slug: 'fluoride', term: '불소', termEn: 'Fluoride', category: 'material',
    definition: '법랑질을 강화하고 충치를 예방하는 원소. 치약·불소도포·수돗물 불소화에 사용.',
    relatedTreatments: ['prevention'], relatedTerms: ['fluoride-application', 'cavity'] },
  { slug: 'fluoride-application', term: '불소도포', termEn: 'Fluoride Application', category: 'prevention',
    definition: '고농도 불소겔을 치아 표면에 도포해 충치를 예방하는 시술. 어린이에게 특히 효과적.',
    relatedTreatments: ['prevention'], relatedTerms: ['fluoride', 'sealant'] },
  { slug: 'sealant', term: '실란트', termEn: 'Pit and Fissure Sealant', category: 'prevention',
    definition: '어금니의 홈을 메워 충치를 예방하는 시술. 만 18세 이하 건강보험 적용.',
    relatedTreatments: ['prevention'], relatedTerms: ['fluoride-application'] },
  { slug: 'dental-floss', term: '치실', termEn: 'Dental Floss', category: 'prevention',
    definition: '치아 사이의 음식물·치태를 제거하는 가느다란 실.' },
  { slug: 'interdental-brush', term: '치간칫솔', termEn: 'Interdental Brush', category: 'prevention',
    definition: '치아 사이 공간이 넓을 때 사용하는 작은 칫솔.' },
  { slug: 'mouthwash', term: '구강청결제', termEn: 'Mouthwash', category: 'prevention',
    definition: '입 안을 헹구어 세균·냄새를 줄이는 액체. 불소·클로르헥시딘 등 종류가 있다.' },
  { slug: 'oral-hygiene', term: '구강위생', termEn: 'Oral Hygiene', category: 'prevention',
    definition: '입 안을 청결히 유지하는 모든 습관. 칫솔질·치실·정기 스케일링이 기본.' },

  // ---------- Esthetic ----------
  { slug: 'whitening', term: '미백', termEn: 'Teeth Whitening', category: 'esthetic',
    definition: '과산화물 성분을 이용해 치아 색을 밝게 만드는 치료. 진료실 미백과 자가 미백이 있다.',
    relatedTerms: ['bleaching', 'shade'] },
  { slug: 'gummy-smile', term: '거미스마일', termEn: 'Gummy Smile', category: 'esthetic',
    definition: '웃을 때 잇몸이 많이 드러나는 미소. 치관확장술·보톡스 등으로 개선 가능.',
    relatedTerms: ['crown-lengthening'] },
  { slug: 'diastema', term: '치간 이개', termEn: 'Diastema', category: 'pathology',
    definition: '치아 사이에 틈이 있는 상태. 교정·라미네이트로 개선 가능.',
    relatedTreatments: ['ortho', 'laminate'] },
  { slug: 'smile-line', term: '미소 라인', termEn: 'Smile Line', category: 'esthetic',
    definition: '웃을 때 앞니의 끝선이 그리는 곡선. 심미 보철에서 중요한 디자인 요소.',
    relatedTerms: ['veneer', 'crown'] },

  // ---------- Device / Procedure ----------
  { slug: 'cbct', term: '콘빔 CT', termEn: 'Cone Beam CT', category: 'device',
    definition: '치과 전용 3차원 컴퓨터 단층촬영 장비. 뼈·신경·상악동 구조를 3D로 분석.',
    body: '<p>부평우리치과는 <strong>CBCT를 2대 보유</strong>하여 임플란트·사랑니·교정 진단에 적극 활용합니다. 기존 파노라마 X-ray가 2D였던 것에 비해, CBCT는 3차원으로 신경·혈관·뼈를 분석할 수 있습니다.</p>',
    relatedTerms: ['panorama', 'navigation-implant', 'implant'] },
  { slug: 'panorama', term: '파노라마', termEn: 'Panoramic X-ray', category: 'device',
    definition: '입 안 전체(상·하악, 관절, 사랑니)를 한 장에 담는 2D X-ray.',
    relatedTerms: ['cbct'] },
  { slug: 'microscope', term: '미세현미경', termEn: 'Surgical Microscope', category: 'device',
    definition: '치과 시술 시 사용하는 고배율 현미경. 마진·근관을 정밀하게 다룰 수 있다.',
    body: '<p>부평우리치과는 세계적인 광학 회사 <strong>칼짜이스(Carl Zeiss)</strong>의 Extaro 300 치과 전용 미세현미경을 보유하고 있습니다. 보철·신경치료·라미네이트의 정밀도를 한 단계 높이는 장비입니다.</p>',
    relatedTerms: ['margin', 'root-canal', 'veneer'] },
  { slug: 'intraoral-scanner', term: '구강 스캐너', termEn: 'Intraoral Scanner', category: 'device',
    definition: '고무 인상 대신 빛으로 입 안을 스캔해 3D 데이터를 얻는 디지털 장비.',
    relatedTerms: ['cbct', 'digital-impression'] },
  { slug: 'piezoelectric-surgery', term: '초음파 수술', termEn: 'Piezoelectric Surgery', category: 'device',
    definition: '초음파 진동으로 뼈만 선택적으로 절삭하는 수술법. 주변 신경·혈관 손상을 최소화.',
    body: '<p>부평우리치과는 멕트론(이탈리아)의 <strong>콤비터치 10대</strong>를 보유하고 있으며, 대표원장은 세계초음파수술학회(WAUPS) 인증의입니다.</p>',
    relatedTerms: ['sinus-lift', 'wisdom-tooth', 'bone-graft'] },
  { slug: 'handpiece', term: '핸드피스', termEn: 'Handpiece', category: 'device',
    definition: '치과에서 사용하는 회전 기구. 충치 제거·치아 삭제에 사용.',
    body: '<p>부평우리치과는 <strong>카보(Kavo) 핸드피스 160개</strong>를 보유하여 <strong>1인 1핸드피스 원칙</strong>으로 교차감염을 원천 차단합니다.</p>' },
  { slug: 'autoclave', term: '오토클레이브', termEn: 'Autoclave', category: 'device',
    definition: '고압 증기로 기구를 멸균하는 장비. 감염관리의 필수.' },

  // ---------- Pathology ----------
  { slug: 'cavity', term: '충치(우식)', termEn: 'Dental Caries / Cavity', category: 'pathology',
    definition: '세균이 만든 산이 치아를 부식시키는 질환. 방치 시 신경까지 침범.',
    relatedTerms: ['plaque', 'fluoride', 'resin', 'root-canal'] },
  { slug: 'secondary-caries', term: '2차 우식', termEn: 'Secondary Caries', category: 'pathology',
    definition: '기존 보철물·충전재의 경계에 새로 생기는 충치. 마진 불량이 주원인.',
    relatedTerms: ['cavity', 'margin', 'microscope'] },
  { slug: 'tooth-sensitivity', term: '치아 시림', termEn: 'Tooth Sensitivity', category: 'pathology',
    definition: '차갑거나 뜨거운 자극에 치아가 시린 증상. 상아질 노출·충치·균열 등이 원인.',
    relatedTerms: ['dentin', 'gum-recession'] },
  { slug: 'bruxism', term: '이갈이', termEn: 'Bruxism', category: 'pathology',
    definition: '수면 중 또는 각성 시 치아를 맞물리거나 갈아대는 습관. 치아 마모·파절·턱관절 장애 유발.',
    relatedTerms: ['night-guard', 'tmd'] },
  { slug: 'tmd', term: '턱관절 장애', termEn: 'TMD', category: 'pathology',
    definition: '턱관절의 통증·개구 장애·잡음 등을 동반한 질환. 교합·스트레스·이갈이와 관련.',
    relatedTerms: ['bruxism', 'tmj', 'night-guard'] },
  { slug: 'halitosis', term: '구취', termEn: 'Halitosis', category: 'pathology',
    definition: '입냄새. 치석·치주염·설태·전신 질환 등이 원인.',
    relatedTerms: ['scaling', 'periodontitis'] },
  { slug: 'tooth-fracture', term: '치아 파절', termEn: 'Tooth Fracture', category: 'pathology',
    definition: '치아가 깨지거나 부러진 상태. 외상·이갈이·금이 간 치아 등이 원인.',
    relatedTerms: ['bruxism', 'crown'] },
  { slug: 'cracked-tooth', term: '크랙 투스', termEn: 'Cracked Tooth', category: 'pathology',
    definition: '치아에 미세 균열이 생긴 상태. 씹을 때 통증·시림이 특징.',
    relatedTerms: ['tooth-fracture', 'bruxism'] },

  // ---------- Pediatric ----------
  { slug: 'primary-tooth', term: '유치', termEn: 'Primary Tooth / Baby Tooth', category: 'pediatric',
    definition: '아기 때 나는 임시 치아. 6세 전후부터 영구치로 교체된다.' },
  { slug: 'permanent-tooth', term: '영구치', termEn: 'Permanent Tooth', category: 'pediatric',
    definition: '유치가 빠진 후 평생 사용하는 치아.' },
  { slug: 'pedo-crown', term: '기성 크라운', termEn: 'Stainless Steel Crown', category: 'pediatric',
    definition: '유치 충치가 심할 때 사용하는 은색 금속 크라운.' },
  { slug: 'space-maintainer', term: '공간유지장치', termEn: 'Space Maintainer', category: 'pediatric',
    definition: '유치가 조기에 빠졌을 때 영구치가 날 공간을 유지하기 위한 장치.' },

  // ---------- Material ----------
  { slug: 'titanium', term: '티타늄', termEn: 'Titanium', category: 'material',
    definition: '임플란트 픽스쳐의 주 재료. 생체 적합성이 뛰어나 뼈와 결합(골유착)한다.',
    relatedTerms: ['implant', 'osseointegration', 'fixture'] },
  { slug: 'composite-resin', term: '레진', termEn: 'Composite Resin', category: 'material',
    definition: '치아 색과 유사한 플라스틱 재료. 충치 때우기·앞니 수복 등에 사용.',
    relatedTerms: ['cavity', 'inlay'] },
  { slug: 'amalgam', term: '아말감', termEn: 'Amalgam', category: 'material',
    definition: '과거 어금니 충전에 쓰인 은색 합금. 최근에는 레진·세라믹으로 대체.' },
  { slug: 'gold', term: '금(골드)', termEn: 'Gold', category: 'material',
    definition: '강도·적합도가 우수한 보철 재료. 주로 어금니 인레이·크라운에 사용.' },
  { slug: 'ceramic', term: '세라믹', termEn: 'Ceramic', category: 'material',
    definition: '심미 보철의 주재료. 자연치와 유사한 빛 반사와 색감을 구현.',
    relatedTerms: ['emax', 'zirconia', 'all-ceramic'] },

  // ---------- Other / Procedure ----------
  { slug: 'digital-impression', term: '디지털 인상', termEn: 'Digital Impression', category: 'procedure',
    definition: '구강 스캐너로 고무 인상 없이 디지털 데이터로 형상을 얻는 방식.',
    relatedTerms: ['intraoral-scanner', 'cad-cam'] },
  { slug: 'cad-cam', term: 'CAD/CAM', termEn: 'CAD/CAM', category: 'procedure',
    definition: '컴퓨터로 보철물을 설계하고 기계로 가공하는 디지털 제작 방식.',
    relatedTerms: ['digital-impression'] },
  { slug: 'night-guard', term: '나이트가드', termEn: 'Night Guard', category: 'device',
    definition: '수면 중 이갈이로부터 치아를 보호하는 마우스피스형 장치.',
    relatedTerms: ['bruxism', 'tmd'] },
  { slug: 'denture', term: '틀니', termEn: 'Denture', category: 'prosthesis',
    definition: '빠진 치아를 대체하는 가철식 보철. 완전틀니와 부분틀니가 있다.',
    relatedTerms: ['implant', 'mini-implant'] },
  { slug: 'bleaching', term: '치아 미백', termEn: 'Tooth Bleaching', category: 'esthetic',
    definition: 'Whitening과 유사. 과산화수소·과산화요소로 치아 색을 밝힌다.',
    relatedTerms: ['whitening'] },
  { slug: 'shade', term: '셰이드', termEn: 'Shade', category: 'esthetic',
    definition: '치아 색상 표준. Vita Classical·3D Master 등의 셰이드 가이드가 있다.',
    relatedTerms: ['shade-matching'] },
  { slug: 'hybrid-implant', term: '하이브리드 임플란트', termEn: 'Hybrid Implant', category: 'implant',
    definition: '여러 개의 임플란트와 연결된 고정성 보철을 결합한 전악 수복 방식.',
    relatedTerms: ['all-on-4', 'all-on-6', 'implant'] },
  { slug: 'flapless-surgery', term: '무절개 임플란트', termEn: 'Flapless Implant Surgery', category: 'implant',
    definition: '잇몸을 절개하지 않고 펀치로 작은 구멍을 내어 임플란트를 식립하는 술식.',
    relatedTerms: ['implant', 'navigation-implant'] },
  { slug: 'platform-switching', term: '플랫폼 스위칭', termEn: 'Platform Switching', category: 'implant',
    definition: '임플란트 픽스쳐와 어버트먼트의 접합부를 안쪽으로 이동시켜 뼈 흡수를 줄이는 설계.',
    relatedTerms: ['implant', 'abutment'] },
]

// ============================================================
// 자동 생성 용어: 간단 정의만 있는 항목을 대량 추가
// (카테고리별 실존 치과 용어 목록, 500+ 달성용)
// ============================================================

type AutoTerm = { slug: string; term: string; termEn?: string; category: GlossaryCategory; definition: string; relatedTerms?: string[]; relatedTreatments?: string[] }

const AUTO: AutoTerm[] = [
  // Anatomy 추가
  { slug: 'apex', term: '치근첨', termEn: 'Apex', category: 'anatomy', definition: '치아 뿌리의 맨 끝부분.' },
  { slug: 'cej', term: '백악법랑경계', termEn: 'CEJ', category: 'anatomy', definition: '치관(법랑질)과 치근(백악질)의 경계선.' },
  { slug: 'occlusal-surface', term: '교합면', termEn: 'Occlusal Surface', category: 'anatomy', definition: '치아의 씹는 면.' },
  { slug: 'cusp', term: '교두', termEn: 'Cusp', category: 'anatomy', definition: '어금니 교합면의 뾰족한 돌기.' },
  { slug: 'fossa', term: '와', termEn: 'Fossa', category: 'anatomy', definition: '교합면의 오목한 부분.' },
  { slug: 'marginal-ridge', term: '변연융선', termEn: 'Marginal Ridge', category: 'anatomy', definition: '어금니 교합면 가장자리의 돌출 융선.' },
  { slug: 'mesial', term: '근심', termEn: 'Mesial', category: 'anatomy', definition: '치아의 앞쪽(중앙선에 가까운 쪽) 방향.' },
  { slug: 'distal', term: '원심', termEn: 'Distal', category: 'anatomy', definition: '치아의 뒤쪽(중앙선에서 먼 쪽) 방향.' },
  { slug: 'buccal', term: '협측', termEn: 'Buccal', category: 'anatomy', definition: '어금니의 볼 쪽 면.' },
  { slug: 'lingual', term: '설측', termEn: 'Lingual', category: 'anatomy', definition: '아래 치아의 혀 쪽 면.' },
  { slug: 'palatal', term: '구개측', termEn: 'Palatal', category: 'anatomy', definition: '위 치아의 입천장 쪽 면.' },
  { slug: 'labial', term: '순측', termEn: 'Labial', category: 'anatomy', definition: '앞니의 입술 쪽 면.' },
  { slug: 'facial', term: '안면측', termEn: 'Facial', category: 'anatomy', definition: '치아의 얼굴 바깥쪽 면(협측·순측 통칭).' },
  { slug: 'oral-cavity', term: '구강', termEn: 'Oral Cavity', category: 'anatomy', definition: '입 안의 전체 공간.' },
  { slug: 'palate', term: '구개', termEn: 'Palate', category: 'anatomy', definition: '입천장. 경구개·연구개로 나뉨.' },
  { slug: 'uvula', term: '목젖', termEn: 'Uvula', category: 'anatomy', definition: '연구개 끝에 매달린 작은 돌기.' },
  { slug: 'tongue', term: '혀', termEn: 'Tongue', category: 'anatomy', definition: '미각과 발음·저작을 담당하는 근육성 기관.' },
  { slug: 'salivary-gland', term: '침샘', termEn: 'Salivary Gland', category: 'anatomy', definition: '침을 분비하는 외분비샘. 이하선·악하선·설하선.' },
  { slug: 'parotid-gland', term: '이하선', termEn: 'Parotid Gland', category: 'anatomy', definition: '귀 아래에 위치한 가장 큰 침샘.' },
  { slug: 'submandibular-gland', term: '악하선', termEn: 'Submandibular Gland', category: 'anatomy', definition: '아래턱 뒤쪽에 위치한 침샘.' },
  { slug: 'sublingual-gland', term: '설하선', termEn: 'Sublingual Gland', category: 'anatomy', definition: '혀 아래 위치한 침샘.' },
  { slug: 'maxillary-sinus', term: '상악동', termEn: 'Maxillary Sinus', category: 'anatomy', definition: '위턱 어금니 위에 있는 빈 공간(부비동).' },
  { slug: 'mandibular-nerve', term: '하악신경', termEn: 'Inferior Alveolar Nerve', category: 'anatomy', definition: '아래턱 속을 지나는 신경. 임플란트 시 반드시 보호해야 함.' },
  { slug: 'maxillary-nerve', term: '상악신경', termEn: 'Maxillary Nerve', category: 'anatomy', definition: '위턱 치아와 잇몸을 지배하는 신경.' },
  { slug: 'mental-foramen', term: '이공', termEn: 'Mental Foramen', category: 'anatomy', definition: '하악 소구치 아래에 있는 신경 통로 구멍.' },
  { slug: 'lingual-nerve', term: '설신경', termEn: 'Lingual Nerve', category: 'anatomy', definition: '혀의 감각을 담당하는 신경.' },
  { slug: 'facial-nerve', term: '안면신경', termEn: 'Facial Nerve', category: 'anatomy', definition: '얼굴 근육 운동을 담당하는 7번 뇌신경.' },
  { slug: 'trigeminal-nerve', term: '삼차신경', termEn: 'Trigeminal Nerve', category: 'anatomy', definition: '얼굴 감각과 저작 근육을 담당하는 5번 뇌신경.' },
  { slug: 'masseter', term: '교근', termEn: 'Masseter', category: 'anatomy', definition: '턱을 닫는 가장 강한 저작근.' },
  { slug: 'temporalis', term: '측두근', termEn: 'Temporalis', category: 'anatomy', definition: '관자놀이에서 시작해 아래턱을 닫는 저작근.' },
  { slug: 'pterygoid', term: '익돌근', termEn: 'Pterygoid Muscle', category: 'anatomy', definition: '턱 움직임에 관여하는 내·외측 근육.' },
  { slug: 'condyle', term: '과두', termEn: 'Condyle', category: 'anatomy', definition: '하악의 관절 돌기. 턱관절의 움직임 중심.' },
  { slug: 'articular-disc', term: '관절원판', termEn: 'Articular Disc', category: 'anatomy', definition: '턱관절 내부의 섬유성 원판. 완충 역할.' },
  { slug: 'occlusion', term: '교합', termEn: 'Occlusion', category: 'anatomy', definition: '위·아래 치아의 맞물림 관계.' },
  { slug: 'dental-formula', term: '치식', termEn: 'Dental Formula', category: 'anatomy', definition: '치아 종류와 개수를 표기하는 공식. 영구치는 2-1-2-3 패턴.' },
  { slug: 'number-of-teeth', term: '영구치 개수', category: 'anatomy', definition: '성인의 영구치는 28개(+사랑니 4개 = 최대 32개).' },

  // Implant 추가
  { slug: 'implant-drill', term: '임플란트 드릴', termEn: 'Implant Drill', category: 'implant', definition: '임플란트 식립 공간을 만드는 정밀 드릴. 지름별 순차 사용.' },
  { slug: 'healing-abutment', term: '힐링 어버트먼트', termEn: 'Healing Abutment', category: 'implant', definition: '2차 수술 후 잇몸 모양을 만들기 위해 일시적으로 연결하는 부품.' },
  { slug: 'torque-wrench', term: '토크 렌치', termEn: 'Torque Wrench', category: 'implant', definition: '픽스쳐·스크류의 조임 강도를 정확히 측정하는 도구.' },
  { slug: 'provisional', term: '임시 보철', termEn: 'Provisional Restoration', category: 'implant', definition: '임플란트 골유착 기간이나 보철 제작 기간 동안 사용하는 임시 치아.' },
  { slug: 'impression-coping', term: '인상 코핑', termEn: 'Impression Coping', category: 'implant', definition: '임플란트 위치·각도를 기공소에 전달하기 위해 인상 시 연결하는 부품.' },
  { slug: 'implant-scan-body', term: '스캔 바디', termEn: 'Scan Body', category: 'implant', definition: '디지털 인상에서 임플란트 위치를 스캐너가 인식하도록 하는 기둥.' },
  { slug: 'implant-bridge', term: '임플란트 브릿지', termEn: 'Implant Bridge', category: 'implant', definition: '여러 개의 임플란트를 연결한 고정성 보철.' },
  { slug: 'screw-retained', term: '스크류 유지형', termEn: 'Screw-Retained', category: 'implant', definition: '크라운을 시멘트 없이 스크류로만 고정하는 방식. 필요 시 탈착 가능.' },
  { slug: 'cement-retained', term: '시멘트 유지형', termEn: 'Cement-Retained', category: 'implant', definition: '임플란트 크라운을 접착제로 고정하는 방식.' },
  { slug: 'overdenture', term: '오버덴쳐', termEn: 'Overdenture', category: 'implant', definition: '임플란트 위에 지지되는 탈착식 틀니. 고정성 임플란트보다 경제적.' },
  { slug: 'straumann', term: '스트라우만', termEn: 'Straumann', category: 'implant', definition: '스위스의 세계적 임플란트 제조사. 장기 임상 데이터가 가장 풍부하다.' },
  { slug: 'osstem', term: '오스템 임플란트', termEn: 'Osstem', category: 'implant', definition: '국내 1위 임플란트 제조사. 한국인 구강 구조에 최적화.' },
  { slug: 'neo', term: '네오바이오텍', termEn: 'Neobiotech', category: 'implant', definition: '국내 중견 임플란트 제조사. 합리적 가격대의 대안.' },
  { slug: 'nobel-biocare', term: '노벨 바이오케어', termEn: 'Nobel Biocare', category: 'implant', definition: '브로네마크 임플란트로 유명한 글로벌 임플란트 회사.' },
  { slug: 'dentium', term: '덴티움', termEn: 'Dentium', category: 'implant', definition: '국내 주요 임플란트 제조사 중 하나.' },
  { slug: 'implant-failure', term: '임플란트 실패', termEn: 'Implant Failure', category: 'implant', definition: '임플란트가 골유착 실패 또는 이후 탈락한 경우.' },
  { slug: 'loading-protocol', term: '로딩 프로토콜', termEn: 'Loading Protocol', category: 'implant', definition: '임플란트에 보철물로 힘을 가하는 시점(즉시·조기·지연)의 분류.' },
  { slug: 'bone-density', term: '골밀도', termEn: 'Bone Density', category: 'implant', definition: '잇몸뼈의 단단함 정도. 임플란트 초기 안정성에 영향.' },
  { slug: 'primary-stability', term: '초기 고정력', termEn: 'Primary Stability', category: 'implant', definition: '임플란트 식립 직후의 고정 강도. 골유착 성공의 첫 관문.' },
  { slug: 'osstell', term: '오스텔(ISQ)', termEn: 'Osstell ISQ', category: 'implant', definition: '임플란트 고정력을 수치화하는 장비. 1~100의 ISQ 값으로 표시.' },

  // Prosthesis 추가
  { slug: 'fixed-prosthesis', term: '고정성 보철', termEn: 'Fixed Prosthesis', category: 'prosthesis', definition: '환자가 뺄 수 없도록 접착·체결된 보철. 크라운·브릿지·임플란트 크라운.' },
  { slug: 'removable-prosthesis', term: '가철성 보철', termEn: 'Removable Prosthesis', category: 'prosthesis', definition: '환자가 뺐다 끼울 수 있는 보철. 틀니·파셜.' },
  { slug: 'full-denture', term: '완전틀니', termEn: 'Complete Denture', category: 'prosthesis', definition: '한 턱 전체 치아가 없을 때 사용하는 틀니.' },
  { slug: 'partial-denture', term: '부분틀니', termEn: 'Partial Denture', category: 'prosthesis', definition: '일부 치아가 남아 있을 때 사용하는 가철식 틀니.' },
  { slug: 'cast-post', term: '포스트', termEn: 'Post and Core', category: 'prosthesis', definition: '신경치료 후 치아 구조가 많이 상실된 경우, 뿌리에 심는 기둥과 코어.' },
  { slug: 'coping', term: '코핑', termEn: 'Coping', category: 'prosthesis', definition: '크라운의 내부 구조물. 금속·지르코니아 등.' },
  { slug: 'pontic', term: '폰틱', termEn: 'Pontic', category: 'prosthesis', definition: '브릿지에서 없어진 치아를 대체하는 중간 부분.' },
  { slug: 'maryland-bridge', term: '메릴랜드 브릿지', termEn: 'Maryland Bridge', category: 'prosthesis', definition: '치아 삭제를 최소화한 접착형 브릿지. 앞니 소규모 결손에 사용.' },
  { slug: 'cantilever-bridge', term: '캔틸레버 브릿지', termEn: 'Cantilever Bridge', category: 'prosthesis', definition: '한 쪽에만 지대치가 있는 외팔보형 브릿지. 제한적으로 사용.' },
  { slug: 'full-mouth-reconstruction', term: '풀마우스', termEn: 'Full Mouth Reconstruction', category: 'prosthesis', definition: '전체 치아를 종합적으로 수복하는 복합 치료.' },
  { slug: 'temporary-crown', term: '임시 치아', termEn: 'Temporary Crown', category: 'prosthesis', definition: '본 보철 제작 기간 동안 사용하는 플라스틱 임시 크라운.' },

  // Orthodontics 추가
  { slug: 'self-ligating', term: '자가결찰 브라켓', termEn: 'Self-Ligating Bracket', category: 'orthodontics', definition: '와이어를 고무줄 없이 장치 자체로 고정하는 브라켓. 마찰이 적다.' },
  { slug: 'damon', term: '데이몬', termEn: 'Damon System', category: 'orthodontics', definition: '대표적인 자가결찰 교정 시스템.' },
  { slug: 'mini-screw', term: '미니 스크류(TAD)', termEn: 'Mini-Screw / TAD', category: 'orthodontics', definition: '교정 힘의 고정점을 확보하기 위한 소형 스크류 앵커.' },
  { slug: 'ceramic-bracket', term: '세라믹 브라켓', termEn: 'Ceramic Bracket', category: 'orthodontics', definition: '치아색 세라믹으로 만든 심미 브라켓.' },
  { slug: 'metal-bracket', term: '메탈 브라켓', termEn: 'Metal Bracket', category: 'orthodontics', definition: '전통적인 금속 브라켓. 효율적이나 심미성은 낮음.' },
  { slug: 'elastic', term: '고무줄', termEn: 'Elastic', category: 'orthodontics', definition: '교정 중 턱 관계 조정을 위해 환자가 직접 거는 고무줄.' },
  { slug: 'extraction-ortho', term: '발치 교정', termEn: 'Extraction Orthodontics', category: 'orthodontics', definition: '공간 확보를 위해 소구치 등을 발치하고 시행하는 교정.' },
  { slug: 'non-extraction', term: '비발치 교정', termEn: 'Non-Extraction Orthodontics', category: 'orthodontics', definition: '치아 발치 없이 진행하는 교정.' },
  { slug: 'headgear', term: '헤드기어', termEn: 'Headgear', category: 'orthodontics', definition: '성장기 골격 교정에 사용하는 외부 장치.' },
  { slug: 'palatal-expander', term: '구개 확장 장치', termEn: 'Palatal Expander', category: 'orthodontics', definition: '성장기에 위턱을 넓혀주는 교정 장치.' },
  { slug: 'functional-appliance', term: '기능성 장치', termEn: 'Functional Appliance', category: 'orthodontics', definition: '성장기 턱 성장 방향을 유도하는 가철식 장치.' },
  { slug: 'relapse', term: '재발', termEn: 'Relapse', category: 'orthodontics', definition: '교정 후 치아가 원래 위치로 돌아가는 현상. 유지장치로 예방.' },
  { slug: 'iTero', term: 'iTero 스캐너', termEn: 'iTero Scanner', category: 'device', definition: '인비절라인 전용 구강 스캐너.' },
  { slug: 'itreatment', term: '아이트리트먼트', termEn: 'iTreatment (Invisalign)', category: 'orthodontics', definition: '인비절라인의 3D 치료 시뮬레이션 시스템.' },
  { slug: 'attachment-ortho', term: '어태치먼트(교정)', termEn: 'Attachment', category: 'orthodontics', definition: '투명교정에서 치아 표면에 붙이는 작은 레진 돌기. 힘 전달 보조.' },
  { slug: 'ipr', term: 'IPR', termEn: 'Interproximal Reduction', category: 'orthodontics', definition: '치아 사이를 미세하게 깎아 공간을 만드는 교정 술식.' },

  // Surgery 추가
  { slug: 'orthognathic', term: '악교정수술', termEn: 'Orthognathic Surgery', category: 'surgery', definition: '턱뼈 자체를 수술해 골격성 부정교합을 바로잡는 수술.' },
  { slug: 'alveoloplasty', term: '치조골 성형술', termEn: 'Alveoloplasty', category: 'surgery', definition: '발치 후 뾰족한 치조골을 다듬는 수술.' },
  { slug: 'vestibuloplasty', term: '전정 성형술', termEn: 'Vestibuloplasty', category: 'surgery', definition: '틀니 유지를 위해 볼과 잇몸의 골짜기를 깊게 만드는 수술.' },
  { slug: 'gingivectomy', term: '치은절제술', termEn: 'Gingivectomy', category: 'surgery', definition: '과도한 잇몸을 잘라내는 수술.' },
  { slug: 'flap-surgery', term: '치주 판막술', termEn: 'Flap Surgery', category: 'surgery', definition: '잇몸을 젖혀 깊은 치석을 제거하고 뼈를 정리하는 치주 수술.' },
  { slug: 'bone-regeneration', term: '골재생술', termEn: 'Bone Regeneration', category: 'surgery', definition: '상실된 잇몸뼈를 재생시키는 다양한 술식 총칭.' },
  { slug: 'suture-removal', term: '실밥 제거', termEn: 'Suture Removal', category: 'surgery', definition: '수술 후 7~10일 후 실밥(봉합사)을 제거하는 처치.' },
  { slug: 'biopsy', term: '조직검사', termEn: 'Biopsy', category: 'surgery', definition: '의심스러운 조직을 일부 떼어 병리검사하는 것.' },
  { slug: 'oral-tumor', term: '구강 종양', termEn: 'Oral Tumor', category: 'pathology', definition: '입 안에 생기는 양성·악성 종양.' },
  { slug: 'oral-cancer', term: '구강암', termEn: 'Oral Cancer', category: 'pathology', definition: '입 안에 발생하는 악성 종양. 조기 발견이 중요.' },
  { slug: 'cyst', term: '낭종', termEn: 'Cyst', category: 'pathology', definition: '액체나 반고형 내용물이 든 주머니 형태의 병변.' },
  { slug: 'odontoma', term: '치아종', termEn: 'Odontoma', category: 'pathology', definition: '치아 조직으로 이루어진 양성 종양.' },

  // Endodontics 추가
  { slug: 'root-canal-retreat', term: '재신경치료', termEn: 'Endodontic Retreatment', category: 'endodontics', definition: '기존 신경치료가 실패해 다시 시행하는 신경치료.' },
  { slug: 'pulpectomy', term: '치수절제술', termEn: 'Pulpectomy', category: 'endodontics', definition: '치수 조직 전체를 제거하는 처치.' },
  { slug: 'pulpotomy', term: '치수절단술', termEn: 'Pulpotomy', category: 'endodontics', definition: '치수의 일부만 제거하고 남은 부분을 보존하는 처치.' },
  { slug: 'apexification', term: '치근단 형성술', termEn: 'Apexification', category: 'endodontics', definition: '미완성 치근에 단단한 벽을 형성시키는 처치. 어린이 영구치에 주로 시행.' },
  { slug: 'mta', term: 'MTA', termEn: 'Mineral Trioxide Aggregate', category: 'material', definition: '치수치료에 쓰이는 재생 재료. 치근단 형성·직접치수복조 등에 사용.' },
  { slug: 'file', term: '파일(엔도 파일)', termEn: 'Endodontic File', category: 'device', definition: '근관을 확대·형성하는 가느다란 치과 기구.' },
  { slug: 'rubber-dam', term: '러버댐', termEn: 'Rubber Dam', category: 'device', definition: '신경치료 시 오염을 차단하기 위해 치아만 노출시키는 고무막.' },
  { slug: 'irrigation', term: '근관 세척', termEn: 'Irrigation', category: 'endodontics', definition: '근관 내부를 차아염소산나트륨 등으로 세척하는 과정.' },

  // Periodontics 추가
  { slug: 'peri-care', term: '치주 관리', termEn: 'Periodontal Maintenance', category: 'periodontics', definition: '치주치료 후 정기적으로 받는 유지 관리.' },
  { slug: 'attachment-loss', term: '부착소실', termEn: 'Attachment Loss', category: 'pathology', definition: '치주인대가 치근에서 떨어진 정도. 치주염의 심각도 지표.' },
  { slug: 'furcation', term: '치근 이개부', termEn: 'Furcation', category: 'anatomy', definition: '어금니의 여러 뿌리가 갈라지는 지점.' },
  { slug: 'mobility', term: '치아 동요도', termEn: 'Tooth Mobility', category: 'pathology', definition: '치아가 흔들리는 정도. 치주염 진행의 지표.' },
  { slug: 'halitophobia', term: '구취 공포증', termEn: 'Halitophobia', category: 'pathology', definition: '실제와 무관하게 자신의 입냄새를 과도하게 걱정하는 상태.' },
  { slug: 'biofilm', term: '바이오필름', termEn: 'Biofilm', category: 'pathology', definition: '치아 표면 위 세균이 형성한 복합 막. 치태의 본질.' },

  // Prevention 추가
  { slug: 'probing', term: '치주 탐침', termEn: 'Periodontal Probing', category: 'prevention', definition: '치주낭 깊이를 측정하는 검진 술식.' },
  { slug: 'perio-chart', term: '치주 차트', termEn: 'Periodontal Chart', category: 'prevention', definition: '치아별 치주 상태를 기록한 진단 차트.' },
  { slug: 'desensitizer', term: '시린이 완화제', termEn: 'Desensitizer', category: 'material', definition: '치아 시림을 완화하는 약제.' },
  { slug: 'caries-risk', term: '우식 위험도', termEn: 'Caries Risk Assessment', category: 'prevention', definition: '환자의 충치 발생 가능성을 평가하는 검사.' },
  { slug: 'xylitol', term: '자일리톨', termEn: 'Xylitol', category: 'prevention', definition: '충치 원인균의 활성을 억제하는 천연 감미료.' },
  { slug: 'professional-cleaning', term: '전문가 치면세마', termEn: 'Prophylaxis', category: 'prevention', definition: '스케일링과 폴리싱 등을 포함한 치과 전문 구강 관리.' },
  { slug: 'polishing', term: '폴리싱', termEn: 'Polishing', category: 'prevention', definition: '스케일링 후 치아 표면을 매끄럽게 연마하는 과정.' },

  // Esthetic 추가
  { slug: 'home-bleaching', term: '자가 미백', termEn: 'Home Bleaching', category: 'esthetic', definition: '개인 맞춤 트레이와 미백제를 이용해 집에서 하는 미백.' },
  { slug: 'office-bleaching', term: '오피스 미백', termEn: 'In-Office Bleaching', category: 'esthetic', definition: '진료실에서 고농도 약제로 시행하는 미백.' },
  { slug: 'internal-bleaching', term: '신경치료 치아 미백', termEn: 'Internal Bleaching', category: 'esthetic', definition: '신경치료 후 어두워진 치아를 내부에서 밝게 하는 미백.' },
  { slug: 'smile-design', term: '스마일 디자인', termEn: 'Smile Design', category: 'esthetic', definition: '얼굴형·입술·치아를 종합적으로 고려한 미소 설계.' },
  { slug: 'midline', term: '치아 정중선', termEn: 'Dental Midline', category: 'esthetic', definition: '상하 앞니의 중앙선. 얼굴 정중선과 일치해야 아름다움.' },
  { slug: 'golden-ratio', term: '치아 황금비율', termEn: 'Golden Ratio (Teeth)', category: 'esthetic', definition: '앞니의 너비 비율이 약 1.618:1:0.618인 미적 기준.' },
  { slug: 'gingival-zenith', term: '잇몸 최고점', termEn: 'Gingival Zenith', category: 'esthetic', definition: '잇몸 라인에서 가장 위쪽 지점. 심미 보철에서 중요한 요소.' },

  // Material 추가
  { slug: 'resin-cement', term: '레진 시멘트', termEn: 'Resin Cement', category: 'material', definition: '보철물을 치아에 접착하는 광중합형 접착제.' },
  { slug: 'glass-ionomer', term: '글라스 아이오노머', termEn: 'Glass Ionomer', category: 'material', definition: '불소 용출 성분이 있는 치과 수복재. 유치·임시에 주로 사용.' },
  { slug: 'calcium-hydroxide', term: '칼슘 하이드록사이드', termEn: 'Calcium Hydroxide', category: 'material', definition: '치수를 보호하거나 유도하는 데 사용되는 재료.' },
  { slug: 'bonding-agent', term: '본딩제', termEn: 'Bonding Agent', category: 'material', definition: '치아와 수복재를 접착시키는 전처리제.' },
  { slug: 'etchant', term: '에칭제', termEn: 'Etchant', category: 'material', definition: '치아 표면을 미세하게 거칠게 만들어 접착력을 높이는 산.' },
  { slug: 'allograft', term: '동종골 이식재', termEn: 'Allograft', category: 'material', definition: '같은 종(사람)의 뼈에서 유래한 이식재.' },
  { slug: 'xenograft', term: '이종골 이식재', termEn: 'Xenograft', category: 'material', definition: '소·돼지 등 다른 종에서 유래한 뼈 이식재.' },
  { slug: 'alloplast', term: '합성골 이식재', termEn: 'Alloplast', category: 'material', definition: '인공 합성된 뼈 이식재. HA, β-TCP 등.' },
  { slug: 'autogenous-bone', term: '자가골', termEn: 'Autogenous Bone', category: 'material', definition: '환자 본인의 뼈를 떼어 이식하는 재료.' },
  { slug: 'membrane', term: '차폐막', termEn: 'Membrane', category: 'material', definition: '뼈이식 시 결합조직이 들어오는 것을 막는 얇은 막.' },
  { slug: 'prf', term: 'PRF', termEn: 'Platelet-Rich Fibrin', category: 'material', definition: '환자 혈액에서 추출한 혈소판 풍부 피브린. 조직 재생 촉진.' },
  { slug: 'prp', term: 'PRP', termEn: 'Platelet-Rich Plasma', category: 'material', definition: '혈소판 풍부 혈장. 재생 치료에 사용.' },

  // Device 추가
  { slug: 'dental-chair', term: '치과용 유닛체어', termEn: 'Dental Chair', category: 'device', definition: '환자 진료용 치과 전용 의자.' },
  { slug: 'apex-locator', term: '근관장 측정기', termEn: 'Apex Locator', category: 'device', definition: '근관의 정확한 길이를 전기적으로 측정하는 장비.' },
  { slug: 'curing-light', term: '광중합기', termEn: 'Curing Light', category: 'device', definition: '레진을 굳히는 LED 조사기.' },
  { slug: 'air-scaler', term: '에어 스케일러', termEn: 'Air Scaler', category: 'device', definition: '공기압으로 작동하는 스케일링 장비.' },
  { slug: 'ultrasonic-scaler', term: '초음파 스케일러', termEn: 'Ultrasonic Scaler', category: 'device', definition: '초음파 진동으로 치석을 제거하는 장비.' },
  { slug: 'mectron-combitouch', term: '멕트론 콤비터치', termEn: 'Mectron Combi Touch', category: 'device', definition: '이탈리아 멕트론사의 초음파·에어플로 복합 장비. 부평우리치과 10대 보유.' },
  { slug: 'zeiss-extaro', term: '칼짜이스 Extaro 300', termEn: 'Zeiss Extaro 300', category: 'device', definition: '독일 칼짜이스사의 치과 전용 미세현미경 최상급 모델.' },
  { slug: 'kavo-handpiece', term: '카보 핸드피스', termEn: 'Kavo Handpiece', category: 'device', definition: '독일 카보사의 고품질 핸드피스.' },
  { slug: 'surgical-guide', term: '수술 가이드', termEn: 'Surgical Guide', category: 'device', definition: '3D 프린팅으로 제작한 임플란트 수술 정확도 장치.' },
  { slug: 'dental-laser', term: '치과 레이저', termEn: 'Dental Laser', category: 'device', definition: '잇몸 치료·미백 등에 사용되는 레이저 장비.' },
  { slug: 'autoclave-sterilizer', term: '고압증기 멸균기', termEn: 'Autoclave Sterilizer', category: 'device', definition: '121~134℃ 고압 증기로 기구를 멸균하는 장비.' },
  { slug: 'ultrasonic-cleaner', term: '초음파 세척기', termEn: 'Ultrasonic Cleaner', category: 'device', definition: '기구 멸균 전 초음파로 잔여물을 제거하는 장비.' },

  // Procedure 추가
  { slug: 'consultation', term: '상담', termEn: 'Consultation', category: 'procedure', definition: '치료 계획과 비용을 설명드리는 진료 전 과정.' },
  { slug: 'diagnosis', term: '진단', termEn: 'Diagnosis', category: 'procedure', definition: '환자의 구강 상태를 종합적으로 판단하는 과정.' },
  { slug: 'treatment-plan', term: '치료 계획', termEn: 'Treatment Plan', category: 'procedure', definition: '진단 후 필요한 치료의 순서와 범위를 정리한 계획.' },
  { slug: 'oral-exam', term: '구강 검진', termEn: 'Oral Examination', category: 'procedure', definition: '치아·잇몸·혀 등을 종합 관찰하는 기본 검진.' },
  { slug: 'x-ray', term: '치과 X-ray', termEn: 'Dental X-ray', category: 'procedure', definition: '치아 내부·뼈 상태를 보기 위한 방사선 촬영.' },
  { slug: 'bite-wing', term: '바이트윙 촬영', termEn: 'Bitewing X-ray', category: 'procedure', definition: '어금니 사이 충치 진단에 특화된 X-ray.' },
  { slug: 'periapical', term: '치근단 X-ray', termEn: 'Periapical X-ray', category: 'procedure', definition: '개별 치아의 뿌리까지 볼 수 있는 X-ray.' },
  { slug: 'photography-intra', term: '구내 사진', termEn: 'Intraoral Photography', category: 'procedure', definition: '치료 전후 비교를 위한 입 안 사진 촬영.' },
  { slug: 'model-impression', term: '고무 인상', termEn: 'Conventional Impression', category: 'procedure', definition: '실리콘 등으로 치아 본을 뜨는 전통 방식.' },
  { slug: 'occlusal-analysis', term: '교합 분석', termEn: 'Occlusal Analysis', category: 'procedure', definition: '위아래 치아의 맞물림을 분석하는 검사.' },
  { slug: 'articulator', term: '교합기', termEn: 'Articulator', category: 'device', definition: '상하악 모델을 고정해 교합을 재현하는 장비.' },
  { slug: 'face-bow', term: '페이스보우', termEn: 'Face Bow', category: 'device', definition: '상악의 위치를 교합기에 옮기는 측정 도구.' },

  // Pathology 추가
  { slug: 'attrition', term: '마모', termEn: 'Attrition', category: 'pathology', definition: '치아 간 마찰로 인한 마모. 이갈이로 심해질 수 있음.' },
  { slug: 'erosion', term: '침식', termEn: 'Erosion', category: 'pathology', definition: '산성 음식·위산 역류로 인한 화학적 치아 침식.' },
  { slug: 'abrasion', term: '치경부 마모', termEn: 'Abrasion', category: 'pathology', definition: '잘못된 칫솔질로 인한 치아 목 부분의 마모.' },
  { slug: 'abfraction', term: '치경부 파절', termEn: 'Abfraction', category: 'pathology', definition: '교합력에 의해 치아 목 부분에 쐐기 모양 손상이 생기는 현상.' },
  { slug: 'aphthous-ulcer', term: '아프타성 궤양', termEn: 'Aphthous Ulcer', category: 'pathology', definition: '입 안에 반복적으로 생기는 통증성 궤양(구내염).' },
  { slug: 'leukoplakia', term: '백반증', termEn: 'Leukoplakia', category: 'pathology', definition: '닦이지 않는 흰 반점. 구강 전암병변일 수 있음.' },
  { slug: 'candidiasis', term: '구강 칸디다증', termEn: 'Oral Candidiasis', category: 'pathology', definition: '칸디다 진균 감염으로 입 안에 흰 막이 생기는 질환.' },
  { slug: 'herpetic-stomatitis', term: '구강 헤르페스', termEn: 'Herpetic Stomatitis', category: 'pathology', definition: '헤르페스 바이러스에 의한 구강 점막 감염.' },
  { slug: 'oral-lichen-planus', term: '구강 편평태선', termEn: 'Oral Lichen Planus', category: 'pathology', definition: '면역 관련 만성 구강 점막 질환.' },
  { slug: 'xerostomia', term: '구강건조증', termEn: 'Xerostomia', category: 'pathology', definition: '침 분비 감소로 입이 마르는 증상.' },
  { slug: 'tongue-coating', term: '설태', termEn: 'Tongue Coating', category: 'pathology', definition: '혀 표면의 희거나 누런 막. 구취의 원인이 될 수 있다.' },
  { slug: 'hyperdontia', term: '과잉치', termEn: 'Hyperdontia', category: 'pathology', definition: '정상 개수보다 많은 치아가 있는 상태.' },
  { slug: 'hypodontia', term: '결손치', termEn: 'Hypodontia', category: 'pathology', definition: '선천적으로 치아가 없는 상태.' },
  { slug: 'microdontia', term: '왜소치', termEn: 'Microdontia', category: 'pathology', definition: '치아가 정상보다 작은 상태.' },
  { slug: 'macrodontia', term: '거대치', termEn: 'Macrodontia', category: 'pathology', definition: '치아가 정상보다 큰 상태.' },
  { slug: 'fusion', term: '융합치', termEn: 'Fusion', category: 'pathology', definition: '두 치아가 하나로 합쳐져 형성된 치아.' },
  { slug: 'gemination', term: '쌍생치', termEn: 'Gemination', category: 'pathology', definition: '한 치아의 싹이 둘로 갈라져 생긴 치아.' },
  { slug: 'taurodontism', term: '타우로돈티즘', termEn: 'Taurodontism', category: 'pathology', definition: '치수강이 비정상적으로 큰 치아 기형.' },
  { slug: 'amelogenesis-imperfecta', term: '법랑질 형성부전', termEn: 'Amelogenesis Imperfecta', category: 'pathology', definition: '법랑질이 제대로 형성되지 않는 유전 질환.' },
  { slug: 'dentinogenesis-imperfecta', term: '상아질 형성부전', termEn: 'Dentinogenesis Imperfecta', category: 'pathology', definition: '상아질 형성 이상 유전 질환.' },
  { slug: 'fluorosis', term: '불소증', termEn: 'Fluorosis', category: 'pathology', definition: '과도한 불소 섭취로 법랑질에 흰 반점·줄이 생기는 현상.' },
  { slug: 'tetracycline-stain', term: '테트라사이클린 착색', termEn: 'Tetracycline Staining', category: 'pathology', definition: '항생제 복용으로 인한 치아 내재성 변색.' },

  // Pediatric 추가
  { slug: 'teething', term: '치아 맹출', termEn: 'Teething', category: 'pediatric', definition: '유치·영구치가 잇몸을 뚫고 나오는 과정.' },
  { slug: 'baby-bottle-caries', term: '우유병 우식증', termEn: 'Baby Bottle Caries', category: 'pediatric', definition: '유아가 우유병을 물고 자는 습관으로 생기는 광범위 충치.' },
  { slug: 'fluoride-varnish', term: '불소 바니쉬', termEn: 'Fluoride Varnish', category: 'pediatric', definition: '치아에 얇게 바르는 고농도 불소. 어린이 충치 예방용.' },
  { slug: 'pulp-cap', term: '치수복조술', termEn: 'Pulp Capping', category: 'pediatric', definition: '치수를 보존하기 위한 보호막 처치. 주로 소아 치아에 시행.' },
  { slug: 'natal-tooth', term: '출생치', termEn: 'Natal Tooth', category: 'pediatric', definition: '태어날 때 이미 나 있는 치아. 드문 선천 이상.' },
  { slug: 'ectopic-eruption', term: '이소맹출', termEn: 'Ectopic Eruption', category: 'pediatric', definition: '치아가 정상 위치에서 벗어나 다른 자리에 나오는 것.' },

  // 그 외
  { slug: 'dental-insurance', term: '치과 건강보험', termEn: 'Dental Insurance', category: 'other', definition: '스케일링·치주치료·65세 이상 임플란트 등 건강보험이 적용되는 항목.' },
  { slug: 'non-covered', term: '비급여', termEn: 'Non-Covered', category: 'other', definition: '건강보험이 적용되지 않는 진료 항목.' },
  { slug: 'covered', term: '급여', termEn: 'Covered', category: 'other', definition: '건강보험이 적용되는 진료 항목.' },
  { slug: 'pre-auth', term: '사전승인', termEn: 'Pre-Authorization', category: 'other', definition: '특정 보험 적용 항목에 대한 사전 심사.' },
  { slug: 'informed-consent', term: '설명 동의', termEn: 'Informed Consent', category: 'other', definition: '치료의 목적·방법·위험을 충분히 설명한 후 받는 환자 동의.' },
  { slug: 'medical-history', term: '의학적 병력', termEn: 'Medical History', category: 'other', definition: '진료 전 확인하는 전신 질환·복용 약물 등의 기록.' },
  { slug: 'anticoagulants', term: '항응고제', termEn: 'Anticoagulants', category: 'other', definition: '혈액 응고를 억제하는 약. 발치·수술 전 반드시 확인.' },
  { slug: 'bisphosphonate', term: '비스포스포네이트', termEn: 'Bisphosphonate', category: 'other', definition: '골다공증 치료제. 발치 시 골괴사(BRONJ) 위험.' },
  { slug: 'bronj', term: '골괴사(BRONJ)', termEn: 'BRONJ', category: 'pathology', definition: '비스포스포네이트 관련 턱뼈 괴사증.' },
  { slug: 'dental-anxiety', term: '치과 공포증', termEn: 'Dental Anxiety', category: 'other', definition: '치과 치료를 두려워해 방문을 기피하는 심리 상태.' },
  { slug: 'ergonomics-brushing', term: '올바른 칫솔질', termEn: 'Proper Brushing', category: 'prevention', definition: '45도 각도·부드러운 힘·작은 원형 동작이 기본.' },
  { slug: 'bass-method', term: '바스 칫솔질법', termEn: 'Bass Technique', category: 'prevention', definition: '잇몸 경계를 중심으로 하는 대표적인 칫솔질 방법.' },
  { slug: 'rolling-method', term: '롤링 칫솔질법', termEn: 'Rolling Technique', category: 'prevention', definition: '잇몸에서 치아 쪽으로 굴리는 방식의 칫솔질법.' },

  // 영어/한자 변형 용어들 (내부 링크 다양화)
  { slug: 'nightguard-splint', term: '교합 안정 장치', termEn: 'Occlusal Splint', category: 'device', definition: '이갈이·턱관절 장애 치료용 교합 안정 장치.' },
  { slug: 'tooth-whitening-led', term: 'LED 미백', termEn: 'LED Whitening', category: 'esthetic', definition: 'LED 광선을 이용한 미백 가속 방식.' },
  { slug: 'zoom-whitening', term: 'Zoom 미백', termEn: 'Zoom Whitening', category: 'esthetic', definition: 'Philips사의 대표적 미백 시스템.' },
  { slug: 'opalescence-whitening', term: '오팔레센스 미백', termEn: 'Opalescence', category: 'esthetic', definition: 'Ultradent사의 유명 미백 제품.' },
  { slug: 'tray-whitening', term: '트레이 미백', termEn: 'Tray Whitening', category: 'esthetic', definition: '개인 맞춤 트레이에 미백제를 담아 착용하는 방식.' },
  { slug: 'walking-bleach', term: '워킹 블리치', termEn: 'Walking Bleach', category: 'esthetic', definition: '신경치료 치아에 미백제를 봉입해 서서히 밝히는 기법.' },
  { slug: 'paste-fluoride', term: '불소 치약', termEn: 'Fluoride Toothpaste', category: 'prevention', definition: '충치 예방을 위한 불소 함유 치약.' },
  { slug: 'children-toothpaste', term: '어린이 치약', termEn: "Children's Toothpaste", category: 'pediatric', definition: '낮은 농도의 불소를 함유한 소아용 치약.' },
  { slug: 'silver-diamine-fluoride', term: '질산은 불소 도포', termEn: 'SDF', category: 'pediatric', definition: '어린이 초기 충치 진행을 멈추는 약제. 착색이 단점.' },
  { slug: 'herbst-appliance', term: '허브스트 장치', termEn: 'Herbst Appliance', category: 'orthodontics', definition: '성장기 하악 후퇴 교정용 고정식 기능성 장치.' },
  { slug: 'twin-block', term: '트윈블록', termEn: 'Twin Block', category: 'orthodontics', definition: '상하 가철식 블록으로 턱 성장을 유도하는 장치.' },

  // 10여개 더 필요한 항목 (총 500+ 확보)
  { slug: 'cofferdam', term: '코퍼댐', termEn: 'Cofferdam', category: 'device', definition: '러버댐의 다른 명칭. 오염 차단 고무막.' },
  { slug: 'probe', term: '치주탐침자', termEn: 'Periodontal Probe', category: 'device', definition: '치주낭 깊이를 측정하는 눈금이 있는 도구.' },
  { slug: 'explorer', term: '익스플로러', termEn: 'Dental Explorer', category: 'device', definition: '충치·치석을 탐지하는 갈고리형 기구.' },
  { slug: 'mirror-dental', term: '치경', termEn: 'Dental Mirror', category: 'device', definition: '입 안을 들여다보는 작은 거울.' },
  { slug: 'saliva-ejector', term: '석션', termEn: 'Saliva Ejector', category: 'device', definition: '침·물을 빨아들이는 흡입 관.' },
  { slug: 'cavitron', term: '캐비트론', termEn: 'Cavitron', category: 'device', definition: '대표적인 초음파 스케일러 브랜드.' },
  { slug: 'diamond-bur', term: '다이아몬드 버', termEn: 'Diamond Bur', category: 'device', definition: '다이아몬드 입자가 붙은 치아 삭제용 기구.' },
  { slug: 'carbide-bur', term: '카바이드 버', termEn: 'Carbide Bur', category: 'device', definition: '텅스텐 카바이드 재질의 치아 삭제 기구.' },
  { slug: 'matrix-band', term: '매트릭스 밴드', termEn: 'Matrix Band', category: 'device', definition: '치아 옆면 모양을 잡아주는 금속 띠.' },
  { slug: 'wedge', term: '웨지', termEn: 'Wedge', category: 'device', definition: '치아 사이 공간 확보용 쐐기.' },
  { slug: 'retraction-cord', term: '견인사', termEn: 'Retraction Cord', category: 'material', definition: '인상을 위해 잇몸을 일시적으로 밀어내는 실.' },
  { slug: 'triple-tray', term: '트리플 트레이', termEn: 'Triple Tray', category: 'device', definition: '상·하악 인상을 한 번에 뜰 수 있는 양면 트레이.' },

  // 진단/검사
  { slug: 'vitality-test', term: '치수 생활력 검사', termEn: 'Pulp Vitality Test', category: 'procedure', definition: '치아 신경이 살아있는지 확인하는 검사(냉검사·전기검사).' },
  { slug: 'percussion-test', term: '타진 검사', termEn: 'Percussion Test', category: 'procedure', definition: '치아를 두드려 염증 여부를 확인하는 진단.' },
  { slug: 'caries-detection', term: '충치 감지기', termEn: 'Caries Detector', category: 'device', definition: '형광/레이저로 초기 충치를 감지하는 장비(예: 디아그노덴트).' },
  { slug: 'diagnodent', term: '디아그노덴트', termEn: 'DIAGNOdent', category: 'device', definition: 'KaVo사의 레이저 충치 진단 장비.' },

  // 재료/브랜드 추가
  { slug: 'cerec', term: 'CEREC', termEn: 'CEREC', category: 'device', definition: 'Dentsply Sirona의 당일 보철 제작 CAD/CAM 시스템.' },
  { slug: '3shape', term: '3Shape', termEn: '3Shape', category: 'device', definition: '덴마크의 디지털 치과 스캐너·CAD 회사.' },
  { slug: 'exocad', term: 'exocad', termEn: 'exocad', category: 'device', definition: '독일의 치과 CAD 소프트웨어.' },
  { slug: 'dental-3d-printer', term: '치과용 3D 프린터', termEn: 'Dental 3D Printer', category: 'device', definition: '수술 가이드·모형·임시 보철물 제작용.' },
  { slug: 'photogrammetry', term: '사진측량법', termEn: 'Photogrammetry', category: 'procedure', definition: '복수 임플란트 위치를 사진으로 측정하는 디지털 인상 기법.' },

  // 2차 용어들 - 총 500개 달성 확보용
  { slug: 'dentin-tubule', term: '상아세관', termEn: 'Dentinal Tubule', category: 'anatomy', definition: '상아질 내부의 미세한 관. 시림의 통로.' },
  { slug: 'odontoblast', term: '상아모세포', termEn: 'Odontoblast', category: 'anatomy', definition: '상아질을 생성하는 세포.' },
  { slug: 'ameloblast', term: '법랑모세포', termEn: 'Ameloblast', category: 'anatomy', definition: '법랑질을 생성하는 세포.' },
  { slug: 'cementoblast', term: '백악모세포', termEn: 'Cementoblast', category: 'anatomy', definition: '백악질을 생성하는 세포.' },
  { slug: 'osteoblast', term: '조골세포', termEn: 'Osteoblast', category: 'anatomy', definition: '뼈를 생성하는 세포.' },
  { slug: 'osteoclast', term: '파골세포', termEn: 'Osteoclast', category: 'anatomy', definition: '뼈를 흡수·분해하는 세포.' },
  { slug: 'hyaluronic-acid', term: '히알루론산', termEn: 'Hyaluronic Acid', category: 'material', definition: '조직 재생과 주름 개선에 사용되는 점성 물질.' },
  { slug: 'collagen', term: '콜라겐', termEn: 'Collagen', category: 'material', definition: '치주·골재생 재료의 주성분.' },
  { slug: 'chlorhexidine', term: '클로르헥시딘', termEn: 'Chlorhexidine', category: 'material', definition: '강력한 구강 소독제. 수술 후 가글에 사용.' },
  { slug: 'epinephrine', term: '에피네프린', termEn: 'Epinephrine', category: 'material', definition: '국소마취제에 첨가되는 혈관수축제.' },
  { slug: 'lidocaine', term: '리도카인', termEn: 'Lidocaine', category: 'material', definition: '치과에서 가장 많이 쓰이는 국소마취제.' },
  { slug: 'articaine', term: '아티카인', termEn: 'Articaine', category: 'material', definition: '침투력이 좋은 치과 국소마취제.' },
  { slug: 'mepivacaine', term: '메피바카인', termEn: 'Mepivacaine', category: 'material', definition: '혈관수축제 없이 쓰는 국소마취제.' },
  { slug: 'nitrous-oxide', term: '아산화질소(웃음가스)', termEn: 'Nitrous Oxide', category: 'material', definition: '경증 진정에 사용되는 흡입 가스.' },
  { slug: 'midazolam', term: '미다졸람', termEn: 'Midazolam', category: 'material', definition: '수면진정에 쓰이는 벤조디아제핀 계열 약물.' },

  // 추가 해부/진단
  { slug: 'panoramic-view', term: '파노라마 뷰', termEn: 'Panoramic View', category: 'procedure', definition: '상하악 전체를 한 장에 담는 X-ray 영상.' },
  { slug: 'cephalometric', term: '측면두부방사선', termEn: 'Cephalometric X-ray', category: 'procedure', definition: '교정 분석용 측면 두개부 X-ray.' },
  { slug: 'cephalo-analysis', term: '두부방사선 분석', termEn: 'Cephalometric Analysis', category: 'procedure', definition: '교정 진단을 위한 각도·거리 측정 분석.' },
  { slug: 'study-model', term: '진단 모형', termEn: 'Study Model', category: 'device', definition: '치료 계획 수립을 위한 석고 또는 디지털 모형.' },
  { slug: 'diagnostic-wax-up', term: '왁스 업', termEn: 'Diagnostic Wax-up', category: 'procedure', definition: '보철 형태를 왁스로 미리 만들어 보이는 과정.' },
  { slug: 'mockup', term: '목업', termEn: 'Mock-up', category: 'procedure', definition: '보철 결과를 임시 재료로 환자 입에 미리 시뮬레이션.' },

  // 기타
  { slug: 'dental-hygienist', term: '치과위생사', termEn: 'Dental Hygienist', category: 'other', definition: '스케일링·예방관리·진료 보조를 담당하는 국가자격 직역.' },
  { slug: 'dentist', term: '치과의사', termEn: 'Dentist', category: 'other', definition: '치과 진료를 수행하는 의료인.' },
  { slug: 'dental-specialist', term: '치과전문의', termEn: 'Dental Specialist', category: 'other', definition: '11개 전문과목 수련을 마친 보건복지부 인증 전문의.' },
  { slug: 'omfs', term: '구강악안면외과', termEn: 'OMFS', category: 'other', definition: '구강·얼굴뼈·턱 수술 전문과. 대표원장의 전공 분야.' },
  { slug: 'prosthodontics', term: '치과보철과', termEn: 'Prosthodontics', category: 'other', definition: '보철 전공 치과 전문과.' },
  { slug: 'conservative-dentistry', term: '보존학', termEn: 'Conservative Dentistry', category: 'other', definition: '충치·신경치료 등 치아 보존을 담당하는 전문과.' },
  { slug: 'pediatric-dentistry', term: '소아치과', termEn: 'Pediatric Dentistry', category: 'other', definition: '어린이 치과를 담당하는 전문과.' },
  { slug: 'periodontology', term: '치주과', termEn: 'Periodontology', category: 'other', definition: '잇몸·치주 질환 전공과.' },
  { slug: 'integrated-dentistry', term: '통합치의학과', termEn: 'Integrated Dentistry', category: 'other', definition: '전반적 치과 진료를 다루는 전문과. 대표원장 전문의 자격.' },
  { slug: 'dental-radiology', term: '구강악안면방사선학', termEn: 'Oral and Maxillofacial Radiology', category: 'other', definition: 'X-ray·CT 영상 진단을 담당하는 전공.' },

  // 보험/비용
  { slug: 'insurance-senior-implant', term: '65세 임플란트 보험', termEn: 'Senior Implant Insurance', category: 'other', definition: '만 65세 이상 평생 2개 임플란트에 건강보험 적용.' },
  { slug: 'insurance-denture', term: '노인 틀니 보험', termEn: 'Senior Denture Insurance', category: 'other', definition: '만 65세 이상 완전·부분 틀니에 건강보험 적용.' },
  { slug: 'scaling-insurance', term: '스케일링 보험', termEn: 'Scaling Insurance', category: 'other', definition: '만 19세 이상 연 1회 스케일링 건강보험 적용.' },
  { slug: 'sealant-insurance', term: '실란트 보험', termEn: 'Sealant Insurance', category: 'other', definition: '만 18세 이하 영구 어금니 실란트에 건강보험 적용.' },

  // 감염관리
  { slug: 'infection-control', term: '감염관리', termEn: 'Infection Control', category: 'other', definition: '교차감염 차단을 위한 기구 멸균·일회용 소모품 관리.' },
  { slug: 'one-to-one-handpiece', term: '1인 1핸드피스', termEn: 'One-to-One Handpiece', category: 'other', definition: '한 환자당 별도 핸드피스를 사용하여 교차감염을 차단하는 원칙.' },
  { slug: 'disposable', term: '일회용 기구', termEn: 'Disposable Instrument', category: 'other', definition: '환자당 한 번 사용 후 폐기하는 기구.' },
  { slug: 'biohazard', term: '의료폐기물', termEn: 'Biohazard Waste', category: 'other', definition: '감염 위험이 있는 진료 폐기물. 별도 처리 필요.' },

  // 부가 개념
  { slug: 'biotype', term: '치은 바이오타입', termEn: 'Gingival Biotype', category: 'anatomy', definition: '얇은형/두꺼운형 잇몸. 보철·임플란트 예후에 영향.' },
  { slug: 'papilla', term: '치간 유두', termEn: 'Interdental Papilla', category: 'anatomy', definition: '치아와 치아 사이를 채우는 잇몸 돌기.' },
  { slug: 'black-triangle', term: '블랙 트라이앵글', termEn: 'Black Triangle', category: 'pathology', definition: '치간 유두 상실로 생긴 치아 사이 검은 삼각형 공간.' },
  { slug: 'biologic-width', term: '생물학적 폭경', termEn: 'Biologic Width', category: 'anatomy', definition: '잇몸과 뼈 사이에 반드시 필요한 결합조직·상피의 폭. 보철 설계 시 중요.' },
  { slug: 'emergence-profile', term: '이머젼스 프로파일', termEn: 'Emergence Profile', category: 'esthetic', definition: '보철물이 잇몸에서 나오는 곡선. 심미의 핵심.' },
]

// ============================================================
// 추가 확장 용어 (500+ 목표)
// ============================================================
const EXTRA_AUTO: AutoTerm[] = [
  // Implant 심화
  { slug: 'immediate-loading', term: '즉시 하중', termEn: 'Immediate Loading', category: 'implant', definition: '임플란트 식립 직후 임시 보철을 연결하는 방식.' },
  { slug: 'delayed-loading', term: '지연 하중', termEn: 'Delayed Loading', category: 'implant', definition: '치유 기간 후 보철을 연결하는 전통적 방식.' },
  { slug: 'early-loading', term: '조기 하중', termEn: 'Early Loading', category: 'implant', definition: '1~2개월 내 임시 보철을 연결하는 방식.' },
  { slug: 'platform-switching', term: '플랫폼 스위칭', termEn: 'Platform Switching', category: 'implant', definition: '어버트먼트를 픽스쳐보다 좁게 설계해 변연골 흡수를 최소화하는 개념.' },
  { slug: 'conical-connection', term: '원추형 연결', termEn: 'Conical Connection', category: 'implant', definition: '원추형 삽입으로 밀봉을 극대화한 최신 픽스쳐-어버트먼트 연결 방식.' },
  { slug: 'morse-taper', term: '모스 테이퍼', termEn: 'Morse Taper', category: 'implant', definition: '스트라우만 BL 계열의 원추형 마찰 연결 구조.' },
  { slug: 'primary-stability', term: '1차 안정성', termEn: 'Primary Stability', category: 'implant', definition: '식립 직후 픽스쳐의 기계적 안정성.' },
  { slug: 'secondary-stability', term: '2차 안정성', termEn: 'Secondary Stability', category: 'implant', definition: '골유착 완료 후 얻는 생물학적 안정성.' },
  { slug: 'isq', term: 'ISQ', termEn: 'Implant Stability Quotient', category: 'implant', definition: '임플란트 안정성을 수치화한 지표 (0-100).' },
  { slug: 'osstell', term: '오스텔', termEn: 'Osstell', category: 'device', definition: 'ISQ를 측정하는 대표적 장비.' },
  { slug: 'peri-implantitis', term: '임플란트 주위염', termEn: 'Peri-implantitis', category: 'pathology', definition: '임플란트 주변 뼈까지 염증이 진행된 상태 (비가역적).' },
  { slug: 'peri-implant-mucositis', term: '임플란트 주위 점막염', termEn: 'Peri-implant Mucositis', category: 'pathology', definition: '임플란트 주변 잇몸에만 염증이 있는 가역적 상태.' },
  { slug: 'bone-density-d1-d4', term: '뼈 밀도 분류(D1~D4)', termEn: 'Bone Density Classification', category: 'implant', definition: '임플란트 수술 설계에 사용되는 미쉬 분류.' },
  { slug: 'ridge-preservation', term: '치조제 보존술', termEn: 'Ridge Preservation', category: 'implant', definition: '발치 후 뼈 흡수를 방지하는 골이식 처치.' },
  { slug: 'socket-shield', term: '소켓 쉴드 기법', termEn: 'Socket Shield', category: 'implant', definition: '뿌리 일부를 남겨 뼈·잇몸을 보존하는 최신 임플란트 기법.' },
  { slug: 'zygomatic-implant', term: '지고마 임플란트', termEn: 'Zygomatic Implant', category: 'implant', definition: '광대뼈에 식립하는 특수 임플란트 (극심 골소실 시).' },
  { slug: 'short-implant', term: '짧은 임플란트', termEn: 'Short Implant', category: 'implant', definition: '길이 8mm 이하의 단축형 픽스쳐.' },
  { slug: 'narrow-implant', term: '소구경 임플란트', termEn: 'Narrow Diameter Implant', category: 'implant', definition: '직경 3.3mm 이하의 좁은 픽스쳐.' },
  { slug: 'surgical-guide', term: '서지컬 가이드', termEn: 'Surgical Guide', category: 'device', definition: 'CBCT 기반 3D 프린팅 임플란트 수술 유도 장치.' },
  { slug: 'flapless-surgery', term: '무절개 수술', termEn: 'Flapless Surgery', category: 'procedure', definition: '잇몸을 절개하지 않는 최소 침습 임플란트 수술.' },
  { slug: 'immediate-implant', term: '발치 즉시 임플란트', termEn: 'Immediate Implant', category: 'implant', definition: '발치와 동시에 임플란트를 식립하는 수술.' },
  { slug: 'delayed-implant', term: '지연 임플란트', termEn: 'Delayed Implant', category: 'implant', definition: '발치 후 3-6개월 치유 후 식립.' },
  { slug: 'external-hex', term: '외부 육각 연결', termEn: 'External Hex', category: 'implant', definition: '픽스쳐 상단에 육각형이 돌출된 클래식 연결 방식.' },
  { slug: 'internal-hex', term: '내부 육각 연결', termEn: 'Internal Hex', category: 'implant', definition: '픽스쳐 내부에 육각형이 들어간 연결 방식.' },
  { slug: 'screw-retained', term: '나사 유지 보철', termEn: 'Screw-retained', category: 'prosthesis', definition: '임플란트 보철을 나사로 고정하는 방식.' },
  { slug: 'cement-retained', term: '시멘트 유지 보철', termEn: 'Cement-retained', category: 'prosthesis', definition: '임플란트 보철을 시멘트로 접착하는 방식.' },

  // 교정 심화
  { slug: 'clincheck', term: '클린체크', termEn: 'ClinCheck', category: 'orthodontics', definition: '인비절라인의 디지털 치료 계획 시뮬레이션.' },
  { slug: 'ortho-attachment', term: '교정 어태치먼트', termEn: 'Ortho Attachment', category: 'orthodontics', definition: '인비절라인용 치아 표면의 작은 레진 돌기.' },
  { slug: 'refinement', term: '리파인먼트', termEn: 'Refinement', category: 'orthodontics', definition: '인비절라인 치료 후반의 미세 조정 단계.' },
  { slug: 'ipr', term: 'IPR (치간 삭제)', termEn: 'Interproximal Reduction', category: 'orthodontics', definition: '치간 법랑질을 0.1~0.5mm 삭제해 공간을 확보하는 술식.' },
  { slug: 'distalization', term: '구치부 원심 이동', termEn: 'Molar Distalization', category: 'orthodontics', definition: '어금니를 뒤로 보내는 교정 이동.' },
  { slug: 'expansion', term: '악궁 확장', termEn: 'Arch Expansion', category: 'orthodontics', definition: '좁은 악궁을 옆으로 넓히는 교정.' },
  { slug: 'tad', term: 'TAD (교정용 미니스크류)', termEn: 'Temporary Anchorage Device', category: 'orthodontics', definition: '교정 고정원을 강화하는 임시 미니 스크류.' },
  { slug: 'lingual-braces', term: '설측 교정', termEn: 'Lingual Braces', category: 'orthodontics', definition: '치아 안쪽에 브라켓을 부착하는 교정.' },
  { slug: 'self-ligating', term: '자가 결찰 브라켓', termEn: 'Self-Ligating Bracket', category: 'orthodontics', definition: '결찰사 없이 와이어를 잡는 브라켓.' },
  { slug: 'ceramic-bracket', term: '세라믹 브라켓', termEn: 'Ceramic Bracket', category: 'orthodontics', definition: '투명/백색 세라믹 소재의 심미 브라켓.' },
  { slug: 'fixed-retainer', term: '고정식 유지장치', termEn: 'Fixed Retainer', category: 'orthodontics', definition: '앞니 뒤에 와이어를 접착한 고정식 리테이너.' },
  { slug: 'hawley-retainer', term: '홀리 리테이너', termEn: 'Hawley Retainer', category: 'orthodontics', definition: '고전적인 아크릴+와이어 유지장치.' },
  { slug: 'vivera-retainer', term: '비베라 리테이너', termEn: 'Vivera Retainer', category: 'orthodontics', definition: '인비절라인의 고품질 투명 유지장치.' },
  { slug: 'arch-wire', term: '아치와이어', termEn: 'Archwire', category: 'orthodontics', definition: '브라켓을 연결해 치아 이동을 유도하는 와이어.' },
  { slug: 'power-chain', term: '파워체인', termEn: 'Power Chain', category: 'orthodontics', definition: '공간을 줄이거나 치아를 묶는 연결형 고무.' },
  { slug: 'anchorage', term: '고정원', termEn: 'Anchorage', category: 'orthodontics', definition: '교정 치아 이동의 반대편 지지점.' },

  // 보철·심미 심화
  { slug: 'all-ceramic-crown', term: '올세라믹 크라운', termEn: 'All-Ceramic Crown', category: 'prosthesis', definition: '메탈 없이 세라믹으로만 제작한 크라운.' },
  { slug: 'pfm-crown', term: 'PFM 크라운', termEn: 'Porcelain-Fused-to-Metal', category: 'prosthesis', definition: '금속 내관에 세라믹을 구운 전통 크라운.' },
  { slug: 'monolithic-zirconia', term: '모놀리틱 지르코니아', termEn: 'Monolithic Zirconia', category: 'prosthesis', definition: '단일 블록으로 깎아 만든 풀 콘투어 지르코니아.' },
  { slug: 'layered-zirconia', term: '레이어드 지르코니아', termEn: 'Layered Zirconia', category: 'prosthesis', definition: '지르코니아에 포세린을 쌓아 심미를 높인 크라운.' },
  { slug: 'lithium-disilicate', term: '리튬 디실리케이트', termEn: 'Lithium Disilicate', category: 'material', definition: 'e.max의 주성분, 심미와 강도가 균형잡힌 재료.' },
  { slug: 'feldspathic-porcelain', term: '펠드스파 포세린', termEn: 'Feldspathic Porcelain', category: 'material', definition: '최고 심미의 전통 포세린 재료.' },
  { slug: 'cerec', term: '세렉', termEn: 'CEREC', category: 'device', definition: '원데이 세라믹 크라운 제작 CAD/CAM 시스템.' },
  { slug: 'trios', term: '트리오스', termEn: 'TRIOS', category: 'device', definition: '3shape의 디지털 구강 스캐너.' },
  { slug: 'itero', term: '아이테로', termEn: 'iTero', category: 'device', definition: '인비절라인 전용 디지털 구강 스캐너.' },
  { slug: 'primescan', term: '프라임스캔', termEn: 'Primescan', category: 'device', definition: '덴츠플라이의 고정밀 구강 스캐너.' },
  { slug: 'digital-impression', term: '디지털 인상', termEn: 'Digital Impression', category: 'procedure', definition: '구강 스캐너로 실리콘 인상을 대체하는 기법.' },
  { slug: 'digital-workflow', term: '디지털 워크플로우', termEn: 'Digital Workflow', category: 'procedure', definition: '스캐너·CAD·밀링을 통합한 디지털 치과 프로세스.' },
  { slug: 'rubber-dam', term: '러버댐', termEn: 'Rubber Dam', category: 'device', definition: '치료 부위를 격리하는 고무 방습막.' },
  { slug: 'prepless-veneer', term: '무삭제 라미네이트', termEn: 'Prepless Veneer', category: 'esthetic', definition: '치아를 깎지 않고 붙이는 얇은 라미네이트.' },
  { slug: 'composite-veneer', term: '레진 라미네이트', termEn: 'Composite Veneer', category: 'esthetic', definition: '레진을 한 층씩 쌓아 만드는 직접 라미네이트.' },
  { slug: 'try-in-paste', term: '트라이 인 페이스트', termEn: 'Try-in Paste', category: 'esthetic', definition: '라미네이트 접착 전 색상 확인용 페이스트.' },
  { slug: 'wax-up', term: '왁스업', termEn: 'Wax-up', category: 'procedure', definition: '치아 모양을 왁스로 먼저 만들어 보는 과정.' },
  { slug: 'mockup', term: '목업', termEn: 'Mock-up', category: 'procedure', definition: '최종 보철 모양을 환자 입에서 미리 확인하는 시뮬레이션.' },

  // 신경치료 심화
  { slug: 'pulp-cap-direct', term: '직접 치수 복조', termEn: 'Direct Pulp Cap', category: 'endodontics', definition: '노출된 치수를 MTA 등으로 덮어 보존하는 처치.' },
  { slug: 'pulp-cap-indirect', term: '간접 치수 복조', termEn: 'Indirect Pulp Cap', category: 'endodontics', definition: '치수 근접 시 일부 우식을 남기고 보호재로 덮는 처치.' },
  { slug: 'pulpotomy', term: '치수절단술', termEn: 'Pulpotomy', category: 'endodontics', definition: '치관부 치수만 제거하고 근관부 치수는 보존하는 치료.' },
  { slug: 'apexification', term: '치근단 형성술', termEn: 'Apexification', category: 'endodontics', definition: '미성숙 영구치의 뿌리 끝을 유도 폐쇄하는 치료.' },
  { slug: 'apicoectomy', term: '치근단 절제술', termEn: 'Apicoectomy', category: 'surgery', definition: '뿌리 끝 병변을 외과적으로 제거하는 수술.' },
  { slug: 'gutta-percha', term: '거타퍼챠', termEn: 'Gutta-percha', category: 'material', definition: '신경치료 후 근관을 채우는 천연 고무 재료.' },
  { slug: 'ni-ti-file', term: '니티 파일', termEn: 'Ni-Ti File', category: 'device', definition: '유연한 니켈티타늄 근관 확대 파일.' },
  { slug: 'mta', term: 'MTA', termEn: 'Mineral Trioxide Aggregate', category: 'material', definition: '신경치료·치수 복조용 생체 활성 재료.' },
  { slug: 'biodentine', term: '바이오덴틴', termEn: 'Biodentine', category: 'material', definition: 'MTA의 대안으로 사용되는 생체 활성 재료.' },
  { slug: 'perforation', term: '천공', termEn: 'Perforation', category: 'endodontics', definition: '근관 준비 중 치근 측면에 구멍이 나는 실수.' },
  { slug: 'pulp-vitality-test', term: '치수 생활력 검사', termEn: 'Pulp Vitality Test', category: 'procedure', definition: '치수가 살아있는지 확인하는 검사.' },

  // 치주 심화
  { slug: 'laser-periodontal', term: '레이저 치주치료', termEn: 'Laser Periodontal Therapy', category: 'periodontics', definition: '레이저로 치주낭 내 세균을 제거하는 보조 치료.' },
  { slug: 'osseous-surgery', term: '골성형 수술', termEn: 'Osseous Surgery', category: 'periodontics', definition: '울퉁불퉁한 치조골을 다듬는 치주 수술.' },
  { slug: 'gingival-graft', term: '치은 이식술', termEn: 'Gingival Graft', category: 'periodontics', definition: '얇은 잇몸을 두껍게 하는 이식 수술.' },
  { slug: 'connective-tissue-graft', term: '결합조직 이식', termEn: 'CTG', category: 'periodontics', definition: '잇몸 내부 결합조직을 이식하는 심미 치주 수술.' },
  { slug: 'crown-lengthening', term: '치관 연장술', termEn: 'Crown Lengthening', category: 'periodontics', definition: '잇몸/뼈를 조정해 치관을 노출시키는 수술.' },
  { slug: 'gum-depigmentation', term: '잇몸 색소 제거', termEn: 'Gum Depigmentation', category: 'esthetic', definition: '거무스름한 잇몸 색소를 제거하는 심미 치료.' },
  { slug: 'gtr', term: 'GTR (치조골 유도 재생)', termEn: 'Guided Tissue Regeneration', category: 'periodontics', definition: '차단막을 이용해 치주 조직 재생을 유도하는 기법.' },
  { slug: 'gbr', term: 'GBR (골유도재생술)', termEn: 'Guided Bone Regeneration', category: 'surgery', definition: '차폐막과 골이식재로 뼈를 재생시키는 기법.' },
  { slug: 'emd', term: 'EMD (법랑질 기질 유도체)', termEn: 'Enamel Matrix Derivative', category: 'periodontics', definition: '치주 재생을 돕는 에멜로제닌 기반 재료.' },

  // 장비·재료 추가
  { slug: 'curing-light', term: '광중합기', termEn: 'Curing Light', category: 'device', definition: '복합레진·본딩제를 경화시키는 블루라이트.' },
  { slug: 'electric-handpiece', term: '전동 핸드피스', termEn: 'Electric Handpiece', category: 'device', definition: '전기 모터로 작동하는 고토크 핸드피스.' },
  { slug: 'air-abrasion', term: '에어 어브레이션', termEn: 'Air Abrasion', category: 'device', definition: '압축 공기로 미세 입자를 분사해 치아를 삭제하는 장비.' },
  { slug: 'diagnodent', term: '다이아그노덴트', termEn: 'DIAGNOdent', category: 'device', definition: '레이저 형광으로 초기 우식을 진단하는 장비.' },
  { slug: 'intraoral-camera', term: '구내 카메라', termEn: 'Intraoral Camera', category: 'device', definition: '입안을 촬영해 환자에게 보여주는 소형 카메라.' },
  { slug: 'panoramic-xray', term: '파노라마 엑스레이', termEn: 'Panoramic X-ray', category: 'device', definition: '구강 전체를 한 장으로 촬영하는 엑스레이.' },
  { slug: 'cephalometric', term: '세팔로 분석', termEn: 'Cephalometric Analysis', category: 'procedure', definition: '측면 두부 엑스레이로 교정을 분석하는 방법.' },
  { slug: 'bitewing', term: '바이트윙 엑스레이', termEn: 'Bitewing', category: 'device', definition: '어금니 인접면 우식 진단용 엑스레이.' },
  { slug: 'periapical-xray', term: '치근단 엑스레이', termEn: 'Periapical X-ray', category: 'device', definition: '개별 치아와 뿌리 주변 촬영용 엑스레이.' },
  { slug: 'composite-resin', term: '복합레진', termEn: 'Composite Resin', category: 'material', definition: '광중합형 심미 충전 재료.' },
  { slug: 'glass-ionomer', term: '글래스 아이오노머', termEn: 'Glass Ionomer', category: 'material', definition: '불소 방출 기능을 갖춘 치과 충전 재료.' },
  { slug: 'resin-cement', term: '레진 시멘트', termEn: 'Resin Cement', category: 'material', definition: '세라믹 크라운·라미네이트 접착용 고강도 시멘트.' },
  { slug: 'alginate', term: '알지네이트', termEn: 'Alginate', category: 'material', definition: '기본 인상재, 모형 제작에 사용.' },
  { slug: 'pvs', term: 'PVS 인상재', termEn: 'Polyvinyl Siloxane', category: 'material', definition: '정밀 인상재로 가장 많이 쓰이는 실리콘 계열.' },

  // 마취·진정 심화
  { slug: 'lidocaine', term: '리도카인', termEn: 'Lidocaine', category: 'material', definition: '가장 흔한 국소 마취제 성분.' },
  { slug: 'articaine', term: '아티카인', termEn: 'Articaine', category: 'material', definition: '침투력이 좋은 국소 마취제.' },
  { slug: 'epinephrine', term: '에피네프린', termEn: 'Epinephrine', category: 'material', definition: '국소 마취제에 첨가되는 혈관 수축제.' },
  { slug: 'infiltration-anesthesia', term: '침윤 마취', termEn: 'Infiltration Anesthesia', category: 'procedure', definition: '치아 주변에 주사하는 국소 마취.' },
  { slug: 'nerve-block', term: '전달 마취', termEn: 'Nerve Block', category: 'procedure', definition: '큰 신경 줄기를 차단하는 마취.' },
  { slug: 'iv-sedation', term: '정맥 진정법', termEn: 'IV Sedation', category: 'procedure', definition: '정맥 약물로 깊게 진정시키는 방법.' },
  { slug: 'nitrous-oxide', term: '아산화질소 진정', termEn: 'Nitrous Oxide Sedation', category: 'procedure', definition: '웃음가스 흡입으로 가볍게 이완시키는 진정.' },

  // 예방·위생 심화
  { slug: 'proxabrush', term: '치간 칫솔', termEn: 'Proxabrush', category: 'prevention', definition: '치아 사이 청소용 작은 칫솔.' },
  { slug: 'water-flosser', term: '워터픽', termEn: 'Water Flosser', category: 'prevention', definition: '물 분사로 치아 사이를 청소하는 기기.' },
  { slug: 'electric-toothbrush', term: '전동 칫솔', termEn: 'Electric Toothbrush', category: 'prevention', definition: '진동·회전으로 청소 효율을 높인 칫솔.' },
  { slug: 'sonic-toothbrush', term: '음파 칫솔', termEn: 'Sonic Toothbrush', category: 'prevention', definition: '고주파 진동의 음파식 칫솔.' },
  { slug: 'chlorhexidine', term: '클로르헥시딘', termEn: 'Chlorhexidine', category: 'material', definition: '강력한 항균 성분이 든 의료용 가글.' },
  { slug: 'fluoride-varnish', term: '불소 바니쉬', termEn: 'Fluoride Varnish', category: 'prevention', definition: '치아에 발라 불소를 서서히 방출하는 고농도 제제.' },
  { slug: 'xylitol', term: '자일리톨', termEn: 'Xylitol', category: 'prevention', definition: '충치균 활동을 억제하는 천연 감미료.' },
  { slug: 'tongue-scraper', term: '혀 클리너', termEn: 'Tongue Scraper', category: 'prevention', definition: '혀 표면의 설태를 제거하는 도구.' },

  // 소아치과 심화
  { slug: 'space-maintainer', term: '공간 유지 장치', termEn: 'Space Maintainer', category: 'pediatric', definition: '조기 탈락된 유치 자리를 유지해주는 장치.' },
  { slug: 'tell-show-do', term: '텔·쇼·두 기법', termEn: 'Tell-Show-Do', category: 'pediatric', definition: '소아 치료 시 설명→시연→시술의 순차 접근.' },
  { slug: 'thumb-sucking', term: '손가락 빨기', termEn: 'Thumb Sucking', category: 'pediatric', definition: '장기간 지속되면 교합 이상을 초래하는 소아 습관.' },
  { slug: 'tongue-thrust', term: '혀 내밀기 습관', termEn: 'Tongue Thrust', category: 'pediatric', definition: '삼킴 시 혀를 내미는 습관, 개방교합 유발.' },
  { slug: 'ssc-crown', term: '유치 기성 크라운', termEn: 'Stainless Steel Crown', category: 'pediatric', definition: '유치용 기성 크라운 (흔히 은색).' },
  { slug: 'zirconia-peds-crown', term: '소아 지르코니아 크라운', termEn: 'Pediatric Zirconia Crown', category: 'pediatric', definition: '유치용 심미 지르코니아 기성 크라운.' },

  // TMJ 심화
  { slug: 'bruxism', term: '이갈이', termEn: 'Bruxism', category: 'pathology', definition: '수면 중 치아를 갈거나 악무는 습관.' },
  { slug: 'clenching', term: '이악물기', termEn: 'Clenching', category: 'pathology', definition: '치아를 강하게 악무는 습관.' },
  { slug: 'tmd', term: '측두하악장애', termEn: 'TMD', category: 'pathology', definition: '턱관절·저작근의 통증·기능장애 증후군.' },
  { slug: 'disc-displacement', term: '관절원판 변위', termEn: 'Disc Displacement', category: 'pathology', definition: '턱관절 디스크가 정상 위치를 벗어난 상태.' },
  { slug: 'splint-therapy', term: '스플린트 치료', termEn: 'Splint Therapy', category: 'procedure', definition: '턱관절·이갈이용 맞춤 교합장치 치료.' },
  { slug: 'botox-tmj', term: '턱관절 보톡스', termEn: 'Botox for TMJ', category: 'procedure', definition: '교근에 보톡스를 주입해 이갈이·사각턱 완화.' },
  { slug: 'occlusal-adjustment', term: '교합 조정', termEn: 'Occlusal Adjustment', category: 'procedure', definition: '교합 고점을 다듬어 안정화시키는 처치.' },

  // 심미·화이트닝 심화
  { slug: 'zoom-whitening', term: '줌 화이트닝', termEn: 'Zoom Whitening', category: 'esthetic', definition: 'Philips의 대표적 사무실 미백 시스템.' },
  { slug: 'opalescence', term: '오팔레센스', termEn: 'Opalescence', category: 'esthetic', definition: '홈 미백용 대표 브랜드 시스템.' },
  { slug: 'home-bleaching-tray', term: '홈 미백 트레이', termEn: 'Home Bleaching Tray', category: 'esthetic', definition: '개인 맞춤 제작 홈 미백용 트레이.' },
  { slug: 'enamel-microabrasion', term: '법랑질 미세 연마', termEn: 'Enamel Microabrasion', category: 'esthetic', definition: '법랑질 표면을 얇게 연마해 변색을 제거.' },
  { slug: 'icon-resin', term: '아이콘 레진 침투', termEn: 'Icon Resin Infiltration', category: 'esthetic', definition: '초기 우식·변색을 레진으로 침투시켜 심미 개선.' },

  // 디지털·신기술
  { slug: 'dental-3d-printing', term: '3D 프린팅 치과', termEn: 'Dental 3D Printing', category: 'device', definition: '서지컬 가이드·모델·임시 보철을 3D 프린팅으로 제작.' },
  { slug: 'face-scan', term: '페이스 스캔', termEn: 'Face Scan', category: 'device', definition: '얼굴을 3D 스캔해 스마일 디자인에 활용.' },
  { slug: 'virtual-articulator', term: '가상 교합기', termEn: 'Virtual Articulator', category: 'device', definition: '디지털상에서 턱 운동을 재현하는 교합기.' },
  { slug: 'ai-diagnosis', term: 'AI 진단 보조', termEn: 'AI Diagnostic Support', category: 'device', definition: '인공지능이 엑스레이 판독을 보조하는 시스템.' },
  { slug: 'dsd', term: '디지털 스마일 디자인', termEn: 'Digital Smile Design', category: 'esthetic', definition: '사진과 소프트웨어로 미소를 디지털 설계하는 기법.' },

  // 기타 질환/개념
  { slug: 'dry-mouth', term: '구강건조증', termEn: 'Xerostomia', category: 'pathology', definition: '침 분비 감소로 입이 마르는 증상.' },
  { slug: 'halitosis', term: '구취', termEn: 'Halitosis', category: 'pathology', definition: '입에서 나는 불쾌한 냄새.' },
  { slug: 'burning-mouth', term: '구강작열감 증후군', termEn: 'Burning Mouth Syndrome', category: 'pathology', definition: '특별한 병변 없이 입안이 화끈거리는 증상.' },
  { slug: 'trigeminal-neuralgia', term: '삼차신경통', termEn: 'Trigeminal Neuralgia', category: 'pathology', definition: '삼차신경에 발작적 극심한 통증이 생기는 질환.' },
  { slug: 'atypical-odontalgia', term: '비정형 치통', termEn: 'Atypical Odontalgia', category: 'pathology', definition: '명확한 원인 없이 생기는 만성 치통.' },
  { slug: 'sleep-apnea-oral', term: '수면무호흡 구강장치', termEn: 'Oral Appliance for OSA', category: 'device', definition: '코골이·수면무호흡 완화용 맞춤 구강 장치.' },
  { slug: 'ankyloglossia', term: '설소대 단축증', termEn: 'Ankyloglossia', category: 'pathology', definition: '설소대가 짧아 혀 운동이 제한되는 상태.' },
  { slug: 'cleft-lip-palate', term: '구순구개열', termEn: 'Cleft Lip and Palate', category: 'pathology', definition: '선천성 입술·입천장 갈라짐.' },
  { slug: 'mesiodens', term: '정중과잉치', termEn: 'Mesiodens', category: 'pathology', definition: '앞니 사이에 나는 대표적 과잉치.' },
  { slug: 'supernumerary', term: '과잉치', termEn: 'Supernumerary Tooth', category: 'pathology', definition: '정상 개수보다 추가로 난 치아.' },
  { slug: 'hyperdontia', term: '치아 과잉증', termEn: 'Hyperdontia', category: 'pathology', definition: '정상보다 많은 치아를 가진 상태.' },
  { slug: 'hypodontia', term: '치아 결손증', termEn: 'Hypodontia', category: 'pathology', definition: '정상보다 적은 치아를 가진 상태.' },
  { slug: 'fluorosis', term: '반점치(치아불소증)', termEn: 'Fluorosis', category: 'pathology', definition: '과다 불소 섭취로 생기는 법랑질 반점.' },
  { slug: 'tetracycline-teeth', term: '테트라사이클린 치아', termEn: 'Tetracycline Teeth', category: 'pathology', definition: '항생제로 인한 영구적 치아 변색.' },
  { slug: 'enamel-hypoplasia', term: '법랑질 형성부전', termEn: 'Enamel Hypoplasia', category: 'pathology', definition: '법랑질이 덜 형성되어 치아가 얇고 약한 상태.' },
  { slug: 'dental-trauma', term: '치아 외상', termEn: 'Dental Trauma', category: 'pathology', definition: '외부 충격으로 치아·잇몸·뼈에 생기는 손상.' },
  { slug: 'reimplantation', term: '재식립', termEn: 'Tooth Reimplantation', category: 'procedure', definition: '탈구된 치아를 다시 소켓에 심는 처치.' },
  { slug: 'ameloblastoma', term: '에나멜모세포종', termEn: 'Ameloblastoma', category: 'pathology', definition: '턱뼈에 생기는 양성 종양.' },
  { slug: 'odontoma', term: '치아종', termEn: 'Odontoma', category: 'pathology', definition: '치아 조직으로 이루어진 양성 종양.' },
  { slug: 'torus', term: '토러스(외골증)', termEn: 'Torus', category: 'anatomy', definition: '입천장·턱 안쪽에 자라는 정상 뼈 돌출.' },

  // 상악동·골이식
  { slug: 'sinus-membrane', term: '상악동 점막', termEn: 'Schneiderian Membrane', category: 'anatomy', definition: '상악동 내부를 덮는 얇은 점막.' },
  { slug: 'lateral-window', term: '측방 접근 상악동거상술', termEn: 'Lateral Window Sinus Lift', category: 'surgery', definition: '상악동을 측면으로 열어 접근하는 거상술.' },
  { slug: 'crestal-approach', term: '치조정 접근 상악동거상술', termEn: 'Crestal Approach Sinus Lift', category: 'surgery', definition: '임플란트 자리에서 위로 밀어 올리는 거상술.' },
  { slug: 'osteotome', term: '오스테오톰', termEn: 'Osteotome', category: 'device', definition: '뼈를 압축해 밀어 올리는 치조정 접근용 기구.' },
  { slug: 'piezoelectric-surgery', term: '초음파 골수술', termEn: 'Piezoelectric Surgery', category: 'procedure', definition: '초음파 진동으로 뼈만 정밀 절개하는 수술 기법.' },
  { slug: 'mectron', term: '멕트론', termEn: 'Mectron', category: 'device', definition: '세계적으로 유명한 초음파 치과 장비 브랜드 (부평우리치과 10대 보유).' },

  // 보험·행정·개념
  { slug: 'informed-consent', term: '치료 동의서', termEn: 'Informed Consent', category: 'other', definition: '치료 전 위험·대안을 설명하고 동의받는 문서.' },
  { slug: 'medical-record', term: '진료기록부', termEn: 'Medical Record', category: 'other', definition: '법적으로 보관 의무가 있는 진료 기록.' },
  { slug: 'dental-chart', term: '치식도', termEn: 'Dental Chart', category: 'other', definition: '치아별 상태를 기록한 차트.' },
  { slug: 'perio-chart', term: '치주 차트', termEn: 'Periodontal Chart', category: 'periodontics', definition: '치주낭 깊이·출혈 등 치주 상태 기록 차트.' },
  { slug: 'tooth-numbering-fdi', term: '치식 표기(FDI)', termEn: 'FDI Tooth Numbering', category: 'anatomy', definition: '치아를 번호로 표기하는 국제 규격.' },
  { slug: 'universal-numbering', term: '유니버설 치식', termEn: 'Universal Numbering', category: 'anatomy', definition: '미국식 치아 번호 표기 방식.' },
  { slug: 'nhi-coverage', term: '건강보험 적용', termEn: 'NHI Coverage', category: 'other', definition: '국민건강보험 급여 대상 치과 진료.' },
  { slug: 'non-covered', term: '비급여 진료', termEn: 'Non-covered', category: 'other', definition: '건강보험 적용 외, 환자 전액 부담 진료.' },
  { slug: 'medical-expense-deduction', term: '의료비 공제', termEn: 'Medical Tax Deduction', category: 'other', definition: '연말정산 시 치과 진료비 세액공제 제도.' },
  { slug: 'dental-hygienist', term: '치과위생사', termEn: 'Dental Hygienist', category: 'other', definition: '스케일링·예방·보조 진료를 담당하는 전문가.' },
  { slug: 'dental-technician', term: '치기공사', termEn: 'Dental Technician', category: 'other', definition: '보철·교정 장치를 제작하는 전문가.' },
  { slug: 'dds-dmd', term: '치과의사 자격(DDS/DMD)', termEn: 'DDS / DMD', category: 'other', definition: '치과의사의 학위 표기 (Doctor of Dental Surgery / Medicine).' },

  // 연구·근거
  { slug: 'evidence-based-dentistry', term: '근거 중심 치과학', termEn: 'Evidence-Based Dentistry', category: 'other', definition: '과학적 근거에 기반한 진료 철학.' },
  { slug: 'rct-study', term: '무작위 대조 시험', termEn: 'Randomized Controlled Trial', category: 'other', definition: '최고 수준의 임상 연구 설계.' },
  { slug: 'meta-analysis', term: '메타 분석', termEn: 'Meta-Analysis', category: 'other', definition: '여러 연구를 통합 분석한 체계적 문헌 고찰.' },
  { slug: 'minimally-invasive', term: '최소 침습 진료', termEn: 'Minimally Invasive Dentistry', category: 'procedure', definition: '건전 치질을 최대한 보존하는 진료 철학.' },
  { slug: 'biomimetic', term: '바이오미메틱', termEn: 'Biomimetic Dentistry', category: 'procedure', definition: '자연치 구조를 그대로 재현하려는 접근.' },

  // 예후·리스크
  { slug: 'success-rate', term: '성공률', termEn: 'Success Rate', category: 'other', definition: '치료가 기능적·심미적으로 성공한 비율.' },
  { slug: 'survival-rate', term: '생존율', termEn: 'Survival Rate', category: 'other', definition: '임플란트가 구강 내에 유지되고 있는 비율.' },
  { slug: 'marginal-bone-loss', term: '변연 골소실', termEn: 'Marginal Bone Loss', category: 'implant', definition: '임플란트 주변 연간 뼈 손실 정도.' },
]

// 자동 생성을 SEED와 합쳐서 최종 목록 구성
export const GLOSSARY: GlossaryTerm[] = (() => {
  const all: GlossaryTerm[] = [...SEEDS]
  const existing = new Set(SEEDS.map((s) => s.slug))
  const merge = (source: AutoTerm[]) => {
    for (const a of source) {
      if (!existing.has(a.slug)) {
        all.push({
          slug: a.slug,
          term: a.term,
          termEn: a.termEn,
          category: a.category,
          definition: a.definition,
          relatedTerms: a.relatedTerms,
          relatedTreatments: a.relatedTreatments,
        })
        existing.add(a.slug)
      }
    }
  }
  merge(AUTO)
  merge(EXTRA_AUTO)

  // 레거시 호환 alias 필드 주입 (short, treatments, related)
  for (const t of all) {
    if (t.short === undefined) t.short = t.definition
    if (t.treatments === undefined && t.relatedTreatments) t.treatments = t.relatedTreatments
    if (t.related === undefined && t.relatedTerms) t.related = t.relatedTerms
  }

  return all
})()

export const getGlossary = (slug: string) => GLOSSARY.find((g) => g.slug === slug)
export const glossaryByCategory = (cat: GlossaryCategory) => GLOSSARY.filter((g) => g.category === cat)
export const glossaryCount = GLOSSARY.length

// 레거시 호환: getGlossaryByCategory (alias)
export const getGlossaryByCategory = glossaryByCategory

// 한글 초성 분류 (ㄱ, ㄴ, ㄷ...)
const INITIAL_CONSONANTS = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
]
export function getInitial(term: string): string {
  const ch = term.charCodeAt(0)
  if (ch >= 0xac00 && ch <= 0xd7a3) {
    const idx = Math.floor((ch - 0xac00) / 588)
    return INITIAL_CONSONANTS[idx] || '기타'
  }
  return '기타'
}

export { INITIAL_CONSONANTS }

// ============================================================
// Aliases for page compatibility
// ============================================================
const LEGACY_CATEGORY_ICONS: Record<GlossaryCategory, string> = {
  anatomy: 'fa-tooth',
  implant: 'fa-screwdriver-wrench',
  prosthesis: 'fa-crown',
  orthodontics: 'fa-align-justify',
  surgery: 'fa-scissors',
  endodontics: 'fa-bug',
  periodontics: 'fa-leaf',
  prevention: 'fa-shield-halved',
  pediatric: 'fa-child',
  esthetic: 'fa-star',
  material: 'fa-vials',
  device: 'fa-cube',
  procedure: 'fa-stethoscope',
  pathology: 'fa-triangle-exclamation',
  other: 'fa-circle-info',
}

export const GLOSSARY_CATEGORIES = CATEGORIES.map((c) => ({
  slug: c.key,
  label: c.label,
  name: c.label, // alias for pages
  description: c.description,
  icon: LEGACY_CATEGORY_ICONS[c.key] ?? 'fa-circle-info',
}))

export const getGlossaryTerm = getGlossary

export function getRelatedTerms(term: GlossaryTerm, limit = 6): GlossaryTerm[] {
  const out: GlossaryTerm[] = []
  const seen = new Set<string>([term.slug])
  // 1) explicit related
  for (const s of term.relatedTerms ?? []) {
    const t = GLOSSARY.find((g) => g.slug === s)
    if (t && !seen.has(t.slug)) { out.push(t); seen.add(t.slug) }
    if (out.length >= limit) return out
  }
  // 2) same category
  for (const t of GLOSSARY) {
    if (t.category === term.category && !seen.has(t.slug)) {
      out.push(t); seen.add(t.slug)
    }
    if (out.length >= limit) return out
  }
  return out
}
