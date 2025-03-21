import { RegistrationForm } from "@/components/auth/registration-form"
import { SessionProvider } from "next-auth/react";

export default function RegisterPage() {
  return (
    <SessionProvider>
      <RegistrationForm />
    </SessionProvider>
  )
}
