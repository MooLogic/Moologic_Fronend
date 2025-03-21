import { CattleMilkYield } from "@/components/cattle-milk-yield"

export default function CattleMilkYieldPage({ params }) {
  return <CattleMilkYield cattleId={params.id} />
}

