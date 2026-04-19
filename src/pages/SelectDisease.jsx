import { useNavigate } from 'react-router-dom'

const tests = [
  { id: 'malaria', name: 'Malaria', type: 'P. falciparum / P. vivax lateral flow', tag: 'Pf/Pv', ok: true },
  { id: 'dengue', name: 'Dengue', type: 'NS1 Antigen / IgM / IgG lateral flow', tag: 'NS1', ok: true },
  { id: 'zika', name: 'Zika', type: 'IgM / IgG antibody lateral flow', tag: '—', ok: false },
  { id: 'chikungunya', name: 'Chikungunya', type: 'IgM rapid immunoassay', tag: '—', ok: false },
]

export default function SelectDisease({ onSelect }) {
  const navigate = useNavigate()

  const pick = (t) => {
    if (!t.ok) return
    onSelect(t)
    navigate('/scan')
  }

  return (
    <div className="page select-page">
      <div className="topbar">
        <button className="topbar-back" onClick={() => navigate('/')}>← Back</button>
        <span className="topbar-title">Select Test</span>
        <span className="topbar-right"></span>
      </div>

      <div className="spacer-sm"></div>
      <p className="select-instruction">
        Which RDT are you reading?
      </p>
      <div className="spacer-md"></div>

      <div className="test-list">
        {tests.map(t => (
          <div
            key={t.id}
            id={`disease-${t.id}`}
            className={`test-row ${!t.ok ? 'disabled' : ''}`}
            onClick={() => pick(t)}
          >
            <div className="test-row-left">
              <div className="test-row-name">{t.name}</div>
              <div className="test-row-type">{t.type}</div>
            </div>
            <span className="test-row-tag">{t.ok ? t.tag : 'Unavailable'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
