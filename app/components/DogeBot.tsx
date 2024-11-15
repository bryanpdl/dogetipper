"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface DogeBotProps {
  isDark: boolean;
  followDistance?: number;
}

export function DogeBot({ isDark, followDistance = 32 }: DogeBotProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [velocity, setVelocity] = useState({ x: 0, y: 0 })
  const targetPositionRef = useRef({ x: 0, y: 0 })
  const [isWaving, setIsWaving] = useState(false)
  const lastMouseMove = useRef(Date.now())
  const animationFrameRef = useRef<number>()
  const idleAnimationAngle = useRef(0)
  const lastTimestamp = useRef(performance.now())

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetPositionRef.current = { x: e.clientX, y: e.clientY }
      lastMouseMove.current = Date.now()
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Smooth follow animation with physics
  useEffect(() => {
    const SPRING_STRENGTH = 0.15
    const DAMPING = 0.25
    const MAX_VELOCITY = 20
    const IDLE_RADIUS = 15
    const IDLE_SPEED = 0.05

    const animatePosition = (timestamp: number) => {
      const deltaTime = (timestamp - lastTimestamp.current) / 16 // Normalize to ~60fps
      lastTimestamp.current = timestamp

      const now = Date.now()
      const timeSinceLastMove = now - lastMouseMove.current
      const isIdle = timeSinceLastMove > 1000

      let targetX = targetPositionRef.current.x
      let targetY = targetPositionRef.current.y

      // Add circular motion when idle
      if (isIdle) {
        idleAnimationAngle.current += IDLE_SPEED * deltaTime
        targetX += Math.sin(idleAnimationAngle.current) * IDLE_RADIUS
        targetY += Math.cos(idleAnimationAngle.current) * IDLE_RADIUS
      }

      // Calculate spring physics
      setPosition(currentPos => {
        setVelocity(currentVel => {
          // Calculate spring force
          const dx = targetX - currentPos.x
          const dy = targetY - currentPos.y
          
          // Apply spring force to velocity
          const newVelX = (currentVel.x + dx * SPRING_STRENGTH * deltaTime) * DAMPING
          const newVelY = (currentVel.y + dy * SPRING_STRENGTH * deltaTime) * DAMPING

          // Clamp velocity
          const clampedVelX = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, newVelX))
          const clampedVelY = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, newVelY))

          return { x: clampedVelX, y: clampedVelY }
        })

        // Update position based on velocity
        return {
          x: currentPos.x + velocity.x * deltaTime,
          y: currentPos.y + velocity.y * deltaTime
        }
      })

      animationFrameRef.current = requestAnimationFrame(animatePosition)
    }

    animationFrameRef.current = requestAnimationFrame(animatePosition)
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [velocity])

  // Random waving animation
  useEffect(() => {
    const waveInterval = setInterval(() => {
      const now = Date.now()
      const timeSinceLastMove = now - lastMouseMove.current
      const isIdle = timeSinceLastMove > 1000

      if (Math.random() < (isIdle ? 0.2 : 0.1)) {
        setIsWaving(true)
        setTimeout(() => setIsWaving(false), 1000)
      }
    }, 2000)
    return () => clearInterval(waveInterval)
  }, [])

  return (
    <div
      className="fixed pointer-events-none z-50 will-change-transform"
      style={{
        transform: `translate(${position.x - followDistance}px, ${position.y - followDistance}px)`,
      }}
    >
      <div
        className={cn(
          "relative w-12 h-12 rounded-full p-1 transition-colors duration-300",
          isDark ? "bg-[#2a2f3a]" : "bg-[#e0e5ec]"
        )}
        style={{
          boxShadow: isDark
            ? "4px 4px 8px #1e222a, -4px -4px 8px #36404a"
            : "4px 4px 8px #c8ccd4, -4px -4px 8px #ffffff",
          animation: isWaving ? 'bounce 0.5s ease infinite' : undefined
        }}
      >
        <div className="relative w-full h-full overflow-hidden rounded-full">
          <Image
            src="/images/dogee.png"
            alt="Doge"
            fill
            className="object-cover"
            sizes="64px"
            priority
          />
        </div>
      </div>
    </div>
  )
}