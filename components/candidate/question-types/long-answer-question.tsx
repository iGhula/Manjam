"use client"

import { Textarea } from "@/components/ui/textarea"

interface LongAnswerQuestionProps {
  question: any
  answer: any
  onChange: (data: any) => void
}

export default function LongAnswerQuestion({ question, answer, onChange }: LongAnswerQuestionProps) {
  return (
    <div className="space-y-2">
      <Textarea
        value={answer?.answerText || ""}
        onChange={(e) => onChange({ answerText: e.target.value })}
        placeholder="اكتب إجابتك التفصيلية هنا..."
        rows={12}
        className="min-h-[300px]"
      />
      <p className="text-sm text-muted-foreground">
        يمكنك كتابة إجابة مفصلة وطويلة لهذا السؤال
      </p>
    </div>
  )
}



