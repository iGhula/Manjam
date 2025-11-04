"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, BookOpen, Sparkles, ArrowRight } from "lucide-react"
import { useApp } from "@/lib/context/app-context"
import { useTranslation } from "@/lib/i18n/use-translation"
import Link from "next/link"

interface SelfAssessmentResultsProps {
  recommendations: any
  userId: string
}

export default function SelfAssessmentResults({ recommendations, userId }: SelfAssessmentResultsProps) {
  const router = useRouter()
  const { jobs } = useApp()
  const t = useTranslation()
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([])
  const [recommendedCourses, setRecommendedCourses] = useState<any[]>([])

  useEffect(() => {
    // Calculate recommendations based on skills and interests
    const skills = recommendations.skills || []
    const interests = recommendations.skills || [] // Use skills for now
    const allInterests = [...skills, ...interests]

    // Filter jobs based on skills/interests
    const matchedJobs = jobs
      .filter((job: any) => job.status === "active")
      .filter((job: any) => {
        const jobTitle = job.title.toLowerCase()
        const jobDesc = job.description?.toLowerCase() || ""
        
        // Match jobs based on keywords
        const keywords: Record<string, string[]> = {
          programming: ["برمجيات", "مطور", "developer", "programming", "software", "front-end", "backend"],
          design: ["مصمم", "designer", "ui", "ux", "تصميم"],
          marketing: ["تسويق", "marketing", "marketer"],
          sales: ["مبيعات", "sales", "بائع"],
          management: ["إدارة", "management", "manager", "مدير"],
          data: ["بيانات", "data", "analyst", "محلل"],
        }

        return allInterests.some((interest: string) => {
          const interestKeywords = keywords[interest] || []
          return interestKeywords.some((keyword: string) => 
            jobTitle.includes(keyword) || jobDesc.includes(keyword)
          )
        })
      })
      .slice(0, 5) // Get top 5 matches

    setRecommendedJobs(matchedJobs)

    // Generate course recommendations based on skills
    const courses = generateCourseRecommendations(allInterests, recommendations.experience)
    setRecommendedCourses(courses)
  }, [recommendations, jobs])

  const generateCourseRecommendations = (interests: string[], experience: string) => {
    const courseMap: Record<string, any[]> = {
      programming: [
        { name: "JavaScript Fundamentals", provider: "Online Platform", level: "Beginner" },
        { name: "React & Next.js Advanced", provider: "Online Platform", level: "Advanced" },
        { name: "Full Stack Development", provider: "Online Platform", level: "Intermediate" },
      ],
      design: [
        { name: "UI/UX Design Principles", provider: "Online Platform", level: "Beginner" },
        { name: "Figma Mastery", provider: "Online Platform", level: "Intermediate" },
        { name: "Advanced Design Systems", provider: "Online Platform", level: "Advanced" },
      ],
      marketing: [
        { name: "Digital Marketing Basics", provider: "Online Platform", level: "Beginner" },
        { name: "SEO & Content Marketing", provider: "Online Platform", level: "Intermediate" },
        { name: "Social Media Marketing", provider: "Online Platform", level: "Intermediate" },
      ],
      sales: [
        { name: "Sales Fundamentals", provider: "Online Platform", level: "Beginner" },
        { name: "Advanced Sales Techniques", provider: "Online Platform", level: "Advanced" },
      ],
      management: [
        { name: "Project Management", provider: "Online Platform", level: "Intermediate" },
        { name: "Leadership Skills", provider: "Online Platform", level: "Advanced" },
      ],
      data: [
        { name: "Data Analysis Basics", provider: "Online Platform", level: "Beginner" },
        { name: "Excel Advanced", provider: "Online Platform", level: "Intermediate" },
        { name: "Data Science Fundamentals", provider: "Online Platform", level: "Advanced" },
      ],
    }

    const courses: any[] = []
    interests.forEach((interest: string) => {
      const interestCourses = courseMap[interest] || []
      courses.push(...interestCourses.slice(0, 2)) // Get 2 courses per interest
    })

    return courses.slice(0, 6) // Return top 6 courses
  }

  return (
    <div className="space-y-6">
      <Card className="card-enhanced shadow-brand border-primary/20">
        <CardContent className="p-8 text-center">
          <Sparkles className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3 gradient-text">{t.selfAssessment.recommendations}</h2>
          <p className="text-muted-foreground">
            {t.selfAssessment.introDescription}
          </p>
        </CardContent>
      </Card>

      {/* Recommended Positions */}
      <Card className="card-enhanced hover-lift shadow-brand">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="gradient-text flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              {t.selfAssessment.recommendedPositions}
            </CardTitle>
            <Link href="/candidate/jobs">
              <Button variant="outline" size="sm" className="btn-enhanced hover-lift">
                {t.selfAssessment.viewJobs}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recommendedJobs.length > 0 ? (
            <div className="space-y-3">
              {recommendedJobs.map((job: any) => (
                <Link key={job.id} href={`/candidate/jobs/${job.id}`}>
                  <div className="p-4 rounded-lg border hover:border-primary hover:shadow-brand transition-all hover-lift">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{job.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          {job.location && <span>{job.location}</span>}
                          {job.type && <span>• {job.type}</span>}
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-4">
                        {t.selfAssessment.recommendedPositions}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t.selfAssessment.noPositions}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommended Courses */}
      <Card className="card-enhanced hover-lift shadow-brand">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="gradient-text flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {t.selfAssessment.recommendedCourses}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {recommendedCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {recommendedCourses.map((course: any, index: number) => (
                <div key={index} className="p-4 rounded-lg border hover:border-primary hover:shadow-brand transition-all hover-lift">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{course.name}</h3>
                    <Badge variant="outline" className="ml-2">
                      {course.level}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{course.provider}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{t.selfAssessment.courses}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t.selfAssessment.noCourses}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-center">
        <Link href="/candidate/jobs">
          <Button size="lg" className="btn-enhanced hover-lift shadow-brand">
            <Briefcase className="ml-2 h-5 w-5" />
            {t.selfAssessment.viewJobs}
          </Button>
        </Link>
        <Link href="/candidate/dashboard">
          <Button variant="outline" size="lg" className="btn-enhanced hover-lift">
            {t.common.back}
          </Button>
        </Link>
      </div>
    </div>
  )
}

