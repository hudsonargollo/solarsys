import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerServiceWorker, performanceMonitor } from './lib/performance'
import { featureFlags } from './lib/config'

// Register service worker for caching
if (featureFlags.enableServiceWorker) {
  registerServiceWorker()
}

// Start performance monitoring
if (featureFlags.enablePerformanceMonitoring) {
  // Monitor performance metrics
  setTimeout(() => {
    performanceMonitor.logMetrics()
    performanceMonitor.sendMetrics()
  }, 2000)
}

// Remove initial loading indicator
const initialLoading = document.getElementById('initial-loading')
if (initialLoading) {
  initialLoading.remove()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
