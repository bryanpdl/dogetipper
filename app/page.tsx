"use client"

import { useState, useRef, useEffect } from "react"
import { Send, QrCode, Trophy, ArrowRight, Rocket, Sun, Moon, Heart, Globe, Smartphone, Share2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import { NeumorphicCard } from "@/app/components/NeumorphicCard"
import { NeumorphicButton } from "@/app/components/NeumorphicButton"
import { DogeBot } from "@/app/components/DogeBot"
import { useRouter } from "next/navigation"

export default function Component() {
  const router = useRouter()
  const [selectedLeaderboard, setSelectedLeaderboard] = useState<'tippers' | 'receivers'>('tippers')

  const shadowStyles = {
    dark: {
      subtle: isPressed => isPressed
        ? "inset 3px 3px 12px rgba(0, 0, 0, 0.35), inset -3px -3px 12px rgba(255, 255, 255, 0.008)"
        : "8px 8px 32px rgba(0, 0, 0, 0.45), -8px -8px 32px rgba(255, 255, 255, 0.01), inset 1px 1px 1px rgba(255, 255, 255, 0.02)",
      pressed: "inset 4px 4px 16px rgba(0, 0, 0, 0.45), inset -4px -4px 16px rgba(255, 255, 255, 0.008), inset 1px 1px 1px rgba(255, 255, 255, 0.02)",
      normal: "8px 8px 32px rgba(0, 0, 0, 0.45), -8px -8px 32px rgba(255, 255, 255, 0.01), inset 1px 1px 1px rgba(255, 255, 255, 0.02)",
      outset: "16px 16px 48px rgba(0, 0, 0, 0.5), -12px -12px 40px rgba(255, 255, 255, 0.008), inset 1px 1px 1px rgba(255, 255, 255, 0.02)"
    }
  }

  const glossyOverlay = "before:absolute before:inset-0 before:rounded-[42px] before:bg-gradient-to-br before:from-white/[0.04] before:via-transparent before:to-black/[0.03] before:opacity-60"

  const mockLeaderboard = {
    tippers: [
      { username: "@DogeWhisperer", amount: 420069, avatar: "🐕" },
      { username: "@TipMaster", amount: 250000, avatar: "🎯" },
      { username: "@GenerousDoge", amount: 125000, avatar: "🎁" },
    ],
    receivers: [
      { username: "@ContentCreator", amount: 550000, avatar: "🎨" },
      { username: "@MemeQueen", amount: 325000, avatar: "👑" },
      { username: "@StreamerPro", amount: 175000, avatar: "🎮" },
    ]
  }

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const cardPosition = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef<number>()
  const lastMousePosition = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return
      
      const rect = cardRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const mouseX = (e.clientX - centerX) / (rect.width / 2)
      const mouseY = (e.clientY - centerY) / (rect.height / 2)
      
      setMousePosition({ x: mouseX, y: mouseY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const animate = () => {
      const springStrength = 0.15
      const damping = 0.85
      const maxRotation = 8
      const responsiveness = 0.8
      
      const targetX = Math.min(Math.max(-mousePosition.x * maxRotation * responsiveness, -maxRotation), maxRotation)
      const targetY = Math.min(Math.max(-mousePosition.y * maxRotation * responsiveness, -maxRotation), maxRotation)

      const ax = (targetX - cardPosition.current.x) * springStrength
      const ay = (targetY - cardPosition.current.y) * springStrength

      velocity.current.x = (velocity.current.x + ax) * damping
      velocity.current.y = (velocity.current.y + ay) * damping

      cardPosition.current.x += velocity.current.x
      cardPosition.current.y += velocity.current.y

      if (cardRef.current) {
        cardRef.current.style.transform = `
          perspective(1000px)
          rotateY(${cardPosition.current.x}deg)
          rotateX(${-cardPosition.current.y}deg)
          translateZ(20px)
          scale3d(1.02, 1.02, 1.02)
        `

        const qrContainer = cardRef.current.querySelector('.qr-container') as HTMLElement
        if (qrContainer) {
          qrContainer.style.transform = `
            translateX(${-cardPosition.current.x * 2}px)
            translateY(${-cardPosition.current.y * 2}px)
            translateZ(40px)
          `
        }

        cardRef.current.style.boxShadow = shadowStyles.dark.outset
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [mousePosition])

  return (
    <div className="min-h-screen bg-[#161616] px-4 py-16">
      <DogeBot isDark={true} />
      
      <div className="mx-auto max-w-6xl">
        {/* Hero Section - Add subtle animation */}
        <div className="mb-32 grid items-center gap-16 md:grid-cols-2">
          <div className="text-left">
            <h1 className={cn(
              "mb-6 text-5xl font-bold tracking-tight md:text-7xl",
              "bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
            )}>
              The Future of <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">Social</span> Tipping
            </h1>
            <p className={cn(
              "mb-8 text-lg leading-relaxed",
              "text-gray-400"
            )}>
              Send and receive Dogecoin tips effortlessly across social media, websites, and in real life. 
              No extensions, no complexity - just pure, simple, joyful giving.
            </p>
            <div className="flex flex-wrap gap-4">
              <NeumorphicButton 
                className={cn(
                  "flex items-center gap-2 transition-all duration-300",
                  "hover:-translate-y-1 hover:shadow-[0_0_32px_rgba(59,130,246,0.3)]",
                  "active:translate-y-0"
                )}
                onClick={() => router.push('/dashboard')}
              >
                Get Started <Rocket className="h-4 w-4 transition-transform group-hover:rotate-12" />
              </NeumorphicButton>
              <NeumorphicButton 
                variant="secondary" 
                className={cn(
                  "flex items-center gap-2 transition-all duration-300",
                  "hover:-translate-y-1",
                  "active:translate-y-0"
                )}
              >
                Learn More <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </NeumorphicButton>
            </div>
          </div>

          {/* Update card backgrounds for better depth */}
          <div 
            ref={cardRef}
            className={cn(
              "relative aspect-square rounded-[42px] p-6 transition-all duration-300",
              "bg-gradient-to-br from-[#1c1c1c] to-[#1a1a1a]",
              glossyOverlay,
              "will-change-transform cursor-default"
            )}
            style={{
              boxShadow: shadowStyles.dark.outset,
              transformStyle: 'preserve-3d',
              transform: 'perspective(1000px)'
            }}
          >
            <div className="absolute inset-0 rounded-[42px] flex items-center justify-center">
              <div className="qr-container relative h-48 w-48 transform-gpu transition-transform duration-100">
                <div 
                  className="absolute inset-0 animate-ping rounded-full bg-blue-400 opacity-20"
                  style={{ transform: 'translateZ(20px)' }}  
                />
                <div className={cn(
                  "relative flex h-full w-full items-center justify-center rounded-full",
                  "bg-[#e6e6e6] transition-transform duration-100"
                )}
                  style={{ transform: 'translateZ(30px)' }}
                >
                  <QrCode className={cn(
                    "h-16 w-16",
                    "text-blue-400"
                  )} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Community Section - Add subtle hover effects */}
        <div className={cn(
          "mb-32 rounded-[42px] p-8 transition-all duration-300",
          "bg-gradient-to-br from-[#1c1c1c] to-[#1a1a1a]",
          "hover:shadow-2xl hover:shadow-black/50"
        )}
          style={{
            boxShadow: shadowStyles.dark.outset
          }}
        >
          <div className="mb-8 text-center">
            <h2 className={cn(
              "mb-4 text-3xl font-bold",
              "text-white"
            )}>Live Community</h2>
            <p className={cn(
              "mx-auto max-w-2xl",
              "text-gray-500"
            )}>
              Watch the Dogecoin community in action! These leaderboards update in real-time 
              as users send and receive tips across the platform.
            </p>
          </div>

          {/* Leaderboard section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="text-blue-400" />
              <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedLeaderboard('tippers')}
                className={cn(
                  "relative overflow-hidden rounded-xl px-4 py-2 text-sm transition-all duration-300",
                  selectedLeaderboard === 'tippers'
                    ? "bg-blue-500 text-white"
                    : "bg-[#222222] text-gray-400",
                  glossyOverlay
                )}
                style={{
                  boxShadow: selectedLeaderboard === 'tippers'
                    ? shadowStyles.dark.outset
                    : shadowStyles.dark.normal
                }}
              >
                Top Tippers
              </button>
              <button
                onClick={() => setSelectedLeaderboard('receivers')}
                className={cn(
                  "relative overflow-hidden rounded-xl px-4 py-2 text-sm transition-all duration-300",
                  selectedLeaderboard === 'receivers'
                    ? "bg-blue-500 text-white"
                    : "bg-[#222222] text-gray-400",
                  glossyOverlay
                )}
                style={{
                  boxShadow: selectedLeaderboard === 'receivers'
                    ? shadowStyles.dark.outset
                    : shadowStyles.dark.normal
                }}
              >
                Most Tipped
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {mockLeaderboard[selectedLeaderboard].map((user, index) => (
              <div
                key={user.username}
                className={cn(
                  "relative overflow-hidden flex items-center justify-between rounded-full p-4 transition-all duration-300",
                  "bg-[#1a1a1a] hover:bg-[#1d1d1d]",
                  "hover:-translate-y-0.5",
                  glossyOverlay
                )}
                style={{
                  boxShadow: shadowStyles.dark.outset
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{user.avatar}</div>
                  <div>
                    <p className="text-white">
                      {user.username}
                    </p>
                    <p className="text-gray-400">
                      Ð{user.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className={cn(
                  "relative overflow-hidden flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                  "bg-blue-500 text-white",
                  glossyOverlay
                )}>
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-Platform Demo Section - Add interaction states */}
        <div className={cn(
          "mb-32 rounded-2xl p-8 transition-all duration-300",
          "bg-gradient-to-br from-[#1c1c1c] to-[#1a1a1a]",
          "hover:shadow-2xl hover:shadow-black/50"
        )}
          style={{
            boxShadow: shadowStyles.dark.outset
          }}
        >
          <div className="mb-12 text-center">
            <h2 className={cn(
              "mb-4 text-3xl font-bold",
              "text-white"
            )}>Tip Anywhere, Anytime</h2>
            <p className={cn(
              "mx-auto max-w-2xl",
              "text-gray-500"
            )}>
              One platform, endless possibilities. See how DogeTipper works across different platforms.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Web Demo */}
            <div className={cn(
              "group relative overflow-hidden rounded-xl p-6 transition-all duration-300 bg-[#222222]",
              glossyOverlay
            )}
              style={{
                boxShadow: shadowStyles.dark.outset
              }}
            >
              <div className="mb-4 flex items-center gap-3">
                <Globe className="text-blue-400" />
                <h3 className="text-white">Universal Links</h3>
              </div>
              <div className={cn(
                "relative mb-4 overflow-hidden rounded-lg",
                "bg-[#1a1a1a]"
              )}>
                <div className="aspect-video p-2">
                  <div className={cn(
                    "h-4 w-3/4 rounded-full",
                    "bg-[#222222]"
                  )} />
                  <div className="mt-2 flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-blue-400" />
                    <div className={cn(
                      "h-4 flex-1 rounded-full",
                      "bg-[#222222]"
                    )} />
                  </div>
                </div>
                <div className={cn(
                  "absolute bottom-0 left-0 h-1 w-1/3 transition-all duration-1000",
                  "bg-blue-400",
                  "animate-[progressBar_1s_ease-in-out_infinite]"
                )} />
              </div>
              <p className="text-sm text-gray-500">
                Share your tipping link anywhere on the web
              </p>
            </div>

            {/* Mobile Demo */}
            <div className={cn(
              "group relative overflow-hidden rounded-xl p-6 transition-all duration-300 bg-[#222222]",
              glossyOverlay
            )}
              style={{
                boxShadow: shadowStyles.dark.outset
              }}
            >
              <div className="mb-4 flex items-center gap-3">
                <Smartphone className="text-blue-400" />
                <h3 className="text-white">Mobile App</h3>
              </div>
              <div className={cn(
                "relative mx-auto mb-4 w-24 overflow-hidden rounded-xl",
                "bg-[#1a1a1a]"
              )}>
                <div className="aspect-[9/16] p-2">
                  <div className="space-y-2">
                    <div className={cn(
                      "h-2 w-full rounded-full",
                      "bg-[#222222]"
                    )} />
                    <div className={cn(
                      "h-2 w-2/3 rounded-full",
                      "bg-[#222222]"
                    )} />
                    <QrCode className={cn(
                      "mt-2 h-8 w-8",
                      "text-blue-400"
                    )} />
                  </div>
                </div>
                <div className="absolute inset-0 animate-[scan_3s_ease-in-out_infinite] bg-gradient-to-b from-transparent via-blue-400/20 to-transparent" />
              </div>
              <p className="text-sm text-gray-500">
                Scan QR codes for instant tipping
              </p>
            </div>

            {/* Social Demo */}
            <div className={cn(
              "group relative overflow-hidden rounded-xl p-6 transition-all duration-300 bg-[#222222]",
              glossyOverlay
            )}
              style={{
                boxShadow: shadowStyles.dark.outset
              }}
            >
              <div className="mb-4 flex items-center gap-3">
                <Heart className="text-blue-400" />
                <h3 className="text-white">Social Media</h3>
              </div>
              <div className="relative space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-3 rounded-lg p-2 transition-all duration-300",
                      "bg-[#1a1a1a]",
                      i === 1 && "translate-x-2",
                      i === 2 && "translate-x-4"
                    )}
                  >
                    <div className={cn(
                      "h-6 w-6 rounded-full",
                      "bg-[#222222]"
                    )} />
                    <div className={cn(
                      "h-2 w-full rounded-full",
                      "bg-[#222222]"
                    )} />
                  </div>
                ))}
                <div className={cn(
                  "absolute right-0 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full transition-transform duration-500 hover:scale-110",
                  "bg-blue-400",
                  "animate-[pulse_5s_ease-in-out_infinite]"
                )}>
                  <Send className="m-3 h-6 w-6 text-white" />
                </div>
                <p className="text-sm text-gray-500">
                  Send tips to your friends on social media
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}