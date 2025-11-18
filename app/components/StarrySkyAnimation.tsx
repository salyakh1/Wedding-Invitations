'use client'

import { useEffect, useRef } from 'react'

interface StarrySkyAnimationProps {
  enabled: boolean
}

interface Star {
  x: number
  y: number
  size: number
  brightness: number
  twinkleSpeed: number
  twinklePhase: number
  color: string
}

interface Nebula {
  x: number
  y: number
  width: number
  height: number
  rotation: number
  rotationSpeed: number
  colors: string[]
  opacity: number
}

interface ShootingStar {
  x: number
  y: number
  vx: number
  vy: number
  length: number
  opacity: number
  life: number
  maxLife: number
}

export default function StarrySkyAnimation({ enabled }: StarrySkyAnimationProps) {
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

    // Создаем звезды
    const stars: Star[] = []
    const createStar = (): Star => {
      const starTypes = [
        { size: 1, brightness: 0.6, twinkleSpeed: 0.02, color: '#ffffff' },
        { size: 1.5, brightness: 0.8, twinkleSpeed: 0.015, color: '#fff9e6' },
        { size: 2, brightness: 1, twinkleSpeed: 0.01, color: '#e6f3ff' },
        { size: 2.5, brightness: 1.2, twinkleSpeed: 0.008, color: '#ffffff' },
        { size: 3, brightness: 1.5, twinkleSpeed: 0.005, color: '#fff4e6' }
      ]
      
      const type = starTypes[Math.floor(Math.random() * starTypes.length)]
      
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: type.size,
        brightness: type.brightness,
        twinkleSpeed: type.twinkleSpeed,
        twinklePhase: Math.random() * Math.PI * 2,
        color: type.color
      }
    }

    // Инициализация звезд (250 звезд для детального неба)
    for (let i = 0; i < 250; i++) {
      stars.push(createStar())
    }

    // Создаем туманности (небулы)
    const nebulae: Nebula[] = []
    const createNebula = (): Nebula => {
      const nebulaTypes = [
        {
          colors: ['rgba(138, 43, 226, 0.4)', 'rgba(75, 0, 130, 0.3)', 'rgba(186, 85, 211, 0.2)'], // Фиолетовая
          opacity: 0.5
        },
        {
          colors: ['rgba(255, 105, 180, 0.3)', 'rgba(255, 20, 147, 0.25)', 'rgba(255, 182, 193, 0.2)'], // Розовая
          opacity: 0.4
        },
        {
          colors: ['rgba(30, 144, 255, 0.35)', 'rgba(135, 206, 250, 0.3)', 'rgba(176, 224, 230, 0.25)'], // Голубая
          opacity: 0.45
        },
        {
          colors: ['rgba(255, 140, 0, 0.3)', 'rgba(255, 69, 0, 0.25)', 'rgba(255, 160, 122, 0.2)'], // Оранжевая
          opacity: 0.35
        }
      ]
      
      const type = nebulaTypes[Math.floor(Math.random() * nebulaTypes.length)]
      
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        width: 300 + Math.random() * 400,
        height: 200 + Math.random() * 300,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.001,
        colors: type.colors,
        opacity: type.opacity
      }
    }

    // Создаем 4 туманности
    for (let i = 0; i < 4; i++) {
      nebulae.push(createNebula())
    }

    // Падающие звезды
    const shootingStars: ShootingStar[] = []
    let shootingStarTimer = 0

    const createShootingStar = (): ShootingStar => {
      return {
        x: Math.random() * canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 2,
        vy: 2 + Math.random() * 3,
        length: 30 + Math.random() * 50,
        opacity: 1,
        life: 0,
        maxLife: 60 + Math.random() * 40
      }
    }

    // Функция рисования звезды
    const drawStar = (star: Star) => {
      const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7
      const currentBrightness = star.brightness * twinkle
      
      ctx.save()
      ctx.globalAlpha = Math.min(currentBrightness, 1)
      ctx.fillStyle = star.color
      ctx.shadowBlur = star.size * 2
      ctx.shadowColor = star.color
      
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
      ctx.fill()
      
      // Добавляем лучи для ярких звезд
      if (star.size >= 2) {
        ctx.strokeStyle = star.color
        ctx.lineWidth = 0.5
        ctx.globalAlpha = currentBrightness * 0.5
        
        // Вертикальный луч
        ctx.beginPath()
        ctx.moveTo(star.x, star.y - star.size * 2)
        ctx.lineTo(star.x, star.y + star.size * 2)
        ctx.stroke()
        
        // Горизонтальный луч
        ctx.beginPath()
        ctx.moveTo(star.x - star.size * 2, star.y)
        ctx.lineTo(star.x + star.size * 2, star.y)
        ctx.stroke()
      }
      
      ctx.restore()
    }

    // Функция рисования туманности
    const drawNebula = (nebula: Nebula) => {
      ctx.save()
      ctx.translate(nebula.x, nebula.y)
      ctx.rotate(nebula.rotation)
      
      // Создаем радиальный градиент для туманности
      const gradient = ctx.createRadialGradient(
        0, 0, 0,
        0, 0, Math.max(nebula.width, nebula.height) / 2
      )
      
      nebula.colors.forEach((color, index) => {
        const position = index / (nebula.colors.length - 1)
        gradient.addColorStop(position, color)
      })
      
      ctx.globalAlpha = nebula.opacity
      ctx.fillStyle = gradient
      
      // Рисуем эллиптическую туманность
      ctx.beginPath()
      ctx.ellipse(0, 0, nebula.width / 2, nebula.height / 2, 0, 0, Math.PI * 2)
      ctx.fill()
      
      // Добавляем дополнительные слои для объема
      const overlayGradient = ctx.createRadialGradient(
        0, 0, 0,
        0, 0, Math.max(nebula.width, nebula.height) / 3
      )
      overlayGradient.addColorStop(0, nebula.colors[0])
      overlayGradient.addColorStop(1, 'transparent')
      
      ctx.globalAlpha = nebula.opacity * 0.6
      ctx.fillStyle = overlayGradient
      ctx.beginPath()
      ctx.ellipse(0, 0, nebula.width / 3, nebula.height / 3, 0, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    }

    // Функция рисования падающей звезды
    const drawShootingStar = (star: ShootingStar) => {
      ctx.save()
      ctx.globalAlpha = star.opacity
      
      // Создаем градиент для хвоста
      const gradient = ctx.createLinearGradient(
        star.x, star.y,
        star.x - star.vx * star.length, star.y - star.vy * star.length
      )
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)')
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      
      ctx.strokeStyle = gradient
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.shadowBlur = 10
      ctx.shadowColor = '#ffffff'
      
      ctx.beginPath()
      ctx.moveTo(star.x, star.y)
      ctx.lineTo(star.x - star.vx * star.length, star.y - star.vy * star.length)
      ctx.stroke()
      
      // Яркое ядро
      ctx.fillStyle = '#ffffff'
      ctx.shadowBlur = 15
      ctx.beginPath()
      ctx.arc(star.x, star.y, 2, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    }

    // Анимация
    const animate = () => {
      if (!enabled || canvas.width === 0 || canvas.height === 0) return

      // Очищаем canvas с темным космическим фоном
      ctx.fillStyle = '#0a0a1a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Обновляем и рисуем туманности
      nebulae.forEach(nebula => {
        nebula.rotation += nebula.rotationSpeed
        // Легкое движение туманностей
        nebula.x += Math.sin(nebula.rotation) * 0.1
        nebula.y += Math.cos(nebula.rotation) * 0.1
        
        // Ограничиваем движение в пределах экрана
        if (nebula.x < -nebula.width) nebula.x = canvas.width + nebula.width
        if (nebula.x > canvas.width + nebula.width) nebula.x = -nebula.width
        if (nebula.y < -nebula.height) nebula.y = canvas.height + nebula.height
        if (nebula.y > canvas.height + nebula.height) nebula.y = -nebula.height
        
        drawNebula(nebula)
      })

      // Обновляем и рисуем звезды
      stars.forEach(star => {
        star.twinklePhase += star.twinkleSpeed
        drawStar(star)
      })

      // Обновляем таймер падающих звезд
      shootingStarTimer++
      if (shootingStarTimer > 300 && Math.random() < 0.02) {
        shootingStars.push(createShootingStar())
        shootingStarTimer = 0
      }

      // Обновляем и рисуем падающие звезды
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i]
        star.x += star.vx
        star.y += star.vy
        star.life++
        star.opacity = 1 - (star.life / star.maxLife)

        if (star.life < star.maxLife && star.y < canvas.height + 50) {
          drawShootingStar(star)
        } else {
          shootingStars.splice(i, 1)
        }
      }

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
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ 
        zIndex: 5,
        opacity: 0.85
      }}
    />
  )
}

