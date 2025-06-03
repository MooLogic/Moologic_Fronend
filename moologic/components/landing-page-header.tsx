"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeLanguageToggle } from "@/components/theme-language-toggle"
import { useTranslation } from "@/components/providers/language-provider"

export function LandingPageHeader() {
  const { t } = useTranslation()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">Loonkoo</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex">
            <ThemeLanguageToggle />
          </div>
          <Link href="/auth/login">
            <Button variant="default">{t("Login")}</Button>
          </Link>
          <Link href="/auth/register" className="hidden md:block">
            <Button variant="outline">{t("Register")}</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

