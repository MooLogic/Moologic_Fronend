'use client';

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface ColumnsProps {
  onEdit: (record: any) => void;
  onDelete: (id: number) => void;
}

export const columns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<any>[] => [
  {
    accessorKey: "cattle_tag",
    header: "Mother's Tag",
  },
  {
    accessorKey: "calving_date",
    header: "Calving Date",
  },
  {
    accessorKey: "calving_outcome",
    header: "Outcome",
    cell: ({ row }) => {
      const outcome = row.original.calving_outcome;
      const variant = outcome === 'successful' ? 'default' :
                     outcome === 'complications' ? 'secondary' :
                     'destructive';
      const color = outcome === 'successful' ? 'bg-green-100 text-green-800' :
                   outcome === 'complications' ? 'bg-yellow-100 text-yellow-800' :
                   'bg-red-100 text-red-800';
      return (
        <Badge variant={variant} className={`capitalize ${color}`}>
          {outcome.replace(/_/g, ' ')}
        </Badge>
      );
    },
  },
  {
    accessorKey: "calf_details",
    header: "Calf Details",
    cell: ({ row }) => {
      const record = row.original;
      return (
        <div>
          <div>{record.calf_count} calf(s)</div>
          <div className="text-sm text-muted-foreground">Tag: {record.calf_ear_tag}</div>
          <div className="text-sm text-muted-foreground">Gender: {record.calf_gender}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "complications",
    header: "Complications",
    cell: ({ row }) => {
      const complications = row.original.complications;
      return complications ? (
        <div className="max-w-[200px] truncate" title={complications}>
          {complications}
        </div>
      ) : (
        <span className="text-muted-foreground">None</span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const record = row.original;
      
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(record)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Birth Record</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this birth record? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(record.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
]; 