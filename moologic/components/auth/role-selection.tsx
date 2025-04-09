"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Building2, Users, GraduationCap } from "lucide-react"

import { useSession } from "next-auth/react"

export function RoleSelection() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, update } = useSession()

  const handleRoleSelection = async (role: string) => {
    setIsLoading(true)
    const token = session?.user.accessToken // Access token fetched from the extended session type
    const user_id = session?.user.id
    console.log(  token)
    if (!token) {
      toast({
        title: "Error",
        description: "You need to be logged in to select a role.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }
  
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/update-role/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token here
        },
        body: JSON.stringify({ role, user_id }), 
      })
      console.log(response) 
      if (!response.ok) {
        throw new Error("Failed to update role")
      }
  
      // Further processing...
      router.push("/dashboard")
    } catch (error) {
      console.error("Role selection error:", error)
      toast({
        title: "Role selection failed",
        description: "An error occurred while setting your role",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Select Your Role</CardTitle>
          <CardDescription>Choose how you'll use the dairy farm management system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <Button
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-6 space-y-2"
              onClick={() => handleRoleSelection("owner")}
              disabled={isLoading}
            >
              <Building2 className="h-8 w-8" />
              <div className="text-center">
                <h3 className="font-medium">Farm Owner</h3>
                <p className="text-sm text-muted-foreground">Create and manage your own farm</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-6 space-y-2"
              onClick={() => handleRoleSelection("worker")}
              disabled={isLoading}
            >
              <Users className="h-8 w-8" />
              <div className="text-center">
                <h3 className="font-medium">Farm Worker</h3>
                <p className="text-sm text-muted-foreground">Join an existing farm as a worker</p>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-6 space-y-2"
              onClick={() => handleRoleSelection("government")}
              disabled={isLoading}
            >
              <GraduationCap className="h-8 w-8" />
              <div className="text-center">
                <h3 className="font-medium">Government Official</h3>
                <p className="text-sm text-muted-foreground">Access regional data and insights</p>
              </div>
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          {isLoading && (
            <div className="w-full flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

