import { SettingsDashboard } from "@/components/settings-dashboard"
import { DecorativeBackground } from "@/components/decorative-background"

export default function SettingsPage() {
  return (
    <div className="relative p-6">
      <DecorativeBackground />
      <SettingsDashboard />
    </div>
  )
}

