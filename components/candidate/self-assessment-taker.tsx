"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CheckCircle, Target, BookOpen, Sparkles } from "lucide-react"
import { useTranslation } from "@/lib/i18n/use-translation"
import SelfAssessmentQuestions from "./self-assessment-questions"
import SelfAssessmentResults from "./self-assessment-results"

interface SelfAssessmentTakerProps {
  userId: string
}

export default function SelfAssessmentTaker({ userId }: SelfAssessmentTakerProps) {
  const router = useRouter()
  const t = useTranslation()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [showResults, setShowResults] = useState(false)
  const [recommendations, setRecommendations] = useState<any>(null)
  const [hasStarted, setHasStarted] = useState(false)

  // Load saved answers from localStorage
  useEffect(() => {
    const savedAnswers = localStorage.getItem(`selfAssessment_${userId}`)
    if (savedAnswers) {
      try {
        const parsed = JSON.parse(savedAnswers)
        setAnswers(parsed)
        setHasStarted(true) // If there are saved answers, user has started
      } catch (e) {
        console.error("Error loading saved answers:", e)
      }
    }
  }, [userId])

  // Save answers to localStorage
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(`selfAssessment_${userId}`, JSON.stringify(answers))
    }
  }, [answers, userId])

  const questions = [
    {
      id: 1,
      question: t.selfAssessment.whatAreYourSkills + "؟",
      type: "multiple",
      options: [
        { value: "programming", label: t.selfAssessment.programming },
        { value: "design", label: t.selfAssessment.design },
        { value: "marketing", label: t.selfAssessment.marketing },
        { value: "sales", label: t.selfAssessment.sales },
        { value: "management", label: t.selfAssessment.management },
        { value: "data", label: t.selfAssessment.data },
      ],
    },
    {
      id: 2,
      question: t.selfAssessment.whatAreYourInterests + "؟",
      type: "multiple",
      options: [
        { value: "programming", label: t.selfAssessment.programming },
        { value: "design", label: t.selfAssessment.design },
        { value: "marketing", label: t.selfAssessment.marketing },
        { value: "sales", label: t.selfAssessment.sales },
        { value: "management", label: t.selfAssessment.management },
        { value: "data", label: t.selfAssessment.data },
      ],
    },
    {
      id: 3,
      question: t.selfAssessment.whatIsYourExperience + "؟",
      type: "single",
      options: [
        { value: "beginner", label: t.selfAssessment.beginner },
        { value: "intermediate", label: t.selfAssessment.intermediate },
        { value: "advanced", label: t.selfAssessment.advanced },
      ],
    },
    {
      id: 4,
      question: t.selfAssessment.whatIsYourEducation + "؟",
      type: "single",
      options: [
        { value: "high_school", label: t.selfAssessment.highSchool },
        { value: "bachelor", label: t.selfAssessment.bachelorsDegree },
        { value: "master", label: t.selfAssessment.mastersDegree },
        { value: "phd", label: t.selfAssessment.phd },
      ],
    },
    {
      id: 5,
      question: t.selfAssessment.howManyYears + "؟",
      type: "single",
      options: [
        { value: "0-1", label: "0-1 " + t.selfAssessment.years },
        { value: "2-5", label: "2-5 " + t.selfAssessment.years },
        { value: "6-10", label: "6-10 " + t.selfAssessment.years },
        { value: "10+", label: "10+ " + t.selfAssessment.years },
      ],
    },
  ]

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const answeredQuestions = Object.keys(answers).length
  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0

  const handleAnswerChange = (value: any) => {
    if (currentQuestion.type === "multiple") {
      setAnswers((prev) => {
        const currentAnswers = prev[currentQuestion.id] || []
        const newAnswers = currentAnswers.includes(value)
          ? currentAnswers.filter((v: any) => v !== value)
          : [...currentAnswers, value]
        return {
          ...prev,
          [currentQuestion.id]: newAnswers.length > 0 ? newAnswers : undefined,
        }
      })
    } else {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: value,
      }))
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = () => {
    // Calculate recommendations based on answers
    const skills = answers[1] || []
    const interests = answers[2] || []
    const experience = answers[3] || "beginner"
    const education = answers[4] || "bachelor"
    const yearsOfExperience = answers[5] || "0-1"

    // Simple recommendation logic
    const allInterests = [...skills, ...interests]
    const recommendations = {
      positions: [],
      courses: [],
      skills: allInterests,
      experience,
      education,
      years: yearsOfExperience,
    }

    setRecommendations(recommendations)
    setShowResults(true)
    localStorage.removeItem(`selfAssessment_${userId}`)
  }

  if (showResults && recommendations) {
    return <SelfAssessmentResults recommendations={recommendations} userId={userId} />
  }

  if (!hasStarted) {
    return (
      <Card className="card-enhanced shadow-brand">
        <CardContent className="p-12 text-center">
          <Sparkles className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3 gradient-text">{t.selfAssessment.intro}</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">{t.selfAssessment.introDescription}</p>
          <Button 
            onClick={() => {
              setHasStarted(true)
              setCurrentQuestionIndex(0)
            }} 
            size="lg" 
            className="btn-enhanced hover-lift shadow-brand"
          >
            <Target className="ml-2 h-5 w-5" />
            {t.selfAssessment.startAssessment}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="card-enhanced shadow-brand">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold gradient-text">{t.selfAssessment.title}</h2>
              <p className="text-muted-foreground">{t.selfAssessment.optional}</p>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {t.selfAssessment.question} {currentQuestionIndex + 1} {t.selfAssessment.of} {totalQuestions}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>
                {t.common.progress || "التقدم"}: {answeredQuestions} {t.selfAssessment.of} {totalQuestions}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </CardContent>
      </Card>

      <Card className="card-enhanced shadow-brand">
        <CardHeader>
          <CardTitle className="gradient-text text-xl">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SelfAssessmentQuestions
            question={currentQuestion}
            answer={answers[currentQuestion.id]}
            onChange={handleAnswerChange}
          />

          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="btn-enhanced hover-lift"
            >
              <ChevronRight className="ml-2 h-4 w-4" />
              {t.selfAssessment.previous}
            </Button>

            {currentQuestionIndex === totalQuestions - 1 ? (
              <Button onClick={handleSubmit} size="lg" className="btn-enhanced hover-lift shadow-brand">
                <CheckCircle className="ml-2 h-5 w-5" />
                {t.selfAssessment.submit}
              </Button>
            ) : (
              <Button onClick={handleNext} className="btn-enhanced hover-lift shadow-brand">
                {t.selfAssessment.next}
                <ChevronLeft className="mr-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

