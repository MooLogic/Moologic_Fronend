"use client"

import { useState } from "react"
import { Plus, Filter, Search, Edit, Trash2 } from "lucide-react"
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
import { useSession } from "next-auth/react"
import {
  useGetInseminationsQuery,
  usePostInseminationMutation,
  useUpdateInseminationMutation,
  useDeleteInseminationMutation,
} from "@/lib/service/inseminationService"
import { useGetCattleDataQuery } from "@/lib/service/cattleService"

// Utility function to format date to YYYY-MM-DD
const formatDate = (date: Date | string | undefined): string => {
  if (!date) return ""
  const d = date instanceof Date ? date : new Date(date)
  if (isNaN(d.getTime())) return "" // Handle invalid dates
  return d.toISOString().split("T")[0] // Returns YYYY-MM-DD
}

export function InseminationRecords() {
  const { data: session, status } = useSession()
  const accessToken = session?.user?.accessToken || ""

  // Fetch inseminations
  const { data: inseminationData, isLoading: inseminationsLoading, error: inseminationsError } = useGetInseminationsQuery(
    { accessToken },
    { skip: !accessToken }
  )

  // Fetch cattle for dropdown
  const { data: cattleData, isLoading: cattleLoading } = useGetCattleDataQuery(
    { accessToken },
    { skip: !accessToken }
  )

  // Mutations
  const [postInsemination] = usePostInseminationMutation()
  const [updateInsemination] = useUpdateInseminationMutation()
  const [deleteInsemination] = useDeleteInseminationMutation()

  // Form state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null)
  const [formData, setFormData] = useState({
    accessToken: accessToken,
    cattle_id: "",
    insemination_date: "",
    bull_id: "",
    insemination_method: "",
    insemination_status: "",
    insemination_type: "",
    notes: "",
  })

  // Handle form input changes
  const handleInputChange = (field: string, value: string | Date) => {
    if (field === "insemination_date" && value) {
      // Format date to YYYY-MM-DD when updating insemination_date
      setFormData((prev) => ({ ...prev, [field]: formatDate(value) }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    // Ensure insemination_date is in YYYY-MM-DD format
    const formattedPayload = {
      accessToken,
      cattle_id: formData.cattle_id,
      insemination_date: formatDate(formData.insemination_date), // Reformat to be safe
      bull_id: formData.bull_id || undefined,
      insemination_method: formData.insemination_method,
      insemination_status: formData.insemination_status,
      insemination_type: formData.insemination_type,
      notes: formData.notes || undefined,
    }

    try {
      if (selectedRecord) {
        // Update existing record
        await updateInsemination({ ...formattedPayload, id: selectedRecord.id }).unwrap()
      } else {
        // Create new record
        await postInsemination(formattedPayload).unwrap()
      }
      setIsAddDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Failed to submit insemination:", error)
      alert("Failed to save insemination record. Please try again.")
    }
  }

  // Handle delete
  const handleDelete = (record: any) => {
    setSelectedRecord(record)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await deleteInsemination({ accessToken, id: selectedRecord.id }).unwrap()
      setIsDeleteDialogOpen(false)
      setSelectedRecord(null)
    } catch (error) {
      console.error("Failed to delete insemination:", error)
      alert("Failed to delete insemination record. Please try again.")
    }
  }

  // Handle edit
  const handleEdit = (record: any) => {
    setSelectedRecord(record)
    setFormData({
      accessToken: accessToken,
      cattle_id: record.cattle?.id?.toString() || record.cattle?.toString() || "",
      insemination_date: record.insemination_date || "", // Already in YYYY-MM-DD from backend
      bull_id: record.bull_id || "",
      insemination_method: record.insemination_method || "",
      insemination_status: record.insemination_status || "",
      insemination_type: record.insemination_type || "",
      notes: record.notes || "",
    })
    setIsAddDialogOpen(true)
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      accessToken: accessToken,
      cattle_id: "",
      insemination_date: "",
      bull_id: "",
      insemination_method: "",
      insemination_status: "",
      insemination_type: "",
      notes: "",
    })
    setSelectedRecord(null)
  }

  // Loading and error states
  if (status === "loading" || inseminationsLoading || cattleLoading) {
    return <div>Loading...</div>
  }

  if (inseminationsError) {
    console.error("Insemination data error:", inseminationsError)
    return <div className="text-red-500">Failed to load insemination records.</div>
  }

  const inseminations = inseminationData?.results || []

  return (
    <main className="flex-1">
      <header className="h-16 px-8 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-gray-800">Insemination Records</h1>
        <div className="text-lg font-medium text-gray-800">Anan Dairy Farm</div>
      </header>

      <div className="p-8">
        {/* Search and Add New */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input type="text" placeholder="Search records..." className="pl-10 pr-4 h-10 w-full" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-5 w-5 mr-2" />
                Add New
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>{selectedRecord ? "Edit Insemination Record" : "Add New Insemination Record"}</DialogTitle>
                <DialogDescription>
                  {selectedRecord
                    ? "Update the details of this insemination record"
                    : "Enter the details of the new insemination record"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cattleId" className="text-right">
                    Cattle ID
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={formData.cattle_id}
                      onValueChange={(value) => handleInputChange("cattle_id", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select cattle" />
                      </SelectTrigger>
                      <SelectContent>
                        {cattleData?.results?.map((cattle: any) => (
                          <SelectItem key={cattle.id} value={cattle.id.toString()}>
                            {cattle.ear_tag_no || cattle.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <div className="col-span-3">
                    <DatePicker
                      value={formData.insemination_date ? new Date(formData.insemination_date) : undefined}
                      onChange={(date) => handleInputChange("insemination_date", date)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bullId" className="text-right">
                    Bull ID
                  </Label>
                  <Input
                    id="bullId"
                    value={formData.bull_id}
                    onChange={(e) => handleInputChange("bull_id", e.target.value)}
                    className="col-span-3"
                    placeholder="Enter bull ID (optional)"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="inseminationMethod" className="text-right">
                    Method
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={formData.insemination_method}
                      onValueChange={(value) => handleInputChange("insemination_method", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="natural">Natural</SelectItem>
                        <SelectItem value="artificial">Artificial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="inseminationStatus" className="text-right">
                    Status
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={formData.insemination_status}
                      onValueChange={(value) => handleInputChange("insemination_status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="successful">Successful</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="inseminationType" className="text-right">
                    Type
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={formData.insemination_type}
                      onValueChange={(value) => handleInputChange("insemination_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="natural">Natural</SelectItem>
                        <SelectItem value="artificial">Artificial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    className="col-span-3"
                    placeholder="Enter any additional notes..."
                  />
                </div>
              </div>
             ніка
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleSubmit}
                >
                  {selectedRecord ? "Update Record" : "Add Record"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Records Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cattle ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Bull ID</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inseminations.map((record: any) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.cattle?.ear_tag_no || record.cattle?.id || record.cattle}
                  </TableCell>
                  <TableCell>{record.insemination_date}</TableCell>
                  <TableCell>{record.bull_id || "-"}</TableCell>
                  <TableCell>{record.insemination_method}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        record.insemination_status === "successful"
                          ? "bg-green-100 text-green-800"
                          : record.insemination_status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {record.insemination_status}
                    </span>
                  </TableCell>
                  <TableCell>{record.insemination_type}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{record.notes || "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(record)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(record)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
             _vue
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this insemination record? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  )
}