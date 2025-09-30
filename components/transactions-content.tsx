"use client"

import { useState, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionStatsCards } from "@/components/transaction-stats-cards"
import { TransactionsDataTable } from "@/components/transactions-data-table"
import { Transaction, TransactionStats, getTransactions, calculateTransactionStats } from "@/app/actions/transactions"
import { 
  IconArrowDownRight, 
  IconArrowUpRight, 
  IconClock, 
  IconCheck, 
  IconX,
  IconCreditCard 
} from "@tabler/icons-react"
import { RefreshButton } from "@/components/refresh-button"

interface TransactionTabContentProps {
  transactionType: 'deposit' | 'withdrawal'
  transactions: Transaction[]
  onTransactionUpdate?: () => void
}

function TransactionTabContent({ transactionType, transactions, onTransactionUpdate }: TransactionTabContentProps) {
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
      <TabsList className="grid w-full grid-cols-3 bg-black/50 border border-app-gold-100">
        <TabsTrigger 
          value="pending" 
          className="flex items-center gap-2 data-[state=active]:bg-yellow-700 data-[state=active]:text-white data-[state=active]:font-semibold hover:bg-app-gold-100/20 transition-all duration-200"
        >
          <IconClock className={iconClass} />
          Pending ({pendingTransactions.length})
        </TabsTrigger>
        <TabsTrigger 
          value="approved" 
          className="flex items-center gap-2 data-[state=active]:bg-yellow-700 data-[state=active]:text-white data-[state=active]:font-semibold hover:bg-app-gold-100/20 transition-all duration-200"
        >
          <IconCheck className={iconClass} />
          Approved ({approvedTransactions.length})
        </TabsTrigger>
        <TabsTrigger 
          value="rejected" 
          className="flex items-center gap-2 data-[state=active]:bg-yellow-700 data-[state=active]:text-white data-[state=active]:font-semibold hover:bg-app-gold-100/20 transition-all duration-200"
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
            onTransactionUpdate={onTransactionUpdate}
          />
        </TabsContent>
        
        <TabsContent value="approved" className="space-y-4">
          <TransactionsDataTable 
            data={approvedTransactions} 
            title={`Approved ${transactionType}s`}
            onTransactionUpdate={onTransactionUpdate}
          />
        </TabsContent>
        
        <TabsContent value="rejected" className="space-y-4">
          <TransactionsDataTable 
            data={rejectedTransactions} 
            title={`Rejected ${transactionType}s`}
            onTransactionUpdate={onTransactionUpdate}
          />
        </TabsContent>
      </div>
    </Tabs>
  )
}

interface TransactionsContentProps {
  initialTransactions: Transaction[]
  initialStats: TransactionStats
}

export function TransactionsContent({ initialTransactions, initialStats }: TransactionsContentProps) {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [stats, setStats] = useState(initialStats)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshData = useCallback(async () => {
    if (isRefreshing) return
    
    setIsRefreshing(true)
    try {
      const newTransactions = await getTransactions()
      const newStats = await calculateTransactionStats(newTransactions)
      setTransactions(newTransactions)
      setStats(newStats)
    } catch (error) {
      console.error('Error refreshing transactions:', error)
    } finally {
      setIsRefreshing(false)
    }
  }, [isRefreshing])

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
              <RefreshButton 
                className="bg-app-gold-100 hover:bg-app-gold-200 text-black"
                onClick={refreshData}
                isLoading={isRefreshing}
              >
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
      
      <Card className="border-app-gold-100 bg-transparent">
        <CardHeader>
          <CardTitle className="text-white">Transaction Management</CardTitle>
          <CardDescription className="text-muted-foreground">
            View and manage all deposits and withdrawals with detailed status tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="deposits" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/50 border border-app-gold-100">
              <TabsTrigger 
                value="deposits" 
                className="flex items-center gap-2 data-[state=active]:bg-yellow-700 data-[state=active]:text-white data-[state=active]:font-semibold hover:bg-app-gold-100/20 cursor-pointer transition-all duration-200"
              >
                <IconArrowDownRight className="h-4 w-4" />
                Deposits
              </TabsTrigger>
              <TabsTrigger 
                value="withdrawals" 
                className="flex items-center gap-2 data-[state=active]:bg-yellow-700 data-[state=active]:text-white data-[state=active]:font-semibold hover:bg-app-gold-100/20 transition-all duration-200"
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
                  onTransactionUpdate={refreshData}
                />
              </TabsContent>
              
              <TabsContent value="withdrawals" className="space-y-6">
                <TransactionTabContent 
                  transactionType="withdrawal" 
                  transactions={transactions}
                  onTransactionUpdate={refreshData}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}