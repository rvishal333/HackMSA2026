import { useNavigate } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react'

export default function CameraCapture({ disease, onCapture }) {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!disease) { navigate('/select'); return }
    startCam()
    return () => stopCam()
  }, [])

  const startCam = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      streamRef.current = s
      if (videoRef.current) {
        videoRef.current.srcObject = s
        videoRef.current.onloadedmetadata = () => { videoRef.current.play(); setReady(true) }
      }
    } catch { setError(true) }
  }

  const stopCam = () => { streamRef.current?.getTracks().forEach(t => t.stop()); streamRef.current = null }

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return
    const v = videoRef.current, c = canvasRef.current
    c.width = v.videoWidth; c.height = v.videoHeight
    c.getContext('2d').drawImage(v, 0, 0)
    onCapture(c.toDataURL('image/jpeg', 0.85))
    stopCam(); navigate('/result')
  }

  const demo = () => {
    const c = document.createElement('canvas'); c.width = 640; c.height = 280
    const x = c.getContext('2d')
    x.fillStyle = '#f5f1ea'; x.fillRect(0, 0, 640, 280)
    x.fillStyle = '#fff'; x.fillRect(100, 30, 440, 220)
    x.strokeStyle = '#d1d5db'; x.lineWidth = 1; x.strokeRect(100, 30, 440, 220)
    x.fillStyle = '#fafaf9'; x.fillRect(180, 60, 280, 160); x.strokeRect(180, 60, 280, 160)
    x.fillStyle = '#c44569'; x.fillRect(200, 100, 240, 4)
    x.fillStyle = 'rgba(196,69,105,0.35)'; x.fillRect(200, 155, 240, 3)
    x.fillStyle = '#999'; x.font = '12px sans-serif'
    x.fillText('C', 168, 105); x.fillText('T', 168, 160)
    onCapture(c.toDataURL('image/jpeg', 0.85)); navigate('/result')
  }

  if (error) {
    return (
      <div className="page">
        <div className="topbar">
          <button className="topbar-back" onClick={() => navigate('/select')}>← Back</button>
          <span className="topbar-title">Capture</span>
          <span className="topbar-right"></span>
        </div>
        <div className="cam-fallback">
          <p className="t-large">Camera unavailable</p>
          <p className="t-body" style={{ textAlign: 'center' }}>
            Grant camera permission or use a demo image to test the flow.
          </p>
          <div className="spacer-sm"></div>
          <button className="btn btn-dark" onClick={demo}>Use Demo Image</button>
          <button className="btn btn-outline btn-sm" onClick={startCam} style={{ marginTop: 4 }}>Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page camera-page" style={{ padding: 0 }}>
      <button className="cam-back-btn" onClick={() => { stopCam(); navigate('/select') }}>← Back</button>
      <div className="cam-body">
        <div className="cam-finder">
          <video ref={videoRef} playsInline muted />
          <canvas ref={canvasRef} />
          {ready && (
            <div className="cam-overlay">
              <div className="cam-frame">
                <div className="c1"></div>
                <div className="c2"></div>
              </div>
              <p className="cam-label">Align {disease?.name} RDT strip within frame</p>
            </div>
          )}
        </div>
        <div className="cam-bar">
          <button id="capture-btn" className="cam-shutter" onClick={capture} disabled={!ready} aria-label="Capture" />
        </div>
      </div>
    </div>
  )
}
