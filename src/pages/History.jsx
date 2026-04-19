import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function History() {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('vectorscan_history') || '[]')
    setHistory(data)
  }, [])

  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter(item => item.diseaseId === filter)

  const formatTime = (isoString) => {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString()
  }

  const handleClear = () => {
    localStorage.removeItem('vectorscan_history')
    setHistory([])
  }

  return (
    <div className="page">
      <div className="nav-header">
        <button className="nav-back" onClick={() => navigate('/')}>←</button>
        <span className="nav-title">Scan History</span>
      </div>

      {history.length > 0 && (
        <>
          <div className="filter-bar">
            {['all', 'malaria', 'dengue'].map(f => (
              <button 
                key={f}
                className={`filter-chip ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="section-label">
            {filteredHistory.length} scan{filteredHistory.length !== 1 ? 's' : ''}
          </div>

          <div className="history-list">
            {filteredHistory.map(item => (
              <div key={item.id} className="card history-item">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt="RDT scan" 
                    className="history-thumb" 
                  />
                )}
                <div className="history-info">
                  <div className="history-disease">{item.disease}</div>
                  <div className="history-meta">
                    <span>{formatTime(item.timestamp)}</span>
                    <span>•</span>
                    <span>{item.confidence}% conf.</span>
                  </div>
                </div>
                <span className={`history-result ${item.result.toLowerCase()}`}>
                  {item.result}
                </span>
              </div>
            ))}
          </div>

          <button 
            className="btn btn-secondary btn-full"
            onClick={handleClear}
            style={{ marginTop: 'var(--space-xl)' }}
          >
            Clear History
          </button>
        </>
      )}

      {history.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <p className="empty-text">No scans yet</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/select')}
          >
            Start First Scan
          </button>
        </div>
      )}
    </div>
  )
}
