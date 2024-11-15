"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"

interface NeumorphicButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
}

export function NeumorphicButton({ 
  children, 
  variant = "primary", 
  className,
  onClick
}: NeumorphicButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const shadowStyles = {
    primary: {
      normal: "8px 8px 24px rgba(0, 0, 0, 0.4), -8px -8px 24px rgba(255, 255, 255, 0.03), inset 1px 1px 1px rgba(255, 255, 255, 0.1)",
      pressed: "inset 4px 4px 16px rgba(0, 0, 0, 0.45), inset -4px -4px 16px rgba(255, 255, 255, 0.03), inset 1px 1px 1px rgba(255, 255, 255, 0.05)",
      hover: "12px 12px 32px rgba(0, 0, 0, 0.45), -12px -12px 32px rgba(255, 255, 255, 0.04), inset 1px 1px 1px rgba(255, 255, 255, 0.12)"
    },
    secondary: {
      normal: "8px 8px 24px rgba(0, 0, 0, 0.4), -8px -8px 24px rgba(255, 255, 255, 0.03), inset 1px 1px 1px rgba(255, 255, 255, 0.1)",
      pressed: "inset 4px 4px 16px rgba(0, 0, 0, 0.45), inset -4px -4px 16px rgba(255, 255, 255, 0.03), inset 1px 1px 1px rgba(255, 255, 255, 0.05)",
      hover: "12px 12px 32px rgba(0, 0, 0, 0.45), -12px -12px 32px rgba(255, 255, 255, 0.04), inset 1px 1px 1px rgba(255, 255, 255, 0.12)"
    }
  }

  const glossyOverlay = "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/[0.08] before:to-transparent before:opacity-60 before:transition-opacity before:duration-300 hover:before:opacity-80"

  return (
    <button
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => {
        setIsPressed(false)
        setIsHovered(false)
      }}
      onMouseEnter={() => setIsHovered(true)}
      className={cn(
        "group relative overflow-hidden rounded-xl px-6 py-3 text-sm font-medium transition-all duration-300",
        variant === "primary" 
          ? "bg-blue-500 text-white hover:bg-blue-600" 
          : "bg-[#222222] text-gray-300 hover:text-white",
        glossyOverlay,
        className
      )}
      style={{
        boxShadow: isPressed 
          ? shadowStyles[variant].pressed 
          : isHovered 
            ? shadowStyles[variant].hover 
            : shadowStyles[variant].normal
      }}
    >
      {children}
    </button>
  )
}