"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

const data = Array(5).fill({
  earTag: "#2312342",
  lactationStage: "Pre lactation",
  healthIssue: "None",
  difference: "-3 /day",
})

export function LessPerformingTable() {
  const isMobile = useMobile()

  if (isMobile) {
    return (
      <div className="space-y-4">
        {data.map((row, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Ear tag no</span>
              <span>{row.earTag}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Lactation Stage</span>
              <span>{row.lactationStage}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Health Issue</span>
              <span>{row.healthIssue}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Difference</span>
              <span className="text-red-500">{row.difference}</span>
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
            <TableHead>Health Issue</TableHead>
            <TableHead>Difference</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.earTag}</TableCell>
              <TableCell>{row.lactationStage}</TableCell>
              <TableCell>{row.healthIssue}</TableCell>
              <TableCell className="text-red-500">{row.difference}</TableCell>
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

