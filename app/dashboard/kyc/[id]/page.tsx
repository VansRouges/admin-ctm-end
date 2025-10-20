import { notFound } from "next/navigation"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { getKYCById } from "@/app/actions/kyc"
import { Toaster } from "sonner"
import { KYCDetail } from "@/components/kyc-detail"

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic'

export default async function KYCDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Fetch KYC data from the server
  let kyc
  
  try {
    const resolvedParams = await params
    const result = await getKYCById(resolvedParams.id)
    
    if (!result.success || !result.kyc) {
      notFound()
    }
    
    kyc = result.kyc
  } catch (error) {
    console.error("Error fetching KYC:", error)
    notFound()
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
        <KYCDetail kyc={kyc} />
      </SidebarInset>
      <Toaster position="top-right" richColors />
    </SidebarProvider>
  )
}

