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

const formSchema = z.object({
  department: z.string().min(3, { message: "Department name must be at least 3 characters" }),
  region: z.string().min(3, { message: "Region must be at least 3 characters" }),
  access_key: z.string().min(6, { message: "Access key must be at least 6 characters" }),
})

export function GovernmentAccessForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      department: "",
      region: "",
      access_key: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Government access API call
      const response = await fetch("http://127.0.0.1:8000/government-access/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to verify government access")
      }

      toast({
        title: "Access verified",
        description: "You now have access to regional dairy farm data",
      })

      // Redirect to government dashboard
      router.push("/government/dashboard")
    } catch (error: any) {
      console.error("Government access error:", error)
      toast({
        title: "Verification failed",
        description: error?.message || "An error occurred during verification",
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
          <CardTitle className="text-2xl font-bold">Government Access</CardTitle>
          <CardDescription>Enter your department details and access key</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="Ministry of Agriculture" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your region" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="nairobi">Nairobi</SelectItem>
                        <SelectItem value="central">Central</SelectItem>
                        <SelectItem value="eastern">Eastern</SelectItem>
                        <SelectItem value="western">Western</SelectItem>
                        <SelectItem value="coast">Coast</SelectItem>
                        <SelectItem value="rift_valley">Rift Valley</SelectItem>
                        <SelectItem value="nyanza">Nyanza</SelectItem>
                        <SelectItem value="north_eastern">North Eastern</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="access_key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Key</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your access key" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Access"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            Access keys are provided to authorized government officials only.
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

