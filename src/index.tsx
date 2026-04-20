import { Hono } from 'hono'
import { HomePage } from './pages/home'
import { MissionPage } from './pages/mission'
import { PlaceholderPage } from './pages/placeholder'

const app = new Hono()

// ============================================================
// Routes
// ============================================================

// Home
app.get('/', (c) => c.html(<HomePage />))

// Mission
app.get('/mission', (c) => c.html(<MissionPage />))

// Doctors (placeholder — Phase 2)
app.get('/doctors', (c) =>
  c.html(<PlaceholderPage title="의료진 소개" phase="Phase 2" description="부평우리치과의 6명 의료진을 만나보세요." />)
)
app.get('/doctors/:slug', (c) =>
  c.html(<PlaceholderPage title="원장 상세 프로필" phase="Phase 2" />)
)

// Treatments (placeholder — Phase 2)
app.get('/treatments', (c) =>
  c.html(<PlaceholderPage title="진료과목 안내" phase="Phase 2" description="임플란트·심미보철·교정 외 전체 진료과목." />)
)
app.get('/treatments/:slug', (c) =>
  c.html(<PlaceholderPage title="진료 상세 안내" phase="Phase 2" />)
)

// Auth (Phase 3)
app.get('/signup', (c) => c.html(<PlaceholderPage title="회원가입" phase="Phase 3" />))
app.get('/login', (c) => c.html(<PlaceholderPage title="로그인" phase="Phase 3" />))

// Admin (Phase 3)
app.get('/admin', (c) => c.html(<PlaceholderPage title="관리자" phase="Phase 3" />))

// Before/After (Phase 4)
app.get('/before-after', (c) =>
  c.html(<PlaceholderPage title="비포애프터" phase="Phase 4" description="실제 환자분들의 전후 사례." />)
)

// Blog (Phase 5)
app.get('/blog', (c) => c.html(<PlaceholderPage title="블로그" phase="Phase 5" />))
app.get('/blog/:slug', (c) => c.html(<PlaceholderPage title="블로그 글" phase="Phase 5" />))

// Notices (Phase 5)
app.get('/notices', (c) => c.html(<PlaceholderPage title="공지사항" phase="Phase 5" />))

// Glossary (Phase 6)
app.get('/glossary', (c) =>
  c.html(<PlaceholderPage title="치과 백과사전" phase="Phase 6" description="500+ 치과 용어 사전." />)
)
app.get('/glossary/:slug', (c) => c.html(<PlaceholderPage title="용어 상세" phase="Phase 6" />))

// FAQ (Phase 6)
app.get('/faq', (c) => c.html(<PlaceholderPage title="자주 묻는 질문" phase="Phase 6" />))

// Visit (Phase 7)
app.get('/visit', (c) => c.html(<PlaceholderPage title="내원 안내" phase="Phase 7" description="오시는 길·진료 시간·수가 안내." />))

// 404
app.notFound((c) =>
  c.html(
    <PlaceholderPage
      title="페이지를 찾을 수 없습니다"
      phase="404"
      description="주소를 다시 확인해 주세요."
    />,
    404
  )
)

export default app
