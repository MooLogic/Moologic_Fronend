"use client"

import { useState } from "react"
import { Bell, Check, Filter, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useTranslation } from "@/components/providers/language-provider"

// Sample notifications data
const notifications = [
  {
    id: 1,
    title: "Cow #876364 is due for vaccination",
    description: "Scheduled vaccination for FMD is due today",
    date: "2024-03-15 09:30",
    type: "health",
    priority: "high",
    read: false,
  },
  {
    id: 2,
    title: "Milk production below target",
    description: "Average milk production is 5% below the target for the last 3 days",
    date: "2024-03-15 08:15",
    type: "production",
    priority: "medium",
    read: false,
  },
  {
    id: 3,
    title: "Cow #876368 showing signs of heat",
    description: "Observed signs of heat, ready for insemination",
    date: "2024-03-14 16:45",
    type: "reproduction",
    priority: "high",
    read: false,
  },
  {
    id: 4,
    title: "Feed inventory low",
    description: "Concentrate feed inventory is below 20%. Please reorder.",
    date: "2024-03-14 11:20",
    type: "inventory",
    priority: "medium",
    read: true,
  },
  {
    id: 5,
    title: "Cow #876372 calving soon",
    description: "Expected to calve within the next 24-48 hours",
    date: "2024-03-13 14:30",
    type: "reproduction",
    priority: "high",
    read: true,
  },
  {
    id: 6,
    title: "Maintenance due for milking machine",
    description: "Scheduled maintenance for milking machine #2 is due tomorrow",
    date: "2024-03-13 10:15",
    type: "maintenance",
    priority: "low",
    read: true,
  },
  {
    id: 7,
    title: "Cow #876375 showing signs of mastitis",
    description: "Early signs of mastitis detected. Requires veterinary attention.",
    date: "2024-03-12 17:40",
    type: "health",
    priority: "high",
    read: true,
  },
  {
    id: 8,
    title: "Monthly financial report available",
    description: "The financial report for February 2024 is now available for review",
    date: "2024-03-12 09:00",
    type: "financial",
    priority: "medium",
    read: true,
  },
]

// Notification settings
const notificationSettings = [
  {
    category: "Health",
    types: [
      { name: "Disease Detection", enabled: true },
      { name: "Vaccination Reminders", enabled: true },
      { name: "Treatment Follow-ups", enabled: true },
    ],
  },
  {
    category: "Reproduction",
    types: [
      { name: "Heat Detection", enabled: true },
      { name: "Pregnancy Checks", enabled: true },
      { name: "Calving Alerts", enabled: true },
    ],
  },
  {
    category: "Production",
    types: [
      { name: "Milk Production Alerts", enabled: true },
      { name: "Quality Issues", enabled: false },
      { name: "Performance Reports", enabled: true },
    ],
  },
  {
    category: "Inventory",
    types: [
      { name: "Feed Stock Alerts", enabled: true },
      { name: "Medicine Stock Alerts", enabled: true },
      { name: "Equipment Alerts", enabled: false },
    ],
  },
  {
    category: "Financial",
    types: [
      { name: "Payment Reminders", enabled: true },
      { name: "Budget Alerts", enabled: false },
      { name: "Report Availability", enabled: true },
    ],
  },
]

export function NotificationsDashboard() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [settings, setSettings] = useState(notificationSettings)
  const [notificationsList, setNotificationsList] = useState(notifications)

  // Filter notifications based on active tab and search query
  const filteredNotifications = notificationsList.filter((notification) => {
    const matchesTab =
      activeTab === "all" || (activeTab === "unread" && !notification.read) || activeTab === notification.type

    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTab && matchesSearch
  })

  // Mark notification as read
  const markAsRead = (id) => {
    setNotificationsList((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotificationsList((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  // Delete notification
  const deleteNotification = (id) => {
    setNotificationsList((prev) => prev.filter((notification) => notification.id !== id))
  }

  // Toggle notification setting
  const toggleNotificationSetting = (category, typeName) => {
    setSettings((prev) =>
      prev.map((cat) =>
        cat.category === category
          ? {
              ...cat,
              types: cat.types.map((type) => (type.name === typeName ? { ...type, enabled: !type.enabled } : type)),
            }
          : cat,
      ),
    )
  }

  // Count unread notifications
  const unreadCount = notificationsList.filter((n) => !n.read).length

  return (
    <main className="flex-1">
      <header className="h-16 px-8 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-gray-800">{t("Notifications")}</h1>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="rounded-full px-2">
              {unreadCount}
            </Badge>
          )}
        </div>
      </header>

      <div className="p-8">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <TabsList className="grid grid-cols-6 w-[600px]">
              <TabsTrigger value="all">{t("All")}</TabsTrigger>
              <TabsTrigger value="unread">{t("Unread")}</TabsTrigger>
              <TabsTrigger value="health">{t("Health")}</TabsTrigger>
              <TabsTrigger value="reproduction">{t("Reproduction")}</TabsTrigger>
              <TabsTrigger value="production">{t("Production")}</TabsTrigger>
              <TabsTrigger value="inventory">{t("Inventory")}</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t("Search notifications...")}
                  className="pl-10 pr-4 h-10 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={markAllAsRead}>
                {t("Mark All as Read")}
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="space-y-4">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Bell className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500">{t("No notifications found")}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="unread" className="mt-0">
            <div className="space-y-4">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Check className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500">{t("No unread notifications")}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {["health", "reproduction", "production", "inventory", "financial"].map((type) => (
            <TabsContent key={type} value={type} className="mt-0">
              <div className="space-y-4">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                    />
                  ))
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <Bell className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-gray-500">{t(`No ${type} notifications found`)}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>{t("Notification Settings")}</CardTitle>
              <CardDescription>{t("Manage which notifications you receive")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {settings.map((category) => (
                  <div key={category.category} className="space-y-3">
                    <h3 className="text-lg font-medium">{t(category.category)}</h3>
                    <div className="space-y-2">
                      {category.types.map((type) => (
                        <div key={type.name} className="flex items-center justify-between">
                          <Label htmlFor={`${category.category}-${type.name}`} className="flex-1">
                            {t(type.name)}
                          </Label>
                          <Switch
                            id={`${category.category}-${type.name}`}
                            checked={type.enabled}
                            onCheckedChange={() => toggleNotificationSetting(category.category, type.name)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">{t("Reset to Defaults")}</Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700">{t("Save Settings")}</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}

function NotificationCard({ notification, onMarkAsRead, onDelete }) {
  const { t } = useTranslation()

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get type color
  const getTypeColor = (type) => {
    switch (type) {
      case "health":
        return "bg-red-100 text-red-800"
      case "reproduction":
        return "bg-purple-100 text-purple-800"
      case "production":
        return "bg-blue-100 text-blue-800"
      case "inventory":
        return "bg-green-100 text-green-800"
      case "financial":
        return "bg-yellow-100 text-yellow-800"
      case "maintenance":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className={`${!notification.read ? "border-l-4 border-l-indigo-500" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{notification.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getTypeColor(notification.type)}>
              {t(notification.type.charAt(0).toUpperCase() + notification.type.slice(1))}
            </Badge>
            <Badge className={getPriorityColor(notification.priority)}>
              {t(notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1))}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-xs">{formatDate(notification.date)}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{notification.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="flex gap-2">
          {!notification.read && (
            <Button variant="outline" size="sm" onClick={() => onMarkAsRead(notification.id)}>
              <Check className="h-4 w-4 mr-1" />
              {t("Mark as Read")}
            </Button>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={() => onDelete(notification.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

