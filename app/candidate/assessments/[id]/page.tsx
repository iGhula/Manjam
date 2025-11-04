"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/context/app-context"
import { redirect, notFound } from "next/navigation"
import AssessmentTaker from "@/components/candidate/assessment-taker"
import CheatingDetectionDialog from "@/components/candidate/cheating-detection-dialog"
import { useEffect, useState } from "react"
import { useTranslation } from "@/lib/i18n/use-translation"

export default function TakeAssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { currentUser, submissions, jobs, assessments, sections, questions, answers, updateSubmission } = useApp()
  const t = useTranslation()
  const { id } = use(params)
  const [submission, setSubmission] = useState<any>(null)
  const [existingAnswers, setExistingAnswers] = useState<any[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    if (!currentUser) {
      redirect("/login")
      return
    }

    // First try to find in context state
    let foundSubmission = submissions.find((s) => s.id === id && s.userId === currentUser.id)
    
    // If not found in context, try localStorage (for newly created submissions)
    if (!foundSubmission) {
      try {
        const savedSubmissions = localStorage.getItem("submissions")
        if (savedSubmissions) {
          const parsedSubmissions = JSON.parse(savedSubmissions)
          foundSubmission = parsedSubmissions.find((s: any) => s.id === id && s.userId === currentUser.id)
        }
      } catch (e) {
        console.error("Error loading submissions from localStorage:", e)
      }
    }

    if (!foundSubmission) {
      notFound()
      return
    }

    if (foundSubmission.status === "submitted") {
      redirect("/candidate/applications")
      return
    }

    // Build full submission object with nested data
    // Try to find in context first, then localStorage as fallback
    let job = jobs.find((j) => j.id === foundSubmission.jobId)
    let assessment = assessments.find((a) => a.id === foundSubmission.assessmentId)
    let assessmentSections = sections.filter((s) => s.assessmentId === assessment?.id)
    let allQuestions = questions

    // Fallback to localStorage if not found in context
    if (!job || !assessment || assessmentSections.length === 0) {
      try {
        const savedJobs = localStorage.getItem("jobs")
        const savedAssessments = localStorage.getItem("assessments")
        const savedSections = localStorage.getItem("sections")
        const savedQuestions = localStorage.getItem("questions")

        if (savedJobs && !job) {
          const parsedJobs = JSON.parse(savedJobs)
          job = parsedJobs.find((j: any) => j.id === foundSubmission.jobId)
        }

        if (savedAssessments && !assessment) {
          const parsedAssessments = JSON.parse(savedAssessments)
          assessment = parsedAssessments.find((a: any) => a.id === foundSubmission.assessmentId)
        }

        if (savedSections && assessment) {
          const parsedSections = JSON.parse(savedSections)
          assessmentSections = parsedSections.filter((s: any) => s.assessmentId === assessment.id)
        }

        if (savedQuestions) {
          const parsedQuestions = JSON.parse(savedQuestions)
          allQuestions = parsedQuestions
        }
      } catch (e) {
        console.error("Error loading data from localStorage:", e)
      }
    }

    const sortedSections = assessmentSections.sort((a, b) => (a.orderIndex || a.order || 0) - (b.orderIndex || b.order || 0))
    
    const sectionsWithQuestions = sortedSections.map((section) => ({
      ...section,
      questions: allQuestions
        .filter((q) => q.sectionId === section.id)
        .sort((a, b) => (a.orderIndex || a.order || 0) - (b.orderIndex || b.order || 0)),
    }))

    const fullSubmission = {
      ...foundSubmission,
      jobs: job,
      assessments: {
        ...assessment,
        assessment_sections: sectionsWithQuestions,
        sections: sectionsWithQuestions, // Also add as sections for compatibility
      },
    }

    setSubmission(fullSubmission)

    // Get answers from context first, then check localStorage as fallback
    let submissionAnswers = answers.filter((a) => a.submissionId === id)
    if (submissionAnswers.length === 0) {
      try {
        const savedAnswers = localStorage.getItem("answers")
        if (savedAnswers) {
          const parsedAnswers = JSON.parse(savedAnswers)
          submissionAnswers = parsedAnswers.filter((a: any) => a.submissionId === id)
        }
      } catch (e) {
        console.error("Error loading answers from localStorage:", e)
      }
    }
    setExistingAnswers(submissionAnswers)

    // Check if user has agreed to cheating detection terms
    if (foundSubmission && !foundSubmission.cheatingAgreed) {
      setShowDialog(true)
    } else {
      setAgreed(true)
    }
  }, [currentUser, submissions, jobs, assessments, sections, questions, answers, id])

  const handleAgree = () => {
    if (submission) {
      updateSubmission(submission.id, {
        cheatingAgreed: true,
      })
      setAgreed(true)
      setShowDialog(false)
    }
  }

  const handleClose = () => {
    // Redirect back if user doesn't agree
    router.push("/candidate/applications")
  }

  if (!currentUser) return null
  if (!submission) return <div>{t.common.loading}</div>

  return (
    <>
      <CheatingDetectionDialog
        open={showDialog && !agreed}
        onAgree={handleAgree}
        onClose={handleClose}
      />
      {agreed && <AssessmentTaker submission={submission} existingAnswers={existingAnswers} />}
    </>
  )
}
