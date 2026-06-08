'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
}

const CANVAS_BG = '#1a1a1a'
const CONNECT_DISTANCE = 150
const DOT_RADIUS = 1.75
const COUNT_DIVISOR = 11_000

export function NetworkBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return

    const rawContext = canvasEl.getContext('2d')
    if (!rawContext) return
    const context: CanvasRenderingContext2D = rawContext

    let animationId = 0
    let particles: Particle[] = []
    let width = 0
    let height = 0

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function createParticles(w: number, h: number) {
      const count = Math.min(100, Math.max(40, Math.floor((w * h) / COUNT_DIVISOR)))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }))
    }

    function resize() {
      const el = canvasRef.current
      if (!el) return

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
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

    function draw() {
      context.fillStyle = CANVAS_BG
      context.fillRect(0, 0, width, height)

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distance = Math.hypot(dx, dy)

          if (distance >= CONNECT_DISTANCE) continue

          const strength = 1 - distance / CONNECT_DISTANCE
          context.strokeStyle = `rgba(255, 107, 0, ${strength * 0.22})`
          context.lineWidth = 1
          context.beginPath()
          context.moveTo(a.x, a.y)
          context.lineTo(b.x, b.y)
          context.stroke()
        }
      }

      for (const particle of particles) {
        context.beginPath()
        context.arc(particle.x, particle.y, DOT_RADIUS, 0, Math.PI * 2)
        context.fillStyle = 'rgba(240, 240, 240, 0.45)'
        context.fill()
      }
    }

    function frame() {
      tickParticles()
      draw()
      animationId = requestAnimationFrame(frame)
    }

    resize()
    draw()
    if (!reducedMotion) animationId = requestAnimationFrame(frame)

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
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
