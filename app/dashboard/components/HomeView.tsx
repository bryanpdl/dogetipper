"use client"

import { useState, useEffect, useRef } from "react"
import { QrCode, Copy, Send, ArrowUpRight, ArrowDownLeft, TrendingUp, Wallet, Loader2 } from 'lucide-react'
import { cn } from "@/lib/utils"
import { NeumorphicButton } from "@/app/components/NeumorphicButton"

type PriceTrend = 'up' | 'down'

interface PriceData {
  current: number
  change: number
  trend: PriceTrend
  lastUpdate?: Date
}

export function HomeView() {
  const [copySuccess, setCopySuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [priceData, setPriceData] = useState<PriceData>({
    current: 0,
    change: 0,
    trend: 'up'
  })
  const [wsError, setWsError] = useState(false)
  const retryCount = useRef(0)
  const retryTimeout = useRef<NodeJS.Timeout>()
  
  const wsRef = useRef<WebSocket | null>(null)
  const last24hPrice = useRef<number | null>(null)

  const shadowStyles = {
    dark: {
      outset: "16px 16px 48px rgba(0, 0, 0, 0.5), -12px -12px 40px rgba(255, 255, 255, 0.008), inset 1px 1px 1px rgba(255, 255, 255, 0.02)",
      subtle: "8px 8px 24px rgba(0, 0, 0, 0.4), -8px -8px 24px rgba(255, 255, 255, 0.01), inset 1px 1px 1px rgba(255, 255, 255, 0.02)"
    }
  }

  const glossyOverlay = "before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-br before:from-white/[0.08] before:to-transparent before:opacity-60"
  
  // Mock data - replace with real data later
  const walletData = {
    balance: 18869.42,
    usdValue: 0, // @ $0.1248 per DOGE
    stats: {
      sentPastDay: 150,
      receivedPastDay: 320,
      totalTips: 47
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchInitialPriceData()

    // Set up WebSocket connection
    setupWebSocket()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (retryTimeout.current) {
        clearTimeout(retryTimeout.current)
      }
    }
  }, [])

  const fetchInitialPriceData = async () => {
    try {
      setIsLoading(true)
      // Get 24h price data from Binance REST API
      const response = await fetch(
        'https://api.binance.com/api/v3/ticker/24hr?symbol=DOGEUSDT'
      )
      const data = await response.json()
      
      last24hPrice.current = parseFloat(data.openPrice)
      setPriceData({
        current: parseFloat(data.lastPrice),
        change: parseFloat(data.priceChangePercent),
        trend: parseFloat(data.priceChangePercent) >= 0 ? 'up' : 'down',
        lastUpdate: new Date()
      })
    } catch (error) {
      console.error('Failed to fetch initial price data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateBackoff = () => {
    // Exponential backoff: 2^n * 1000ms, max 30s
    return Math.min(Math.pow(2, retryCount.current) * 1000, 30000)
  }

  const setupWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close()
    }

    try {
      const ws = new WebSocket('wss://stream.binance.com:9443/ws/dogeusdt@trade')
      wsRef.current = ws

      ws.onopen = () => {
        console.log('WebSocket connected')
        setWsError(false)
        retryCount.current = 0 // Reset retry count on successful connection
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          const newPrice = parseFloat(data.p)
          
          setPriceData(prev => {
            const changePercent = last24hPrice.current 
              ? ((newPrice - last24hPrice.current) / last24hPrice.current) * 100
              : prev.change

            return {
              current: newPrice,
              change: changePercent,
              trend: changePercent >= 0 ? 'up' : 'down',
              lastUpdate: new Date()
            }
          })
        } catch (error) {
          console.warn('Failed to parse WebSocket message:', error)
        }
      }

      ws.onclose = (event) => {
        if (!event.wasClean) {
          setWsError(true)
          retryCount.current += 1
          const backoff = calculateBackoff()
          
          console.log(`WebSocket connection lost. Retrying in ${backoff/1000}s...`)
          
          // Clear any existing retry timeout
          if (retryTimeout.current) {
            clearTimeout(retryTimeout.current)
          }
          
          // Set up new retry
          retryTimeout.current = setTimeout(() => {
            if (document.visibilityState === 'visible') {
              setupWebSocket()
            }
          }, backoff)
        }
      }

      ws.onerror = (error: Event) => {
        // Only log if it's a genuine error, not just a connection loss
        if (error instanceof ErrorEvent) {
          console.warn('WebSocket error:', error.message)
        }
        // Don't close here - let onclose handle reconnection
      }
    } catch (error) {
      console.error('Failed to create WebSocket:', error)
      setWsError(true)
    }
  }

  // Update USD value based on real price
  const calculateUsdValue = (dogeAmount: number) => {
    return dogeAmount * priceData.current
  }

  const recentActivity = [
    { type: 'received', amount: 100, from: '@MemeKing', timestamp: '2h ago' },
    { type: 'sent', amount: 50, to: '@CryptoArtist', timestamp: '5h ago' },
    { type: 'received', amount: 200, from: '@TechGuru', timestamp: '1d ago' },
  ]

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText('https://dogetipper.com/u/yourprofile')
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Wallet Balance Card */}
      <div className={cn(
        "relative overflow-hidden rounded-[24px] sm:rounded-[32px] p-6 sm:p-8",
        "bg-gradient-to-br from-[#1c1c1c] to-[#1a1a1a]",
        glossyOverlay,
        "transition-all duration-300 hover:translate-y-[-2px]"
      )}
        style={{ boxShadow: shadowStyles.dark.outset }}
      >
        {/* Live DOGE Price Tag */}
        <div className={cn(
          "absolute right-4 sm:right-8 top-4 sm:top-8 flex items-center gap-2 rounded-full px-3 py-1.5",
          "bg-[#2a2a2a]/50 backdrop-blur-md",
          "border border-[#3a3a3a]",
          "animate-in fade-in duration-700"
        )}>
          {isLoading ? (
            <div className="flex items-center gap-2 py-0.5">
              <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
              <span className="text-xs font-medium text-gray-400">
                Loading...
              </span>
            </div>
          ) : wsError ? (
            <div className="flex items-center gap-2 py-0.5">
              <span className="text-xs font-medium text-red-400">
                Reconnecting...
              </span>
            </div>
          ) : (
            <>
              <div className={cn(
                "flex items-center gap-1.5",
                priceData.trend === 'up' ? "text-green-400" : "text-red-400"
              )}>
                <TrendingUp className={cn(
                  "h-3 w-3",
                  priceData.trend === 'down' && "rotate-180",
                  "transition-transform duration-300"
                )} />
                <span className="text-xs font-medium">
                  {priceData.change.toFixed(2)}%
                </span>
              </div>
              <div className="h-3 w-[1px] bg-[#3a3a3a]" />
              <span className={cn(
                "text-xs font-medium text-gray-300",
                "transition-colors duration-300",
                priceData.lastUpdate && Date.now() - priceData.lastUpdate.getTime() < 1000 && "text-blue-400"
              )}>
                ${priceData.current.toFixed(4)}
              </span>
            </>
          )}
        </div>

        <div className="relative z-10">
          <div className="mb-6">
            <h2 className="mb-2 text-base sm:text-lg font-medium text-gray-400">Wallet Balance</h2>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
              <span className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
                Ð {walletData.balance.toLocaleString()}
              </span>
              <span className="text-base sm:text-lg font-medium text-gray-500">
                ≈ ${calculateUsdValue(walletData.balance).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* Sent Today */}
            <div className={cn(
              "rounded-2xl p-4",
              "bg-[#222222]",
              "border border-[#3a3a3a]/30"
            )}>
              <div className="mb-1 flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-blue-400" />
                <span className="text-xs sm:text-sm font-medium text-gray-400">Sent (24h)</span>
              </div>
              <p className="text-base sm:text-lg font-semibold text-white">
                Ð {walletData.stats.sentPastDay.toLocaleString()}
              </p>
            </div>

            {/* Received Today */}
            <div className={cn(
              "rounded-2xl p-4",
              "bg-[#222222]",
              "border border-[#3a3a3a]/30"
            )}>
              <div className="mb-1 flex items-center gap-2">
                <ArrowDownLeft className="h-4 w-4 text-green-400" />
                <span className="text-xs sm:text-sm font-medium text-gray-400">Received (24h)</span>
              </div>
              <p className="text-base sm:text-lg font-semibold text-white">
                Ð {walletData.stats.receivedPastDay.toLocaleString()}
              </p>
            </div>

            {/* Total Tips */}
            <div className={cn(
              "col-span-2 sm:col-span-1 rounded-2xl p-4",
              "bg-[#222222]",
              "border border-[#3a3a3a]/30"
            )}>
              <div className="mb-1 flex items-center gap-2">
                <Wallet className="h-4 w-4 text-blue-400" />
                <span className="text-xs sm:text-sm font-medium text-gray-400">Total Tips</span>
              </div>
              <p className="text-base sm:text-lg font-semibold text-white">
                {walletData.stats.totalTips.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6">
        <NeumorphicButton
          className={cn(
            "flex flex-col sm:flex-row items-center justify-center gap-2 py-3 sm:py-4 px-2 sm:px-4",
            "hover:-translate-y-1 hover:shadow-[0_0_32px_rgba(59,130,246,0.2)]",
            "active:translate-y-0"
          )}
          onClick={() => {}}
        >
          <QrCode className="h-5 w-5" />
          <span className="text-xs sm:text-base">QR Code</span>
        </NeumorphicButton>

        <NeumorphicButton
          className={cn(
            "flex flex-col sm:flex-row items-center justify-center gap-2 py-3 sm:py-4 px-2 sm:px-4",
            "hover:-translate-y-1",
            "active:translate-y-0"
          )}
          onClick={handleCopyLink}
        >
          <Copy className="h-5 w-5" />
          <span className="text-xs sm:text-base">
            {copySuccess ? 'Copied!' : 'Copy Link'}
          </span>
        </NeumorphicButton>

        {/* Send Tip Button - Full width on mobile */}
        <NeumorphicButton
          className={cn(
            "col-span-2 sm:col-span-1",
            "flex flex-col sm:flex-row items-center justify-center gap-2 py-3 sm:py-4 px-2 sm:px-4",
            "hover:-translate-y-1",
            "active:translate-y-0"
          )}
          onClick={() => {}}
        >
          <Send className="h-5 w-5" />
          <span className="text-xs sm:text-base">Send Tip</span>
        </NeumorphicButton>
      </div>

      {/* Recent Activity */}
      <div className={cn(
        "relative overflow-hidden rounded-[24px] sm:rounded-[32px] p-6 sm:p-8",
        "bg-gradient-to-br from-[#1c1c1c] to-[#1a1a1a]",
        glossyOverlay
      )}
        style={{ boxShadow: shadowStyles.dark.outset }}
      >
        <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-semibold text-white">Recent Activity</h2>
        <div className="space-y-3 sm:space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className={cn(
                "group relative overflow-hidden rounded-2xl p-4",
                "bg-[#222222]",
                glossyOverlay,
                "transition-all duration-300",
                "hover:bg-[#252525] hover:translate-y-[-2px]"
              )}
              style={{ boxShadow: shadowStyles.dark.subtle }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "relative overflow-hidden rounded-full p-3",
                    activity.type === 'received' ? "bg-green-500/10" : "bg-blue-500/10",
                    "transition-transform duration-300 group-hover:scale-110"
                  )}>
                    {activity.type === 'received' 
                      ? <ArrowDownLeft className="h-5 w-5 text-green-500" />
                      : <ArrowUpRight className="h-5 w-5 text-blue-500" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {activity.type === 'received' ? 'Received from' : 'Sent to'} {' '}
                      <span className="text-blue-400">
                        {activity.type === 'received' ? activity.from : activity.to}
                      </span>
                    </p>
                    <p className="text-sm text-gray-400">{activity.timestamp}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">
                    Ð {activity.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400">DOGE</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 