"use client"

import ProjectForm from "@/components/candidate/project-form"
import { useApp } from "@/lib/context/app-context"
import { useTranslation } from "@/lib/i18n/use-translation"

export default function NewProjectPage() {
  const { currentUser } = useApp()
  const t = useTranslation()

  if (!currentUser) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6 section-spacing page-transition">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold gradient-text">{t.projects.postNewProject}</h1>
        <p className="text-muted-foreground animate-fade-in animate-delay-100">
          {t.projects.postProjectDesc}
        </p>
      </div>

      <div className="animate-slide-in-up animate-delay-100">
        <ProjectForm userId={currentUser.id} />
      </div>
    </div>
  )
}

