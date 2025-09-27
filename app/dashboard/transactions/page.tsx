import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TransactionStatsCards } from "@/components/transaction-stats-cards"
import { TransactionsDataTable } from "@/components/transactions-data-table"
import { getTransactions, calculateTransactionStats, Transaction } from "@/app/actions/transactions"
import { 
  IconArrowDownRight, 
  IconArrowUpRight, 
  IconClock, 
  IconCheck, 
  IconX,
  IconCreditCard 
} from "@tabler/icons-react"
import { RefreshButton } from "@/components/refresh-button"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"

function TransactionStatsCardsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="border-gray-800 bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24 bg-gray-700" />
            <Skeleton className="h-6 w-6 bg-gray-700" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-20 bg-gray-700" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function TransactionTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Skeleton className="h-10 w-64 bg-gray-700" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20 bg-gray-700" />
          <Skeleton className="h-9 w-20 bg-gray-700" />
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-800 px-4 lg:px-6">
        <div className="space-y-4 py-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-5 w-5 bg-gray-700" />
              <Skeleton className="h-4 w-20 bg-gray-700" />
              <Skeleton className="h-4 w-20 bg-gray-700" />
              <Skeleton className="h-4 w-16 bg-gray-700" />
              <Skeleton className="h-4 w-12 bg-gray-700" />
              <Skeleton className="h-4 w-24 bg-gray-700" />
              <Skeleton className="h-4 w-20 bg-gray-700" />
              <Skeleton className="h-6 w-16 bg-gray-700" />
              <Skeleton className="h-8 w-8 bg-gray-700" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface TransactionTabContentProps {
  transactionType: 'deposit' | 'withdrawal'
  transactions: Transaction[]
}

function TransactionTabContent({ transactionType, transactions }: TransactionTabContentProps) {
  // Filter transactions by type
  const filteredTransactions = transactions.filter(
    transaction => transaction.type === transactionType
  )

  // Filter by status
  const pendingTransactions = filteredTransactions.filter(t => t.status === 'pending')
  const approvedTransactions = filteredTransactions.filter(t => t.status === 'approved')
  const rejectedTransactions = filteredTransactions.filter(t => t.status === 'rejected')

  const iconClass = "h-4 w-4"
  
  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger 
          value="pending" 
          className="flex items-center gap-2 data-[state=active]:bg-app-gold-100 data-[state=active]:text-black"
        >
          <IconClock className={iconClass} />
          Pending ({pendingTransactions.length})
        </TabsTrigger>
        <TabsTrigger 
          value="approved" 
          className="flex items-center gap-2 data-[state=active]:bg-app-gold-100 data-[state=active]:text-black"
        >
          <IconCheck className={iconClass} />
          Approved ({approvedTransactions.length})
        </TabsTrigger>
        <TabsTrigger 
          value="rejected" 
          className="flex items-center gap-2 data-[state=active]:bg-app-gold-100 data-[state=active]:text-black"
        >
          <IconX className={iconClass} />
          Rejected ({rejectedTransactions.length})
        </TabsTrigger>
      </TabsList>
      
      <div className="mt-6">
        <TabsContent value="pending" className="space-y-4">
          <TransactionsDataTable 
            data={pendingTransactions} 
            title={`Pending ${transactionType}s`} 
          />
        </TabsContent>
        
        <TabsContent value="approved" className="space-y-4">
          <TransactionsDataTable 
            data={approvedTransactions} 
            title={`Approved ${transactionType}s`} 
          />
        </TabsContent>
        
        <TabsContent value="rejected" className="space-y-4">
          <TransactionsDataTable 
            data={rejectedTransactions} 
            title={`Rejected ${transactionType}s`} 
          />
        </TabsContent>
      </div>
    </Tabs>
  )
}

async function TransactionsContent() {
  const transactions = await getTransactions()
  const stats = await calculateTransactionStats(transactions)

  // Check if we have no transactions (could be due to auth issues)
  if (transactions.length === 0) {
    return (
      <div className="space-y-6">
        <TransactionStatsCards stats={stats} />
        
        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle className="text-white">Transaction Management</CardTitle>
            <CardDescription className="text-muted-foreground">
              View and manage all deposits and withdrawals with detailed status tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <IconCreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Transactions Found</h3>
              <p className="text-muted-foreground mb-4">
                No transaction data available. This could be due to:
              </p>
              <ul className="text-muted-foreground text-sm space-y-1 mb-6">
                <li>• No transactions have been processed yet</li>
                <li>• Authentication issues - please try logging in again</li>
                <li>• API connection problems</li>
              </ul>
              <RefreshButton className="bg-app-gold-100 hover:bg-app-gold-200 text-black">
                Refresh Page
              </RefreshButton>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TransactionStatsCards stats={stats} />
      
      <Card className="border-gray-800 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-white">Transaction Management</CardTitle>
          <CardDescription className="text-muted-foreground">
            View and manage all deposits and withdrawals with detailed status tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="deposits" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="deposits" 
                className="flex items-center gap-2 data-[state=active]:bg-app-gold-100 data-[state=active]:text-black"
              >
                <IconArrowDownRight className="h-4 w-4" />
                Deposits
              </TabsTrigger>
              <TabsTrigger 
                value="withdrawals" 
                className="flex items-center gap-2 data-[state=active]:bg-app-gold-100 data-[state=active]:text-black"
              >
                <IconArrowUpRight className="h-4 w-4" />
                Withdrawals
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="deposits" className="space-y-6">
                <TransactionTabContent 
                  transactionType="deposit" 
                  transactions={transactions} 
                />
              </TabsContent>
              
              <TabsContent value="withdrawals" className="space-y-6">
                <TransactionTabContent 
                  transactionType="withdrawal" 
                  transactions={transactions} 
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default function TransactionsPage() {
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
                        <div>
                            <h1 className="text-2xl font-semibold text-white">Transactions</h1>
                            <p className="text-muted-foreground">
                            Monitor and manage all platform transactions including deposits and withdrawals
                            </p>
                        </div>
                        
                        <Suspense
                            fallback={
                            <div className="space-y-6">
                                <TransactionStatsCardsSkeleton />
                                <Card className="border-gray-800 bg-gray-900">
                                <CardHeader>
                                    <CardTitle className="text-white">Transaction Management</CardTitle>
                                    <CardDescription className="text-muted-foreground">
                                    View and manage all deposits and withdrawals with detailed status tracking
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <TransactionTableSkeleton />
                                </CardContent>
                                </Card>
                            </div>
                            }
                        >
                            <TransactionsContent />
                        </Suspense>
                    </div>
                </div>
        </SidebarInset>
    </SidebarProvider>
  )
}
