"use client"

import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut, MoreVertical, Settings, User } from "lucide-react"
import { useTranslation } from "@/components/providers/language-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface UserProfileProps {
  collapsed?: boolean
}

export function UserProfile({ collapsed = false }: UserProfileProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  if (!user) return null

  return (
    <div className={cn("border-t p-4 flex items-center", collapsed ? "flex-col" : "justify-between")}>
      {collapsed ? (
        <Avatar className="h-10 w-10 mb-2">
          <AvatarImage src={user.avatar || undefined} alt={user.name} />
          <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar || undefined} alt={user.name} />
              <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>{t("Profile")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t("Settings")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("Logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
      {collapsed && (
        <Button variant="ghost" size="icon" onClick={handleLogout} title={t("Logout")}>
          <LogOut className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

