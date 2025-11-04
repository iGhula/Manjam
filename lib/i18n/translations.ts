export type Language = "ar" | "en"

export interface Translations {
  // Common
  common: {
    login: string
    logout: string
    register: string
    dashboard: string
    save: string
    cancel: string
    delete: string
    edit: string
    create: string
    submit: string
    loading: string
    error: string
    success: string
    back: string
    next: string
    previous: string
    search: string
    filter: string
    reset: string
    close: string
    yes: string
    no: string
    unknown: string
    noEmail: string
  }

  // Navigation
  nav: {
    dashboard: string
    users: string
    companies: string
    jobs: string
    browseJobs: string
    applications: string
    cv: string
    submissions: string
    adminDashboard: string
    resume: string
    selfAssessment: string
  }

  // Home Page
  home: {
    title: string
    platformTitle: string
    subtitle: string
    description: string
    forCompanies: string
    forJobSeekers: string
    features: string
    jobManagement: string
    jobManagementDesc: string
    multipleAssessments: string
    multipleAssessmentsDesc: string
    autoGrading: string
    autoGradingDesc: string
    cvBuilder: string
    cvBuilderDesc: string
    startJourney: string
    joinPlatform: string
    createFreeAccount: string
    allRightsReserved: string
  }

  // Auth
  auth: {
    login: string
    loginTitle: string
    loginDescription: string
    register: string
    registerTitle: string
    email: string
    password: string
    fullName: string
    companyName: string
    dontHaveAccount: string
    createNewAccount: string
    alreadyHaveAccount: string
    loginHere: string
    demoAccounts: string
    admin: string
    company: string
    candidate: string
    anyPassword: string
    emailOrPasswordIncorrect: string
    emailAlreadyUsed: string
    loginFailed: string
    registrationFailed: string
    loggingIn: string
    enterYourCredentials: string
    selectRole: string
    jobSeeker: string
  }

  // Dashboard
  dashboard: {
    welcome: string
    overview: string
    statistics: string
    recentActivity: string
    totalJobs: string
    activeJobs: string
    totalApplications: string
    pendingApplications: string
    totalCandidates: string
    totalSubmissions: string
    controlPanel: string
    welcomeMessage: string
    browseJobs: string
    addNewJob: string
    inProgress: string
    completed: string
    myRecentApplications: string
    recentJobs: string
    viewAll: string
    noApplicationsYet: string
    browseAvailableJobs: string
    totalApplicants: string
    noJobsYet: string
      startAddingJobs: string
      applicant: string
      applicants: string
      reviewSubmissions: string
      allSubmissions: string
  }

  // Jobs
  jobs: {
    title: string
    description: string
    requirements: string
    location: string
    type: string
    salary: string
    status: string
    active: string
    closed: string
    draft: string
    createJob: string
    editJob: string
    deleteJob: string
    noJobs: string
    apply: string
    viewDetails: string
    jobManagement: string
    createAndManageJobs: string
    noJobsAvailable: string
    checkBackLater: string
    requiresAssessment: string
    discoverOpportunities: string
    jobDetails: string
    industry: string
    size: string
    company: string
  }

  // Assessments
  assessments: {
    title: string
    description: string
    timeLimit: string
    minutes: string
      passingScore: string
      score: string
    createAssessment: string
    editAssessment: string
      sections: string
      questions: string
      startAssessment: string
      submitAssessment: string
      assessmentInfo: string
      assessmentTitle: string
      assessmentDescription: string
      timeLimitMinutes: string
      passingScoreRequired: string
      videoQuestion: string
      videoQuestionDesc: string
      startRecording: string
      stopRecording: string
      recorded: string
      reRecord: string
      videoSaved: string
      testCases: string
      testCasesOptional: string
      testCasesDescription: string
      testCasesExample: string
      input: string
      expectedOutput: string
      addTestCase: string
      manualReview: string
      allQuestionsRequired: string
      cannotEditAfterSubmit: string
    }

  // CV
  cv: {
    personalInfo: string
    education: string
    experience: string
    skills: string
    languages: string
    certifications: string
    summary: string
    phone: string
    address: string
    degree: string
    institution: string
    startDate: string
    endDate: string
    jobTitle: string
    company: string
    level: string
    name: string
    issuer: string
    date: string
    buildCV: string
    buildCVDesc: string
    preview: string
    download: string
    fullName: string
    email: string
    educationalInstitution: string
    field: string
    currentJob: string
    description: string
    add: string
    saveCV: string
    saving: string
    showPreview: string
    hidePreview: string
    cvSaved: string
    cvSaveFailed: string
    writeSummary: string
    writeDescription: string
    proficiency: string
    beginner: string
    intermediate: string
    advanced: string
    native: string
    selectLevel: string
  }

  // Self Assessment
  selfAssessment: {
    title: string
    description: string
    startAssessment: string
    takeAssessment: string
    optional: string
    intro: string
    introDescription: string
    question: string
    of: string
    next: string
    previous: string
    submit: string
    calculating: string
    recommendations: string
    recommendedPositions: string
    recommendedCourses: string
    noRecommendations: string
    viewJobs: string
    viewCourses: string
    skills: string
    interests: string
    experience: string
    education: string
    programming: string
    design: string
    marketing: string
    sales: string
    management: string
    data: string
    beginner: string
    intermediate: string
    advanced: string
    years: string
      courses: string
      noCourses: string
      noPositions: string
      whatAreYourSkills: string
      whatAreYourInterests: string
      whatIsYourExperience: string
      whatIsYourEducation: string
      howManyYears: string
      highSchool: string
      bachelorsDegree: string
      mastersDegree: string
      phd: string
  }

  // Applications
  applications: {
    myApplications: string
    noApplications: string
    status: string
    applied: string
    inProgress: string
    reviewed: string
    submitted: string
    pending: string
    accepted: string
    rejected: string
    shortlisted: string
    continueAssessment: string
  }

  // Forms
  forms: {
    required: string
    optional: string
    example: string
    select: string
    add: string
    remove: string
  }

  // Messages
  messages: {
    saved: string
    deleted: string
    created: string
    updated: string
    actionFailed: string
  }
}

export const translations: Record<Language, Translations> = {
  ar: {
    common: {
      login: "تسجيل الدخول",
      logout: "تسجيل الخروج",
      register: "إنشاء حساب",
      dashboard: "لوحة التحكم",
      save: "حفظ",
      cancel: "إلغاء",
      delete: "حذف",
      edit: "تعديل",
      create: "إنشاء",
      submit: "إرسال",
      loading: "جاري التحميل...",
      error: "خطأ",
      success: "نجح",
      back: "رجوع",
      next: "التالي",
      previous: "السابق",
      search: "بحث",
      filter: "تصفية",
      reset: "إعادة تعيين",
      close: "إغلاق",
      yes: "نعم",
      no: "لا",
      unknown: "غير معروف",
      noEmail: "لا يوجد بريد إلكتروني",
    },
    nav: {
      dashboard: "لوحة التحكم",
      users: "المستخدمين",
      companies: "الشركات",
      jobs: "الوظائف",
      browseJobs: "تصفح الوظائف",
      applications: "طلباتي",
      cv: "السيرة الذاتية",
      submissions: "المتقدمين",
      adminDashboard: "لوحة تحكم المدير",
      resume: "السيرة الذاتية",
      selfAssessment: "التقييم الذاتي",
    },
    home: {
      title: "منصة التوظيف",
      platformTitle: "منجم",
      subtitle: "للمواهب والفرص",
      description: "نربط بين الشركات والمواهب من خلال نظام تقييم شامل ومتطور",
      forCompanies: "للشركات",
      forJobSeekers: "للباحثين عن عمل",
      features: "مميزات المنصة",
      jobManagement: "إدارة الوظائف",
      jobManagementDesc: "نشر وإدارة الوظائف بسهولة مع نظام تقييم متكامل",
      multipleAssessments: "تقييمات متعددة",
      multipleAssessmentsDesc: "اختبارات برمجية، إكسل، فيديو، أسئلة متعددة الخيارات وأكثر",
      autoGrading: "تصحيح تلقائي",
      autoGradingDesc: "تصحيح تلقائي للأسئلة البرمجية والاختيارات المتعددة",
      cvBuilder: "بناء السيرة الذاتية",
      cvBuilderDesc: "أنشئ سيرتك الذاتية واحصل على ملف PDF احترافي",
      startJourney: "ابدأ رحلتك الآن",
      joinPlatform: "انضم إلى آلاف الشركات والباحثين عن عمل على منصتنا",
      createFreeAccount: "إنشاء حساب مجاني",
      allRightsReserved: "© 2025 منجم. جميع الحقوق محفوظة.",
    },
    auth: {
      login: "تسجيل الدخول",
      loginTitle: "تسجيل الدخول",
      loginDescription: "أدخل بياناتك للوصول إلى حسابك",
      register: "إنشاء حساب",
      registerTitle: "إنشاء حساب جديد",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      fullName: "الاسم الكامل",
      companyName: "اسم الشركة",
      dontHaveAccount: "ليس لديك حساب؟",
      createNewAccount: "إنشاء حساب جديد",
      alreadyHaveAccount: "لديك حساب بالفعل؟",
      loginHere: "تسجيل الدخول هنا",
      demoAccounts: "حسابات تجريبية:",
      admin: "مدير",
      company: "شركة",
      candidate: "متقدم",
      anyPassword: "(كلمة المرور: أي شيء)",
      emailOrPasswordIncorrect: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      emailAlreadyUsed: "البريد الإلكتروني مستخدم بالفعل",
      loginFailed: "فشل تسجيل الدخول",
      registrationFailed: "فشل إنشاء الحساب",
      loggingIn: "جاري تسجيل الدخول...",
      enterYourCredentials: "أدخل بياناتك للوصول إلى حسابك",
      selectRole: "اختر نوع الحساب",
      jobSeeker: "باحث عن عمل",
      enterYourInfo: "اختر نوع الحساب وأدخل بياناتك",
      createAccountLoading: "جاري إنشاء الحساب...",
      enterFullName: "أدخل اسمك الكامل",
      enterCompanyName: "أدخل اسم الشركة",
    },
    dashboard: {
      welcome: "مرحباً",
      overview: "نظرة عامة",
      statistics: "الإحصائيات",
      recentActivity: "النشاط الأخير",
      totalJobs: "إجمالي الوظائف",
      activeJobs: "الوظائف النشطة",
      totalApplications: "إجمالي الطلبات",
      pendingApplications: "الطلبات المعلقة",
      totalCandidates: "إجمالي المرشحين",
      totalSubmissions: "إجمالي المتقدمين",
      controlPanel: "لوحة التحكم",
      welcomeMessage: "مرحباً بك،",
      browseJobs: "تصفح الوظائف",
      addNewJob: "إضافة وظيفة جديدة",
      inProgress: "قيد التنفيذ",
      completed: "مكتملة",
      myRecentApplications: "طلباتي الأخيرة",
      recentJobs: "الوظائف الأخيرة",
      viewAll: "عرض الكل",
      noApplicationsYet: "لم تتقدم لأي وظائف بعد",
      browseAvailableJobs: "تصفح الوظائف المتاحة",
      totalApplicants: "إجمالي المتقدمين",
      noJobsYet: "لم تقم بإضافة أي وظائف بعد",
      startAddingJobs: "ابدأ بإضافة وظيفة جديدة لاستقبال المتقدمين",
      applicant: "متقدم",
      applicants: "متقدم",
      reviewSubmissions: "راجع وقيّم طلبات المتقدمين",
      allSubmissions: "جميع الطلبات",
    },
    jobs: {
      title: "العنوان",
      description: "الوصف",
      requirements: "المتطلبات",
      location: "الموقع",
      type: "النوع",
      salary: "الراتب",
      status: "الحالة",
      active: "نشط",
      closed: "مغلق",
      draft: "مسودة",
      createJob: "إنشاء وظيفة",
      editJob: "تعديل الوظيفة",
      deleteJob: "حذف الوظيفة",
      noJobs: "لا توجد وظائف",
      apply: "تقدم للوظيفة",
      viewDetails: "عرض التفاصيل",
      jobManagement: "إدارة الوظائف",
      createAndManageJobs: "قم بإنشاء وإدارة الوظائف المتاحة",
      noJobsAvailable: "لا توجد وظائف متاحة حالياً",
      checkBackLater: "تحقق مرة أخرى لاحقاً للحصول على فرص جديدة",
      requiresAssessment: "يتطلب تقييم",
      discoverOpportunities: "اكتشف الفرص المتاحة وتقدم للوظائف",
      jobDetails: "تفاصيل الوظيفة",
      industry: "الصناعة",
      size: "حجم الشركة",
      company: "الشركة",
      job: "الوظيفة",
    },
    assessments: {
      title: "عنوان التقييم",
      description: "وصف التقييم",
      timeLimit: "الوقت المحدد",
      minutes: "دقيقة",
      passingScore: "الدرجة المطلوبة",
      score: "النتيجة",
    createAssessment: "إنشاء تقييم",
      editAssessment: "تعديل التقييم",
      sections: "الأقسام",
      questions: "الأسئلة",
      startAssessment: "بدء التقييم",
      submitAssessment: "إرسال التقييم",
      assessmentInfo: "معلومات التقييم",
      assessmentTitle: "عنوان التقييم *",
      assessmentDescription: "وصف التقييم",
      timeLimitMinutes: "الوقت المحدد (بالدقائق) *",
      passingScoreRequired: "الدرجة المطلوبة للنجاح *",
      videoQuestion: "سجل إجابتك بالفيديو",
      videoQuestionDesc: "سيتم تسجيل فيديو لإجابتك. يمكنك إعادة التسجيل قبل الإرسال.",
      startRecording: "بدء التسجيل",
      stopRecording: "إيقاف التسجيل",
      recorded: "تم التسجيل",
      reRecord: "إعادة التسجيل",
      videoSaved: "تم حفظ الفيديو. يمكنك إعادة التسجيل أو المتابعة.",
      testCases: "حالات الاختبار",
      testCasesOptional: "حالات الاختبار (اختياري)",
      testCasesDescription: "حالات الاختبار تُستخدم للتحقق التلقائي من صحة الكود. يمكنك إضافتها للتحقق التلقائي، أو مراجعة الكود يدوياً بعد الإرسال.",
      testCasesExample: "مثال: إذا كان السؤال 'اكتب دالة لحساب المجموع'، المدخل: [1, 2, 3] والمخرج المتوقع: 6",
      input: "المدخل",
      expectedOutput: "المخرج المتوقع",
      addTestCase: "إضافة حالة اختبار",
      manualReview: "إذا لم تضيف حالات اختبار، سيتم مراجعة الإجابة يدوياً.",
      allQuestionsRequired: "يجب الإجابة على جميع الأسئلة قبل الإرسال",
      cannotEditAfterSubmit: "لن تتمكن من التعديل بعد الإرسال",
      cheatingDetectionTitle: "نظام كشف الغش",
      cheatingDetectionWarning: "تحذير: نظام كشف الغش مفعل",
      cheatingDetectionInfo: "سيتم مراقبة نشاطك أثناء التقييم. إذا تم اكتشاف أي من السلوكيات التالية، سيتم إرسال التقييم تلقائياً حتى لو لم تنهيه:",
      cheatingDetectionList1: "فتح تبويب آخر في المتصفح",
      cheatingDetectionList2: "التبديل إلى نافذة أخرى",
      cheatingDetectionList3: "التبديل إلى تطبيق آخر",
      cheatingDetectionList4: "فقدان التركيز على صفحة التقييم",
      cheatingDetectionAgreement: "أوافق على هذه الشروط وأفهم أن التقييم سيتم إرساله تلقائياً إذا تم اكتشاف أي نشاط مشبوه",
      cheatingDetected: "تم اكتشاف نشاط مشبوه",
      cheatingDetectedMessage: "تم اكتشاف أنك قمت بفتح تبويب آخر أو التبديل إلى تطبيق آخر. تم إرسال التقييم تلقائياً.",
      cheatingWarningNotice: "تنبيه: نظام كشف الغش مفعل. أي تغيير في التبويب أو النافذة سيؤدي إلى إرسال التقييم تلقائياً.",
      agreeAndStart: "أوافق وأبدأ التقييم",
      iAgree: "أوافق",
    },
    cv: {
      personalInfo: "المعلومات الشخصية",
      education: "التعليم",
      experience: "الخبرات",
      skills: "المهارات",
      languages: "اللغات",
      certifications: "الشهادات",
      summary: "ملخص",
      phone: "الهاتف",
      address: "العنوان",
      degree: "الدرجة العلمية",
      institution: "المؤسسة",
      startDate: "تاريخ البدء",
      endDate: "تاريخ الانتهاء",
      jobTitle: "المسمى الوظيفي",
      company: "الشركة",
      level: "المستوى",
      name: "الاسم",
      issuer: "المصدر",
      date: "التاريخ",
      buildCV: "بناء السيرة الذاتية",
      buildCVDesc: "أنشئ سيرتك الذاتية واحصل على ملف PDF احترافي",
      preview: "معاينة",
      download: "تحميل",
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      educationalInstitution: "المؤسسة التعليمية",
      field: "التخصص",
      currentJob: "أعمل حالياً في هذه الوظيفة",
      description: "الوصف",
      add: "إضافة",
      saveCV: "حفظ السيرة الذاتية",
      saving: "جاري الحفظ...",
      showPreview: "معاينة",
      hidePreview: "إخفاء المعاينة",
      cvSaved: "تم حفظ السيرة الذاتية بنجاح",
      cvSaveFailed: "فشل حفظ السيرة الذاتية",
      writeSummary: "اكتب نبذة مختصرة عنك...",
      writeDescription: "اكتب وصفاً للمهام والإنجازات...",
      proficiency: "المستوى",
      beginner: "مبتدئ",
      intermediate: "متوسط",
      advanced: "متقدم",
      native: "لغة أم",
      selectLevel: "المستوى",
    },
    selfAssessment: {
      title: "التقييم الذاتي",
      description: "قيم نفسك واحصل على توصيات مخصصة للوظائف والدورات",
      startAssessment: "بدء التقييم",
      takeAssessment: "أخذ التقييم الذاتي",
      optional: "اختياري",
      intro: "مرحباً بك في التقييم الذاتي",
      introDescription: "سيساعدك هذا التقييم على اكتشاف أفضل الوظائف والدورات المناسبة لمهاراتك واهتماماتك. سوف يستغرق حوالي 5 دقائق.",
      question: "سؤال",
      of: "من",
      next: "التالي",
      previous: "السابق",
      submit: "إرسال",
      calculating: "جاري حساب التوصيات...",
      recommendations: "توصياتنا لك",
      recommendedPositions: "الوظائف الموصى بها",
      recommendedCourses: "الدورات الموصى بها",
      noRecommendations: "لا توجد توصيات متاحة حالياً",
      viewJobs: "عرض الوظائف",
      viewCourses: "عرض الدورات",
      skills: "المهارات",
      interests: "الاهتمامات",
      experience: "الخبرة",
      education: "التعليم",
      programming: "البرمجة",
      design: "التصميم",
      marketing: "التسويق",
      sales: "المبيعات",
      management: "الإدارة",
      data: "البيانات",
      beginner: "مبتدئ",
      intermediate: "متوسط",
      advanced: "متقدم",
      years: "سنوات",
      courses: "الدورات",
      noCourses: "لا توجد دورات متاحة حالياً",
      noPositions: "لا توجد وظائف متاحة حالياً",
      whatAreYourSkills: "ما هي مهاراتك الرئيسية",
      whatAreYourInterests: "ما هي اهتماماتك الرئيسية",
      whatIsYourExperience: "ما هو مستوى خبرتك",
      whatIsYourEducation: "ما هو مستواك التعليمي",
      howManyYears: "كم سنة من الخبرة المهنية لديك",
      highSchool: "ثانوية عامة",
      bachelorsDegree: "بكالوريوس",
      mastersDegree: "ماجستير",
      phd: "دكتوراه",
    },
    applications: {
      myApplications: "طلباتي",
      noApplications: "لا توجد طلبات",
      status: "الحالة",
      applied: "تم التقديم",
      inProgress: "قيد التنفيذ",
      reviewed: "تمت المراجعة",
      submitted: "مكتمل",
      pending: "معلق",
      accepted: "مقبول",
      rejected: "مرفوض",
      shortlisted: "قائمة مختصرة",
      continueAssessment: "متابعة التقييم",
    },
    forms: {
      required: "مطلوب",
      optional: "اختياري",
      example: "مثال",
      select: "اختر",
      add: "إضافة",
      remove: "إزالة",
    },
    messages: {
      saved: "تم الحفظ",
      deleted: "تم الحذف",
      created: "تم الإنشاء",
      updated: "تم التحديث",
      actionFailed: "فشلت العملية",
    },
  },
  en: {
    common: {
      login: "Login",
      logout: "Logout",
      register: "Register",
      dashboard: "Dashboard",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      create: "Create",
      submit: "Submit",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      back: "Back",
      next: "Next",
      previous: "Previous",
      search: "Search",
      filter: "Filter",
      reset: "Reset",
      close: "Close",
      yes: "Yes",
      no: "No",
      unknown: "Unknown",
      noEmail: "No email",
    },
    nav: {
      dashboard: "Dashboard",
      users: "Users",
      companies: "Companies",
      jobs: "Jobs",
      browseJobs: "Browse Jobs",
      applications: "My Applications",
      cv: "Resume",
      submissions: "Submissions",
      adminDashboard: "Admin Dashboard",
      resume: "Resume",
    },
    home: {
      title: "Job Platform",
      platformTitle: "Manjam",
      subtitle: "A mine of talent and opportunities",
      description: "Connecting companies and talents through a comprehensive and advanced evaluation system",
      forCompanies: "For Companies",
      forJobSeekers: "For Job Seekers",
      features: "Platform Features",
      jobManagement: "Job Management",
      jobManagementDesc: "Easily post and manage jobs with an integrated assessment system",
      multipleAssessments: "Multiple Assessments",
      multipleAssessmentsDesc: "Coding tests, Excel, video, multiple choice questions and more",
      autoGrading: "Auto Grading",
      autoGradingDesc: "Automatic grading for coding questions and multiple choice questions",
      cvBuilder: "CV Builder",
      cvBuilderDesc: "Create your resume and get a professional PDF file",
      startJourney: "Start Your Journey Now",
      joinPlatform: "Join thousands of companies and job seekers on our platform",
      createFreeAccount: "Create Free Account",
      allRightsReserved: "© 2025 Manjam. All rights reserved.",
    },
    auth: {
      login: "Login",
      loginTitle: "Login",
      loginDescription: "Enter your credentials to access your account",
      register: "Register",
      registerTitle: "Create New Account",
      email: "Email",
      password: "Password",
      fullName: "Full Name",
      companyName: "Company Name",
      dontHaveAccount: "Don't have an account?",
      createNewAccount: "Create New Account",
      alreadyHaveAccount: "Already have an account?",
      loginHere: "Login here",
      demoAccounts: "Demo Accounts:",
      admin: "Admin",
      company: "Company",
      candidate: "Candidate",
      anyPassword: "(Password: anything)",
      emailOrPasswordIncorrect: "Email or password is incorrect",
      emailAlreadyUsed: "Email is already in use",
      loginFailed: "Login failed",
      registrationFailed: "Registration failed",
      loggingIn: "Logging in...",
      enterYourCredentials: "Enter your credentials to access your account",
      selectRole: "Select Account Type",
      jobSeeker: "Job Seeker",
      enterYourInfo: "Choose account type and enter your information",
      createAccountLoading: "Creating account...",
      enterFullName: "Enter your full name",
      enterCompanyName: "Enter company name",
    },
    dashboard: {
      welcome: "Welcome",
      overview: "Overview",
      statistics: "Statistics",
      recentActivity: "Recent Activity",
      totalJobs: "Total Jobs",
      activeJobs: "Active Jobs",
      totalApplications: "Total Applications",
      pendingApplications: "Pending Applications",
      totalCandidates: "Total Candidates",
      totalSubmissions: "Total Submissions",
      controlPanel: "Control Panel",
      welcomeMessage: "Welcome,",
      browseJobs: "Browse Jobs",
      addNewJob: "Add New Job",
      inProgress: "In Progress",
      completed: "Completed",
      myRecentApplications: "My Recent Applications",
      recentJobs: "Recent Jobs",
      viewAll: "View All",
      noApplicationsYet: "You haven't applied for any jobs yet",
      browseAvailableJobs: "Browse Available Jobs",
      totalApplicants: "Total Applicants",
      noJobsYet: "You haven't added any jobs yet",
      startAddingJobs: "Start by adding a new job to receive applicants",
      applicant: "applicant",
      applicants: "applicants",
      reviewSubmissions: "Review and evaluate applicant submissions",
      allSubmissions: "All Submissions",
    },
    jobs: {
      title: "Title",
      description: "Description",
      requirements: "Requirements",
      location: "Location",
      type: "Type",
      salary: "Salary",
      status: "Status",
      active: "Active",
      closed: "Closed",
      draft: "Draft",
      createJob: "Create Job",
      editJob: "Edit Job",
      deleteJob: "Delete Job",
      noJobs: "No jobs found",
      apply: "Apply for Job",
      viewDetails: "View Details",
      jobManagement: "Job Management",
      createAndManageJobs: "Create and manage available jobs",
      noJobsAvailable: "No jobs available at the moment",
      checkBackLater: "Check back later for new opportunities",
      requiresAssessment: "Requires Assessment",
      discoverOpportunities: "Discover available opportunities and apply for jobs",
      jobDetails: "Job Details",
      industry: "Industry",
      size: "Company Size",
      company: "Company",
      job: "Job",
    },
    assessments: {
      title: "Assessment Title",
      description: "Assessment Description",
      timeLimit: "Time Limit",
      minutes: "minutes",
      passingScore: "Passing Score",
      score: "Score",
    createAssessment: "Create Assessment",
      editAssessment: "Edit Assessment",
      sections: "Sections",
      questions: "Questions",
      startAssessment: "Start Assessment",
      submitAssessment: "Submit Assessment",
      assessmentInfo: "Assessment Information",
      assessmentTitle: "Assessment Title *",
      assessmentDescription: "Assessment Description",
      timeLimitMinutes: "Time Limit (minutes) *",
      passingScoreRequired: "Passing Score Required *",
      videoQuestion: "Record Your Video Answer",
      videoQuestionDesc: "Record a video of your answer. You can re-record before submitting.",
      startRecording: "Start Recording",
      stopRecording: "Stop Recording",
      recorded: "Recorded",
      reRecord: "Re-record",
      videoSaved: "Video saved. You can re-record or continue.",
      testCases: "Test Cases",
      testCasesOptional: "Test Cases (Optional)",
      testCasesDescription: "Test cases are used for automatic code verification. You can add them for auto-checking, or review the code manually after submission.",
      testCasesExample: "Example: If the question is 'Write a function to calculate the sum', Input: [1, 2, 3] and Expected Output: 6",
      input: "Input",
      expectedOutput: "Expected Output",
      addTestCase: "Add Test Case",
      manualReview: "If you don't add test cases, the answer will be reviewed manually.",
      allQuestionsRequired: "You must answer all questions before submitting",
      cannotEditAfterSubmit: "You cannot edit after submitting",
      cheatingDetectionTitle: "Cheating Detection System",
      cheatingDetectionWarning: "Warning: Cheating Detection is Active",
      cheatingDetectionInfo: "Your activity will be monitored during the assessment. If any of the following behaviors are detected, the assessment will be automatically submitted even if you haven't finished:",
      cheatingDetectionList1: "Opening another browser tab",
      cheatingDetectionList2: "Switching to another window",
      cheatingDetectionList3: "Switching to another application",
      cheatingDetectionList4: "Losing focus on the assessment page",
      cheatingDetectionAgreement: "I agree to these terms and understand that the assessment will be automatically submitted if any suspicious activity is detected",
      cheatingDetected: "Suspicious Activity Detected",
      cheatingDetectedMessage: "It has been detected that you opened another tab or switched to another application. The assessment has been automatically submitted.",
      cheatingWarningNotice: "Warning: Cheating detection is active. Any tab or window change will automatically submit the assessment.",
      agreeAndStart: "I Agree and Start Assessment",
      iAgree: "I Agree",
    },
    cv: {
      personalInfo: "Personal Information",
      education: "Education",
      experience: "Experience",
      skills: "Skills",
      languages: "Languages",
      certifications: "Certifications",
      summary: "Summary",
      phone: "Phone",
      address: "Address",
      degree: "Degree",
      institution: "Institution",
      startDate: "Start Date",
      endDate: "End Date",
      jobTitle: "Job Title",
      company: "Company",
      level: "Level",
      name: "Name",
      issuer: "Issuer",
      date: "Date",
      buildCV: "Build Resume",
      buildCVDesc: "Create your resume and get a professional PDF file",
      preview: "Preview",
      download: "Download",
      fullName: "Full Name",
      email: "Email",
      educationalInstitution: "Educational Institution",
      field: "Field",
      currentJob: "I currently work in this position",
      description: "Description",
      add: "Add",
      saveCV: "Save Resume",
      saving: "Saving...",
      showPreview: "Preview",
      hidePreview: "Hide Preview",
      cvSaved: "Resume saved successfully",
      cvSaveFailed: "Failed to save resume",
      writeSummary: "Write a brief summary about yourself...",
      writeDescription: "Write a description of tasks and achievements...",
      proficiency: "Proficiency",
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
      native: "Native",
      selectLevel: "Level",
    },
    selfAssessment: {
      title: "Self Assessment",
      description: "Assess yourself and get personalized job and course recommendations",
      startAssessment: "Start Assessment",
      takeAssessment: "Take Self Assessment",
      optional: "Optional",
      intro: "Welcome to Self Assessment",
      introDescription: "This assessment will help you discover the best jobs and courses that match your skills and interests. It will take about 5 minutes.",
      question: "Question",
      of: "of",
      next: "Next",
      previous: "Previous",
      submit: "Submit",
      calculating: "Calculating recommendations...",
      recommendations: "Our Recommendations for You",
      recommendedPositions: "Recommended Positions",
      recommendedCourses: "Recommended Courses",
      noRecommendations: "No recommendations available at the moment",
      viewJobs: "View Jobs",
      viewCourses: "View Courses",
      skills: "Skills",
      interests: "Interests",
      experience: "Experience",
      education: "Education",
      programming: "Programming",
      design: "Design",
      marketing: "Marketing",
      sales: "Sales",
      management: "Management",
      data: "Data",
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
      years: "years",
      courses: "Courses",
      noCourses: "No courses available at the moment",
      noPositions: "No positions available at the moment",
      whatAreYourSkills: "What are your main skills",
      whatAreYourInterests: "What are your main interests",
      whatIsYourExperience: "What is your experience level",
      whatIsYourEducation: "What is your education level",
      howManyYears: "How many years of professional experience do you have",
      highSchool: "High School",
      bachelorsDegree: "Bachelor's Degree",
      mastersDegree: "Master's Degree",
      phd: "PhD",
    },
    applications: {
      myApplications: "My Applications",
      noApplications: "No applications found",
      status: "Status",
      applied: "Applied",
      inProgress: "In Progress",
      reviewed: "Reviewed",
      submitted: "Completed",
      pending: "Pending",
      accepted: "Accepted",
      rejected: "Rejected",
      shortlisted: "Shortlisted",
      continueAssessment: "Continue Assessment",
    },
    forms: {
      required: "Required",
      optional: "Optional",
      example: "Example",
      select: "Select",
      add: "Add",
      remove: "Remove",
    },
    messages: {
      saved: "Saved",
      deleted: "Deleted",
      created: "Created",
      updated: "Updated",
      actionFailed: "Action failed",
    },
  },
}

