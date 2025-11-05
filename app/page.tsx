"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Briefcase, Users, FileText, Award, Menu } from "lucide-react"
import { useTranslation } from "@/lib/i18n/use-translation"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { PlatformLogo } from "@/components/platform-logo"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function HomePage() {
  const t = useTranslation()
  const { language } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 page-transition">
      {/* Header */}
      <header className="border-b glass sticky top-0 z-50 shadow-brand backdrop-blur-md animate-fade-in">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlatformLogo showTitle={false} size="xl" />
          </div>
          <div className="flex items-center gap-3 animate-slide-in-right">
            <LanguageSwitcher />
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="btn-enhanced">{t.common.login}</Button>
              </Link>
              <Link href="/register">
                <Button className="btn-enhanced">{t.common.register}</Button>
              </Link>
            </div>
            
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="pb-4 border-b">
                  <SheetTitle className="flex items-center gap-2">
                    <PlatformLogo showTitle={false} size="md" />
                    {t.home.platformTitle}
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-4">
                  <nav className="flex flex-col gap-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center px-4 py-2.5 rounded-md border hover:bg-muted transition-colors"
                    >
                      <span className="font-medium">{t.common.login}</span>
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center px-4 py-2.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      <span className="font-medium">{t.common.register}</span>
                    </Link>
                  </nav>
                  <div className="mt-4 pt-4 border-t flex flex-col gap-2">
                    <div className="px-3">
                      <LanguageSwitcher />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="w-full py-20 text-center section-spacing bg-cover bg-center bg-no-repeat min-h-[60vh] md:min-h-[70vh]"
        style={{ backgroundImage: 'url(/banner5.jpg)' }}
      >
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <div className="flex justify-center mb-8">
              <Image
                src={language === "ar" ? "/Manjam1.png" : "/Manjam2.png"}
                alt={t.home.platformTitle}
                width={800}
                height={400}
                className="max-w-full h-auto object-contain animate-fade-in"
                priority
              />
            </div>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto text-pretty">
              {t.home.description}
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 animate-fade-in animate-delay-300">
            <Link href="/register?role=company">
              <Button size="lg" className="text-lg btn-enhanced hover-lift shadow-brand">
                {t.home.forCompanies}
              </Button>
            </Link>
            <Link href="/register?role=jobseeker">
              <Button size="lg" className="text-xl text-white btn-enhanced hover-lift shadow-brand">
                {t.home.forJobSeekers}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 section-spacing">
        <div className="flex justify-center mb-12 w-full">
          <h3 className="text-3xl font-bold  animate-fade-in features-heading">{t.home.features}</h3>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center card-enhanced hover-lift animate-fade-in animate-delay-100">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-bold mb-2">{t.home.jobManagement}</h4>
            <p className="text-sm text-muted-foreground">{t.home.jobManagementDesc}</p>
          </Card>

          <Card className="p-6 text-center card-enhanced hover-lift animate-fade-in animate-delay-200">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-float" style={{ animationDelay: '0.5s' }}>
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-bold mb-2">{t.home.multipleAssessments}</h4>
            <p className="text-sm text-muted-foreground">{t.home.multipleAssessmentsDesc}</p>
          </Card>

          <Card className="p-6 text-center card-enhanced hover-lift animate-fade-in animate-delay-300">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-float" style={{ animationDelay: '1s' }}>
              <Award className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-bold mb-2">{t.home.autoGrading}</h4>
            <p className="text-sm text-muted-foreground">{t.home.autoGradingDesc}</p>
          </Card>

          <Card className="p-6 text-center card-enhanced hover-lift animate-fade-in animate-delay-400">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-float" style={{ animationDelay: '1.5s' }}>
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-bold mb-2">{t.home.cvBuilder}</h4>
            <p className="text-sm text-muted-foreground">{t.home.cvBuilderDesc}</p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center section-spacing">
        <Card className="p-12 bg-gradient-to-l from-primary to-secondary text-primary-foreground shadow-brand-lg animate-scale-in border-glow hover-lift">
          <h3 className="text-3xl font-bold mb-4 animate-fade-in">{t.home.startJourney}</h3>
          <p className="text-lg mb-8 opacity-90 animate-fade-in animate-delay-100">{t.home.joinPlatform}</p>
          <Link href="/register" className="animate-fade-in animate-delay-200">
            <Button size="lg" variant="secondary" className="text-lg btn-enhanced hover-lift shadow-lime">
              {t.home.createFreeAccount}
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20 py-8 glass animate-fade-in">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>{t.home.allRightsReserved}</p>
        </div>
      </footer>
    </div>
  )
}
