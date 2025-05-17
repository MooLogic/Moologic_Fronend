"use client"

import { useState, useEffect } from "react"
import { Plus, Filter, Search, Download, Edit } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetMilkRecordsQuery, useAddMilkRecordMutation, useEditMilkRecordMutation } from "@/lib/service/milkService"
import { useGetCattleDataQuery } from "@/lib/service/cattleService"
import { format } from "date-fns"
import { useSession } from "next-auth/react"

export function MilkRecords() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    cattle_tag: "",
    quantity: 0,
    shift: "morning",
  })
  const [editRecordId, setEditRecordId] = useState<number | null>(null)

  // Fetch session and access token
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ""

  // Fetch milk records and cattle
  const { data: milkRecords = [], isLoading: isLoadingRecords, error: recordsError, refetch } = useGetMilkRecordsQuery(
    { accessToken },
    { skip: !accessToken }
  )
  const { data: cattleData, isLoading: isLoadingCattle, error: cattleError } = useGetCattleDataQuery(
    { accessToken },
    { skip: !accessToken }
  )

  // Normalize cattle data
  const cattle = cattleData?.results || []

  // Debug cattle and milk records
  useEffect(() => {
    console.log("accessToken:", accessToken)
    console.log("cattleData:", cattleData)
    console.log("cattle:", cattle)
    console.log("milkRecords:", milkRecords)
    if (Array.isArray(cattleData?.results) && cattleData.results.length > 0) {
      console.log("First cattle object keys:", Object.keys(cattleData.results[0]))
    }
  }, [accessToken, cattleData, cattle, milkRecords])

  // Mutations for adding and updating records
  const [addMilkRecord, { isLoading: isAdding }] = useAddMilkRecordMutation()
  const [updateMilkRecord, { isLoading: isUpdating }] = useEditMilkRecordMutation()

  // Calculate summary statistics
  const today = format(new Date(), "yyyy-MM-dd")
  const todayRecords = milkRecords.filter((record) => record.date === today)
  const totalMilkToday = todayRecords.reduce((sum, record) => sum + record.quantity, 0)
  const uniqueCowsToday = new Set(todayRecords.map((record) => record.cattle_tag)).size
  const averageYieldPerCow = uniqueCowsToday > 0 ? totalMilkToday / uniqueCowsToday : 0

  const handleAddRecord = async () => {
    if (!formData.cattle_tag || formData.quantity <= 0) {
      console.error("Invalid form data: cattle_tag and quantity are required")
      return
    }
    try {
      const response = await addMilkRecord({
        accessToken,
        cattle_tag: formData.cattle_tag,
        quantity: formData.quantity,
        shift: formData.shift,
      }).unwrap()
      console.log("Add milk record response:", response)
      setIsAddDialogOpen(false)
      setFormData({ cattle_tag: "", quantity: 0, shift: "morning" })
      refetch() // Explicit refetch
    } catch (err) {
      console.error("Failed to add milk record:", err)
    }
  }

  const handleEditRecord = async () => {
    if (!formData.cattle_tag || formData.quantity <= 0 || !editRecordId) {
      console.error("Invalid form data: cattle_tag, quantity, and record ID are required")
      return
    }
    try {
      const response = await updateMilkRecord({
        accessToken,
        id: editRecordId,
        cattle_tag: formData.cattle_tag,
        quantity: formData.quantity,
        shift: formData.shift,
      }).unwrap()
      console.log("Edit milk record response:", response)
      setIsEditDialogOpen(false)
      setFormData({ cattle_tag: "", quantity: 0, shift: "morning" })
      setEditRecordId(null)
      refetch() // Explicit refetch
    } catch (err) {
      console.error("Failed to update milk record:", err)
    }
  }

  const openEditDialog = (record: { id: number; cattle_tag: string; quantity: number; shift: string }) => {
    setFormData({
      cattle_tag: record.cattle_tag,
      quantity: record.quantity,
      shift: record.shift,
    })
    setEditRecordId(record.id)
    setIsEditDialogOpen(true)
  }

  if (isLoadingRecords || isLoadingCattle) {
    return (
      <main className="flex-1 p-8">
        <Skeleton className="h-16 w-full mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-12 w-full mb-6" />
        <div className="bg-white rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {["Cattle ID", "Date", "Shift", "Quantity (L)", "Actions"].map((header, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-6 w-24" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(5)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    )
  }

  if (recordsError || cattleError) {
    return (
      <main className="flex-1 p-8">
        <div className="text-red-600">
          {recordsError
            ? "Error loading milk records. Please try again later."
            : "Error loading cattle data. Please ensure cattle records are available."}
        </div>
      </main>
    )
  }

  if (!accessToken) {
    return (
      <main className="flex-1 p-8">
        <div className="text-red-600">Please log in to view milk records.</div>
      </main>
    )
  }

  return (
    <main className="flex-1">
      <header className="h-16 px-8 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-gray-800">Milk Yield Records</h1>
        <div className="text-lg font-medium text-gray-800">Anan Dairy Farm</div>
      </header>

      <div className="p-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Today's Total Milk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMilkToday.toFixed(1)} liters</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Average Per Cow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageYieldPerCow.toFixed(1)} liters</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Milking Cows</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{uniqueCowsToday}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Add New */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input type="text" placeholder="Search records..." className="pl-10 pr-4 h-10 w-full" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-5 w-5 mr-2" />
                Add New
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              {isAdding ? (
                <div className="flex justify-center items-center h-64">
                  <Skeleton className="h-12 w-64" />
                </div>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle>Add New Milk Record</DialogTitle>
                    <DialogDescription>
                      {cattle.length === 0
                        ? "No cattle available. Please add cattle records first."
                        : "Enter the details of the new milk record."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cattleId" className="text-right">
                        Cattle ID
                      </Label>
                      <div className="col-span-3">
                        <Select
                          value={formData.cattle_tag}
                          onValueChange={(value) => setFormData({ ...formData, cattle_tag: value })}
                          disabled={cattle.length === 0}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={cattle.length === 0 ? "No cattle available" : "Select cattle"} />
                          </SelectTrigger>
                          <SelectContent>
                            {cattle.map((cow) => (
                              <SelectItem key={cow.id} value={cow.ear_tag_no}>
                                {cow.ear_tag_no}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="quantity" className="text-right">
                        Yield (L)
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        step="0.1"
                        min="0"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="shift" className="text-right">
                        Shift
                      </Label>
                      <div className="col-span-3">
                        <Select
                          value={formData.shift}
                          onValueChange={(value) => setFormData({ ...formData, shift: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select shift" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Morning</SelectItem>
                            <SelectItem value="afternoon">Afternoon</SelectItem>
                            <SelectItem value="night">Night</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      to="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700"
                      onClick={handleAddRecord}
                      disabled={isAdding || cattle.length === 0 || !formData.cattle_tag || formData.quantity <= 0}
                    >
                      {isAdding ? "Adding..." : "Add Record"}
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            {isUpdating ? (
              <div className="flex justify-center items-center h-64">
                <Skeleton className="h-12 w-64" />
              </div>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Edit Milk Record</DialogTitle>
                  <DialogDescription>
                    {cattle.length === 0
                      ? "No cattle available. Please add cattle records first."
                      : "Update the details of the milk record."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="cattleId" className="text-right">
                      Cattle ID
                    </Label>
                    <div className="col-span-3">
                      <Select
                        value={formData.cattle_tag}
                        onValueChange={(value) => setFormData({ ...formData, cattle_tag: value })}
                        disabled={cattle.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={cattle.length === 0 ? "No cattle available" : "Select cattle"} />
                        </SelectTrigger>
                        <SelectContent>
                          {cattle.map((cow) => (
                            <SelectItem key={cow.id} value={cow.ear_tag_no}>
                              {cow.ear_tag_no}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right">
                      Yield (L)
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="shift" className="text-right">
                      Shift
                    </Label>
                    <div className="col-span-3">
                      <Select
                        value={formData.shift}
                        onValueChange={(value) => setFormData({ ...formData, shift: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select shift" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning</SelectItem>
                          <SelectItem value="afternoon">Afternoon</SelectItem>
                          <SelectItem value="night">Night</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditDialogOpen(false)
                      setEditRecordId(null)
                      setFormData({ cattle_tag: "", quantity: 0, shift: "morning" })
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={handleEditRecord}
                    disabled={isUpdating || cattle.length === 0 || !formData.cattle_tag || formData.quantity <= 0}
                  >
                    {isUpdating ? "Updating..." : "Update Record"}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Records Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cattle ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Quantity (L)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {milkRecords.length > 0 ? (
                milkRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.cattle_tag}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.shift.charAt(0).toUpperCase() + record.shift.slice(1)}</TableCell>
                    <TableCell>{record.quantity.toFixed(1)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(record)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No records available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  )
}