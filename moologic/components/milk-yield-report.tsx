"use client"

import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import { format } from "date-fns"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { useSession } from "next-auth/react"

interface MilkRecord {
  id: number
  ear_tag_no: string
  quantity: number
  date: string
  time: string
  shift: string
}

interface ReportData {
  milkRecords: MilkRecord[]
  totalProduction: number
  averageDaily: number
  activeCattle: number
  efficiency: number
}

export function MilkYieldReport({ data }: { data: ReportData }) {
  const { data: session } = useSession()

  const generatePDF = () => {
    const doc = new jsPDF()
    const farmName = "Your Farm Name" // Replace with actual farm name
    const today = format(new Date(), "MMMM d, yyyy")

    // Add header
    doc.setFontSize(20)
    doc.text(farmName, 105, 15, { align: "center" })
    doc.setFontSize(14)
    doc.text("Milk Production Report", 105, 25, { align: "center" })
    doc.setFontSize(12)
    doc.text(`Generated on: ${today}`, 105, 35, { align: "center" })

    // Add summary section
    doc.setFontSize(14)
    doc.text("Production Summary", 14, 50)
    doc.setFontSize(12)
    const summary = [
      ["Total Production:", `${data.totalProduction.toFixed(1)} L`],
      ["Daily Average:", `${data.averageDaily.toFixed(1)} L`],
      ["Active Cattle:", data.activeCattle.toString()],
      ["Production Efficiency:", `${data.efficiency.toFixed(1)}%`],
    ]
    doc.autoTable({
      startY: 55,
      head: [],
      body: summary,
      theme: "plain",
      styles: { fontSize: 12 },
    })

    // Add production records table
    doc.setFontSize(14)
    doc.text("Detailed Production Records", 14, 100)
    doc.autoTable({
      startY: 105,
      head: [["Date", "Ear Tag", "Shift", "Quantity (L)"]],
      body: data.milkRecords.map((record) => [
        format(new Date(record.date), "MMM d, yyyy"),
        record.ear_tag_no,
        record.shift,
        record.quantity.toFixed(1),
      ]),
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [37, 99, 235] },
    })

    // Add footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.text(
        `Page ${i} of ${pageCount}`,
        105,
        doc.internal.pageSize.height - 10,
        { align: "center" }
      )
    }

    // Save the PDF
    doc.save(`milk-production-report-${format(new Date(), "yyyy-MM-dd")}.pdf`)
  }

  return (
    <Button
      onClick={generatePDF}
      className="gap-2"
      variant="outline"
    >
      <FileDown className="h-4 w-4" />
      Export Report
    </Button>
  )
} 