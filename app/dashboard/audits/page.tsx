import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Activity, AlertCircle, CheckCircle } from "lucide-react"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function AuditsPage() {
  // Dummy audit stats
  const auditStats = {
    totalAudits: 1247,
    criticalAlerts: 3,
    warningsToday: 12,
    successfulChecks: 1232,
  }

  // Dummy audit logs
  const auditLogs = [
    { 
      id: 1, 
      timestamp: "2025-10-02 14:23:15", 
      action: "User Login", 
      user: "admin@ctm.com", 
      status: "success", 
      details: "Successful authentication from IP 192.168.1.1",
      severity: "info"
    },
    { 
      id: 2, 
      timestamp: "2025-10-02 14:15:42", 
      action: "Transaction Approved", 
      user: "admin@ctm.com", 
      status: "success", 
      details: "Deposit of $5,000 approved for user john@example.com",
      severity: "info"
    },
    { 
      id: 3, 
      timestamp: "2025-10-02 13:58:21", 
      action: "Failed Login Attempt", 
      user: "unknown@user.com", 
      status: "warning", 
      details: "Multiple failed login attempts detected from IP 45.123.45.67",
      severity: "warning"
    },
    { 
      id: 4, 
      timestamp: "2025-10-02 13:45:33", 
      action: "Database Backup", 
      user: "system", 
      status: "success", 
      details: "Automated daily backup completed successfully",
      severity: "info"
    },
    { 
      id: 5, 
      timestamp: "2025-10-02 13:30:12", 
      action: "User Data Modified", 
      user: "admin@ctm.com", 
      status: "success", 
      details: "Updated KYC status for user jane@example.com",
      severity: "info"
    },
    { 
      id: 6, 
      timestamp: "2025-10-02 13:12:45", 
      action: "Security Alert", 
      user: "system", 
      status: "critical", 
      details: "Unusual withdrawal pattern detected - requires investigation",
      severity: "critical"
    },
    { 
      id: 7, 
      timestamp: "2025-10-02 12:58:19", 
      action: "API Rate Limit", 
      user: "api_client_123", 
      status: "warning", 
      details: "Rate limit exceeded for API endpoint /api/v1/deposits",
      severity: "warning"
    },
    { 
      id: 8, 
      timestamp: "2025-10-02 12:43:07", 
      action: "Support Ticket Created", 
      user: "user@example.com", 
      status: "success", 
      details: "New support ticket #1547 - Account access issue",
      severity: "info"
    },
    { 
      id: 9, 
      timestamp: "2025-10-02 12:25:53", 
      action: "Password Reset", 
      user: "testuser@ctm.com", 
      status: "success", 
      details: "Password reset request completed successfully",
      severity: "info"
    },
    { 
      id: 10, 
      timestamp: "2025-10-02 12:10:38", 
      action: "Email Sent", 
      user: "system", 
      status: "success", 
      details: "Welcome email sent to newuser@example.com",
      severity: "info"
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500 text-white border-0">Success</Badge>
      case 'warning':
        return <Badge className="bg-yellow-500 text-white border-0">Warning</Badge>
      case 'critical':
        return <Badge className="bg-red-500 text-white border-0">Critical</Badge>
      default:
        return <Badge className="bg-gray-500 text-white border-0">Unknown</Badge>
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'info':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

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
                  <h1 className="text-3xl font-bold text-yellow-500">System Audits</h1>
                  <p className="text-gray-400 mt-2">Monitor system activities and security events</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-300">Total Audits</CardDescription>
                    <CardTitle className="text-2xl font-bold text-blue-500">
                      {auditStats.totalAudits}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-gray-400">
                      <Activity className="h-4 w-4 mr-1" />
                      All time
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-300">Critical Alerts</CardDescription>
                    <CardTitle className="text-2xl font-bold text-red-500">
                      {auditStats.criticalAlerts}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-red-500">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Requires attention
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-300">Warnings Today</CardDescription>
                    <CardTitle className="text-2xl font-bold text-yellow-500">
                      {auditStats.warningsToday}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-yellow-500">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Last 24 hours
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-300">Successful Checks</CardDescription>
                    <CardTitle className="text-2xl font-bold text-green-500">
                      {auditStats.successfulChecks}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-green-500">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      System healthy
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Audit Logs Table */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-yellow-500">Recent Audit Logs</CardTitle>
                  <CardDescription className="text-gray-300">
                    Latest system activities and security events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-y-auto max-h-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-700 hover:bg-gray-800/50">
                          <TableHead className="text-gray-300 font-semibold"></TableHead>
                          <TableHead className="text-gray-300 font-semibold">Timestamp</TableHead>
                          <TableHead className="text-gray-300 font-semibold">Action</TableHead>
                          <TableHead className="text-gray-300 font-semibold">User</TableHead>
                          <TableHead className="text-gray-300 font-semibold">Status</TableHead>
                          <TableHead className="text-gray-300 font-semibold">Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {auditLogs.map((log) => (
                          <TableRow 
                            key={log.id}
                            className="border-gray-700 hover:bg-gray-800/30 transition-colors"
                          >
                            <TableCell>
                              {getSeverityIcon(log.severity)}
                            </TableCell>
                            <TableCell className="text-gray-200 font-mono text-sm">
                              {log.timestamp}
                            </TableCell>
                            <TableCell className="text-gray-200 font-medium">
                              {log.action}
                            </TableCell>
                            <TableCell className="text-gray-200">
                              {log.user}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(log.status)}
                            </TableCell>
                            <TableCell className="text-gray-400 max-w-md truncate">
                              {log.details}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
