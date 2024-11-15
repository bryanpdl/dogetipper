"use client"

import { useState } from "react"
import { Home, Send, User, Users, Bell, Settings, Menu } from 'lucide-react'
import { cn } from "@/lib/utils"
import { HomeView } from "./components/HomeView"
import { DogeBot } from "@/app/components/DogeBot"
import { SendTip } from "./components/SendTip"

export default function DashboardPage() {
  const [currentPath, setCurrentPath] = useState('home')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const navItems = [
    { icon: Home, label: 'Home', path: 'home' },
    { icon: Send, label: 'Send Tip', path: 'send-tip' },
    { icon: User, label: 'Profile', path: 'profile' },
    { icon: Users, label: 'Community', path: 'community' },
  ]

  return (
    <div className="min-h-screen bg-[#161616]">
      <DogeBot isDark={true} followDistance={-62} />
      
      {/* Navigation Bar */}
      <nav className={cn(
        "fixed bottom-0 sm:top-0 sm:bottom-auto z-50 w-full border-t sm:border-t-0 sm:border-b px-4 py-2",
        "bg-[#1a1a1a] border-[#2a2a2a]"
      )}>
        <div className="mx-auto flex h-14 max-w-6xl items-center">
          {/* Mobile Menu Button - Only show on mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden absolute left-4 p-2 text-gray-400 hover:text-gray-300"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Center nav items on mobile */}
          <div className="flex-1 flex justify-center sm:justify-start">
            <div className="flex items-center gap-1 sm:gap-2">
              {navItems.map(({ icon: Icon, label, path }) => (
                <button
                  key={path}
                  onClick={() => setCurrentPath(path)}
                  className={cn(
                    "group relative rounded-lg px-3 py-2 transition-all duration-300",
                    "hover:bg-[#2a2a2a]",
                    currentPath === path ? "text-blue-400" : "text-gray-400",
                    "flex flex-col sm:flex-row items-center gap-1 sm:gap-2"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] sm:text-sm font-medium">{label}</span>
                  {currentPath === path && (
                    <span className={cn(
                      "absolute bottom-0 left-0 h-0.5 w-full rounded-full",
                      "bg-blue-400"
                    )} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right side icons - Hide on mobile */}
          <div className="hidden sm:flex items-center gap-2">
            <button className={cn(
              "relative rounded-lg p-2 transition-all duration-300",
              "hover:bg-[#2a2a2a]",
              "text-gray-400 hover:text-gray-300"
            )}>
              <Bell className="h-5 w-5" />
              <span className={cn(
                "absolute right-1 top-1 h-2 w-2 rounded-full",
                "bg-blue-400",
                "animate-pulse"
              )} />
            </button>
            <button className={cn(
              "rounded-lg p-2 transition-all duration-300",
              "hover:bg-[#2a2a2a]",
              "text-gray-400 hover:text-gray-300"
            )}>
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 sm:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute bottom-16 right-4 w-48 rounded-xl bg-[#1a1a1a] p-2 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="space-y-1">
              <button className={cn(
                "w-full flex items-center gap-2 rounded-lg px-3 py-2",
                "hover:bg-[#2a2a2a] text-gray-400 hover:text-gray-300"
              )}>
                <Bell className="h-5 w-5" />
                <span className="text-sm">Notifications</span>
              </button>
              <button className={cn(
                "w-full flex items-center gap-2 rounded-lg px-3 py-2",
                "hover:bg-[#2a2a2a] text-gray-400 hover:text-gray-300"
              )}>
                <Settings className="h-5 w-5" />
                <span className="text-sm">Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 pt-6 pb-24 sm:pt-24 sm:pb-6">
        {currentPath === 'home' && <HomeView />}
        {currentPath === 'send-tip' && <SendTip />}
      </main>
    </div>
  )
} 