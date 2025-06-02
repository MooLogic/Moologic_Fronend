"use client"

import { useState, useEffect } from "react"
import { Plus, Filter, Search, Edit, Trash2, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
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
import { format, addDays } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  useGetInseminationsQuery,
  useGetPendingPregnancyChecksQuery,
  usePostInseminationMutation,
  useUpdateInseminationMutation,
  useDeleteInseminationMutation,
  InseminationRecord,
} from "@/lib/service/inseminationService"
import { useGetCattleDataQuery } from "@/lib/service/cattleService"

// Utility function to format date to DD-MM-YYYY
const formatDate = (date: Date | string | undefined): string => {
  if (!date) return ""
  const d = date instanceof Date ? date : new Date(date)
  if (isNaN(d.getTime())) return "" // Handle invalid dates
  return format(d, "dd-MM-yyyy")
}

// Parse date string from DD-MM-YYYY to Date object
const parseDate = (dateStr: string): Date | undefined => {
  if (!dateStr) return undefined
  const [day, month, year] = dateStr.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  return isNaN(date.getTime()) ? undefined : date
}

export function InseminationRecords() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const accessToken = session?.user?.accessToken || ""

  // Fetch data
  const { data: inseminationData, isLoading: inseminationsLoading } = useGetInseminationsQuery(
    { accessToken },
    { skip: !accessToken }
  )

  const { data: pendingChecks } = useGetPendingPregnancyChecksQuery(
    { accessToken },
    { skip: !accessToken }
  )

  const { data: cattleData, isLoading: cattleLoading } = useGetCattleDataQuery(
    { accessToken },
    { skip: !accessToken }
  )

  // Mutations
  const [postInsemination] = usePostInseminationMutation()
  const [updateInsemination] = useUpdateInseminationMutation()
  const [deleteInsemination] = useDeleteInseminationMutation()

  // State
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isPregnancyCheckDialogOpen, setIsPregnancyCheckDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<InseminationRecord | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    cattle_id: "",
    insemination_date: "",
    bull_id: "",
    insemination_method: "natural",
    notes: "",
  })

  const [pregnancyCheckData, setPregnancyCheckData] = useState({
    pregnancy_check_date: "",
    pregnancy_check_status: "pending",
    notes: "",
  })

  // Handle form input changes
  const handleInputChange = (field: string, value: string | Date) => {
    if (field === "insemination_date" && value instanceof Date) {
      setFormData((prev) => ({ ...prev, [field]: formatDate(value) }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  // Handle pregnancy check form changes
  const handlePregnancyCheckChange = (field: string, value: string | Date) => {
    if (field === "pregnancy_check_date" && value instanceof Date) {
      setPregnancyCheckData((prev) => ({ ...prev, [field]: formatDate(value) }))
    } else {
      setPregnancyCheckData((prev) => ({ ...prev, [field]: value }))
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Log the request payload for debugging
      console.log("Submitting insemination with data:", {
        cattle_id: formData.cattle_id,
        insemination_date: formData.insemination_date,
        bull_id: formData.bull_id || undefined,
        insemination_method: formData.insemination_method,
        notes: formData.notes || undefined,
      });

      const response = await postInsemination({
      accessToken,
      cattle_id: formData.cattle_id,
        insemination_date: formData.insemination_date,
      bull_id: formData.bull_id || undefined,
      insemination_method: formData.insemination_method,
      notes: formData.notes || undefined,
      }).unwrap()

      console.log("Insemination created successfully:", response);

      toast({
        title: "Success",
        description: "Insemination record created successfully",
      })
      setIsAddDialogOpen(false)
      resetForm()
    } catch (error: any) {
      // Enhanced error logging
      console.error("Failed to submit insemination. Error details:", {
        error,
        status: error?.status,
        data: error?.data,
        message: error?.message,
        stack: error?.stack
      })

      // Show more specific error message to the user
      toast({
        title: "Error",
        description: error?.data?.error || error?.message || "Failed to save insemination record. Please check the form data.",
        variant: "destructive",
      })
    }
  }

  // Handle pregnancy check submission
  const handlePregnancyCheckSubmit = async () => {
    if (!selectedRecord) return

    try {
      await updateInsemination({
        accessToken,
        id: selectedRecord.id,
        pregnancy_check_date: pregnancyCheckData.pregnancy_check_date,
        pregnancy_check_status: pregnancyCheckData.pregnancy_check_status,
        notes: pregnancyCheckData.notes || undefined,
      }).unwrap()

      toast({
        title: "Success",
        description: "Pregnancy check recorded successfully",
      })
      setIsPregnancyCheckDialogOpen(false)
      resetPregnancyCheckForm()
    } catch (error) {
      console.error("Failed to update pregnancy check:", error)
      toast({
        title: "Error",
        description: "Failed to save pregnancy check",
        variant: "destructive",
      })
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!selectedRecord) return

    try {
      await deleteInsemination({ accessToken, id: selectedRecord.id }).unwrap()
      toast({
        title: "Success",
        description: "Insemination record deleted successfully",
      })
      setIsDeleteDialogOpen(false)
      setSelectedRecord(null)
    } catch (error) {
      console.error("Failed to delete insemination:", error)
      toast({
        title: "Error",
        description: "Failed to delete insemination record",
        variant: "destructive",
      })
    }
  }

  // Reset forms
  const resetForm = () => {
    setFormData({
      cattle_id: "",
      insemination_date: "",
      bull_id: "",
      insemination_method: "natural",
      notes: "",
    })
    setSelectedRecord(null)
  }

  const resetPregnancyCheckForm = () => {
    setPregnancyCheckData({
      pregnancy_check_date: "",
      pregnancy_check_status: "pending",
      notes: "",
    })
    setSelectedRecord(null)
  }

  // Filter records based on search term
  const filteredRecords = inseminationData?.results?.filter((record) => {
    // Check if record and its properties exist
    if (!record?.cattle_details?.ear_tag_no) return false;
    return record.cattle_details.ear_tag_no.toLowerCase().includes((searchTerm || '').toLowerCase());
  }) || [];

  // Loading state
  if (inseminationsLoading || cattleLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Insemination Records</h1>
        <p className="text-muted-foreground">
          Manage and track insemination records for your cattle
        </p>
      </div>

      {/* Pending Pregnancy Checks Alert */}
      {pendingChecks && pendingChecks.length > 0 && (
        <div className="mb-6 p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="font-semibold">Pending Pregnancy Checks</h3>
          </div>
          <p className="mt-2 text-sm text-yellow-700">
            There are {pendingChecks.length} inseminations that need pregnancy confirmation.
          </p>
        </div>
      )}

        {/* Search and Add New */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by cattle tag..."
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
                Add New
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
              <DialogTitle>Add New Insemination Record</DialogTitle>
              <DialogDescription>Enter the details of the new insemination record</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cattle" className="text-right">
                  Cattle
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
                      {cattleData?.results?.map((cattle) => (
                        <SelectItem key={cattle.id} value={cattle.id}>
                          {cattle.ear_tag_no}
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
                    value={formData.insemination_date ? parseDate(formData.insemination_date) : undefined}
                    onChange={(date) => handleInputChange("insemination_date", date || "")}
                    placeholder="Select insemination date"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="method" className="text-right">
                    Method
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={formData.insemination_method}
                      onValueChange={(value) => handleInputChange("insemination_method", value)}
                    >
                      <SelectTrigger>
                      <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="natural">Natural</SelectItem>
                        <SelectItem value="artificial">Artificial</SelectItem>
                      </SelectContent>
                    </Select>
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
              <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              <Button onClick={handleSubmit}>Save Record</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Records Table */}
      <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
              <TableHead>Cattle Tag</TableHead>
                <TableHead>Date</TableHead>
              <TableHead>Method</TableHead>
                <TableHead>Bull ID</TableHead>
                <TableHead>Status</TableHead>
              <TableHead>Expected Calving</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                  No insemination records found
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.cattle_details?.ear_tag_no}</TableCell>
                  <TableCell>{format(new Date(record.insemination_date), "dd-MM-yyyy")}</TableCell>
                  <TableCell className="capitalize">{record.insemination_method}</TableCell>
                  <TableCell>{record.bull_id || "-"}</TableCell>
                  <TableCell>
                    {record.pregnancy_check_status === "confirmed" ? (
                      <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                    ) : record.pregnancy_check_status === "negative" ? (
                      <Badge className="bg-red-100 text-red-800">Negative</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {record.expected_calving_date ? format(new Date(record.expected_calving_date), "dd-MM-yyyy") : "-"}
                  </TableCell>
                  <TableCell>{record.notes || "-"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    {record.pregnancy_check_status === "pending" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRecord(record)
                          setPregnancyCheckData({
                            pregnancy_check_date: "",
                            pregnancy_check_status: "pending",
                            notes: "",
                          })
                          setIsPregnancyCheckDialogOpen(true)
                        }}
                      >
                        Check Pregnancy
                      </Button>
                    )}
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

      {/* Pregnancy Check Dialog */}
      <Dialog open={isPregnancyCheckDialogOpen} onOpenChange={setIsPregnancyCheckDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Record Pregnancy Check</DialogTitle>
            <DialogDescription>
              Enter the pregnancy check results for cattle {selectedRecord?.cattle_details?.ear_tag_no}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="checkDate" className="text-right">
                Check Date
              </Label>
              <div className="col-span-3">
                <DatePicker
                  value={pregnancyCheckData.pregnancy_check_date ? parseDate(pregnancyCheckData.pregnancy_check_date) : undefined}
                  onChange={(date) => handlePregnancyCheckChange("pregnancy_check_date", date || "")}
                  placeholder="Select pregnancy check date"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Result
              </Label>
              <div className="col-span-3">
                <Select
                  value={pregnancyCheckData.pregnancy_check_status}
                  onValueChange={(value) => handlePregnancyCheckChange("pregnancy_check_status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
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
                value={pregnancyCheckData.notes}
                onChange={(e) => handlePregnancyCheckChange("notes", e.target.value)}
                className="col-span-3"
                placeholder="Enter any additional notes..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPregnancyCheckDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePregnancyCheckSubmit}>Save Result</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this insemination record? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
            <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}