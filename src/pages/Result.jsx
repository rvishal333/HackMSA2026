import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { IconCheck } from '../components/Icons'

function simulate(disease) {
  const pos = Math.random() > 0.4
  const conf = pos ? Math.floor(85 + Math.random() * 13) : Math.floor(88 + Math.random() * 10)

  const d = {
    malaria: {
      pos: { label: 'Positive', interp: 'Pf antigen line detected alongside control line. Consistent with P. falciparum infection.', test: pos && Math.random() > 0.5 ? 'Faint' : 'Detected' },
      neg: { label: 'Negative', interp: 'Control line present. No Pf antigen line detected.', test: 'Not detected' },
    },
    dengue: {
      pos: { label: 'Positive', interp: 'NS1 band and control line detected. Consistent with acute dengue.', test: pos && Math.random() > 0.5 ? 'Faint' : 'Detected' },
      neg: { label: 'Negative', interp: 'Control line present. No NS1 band detected.', test: 'Not detected' },
    },
  }

  const dd = d[disease?.id] || d.malaria
  const o = pos ? dd.pos : dd.neg
  return { result: o.label, confidence: conf, interpretation: o.interp, control: 'Detected', test: o.test }
}

export default function Result({ scanData, onReset }) {
  const navigate = useNavigate()
  const [phase, setPhase] = useState('analyzing')
  const [data, setData] = useState(null)
  const [loc, setLoc] = useState(null)
  const [step, setStep] = useState(0)
  const [showConf, setShowConf] = useState(false)
  const saved = useRef(false)

  useEffect(() => {
    if (!scanData?.image) { navigate('/select'); return }
    navigator.geolocation?.getCurrentPosition(
      p => setLoc({ lat: p.coords.latitude.toFixed(4), lng: p.coords.longitude.toFixed(4) }),
      () => {}
    )
    const t = [
      setTimeout(() => setStep(1), 300),
      setTimeout(() => setStep(2), 1000),
      setTimeout(() => setStep(3), 1700),
      setTimeout(() => {
        setData(simulate(scanData.disease))
        setPhase('done')
        setTimeout(() => setShowConf(true), 200)
      }, 2400),
    ]
    return () => t.forEach(clearTimeout)
  }, [])

  const save = () => {
    if (saved.current || !data) return
    saved.current = true
    const h = JSON.parse(localStorage.getItem('vectorscan_history') || '[]')
    h.unshift({ id: Date.now(), disease: scanData.disease?.name, diseaseId: scanData.disease?.id, result: data.result, confidence: data.confidence, timestamp: new Date().toISOString(), location: loc, image: scanData.image })
    localStorage.setItem('vectorscan_history', JSON.stringify(h))
  }

  const newScan = () => { save(); onReset(); navigate('/select') }
  const done = () => { save(); onReset(); navigate('/') }

  if (phase === 'analyzing') {
    const steps = ['Detecting control line', 'Analyzing test region', 'Computing confidence']
    return (
      <div className="page">
        <div className="analyzing">
          <div className="analyze-spinner"></div>
          <p className="t-large">Processing</p>
          <p className="t-small">Analyzing {scanData?.disease?.name} RDT</p>
          <div className="analyze-steps">
            {steps.map((s, i) => (
              <div key={i} className={`a-step ${step > i + 1 ? 'done' : step >= i + 1 ? 'active' : ''}`}>
                <span className="a-step-dot"></span>
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const pos = data.result === 'Positive'
  const cl = data.confidence >= 90 ? 'high' : data.confidence >= 75 ? 'med' : 'low'
  const ts = new Date().toLocaleString()

  return (
    <div className="page result-page">
      <div className="topbar">
        <button className="topbar-back" onClick={done}>← Back</button>
        <span className="topbar-title">Result</span>
        <span className="topbar-right">{scanData.disease?.name}</span>
      </div>

      <div className="result-top">
        <div className={`result-badge ${pos ? 'positive' : 'negative'}`}>
          {data.result}
        </div>
        <div className="result-type">{scanData.disease?.name} — Lateral flow immunoassay</div>
      </div>

      <div className="result-sections">
        {/* Image */}
        {scanData.image && (
          <div className="r-section">
            <div className="r-section-title">Captured Image</div>
            <img src={scanData.image} alt="RDT" className="r-image" />
          </div>
        )}

        {/* Confidence */}
        <div className="r-section">
          <div className="r-section-title">Confidence</div>
          <div className={`r-confidence ${cl}`}>{showConf ? data.confidence : 0}%</div>
          <div className="r-bar">
            <div className={`r-bar-fill ${cl}`} style={{ width: showConf ? `${data.confidence}%` : '0' }} />
          </div>
        </div>

        {/* Line Detection */}
        <div className="r-section">
          <div className="r-section-title">Line Detection</div>
          <div className="r-row">
            <span className="r-label">Control line (C)</span>
            <span className="r-value green">{data.control}</span>
          </div>
          <div className="r-row">
            <span className="r-label">Test line (T)</span>
            <span className={`r-value ${data.test === 'Not detected' ? 'muted' : 'red'}`}>
              {data.test}
            </span>
          </div>
        </div>

        {/* Interpretation */}
        <div className="r-section">
          <div className="r-section-title">Interpretation</div>
          <p className="r-interpretation">{data.interpretation}</p>
        </div>

        {/* Meta */}
        <div className="r-section">
          <div className="r-section-title">Metadata</div>
          <div className="r-meta">
            <div className="r-meta-item">
              <div className="r-meta-label">Location</div>
              <div className="r-meta-value">{loc ? `${loc.lat}, ${loc.lng}` : 'Unavailable'}</div>
            </div>
            <div className="r-meta-item">
              <div className="r-meta-label">Timestamp</div>
              <div className="r-meta-value">{ts}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="result-actions">
        <button className="btn btn-dark btn-full" onClick={newScan}>New Scan →</button>
        <button className="btn btn-outline btn-full" onClick={done}>Done</button>
      </div>
    </div>
  )
}
