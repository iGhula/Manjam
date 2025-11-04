"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Plus, X, Eye } from "lucide-react"
import { useApp } from "@/lib/context/app-context"
import { useTranslation } from "@/lib/i18n/use-translation"
import CVPreview from "./cv-preview"

interface CVBuilderProps {
  initialData: any
  userId: string
}

export default function CVBuilder({ initialData, userId }: CVBuilderProps) {
  const { addCV, updateCV } = useApp()
  const t = useTranslation()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  const [personalInfo, setPersonalInfo] = useState(
    initialData?.personalInfo || {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      summary: "",
    },
  )

  const [education, setEducation] = useState<any[]>(
    initialData?.education || [
      {
        degree: "",
        institution: "",
        field: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
  )

  const [experience, setExperience] = useState<any[]>(
    initialData?.experience || [
      {
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ],
  )

  const [skills, setSkills] = useState<string[]>(initialData?.skills || [""])

  const [languages, setLanguages] = useState<any[]>(
    initialData?.languages || [
      {
        language: "",
        proficiency: "",
      },
    ],
  )

  const [certifications, setCertifications] = useState<any[]>(
    initialData?.certifications || [
      {
        name: "",
        issuer: "",
        date: "",
        description: "",
      },
    ],
  )

  const handleSave = async () => {
    setError("")
    setSaving(true)

    try {
      const cvData = {
        userId,
        personalInfo,
        education: education.filter((e) => e.degree || e.institution),
        experience: experience.filter((e) => e.title || e.company),
        skills: skills.filter((s) => s.trim()),
        languages: languages.filter((l) => l.language),
        certifications: certifications.filter((c) => c.name),
      }

      if (initialData?.id) {
        updateCV(initialData.id, cvData)
      } else {
        addCV(cvData)
      }

      alert(t.cv.cvSaved)
    } catch (err: any) {
      setError(err.message || t.cv.cvSaveFailed)
    } finally {
      setSaving(false)
    }
  }

  const cvData = {
    personal_info: {
      full_name: personalInfo.fullName,
      email: personalInfo.email,
      phone: personalInfo.phone,
      address: personalInfo.address,
      summary: personalInfo.summary,
    },
    education: education
      .filter((e) => e.degree || e.institution)
      .map((edu) => ({
        degree: edu.degree,
        institution: edu.institution,
        field: edu.field,
        start_date: edu.startDate,
        end_date: edu.endDate,
        description: edu.description,
      })),
    experience: experience
      .filter((e) => e.title || e.company)
      .map((exp) => ({
        title: exp.title,
        company: exp.company,
        location: exp.location,
        start_date: exp.startDate,
        end_date: exp.endDate,
        current: exp.current,
        description: exp.description,
      })),
    skills: skills.filter((s) => s.trim()),
    languages: languages.filter((l) => l.language),
    certifications: certifications.filter((c) => c.name),
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {error && (
          <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-danger flex-shrink-0 mt-0.5" />
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        {/* Personal Info */}
        <Card className="card-enhanced hover-lift shadow-brand">
          <CardHeader>
            <CardTitle className="gradient-text">{t.cv.personalInfo}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.cv.fullName} *</Label>
                <Input
                  value={personalInfo.fullName}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                  placeholder={t.auth.fullName}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.cv.email} *</Label>
                <Input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                  placeholder={t.auth.email}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t.cv.phone} *</Label>
                <Input
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                  placeholder={t.cv.phone}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.cv.address}</Label>
                <Input
                  value={personalInfo.address}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                  placeholder={t.cv.address}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t.cv.summary}</Label>
              <Textarea
                value={personalInfo.summary}
                onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })}
                placeholder={t.cv.writeSummary}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="card-enhanced hover-lift shadow-brand">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="gradient-text">{t.cv.education}</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setEducation([
                    ...education,
                    {
                      degree: "",
                      institution: "",
                      field: "",
                      startDate: "",
                      endDate: "",
                      description: "",
                    },
                  ])
                }
              >
                <Plus className="ml-2 h-4 w-4" />
                {t.cv.add}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {education.map((edu, index) => (
              <div key={index} className="space-y-4 pb-6 border-b last:border-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{t.cv.education} {index + 1}</h4>
                  {education.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEducation(education.filter((_, i) => i !== index))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t.cv.degree}</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => {
                        const newEdu = [...education]
                        newEdu[index].degree = e.target.value
                        setEducation(newEdu)
                      }}
                      placeholder={t.cv.degree}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.cv.educationalInstitution}</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) => {
                        const newEdu = [...education]
                        newEdu[index].institution = e.target.value
                        setEducation(newEdu)
                      }}
                      placeholder={t.cv.institution}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t.cv.field}</Label>
                  <Input
                    value={edu.field}
                    onChange={(e) => {
                      const newEdu = [...education]
                      newEdu[index].field = e.target.value
                      setEducation(newEdu)
                    }}
                    placeholder={t.cv.field}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t.cv.startDate}</Label>
                    <Input
                      type="month"
                      value={edu.startDate}
                      onChange={(e) => {
                        const newEdu = [...education]
                        newEdu[index].startDate = e.target.value
                        setEducation(newEdu)
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.cv.endDate}</Label>
                    <Input
                      type="month"
                      value={edu.endDate}
                      onChange={(e) => {
                        const newEdu = [...education]
                        newEdu[index].endDate = e.target.value
                        setEducation(newEdu)
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="card-enhanced hover-lift shadow-brand">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="gradient-text">{t.cv.experience}</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setExperience([
                    ...experience,
                    {
                      title: "",
                      company: "",
                      location: "",
                      startDate: "",
                      endDate: "",
                      current: false,
                      description: "",
                    },
                  ])
                }
              >
                <Plus className="ml-2 h-4 w-4" />
                {t.cv.add}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="space-y-4 pb-6 border-b last:border-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{t.cv.experience} {index + 1}</h4>
                  {experience.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setExperience(experience.filter((_, i) => i !== index))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t.cv.jobTitle}</Label>
                    <Input
                      value={exp.title}
                      onChange={(e) => {
                        const newExp = [...experience]
                        newExp[index].title = e.target.value
                        setExperience(newExp)
                      }}
                      placeholder={t.cv.jobTitle}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.cv.company}</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...experience]
                        newExp[index].company = e.target.value
                        setExperience(newExp)
                      }}
                      placeholder={t.cv.company}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t.cv.startDate}</Label>
                    <Input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => {
                        const newExp = [...experience]
                        newExp[index].startDate = e.target.value
                        setExperience(newExp)
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.cv.endDate}</Label>
                    <Input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => {
                        const newExp = [...experience]
                        newExp[index].endDate = e.target.value
                        setExperience(newExp)
                      }}
                      disabled={exp.current}
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => {
                      const newExp = [...experience]
                      newExp[index].current = e.target.checked
                      setExperience(newExp)
                    }}
                  />
                  <span className="text-sm">{t.cv.currentJob}</span>
                </label>
                <div className="space-y-2">
                  <Label>{t.cv.description}</Label>
                  <Textarea
                    value={exp.description}
                    onChange={(e) => {
                      const newExp = [...experience]
                      newExp[index].description = e.target.value
                      setExperience(newExp)
                    }}
                    placeholder={t.cv.writeDescription}
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="card-enhanced hover-lift shadow-brand">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="gradient-text">{t.cv.skills}</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setSkills([...skills, ""])}>
                <Plus className="ml-2 h-4 w-4" />
                {t.cv.add}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={skill}
                  onChange={(e) => {
                    const newSkills = [...skills]
                    newSkills[index] = e.target.value
                    setSkills(newSkills)
                  }}
                  placeholder="مثال: JavaScript, React, Node.js"
                />
                {skills.length > 1 && (
                  <Button size="sm" variant="ghost" onClick={() => setSkills(skills.filter((_, i) => i !== index))}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Languages */}
        <Card className="card-enhanced hover-lift shadow-brand">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="gradient-text">{t.cv.languages}</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setLanguages([...languages, { language: "", proficiency: "" }])}
              >
                <Plus className="ml-2 h-4 w-4" />
                {t.cv.add}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {languages.map((lang, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={lang.language}
                  onChange={(e) => {
                    const newLangs = [...languages]
                    newLangs[index].language = e.target.value
                    setLanguages(newLangs)
                  }}
                  placeholder={t.cv.languages}
                  className="flex-1"
                />
                <select
                  value={lang.proficiency}
                  onChange={(e) => {
                    const newLangs = [...languages]
                    newLangs[index].proficiency = e.target.value
                    setLanguages(newLangs)
                  }}
                  className="px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">{t.cv.selectLevel}</option>
                  <option value={t.cv.beginner}>{t.cv.beginner}</option>
                  <option value={t.cv.intermediate}>{t.cv.intermediate}</option>
                  <option value={t.cv.advanced}>{t.cv.advanced}</option>
                  <option value={t.cv.native}>{t.cv.native}</option>
                </select>
                {languages.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setLanguages(languages.filter((_, i) => i !== index))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card className="card-enhanced hover-lift shadow-brand">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="gradient-text">{t.cv.certifications}</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setCertifications([
                    ...certifications,
                    {
                      name: "",
                      issuer: "",
                      date: "",
                      description: "",
                    },
                  ])
                }
              >
                <Plus className="ml-2 h-4 w-4" />
                {t.cv.add}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {certifications.map((cert, index) => (
              <div key={index} className="space-y-4 pb-6 border-b last:border-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{t.cv.certifications} {index + 1}</h4>
                  {certifications.length > 1 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setCertifications(certifications.filter((_, i) => i !== index))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t.cv.name}</Label>
                    <Input
                      value={cert.name}
                      onChange={(e) => {
                        const newCerts = [...certifications]
                        newCerts[index].name = e.target.value
                        setCertifications(newCerts)
                      }}
                      placeholder={t.cv.name}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.cv.issuer}</Label>
                    <Input
                      value={cert.issuer}
                      onChange={(e) => {
                        const newCerts = [...certifications]
                        newCerts[index].issuer = e.target.value
                        setCertifications(newCerts)
                      }}
                      placeholder={t.cv.issuer}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t.cv.date}</Label>
                  <Input
                    type="month"
                    value={cert.date}
                    onChange={(e) => {
                      const newCerts = [...certifications]
                      newCerts[index].date = e.target.value
                      setCertifications(newCerts)
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving} className="flex-1 btn-enhanced hover-lift shadow-brand">
            {saving ? t.cv.saving : t.cv.saveCV}
          </Button>
        </div>
      </div>

      {/* Preview Sidebar */}
      <div className="lg:sticky lg:top-24 h-fit space-y-4">
        <Button variant="outline" className="w-full bg-transparent btn-enhanced hover-lift" onClick={() => setShowPreview(!showPreview)}>
          <Eye className="ml-2 h-4 w-4" />
          {showPreview ? t.cv.hidePreview : t.cv.showPreview}
        </Button>

        {showPreview && (
          <Card className="card-enhanced shadow-brand overflow-hidden">
            <CardContent className="p-0">
              <CVPreview data={cvData} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
