"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Users, Clock, CheckCircle, XCircle } from "lucide-react"
import { useApp } from "@/lib/context/app-context"
import { useTranslation } from "@/lib/i18n/use-translation"

export default function CompanySubmissionsPage() {
  const { currentUser, submissions, jobs, users } = useApp()
  const t = useTranslation()
  const [companySubmissions, setCompanySubmissions] = useState<any[]>([])

  useEffect(() => {
    if (!currentUser) return

    // Get company jobs
    const companyJobs = jobs.filter((j) => j.companyId === currentUser.id)

    // Get all submissions for company jobs
    let filteredSubmissions = submissions.filter((s) => companyJobs.some((j) => j.id === s.jobId))
    
    // Fallback: if no submissions found, check localStorage
    if (filteredSubmissions.length === 0 && typeof window !== "undefined") {
      const savedSubmissions = localStorage.getItem("submissions")
      const savedJobs = localStorage.getItem("jobs")
      
      if (savedSubmissions && savedJobs) {
        try {
          const parsedSubmissions = JSON.parse(savedSubmissions)
          const parsedJobs = JSON.parse(savedJobs)
          
          const companyJobIds = parsedJobs
            .filter((j: any) => j.companyId === currentUser.id)
            .map((j: any) => j.id)
          
          filteredSubmissions = parsedSubmissions.filter((s: any) => 
            companyJobIds.includes(s.jobId)
          )
        } catch (e) {
          console.error("Error loading submissions from localStorage:", e)
        }
      }
    }

    setCompanySubmissions(filteredSubmissions)
  }, [currentUser, submissions, jobs])

  if (!currentUser) return null

  const stats = {
    total: companySubmissions.length,
    pending: companySubmissions.filter((s) => s.status === "submitted" && !s.decision).length,
    accepted: companySubmissions.filter((s) => s.decision === "accepted").length,
    rejected: companySubmissions.filter((s) => s.decision === "rejected").length,
  }

  return (
    <div className="space-y-6 section-spacing page-transition">
      <div>
        <h1 className="text-3xl font-bold gradient-text">{t.nav.submissions}</h1>
        <p className="text-muted-foreground">{t.dashboard.reviewSubmissions || "Review and evaluate applicant submissions"}</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="card-enhanced hover-lift shadow-brand">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.totalSubmissions || t.dashboard.totalApplicants}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="card-enhanced hover-lift shadow-brand">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.pendingApplications}</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card className="card-enhanced hover-lift shadow-brand">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.applications.accepted}</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.accepted}</div>
          </CardContent>
        </Card>

        <Card className="card-enhanced hover-lift shadow-brand">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.applications.rejected}</CardTitle>
            <XCircle className="h-4 w-4 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions List */}
      <Card className="card-enhanced shadow-brand">
        <CardHeader>
          <CardTitle className="gradient-text">{t.dashboard.allSubmissions || t.dashboard.totalSubmissions || "All Submissions"}</CardTitle>
        </CardHeader>
        <CardContent>
          {companySubmissions.length > 0 ? (
            <div className="space-y-3">
              {companySubmissions.map((submission) => {
                const job = jobs.find((j) => j.id === submission.jobId)
                const candidate = users.find((u) => u.id === submission.userId)
                return (
                  <Link
                    key={submission.id}
                    href={`/company/submissions/${submission.id}`}
                    className="block p-4 rounded-lg border hover:border-primary hover:shadow-brand transition-all hover-lift card-enhanced"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{candidate?.fullName || t.common.unknown || "Unknown"}</h4>
                        <p className="text-sm text-muted-foreground">{candidate?.email || t.common.noEmail || "No email"}</p>
                        <p className="text-sm text-muted-foreground mt-1">{t.jobs.job || "Job"}: {job?.title || t.common.unknown || "Unknown Job"}</p>
                        {submission.totalScore !== null && submission.totalScore !== undefined && submission.maxScore && (
                          <p className="text-sm font-medium mt-2">
                            {t.assessments.score || "Score"}: {submission.totalScore}/{submission.maxScore} ({Math.round((submission.totalScore / submission.maxScore) * 100)}%)
                          </p>
                        )}
                      </div>
                      <div className="text-left space-y-2">
                        <Badge variant={submission.status === "submitted" ? "default" : "secondary"}>
                          {submission.status === "submitted" ? t.applications.submitted : t.applications.inProgress}
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
                            className={
                              submission.decision === "accepted" ? "bg-success text-success-foreground block" : "block"
                            }
                          >
                            {submission.decision === "accepted"
                              ? t.applications.accepted
                              : submission.decision === "rejected"
                                ? t.applications.rejected
                                : submission.decision === "shortlisted"
                                  ? t.applications.shortlisted
                                  : t.applications.pending}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{t.dashboard.noApplicationsYet || t.applications.noApplications}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
