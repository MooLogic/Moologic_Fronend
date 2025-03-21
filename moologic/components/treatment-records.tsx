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
const treatmentRecords = [
  {
    id: 1,
    cattleId: "#876364",
    date: "12-12-2023",
    diagnosis: "Mastitis",
    treatment: "Antibiotics",
    medication: "Penicillin",
    dosage: "10ml",
    veterinarian: "Dr. John Smith",
    followUpDate: "19-12-2023",
    status: "In Progress",
    notes: "Mild case, expected full recovery",
  },
  {
    id: 2,
    cattleId: "#876368",
    date: "10-12-2023",
    diagnosis: "Lameness",
    treatment: "Hoof trimming",
    medication: "None",
    dosage: "N/A",
    veterinarian: "Dr. Jane Doe",
    followUpDate: "17-12-2023",
    status: "Completed",
    notes: "Recovered fully",
  },
  {
    id: 3,
    cattleId: "#876372",
    date: "05-12-2023",
    diagnosis: "Respiratory infection",
    treatment: "Antibiotics",
    medication: "Tetracycline",
    dosage: "15ml",
    veterinarian: "Dr. John Smith",
    followUpDate: "12-12-2023",
    status: "Completed",
    notes: "Recovered fully",
  },
  {
    id: 4,
    cattleId: "#876375",
    date: "01-12-2023",
    diagnosis: "Milk fever",
    treatment: "Calcium supplement",
    medication: "Calcium borogluconate",
    dosage: "500ml",
    veterinarian: "Dr. Jane Doe",
    followUpDate: "03-12-2023",
    status: "Completed",
    notes: "Recovered fully",
  },
  {
    id: 5,
    cattleId: "#876380",
    date: "25-11-2023",
    diagnosis: "Diarrhea",
    treatment: "Fluid therapy",
    medication: "Electrolytes",
    dosage: "2L",
    veterinarian: "Dr. John Smith",
    followUpDate: "28-11-2023",
    status: "Completed",
    notes: "Recovered fully",
  },
]

export function TreatmentRecords() {
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
              <DialogTitle>{selectedRecord ? "Edit Treatment Record" : "Add New Treatment Record"}</DialogTitle>
              <DialogDescription>
                {selectedRecord
                  ? "Update the details of this treatment record"
                  : "Enter the details of the new treatment record"}
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
                <Label htmlFor="diagnosis" className="text-right">
                  Diagnosis
                </Label>
                <div className="col-span-3">
                  <Select defaultValue={selectedRecord?.diagnosis || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select diagnosis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mastitis">Mastitis</SelectItem>
                      <SelectItem value="Lameness">Lameness</SelectItem>
                      <SelectItem value="Respiratory infection">Respiratory infection</SelectItem>
                      <SelectItem value="Milk fever">Milk fever</SelectItem>
                      <SelectItem value="Diarrhea">Diarrhea</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="treatment" className="text-right">
                  Treatment
                </Label>
                <Input
                  id="treatment"
                  defaultValue={selectedRecord?.treatment || ""}
                  className="col-span-3"
                  placeholder="e.g. Antibiotics"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="medication" className="text-right">
                  Medication
                </Label>
                <Input
                  id="medication"
                  defaultValue={selectedRecord?.medication || ""}
                  className="col-span-3"
                  placeholder="e.g. Penicillin"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dosage" className="text-right">
                  Dosage
                </Label>
                <Input
                  id="dosage"
                  defaultValue={selectedRecord?.dosage || ""}
                  className="col-span-3"
                  placeholder="e.g. 10ml"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="veterinarian" className="text-right">
                  Veterinarian
                </Label>
                <div className="col-span-3">
                  <Select defaultValue={selectedRecord?.veterinarian || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select veterinarian" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr. John Smith">Dr. John Smith</SelectItem>
                      <SelectItem value="Dr. Jane Doe">Dr. Jane Doe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="followUpDate" className="text-right">
                  Follow-up Date
                </Label>
                <div className="col-span-3">
                  <DatePicker />
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
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Requires Follow-up">Requires Follow-up</SelectItem>
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
              <TableHead>Diagnosis</TableHead>
              <TableHead>Treatment</TableHead>
              <TableHead>Medication</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Follow-up</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {treatmentRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.cattleId}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.diagnosis}</TableCell>
                <TableCell>{record.treatment}</TableCell>
                <TableCell>{record.medication}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      record.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : record.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {record.status}
                  </span>
                </TableCell>
                <TableCell>{record.followUpDate}</TableCell>
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
              Are you sure you want to delete this treatment record? This action cannot be undone.
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

