import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface SolarPanelsProps {
  className?: string
  animate?: boolean
  staggerDelay?: number
}

export const SolarPanels = ({ className = '', animate = true, staggerDelay = 0 }: SolarPanelsProps) => {
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
        duration: 1.2, 
        ease: "easeOut"
      }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  return (
    <motion.svg
      width="250"
      height="150"
      viewBox="0 0 250 150"
      className={`${className}`}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={staggerContainer}
    >
      {/* Panel Array */}
      <motion.g variants={staggerContainer}>
        {/* Row 1 */}
        <motion.path
          d="M20 40 L20 30 L80 20 L140 20 L140 30 L140 40 L80 50 L20 50 Z"
          fill="none"
          stroke="#FF9E80"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
        />
        
        <motion.path
          d="M150 40 L150 30 L210 20 L270 20 L270 30 L270 40 L210 50 L150 50 Z"
          fill="none"
          stroke="#FF9E80"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
        />
        
        {/* Row 2 */}
        <motion.path
          d="M20 80 L20 70 L80 60 L140 60 L140 70 L140 80 L80 90 L20 90 Z"
          fill="none"
          stroke="#FF9E80"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
        />
        
        <motion.path
          d="M150 80 L150 70 L210 60 L270 60 L270 70 L270 80 L210 90 L150 90 Z"
          fill="none"
          stroke="#FF9E80"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
        />
        
        {/* Row 3 */}
        <motion.path
          d="M20 120 L20 110 L80 100 L140 100 L140 110 L140 120 L80 130 L20 130 Z"
          fill="none"
          stroke="#FF9E80"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
        />
        
        <motion.path
          d="M150 120 L150 110 L210 100 L270 100 L270 110 L270 120 L210 130 L150 130 Z"
          fill="none"
          stroke="#FF9E80"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={pathVariants}
        />
      </motion.g>

      {/* Panel Grid Details */}
      <motion.g variants={staggerContainer}>
        {/* Vertical Grid Lines */}
        <motion.path
          d="M50 20 L50 50 M110 20 L110 50 M180 20 L180 50 M240 20 L240 50"
          stroke="#FF9E80"
          strokeWidth="1"
          strokeLinecap="round"
          variants={pathVariants}
        />
        
        <motion.path
          d="M50 60 L50 90 M110 60 L110 90 M180 60 L180 90 M240 60 L240 90"
          stroke="#FF9E80"
          strokeWidth="1"
          strokeLinecap="round"
          variants={pathVariants}
        />
        
        <motion.path
          d="M50 100 L50 130 M110 100 L110 130 M180 100 L180 130 M240 100 L240 130"
          stroke="#FF9E80"
          strokeWidth="1"
          strokeLinecap="round"
          variants={pathVariants}
        />
        
        {/* Horizontal Grid Lines */}
        <motion.path
          d="M20 35 L140 25 M150 35 L270 25"
          stroke="#FF9E80"
          strokeWidth="1"
          strokeLinecap="round"
          variants={pathVariants}
        />
        
        <motion.path
          d="M20 75 L140 65 M150 75 L270 65"
          stroke="#FF9E80"
          strokeWidth="1"
          strokeLinecap="round"
          variants={pathVariants}
        />
        
        <motion.path
          d="M20 115 L140 105 M150 115 L270 105"
          stroke="#FF9E80"
          strokeWidth="1"
          strokeLinecap="round"
          variants={pathVariants}
        />
      </motion.g>
    </motion.svg>
  )
}