import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  // Get scan count from localStorage
  const scans = JSON.parse(localStorage.getItem('vectorscan_history') || '[]')

  return (
    <div className="page">
      <div className="home-hero">
        <div className="hero-icon">🔬</div>
        <h1 className="hero-title">VectorScan</h1>
        <p className="hero-tagline">
          One phone. One photo. Two seconds.<br />
          AI-powered RDT diagnostics.
        </p>
        <div className="home-stats">
          <div className="stat-item">
            <div className="stat-value">{scans.length}</div>
            <div className="stat-label">Scans</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">2s</div>
            <div className="stat-label">Per Test</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">96%</div>
            <div className="stat-label">Accuracy</div>
          </div>
        </div>
      </div>

      <div className="home-actions">
        <button 
          id="start-scan-btn"
          className="btn btn-primary btn-lg btn-full pulse-ring"
          onClick={() => navigate('/select')}
        >
          <span className="btn-icon">📷</span>
          Start Scan
        </button>
        <button 
          id="view-history-btn"
          className="btn btn-secondary btn-lg btn-full"
          onClick={() => navigate('/history')}
        >
          <span className="btn-icon">📋</span>
          Scan History
        </button>
      </div>
    </div>
  )
}
