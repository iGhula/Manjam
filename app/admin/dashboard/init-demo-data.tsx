"use client"

import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/context/app-context"
import { useTranslation } from "@/lib/i18n/use-translation"
import { useState } from "react"
import { RefreshCw } from "lucide-react"

export function InitDemoDataButton() {
  const { jobs, assessments, sections, questions } = useApp()
  const t = useTranslation()
  const [loading, setLoading] = useState(false)

  const handleInitDemoData = () => {
    setLoading(true)
    try {
      // Check if demo jobs exist
      const hasDemoJobs = jobs.some((j) => j.id === "j1") && 
                         jobs.some((j) => j.id === "j2") && 
                         jobs.some((j) => j.id === "j3")
      
      if (!hasDemoJobs) {
        alert("Demo jobs not found. Please ensure demo jobs are created first.")
        setLoading(false)
        return
      }

      // Check if assessments already exist
      const hasDemoAssessments = assessments.some((a) => a.id === "a1") &&
                                  assessments.some((a) => a.id === "a2") &&
                                  assessments.some((a) => a.id === "a3")

      if (hasDemoAssessments) {
        alert("Demo assessments already exist!")
        setLoading(false)
        return
      }

      // Clear existing assessments, sections, and questions for demo jobs
      const filteredAssessments = assessments.filter((a) => a.jobId !== "j1" && a.jobId !== "j2" && a.jobId !== "j3")
      const filteredSections = sections.filter((s) => !s.assessmentId?.startsWith("a"))
      const filteredQuestions = questions.filter((q) => !q.sectionId?.startsWith("s"))

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
        // Assessment 1 sections
        { id: "s1_1", assessmentId: "a1", title: "أسئلة MCQ - المفاهيم الأساسية", description: "اختبار معرفتك بمفاهيم React و JavaScript", sectionType: "mcq", order: 0, orderIndex: 0 },
        { id: "s1_2", assessmentId: "a1", title: "أسئلة برمجية", description: "اكتب كود لحل المسائل التالية", sectionType: "coding", order: 1, orderIndex: 1 },
        { id: "s1_3", assessmentId: "a1", title: "أسئلة نصية", description: "أجب عن الأسئلة التالية بشكل مفصل", sectionType: "short_answer", order: 2, orderIndex: 2 },
        // Assessment 2 sections
        { id: "s2_1", assessmentId: "a2", title: "أسئلة MCQ - مبادئ التصميم", description: "اختبار معرفتك بمبادئ التصميم والـ UX", sectionType: "mcq", order: 0, orderIndex: 0 },
        { id: "s2_2", assessmentId: "a2", title: "أسئلة نصية", description: "أجب عن الأسئلة التالية", sectionType: "long_answer", order: 1, orderIndex: 1 },
        // Assessment 3 sections
        { id: "s3_1", assessmentId: "a3", title: "أسئلة MCQ - قواعد البيانات والخوادم", description: "اختبار معرفتك بقواعد البيانات و APIs", sectionType: "mcq", order: 0, orderIndex: 0 },
        { id: "s3_2", assessmentId: "a3", title: "أسئلة برمجية", description: "اكتب كود لحل المسائل التالية", sectionType: "coding", order: 1, orderIndex: 1 },
      ]

      const demoQuestions = [
        // Assessment 1 questions
        { id: "q1_1_1", sectionId: "s1_1", questionText: "ما هي الطريقة الصحيحة لتمرير البيانات من مكون أب إلى مكون ابن في React?", questionType: "mcq", options: [{ text: "props", isCorrect: true }, { text: "state", isCorrect: false }, { text: "context", isCorrect: false }, { text: "hooks", isCorrect: false }], correctAnswer: "props", points: 10, order: 0, orderIndex: 0 },
        { id: "q1_1_2", sectionId: "s1_1", questionText: "ما هو الفرق بين useMemo و useCallback في React?", questionType: "mcq", options: [{ text: "useMemo للقيم، useCallback للدوال", isCorrect: true }, { text: "لا يوجد فرق", isCorrect: false }, { text: "useMemo للدوال، useCallback للقيم", isCorrect: false }, { text: "كلاهما للقيم فقط", isCorrect: false }], correctAnswer: "useMemo للقيم، useCallback للدوال", points: 10, order: 1, orderIndex: 1 },
        { id: "q1_2_1", sectionId: "s1_2", questionText: "اكتب دالة JavaScript لحساب مجموع جميع الأرقام في مصفوفة.\n\nمثال:\nInput: [1, 2, 3, 4]\nOutput: 10", questionType: "coding", testCases: [{ input: "[1, 2, 3, 4]", expectedOutput: "10" }, { input: "[5, 10, 15]", expectedOutput: "30" }, { input: "[]", expectedOutput: "0" }], points: 20, order: 0, orderIndex: 0 },
        { id: "q1_2_2", sectionId: "s1_2", questionText: "اكتب دالة React لحساب عدد النقرات على زر.\n\nيجب أن يكون المكون:\n- يبدأ العد من 0\n- يزيد بمقدار 1 عند كل نقرة\n- يعرض العدد الحالي", questionType: "coding", testCases: [], points: 25, order: 1, orderIndex: 1 },
        { id: "q1_3_1", sectionId: "s1_3", questionText: "اشرح الفرق بين Virtual DOM و Real DOM في React. وما هي المزايا?", questionType: "short_answer", points: 15, order: 0, orderIndex: 0 },
        // Assessment 2 questions
        { id: "q2_1_1", sectionId: "s2_1", questionText: "ما هو الهدف الرئيسي من اختبار قابلية الاستخدام (Usability Testing)?", questionType: "mcq", options: [{ text: "تحسين تجربة المستخدم", isCorrect: true }, { text: "زيادة الألوان", isCorrect: false }, { text: "تسريع الكود", isCorrect: false }, { text: "تقليل التكاليف", isCorrect: false }], correctAnswer: "تحسين تجربة المستخدم", points: 10, order: 0, orderIndex: 0 },
        { id: "q2_1_2", sectionId: "s2_1", questionText: "ما هي مبادئ التصميم الأساسية الثلاثة (3 C's)?", questionType: "mcq", options: [{ text: "Color, Contrast, Consistency", isCorrect: true }, { text: "Code, Content, Context", isCorrect: false }, { text: "Clear, Concise, Complete", isCorrect: false }, { text: "Creative, Cool, Cute", isCorrect: false }], correctAnswer: "Color, Contrast, Consistency", points: 10, order: 1, orderIndex: 1 },
        { id: "q2_2_1", sectionId: "s2_2", questionText: "اشرح بالتفصيل كيف تخطط لتصميم واجهة مستخدم جديدة لتطبيق جوال. ما هي الخطوات التي تتبعها?", questionType: "long_answer", points: 30, order: 0, orderIndex: 0 },
        // Assessment 3 questions
        { id: "q3_1_1", sectionId: "s3_1", questionText: "ما هو الفرق بين SQL و NoSQL?", questionType: "mcq", options: [{ text: "SQL للبيانات المنظمة، NoSQL للبيانات غير المنظمة", isCorrect: true }, { text: "لا يوجد فرق", isCorrect: false }, { text: "SQL أسرع من NoSQL دائماً", isCorrect: false }, { text: "NoSQL فقط للقواعد الصغيرة", isCorrect: false }], correctAnswer: "SQL للبيانات المنظمة، NoSQL للبيانات غير المنظمة", points: 10, order: 0, orderIndex: 0 },
        { id: "q3_1_2", sectionId: "s3_1", questionText: "ما هي طريقة HTTP الصحيحة لإنشاء مورد جديد (REST API)?", questionType: "mcq", options: [{ text: "POST", isCorrect: true }, { text: "GET", isCorrect: false }, { text: "PUT", isCorrect: false }, { text: "DELETE", isCorrect: false }], correctAnswer: "POST", points: 10, order: 1, orderIndex: 1 },
        { id: "q3_2_1", sectionId: "s3_2", questionText: "اكتب دالة Node.js/JavaScript لإنشاء API endpoint يحسب مجموع رقمين.\n\nالمتطلبات:\n- استقبال رقمين من query parameters\n- إرجاع النتيجة كـ JSON\n- معالجة الأخطاء", questionType: "coding", testCases: [{ input: "?a=5&b=3", expectedOutput: '{"result": 8}' }, { input: "?a=10&b=20", expectedOutput: '{"result": 30}' }], points: 30, order: 0, orderIndex: 0 },
      ]

      // Save to localStorage
      const finalAssessments = [...filteredAssessments, ...demoAssessments]
      const finalSections = [...filteredSections, ...demoSections]
      const finalQuestions = [...filteredQuestions, ...demoQuestions]

      localStorage.setItem("assessments", JSON.stringify(finalAssessments))
      localStorage.setItem("sections", JSON.stringify(finalSections))
      localStorage.setItem("questions", JSON.stringify(finalQuestions))

      // Reload page to refresh data
      window.location.reload()
    } catch (error) {
      console.error("Failed to initialize demo data:", error)
      alert("Failed to initialize demo data. Please check console for details.")
    } finally {
      setLoading(false)
    }
  }

  const hasDemoAssessments = assessments.some((a) => a.id === "a1") &&
                             assessments.some((a) => a.id === "a2") &&
                             assessments.some((a) => a.id === "a3")

  if (hasDemoAssessments) {
    return null
  }

  return (
    <Button 
      onClick={handleInitDemoData} 
      disabled={loading}
      className="btn-enhanced hover-lift shadow-brand"
    >
      <RefreshCw className={`ml-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
      {loading ? "جاري التهيئة..." : "تهيئة بيانات تجريبية للتقييمات"}
    </Button>
  )
}



