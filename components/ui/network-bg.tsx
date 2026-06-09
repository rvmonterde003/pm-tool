'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
}

const CANVAS_BG = '#1a1a1a'
const CONNECT_DISTANCE = 140
const DOT_RADIUS = 1.5
const COUNT_DIVISOR = 18_000
const MAX_PARTICLES = 55
const CELL_SIZE = CONNECT_DISTANCE

export function NetworkBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return

    const rawContext = canvasEl.getContext('2d', { alpha: false })
    if (!rawContext) return
    const context: CanvasRenderingContext2D = rawContext

    let animationId = 0
    let particles: Particle[] = []
    let width = 0
    let height = 0
    let isVisible = true

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function createParticles(w: number, h: number) {
      const count = Math.min(MAX_PARTICLES, Math.max(28, Math.floor((w * h) / COUNT_DIVISOR)))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }))
    }

    function resize() {
      const el = canvasRef.current
      if (!el) return

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      const rect = el.getBoundingClientRect()
      width = rect.width
      height = rect.height
      el.width = Math.floor(width * dpr)
      el.height = Math.floor(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      createParticles(width, height)
    }

    function tickParticles() {
      if (reducedMotion) return

      for (const particle of particles) {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x <= 0 || particle.x >= width) particle.vx *= -1
        if (particle.y <= 0 || particle.y >= height) particle.vy *= -1

        particle.x = Math.max(0, Math.min(width, particle.x))
        particle.y = Math.max(0, Math.min(height, particle.y))
      }
    }

    function drawConnections() {
      const grid = new Map<string, number[]>()

      for (let index = 0; index < particles.length; index++) {
        const particle = particles[index]
        const cellX = Math.floor(particle.x / CELL_SIZE)
        const cellY = Math.floor(particle.y / CELL_SIZE)
        const key = `${cellX},${cellY}`
        const bucket = grid.get(key)
        if (bucket) bucket.push(index)
        else grid.set(key, [index])
      }

      context.lineWidth = 1

      for (let index = 0; index < particles.length; index++) {
        const a = particles[index]
        const cellX = Math.floor(a.x / CELL_SIZE)
        const cellY = Math.floor(a.y / CELL_SIZE)

        for (let offsetX = -1; offsetX <= 1; offsetX++) {
          for (let offsetY = -1; offsetY <= 1; offsetY++) {
            const neighbors = grid.get(`${cellX + offsetX},${cellY + offsetY}`)
            if (!neighbors) continue

            for (const neighborIndex of neighbors) {
              if (neighborIndex <= index) continue

              const b = particles[neighborIndex]
              const dx = a.x - b.x
              const dy = a.y - b.y
              const distance = Math.hypot(dx, dy)
              if (distance >= CONNECT_DISTANCE) continue

              const strength = 1 - distance / CONNECT_DISTANCE
              context.strokeStyle = `rgba(255, 107, 0, ${strength * 0.2})`
              context.beginPath()
              context.moveTo(a.x, a.y)
              context.lineTo(b.x, b.y)
              context.stroke()
            }
          }
        }
      }
    }

    function draw() {
      context.fillStyle = CANVAS_BG
      context.fillRect(0, 0, width, height)

      drawConnections()

      context.fillStyle = 'rgba(240, 240, 240, 0.4)'
      for (const particle of particles) {
        context.beginPath()
        context.arc(particle.x, particle.y, DOT_RADIUS, 0, Math.PI * 2)
        context.fill()
      }
    }

    function frame() {
      if (!isVisible) {
        animationId = requestAnimationFrame(frame)
        return
      }

      tickParticles()
      draw()
      animationId = requestAnimationFrame(frame)
    }

    function handleVisibilityChange() {
      isVisible = document.visibilityState === 'visible'
    }

    resize()
    draw()
    if (!reducedMotion) animationId = requestAnimationFrame(frame)

    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 h-full w-full pointer-events-none"
      aria-hidden
    />
  )
}
