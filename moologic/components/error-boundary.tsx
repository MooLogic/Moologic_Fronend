import React from "react"
import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/components/providers/language-provider"

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorDisplay error={this.state.error} onReset={() => this.setState({ hasError: false, error: null })} />
    }

    return this.props.children
  }
}

interface ErrorDisplayProps {
  error: Error | null
  onReset: () => void
}

function ErrorDisplay({ error, onReset }: ErrorDisplayProps) {
  const { t } = useTranslation()

  return (
    <Alert variant="destructive" className="my-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{t("Error")}</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-4">{error?.message || t("An unexpected error occurred")}</p>
        <Button onClick={onReset} variant="outline" size="sm">
          {t("Try Again")}
        </Button>
      </AlertDescription>
    </Alert>
  )
} 