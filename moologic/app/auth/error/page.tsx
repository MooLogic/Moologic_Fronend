"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      switch (errorParam) {
        case "Configuration":
          setError("There is a problem with the server configuration.")
          break
        case "AccessDenied":
          setError("You do not have access to sign in.")
          break
        case "Verification":
          setError("The verification link may have been used or is invalid.")
          break
        default:
          setError("An unexpected error occurred.")
          break
      }
    } else {
      setError("An unexpected error occurred.")
    }
  }, [searchParams])

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <CardTitle className="text-2xl font-bold">Authentication Error</CardTitle>
          </div>
          <CardDescription>There was a problem signing you in</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">Please try again or contact support if the problem persists.</p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/auth/login">Return to Login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

