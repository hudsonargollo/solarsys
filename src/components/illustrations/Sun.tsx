import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface SunProps {
  className?: string
  animate?: boolean
  staggerDelay?: number
  size?: 'small' | 'medium' | 'large'
}

export const Sun = ({ className = '', animate = true, staggerDelay = 0, size = 'medium' }: SunProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setIsVisible(true), staggerDelay)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(true)
    }
  }, [animate, staggerDelay])

  const sizeConfig = {
    small: { width: 80, height: 80, radius: 12, rayLength: 8 },
    medium: { width: 120, height: 120, radius: 18, rayLength: 12 },
    large: { width: 160, height: 160, radius: 24, rayLength: 16 }
  }

  const config = sizeConfig[size]
  const center = config.width / 2

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 1.8, 
        ease: "easeOut"
      }
    }
  }

  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 1.2, 
        ease: "easeOutBack"
      }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const rotateAnimation = {
    rotate: [0, 360],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    }
  }

  return (
    <motion.svg
      width={config.width}
      height={config.height}
      viewBox={`0 0 ${config.width} ${config.height}`}
      className={`${className}`}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={staggerContainer}
    >
      {/* Sun Core */}
      <motion.circle
        cx={center}
        cy={center}
        r={config.radius}
        fill="none"
        stroke="#FF9E80"
        strokeWidth="3"
        variants={circleVariants}
      />
      
      {/* Inner Sun Details */}
      <motion.circle
        cx={center}
        cy={center}
        r={config.radius * 0.6}
        fill="none"
        stroke="#FF9E80"
        strokeWidth="1"
        strokeDasharray="2 2"
        variants={circleVariants}
      />

      {/* Sun Rays */}
      <motion.g
        animate={animate ? rotateAnimation : {}}
        style={{ transformOrigin: `${center}px ${center}px` }}
      >
        {/* Primary Rays */}
        <motion.path
          d={`M${center} ${center - config.radius - config.rayLength} L${center} ${center - config.radius - 4}
             M${center + config.radius + 4} ${center} L${center + config.radius + config.rayLength} ${center}
             M${center} ${center + config.radius + 4} L${center} ${center + config.radius + config.rayLength}
             M${center - config.radius - config.rayLength} ${center} L${center - config.radius - 4} ${center}`}
          stroke="#FF9E80"
          strokeWidth="2"
          strokeLinecap="round"
          variants={pathVariants}
        />
        
        {/* Diagonal Rays */}
        <motion.path
          d={`M${center - config.radius * 0.7 - config.rayLength * 0.7} ${center - config.radius * 0.7 - config.rayLength * 0.7} 
             L${center - config.radius * 0.7 - 3} ${center - config.radius * 0.7 - 3}
             M${center + config.radius * 0.7 + 3} ${center - config.radius * 0.7 - 3} 
             L${center + config.radius * 0.7 + config.rayLength * 0.7} ${center - config.radius * 0.7 - config.rayLength * 0.7}
             M${center + config.radius * 0.7 + 3} ${center + config.radius * 0.7 + 3} 
             L${center + config.radius * 0.7 + config.rayLength * 0.7} ${center + config.radius * 0.7 + config.rayLength * 0.7}
             M${center - config.radius * 0.7 - config.rayLength * 0.7} ${center + config.radius * 0.7 + config.rayLength * 0.7} 
             L${center - config.radius * 0.7 - 3} ${center + config.radius * 0.7 + 3}`}
          stroke="#FF9E80"
          strokeWidth="1.5"
          strokeLinecap="round"
          variants={pathVariants}
        />
      </motion.g>

      {/* Energy Particles */}
      <motion.g variants={staggerContainer}>
        <motion.circle
          cx={center + config.radius + 8}
          cy={center - 8}
          r="1.5"
          fill="#FF9E80"
          variants={circleVariants}
        />
        <motion.circle
          cx={center - config.radius - 8}
          cy={center + 8}
          r="1"
          fill="#FF9E80"
          variants={circleVariants}
        />
        <motion.circle
          cx={center + 8}
          cy={center - config.radius - 8}
          r="1.5"
          fill="#FF9E80"
          variants={circleVariants}
        />
      </motion.g>
    </motion.svg>
  )
}