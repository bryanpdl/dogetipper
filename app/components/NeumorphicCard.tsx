"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface NeumorphicCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function NeumorphicCard({ 
  icon: Icon, 
  title, 
  description, 
  className
}: NeumorphicCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const shadowStyles = {
    normal: "8px 8px 24px rgba(0, 0, 0, 0.4), -8px -8px 24px rgba(255, 255, 255, 0.03), inset 1px 1px 1px rgba(255, 255, 255, 0.1)",
    hover: "12px 12px 32px rgba(0, 0, 0, 0.45), -12px -12px 32px rgba(255, 255, 255, 0.03), inset 1px 1px 1px rgba(255, 255, 255, 0.1)"
  }

  const glossyOverlay = "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/[0.08] before:to-transparent before:opacity-60"
  
  return (
    <div
      className={cn(
        "group relative rounded-2xl p-6 transition-all duration-300 bg-[#222222]",
        glossyOverlay,
        className
      )}
      style={{
        boxShadow: isHovered ? shadowStyles.hover : shadowStyles.normal
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mb-4">
        <Icon className={cn(
          "h-8 w-8 transition-all duration-300 text-blue-400",
          isHovered && "scale-110"
        )} />
      </div>
      <h3 className="mb-2 text-xl font-bold text-white">
        {title}
      </h3>
      <p className="text-sm text-gray-400">
        {description}
      </p>
    </div>
  )
}