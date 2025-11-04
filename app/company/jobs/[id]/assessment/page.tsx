"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, FileText, Code, Video, CheckSquare, MessageSquare, Upload, Clock } from "lucide-react"
import { useApp } from "@/lib/context/app-context"
import { useTranslation } from "@/lib/i18n/use-translation"

const sectionIcons = {
  coding: Code,
  excel: FileText,
  video: Video,
  mcq: CheckSquare,
  short_answer: MessageSquare,
  long_answer: FileText,
  file_upload: Upload,
}

const sectionLabels = {
  coding: "اختبار برمجي",
  excel: "مهمة إكسل",
  video: "رد بالفيديو",
  mcq: "أسئلة متعددة الخيارات",
  short_answer: "إجابة قصيرة",
  long_answer: "إجابة طويلة",
  file_upload: "رفع ملف",
}

export default function AssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { jobs, assessments, sections, questions } = useApp()
  const t = useTranslation()
  const { id } = use(params)

  const job = jobs.find((j) => j.id === id)

  if (!job) {
    notFound()
  }

  // Get assessment with sections and questions
  const assessment = assessments.find((a) => a.jobId === id)
  const assessmentSections = assessment
    ? sections.filter((s) => s.assessmentId === assessment.id).sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
    : []

  // If no assessment exists, show create prompt
  if (!assessment) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 section-spacing page-transition">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold gradient-text">{t.assessments.createAssessment}</h1>
          <p className="text-muted-foreground animate-fade-in animate-delay-100">{job.title}</p>
        </div>
        <Card className="card-enhanced shadow-brand animate-scale-in">
          <CardContent className="py-16 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-float" />
            <h3 className="text-xl font-semibold mb-2 gradient-text">{t.assessments.createAssessment}</h3>
            <p className="text-muted-foreground mb-6">
              {t.assessments.createAssessmentDesc || "أنشئ تقييم للوظيفة لبدء إضافة الأسئلة"}
            </p>
            <Link href={`/company/jobs/${id}/assessment/create`}>
              <Button size="lg" className="btn-enhanced hover-lift shadow-brand">
                <Plus className="ml-2 h-5 w-5" />
                {t.assessments.createAssessment}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 section-spacing page-transition">
      <div className="flex items-start justify-between animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">{t.assessments.createAssessment}</h1>
          <p className="text-muted-foreground">{job.title}</p>
        </div>
        <Link href={`/company/jobs/${id}`}>
          <Button variant="outline" className="btn-enhanced hover-lift">{t.common.back} - {t.jobs.jobDetails}</Button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Assessment Info */}
        <Card className="card-enhanced shadow-brand animate-fade-in animate-delay-100">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="gradient-text">{assessment.title}</CardTitle>
              <Link href={`/company/jobs/${id}/assessment/edit`}>
                <Button variant="outline" size="sm" className="btn-enhanced hover-lift">
                  {t.common.edit}
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              {assessment.timeLimitMinutes && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground animate-float" />
                  <span>{t.assessments.timeLimit}: {assessment.timeLimitMinutes} {t.assessments.minutes}</span>
                </div>
              )}
              {assessment.passingScore && (
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-muted-foreground animate-float" style={{ animationDelay: '0.5s' }} />
                  <span>{t.assessments.passingScore}: {assessment.passingScore}%</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground animate-float" style={{ animationDelay: '1s' }} />
                <span>{t.assessments.sections}: {assessmentSections.length}</span>
              </div>
            </div>
            {assessment.description && <p className="text-muted-foreground mt-4">{assessment.description}</p>}
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="space-y-4">
          <div className="flex items-center justify-between animate-fade-in animate-delay-200">
            <h2 className="text-2xl font-bold gradient-text">{t.assessments.sections}</h2>
            <Link href={`/company/jobs/${id}/assessment/sections/new`}>
              <Button className="btn-enhanced hover-lift shadow-brand">
                <Plus className="ml-2 h-4 w-4" />
                {t.forms.add}
              </Button>
            </Link>
          </div>

          {assessmentSections.length > 0 ? (
            <div className="grid gap-4">
              {assessmentSections.map((section, index) => {
                const Icon = sectionIcons[section.sectionType as keyof typeof sectionIcons]
                const sectionQuestions = questions.filter((q) => q.sectionId === section.id)
                return (
                  <Card key={section.id} className="card-enhanced hover-lift shadow-brand">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 animate-float">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold mb-1 gradient-text">{section.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {sectionLabels[section.sectionType as keyof typeof sectionLabels]}
                            </p>
                            {section.description && (
                              <p className="text-sm text-muted-foreground mb-3">{section.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{sectionQuestions.length} {t.assessments.questions}</span>
                              {section.timeLimitMinutes && (
                                <>
                                  <span>•</span>
                                  <span>{section.timeLimitMinutes} {t.assessments.minutes}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/company/jobs/${id}/assessment/sections/${section.id}/questions`}>
                            <Button variant="outline" size="sm" className="btn-enhanced hover-lift">
                              {t.assessments.questions}
                            </Button>
                          </Link>
                          <Link href={`/company/jobs/${id}/assessment/sections/${section.id}/edit`}>
                            <Button variant="ghost" size="sm" className="btn-enhanced hover-lift">
                              {t.common.edit}
                            </Button>
                          </Link>
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
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-float" />
                <h3 className="text-xl font-semibold mb-2 gradient-text">{t.assessments.sections}</h3>
                <p className="text-muted-foreground mb-6">
                  {t.assessments.sections}
                </p>
                <Link href={`/company/jobs/${id}/assessment/sections/new`}>
                  <Button className="btn-enhanced hover-lift shadow-brand">
                    <Plus className="ml-2 h-4 w-4" />
                    {t.forms.add}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
