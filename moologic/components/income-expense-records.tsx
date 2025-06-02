// components/IncomeExpenseRecords.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/components/providers/language-provider";
import { 
  useCreateIncomeMutation,
  useUpdateIncomeMutation,
  useDeleteIncomeMutation,
  useListIncomeQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useListExpenseQuery,
} from "@/lib/service/incomeExpense";
import { useSession } from "next-auth/react";

// Define interfaces for our record types
interface Record {
  id: number;
  date: string;
  category_name: string;
  amount: number;
  description?: string;
}

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function IncomeExpenseRecords() {
  const { t } = useTranslation();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [recordType, setRecordType] = useState<"income" | "expense">("income");

  // State for form inputs
  const [recordDate, setRecordDate] = useState<Date | undefined>(undefined);
  const [recordCategory, setRecordCategory] = useState("");
  const [recordAmount, setRecordAmount] = useState<string>("");
  const [recordDescription, setRecordDescription] = useState("");

  // State for displaying success/error messages
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Get access token from session
  const { data: session } = useSession();
  const accessToken = session?.user?.accessToken || "";

  // IMPORTANT: Replace this with dynamic farm ID from your application state/context
  const farmId = 1;

  // Initialize API hooks
  const [createIncome] = useCreateIncomeMutation();
  const [updateIncome] = useUpdateIncomeMutation();
  const [deleteIncome] = useDeleteIncomeMutation();
  const { data: incomeData, refetch: refetchIncome } = useListIncomeQuery(accessToken);

  const [createExpense] = useCreateExpenseMutation();
  const [updateExpense] = useUpdateExpenseMutation();
  const [deleteExpense] = useDeleteExpenseMutation();
  const { data: expenseData, refetch: refetchExpense } = useListExpenseQuery(accessToken);

  // Handle delete operation
  const handleDelete = (record: Record, type: "income" | "expense") => {
    setSelectedRecord(record);
    setRecordType(type);
    setIsDeleteDialogOpen(true);
  };

  // Handle edit operation
  const handleEdit = (record: Record, type: "income" | "expense") => {
    setSelectedRecord(record);
    setRecordType(type);
    setRecordDate(record.date ? new Date(record.date) : undefined);
    setRecordCategory(record.category_name);
    setRecordAmount(record.amount.toString());
    setRecordDescription(record.description || "");
    setIsAddDialogOpen(true);
  };

  // Confirm delete operation
  const confirmDelete = async () => {
    if (!selectedRecord) return;

    try {
      if (recordType === "income") {
        await deleteIncome({
          accessToken,
          income_id: selectedRecord.id,
        }).unwrap();
        refetchIncome();
      } else {
        await deleteExpense({
          accessToken,
          expense_id: selectedRecord.id,
        }).unwrap();
        refetchExpense();
      }
      setShowSuccessMessage(true);
      setErrorMessage("");
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (err: any) {
      setErrorMessage(err.data?.detail || "Failed to delete record");
    }
    setIsDeleteDialogOpen(false);
  };

  // Handle add/update record
  const handleAddRecord = async () => {
    setShowSuccessMessage(false);
    setErrorMessage("");

    if (!accessToken) {
      setErrorMessage("You must be logged in to perform this action");
      return;
    }

    if (!recordDate || !recordCategory || !recordAmount) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    // Validate amount is a valid number
    const parsedAmount = parseFloat(recordAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("Please enter a valid amount greater than 0");
      return;
    }

    try {
      const recordData = {
        accessToken,
        date: recordDate.toISOString().split('T')[0],
        category_name: recordCategory,
        amount: parsedAmount,
        description: recordDescription || undefined,
        farm_id: farmId,
      };

      console.log('Attempting to save record with data:', {
        ...recordData,
        accessToken: 'TOKEN_HIDDEN',
      });

      let result;
      if (recordType === "income") {
        if (selectedRecord) {
          console.log('Updating income record...');
          result = await updateIncome({
            ...recordData,
            income_id: selectedRecord.id,
          }).unwrap();
          console.log('Update income result:', result);
        } else {
          console.log('Creating new income record...');
          result = await createIncome(recordData).unwrap();
          console.log('Create income result:', result);
        }
        console.log('Refreshing income list...');
        await refetchIncome();
      } else {
        if (selectedRecord) {
          console.log('Updating expense record...');
          result = await updateExpense({
            ...recordData,
            expense_id: selectedRecord.id,
          }).unwrap();
          console.log('Update expense result:', result);
        } else {
          console.log('Creating new expense record...');
          result = await createExpense(recordData).unwrap();
          console.log('Create expense result:', result);
        }
        console.log('Refreshing expense list...');
        await refetchExpense();
      }

      console.log('Operation completed successfully');
      setShowSuccessMessage(true);
      setIsAddDialogOpen(false);
      setSelectedRecord(null);
      clearForm();

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (err: any) {
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        data: err.data,
        status: err.status,
      });
      
      let errorMsg = 'An error occurred while saving the record.';
      
      if (err.data?.detail) {
        errorMsg = err.data.detail;
      } else if (err.data?.error) {
        errorMsg = err.data.error;
      } else if (err.message) {
        errorMsg = err.message;
      }

      // Check for specific error conditions
      if (err.status === 401) {
        errorMsg = 'Your session has expired. Please log in again.';
      } else if (err.status === 403) {
        errorMsg = 'You do not have permission to perform this action.';
      } else if (err.status === 400) {
        errorMsg = 'Invalid data provided. Please check your input.';
      }
      
      setErrorMessage(errorMsg);
      console.error('Final error message:', errorMsg);
    }
  };

  // Clear form fields
  const clearForm = () => {
    setRecordDate(undefined);
    setRecordCategory("");
    setRecordAmount("");
    setRecordDescription("");
  };

  // Fix for the Tabs onValueChange type error
  const handleTabChange = (value: string) => {
    setRecordType(value as "income" | "expense");
  };

  return (
    <div>
      <Tabs defaultValue="income" className="w-full" onValueChange={handleTabChange}>
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
                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setSelectedRecord(null)}>
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
                      <DatePicker value={recordDate} onChange={setRecordDate} />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      {t("Category")}
                    </Label>
                    <div className="col-span-3">
                      <Select value={recordCategory} onValueChange={setRecordCategory}>
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
                        value={recordAmount}
                        onChange={(e) => setRecordAmount(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      {t("Description")}
                    </Label>
                    <Input
                      id="description"
                      value={recordDescription}
                      onChange={(e) => setRecordDescription(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      setSelectedRecord(null);
                      clearForm();
                    }}
                  >
                    {t("Cancel")}
                  </Button>
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={handleAddRecord}
                  >
                    {selectedRecord ? t("Update Record") : t("Add Record")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Error Message Display */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
            {errorMessage}
          </div>
        )}

        {/* Success Message Display */}
        {showSuccessMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-center">
            {recordType === "income" ? t("Income successfully saved!") : t("Expense successfully saved!")}
          </div>
        )}

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
                  <TableHead className="text-right">{t("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomeData?.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{t(record.category_name)}</TableCell>
                    <TableCell className="font-medium">ETB {record.amount.toLocaleString()}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{record.description}</TableCell>
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
                  <TableHead className="text-right">{t("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseData?.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{t(record.category_name)}</TableCell>
                    <TableCell className="font-medium">ETB {record.amount.toLocaleString()}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{record.description}</TableCell>
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
  );
}