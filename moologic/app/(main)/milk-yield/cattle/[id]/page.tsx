'use client'

import { CattleMilkYield } from "@/components/cattle-milk-yield"
import { DecorativeBackground } from "@/components/decorative-background"
import { useParams } from "next/navigation"

export default function Page() {
  const params = useParams()
  const id = params?.id as string

  return (
    <div className="relative">
      <DecorativeBackground />
      <CattleMilkYield cattleId={id} />
    </div>
  )
}

