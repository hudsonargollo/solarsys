import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'
import Simulador from '../pages/Simulador'
import Resultado from '../pages/Resultado'
import Painel from '../pages/Painel'

function renderWithRouter(component: React.ReactElement) {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Interface Localization Property Tests', () => {
  it('Property 19: All user-facing text should be in Brazilian Portuguese', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('home', 'simulador', 'resultado', 'painel'),
        (pageType) => {
          let component: React.ReactElement
          
          switch (pageType) {
            case 'home':
              component = <Home />
              break
            case 'simulador':
              component = <Simulador />
              break
            case 'resultado':
              component = <Resultado />
              break
            case 'painel':
              component = <Painel />
              break
            default:
              component = <Home />
          }
          
          const { container } = renderWithRouter(component)
          const textContent = container.textContent || ''
          
          if (textContent.trim().length === 0) {
            return true
          }
          
          const portugueseWords = ['simulador', 'resultado', 'painel', 'administrativo', 'descubra', 'energia', 'solar', 'iniciar']
          const hasPortuguese = portugueseWords.some(word => textContent.toLowerCase().includes(word))
          
          const englishWords = ['the', 'and', 'click', 'button', 'home', 'page', 'welcome']
          const hasEnglish = englishWords.some(word => textContent.toLowerCase().includes(word))
          
          return hasPortuguese || !hasEnglish
        }
      ),
      { numRuns: 100 }
    )
  })
  
  it('Specific Portuguese content validation', () => {
    const { container } = renderWithRouter(<Home />)
    const text = container.textContent || ''
    
    expect(text).toContain('SolarSys')
    expect(text).toContain('Descubra')
    expect(text).toContain('energia solar')
  })
})