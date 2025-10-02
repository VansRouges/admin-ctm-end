import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function PortfolioPage() {
  // Dummy portfolio data
  const portfolioStats = {
    totalValue: 125430.50,
    totalGains: 25430.50,
    gainsPercentage: 25.4,
    totalInvested: 100000,
    activeInvestments: 12,
  }

  const portfolioItems = [
    { id: 1, name: "Bitcoin ETF", value: 45000, invested: 35000, gains: 10000, percentage: 28.6, trend: "up" },
    { id: 2, name: "Ethereum Staking", value: 32000, invested: 28000, gains: 4000, percentage: 14.3, trend: "up" },
    { id: 3, name: "DeFi Portfolio", value: 18500, invested: 15000, gains: 3500, percentage: 23.3, trend: "up" },
    { id: 4, name: "NFT Collection", value: 12000, invested: 10000, gains: 2000, percentage: 20.0, trend: "up" },
    { id: 5, name: "Altcoin Bundle", value: 8930.50, invested: 7000, gains: 1930.50, percentage: 27.6, trend: "up" },
    { id: 6, name: "Stable Yield Farm", value: 9000, invested: 5000, gains: 4000, percentage: 80.0, trend: "up" },
  ]

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
                      ${portfolioStats.totalValue.toLocaleString()}
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
                      ${portfolioStats.totalInvested.toLocaleString()}
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
                    <CardTitle className="text-2xl font-bold text-yellow-500">
                      ${portfolioStats.totalGains.toLocaleString()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-green-500">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +{portfolioStats.gainsPercentage}%
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-700">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-gray-300">Active Investments</CardDescription>
                    <CardTitle className="text-2xl font-bold text-purple-500">
                      {portfolioStats.activeInvestments}
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
                    <CardTitle className="text-2xl font-bold text-green-500">
                      +{portfolioStats.gainsPercentage}%
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-green-500">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Return Rate
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Portfolio Items */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-yellow-500">Investment Breakdown</CardTitle>
                  <CardDescription className="text-gray-300">
                    Detailed view of all portfolio positions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {portfolioItems.map((item) => (
                      <div 
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-400 mt-1">
                            Invested: ${item.invested.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-white font-semibold">
                              ${item.value.toLocaleString()}
                            </p>
                            <p className="text-sm text-green-500 flex items-center justify-end">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              +${item.gains.toLocaleString()} ({item.percentage}%)
                            </p>
                          </div>
                          <Badge className="bg-green-500 text-white border-0">
                            Active
                          </Badge>
                        </div>
                      </div>
                    ))}
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
