import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function History() {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem('vectorscan_history') || '[]'))
  }, [])

  const list = filter === 'all' ? history : history.filter(i => i.diseaseId === filter)

  const fmt = (iso) => {
    const d = Date.now() - new Date(iso).getTime()
    const m = Math.floor(d / 60000)
    if (m < 1) return 'Just now'
    if (m < 60) return `${m}m ago`
    const h = Math.floor(d / 3600000)
    if (h < 24) return `${h}h ago`
    return new Date(iso).toLocaleDateString()
  }

  return (
    <div className="page">
      <div className="topbar">
        <button className="topbar-back" onClick={() => navigate('/')}>← Back</button>
        <span className="topbar-title">History</span>
        <span className="topbar-right">{list.length} record{list.length !== 1 ? 's' : ''}</span>
      </div>

      {history.length > 0 && (
        <>
          <div className="filter-row">
            {['all', 'malaria', 'dengue'].map(f => (
              <button key={f} className={`f-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="history-list">
            {list.map(item => (
              <div key={item.id} className="h-row">
                {item.image && <img src={item.image} alt="" className="h-thumb" />}
                <div className="h-info">
                  <div className="h-disease">{item.disease}</div>
                  <div className="h-meta">{fmt(item.timestamp)} · {item.confidence}%</div>
                </div>
                <span className={`h-tag ${item.result.toLowerCase()}`}>{item.result}</span>
              </div>
            ))}
          </div>

          <div style={{ padding: '24px' }}>
            <button className="btn btn-outline btn-full btn-sm" onClick={() => { localStorage.removeItem('vectorscan_history'); setHistory([]) }}>
              Clear history
            </button>
          </div>
        </>
      )}

      {history.length === 0 && (
        <div className="empty">
          <p className="empty-text">No scans recorded</p>
          <button className="btn btn-dark btn-sm" onClick={() => navigate('/select')}>Scan Test →</button>
        </div>
      )}
    </div>
  )
}
