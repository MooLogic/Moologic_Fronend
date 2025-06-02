'use client'

import { NotificationsDashboard } from "@/components/notifications-dashboard"
import { DecorativeBackground } from "@/components/decorative-background"

export default function NotificationsPage() {
  return (
    <div className="relative">
      <DecorativeBackground />
      <NotificationsDashboard />
    </div>
  )
}

