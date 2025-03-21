import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export default function ResetPasswordPage({ params }: { params: { uidb64: string; token: string } }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <ResetPasswordForm uidb64={params.uidb64} token={params.token} />
    </div>
  )
}

