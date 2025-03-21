"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  name: z.string().min(3, { message: "Farm name must be at least 3 characters" }),
  location: z.string().min(3, { message: "Location must be at least 3 characters" }),
  contact: z.string().min(5, { message: "Contact information must be at least 5 characters" }),
  farm_type: z.string().min(1, { message: "Please select a farm type" }),
  size: z.coerce.number().positive({ message: "Size must be a positive number" }),
  cattle_count: z.coerce.number().int().positive({ message: "Cattle count must be a positive integer" }),
  description: z.string().optional(),
})

export function CreateFarmForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      contact: "",
      farm_type: "",
      size: 0,
      cattle_count: 0,
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Create farm API call
      const response = await fetch("http://127.0.0.1:8000/farm/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create farm")
      }

      toast({
        title: "Farm created successfully",
        description: "You can now start managing your dairy farm",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Farm creation error:", error)
      toast({
        title: "Farm creation failed",
        description: error?.message || "An error occurred while creating your farm",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create Your Farm</CardTitle>
          <CardDescription>Enter the details of your dairy farm to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Farm Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Green Valley Dairy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Nairobi, Kenya" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Information</FormLabel>
                      <FormControl>
                        <Input placeholder="+254 123 456 789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farm_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Farm Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select farm type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="dairy">Dairy Farm</SelectItem>
                          <SelectItem value="mixed">Mixed Farm</SelectItem>
                          <SelectItem value="beef">Beef Farm</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Farm Size (acres)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cattle_count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Cattle</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us about your farm..." className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide additional details about your farm, such as history, specialties, etc.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating farm...
                  </>
                ) : (
                  "Create Farm"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

