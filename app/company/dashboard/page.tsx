"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Briefcase, Users, FileText } from "lucide-react"
import { useApp } from "@/lib/context/app-context"
import { useTranslation } from "@/lib/i18n/use-translation"

export default function CompanyDashboardPage() {
  const { currentUser, jobs, submissions } = useApp()
  const t = useTranslation()

  if (!currentUser) return null

  // Get company jobs
  const companyJobs = jobs.filter((j) => j.companyId === currentUser.id)

  // Get submissions for company jobs
  const companySubmissions = submissions.filter((s) => companyJobs.some((j) => j.id === s.jobId))

  // Get recent jobs
  const recentJobs = companyJobs.slice(-5).reverse()

  return (
    <div className="space-y-6 section-spacing page-transition">
      <div>
        <h1 className="text-3xl font-bold gradient-text">{t.dashboard.controlPanel}</h1>
        <p className="text-muted-foreground">{t.dashboard.welcomeMessage} {currentUser.companyName}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="card-enhanced hover-lift">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.totalJobs}</CardTitle>
            <Briefcase className="h-5 w-5 text-primary animate-float" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{companyJobs.length}</div>
          </CardContent>
        </Card>

        <Card className="card-enhanced hover-lift">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.totalApplicants}</CardTitle>
            <Users className="h-5 w-5 text-primary animate-float" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{companySubmissions.length}</div>
          </CardContent>
        </Card>

        <Card className="card-enhanced hover-lift">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.activeJobs}</CardTitle>
            <FileText className="h-5 w-5 text-primary animate-float" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{companyJobs.filter((j) => j.status === "active").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs */}
      <Card className="card-enhanced shadow-brand">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="gradient-text">{t.dashboard.recentJobs}</CardTitle>
            <Link href="/company/jobs">
              <Button variant="ghost" size="sm" className="btn-enhanced hover-lift">
                {t.dashboard.viewAll}
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentJobs.length > 0 ? (
            <div className="space-y-4">
              {recentJobs.map((job, index) => {
                const jobSubmissions = submissions.filter((s) => s.jobId === job.id)
                return (
                  <Link
                    key={job.id}
                    href={`/company/jobs/${job.id}`}
                    className="block p-4 rounded-lg border hover:border-primary hover:shadow-brand transition-all hover-lift"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{job.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.type}</span>
                        </div>
                      </div>
                      <div className="text-left mr-4">
                        <div className="text-sm font-medium">{jobSubmissions.length} {t.dashboard.applicant}</div>
                        <div
                          className={`text-xs px-2 py-1 rounded-full mt-1 font-medium ${
                            job.status === "active" ? "bg-success/10 text-green-700 dark:text-green-400" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {job.status === "active" ? t.jobs.active : job.status === "closed" ? t.jobs.closed : t.jobs.draft}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">{t.dashboard.noJobsYet}</p>
              <Link href="/company/jobs/new">
                <Button>{t.dashboard.addNewJob}</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
