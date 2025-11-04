"use client"

import { use } from "react"
import { useApp } from "@/lib/context/app-context"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Edit } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslation } from "@/lib/i18n/use-translation"

export default function SectionQuestionsPage({
  params,
}: {
  params: Promise<{ id: string; sectionId: string }>
}) {
  const { currentUser, sections, questions, assessments } = useApp()
  const t = useTranslation()
  const { id, sectionId } = use(params)
  const [section, setSection] = useState<any>(null)
  const [sectionQuestions, setSectionQuestions] = useState<any[]>([])

  useEffect(() => {
    if (!currentUser) {
      redirect("/login")
      return
    }

    const foundSection = sections.find((s) => s.id === sectionId)
    if (!foundSection) {
      notFound()
      return
    }

    setSection(foundSection)

    const foundQuestions = questions.filter((q) => q.sectionId === sectionId)
    setSectionQuestions(foundQuestions)
  }, [currentUser, sections, questions, sectionId])

  if (!currentUser) return null
  if (!section) return null

  return (
    <div className="space-y-6 section-spacing page-transition">
      <div className="flex items-start justify-between animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">{section.title}</h1>
          <p className="text-muted-foreground">{section.description}</p>
        </div>
        <Link href={`/company/jobs/${id}/assessment`}>
          <Button variant="outline" className="btn-enhanced hover-lift">{t.common.back} - {t.assessments.title}</Button>
        </Link>
      </div>

      <div className="flex items-center justify-between animate-fade-in animate-delay-100">
        <h2 className="text-2xl font-bold gradient-text">{t.assessments.questions}</h2>
        <Link href={`/company/jobs/${id}/assessment/sections/${sectionId}/questions/new`}>
          <Button className="btn-enhanced hover-lift shadow-brand">
            <Plus className="ml-2 h-4 w-4" />
            {t.forms.add}
          </Button>
        </Link>
      </div>

      {sectionQuestions.length > 0 ? (
        <div className="space-y-4">
          {sectionQuestions
            .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
            .map((question, index) => (
              <Card key={question.id} className="card-enhanced hover-lift shadow-brand">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline">{t.assessments.questions} {index + 1}</Badge>
                        <Badge className="bg-primary text-primary-foreground">{question.points} {t.assessments.passingScore || "نقطة"}</Badge>
                      </div>
                      <h3 className="font-semibold mb-2 gradient-text">{question.questionText}</h3>

                      {question.questionType === "mcq" && question.options && (
                        <div className="mt-3 space-y-2">
                          {question.options.map((option: any, i: number) => (
                            <div
                              key={i}
                              className={`text-sm p-2 rounded border ${
                                option.isCorrect ? "bg-success/10 border-success/20" : "bg-muted/50"
                              }`}
                            >
                              {option.text}
                              {option.isCorrect && <span className="text-success mr-2 font-medium">(صحيح)</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/company/jobs/${id}/assessment/sections/${sectionId}/questions/${question.id}/edit`}
                      >
                        <Button variant="outline" size="sm" className="btn-enhanced hover-lift">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      ) : (
        <Card className="card-enhanced shadow-brand animate-scale-in">
          <CardContent className="py-16 text-center">
            <h3 className="text-xl font-semibold mb-2 gradient-text">{t.assessments.questions}</h3>
            <p className="text-muted-foreground mb-6">{t.assessments.questions}</p>
            <Link href={`/company/jobs/${id}/assessment/sections/${sectionId}/questions/new`}>
              <Button className="btn-enhanced hover-lift shadow-brand">
                <Plus className="ml-2 h-4 w-4" />
                {t.forms.add}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
