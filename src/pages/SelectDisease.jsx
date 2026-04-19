import { useNavigate } from 'react-router-dom'

const diseases = [
  {
    id: 'malaria',
    name: 'Malaria',
    icon: '🦟',
    description: 'Pf/Pv RDT',
    available: true,
  },
  {
    id: 'dengue',
    name: 'Dengue',
    icon: '🔴',
    description: 'NS1/IgM/IgG RDT',
    available: true,
  },
  {
    id: 'zika',
    name: 'Zika',
    icon: '🧬',
    description: 'IgM/IgG RDT',
    available: false,
  },
  {
    id: 'chikungunya',
    name: 'Chikungunya',
    icon: '🔥',
    description: 'IgM RDT',
    available: false,
  },
]

export default function SelectDisease({ onSelect }) {
  const navigate = useNavigate()

  const handleSelect = (disease) => {
    if (!disease.available) return
    onSelect(disease)
    navigate('/scan')
  }

  return (
    <div className="page">
      <div className="nav-header">
        <button className="nav-back" onClick={() => navigate('/')}>
          ←
        </button>
        <span className="nav-title">Select RDT Type</span>
      </div>

      <p className="page-subtitle">
        What disease is the rapid diagnostic test designed to detect?
      </p>

      <div className="section-label">Available</div>
      <div className="disease-grid">
        {diseases.filter(d => d.available).map(disease => (
          <div
            key={disease.id}
            id={`disease-${disease.id}`}
            className="card card-interactive disease-card"
            data-disease={disease.id}
            onClick={() => handleSelect(disease)}
          >
            <span className="disease-icon">{disease.icon}</span>
            <span className="disease-name">{disease.name}</span>
            <span className="disease-badge">{disease.description}</span>
          </div>
        ))}
      </div>

      <div className="section-label" style={{ marginTop: 'var(--space-xl)' }}>
        Coming Soon
      </div>
      <div className="disease-grid">
        {diseases.filter(d => !d.available).map(disease => (
          <div
            key={disease.id}
            id={`disease-${disease.id}`}
            className="card card-disabled disease-card"
            data-disease={disease.id}
          >
            <span className="disease-icon">{disease.icon}</span>
            <span className="disease-name">{disease.name}</span>
            <span className="disease-badge coming-soon">Coming Soon</span>
          </div>
        ))}
      </div>
    </div>
  )
}
