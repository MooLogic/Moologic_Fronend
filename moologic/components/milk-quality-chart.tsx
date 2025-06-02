"use client"

import { useTheme } from "@/components/providers/theme-provider"
import { Card } from "@/components/ui/card"
import { useTranslation } from "@/components/providers/language-provider"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { format } from "date-fns"

interface MilkRecord {
  id: number
  quantity: number
  date: string
  shift: "morning" | "evening"
  fat_percentage?: number
  protein_percentage?: number
  lactose_percentage?: number
  somatic_cell_count?: number
}

interface MilkQualityChartProps {
  data: MilkRecord[]
}

export function MilkQualityChart({ data }: MilkQualityChartProps) {
  const { theme } = useTheme()
  const { t } = useTranslation()

  // Process data for the chart
  const processedData = data
    .filter(record => record.fat_percentage || record.protein_percentage || record.lactose_percentage)
    .map(record => ({
      date: record.date,
      fat: record.fat_percentage,
      protein: record.protein_percentage,
      lactose: record.lactose_percentage,
      scc: record.somatic_cell_count,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Calculate averages and ranges
  const calculateStats = (key: 'fat' | 'protein' | 'lactose' | 'scc') => {
    const values = processedData
      .map(d => d[key])
      .filter((v): v is number => v !== undefined)
    
    if (values.length === 0) return { avg: 0, min: 0, max: 0 }
    
    return {
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
    }
  }

  const stats = {
    fat: calculateStats('fat'),
    protein: calculateStats('protein'),
    lactose: calculateStats('lactose'),
    scc: calculateStats('scc'),
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-3 bg-white dark:bg-gray-800 shadow-lg">
          <p className="text-sm font-medium">{format(new Date(label), "MMM d, yyyy")}</p>
          {payload.map((entry: any) => (
            <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
              {t(entry.name)}: {entry.value?.toFixed(2)}%
            </p>
          ))}
        </Card>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">{t("Fat Range")}</p>
          <p className="text-lg font-bold">
            {stats.fat.min.toFixed(1)} - {stats.fat.max.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500">{t("Avg")}: {stats.fat.avg.toFixed(1)}%</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">{t("Protein Range")}</p>
          <p className="text-lg font-bold">
            {stats.protein.min.toFixed(1)} - {stats.protein.max.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500">{t("Avg")}: {stats.protein.avg.toFixed(1)}%</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">{t("Lactose Range")}</p>
          <p className="text-lg font-bold">
            {stats.lactose.min.toFixed(1)} - {stats.lactose.max.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500">{t("Avg")}: {stats.lactose.avg.toFixed(1)}%</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">{t("SCC Range")}</p>
          <p className="text-lg font-bold">
            {stats.scc.min.toFixed(0)} - {stats.scc.max.toFixed(0)}
          </p>
          <p className="text-sm text-gray-500">{t("Avg")}: {stats.scc.avg.toFixed(0)}</p>
        </Card>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(new Date(date), "MMM d")}
            label={{ value: t("Date"), position: "insideBottom", offset: -5 }}
          />
        <YAxis
            yAxisId="left"
          label={{
            value: t("Percentage (%)"),
            angle: -90,
            position: "insideLeft",
              offset: 10,
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: t("SCC (cells/ml)"),
              angle: 90,
              position: "insideRight",
              offset: 10,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="fat"
            stroke="#8884d8"
            name={t("Fat")}
            strokeWidth={2}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="protein"
            stroke="#82ca9d"
            name={t("Protein")}
            strokeWidth={2}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="lactose"
            stroke="#ffc658"
            name={t("Lactose")}
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="scc"
            stroke="#ff7300"
            name={t("SCC")}
            strokeWidth={2}
          />
      </LineChart>
    </ResponsiveContainer>
    </div>
  )
}

