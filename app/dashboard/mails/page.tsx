import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { emailTemplates } from "@/lib/emailTemplates"
import { EmailTemplateCard } from "@/components/EmailTemplateCard"
import { getEmails, type Email } from "@/app/actions/emails"

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic'

export default async function EmailPage() {
  // Fetch past emails from the server
  let pastEmails: Email[] = []
  
  try {
    const emailsResponse = await getEmails()
    if (emailsResponse.success) {
      pastEmails = emailsResponse.data
    }
  } catch (err) {
    console.error("Error fetching emails:", err)
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
                    <h1 className="text-3xl font-bold text-yellow-500">Email Center</h1>
                </div>

                <Tabs defaultValue="emails">
                    <TabsList className="grid w-[400px] grid-cols-2 bg-gray-800 border border-gray-600">
                    <TabsTrigger 
                        value="emails" 
                        className="data-[state=active]:bg-yellow-700 data-[state=active]:text-white data-[state=active]:font-semibold text-gray-300 hover:text-white transition-colors"
                    >
                        Sent Emails
                    </TabsTrigger>
                    <TabsTrigger 
                        value="templates"
                        className="data-[state=active]:bg-yellow-700 data-[state=active]:text-white data-[state=active]:font-semibold text-gray-300 hover:text-white transition-colors"
                    >
                        Email Templates
                    </TabsTrigger>
                    </TabsList>

                    <TabsContent value="emails">
                    {/* Table of past emails */}
                    <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4 text-yellow-500">Past Emails</h2>
                        {pastEmails.length === 0 ? (
                        <div className="flex items-center justify-center h-64">
                            <p className="text-gray-400">No emails sent yet.</p>
                        </div>
                        ) : (
                        <div className="overflow-y-auto max-h-[400px]">
                            <Table>
                            <TableHeader>
                                <TableRow className="border-gray-700 hover:bg-gray-800/50">
                                <TableHead className="text-gray-300 font-semibold">From</TableHead>
                                <TableHead className="text-gray-300 font-semibold">To</TableHead>
                                <TableHead className="text-gray-300 font-semibold">Subject</TableHead>
                                <TableHead className="text-gray-300 font-semibold">Status</TableHead>
                                <TableHead className="text-gray-300 font-semibold">Sent At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pastEmails.map((email) => (
                                <TableRow key={email._id} className="border-gray-700 hover:bg-gray-800/30 transition-colors">
                                    <TableCell className="text-gray-200">{email.from}</TableCell>
                                    <TableCell className="text-gray-200">{email.to}</TableCell>
                                    <TableCell className="text-gray-200">{email.subject}</TableCell>
                                    <TableCell>
                                    <span className="text-yellow-500 font-medium">
                                        {email.status}
                                    </span>
                                    </TableCell>
                                    <TableCell className="text-gray-200">{new Date(email.createdAt).toLocaleString()}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </div>
                        )}
                    </div>
                    </TabsContent>

                    <TabsContent value="templates">
                    <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-6">
                        <div className="mb-4">
                        <h2 className="text-2xl font-semibold text-yellow-500">Email Templates</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {emailTemplates.map((template) => (
                            <EmailTemplateCard key={template.id} template={template} />
                        ))}
                        </div>
                    </div>
                    </TabsContent>
                </Tabs>
                </div>
             </div>
            </div>
        </SidebarInset>
        <Toaster position="top-right" richColors />
    </SidebarProvider>
  )
}
