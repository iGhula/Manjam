"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { useApp } from "@/lib/context/app-context"
import { useTranslation } from "@/lib/i18n/use-translation"
import { LanguageSwitcher } from "@/components/language-switcher"
import { PlatformLogo } from "@/components/platform-logo"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useApp()
  const t = useTranslation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const success = await login(email, password)

      if (!success) {
        throw new Error(t.auth.emailOrPasswordIncorrect)
      }

      // Get user from localStorage to check role
      const userStr = localStorage.getItem("currentUser")
      if (userStr) {
        const user = JSON.parse(userStr)
        // Redirect based on role
        if (user.role === "company") {
          router.push("/company/dashboard")
        } else if (user.role === "jobseeker") {
          router.push("/candidate/dashboard")
        } else if (user.role === "admin") {
          router.push("/admin/dashboard")
        }
      }
    } catch (err: any) {
      setError(err.message || t.auth.loginFailed)
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
      <Card className="w-full max-w-md glass shadow-brand-lg animate-scale-in border-glow hover-lift relative z-10">
        <CardHeader className="text-center relative z-10">
          <div className="flex justify-center mb-4">
            <PlatformLogo showTitle={false} size="xl" />
          </div>
          <CardTitle className="text-2xl gradient-text animate-fade-in animate-delay-100">{t.auth.loginTitle}</CardTitle>
          <CardDescription className="animate-fade-in animate-delay-200">{t.auth.loginDescription}</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <form onSubmit={handleLogin} className="space-y-4 relative z-10" autoComplete="off">
            {error && (
              <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-danger flex-shrink-0 mt-0.5" />
                <p className="text-sm text-danger">{error}</p>
              </div>
            )}

            <div className="space-y-2 relative z-10">
              <Label htmlFor="email">{t.auth.email}</Label>
              <Input
                id="email"
                type="email"
                name="login-email"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
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
                name="login-password"
                autoComplete="new-password"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="relative z-10 pointer-events-auto"
              />
            </div>

            <Button type="submit" className="w-full btn-enhanced hover-lift shadow-brand" disabled={loading}>
              {loading ? t.auth.loggingIn : t.auth.login}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              {t.auth.dontHaveAccount}{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                {t.auth.createNewAccount}
              </Link>
            </div>

            <div className="text-center text-xs text-muted-foreground border-t pt-4">
              <p className="mb-2 font-medium">{t.auth.demoAccounts}</p>
              <p>{t.auth.admin}: admin@demo.com</p>
              <p>{t.auth.company}: company@demo.com</p>
              <p>{t.auth.candidate}: candidate@demo.com</p>
              <p className="mt-1 text-[10px]">{t.auth.anyPassword}</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
