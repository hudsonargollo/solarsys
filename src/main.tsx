import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('main.tsx loading...')

// Remove initial loading indicator
const initialLoading = document.getElementById('initial-loading')
if (initialLoading) {
  console.log('Removing initial loading indicator')
  initialLoading.remove()
}

const rootElement = document.getElementById('root')
console.log('Root element:', rootElement)

if (rootElement) {
  console.log('Creating React root...')
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  console.log('React app rendered')
} else {
  console.error('Root element not found!')
}
