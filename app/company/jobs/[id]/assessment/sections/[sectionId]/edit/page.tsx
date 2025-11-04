"use client"

import { use } from "react"
import { notFound, redirect } from "next/navigation"
import SectionForm from "@/components/company/section-form"
import { useApp } from "@/lib/context/app-context"
import { useTranslation } from "@/lib/i18n/use-translation"
import { useEffect, useState } from "react"

export default function EditSectionPage({ params }: { params: Promise<{ id: string; sectionId: string }> }) {
  const { currentUser, sections, assessments } = useApp()
  const t = useTranslation()
  const { id, sectionId } = use(params)
  const [section, setSection] = useState<any>(null)

  useEffect(() => {
    if (!currentUser) {
      redirect("/login")
      return
    }

    const foundSection = sections.find((s) => s.id === sectionId)
    if (!foundSection) {
      notFound()
      return
    }

    setSection(foundSection)
  }, [currentUser, sections, sectionId])

  if (!currentUser) return null
  if (!section) return null

  const assessment = assessments.find((a) => a.jobId === id)

  if (!assessment) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 section-spacing page-transition">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold gradient-text">{t.common.edit} {t.assessments.sections}</h1>
        <p className="text-muted-foreground animate-fade-in animate-delay-100">{section.title}</p>
      </div>

      <SectionForm assessmentId={assessment.id} jobId={id} initialData={section} />
    </div>
  )
}



