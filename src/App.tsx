import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { initializeUTMTracking } from './lib/utm'
import { performanceMonitor, prefetchCriticalResources } from './lib/performance'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LazyPainel, LazyResultado, LazyPageWrapper } from './components/LazyComponents'
import Home from './pages/Home'
import Simulador from './pages/Simulador'

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
          <Route path="/" element={<Home />} />
          <Route path="/simulador" element={<Simulador />} />
          <Route 
            path="/resultado" 
            element={
              <LazyPageWrapper>
                <LazyResultado />
              </LazyPageWrapper>
            } 
          />
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
