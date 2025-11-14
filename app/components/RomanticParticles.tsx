'use client'

import { useEffect, useRef } from 'react'

interface RomanticParticlesProps {
  enabled: boolean
}

export default function RomanticParticles({ enabled }: RomanticParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!enabled || !canvasRef.current || typeof window === 'undefined') return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Устанавливаем размеры canvas
    const resizeCanvas = () => {
      if (typeof window !== 'undefined') {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }
    resizeCanvas()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', resizeCanvas)
    }

    // Только сердечки
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
      rotation: number
      rotationSpeed: number
      opacity: number
      swing: number
      swingSpeed: number
    }> = []

    // Создаем романтичные частицы (только сердечки)
    const createParticle = () => {
      const heartColors = ['#ff6b9d', '#ff8fab', '#ffa8c5', '#ff69b4', '#ff1493', '#ffb6c1', '#ffc0cb', '#ff91a4']
      
      if (canvas.width === 0 || canvas.height === 0) {
        return {
          x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
          y: -10,
          vx: (Math.random() - 0.5) * 0.3,
          vy: Math.random() * 0.3 + 0.2,
          size: Math.random() * 12 + 8,
          color: heartColors[Math.floor(Math.random() * heartColors.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.08,
          opacity: 0.7 + Math.random() * 0.3,
          swing: Math.random() * Math.PI * 2,
          swingSpeed: (Math.random() - 0.5) * 0.02
        }
      }

      return {
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 0.3,
        vy: Math.random() * 0.3 + 0.2,
        size: Math.random() * 12 + 8,
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.08,
        opacity: 0.7 + Math.random() * 0.3,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: (Math.random() - 0.5) * 0.02
      }
    }

    // Инициализация частиц (только сердечки)
    for (let i = 0; i < 50; i++) {
      particles.push(createParticle())
    }

    // Рисуем сердечко (более романтичное)
    const drawHeart = (x: number, y: number, size: number, color: string, rotation: number, opacity: number) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      ctx.globalAlpha = opacity
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(0, size * 0.3)
      ctx.bezierCurveTo(0, 0, -size * 0.5, 0, -size * 0.5, size * 0.3)
      ctx.bezierCurveTo(-size * 0.5, size * 0.7, 0, size, 0, size)
      ctx.bezierCurveTo(0, size, size * 0.5, size * 0.7, size * 0.5, size * 0.3)
      ctx.bezierCurveTo(size * 0.5, 0, 0, 0, 0, size * 0.3)
      ctx.closePath()
      ctx.fill()

      // Блик на сердечке
      const highlightGradient = ctx.createRadialGradient(-size * 0.2, -size * 0.2, 0, -size * 0.2, -size * 0.2, size * 0.3)
      highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)')
      highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = highlightGradient
      ctx.beginPath()
      ctx.arc(-size * 0.2, -size * 0.2, size * 0.3, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }


    const animate = () => {
      if (!enabled || canvas.width === 0 || canvas.height === 0) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, index) => {
        // Обновляем позицию с покачиванием (swing)
        particle.swing += particle.swingSpeed
        particle.x += particle.vx + Math.sin(particle.swing) * 0.5
        particle.y += particle.vy
        particle.rotation += particle.rotationSpeed

        // Плавное изменение прозрачности при падении
        const fallProgress = particle.y / canvas.height
        particle.opacity = 0.7 + (1 - fallProgress) * 0.3

        // Рисуем только сердечки
        drawHeart(particle.x, particle.y, particle.size, particle.color, particle.rotation, particle.opacity)

        // Пересоздаем частицу, если она вышла за границы
        if (particle.y > canvas.height + 10 || particle.x < -10 || particle.x > canvas.width + 10) {
          particles[index] = createParticle()
        }
      })

      if (typeof window !== 'undefined') {
        requestAnimationFrame(animate)
      }
    }

    if (typeof window !== 'undefined') {
      animate()
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', resizeCanvas)
      }
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
      style={{ opacity: 0.7 }}
    />
  )
}

