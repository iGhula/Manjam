"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApp } from "@/lib/context/app-context"
import { useTranslation } from "@/lib/i18n/use-translation"
import { Users, Briefcase, FileText, CheckCircle } from "lucide-react"

export default function AdminDashboard() {
  const { users, jobs, submissions } = useApp()
  const t = useTranslation()

  const stats = [
    {
      title: t.admin.totalUsers,
      value: users.length,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: t.admin.companies,
      value: users.filter((u) => u.role === "company").length,
      icon: Briefcase,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: t.admin.publishedJobs,
      value: jobs.length,
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: t.admin.applications,
      value: submissions.length,
      icon: CheckCircle,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ]

  const recentUsers = users.slice(-5).reverse()
  const recentJobs = jobs.slice(-5).reverse()

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">{t.nav.adminDashboard}</h2>
        <p className="text-muted-foreground">{t.admin.platformOverview}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle>{t.admin.newUsers}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">{t.admin.noUsersYet}</p>
              ) : (
                recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user.fullName}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user.role === "company"
                          ? "bg-blue-100 text-blue-700"
                          : user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.role === "company" ? t.auth.company : user.role === "admin" ? t.auth.admin : t.auth.jobSeeker}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>{t.admin.recentJobs}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">{t.admin.noJobsYet}</p>
              ) : (
                recentJobs.map((job) => {
                  const company = users.find((u) => u.id === job.companyId)
                  return (
                    <div key={job.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{job.title}</p>
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
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
