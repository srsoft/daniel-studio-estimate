import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const categories = [
  { id: 'web', number: '01', label: '웹 개발', detail: '새로운 서비스 또는 웹 리뉴얼' },
  { id: 'app', number: '02', label: '앱 개발', detail: 'iOS, Android, 크로스플랫폼' },
  { id: 'maintenance', number: '03', label: '유지보수', detail: '운영 중인 서비스의 개선과 관리' },
  { id: 'infra', number: '04', label: '인프라', detail: '클라우드, 배포, 보안, 성능' },
  { id: 'ai', number: '05', label: 'AI 자동화', detail: '반복 업무를 더 영리하게' },
]

const timelines = [
  ['flexible', '협의 가능해요', '품질과 범위를 함께 조율'],
  ['fast', '가능한 빨리', '우선순위 높은 기능부터'],
  ['week', '일주일 이내', '빠른 진단과 작은 범위'],
  ['date', '원하는 날짜가 있어요', '목표일을 기준으로 설계'],
]

const categoryQuestions = {
  web: {
    kicker: 'WEB PROJECT / 범위 진단',
    title: '어떤 웹을 만들고 싶나요?',
    description: '서비스의 성격과 현재 준비 상태를 알려주세요.',
    questions: [
      { key: 'webType', label: '진행하려는 작업은 무엇인가요?', type: 'choice', options: ['신규 제작', '기존 서비스 리뉴얼', '기능 추가 및 개선'] },
      { key: 'webAudience', label: '주요 사용자는 누구인가요?', type: 'choice', options: ['일반 고객', '기업·내부 사용자', '관리자 중심', '아직 정하지 않았어요'] },
      { key: 'maturity', label: '현재 어디까지 준비되어 있나요?', type: 'choice', options: ['아이디어만 있음', '필요 내용이 정리되어 있음', '상세한 기획 문서 있음', '디자인까지 완료'] },
    ],
  },
  app: {
    kicker: 'APP PROJECT / 플랫폼 진단',
    title: '어떤 앱을 만들고 싶나요?',
    description: '앱의 형태와 꼭 필요한 기기 기능을 알려주세요.',
    questions: [
      { key: 'appType', label: '어떤 형태로 출시하고 싶나요?', type: 'choice', options: ['iOS + Android', 'iOS만', 'Android만', '크로스플랫폼'] },
      { key: 'appFeature', label: '사용할 기기 기능이 있나요?', type: 'choice', options: ['로그인·결제', '푸시 알림', '위치·지도', '카메라·파일', '특별한 기능 없음'] },
      { key: 'maturity', label: '현재 어디까지 준비되어 있나요?', type: 'choice', options: ['아이디어만 있음', '필요 내용이 정리되어 있음', '상세한 기획 문서 있음', '디자인까지 완료'] },
    ],
  },
  maintenance: {
    kicker: 'MAINTENANCE / 운영 진단',
    title: '무엇을 개선하고 싶나요?',
    description: '운영 중인 서비스의 상태와 필요한 대응 수준을 알려주세요.',
    questions: [
      { key: 'maintenanceTarget', label: '가장 먼저 해결할 문제는 무엇인가요?', type: 'choice', options: ['버그·장애', '기능 추가', '성능 개선', '디자인 개선', '정기 관리'] },
      { key: 'maintenanceStack', label: '현재 서비스 정보를 알고 있나요?', type: 'choice', options: ['소스와 기술을 알고 있어요', 'URL만 있어요', '일부만 파악했어요', '잘 모르겠어요'] },
      { key: 'maintenancePlan', label: '어떤 방식의 도움이 필요한가요?', type: 'choice', options: ['한 번 해결', '월 정기 유지보수', '긴급 대응 체계', '상담 후 결정'] },
    ],
  },
  infra: {
    kicker: 'INFRASTRUCTURE / 운영 환경 진단',
    title: '인프라에서 무엇이 필요하나요?',
    description: '현재 환경과 가장 큰 운영 과제를 알려주세요.',
    questions: [
      { key: 'infraWork', label: '어떤 작업을 계획하고 있나요?', type: 'choice', options: ['신규 구축', '클라우드 이전', '비용 최적화', '성능·장애 개선'] },
      { key: 'infraCloud', label: '선호하는 클라우드가 있나요?', type: 'choice', options: ['AWS', 'GCP', 'Azure', '아직 정하지 않았어요'] },
      { key: 'infraScale', label: '예상 서비스 규모는 어느 정도인가요?', type: 'choice', options: ['초기·소규모', '성장 중인 서비스', '트래픽이 큰 서비스', '규모를 모르겠어요'] },
    ],
  },
  ai: {
    kicker: 'AI AUTOMATION / 자동화 진단',
    title: '어떤 일을 자동화하고 싶나요?',
    description: '현재 반복되는 업무와 AI가 만들어낼 결과를 알려주세요.',
    questions: [
      { key: 'aiWork', label: '자동화하려는 업무는 무엇인가요?', type: 'choice', options: ['문서·메일 처리', '검색·요약·분류', '고객 응대', '데이터 입력·이동', '아직 구체적이지 않아요'] },
      { key: 'aiData', label: '업무 데이터는 어디에 있나요?', type: 'choice', options: ['사내 문서', '이메일·메신저', 'CRM·업무 도구', '여러 곳에 흩어져 있어요'] },
      { key: 'aiReview', label: 'AI 결과를 사람이 확인해야 하나요?', type: 'choice', options: ['항상 검토 필요', '중요한 건만 검토', '자동 처리하고 싶어요', '잘 모르겠어요'] },
    ],
  },
}

const initialForm = {
  category: 'web',
  webType: '신규 제작',
  webAudience: '일반 고객',
  maturity: '필요 내용이 정리되어 있음',
  team: '전문인력 없음',
  timeline: 'flexible',
  targetDate: '',
  summary: '',
  reference: '',
}

function App() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)
  const [estimate, setEstimate] = useState(null)

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const createEstimate = () => {
    const categoryFactor = { web: 1, app: 1.18, maintenance: 0.58, infra: 0.72, ai: 0.92 }[form.category]
    const maturityFactor = {
      '아이디어만 있음': 1.2,
      '필요 내용이 정리되어 있음': 1,
      '상세한 기획 문서 있음': 0.82,
      '레이아웃, 디자인 구성 완료되어 있음': 0.74,
    }[form.maturity] || 1
    const base = Math.round(720 * categoryFactor * maturityFactor)
    const min = Math.round(base * 0.82 / 10) * 10
    const max = Math.round(base * 1.28 / 10) * 10
    const weeks = Math.max(2, Math.round((base / 260) * 10) / 10)
    setEstimate({ min, max, weeks, category: categories.find((item) => item.id === form.category)?.label })
    setStep(3)
  }

  const reset = () => {
    setForm(initialForm)
    setEstimate(null)
    setStep(1)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" onClick={reset}>
          <span className="brand-mark">D</span>
          <span>다니엘스튜디오</span>
        </a>
        <div className="topbar-meta"><span className="status-dot" /> 지금 바로 진단 가능</div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">PROJECT ESTIMATE / 2026</p>
          <h1>막연한 아이디어를<br /><em>실행 가능한 숫자</em>로.</h1>
          <p className="hero-description">몇 가지 질문에 답하면 프로젝트의 예상 비용과 기간,<br className="desktop-break" /> 지금 먼저 만들어야 할 범위를 정리해 드립니다.</p>
          <div className="hero-note"><span>↳</span> 약 3분 · 회원가입 없이 시작</div>
        </div>
        <div className="hero-stamp" aria-hidden="true"><span>START<br />WITH<br /><strong>CLARITY</strong></span><i>✳</i></div>
      </section>

      <section className="workspace">
        <div className="progress-row">
          <div><span className={step >= 1 ? 'active' : ''}>01</span><label>프로젝트 선택</label></div>
          <div className="progress-line"><span style={{ width: step === 1 ? '0%' : '100%' }} /></div>
          <div><span className={step >= 2 ? 'active' : ''}>02</span><label>상세 내용</label></div>
          <div className="progress-line"><span style={{ width: step === 3 ? '100%' : '0%' }} /></div>
          <div><span className={step === 3 ? 'active' : ''}>03</span><label>예상 견적</label></div>
        </div>

        {step === 1 && <StepOne form={form} update={update} next={() => setStep(2)} />}
        {step === 2 && <StepTwo form={form} update={update} back={() => setStep(1)} submit={createEstimate} />}
        {step === 3 && <EstimateResult estimate={estimate} form={form} reset={reset} />}
      </section>

      <footer><span>© DANIEL STUDIO</span><span>초기 상담용 예상 견적 · VAT 별도</span></footer>
    </main>
  )
}

function StepOne({ form, update, next }) {
  const questions = categoryQuestions[form.category]
  return <div className="step-panel">
    <div className="section-heading"><span className="section-index">01 / 03</span><h2>어떤 프로젝트를<br />시작하려고 하나요?</h2><p>가장 가까운 항목을 골라주세요. 나중에 바꿀 수 있어요.</p></div>
    <div className="category-grid">
      {categories.map((item) => <button className={`category-card ${form.category === item.id ? 'selected' : ''}`} key={item.id} onClick={() => update('category', item.id)}>
        <span className="card-number">{item.number}</span><strong>{item.label}</strong><small>{item.detail}</small><span className="select-indicator">{form.category === item.id ? '선택됨' : '선택'}</span>
      </button>)}
    </div>
    <div className="dynamic-question-panel" key={form.category}>
      <div className="dynamic-heading"><span className="section-index">{questions.kicker}</span><h3>{questions.title}</h3><p>{questions.description}</p></div>
      <div className="question-list">{questions.questions.map((question) => <div className="question-block" key={question.key}><label className="form-label">{question.label}</label><div className="choice-row">{question.options.map((option) => <button key={option} className={form[question.key] === option ? 'chosen' : ''} onClick={() => update(question.key, option)}>{option}</button>)}</div></div>)}</div>
    </div>
    <div className="panel-action"><span>입력 내용은 견적 산출에만 사용됩니다.</span><button className="primary-button" onClick={next}>다음 단계 <b>→</b></button></div>
  </div>
}

function StepTwo({ form, update, back, submit }) {
  const questions = categoryQuestions[form.category]
  return <div className="step-panel">
    <div className="section-heading"><span className="section-index">02 / 03</span><h2>마지막 질문으로<br />범위를 좁혀볼게요.</h2><p><strong>{questions.kicker.split(' / ')[0]}</strong>에 이어 일정과 상세 내용을 확인합니다.</p></div>
    <div className="form-stack">
      <div className="form-block"><label className="form-label">현재 함께할 수 있는 인력이 있나요?</label><div className="choice-row">{['기획 인력', '디자인 인력', '개발 인력', '전문인력 없음'].map((item) => <button key={item} className={form.team === item ? 'chosen' : ''} onClick={() => update('team', item)}>{item}</button>)}</div></div>
      <div className="form-block"><label className="form-label">언제까지 시작하거나 완료하고 싶나요?</label><div className="timeline-grid">{timelines.map(([id, title, detail]) => <button key={id} className={form.timeline === id ? 'chosen' : ''} onClick={() => update('timeline', id)}><strong>{title}</strong><small>{detail}</small></button>)}</div>{form.timeline === 'date' && <input className="date-input" type="date" value={form.targetDate} onChange={(event) => update('targetDate', event.target.value)} />}</div>
      <div className="form-block"><label className="form-label" htmlFor="summary">만들고 싶은 내용을 자유롭게 적어주세요.</label><textarea id="summary" value={form.summary} onChange={(event) => update('summary', event.target.value)} placeholder="예: 예약을 받고 결제까지 가능한 반응형 웹사이트가 필요해요." /><label className="form-label secondary-label" htmlFor="reference">참고 서비스 URL <span>선택</span></label><input id="reference" value={form.reference} onChange={(event) => update('reference', event.target.value)} placeholder="https://" /></div>
    </div>
    <div className="panel-action"><button className="text-button" onClick={back}>← 이전</button><button className="primary-button" onClick={submit}>견적 확인하기 <b>→</b></button></div>
  </div>
}

function EstimateResult({ estimate, form, reset }) {
  const summary = form.summary || '핵심 기능을 중심으로 한 서비스 제작 프로젝트'
  const resultDetails = {
    web: { team: '기획 · 디자인 · 개발', assumption: '핵심 기능 5~7개, 반응형 웹 기준 · 외부 유료 서비스 및 운영 비용 제외' },
    app: { team: '기획 · UX/UI · 앱 개발', assumption: 'iOS·Android 기본 출시 기준 · 앱스토어 등록 및 외부 유료 서비스 비용 제외' },
    maintenance: { team: '현황 진단 · 개선 개발', assumption: '기존 소스와 운영 환경 확인 가능 기준 · 긴급 장애 대응 비용 제외' },
    infra: { team: '설계 · 구축 · 모니터링', assumption: '클라우드 초기 구축 기준 · 실제 사용량에 따른 월 운영 비용 제외' },
    ai: { team: '업무 분석 · AI 연동 · 검수', assumption: '자동화 대상 업무 1개 기준 · 모델 사용료와 데이터 정제 비용 제외' },
  }[form.category]
  return <div className="result-panel">
    <div className="result-intro"><div><span className="section-index">03 / 03 · ESTIMATE REPORT</span><h2>지금 단계에서<br /><em>이 정도를 예상해요.</em></h2><p>{summary}</p></div><button className="text-button" onClick={reset}>새 견적 시작 ↗</button></div>
    <div className="estimate-hero"><div><span>예상 프로젝트 비용</span><strong>{estimate.min.toLocaleString()}<small>만 원</small> — {estimate.max.toLocaleString()}<small>만 원</small></strong><p>VAT 별도 · {estimate.category} 기준 · 초기 상담용 예상 범위</p></div><div className="confidence"><span>ESTIMATE<br />CONFIDENCE</span><strong>MEDIUM</strong><i>입력 정보가 더해지면<br />범위가 좁아져요.</i></div></div>
    <div className="result-grid"><div className="result-block"><span className="result-label">예상 기간</span><strong>약 {estimate.weeks} — {Math.ceil(estimate.weeks * 1.45)}주</strong><div className="bar"><span style={{ width: '62%' }} /></div><small>기획 · 제작 · 검수 포함</small></div><div className="result-block"><span className="result-label">추천 시작점</span><strong>MVP 우선 진행</strong><small>가장 중요한 기능을 먼저 출시하고<br />사용자 반응을 확인하는 방식</small></div><div className="result-block"><span className="result-label">예상 구성</span><strong>{resultDetails.team}</strong><small>{form.team === '전문인력 없음' ? '전 과정의 파트너가 필요해요.' : `${form.team}을 중심으로 협업할 수 있어요.`}</small></div></div>
    <div className="assumption"><span>ⓘ</span><div><strong>이 견적에 포함된 가정</strong><p>{resultDetails.assumption} · 상세 요구사항 확인 후 최종 조정</p></div></div>
    <div className="result-actions"><button className="secondary-button" onClick={() => window.print()}>견적 리포트 인쇄</button><button className="primary-button" onClick={() => alert('상담 신청 기능은 다음 단계에서 연결됩니다.')}>전문가와 상담하기 <b>→</b></button></div>
    <p className="disclaimer">이 결과는 입력하신 정보를 바탕으로 생성된 초기 예상 견적입니다. 실제 계약 금액은 상세 상담과 요구사항 확정 후 달라질 수 있습니다.</p>
  </div>
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
