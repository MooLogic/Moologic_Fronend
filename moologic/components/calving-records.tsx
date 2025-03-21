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
const calvingRecords = [
  {
    id: 1,
    cattleId: "#876364",
    calvingDate: "12-12-2023",
    calfCount: 1,
    calfGender: "Female",
    calfEarTag: "#876412",
    complications: "None",
    notes: "Normal delivery",
  },
  {
    id: 2,
    cattleId: "#876368",
    calvingDate: "15-11-2023",
    calfCount: 2,
    calfGender: "Male, Female",
    calfEarTag: "#876413, #876414",
    complications: "Slight difficulty",
    notes: "Twins, both healthy",
  },
  {
    id: 3,
    cattleId: "#876372",
    calvingDate: "05-10-2023",
    calfCount: 1,
    calfGender: "Male",
    calfEarTag: "#876415",
    complications: "None",
    notes: "Healthy calf",
  },
  {
    id: 4,
    cattleId: "#876375",
    calvingDate: "22-09-2023",
    calfCount: 1,
    calfGender: "Female",
    calfEarTag: "#876416",
    complications: "Needed assistance",
    notes: "Difficult birth but both mother and calf are fine",
  },
  {
    id: 5,
    cattleId: "#876380",
    calvingDate: "10-08-2023",
    calfCount: 1,
    calfGender: "Male",
    calfEarTag: "#876417",
    complications: "None",
    notes: "Normal delivery",
  },
]

export function CalvingRecords() {
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
        <h1 className="text-xl font-semibold text-gray-800">Calving Records</h1>
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
                <DialogTitle>{selectedRecord ? "Edit Calving Record" : "Add New Calving Record"}</DialogTitle>
                <DialogDescription>
                  {selectedRecord
                    ? "Update the details of this calving record"
                    : "Enter the details of the new calving record"}
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
                  <Label htmlFor="calvingDate" className="text-right">
                    Calving Date
                  </Label>
                  <div className="col-span-3">
                    <DatePicker />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="calfCount" className="text-right">
                    Calf Count
                  </Label>
                  <Input
                    id="calfCount"
                    type="number"
                    min="1"
                    defaultValue={selectedRecord?.calfCount || "1"}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="calfGender" className="text-right">
                    Calf Gender
                  </Label>
                  <div className="col-span-3">
                    <Select defaultValue={selectedRecord?.calfGender || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Male, Female">Male, Female (Twins)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="calfEarTag" className="text-right">
                    Calf Ear Tag
                  </Label>
                  <Input
                    id="calfEarTag"
                    defaultValue={selectedRecord?.calfEarTag || ""}
                    className="col-span-3"
                    placeholder="e.g. #876412 or multiple tags separated by commas"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="complications" className="text-right">
                    Complications
                  </Label>
                  <div className="col-span-3">
                    <Select defaultValue={selectedRecord?.complications || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select complications" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Slight difficulty">Slight difficulty</SelectItem>
                        <SelectItem value="Needed assistance">Needed assistance</SelectItem>
                        <SelectItem value="Severe complications">Severe complications</SelectItem>
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
                <TableHead>Calving Date</TableHead>
                <TableHead>Calf Count</TableHead>
                <TableHead>Calf Gender</TableHead>
                <TableHead>Calf Ear Tag</TableHead>
                <TableHead>Complications</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calvingRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.cattleId}</TableCell>
                  <TableCell>{record.calvingDate}</TableCell>
                  <TableCell>{record.calfCount}</TableCell>
                  <TableCell>{record.calfGender}</TableCell>
                  <TableCell>{record.calfEarTag}</TableCell>
                  <TableCell>{record.complications}</TableCell>
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
                Are you sure you want to delete this calving record? This action cannot be undone.
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

