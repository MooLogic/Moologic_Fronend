"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getToken } from "next-auth/jwt"

const formSchema = z.object({
  farm_code: z.string().min(1, { message: "Farm code must be at least 6 characters" }),
  workerRole: z.string().min(1, { message: "Please select your role" }),
 
})

export function JoinFarmForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      farm_code: "",
      workerRole: "",
     
    },
  })
  console.log("session " + session?.user.id)
  const token = session?.user.accessToken || ""
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Join farm API call
      console.log("token" + token)
      const response = await fetch("http://127.0.0.1:8000/auth/join-farm/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({
          ...values,
          user_id: session?.user?.id,
        }),
      })
      console.log("response" + response.body)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to join farm")
      }


      localStorage.setItem("farm_name", values.farm_code)
      toast({
        title: "Successfully joined farm",
        description: "You can now access the farm's data",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Join farm error:", error)
      toast({
        title: "Failed to join farm",
        description: error?.message || "An error occurred while joining the farm",
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
          <CardTitle className="text-2xl font-bold">Join a Farm</CardTitle>
          <CardDescription>Enter the farm code provided by the farm owner</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="farm_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Farm Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter farm code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workerRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="generalpurpose">General Purpose</SelectItem>
                        <SelectItem value="manager">Farm Manager</SelectItem>
                        <SelectItem value="vaterinary">Veterinarian</SelectItem>
                        <SelectItem value="milktracker">Milk Troduction Tracker</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining farm...
                  </>
                ) : (
                  "Join Farm"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            Don't have a farm code? Contact the farm owner to get one.
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

