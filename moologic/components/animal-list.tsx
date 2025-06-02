"use client"

import { useMemo, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetCattleDataQuery } from "@/lib/service/cattleService"
import { useSession } from "next-auth/react"
import { useTranslation } from "@/components/providers/language-provider"
import { differenceInMonths, format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

// Interface for Cattle data
interface Cattle {
  id: string
  ear_tag_no: string
  birth_date?: string
  gestation_status: "not_pregnant" | "pregnant" | "calving"
  health_status: "healthy" | "sick"
  life_stage: "calf" | "heifer" | "cow" | "bull"
}

export function AnimalList({ onSelectAnimal }: { onSelectAnimal: (animal: Cattle) => void }) {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ""
  const { data: cattleData, isLoading } = useGetCattleDataQuery({ accessToken }, { skip: !accessToken })

  const [lifeStageFilter, setLifeStageFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredAnimals = useMemo(() => {
    if (!cattleData?.results) return []
    return cattleData.results.filter((animal: Cattle) => {
      const lifeStageMatch = lifeStageFilter === "all" || animal.life_stage === lifeStageFilter
      const statusMatch =
        statusFilter === "all" ||
        animal.gestation_status === statusFilter ||
        animal.health_status === statusFilter
      return lifeStageMatch && statusMatch
    })
  }, [cattleData, lifeStageFilter, statusFilter])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-4 border-b grid grid-cols-2 gap-4">
        <Select value={lifeStageFilter} onValueChange={setLifeStageFilter}>
          <SelectTrigger>
            <SelectValue placeholder={t("Life Stage")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("All Life Stages")}</SelectItem>
            <SelectItem value="calf">{t("Calf")}</SelectItem>
            <SelectItem value="heifer">{t("Heifer")}</SelectItem>
            <SelectItem value="cow">{t("Cow")}</SelectItem>
            <SelectItem value="bull">{t("Bull")}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder={t("Status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("All Statuses")}</SelectItem>
            <SelectItem value="pregnant">{t("Pregnant")}</SelectItem>
            <SelectItem value="not_pregnant">{t("Not Pregnant")}</SelectItem>
            <SelectItem value="calving">{t("Calving")}</SelectItem>
            <SelectItem value="healthy">{t("Healthy")}</SelectItem>
            <SelectItem value="sick">{t("Sick")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">{t("Ear Tag No")}</TableHead>
            <TableHead>{t("Age")}</TableHead>
            <TableHead>{t("Status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAnimals.map((animal: Cattle) => (
            <TableRow
              key={animal.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onSelectAnimal(animal)}
            >
              <TableCell className="font-medium">{animal.ear_tag_no}</TableCell>
              <TableCell>
                {animal.birth_date
                  ? `${differenceInMonths(new Date(), new Date(animal.birth_date))} months`
                  : "-"}
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-700">
                  {t(animal.gestation_status.replace("_", " ").charAt(0).toUpperCase() + animal.gestation_status.slice(1))}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}