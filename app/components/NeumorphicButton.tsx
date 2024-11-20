"use client"

import { cn } from "@/lib/utils"
import { useState, useRef } from "react"

interface RippleEffect {
  x: number
  y: number
  id: number
}

interface NeumorphicButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function NeumorphicButton({ 
  children, 
  variant = "primary", 
  className,
  onClick,
  disabled
}: NeumorphicButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [ripples, setRipples] = useState<RippleEffect[]>([])
  const nextRippleId = useRef(0)

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault()
      return
    }

    // Create ripple effect
    const button = e.currentTarget.getBoundingClientRect()
    const rippleX = e.clientX - button.left
    const rippleY = e.clientY - button.top
    
    const newRipple = {
      x: rippleX,
      y: rippleY,
      id: nextRippleId.current
    }
    
    nextRippleId.current += 1
    setRipples(prev => [...prev, newRipple])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, 800)

    onClick?.()
  }

  const shadowStyles = {
    primary: {
      normal: "8px 8px 24px rgba(0, 0, 0, 0.4), -8px -8px 24px rgba(255, 255, 255, 0.03)",
      pressed: "inset 4px 4px 16px rgba(0, 0, 0, 0.45), inset -4px -4px 16px rgba(255, 255, 255, 0.03)",
      hover: "10px 10px 28px rgba(0, 0, 0, 0.4), -10px -10px 28px rgba(255, 255, 255, 0.03)"
    },
    secondary: {
      normal: "8px 8px 24px rgba(0, 0, 0, 0.4), -8px -8px 24px rgba(255, 255, 255, 0.03)",
      pressed: "inset 4px 4px 16px rgba(0, 0, 0, 0.45), inset -4px -4px 16px rgba(255, 255, 255, 0.03)",
      hover: "10px 10px 28px rgba(0, 0, 0, 0.4), -10px -10px 28px rgba(255, 255, 255, 0.03)"
    }
  }

  const glossyOverlay = "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/[0.08] before:to-transparent before:opacity-60 before:transition-opacity before:duration-300 hover:before:opacity-80"

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => !disabled && setIsPressed(false)}
      onMouseLeave={() => {
        setIsPressed(false)
        setIsHovered(false)
      }}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      className={cn(
        "group relative overflow-hidden rounded-xl px-6 py-3 text-sm font-medium",
        "transition-all duration-500 ease-out",
        "inline-flex items-center",
        variant === "primary" 
          ? "bg-blue-500 text-white hover:bg-blue-600" 
          : "bg-[#222222] text-gray-300",
        disabled && "opacity-50 cursor-not-allowed",
        isPressed && "animate-button-press",
        !isPressed && isHovered && "translate-y-[-1px]",
        glossyOverlay,
        className
      )}
      style={{
        boxShadow: isPressed 
          ? shadowStyles[variant].pressed 
          : isHovered 
            ? shadowStyles[variant].hover 
            : shadowStyles[variant].normal,
        transition: "all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)"
      }}
    >
      <span className={cn(
        "inline-flex items-center gap-2",
        "transition-all duration-500",
        isHovered && !isPressed && "text-glow"
      )}>
        {children}
      </span>
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}
    </button>
  )
}