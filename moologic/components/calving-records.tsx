"use client"

import { useState } from "react"
import { Plus, Filter, Search, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useSession } from 'next-auth/react'
import { useToast } from "@/components/ui/use-toast"
import { CalvingRecordForm } from "./calving-record-form"
import { format } from 'date-fns'
import { useGetBirthRecordsQuery, useDeleteBirthRecordMutation } from '@/lib/service/cattleService'

export function CalvingRecords() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)

  const { data: birthRecordsData, isLoading, error } = useGetBirthRecordsQuery(
    { accessToken: session?.accessToken as string || '' },
    { skip: !session?.accessToken }
  );

  const [deleteBirthRecord] = useDeleteBirthRecordMutation();

  const handleDelete = (record) => {
    setSelectedRecord(record)
    setIsDeleteDialogOpen(true)
  }

  const handleEdit = (record) => {
    setSelectedRecord(record)
    setIsAddDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedRecord) return;
    
    try {
      await deleteBirthRecord({
        accessToken: session?.accessToken as string || '',
        id: selectedRecord.id
      }).unwrap();
      
      toast({
        title: "Success",
        description: "Birth record deleted successfully",
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedRecord(null);
    } catch (error) {
      console.error('Failed to delete birth record:', error);
      toast({
        title: "Error",
        description: "Failed to delete birth record",
        variant: "destructive",
      });
    }
  }

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error loading birth records</div>;
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
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => {
              setSelectedRecord(null);
              setIsAddDialogOpen(true);
                  }}
                >
            <Plus className="h-5 w-5 mr-2" />
            Add New
                </Button>
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
              {birthRecordsData?.results?.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.cattle.ear_tag_no}</TableCell>
                  <TableCell>{format(new Date(record.calving_date), 'dd-MM-yyyy')}</TableCell>
                  <TableCell>{record.calf_count}</TableCell>
                  <TableCell>{record.calf_gender}</TableCell>
                  <TableCell>{record.calf_ear_tag}</TableCell>
                  <TableCell>{record.complications || 'None'}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{record.notes || '-'}</TableCell>
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
              {(!birthRecordsData?.results || birthRecordsData.results.length === 0) && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No calving records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add/Edit Dialog */}
        <CalvingRecordForm
          open={isAddDialogOpen}
          onClose={() => {
            setIsAddDialogOpen(false);
            setSelectedRecord(null);
          }}
          record={selectedRecord}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <p className="text-sm text-gray-500 mt-2">
                Are you sure you want to delete this calving record? This action cannot be undone.
              </p>
            </DialogHeader>
            <div className="flex justify-end gap-3 mt-4">
              <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  )
}

