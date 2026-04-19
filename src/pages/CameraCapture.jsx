import { useNavigate } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'

export default function CameraCapture({ disease, onCapture }) {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Redirect if no disease selected
    if (!disease) {
      navigate('/select')
      return
    }

    startCamera()

    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
          setCameraReady(true)
        }
      }
    } catch (err) {
      console.error('Camera error:', err)
      setError('Unable to access camera. Please grant camera permissions and try again.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    
    const imageData = canvas.toDataURL('image/jpeg', 0.85)
    onCapture(imageData)
    stopCamera()
    navigate('/result')
  }

  // Demo mode: use a placeholder image when camera isn't available
  const handleDemoCapture = () => {
    // Create a synthetic RDT strip image using canvas
    const canvas = document.createElement('canvas')
    canvas.width = 640
    canvas.height = 320
    const ctx = canvas.getContext('2d')

    // Background
    ctx.fillStyle = '#f5f0e8'
    ctx.fillRect(0, 0, 640, 320)

    // Strip body
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(120, 40, 400, 240)
    ctx.strokeStyle = '#cccccc'
    ctx.lineWidth = 2
    ctx.strokeRect(120, 40, 400, 240)

    // Test window
    ctx.fillStyle = '#fafafa'
    ctx.fillRect(200, 80, 240, 160)
    ctx.strokeStyle = '#999999'
    ctx.lineWidth = 1
    ctx.strokeRect(200, 80, 240, 160)

    // C line (control)
    ctx.fillStyle = '#c44569'
    ctx.fillRect(220, 110, 200, 4)

    // T line (test) - faint line
    ctx.fillStyle = 'rgba(196, 69, 105, 0.5)'
    ctx.fillRect(220, 170, 200, 3)

    // Labels
    ctx.fillStyle = '#666666'
    ctx.font = '14px Inter, sans-serif'
    ctx.fillText('C', 180, 115)
    ctx.fillText('T', 180, 175)
    ctx.fillText('S', 160, 260)

    const imageData = canvas.toDataURL('image/jpeg', 0.85)
    onCapture(imageData)
    navigate('/result')
  }

  if (error) {
    return (
      <div className="page">
        <div className="nav-header">
          <button className="nav-back" onClick={() => navigate('/select')}>←</button>
          <span className="nav-title">Camera</span>
        </div>
        <div className="analyzing-screen">
          <div style={{ fontSize: '48px' }}>📷</div>
          <p className="analyzing-text">Camera Unavailable</p>
          <p className="analyzing-subtext">{error}</p>
          <button 
            className="btn btn-primary btn-lg"
            onClick={handleDemoCapture}
            style={{ marginTop: '16px' }}
          >
            🧪 Use Demo Image
          </button>
          <button 
            className="btn btn-secondary"
            onClick={startCamera}
            style={{ marginTop: '8px' }}
          >
            Retry Camera
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page" style={{ padding: '12px' }}>
      <div className="nav-header" style={{ padding: '0 12px' }}>
        <button className="nav-back" onClick={() => { stopCamera(); navigate('/select'); }}>
          ←
        </button>
        <span className="nav-title">
          Scan {disease?.name} RDT
        </span>
      </div>

      <div className="camera-container">
        <div className="viewfinder">
          <video ref={videoRef} playsInline muted />
          <canvas ref={canvasRef} />
          {cameraReady && (
            <div className="viewfinder-overlay">
              <div className="viewfinder-guide">
                <div className="corner-tr"></div>
                <div className="corner-bl"></div>
                <div className="corner-br"></div>
              </div>
            </div>
          )}
        </div>

        <div className="capture-controls">
          <button 
            id="capture-btn"
            className="capture-btn" 
            onClick={handleCapture}
            disabled={!cameraReady}
            aria-label="Capture photo"
          />
        </div>
      </div>
    </div>
  )
}
