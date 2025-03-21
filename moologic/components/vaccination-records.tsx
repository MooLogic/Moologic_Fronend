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
const vaccinationRecords = [
  {
    id: 1,
    cattleId: "#876364",
    date: "12-12-2023",
    vaccine: "FMD Vaccine",
    dosage: "5ml",
    administrator: "Dr. John Smith",
    nextDueDate: "12-06-2024",
    notes: "First dose",
  },
  {
    id: 2,
    cattleId: "#876368",
    date: "12-12-2023",
    vaccine: "FMD Vaccine",
    dosage: "5ml",
    administrator: "Dr. John Smith",
    nextDueDate: "12-06-2024",
    notes: "First dose",
  },
  {
    id: 3,
    cattleId: "#876372",
    date: "10-12-2023",
    vaccine: "Brucellosis Vaccine",
    dosage: "3ml",
    administrator: "Dr. Jane Doe",
    nextDueDate: "10-12-2024",
    notes: "Annual vaccination",
  },
  {
    id: 4,
    cattleId: "#876375",
    date: "05-12-2023",
    vaccine: "Anthrax Vaccine",
    dosage: "2ml",
    administrator: "Dr. John Smith",
    nextDueDate: "05-12-2024",
    notes: "Annual vaccination",
  },
  {
    id: 5,
    cattleId: "#876380",
    date: "01-12-2023",
    vaccine: "BVD Vaccine",
    dosage: "4ml",
    administrator: "Dr. Jane Doe",
    nextDueDate: "01-06-2024",
    notes: "Booster required in 6 months",
  },
]

export function VaccinationRecords() {
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
    <div>
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
              <DialogTitle>{selectedRecord ? "Edit Vaccination Record" : "Add New Vaccination Record"}</DialogTitle>
              <DialogDescription>
                {selectedRecord
                  ? "Update the details of this vaccination record"
                  : "Enter the details of the new vaccination record"}
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
                <Label htmlFor="vaccine" className="text-right">
                  Vaccine
                </Label>
                <div className="col-span-3">
                  <Select defaultValue={selectedRecord?.vaccine || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vaccine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FMD Vaccine">FMD Vaccine</SelectItem>
                      <SelectItem value="Brucellosis Vaccine">Brucellosis Vaccine</SelectItem>
                      <SelectItem value="Anthrax Vaccine">Anthrax Vaccine</SelectItem>
                      <SelectItem value="BVD Vaccine">BVD Vaccine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dosage" className="text-right">
                  Dosage
                </Label>
                <Input
                  id="dosage"
                  defaultValue={selectedRecord?.dosage || ""}
                  className="col-span-3"
                  placeholder="e.g. 5ml"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="administrator" className="text-right">
                  Administrator
                </Label>
                <div className="col-span-3">
                  <Select defaultValue={selectedRecord?.administrator || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select administrator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr. John Smith">Dr. John Smith</SelectItem>
                      <SelectItem value="Dr. Jane Doe">Dr. Jane Doe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nextDueDate" className="text-right">
                  Next Due Date
                </Label>
                <div className="col-span-3">
                  <DatePicker />
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
              <TableHead>Vaccine</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Administrator</TableHead>
              <TableHead>Next Due Date</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vaccinationRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.cattleId}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.vaccine}</TableCell>
                <TableCell>{record.dosage}</TableCell>
                <TableCell>{record.administrator}</TableCell>
                <TableCell>{record.nextDueDate}</TableCell>
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
              Are you sure you want to delete this vaccination record? This action cannot be undone.
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
  )
}

