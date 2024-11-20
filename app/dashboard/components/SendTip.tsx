"use client"

import { useState, useEffect } from "react"
import { QrCode, Send, Search, ArrowRight, X, ChevronLeft, Download, Share2, Copy, TrendingUp, ChevronDown, Filter } from 'lucide-react'
import { cn } from "@/lib/utils"
import { NeumorphicButton } from "@/app/components/NeumorphicButton"

type TipMode = 'username' | 'qr' | 'link'
type TipStep = 'recipient' | 'amount' | 'confirm'
type ActiveView = 'send' | 'receive'
type SortOption = 'recent' | 'amount'
type FilterOption = 'all' | 'week' | 'month'

interface TipDetails {
  recipient: string
  amount: number
  message?: string
}

// Add new types for recent tips
interface RecentTip {
  from: string
  amount: number
  timestamp: string
  message?: string
}

// Add new types for pagination
interface PaginationState {
  currentPage: number
  itemsPerPage: number
  totalItems: number
}

export function SendTip() {
  const [activeView, setActiveView] = useState<ActiveView>('send')
  const [mode, setMode] = useState<TipMode>('username')
  const [step, setStep] = useState<TipStep>('recipient')
  const [tipDetails, setTipDetails] = useState<TipDetails>({
    recipient: '',
    amount: 0
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [showAllTips, setShowAllTips] = useState(false)
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 0
  })

  const shadowStyles = {
    dark: {
      outset: "16px 16px 48px rgba(0, 0, 0, 0.5), -12px -12px 40px rgba(255, 255, 255, 0.008), inset 1px 1px 1px rgba(255, 255, 255, 0.02)",
      subtle: "8px 8px 24px rgba(0, 0, 0, 0.4), -8px -8px 24px rgba(255, 255, 255, 0.01), inset 1px 1px 1px rgba(255, 255, 255, 0.02)"
    }
  }

  const glossyOverlay = "before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-br before:from-white/[0.08] before:to-transparent before:opacity-60"

  const predefinedAmounts = [5, 10, 20, 50, 100]

  // Extended mock data for recent tips
  const recentTips: RecentTip[] = [
    {
      from: "shibamaster",
      amount: 100,
      timestamp: "2 minutes ago",
      message: "Thanks for the great content! 🚀"
    },
    {
      from: "dogeking",
      amount: 50,
      timestamp: "1 hour ago"
    },
    {
      from: "cryptowow",
      amount: 25,
      timestamp: "3 hours ago",
      message: "Keep up the good work!"
    },
    {
      from: "moonrider",
      amount: 200,
      timestamp: "5 hours ago",
      message: "To the moon! 🌕"
    },
    {
      from: "tipmaster",
      amount: 75,
      timestamp: "6 hours ago"
    },
    {
      from: "dogefriend",
      amount: 150,
      timestamp: "8 hours ago",
      message: "For the community 🐕"
    },
    {
      from: "shibafan",
      amount: 42,
      timestamp: "12 hours ago"
    },
    {
      from: "wowsuchcool",
      amount: 69,
      timestamp: "1 day ago",
      message: "Much wow!"
    },
    {
      from: "dogewarrior",
      amount: 300,
      timestamp: "1 day ago",
      message: "Supporting the cause!"
    },
    {
      from: "tothemoon",
      amount: 420,
      timestamp: "2 days ago"
    }
  ]

  // Filter and sort tips based on current settings
  const filteredTips = recentTips.filter(tip => {
    const now = new Date()
    const tipDate = new Date(tip.timestamp)
    
    switch (filterBy) {
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7))
        return tipDate >= weekAgo
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
        return tipDate >= monthAgo
      default:
        return true
    }
  })

  const sortedTips = [...filteredTips].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    } else {
      return b.amount - a.amount
    }
  })

  const totalItems = sortedTips.length
  const totalPages = Math.ceil(totalItems / pagination.itemsPerPage)
  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage
  const displayedTips = sortedTips.slice(startIndex, startIndex + pagination.itemsPerPage)

  const handlePageChange = (newPage: number) => {
    console.log('Changing to page:', newPage) // Debug log
    setPagination(prev => ({
      ...prev,
      currentPage: newPage
    }))
  }

  // Update pagination when filter changes
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      totalItems
    }))
  }, [filterBy, totalItems])

  const handleSendTip = async () => {
    setIsProcessing(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      // Reset form and show success
      setStep('recipient')
      setTipDetails({ recipient: '', amount: 0 })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* View Toggle - Updated to darker platinum style */}
      <div className="relative p-1 rounded-xl bg-gradient-to-br from-[#1e1e1e] to-[#181818]"
        style={{
          boxShadow: "inset 4px 4px 8px rgba(0, 0, 0, 0.5), inset -4px -4px 8px rgba(255, 255, 255, 0.03)"
        }}
      >
        {/* Background Slider - Darker metallic gradient */}
        <div
          className={cn(
            "absolute inset-y-1 w-1/2 rounded-lg transition-all duration-300 ease-out",
            "bg-gradient-to-br from-[#2c2c2c] to-[#202020]",
            "before:absolute before:inset-0 before:rounded-lg",
            "before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-90",
            activeView === 'receive' && "translate-x-full"
          )}
          style={{
            boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.4), -1px -1px 4px rgba(255, 255, 255, 0.08)"
          }}
        />

        {/* Buttons Container - Adjusted text colors */}
        <div className="relative grid grid-cols-2 gap-1">
          <button
            onClick={() => setActiveView('send')}
            className={cn(
              "px-6 py-2.5 rounded-lg font-medium transition-colors duration-300",
              "relative z-10",
              activeView === 'send' ? "text-white" : "text-gray-500 hover:text-gray-400"
            )}
          >
            Send
          </button>
          <button
            onClick={() => setActiveView('receive')}
            className={cn(
              "px-6 py-2.5 rounded-lg font-medium transition-colors duration-300",
              "relative z-10",
              activeView === 'receive' ? "text-white" : "text-gray-500 hover:text-gray-400"
            )}
          >
            Receive
          </button>
        </div>
      </div>

      {/* Send View */}
      {activeView === 'send' && (
        <>
          {/* Mode Selection - Only show in first step */}
          {step === 'recipient' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <NeumorphicButton
                variant="secondary"
                className={cn(
                  "w-full justify-center",
                  "flex items-center gap-3 px-6 py-8",
                  "transition-all duration-300",
                  mode === 'username' && "ring-2 ring-blue-500 text-white",
                  mode !== 'username' && "text-gray-400 hover:text-white"
                )}
                onClick={() => setMode('username')}
              >
                <Search className="h-5 w-5" />
                <span className="font-medium">Find User</span>
              </NeumorphicButton>

              <NeumorphicButton
                variant="secondary"
                className={cn(
                  "flex items-center justify-center gap-3 px-6 py-8",
                  "transition-all duration-300",
                  mode === 'qr' && "ring-2 ring-blue-500 text-white",
                  mode !== 'qr' && "text-gray-400 hover:text-white"
                )}
                onClick={() => setMode('qr')}
              >
                <QrCode className="h-5 w-5" />
                <span className="font-medium">Scan QR</span>
              </NeumorphicButton>

              <NeumorphicButton
                variant="secondary"
                className={cn(
                  "flex items-center justify-center gap-3 px-6 py-8",
                  "transition-all duration-300",
                  mode === 'link' && "ring-2 ring-blue-500 text-white",
                  mode !== 'link' && "text-gray-400 hover:text-white"
                )}
                onClick={() => setMode('link')}
              >
                <ArrowRight className="h-5 w-5" />
                <span className="font-medium">Paste Link</span>
              </NeumorphicButton>
            </div>
          )}

          {/* Main Card */}
          <div className={cn(
            "relative overflow-hidden rounded-[24px] p-6 sm:p-8",
            "bg-gradient-to-br from-[#1c1c1c] to-[#1a1a1a]",
            glossyOverlay
          )}
            style={{ boxShadow: shadowStyles.dark.outset }}
          >
            {/* Step Navigation */}
            {step !== 'recipient' && (
              <button
                onClick={() => setStep(step === 'confirm' ? 'amount' : 'recipient')}
                className={cn(
                  "absolute left-4 top-4 p-2 rounded-full",
                  "text-gray-400 hover:text-gray-300",
                  "transition-colors duration-300"
                )}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            <div className="space-y-6">
              {/* Step 1: Recipient */}
              {step === 'recipient' && (
                <>
                  <h2 className="text-xl font-semibold text-white">
                    {mode === 'username' && "Find User"}
                    {mode === 'qr' && "Scan QR Code"}
                    {mode === 'link' && "Paste Tipping Link"}
                  </h2>
                  
                  <div className="space-y-4">
                    {mode === 'username' && (
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter username..."
                          value={tipDetails.recipient}
                          onChange={(e) => setTipDetails(prev => ({ ...prev, recipient: e.target.value }))}
                          className={cn(
                            "w-full rounded-xl px-4 py-3",
                            "bg-[#222222] text-white",
                            "border border-[#3a3a3a]",
                            "focus:outline-none",
                            "placeholder:text-gray-500"
                          )}
                        />
                        {tipDetails.recipient && (
                          <button
                            onClick={() => setTipDetails(prev => ({ ...prev, recipient: '' }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    )}

                    {mode === 'qr' && (
                      <div className="aspect-video rounded-xl bg-[#222222] flex items-center justify-center">
                        <p className="text-gray-400">QR Scanner coming soon...</p>
                      </div>
                    )}

                    {mode === 'link' && (
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Paste tipping link..."
                          value={tipDetails.recipient}
                          onChange={(e) => setTipDetails(prev => ({ ...prev, recipient: e.target.value }))}
                          className={cn(
                            "w-full rounded-xl px-4 py-3",
                            "bg-[#222222] text-white",
                            "border border-[#3a3a3a]",
                            "focus:outline-none",
                            "placeholder:text-gray-500"
                          )}
                        />
                        {tipDetails.recipient && (
                          <button
                            onClick={() => setTipDetails(prev => ({ ...prev, recipient: '' }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    )}

                    {(tipDetails.recipient || mode === 'qr') && (
                      <NeumorphicButton
                        variant="secondary"
                        className={cn(
                          "w-full flex items-center justify-center gap-2 px-6 py-3",
                          "transition-all duration-300",
                          "text-gray-400 hover:text-white",
                          "group"
                        )}
                        onClick={() => setStep('amount')}
                      >
                        <span className="font-medium">Continue</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </NeumorphicButton>
                    )}
                  </div>
                </>
              )}

              {/* Step 2: Amount */}
              {step === 'amount' && (
                <>
                  <h2 className="text-xl mt-6 font-semibold text-white">Select Amount</h2>
                  
                  <div className="space-y-6">
                    {/* Quick Amount Buttons */}
                    <div className="grid grid-cols-3 gap-3">
                      {predefinedAmounts.map(amount => (
                        <NeumorphicButton
                          key={amount}
                          variant="secondary"
                          className={cn(
                            "py-3 text-center transition-all duration-300",
                            "hover:-translate-y-1",
                            tipDetails.amount === amount && "ring-2 ring-blue-500 bg-blue-500/10 text-white"
                          )}
                          onClick={() => setTipDetails(prev => ({ ...prev, amount }))}
                        >
                          Ð {amount}
                        </NeumorphicButton>
                      ))}

                      {/* Custom Amount Input */}
                      <input
                        type="number"
                        placeholder="Custom"
                        value={!predefinedAmounts.includes(tipDetails.amount) ? tipDetails.amount || '' : ''}
                        onChange={(e) => setTipDetails(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                        className={cn(
                          "rounded-xl px-4 py-3 text-center",
                          "bg-[#222222] text-white",
                          "border border-[#3a3a3a]",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500",
                          "placeholder:text-gray-500"
                        )}
                      />
                    </div>

                    {/* Optional Message */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">
                        Message (Optional)
                      </label>
                      <textarea
                        placeholder="Add a message..."
                        value={tipDetails.message}
                        onChange={(e) => setTipDetails(prev => ({ ...prev, message: e.target.value }))}
                        className={cn(
                          "w-full rounded-xl px-4 py-3",
                          "bg-[#222222] text-white",
                          "border border-[#3a3a3a]",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500",
                          "placeholder:text-gray-500",
                          "resize-none"
                        )}
                        rows={3}
                      />
                    </div>

                    <NeumorphicButton
                      variant="secondary"
                      className={cn(
                        "w-full flex items-center justify-center gap-2 px-6 py-3",
                        "transition-all duration-300",
                        "text-gray-400 hover:text-white",
                        "group",
                        !tipDetails.amount && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => tipDetails.amount > 0 && setStep('confirm')}
                    >
                      <span className="font-medium">Continue</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </NeumorphicButton>
                  </div>
                </>
              )}

              {/* Step 3: Confirm */}
              {step === 'confirm' && (
                <>
                  <h2 className="text-xl font-semibold text-white">Confirm Tip</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-4 rounded-xl bg-[#222222] p-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">To</span>
                        <span className="text-white">{tipDetails.recipient}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Amount</span>
                        <span className="text-white">Ð {tipDetails.amount}</span>
                      </div>
                      {tipDetails.message && (
                        <div className="space-y-1">
                          <span className="text-gray-400">Message</span>
                          <p className="text-white">{tipDetails.message}</p>
                        </div>
                      )}
                    </div>

                    <NeumorphicButton
                      className={cn(
                        "w-full flex items-center justify-center gap-2 py-3",
                        "hover:-translate-y-1",
                        isProcessing && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={handleSendTip}
                    >
                      {isProcessing ? (
                        <>
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          <span>Send Tip</span>
                        </>
                      )}
                    </NeumorphicButton>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Receive View */}
      {activeView === 'receive' && (
        <div className={cn(
          "relative overflow-hidden rounded-[24px] p-6 sm:p-8",
          "bg-gradient-to-br from-[#1c1c1c] to-[#1a1a1a]",
          glossyOverlay
        )}
          style={{ boxShadow: shadowStyles.dark.outset }}
        >
          <h2 className="text-xl font-semibold text-white mb-6">Receive Tips</h2>
          
          <div className="space-y-6">
            {/* QR Code Display */}
            <div className="aspect-square max-w-xs mx-auto bg-white p-4 rounded-xl">
              {/* QR Code will be generated here */}
              <div className="w-full h-full bg-[#222222] rounded-lg" />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <NeumorphicButton
                variant="secondary"
                className={cn(
                  "w-full flex items-center justify-center gap-3 px-6 py-8",
                  "transition-all duration-300",
                  "text-gray-400 hover:text-white"
                )}
                onClick={() => {}}
              >
                <Download className="h-5 w-5" />
                <span className="font-medium">Download QR</span>
              </NeumorphicButton>

              <NeumorphicButton
                variant="secondary"
                className={cn(
                  "w-full flex items-center justify-center gap-3 px-6 py-8",
                  "transition-all duration-300",
                  "text-gray-400 hover:text-white"
                )}
                onClick={() => {}}
              >
                <Copy className="h-5 w-5" />
                <span className="font-medium">Copy Link</span>
              </NeumorphicButton>

              <NeumorphicButton
                variant="secondary"
                className={cn(
                  "w-full flex items-center justify-center gap-3 px-6 py-8",
                  "transition-all duration-300",
                  "text-gray-400 hover:text-white"
                )}
                onClick={() => {}}
              >
                <Share2 className="h-5 w-5" />
                <span className="font-medium">Share</span>
              </NeumorphicButton>
            </div>

            {/* Recent Tips */}
            <div className="space-y-4 mt-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">
                  Recent Tips Received
                  {totalItems > 0 && (
                    <span className="ml-2 text-sm text-gray-400">
                      ({startIndex + 1}-{Math.min(startIndex + pagination.itemsPerPage, totalItems)} of {totalItems})
                    </span>
                  )}
                </h3>
                
                {/* Filter & Sort Controls */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <NeumorphicButton
                      variant="secondary"
                      className="py-2 px-3 text-sm flex items-center gap-2"
                      onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                    >
                      <Filter className="h-4 w-4" />
                      <span>{filterBy === 'all' ? 'All Time' : `Past ${filterBy}`}</span>
                      <ChevronDown className="h-4 w-4" />
                    </NeumorphicButton>

                    {/* Filter Dropdown */}
                    {isFilterMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[#222222] p-2 shadow-xl z-10">
                        {['all', 'week', 'month'].map((option) => (
                          <button
                            key={option}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-lg text-sm",
                              "transition-colors duration-200",
                              filterBy === option 
                                ? "bg-blue-500/10 text-blue-400" 
                                : "text-gray-400 hover:bg-[#2a2a2a] hover:text-gray-300"
                            )}
                            onClick={() => {
                              setFilterBy(option as FilterOption)
                              setIsFilterMenuOpen(false)
                            }}
                          >
                            {option === 'all' ? 'All Time' : `Past ${option}`}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <NeumorphicButton
                    variant="secondary"
                    className="py-2 px-3 text-sm flex items-center gap-2"
                    onClick={() => setSortBy(sortBy === 'recent' ? 'amount' : 'recent')}
                  >
                    <TrendingUp className="h-4 w-4" />
                    <span>{sortBy === 'recent' ? 'Recent' : 'Amount'}</span>
                  </NeumorphicButton>
                </div>
              </div>
              
              <div className="space-y-3">
                {displayedTips.map((tip, index) => (
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
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-400 font-medium truncate">
                            {tip.from}
                          </span>
                          <span className="text-sm text-gray-500">
                            {tip.timestamp}
                          </span>
                        </div>
                        {tip.message && (
                          <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                            {tip.message}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1">
                          <span className="text-white font-medium animate-slideIn">
                            Ð {tip.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination Controls - Moved outside nested divs */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <NeumorphicButton
                      variant="secondary"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      className={cn(
                        "px-4 py-2",
                        pagination.currentPage === 1 && "opacity-50 cursor-not-allowed"
                      )}
                      disabled={pagination.currentPage === 1}
                    >
                      Previous
                    </NeumorphicButton>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <NeumorphicButton
                          key={page}
                          variant="secondary"
                          onClick={() => handlePageChange(page)}
                          className={cn(
                            "w-8 h-8 flex items-center justify-center p-0",
                            pagination.currentPage === page && "bg-blue-500 text-white"
                          )}
                        >
                          {page}
                        </NeumorphicButton>
                      ))}
                    </div>

                    <NeumorphicButton
                      variant="secondary"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      className={cn(
                        "px-4 py-2",
                        pagination.currentPage === totalPages && "opacity-50 cursor-not-allowed"
                      )}
                      disabled={pagination.currentPage === totalPages}
                    >
                      Next
                    </NeumorphicButton>
                  </div>
                )}

                {/* Empty State */}
                {totalItems === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No tips received yet</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Share your tipping link to start receiving tips!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 