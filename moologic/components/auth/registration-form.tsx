"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { Separator } from "@/components/ui/separator"

// Registration collects username + email + password
// Registration collects full_name, phone_number, email, password
const formSchema = z
  .object({
    full_name: z.string().min(3, { message: "Full name must be at least 3 characters" }),
    phone_number: z.string().min(5, { message: "Please enter a valid phone number" }).optional(),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export function RegistrationForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      phone_number: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
  
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000"

      // Prepare signup payload (full_name, phone_number, email, password)
      const payload = {
        full_name: (values as any).full_name,
        phone_number: (values as any).phone_number || "",
        email: values.email,
        password: values.password,
      }

      // Log payload for debugging
      console.log("Signup payload:", payload)

      const response = await fetch(`${baseUrl}/auth/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      })

      // Read response body (try JSON, fallback to text)
      const respText = await response.text()
      let respBody: any = null
      try {
        respBody = respText ? JSON.parse(respText) : null
      } catch (e) {
        respBody = respText
      }

      if (!response.ok) {
        console.error("Signup failed response:", response.status, respBody)
        const serverMessage = (respBody && (respBody.error || respBody.message || JSON.stringify(respBody))) || response.statusText
        throw new Error(serverMessage || "Registration failed")
      }

      const data = respBody || {}

      toast({
        title: "Registration successful",
        description: "Please select your role to continue",
      })

      // Persist tokens if backend returns them (compatibility fallback)
      if (typeof window !== "undefined") {
        try {
          if (data.access_token) localStorage.setItem("accessToken", data.access_token)
          if (data.refresh_token) localStorage.setItem("refreshToken", data.refresh_token)
          if (data.user) localStorage.setItem("user_id", data.user.id)
        } catch (e) {
          // ignore storage errors
        }
      }

      // Auto-login using credentials provider
      const loginResponse = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (loginResponse?.error) {
        console.error("Auto-login failed:", loginResponse.error)
        throw new Error(loginResponse.error || "Login failed")
      }

      router.push("/auth/role-selection")
    } catch (error: any) {
      console.error("Registration error:", error)
      toast({
        title: "Registration failed",
        description: error?.message || "An error occurred during registration",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true)
      await signIn("google", { callbackUrl: "/auth/role-selection" })
    } catch (error) {
      console.error("Google sign-in error:", error)
      toast({
        title: "Google sign-in failed",
        description: "An error occurred during Google sign-in",
        variant: "destructive",
      })
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your details to create your dairy farm management account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">


          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="+251912345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

