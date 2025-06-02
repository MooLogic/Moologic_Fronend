"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import { Skeleton } from "@/components/ui/skeleton"

interface LactatingCattle {
  id: number;
  ear_tag_no: string;
  name: string;
  milking_frequency: number;
  last_milking: string | null;
  can_milk_now: boolean;
  days_in_milk: number;
  lactation_number: number;
}

interface MilkRecord {
  id: number;
  ear_tag_no: string;
  quantity: number;
  date: string;
  time: string;
  shift: string;
}

interface LessPerformingTableProps {
  data: LactatingCattle[];
  milkRecords: MilkRecord[];
  isLoading?: boolean;
}

export function LessPerformingTable({ data = [], milkRecords = [], isLoading = false }: LessPerformingTableProps) {
  const isMobile = useMobile()

  if (isLoading) {
    return <TableSkeleton isMobile={isMobile} />
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No lactating cattle data available
      </div>
    )
  }

  // Calculate performance metrics for each cow
  const cowPerformance = data.map(cow => {
    const cowRecords = milkRecords.filter(record => record.ear_tag_no === cow.ear_tag_no);
    const avgProduction = cowRecords.length > 0
      ? cowRecords.reduce((sum, record) => sum + record.quantity, 0) / cowRecords.length
      : 0;
    
    // Get lactation stage
    const lactationStage = getLactationStage(cow.days_in_milk);
    
    return {
      ...cow,
      avgProduction,
      lactationStage,
      difference: calculateProductionDifference(avgProduction, cow.days_in_milk)
    };
  }).sort((a, b) => a.difference - b.difference); // Sort by difference (ascending = worst performing first)

  if (isMobile) {
    return (
      <div className="space-y-4">
        {cowPerformance.map((row, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Ear tag no</span>
              <span>{row.ear_tag_no}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Lactation Stage</span>
              <span>{row.lactationStage}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Avg. Production</span>
              <span>{row.avgProduction.toFixed(1)} L</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Difference</span>
              <span className={row.difference < 0 ? "text-red-500" : "text-green-500"}>
                {row.difference > 0 ? "+" : ""}{row.difference.toFixed(1)}%
              </span>
            </div>
            <Button variant="link" className="text-indigo-600 hover:text-indigo-700 p-0">
              Detail
            </Button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ear tag no</TableHead>
            <TableHead>Lactation Stage</TableHead>
            <TableHead>Avg. Production</TableHead>
            <TableHead>Difference</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cowPerformance.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.ear_tag_no}</TableCell>
              <TableCell>{row.lactationStage}</TableCell>
              <TableCell>{row.avgProduction.toFixed(1)} L</TableCell>
              <TableCell className={row.difference < 0 ? "text-red-500" : "text-green-500"}>
                {row.difference > 0 ? "+" : ""}{row.difference.toFixed(1)}%
              </TableCell>
              <TableCell>
                <Button variant="link" className="text-indigo-600 hover:text-indigo-700">
                  Detail
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function TableSkeleton({ isMobile }: { isMobile: boolean }) {
  if (isMobile) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ear tag no</TableHead>
            <TableHead>Lactation Stage</TableHead>
            <TableHead>Avg. Production</TableHead>
            <TableHead>Difference</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3].map((i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-4 w-12" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// Helper function to determine lactation stage
function getLactationStage(daysInMilk: number): string {
  if (daysInMilk <= 100) return 'Early';
  if (daysInMilk <= 200) return 'Mid';
  return 'Late';
}

// Helper function to calculate production difference from expected
function calculateProductionDifference(actualProduction: number, daysInMilk: number): number {
  // Simple estimation based on lactation stage
  let expectedProduction = 0;
  if (daysInMilk <= 100) expectedProduction = 25; // Peak production
  else if (daysInMilk <= 200) expectedProduction = 20; // Mid lactation
  else expectedProduction = 15; // Late lactation

  return ((actualProduction - expectedProduction) / expectedProduction) * 100;
}

