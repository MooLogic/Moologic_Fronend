"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useTranslation } from "@/components/providers/language-provider"

// Sample data
const budgetItems = [
  {
    id: 1,
    category: "Feed",
    budgeted: 35000,
    actual: 32500,
    remaining: 2500,
    period: "2024-Q1",
  },
  {
    id: 2,
    category: "Labor",
    budgeted: 20000,
    actual: 19800,
    remaining: 200,
    period: "2024-Q1",
  },
  {
    id: 3,
    category: "Veterinary",
    budgeted: 8000,
    actual: 6500,
    remaining: 1500,
    period: "2024-Q1",
  },
  {
    id: 4,
    category: "Equipment",
    budgeted: 7000,
    actual: 7200,
    remaining: -200,
    period: "2024-Q1",
  },
  {
    id: 5,
    category: "Utilities",
    budgeted: 6000,
    actual: 5800,
    remaining: 200,
    period: "2024-Q1",
  },
  {
    id: 6,
    category: "Maintenance",
    budgeted: 5000,
    actual: 4800,
    remaining: 200,
    period: "2024-Q1",
  },
]

export function BudgetManagement() {
  const { t } = useTranslation()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState(null)

  const handleDelete = (budget) => {
    setSelectedBudget(budget)
    setIsDeleteDialogOpen(true)
  }

  const handleEdit = (budget) => {
    setSelectedBudget(budget)
    setIsAddDialogOpen(true)
  }

  const confirmDelete = () => {
    // Delete logic would go here
    setIsDeleteDialogOpen(false)
  }

  // Calculate budget summary
  const totalBudgeted = budgetItems.reduce((sum, item) => sum + item.budgeted, 0)
  const totalActual = budgetItems.reduce((sum, item) => sum + item.actual, 0)
  const totalRemaining = totalBudgeted - totalActual
  const budgetUtilization = (totalActual / totalBudgeted) * 100

  return (
    <div className="space-y-6">
      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{t("Total Budgeted")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudgeted.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{t("Total Spent")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalActual.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{t("Remaining Budget")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalRemaining >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${totalRemaining.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{t("Budget Utilization")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{budgetUtilization.toFixed(1)}%</div>
            <Progress value={budgetUtilization} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Budget Table Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t("Budget Items")}</h2>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            {t("Export")}
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="h-5 w-5 mr-2" />
                {t("Add Budget Item")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>{selectedBudget ? t("Edit Budget Item") : t("Add New Budget Item")}</DialogTitle>
                <DialogDescription>
                  {selectedBudget
                    ? t("Update the details of this budget item")
                    : t("Enter the details of the new budget item")}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    {t("Category")}
                  </Label>
                  <div className="col-span-3">
                    <Select defaultValue={selectedBudget?.category || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select category")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Feed">{t("Feed")}</SelectItem>
                        <SelectItem value="Labor">{t("Labor")}</SelectItem>
                        <SelectItem value="Veterinary">{t("Veterinary")}</SelectItem>
                        <SelectItem value="Equipment">{t("Equipment")}</SelectItem>
                        <SelectItem value="Utilities">{t("Utilities")}</SelectItem>
                        <SelectItem value="Maintenance">{t("Maintenance")}</SelectItem>
                        <SelectItem value="Other">{t("Other")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="period" className="text-right">
                    {t("Budget Period")}
                  </Label>
                  <div className="col-span-3">
                    <Select defaultValue={selectedBudget?.period || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select period")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-Q1">{t("2024 - Q1")}</SelectItem>
                        <SelectItem value="2024-Q2">{t("2024 - Q2")}</SelectItem>
                        <SelectItem value="2024-Q3">{t("2024 - Q3")}</SelectItem>
                        <SelectItem value="2024-Q4">{t("2024 - Q4")}</SelectItem>
                        <SelectItem value="2024-Annual">{t("2024 - Annual")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="budgeted" className="text-right">
                    {t("Budgeted Amount")}
                  </Label>
                  <div className="col-span-3 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                    <Input
                      id="budgeted"
                      type="number"
                      min="0"
                      step="100"
                      defaultValue={selectedBudget?.budgeted || ""}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="actual" className="text-right">
                    {t("Actual Amount")}
                  </Label>
                  <div className="col-span-3 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                    <Input
                      id="actual"
                      type="number"
                      min="0"
                      step="100"
                      defaultValue={selectedBudget?.actual || ""}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    setSelectedBudget(null)
                  }}
                >
                  {t("Cancel")}
                </Button>
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    setSelectedBudget(null)
                  }}
                >
                  {selectedBudget ? t("Update Item") : t("Add Item")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Budget Items Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("Category")}</TableHead>
              <TableHead>{t("Period")}</TableHead>
              <TableHead>{t("Budgeted")}</TableHead>
              <TableHead>{t("Actual")}</TableHead>
              <TableHead>{t("Remaining")}</TableHead>
              <TableHead>{t("Utilization")}</TableHead>
              <TableHead className="text-right">{t("Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgetItems.map((item) => {
              const utilization = (item.actual / item.budgeted) * 100
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{t(item.category)}</TableCell>
                  <TableCell>{item.period}</TableCell>
                  <TableCell>${item.budgeted.toLocaleString()}</TableCell>
                  <TableCell>${item.actual.toLocaleString()}</TableCell>
                  <TableCell className={item.remaining >= 0 ? "text-green-600" : "text-red-600"}>
                    ${item.remaining.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={utilization} className="h-2 w-24" />
                      <span>{utilization.toFixed(1)}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("Confirm Deletion")}</DialogTitle>
            <DialogDescription>
              {t("Are you sure you want to delete this budget item? This action cannot be undone.")}
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

