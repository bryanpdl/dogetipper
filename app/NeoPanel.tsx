"use client"

import * as React from "react"
import { Menu, Power, Volume2, Sun, Moon, Wifi, LucideIcon } from 'lucide-react'
import { cn } from "@/lib/utils"

interface NeumorphicToggleProps {
  icon: LucideIcon;
  defaultChecked?: boolean;
  onToggle?: (checked: boolean) => void;
  isDark: boolean;
}

const NeumorphicToggle = ({ 
  icon: Icon, 
  defaultChecked = false, 
  onToggle, 
  isDark 
}: NeumorphicToggleProps) => {
  const [isChecked, setIsChecked] = React.useState(defaultChecked)

  const handleToggle = () => {
    const newValue = !isChecked
    setIsChecked(newValue)
    onToggle?.(newValue)
  }

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "group relative h-12 w-24 rounded-full p-1 transition-all duration-300",
        isDark ? "bg-[#2a2f3a]" : "bg-[#e0e5ec]"
      )}
      style={{
        boxShadow: isDark
          ? "4px 4px 8px #1e222a, -4px -4px 8px #36404a, inset 2px 2px 4px #36404a, inset -2px -2px 4px #1e222a"
          : "4px 4px 8px #c8ccd4, -4px -4px 8px #ffffff, inset 2px 2px 4px #ffffff, inset -2px -2px 4px #c8ccd4"
      }}
    >
      <div
        className={cn(
          "absolute left-1 top-1 flex h-10 w-[44px] items-center justify-center rounded-full transition-all duration-300",
          isDark ? "bg-[#2a2f3a]" : "bg-[#e0e5ec]",
          isChecked && "left-[calc(100%-44px-4px)]"
        )}
        style={{
          boxShadow: isDark
            ? "inset 3px 3px 6px #1e222a, inset -3px -3px 6px #36404a, 2px 2px 4px #36404a, -2px -2px 4px #1e222a"
            : "inset 3px 3px 6px #c8ccd4, inset -3px -3px 6px #ffffff, 2px 2px 4px #ffffff, -2px -2px 4px #c8ccd4"
        }}
      >
        <Icon
          className={cn(
            "h-5 w-5 transition-all duration-300",
            isChecked ? "text-blue-400" : isDark ? "text-gray-400" : "text-gray-600"
          )}
        />
      </div>
    </button>
  )
}

interface NeumorphicButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  isActive: boolean;
  isDark: boolean;
}

const NeumorphicButton = ({ 
  icon: Icon, 
  label, 
  onClick, 
  isActive, 
  isDark 
}: NeumorphicButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-16 w-16 flex-col items-center justify-center rounded-2xl transition-all duration-300",
        isDark ? "bg-[#2a2f3a] hover:bg-[#2d3340]" : "bg-[#e0e5ec] hover:bg-[#d4d9e0]"
      )}
      style={{
        boxShadow: isDark
          ? "4px 4px 8px #1e222a, -4px -4px 8px #36404a, inset 2px 2px 4px #36404a, inset -2px -2px 4px #1e222a"
          : "4px 4px 8px #c8ccd4, -4px -4px 8px #ffffff, inset 2px 2px 4px #ffffff, inset -2px -2px 4px #c8ccd4"
      }}
    >
      <Icon className={cn("h-6 w-6", isActive ? "text-blue-400" : isDark ? "text-gray-400" : "text-gray-600")} />
      <span className={cn("mt-1 text-xs", isActive ? "text-blue-400" : isDark ? "text-gray-400" : "text-gray-600")}>{label}</span>
    </button>
  )
}

interface NeumorphicSliderProps {
  isDark: boolean;
}

const NeumorphicSlider = ({ isDark }: NeumorphicSliderProps) => {
  return (
    <div className="w-full max-w-[200px]">
      <input
        type="range"
        min="0"
        max="100"
        className={cn(
          "w-full appearance-none rounded-full outline-none",
          isDark ? "bg-[#2a2f3a]" : "bg-[#e0e5ec]"
        )}
        style={{
          height: '12px',
          boxShadow: isDark
            ? "inset 3px 3px 6px #1e222a, inset -3px -3px 6px #36404a"
            : "inset 3px 3px 6px #c8ccd4, inset -3px -3px 6px #ffffff"
        }}
      />
    </div>
  )
}

export default function Component() {
  const [isDarkMode, setIsDarkMode] = React.useState(true)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={cn(
      "flex min-h-screen items-center justify-center p-8 transition-colors duration-300",
      isDarkMode ? "bg-[#2a2f3a]" : "bg-[#e0e5ec]"
    )}>
      <div className={cn(
        "grid gap-8 rounded-3xl p-8 transition-all duration-300",
        isDarkMode ? "bg-[#2a2f3a]" : "bg-[#e0e5ec]"
      )}
        style={{
          boxShadow: isDarkMode
            ? "8px 8px 16px #1e222a, -8px -8px 16px #36404a"
            : "8px 8px 16px #c8ccd4, -8px -8px 16px #ffffff"
        }}
      >
        <div className="flex justify-between gap-4">
          <NeumorphicToggle icon={Power} onToggle={(checked) => console.log('Power:', checked)} isDark={isDarkMode} />
          <NeumorphicToggle icon={Wifi} onToggle={(checked) => console.log('Wifi:', checked)} isDark={isDarkMode} />
          <NeumorphicToggle icon={Menu} onToggle={(checked) => console.log('Menu:', checked)} isDark={isDarkMode} />
        </div>
        <div className="flex items-center justify-between gap-4">
          <Volume2 className={isDarkMode ? "text-gray-400" : "text-gray-600"} />
          <NeumorphicSlider isDark={isDarkMode} />
        </div>
        <div className="flex justify-between gap-4">
          <NeumorphicButton 
            icon={Sun} 
            label="Day" 
            onClick={toggleTheme} 
            isActive={!isDarkMode} 
            isDark={isDarkMode} 
          />
          <NeumorphicButton 
            icon={Moon} 
            label="Night" 
            onClick={toggleTheme} 
            isActive={isDarkMode} 
            isDark={isDarkMode} 
          />
        </div>
      </div>
    </div>
  )
}