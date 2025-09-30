import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "sonner";
import ManageTabs from "@/components/manage-tabs";

// Force dynamic rendering since components use cookies
export const dynamic = 'force-dynamic'

export default function Manage() {
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
            <div className="container mx-auto h-full p-4">
              <h1 className="text-xl md:text-3xl font-bold mb-6 text-white">Manage Options</h1>
              <ManageTabs />
            </div>
          </div>
        </div>
      </SidebarInset>
      <Toaster position="top-right" richColors />
    </SidebarProvider>
  );
}
