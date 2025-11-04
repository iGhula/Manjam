"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle } from "lucide-react"
import { useApp } from "@/lib/context/app-context"
import { useTranslation } from "@/lib/i18n/use-translation"
import MCQQuestion from "./question-types/mcq-question"
import CodingQuestion from "./question-types/coding-question"
import ShortAnswerQuestion from "./question-types/short-answer-question"
import LongAnswerQuestion from "./question-types/long-answer-question"
import VideoQuestion from "./question-types/video-question"
import FileUploadQuestion from "./question-types/file-upload-question"

interface AssessmentTakerProps {
  submission: any
  existingAnswers: any[]
}

export default function AssessmentTaker({ submission, existingAnswers }: AssessmentTakerProps) {
  const router = useRouter()
  const { addAnswer, updateAnswer, updateSubmission } = useApp()
  const t = useTranslation()
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [cheatingDetected, setCheatingDetected] = useState(false)
  const hasDetectedCheating = useRef(false)

  const sections = submission.assessments?.assessment_sections || submission.assessments?.sections || []
  const currentSection = sections[currentSectionIndex]
  const questions = currentSection?.questions || []
  const currentQuestion = questions[currentQuestionIndex]

  // Initialize answers from existing
  useEffect(() => {
    const answersMap: Record<string, any> = {}
    existingAnswers.forEach((answer) => {
      answersMap[answer.questionId] = answer
    })
    setAnswers(answersMap)
  }, [existingAnswers])

  // Auto-submit handler for cheating detection
  const handleAutoSubmitCheating = useCallback(async () => {
    if (hasDetectedCheating.current && submission.status !== "submitted") {
      try {
        updateSubmission(submission.id, {
          status: "submitted",
          submittedAt: new Date().toISOString(),
          cheatingDetected: true,
          cheatingDetectedAt: new Date().toISOString(),
        })

        // Show alert and redirect
        alert(t.assessments.cheatingDetectedMessage)
        router.push("/candidate/applications")
      } catch (error) {
        console.error("Failed to auto-submit due to cheating:", error)
      }
    }
  }, [submission.id, submission.status, updateSubmission, router, t.assessments.cheatingDetectedMessage])

  // Cheating detection
  useEffect(() => {
    if (submission.status === "submitted" || submission.cheatingDetected) {
      return
    }

    const handleVisibilityChange = () => {
      if (document.hidden && !hasDetectedCheating.current) {
        hasDetectedCheating.current = true
        setCheatingDetected(true)
        handleAutoSubmitCheating()
      }
    }

    const handleBlur = () => {
      if (!hasDetectedCheating.current) {
        hasDetectedCheating.current = true
        setCheatingDetected(true)
        handleAutoSubmitCheating()
      }
    }

    const handleFocus = () => {
      if (hasDetectedCheating.current && !document.hidden) {
        // Already detected, but user came back - show message
        if (submission.status !== "submitted") {
          handleAutoSubmitCheating()
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("blur", handleBlur)
    window.addEventListener("focus", handleFocus)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("blur", handleBlur)
      window.removeEventListener("focus", handleFocus)
    }
  }, [submission, handleAutoSubmitCheating])

  // Timer
  useEffect(() => {
    if (!submission.assessments?.timeLimitMinutes || cheatingDetected) return

    const startTime = new Date(submission.startedAt).getTime()
    const limitMs = submission.assessments.timeLimitMinutes * 60 * 1000
    const endTime = startTime + limitMs

    const interval = setInterval(() => {
      const now = Date.now()
      const remaining = Math.max(0, endTime - now)
      setTimeRemaining(Math.floor(remaining / 1000))

      if (remaining === 0) {
        handleSubmit()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [submission, cheatingDetected])

  // Auto-save
  const saveAnswer = useCallback(
    async (questionId: string, answerData: any) => {
      setSaving(true)
      try {
        const existingAnswer = answers[questionId]

        if (existingAnswer?.id) {
          updateAnswer(existingAnswer.id, answerData)
        } else {
          const newAnswer = addAnswer({
            submissionId: submission.id,
            questionId,
            ...answerData,
          })

          setAnswers((prev) => ({
            ...prev,
            [questionId]: newAnswer,
          }))
        }
      } catch (error) {
        console.error("Failed to save answer:", error)
      } finally {
        setSaving(false)
      }
    },
    [answers, submission.id, addAnswer, updateAnswer],
  )

  const handleAnswerChange = (questionId: string, answerData: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], ...answerData },
    }))

    // Auto-save after 2 seconds
    const timeoutId = setTimeout(() => {
      saveAnswer(questionId, answerData)
    }, 2000)

    return () => clearTimeout(timeoutId)
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1)
      setCurrentQuestionIndex(0)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    } else if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1)
      const prevSection = sections[currentSectionIndex - 1]
      setCurrentQuestionIndex(prevSection.questions.length - 1)
    }
  }

  const handleSubmit = async () => {
    // Check if all questions are answered
    const totalQuestions = sections.reduce((sum: number, s: any) => sum + (s.questions?.length || 0), 0)
    const answeredQuestions = Object.keys(answers).filter(key => {
      const answer = answers[key]
      // Check if answer has content based on question type
      if (!answer) return false
      if (answer.answerText && answer.answerText.trim()) return true
      if (answer.codeSubmission && answer.codeSubmission.trim()) return true
      if (answer.fileUrl) return true
      if (answer.videoUrl) return true
      return false
    }).length

    if (answeredQuestions < totalQuestions) {
      const unanswered = totalQuestions - answeredQuestions
      alert(
        t.assessments.allQuestionsRequired || 
        `يجب الإجابة على جميع الأسئلة قبل الإرسال. يوجد ${unanswered} سؤال غير مجاب عليه.`
      )
      return
    }

    if (!confirm(t.assessments.submitAssessment + "؟ " + (t.assessments.cannotEditAfterSubmit || "لن تتمكن من التعديل بعد الإرسال."))) {
      return
    }

    try {
      updateSubmission(submission.id, {
        status: "submitted",
        submittedAt: new Date().toISOString(),
      })

      router.push("/candidate/applications")
    } catch (error) {
      console.error("Failed to submit:", error)
    }
  }

  const totalQuestions = sections.reduce((sum: number, s: any) => sum + (s.questions?.length || 0), 0)
  const answeredQuestions = Object.keys(answers).filter(key => {
    const answer = answers[key]
    if (!answer) return false
    if (answer.answerText && answer.answerText.trim()) return true
    if (answer.codeSubmission && answer.codeSubmission.trim()) return true
    if (answer.fileUrl) return true
    if (answer.videoUrl) return true
    return false
  }).length
  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!currentQuestion) {
    return <div className="flex items-center justify-center min-h-screen">{t.common.loading}</div>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 section-spacing page-transition">
      {/* Cheating Detection Warning */}
      {!cheatingDetected && (
        <Card className="card-enhanced shadow-brand animate-fade-in border-danger/30 bg-danger/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-danger flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-danger">
                {t.assessments.cheatingWarningNotice}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <Card className="card-enhanced shadow-brand animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold gradient-text">{submission.jobs?.title}</h1>
              <p className="text-muted-foreground">{submission.assessments?.title}</p>
            </div>
            {timeRemaining !== null && (
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Clock className={`h-5 w-5 ${timeRemaining < 300 ? "text-danger animate-pulse" : ""}`} />
                <span className={timeRemaining < 300 ? "text-danger" : ""}>{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>
                {t.common.progress || "التقدم"}: {answeredQuestions} {t.common.from || "من"} {totalQuestions}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
          {saving && <p className="text-sm text-muted-foreground mt-2">{t.common.loading}</p>}
        </CardContent>
      </Card>

      {/* Question */}
      <Card className="card-enhanced shadow-brand animate-fade-in animate-delay-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="outline" className="mb-2">
                {t.assessments.sections} {currentSectionIndex + 1}: {currentSection.title}
              </Badge>
              <CardTitle className="gradient-text">
                {t.assessments.questions} {currentQuestionIndex + 1} {t.common.from || "من"} {questions.length}
              </CardTitle>
            </div>
            <Badge className="bg-primary text-primary-foreground">{currentQuestion.points} {t.assessments.passingScore || "نقطة"}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg font-medium">{currentQuestion.questionText}</div>

          {/* Question Type Component */}
          {currentQuestion.questionType === "mcq" && (
            <MCQQuestion
              question={currentQuestion}
              answer={answers[currentQuestion.id]}
              onChange={(data) => handleAnswerChange(currentQuestion.id, data)}
            />
          )}
          {currentQuestion.questionType === "coding" && (
            <CodingQuestion
              question={currentQuestion}
              answer={answers[currentQuestion.id]}
              onChange={(data) => handleAnswerChange(currentQuestion.id, data)}
            />
          )}
          {currentQuestion.questionType === "short_answer" && (
            <ShortAnswerQuestion
              question={currentQuestion}
              answer={answers[currentQuestion.id]}
              onChange={(data) => handleAnswerChange(currentQuestion.id, data)}
            />
          )}
          {currentQuestion.questionType === "long_answer" && (
            <LongAnswerQuestion
              question={currentQuestion}
              answer={answers[currentQuestion.id]}
              onChange={(data) => handleAnswerChange(currentQuestion.id, data)}
            />
          )}
          {currentQuestion.questionType === "video" && (
            <VideoQuestion
              question={currentQuestion}
              answer={answers[currentQuestion.id]}
              onChange={(data) => handleAnswerChange(currentQuestion.id, data)}
              submissionId={submission.id}
            />
          )}
          {currentQuestion.questionType === "file_upload" && (
            <FileUploadQuestion
              question={currentQuestion}
              answer={answers[currentQuestion.id]}
              onChange={(data) => handleAnswerChange(currentQuestion.id, data)}
              submissionId={submission.id}
            />
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSectionIndex === 0 && currentQuestionIndex === 0}
              className="btn-enhanced hover-lift"
            >
              <ChevronRight className="ml-2 h-4 w-4" />
              {t.common.previous}
            </Button>

            {currentSectionIndex === sections.length - 1 && currentQuestionIndex === questions.length - 1 ? (
              <Button 
                onClick={handleSubmit} 
                size="lg" 
                className="btn-enhanced hover-lift shadow-brand"
                disabled={answeredQuestions < totalQuestions}
              >
                <CheckCircle className="ml-2 h-5 w-5" />
                {t.assessments.submitAssessment}
              </Button>
            ) : (
              <Button onClick={handleNext} className="btn-enhanced hover-lift shadow-brand">
                {t.common.next}
                <ChevronLeft className="mr-2 h-4 w-4" />
              </Button>
            )}
            
            {currentSectionIndex === sections.length - 1 && currentQuestionIndex === questions.length - 1 && answeredQuestions < totalQuestions && (
              <p className="text-sm text-danger text-center mt-2">
                {t.assessments.allQuestionsRequired || `يجب الإجابة على جميع الأسئلة (${answeredQuestions}/${totalQuestions})`}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
