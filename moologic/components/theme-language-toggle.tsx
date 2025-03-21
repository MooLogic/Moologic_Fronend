"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/providers/theme-provider"
import { useTranslation } from "@/components/providers/language-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ThemeLanguageToggleProps {
  collapsed?: boolean
}

export function ThemeLanguageToggle({ collapsed = false }: ThemeLanguageToggleProps) {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage } = useTranslation()
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className={cn("border-t pt-4 pb-2", collapsed ? "flex flex-col items-center" : "grid grid-cols-2 gap-2 px-4")}>
      <Button
        variant="outline"
        size={collapsed ? "icon" : "default"}
        className={collapsed ? "mb-2" : ""}
        onClick={() => {
          setTheme(theme === "light" ? "dark" : "light")
        }}
        title={collapsed ? t("Toggle Theme") : undefined}
      >
        {!collapsed && <span className="mr-2">{t("Theme")}</span>}
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
      <Button
        variant="outline"
        size={collapsed ? "icon" : "default"}
        onClick={() => {
          setLanguage(language === "en" ? "am" : "en")
        }}
        title={collapsed ? t("Toggle Language") : undefined}
      >
        {!collapsed && <span className="mr-2">{t("Language")}</span>}
        <span>{language === "en" ? "🇺🇸" : "🇪🇹"}</span>
      </Button>
    </div>
  )
}

