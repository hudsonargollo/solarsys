import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface SolarHouseProps {
  className?: string
  animate?: boolean
  staggerDelay?: number
}

export const SolarHouse = ({ className = '', animate = true, staggerDelay = 0 }: SolarHouseProps) => {
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
        duration: 1.5, 
        ease: "easeOut"
      }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  }

  return (
    <motion.svg
      width="300"
      height="200"
      viewBox="0 0 300 200"
      className={`${className}`}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={staggerContainer}
    >
      {/* House Base Structure */}
      <motion.g variants={staggerContainer}>
        {/* House Foundation */}
        <motion.path
          d="M50 150 L50 120 L100 100 L250 100 L250 120 L250 150 L200 170 L100 170 Z"
          fill="none"
          stroke="#2E7D32"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
        />
        
        {/* House Walls */}
        <motion.path
          d="M50 120 L100 100 L100 70 L200 70 L250 100 L250 120"
          fill="none"
          stroke="#2E7D32"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
        />
        
        {/* Roof */}
        <motion.path
          d="M100 70 L150 40 L200 70"
          fill="none"
          stroke="#2E7D32"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
        />
        
        {/* Door */}
        <motion.path
          d="M120 150 L120 120 L140 115 L140 145 Z"
          fill="none"
          stroke="#2E7D32"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
        />
        
        {/* Window */}
        <motion.path
          d="M170 130 L170 110 L190 105 L190 125 Z"
          fill="none"
          stroke="#2E7D32"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
        />
      </motion.g>

      {/* Solar Panels */}
      <motion.g variants={staggerContainer}>
        {/* Panel 1 */}
        <motion.path
          d="M110 75 L110 65 L140 55 L170 55 L170 65 L170 75 L140 85 L110 85 Z"
          fill="none"
          stroke="#FF9E80"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
        />
        
        {/* Panel 2 */}
        <motion.path
          d="M175 75 L175 65 L205 55 L235 55 L235 65 L235 75 L205 85 L175 85 Z"
          fill="none"
          stroke="#FF9E80"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
        />
        
        {/* Panel Grid Lines */}
        <motion.path
          d="M125 55 L125 85 M155 55 L155 85 M190 55 L190 85 M220 55 L220 85"
          stroke="#FF9E80"
          strokeWidth="1"
          strokeLinecap="round"
          variants={pathVariants}
        />
      </motion.g>

      {/* Sun and Energy Flow */}
      <motion.g variants={staggerContainer}>
        {/* Sun */}
        <motion.circle
          cx="50"
          cy="30"
          r="15"
          fill="none"
          stroke="#FF9E80"
          strokeWidth="2"
          variants={pathVariants}
        />
        
        {/* Sun Rays */}
        <motion.path
          d="M35 15 L30 10 M50 10 L50 5 M65 15 L70 10 M70 30 L75 30 M65 45 L70 50 M50 50 L50 55 M35 45 L30 50 M30 30 L25 30"
          stroke="#FF9E80"
          strokeWidth="1.5"
          strokeLinecap="round"
          variants={pathVariants}
        />
        
        {/* Energy Flow Lines (Dashed) */}
        <motion.path
          d="M65 30 L90 45 M75 35 L100 50 M85 40 L110 55"
          stroke="#FF9E80"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="4 4"
          variants={pathVariants}
        />
      </motion.g>
    </motion.svg>
  )
}