"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Shield, Users, Briefcase, FileText, LogOut, Menu, Home } from "lucide-react"
import { useApp } from "@/lib/context/app-context"
import { useTranslation } from "@/lib/i18n/use-translation"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { PlatformLogo } from "@/components/platform-logo"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { currentUser, logout } = useApp()
  const t = useTranslation()
  const { language } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
    setMobileMenuOpen(false)
  }

  const navItems = [
    { href: "/admin/dashboard", label: t.nav.dashboard, icon: Shield },
    { href: "/admin/users", label: t.nav.users, icon: Users },
    { href: "/admin/companies", label: t.nav.companies, icon: Briefcase },
    { href: "/admin/jobs", label: t.nav.jobs, icon: FileText },
  ]

  return (
    <header className="border-b glass sticky top-0 z-50 shadow-brand backdrop-blur-md animate-fade-in">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <PlatformLogo showTitle={false} size="xl" />
            <div className="hidden md:block">
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2 animate-slide-in-right">
            {navItems.map((item, index) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in">
                  <Button variant={isActive ? "default" : "ghost"} size="sm" className="gap-2 btn-enhanced hover-lift">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 btn-enhanced hover-lift">
                <Home className="h-4 w-4" />
                {language === "ar" ? "الرئيسية" : "Home"}
              </Button>
            </Link>
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 btn-enhanced hover-lift">
              <LogOut className="h-4 w-4" />
              {t.common.logout}
            </Button>
          </nav>
          
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="pb-4 border-b">
                <SheetTitle className="flex items-center gap-2">
                  <PlatformLogo showTitle={false} size="md" />
                  {t.nav.adminDashboard}
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                <div className="px-3 py-2 border-b">
                  <p className="text-sm font-medium">{currentUser?.fullName}</p>
                  <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
                </div>
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                          isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    )
                  })}
                </nav>
                <div className="mt-4 pt-4 border-t flex flex-col gap-2">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="gap-2 justify-start w-full">
                      <Home className="h-4 w-4" />
                      {language === "ar" ? "الرئيسية" : "Home"}
                    </Button>
                  </Link>
                  <div className="px-3">
                    <LanguageSwitcher />
                  </div>
                  <Button variant="outline" onClick={handleLogout} className="gap-2 justify-start">
                    <LogOut className="h-4 w-4" />
                    {t.common.logout}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
