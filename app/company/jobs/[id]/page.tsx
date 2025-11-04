"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MapPin, Clock, DollarSign, Edit, Users, FileText } from "lucide-react"
import { useApp } from "@/lib/context/app-context"
import { useTranslation } from "@/lib/i18n/use-translation"

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { jobs, submissions, users } = useApp()
  const t = useTranslation()
  const { id } = use(params)

  const job = jobs.find((j) => j.id === id)

  if (!job) {
    notFound()
  }

  const jobSubmissions = submissions.filter((s) => s.jobId === job.id)

  return (
    <div className="space-y-6 section-spacing page-transition">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 gradient-text">{job.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            {job.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
            )}
            {job.type && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{job.type}</span>
              </div>
            )}
            {job.salary && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>{job.salary}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant={job.status === "active" ? "default" : "secondary"}
            className={job.status === "active" ? "bg-success text-success-foreground" : ""}
          >
            {job.status === "active" ? t.jobs.active : job.status === "closed" ? t.jobs.closed : t.jobs.draft}
          </Badge>
          <Link href={`/company/jobs/${job.id}/edit`}>
            <Button variant="outline" className="btn-enhanced hover-lift">
              <Edit className="ml-2 h-4 w-4" />
              {t.common.edit}
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 card-enhanced shadow-brand">
          <CardHeader>
            <CardTitle className="gradient-text">{t.jobs.jobDetails}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">{t.jobs.description}</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
            </div>
            {job.requirements && (
              <div>
                <h4 className="font-semibold mb-2">{t.jobs.requirements}</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{job.requirements}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="card-enhanced shadow-brand">
            <CardHeader>
              <CardTitle className="text-lg gradient-text">{t.dashboard.statistics}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{t.dashboard.totalApplicants}</span>
                </div>
                <span className="font-bold text-lg">{jobSubmissions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{t.dashboard.pendingApplications}</span>
                </div>
                <span className="font-bold text-lg">
                  {jobSubmissions.filter((s) => s.status === "submitted").length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Link href={`/company/jobs/${job.id}/assessment`}>
            <Button className="w-full btn-enhanced hover-lift shadow-brand" size="lg">
              {t.assessments.createAssessment}
            </Button>
          </Link>
        </div>
      </div>

      {/* Submissions List */}
      <Card className="card-enhanced shadow-brand">
        <CardHeader>
          <CardTitle className="gradient-text">{t.nav.submissions}</CardTitle>
        </CardHeader>
        <CardContent>
          {jobSubmissions.length > 0 ? (
            <div className="space-y-3">
              {jobSubmissions.map((submission, index) => {
                const candidate = users.find((u) => u.id === submission.userId)
                return (
                  <Link
                    key={submission.id}
                    href={`/company/submissions/${submission.id}`}
                    className="block p-4 rounded-lg border hover:border-primary hover:shadow-brand transition-all hover-lift"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{candidate?.fullName || "Unknown"}</h4>
                        <p className="text-sm text-muted-foreground">{candidate?.email || "No email"}</p>
                        {submission.totalScore !== null && submission.totalScore !== undefined && submission.maxScore && (
                          <p className="text-sm font-medium mt-2">
                            {t.assessments.passingScore}: {submission.totalScore}/{submission.maxScore} ({Math.round((submission.totalScore / submission.maxScore) * 100)}%)
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
              <p>{t.dashboard.noApplicationsYet}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
