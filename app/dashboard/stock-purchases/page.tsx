import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { getAllStockPurchases, type AdminStockPurchase } from "@/app/actions/stock-purchases"
import { StockPurchasesList } from "@/components/stock-purchases-list"
import { Toaster } from "sonner"

export const dynamic = "force-dynamic"

export default async function StockPurchasesPage() {
  let purchases: AdminStockPurchase[] = []
  let fetchError: string | null = null

  try {
    const response = await getAllStockPurchases()
    if (response.success) {
      purchases = response.data || []
    } else {
      fetchError = response.message || "Failed to load stock purchases"
    }
  } catch (error) {
    console.error("Error fetching stock purchases:", error)
    fetchError = error instanceof Error ? error.message : "Failed to load stock purchases"
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
              <div>
                <h1 className="text-3xl font-bold text-yellow-500">Stock Purchases</h1>
                <p className="text-gray-400 mt-2">
                  Approve buys, review live holdings, and settle liquidations with a final USDT payout
                </p>
              </div>

              {fetchError ? (
                <div className="rounded-lg border border-red-800 bg-red-950/40 p-6 text-center">
                  <p className="text-red-400 text-lg">Could not load stock purchases</p>
                  <p className="text-gray-400 text-sm mt-2">{fetchError}</p>
                </div>
              ) : (
                <StockPurchasesList initialPurchases={purchases} />
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
      <Toaster position="top-right" richColors />
    </SidebarProvider>
  )
}
