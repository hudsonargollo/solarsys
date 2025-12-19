import { motion, MotionProps } from 'framer-motion'
import { ReactNode } from 'react'

interface InteractiveElementProps {
  children: ReactNode
  className?: string
  disabled?: boolean
  onClick?: () => void
}

export const HoverLiftButton = ({ 
  children, 
  className = "", 
  disabled = false, 
  onClick 
}: InteractiveElementProps) => {
  const hoverVariants = {
    rest: {
      scale: 1,
      y: 0,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    },
    hover: {
      scale: 1.02,
      y: -2,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    tap: {
      scale: 0.98,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 30
      }
    }
  }

  return (
    <motion.button
      className={`${className} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      variants={hoverVariants}
      initial="rest"
      whileHover={!disabled ? "hover" : "rest"}
      whileTap={!disabled ? "tap" : "rest"}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  )
}

interface HoverCardProps {
  children: ReactNode
  className?: string
}

export const HoverCard = ({ children, className = "" }: HoverCardProps) => {
  const cardVariants = {
    rest: {
      scale: 1,
      y: 0,
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
    },
    hover: {
      scale: 1.01,
      y: -4,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  }

  return (
    <motion.div
      className={className}
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
    >
      {children}
    </motion.div>
  )
}

interface PulseElementProps {
  children: ReactNode
  className?: string
  pulseColor?: string
}

export const PulseElement = ({ 
  children, 
  className = "", 
  pulseColor = "rgba(255, 158, 128, 0.4)" 
}: PulseElementProps) => {
  const pulseVariants = {
    pulse: {
      boxShadow: [
        `0 0 0 0 ${pulseColor}`,
        `0 0 0 10px rgba(255, 158, 128, 0)`,
        `0 0 0 0 rgba(255, 158, 128, 0)`
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      className={className}
      variants={pulseVariants}
      animate="pulse"
    >
      {children}
    </motion.div>
  )
}

interface FloatingElementProps {
  children: ReactNode
  className?: string
  amplitude?: number
  duration?: number
}

export const FloatingElement = ({ 
  children, 
  className = "", 
  amplitude = 10, 
  duration = 3 
}: FloatingElementProps) => {
  const floatVariants = {
    float: {
      y: [-amplitude, amplitude, -amplitude],
      transition: {
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <motion.div
      className={className}
      variants={floatVariants}
      animate="float"
    >
      {children}
    </motion.div>
  )
}

interface ScaleOnHoverProps extends MotionProps {
  children: ReactNode
  className?: string
  scaleAmount?: number
}

export const ScaleOnHover = ({ 
  children, 
  className = "", 
  scaleAmount = 1.05,
  ...motionProps 
}: ScaleOnHoverProps) => {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: scaleAmount }}
      whileTap={{ scale: scaleAmount * 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...motionProps}
    >
      {children}
    </motion.div>
  )
}

// Physics-based spring configurations
export const springConfigs = {
  gentle: {
    type: "spring" as const,
    stiffness: 200,
    damping: 20
  },
  bouncy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 15
  },
  snappy: {
    type: "spring" as const,
    stiffness: 600,
    damping: 30
  },
  smooth: {
    type: "tween" as const,
    ease: "easeOut",
    duration: 0.3
  }
} as const