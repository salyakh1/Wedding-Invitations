'use client'

import { motion } from 'framer-motion'
import { ReactNode, useEffect, useRef, useState } from 'react'

interface AnimatedBlockProps {
  children: ReactNode
  index: number
  animations?: {
    fadeIn?: boolean
    slideUp?: boolean
    scaleIn?: boolean
    staggered?: boolean
  }
}

export default function AnimatedBlock({ children, index, animations }: AnimatedBlockProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  // Если анимации отключены, просто возвращаем контент
  if (!animations || (!animations.fadeIn && !animations.slideUp && !animations.scaleIn)) {
    return <div ref={ref}>{children}</div>
  }

  // Определяем задержку для staggered анимации
  const delay = animations.staggered ? index * 0.1 : 0

  // Комбинируем анимации
  const initial: any = {}
  const animate: any = {}

  if (animations.fadeIn) {
    initial.opacity = 0
    animate.opacity = 1
  }

  if (animations.slideUp) {
    initial.y = 50
    animate.y = 0
  }

  if (animations.scaleIn) {
    initial.scale = 0.9
    animate.scale = 1
  }

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={isVisible ? animate : initial}
      transition={{
        duration: 0.6,
        delay: delay,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  )
}

