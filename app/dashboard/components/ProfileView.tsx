 "use client"

import { useState, useEffect } from "react"
import { Camera, Edit2, Link, QrCode, Download, Copy, Settings, ExternalLink, MessageCircle, Send, Check } from 'lucide-react'
import { cn } from "@/lib/utils"
import { NeumorphicButton } from "@/app/components/NeumorphicButton"
import Image from "next/image"

interface ProfileStats {
  totalReceived: number
  totalSent: number
  tipCount: number
  joinDate: string
}

interface ProfileData {
  username: string
  bio?: string
  profileImage?: string
  stats: ProfileStats
  isVerified?: boolean
}

interface ActivityItem {
  type: 'sent' | 'received'
  amount: number
  username: string
  message?: string
  timestamp: string
  thanked?: boolean
}

export function ProfileView({ username }: { username?: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<ProfileData>({
    username: 'YourUsername',
    bio: 'Supporting the Doge community one tip at a time! 🐕',
    stats: {
      totalReceived: 15420,
      totalSent: 12350,
      tipCount: 156,
      joinDate: '2024-01'
    },
    isVerified: true
  })
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [copySuccess, setCopySuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received')
  const isOwnProfile = !username // If no username provided, showing own profile

  const shadowStyles = {
    dark: {
      outset: "16px 16px 48px rgba(0, 0, 0, 0.5), -12px -12px 40px rgba(255, 255, 255, 0.008)",
      inset: "inset 2px 2px 6px rgba(0, 0, 0, 0.5), inset -2px -2px 6px rgba(255, 255, 255, 0.03)"
    }
  }

  // Mock data fetching
  useEffect(() => {
    // Simulate API call
    setActivity([
      {
        type: 'received',
        amount: 100,
        username: 'shibamaster',
        message: 'Great content! Keep it up! 🚀',
        timestamp: '2 minutes ago',
        thanked: false
      },
      // ... more activity items
    ])
  }, [username])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://dogetip.com/${profile.username}`)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleThankTipper = (index: number) => {
    setActivity(prev => prev.map((item, i) => 
      i === index ? { ...item, thanked: true } : item
    ))
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className={cn(
        "relative overflow-hidden rounded-[24px] p-8",
        "bg-gradient-to-br from-[#1c1c1c] to-[#1a1a1a]"
      )}
        style={{ boxShadow: shadowStyles.dark.outset }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Profile Picture */}
          <div className="relative group">
            <div className={cn(
              "relative w-24 h-24 rounded-full overflow-hidden",
              "bg-gradient-to-br from-[#2a2a2a] to-[#222222]"
            )}>
              {profile.profileImage ? (
                <Image
                  src={profile.profileImage}
                  alt={profile.username}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-500/10 flex items-center justify-center">
                  <span className="text-3xl text-blue-400">
                    {profile.username[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {isOwnProfile && (
              <button className={cn(
                "absolute bottom-0 right-0 p-2 rounded-full",
                "bg-blue-500 text-white",
                "opacity-0 group-hover:opacity-100",
                "transition-opacity duration-200"
              )}>
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
              <h1 className="text-2xl font-bold text-white">
                {profile.username}
              </h1>
              {profile.isVerified && (
                <div className="text-blue-400">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {isEditing ? (
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                className={cn(
                  "w-full rounded-xl px-4 py-3 mb-4",
                  "bg-[#222222] text-white",
                  "border border-[#3a3a3a]",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500",
                  "resize-none"
                )}
                rows={2}
              />
            ) : (
              <p className="text-gray-400 mb-4">{profile.bio}</p>
            )}

            {/* Profile Stats */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-6">
              <div>
                <p className="text-sm text-gray-400">Total Received</p>
                <p className="text-xl font-bold text-white">
                  Ð {profile.stats.totalReceived.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Sent</p>
                <p className="text-xl font-bold text-white">
                  Ð {profile.stats.totalSent.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Tips</p>
                <p className="text-xl font-bold text-white">
                  {profile.stats.tipCount}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {isOwnProfile ? (
              <>
                <NeumorphicButton
                  variant="secondary"
                  className="flex items-center gap-2 px-4 py-2"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <>
                      <span>Save</span>
                      <Edit2 className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <span>Edit Profile</span>
                      <Edit2 className="h-4 w-4" />
                    </>
                  )}
                </NeumorphicButton>
                <NeumorphicButton
                  variant="secondary"
                  className="flex items-center gap-2 px-4 py-2"
                >
                  <span>Settings</span>
                  <Settings className="h-4 w-4" />
                </NeumorphicButton>
              </>
            ) : (
              <NeumorphicButton
                variant="secondary"
                className="flex items-center gap-2 px-6 py-3 text-blue-400 hover:text-white"
              >
                <span>Send Tip</span>
                <Send className="h-4 w-4" />
              </NeumorphicButton>
            )}
          </div>
        </div>

        {/* Tipping Info Section (for own profile) */}
        {isOwnProfile && (
          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* QR Code */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Your Tipping QR</h3>
                <div className="aspect-square max-w-[200px] bg-white p-4 rounded-xl">
                  <div className="w-full h-full bg-[#222222] rounded-lg" />
                </div>
                <NeumorphicButton
                  variant="secondary"
                  className="flex items-center gap-2 px-4 py-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download QR</span>
                </NeumorphicButton>
              </div>

              {/* Tipping Link */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Your Tipping Link</h3>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "flex-1 rounded-xl px-4 py-3",
                    "bg-[#222222] text-white",
                    "border border-[#3a3a3a]"
                  )}>
                    <p className="truncate">
                      https://dogetip.com/{profile.username}
                    </p>
                  </div>
                  <NeumorphicButton
                    variant="secondary"
                    className="p-3"
                    onClick={handleCopyLink}
                  >
                    {copySuccess ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </NeumorphicButton>
                </div>
                <NeumorphicButton
                  variant="secondary"
                  className="flex items-center gap-2 px-4 py-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open Profile</span>
                </NeumorphicButton>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Activity Feed */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Activity</h2>
          <div className="flex items-center gap-2">
            <NeumorphicButton
              variant="secondary"
              className={cn(
                "px-4 py-2",
                activeTab === 'received' && "bg-blue-500/10 text-white"
              )}
              onClick={() => setActiveTab('received')}
            >
              Received
            </NeumorphicButton>
            <NeumorphicButton
              variant="secondary"
              className={cn(
                "px-4 py-2",
                activeTab === 'sent' && "bg-blue-500/10 text-white"
              )}
              onClick={() => setActiveTab('sent')}
            >
              Sent
            </NeumorphicButton>
          </div>
        </div>

        <div className="space-y-4">
          {activity.map((item, index) => (
            <div
              key={index}
              className={cn(
                "relative overflow-hidden rounded-xl p-4",
                "bg-[#222222]",
                "transition-all duration-300",
                "hover:bg-[#252525]"
              )}
              style={{ boxShadow: shadowStyles.dark.inset }}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">
                      {item.type === 'received' ? 'From' : 'To'} @{item.username}
                    </span>
                    <span className="text-sm text-gray-400">
                      {item.timestamp}
                    </span>
                  </div>
                  {item.message && (
                    <p className="mt-1 text-sm text-gray-400 line-clamp-2">
                      {item.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-white font-medium">
                    Ð {item.amount.toLocaleString()}
                  </p>
                  {item.type === 'received' && isOwnProfile && !item.thanked && (
                    <NeumorphicButton
                      variant="secondary"
                      className="text-sm px-3 py-1.5 text-blue-400 hover:text-white"
                      onClick={() => handleThankTipper(index)}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Say Thanks</span>
                    </NeumorphicButton>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}