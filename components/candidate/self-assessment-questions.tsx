"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface SelfAssessmentQuestionsProps {
  question: any
  answer: any
  onChange: (value: any) => void
}

export default function SelfAssessmentQuestions({
  question,
  answer,
  onChange,
}: SelfAssessmentQuestionsProps) {
  const isMultiple = question.type === "multiple"

  const handleOptionClick = (value: any) => {
    if (isMultiple) {
      const currentAnswers = answer || []
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter((v: any) => v !== value)
        : [...currentAnswers, value]
      onChange(newAnswers.length > 0 ? newAnswers : undefined)
    } else {
      onChange(value === answer ? undefined : value)
    }
  }

  return (
    <div className="grid gap-3">
      {question.options.map((option: any) => {
        const isSelected = isMultiple
          ? answer?.includes(option.value)
          : answer === option.value

        return (
          <Button
            key={option.value}
            variant={isSelected ? "default" : "outline"}
            onClick={() => handleOptionClick(option.value)}
            className={`justify-start h-auto py-4 px-4 text-left btn-enhanced hover-lift ${
              isSelected ? "bg-primary text-primary-foreground" : ""
            }`}
          >
            {isSelected && <Check className="ml-2 h-4 w-4" />}
            <span className="flex-1">{option.label}</span>
          </Button>
        )
      })}
    </div>
  )
}

