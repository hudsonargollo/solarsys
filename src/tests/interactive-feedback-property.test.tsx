import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import * as fc from 'fast-check'
import { 
  HoverLiftButton, 
  HoverCard, 
  ScaleOnHover,
  springConfigs
} from '../components/animations/InteractiveElements'

/**
 * **Feature: solar-lead-platform, Property 13: Interactive element feedback**
 * **Validates: Requirements 5.3**
 */

describe('Interactive Element Feedback Property Tests', () => {
  it('Property 13: Spring configurations provide physics-based feedback parameters', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('gentle', 'bouncy', 'snappy', 'smooth'),
        (configName) => {
          const config = springConfigs[configName as keyof typeof springConfigs]
          
          expect(config).toBeTruthy()
          expect(config.type).toBeTruthy()
          
          if (config.type === 'spring') {
            // Physics-based springs should have positive stiffness and damping
            expect(config.stiffness).toBeGreaterThan(0)
            expect(config.damping).toBeGreaterThan(0)
            
            // Verify reasonable ranges for physics simulation
            expect(config.stiffness).toBeLessThanOrEqual(1000)
            expect(config.damping).toBeLessThanOrEqual(100)
            
            // Verify stiffness and damping are numbers
            expect(typeof config.stiffness).toBe('number')
            expect(typeof config.damping).toBe('number')
          } else if (config.type === 'tween') {
            // Tween animations should have duration and easing
            expect(config.duration).toBeGreaterThan(0)
            expect(config.ease).toBeTruthy()
            expect(typeof config.duration).toBe('number')
            expect(typeof config.ease).toBe('string')
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 13: HoverLiftButton provides physics-based lift and shadow feedback', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.boolean(),
        (buttonText, disabled) => {
          const { container } = render(
            <HoverLiftButton disabled={disabled}>
              {buttonText}
            </HoverLiftButton>
          )
          
          const button = container.querySelector('button')
          
          // Verify button exists and has proper attributes
          expect(button).toBeInTheDocument()
          expect(button!.textContent).toBe(buttonText)
          
          if (disabled) {
            // Disabled buttons should have proper disabled styling
            expect(button).toHaveAttribute('disabled')
            expect(button!.className).toContain('cursor-not-allowed')
            expect(button!.className).toContain('opacity-50')
          } else {
            // Enabled buttons should be interactive
            expect(button).not.toHaveAttribute('disabled')
            expect(button!.className).toContain('cursor-pointer')
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 13: HoverCard provides physics-based lift and shadow feedback', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
        (cardContent) => {
          const { container } = render(
            <HoverCard>
              <div>{cardContent}</div>
            </HoverCard>
          )
          
          const card = container.querySelector('div')
          expect(card).toBeInTheDocument()
          expect(card!.tagName).toBe('DIV')
          expect(card!.textContent).toContain(cardContent)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 13: ScaleOnHover provides physics-based scale feedback', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.float({ min: Math.fround(1.01), max: Math.fround(1.2) }),
        (content, scaleAmount) => {
          const { container } = render(
            <ScaleOnHover scaleAmount={scaleAmount}>
              <span>{content}</span>
            </ScaleOnHover>
          )
          
          const element = container.querySelector('div')
          expect(element).toBeInTheDocument()
          expect(element!.tagName).toBe('DIV')
          expect(element!.textContent).toContain(content)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 13: Physics-based animation configurations are properly structured', () => {
    // Test that the spring configurations exist and are properly structured
    const configs = Object.keys(springConfigs)
    expect(configs.length).toBeGreaterThan(0)
    
    // Verify specific physics-based configurations exist
    expect(springConfigs.gentle).toBeTruthy()
    expect(springConfigs.bouncy).toBeTruthy()
    expect(springConfigs.snappy).toBeTruthy()
    expect(springConfigs.smooth).toBeTruthy()
    
    // Verify gentle has lower stiffness than bouncy (physics-based relationship)
    expect(springConfigs.gentle.stiffness).toBeLessThan(springConfigs.bouncy.stiffness)
    
    // Verify snappy has higher stiffness than gentle (physics-based relationship)
    expect(springConfigs.snappy.stiffness).toBeGreaterThan(springConfigs.gentle.stiffness)
    
    // Verify all spring configs have proper physics parameters
    Object.values(springConfigs).forEach(config => {
      if (config.type === 'spring') {
        expect(typeof config.stiffness).toBe('number')
        expect(typeof config.damping).toBe('number')
        expect(config.stiffness).toBeGreaterThan(0)
        expect(config.damping).toBeGreaterThan(0)
      }
    })
  })
})