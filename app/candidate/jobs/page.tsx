"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Briefcase, MapPin, Clock, Building2, User, DollarSign, Mail, Phone } from "lucide-react"
import { useApp } from "@/lib/context/app-context"
import { useTranslation } from "@/lib/i18n/use-translation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CandidateJobsPage() {
  const { jobs, users, assessments } = useApp()
  const t = useTranslation()
  const [filter, setFilter] = useState<"all" | "company" | "individual">("all")

  // Get active jobs with company info
  const activeJobs = jobs.filter((j) => j.status === "active")
  
  // Apply filter
  const filteredJobs = activeJobs.filter((j) => {
    if (filter === "all") return true
    if (filter === "company") return j.postedBy === "company"
    if (filter === "individual") return j.postedBy === "individual"
    return true
  })

  return (
    <div className="space-y-6 section-spacing page-transition">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold gradient-text">{t.nav.browseJobs}</h1>
        <p className="text-muted-foreground animate-fade-in animate-delay-100">{t.jobs.discoverOpportunities}</p>
      </div>

      {/* Filter Tabs */}
      <div className="animate-fade-in animate-delay-100">
        <Tabs value={filter} onValueChange={(value) => setFilter(value as "all" | "company" | "individual")} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">{t.jobs.all} ({activeJobs.length})</TabsTrigger>
            <TabsTrigger value="company">
              {t.jobs.companyJobs} ({activeJobs.filter((j) => j.postedBy === "company").length})
            </TabsTrigger>
            <TabsTrigger value="individual">
              {t.jobs.individualProjects} ({activeJobs.filter((j) => j.postedBy === "individual").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredJobs.length > 0 ? (
        <div className="grid gap-4">
          {filteredJobs.map((job, index) => {
            const poster = users.find((u) => u.id === job.companyId)
            const jobAssessment = assessments.find((a) => a.jobId === job.id)
            const isIndividualProject = job.postedBy === "individual"
            
            return (
              <Card key={job.id} className="card-enhanced hover-lift shadow-brand">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-16 h-16 ${isIndividualProject ? 'bg-green-500/10' : 'bg-primary/10'} rounded-lg flex items-center justify-center flex-shrink-0 animate-float`}>
                        {isIndividualProject ? (
                          <User className="h-8 w-8 text-green-500" />
                        ) : (
                          <Building2 className="h-8 w-8 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold">{job.title}</h3>
                          {isIndividualProject && (
                            <Badge variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
                              {t.jobs.individualProject}
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-3">
                          {isIndividualProject ? poster?.fullName : poster?.companyName}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{job.description}</p>
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
                          {isIndividualProject && job.budget && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{job.budget}</span>
                            </div>
                          )}
                          {!isIndividualProject && jobAssessment && (
                            <Badge variant="outline">{t.jobs.requiresAssessment}</Badge>
                          )}
                          {isIndividualProject && (
                            <Badge variant="outline" className="text-green-600">
                              {t.jobs.noAssessmentRequired}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Link href={`/candidate/jobs/${job.id}`}>
                      <Button className="btn-enhanced hover-lift shadow-brand">{t.jobs.viewDetails}</Button>
                    </Link>
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
            <h3 className="text-xl font-semibold mb-2 gradient-text">
              {filter === "all" ? t.jobs.noJobsAvailable : 
               filter === "company" ? t.jobs.noCompanyJobs : 
               t.jobs.noIndividualProjects}
            </h3>
            <p className="text-muted-foreground">{t.jobs.checkBackLater}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
