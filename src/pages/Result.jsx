import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Simulated AI analysis — returns realistic results
function simulateAnalysis(disease) {
  const isPositive = Math.random() > 0.4 // 60% positive for demo impact
  const confidence = isPositive 
    ? Math.floor(85 + Math.random() * 13)  // 85-97%
    : Math.floor(88 + Math.random() * 10)  // 88-97%
  
  const results = {
    malaria: {
      positive: {
        label: 'Positive — P. falciparum detected',
        details: 'Test line (Pf) and control line (C) detected',
      },
      negative: {
        label: 'Negative — No parasite detected',
        details: 'Only control line (C) detected',
      }
    },
    dengue: {
      positive: {
        label: 'Positive — NS1 Antigen detected',
        details: 'NS1 band and control line (C) detected',
      },
      negative: {
        label: 'Negative — No antigen detected',
        details: 'Only control line (C) detected',
      }
    }
  }

  const diseaseId = disease?.id || 'malaria'
  const resultData = results[diseaseId] || results.malaria
  const outcome = isPositive ? resultData.positive : resultData.negative

  return {
    result: isPositive ? 'Positive' : 'Negative',
    confidence,
    label: outcome.label,
    details: outcome.details,
    lineIntensity: isPositive ? 'Strong' : 'N/A',
    controlLine: 'Valid',
  }
}

export default function Result({ scanData, onReset }) {
  const navigate = useNavigate()
  const [analyzing, setAnalyzing] = useState(true)
  const [analysis, setAnalysis] = useState(null)
  const [location, setLocation] = useState(null)

  useEffect(() => {
    if (!scanData?.image) {
      navigate('/select')
      return
    }

    // Get location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude.toFixed(4),
            lng: pos.coords.longitude.toFixed(4),
          })
        },
        () => {
          setLocation({ lat: '—', lng: '—' })
        }
      )
    }

    // Simulate AI processing delay
    const timer = setTimeout(() => {
      const result = simulateAnalysis(scanData.disease)
      setAnalysis(result)
      setAnalyzing(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  const handleSave = () => {
    // Save to localStorage
    const history = JSON.parse(localStorage.getItem('vectorscan_history') || '[]')
    const entry = {
      id: Date.now(),
      disease: scanData.disease?.name || 'Unknown',
      diseaseId: scanData.disease?.id || 'unknown',
      result: analysis.result,
      confidence: analysis.confidence,
      timestamp: new Date().toISOString(),
      location,
      image: scanData.image,
    }
    history.unshift(entry)
    localStorage.setItem('vectorscan_history', JSON.stringify(history))
    
    onReset()
    navigate('/')
  }

  const handleNewScan = () => {
    // Save first, then start new
    const history = JSON.parse(localStorage.getItem('vectorscan_history') || '[]')
    const entry = {
      id: Date.now(),
      disease: scanData.disease?.name || 'Unknown',
      diseaseId: scanData.disease?.id || 'unknown',
      result: analysis.result,
      confidence: analysis.confidence,
      timestamp: new Date().toISOString(),
      location,
      image: scanData.image,
    }
    history.unshift(entry)
    localStorage.setItem('vectorscan_history', JSON.stringify(history))
    
    onReset()
    navigate('/select')
  }

  if (analyzing) {
    return (
      <div className="page">
        <div className="analyzing-screen">
          <div className="analyzing-spinner"></div>
          <p className="analyzing-text">Analyzing RDT Strip...</p>
          <p className="analyzing-subtext">
            AI is reading test lines for {scanData?.disease?.name || 'the selected disease'}
          </p>
        </div>
      </div>
    )
  }

  const isPositive = analysis.result === 'Positive'
  const confidenceColor = analysis.confidence >= 90 
    ? 'var(--positive)' 
    : analysis.confidence >= 75 
      ? 'var(--warning)' 
      : 'var(--negative)'

  // SVG ring calculations
  const radius = 48
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (analysis.confidence / 100) * circumference

  const timestamp = new Date().toLocaleString()

  return (
    <div className="page">
      <div className="nav-header">
        <button className="nav-back" onClick={() => navigate('/')}>←</button>
        <span className="nav-title">Results</span>
      </div>

      {scanData.image && (
        <img 
          src={scanData.image} 
          alt="Captured RDT strip" 
          className="result-image" 
        />
      )}

      <div className="card result-card">
        <div className="result-status">
          {isPositive ? '⚠️' : '✅'}
        </div>
        <div className={`result-label ${isPositive ? 'positive' : 'negative'}`}>
          {analysis.result}
        </div>
        <div className="result-disease">
          {analysis.label}
        </div>

        {/* Confidence Ring */}
        <div className="confidence-ring">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle className="ring-bg" cx="60" cy="60" r={radius} />
            <circle 
              className="ring-fill" 
              cx="60" cy="60" r={radius}
              stroke={confidenceColor}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <span className="confidence-value" style={{ color: confidenceColor }}>
            {analysis.confidence}%
          </span>
        </div>
        <div className="confidence-label">AI Confidence Score</div>
      </div>

      <div className="result-details">
        <div className="detail-item">
          <div className="detail-icon">🧪</div>
          <div className="detail-label">Control Line</div>
          <div className="detail-value">{analysis.controlLine}</div>
        </div>
        <div className="detail-item">
          <div className="detail-icon">📊</div>
          <div className="detail-label">Line Intensity</div>
          <div className="detail-value">{analysis.lineIntensity}</div>
        </div>
        <div className="detail-item">
          <div className="detail-icon">📍</div>
          <div className="detail-label">Location</div>
          <div className="detail-value">
            {location ? `${location.lat}, ${location.lng}` : 'Loading...'}
          </div>
        </div>
        <div className="detail-item">
          <div className="detail-icon">🕐</div>
          <div className="detail-label">Timestamp</div>
          <div className="detail-value" style={{ fontSize: '11px' }}>
            {timestamp}
          </div>
        </div>
      </div>

      <div className="result-actions">
        <button 
          id="save-new-scan-btn"
          className="btn btn-primary btn-full" 
          onClick={handleNewScan}
        >
          <span className="btn-icon">📷</span>
          Save & New Scan
        </button>
        <button 
          id="save-done-btn"
          className="btn btn-secondary btn-full" 
          onClick={handleSave}
        >
          <span className="btn-icon">✓</span>
          Save & Done
        </button>
      </div>
    </div>
  )
}
