"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useVerifyEmailMutation } from "@/lib/service/userService"
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function VerifyEmailPage() {
  const params = useParams()
  const router = useRouter()
  const [verifyEmail] = useVerifyEmailMutation()
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        // Ensure we have both userId and token
        if (!params.userId || !params.token) {
          throw new Error("Missing verification parameters")
        }

        // Log the verification attempt
        console.log("Attempting to verify email with:", {
          user_id: params.userId,
          token: params.token
        })

        // Send verification request
        const response = await verifyEmail({
          user_id: String(params.userId),
          token: String(params.token)
        }).unwrap()

        console.log("Verification response:", response)
        setVerificationStatus('success')
      } catch (error: any) {
        console.error("Verification error:", error)
        setVerificationStatus('error')
        setErrorMessage(error.data?.error || "Failed to verify email")
      }
    }

    verifyUserEmail()
  }, [params.userId, params.token, verifyEmail])

  const handleRedirect = () => {
    router.push('/profile')
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>
            {verificationStatus === 'loading' ? 'Verifying your email address...' : 'Email Verification'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {verificationStatus === 'loading' && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Verifying</AlertTitle>
              <AlertDescription>
                Please wait while we verify your email address...
              </AlertDescription>
            </Alert>
          )}

          {verificationStatus === 'success' && (
            <Alert className="bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-600">Success!</AlertTitle>
              <AlertDescription className="text-green-600">
                Your email has been successfully verified. You can now access all features of your account.
              </AlertDescription>
            </Alert>
          )}

          {verificationStatus === 'error' && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center">
            <Button 
              onClick={handleRedirect}
              className="mt-4"
            >
              Go to Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 