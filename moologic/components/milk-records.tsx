"use client"

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react"
import { Plus, Filter, Search, Download } from "lucide-react"
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
import { Skeleton } from "@/components/ui/skeleton"
import { useGetMilkRecordsQuery, useAddMilkRecordMutation } from "@/lib/service/milkService"
import { useGetCattleDataQuery } from "@/lib/service/cattleService"
import { format } from "date-fns"
import { useSession } from "next-auth/react"

export function MilkRecords() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    cattle_tag: "",
    date: new Date(),
    quantity: 0,
    shift: "morning",
  })

  // Fetch session and access token
  const { data: session } = useSession()
  const accessToken = session?.user?.accessToken || ""

  // Fetch milk records and cattle
  const { data: milkRecords = [], isLoading: isLoadingRecords, error: recordsError } = useGetMilkRecordsQuery(
    { accessToken },
    { skip: !accessToken }
  )
  const { data: cattle = [], isLoading: isLoadingCattle } = useGetCattleDataQuery(
    { accessToken },
    { skip: !accessToken }
  )

  // Mutation for adding a new record
  const [addMilkRecord, { isLoading: isAdding }] = useAddMilkRecordMutation()

  // Calculate summary statistics
  const today = format(new Date(), "yyyy-MM-dd")
  const todayRecords = milkRecords.filter((record) => record.date === today)
  const totalMilkToday = todayRecords.reduce((sum, record) => sum + record.quantity, 0)
  const uniqueCowsToday = new Set(todayRecords.map((record) => record.cattle_tag)).size
  const averageYieldPerCow = uniqueCowsToday > 0 ? totalMilkToday / uniqueCowsToday : 0

  // Group records by cattle and date for display
  const groupedRecords = milkRecords.reduce((acc, record) => {
    const key = `${record.cattle_tag}-${record.date}`
    if (!acc[key]) {
      acc[key] = {
        cattle_tag: record.cattle_tag,
        date: record.date,
        morning: 0,
        afternoon: 0,
        night: 0,
        total: 0,
      }
    }
    if (record.shift.toLowerCase() === "morning") {
      acc[key].morning = record.quantity
    } else if (record.shift.toLowerCase() === "afternoon") {
      acc[key].afternoon = record.quantity
    } else if (record.shift.toLowerCase() === "night") {
      acc[key].night = record.quantity
    }
    acc[key].total = acc[key].morning + acc[key].afternoon + acc[key].night
    return acc
  }, {} as Record<string, { cattle_tag: string; date: string; morning: number; afternoon: number; night: number; total: number }>)

  const displayRecords = Object.values(groupedRecords)

  const handleAddRecord = async () => {
    try {
      await addMilkRecord({
        accessToken,
        cattle_tag: formData.cattle_tag,
        date: format(formData.date, "yyyy-MM-dd"),
        quantity: formData.quantity,
        shift: formData.shift,
      }).unwrap()
      setIsAddDialogOpen(false)
      setFormData({ cattle_tag: "", date: new Date(), quantity: 0, shift: "morning" })
    } catch (err) {
      console.error("Failed to add milk record:", err)
    }
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
                {[...Array(5)].map((_, i) => (
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

  if (recordsError) return <div>Error loading milk records</div>

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
              <DialogHeader>
                <DialogTitle>Add New Milk Record</DialogTitle>
                <DialogDescription>Enter the details of the new milk record</DialogDescription>
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
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select cattle" />
                      </SelectTrigger>
                      <SelectContent>
                        {cattle.map((cow: { id: Key | null | undefined; ear_tag_no: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }) => (
                          <SelectItem key={cow.id} value={cow.ear_tag_no}>
                            {cow.ear_tag_no}
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
                      date={formData.date}
                      setDate={(date: Date | null) => setFormData({ ...formData, date: date || new Date() })}
                    />
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
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={handleAddRecord}
                  disabled={isAdding}
                >
                  {isAdding ? "Adding..." : "Add Record"}
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
                <TableHead>Afternoon (L)</TableHead>
                <TableHead>Night (L)</TableHead>
                <TableHead>Total (L)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayRecords.map((record, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{record.cattle_tag}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.morning.toFixed(1)}</TableCell>
                  <TableCell>{record.afternoon.toFixed(1)}</TableCell>
                  <TableCell>{record.night.toFixed(1)}</TableCell>
                  <TableCell className="font-medium">{record.total.toFixed(1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  )
}
