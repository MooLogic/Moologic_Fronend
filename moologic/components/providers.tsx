"use client"; // 👈 This makes it a Client Component

import { ThemeProvider } from "@/components/providers/theme-provider";
import { LanguageProvider } from "@/components/providers/language-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { ReduxProviderWrapper } from "@/redux/provider-wrapper";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProviderWrapper>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </ReduxProviderWrapper>
    </SessionProvider>
  );
}
