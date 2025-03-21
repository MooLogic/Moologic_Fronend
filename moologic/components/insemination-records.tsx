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

// Sample data
const inseminationRecords = [
  {
    id: 1,
    cattleId: "#876364",
    date: "12-12-2023",
    bullId: "BULL-123",
    semenType: "Sexed",
    technician: "John Doe",
    status: "Pending",
    notes: "First insemination",
  },
  {
    id: 2,
    cattleId: "#876368",
    date: "10-12-2023",
    bullId: "BULL-456",
    semenType: "Conventional",
    technician: "Jane Smith",
    status: "Successful",
    notes: "Confirmed pregnancy on 10-01-2024",
  },
  {
    id: 3,
    cattleId: "#876372",
    date: "05-12-2023",
    bullId: "BULL-789",
    semenType: "Sexed",
    technician: "John Doe",
    status: "Failed",
    notes: "Will need to repeat",
  },
  {
    id: 4,
    cattleId: "#876375",
    date: "01-12-2023",
    bullId: "BULL-123",
    semenType: "Conventional",
    technician: "Jane Smith",
    status: "Successful",
    notes: "Confirmed pregnancy on 01-01-2024",
  },
  {
    id: 5,
    cattleId: "#876380",
    date: "25-11-2023",
    bullId: "BULL-456",
    semenType: "Sexed",
    technician: "John Doe",
    status: "Pending",
    notes: "",
  },
]

export function InseminationRecords() {
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
                    <Select defaultValue={selectedRecord?.cattleId || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cattle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="#876364">#876364</SelectItem>
                        <SelectItem value="#876368">#876368</SelectItem>
                        <SelectItem value="#876372">#876372</SelectItem>
                        <SelectItem value="#876375">#876375</SelectItem>
                        <SelectItem value="#876380">#876380</SelectItem>
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
                  <Label htmlFor="bullId" className="text-right">
                    Bull ID
                  </Label>
                  <div className="col-span-3">
                    <Select defaultValue={selectedRecord?.bullId || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bull" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BULL-123">BULL-123</SelectItem>
                        <SelectItem value="BULL-456">BULL-456</SelectItem>
                        <SelectItem value="BULL-789">BULL-789</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="semenType" className="text-right">
                    Semen Type
                  </Label>
                  <div className="col-span-3">
                    <Select defaultValue={selectedRecord?.semenType || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semen type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Conventional">Conventional</SelectItem>
                        <SelectItem value="Sexed">Sexed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="technician" className="text-right">
                    Technician
                  </Label>
                  <div className="col-span-3">
                    <Select defaultValue={selectedRecord?.technician || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select technician" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="John Doe">John Doe</SelectItem>
                        <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <div className="col-span-3">
                    <Select defaultValue={selectedRecord?.status || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Successful">Successful</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
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
                    defaultValue={selectedRecord?.notes || ""}
                    className="col-span-3"
                    placeholder="Enter any additional notes..."
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
                <TableHead>Bull ID</TableHead>
                <TableHead>Semen Type</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inseminationRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.cattleId}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.bullId}</TableCell>
                  <TableCell>{record.semenType}</TableCell>
                  <TableCell>{record.technician}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        record.status === "Successful"
                          ? "bg-green-100 text-green-800"
                          : record.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {record.status}
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
                Are you sure you want to delete this insemination record? This action cannot be undone.
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

