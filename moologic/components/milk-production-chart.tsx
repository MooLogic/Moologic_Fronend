"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ChartData {
  date: string;
  actual: number;
  estimated: number;
  difference: number;
}

interface MilkProductionChartProps {
  data: ChartData[];
}

const WOODS_PARAMS = {
  a: 20, // Scale parameter (peak production)
  b: 0.05, // Rate of increase to peak
  c: 0.003, // Rate of decline after peak
}

export function MilkProductionChart({ data }: MilkProductionChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-2">
            <CardTitle>Production Overview</CardTitle>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>This chart shows actual vs expected milk production based on your herd's characteristics</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          <CardDescription>
            <div className="space-y-2">
              <p>Expected milk production is calculated based on:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Badge variant="outline" className="justify-between">
                  <span>Peak Production:</span>
                  <span className="font-bold">{WOODS_PARAMS.a}L per cow</span>
                </Badge>
                <Badge variant="outline" className="justify-between">
                  <span>Growth Rate:</span>
                  <span className="font-bold">Normal</span>
                </Badge>
                <Badge variant="outline" className="justify-between">
                  <span>Decline Rate:</span>
                  <span className="font-bold">Standard</span>
                </Badge>
        </div>
        </div>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full aspect-[2/1]">
      <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
          />
          <YAxis
                yAxisId="left"
                tick={{ fontSize: 12 }}
                label={{ value: 'Liters', angle: -90, position: 'insideLeft' }}
          />
          <YAxis
                yAxisId="right"
            orientation="right"
                tick={{ fontSize: 12 }}
                label={{ value: 'Difference %', angle: 90, position: 'insideRight' }}
          />
          <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'Difference %') {
                    return [`${value.toFixed(1)}%`, 'Difference from Expected']
                  }
                  return [`${value.toFixed(1)} L`, name]
                }}
              />
              <Legend />
          <Line
                yAxisId="left"
            type="monotone"
                dataKey="actual"
                stroke="#2563eb"
                name="Actual Production"
            strokeWidth={2}
            dot={false}
          />
          <Line
                yAxisId="left"
            type="monotone"
                dataKey="estimated"
                stroke="#16a34a"
                name="Expected Production"
            strokeWidth={2}
            dot={false}
                strokeDasharray="5 5"
          />
          <Line
                yAxisId="right"
            type="monotone"
            dataKey="difference"
                stroke="#dc2626"
                name="Difference %"
                strokeWidth={1}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
      </CardContent>
    </Card>
  )
}

