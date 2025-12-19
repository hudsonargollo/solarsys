/**
 * Performance Monitoring and Optimization Utilities
 */

// Performance metrics interface
export interface PerformanceMetrics {
  pageLoadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
  timeToInteractive: number
}

// Performance observer for Core Web Vitals
export class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {}
  private observers: PerformanceObserver[] = []

  constructor() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.initializeObservers()
    }
  }

  private initializeObservers() {
    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        this.metrics.largestContentfulPaint = lastEntry.startTime
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.push(lcpObserver)
    } catch (e) {
      console.warn('LCP observer not supported')
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          this.metrics.firstInputDelay = entry.processingStart - entry.startTime
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })
      this.observers.push(fidObserver)
    } catch (e) {
      console.warn('FID observer not supported')
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        })
        this.metrics.cumulativeLayoutShift = clsValue
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      this.observers.push(clsObserver)
    } catch (e) {
      console.warn('CLS observer not supported')
    }

    // Navigation timing
    if ('performance' in window && 'timing' in performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const timing = performance.timing
          this.metrics.pageLoadTime = timing.loadEventEnd - timing.navigationStart
          this.metrics.firstContentfulPaint = this.getFirstContentfulPaint()
          this.metrics.timeToInteractive = this.getTimeToInteractive()
        }, 0)
      })
    }
  }

  private getFirstContentfulPaint(): number {
    try {
      const paintEntries = performance.getEntriesByType('paint')
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
      return fcpEntry ? fcpEntry.startTime : 0
    } catch (e) {
      return 0
    }
  }

  private getTimeToInteractive(): number {
    try {
      // Simplified TTI calculation
      const navigationEntry = performance.getEntriesByType('navigation')[0] as any
      return navigationEntry ? navigationEntry.domInteractive - navigationEntry.fetchStart : 0
    } catch (e) {
      return 0
    }
  }

  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics }
  }

  public logMetrics(): void {
    if (process.env.NODE_ENV === 'development') {
      console.table(this.metrics)
    }
  }

  public sendMetrics(): void {
    // In production, send metrics to analytics service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Google Analytics, Mixpanel, or custom analytics
      // analytics.track('performance_metrics', this.metrics)
    }
  }

  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Lazy loading utility
export function lazyLoad<T>(importFn: () => Promise<{ default: T }>): React.LazyExoticComponent<T> {
  return React.lazy(importFn)
}

// Image optimization utility
export function optimizeImageUrl(url: string, width?: number, height?: number, quality: number = 80): string {
  // For production, you might use a service like Cloudinary or ImageKit
  // This is a placeholder implementation
  if (!url) return url
  
  const params = new URLSearchParams()
  if (width) params.set('w', width.toString())
  if (height) params.set('h', height.toString())
  params.set('q', quality.toString())
  
  const separator = url.includes('?') ? '&' : '?'
  return params.toString() ? `${url}${separator}${params.toString()}` : url
}

// Resource preloading utility
export function preloadResource(href: string, as: 'script' | 'style' | 'font' | 'image' = 'script'): void {
  if (typeof document === 'undefined') return
  
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as
  
  if (as === 'font') {
    link.crossOrigin = 'anonymous'
  }
  
  document.head.appendChild(link)
}

// Critical resource prefetching
export function prefetchCriticalResources(): void {
  if (typeof document === 'undefined') return
  
  // Preload critical fonts
  preloadResource('/fonts/inter-var.woff2', 'font')
  
  // Preload critical images
  const criticalImages = [
    '/images/solar-house.svg',
    '/images/sun.svg'
  ]
  
  criticalImages.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = src
    link.as = 'image'
    document.head.appendChild(link)
  })
}

// Bundle size analyzer (development only)
export function analyzeBundleSize(): void {
  if (process.env.NODE_ENV === 'development') {
    // Log bundle information
    console.group('Bundle Analysis')
    console.log('Main bundle loaded')
    
    // Check for large dependencies
    const largeDependencies = [
      'react',
      'react-dom',
      'framer-motion',
      '@supabase/supabase-js'
    ]
    
    largeDependencies.forEach(dep => {
      try {
        const module = require(dep)
        console.log(`${dep}: loaded`)
      } catch (e) {
        console.log(`${dep}: not found`)
      }
    })
    
    console.groupEnd()
  }
}

// Memory usage monitoring
export function monitorMemoryUsage(): void {
  if (typeof window !== 'undefined' && 'performance' in window && 'memory' in (performance as any)) {
    const memory = (performance as any).memory
    
    const memoryInfo = {
      usedJSHeapSize: Math.round(memory.usedJSHeapSize / 1048576), // MB
      totalJSHeapSize: Math.round(memory.totalJSHeapSize / 1048576), // MB
      jsHeapSizeLimit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Memory Usage:', memoryInfo)
    }
    
    // Alert if memory usage is high
    if (memoryInfo.usedJSHeapSize > 100) { // 100MB threshold
      console.warn('High memory usage detected:', memoryInfo)
    }
  }
}

// Service Worker registration for caching
export function registerServiceWorker(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    })
  }
}

// Initialize performance monitoring
export const performanceMonitor = new PerformanceMonitor()

// Export React for lazy loading
import React from 'react'