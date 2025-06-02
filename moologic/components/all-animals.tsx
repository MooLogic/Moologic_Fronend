"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/components/providers/language-provider"
import { Eye, Pencil, Trash2, Search, Loader2 } from "lucide-react"
import { format } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Cattle {
  id: string
  ear_tag_no: string
  breed?: string
  birth_date?: string
  gender: "male" | "female"
  life_stage: "calf" | "heifer" | "cow" | "bull"
  dam_id?: string
  sire_id?: string
  is_purchased: boolean
  purchase_date?: string
  purchase_source?: string
  gestation_status: "not_pregnant" | "pregnant" | "calving"
  health_status: "healthy" | "sick"
  last_insemination_date?: string
  last_calving_date?: string
  expected_calving_date?: string
  expected_insemination_date?: string
}

interface AllAnimalsProps {
  animals: Cattle[]
  showFilters?: boolean
  onEdit?: (cattle: Cattle) => void
  onDelete?: (id: string) => void
  isLoading?: boolean
}

export function AllAnimals({
  animals,
  showFilters = true,
  onEdit,
  onDelete,
  isLoading = false,
}: AllAnimalsProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [genderFilter, setGenderFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCattleId, setSelectedCattleId] = useState<string | null>(null)

  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      // Search filter
      const searchMatch =
        animal.ear_tag_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (animal.breed && animal.breed.toLowerCase().includes(searchTerm.toLowerCase()))

      // Status filter
      const statusMatch =
        statusFilter === "all" ||
        (statusFilter === "pregnant" && animal.gestation_status === "pregnant") ||
        (statusFilter === "not_pregnant" && animal.gestation_status === "not_pregnant") ||
        (statusFilter === "calving" && animal.gestation_status === "calving") ||
        (statusFilter === "healthy" && animal.health_status === "healthy") ||
        (statusFilter === "sick" && animal.health_status === "sick")

      // Gender filter
      const genderMatch =
        genderFilter === "all" ||
        (genderFilter === "female" && animal.gender === "female") ||
        (genderFilter === "male" && animal.gender === "male")

      return searchMatch && statusMatch && genderMatch
    })
  }, [animals, searchTerm, statusFilter, genderFilter])

  const handleViewDetails = (id: string) => {
    if (!id) return;
    router.push(`/cattle/${id}/detail`);
  }

  const handleEdit = (cattle: Cattle) => {
    if (onEdit) {
      onEdit(cattle)
    }
  }

  const handleDelete = (id: string) => {
    setSelectedCattleId(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedCattleId && onDelete) {
      onDelete(selectedCattleId)
      setDeleteDialogOpen(false)
      setSelectedCattleId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pregnant":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            {t("Pregnant")}
          </Badge>
        )
      case "calving":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
            {t("Calving")}
          </Badge>
        )
      case "not_pregnant":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            {t("Not Pregnant")}
          </Badge>
        )
      case "healthy":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            {t("Healthy")}
          </Badge>
        )
      case "sick":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            {t("Sick")}
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("Search by tag or breed...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
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
          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder={t("Gender")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("All Genders")}</SelectItem>
              <SelectItem value="female">{t("Female")}</SelectItem>
              <SelectItem value="male">{t("Male")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("Ear Tag")}</TableHead>
              <TableHead>{t("Breed")}</TableHead>
              <TableHead>{t("Birth Date")}</TableHead>
              <TableHead>{t("Gender")}</TableHead>
              <TableHead>{t("Life Stage")}</TableHead>
              <TableHead>{t("Status")}</TableHead>
              <TableHead>{t("Health")}</TableHead>
              <TableHead className="text-right">{t("Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAnimals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  {t("No animals found.")}
                </TableCell>
              </TableRow>
            ) : (
              filteredAnimals.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell className="font-medium">{animal.ear_tag_no}</TableCell>
                  <TableCell>{animal.breed || "-"}</TableCell>
                  <TableCell>{animal.birth_date ? format(new Date(animal.birth_date), "MMM d, yyyy") : "-"}</TableCell>
                  <TableCell>{t(animal.gender.charAt(0).toUpperCase() + animal.gender.slice(1))}</TableCell>
                  <TableCell>{t(animal.life_stage.charAt(0).toUpperCase() + animal.life_stage.slice(1))}</TableCell>
                  <TableCell>{getStatusBadge(animal.gestation_status)}</TableCell>
                  <TableCell>{getStatusBadge(animal.health_status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(animal.id)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">{t("View")}</span>
                      </Button>
                      {onEdit && (
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(animal)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">{t("Edit")}</span>
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
                          onClick={() => handleDelete(animal.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">{t("Delete")}</span>
                    </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("Delete Cattle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("Are you sure you want to delete this cattle? This action cannot be undone.")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={confirmDelete}
            >
              {t("Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div> 
  )
}

