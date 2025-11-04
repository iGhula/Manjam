"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { useApp } from "@/lib/context/app-context"
import { useTranslation } from "@/lib/i18n/use-translation"

interface ApplyButtonProps {
  jobId: string
  assessmentId?: string
}

export default function ApplyButton({ jobId, assessmentId }: ApplyButtonProps) {
  const router = useRouter()
  const { currentUser, addSubmission, assessments, getAssessmentByJobId } = useApp()
  const t = useTranslation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Find assessment for this job if not provided
  const jobAssessment = assessmentId 
    ? assessments.find(a => a.id === assessmentId)
    : getAssessmentByJobId(jobId)

  const handleApply = async () => {
    setError("")
    setLoading(true)

    try {
      if (!currentUser) {
        router.push("/login")
        return
      }

      // Create submission
      const submissionId = addSubmission({
        jobId,
        userId: currentUser.id,
        assessmentId: jobAssessment?.id || assessmentId || "",
        status: jobAssessment ? "in_progress" : "submitted",
        startedAt: new Date().toISOString(),
        answers: [],
      })

      // Wait a bit to ensure state is updated and localStorage is saved
      await new Promise(resolve => setTimeout(resolve, 100))

      // Redirect to assessment if there is one, otherwise show success
      if (jobAssessment) {
        router.push(`/candidate/assessments/${submissionId}`)
      } else {
        router.push("/candidate/applications")
      }
    } catch (err: any) {
      setError(err.message || t.messages.actionFailed)
    } finally {
      setLoading(false)
    }
  }

  if (!currentUser) {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">{t.auth.loginTitle}</p>
            <p className="text-xs text-muted-foreground mt-1">{t.auth.loginDescription}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-danger flex-shrink-0 mt-0.5" />
          <p className="text-sm text-danger">{error}</p>
        </div>
      )}
      <Button 
        size="lg" 
        className="w-full btn-enhanced hover-lift shadow-brand" 
        onClick={handleApply} 
        disabled={loading}
      >
        {loading ? t.common.loading : jobAssessment ? t.assessments.startAssessment : t.jobs.apply}
      </Button>
    </div>
  )
}
