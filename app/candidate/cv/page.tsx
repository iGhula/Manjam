"use client"

import CVBuilder from "@/components/candidate/cv-builder"
import { useApp } from "@/lib/context/app-context"
import { useTranslation } from "@/lib/i18n/use-translation"

export default function CVPage() {
  const { currentUser, getCVByUser } = useApp()
  const t = useTranslation()

  if (!currentUser) return null

  // Get existing CV
  const cv = getCVByUser(currentUser.id)

  return (
    <div className="max-w-6xl mx-auto space-y-6 section-spacing page-transition">
      <div>
        <h1 className="text-3xl font-bold gradient-text">{t.cv.buildCV}</h1>
        <p className="text-muted-foreground">{t.cv.buildCVDesc}</p>
      </div>

      <CVBuilder initialData={cv} userId={currentUser.id} />
    </div>
  )
}
