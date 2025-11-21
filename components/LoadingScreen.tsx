'use client'

import { useEffect, useState } from 'react'

const VIN_TIPS = [
  "Did you know? VIN checks can save you thousands by spotting odometer rollback.",
  "A VIN reveals hidden accidents that sellers might not disclose.",
  "Check for salvage titles to avoid buying a flood-damaged vehicle.",
  "Multiple owners in a short time? That's a red flag worth investigating.",
  "VIN reports show theft records - protect yourself from buying stolen cars.",
  "Service history in VIN reports helps you understand the car's maintenance.",
]

interface LoadingScreenProps {
  message?: string
  showTips?: boolean
}

export default function LoadingScreen({ message, showTips = true }: LoadingScreenProps) {
  const [currentTip, setCurrentTip] = useState(0)

  useEffect(() => {
    if (!showTips) return

    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % VIN_TIPS.length)
    }, 4000) // Change tip every 4 seconds

    return () => clearInterval(interval)
  }, [showTips])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="relative w-full max-w-md px-4">
        {/* Car Animation */}
        <div className="relative h-32 mb-8 overflow-hidden">
          <svg
            className="absolute animate-car-drive"
            width="100"
            height="60"
            viewBox="0 0 100 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Car Body */}
            <rect x="20" y="25" width="60" height="20" rx="3" fill="#3B82F6" />
            {/* Car Roof */}
            <path
              d="M 30 25 L 30 15 L 50 15 L 50 25"
              fill="#2563EB"
            />
            {/* Windows */}
            <rect x="32" y="17" width="8" height="6" fill="#93C5FD" />
            <rect x="42" y="17" width="8" height="6" fill="#93C5FD" />
            {/* Wheels */}
            <circle cx="35" cy="45" r="8" fill="#1F2937" />
            <circle cx="35" cy="45" r="5" fill="#4B5563" />
            <circle cx="65" cy="45" r="8" fill="#1F2937" />
            <circle cx="65" cy="45" r="5" fill="#4B5563" />
            {/* Headlights */}
            <circle cx="80" cy="30" r="4" fill="#FBBF24" />
            {/* Details */}
            <line x1="50" y1="25" x2="50" y2="45" stroke="#1E40AF" strokeWidth="2" />
          </svg>
        </div>

        {/* Loading Message */}
        <div className="text-center mb-6">
          <div className="inline-block">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
          {message && (
            <p className="mt-4 text-lg font-medium text-gray-700">{message}</p>
          )}
          {!message && (
            <p className="mt-4 text-lg font-medium text-gray-700">
              Checking your vehicle...
            </p>
          )}
        </div>

        {/* Rotating Tips */}
        {showTips && (
          <div className="mt-8 px-4">
            <div
              key={currentTip}
              className="text-center animate-fade-in"
            >
              <p className="text-sm text-gray-600 italic">
                💡 {VIN_TIPS[currentTip]}
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-in;
        }
      `}</style>
    </div>
  )
}

