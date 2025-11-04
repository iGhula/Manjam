"use client"

import SelfAssessmentTaker from "@/components/candidate/self-assessment-taker"
import { useApp } from "@/lib/context/app-context"
import { useTranslation } from "@/lib/i18n/use-translation"

export default function SelfAssessmentPage() {
  const { currentUser } = useApp()
  const t = useTranslation()

  if (!currentUser) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6 section-spacing page-transition">
      <div className="mb-6">
        <p className="text-muted-foreground text-lg">{t.selfAssessment.description}</p>
      </div>

      <SelfAssessmentTaker userId={currentUser.id} />
    </div>
  )
}

