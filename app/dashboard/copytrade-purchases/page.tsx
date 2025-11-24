import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { getAllCopytradePurchases, type CopytradePurchase } from "@/app/actions/copytrade-purchases"
import { CopytradePurchasesList } from "@/components/copytrade-purchases-list"
import { Toaster } from "sonner"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function CopytradePurchasesPage() {
  // Fetch all copytrade purchases
  let purchases: CopytradePurchase[] = []
  try {
    const response = await getAllCopytradePurchases()
    if (response.success) {
      purchases = response.data || []
    }
  } catch (error) {
    console.error('Error fetching copytrade purchases:', error)
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
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-yellow-500">Copytrade Purchases</h1>
                  <p className="text-gray-400 mt-2">
                    Manage and review all copytrade purchase requests
                  </p>
                </div>
              </div>

              {/* Purchases List */}
              <CopytradePurchasesList initialPurchases={purchases} />
            </div>
          </div>
        </div>
      </SidebarInset>
      <Toaster position="top-right" richColors />
    </SidebarProvider>
  )
}

