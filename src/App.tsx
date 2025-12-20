import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomeMinimal from './pages/HomeMinimal'
import SimuladorSimple from './pages/SimuladorSimple'
import ResultadoSimple from './pages/ResultadoSimple'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeMinimal />} />
        <Route path="/simulador" element={<SimuladorSimple />} />
        <Route path="/resultado" element={<ResultadoSimple />} />
      </Routes>
    </Router>
  )
}

export default App
