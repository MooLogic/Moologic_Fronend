"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Gantt, Task, ViewMode } from 'gantt-task-react'
import 'gantt-task-react/dist/index.css'
import { useTheme } from 'next-themes'
import { Badge } from '@/components/ui/badge'

interface GestationGanttProps {
  tasks: Task[]
  startDate: Date
  endDate: Date
}

const STAGE_COLORS = {
  oestrus: '#FFB6C1', // Light pink
  inseminated: '#87CEEB', // Sky blue
  pregnant: '#90EE90', // Light green
  dryOff: '#DEB887', // Burlywood
  calving: '#DDA0DD', // Plum
  milestone: '#FFD700', // Gold
}

const STAGE_LABELS = {
  oestrus: 'In Oestrus',
  inseminated: 'Inseminated',
  pregnant: 'Pregnant',
  dryOff: 'Dry Off',
  calving: 'Calving',
  milestone: 'Milestone',
}

export function GestationGantt({ tasks, startDate, endDate }: GestationGanttProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Calculate total duration in days
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle>Gestation Timeline</CardTitle>
          <div className="flex gap-2">
            {Object.entries(STAGE_COLORS).map(([key, color]) => (
              <Badge
                key={key}
                variant="outline"
                style={{
                  backgroundColor: color,
                  color: theme === 'dark' ? 'white' : 'black',
                }}
              >
                {STAGE_LABELS[key]}
              </Badge>
            ))}
          </div>
        </div>
        <CardDescription className="flex items-center justify-between">
          <span>Visual timeline of gestation progress and milestones</span>
          <span className="text-sm font-medium">
            Total Duration: {totalDays} days
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <Gantt
            tasks={tasks}
            viewMode={ViewMode.Month}
            listCellWidth=""
            columnWidth={60}
            ganttHeight={350}
            todayColor={theme === 'dark' ? '#666' : '#eee'}
            barFill={90}
            barCornerRadius={4}
            handleWidth={8}
            timeStep={24 * 60 * 60 * 1000} // 1 day
            arrowColor="#666"
            fontFamily="inherit"
            fontSize="12px"
            rowHeight={50}
            barBackgroundColor={(task) => {
              if (task.type === 'milestone') return STAGE_COLORS.milestone
              if (task.name.toLowerCase().includes('oestrus')) return STAGE_COLORS.oestrus
              if (task.name.toLowerCase().includes('inseminated')) return STAGE_COLORS.inseminated
              if (task.name.toLowerCase().includes('pregnant')) return STAGE_COLORS.pregnant
              if (task.name.toLowerCase().includes('dry')) return STAGE_COLORS.dryOff
              if (task.name.toLowerCase().includes('calving')) return STAGE_COLORS.calving
              return '#1e40af'
            }}
            progressBackgroundColor="#3b82f6"
            TooltipContent={({ task }) => (
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
                <div className="font-semibold text-base">{task.name}</div>
                <div className="text-sm text-gray-500 mt-1">
                  {new Date(task.start).toLocaleDateString()} - {new Date(task.end).toLocaleDateString()}
                </div>
                {task.progress > 0 && (
                  <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    Progress: {Math.round(task.progress)}%
                  </div>
                )}
                {task.type === 'milestone' && (
                  <Badge className="mt-2" variant="secondary">
                    Milestone
                  </Badge>
                )}
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
} 