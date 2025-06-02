"use client"

import { useState } from "react"
import { Bell, Check, Filter, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/components/providers/language-provider"
import { useSession } from "next-auth/react"
import { 
  useGetAlertsQuery, 
  useUpdateAlertMutation, 
  useDeleteAlertMutation,
  useMarkAllAlertsAsReadMutation,
  Alert 
} from "@/lib/service/alertService"
import { toast } from "sonner"

export function NotificationsDashboard() {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const token = session?.user?.accessToken

  // RTK Query hooks
  const { data: alerts = [], isLoading: isLoadingAlerts } = useGetAlertsQuery(
    { token: token || "" },
    { skip: !token }
  )
  const [updateAlert] = useUpdateAlertMutation()
  const [deleteAlert] = useDeleteAlertMutation()
  const [markAllAsRead] = useMarkAllAlertsAsReadMutation()

  // Filter notifications based on active tab and search query
  const filteredNotifications = (alerts || []).filter((alert) => {
    const matchesTab = activeTab === "all" || activeTab === "unread" && !alert.read || alert.type === activeTab
    const matchesSearch = searchQuery === "" || 
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  // Count unread notifications
  const unreadCount = (alerts || []).filter(alert => !alert.read).length

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead({ token: token || "" }).unwrap()
      toast.success(t("All notifications marked as read"))
    } catch (error) {
      toast.error(t("Failed to mark notifications as read"))
    }
  }

  if (isLoadingAlerts) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <main className="flex-1">
      <header className="h-16 px-8 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-gray-800">{t("Notifications")}</h1>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            <Check className="h-4 w-4 mr-2" />
            {t("Mark all as read")}
          </Button>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="rounded-full px-2">
              {unreadCount}
            </Badge>
          )}
          </div>
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
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            <div className="space-y-4">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((alert) => (
                  <NotificationCard
                    key={alert.id}
                    notification={alert}
                    token={token || ""}
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
        </Tabs>
      </div>
    </main>
  )
}

interface NotificationCardProps {
  notification: Alert;
  token: string;
}

function NotificationCard({ notification, token }: NotificationCardProps) {
  const { t } = useTranslation()
  const [updateAlert] = useUpdateAlertMutation()
  const [deleteAlert] = useDeleteAlertMutation()

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
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
  const getTypeColor = (type: string) => {
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

  // Handle mark as read
  const handleMarkAsRead = async () => {
    try {
      await updateAlert({ 
        id: notification.id, 
        data: { read: true },
        token 
      }).unwrap()
      toast.success(t("Notification marked as read"))
    } catch (error) {
      toast.error(t("Failed to mark notification as read"))
    }
  }

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteAlert({ id: notification.id, token }).unwrap()
      toast.success(t("Notification deleted"))
    } catch (error) {
      toast.error(t("Failed to delete notification"))
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
      <CardFooter className="pt-4 flex justify-end gap-2">
          {!notification.read && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleMarkAsRead}
          >
            <Check className="h-4 w-4 mr-2" />
            {t("Mark as read")}
            </Button>
          )}
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          {t("Delete")}
        </Button>
      </CardFooter>
    </Card>
  )
}

