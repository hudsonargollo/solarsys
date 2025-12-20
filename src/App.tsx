import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { initializeUTMTracking } from './lib/utm'
import { performanceMonitor, prefetchCriticalResources } from './lib/performance'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LazyPainel, LazyPageWrapper } from './components/LazyComponents'
import HomeSimple from './pages/HomeSimple'
import SimuladorSimple from './pages/SimuladorSimple'
import ResultadoSimple from './pages/ResultadoSimple'

function App() {
  useEffect(() => {
    // Initialize UTM tracking on app startup
    initializeUTMTracking()
    
    // Prefetch critical resources
    prefetchCriticalResources()
    
    // Start performance monitoring
    performanceMonitor.logMetrics()
    
    // Cleanup on unmount
    return () => {
      performanceMonitor.cleanup()
    }
  }, [])

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<HomeSimple />} />
          <Route path="/simulador" element={<SimuladorSimple />} />
          <Route path="/resultado" element={<ResultadoSimple />} />
          <Route 
            path="/painel" 
            element={
              <LazyPageWrapper>
                <LazyPainel />
              </LazyPageWrapper>
            } 
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
