"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function UnauthorizedPage() {
  const { logout } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
          </div>
          <CardTitle className="text-xl text-center">Access Denied</CardTitle>
          <CardDescription className="text-center">You don't have permission to access this page.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 dark:text-gray-400">
            Please contact your administrator if you believe this is an error.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button variant="outline" className="w-full" onClick={logout}>
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

