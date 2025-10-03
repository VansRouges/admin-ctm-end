"use client"

import { useState, useEffect, useCallback } from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bell, Check, CheckCheck, Trash2, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import { getNotifications, updateNotificationStatus, markAllAsRead, deleteNotification, Notification } from "@/app/actions/notifications"
import { toast } from "sonner"
import { DataTableSkeleton } from "@/components/data-table-skeleton"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false)
  const itemsPerPage = 10

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      const params: Parameters<typeof getNotifications>[0] = {
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }
      
      if (statusFilter !== 'all') {
        params.status = statusFilter as 'unread' | 'read'
      }
      
      if (actionFilter !== 'all') {
        params.action = actionFilter
      }

      const response = await getNotifications(params)
      setNotifications(response.data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, actionFilter])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await updateNotificationStatus(notificationId, 'read')
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, status: 'read' as const } : n)
      )
      toast.success('Notification marked as read')
    } catch (error) {
      console.error('Error marking as read:', error)
      toast.error('Failed to update notification')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      setIsMarkingAllRead(true)
      const response = await markAllAsRead()
      toast.success(`${response.data.modifiedCount} notifications marked as read`)
      await fetchNotifications()
    } catch (error) {
      console.error('Error marking all as read:', error)
      toast.error('Failed to mark all as read')
    } finally {
      setIsMarkingAllRead(false)
    }
  }

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId)
      setNotifications(prev => prev.filter(n => n._id !== notificationId))
      toast.success('Notification deleted')
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Failed to delete notification')
    }
  }

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'user_created':
        return 'bg-blue-500 text-white border-0'
      case 'deposit':
        return 'bg-green-500 text-white border-0'
      case 'withdraw':
        return 'bg-orange-500 text-white border-0'
      case 'copytrade_purchase':
        return 'bg-purple-500 text-white border-0'
      case 'support_ticket':
        return 'bg-yellow-500 text-white border-0'
      default:
        return 'bg-gray-500 text-white border-0'
    }
  }

  const formatActionLabel = (action: string) => {
    return action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Pagination
  const totalPages = Math.ceil(notifications.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedNotifications = notifications.slice(startIndex, endIndex)

  const unreadCount = notifications.filter(n => n.status === 'unread').length

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex-1 space-y-6 p-6">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="container mx-auto py-6 space-y-6">
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-yellow-500 flex items-center gap-2">
                    <Bell className="h-8 w-8" />
                    Notifications
                  </h1>
                  <p className="text-gray-400 mt-2">
                    {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                  </p>
                </div>
                <Button
                  onClick={handleMarkAllAsRead}
                  disabled={isMarkingAllRead || unreadCount === 0}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  {isMarkingAllRead ? 'Marking...' : 'Mark All as Read'}
                </Button>
              </div>

              {/* Filters */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-yellow-500 flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">Status</label>
                      <Select value={statusFilter} onValueChange={(value) => {
                        setStatusFilter(value as 'all' | 'unread' | 'read')
                        setCurrentPage(1)
                      }}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="unread">Unread</SelectItem>
                          <SelectItem value="read">Read</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">Action Type</label>
                      <Select value={actionFilter} onValueChange={(value) => {
                        setActionFilter(value)
                        setCurrentPage(1)
                      }}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Actions</SelectItem>
                          <SelectItem value="user_created">User Created</SelectItem>
                          <SelectItem value="deposit">Deposit</SelectItem>
                          <SelectItem value="withdraw">Withdraw</SelectItem>
                          <SelectItem value="copytrade_purchase">Copytrade Purchase</SelectItem>
                          <SelectItem value="support_ticket">Support Ticket</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications Table */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-yellow-500">All Notifications</CardTitle>
                  <CardDescription className="text-gray-300">
                    Showing {paginatedNotifications.length} of {notifications.length} notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <DataTableSkeleton />
                  ) : notifications.length === 0 ? (
                    <div className="text-center py-12">
                      <Bell className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg">No notifications found</p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-gray-700 hover:bg-gray-800/50">
                              <TableHead className="text-gray-300 font-semibold">Status</TableHead>
                              <TableHead className="text-gray-300 font-semibold">Action</TableHead>
                              <TableHead className="text-gray-300 font-semibold">Description</TableHead>
                              <TableHead className="text-gray-300 font-semibold">Date</TableHead>
                              <TableHead className="text-gray-300 font-semibold">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedNotifications.map((notification) => (
                              <TableRow 
                                key={notification._id}
                                className={`border-gray-700 transition-colors ${
                                  notification.status === 'unread' 
                                    ? 'bg-gray-800/50 hover:bg-gray-800/70' 
                                    : 'hover:bg-gray-800/30'
                                }`}
                              >
                                <TableCell>
                                  <Badge 
                                    className={notification.status === 'unread' 
                                      ? 'bg-yellow-500 text-black border-0' 
                                      : 'bg-gray-600 text-white border-0'}
                                  >
                                    {notification.status === 'unread' ? 'Unread' : 'Read'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className={getActionBadgeColor(notification.action)}>
                                    {formatActionLabel(notification.action)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-gray-200 max-w-md">
                                  {notification.description}
                                </TableCell>
                                <TableCell className="text-gray-400 text-sm whitespace-nowrap">
                                  {formatDate(notification.createdAt)}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {notification.status === 'unread' && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleMarkAsRead(notification._id)}
                                        className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-gray-800"
                                      >
                                        <Check className="h-4 w-4" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDelete(notification._id)}
                                      className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-gray-800"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                          <div className="text-gray-400 text-sm">
                            Page {currentPage} of {totalPages}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                              disabled={currentPage === 1}
                              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                              disabled={currentPage === totalPages}
                              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
