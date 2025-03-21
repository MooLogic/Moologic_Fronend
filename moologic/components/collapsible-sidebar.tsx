"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserProfile } from "@/components/user-profile"
import { ThemeLanguageToggle } from "@/components/theme-language-toggle"
import { useAuth } from "@/contexts/auth-context"
import { useTranslation } from "@/components/providers/language-provider"
import {
  BarChart3,
  Calendar,
  CreditCard,
  Home,
  Menu,
  Milk,
  Settings,
  MilkIcon as Cow,
  Baby,
  Activity,
  Bell,
  Droplets,
  Syringe,
  Microscope,
  Building,
  Users,
  AlertTriangle,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CollapsibleSidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  // Load collapsed state from localStorage on component mount
  useEffect(() => {
    const savedCollapsed = localStorage.getItem("sidebar-collapsed")
    if (savedCollapsed !== null) {
      setCollapsed(savedCollapsed === "true")
    }
  }, [])

  // Save collapsed state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed.toString())
  }, [collapsed])

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  const routes = [
    {
      label: t("Dashboard"),
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: t("Milk Yield"),
      icon: Milk,
      href: "/milk-yield",
      active: pathname === "/milk-yield",
    },
    {
      label: t("Gestation"),
      icon: Baby,
      href: "/gestation",
      active: pathname === "/gestation",
    },
    {
      label: t("Livestock"),
      icon: Cow,
      href: "/livestock",
      active: pathname === "/livestock" || pathname.startsWith("/livestock/"),
    },
    {
      label: t("Calving Records"),
      icon: Calendar,
      href: "/calving-records",
      active: pathname === "/calving-records",
    },
    {
      label: t("Milk Records"),
      icon: Droplets,
      href: "/milk-records",
      active: pathname === "/milk-records",
    },
    {
      label: t("Insemination Records"),
      icon: Syringe,
      href: "/insemination-records",
      active: pathname === "/insemination-records",
    },
    {
      label: t("Health Records"),
      icon: Activity,
      href: "/health-records",
      active: pathname === "/health-records",
    },
    {
      label: t("Disease Prediction"),
      icon: Microscope,
      href: "/disease",
      active: pathname === "/disease",
    },
    {
      label: t("Finance"),
      icon: CreditCard,
      href: "/finance",
      active: pathname === "/finance",
    },
    {
      label: t("Statistics"),
      icon: BarChart3,
      href: "/statistics",
      active: pathname === "/statistics",
    },
    {
      label: t("Notifications"),
      icon: Bell,
      href: "/notifications",
      active: pathname === "/notifications",
    },
    {
      label: t("Settings"),
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
  ]

  // Government-specific routes
  const governmentRoutes = [
    {
      label: t("Government Dashboard"),
      icon: Building,
      href: "/government/dashboard",
      active: pathname === "/government/dashboard",
    },
    {
      label: t("Farms Management"),
      icon: Users,
      href: "/government/farms",
      active: pathname === "/government/farms",
    },
    {
      label: t("Health Alerts"),
      icon: AlertTriangle,
      href: "/government/alerts",
      active: pathname === "/government/alerts",
    },
    {
      label: t("Production Trends"),
      icon: TrendingUp,
      href: "/government/trends",
      active: pathname === "/government/trends",
    },
  ]

  // Determine which routes to show based on user role
  const displayRoutes = user?.role === "government" ? governmentRoutes : routes

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed left-4 top-4 z-40">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 relative">
                <Image src="/logo.svg" alt="MooLogic Logo" width={40} height={40} className="text-primary" priority />
              </div>
              <div>
                <h2 className="text-xl font-bold">MooLogic</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t("Dairy Farm Management")}</p>
              </div>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4">
              <nav className="flex flex-col gap-2">
                {displayRoutes.map((route) => (
                  <Link key={route.href} href={route.href} onClick={() => setOpen(false)}>
                    <Button
                      variant={route.active ? "default" : "ghost"}
                      className={cn("w-full justify-start", {
                        "bg-primary text-primary-foreground": route.active,
                      })}
                    >
                      <route.icon className="mr-2 h-5 w-5" />
                      {route.label}
                    </Button>
                  </Link>
                ))}
              </nav>
            </div>
          </ScrollArea>
          <ThemeLanguageToggle />
          <UserProfile />
        </SheetContent>
      </Sheet>
      <div
        className={cn(
          "hidden md:flex flex-col h-screen border-r transition-all duration-300",
          collapsed ? "w-[70px]" : "w-[240px]",
          className,
        )}
      >
        <div className={cn("p-4 border-b flex items-center", collapsed ? "justify-center" : "justify-between")}>
          <div className={cn("flex items-center gap-2", collapsed ? "justify-center" : "")}>
            <div className="w-10 h-10 relative flex-shrink-0">
              <Image src="/logo.svg" alt="MooLogic Logo" width={40} height={40} className="text-primary" priority />
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-xl font-bold">MooLogic</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t("Dairy Farm Management")}</p>
              </div>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={toggleCollapsed} className={collapsed ? "hidden" : ""}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        {collapsed && (
          <Button variant="ghost" size="icon" onClick={toggleCollapsed} className="self-end mr-2 mt-2">
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
        <ScrollArea className="flex-1">
          <div className="p-2">
            <nav className="flex flex-col gap-2">
              {displayRoutes.map((route) => (
                <Link key={route.href} href={route.href}>
                  <Button
                    variant={route.active ? "default" : "ghost"}
                    size={collapsed ? "icon" : "default"}
                    className={cn(collapsed ? "w-10 h-10 p-0" : "w-full justify-start", {
                      "bg-primary text-primary-foreground": route.active,
                    })}
                    title={collapsed ? route.label : undefined}
                  >
                    <route.icon className={cn("h-5 w-5", collapsed ? "" : "mr-2")} />
                    {!collapsed && route.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        </ScrollArea>
        <div className={cn("p-2", collapsed ? "items-center" : "")}>
          <ThemeLanguageToggle collapsed={collapsed} />
          <UserProfile collapsed={collapsed} />
        </div>
      </div>
    </>
  )
}

