"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, AlertCircle, Building2, User, ArrowLeft } from "lucide-react"
import { useApp } from "@/lib/context/app-context"
import { useTranslation } from "@/lib/i18n/use-translation"
import { LanguageSwitcher } from "@/components/language-switcher"
import { PlatformLogo } from "@/components/platform-logo"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { register } = useApp()
  const t = useTranslation()
  const [role, setRole] = useState<"company" | "jobseeker">("jobseeker")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const roleParam = searchParams.get("role")
    if (roleParam === "company" || roleParam === "jobseeker") {
      setRole(roleParam)
    }
  }, [searchParams])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const success = await register(email, password, fullName, role, companyName)

      if (!success) {
        throw new Error(t.auth.emailAlreadyUsed)
      }

      // Redirect based on role
      if (role === "company") {
        router.push("/company/dashboard")
      } else {
        router.push("/candidate/dashboard")
      }
    } catch (err: any) {
      setError(err.message || t.auth.registrationFailed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4 page-transition">
      <div className="absolute top-4 left-4 z-20">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 btn-enhanced hover-lift">
            <ArrowLeft className="h-4 w-4" />
            {t.common.back}
          </Button>
        </Link>
      </div>
      <div className="absolute top-4 right-4 animate-slide-in-right z-20">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-xl min-h-[700px] glass shadow-brand-lg animate-scale-in border-glow hover-lift relative z-10">
        <CardHeader className="text-center relative z-10">
          <div className="flex justify-center mb-4">
            <PlatformLogo showTitle={false} size="xl" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary animate-fade-in animate-delay-100">{t.auth.registerTitle}</CardTitle>
          <CardDescription className="animate-fade-in animate-delay-200">{t.auth.enterYourInfo}</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <form onSubmit={handleRegister} className="space-y-4 relative z-10" autoComplete="off">
            {error && (
              <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 flex items-start gap-2 relative z-10">
                <AlertCircle className="h-5 w-5 text-danger flex-shrink-0 mt-0.5" />
                <p className="text-sm text-danger">{error}</p>
              </div>
            )}

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3 relative z-10">
              <button
                type="button"
                onClick={() => setRole("jobseeker")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  role === "jobseeker" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <User className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="font-medium text-sm">{t.auth.jobSeeker}</p>
              </button>
              <button
                type="button"
                onClick={() => setRole("company")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  role === "company" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <Building2 className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="font-medium text-sm">{t.auth.company}</p>
              </button>
            </div>

            <div className="space-y-2 relative z-10">
              <Label htmlFor="fullName">{t.auth.fullName}</Label>
              <Input
                id="fullName"
                type="text"
                name="register-fullName"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder={t.auth.enterFullName}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
                className="relative z-10 pointer-events-auto"
              />
            </div>

            {role === "company" && (
              <div className="space-y-2 relative z-10">
                <Label htmlFor="companyName">{t.auth.companyName}</Label>
                <Input
                  id="companyName"
                  type="text"
                  name="register-companyName"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder={t.auth.enterCompanyName}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  disabled={loading}
                  className="relative z-10 pointer-events-auto"
                />
              </div>
            )}

            <div className="space-y-2 relative z-10">
              <Label htmlFor="email">{t.auth.email}</Label>
              <Input
                id="email"
                type="email"
                name="register-email"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="relative z-10 pointer-events-auto"
              />
            </div>

            <div className="space-y-2 relative z-10">
              <Label htmlFor="password">{t.auth.password}</Label>
              <Input
                id="password"
                type="password"
                name="register-password"
                autoComplete="new-password"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
                className="relative z-10 pointer-events-auto"
              />
            </div>

            <Button type="submit" className="w-full btn-enhanced hover-lift shadow-brand relative z-10 pointer-events-auto" disabled={loading}>
              {loading ? t.auth.createAccountLoading : t.auth.register}
            </Button>

            <div className="text-center text-sm text-muted-foreground relative z-10">
              {t.auth.alreadyHaveAccount}{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                {t.auth.loginHere}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
