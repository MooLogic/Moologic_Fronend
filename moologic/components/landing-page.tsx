"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeLanguageToggle } from "@/components/theme-language-toggle"
import { useTranslation } from "@/components/providers/language-provider"
import { Check, ChevronRight, Milk, Baby, Activity, CreditCard, BarChart3, Users } from "lucide-react"

export function LandingPage() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 relative">
              <Image src="/logo.svg" alt="Loonkoo Logo" width={40} height={40} className="text-primary" priority />
            </div>
            <div>
              <h1 className="text-xl font-bold">Loonkoo</h1>
              <p className="text-xs text-muted-foreground">{t("Dairy Farm Management")}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeLanguageToggle />
            <div className="hidden md:flex gap-4">
              <Link href="/auth/login">
                <Button variant="outline">{t("Login")}</Button>
              </Link>
              <Link href="/auth/register">
                <Button>{t("Register")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Animated Background */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/20 blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-primary/30 blur-3xl"
            animate={{
              x: [0, -70, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 18,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-400/20 blur-3xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />

          {/* Animated Cow Silhouettes */}
          <motion.div
            className="absolute bottom-10 left-[10%] w-20 h-20 opacity-10"
            animate={{
              x: [0, 100, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <Image src="/logo.svg" alt="Cow" width={80} height={80} />
          </motion.div>

          <motion.div
            className="absolute top-40 right-[15%] w-16 h-16 opacity-10"
            animate={{
              x: [0, -80, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <Image src="/logo.svg" alt="Cow" width={64} height={64} />
          </motion.div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {t("Revolutionize Your Dairy Farm Management")}
            </motion.h1>
            <motion.p
              className="text-xl text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t(
                "Comprehensive tools for tracking milk production, livestock health, and farm finances all in one place.",
              )}
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto">
                  {t("Get Started")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  {t("Login")}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t("Comprehensive Farm Management")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("Loonkoo provides all the tools you need to efficiently manage your dairy farm operations.")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Milk}
              title={t("Milk Production Tracking")}
              description={t(
                "Monitor milk yield, quality, and production trends for individual cows and your entire herd.",
              )}
            />
            <FeatureCard
              icon={Baby}
              title={t("Gestation Management")}
              description={t("Track breeding, pregnancy, and calving records with automated due date calculations.")}
            />
            <FeatureCard
              icon={Activity}
              title={t("Health Monitoring")}
              description={t(
                "Record vaccinations, treatments, and health events with reminders for upcoming procedures.",
              )}
            />
            <FeatureCard
              icon={CreditCard}
              title={t("Financial Management")}
              description={t(
                "Track income, expenses, and profitability with detailed financial reports and forecasts.",
              )}
            />
            <FeatureCard
              icon={BarChart3}
              title={t("Analytics & Reporting")}
              description={t(
                "Gain insights with comprehensive analytics on production, health, and financial performance.",
              )}
            />
            <FeatureCard
              icon={Users}
              title={t("Multi-User Access")}
              description={t("Assign different roles and permissions to farm workers, veterinarians, and managers.")}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t("What Our Users Say")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("Hear from dairy farmers who have transformed their operations with Loonkoo.")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              name="John Smith"
              role="Dairy Farmer, 200 cows"
              quote="Loonkoo has completely transformed how we manage our farm. The milk production tracking alone has helped us increase yields by 15%."
            />
            <TestimonialCard
              name="Maria Rodriguez"
              role="Farm Manager"
              quote="The health monitoring features have been a game-changer. We've reduced our veterinary costs by catching issues early."
            />
            <TestimonialCard
              name="David Johnson"
              role="Small Farm Owner"
              quote="Even for our small operation, Loonkoo has been worth every penny. The financial tools have helped us become profitable for the first time in years."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t("Simple, Transparent Pricing")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("Choose the plan that fits your farm's needs. All plans include core features.")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              title="Basic"
              price="$29"
              description="Perfect for small farms"
              features={[
                "Up to 50 cattle records",
                "Milk production tracking",
                "Basic health records",
                "Email support",
              ]}
              buttonText="Get Started"
              buttonVariant="outline"
            />
            <PricingCard
              title="Professional"
              price="$79"
              description="Ideal for medium-sized farms"
              features={[
                "Up to 200 cattle records",
                "Advanced analytics",
                "Financial management",
                "Health & breeding alerts",
                "Priority support",
              ]}
              buttonText="Get Started"
              buttonVariant="default"
              highlighted
            />
            <PricingCard
              title="Enterprise"
              price="$149"
              description="For large dairy operations"
              features={[
                "Unlimited cattle records",
                "Multi-farm management",
                "Custom reporting",
                "API access",
                "Dedicated support",
                "Employee management",
              ]}
              buttonText="Contact Us"
              buttonVariant="outline"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">{t("Ready to Transform Your Dairy Farm?")}</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("Join thousands of dairy farmers who have improved their operations with Loonkoo.")}
            </p>
            <Link href="/auth/register">
              <Button size="lg">
                {t("Start Your Free Trial")}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 relative">
                <Image src="/logo.svg" alt="Loonkoo Logo" width={32} height={32} className="text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Loonkoo</h2>
                <p className="text-xs text-muted-foreground">{t("Dairy Farm Management")}</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">
                {t("Login")}
              </Link>
              <Link href="/auth/register" className="text-sm text-muted-foreground hover:text-foreground">
                {t("Register")}
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                {t("Privacy Policy")}
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                {t("Terms of Service")}
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Loonkoo. {t("All rights reserved.")}
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
      <Card className="h-full">
        <CardContent className="pt-6">
          <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function TestimonialCard({ name, role, quote }) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
      <Card className="h-full">
        <CardContent className="pt-6">
          <div className="mb-4">
            <svg className="h-8 w-8 text-primary/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>
          <p className="text-muted-foreground mb-4">{quote}</p>
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function PricingCard({ title, price, description, features, buttonText, buttonVariant, highlighted = false }) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
      <Card className={`h-full ${highlighted ? "border-primary shadow-lg" : ""}`}>
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <div className="flex items-end justify-center">
              <span className="text-4xl font-bold">{price}</span>
              <span className="text-muted-foreground ml-1">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{description}</p>
          </div>
          <div className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <Button variant={buttonVariant} className="w-full">
            {buttonText}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

