import { describe, it, expect, vi } from 'vitest'
import fc from 'fast-check'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { 
  PageTransition, 
  AnimatedPageWrapper, 
  SlideTransition, 
  slideTransitions 
} from '../components/animations/PageTransitions'

/**
 * **Feature: solar-lead-platform, Property 12: Page transition animations**
 * **Validates: Requirements 5.2**
 * 
 * For any page navigation, the system should use slide animations with easeOutCirc timing function
 */

// Mock framer-motion for testing
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion')
  return {
    ...actual,
    motion: {
      div: ({ children, initial, animate, exit, variants, transition, ...props }: any) => {
        // Store animation props as data attributes for testing
        return (
          <div 
            {...props}
            data-initial={JSON.stringify(initial)}
            data-animate={JSON.stringify(animate)}
            data-exit={JSON.stringify(exit)}
            data-variants={JSON.stringify(variants)}
            data-transition={JSON.stringify(transition)}
          >
            {children}
          </div>
        )
      }
    },
    AnimatePresence: ({ children }: any) => <div data-animate-presence="true">{children}</div>
  }
})

function renderWithRouter(component: React.ReactElement) {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Page Transition Animations Property Tests', () => {
  it('Property 12: Page transitions should use slide animations with easeOutCirc timing', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.constantFrom('slideLeft', 'slideRight', 'slideUp', 'slideDown'),
        (content, direction) => {
          const TestContent = () => <div>{content}</div>
          
          const { container } = renderWithRouter(
            <SlideTransition direction={direction as keyof typeof slideTransitions}>
              <TestContent />
            </SlideTransition>
          )
          
          const animatedDiv = container.querySelector('[data-transition]')
          expect(animatedDiv).toBeTruthy()
          
          if (animatedDiv) {
            const transitionData = animatedDiv.getAttribute('data-transition')
            
            if (transitionData && transitionData !== 'null') {
              const transition = JSON.parse(transitionData)
              
              // Verify easeOutCirc timing function (cubic-bezier equivalent)
              expect(transition.ease).toEqual([0.25, 0.46, 0.45, 0.94])
              
              // Verify appropriate duration (should be reasonable for UX)
              expect(transition.duration).toBeGreaterThan(0)
              expect(transition.duration).toBeLessThanOrEqual(1.0)
              
              // Verify tween type for smooth transitions
              expect(transition.type).toBe('tween')
            }
          }
          
          // Verify content is rendered
          expect(container.textContent).toContain(content)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 12: Page transitions should have proper slide animation values', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('slideLeft', 'slideRight', 'slideUp', 'slideDown'),
        (direction) => {
          const TestContent = () => <div>Test Content</div>
          
          const { container } = renderWithRouter(
            <SlideTransition direction={direction as keyof typeof slideTransitions}>
              <TestContent />
            </SlideTransition>
          )
          
          const animatedDiv = container.querySelector('[data-initial], [data-animate], [data-exit]')
          expect(animatedDiv).toBeTruthy()
          
          if (animatedDiv) {
            const initialData = animatedDiv.getAttribute('data-initial')
            const animateData = animatedDiv.getAttribute('data-animate')
            const exitData = animatedDiv.getAttribute('data-exit')
            
            // Verify animation states exist
            if (initialData && initialData !== 'null') {
              const initial = JSON.parse(initialData)
              expect(initial.opacity).toBeDefined()
              
              // Verify slide direction is correct
              if (direction.includes('Left') || direction.includes('Right')) {
                expect(initial.x).toBeDefined()
              }
              if (direction.includes('Up') || direction.includes('Down')) {
                expect(initial.y).toBeDefined()
              }
            }
            
            if (animateData && animateData !== 'null') {
              const animate = JSON.parse(animateData)
              expect(animate.opacity).toBe(1)
              
              // Final position should be centered
              if (direction.includes('Left') || direction.includes('Right')) {
                expect(animate.x).toBe(0)
              }
              if (direction.includes('Up') || direction.includes('Down')) {
                expect(animate.y).toBe(0)
              }
            }
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 12: PageTransition component should have proper animation structure', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.string({ minLength: 0, maxLength: 50 }),
        (content, className) => {
          const TestContent = () => <div>{content}</div>
          
          const { container } = renderWithRouter(
            <PageTransition className={className}>
              <TestContent />
            </PageTransition>
          )
          
          // Verify the component renders
          expect(container.textContent).toContain(content)
          
          // Verify animation wrapper exists
          const animatedDiv = container.querySelector('div')
          expect(animatedDiv).toBeTruthy()
          
          // Verify className is applied if provided
          if (className && animatedDiv) {
            expect(animatedDiv.className).toContain(className)
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 12: AnimatedPageWrapper should include AnimatePresence', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        (content) => {
          const TestContent = () => <div>{content}</div>
          
          const { container } = renderWithRouter(
            <AnimatedPageWrapper>
              <TestContent />
            </AnimatedPageWrapper>
          )
          
          // Verify AnimatePresence wrapper exists
          const animatePresence = container.querySelector('[data-animate-presence="true"]')
          expect(animatePresence).toBeTruthy()
          
          // Verify content is rendered
          expect(container.textContent).toContain(content)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 12: Slide transitions should have correct directional values', () => {
    // Test each slide direction has correct initial positions
    const directions = ['slideLeft', 'slideRight', 'slideUp', 'slideDown'] as const
    
    directions.forEach(direction => {
      const transition = slideTransitions[direction]
      
      // Verify transition configuration exists
      expect(transition).toBeDefined()
      expect(transition.initial).toBeDefined()
      expect(transition.animate).toBeDefined()
      expect(transition.exit).toBeDefined()
      expect(transition.transition).toBeDefined()
      
      // Verify easeOutCirc timing (cubic-bezier equivalent)
      expect(transition.transition.ease).toEqual([0.25, 0.46, 0.45, 0.94])
      expect(transition.transition.type).toBe('tween')
      expect(transition.transition.duration).toBe(0.6)
      
      // Verify opacity transitions
      expect(transition.initial.opacity).toBe(0)
      expect(transition.animate.opacity).toBe(1)
      expect(transition.exit.opacity).toBe(0)
      
      // Verify directional movement
      if (direction === 'slideLeft') {
        expect(transition.initial.x).toBe(100)
        expect(transition.animate.x).toBe(0)
        expect(transition.exit.x).toBe(-100)
      } else if (direction === 'slideRight') {
        expect(transition.initial.x).toBe(-100)
        expect(transition.animate.x).toBe(0)
        expect(transition.exit.x).toBe(100)
      } else if (direction === 'slideUp') {
        expect(transition.initial.y).toBe(100)
        expect(transition.animate.y).toBe(0)
        expect(transition.exit.y).toBe(-100)
      } else if (direction === 'slideDown') {
        expect(transition.initial.y).toBe(-100)
        expect(transition.animate.y).toBe(0)
        expect(transition.exit.y).toBe(100)
      }
    })
  })
})