import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "sonner"
import { getSupportTickets, type SupportTicket } from "@/app/actions/support"
import { AdminSupportRequestList } from "@/components/support-request-list"

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic'

export default async function AdminSupportCenter() {
    // Fetch support tickets from the server
    let supportTickets: SupportTicket[] = []
    
    try {
        const response = await getSupportTickets()
        if (response.success) {
            supportTickets = response.data
        }
    } catch (err) {
        console.error("Error fetching support tickets:", err)
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
                            <div className="flex justify-between items-center">
                                <h1 className="text-3xl font-bold text-yellow-500">Admin Support Center</h1>
                            </div>
                            <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-6">
                                <AdminSupportRequestList 
                                    initialData={supportTickets}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
            <Toaster position="top-right" richColors />
        </SidebarProvider>
    )
}

