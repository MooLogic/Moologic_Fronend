"use client"

import { useTheme } from "@/components/providers/theme-provider"
import { motion } from "framer-motion"
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
          <motion.div
            className={`absolute inset-0 rounded-full border-4 ${theme === "dark" ? "border-gray-800" : "border-indigo-100"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className={`absolute inset-0 rounded-full border-4 ${theme === "dark" ? "border-t-indigo-400" : "border-t-indigo-600"} border-r-transparent border-b-transparent border-l-transparent`}
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
        </div>
        <motion.div
          className={`mt-4 text-xl font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-800"}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t("Loading...")}
        </motion.div>
      </div>
    </div>
  )
}

