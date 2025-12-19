import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

export const PageTransition = ({ children, className = "" }: PageTransitionProps) => {
  const pageVariants = {
    initial: {
      opacity: 0,
      x: 100,
      scale: 0.95
    },
    in: {
      opacity: 1,
      x: 0,
      scale: 1
    },
    out: {
      opacity: 0,
      x: -100,
      scale: 0.95
    }
  }

  const pageTransition = {
    type: "tween",
    ease: [0.25, 0.46, 0.45, 0.94], // easeOutCirc equivalent
    duration: 0.6
  }

  return (
    <motion.div
      className={className}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedPageWrapperProps {
  children: ReactNode
  className?: string
}

export const AnimatedPageWrapper = ({ children, className = "" }: AnimatedPageWrapperProps) => {
  return (
    <AnimatePresence mode="wait">
      <PageTransition className={className}>
        {children}
      </PageTransition>
    </AnimatePresence>
  )
}

// Slide transition variants for different directions
export const slideTransitions = {
  slideLeft: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
    transition: { type: "tween", ease: [0.25, 0.46, 0.45, 0.94], duration: 0.6 }
  },
  slideRight: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
    transition: { type: "tween", ease: [0.25, 0.46, 0.45, 0.94], duration: 0.6 }
  },
  slideUp: {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -100 },
    transition: { type: "tween", ease: [0.25, 0.46, 0.45, 0.94], duration: 0.6 }
  },
  slideDown: {
    initial: { opacity: 0, y: -100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 100 },
    transition: { type: "tween", ease: [0.25, 0.46, 0.45, 0.94], duration: 0.6 }
  }
} as const

interface CustomSlideTransitionProps {
  children: ReactNode
  direction?: keyof typeof slideTransitions
  className?: string
}

export const SlideTransition = ({ 
  children, 
  direction = 'slideLeft', 
  className = "" 
}: CustomSlideTransitionProps) => {
  const transition = slideTransitions[direction]

  return (
    <motion.div
      className={className}
      initial={transition.initial}
      animate={transition.animate}
      exit={transition.exit}
      transition={transition.transition}
    >
      {children}
    </motion.div>
  )
}