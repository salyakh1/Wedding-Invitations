'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface RoseOpeningAnimationProps {
  enabled: boolean
  onComplete: () => void
}

export default function RoseOpeningAnimation({ enabled, onComplete }: RoseOpeningAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      setIsVisible(false)
      return
    }

    setIsVisible(true)
    setAnimationProgress(0)

    // Анимация распускания роз
    const duration = 3000 // 3 секунды
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      setAnimationProgress(progress)

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        // Анимация завершена, ждем еще немного перед скрытием
        setTimeout(() => {
          setIsVisible(false)
          onComplete()
        }, 500)
      }
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [enabled, onComplete])

  useEffect(() => {
    if (!isVisible || !canvasRef.current || typeof window === 'undefined') return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Розы для анимации
    const roses: Array<{
      x: number
      y: number
      size: number
      rotation: number
      petalCount: number
      color: string
      delay: number
    }> = []

    // Создаем несколько роз с разными реалистичными цветами
    const roseColors = [
      '#e91e63', // Реалистичный розовый
      '#f06292', // Светло-розовый
      '#ec407a', // Средний розовый
      '#c2185b', // Глубокий розовый
      '#f48fb1', // Нежно-розовый
      '#ad1457'  // Темно-розовый
    ]

    for (let i = 0; i < 6; i++) {
      roses.push({
        x: (canvas.width / 6) * (i + 0.5) + (Math.random() - 0.5) * 100,
        y: canvas.height * (0.3 + Math.random() * 0.4),
        size: 70 + Math.random() * 90,
        rotation: Math.random() * Math.PI * 2,
        petalCount: 5 + Math.floor(Math.random() * 4),
        color: roseColors[i % roseColors.length],
        delay: i * 0.15 // Розы распускаются по очереди
      })
    }

    // Функция для рисования реалистичного лепестка розы
    const drawRealisticPetal = (
      ctx: CanvasRenderingContext2D,
      centerX: number,
      centerY: number,
      width: number,
      height: number,
      rotation: number,
      color: string,
      progress: number
    ) => {
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(rotation)

      // Реалистичная форма лепестка с кривыми Безье
      const w = width * progress
      const h = height * progress
      
      ctx.beginPath()
      // Верхняя часть лепестка (закругленная)
      ctx.moveTo(0, -h * 0.5)
      ctx.bezierCurveTo(
        -w * 0.3, -h * 0.6,
        -w * 0.5, -h * 0.4,
        -w * 0.5, -h * 0.2
      )
      // Левая сторона
      ctx.bezierCurveTo(
        -w * 0.5, 0,
        -w * 0.4, h * 0.2,
        -w * 0.25, h * 0.4
      )
      // Нижняя часть (заостренная)
      ctx.bezierCurveTo(
        -w * 0.1, h * 0.5,
        0, h * 0.5,
        w * 0.1, h * 0.5
      )
      // Правая сторона
      ctx.bezierCurveTo(
        w * 0.25, h * 0.4,
        w * 0.4, h * 0.2,
        w * 0.5, 0
      )
      // Верхняя правая часть
      ctx.bezierCurveTo(
        w * 0.5, -h * 0.2,
        w * 0.3, -h * 0.4,
        0, -h * 0.5
      )
      ctx.closePath()

      // Градиент для лепестка (от светлого к темному)
      const gradient = ctx.createLinearGradient(-w, 0, w, 0)
      // Создаем более светлый оттенок
      const rgb = parseInt(color.slice(1), 16)
      const r = Math.min(255, ((rgb >> 16) & 0xff) + 30)
      const g = Math.min(255, ((rgb >> 8) & 0xff) + 30)
      const b = Math.min(255, (rgb & 0xff) + 30)
      const lightColor = `rgb(${r}, ${g}, ${b})`
      gradient.addColorStop(0, lightColor.replace('rgb', 'rgba').replace(')', ', 0.9)'))
      gradient.addColorStop(0.3, color + 'FF')
      gradient.addColorStop(0.7, color + 'DD')
      gradient.addColorStop(1, color + 'BB')
      ctx.fillStyle = gradient
      ctx.fill()

      // Тень на лепестке (для объема)
      if (progress > 0.4) {
        const shadowGradient = ctx.createRadialGradient(
          -w * 0.2, h * 0.1,
          0,
          -w * 0.2, h * 0.1,
          w * 0.4
        )
        shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.15)')
        shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = shadowGradient
        ctx.fill()
      }

      // Жилки на лепестке
      if (progress > 0.5) {
        ctx.strokeStyle = color + '80'
        ctx.lineWidth = 1
        ctx.beginPath()
        // Центральная жилка
        ctx.moveTo(0, -h * 0.5)
        ctx.quadraticCurveTo(0, 0, 0, h * 0.5)
        ctx.stroke()
        
        // Боковые жилки
        for (let i = -1; i <= 1; i += 2) {
          ctx.beginPath()
          ctx.moveTo(0, -h * 0.3)
          ctx.quadraticCurveTo(
            i * w * 0.2, 0,
            i * w * 0.3, h * 0.3
          )
          ctx.stroke()
        }
      }

      // Блик на лепестке (для реалистичности)
      if (progress > 0.3) {
        const highlightGradient = ctx.createRadialGradient(
          -w * 0.15, -h * 0.2,
          0,
          -w * 0.15, -h * 0.2,
          w * 0.3
        )
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)')
        highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)')
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
        ctx.fillStyle = highlightGradient
        ctx.beginPath()
        ctx.arc(-w * 0.15, -h * 0.2, w * 0.3, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }

    const drawRose = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      petalCount: number,
      color: string,
      bloomProgress: number
    ) => {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rotation)

      // Центр розы (тычинки) - реалистичный
      const centerSize = size * 0.1 * Math.min(bloomProgress * 1.8, 1)
      if (centerSize > 0) {
        // Внешний круг центра
        const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, centerSize * 1.5)
        centerGradient.addColorStop(0, '#ffd700')
        centerGradient.addColorStop(0.5, '#ffed4e')
        centerGradient.addColorStop(1, '#ffd70080')
        ctx.fillStyle = centerGradient
        ctx.beginPath()
        ctx.arc(0, 0, centerSize * 1.5, 0, Math.PI * 2)
        ctx.fill()

        // Внутренний круг (более темный)
        const innerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, centerSize)
        innerGradient.addColorStop(0, '#ffa500')
        innerGradient.addColorStop(1, '#ffd700')
        ctx.fillStyle = innerGradient
        ctx.beginPath()
        ctx.arc(0, 0, centerSize, 0, Math.PI * 2)
        ctx.fill()

        // Тычинки (маленькие точки)
        if (bloomProgress > 0.4) {
          ctx.fillStyle = '#8B4513'
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2
            const tx = Math.cos(angle) * centerSize * 0.6
            const ty = Math.sin(angle) * centerSize * 0.6
            ctx.beginPath()
            ctx.arc(tx, ty, centerSize * 0.15, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }

      // Слой 1: Самые внутренние маленькие лепестки (появляются первыми)
      const innerLayer1Progress = Math.min(bloomProgress * 2, 1)
      const innerLayer1Count = Math.floor(petalCount * 0.4)
      for (let i = 0; i < innerLayer1Count; i++) {
        const angle = (i / innerLayer1Count) * Math.PI * 2
        const petalX = Math.cos(angle) * (size * 0.12 * innerLayer1Progress)
        const petalY = Math.sin(angle) * (size * 0.12 * innerLayer1Progress)
        drawRealisticPetal(
          ctx,
          petalX, petalY,
          size * 0.2, size * 0.15,
          angle + Math.PI / 2,
          color,
          innerLayer1Progress
        )
      }

      // Слой 2: Внутренние лепестки среднего размера
      const innerLayer2Progress = Math.max(0, Math.min((bloomProgress - 0.2) * 1.5, 1))
      const innerLayer2Count = Math.floor(petalCount * 0.6)
      for (let i = 0; i < innerLayer2Count; i++) {
        const angle = (i / innerLayer2Count) * Math.PI * 2 + Math.PI / innerLayer2Count
        const petalX = Math.cos(angle) * (size * 0.2 * innerLayer2Progress)
        const petalY = Math.sin(angle) * (size * 0.2 * innerLayer2Progress)
        drawRealisticPetal(
          ctx,
          petalX, petalY,
          size * 0.3, size * 0.25,
          angle + Math.PI / 2,
          color,
          innerLayer2Progress
        )
      }

      // Слой 3: Средние лепестки
      const middleLayerProgress = Math.max(0, Math.min((bloomProgress - 0.35) * 1.5, 1))
      const middleLayerCount = petalCount
      for (let i = 0; i < middleLayerCount; i++) {
        const angle = (i / middleLayerCount) * Math.PI * 2
        const petalX = Math.cos(angle) * (size * 0.28 * middleLayerProgress)
        const petalY = Math.sin(angle) * (size * 0.28 * middleLayerProgress)
        drawRealisticPetal(
          ctx,
          petalX, petalY,
          size * 0.4, size * 0.35,
          angle + Math.PI / 2 + Math.sin(angle) * 0.2,
          color,
          middleLayerProgress
        )
      }

      // Слой 4: Внешние большие лепестки (появляются последними)
      const outerLayerProgress = Math.max(0, Math.min((bloomProgress - 0.5) * 2, 1))
      const outerLayerCount = petalCount
      for (let i = 0; i < outerLayerCount; i++) {
        const angle = (i / outerLayerCount) * Math.PI * 2 + Math.PI / outerLayerCount
        const petalX = Math.cos(angle) * (size * 0.38 * outerLayerProgress)
        const petalY = Math.sin(angle) * (size * 0.38 * outerLayerProgress)
        const petalRotation = angle + Math.PI / 2 + Math.sin(angle) * 0.3
        drawRealisticPetal(
          ctx,
          petalX, petalY,
          size * 0.5, size * 0.45,
          petalRotation,
          color,
          outerLayerProgress
        )
      }

      // Стебель (если роза достаточно распустилась)
      if (bloomProgress > 0.6) {
        const stemProgress = Math.max(0, (bloomProgress - 0.6) / 0.4)
        // Градиент для стебля
        const stemGradient = ctx.createLinearGradient(0, size * 0.5, 0, size * 1.0)
        stemGradient.addColorStop(0, '#228B22')
        stemGradient.addColorStop(0.5, '#32CD32')
        stemGradient.addColorStop(1, '#228B22')
        ctx.strokeStyle = stemGradient
        ctx.lineWidth = size * 0.06 * stemProgress
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.beginPath()
        ctx.moveTo(0, size * 0.5)
        ctx.quadraticCurveTo(
          size * 0.08, size * 0.65,
          size * 0.12, size * 0.8
        )
        ctx.quadraticCurveTo(
          size * 0.1, size * 0.95,
          size * 0.08, size * 1.1
        )
        ctx.stroke()

        // Листья (реалистичные)
        const leafProgress = Math.max(0, (bloomProgress - 0.7) / 0.3)
        if (leafProgress > 0) {
          ctx.save()
          ctx.translate(size * 0.1, size * 0.85)
          ctx.rotate(-0.3)

          // Форма листа
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.bezierCurveTo(
            size * 0.1 * leafProgress, -size * 0.05 * leafProgress,
            size * 0.15 * leafProgress, size * 0.05 * leafProgress,
            size * 0.2 * leafProgress, size * 0.1 * leafProgress
          )
          ctx.bezierCurveTo(
            size * 0.15 * leafProgress, size * 0.15 * leafProgress,
            size * 0.1 * leafProgress, size * 0.1 * leafProgress,
            0, 0
          )
          ctx.closePath()

          // Градиент для листа
          const leafGradient = ctx.createLinearGradient(0, 0, size * 0.2 * leafProgress, size * 0.15 * leafProgress)
          leafGradient.addColorStop(0, '#32CD32')
          leafGradient.addColorStop(0.5, '#228B22')
          leafGradient.addColorStop(1, '#006400')
          ctx.fillStyle = leafGradient
          ctx.fill()

          // Жилка листа
          ctx.strokeStyle = '#006400'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(size * 0.2 * leafProgress, size * 0.1 * leafProgress)
          ctx.stroke()

          ctx.restore()
        }
      }

      ctx.restore()
    }

    const animate = () => {
      if (!isVisible || canvas.width === 0 || canvas.height === 0) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Фон с более красивым градиентом
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height)
      )
      gradient.addColorStop(0, 'rgba(255, 182, 193, 0.4)')
      gradient.addColorStop(0.5, 'rgba(255, 192, 203, 0.3)')
      gradient.addColorStop(1, 'rgba(255, 228, 225, 0.2)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Рисуем розы с прогрессом распускания
      roses.forEach((rose) => {
        const roseProgress = Math.max(0, Math.min(1, (animationProgress - rose.delay) / 0.85))
        // Легкое покачивание розы
        const sway = Math.sin(animationProgress * 2 + rose.rotation) * 2
        drawRose(
          ctx,
          rose.x + sway,
          rose.y,
          rose.size,
          rose.rotation + animationProgress * 0.3,
          rose.petalCount,
          rose.color,
          roseProgress
        )
      })

      if (isVisible) {
        animationFrameRef.current = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isVisible, animationProgress])

  if (!enabled || !isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-pink-50 via-rose-50 to-pink-100 overflow-hidden"
          style={{ pointerEvents: 'none' }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: 'none' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="relative z-10 text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.5 }}
              className="text-2xl md:text-4xl font-playfair text-pink-600 font-semibold"
            >
              Добро пожаловать
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

