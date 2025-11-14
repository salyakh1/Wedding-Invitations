'use client'

import { useEffect, useRef } from 'react'

interface ParticleEffectsProps {
  enabled: boolean
}

export default function ParticleEffects({ enabled }: ParticleEffectsProps) {
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

    // Типы частиц
    const particleTypes = ['heart', 'star', 'confetti']
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      type: string
      color: string
      rotation: number
      rotationSpeed: number
    }> = []

    // Создаем частицы (только после инициализации canvas)
    const createParticle = () => {
      if (canvas.width === 0 || canvas.height === 0) {
        // Если canvas еще не инициализирован, используем дефолтные значения
        return {
          x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
          y: -10,
          vx: (Math.random() - 0.5) * 0.5,
          vy: Math.random() * 0.5 + 0.3,
          size: Math.random() * 8 + 4,
          type: 'confetti',
          color: '#ff6b9d',
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.1
        }
      }

      const type = particleTypes[Math.floor(Math.random() * particleTypes.length)]
      const colors = {
        heart: ['#ff6b9d', '#ff8fab', '#ffa8c5'],
        star: ['#ffd700', '#ffed4e', '#fff9c4'],
        confetti: ['#ff6b9d', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b']
      }

      return {
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: Math.random() * 0.5 + 0.3,
        size: Math.random() * 8 + 4,
        type,
        color: colors[type as keyof typeof colors][
          Math.floor(Math.random() * colors[type as keyof typeof colors].length)
        ],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1
      }
    }

    // Инициализация частиц (только после resizeCanvas)
    for (let i = 0; i < 30; i++) {
      particles.push(createParticle())
    }

    // Рисуем сердечко
    const drawHeart = (x: number, y: number, size: number, color: string, rotation: number) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(0, size * 0.3)
      ctx.bezierCurveTo(0, 0, -size * 0.5, 0, -size * 0.5, size * 0.3)
      ctx.bezierCurveTo(-size * 0.5, size * 0.7, 0, size, 0, size)
      ctx.bezierCurveTo(0, size, size * 0.5, size * 0.7, size * 0.5, size * 0.3)
      ctx.bezierCurveTo(size * 0.5, 0, 0, 0, 0, size * 0.3)
      ctx.fill()
      ctx.restore()
    }

    // Рисуем звезду
    const drawStar = (x: number, y: number, size: number, color: string, rotation: number) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      ctx.fillStyle = color
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
        const xPos = Math.cos(angle) * size
        const yPos = Math.sin(angle) * size
        if (i === 0) ctx.moveTo(xPos, yPos)
        else ctx.lineTo(xPos, yPos)
      }
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    // Рисуем конфетти
    const drawConfetti = (x: number, y: number, size: number, color: string, rotation: number) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)
      ctx.fillStyle = color
      ctx.fillRect(-size / 2, -size / 2, size, size)
      ctx.restore()
    }

    // Анимация
    const animate = () => {
      if (!enabled || canvas.width === 0 || canvas.height === 0) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, index) => {
        // Обновляем позицию
        particle.x += particle.vx
        particle.y += particle.vy
        particle.rotation += particle.rotationSpeed

        // Рисуем частицу
        if (particle.type === 'heart') {
          drawHeart(particle.x, particle.y, particle.size, particle.color, particle.rotation)
        } else if (particle.type === 'star') {
          drawStar(particle.x, particle.y, particle.size, particle.color, particle.rotation)
        } else {
          drawConfetti(particle.x, particle.y, particle.size, particle.color, particle.rotation)
        }

        // Если частица ушла за экран, создаем новую
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
      style={{ opacity: 0.6 }}
    />
  )
}

