"use client"

import { use } from "react"
import { useApp } from "@/lib/context/app-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Clock, DollarSign, Building2, FileText, AlertCircle } from "lucide-react"
import ApplyButton from "@/components/candidate/apply-button"
import { useEffect, useState } from "react"
import { useTranslation } from "@/lib/i18n/use-translation"

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { currentUser, jobs, users, assessments, submissions } = useApp()
  const t = useTranslation()
  const router = useRouter()
  const { id } = use(params)
  const [job, setJob] = useState<any>(null)
  const [company, setCompany] = useState<any>(null)
  const [jobAssessment, setJobAssessment] = useState<any>(null)
  const [existingSubmission, setExistingSubmission] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
      return
    }

    const foundJob = jobs.find((j) => j.id === id)
    if (!foundJob) {
      router.push("/candidate/jobs")
      return
    }

    setJob(foundJob)

    const foundCompany = users.find((c) => c.id === foundJob.companyId)
    setCompany(foundCompany)

    const foundAssessment = assessments.find((a) => a.jobId === id)
    setJobAssessment(foundAssessment)

    const foundSubmission = submissions.find((s) => s.jobId === id && s.userId === currentUser?.id)
    setExistingSubmission(foundSubmission)
    
    setLoading(false)
  }, [currentUser, jobs, users, assessments, submissions, id, router])

  if (!currentUser) return null
  if (loading || !job) return <div className="flex items-center justify-center min-h-screen">{t.common.loading}</div>

  return (
    <div className="max-w-4xl mx-auto space-y-6 section-spacing page-transition">
      <Link href="/candidate/jobs">
        <Button variant="ghost" className="btn-enhanced hover-lift">{t.common.back} ← {t.nav.jobs}</Button>
      </Link>

      <Card className="card-enhanced shadow-brand">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 animate-float">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2 gradient-text">{job.title}</h1>
              <p className="text-xl text-muted-foreground mb-3">{company?.companyName}</p>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
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
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2 gradient-text">{t.jobs.jobDetails}</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
          </div>

          {job.requirements && (
            <div>
              <h3 className="font-bold text-lg mb-2 gradient-text">{t.jobs.requirements}</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{job.requirements}</p>
            </div>
          )}

          {jobAssessment && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5 animate-float" />
                <div>
                  <h4 className="font-semibold mb-1">{t.jobs.requiresAssessment}</h4>
                  <p className="text-sm text-muted-foreground">{t.assessments.assessmentInfo}</p>
                </div>
              </div>
            </div>
          )}

          {existingSubmission ? (
            <div className="bg-muted rounded-lg p-6 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3 animate-float" />
              <h3 className="font-semibold mb-2 gradient-text">{t.jobs.apply}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t.applications.status}: {existingSubmission.status === "submitted" ? t.applications.submitted : t.applications.inProgress}
              </p>
              {existingSubmission.status === "in_progress" && (
                <Link href={`/candidate/assessments/${existingSubmission.id}`}>
                  <Button className="btn-enhanced hover-lift shadow-brand">{t.applications.continueAssessment}</Button>
                </Link>
              )}
            </div>
          ) : (
            <div>
              <ApplyButton jobId={id} assessmentId={jobAssessment?.id} />
            </div>
          )}
        </CardContent>
      </Card>

      {company && (
        <Card className="card-enhanced shadow-brand">
          <CardHeader>
            <CardTitle className="gradient-text">{t.jobs.company}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold mb-1">{company.companyName}</h4>
              {company.description && <p className="text-sm text-muted-foreground">{company.description}</p>}
            </div>
            {company.industry && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">{t.jobs.industry}:</span>
                <span>{company.industry}</span>
              </div>
            )}
            {company.size && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">{t.jobs.size}:</span>
                <span>{company.size}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
