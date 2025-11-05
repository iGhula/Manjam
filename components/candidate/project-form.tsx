"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { useApp } from "@/lib/context/app-context"
import { useTranslation } from "@/lib/i18n/use-translation"

interface ProjectFormProps {
  userId: string
  initialData?: any
}

export default function ProjectForm({ userId, initialData }: ProjectFormProps) {
  const router = useRouter()
  const { addJob, updateJob } = useApp()
  const t = useTranslation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    requirements: initialData?.requirements || "",
    location: initialData?.location || "",
    budget: initialData?.budget || "",
    contactEmail: initialData?.contactEmail || "",
    contactPhone: initialData?.contactPhone || "",
    status: initialData?.status || "active",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (initialData?.id) {
        // Update existing project
        updateJob(initialData.id, {
          ...formData,
          postedBy: "individual",
          type: t.jobs.type,
          salary: "",
        })
      } else {
        // Create new project
        addJob({
          ...formData,
          companyId: userId,
          status: formData.status as "active" | "closed" | "draft",
          postedBy: "individual",
          type: "One-time project",
          salary: "",
        })
      }

      // Redirect to browse jobs page
      router.push("/candidate/jobs")
    } catch (err: any) {
      setError(err.message || t.messages.actionFailed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="card-enhanced shadow-brand">
        <CardHeader>
          <CardTitle className="gradient-text">{t.projects.projectInfo}</CardTitle>
          <CardDescription>
            {t.projects.projectInfoDesc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-danger flex-shrink-0 mt-0.5" />
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">{t.projects.projectTitle} *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={t.projects.projectTitlePlaceholder}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t.projects.projectDescription} *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t.projects.projectDescPlaceholder}
              rows={6}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">{t.projects.skillsRequired} *</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              placeholder={t.projects.skillsRequiredPlaceholder}
              rows={4}
              required
              disabled={loading}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">{t.jobs.location}</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder={t.projects.locationPlaceholder}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">{t.projects.availableBudget} *</Label>
              <Input
                id="budget"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder={t.projects.budgetPlaceholder}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-sm">{t.projects.contactDetails}</h3>
            <p className="text-xs text-muted-foreground">
              {t.projects.contactDetailsDesc}
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="contactEmail">{t.projects.emailRequired} *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder={t.projects.emailPlaceholder}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">{t.projects.phoneRequired} *</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder={t.projects.phonePlaceholder}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1 btn-enhanced hover-lift shadow-brand">
              {loading ? t.projects.posting : initialData ? t.projects.updateProject : t.projects.postProject}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()} 
              disabled={loading}
              className="hover-lift"
            >
              {t.common.cancel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

