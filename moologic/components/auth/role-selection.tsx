"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Building2, Users, GraduationCap } from "lucide-react"
import { useSession } from "next-auth/react"

export function RoleSelection() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()

  const handleRoleSelection = async (role: string) => {
    setIsLoading(true);
  
    const token = session?.user?.accessToken;
    const user_id = session?.user?.id;
  
    if (!token || !user_id) {
      toast({
        title: "Error",
        description: "You need to be logged in to select a role.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/update-role/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role, user_id }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update role");
      }
  
      // Save the new role to localStorage
      localStorage.setItem("userRole", role);
  
      toast({
        title: "Role updated",
        description: "Your role has been set successfully.",
      });
      if (role === "owner")  {
        router.push("/auth/create-farm");       
      }else if (role === "worker") {
        router.push("/auth/join-farm");
      }else if (role === "government") {
        router.push("/government/dashboard");
      }else{
        router.push("/auth/role-selection");
      }
      
    } catch (error) {
      console.error("Role selection error:", error);
      toast({
        title: "Role selection failed",
        description: "An error occurred while setting your role",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Select Your Role</CardTitle>
          <CardDescription>Choose how you'll use the dairy farm management system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <RoleButton label="Farm Owner" icon={Building2} onClick={() => handleRoleSelection("owner")} disabled={isLoading} />
            <RoleButton label="Farm Worker" icon={Users} onClick={() => handleRoleSelection("worker")} disabled={isLoading} />
            <RoleButton label="Government Official" icon={GraduationCap} onClick={() => handleRoleSelection("government")} disabled={isLoading} />
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

// Reusable role button
function RoleButton({ label, icon: Icon, onClick, disabled }: any) {
  return (
    <Button
      variant="outline"
      className="h-auto flex flex-col items-center justify-center p-6 space-y-2"
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className="h-8 w-8" />
      <div className="text-center">
        <h3 className="font-medium">{label}</h3>
        <p className="text-sm text-muted-foreground">{
          label === "Farm Owner"
            ? "Create and manage your own farm"
            : label === "Farm Worker"
              ? "Join an existing farm as a worker"
              : "Access regional data and insights"
        }</p>
      </div>
    </Button>
  )
}
