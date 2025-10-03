"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Bell } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getUnreadCount } from "@/app/actions/notifications"

export function SiteHeader() {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await getUnreadCount()
        setUnreadCount(response.data.unreadCount)
      } catch (error) {
        console.error('Error fetching unread count:', error)
      }
    }

    fetchUnreadCount()
    
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchUnreadCount, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1 text-app-gold-100 hover:bg-transparent" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium text-white">Overview</h1>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/dashboard/notifications">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white hover:bg-gray-800"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs border-0"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </Button>
          </Link>
          <Avatar className="h-8 w-8 border-2 border-app-gold-100">
            <AvatarFallback className="bg-app-gold-100 text-black font-semibold text-sm">
              A
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
