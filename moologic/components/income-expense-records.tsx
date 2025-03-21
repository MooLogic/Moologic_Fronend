"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, Download } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "@/components/providers/language-provider"

// Sample data
const incomeRecords = [
  {
    id: 1,
    date: "2024-03-15",
    category: "Milk Sales",
    amount: 3500,
    description: "Milk sales for first half of March",
    paymentMethod: "Bank Transfer",
  },
  {
    id: 2,
    date: "2024-03-10",
    category: "Cattle Sales",
    amount: 5000,
    description: "Sale of 2 heifers",
    paymentMethod: "Check",
  },
  {
    id: 3,
    date: "2024-03-05",
    category: "Milk Sales",
    amount: 3200,
    description: "Milk sales for second half of February",
    paymentMethod: "Bank Transfer",
  },
  {
    id: 4,
    date: "2024-02-28",
    category: "Government Subsidies",
    amount: 1500,
    description: "Quarterly dairy subsidy payment",
    paymentMethod: "Bank Transfer",
  },
  {
    id: 5,
    date: "2024-02-20",
    category: "Manure",
    amount: 800,
    description: "Sale of manure to local farmers",
    paymentMethod: "Cash",
  },
]

const expenseRecords = [
  {
    id: 1,
    date: "2024-03-14",
    category: "Feed",
    amount: 2800,
    description: "Monthly feed supply",
    paymentMethod: "Bank Transfer",
  },
  {
    id: 2,
    date: "2024-03-12",
    category: "Veterinary",
    amount: 950,
    description: "Routine health check and vaccinations",
    paymentMethod: "Credit Card",
  },
  {
    id: 3,
    date: "2024-03-08",
    category: "Labor",
    amount: 3500,
    description: "Staff salaries for February",
    paymentMethod: "Bank Transfer",
  },
  {
    id: 4,
    date: "2024-03-05",
    category: "Utilities",
    amount: 750,
    description: "Electricity and water bills",
    paymentMethod: "Bank Transfer",
  },
  {
    id: 5,
    date: "2024-02-28",
    category: "Equipment",
    amount: 1200,
    description: "Repair of milking machine",
    paymentMethod: "Credit Card",
  },
]

export function IncomeExpenseRecords() {
  const { t } = useTranslation()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [recordType, setRecordType] = useState("income")

  const handleDelete = (record, type) => {
    setSelectedRecord(record)
    setRecordType(type)
    setIsDeleteDialogOpen(true)
  }

  const handleEdit = (record, type) => {
    setSelectedRecord(record)
    setRecordType(type)
    setIsAddDialogOpen(true)
  }

  const confirmDelete = () => {
    // Delete logic would go here
    setIsDeleteDialogOpen(false)
  }

  return (
    <div>
      <Tabs defaultValue="income" className="w-full" onValueChange={setRecordType}>
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="income">{t("Income")}</TabsTrigger>
            <TabsTrigger value="expense">{t("Expenses")}</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              {t("Export")}
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="h-5 w-5 mr-2" />
                  {recordType === "income" ? t("Add Income") : t("Add Expense")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>
                    {selectedRecord
                      ? recordType === "income"
                        ? t("Edit Income Record")
                        : t("Edit Expense Record")
                      : recordType === "income"
                        ? t("Add New Income")
                        : t("Add New Expense")}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedRecord ? t("Update the details of this record") : t("Enter the details of the new record")}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      {t("Date")}
                    </Label>
                    <div className="col-span-3">
                      <DatePicker />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      {t("Category")}
                    </Label>
                    <div className="col-span-3">
                      <Select defaultValue={selectedRecord?.category || ""}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("Select category")} />
                        </SelectTrigger>
                        <SelectContent>
                          {recordType === "income" ? (
                            <>
                              <SelectItem value="Milk Sales">{t("Milk Sales")}</SelectItem>
                              <SelectItem value="Cattle Sales">{t("Cattle Sales")}</SelectItem>
                              <SelectItem value="Manure">{t("Manure")}</SelectItem>
                              <SelectItem value="Government Subsidies">{t("Government Subsidies")}</SelectItem>
                              <SelectItem value="Other">{t("Other")}</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="Feed">{t("Feed")}</SelectItem>
                              <SelectItem value="Labor">{t("Labor")}</SelectItem>
                              <SelectItem value="Veterinary">{t("Veterinary")}</SelectItem>
                              <SelectItem value="Equipment">{t("Equipment")}</SelectItem>
                              <SelectItem value="Utilities">{t("Utilities")}</SelectItem>
                              <SelectItem value="Maintenance">{t("Maintenance")}</SelectItem>
                              <SelectItem value="Other">{t("Other")}</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      {t("Amount")}
                    </Label>
                    <div className="col-span-3 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                      <Input
                        id="amount"
                        type="number"
                        min="0"
                        step="0.01"
                        defaultValue={selectedRecord?.amount || ""}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      {t("Description")}
                    </Label>
                    <Input id="description" defaultValue={selectedRecord?.description || ""} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="paymentMethod" className="text-right">
                      {t("Payment Method")}
                    </Label>
                    <div className="col-span-3">
                      <Select defaultValue={selectedRecord?.paymentMethod || ""}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("Select payment method")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cash">{t("Cash")}</SelectItem>
                          <SelectItem value="Bank Transfer">{t("Bank Transfer")}</SelectItem>
                          <SelectItem value="Credit Card">{t("Credit Card")}</SelectItem>
                          <SelectItem value="Check">{t("Check")}</SelectItem>
                          <SelectItem value="Other">{t("Other")}</SelectItem>
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
                      setIsAddDialogOpen(false)
                      setSelectedRecord(null)
                    }}
                  >
                    {t("Cancel")}
                  </Button>
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => {
                      setIsAddDialogOpen(false)
                      setSelectedRecord(null)
                    }}
                  >
                    {selectedRecord ? t("Update Record") : t("Add Record")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input type="text" placeholder={t("Search records...")} className="pl-10 pr-4 h-10 w-full" />
        </div>

        <TabsContent value="income">
          {/* Income Records Table */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Date")}</TableHead>
                  <TableHead>{t("Category")}</TableHead>
                  <TableHead>{t("Amount")}</TableHead>
                  <TableHead>{t("Description")}</TableHead>
                  <TableHead>{t("Payment Method")}</TableHead>
                  <TableHead className="text-right">{t("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomeRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{t(record.category)}</TableCell>
                    <TableCell className="font-medium">${record.amount.toLocaleString()}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{record.description}</TableCell>
                    <TableCell>{t(record.paymentMethod)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(record, "income")}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(record, "income")}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="expense">
          {/* Expense Records Table */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Date")}</TableHead>
                  <TableHead>{t("Category")}</TableHead>
                  <TableHead>{t("Amount")}</TableHead>
                  <TableHead>{t("Description")}</TableHead>
                  <TableHead>{t("Payment Method")}</TableHead>
                  <TableHead className="text-right">{t("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{t(record.category)}</TableCell>
                    <TableCell className="font-medium">${record.amount.toLocaleString()}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{record.description}</TableCell>
                    <TableCell>{t(record.paymentMethod)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(record, "expense")}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(record, "expense")}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("Confirm Deletion")}</DialogTitle>
            <DialogDescription>
              {t("Are you sure you want to delete this record? This action cannot be undone.")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              {t("Cancel")}
            </Button>
            <Button type="submit" variant="destructive" onClick={confirmDelete}>
              {t("Delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

