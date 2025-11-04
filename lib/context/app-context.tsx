"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Types
export type UserRole = "company" | "jobseeker" | "admin"

export interface User {
  id: string
  email: string
  role: UserRole
  fullName: string
  companyName?: string
  createdAt: string
}

export interface Job {
  id: string
  companyId: string
  title: string
  description: string
  requirements: string
  location: string
  type: string
  salary: string
  status: "active" | "closed" | "draft"
  createdAt: string
}

export interface Assessment {
  id: string
  jobId: string
  title: string
  description: string
  timeLimitMinutes: number
  passingScore: number
  createdAt: string
}

export interface Section {
  id: string
  assessmentId: string
  title: string
  description: string
  sectionType: "coding" | "excel" | "video" | "mcq" | "short_answer" | "long_answer" | "file_upload"
  order: number
  orderIndex?: number
  timeLimitMinutes?: number
}

export interface Question {
  id: string
  sectionId: string
  questionText: string
  questionType: string
  options?: string[]
  correctAnswer?: string
  testCases?: { input: string; expectedOutput: string }[]
  points: number
  order: number
}

export interface Submission {
  id: string
  jobId: string
  userId: string
  assessmentId: string
  status: "in_progress" | "submitted" | "reviewed"
  startedAt: string
  submittedAt?: string
  totalScore?: number
  maxScore?: number
  decision?: "pending" | "accepted" | "rejected" | "shortlisted"
  companyNotes?: string
  cheatingDetected?: boolean
  cheatingDetectedAt?: string
  cheatingAgreed?: boolean
}

export interface Answer {
  id: string
  submissionId: string
  questionId: string
  answerText?: string
  codeSubmission?: string
  fileUrl?: string
  videoUrl?: string
  score?: number
  maxScore?: number
  isCorrect?: boolean
  isManuallScored?: boolean
}

export interface CV {
  id: string
  userId: string
  personalInfo: {
    fullName: string
    email: string
    phone: string
    address: string
    summary: string
  }
  education: Array<{
    degree: string
    institution: string
    startDate: string
    endDate: string
    description: string
  }>
  experience: Array<{
    title: string
    company: string
    startDate: string
    endDate: string
    description: string
  }>
  skills: string[]
  languages: Array<{ language: string; level: string }>
  certifications: Array<{ name: string; issuer: string; date: string }>
}

interface AppContextType {
  // Auth
  currentUser: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (
    email: string,
    password: string,
    fullName: string,
    role: UserRole,
    companyName?: string,
  ) => Promise<boolean>
  logout: () => void

  // Users
  users: User[]

  // Jobs
  jobs: Job[]
  addJob: (job: Omit<Job, "id" | "createdAt">) => string
  updateJob: (id: string, job: Partial<Job>) => void
  deleteJob: (id: string) => void
  getJobsByCompany: (companyId: string) => Job[]

  // Assessments
  assessments: Assessment[]
  addAssessment: (assessment: Omit<Assessment, "id" | "createdAt">) => string
  updateAssessment: (id: string, assessment: Partial<Assessment>) => void
  getAssessmentByJobId: (jobId: string) => Assessment | undefined

  // Sections
  sections: Section[]
  addSection: (section: Omit<Section, "id">) => string
  updateSection: (id: string, section: Partial<Section>) => void
  deleteSection: (id: string) => void
  getSectionsByAssessment: (assessmentId: string) => Section[]

  // Questions
  questions: Question[]
  addQuestion: (question: Omit<Question, "id">) => string
  updateQuestion: (id: string, question: Partial<Question>) => void
  deleteQuestion: (id: string) => void
  getQuestionsBySection: (sectionId: string) => Question[]

  // Submissions
  submissions: Submission[]
  addSubmission: (submission: Omit<Submission, "id" | "startedAt">) => string
  updateSubmission: (id: string, submission: Partial<Submission>) => void
  getSubmissionsByJob: (jobId: string) => Submission[]
  getSubmissionsByUser: (userId: string) => Submission[]

  // Answers
  answers: Answer[]
  addAnswer: (answer: Omit<Answer, "id">) => string
  updateAnswer: (id: string, answer: Partial<Answer>) => void
  getAnswersBySubmission: (submissionId: string) => Answer[]

  // CVs
  cvs: CV[]
  addCV: (cv: Omit<CV, "id">) => string
  updateCV: (id: string, cv: Partial<CV>) => void
  getCVByUser: (userId: string) => CV | undefined
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  // Initialize currentUser from localStorage synchronously to prevent logout on reload
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("currentUser")
      if (savedUser) {
        try {
          return JSON.parse(savedUser)
        } catch (e) {
          return null
        }
      }
    }
    return null
  })
  const [users, setUsers] = useState<User[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [cvs, setCVs] = useState<CV[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    // currentUser is already loaded synchronously above, so we don't need to reload it here
    const savedUsers = localStorage.getItem("users")
    const savedJobs = localStorage.getItem("jobs")
    const savedAssessments = localStorage.getItem("assessments")
    const savedSections = localStorage.getItem("sections")
    const savedQuestions = localStorage.getItem("questions")
    const savedSubmissions = localStorage.getItem("submissions")
    const savedAnswers = localStorage.getItem("answers")
    const savedCVs = localStorage.getItem("cvs")

    if (savedUsers) setUsers(JSON.parse(savedUsers))
    // Don't set jobs here - we'll set them after checking for missing ones
    // if (savedJobs) setJobs(JSON.parse(savedJobs))
    if (savedAssessments) setAssessments(JSON.parse(savedAssessments))
    if (savedSections) setSections(JSON.parse(savedSections))
    if (savedQuestions) setQuestions(JSON.parse(savedQuestions))
    if (savedSubmissions) setSubmissions(JSON.parse(savedSubmissions))
    if (savedAnswers) setAnswers(JSON.parse(savedAnswers))
    if (savedCVs) setCVs(JSON.parse(savedCVs))

    // Initialize with demo admin user if no users exist
    if (!savedUsers) {
      const demoUsers: User[] = [
        {
          id: "1",
          email: "admin@demo.com",
          role: "admin",
          fullName: "مدير النظام",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          email: "company@demo.com",
          role: "company",
          fullName: "شركة تجريبية",
          companyName: "شركة التقنية المتقدمة",
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          email: "candidate@demo.com",
          role: "jobseeker",
          fullName: "أحمد محمد",
          createdAt: new Date().toISOString(),
        },
        // Demo applicants
        {
          id: "4",
          email: "applicant1@demo.com",
          role: "jobseeker",
          fullName: "محمد علي",
          createdAt: new Date().toISOString(),
        },
        {
          id: "5",
          email: "applicant2@demo.com",
          role: "jobseeker",
          fullName: "فاطمة أحمد",
          createdAt: new Date().toISOString(),
        },
        {
          id: "6",
          email: "applicant3@demo.com",
          role: "jobseeker",
          fullName: "خالد حسن",
          createdAt: new Date().toISOString(),
        },
        {
          id: "7",
          email: "applicant4@demo.com",
          role: "jobseeker",
          fullName: "سارة محمود",
          createdAt: new Date().toISOString(),
        },
        {
          id: "8",
          email: "applicant5@demo.com",
          role: "jobseeker",
          fullName: "عمر يوسف",
          createdAt: new Date().toISOString(),
        },
      ]
      setUsers(demoUsers)
      localStorage.setItem("users", JSON.stringify(demoUsers))
    }

    // Initialize with demo jobs for the demo company (Libya-based) if no jobs exist for company "2"
    const existingJobs = savedJobs ? JSON.parse(savedJobs) : []
    // Check localStorage directly for accuracy (state might not be updated yet)
    const hasCompanyJobs = Array.isArray(existingJobs) && existingJobs.some((job: Job) => job.companyId === "2")
    const hasJob1 = Array.isArray(existingJobs) && existingJobs.some((job: Job) => job.id === "j1")
    const hasJob2 = Array.isArray(existingJobs) && existingJobs.some((job: Job) => job.id === "j2")
    const hasJob3 = Array.isArray(existingJobs) && existingJobs.some((job: Job) => job.id === "j3")
    const hasJob4 = Array.isArray(existingJobs) && existingJobs.some((job: Job) => job.id === "j4")
    const hasJob5 = Array.isArray(existingJobs) && existingJobs.some((job: Job) => job.id === "j5")
    const hasJob6 = Array.isArray(existingJobs) && existingJobs.some((job: Job) => job.id === "j6")
    
    // Always ensure all 6 demo jobs exist
    let finalJobsList = Array.isArray(existingJobs) ? [...existingJobs] : []
    
    if (!hasCompanyJobs) {
      const demoJobs: Job[] = [
        {
          id: "j1",
          companyId: "2",
          title: "مهندس برمجيات (Front-end)",
          description: "نبحث عن مهندس Front-end متمكن للعمل على واجهات حديثة باستخدام React/Next.js.",
          requirements: "خبرة سنتين على الأقل، معرفة جيدة بـ TypeScript و TailwindCSS.",
          location: "طرابلس، ليبيا",
          type: "دوام كامل",
          salary: "4000 - 6000 LYD",
          status: "active",
          createdAt: new Date().toISOString(),
        },
        {
          id: "j2",
          companyId: "2",
          title: "مصمم واجهات UI/UX",
          description: "تصميم واجهات حديثة وتجربة مستخدم متميزة للمنتجات الرقمية.",
          requirements: "محفظة أعمال قوية، إتقان Figma، فهم مبادئ التصميم.",
          location: "بنغازي، ليبيا",
          type: "دوام كامل",
          salary: "3500 - 5500 LYD",
          status: "active",
          createdAt: new Date().toISOString(),
        },
        {
          id: "j3",
          companyId: "2",
          title: "مهندس نظم Backend",
          description: "تطوير واجهات برمجية عالية الاعتمادية باستخدام Node.js و PostgreSQL.",
          requirements: "خبرة بالتخزين المؤقت، المراسلة، إدارة قواعد البيانات.",
          location: "طرابلس، ليبيا (عمل هجين)",
          type: "دوام كامل",
          salary: "5000 - 8000 LYD",
          status: "active",
          createdAt: new Date().toISOString(),
        },
        {
          id: "j4",
          companyId: "2",
          title: "أخصائي موارد بشرية",
          description: "نبحث عن أخصائي موارد بشرية لديه خبرة في التوظيف وإدارة المواهب.",
          requirements: "خبرة في التوظيف، مهارات تواصل ممتازة، إتقان برامج Microsoft Office.",
          location: "بنغازي، ليبيا",
          type: "دوام كامل",
          salary: "3000 - 5000 LYD",
          status: "active",
          createdAt: new Date().toISOString(),
        },
        {
          id: "j5",
          companyId: "2",
          title: "محاسب مالي",
          description: "نبحث عن محاسب مالي لديه خبرة في المحاسبة المالية وإعداد التقارير المالية.",
          requirements: "شهادة محاسبة، خبرة في Excel، معرفة بنظم المحاسبة المالية.",
          location: "طرابلس، ليبيا",
          type: "دوام كامل",
          salary: "3500 - 5500 LYD",
          status: "active",
          createdAt: new Date().toISOString(),
        },
        {
          id: "j6",
          companyId: "2",
          title: "محلل بيانات",
          description: "نبحث عن محلل بيانات لديه خبرة في تحليل البيانات واستخراج الرؤى من البيانات الكبيرة.",
          requirements: "خبرة في Python و SQL، معرفة بتحليل البيانات والتقارير، مهارات في Excel و Power BI.",
          location: "بنغازي، ليبيا (عمل هجين)",
          type: "دوام كامل",
          salary: "4500 - 7000 LYD",
          status: "active",
          createdAt: new Date().toISOString(),
        },
      ]
      
      // Merge with existing jobs if any, otherwise use demo jobs only
      finalJobsList = Array.isArray(existingJobs) && existingJobs.length > 0 
        ? [...existingJobs, ...demoJobs]
        : demoJobs
    } else {
      // Check which jobs are missing and add them
      let missingJobs: Job[] = []
      
      if (!hasJob4) {
        missingJobs.push({
          id: "j4",
          companyId: "2",
          title: "أخصائي موارد بشرية",
          description: "نبحث عن أخصائي موارد بشرية لديه خبرة في التوظيف وإدارة المواهب.",
          requirements: "خبرة في التوظيف، مهارات تواصل ممتازة، إتقان برامج Microsoft Office.",
          location: "بنغازي، ليبيا",
          type: "دوام كامل",
          salary: "3000 - 5000 LYD",
          status: "active",
          createdAt: new Date().toISOString(),
        })
      }
      
      if (!hasJob5) {
        missingJobs.push({
          id: "j5",
          companyId: "2",
          title: "محاسب مالي",
          description: "نبحث عن محاسب مالي لديه خبرة في المحاسبة المالية وإعداد التقارير المالية.",
          requirements: "شهادة محاسبة، خبرة في Excel، معرفة بنظم المحاسبة المالية.",
          location: "طرابلس، ليبيا",
          type: "دوام كامل",
          salary: "3500 - 5500 LYD",
          status: "active",
          createdAt: new Date().toISOString(),
        })
      }
      
      if (!hasJob6) {
        missingJobs.push({
          id: "j6",
          companyId: "2",
          title: "محلل بيانات",
          description: "نبحث عن محلل بيانات لديه خبرة في تحليل البيانات واستخراج الرؤى من البيانات الكبيرة.",
          requirements: "خبرة في Python و SQL، معرفة بتحليل البيانات والتقارير، مهارات في Excel و Power BI.",
          location: "بنغازي، ليبيا (عمل هجين)",
          type: "دوام كامل",
          salary: "4500 - 7000 LYD",
          status: "active",
          createdAt: new Date().toISOString(),
        })
      }
      
      // Add missing jobs if any
      if (missingJobs.length > 0) {
        finalJobsList = [...existingJobs, ...missingJobs]
        
        // Also add the assessments, sections, and questions for missing jobs
      const existingAssessments = savedAssessments ? JSON.parse(savedAssessments) : []
      const existingSections = savedSections ? JSON.parse(savedSections) : []
      const existingQuestions = savedQuestions ? JSON.parse(savedQuestions) : []
      
        const newAssessments: Assessment[] = []
        const newSections: Section[] = []
        const newQuestions: Question[] = []
        
        // Add assessment for job 4 if missing
        if (!hasJob4) {
          const hasAssessment4 = Array.isArray(existingAssessments) && existingAssessments.some((a: Assessment) => a.id === "a4")
          
          if (!hasAssessment4) {
            const assessment4: Assessment = {
              id: "a4",
              jobId: "j4",
              title: "تقييم أخصائي موارد بشرية",
              description: "تقييم مهارات التواصل والتفاعل مع المرشحين",
              timeLimitMinutes: 30,
              passingScore: 60,
              createdAt: new Date().toISOString(),
            }

            const section4_1: Section = {
              id: "s4_1",
              assessmentId: "a4",
              title: "أسئلة MCQ - أساسيات الموارد البشرية",
              description: "اختبار معرفتك بمبادئ الموارد البشرية",
              sectionType: "mcq",
              order: 0,
              orderIndex: 0,
            }

            const section4_2: Section = {
              id: "s4_2",
              assessmentId: "a4",
              title: "سؤال فيديو",
              description: "سجل فيديو لإجابتك على السؤال التالي",
              sectionType: "video",
              order: 1,
              orderIndex: 1,
            }

            const question4_1_1: Question = {
              id: "q4_1_1",
              sectionId: "s4_1",
              questionText: "ما هي الخطوة الأولى في عملية التوظيف؟",
              questionType: "mcq",
              options: [
                { text: "تحليل الوظيفة وتحديد المتطلبات", isCorrect: true },
                { text: "إجراء المقابلات", isCorrect: false },
                { text: "نشر الإعلان", isCorrect: false },
                { text: "اختيار المرشح", isCorrect: false },
              ],
              correctAnswer: "تحليل الوظيفة وتحديد المتطلبات",
              points: 10,
              order: 0,
              orderIndex: 0,
            }

            const question4_1_2: Question = {
              id: "q4_1_2",
              sectionId: "s4_1",
              questionText: "ما هو الهدف من تقييم الأداء؟",
              questionType: "mcq",
              options: [
                { text: "تحسين أداء الموظفين وتطوير مهاراتهم", isCorrect: true },
                { text: "فصل الموظفين الضعفاء فقط", isCorrect: false },
                { text: "تقليل التكاليف", isCorrect: false },
                { text: "زيادة عدد الموظفين", isCorrect: false },
              ],
              correctAnswer: "تحسين أداء الموظفين وتطوير مهاراتهم",
              points: 10,
              order: 1,
              orderIndex: 1,
            }

            const question4_2_1: Question = {
              id: "q4_2_1",
              sectionId: "s4_2",
              questionText: "سجل فيديو (دقيقة واحدة) تشرح فيه كيف تتعامل مع مرشح غير مناسب لوظيفة معينة. ما هي الخطوات التي تتبعها لإبلاغه بلباقة؟",
              questionType: "video",
              points: 30,
              order: 0,
              orderIndex: 0,
            }

            newAssessments.push(assessment4)
            newSections.push(section4_1, section4_2)
            newQuestions.push(question4_1_1, question4_1_2, question4_2_1)
          }
        }
        
        // Add assessment for job 5 if missing
        if (!hasJob5) {
          const hasAssessment5 = Array.isArray(existingAssessments) && existingAssessments.some((a: Assessment) => a.id === "a5")
          
          if (!hasAssessment5) {
            const assessment5: Assessment = {
              id: "a5",
              jobId: "j5",
              title: "تقييم محاسب مالي",
              description: "تقييم مهارات المحاسبة المالية واستخدام Excel",
              timeLimitMinutes: 45,
              passingScore: 70,
              createdAt: new Date().toISOString(),
            }

            const section5_1: Section = {
              id: "s5_1",
              assessmentId: "a5",
              title: "أسئلة MCQ - المحاسبة المالية",
              description: "اختبار معرفتك بمبادئ المحاسبة المالية",
              sectionType: "mcq",
              order: 0,
              orderIndex: 0,
            }

            const section5_2: Section = {
              id: "s5_2",
              assessmentId: "a5",
              title: "مهمة Excel",
              description: "قم بإنشاء ملف Excel يحتوي على البيانات المطلوبة",
              sectionType: "excel",
              order: 1,
              orderIndex: 1,
            }

            const question5_1_1: Question = {
              id: "q5_1_1",
              sectionId: "s5_1",
              questionText: "ما هو الفرق بين الميزانية العمومية وقائمة الدخل؟",
              questionType: "mcq",
              options: [
                { text: "الميزانية العمومية تظهر الأصول والخصوم، قائمة الدخل تظهر الإيرادات والمصروفات", isCorrect: true },
                { text: "لا يوجد فرق", isCorrect: false },
                { text: "كلاهما نفس الشيء", isCorrect: false },
                { text: "الميزانية العمومية فقط للمؤسسات الكبيرة", isCorrect: false },
              ],
              correctAnswer: "الميزانية العمومية تظهر الأصول والخصوم، قائمة الدخل تظهر الإيرادات والمصروفات",
              points: 10,
              order: 0,
              orderIndex: 0,
            }

            const question5_1_2: Question = {
              id: "q5_1_2",
              sectionId: "s5_1",
              questionText: "ما هي المعادلة المحاسبية الأساسية؟",
              questionType: "mcq",
              options: [
                { text: "الأصول = الخصوم + حقوق الملكية", isCorrect: true },
                { text: "الإيرادات = المصروفات", isCorrect: false },
                { text: "الأصول = الخصوم فقط", isCorrect: false },
                { text: "حقوق الملكية = الأصول × 2", isCorrect: false },
              ],
              correctAnswer: "الأصول = الخصوم + حقوق الملكية",
              points: 10,
              order: 1,
              orderIndex: 1,
            }

            const question5_2_1: Question = {
              id: "q5_2_1",
              sectionId: "s5_2",
              questionText: "قم بإنشاء ملف Excel يحتوي على قائمة ميزانية عمومية بسيطة لشهر واحد مع البيانات التالية:\n- الأصول المتداولة: 50000\n- الأصول الثابتة: 100000\n- الخصوم المتداولة: 30000\n- الخصوم طويلة الأجل: 40000\n- حقوق الملكية: (يجب حسابها)\n\nاستخدم الصيغ في Excel لحساب حقوق الملكية والمجموع الكلي. ارفع الملف بعد الانتهاء.",
              questionType: "file_upload",
              points: 30,
              order: 0,
              orderIndex: 0,
            }

            newAssessments.push(assessment5)
            newSections.push(section5_1, section5_2)
            newQuestions.push(question5_1_1, question5_1_2, question5_2_1)
          }
        }
        
        // Add assessment for job 6 if missing
        if (!hasJob6) {
          const hasAssessment6 = Array.isArray(existingAssessments) && existingAssessments.some((a: Assessment) => a.id === "a6")
          
          if (!hasAssessment6) {
            const assessment6: Assessment = {
              id: "a6",
              jobId: "j6",
              title: "تقييم محلل بيانات",
              description: "تقييم مهارات تحليل البيانات والتواصل",
              timeLimitMinutes: 50,
              passingScore: 65,
              createdAt: new Date().toISOString(),
            }

            const section6_1: Section = {
              id: "s6_1",
              assessmentId: "a6",
              title: "أسئلة MCQ - تحليل البيانات",
              description: "اختبار معرفتك بمبادئ تحليل البيانات",
              sectionType: "mcq",
              order: 0,
              orderIndex: 0,
            }

            const section6_2: Section = {
              id: "s6_2",
              assessmentId: "a6",
              title: "سؤال فيديو",
              description: "سجل فيديو لإجابتك على السؤال التالي",
              sectionType: "video",
              order: 1,
              orderIndex: 1,
            }

            const question6_1_1: Question = {
              id: "q6_1_1",
              sectionId: "s6_1",
              questionText: "ما هو الهدف الرئيسي من تحليل البيانات؟",
              questionType: "mcq",
              options: [
                { text: "استخراج الرؤى واتخاذ قرارات مدروسة بناءً على البيانات", isCorrect: true },
                { text: "تخزين البيانات فقط", isCorrect: false },
                { text: "حذف البيانات غير الضرورية", isCorrect: false },
                { text: "نسخ البيانات من مكان لآخر", isCorrect: false },
              ],
              correctAnswer: "استخراج الرؤى واتخاذ قرارات مدروسة بناءً على البيانات",
              points: 10,
              order: 0,
              orderIndex: 0,
            }

            const question6_1_2: Question = {
              id: "q6_1_2",
              sectionId: "s6_1",
              questionText: "ما هي أداة SQL المستخدمة لاستخراج البيانات من قاعدة البيانات؟",
              questionType: "mcq",
              options: [
                { text: "SELECT", isCorrect: true },
                { text: "DELETE", isCorrect: false },
                { text: "UPDATE", isCorrect: false },
                { text: "INSERT", isCorrect: false },
              ],
              correctAnswer: "SELECT",
              points: 10,
              order: 1,
              orderIndex: 1,
            }

            const question6_2_1: Question = {
              id: "q6_2_1",
              sectionId: "s6_2",
              questionText: "سجل فيديو (دقيقتان) تشرح فيه كيف تقوم بتحليل مجموعة بيانات لتحديد اتجاهات المبيعات. اشرح الخطوات التي تتبعها من جمع البيانات إلى عرض النتائج.",
              questionType: "video",
              points: 30,
              order: 0,
              orderIndex: 0,
            }

            newAssessments.push(assessment6)
            newSections.push(section6_1, section6_2)
            newQuestions.push(question6_1_1, question6_1_2, question6_2_1)
          }
        }
        
        // Update assessments, sections, and questions if any were added
        if (newAssessments.length > 0 || newSections.length > 0 || newQuestions.length > 0) {
          const updatedAssessments = [...existingAssessments, ...newAssessments]
          const updatedSections = [...existingSections, ...newSections]
          const updatedQuestions = [...existingQuestions, ...newQuestions]

          setAssessments(updatedAssessments)
          setSections(updatedSections)
          setQuestions(updatedQuestions)
          localStorage.setItem("assessments", JSON.stringify(updatedAssessments))
          localStorage.setItem("sections", JSON.stringify(updatedSections))
          localStorage.setItem("questions", JSON.stringify(updatedQuestions))
        }
      }
    }
    
    // Always set jobs state with final list (whether it was updated or not)
    if (finalJobsList.length > 0) {
      setJobs(finalJobsList)
      localStorage.setItem("jobs", JSON.stringify(finalJobsList))
    } else if (savedJobs) {
      // Fallback: if no jobs were set, load from localStorage
      setJobs(JSON.parse(savedJobs))
    }

    // Initialize demo assessments, sections, and questions for each job (only if company jobs exist)
    if (hasCompanyJobs || hasJob6) {
      const existingAssessments = savedAssessments ? JSON.parse(savedAssessments) : []
      const existingSections = savedSections ? JSON.parse(savedSections) : []
      const existingQuestions = savedQuestions ? JSON.parse(savedQuestions) : []
      
      // Get current jobs from state or existing jobs (use state if available, otherwise use existingJobs)
      const currentJobs = jobs.length > 0 && jobs.some((j: Job) => j.companyId === "2") ? jobs : existingJobs
      
      // Check if demo assessments exist - must have all 6 assessments (a1, a2, a3, a4, a5, a6)
      // Also check if we have demo jobs (j1, j2, j3, j4, j5, j6) - if we do, we should have assessments
      const hasDemoJobs = Array.isArray(currentJobs) &&
        currentJobs.some((j: Job) => j.id === "j1") &&
        currentJobs.some((j: Job) => j.id === "j2") &&
        currentJobs.some((j: Job) => j.id === "j3") &&
        currentJobs.some((j: Job) => j.id === "j4") &&
        currentJobs.some((j: Job) => j.id === "j5") &&
        currentJobs.some((j: Job) => j.id === "j6")
      
      const hasDemoAssessments = Array.isArray(existingAssessments) && 
        existingAssessments.some((a: Assessment) => a.id === "a1") &&
        existingAssessments.some((a: Assessment) => a.id === "a2") &&
        existingAssessments.some((a: Assessment) => a.id === "a3") &&
        existingAssessments.some((a: Assessment) => a.id === "a4") &&
        existingAssessments.some((a: Assessment) => a.id === "a5") &&
        existingAssessments.some((a: Assessment) => a.id === "a6")

      // If we have demo jobs but no demo assessments, create them
      if (hasDemoJobs && !hasDemoAssessments) {
        // Assessment for Job 1: Front-end Engineer
        const assessment1: Assessment = {
          id: "a1",
          jobId: "j1",
          title: "تقييم Front-end Developer",
          description: "تقييم شامل لمهارات تطوير الواجهات الأمامية",
          timeLimitMinutes: 60,
          passingScore: 70,
          createdAt: new Date().toISOString(),
        }

        // Sections for Assessment 1
        const section1_1: Section = {
          id: "s1_1",
          assessmentId: "a1",
          title: "أسئلة MCQ - المفاهيم الأساسية",
          description: "اختبار معرفتك بمفاهيم React و JavaScript",
          sectionType: "mcq",
          order: 0,
          orderIndex: 0,
        }

        const section1_2: Section = {
          id: "s1_2",
          assessmentId: "a1",
          title: "أسئلة برمجية",
          description: "اكتب كود لحل المسائل التالية",
          sectionType: "coding",
          order: 1,
          orderIndex: 1,
        }

        const section1_3: Section = {
          id: "s1_3",
          assessmentId: "a1",
          title: "أسئلة نصية",
          description: "أجب عن الأسئلة التالية بشكل مفصل",
          sectionType: "short_answer",
          order: 2,
          orderIndex: 2,
        }

        // Questions for Section 1_1 (MCQ)
        const question1_1_1: Question = {
          id: "q1_1_1",
          sectionId: "s1_1",
          questionText: "ما هي الطريقة الصحيحة لتمرير البيانات من مكون أب إلى مكون ابن في React?",
          questionType: "mcq",
          options: [
            { text: "props", isCorrect: true },
            { text: "state", isCorrect: false },
            { text: "context", isCorrect: false },
            { text: "hooks", isCorrect: false },
          ],
          correctAnswer: "props",
          points: 10,
          order: 0,
          orderIndex: 0,
        }

        const question1_1_2: Question = {
          id: "q1_1_2",
          sectionId: "s1_1",
          questionText: "ما هو الفرق بين useMemo و useCallback في React?",
          questionType: "mcq",
          options: [
            { text: "useMemo للقيم، useCallback للدوال", isCorrect: true },
            { text: "لا يوجد فرق", isCorrect: false },
            { text: "useMemo للدوال، useCallback للقيم", isCorrect: false },
            { text: "كلاهما للقيم فقط", isCorrect: false },
          ],
          correctAnswer: "useMemo للقيم، useCallback للدوال",
          points: 10,
          order: 1,
          orderIndex: 1,
        }

        // Questions for Section 1_2 (Coding)
        const question1_2_1: Question = {
          id: "q1_2_1",
          sectionId: "s1_2",
          questionText: "اكتب دالة JavaScript لحساب مجموع جميع الأرقام في مصفوفة.\n\nمثال:\nInput: [1, 2, 3, 4]\nOutput: 10",
          questionType: "coding",
          testCases: [
            { input: "[1, 2, 3, 4]", expectedOutput: "10" },
            { input: "[5, 10, 15]", expectedOutput: "30" },
            { input: "[]", expectedOutput: "0" },
          ],
          points: 20,
          order: 0,
          orderIndex: 0,
        }

        const question1_2_2: Question = {
          id: "q1_2_2",
          sectionId: "s1_2",
          questionText: "اكتب دالة React لحساب عدد النقرات على زر.\n\nيجب أن يكون المكون:\n- يبدأ العد من 0\n- يزيد بمقدار 1 عند كل نقرة\n- يعرض العدد الحالي",
          questionType: "coding",
          testCases: [],
          points: 25,
          order: 1,
          orderIndex: 1,
        }

        // Questions for Section 1_3 (Short Answer)
        const question1_3_1: Question = {
          id: "q1_3_1",
          sectionId: "s1_3",
          questionText: "اشرح الفرق بين Virtual DOM و Real DOM في React. وما هي المزايا؟",
          questionType: "short_answer",
          points: 15,
          order: 0,
          orderIndex: 0,
        }

        // Assessment for Job 2: UI/UX Designer
        const assessment2: Assessment = {
          id: "a2",
          jobId: "j2",
          title: "تقييم UI/UX Designer",
          description: "تقييم مهارات التصميم والتفكير في تجربة المستخدم",
          timeLimitMinutes: 45,
          passingScore: 65,
          createdAt: new Date().toISOString(),
        }

        const section2_1: Section = {
          id: "s2_1",
          assessmentId: "a2",
          title: "أسئلة MCQ - مبادئ التصميم",
          description: "اختبار معرفتك بمبادئ التصميم والـ UX",
          sectionType: "mcq",
          order: 0,
          orderIndex: 0,
        }

        const section2_2: Section = {
          id: "s2_2",
          assessmentId: "a2",
          title: "أسئلة نصية",
          description: "أجب عن الأسئلة التالية",
          sectionType: "long_answer",
          order: 1,
          orderIndex: 1,
        }

        const question2_1_1: Question = {
          id: "q2_1_1",
          sectionId: "s2_1",
          questionText: "ما هو الهدف الرئيسي من اختبار قابلية الاستخدام (Usability Testing)?",
          questionType: "mcq",
          options: [
            { text: "تحسين تجربة المستخدم", isCorrect: true },
            { text: "زيادة الألوان", isCorrect: false },
            { text: "تسريع الكود", isCorrect: false },
            { text: "تقليل التكاليف", isCorrect: false },
          ],
          correctAnswer: "تحسين تجربة المستخدم",
          points: 10,
          order: 0,
          orderIndex: 0,
        }

        const question2_1_2: Question = {
          id: "q2_1_2",
          sectionId: "s2_1",
          questionText: "ما هي مبادئ التصميم الأساسية الثلاثة (3 C's)?",
          questionType: "mcq",
          options: [
            { text: "Color, Contrast, Consistency", isCorrect: true },
            { text: "Code, Content, Context", isCorrect: false },
            { text: "Clear, Concise, Complete", isCorrect: false },
            { text: "Creative, Cool, Cute", isCorrect: false },
          ],
          correctAnswer: "Color, Contrast, Consistency",
          points: 10,
          order: 1,
          orderIndex: 1,
        }

        const question2_2_1: Question = {
          id: "q2_2_1",
          sectionId: "s2_2",
          questionText: "اشرح بالتفصيل كيف تخطط لتصميم واجهة مستخدم جديدة لتطبيق جوال. ما هي الخطوات التي تتبعها؟",
          questionType: "long_answer",
          points: 30,
          order: 0,
          orderIndex: 0,
        }

        // Assessment for Job 3: Backend Engineer
        const assessment3: Assessment = {
          id: "a3",
          jobId: "j3",
          title: "تقييم Backend Developer",
          description: "تقييم شامل لمهارات تطوير الخوادم وقواعد البيانات",
          timeLimitMinutes: 90,
          passingScore: 75,
          createdAt: new Date().toISOString(),
        }

        const section3_1: Section = {
          id: "s3_1",
          assessmentId: "a3",
          title: "أسئلة MCQ - قواعد البيانات والخوادم",
          description: "اختبار معرفتك بقواعد البيانات و APIs",
          sectionType: "mcq",
          order: 0,
          orderIndex: 0,
        }

        const section3_2: Section = {
          id: "s3_2",
          assessmentId: "a3",
          title: "أسئلة برمجية",
          description: "اكتب كود لحل المسائل التالية",
          sectionType: "coding",
          order: 1,
          orderIndex: 1,
        }

        const question3_1_1: Question = {
          id: "q3_1_1",
          sectionId: "s3_1",
          questionText: "ما هو الفرق بين SQL و NoSQL?",
          questionType: "mcq",
          options: [
            { text: "SQL للبيانات المنظمة، NoSQL للبيانات غير المنظمة", isCorrect: true },
            { text: "لا يوجد فرق", isCorrect: false },
            { text: "SQL أسرع من NoSQL دائماً", isCorrect: false },
            { text: "NoSQL فقط للقواعد الصغيرة", isCorrect: false },
          ],
          correctAnswer: "SQL للبيانات المنظمة، NoSQL للبيانات غير المنظمة",
          points: 10,
          order: 0,
          orderIndex: 0,
        }

        const question3_1_2: Question = {
          id: "q3_1_2",
          sectionId: "s3_1",
          questionText: "ما هي طريقة HTTP الصحيحة لإنشاء مورد جديد (REST API)?",
          questionType: "mcq",
          options: [
            { text: "POST", isCorrect: true },
            { text: "GET", isCorrect: false },
            { text: "PUT", isCorrect: false },
            { text: "DELETE", isCorrect: false },
          ],
          correctAnswer: "POST",
          points: 10,
          order: 1,
          orderIndex: 1,
        }

        const question3_2_1: Question = {
          id: "q3_2_1",
          sectionId: "s3_2",
          questionText: "اكتب دالة Node.js/JavaScript لإنشاء API endpoint يحسب مجموع رقمين.\n\nالمتطلبات:\n- استقبال رقمين من query parameters\n- إرجاع النتيجة كـ JSON\n- معالجة الأخطاء",
          questionType: "coding",
          testCases: [
            { input: "?a=5&b=3", expectedOutput: '{"result": 8}' },
            { input: "?a=10&b=20", expectedOutput: '{"result": 30}' },
          ],
          points: 30,
          order: 0,
          orderIndex: 0,
        }

        // Assessment for Job 4: HR Specialist (with video question)
        const assessment4: Assessment = {
          id: "a4",
          jobId: "j4",
          title: "تقييم أخصائي موارد بشرية",
          description: "تقييم مهارات التواصل والتفاعل مع المرشحين",
          timeLimitMinutes: 30,
          passingScore: 60,
          createdAt: new Date().toISOString(),
        }

        const section4_1: Section = {
          id: "s4_1",
          assessmentId: "a4",
          title: "أسئلة MCQ - أساسيات الموارد البشرية",
          description: "اختبار معرفتك بمبادئ الموارد البشرية",
          sectionType: "mcq",
          order: 0,
          orderIndex: 0,
        }

        const section4_2: Section = {
          id: "s4_2",
          assessmentId: "a4",
          title: "سؤال فيديو",
          description: "سجل فيديو لإجابتك على السؤال التالي",
          sectionType: "video",
          order: 1,
          orderIndex: 1,
        }

        const question4_1_1: Question = {
          id: "q4_1_1",
          sectionId: "s4_1",
          questionText: "ما هي الخطوة الأولى في عملية التوظيف؟",
          questionType: "mcq",
          options: [
            { text: "تحليل الوظيفة وتحديد المتطلبات", isCorrect: true },
            { text: "إجراء المقابلات", isCorrect: false },
            { text: "نشر الإعلان", isCorrect: false },
            { text: "اختيار المرشح", isCorrect: false },
          ],
          correctAnswer: "تحليل الوظيفة وتحديد المتطلبات",
          points: 10,
          order: 0,
          orderIndex: 0,
        }

        const question4_1_2: Question = {
          id: "q4_1_2",
          sectionId: "s4_1",
          questionText: "ما هو الهدف من تقييم الأداء؟",
          questionType: "mcq",
          options: [
            { text: "تحسين أداء الموظفين وتطوير مهاراتهم", isCorrect: true },
            { text: "فصل الموظفين الضعفاء فقط", isCorrect: false },
            { text: "تقليل التكاليف", isCorrect: false },
            { text: "زيادة عدد الموظفين", isCorrect: false },
          ],
          correctAnswer: "تحسين أداء الموظفين وتطوير مهاراتهم",
          points: 10,
          order: 1,
          orderIndex: 1,
        }

        const question4_2_1: Question = {
          id: "q4_2_1",
          sectionId: "s4_2",
          questionText: "سجل فيديو (دقيقة واحدة) تشرح فيه كيف تتعامل مع مرشح غير مناسب لوظيفة معينة. ما هي الخطوات التي تتبعها لإبلاغه بلباقة؟",
          questionType: "video",
          points: 30,
          order: 0,
          orderIndex: 0,
        }

        // Assessment for Job 5: Financial Accountant (with excel question)
        const assessment5: Assessment = {
          id: "a5",
          jobId: "j5",
          title: "تقييم محاسب مالي",
          description: "تقييم مهارات المحاسبة المالية واستخدام Excel",
          timeLimitMinutes: 45,
          passingScore: 70,
          createdAt: new Date().toISOString(),
        }

        const section5_1: Section = {
          id: "s5_1",
          assessmentId: "a5",
          title: "أسئلة MCQ - المحاسبة المالية",
          description: "اختبار معرفتك بمبادئ المحاسبة المالية",
          sectionType: "mcq",
          order: 0,
          orderIndex: 0,
        }

        const section5_2: Section = {
          id: "s5_2",
          assessmentId: "a5",
          title: "مهمة Excel",
          description: "قم بإنشاء ملف Excel يحتوي على البيانات المطلوبة",
          sectionType: "excel",
          order: 1,
          orderIndex: 1,
        }

        const question5_1_1: Question = {
          id: "q5_1_1",
          sectionId: "s5_1",
          questionText: "ما هو الفرق بين الميزانية العمومية وقائمة الدخل؟",
          questionType: "mcq",
          options: [
            { text: "الميزانية العمومية تظهر الأصول والخصوم، قائمة الدخل تظهر الإيرادات والمصروفات", isCorrect: true },
            { text: "لا يوجد فرق", isCorrect: false },
            { text: "كلاهما نفس الشيء", isCorrect: false },
            { text: "الميزانية العمومية فقط للمؤسسات الكبيرة", isCorrect: false },
          ],
          correctAnswer: "الميزانية العمومية تظهر الأصول والخصوم، قائمة الدخل تظهر الإيرادات والمصروفات",
          points: 10,
          order: 0,
          orderIndex: 0,
        }

        const question5_1_2: Question = {
          id: "q5_1_2",
          sectionId: "s5_1",
          questionText: "ما هي المعادلة المحاسبية الأساسية؟",
          questionType: "mcq",
          options: [
            { text: "الأصول = الخصوم + حقوق الملكية", isCorrect: true },
            { text: "الإيرادات = المصروفات", isCorrect: false },
            { text: "الأصول = الخصوم فقط", isCorrect: false },
            { text: "حقوق الملكية = الأصول × 2", isCorrect: false },
          ],
          correctAnswer: "الأصول = الخصوم + حقوق الملكية",
          points: 10,
          order: 1,
          orderIndex: 1,
        }

        const question5_2_1: Question = {
          id: "q5_2_1",
          sectionId: "s5_2",
          questionText: "قم بإنشاء ملف Excel يحتوي على قائمة ميزانية عمومية بسيطة لشهر واحد مع البيانات التالية:\n- الأصول المتداولة: 50000\n- الأصول الثابتة: 100000\n- الخصوم المتداولة: 30000\n- الخصوم طويلة الأجل: 40000\n- حقوق الملكية: (يجب حسابها)\n\nاستخدم الصيغ في Excel لحساب حقوق الملكية والمجموع الكلي. ارفع الملف بعد الانتهاء.",
          questionType: "file_upload",
          points: 30,
          order: 0,
          orderIndex: 0,
        }

        // Assessment for Job 6: Data Analyst (with video question)
        const assessment6: Assessment = {
          id: "a6",
          jobId: "j6",
          title: "تقييم محلل بيانات",
          description: "تقييم مهارات تحليل البيانات والتواصل",
          timeLimitMinutes: 50,
          passingScore: 65,
          createdAt: new Date().toISOString(),
        }

        const section6_1: Section = {
          id: "s6_1",
          assessmentId: "a6",
          title: "أسئلة MCQ - تحليل البيانات",
          description: "اختبار معرفتك بمبادئ تحليل البيانات",
          sectionType: "mcq",
          order: 0,
          orderIndex: 0,
        }

        const section6_2: Section = {
          id: "s6_2",
          assessmentId: "a6",
          title: "سؤال فيديو",
          description: "سجل فيديو لإجابتك على السؤال التالي",
          sectionType: "video",
          order: 1,
          orderIndex: 1,
        }

        const question6_1_1: Question = {
          id: "q6_1_1",
          sectionId: "s6_1",
          questionText: "ما هو الهدف الرئيسي من تحليل البيانات؟",
          questionType: "mcq",
          options: [
            { text: "استخراج الرؤى واتخاذ قرارات مدروسة بناءً على البيانات", isCorrect: true },
            { text: "تخزين البيانات فقط", isCorrect: false },
            { text: "حذف البيانات غير الضرورية", isCorrect: false },
            { text: "نسخ البيانات من مكان لآخر", isCorrect: false },
          ],
          correctAnswer: "استخراج الرؤى واتخاذ قرارات مدروسة بناءً على البيانات",
          points: 10,
          order: 0,
          orderIndex: 0,
        }

        const question6_1_2: Question = {
          id: "q6_1_2",
          sectionId: "s6_1",
          questionText: "ما هي أداة SQL المستخدمة لاستخراج البيانات من قاعدة البيانات؟",
          questionType: "mcq",
          options: [
            { text: "SELECT", isCorrect: true },
            { text: "DELETE", isCorrect: false },
            { text: "UPDATE", isCorrect: false },
            { text: "INSERT", isCorrect: false },
          ],
          correctAnswer: "SELECT",
          points: 10,
          order: 1,
          orderIndex: 1,
        }

        const question6_2_1: Question = {
          id: "q6_2_1",
          sectionId: "s6_2",
          questionText: "سجل فيديو (دقيقتان) تشرح فيه كيف تقوم بتحليل مجموعة بيانات لتحديد اتجاهات المبيعات. اشرح الخطوات التي تتبعها من جمع البيانات إلى عرض النتائج.",
          questionType: "video",
          points: 30,
          order: 0,
          orderIndex: 0,
        }

        // Add all demo data
        const demoAssessments = [assessment1, assessment2, assessment3, assessment4, assessment5, assessment6]
        const demoSections = [
          section1_1, section1_2, section1_3,
          section2_1, section2_2,
          section3_1, section3_2,
          section4_1, section4_2,
          section5_1, section5_2,
          section6_1, section6_2,
        ]
        const demoQuestions = [
          question1_1_1, question1_1_2,
          question1_2_1, question1_2_2,
          question1_3_1,
          question2_1_1, question2_1_2,
          question2_2_1,
          question3_1_1, question3_1_2,
          question3_2_1,
          question4_1_1, question4_1_2,
          question4_2_1,
          question5_1_1, question5_1_2,
          question5_2_1,
          question6_1_1, question6_1_2,
          question6_2_1,
        ]

        const finalAssessments = Array.isArray(existingAssessments) && existingAssessments.length > 0
          ? [...existingAssessments, ...demoAssessments]
          : demoAssessments
        const finalSections = Array.isArray(existingSections) && existingSections.length > 0
          ? [...existingSections, ...demoSections]
          : demoSections
        const finalQuestions = Array.isArray(existingQuestions) && existingQuestions.length > 0
          ? [...existingQuestions, ...demoQuestions]
          : demoQuestions

        setAssessments(finalAssessments)
        setSections(finalSections)
        setQuestions(finalQuestions)
        localStorage.setItem("assessments", JSON.stringify(finalAssessments))
        localStorage.setItem("sections", JSON.stringify(finalSections))
        localStorage.setItem("questions", JSON.stringify(finalQuestions))

        // Initialize demo submissions and answers
        const existingSubmissions = savedSubmissions ? JSON.parse(savedSubmissions) : []
        const existingAnswers = savedAnswers ? JSON.parse(savedAnswers) : []
        
        const hasDemoSubmissions = Array.isArray(existingSubmissions) && 
          existingSubmissions.some((s: Submission) => s.id === "sub1")
        
        if (hasDemoJobs && !hasDemoSubmissions) {
          // Demo submissions for Job 1 (Front-end Engineer) - Assessment a1
          const submission1_1: Submission = {
            id: "sub1",
            jobId: "j1",
            userId: "4",
            assessmentId: "a1",
            status: "submitted",
            startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000).toISOString(),
            totalScore: 35,
            maxScore: 45,
            decision: "accepted",
          }

          const submission1_2: Submission = {
            id: "sub2",
            jobId: "j1",
            userId: "5",
            assessmentId: "a1",
            status: "submitted",
            startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 50 * 60 * 1000).toISOString(),
            totalScore: 25,
            maxScore: 45,
            decision: "pending",
          }

          const submission1_3: Submission = {
            id: "sub3",
            jobId: "j1",
            userId: "6",
            assessmentId: "a1",
            status: "submitted",
            startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 55 * 60 * 1000).toISOString(),
            totalScore: 40,
            maxScore: 45,
            decision: "accepted",
          }

          // Answers for submission 1_1 (Good answers - 35/45)
          const answer1_1_1: Answer = {
            id: "ans1",
            submissionId: "sub1",
            questionId: "q1_1_1",
            answerText: "props",
            score: 10,
            maxScore: 10,
            isCorrect: true,
          }

          const answer1_1_2: Answer = {
            id: "ans2",
            submissionId: "sub1",
            questionId: "q1_1_2",
            answerText: "useMemo للقيم، useCallback للدوال",
            score: 10,
            maxScore: 10,
            isCorrect: true,
          }

          const answer1_2_1: Answer = {
            id: "ans3",
            submissionId: "sub1",
            questionId: "q1_2_1",
            codeSubmission: "function sumArray(arr) {\n  return arr.reduce((sum, num) => sum + num, 0);\n}",
            score: 15,
            maxScore: 20,
            isCorrect: true,
          }

          const answer1_2_2: Answer = {
            id: "ans4",
            submissionId: "sub1",
            questionId: "q1_2_2",
            codeSubmission: "function Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}",
            score: 0,
            maxScore: 25,
            isCorrect: false,
          }

          const answer1_3_1: Answer = {
            id: "ans5",
            submissionId: "sub1",
            questionId: "q1_3_1",
            answerText: "Virtual DOM هو تمثيل خفيف للـ DOM الحقيقي في الذاكرة. React يستخدمه لتحديث التغييرات بكفاءة قبل تطبيقها على DOM الحقيقي.",
            score: 0,
            maxScore: 15,
          }

          // Answers for submission 1_2 (Average answers - 25/45)
          const answer2_1_1: Answer = {
            id: "ans6",
            submissionId: "sub2",
            questionId: "q1_1_1",
            answerText: "props",
            score: 10,
            maxScore: 10,
            isCorrect: true,
          }

          const answer2_1_2: Answer = {
            id: "ans7",
            submissionId: "sub2",
            questionId: "q1_1_2",
            answerText: "لا يوجد فرق",
            score: 0,
            maxScore: 10,
            isCorrect: false,
          }

          const answer2_2_1: Answer = {
            id: "ans8",
            submissionId: "sub2",
            questionId: "q1_2_1",
            codeSubmission: "function sumArray(arr) {\n  let sum = 0;\n  for (let i = 0; i < arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}",
            score: 15,
            maxScore: 20,
            isCorrect: true,
          }

          const answer2_2_2: Answer = {
            id: "ans9",
            submissionId: "sub2",
            questionId: "q1_2_2",
            codeSubmission: "// Working on it",
            score: 0,
            maxScore: 25,
            isCorrect: false,
          }

          const answer2_3_1: Answer = {
            id: "ans10",
            submissionId: "sub2",
            questionId: "q1_3_1",
            answerText: "Virtual DOM هو نسخة من DOM",
            score: 0,
            maxScore: 15,
          }

          // Answers for submission 1_3 (Excellent answers - 40/45)
          const answer3_1_1: Answer = {
            id: "ans11",
            submissionId: "sub3",
            questionId: "q1_1_1",
            answerText: "props",
            score: 10,
            maxScore: 10,
            isCorrect: true,
          }

          const answer3_1_2: Answer = {
            id: "ans12",
            submissionId: "sub3",
            questionId: "q1_1_2",
            answerText: "useMemo للقيم، useCallback للدوال",
            score: 10,
            maxScore: 10,
            isCorrect: true,
          }

          const answer3_2_1: Answer = {
            id: "ans13",
            submissionId: "sub3",
            questionId: "q1_2_1",
            codeSubmission: "const sumArray = (arr) => arr.reduce((acc, val) => acc + val, 0);",
            score: 20,
            maxScore: 20,
            isCorrect: true,
          }

          const answer3_2_2: Answer = {
            id: "ans14",
            submissionId: "sub3",
            questionId: "q1_2_2",
            codeSubmission: "import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <button onClick={() => setCount(count + 1)}>\n        Clicked {count} times\n      </button>\n    </div>\n  );\n}",
            score: 20,
            maxScore: 25,
            isCorrect: true,
          }

          const answer3_3_1: Answer = {
            id: "ans15",
            submissionId: "sub3",
            questionId: "q1_3_1",
            answerText: "Virtual DOM هو تمثيل JavaScript خفيف للـ DOM الحقيقي. React يستخدمه لتحسين الأداء من خلال مقارنة التغييرات وتطبيقها بشكل مجمع (batch) على DOM الحقيقي، مما يقلل من عمليات إعادة الرسم.",
            score: 10,
            maxScore: 15,
          }

          // Demo submissions for Job 2 (UI/UX Designer) - Assessment a2
          const submission2_1: Submission = {
            id: "sub4",
            jobId: "j2",
            userId: "7",
            assessmentId: "a2",
            status: "submitted",
            startedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 40 * 60 * 1000).toISOString(),
            totalScore: 40,
            maxScore: 50,
            decision: "accepted",
          }

          const submission2_2: Submission = {
            id: "sub5",
            jobId: "j2",
            userId: "8",
            assessmentId: "a2",
            status: "submitted",
            startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 42 * 60 * 1000).toISOString(),
            totalScore: 30,
            maxScore: 50,
            decision: "shortlisted",
          }

          // Answers for submission 2_1
          const answer4_1_1: Answer = {
            id: "ans16",
            submissionId: "sub4",
            questionId: "q2_1_1",
            answerText: "تحسين تجربة المستخدم",
            score: 10,
            maxScore: 10,
            isCorrect: true,
          }

          const answer4_1_2: Answer = {
            id: "ans17",
            submissionId: "sub4",
            questionId: "q2_1_2",
            answerText: "Color, Contrast, Consistency",
            score: 10,
            maxScore: 10,
            isCorrect: true,
          }

          const answer4_2_1: Answer = {
            id: "ans18",
            submissionId: "sub4",
            questionId: "q2_2_1",
            answerText: "أبدأ بتحليل احتياجات المستخدمين، ثم أنشئ personas و user journeys. بعد ذلك أصمم wireframes و prototypes باستخدام Figma. أختبر التصميم مع المستخدمين وأكرر التحسينات بناءً على الملاحظات.",
            score: 20,
            maxScore: 30,
          }

          // Answers for submission 2_2
          const answer5_1_1: Answer = {
            id: "ans19",
            submissionId: "sub5",
            questionId: "q2_1_1",
            answerText: "تحسين تجربة المستخدم",
            score: 10,
            maxScore: 10,
            isCorrect: true,
          }

          const answer5_1_2: Answer = {
            id: "ans20",
            submissionId: "sub5",
            questionId: "q2_1_2",
            answerText: "Code, Content, Context",
            score: 0,
            maxScore: 10,
            isCorrect: false,
          }

          const answer5_2_1: Answer = {
            id: "ans21",
            submissionId: "sub5",
            questionId: "q2_2_1",
            answerText: "أصمم الواجهة باستخدام أدوات التصميم",
            score: 10,
            maxScore: 30,
          }

          // Demo submissions for Job 3 (Backend Engineer) - Assessment a3
          const submission3_1: Submission = {
            id: "sub6",
            jobId: "j3",
            userId: "4",
            assessmentId: "a3",
            status: "submitted",
            startedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 85 * 60 * 1000).toISOString(),
            totalScore: 45,
            maxScore: 50,
            decision: "accepted",
          }

          // Answers for submission 3_1
          const answer6_1_1: Answer = {
            id: "ans22",
            submissionId: "sub6",
            questionId: "q3_1_1",
            answerText: "SQL للبيانات المنظمة، NoSQL للبيانات غير المنظمة",
            score: 10,
            maxScore: 10,
            isCorrect: true,
          }

          const answer6_1_2: Answer = {
            id: "ans23",
            submissionId: "sub6",
            questionId: "q3_1_2",
            answerText: "POST",
            score: 10,
            maxScore: 10,
            isCorrect: true,
          }

          const answer6_2_1: Answer = {
            id: "ans24",
            submissionId: "sub6",
            questionId: "q3_2_1",
            codeSubmission: "app.get('/sum', (req, res) => {\n  const a = parseInt(req.query.a);\n  const b = parseInt(req.query.b);\n  if (isNaN(a) || isNaN(b)) {\n    return res.status(400).json({ error: 'Invalid numbers' });\n  }\n  res.json({ result: a + b });\n});",
            score: 25,
            maxScore: 30,
            isCorrect: true,
          }

          const demoSubmissions = [
            submission1_1, submission1_2, submission1_3,
            submission2_1, submission2_2,
            submission3_1,
          ]

          const demoAnswers = [
            // Submission 1_1 answers
            answer1_1_1, answer1_1_2, answer1_2_1, answer1_2_2, answer1_3_1,
            // Submission 1_2 answers
            answer2_1_1, answer2_1_2, answer2_2_1, answer2_2_2, answer2_3_1,
            // Submission 1_3 answers
            answer3_1_1, answer3_1_2, answer3_2_1, answer3_2_2, answer3_3_1,
            // Submission 2_1 answers
            answer4_1_1, answer4_1_2, answer4_2_1,
            // Submission 2_2 answers
            answer5_1_1, answer5_1_2, answer5_2_1,
            // Submission 3_1 answers
            answer6_1_1, answer6_1_2, answer6_2_1,
          ]

          const finalSubmissions = Array.isArray(existingSubmissions) && existingSubmissions.length > 0
            ? [...existingSubmissions, ...demoSubmissions]
            : demoSubmissions

          const finalAnswers = Array.isArray(existingAnswers) && existingAnswers.length > 0
            ? [...existingAnswers, ...demoAnswers]
            : demoAnswers

          setSubmissions(finalSubmissions)
          setAnswers(finalAnswers)
          localStorage.setItem("submissions", JSON.stringify(finalSubmissions))
          localStorage.setItem("answers", JSON.stringify(finalAnswers))
        }
      }
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (currentUser) localStorage.setItem("currentUser", JSON.stringify(currentUser))
  }, [currentUser])

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users))
  }, [users])

  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs))
  }, [jobs])

  useEffect(() => {
    localStorage.setItem("assessments", JSON.stringify(assessments))
  }, [assessments])

  useEffect(() => {
    localStorage.setItem("sections", JSON.stringify(sections))
  }, [sections])

  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions))
  }, [questions])

  useEffect(() => {
    localStorage.setItem("submissions", JSON.stringify(submissions))
  }, [submissions])

  useEffect(() => {
    localStorage.setItem("answers", JSON.stringify(answers))
  }, [answers])

  useEffect(() => {
    localStorage.setItem("cvs", JSON.stringify(cvs))
  }, [cvs])

  // Auth functions
  const login = async (email: string, password: string): Promise<boolean> => {
    // Check in current users state first
    let user = users.find((u) => u.email === email)
    
    // If not found, check localStorage
    if (!user) {
      const savedUsers = localStorage.getItem("users")
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers)
        user = parsedUsers.find((u: User) => u.email === email)
      }
    }
    
    // If still not found, check demo accounts (for demo accounts, any password works)
    if (!user) {
      const demoUsers: User[] = [
        {
          id: "1",
          email: "admin@demo.com",
          role: "admin",
          fullName: "مدير النظام",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          email: "company@demo.com",
          role: "company",
          fullName: "شركة تجريبية",
          companyName: "شركة التقنية المتقدمة",
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          email: "candidate@demo.com",
          role: "jobseeker",
          fullName: "أحمد محمد",
          createdAt: new Date().toISOString(),
        },
      ]
      user = demoUsers.find((u) => u.email === email)
      
      // If found in demo users, add them to the users state and localStorage if not already there
      if (user) {
        const userExists = users.some((u) => u.id === user.id)
        if (!userExists) {
          const updatedUsers = [...users, user]
          setUsers(updatedUsers)
          localStorage.setItem("users", JSON.stringify(updatedUsers))
        }
      }
    }
    
    if (user) {
      setCurrentUser(user)
      return true
    }
    return false
  }

  const register = async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole,
    companyName?: string,
  ): Promise<boolean> => {
    const existingUser = users.find((u) => u.email === email)
    if (existingUser) return false

    const newUser: User = {
      id: Date.now().toString(),
      email,
      role,
      fullName,
      companyName,
      createdAt: new Date().toISOString(),
    }

    setUsers([...users, newUser])
    setCurrentUser(newUser)
    return true
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("currentUser")
  }

  // Job functions
  const addJob = (job: Omit<Job, "id" | "createdAt">): string => {
    const newJob: Job = {
      ...job,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setJobs([...jobs, newJob])
    return newJob.id
  }

  const updateJob = (id: string, job: Partial<Job>) => {
    setJobs(jobs.map((j) => (j.id === id ? { ...j, ...job } : j)))
  }

  const deleteJob = (id: string) => {
    setJobs(jobs.filter((j) => j.id !== id))
  }

  const getJobsByCompany = (companyId: string) => {
    return jobs.filter((j) => j.companyId === companyId)
  }

  // Assessment functions
  const addAssessment = (assessment: Omit<Assessment, "id" | "createdAt">): string => {
    const newAssessment: Assessment = {
      ...assessment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setAssessments([...assessments, newAssessment])
    return newAssessment.id
  }

  const updateAssessment = (id: string, assessment: Partial<Assessment>) => {
    setAssessments(assessments.map((a) => (a.id === id ? { ...a, ...assessment } : a)))
  }

  const getAssessmentByJobId = (jobId: string) => {
    return assessments.find((a) => a.jobId === jobId)
  }

  // Section functions
  const addSection = (section: Omit<Section, "id">): string => {
    const newSection: Section = {
      ...section,
      id: Date.now().toString(),
    }
    setSections([...sections, newSection])
    return newSection.id
  }

  const updateSection = (id: string, section: Partial<Section>) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, ...section } : s)))
  }

  const deleteSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id))
  }

  const getSectionsByAssessment = (assessmentId: string) => {
    return sections.filter((s) => s.assessmentId === assessmentId).sort((a, b) => a.order - b.order)
  }

  // Question functions
  const addQuestion = (question: Omit<Question, "id">): string => {
    const newQuestion: Question = {
      ...question,
      id: Date.now().toString(),
    }
    setQuestions([...questions, newQuestion])
    return newQuestion.id
  }

  const updateQuestion = (id: string, question: Partial<Question>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...question } : q)))
  }

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const getQuestionsBySection = (sectionId: string) => {
    return questions.filter((q) => q.sectionId === sectionId).sort((a, b) => a.order - b.order)
  }

  // Submission functions
  const addSubmission = (submission: Omit<Submission, "id" | "startedAt">): string => {
    const newSubmission: Submission = {
      ...submission,
      id: Date.now().toString(),
      startedAt: new Date().toISOString(),
    }
    setSubmissions([...submissions, newSubmission])
    return newSubmission.id
  }

  const updateSubmission = (id: string, submission: Partial<Submission>) => {
    setSubmissions(submissions.map((s) => (s.id === id ? { ...s, ...submission } : s)))
  }

  const getSubmissionsByJob = (jobId: string) => {
    return submissions.filter((s) => s.jobId === jobId)
  }

  const getSubmissionsByUser = (userId: string) => {
    return submissions.filter((s) => s.userId === userId)
  }

  // Answer functions
  const addAnswer = (answer: Omit<Answer, "id">): string => {
    const newAnswer: Answer = {
      ...answer,
      id: Date.now().toString(),
    }
    setAnswers([...answers, newAnswer])
    return newAnswer.id
  }

  const updateAnswer = (id: string, answer: Partial<Answer>) => {
    setAnswers(answers.map((a) => (a.id === id ? { ...a, ...answer } : a)))
  }

  const getAnswersBySubmission = (submissionId: string) => {
    return answers.filter((a) => a.submissionId === submissionId)
  }

  // CV functions
  const addCV = (cv: Omit<CV, "id">): string => {
    const newCV: CV = {
      ...cv,
      id: Date.now().toString(),
    }
    setCVs([...cvs, newCV])
    return newCV.id
  }

  const updateCV = (id: string, cv: Partial<CV>) => {
    setCVs(cvs.map((c) => (c.id === id ? { ...c, ...cv } : c)))
  }

  const getCVByUser = (userId: string) => {
    return cvs.find((c) => c.userId === userId)
  }

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        users,
        jobs,
        addJob,
        updateJob,
        deleteJob,
        getJobsByCompany,
        assessments,
        addAssessment,
        updateAssessment,
        getAssessmentByJobId,
        sections,
        addSection,
        updateSection,
        deleteSection,
        getSectionsByAssessment,
        questions,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        getQuestionsBySection,
        submissions,
        addSubmission,
        updateSubmission,
        getSubmissionsByJob,
        getSubmissionsByUser,
        answers,
        addAnswer,
        updateAnswer,
        getAnswersBySubmission,
        cvs,
        addCV,
        updateCV,
        getCVByUser,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
