"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, DollarSign, UserPlus } from "lucide-react"

export function QuickActions() {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">Quick Actions</h3>
      <div className="flex flex-col gap-2">
        <Link href="/milk-yield/add">
          <Button className="w-full justify-start" variant="default">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Milk Record
          </Button>
        </Link>
        <Link href="/cattle/add">
          <Button className="w-full justify-start" variant="outline">
            <UserPlus className="mr-2 h-4 w-4" /> Add Animal
          </Button>
        </Link>
        <Link href="/finance/add">
          <Button className="w-full justify-start" variant="ghost">
            <DollarSign className="mr-2 h-4 w-4" /> New Transaction
          </Button>
        </Link>
      </div>
    </div>
  )
}
