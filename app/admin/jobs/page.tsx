"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApp } from "@/lib/context/app-context"
import { useTranslation } from "@/lib/i18n/use-translation"
import { Search, MapPin, DollarSign, Calendar } from "lucide-react"

export default function AdminJobsPage() {
  const { jobs, users } = useApp()
  const t = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">{t.admin.manageJobs}</h2>
        <p className="text-muted-foreground">{t.admin.manageJobsDesc}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t.nav.jobs} ({filteredJobs.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t.admin.searchJobs}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const company = users.find((u) => u.id === job.companyId)
              return (
                <div key={job.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{company?.companyName}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        job.status === "active"
                          ? "bg-green-100 text-green-700"
                          : job.status === "closed"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                      >
                        {job.status === "active" ? t.jobs.active : job.status === "closed" ? t.jobs.closed : t.jobs.draft}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{job.description}</p>

                    <Button variant="outline" size="sm">
                      {t.admin.viewDetails}
                    </Button>
                </div>
              )
            })}
          </div>

          {filteredJobs.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">{t.jobs.noJobs}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
