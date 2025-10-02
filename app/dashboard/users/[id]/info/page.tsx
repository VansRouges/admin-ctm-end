import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb"
import { fetchUserById } from "@/app/actions/users"
import { User, Mail, Calendar, DollarSign, TrendingUp, Shield, Activity } from "lucide-react"
import Link from "next/link"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function UserInfoPage({ params }: { params: { id: string } }) {
  const userId = params.id
  
  let user
  try {
    user = await fetchUserById(userId)
  } catch (error) {
    console.error('Error fetching user:', error)
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
            <div className="container mx-auto py-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-red-500">Error Loading User</h1>
                <p className="text-gray-400 mt-2">Could not load user information. Please try again.</p>
                <Link href="/dashboard/manage" className="text-yellow-500 hover:underline mt-4 inline-block">
                  Back to Users
                </Link>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
            <div className="container mx-auto py-6 space-y-6">
              {/* Breadcrumbs */}
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/dashboard" className="text-gray-400 hover:text-yellow-500">
                        Dashboard
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/dashboard/manage" className="text-gray-400 hover:text-yellow-500">
                        Users
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-yellow-500">
                      {user.fullName || `${user.firstName} ${user.lastName}`.trim() || user.username}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-yellow-500">
                    {user.fullName || `${user.firstName} ${user.lastName}`.trim() || user.username}
                  </h1>
                  <p className="text-gray-400 mt-2">Detailed user information and account status</p>
                </div>
                <Badge 
                  variant={user.accountStatus ? "default" : "secondary"} 
                  className={user.accountStatus ? "bg-green-500 text-white border-0 text-lg px-4 py-1" : "bg-red-500 text-white border-0 text-lg px-4 py-1"}
                >
                  {user.accountStatus ? "Active" : "Inactive"}
                </Badge>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-300 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Current Value
                    </CardDescription>
                    <CardTitle className="text-2xl font-bold text-green-500">
                      ${user.currentValue.toLocaleString()}
                    </CardTitle>
                  </CardHeader>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-300 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Total Investment
                    </CardDescription>
                    <CardTitle className="text-2xl font-bold text-blue-500">
                      ${user.totalInvestment.toLocaleString()}
                    </CardTitle>
                  </CardHeader>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-300 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      ROI
                    </CardDescription>
                    <CardTitle className={`text-2xl font-bold ${user.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {user.roi.toFixed(2)}%
                    </CardTitle>
                  </CardHeader>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-300 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      KYC Status
                    </CardDescription>
                    <CardTitle className="text-lg font-bold">
                      <Badge 
                        variant={user.kycStatus ? "default" : "secondary"} 
                        className={user.kycStatus ? "bg-green-500 text-white border-0" : "bg-red-500 text-white border-0"}
                      >
                        {user.kycStatus ? "Verified" : "Pending"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              {/* User Details Card */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-yellow-500 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">First Name</p>
                        <p className="text-white font-medium">{user.firstName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Last Name</p>
                        <p className="text-white font-medium">{user.lastName || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-sm flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Username
                      </p>
                      <p className="text-white font-medium">{user.username}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-sm flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </p>
                      <p className="text-white font-medium">{user.email}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Role
                      </p>
                      <Badge variant="outline" className="text-white border-gray-600 mt-1">
                        {user.role}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Information */}
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-yellow-500 flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm">User ID</p>
                      <p className="text-white font-medium font-mono text-xs break-all">{user._id}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm">Clerk ID</p>
                      <p className="text-white font-medium font-mono text-xs break-all">{user.clerkId}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Account Created
                      </p>
                      <p className="text-white font-medium">{formatDate(user.createdAt)}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Last Updated
                      </p>
                      <p className="text-white font-medium">{formatDate(user.updatedAt)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Investment Summary */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-yellow-500 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Investment Summary
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Overview of user&apos;s investment performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm">Total Investment</p>
                      <p className="text-2xl font-bold text-blue-500">${user.totalInvestment.toLocaleString()}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm">Current Value</p>
                      <p className="text-2xl font-bold text-green-500">${user.currentValue.toLocaleString()}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm">Net Gain/Loss</p>
                      <p className={`text-2xl font-bold ${(user.currentValue - user.totalInvestment) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ${(user.currentValue - user.totalInvestment).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Return on Investment (ROI)</span>
                      <span className={`text-xl font-bold ${user.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {user.roi.toFixed(2)}%
                      </span>
                    </div>
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
