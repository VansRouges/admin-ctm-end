import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react"
import { getAllUsersWithPortfolios, type UserWithPortfolio } from "@/app/actions/portfolio"
import { UserPortfolioCard } from "@/components/user-portfolio-card"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function PortfolioPage() {
  // Fetch all users with their portfolios in a single call
  let usersWithPortfolios: UserWithPortfolio[] = []
  try {
    const response = await getAllUsersWithPortfolios()
    if (response.success) {
      usersWithPortfolios = response.data
    }
  } catch (error) {
    console.error('Error fetching users with portfolios:', error)
  }

  // Calculate aggregate stats
  const aggregateStats = usersWithPortfolios.reduce(
    (acc, item) => {
      if (item.portfolio) {
        acc.totalValue += item.portfolio.totalCurrentValue
        acc.totalInvested += item.portfolio.totalInvestedValue
        acc.totalProfitLoss += item.portfolio.totalProfitLoss
        acc.totalHoldings += item.portfolio.holdings.length
      }
      return acc
    },
    { totalValue: 0, totalInvested: 0, totalProfitLoss: 0, totalHoldings: 0 }
  )

  const gainsPercentage = aggregateStats.totalInvested > 0
    ? (aggregateStats.totalProfitLoss / aggregateStats.totalInvested) * 100
    : 0

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
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-yellow-500">Portfolio Overview</h1>
                  <p className="text-gray-400 mt-2">Monitor and manage your investment portfolio</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-300">Total Portfolio Value</CardDescription>
                    <CardTitle className="text-2xl font-bold text-green-500">
                      ${aggregateStats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-gray-400">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Current Value
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-300">Total Invested</CardDescription>
                    <CardTitle className="text-2xl font-bold text-blue-500">
                      ${aggregateStats.totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-gray-400">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Initial Capital
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-300">Total Gains</CardDescription>
                    <CardTitle className={`text-2xl font-bold ${aggregateStats.totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${aggregateStats.totalProfitLoss >= 0 ? '+' : ''}{aggregateStats.totalProfitLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`flex items-center text-sm ${gainsPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {gainsPercentage >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {gainsPercentage >= 0 ? '+' : ''}{gainsPercentage.toFixed(2)}%
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-300">Total Holdings</CardDescription>
                    <CardTitle className="text-2xl font-bold text-purple-500">
                      {aggregateStats.totalHoldings}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-gray-400">
                      <PieChart className="h-4 w-4 mr-1" />
                      Positions
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-300">ROI</CardDescription>
                    <CardTitle className={`text-2xl font-bold ${gainsPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {gainsPercentage >= 0 ? '+' : ''}{gainsPercentage.toFixed(2)}%
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`flex items-center text-sm ${gainsPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {gainsPercentage >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      Return Rate
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* User Portfolios */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-yellow-500">All User Portfolios</CardTitle>
                  <CardDescription className="text-gray-300">
                    Detailed view of all user portfolios, holdings, and available tokens
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {usersWithPortfolios.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">No users found</p>
                      </div>
                    ) : (
                      usersWithPortfolios.map((item) => (
                        <UserPortfolioCard
                          key={item.user._id}
                          user={item.user}
                          portfolio={item.portfolio}
                          userId={item.user._id}
                        />
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
