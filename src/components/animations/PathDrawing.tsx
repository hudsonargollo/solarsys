import { motion, MotionProps } from 'framer-motion'
import { ReactNode } from 'react'

interface PathDrawingProps {
  children: ReactNode
  duration?: number
  delay?: number
  stagger?: number
  easing?: string
  className?: string
}

export const PathDrawingContainer = ({ 
  children, 
  duration = 1.5, 
  delay = 0, 
  stagger = 0.2,
  easing = "easeOut",
  className = ""
}: PathDrawingProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay
      }
    }
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedPathProps extends MotionProps {
  d: string
  stroke?: string
  strokeWidth?: string | number
  fill?: string
  strokeLinecap?: "butt" | "round" | "square"
  strokeLinejoin?: "miter" | "round" | "bevel"
  strokeDasharray?: string
  duration?: number
  easing?: string
}

export const AnimatedPath = ({ 
  d, 
  stroke = "#2E7D32", 
  strokeWidth = 2, 
  fill = "none",
  strokeLinecap = "round",
  strokeLinejoin = "round",
  strokeDasharray,
  duration = 1.5,
  easing = "easeOut",
  ...motionProps 
}: AnimatedPathProps) => {
  const pathVariants = {
    hidden: { 
      pathLength: 0, 
      opacity: 0 
    },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration, 
        ease: easing
      }
    }
  }

  return (
    <motion.path
      d={d}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      strokeDasharray={strokeDasharray}
      variants={pathVariants}
      {...motionProps}
    />
  )
}

interface AnimatedCircleProps extends MotionProps {
  cx: string | number
  cy: string | number
  r: string | number
  stroke?: string
  strokeWidth?: string | number
  fill?: string
  duration?: number
  easing?: string
}

export const AnimatedCircle = ({ 
  cx, 
  cy, 
  r, 
  stroke = "#2E7D32", 
  strokeWidth = 2, 
  fill = "none",
  duration = 1.2,
  easing = "easeOutBack",
  ...motionProps 
}: AnimatedCircleProps) => {
  const circleVariants = {
    hidden: { 
      scale: 0, 
      opacity: 0 
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration, 
        ease: easing
      }
    }
  }

  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={r}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      variants={circleVariants}
      {...motionProps}
    />
  )
}

// Preset animation configurations
export const animationPresets = {
  pathDrawing: {
    duration: 1.5,
    easing: "easeOut"
  },
  staggeredEntry: {
    stagger: 0.3,
    delay: 0.2
  },
  energyFlow: {
    duration: 2,
    easing: "linear",
    repeat: Infinity
  },
  microInteraction: {
    duration: 0.2,
    easing: "easeOut"
  }
} as const