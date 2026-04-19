import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  const scans = JSON.parse(localStorage.getItem('vectorscan_history') || '[]')

  return (
    <div className="page landing">
      {/* Nav */}
      <div className="landing-nav">
        <span className="landing-logo">VectorScan</span>
        <span className="landing-link" onClick={() => navigate('/history')}>
          History{scans.length > 0 ? ` (${scans.length})` : ''}
        </span>
      </div>

      {/* Hero */}
      <div className="hero">
        <h1 className="hero-headline">
          AI-assisted reading for rapid diagnostic tests
        </h1>
        <p className="hero-sub">
          Capture an RDT strip with your phone. Get a standardized, confidence-scored result in seconds.
        </p>
        <div className="hero-cta">
          <button
            id="start-scan-btn"
            className="btn btn-dark"
            onClick={() => navigate('/select')}
          >
            Scan Test →
          </button>
        </div>
      </div>

      {/* Stat */}
      <div className="stat-section">
        <div className="stat-number">
          20<span className="stat-unit">%</span>
        </div>
        <p className="stat-caption">
          of rapid diagnostic tests are misread by visual inspection alone. Faint lines, poor lighting, and reader fatigue lead to incorrect results.
        </p>
      </div>

      <div className="divider"></div>

      {/* Features */}
      <div className="spacer-md"></div>
      <div className="container">
        <div className="t-label">What it does</div>
      </div>
      <div className="spacer-sm"></div>
      <div className="features-section">
        <div className="feature-item">
          <div className="feature-title">Detect faint lines</div>
          <div className="feature-desc">
            AI identifies test and control lines that are difficult to see in low contrast conditions.
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-title">Flag invalid tests</div>
          <div className="feature-desc">
            Automatically identifies missing control lines or degraded strips that produce unreliable results.
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-title">Standardize interpretation</div>
          <div className="feature-desc">
            Removes subjectivity from visual reading. Every test gets the same objective analysis.
          </div>
        </div>
      </div>

      <div className="spacer-lg"></div>
      <div className="divider"></div>

      {/* Workflow */}
      <div className="spacer-md"></div>
      <div className="container">
        <div className="t-label">How it works</div>
      </div>
      <div className="spacer-sm"></div>
      <div className="workflow-section">
        <div className="workflow-step">
          <span className="workflow-num">01</span>
          <div>
            <div className="workflow-text">Select disease</div>
            <div className="workflow-sub">Malaria, Dengue, or other supported RDT</div>
          </div>
        </div>
        <div className="workflow-step">
          <span className="workflow-num">02</span>
          <div>
            <div className="workflow-text">Capture image</div>
            <div className="workflow-sub">Photograph the test strip with your phone</div>
          </div>
        </div>
        <div className="workflow-step">
          <span className="workflow-num">03</span>
          <div>
            <div className="workflow-text">Get result</div>
            <div className="workflow-sub">AI returns positive, negative, or invalid with confidence score</div>
          </div>
        </div>
      </div>

      <div className="spacer-lg"></div>
      <div className="divider"></div>

      {/* Bottom CTA */}
      <div className="bottom-cta">
        <p className="bottom-cta-text">
          {scans.length > 0
            ? `${scans.length} test${scans.length !== 1 ? 's' : ''} analyzed`
            : 'Ready to scan your first test'
          }
        </p>
        <button className="btn btn-dark btn-full" onClick={() => navigate('/select')}>
          Scan Test →
        </button>
      </div>
    </div>
  )
}
