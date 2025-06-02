"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface Animal {
  id: number
  ear_tag_no: string
  gestation_status: string
  last_insemination_date: string | null
  last_calving_date: string | null
  expected_calving_date: string | null
}

interface GestationTimelineProps {
  animals: Animal[]
}

const STAGES = [
  { 
    id: 'lactation', 
    name: 'Animal (Lactation No)', 
    width: '15%', 
    color: '#E3F2FD',
    description: 'Shows the animal\'s ear tag and current lactation number. The lactation number indicates how many times the cow has calved and begun producing milk.'
  },
  { 
    id: 'milk', 
    name: '3 Days Milk', 
    width: '10%', 
    color: '#BBDEFB',
    description: 'The initial 3-day period after calving when the cow produces colostrum, which is crucial for calf immunity. Special monitoring is required during this time.'
  },
  { 
    id: 'oestrus', 
    name: 'In Oestrus', 
    width: '10%', 
    color: '#90CAF9',
    description: 'The period when the cow is in heat and ready for breeding. This typically lasts 18-24 hours and occurs every 21 days if not pregnant.'
  },
  { 
    id: 'inseminated', 
    name: 'Inseminated Animals', 
    width: '10%', 
    color: '#64B5F6',
    description: 'Indicates that the animal has been inseminated and is in the early post-breeding period. Pregnancy status will be confirmed later.'
  },
  { 
    id: 'pregnant', 
    name: 'Pregnant', 
    width: '35%', 
    color: '#42A5F5',
    description: 'The confirmed pregnancy period, lasting approximately 280 days. Progress bar shows advancement through the pregnancy.'
  },
  { 
    id: 'dry', 
    name: 'Dry Off', 
    width: '10%', 
    color: '#2196F3',
    description: 'The period (usually 6-8 weeks before calving) when milk production is stopped to allow the cow to rest and prepare for the next lactation.'
  },
  { 
    id: 'calving', 
    name: 'Calving', 
    width: '5%', 
    color: '#1E88E5',
    description: 'The period when the cow is due to give birth. Close monitoring is required during this time.'
  },
  { 
    id: 'missing', 
    name: 'Missing Data', 
    width: '5%', 
    color: '#1976D2',
    description: 'Indicates missing or incomplete calving records that need to be updated.'
  },
]

const StatusIndicator = ({ type, date }: { type: string; date: string | null }) => {
  const colors = {
    oestrus: 'bg-red-500',
    missed: 'bg-blue-500',
    last: 'bg-purple-500'
  }

  const descriptions = {
    oestrus: 'Animal is currently in heat and ready for breeding',
    missed: 'Animal has missed its expected oestrus period',
    last: 'Last recorded significant date'
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className={`w-3 h-3 rounded-full ${colors[type]}`} />
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">{descriptions[type]}</p>
            <p className="text-sm text-muted-foreground">
              {date ? new Date(date).toLocaleDateString() : 'No date available'}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function GestationTimeline({ animals }: GestationTimelineProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Herd Overview</CardTitle>
            <CardDescription>Lactation Period (290 Days)</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm">Animal in Oestrus Period</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm">Missed Oestrus</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-sm">Last Date of Situations</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Timeline Header */}
        <div className="flex border-b relative">
          {STAGES.map((stage, index) => (
            <TooltipProvider key={stage.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    style={{ width: stage.width, backgroundColor: stage.color }}
                    className="p-2 text-sm font-medium text-center relative"
                  >
                    {stage.name}
                    {/* Vertical separator */}
                    {index < STAGES.length - 1 && (
                      <div className="absolute right-0 top-0 bottom-0 w-px bg-border" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{stage.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        {/* Animal Rows */}
        <div className="divide-y">
          {animals.map(animal => (
            <div key={animal.id} className="flex items-center hover:bg-muted/50 relative">
              {/* Animal Info */}
              <div style={{ width: '15%' }} className="p-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{animal.ear_tag_no}</span>
                  <div className="flex gap-1">
                    {animal.gestation_status === 'in_oestrus' && (
                      <StatusIndicator type="oestrus" date={animal.last_calving_date} />
                    )}
                    {animal.gestation_status === 'missed_oestrus' && (
                      <StatusIndicator type="missed" date={animal.last_calving_date} />
                    )}
                    {animal.last_calving_date && (
                      <StatusIndicator type="last" date={animal.last_calving_date} />
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline Sections with Vertical Separators */}
              {STAGES.slice(1).map((stage, index) => {
                const width = stage.width
                const showDot = (
                  (stage.id === 'milk' && animal.last_calving_date) ||
                  (stage.id === 'oestrus' && animal.gestation_status === 'in_oestrus') ||
                  (stage.id === 'inseminated' && animal.last_insemination_date) ||
                  (stage.id === 'dry' && animal.gestation_status === 'dry_off') ||
                  (stage.id === 'calving' && animal.gestation_status === 'calving') ||
                  (stage.id === 'missing' && !animal.last_calving_date)
                )

                return (
                  <div
                    key={stage.id}
                    style={{ width }}
                    className="p-2 text-center relative"
                  >
                    {/* Vertical separator */}
                    <div className="absolute right-0 top-0 bottom-0 w-px bg-border" />
                    
                    {stage.id === 'pregnant' && animal.gestation_status === 'pregnant' ? (
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${calculatePregnancyProgress(animal.last_insemination_date, animal.expected_calving_date)}%`
                          }}
                        />
                      </div>
                    ) : showDot ? (
                      <div className="w-2 h-2 rounded-full bg-primary mx-auto" />
                    ) : null}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function calculatePregnancyProgress(startDate: string | null, endDate: string | null): number {
  if (!startDate || !endDate) return 0
  const start = new Date(startDate)
  const end = new Date(endDate)
  const today = new Date()
  const totalDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  const daysPassed = (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  return Math.min(100, Math.max(0, (daysPassed / totalDays) * 100))
} 