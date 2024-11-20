"use client"

import { useState } from "react"
import { Home, Send, User, Users, Bell, Settings, Menu, X } from 'lucide-react'
import { cn } from "@/lib/utils"
import { HomeView } from "./components/HomeView"
import { DogeBot } from "@/app/components/DogeBot"
import { SendTip } from "./components/SendTip"
import { NeumorphicButton } from "@/app/components/NeumorphicButton"
import { ProfileView } from "./components/ProfileView"

export default function DashboardPage() {
  const [currentPath, setCurrentPath] = useState('home')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const navItems = [
    { icon: Home, label: 'Home', path: 'home' },
    { icon: Send, label: 'Send & Receive', path: 'send-tip' },
    { icon: User, label: 'Profile', path: 'profile' },
    { icon: Users, label: 'Community', path: 'community' },
  ]

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <DogeBot isDark={true} followDistance={-62} />
      
      {/* Sidebar Navigation */}
      <nav className="fixed top-0 left-0 bottom-0 hidden lg:flex flex-col gap-6 p-6 w-72 bg-[#1c1c1c]">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-500" />
          <span className="text-lg font-medium text-white">DogeTip</span>
        </div>

        {/* Main Nav Items */}
        <div className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NeumorphicButton
                key={item.path}
                variant="secondary"
                onClick={() => setCurrentPath(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3",
                  currentPath === item.path 
                    ? "bg-[#222222] text-white" 
                    : "text-gray-400 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NeumorphicButton>
            )
          })}
        </div>

        {/* Bottom Nav Items */}
        <div className="space-y-2">
          <NeumorphicButton
            variant="secondary"
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white"
          >
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
          </NeumorphicButton>
          
          <NeumorphicButton
            variant="secondary"
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </NeumorphicButton>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-0 left-0 bottom-0 w-72 p-6 bg-[#1c1c1c]">
            {/* Mobile menu items - same structure as above */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-500" />
                <span className="text-lg font-medium text-white">DogeTip</span>
              </div>
              <NeumorphicButton
                variant="secondary"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </NeumorphicButton>
            </div>

            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <NeumorphicButton
                    key={item.path}
                    variant="secondary"
                    onClick={() => {
                      setCurrentPath(item.path)
                      setIsMobileMenuOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3",
                      currentPath === item.path 
                        ? "bg-[#222222] text-white" 
                        : "text-gray-400 hover:text-white"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </NeumorphicButton>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Header */}
      <div className="sticky top-0 z-40 lg:hidden">
        <div className="flex items-center justify-between p-4 bg-[#1c1c1c]">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-500" />
            <span className="text-lg font-medium text-white">DogeTip</span>
          </div>
          <NeumorphicButton
            variant="secondary"
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-400 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </NeumorphicButton>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="lg:pl-72">
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-24 sm:pt-24 sm:pb-6">
          {currentPath === 'home' && <HomeView />}
          {currentPath === 'send-tip' && <SendTip />}
          {currentPath === 'profile' && <ProfileView />}
        </div>
      </main>
    </div>
  )
} 