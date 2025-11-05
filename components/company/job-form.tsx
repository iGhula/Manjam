"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { useApp } from "@/lib/context/app-context"

interface JobFormProps {
  companyId: string
  initialData?: any
}

export default function JobForm({ companyId, initialData }: JobFormProps) {
  const router = useRouter()
  const { addJob, updateJob } = useApp()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    requirements: initialData?.requirements || "",
    location: initialData?.location || "",
    type: initialData?.type || "",
    salary: initialData?.salary || "",
    status: initialData?.status || "draft",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      let jobId: string
      
      if (initialData?.id) {
        // Update existing job
        updateJob(initialData.id, formData)
        jobId = initialData.id
      } else {
        // Create new job
        const newJob = addJob({
          ...formData,
          companyId,
          status: formData.status as "active" | "closed" | "draft",
        })
        jobId = newJob
      }

      // After saving job, redirect to assessment page to choose/create assessment
      router.push(`/company/jobs/${jobId}/assessment`)
    } catch (err: any) {
      setError(err.message || "فشل حفظ الوظيفة")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>معلومات الوظيفة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-danger flex-shrink-0 mt-0.5" />
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">عنوان الوظيفة *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="مثال: مطور برمجيات"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">وصف الوظيفة *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="اكتب وصفاً تفصيلياً للوظيفة..."
              rows={6}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">المتطلبات</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              placeholder="المهارات والخبرات المطلوبة..."
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">الموقع</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="مثال: طرابلس، ليبيا"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">نوع الوظيفة</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                placeholder="مثال: دوام كامل"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">نطاق الراتب</Label>
            <Input
              id="salary"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              placeholder="مثال: 4000 - 8000 LYD"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">حالة الوظيفة</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              disabled={loading}
            >
              <option value="draft">مسودة</option>
              <option value="active">نشط</option>
              <option value="closed">مغلق</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "جاري الحفظ..." : initialData ? "تحديث الوظيفة" : "إنشاء الوظيفة"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
              إلغاء
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
