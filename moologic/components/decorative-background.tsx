"use client"

export function DecorativeBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <div className="blur-circle blur-circle-1" />
      <div className="blur-circle blur-circle-2" />
      <div className="blur-circle blur-circle-3" />
    </div>
  )
}

