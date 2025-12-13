"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { ThemeLanguageToggle } from "@/components/theme-language-toggle"
import { Loader2, MilkIcon as Cow } from "lucide-react"
import { useTranslation } from "@/components/providers/language-provider"
import { signIn, useSession } from "next-auth/react"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { status } = useSession()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Redirect if already authenticated
  if (status === "authenticated") {
    router.push("/dashboard")
    return null
  }
  //remove farm_name and userRole from the local storage
  localStorage.removeItem("farm_name")
  localStorage.removeItem("userRole")
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: t("Login failed"),
          description: t("Invalid email or password. Please try again."),
          variant: "destructive",
        })
      } else {
        localStorage.removeItem("farm_name")
        localStorage.removeItem("userRole")
        toast({
          title: t("Login successful"),
          description: t("Welcome back to LoonKoo!"),
        })
        router.push("/dashboard")
      }
    } catch (err) {
      toast({
        title: t("Login error"),
        description: t("An unexpected error occurred. Please try again."),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (error) {
      console.error("Google sign-in error:", error)
      toast({
        title: t("Google sign-in failed"),
        description: t("An error occurred during Google sign-in"),
        variant: "destructive",
      })
    }
  }

  

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="absolute top-4 right-4">
        <ThemeLanguageToggle />
      </div>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <Cow className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("Welcome back")}</h1>
          <p className="text-sm text-muted-foreground">{t("Enter your credentials to access your account")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("Login")}</CardTitle>
            <CardDescription>{t("Enter your email and password to login to your account")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Email")}</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" {...field} />
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
                      <FormLabel>{t("Password")}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("Logging in...")}
                    </>
                  ) : (
                    t("Login")
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              
            </div>
           
      
            <div className="text-center text-sm">
              {t("Don't have an account?")}{" "}
              <Link href="/auth/register" className="underline underline-offset-4 hover:text-primary">
                {t("Sign up")}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

