"use client"

import { useTheme } from "@/components/providers/theme-provider"
// framer-motion removed — replaced with CSS-based spinner and fade-in
import { useTranslation } from "@/components/providers/language-provider"

export function LoadingScreen() {
  const { theme } = useTheme()
  const { t } = useTranslation()

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <div className={`absolute inset-0 rounded-full border-4 ${theme === "dark" ? "border-gray-800" : "border-indigo-100"}`} />
          <div
            className={`absolute inset-0 rounded-full border-4 ${theme === "dark" ? "border-t-indigo-400" : "border-t-indigo-600"} border-r-transparent border-b-transparent border-l-transparent animate-spin`}
          />
        </div>
        <div className={`mt-4 text-xl font-medium fade-in ${theme === "dark" ? "text-gray-300" : "text-gray-800"}`}>{t("Loading...")}</div>
      </div>
    </div>
  )
}

