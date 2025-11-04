"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Briefcase, Award, Clock } from "lucide-react"
import { useApp } from "@/lib/context/app-context"
import { useTranslation } from "@/lib/i18n/use-translation"

export default function ApplicationsPage() {
  const { currentUser, submissions, jobs, users } = useApp()
  const t = useTranslation()

  if (!currentUser) return null

  const userSubmissions = submissions.filter((s) => s.userId === currentUser.id)

  return (
    <div className="space-y-6 section-spacing page-transition">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold gradient-text">{t.applications.myApplications}</h1>
        <p className="text-muted-foreground animate-fade-in animate-delay-100">{t.applications.myApplications}</p>
      </div>

      {userSubmissions.length > 0 ? (
        <div className="grid gap-4">
          {userSubmissions.map((submission, index) => {
            const job = jobs.find((j) => j.id === submission.jobId)
            const company = users.find((u) => u.id === job?.companyId)
            const scorePercentage = submission.totalScore !== null && submission.totalScore !== undefined && submission.maxScore 
              ? Math.round((submission.totalScore / submission.maxScore) * 100)
              : null
            return (
              <Card key={submission.id} className="card-enhanced hover-lift shadow-brand">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 animate-float">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1 gradient-text">{job?.title}</h3>
                          <p className="text-muted-foreground mb-3">{company?.companyName}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge
                          variant={
                            submission.status === "submitted"
                              ? "default"
                              : submission.status === "in_progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {submission.status === "submitted"
                            ? t.applications.submitted
                            : submission.status === "in_progress"
                              ? t.applications.inProgress
                              : t.applications.reviewed}
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
                            className={submission.decision === "accepted" ? "bg-success text-success-foreground" : ""}
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
                      {submission.totalScore !== null && submission.totalScore !== undefined && submission.maxScore && (
                        <div className="flex items-center gap-2 mb-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                          <Award className="h-5 w-5 text-primary animate-float" />
                          <div>
                            <p className="text-sm font-medium">
                              {t.assessments.passingScore}: {submission.totalScore} / {submission.maxScore}
                            </p>
                            {scorePercentage !== null && (
                              <p className="text-xs text-muted-foreground">
                                ({scorePercentage}%)
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {submission.status === "submitted" && submission.submittedAt
                            ? `${t.applications.submitted}: ${new Date(submission.submittedAt).toLocaleDateString()}`
                            : `${t.applications.applied}: ${new Date(submission.startedAt).toLocaleDateString()}`}
                        </span>
                      </div>
                    </div>
                    {submission.status === "in_progress" && (
                      <Link href={`/candidate/assessments/${submission.id}`}>
                        <Button className="btn-enhanced hover-lift shadow-brand">{t.applications.continueAssessment}</Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="card-enhanced shadow-brand animate-scale-in">
          <CardContent className="py-16 text-center">
            <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-float" />
            <h3 className="text-xl font-semibold mb-2 gradient-text">{t.applications.noApplications}</h3>
            <p className="text-muted-foreground mb-6">{t.dashboard.browseAvailableJobs}</p>
            <Link href="/candidate/jobs">
              <Button className="btn-enhanced hover-lift shadow-brand">{t.nav.browseJobs}</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
