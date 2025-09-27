"use client"

import { Button } from "@/components/ui/button"

interface RefreshButtonProps {
  className?: string
  children: React.ReactNode
}

export function RefreshButton({ className, children }: RefreshButtonProps) {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <Button onClick={handleRefresh} className={className}>
      {children}
    </Button>
  )
}