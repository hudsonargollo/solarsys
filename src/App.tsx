import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LazyPainel, LazyPageWrapper } from './components/LazyComponents'
import HomeSimple from './pages/HomeSimple'
import SimuladorSimple from './pages/SimuladorSimple'
import ResultadoSimple from './pages/ResultadoSimple'

function App() {
  console.log('App component rendering...')
  
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
