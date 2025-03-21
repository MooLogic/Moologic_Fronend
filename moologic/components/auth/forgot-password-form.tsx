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
import { ArrowLeft, Loader2, Mail } from "lucide-react"
import authService from "@/services/auth-service"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

export function ForgotPasswordForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      await authService.requestPasswordReset(values.email)

      setIsEmailSent(true)

      toast({
        title: "Email sent",
        description: "If an account exists with that email, you will receive a password reset link.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
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
          <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
          <CardDescription>
            {isEmailSent
              ? "Check your email for a reset link"
              : "Enter your email address and we'll send you a link to reset your password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEmailSent ? (
            <div className="text-center py-4">
              <div className="mb-4 text-indigo-600">
                <Mail className="h-12 w-12 mx-auto" />
              </div>
              <p className="mb-4">
                A password reset link has been sent to your email address. Please check your inbox and follow the
                instructions to reset your password.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                If you don't see the email, check your spam folder or try again.
              </p>
              <Button type="button" onClick={() => setIsEmailSent(false)} className="mt-2">
                Try again
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/auth/login" className="flex items-center text-sm text-indigo-600 hover:text-indigo-500">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

