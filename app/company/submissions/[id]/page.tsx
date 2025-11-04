"use client"

import { use } from "react"
import { useApp } from "@/lib/context/app-context"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import SubmissionReview from "@/components/company/submission-review"
import { useEffect, useState } from "react"
import { useTranslation } from "@/lib/i18n/use-translation"

export default function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { currentUser, submissions, jobs, users, assessments, sections, questions, answers } = useApp()
  const t = useTranslation()
  const { id } = use(params)
  const [submission, setSubmission] = useState<any>(null)

  useEffect(() => {
    if (!currentUser) {
      return
    }

    // Check submissions from context first
    let foundSubmission = submissions.find((s) => s.id === id)
    
    // Fallback: check localStorage if not found
    if (!foundSubmission && typeof window !== "undefined") {
      const savedSubmissions = localStorage.getItem("submissions")
      if (savedSubmissions) {
        try {
          const parsedSubmissions = JSON.parse(savedSubmissions)
          foundSubmission = parsedSubmissions.find((s: any) => s.id === id)
        } catch (e) {
          console.error("Error loading submission from localStorage:", e)
        }
      }
    }

    if (!foundSubmission) {
      notFound()
      return
    }

    // Build full submission object with nested data
    // Check context first, then localStorage as fallback
    let job = jobs.find((j) => j.id === foundSubmission.jobId)
    let candidate = users.find((u) => u.id === foundSubmission.userId)
    let assessment = assessments.find((a) => a.id === foundSubmission.assessmentId)
    let assessmentSections = sections.filter((s) => s.assessmentId === assessment?.id)
    let submissionAnswers = answers.filter((a) => a.submissionId === id)
    let allQuestions = questions

    // Fallback: check localStorage if not found
    if (typeof window !== "undefined") {
      if (!job) {
        const savedJobs = localStorage.getItem("jobs")
        if (savedJobs) {
          try {
            const parsedJobs = JSON.parse(savedJobs)
            job = parsedJobs.find((j: any) => j.id === foundSubmission.jobId)
          } catch (e) {
            console.error("Error loading job from localStorage:", e)
          }
        }
      }

      if (!candidate) {
        const savedUsers = localStorage.getItem("users")
        if (savedUsers) {
          try {
            const parsedUsers = JSON.parse(savedUsers)
            candidate = parsedUsers.find((u: any) => u.id === foundSubmission.userId)
          } catch (e) {
            console.error("Error loading user from localStorage:", e)
          }
        }
      }

      if (!assessment) {
        const savedAssessments = localStorage.getItem("assessments")
        if (savedAssessments) {
          try {
            const parsedAssessments = JSON.parse(savedAssessments)
            assessment = parsedAssessments.find((a: any) => a.id === foundSubmission.assessmentId)
          } catch (e) {
            console.error("Error loading assessment from localStorage:", e)
          }
        }
      }

      if (!assessmentSections.length && assessment) {
        const savedSections = localStorage.getItem("sections")
        if (savedSections) {
          try {
            const parsedSections = JSON.parse(savedSections)
            assessmentSections = parsedSections.filter((s: any) => s.assessmentId === assessment.id)
          } catch (e) {
            console.error("Error loading sections from localStorage:", e)
          }
        }
      }

      if (!submissionAnswers.length) {
        const savedAnswers = localStorage.getItem("answers")
        if (savedAnswers) {
          try {
            const parsedAnswers = JSON.parse(savedAnswers)
            submissionAnswers = parsedAnswers.filter((a: any) => a.submissionId === id)
          } catch (e) {
            console.error("Error loading answers from localStorage:", e)
          }
        }
      }

      if (!allQuestions.length) {
        const savedQuestions = localStorage.getItem("questions")
        if (savedQuestions) {
          try {
            allQuestions = JSON.parse(savedQuestions)
          } catch (e) {
            console.error("Error loading questions from localStorage:", e)
          }
        }
      }
    }

    const sectionsWithQuestions = assessmentSections.map((section) => ({
      ...section,
      questions: allQuestions.filter((q: any) => q.sectionId === section.id),
    }))

    const fullSubmission = {
      ...foundSubmission,
      jobs: { ...job },
      users: candidate,
      assessments: {
        ...assessment,
        assessment_sections: sectionsWithQuestions,
      },
      answers: submissionAnswers,
    }

    setSubmission(fullSubmission)
  }, [currentUser, submissions, jobs, users, assessments, sections, questions, answers, id])

  if (!currentUser) return null
  if (!submission) return <div>جاري التحميل...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/company/submissions">
          <Button variant="ghost">
            <ArrowLeft className="ml-2 h-4 w-4" />
            العودة للمتقدمين
          </Button>
        </Link>
      </div>

      {/* Candidate Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{submission.users?.fullName}</CardTitle>
              <p className="text-muted-foreground">{submission.users?.email}</p>
              {submission.users?.phone && <p className="text-muted-foreground">{submission.users.phone}</p>}
            </div>
            <div className="text-left space-y-2">
              <Badge variant={submission.status === "submitted" ? "default" : "secondary"}>
                {submission.status === "submitted" ? "مكتمل" : "قيد التنفيذ"}
              </Badge>
              {submission.decision && (
                <Badge
                  variant={
                    submission.decision === "accepted"
                      ? "default"
                      : submission.decision === "rejected"
                        ? "destructive"
                        : "secondary"
                  }
                  className={submission.decision === "accepted" ? "bg-success text-success-foreground block" : "block"}
                >
                  {submission.decision === "accepted"
                    ? "مقبول"
                    : submission.decision === "rejected"
                      ? "مرفوض"
                      : submission.decision === "shortlisted"
                        ? "قائمة مختصرة"
                        : "قيد الانتظار"}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">الوظيفة</p>
              <p className="font-medium">{submission.jobs?.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">تاريخ التقديم</p>
              <p className="font-medium">{submission.startedAt ? new Date(submission.startedAt).toLocaleDateString("ar-SA") : "N/A"}</p>
            </div>
            {submission.submittedAt && (
              <div>
                <p className="text-sm text-muted-foreground">تاريخ الإرسال</p>
                <p className="font-medium">{new Date(submission.submittedAt).toLocaleDateString("ar-SA")}</p>
              </div>
            )}
            {submission.totalScore !== null && (
              <div>
                <p className="text-sm text-muted-foreground">النتيجة الإجمالية</p>
                <p className="font-medium text-lg">
                  {submission.totalScore} / {submission.maxScore}
                  <span className="text-sm text-muted-foreground mr-2">
                    ({Math.round((submission.totalScore / submission.maxScore) * 100)}%)
                  </span>
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Review Component */}
      <SubmissionReview submission={submission} />
    </div>
  )
}
