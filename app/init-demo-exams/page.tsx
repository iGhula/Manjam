"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApp } from "@/lib/context/app-context"
import { useTranslation } from "@/lib/i18n/use-translation"
import { useState, useEffect } from "react"
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function InitDemoExamsPage() {
  const { jobs, assessments, sections, questions } = useApp()
  const t = useTranslation()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Check if demo assessments already exist
    const hasDemoAssessments = assessments.some((a) => a.id === "a1") &&
                               assessments.some((a) => a.id === "a2") &&
                               assessments.some((a) => a.id === "a3")
    
    if (hasDemoAssessments) {
      setStatus("success")
      setMessage("التقييمات التجريبية موجودة بالفعل!")
    }
  }, [assessments])

  const handleInitDemoExams = () => {
    setLoading(true)
    setStatus("idle")
    setMessage("")

    try {
      // Check if demo jobs exist
      const hasDemoJobs = jobs.some((j) => j.id === "j1") && 
                         jobs.some((j) => j.id === "j2") && 
                         jobs.some((j) => j.id === "j3")
      
      if (!hasDemoJobs) {
        setStatus("error")
        setMessage("الوظائف التجريبية غير موجودة. يرجى التأكد من وجود الوظائف التجريبية أولاً.")
        setLoading(false)
        return
      }

      // Check if assessments already exist
      const hasDemoAssessments = assessments.some((a) => a.id === "a1") &&
                                assessments.some((a) => a.id === "a2") &&
                                assessments.some((a) => a.id === "a3")

      if (hasDemoAssessments) {
        setStatus("success")
        setMessage("التقييمات التجريبية موجودة بالفعل!")
        setLoading(false)
        return
      }

      // Create demo assessments
      const demoAssessments = [
        {
          id: "a1",
          jobId: "j1",
          title: "تقييم Front-end Developer",
          description: "تقييم شامل لمهارات تطوير الواجهات الأمامية",
          timeLimitMinutes: 60,
          passingScore: 70,
          createdAt: new Date().toISOString(),
        },
        {
          id: "a2",
          jobId: "j2",
          title: "تقييم UI/UX Designer",
          description: "تقييم مهارات التصميم والتفكير في تجربة المستخدم",
          timeLimitMinutes: 45,
          passingScore: 65,
          createdAt: new Date().toISOString(),
        },
        {
          id: "a3",
          jobId: "j3",
          title: "تقييم Backend Developer",
          description: "تقييم شامل لمهارات تطوير الخوادم وقواعد البيانات",
          timeLimitMinutes: 90,
          passingScore: 75,
          createdAt: new Date().toISOString(),
        },
      ]

      const demoSections = [
        { id: "s1_1", assessmentId: "a1", title: "أسئلة MCQ - المفاهيم الأساسية", description: "اختبار معرفتك بمفاهيم React و JavaScript", sectionType: "mcq", order: 0, orderIndex: 0 },
        { id: "s1_2", assessmentId: "a1", title: "أسئلة برمجية", description: "اكتب كود لحل المسائل التالية", sectionType: "coding", order: 1, orderIndex: 1 },
        { id: "s1_3", assessmentId: "a1", title: "أسئلة نصية", description: "أجب عن الأسئلة التالية بشكل مفصل", sectionType: "short_answer", order: 2, orderIndex: 2 },
        { id: "s2_1", assessmentId: "a2", title: "أسئلة MCQ - مبادئ التصميم", description: "اختبار معرفتك بمبادئ التصميم والـ UX", sectionType: "mcq", order: 0, orderIndex: 0 },
        { id: "s2_2", assessmentId: "a2", title: "أسئلة نصية", description: "أجب عن الأسئلة التالية", sectionType: "long_answer", order: 1, orderIndex: 1 },
        { id: "s3_1", assessmentId: "a3", title: "أسئلة MCQ - قواعد البيانات والخوادم", description: "اختبار معرفتك بقواعد البيانات و APIs", sectionType: "mcq", order: 0, orderIndex: 0 },
        { id: "s3_2", assessmentId: "a3", title: "أسئلة برمجية", description: "اكتب كود لحل المسائل التالية", sectionType: "coding", order: 1, orderIndex: 1 },
      ]

      const demoQuestions = [
        { id: "q1_1_1", sectionId: "s1_1", questionText: "ما هي الطريقة الصحيحة لتمرير البيانات من مكون أب إلى مكون ابن في React?", questionType: "mcq", options: [{ text: "props", isCorrect: true }, { text: "state", isCorrect: false }, { text: "context", isCorrect: false }, { text: "hooks", isCorrect: false }], correctAnswer: "props", points: 10, order: 0, orderIndex: 0 },
        { id: "q1_1_2", sectionId: "s1_1", questionText: "ما هو الفرق بين useMemo و useCallback في React?", questionType: "mcq", options: [{ text: "useMemo للقيم، useCallback للدوال", isCorrect: true }, { text: "لا يوجد فرق", isCorrect: false }, { text: "useMemo للدوال، useCallback للقيم", isCorrect: false }, { text: "كلاهما للقيم فقط", isCorrect: false }], correctAnswer: "useMemo للقيم، useCallback للدوال", points: 10, order: 1, orderIndex: 1 },
        { id: "q1_2_1", sectionId: "s1_2", questionText: "اكتب دالة JavaScript لحساب مجموع جميع الأرقام في مصفوفة.\n\nمثال:\nInput: [1, 2, 3, 4]\nOutput: 10", questionType: "coding", testCases: [{ input: "[1, 2, 3, 4]", expectedOutput: "10" }, { input: "[5, 10, 15]", expectedOutput: "30" }, { input: "[]", expectedOutput: "0" }], points: 20, order: 0, orderIndex: 0 },
        { id: "q1_2_2", sectionId: "s1_2", questionText: "اكتب دالة React لحساب عدد النقرات على زر.\n\nيجب أن يكون المكون:\n- يبدأ العد من 0\n- يزيد بمقدار 1 عند كل نقرة\n- يعرض العدد الحالي", questionType: "coding", testCases: [], points: 25, order: 1, orderIndex: 1 },
        { id: "q1_3_1", sectionId: "s1_3", questionText: "اشرح الفرق بين Virtual DOM و Real DOM في React. وما هي المزايا?", questionType: "short_answer", points: 15, order: 0, orderIndex: 0 },
        { id: "q2_1_1", sectionId: "s2_1", questionText: "ما هو الهدف الرئيسي من اختبار قابلية الاستخدام (Usability Testing)?", questionType: "mcq", options: [{ text: "تحسين تجربة المستخدم", isCorrect: true }, { text: "زيادة الألوان", isCorrect: false }, { text: "تسريع الكود", isCorrect: false }, { text: "تقليل التكاليف", isCorrect: false }], correctAnswer: "تحسين تجربة المستخدم", points: 10, order: 0, orderIndex: 0 },
        { id: "q2_1_2", sectionId: "s2_1", questionText: "ما هي مبادئ التصميم الأساسية الثلاثة (3 C's)?", questionType: "mcq", options: [{ text: "Color, Contrast, Consistency", isCorrect: true }, { text: "Code, Content, Context", isCorrect: false }, { text: "Clear, Concise, Complete", isCorrect: false }, { text: "Creative, Cool, Cute", isCorrect: false }], correctAnswer: "Color, Contrast, Consistency", points: 10, order: 1, orderIndex: 1 },
        { id: "q2_2_1", sectionId: "s2_2", questionText: "اشرح بالتفصيل كيف تخطط لتصميم واجهة مستخدم جديدة لتطبيق جوال. ما هي الخطوات التي تتبعها?", questionType: "long_answer", points: 30, order: 0, orderIndex: 0 },
        { id: "q3_1_1", sectionId: "s3_1", questionText: "ما هو الفرق بين SQL و NoSQL?", questionType: "mcq", options: [{ text: "SQL للبيانات المنظمة، NoSQL للبيانات غير المنظمة", isCorrect: true }, { text: "لا يوجد فرق", isCorrect: false }, { text: "SQL أسرع من NoSQL دائماً", isCorrect: false }, { text: "NoSQL فقط للقواعد الصغيرة", isCorrect: false }], correctAnswer: "SQL للبيانات المنظمة، NoSQL للبيانات غير المنظمة", points: 10, order: 0, orderIndex: 0 },
        { id: "q3_1_2", sectionId: "s3_1", questionText: "ما هي طريقة HTTP الصحيحة لإنشاء مورد جديد (REST API)?", questionType: "mcq", options: [{ text: "POST", isCorrect: true }, { text: "GET", isCorrect: false }, { text: "PUT", isCorrect: false }, { text: "DELETE", isCorrect: false }], correctAnswer: "POST", points: 10, order: 1, orderIndex: 1 },
        { id: "q3_2_1", sectionId: "s3_2", questionText: "اكتب دالة Node.js/JavaScript لإنشاء API endpoint يحسب مجموع رقمين.\n\nالمتطلبات:\n- استقبال رقمين من query parameters\n- إرجاع النتيجة كـ JSON\n- معالجة الأخطاء", questionType: "coding", testCases: [{ input: "?a=5&b=3", expectedOutput: '{"result": 8}' }, { input: "?a=10&b=20", expectedOutput: '{"result": 30}' }], points: 30, order: 0, orderIndex: 0 },
      ]

      // Get existing data and merge
      const existingAssessments = JSON.parse(localStorage.getItem("assessments") || "[]")
      const existingSections = JSON.parse(localStorage.getItem("sections") || "[]")
      const existingQuestions = JSON.parse(localStorage.getItem("questions") || "[]")

      // Remove any existing demo assessments first
      const filteredAssessments = existingAssessments.filter((a: any) => a.id !== "a1" && a.id !== "a2" && a.id !== "a3")
      const filteredSections = existingSections.filter((s: any) => !s.id?.startsWith("s1_") && !s.id?.startsWith("s2_") && !s.id?.startsWith("s3_"))
      const filteredQuestions = existingQuestions.filter((q: any) => !q.id?.startsWith("q1_") && !q.id?.startsWith("q2_") && !q.id?.startsWith("q3_"))

      // Merge with new demo data
      const finalAssessments = [...filteredAssessments, ...demoAssessments]
      const finalSections = [...filteredSections, ...demoSections]
      const finalQuestions = [...filteredQuestions, ...demoQuestions]

      // Save to localStorage
      localStorage.setItem("assessments", JSON.stringify(finalAssessments))
      localStorage.setItem("sections", JSON.stringify(finalSections))
      localStorage.setItem("questions", JSON.stringify(finalQuestions))

      setStatus("success")
      setMessage("تم إنشاء التقييمات التجريبية بنجاح! سيتم تحديث الصفحة...")
      
      // Reload after a short delay
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error("Failed to initialize demo exams:", error)
      setStatus("error")
      setMessage("فشل إنشاء التقييمات. يرجى التحقق من وحدة التحكم للأخطاء.")
      setLoading(false)
    }
  }

  const hasDemoAssessments = assessments.some((a) => a.id === "a1") &&
                             assessments.some((a) => a.id === "a2") &&
                             assessments.some((a) => a.id === "a3")

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl card-enhanced shadow-brand">
        <CardHeader>
          <CardTitle className="gradient-text text-2xl">تهيئة التقييمات التجريبية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {hasDemoAssessments ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 gradient-text">التقييمات التجريبية موجودة بالفعل!</h3>
              <p className="text-muted-foreground mb-6">
                تم إنشاء 3 تقييمات تجريبية للوظائف التجريبية:
              </p>
              <ul className="text-right space-y-2 mb-6">
                <li>• تقييم Front-end Developer (للعمل j1)</li>
                <li>• تقييم UI/UX Designer (للعمل j2)</li>
                <li>• تقييم Backend Developer (للعمل j3)</li>
              </ul>
              <Button onClick={() => router.push("/company/jobs")} className="btn-enhanced hover-lift shadow-brand">
                عرض الوظائف
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  سيتم إنشاء 3 تقييمات تجريبية للوظائف التجريبية:
                </p>
                <ul className="space-y-2 text-right">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <span>تقييم Front-end Developer (60 دقيقة، 5 أسئلة)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <span>تقييم UI/UX Designer (45 دقيقة، 3 أسئلة)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <span>تقييم Backend Developer (90 دقيقة، 3 أسئلة)</span>
                  </li>
                </ul>
              </div>

              {status === "error" && (
                <div className="bg-danger/10 border border-danger/20 rounded-lg p-4 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-danger flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-danger">{message}</p>
                </div>
              )}

              {status === "success" && (
                <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-success">{message}</p>
                </div>
              )}

              <Button
                onClick={handleInitDemoExams}
                disabled={loading || hasDemoAssessments}
                size="lg"
                className="w-full btn-enhanced hover-lift shadow-brand"
              >
                <RefreshCw className={`ml-2 h-5 w-5 ${loading ? "animate-spin" : ""}`} />
                {loading ? "جاري الإنشاء..." : "إنشاء التقييمات التجريبية"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}



