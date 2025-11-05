"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/context/app-context"
import { useTranslation } from "@/lib/i18n/use-translation"
import { Building2, Briefcase } from "lucide-react"

export default function AdminCompaniesPage() {
  const { users, jobs } = useApp()
  const t = useTranslation()

  const companies = users.filter((u) => u.role === "company")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">{t.admin.manageCompanies}</h2>
        <p className="text-muted-foreground">{t.admin.manageCompaniesDesc}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => {
          const companyJobs = jobs.filter((j) => j.companyId === company.id)
          return (
            <Card key={company.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{company.companyName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{company.fullName}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">{company.email}</p>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>{companyJobs.length} {t.admin.publishedJob}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full bg-transparent" size="sm">
                  {t.admin.viewDetails}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {companies.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t.admin.noRegisteredCompanies}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
