"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Briefcase, MapPin, Clock, Users } from "lucide-react"
import { useApp } from "@/lib/context/app-context"
import { useTranslation } from "@/lib/i18n/use-translation"

export default function CompanyJobsPage() {
  const { currentUser, jobs, submissions } = useApp()
  const t = useTranslation()

  if (!currentUser) return null

  // Get company jobs
  const companyJobs = jobs.filter((j) => j.companyId === currentUser.id)

  return (
    <div className="space-y-6 section-spacing page-transition">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold gradient-text">{t.jobs.jobManagement}</h1>
          <p className="text-muted-foreground animate-fade-in animate-delay-100">{t.jobs.createAndManageJobs}</p>
        </div>
        <Link href="/company/jobs/new">
          <Button size="lg" className="btn-enhanced hover-lift shadow-brand animate-fade-in animate-delay-200">
            <Plus className="ml-2 h-5 w-5" />
            {t.dashboard.addNewJob}
          </Button>
        </Link>
      </div>

      {companyJobs.length > 0 ? (
        <div className="grid gap-4">
          {companyJobs.map((job, index) => {
            const jobSubmissions = submissions.filter((s) => s.jobId === job.id)
            return (
              <Card key={job.id} className="card-enhanced hover-lift shadow-brand">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 animate-float">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                          <p className="text-muted-foreground line-clamp-2">{job.description}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{jobSubmissions.length} {t.dashboard.applicant}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <Badge
                        variant={job.status === "active" ? "default" : "secondary"}
                        className={job.status === "active" ? "bg-success text-success-foreground" : ""}
                      >
                        {job.status === "active" ? t.jobs.active : job.status === "closed" ? t.jobs.closed : t.jobs.draft}
                      </Badge>
                      <div className="flex gap-2">
                        <Link href={`/company/jobs/${job.id}`}>
                          <Button variant="outline" size="sm" className="btn-enhanced hover-lift">
                            {t.jobs.viewDetails}
                          </Button>
                        </Link>
                        <Link href={`/company/jobs/${job.id}/edit`}>
                          <Button variant="ghost" size="sm" className="btn-enhanced hover-lift">
                            {t.common.edit}
                          </Button>
                        </Link>
                      </div>
                    </div>
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
            <h3 className="text-xl font-semibold mb-2 gradient-text">{t.dashboard.noJobsYet}</h3>
            <p className="text-muted-foreground mb-6">{t.dashboard.startAddingJobs}</p>
            <Link href="/company/jobs/new">
              <Button size="lg" className="btn-enhanced hover-lift shadow-brand">
                <Plus className="ml-2 h-5 w-5" />
                {t.dashboard.addNewJob}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
