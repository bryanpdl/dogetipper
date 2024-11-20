"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface DogeBotProps {
  isDark: boolean;
  followDistance?: number;
}

export function DogeBot({ isDark, followDistance = 1 }: DogeBotProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [velocity, setVelocity] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isExcited, setIsExcited] = useState(false)
  const targetPositionRef = useRef({ x: 0, y: 0 })
  const [isWaving, setIsWaving] = useState(false)
  const lastMouseMove = useRef(Date.now())
  const animationFrameRef = useRef<number>()
  const idleAnimationAngle = useRef(0)
  const lastTimestamp = useRef(performance.now())
  const lastClickTime = useRef(Date.now())
  const clickCount = useRef(0)
  const [isIdle, setIsIdle] = useState(true)
  const idleTargetRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const idleTimeoutRef = useRef<NodeJS.Timeout>()
  const lastIdleUpdateRef = useRef(Date.now())

  // Handle mouse movement with velocity-based reactions
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setIsIdle(false)
      const prevX = targetPositionRef.current.x
      const prevY = targetPositionRef.current.y
      targetPositionRef.current = { x: e.clientX, y: e.clientY }
      
      // Calculate mouse velocity
      const dx = e.clientX - prevX
      const dy = e.clientY - prevY
      const mouseSpeed = Math.sqrt(dx * dx + dy * dy)
      
      if (mouseSpeed > 50) {
        setIsExcited(true)
        setTimeout(() => setIsExcited(false), 500)
      }
      
      lastMouseMove.current = Date.now()

      // Reset idle timeout
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current)
      }
      idleTimeoutRef.current = setTimeout(() => {
        setIsIdle(true)
        // Set initial idle target to current position for smooth transition
        idleTargetRef.current = { x: e.clientX, y: e.clientY }
      }, 2000) // Go idle after 2 seconds of no movement
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current)
      }
    }
  }, [])

  // Handle clicks and interactions
  useEffect(() => {
    const handleClick = () => {
      const now = Date.now()
      if (now - lastClickTime.current < 500) {
        clickCount.current++
        if (clickCount.current >= 3) {
          // Trigger special animation for rapid clicks
          setRotation(rotation => rotation + 360)
          setScale(1.2)
          setTimeout(() => setScale(1), 500)
          clickCount.current = 0
        }
      } else {
        clickCount.current = 1
      }
      lastClickTime.current = now
      
      // Basic click reaction
      setScale(0.8)
      setTimeout(() => setScale(1), 150)
    }

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  // Enhanced physics animation
  useEffect(() => {
    const SPRING_STRENGTH = 0.03
    const DAMPING = 0.92
    const MAX_VELOCITY = 15
    const IDLE_UPDATE_INTERVAL = 5000
    const IDLE_SPRING_MULTIPLIER = 0.3

    const generateIdleTarget = () => {
      const padding = 100
      return {
        x: padding + Math.random() * (window.innerWidth - 2 * padding),
        y: padding + Math.random() * (window.innerHeight - 2 * padding)
      }
    }

    const animatePosition = (timestamp: number) => {
      const deltaTime = Math.min((timestamp - lastTimestamp.current) / 16, 2)
      lastTimestamp.current = timestamp

      // Update idle target periodically
      if (isIdle && Date.now() - lastIdleUpdateRef.current > IDLE_UPDATE_INTERVAL) {
        idleTargetRef.current = generateIdleTarget()
        lastIdleUpdateRef.current = Date.now()
      }

      const targetX = isIdle ? idleTargetRef.current.x : targetPositionRef.current.x
      const targetY = isIdle ? idleTargetRef.current.y : targetPositionRef.current.y

      // Calculate spring physics with easing
      setPosition(currentPos => {
        setVelocity(currentVel => {
          const dx = targetX - currentPos.x
          const dy = targetY - currentPos.y
          
          // Apply easing based on distance
          const distance = Math.sqrt(dx * dx + dy * dy)
          const easing = Math.max(0.5, Math.min(1, distance / 500))
          
          // Adjust spring strength based on state and distance
          const springStrength = isIdle 
            ? SPRING_STRENGTH * IDLE_SPRING_MULTIPLIER 
            : SPRING_STRENGTH * easing

          const newVelX = (currentVel.x + dx * springStrength * deltaTime) * DAMPING
          const newVelY = (currentVel.y + dy * springStrength * deltaTime) * DAMPING

          // Smoother velocity clamping
          const speed = Math.sqrt(newVelX * newVelX + newVelY * newVelY)
          const speedFactor = speed > MAX_VELOCITY ? MAX_VELOCITY / speed : 1

          return {
            x: newVelX * speedFactor,
            y: newVelY * speedFactor
          }
        })

        return {
          x: currentPos.x + velocity.x * deltaTime,
          y: currentPos.y + velocity.y * deltaTime
        }
      })

      // Smoother rotation calculation
      const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y)
      const rotationSpeed = isIdle ? speed * 1 : speed * 1.5
      setRotation(prev => {
        const targetRotation = rotationSpeed * Math.sign(velocity.x)
        return prev + (targetRotation - prev) * 0.1
      })

      animationFrameRef.current = requestAnimationFrame(animatePosition)
    }

    animationFrameRef.current = requestAnimationFrame(animatePosition)
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [velocity, isIdle])

  return (
    <div
      className="fixed pointer-events-none z-50 will-change-transform"
      style={{
        transform: `translate(${position.x - followDistance}px, ${position.y - followDistance}px)`,
      }}
    >
      <div
        className={cn(
          "relative w-12 h-12 rounded-full p-1 transition-all duration-300",
          isDark ? "bg-[#2a2f3a]" : "bg-[#e0e5ec]",
          isExcited && "animate-wiggle"
        )}
        style={{
          boxShadow: isDark
            ? "4px 4px 8px #1e222a, -4px -4px 8px #36404a, inset 1px 1px 1px rgba(255, 255, 255, 0.1)"
            : "4px 4px 8px #c8ccd4, -4px -4px 8px #ffffff, inset 1px 1px 1px rgba(255, 255, 255, 0.5)",
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          animation: cn(
            isWaving && 'bounce 0.5s ease infinite',
            isExcited && 'wiggle 0.3s ease-in-out'
          )
        }}
      >
        <div className={cn(
          "relative w-full h-full overflow-hidden rounded-full",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent",
          "after:absolute after:inset-0 after:bg-black/10 after:opacity-0 hover:after:opacity-100",
          "transition-all duration-300"
        )}>
          <Image
            src="/images/dogee.png"
            alt="Doge"
            fill
            className={cn(
              "object-cover",
              "transition-transform duration-300",
              isExcited && "scale-110"
            )}
            sizes="64px"
            priority
          />
        </div>
      </div>
    </div>
  )
}