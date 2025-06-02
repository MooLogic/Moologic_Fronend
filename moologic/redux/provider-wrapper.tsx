"use client"

import type { ReactNode } from "react"
import { Provider } from "react-redux"
import { store } from "@/lib/store"

interface ReduxProviderProps {
  children: ReactNode
}

export function ReduxProviderWrapper({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>
}

