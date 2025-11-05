"use client"

import Image from "next/image"
import { useState } from "react"
import { useLanguage } from "@/lib/i18n/language-context"
import { useTranslation } from "@/lib/i18n/use-translation"

interface PlatformLogoProps {
  showTitle?: boolean
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function PlatformLogo({ showTitle = true, size = "md", className = "" }: PlatformLogoProps) {
  const { language } = useLanguage()
  const t = useTranslation()
  const [logoError, setLogoError] = useState(false)

  const logoName = language === "ar" ? "arabic" : "eng"
  const logoPath = logoError ? "/both.png" : `/${logoName}.png`

  // Make logo larger for English, keep Arabic the same
  const effectiveSize = size === "xl" ? (language === "en" ? "2xl" : "xl") : size

  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
    "2xl": "h-24 w-24", // Larger for English
  }

  const textSizeClasses = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  }

  const imageSizes = {
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64,
    "2xl": 96, // Larger for English (96px vs 64px for Arabic)
  }

  const displaySize = effectiveSize as keyof typeof sizeClasses
  const displayImageSize = effectiveSize as keyof typeof imageSizes

  return (
    <div className={`flex items-center gap-2 ${className} ${!showTitle ? 'overflow-hidden' : ''}`}>
      <div className="flex items-center justify-center shrink-0">
        <Image
          src={logoPath}
          alt={t.home.platformTitle}
          width={imageSizes[displayImageSize]}
          height={imageSizes[displayImageSize]}
          className={`${sizeClasses[displaySize]} object-contain`}
          onError={() => {
            if (!logoError) {
              setLogoError(true)
            }
          }}
          priority
        />
      </div>
      {showTitle ? (
        <h1 className={`font-bold text-primary gradient-text ${textSizeClasses[size]} shrink-0`}>
          {t.home.platformTitle}
        </h1>
      ) : null}
    </div>
  )
}

