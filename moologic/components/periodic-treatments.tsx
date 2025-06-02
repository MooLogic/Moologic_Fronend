"use client"

import { useState } from "react"
import { Plus, Filter, Search, Edit, Trash2, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useTranslation } from "@/components/providers/language-provider"
import { useSession } from "next-auth/react"
import { format } from "date-fns"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  useGetPeriodicTreatmentsQuery,
  useAddPeriodicTreatmentMutation,
  useUpdatePeriodicTreatmentMutation,
  useDeletePeriodicTreatmentMutation,
  PeriodicTreatmentRecord,
} from "@/lib/service/healthService"
import { useGetCattleDataQuery } from "@/lib/service/cattleService"
import { useGetFarmUsersQuery } from "@/lib/service/userService"
import { TREATMENT_INTERVALS, GESTATION_STAGES, TREATMENT_TYPES } from "@/lib/constants"

interface PeriodicTreatmentsProps {
  selectedCattleId?: string | null
  accessToken: string
}

interface PeriodicTreatmentFormData {
  cattle: string
  treatment_name: string
  treatment_description: string
  last_treatment_date: string
  next_treatment_date: string
  interval_days: string
  veterinarian: string
  treatment_cost: string
  is_farm_wide: boolean
  notes?: string
}

export function PeriodicTreatments({ selectedCattleId, accessToken }: PeriodicTreatmentsProps) {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const { toast } = useToast()

  // RTK Query hooks
  const { data: periodicTreatments, isLoading, error } = useGetPeriodicTreatmentsQuery(
    { accessToken, cattleId: selectedCattleId || undefined },
    { skip: !accessToken }
  )
  const { data: cattleData } = useGetCattleDataQuery({ accessToken }, { skip: !accessToken })
  const { data: farmUsers } = useGetFarmUsersQuery({ accessToken }, { skip: !accessToken })
  const [addPeriodicTreatment] = useAddPeriodicTreatmentMutation()
  const [updatePeriodicTreatment] = useUpdatePeriodicTreatmentMutation()
  const [deletePeriodicTreatment] = useDeletePeriodicTreatmentMutation()

  // Local state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<PeriodicTreatmentRecord | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState<PeriodicTreatmentFormData>({
    cattle: "",
    treatment_name: "",
    treatment_description: "",
    last_treatment_date: "",
    next_treatment_date: "",
    interval_days: "",
    veterinarian: "",
    treatment_cost: "",
    is_farm_wide: false,
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const selectedUser = farmUsers?.find(u => u.id.toString() === formData.veterinarian)

      const treatmentData = {
        cattle: formData.is_farm_wide ? null : formData.cattle,
        treatment_name: formData.treatment_name,
        treatment_description: formData.treatment_description,
        last_treatment_date: formData.last_treatment_date,
        next_treatment_date: formData.next_treatment_date,
        interval_days: parseInt(formData.interval_days),
        treatment_cost: formData.treatment_cost ? parseFloat(formData.treatment_cost) : undefined,
        veterinarian: selectedUser ? {
          id: selectedUser.id.toString(),
          name: selectedUser.full_name || selectedUser.username
        } : undefined,
        is_farm_wide: formData.is_farm_wide,
        notes: formData.notes,
      }

      if (selectedRecord) {
        await updatePeriodicTreatment({
          accessToken,
          id: selectedRecord.id,
          data: treatmentData,
        }).unwrap()
        toast({
          title: t("Success"),
          description: t("Periodic treatment updated successfully"),
        })
      } else {
        await addPeriodicTreatment({
          accessToken,
          data: treatmentData,
        }).unwrap()
        toast({
          title: t("Success"),
          description: t("Periodic treatment added successfully"),
        })
      }
      setIsAddDialogOpen(false)
      setSelectedRecord(null)
      setFormData({
        cattle: "",
        treatment_name: "",
        treatment_description: "",
        last_treatment_date: "",
        next_treatment_date: "",
        interval_days: "",
        veterinarian: "",
        treatment_cost: "",
        is_farm_wide: false,
        notes: "",
      })
    } catch (error) {
      console.error('Periodic treatment submission error:', error)
      toast({
        title: t("Error"),
        description: t("Failed to save periodic treatment"),
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (record: PeriodicTreatmentRecord) => {
    try {
      await deletePeriodicTreatment({ accessToken, id: record.id }).unwrap()
      toast({
        title: t("Success"),
        description: t("Periodic treatment deleted successfully"),
      })
      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast({
        title: t("Error"),
        description: t("Failed to delete periodic treatment"),
        variant: "destructive",
      })
    }
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{t("Error")}</AlertTitle>
        <AlertDescription>
          {t("Failed to load periodic treatments. Please try again later.")}
        </AlertDescription>
      </Alert>
    )
  }

  const filteredRecords = periodicTreatments?.results?.filter((record) =>
    record.treatment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.cattle?.ear_tag_no || "").toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder={t("Search records...")}
            className="pl-10 pr-4 h-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-5 w-5 mr-2" />
              {t("Add New")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>
                {selectedRecord ? t("Edit Periodic Treatment") : t("Add New Periodic Treatment")}
              </DialogTitle>
              <DialogDescription>
                {selectedRecord
                  ? t("Update the details of this periodic treatment")
                  : t("Enter the details of the new periodic treatment")}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="is_farm_wide" className="flex-1 text-right">
                    {t("Farm-wide Treatment")}
                  </Label>
                  <div className="flex-1">
                    <Switch
                      id="is_farm_wide"
                      checked={formData.is_farm_wide}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_farm_wide: checked }))}
                    />
                  </div>
                </div>

                {!formData.is_farm_wide && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cattle" className="text-right">
                      {t("Cattle")}
                    </Label>
                    <div className="col-span-3">
                      <Select
                        value={formData.cattle}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, cattle: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("Select cattle")} />
                        </SelectTrigger>
                        <SelectContent>
                          {cattleData?.results.map((cattle) => (
                            <SelectItem key={cattle.id} value={cattle.id}>
                              {cattle.ear_tag_no}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="treatment_name" className="text-right">
                    {t("Treatment")}
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={formData.treatment_name}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, treatment_name: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select treatment")} />
                      </SelectTrigger>
                      <SelectContent>
                        {TREATMENT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {t(type.label)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="treatment_description" className="text-right">
                    {t("Description")}
                  </Label>
                  <Textarea
                    id="treatment_description"
                    value={formData.treatment_description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, treatment_description: e.target.value }))}
                    className="col-span-3"
                    placeholder={t("Enter treatment description...")}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="last_treatment_date" className="text-right">
                    {t("Last Treatment Date")}
                  </Label>
                  <Input
                    type="date"
                    id="last_treatment_date"
                    value={formData.last_treatment_date}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      const formattedDate = date.toISOString().split('T')[0];
                      setFormData((prev) => ({ ...prev, last_treatment_date: formattedDate }));
                    }}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="next_treatment_date" className="text-right">
                    {t("Next Treatment Date")}
                  </Label>
                  <Input
                    type="date"
                    id="next_treatment_date"
                    value={formData.next_treatment_date}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      const formattedDate = date.toISOString().split('T')[0];
                      setFormData((prev) => ({ ...prev, next_treatment_date: formattedDate }));
                    }}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="interval_days" className="text-right">
                    {t("Interval (Days)")}
                  </Label>
                  <Input
                    id="interval_days"
                    type="number"
                    min="1"
                    value={formData.interval_days}
                    onChange={(e) => setFormData((prev) => ({ ...prev, interval_days: e.target.value }))}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="treatment_cost" className="text-right">
                    {t("Cost")}
                  </Label>
                  <Input
                    id="treatment_cost"
                    type="number"
                    step="0.01"
                    value={formData.treatment_cost}
                    onChange={(e) => setFormData((prev) => ({ ...prev, treatment_cost: e.target.value }))}
                    className="col-span-3"
                    placeholder="e.g. 50.00"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="veterinarian" className="text-right">
                    {t("Veterinarian")}
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={formData.veterinarian}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, veterinarian: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select user")} />
                      </SelectTrigger>
                      <SelectContent>
                        {farmUsers?.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.full_name || user.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    {t("Notes")}
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    className="col-span-3"
                    placeholder={t("Enter any additional notes...")}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    setSelectedRecord(null)
                    setFormData({
                      cattle: "",
                      treatment_name: "",
                      treatment_description: "",
                      last_treatment_date: "",
                      next_treatment_date: "",
                      interval_days: "",
                      veterinarian: "",
                      treatment_cost: "",
                      is_farm_wide: false,
                      notes: "",
                    })
                  }}
                >
                  {t("Cancel")}
                </Button>
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {selectedRecord ? t("Update Record") : t("Add Record")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("Cattle ID")}</TableHead>
              <TableHead>{t("Treatment")}</TableHead>
              <TableHead>{t("Description")}</TableHead>
              <TableHead>{t("Last Treatment")}</TableHead>
              <TableHead>{t("Next Treatment")}</TableHead>
              <TableHead>{t("Interval")}</TableHead>
              <TableHead>{t("Cost")}</TableHead>
              <TableHead>{t("Veterinarian")}</TableHead>
              <TableHead>{t("Notes")}</TableHead>
              <TableHead className="text-right">{t("Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-4">
                  {t("No records found")}
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    {record.is_farm_wide ? (
                      <Badge variant="secondary">{t("Farm-wide")}</Badge>
                    ) : (
                      record.cattle?.ear_tag_no
                    )}
                  </TableCell>
                  <TableCell>
                    {t(TREATMENT_TYPES.find((type) => type.value === record.treatment_name)?.label || record.treatment_name)}
                  </TableCell>
                  <TableCell>{record.treatment_description}</TableCell>
                  <TableCell>{format(new Date(record.last_treatment_date), "PP")}</TableCell>
                  <TableCell>{format(new Date(record.next_treatment_date), "PP")}</TableCell>
                  <TableCell>{record.interval_days} {t("days")}</TableCell>
                  <TableCell>
                    {record.treatment_cost 
                      ? typeof record.treatment_cost === 'number' 
                        ? `$${record.treatment_cost.toFixed(2)}` 
                        : `$${parseFloat(record.treatment_cost).toFixed(2)}`
                      : "-"}
                  </TableCell>
                  <TableCell>{record.veterinarian?.name || "-"}</TableCell>
                  <TableCell>{record.notes || "-"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedRecord(record)
                        setFormData({
                          cattle: record.cattle?.id || "",
                          treatment_name: record.treatment_name,
                          treatment_description: record.treatment_description || "",
                          last_treatment_date: record.last_treatment_date,
                          next_treatment_date: record.next_treatment_date,
                          interval_days: record.interval_days.toString(),
                          veterinarian: record.veterinarian?.id || "",
                          treatment_cost: record.treatment_cost?.toString() || "",
                          is_farm_wide: record.is_farm_wide,
                          notes: record.notes || "",
                        })
                        setIsAddDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedRecord(record)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("Confirm Deletion")}</DialogTitle>
            <DialogDescription>
              {t("Are you sure you want to delete this periodic treatment? This action cannot be undone.")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setSelectedRecord(null)
              }}
            >
              {t("Cancel")}
            </Button>
            <Button
              type="submit"
              variant="destructive"
              onClick={() => handleDelete(selectedRecord as PeriodicTreatmentRecord)}
            >
              {t("Delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 