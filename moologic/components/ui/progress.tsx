import * as React from "react"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: number
    max?: number
    getFillColor?: (value: number) => string
  }
>(({ className, value = 0, max = 100, getFillColor, ...props }, ref) => {
  const percentage = value && max ? (value / max) * 100 : 0

  let fillColor = "bg-primary"
  if (getFillColor) {
    fillColor = getFillColor(percentage)
  } else if (percentage < 30) {
    fillColor = "bg-red-500"
  } else if (percentage < 70) {
    fillColor = "bg-yellow-500"
  } else {
    fillColor = "bg-green-500"
  }

  return (
    <div
      ref={ref}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className)}
      {...props}
    >
      <div
        className={cn("h-full w-full flex-1 transition-all", fillColor)}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  )
})
Progress.displayName = "Progress"

export { Progress }

