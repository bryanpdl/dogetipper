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
    balance: 9434.73,
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
    <div className="space-y-6">
      {/* Balance Card */}
      <div className={cn(
        "relative overflow-hidden rounded-[24px] p-6 sm:p-8",
        "bg-gradient-to-br from-[#1c1c1c] to-[#1a1a1a]",
        glossyOverlay
      )}
        style={{ boxShadow: shadowStyles.dark.outset }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium text-white mb-1">
              Your Balance
            </h2>
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">
                  Ð {walletData.balance.toLocaleString()}
                </span>
                <span className="text-sm text-gray-400">
                  DOGE
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-medium text-gray-400">
                  ${(walletData.balance * priceData.current).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
                <span className="text-sm text-gray-500">
                  USD
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <NeumorphicButton
              variant="secondary"
              onClick={() => {/* handle send */}}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </NeumorphicButton>

            <NeumorphicButton
              variant="secondary"
              onClick={() => {/* handle receive */}}
              className="flex items-center gap-2"
            >
              <QrCode className="h-4 w-4" />
              <span>Receive</span>
            </NeumorphicButton>
          </div>
        </div>

        {/* Price Info */}
        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">
              ${priceData.current.toFixed(4)}
            </span>
            <span className={cn(
              "flex items-center text-xs",
              priceData.trend === 'up' ? "text-green-400" : "text-red-400"
            )}>
              <span>{priceData.change.toFixed(2)}%</span>
              {priceData.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
            </span>
          </div>
          <div className="h-4 w-px bg-gray-800" />
          <span className="text-xs text-gray-500">
            Last updated {priceData.lastUpdate?.toLocaleTimeString()}
          </span>
        </div>

        {/* Added Stats Section */}
        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Sent (24h)</p>
              <p className="text-lg font-medium text-white">
                Ð {walletData.stats.sentPastDay.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Received (24h)</p>
              <p className="text-lg font-medium text-white">
                Ð {walletData.stats.receivedPastDay.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Tips</p>
              <p className="text-lg font-medium text-white">
                {walletData.stats.totalTips.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={cn(
        "relative overflow-hidden rounded-[24px] p-6 sm:p-8",
        "bg-gradient-to-br from-[#1c1c1c] to-[#1a1a1a]",
        glossyOverlay
      )}
        style={{ boxShadow: shadowStyles.dark.outset }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-white">Recent Activity</h2>
          <NeumorphicButton
            variant="secondary"
            className="text-sm"
            onClick={() => {/* handle view all */}}
          >
            View All
          </NeumorphicButton>
        </div>

        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className={cn(
                "group relative overflow-hidden rounded-xl p-4",
                "bg-[#222222]",
                glossyOverlay,
                "transition-all duration-300",
                "hover:bg-[#252525] hover:-translate-y-0.5",
                "animate-fadeIn"
              )}
              style={{ 
                boxShadow: shadowStyles.dark.subtle,
                animationDelay: `${index * 100}ms`
              }}
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