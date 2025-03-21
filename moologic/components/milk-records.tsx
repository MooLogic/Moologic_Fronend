"use client"

import { useState } from "react"
import { Plus, Filter, Search, Edit, Trash2, Download } from "lucide-react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Sample data
const milkRecords = [
  {
    id: 1,
    cattleId: "#876364",
    date: "12-12-2023",
    morningYield: 12.5,
    eveningYield: 10.2,
    totalYield: 22.7,
    quality: "Good",
    notes: "",
  },
  {
    id: 2,
    cattleId: "#876368",
    date: "12-12-2023",
    morningYield: 14.2,
    eveningYield: 11.8,
    totalYield: 26.0,
    quality: "Excellent",
    notes: "Higher than average yield",
  },
  {
    id: 3,
    cattleId: "#876372",
    date: "12-12-2023",
    morningYield: 9.8,
    eveningYield: 8.5,
    totalYield: 18.3,
    quality: "Average",
    notes: "Slightly below average",
  },
  {
    id: 4,
    cattleId: "#876364",
    date: "11-12-2023",
    morningYield: 13.1,
    eveningYield: 10.5,
    totalYield: 23.6,
    quality: "Good",
    notes: "",
  },
  {
    id: 5,
    cattleId: "#876368",
    date: "11-12-2023",
    morningYield: 13.8,
    eveningYield: 11.2,
    totalYield: 25.0,
    quality: "Good",
    notes: "",
  },
]

export function MilkRecords() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)

  const handleDelete = (record) => {
    setSelectedRecord(record)
    setIsDeleteDialogOpen(true)
  }

  const handleEdit = (record) => {
    setSelectedRecord(record)
    setIsAddDialogOpen(true)
  }

  const confirmDelete = () => {
    // Delete logic would go here
    setIsDeleteDialogOpen(false)
  }

  // Calculate summary statistics
  const totalMilkToday = milkRecords
    .filter((record) => record.date === "12-12-2023")
    .reduce((sum, record) => sum + record.totalYield, 0)

  const averageYieldPerCow = totalMilkToday / 3 // 3 cows with records today

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
              <div className="text-2xl font-bold">3</div>
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
              <DialogHeader>
                <DialogTitle>{selectedRecord ? "Edit Milk Record" : "Add New Milk Record"}</DialogTitle>
                <DialogDescription>
                  {selectedRecord
                    ? "Update the details of this milk record"
                    : "Enter the details of the new milk record"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cattleId" className="text-right">
                    Cattle ID
                  </Label>
                  <div className="col-span-3">
                    <Select defaultValue={selectedRecord?.cattleId || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cattle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="#876364">#876364</SelectItem>
                        <SelectItem value="#876368">#876368</SelectItem>
                        <SelectItem value="#876372">#876372</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <div className="col-span-3">
                    <DatePicker />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="morningYield" className="text-right">
                    Morning Yield (L)
                  </Label>
                  <Input
                    id="morningYield"
                    type="number"
                    step="0.1"
                    min="0"
                    defaultValue={selectedRecord?.morningYield || ""}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="eveningYield" className="text-right">
                    Evening Yield (L)
                  </Label>
                  <Input
                    id="eveningYield"
                    type="number"
                    step="0.1"
                    min="0"
                    defaultValue={selectedRecord?.eveningYield || ""}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quality" className="text-right">
                    Milk Quality
                  </Label>
                  <div className="col-span-3">
                    <Select defaultValue={selectedRecord?.quality || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Average">Average</SelectItem>
                        <SelectItem value="Poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Input
                    id="notes"
                    defaultValue={selectedRecord?.notes || ""}
                    className="col-span-3"
                    placeholder="Any additional notes..."
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
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    setSelectedRecord(null)
                  }}
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
                <TableHead>Morning (L)</TableHead>
                <TableHead>Evening (L)</TableHead>
                <TableHead>Total (L)</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {milkRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.cattleId}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.morningYield}</TableCell>
                  <TableCell>{record.eveningYield}</TableCell>
                  <TableCell className="font-medium">{record.totalYield}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        record.quality === "Excellent"
                          ? "bg-green-100 text-green-800"
                          : record.quality === "Good"
                            ? "bg-blue-100 text-blue-800"
                            : record.quality === "Average"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {record.quality}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{record.notes}</TableCell>
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
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this milk record? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  )
}

