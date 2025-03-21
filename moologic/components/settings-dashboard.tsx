"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/components/providers/theme-provider"
import { useLanguage, useTranslation } from "@/components/providers/language-provider"
import { Moon, Sun, Monitor } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

export function SettingsDashboard() {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage } = useLanguage()
  const { toast } = useToast()

  const [dashboardSettings, setDashboardSettings] = useState({
    showMilkProduction: true,
    showReproduction: true,
    showHealth: true,
    showFinancial: true,
    defaultDashboard: "overview",
    refreshInterval: "5",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    dailyDigest: true,
    alertsOnly: false,
  })

  const [appearanceSettings, setAppearanceSettings] = useState({
    sidebarCollapsed: false,
    denseMode: false,
    largeText: false,
    highContrast: false,
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleDashboardSettingChange = (key, value) => {
    setDashboardSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleNotificationSettingChange = (key, value) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleAppearanceSettingChange = (key, value) => {
    setAppearanceSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSaveSettings = (settingType) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: t("Settings Saved"),
        description: t("Your settings have been successfully updated."),
      })
    }, 1000)
  }

  // Ensure theme and language are properly set on mount
  useEffect(() => {
    // This ensures the UI reflects the current theme/language state
    const root = window.document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

  return (
    <main className="flex-1">
      <header className="h-16 px-8 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{t("Settings")}</h1>
        <div className="text-lg font-medium text-gray-800 dark:text-gray-100">Anan Dairy Farm</div>
      </header>

      <div className="p-8">
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="appearance">{t("Appearance")}</TabsTrigger>
            <TabsTrigger value="dashboard">{t("Dashboard")}</TabsTrigger>
            <TabsTrigger value="notifications">{t("Notifications")}</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>{t("Theme")}</CardTitle>
                    <CardDescription>{t("Manage your theme preferences")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>{t("Color Theme")}</Label>
                      <div className="flex items-center gap-4">
                        <Button
                          variant={theme === "light" ? "default" : "outline"}
                          className={`flex items-center gap-2 ${theme === "light" ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
                          onClick={() => setTheme("light")}
                        >
                          <Sun className="h-4 w-4" />
                          {t("Light")}
                        </Button>
                        <Button
                          variant={theme === "dark" ? "default" : "outline"}
                          className={`flex items-center gap-2 ${theme === "dark" ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
                          onClick={() => setTheme("dark")}
                        >
                          <Moon className="h-4 w-4" />
                          {t("Dark")}
                        </Button>
                        <Button
                          variant={theme === "system" ? "default" : "outline"}
                          className={`flex items-center gap-2 ${theme === "system" ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
                          onClick={() => setTheme("system")}
                        >
                          <Monitor className="h-4 w-4" />
                          {t("System")}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>{t("Language")}</Label>
                      <Select value={language} onValueChange={(value) => setLanguage(value as "en" | "am" | "om")}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("Select language")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="am">አማርኛ (Amharic)</SelectItem>
                          <SelectItem value="om">Afaan Oromoo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>{t("Layout Preferences")}</CardTitle>
                    <CardDescription>{t("Customize your interface layout")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sidebar-collapsed">{t("Collapsed Sidebar")}</Label>
                      <Switch
                        id="sidebar-collapsed"
                        checked={appearanceSettings.sidebarCollapsed}
                        onCheckedChange={(checked) => handleAppearanceSettingChange("sidebarCollapsed", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="dense-mode">{t("Dense Mode")}</Label>
                      <Switch
                        id="dense-mode"
                        checked={appearanceSettings.denseMode}
                        onCheckedChange={(checked) => handleAppearanceSettingChange("denseMode", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="large-text">{t("Large Text")}</Label>
                      <Switch
                        id="large-text"
                        checked={appearanceSettings.largeText}
                        onCheckedChange={(checked) => handleAppearanceSettingChange("largeText", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="high-contrast">{t("High Contrast")}</Label>
                      <Switch
                        id="high-contrast"
                        checked={appearanceSettings.highContrast}
                        onCheckedChange={(checked) => handleAppearanceSettingChange("highContrast", checked)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={() => handleSaveSettings("appearance")}
                      disabled={isLoading}
                    >
                      {isLoading ? t("Saving...") : t("Save Layout Preferences")}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="dashboard">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("Dashboard Settings")}</CardTitle>
                  <CardDescription>{t("Customize your dashboard view")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{t("Visible Widgets")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-milk-production">{t("Milk Production")}</Label>
                        <Switch
                          id="show-milk-production"
                          checked={dashboardSettings.showMilkProduction}
                          onCheckedChange={(checked) => handleDashboardSettingChange("showMilkProduction", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-reproduction">{t("Reproduction")}</Label>
                        <Switch
                          id="show-reproduction"
                          checked={dashboardSettings.showReproduction}
                          onCheckedChange={(checked) => handleDashboardSettingChange("showReproduction", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-health">{t("Health")}</Label>
                        <Switch
                          id="show-health"
                          checked={dashboardSettings.showHealth}
                          onCheckedChange={(checked) => handleDashboardSettingChange("showHealth", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-financial">{t("Financial")}</Label>
                        <Switch
                          id="show-financial"
                          checked={dashboardSettings.showFinancial}
                          onCheckedChange={(checked) => handleDashboardSettingChange("showFinancial", checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{t("Default View")}</h3>
                    <RadioGroup
                      value={dashboardSettings.defaultDashboard}
                      onValueChange={(value) => handleDashboardSettingChange("defaultDashboard", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="overview" id="overview" />
                        <Label htmlFor="overview">{t("Overview")}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="milk-production" id="milk-production" />
                        <Label htmlFor="milk-production">{t("Milk Production")}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="livestock" id="livestock" />
                        <Label htmlFor="livestock">{t("Livestock")}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="finance" id="finance" />
                        <Label htmlFor="finance">{t("Finance")}</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="refresh-interval">{t("Data Refresh Interval (minutes)")}</Label>
                    <Select
                      value={dashboardSettings.refreshInterval}
                      onValueChange={(value) => handleDashboardSettingChange("refreshInterval", value)}
                    >
                      <SelectTrigger id="refresh-interval">
                        <SelectValue placeholder={t("Select interval")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                        <SelectItem value="60">60</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => handleSaveSettings("dashboard")}
                    disabled={isLoading}
                  >
                    {isLoading ? t("Saving...") : t("Save Dashboard Settings")}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("Notification Settings")}</CardTitle>
                  <CardDescription>{t("Manage how you receive notifications")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{t("Notification Methods")}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-notifications">{t("Email Notifications")}</Label>
                        <Switch
                          id="email-notifications"
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={(checked) => handleNotificationSettingChange("emailNotifications", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="push-notifications">{t("Push Notifications")}</Label>
                        <Switch
                          id="push-notifications"
                          checked={notificationSettings.pushNotifications}
                          onCheckedChange={(checked) => handleNotificationSettingChange("pushNotifications", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="sms-notifications">{t("SMS Notifications")}</Label>
                        <Switch
                          id="sms-notifications"
                          checked={notificationSettings.smsNotifications}
                          onCheckedChange={(checked) => handleNotificationSettingChange("smsNotifications", checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{t("Notification Preferences")}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="daily-digest">{t("Daily Digest")}</Label>
                        <Switch
                          id="daily-digest"
                          checked={notificationSettings.dailyDigest}
                          onCheckedChange={(checked) => handleNotificationSettingChange("dailyDigest", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="alerts-only">{t("High Priority Alerts Only")}</Label>
                        <Switch
                          id="alerts-only"
                          checked={notificationSettings.alertsOnly}
                          onCheckedChange={(checked) => handleNotificationSettingChange("alertsOnly", checked)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => handleSaveSettings("notifications")}
                    disabled={isLoading}
                  >
                    {isLoading ? t("Saving...") : t("Save Notification Settings")}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

