"use client"

import { useState } from "react"
import { QrCode, Send, Search, ArrowRight, X, ChevronLeft } from 'lucide-react'
import { cn } from "@/lib/utils"
import { NeumorphicButton } from "@/app/components/NeumorphicButton"

type TipMode = 'username' | 'qr' | 'link'
type TipStep = 'recipient' | 'amount' | 'confirm'

interface TipDetails {
  recipient: string
  amount: number
  message?: string
}

export function SendTip() {
  const [mode, setMode] = useState<TipMode>('username')
  const [step, setStep] = useState<TipStep>('recipient')
  const [tipDetails, setTipDetails] = useState<TipDetails>({
    recipient: '',
    amount: 0
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const shadowStyles = {
    dark: {
      outset: "16px 16px 48px rgba(0, 0, 0, 0.5), -12px -12px 40px rgba(255, 255, 255, 0.008), inset 1px 1px 1px rgba(255, 255, 255, 0.02)",
      subtle: "8px 8px 24px rgba(0, 0, 0, 0.4), -8px -8px 24px rgba(255, 255, 255, 0.01), inset 1px 1px 1px rgba(255, 255, 255, 0.02)"
    }
  }

  const glossyOverlay = "before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-br before:from-white/[0.08] before:to-transparent before:opacity-60"

  const predefinedAmounts = [5, 10, 20, 50, 100]

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
      {/* Mode Selection - Only show in first step */}
      {step === 'recipient' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NeumorphicButton
            className={cn(
              "flex items-center justify-center gap-2 py-8",
              "hover:-translate-y-1",
              mode === 'username' && "ring-2 ring-blue-500",
            )}
            onClick={() => setMode('username')}
          >
            <Search className="h-5 w-5" />
            <span>Find User</span>
          </NeumorphicButton>

          <NeumorphicButton
            className={cn(
              "flex items-center justify-center gap-2 py-8",
              "hover:-translate-y-1",
              mode === 'qr' && "ring-2 ring-blue-500",
            )}
            onClick={() => setMode('qr')}
          >
            <QrCode className="h-5 w-5" />
            <span>Scan QR</span>
          </NeumorphicButton>

          <NeumorphicButton
            className={cn(
              "flex items-center justify-center gap-2 py-8",
              "hover:-translate-y-1",
              mode === 'link' && "ring-2 ring-blue-500",
            )}
            onClick={() => setMode('link')}
          >
            <ArrowRight className="h-5 w-5" />
            <span>Paste Link</span>
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
                        "focus:outline-none focus:ring-2 focus:ring-blue-500",
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
                  <div className={cn(
                    "aspect-square rounded-xl",
                    "bg-[#222222]",
                    "border border-[#3a3a3a]",
                    "flex items-center justify-center"
                  )}>
                    <span className="text-gray-400">Camera access required</span>
                  </div>
                )}

                {mode === 'link' && (
                  <input
                    type="text"
                    placeholder="Paste tipping link..."
                    value={tipDetails.recipient}
                    onChange={(e) => setTipDetails(prev => ({ ...prev, recipient: e.target.value }))}
                    className={cn(
                      "w-full rounded-xl px-4 py-3",
                      "bg-[#222222] text-white",
                      "border border-[#3a3a3a]",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500",
                      "placeholder:text-gray-500"
                    )}
                  />
                )}
              </div>

              <NeumorphicButton
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-3",
                  "hover:-translate-y-1",
                  (!tipDetails.recipient && mode !== 'qr') && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => tipDetails.recipient && setStep('amount')}
              >
                <ArrowRight className="h-5 w-5" />
                <span>Continue</span>
              </NeumorphicButton>
            </>
          )}

          {/* Step 2: Amount */}
          {step === 'amount' && (
            <>
              <h2 className="text-xl font-semibold text-white">Select Amount</h2>
              
              <div className="space-y-6">
                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-3 gap-3">
                  {predefinedAmounts.map(amount => (
                    <NeumorphicButton
                      key={amount}
                      className={cn(
                        "py-3 text-center",
                        "hover:-translate-y-1",
                        tipDetails.amount === amount && "ring-2 ring-blue-500"
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
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-3",
                    "hover:-translate-y-1",
                    !tipDetails.amount && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={() => tipDetails.amount > 0 && setStep('confirm')}
                >
                  <ArrowRight className="h-5 w-5" />
                  <span>Continue</span>
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
    </div>
  )
} 