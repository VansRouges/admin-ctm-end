import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileCheck, Users } from "lucide-react"
import { getAllKYCs, KYC } from "@/app/actions/kyc"
import { Toaster } from "sonner"
import { KYCList } from "@/components/kyc-list"

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic'

export default async function KYCPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const status = resolvedSearchParams.status || 'all'
  const page = parseInt(resolvedSearchParams.page || '1')
  
  // Fetch KYC applications from the server
  let kycs: KYC[] = []
  let totalRecords = 0
  let totalPages = 1
  let currentPage = page
  
  try {
    const params: Parameters<typeof getAllKYCs>[0] = {
      page,
      limit: 10,
      sortBy: 'submittedAt',
      sortOrder: 'desc'
    }
    
    if (status !== 'all') {
      params.status = status as 'pending' | 'approved' | 'rejected' | 'under_review'
    }

    const response = await getAllKYCs(params)
    kycs = response.kycs
    totalRecords = response.pagination.totalRecords
    totalPages = response.pagination.total
    currentPage = response.pagination.current
  } catch (err) {
    console.error("Error fetching KYC applications:", err)
  }

  const statusCounts = {
    total: totalRecords,
    pending: kycs.filter((k: KYC) => k.status === 'pending').length,
    approved: kycs.filter((k: KYC) => k.status === 'approved').length,
    rejected: kycs.filter((k: KYC) => k.status === 'rejected').length,
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
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-yellow-500 flex items-center gap-2">
                    <FileCheck className="h-8 w-8" />
                    KYC Verifications
                  </h1>
                  <p className="text-gray-400 mt-2">
                    Review and manage user KYC applications
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-300">Total Applications</CardDescription>
                    <CardTitle className="text-2xl font-bold text-blue-500">
                      {statusCounts.total}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-gray-400">
                      <Users className="h-4 w-4 mr-1" />
                      All submissions
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-300">Pending Review</CardDescription>
                    <CardTitle className="text-2xl font-bold text-yellow-500">
                      {statusCounts.pending}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-yellow-500">
                      <FileCheck className="h-4 w-4 mr-1" />
                      Awaiting action
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-300">Approved</CardDescription>
                    <CardTitle className="text-2xl font-bold text-green-500">
                      {statusCounts.approved}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-green-500">
                      <FileCheck className="h-4 w-4 mr-1" />
                      Verified users
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-300">Rejected</CardDescription>
                    <CardTitle className="text-2xl font-bold text-red-500">
                      {statusCounts.rejected}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-red-500">
                      <FileCheck className="h-4 w-4 mr-1" />
                      Not approved
                    </div>
                  </CardContent>
                </Card>
              </div>

              <KYCList 
                initialData={kycs}
                initialTotalRecords={totalRecords}
                initialTotalPages={totalPages}
                initialCurrentPage={currentPage}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
      <Toaster position="top-right" richColors />
    </SidebarProvider>
  )
}

