"use client"

// framer-motion removed — using CSS-based entrance + hover styles
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useGetCattleDataQuery } from "@/lib/service/cattleService"
import { useSession } from "next-auth/react"
import { useTranslation } from "@/components/providers/language-provider"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

// Interface for Cattle data
interface Cattle {
  id: string
  ear_tag_no: string
  expected_calving_date?: string
}

export function AnimalTable() {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ""
  const { data: cattleData, isLoading } = useGetCattleDataQuery({ accessToken }, { skip: !accessToken })

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  const animals = cattleData?.results || []

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-xs font-medium">{t("Ear Tag No")}</TableHead>
          <TableHead className="text-xs font-medium">{t("Expected Calving Date")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {animals.map((animal: Cattle, index: number) => (
          <tr key={animal.id} className={`border-b fade-in hover-raise`}>
            <TableCell className="py-3 text-sm">{animal.ear_tag_no}</TableCell>
            <TableCell className="py-3 text-sm">
              {animal.expected_calving_date ? format(new Date(animal.expected_calving_date), "MMM d, yyyy") : "-"}
            </TableCell>
          </tr>
        ))}
      </TableBody>
    </Table>
  )
}