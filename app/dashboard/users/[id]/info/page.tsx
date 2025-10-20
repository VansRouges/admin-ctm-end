import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb"
import { fetchUserById } from "@/app/actions/users"
import Link from "next/link"
import { 
  UserHeaderSection 
} from "@/components/users/user-header-section"
import { 
  UserStatsCards 
} from "@/components/users/user-stats-cards"
import { 
  UserPersonalInfoCard 
} from "@/components/users/user-personal-info-card"
import { 
  UserAccountInfoCard 
} from "@/components/users/user-account-info-card"
import { 
  UserInvestmentSummaryCard 
} from "@/components/users/user-investment-summary-card"

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

  const displayName = user.fullName || `${user.firstName} ${user.lastName}`.trim() || user.username

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
                      {displayName}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Header with editable account status */}
              <UserHeaderSection
                userId={userId}
                displayName={displayName}
                accountStatus={user.accountStatus}
              />

              {/* Stats with editable numeric + boolean fields */}
              <UserStatsCards
                userId={userId}
                currentValue={user.currentValue}
                totalInvestment={user.totalInvestment}
                roi={user.roi}
                kycStatus={user.kycStatus}
              />

              {/* Details + Account info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UserPersonalInfoCard
                  userId={userId}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  username={user.username}
                  email={user.email}
                  role={user.role}
                />

                <UserAccountInfoCard
                  userId={userId}
                  _id={user._id}
                  clerkId={user.clerkId}
                  createdAt={user.createdAt}
                  updatedAt={user.updatedAt}
                />
              </div>

              {/* Investment summary (derived). Pencil present but fields are same as stats; kept view-only here */}
              <UserInvestmentSummaryCard
                totalInvestment={user.totalInvestment}
                currentValue={user.currentValue}
                roi={user.roi}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}