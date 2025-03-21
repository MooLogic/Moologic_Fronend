import { DiseasePrediction } from "@/components/disease-prediction"
import { DecorativeBackground } from "@/components/decorative-background"

export default function DiseasePage() {
  return (
    <div className="relative p-6">
      <DecorativeBackground />
      <DiseasePrediction />
    </div>
  )
}

