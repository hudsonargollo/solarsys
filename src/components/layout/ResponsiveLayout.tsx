import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ResponsiveLayoutProps {
  children: ReactNode
  className?: string
}

export const MinimalistContainer = ({ children, className = "" }: ResponsiveLayoutProps) => {
  return (
    <div className={`
      min-h-screen 
      bg-gradient-to-br from-white to-gray-50
      px-4 sm:px-6 lg:px-8
      py-8 sm:py-12 lg:py-16
      ${className}
    `}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  )
}

interface GridLayoutProps {
  children: ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export const ResponsiveGrid = ({ 
  children, 
  columns = 2, 
  gap = 'lg', 
  className = "" 
}: GridLayoutProps) => {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  }

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={`
      grid 
      ${columnClasses[columns]} 
      ${gapClasses[gap]} 
      ${className}
    `}>
      {children}
    </div>
  )
}

interface FlexLayoutProps {
  children: ReactNode
  direction?: 'row' | 'col'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  wrap?: boolean
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export const FlexLayout = ({ 
  children, 
  direction = 'row', 
  align = 'start',
  justify = 'start',
  wrap = false,
  gap = 'md',
  className = "" 
}: FlexLayoutProps) => {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col'
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  }

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }

  return (
    <div className={`
      flex 
      ${directionClasses[direction]} 
      ${alignClasses[align]} 
      ${justifyClasses[justify]} 
      ${wrap ? 'flex-wrap' : 'flex-nowrap'}
      ${gapClasses[gap]} 
      ${className}
    `}>
      {children}
    </div>
  )
}

interface CardProps {
  children: ReactNode
  variant?: 'default' | 'elevated' | 'outlined' | 'minimal'
  padding?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export const MinimalistCard = ({ 
  children, 
  variant = 'default', 
  padding = 'lg',
  className = "" 
}: CardProps) => {
  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white shadow-lg border border-gray-100',
    outlined: 'bg-transparent border-2 border-gray-300',
    minimal: 'bg-white/50 backdrop-blur-sm border border-white/20'
  }

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12'
  }

  return (
    <div className={`
      rounded-xl 
      ${variantClasses[variant]} 
      ${paddingClasses[padding]} 
      ${className}
    `}>
      {children}
    </div>
  )
}

interface SectionProps {
  children: ReactNode
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export const Section = ({ children, spacing = 'lg', className = "" }: SectionProps) => {
  const spacingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24'
  }

  return (
    <section className={`${spacingClasses[spacing]} ${className}`}>
      {children}
    </section>
  )
}

interface CenteredContentProps {
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  className?: string
}

export const CenteredContent = ({ 
  children, 
  maxWidth = 'lg', 
  className = "" 
}: CenteredContentProps) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  }

  return (
    <div className={`
      ${maxWidthClasses[maxWidth]} 
      mx-auto 
      text-center 
      ${className}
    `}>
      {children}
    </div>
  )
}

// Animated layout components
interface AnimatedSectionProps extends SectionProps {
  delay?: number
}

export const AnimatedSection = ({ 
  children, 
  spacing = 'lg', 
  delay = 0,
  className = "" 
}: AnimatedSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: "easeOut" 
      }}
    >
      <Section spacing={spacing} className={className}>
        {children}
      </Section>
    </motion.div>
  )
}