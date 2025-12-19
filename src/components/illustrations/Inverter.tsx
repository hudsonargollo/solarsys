import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface InverterProps {
  className?: string
  animate?: boolean
  staggerDelay?: number
}

export const Inverter = ({ className = '', animate = true, staggerDelay = 0 }: InverterProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setIsVisible(true), staggerDelay)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(true)
    }
  }, [animate, staggerDelay])

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 1.0, 
        ease: "easeOut"
      }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  }

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  return (
    <motion.svg
      width="180"
      height="120"
      viewBox="0 0 180 120"
      className={`${className}`}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={staggerContainer}
    >
      {/* Inverter Main Body */}
      <motion.g variants={staggerContainer}>
        {/* Main Housing */}
        <motion.path
          d="M30 30 L30 20 L60 15 L150 15 L150 25 L150 35 L120 40 L60 40 Z"
          fill="none"
          stroke="#2E7D32"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
        />
        
        <motion.path
          d="M30 30 L30 80 L60 85 L150 85 L150 35"
          fill="none"
          stroke="#2E7D32"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
        />
        
        <motion.path
          d="M60 40 L60 85 M120 40 L120 85"
          stroke="#2E7D32"
          strokeWidth="2"
          strokeLinecap="round"
          variants={pathVariants}
        />
      </motion.g>

      {/* Display Screen */}
      <motion.g variants={staggerContainer}>
        <motion.path
          d="M70 45 L70 35 L85 32 L110 32 L110 42 L110 52 L85 55 L70 55 Z"
          fill="none"
          stroke="#FF9E80"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
        />
        
        {/* Display Content */}
        <motion.path
          d="M75 40 L105 37 M75 45 L95 43 M75 50 L100 48"
          stroke="#FF9E80"
          strokeWidth="1"
          strokeLinecap="round"
          variants={pathVariants}
        />
      </motion.g>

      {/* LED Indicators */}
      <motion.g variants={staggerContainer}>
        <motion.circle
          cx="120"
          cy="45"
          r="2"
          fill="#2E7D32"
          variants={pathVariants}
          animate={animate ? pulseAnimation : {}}
        />
        <motion.circle
          cx="130"
          cy="43"
          r="2"
          fill="#FF9E80"
          variants={pathVariants}
          animate={animate ? { ...pulseAnimation, transition: { ...pulseAnimation.transition, delay: 0.5 } } : {}}
        />
        <motion.circle
          cx="140"
          cy="41"
          r="2"
          fill="#2E7D32"
          variants={pathVariants}
          animate={animate ? { ...pulseAnimation, transition: { ...pulseAnimation.transition, delay: 1 } } : {}}
        />
      </motion.g>

      {/* Connection Ports */}
      <motion.g variants={staggerContainer}>
        {/* DC Input */}
        <motion.path
          d="M40 60 L40 50 L50 48 L55 48 L55 58 L55 68 L50 70 L40 70 Z"
          fill="none"
          stroke="#FF9E80"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
        />
        
        {/* AC Output */}
        <motion.path
          d="M125 60 L125 50 L135 48 L140 48 L140 58 L140 68 L135 70 L125 70 Z"
          fill="none"
          stroke="#2E7D32"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
        />
      </motion.g>

      {/* Cooling Vents */}
      <motion.g variants={staggerContainer}>
        <motion.path
          d="M65 65 L115 62 M65 70 L115 67 M65 75 L115 72"
          stroke="#2E7D32"
          strokeWidth="1"
          strokeLinecap="round"
          variants={pathVariants}
        />
      </motion.g>

      {/* Energy Flow Indicators */}
      <motion.g variants={staggerContainer}>
        {/* DC Flow */}
        <motion.path
          d="M20 65 L35 62"
          stroke="#FF9E80"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="3 3"
          variants={pathVariants}
        />
        
        {/* AC Flow */}
        <motion.path
          d="M145 62 L160 65"
          stroke="#2E7D32"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="3 3"
          variants={pathVariants}
        />
        
        {/* Flow Arrows */}
        <motion.path
          d="M32 60 L35 62 L32 64"
          fill="none"
          stroke="#FF9E80"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
        />
        
        <motion.path
          d="M148 63 L145 65 L148 67"
          fill="none"
          stroke="#2E7D32"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
        />
      </motion.g>
    </motion.svg>
  )
}