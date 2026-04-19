import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Home from './pages/Home'
import SelectDisease from './pages/SelectDisease'
import CameraCapture from './pages/CameraCapture'
import Result from './pages/Result'
import History from './pages/History'

export default function App() {
  const [scanData, setScanData] = useState({
    disease: null,
    image: null,
    result: null
  })

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/select" 
          element={
            <SelectDisease 
              onSelect={(disease) => setScanData(prev => ({ ...prev, disease }))} 
            />
          } 
        />
        <Route 
          path="/scan" 
          element={
            <CameraCapture 
              disease={scanData.disease}
              onCapture={(image) => setScanData(prev => ({ ...prev, image }))} 
            />
          } 
        />
        <Route 
          path="/result" 
          element={
            <Result 
              scanData={scanData}
              onReset={() => setScanData({ disease: null, image: null, result: null })} 
            />
          } 
        />
        <Route path="/history" element={<History />} />
      </Routes>
    </div>
  )
}
