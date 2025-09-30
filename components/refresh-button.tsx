"use client"

import { Button } from "@/components/ui/button"
import { IconLoader2 } from "@tabler/icons-react"

interface RefreshButtonProps {
  className?: string
  children: React.ReactNode
  onClick?: () => void
  isLoading?: boolean
}

export function RefreshButton({ className, children, onClick, isLoading }: RefreshButtonProps) {
  const handleRefresh = () => {
    if (onClick) {
      onClick()
    } else {
      window.location.reload()
    }
  }

  return (
    <Button onClick={handleRefresh} className={className} disabled={isLoading}>
      {isLoading && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}