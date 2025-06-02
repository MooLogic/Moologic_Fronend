"use client"

import { useState, useEffect } from "react"
import { Plus, Filter, Search, Download, Edit, Trash2, AlertCircle } from "lucide-react"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  useGetMilkRecordsQuery, 
  useAddMilkRecordMutation, 
  useUpdateMilkRecordMutation, 
  useDeleteMilkRecordMutation,
  useGetTodayProductionStatsQuery,
} from "@/lib/service/milkService"
import { useGetLactatingCattleQuery } from "@/lib/service/cattleService"
import { format } from "date-fns"
import { useSession } from "next-auth/react"
import { toast } from "@/components/ui/use-toast"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface MilkRecord {
  id: number;
  ear_tag_no: string;
  quantity: number;
  date: string;
  time: string;
  shift: string;
}

interface LactatingCattle {
  id: number;
  ear_tag_no: string;
  name: string;
  milking_frequency: number;
  last_milking: string | null;
  can_milk_now: boolean;
  days_in_milk: number;
  lactation_number: number;
}

export function MilkRecords() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [shiftFilter, setShiftFilter] = useState("all")
  const [selectedCattle, setSelectedCattle] = useState<string>("")
  const [quantity, setQuantity] = useState<string>("")
  const [shift, setShift] = useState<string>("")
  const [editRecordId, setEditRecordId] = useState<number | null>(null)
  const [deleteRecordId, setDeleteRecordId] = useState<number | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  // Get session and access token
  const { data: session } = useSession()
  const token = session?.user?.accessToken

  // API queries with token
  const { data: milkRecords = [], isLoading: isLoadingRecords, error: recordsError, refetch } = useGetMilkRecordsQuery(token || '', { skip: !token })
  const { data: lactatingCattleResponse, isLoading: isLoadingLactatingCattle } = useGetLactatingCattleQuery(
    { accessToken: token || '' },
    { skip: !token }
  )
  const { data: todayStats, isLoading: isLoadingStats } = useGetTodayProductionStatsQuery(token || '', { skip: !token })

  // Extract lactating cattle array from response
  const lactatingCattle = lactatingCattleResponse?.results || []

  // Mutations for adding, updating, and deleting records
  const [addMilkRecord] = useAddMilkRecordMutation()
  const [updateMilkRecord] = useUpdateMilkRecordMutation()
  const [deleteMilkRecord] = useDeleteMilkRecordMutation()

  // Filter and sort records
  const filteredRecords = Array.isArray(milkRecords) ? (milkRecords as MilkRecord[]).filter(record => {
    const matchesSearch = record.ear_tag_no.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesShift = shiftFilter === "all" || record.shift === shiftFilter
    return matchesSearch && matchesShift
  }).sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime()) : []

  const handleAddRecord = async () => {
    if (!token) return;

    try {
      // Validate inputs
      if (!selectedCattle || !quantity || !shift) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      // Get selected cattle details
      const cattle = lactatingCattle.find((c: LactatingCattle) => c.ear_tag_no === selectedCattle)
      if (!cattle) {
        toast({
          title: "Error",
          description: "Selected cattle not found",
          variant: "destructive",
        })
        return
      }

      // Check if cattle can be milked now
      if (!cattle.can_milk_now) {
        const minHoursBetweenMilking = 24 / cattle.milking_frequency
        toast({
          title: "Cannot Milk Now",
          description: `Must wait at least ${minHoursBetweenMilking} hours between milking sessions for this cattle`,
          variant: "destructive",
        })
        return
      }

      // Check if record already exists for this shift today
      const today = format(new Date(), 'yyyy-MM-dd')
      const existingRecord = milkRecords.find(
        r => r.ear_tag_no === selectedCattle && 
        r.date === today && 
        r.shift === shift
      )

      if (existingRecord) {
        toast({
          title: "Duplicate Record",
          description: `A record for this cattle in the ${shift} shift already exists today`,
          variant: "destructive",
        })
        return
      }

      // Add the record
      await addMilkRecord({
        token,
        data: {
          cattle_tag: selectedCattle,
          ear_tag_no: selectedCattle,
          quantity: parseFloat(quantity),
          shift,
          date: today,
          time: format(new Date(), 'HH:mm:ss')
        }
      }).unwrap()

      toast({
        title: "Success",
        description: "Milk record added successfully",
      })

      // Reset form and close dialog
      setSelectedCattle("")
      setQuantity("")
      setShift("")
      setIsAddDialogOpen(false)
      refetch() // Refresh the records
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add milk record",
        variant: "destructive",
      })
    }
  }

  const handleEditRecord = async () => {
    if (!token || !editRecordId) return;

    try {
      await updateMilkRecord({
        token,
        id: editRecordId,
        data: {
          cattle_tag: selectedCattle,
          quantity: parseFloat(quantity),
          shift,
        }
      }).unwrap()
      
      setIsEditDialogOpen(false)
      setSelectedCattle("")
      setQuantity("")
      setShift("")
      setEditRecordId(null)
      refetch() // Refresh the records
      toast({
        title: "Success",
        description: "Milk record updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update milk record",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRecord = async () => {
    if (!token || !deleteRecordId) return;

    try {
      await deleteMilkRecord({
        token,
        id: deleteRecordId,
      }).unwrap()
      
      setIsDeleteDialogOpen(false)
      setDeleteRecordId(null)
      refetch() // Refresh the records
      toast({
        title: "Success",
        description: "Milk record deleted successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete milk record",
      })
    }
  }

  const handleExportToPDF = () => {
    try {
      // Create new PDF document
      const doc = new jsPDF()
      
      // Add title
      doc.setFontSize(16)
      doc.text('Milk Production Records', 14, 15)
      
      // Add metadata
      doc.setFontSize(10)
      const today = format(new Date(), 'MMMM dd, yyyy')
      doc.text(`Generated on: ${today}`, 14, 25)
      doc.text(`Total Records: ${filteredRecords.length}`, 14, 30)
      doc.text(`Today's Production: ${Number(todayStats?.total_production || 0).toFixed(1)} L`, 14, 35)
      
      // Prepare table data
      const tableData = filteredRecords.map(record => [
        record.ear_tag_no,
        format(new Date(record.date), 'MMM dd, yyyy'),
        format(new Date(`2000-01-01T${record.time}`), 'hh:mm a'),
        record.shift,
        `${Number(record.quantity).toFixed(1)} L`,
        lactatingCattle.find((c: LactatingCattle) => c.ear_tag_no === record.ear_tag_no)?.milking_frequency === 1 ? 'Once' :
        lactatingCattle.find((c: LactatingCattle) => c.ear_tag_no === record.ear_tag_no)?.milking_frequency === 2 ? 'Twice' : 'Thrice'
      ])

      // Add table
      autoTable(doc, {
        head: [['Cattle Tag', 'Date', 'Time', 'Shift', 'Quantity', 'Schedule']],
        body: tableData,
        startY: 45,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontSize: 9,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      })

      // Save the PDF
      doc.save(`milk_records_${format(new Date(), 'yyyy-MM-dd')}.pdf`)

      toast({
        title: "Success",
        description: "Milk records exported to PDF successfully",
      })
    } catch (error) {
      console.error('Error exporting to PDF:', error)
      toast({
        title: "Error",
        description: "Failed to export milk records to PDF",
        variant: "destructive",
      })
    }
  }

  if (!token) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>Please sign in to access milk records.</AlertDescription>
      </Alert>
    )
  }

  if (isLoadingRecords || isLoadingLactatingCattle) {
    return <LoadingState />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Milk Records</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Record
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Records</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{todayStats?.records_count || 0}</div>
            </CardContent>
          </Card>
          <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Total Production</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{Number(todayStats?.total_production || 0).toFixed(1)} L</div>
            </CardContent>
          </Card>
          <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Milking Cattle</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{todayStats?.active_milking_cattle || 0}</div>
            </CardContent>
          </Card>
        </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by cattle tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          </div>
        <Select value={shiftFilter} onValueChange={setShiftFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by shift" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Shifts</SelectItem>
            <SelectItem value="morning">Morning</SelectItem>
            <SelectItem value="afternoon">Afternoon</SelectItem>
            <SelectItem value="evening">Evening</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={handleExportToPDF}>
          <Download className="mr-2 h-4 w-4" /> Export to PDF
          </Button>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cattle Tag</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead>Quantity (L)</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.ear_tag_no}</TableCell>
                <TableCell>{format(new Date(record.date), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{format(new Date(`2000-01-01T${record.time}`), 'hh:mm a')}</TableCell>
                <TableCell>
                  <Badge variant={record.shift === 'morning' ? 'default' : record.shift === 'afternoon' ? 'secondary' : 'outline'}>
                    {record.shift}
                  </Badge>
                </TableCell>
                <TableCell>{Number(record.quantity).toFixed(1)} L</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {lactatingCattle.find((c: LactatingCattle) => c.ear_tag_no === record.ear_tag_no)?.milking_frequency === 1 ? 'Once' : 
                     lactatingCattle.find((c: LactatingCattle) => c.ear_tag_no === record.ear_tag_no)?.milking_frequency === 2 ? 'Twice' : 'Thrice'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedCattle(record.ear_tag_no)
                        setQuantity(record.quantity.toString())
                        setShift(record.shift)
                        setEditRecordId(record.id)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
          </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setDeleteRecordId(record.id)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
                </div>

      {/* Add Record Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
                  <DialogHeader>
            <DialogTitle>Add Milk Record</DialogTitle>
                    <DialogDescription>
              Add a new milk record for a lactating cattle
                    </DialogDescription>
                  </DialogHeader>
          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            <div>
              <Label htmlFor="cattle">Select Cattle</Label>
              <Select value={selectedCattle} onValueChange={setSelectedCattle}>
                          <SelectTrigger>
                  <SelectValue placeholder="Select a cattle" />
                          </SelectTrigger>
                          <SelectContent>
                  {lactatingCattle.map((cattle: LactatingCattle) => (
                    <SelectItem 
                      key={cattle.ear_tag_no} 
                      value={cattle.ear_tag_no}
                      disabled={!cattle.can_milk_now}
                    >
                      {cattle.ear_tag_no} - {cattle.name} 
                      {!cattle.can_milk_now && " (Must wait)"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
            <div>
              <Label htmlFor="quantity">Quantity (L)</Label>
                      <Input
                        id="quantity"
                        type="number"
                        step="0.1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>
            <div>
              <Label htmlFor="shift">Shift</Label>
              <Select value={shift} onValueChange={setShift}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select shift" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Morning</SelectItem>
                            <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
            <Button onClick={handleAddRecord} className="w-full">
              Add Record
            </Button>
                  </div>
            </DialogContent>
          </Dialog>

      {/* Edit Record Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Milk Record</DialogTitle>
                  <DialogDescription>
              Modify the existing milk production record.
                  </DialogDescription>
                </DialogHeader>
          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            <div>
              <Label htmlFor="cattle">Select Cattle</Label>
              <Select value={selectedCattle} onValueChange={setSelectedCattle}>
                        <SelectTrigger>
                  <SelectValue placeholder="Select a cattle" />
                        </SelectTrigger>
                        <SelectContent>
                  {lactatingCattle.map((cattle: LactatingCattle) => (
                    <SelectItem 
                      key={cattle.ear_tag_no} 
                      value={cattle.ear_tag_no}
                      disabled={!cattle.can_milk_now}
                    >
                      {cattle.ear_tag_no} - {cattle.name} 
                      {!cattle.can_milk_now && " (Must wait)"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
            <div>
              <Label htmlFor="quantity">Quantity (L)</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
            <div>
              <Label htmlFor="shift">Shift</Label>
              <Select value={shift} onValueChange={setShift}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shift" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning</SelectItem>
                          <SelectItem value="afternoon">Afternoon</SelectItem>
                  <SelectItem value="evening">Evening</SelectItem>
                        </SelectContent>
                      </Select>
                  </div>
                </div>
                <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
            <Button onClick={handleEditRecord}>Save Changes</Button>
                </DialogFooter>
          </DialogContent>
        </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Milk Record</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this milk record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteRecord}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="space-y-6">
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
              {["Cattle ID", "Date", "Time", "Shift", "Quantity (L)", "Schedule", "Actions"].map((header, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-6 w-24" />
                </TableHead>
              ))}
              </TableRow>
            </TableHeader>
            <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(7)].map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                ))}
                </TableRow>
            ))}
            </TableBody>
          </Table>
        </div>
      </div>
  )
}