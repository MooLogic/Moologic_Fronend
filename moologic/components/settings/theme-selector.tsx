"use client"

import { useTheme } from "@/components/providers/theme-provider"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        className={theme === "light" ? "border-primary" : ""}
        onClick={() => setTheme("light")}
      >
        <Sun className="h-5 w-5" />
        <span className="sr-only">Light mode</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={theme === "dark" ? "border-primary" : ""}
        onClick={() => setTheme("dark")}
      >
        <Moon className="h-5 w-5" />
        <span className="sr-only">Dark mode</span>
      </Button>
    </div>
  )
}

