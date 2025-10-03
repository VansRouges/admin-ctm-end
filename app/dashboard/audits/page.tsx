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
import { Activity, AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Filter, FileText } from "lucide-react"
import { getAuditLogs, getAuditStats, AuditLog } from "@/app/actions/audit"
import { toast } from "sonner"
import { DataTableSkeleton } from "@/components/data-table-skeleton"

export default function AuditsPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [stats, setStats] = useState<{
    totalLogs: number;
    topActions: Array<{ _id: string; count: number }>;
    resourceBreakdown: Array<{ _id: string; count: number }>;
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [resourceFilter, setResourceFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  const fetchAuditLogs = useCallback(async () => {
    try {
      setLoading(true)
      const params: Parameters<typeof getAuditLogs>[0] = {
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }
      
      if (actionFilter !== 'all') {
        params.action = actionFilter
      }
      
      if (resourceFilter !== 'all') {
        params.resourceType = resourceFilter
      }

      const response = await getAuditLogs(params)
      setAuditLogs(response.data)
    } catch (error) {
      console.error('Error fetching audit logs:', error)
      toast.error('Failed to load audit logs')
    } finally {
      setLoading(false)
    }
  }, [actionFilter, resourceFilter])

  const fetchStats = async () => {
    try {
      const response = await getAuditStats()
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  useEffect(() => {
    fetchAuditLogs()
    fetchStats()
  }, [fetchAuditLogs])

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

  const getActionBadgeColor = (action: string) => {
    if (action.includes('delete')) return 'bg-red-500 text-white border-0'
    if (action.includes('create')) return 'bg-green-500 text-white border-0'
    if (action.includes('update')) return 'bg-blue-500 text-white border-0'
    if (action.includes('login')) return 'bg-purple-500 text-white border-0'
    if (action.includes('logout')) return 'bg-gray-500 text-white border-0'
    return 'bg-yellow-500 text-white border-0'
  }

  const getResourceBadgeColor = (resourceType: string) => {
    switch (resourceType) {
      case 'user':
        return 'bg-blue-500 text-white border-0'
      case 'notification':
        return 'bg-purple-500 text-white border-0'
      case 'support_ticket':
        return 'bg-yellow-500 text-white border-0'
      case 'copytrade_purchase':
        return 'bg-green-500 text-white border-0'
      case 'admin':
        return 'bg-red-500 text-white border-0'
      default:
        return 'bg-gray-500 text-white border-0'
    }
  }

  const getStatusIcon = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    } else if (statusCode >= 400 && statusCode < 500) {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />
    } else if (statusCode >= 500) {
      return <AlertCircle className="h-4 w-4 text-red-500" />
    }
    return <Activity className="h-4 w-4 text-gray-500" />
  }

  // Pagination
  const totalPages = Math.ceil(auditLogs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedLogs = auditLogs.slice(startIndex, endIndex)

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
            <div className="container mx-auto py-6 space-y-8">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-yellow-500 flex items-center gap-2">
                    <FileText className="h-8 w-8" />
                    System Audits
                  </h1>
                  <p className="text-gray-400 mt-2">Monitor administrative actions and system events</p>
                </div>
              </div>

              {/* Stats Cards */}
              {stats && (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="bg-gray-900 border-gray-700">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-gray-300">Total Audit Logs</CardDescription>
                      <CardTitle className="text-2xl font-bold text-blue-500">
                        {stats.totalLogs}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-gray-400">
                        <Activity className="h-4 w-4 mr-1" />
                        All time
                      </div>
                    </CardContent>
                  </Card>

                  {stats.topActions.slice(0, 3).map((action, index) => (
                    <Card key={action._id} className="bg-gray-900 border-gray-700">
                      <CardHeader className="pb-2">
                        <CardDescription className="text-gray-300">
                          {formatActionLabel(action._id)}
                        </CardDescription>
                        <CardTitle className="text-2xl font-bold text-yellow-500">
                          {action.count}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm text-gray-400">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Top {index + 1} action
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

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
                          <SelectItem value="admin_login">Admin Login</SelectItem>
                          <SelectItem value="admin_logout">Admin Logout</SelectItem>
                          <SelectItem value="user_update">User Update</SelectItem>
                          <SelectItem value="user_delete">User Delete</SelectItem>
                          <SelectItem value="notification_update">Notification Update</SelectItem>
                          <SelectItem value="notification_delete">Notification Delete</SelectItem>
                          <SelectItem value="support_ticket_update">Support Ticket Update</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-gray-300 text-sm mb-2 block">Resource Type</label>
                      <Select value={resourceFilter} onValueChange={(value) => {
                        setResourceFilter(value)
                        setCurrentPage(1)
                      }}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Resources</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="notification">Notification</SelectItem>
                          <SelectItem value="support_ticket">Support Ticket</SelectItem>
                          <SelectItem value="copytrade_purchase">Copytrade Purchase</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Audit Logs Table */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-yellow-500">Audit Trail</CardTitle>
                  <CardDescription className="text-gray-300">
                    Showing {paginatedLogs.length} of {auditLogs.length} audit logs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <DataTableSkeleton />
                  ) : auditLogs.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg">No audit logs found</p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-gray-700 hover:bg-gray-800/50">
                              <TableHead className="text-gray-300 font-semibold">Status</TableHead>
                              <TableHead className="text-gray-300 font-semibold">Action</TableHead>
                              <TableHead className="text-gray-300 font-semibold">Resource</TableHead>
                              <TableHead className="text-gray-300 font-semibold">Admin</TableHead>
                              <TableHead className="text-gray-300 font-semibold">Description</TableHead>
                              <TableHead className="text-gray-300 font-semibold">IP Address</TableHead>
                              <TableHead className="text-gray-300 font-semibold">Timestamp</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {paginatedLogs.map((log) => (
                              <TableRow 
                                key={log._id}
                                className="border-gray-700 hover:bg-gray-800/30 transition-colors"
                              >
                                <TableCell>
                                  {getStatusIcon(log.metadata.statusCode)}
                                </TableCell>
                                <TableCell>
                                  <Badge className={getActionBadgeColor(log.action)}>
                                    {formatActionLabel(log.action)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <Badge className={getResourceBadgeColor(log.resource.type)}>
                                      {formatActionLabel(log.resource.type)}
                                    </Badge>
                                    <p className="text-xs text-gray-400 truncate max-w-[150px]">
                                      {log.resource.name}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <p className="text-gray-200 font-medium text-sm">
                                      {log.admin.username}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate max-w-[150px]">
                                      {log.admin.email}
                                    </p>
                                  </div>
                                </TableCell>
                                <TableCell className="text-gray-200 max-w-xs truncate">
                                  {log.description}
                                </TableCell>
                                <TableCell className="text-gray-400 text-sm font-mono">
                                  {log.metadata.ip}
                                </TableCell>
                                <TableCell className="text-gray-400 text-sm whitespace-nowrap">
                                  {formatDate(log.createdAt)}
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
