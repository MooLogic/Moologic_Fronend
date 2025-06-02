"use client"

import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import { format } from "date-fns"
import { jsPDF } from "jspdf"
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
  periodStart?: string
  periodEnd?: string
  morningAverage?: number
  eveningAverage?: number
  peakProduction?: number
  productionTrend?: number
}

export function MilkYieldReport({ data }: { data: ReportData }) {
  const { data: session } = useSession()

  const generatePDF = () => {
    const doc = new jsPDF()
    const farmName = session?.user?.name || "Your Farm"
    const today = format(new Date(), "MMMM d, yyyy")
    let yPos = 20 // Starting Y position for content

    // Helper function to add text and update Y position
    const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
      doc.setFontSize(fontSize)
      if (isBold) {
        doc.setFont("helvetica", "bold")
      } else {
        doc.setFont("helvetica", "normal")
      }
      doc.text(text, 20, yPos)
      yPos += fontSize / 2 + 5 // Increment Y position based on font size
    }

    // Helper function to format numbers safely
    const formatNumber = (value: number | undefined): string => {
      if (typeof value !== 'number' || isNaN(value)) {
        return "0.0"
      }
      return value.toFixed(1)
    }

    // Add header
    addText(farmName, 20, true)
    addText("Milk Production Report", 16)
    addText(`Generated on: ${today}`)
    
    if (data.periodStart && data.periodEnd) {
      addText(`Report Period: ${format(new Date(data.periodStart), "MMM d, yyyy")} - ${format(new Date(data.periodEnd), "MMM d, yyyy")}`)
    }

    yPos += 10 // Add extra space before summary

    // Add Production Summary
    addText("Production Summary", 14, true)
    addText(`Total Production: ${formatNumber(data.totalProduction)} L`)
    addText(`Daily Average: ${formatNumber(data.averageDaily)} L`)
    addText(`Active Cattle: ${data.activeCattle || 0}`)
    addText(`Production Efficiency: ${formatNumber(data.efficiency)}%`)

    if (data.morningAverage) {
      addText(`Morning Average: ${formatNumber(data.morningAverage)} L`)
    }
    if (data.eveningAverage) {
      addText(`Evening Average: ${formatNumber(data.eveningAverage)} L`)
    }
    if (data.peakProduction) {
      addText(`Peak Production: ${formatNumber(data.peakProduction)} L`)
    }
    if (data.productionTrend) {
      const trendValue = formatNumber(data.productionTrend)
      addText(`Production Trend: ${Number(trendValue) > 0 ? "+" : ""}${trendValue}%`)
    }

    yPos += 10 // Add extra space before records

    // Add Daily Production Records
    addText("Daily Production Records", 14, true)

    // Group records by date
    const groupedRecords = groupRecordsByDate(data.milkRecords || [])
    Object.entries(groupedRecords).forEach(([date, records]) => {
      const morningRecords = records.filter(r => r.shift === "morning")
      const eveningRecords = records.filter(r => r.shift === "evening")
      
      const total = records.reduce((sum, r) => sum + (r.quantity || 0), 0)
      const morning = morningRecords.reduce((sum, r) => sum + (r.quantity || 0), 0)
      const evening = eveningRecords.reduce((sum, r) => sum + (r.quantity || 0), 0)

      // Check if we need a new page
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }

      addText(`Date: ${format(new Date(date), "MMM d, yyyy")}`, 12, true)
      addText(`  Morning: ${formatNumber(morning)} L`)
      addText(`  Evening: ${formatNumber(evening)} L`)
      addText(`  Total: ${formatNumber(total)} L`)
      addText(`  Records: ${records.length}`)
      yPos += 5 // Add extra space between dates
    })

    // Add page numbers
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
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

// Helper function to group records by date
function groupRecordsByDate(records: MilkRecord[]): { [key: string]: MilkRecord[] } {
  return records.reduce((groups: { [key: string]: MilkRecord[] }, record) => {
    const date = record.date.split('T')[0] // Handle ISO date format
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(record)
    return groups
  }, {})
} 