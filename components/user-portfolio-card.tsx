'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, User, TrendingUp, TrendingDown, Coins } from "lucide-react"
import { UserPortfolio, AvailableToken } from "@/app/actions/portfolio"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface UserPortfolioCardProps {
  user: {
    _id: string;
    email: string;
    username: string;
    fullName: string;
  };
  portfolio: UserPortfolio | null;
  availableTokens: AvailableToken[];
  error?: string;
}

export function UserPortfolioCard({ user, portfolio, availableTokens, error }: UserPortfolioCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const displayName = user.fullName || user.username
  const hasPortfolio = portfolio !== null && !error
  const totalValue = portfolio?.totalCurrentValue ?? 0
  const totalInvested = portfolio?.totalInvestedValue ?? 0
  const profitLoss = portfolio?.totalProfitLoss ?? 0
  const profitLossPercentage = portfolio?.totalProfitLossPercentage ?? 0
  const holdingsCount = portfolio?.holdings.length ?? 0

  return (
    <Card className="bg-gray-800 border-gray-700">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </Button>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <div>
                <h3 className="text-white font-semibold">{displayName}</h3>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {hasPortfolio ? (
              <>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Portfolio Value</p>
                  <p className="text-white font-semibold">
                    ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Invested</p>
                  <p className="text-white font-semibold">
                    ${totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">P/L</p>
                  <p className={`font-semibold flex items-center gap-1 ${profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {profitLoss >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {profitLoss >= 0 ? '+' : ''}${profitLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">ROI</p>
                  <p className={`font-semibold ${profitLossPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {profitLossPercentage >= 0 ? '+' : ''}{profitLossPercentage.toFixed(2)}%
                  </p>
                </div>
                <Badge className="bg-green-500 text-white border-0">
                  {holdingsCount} Holdings
                </Badge>
              </>
            ) : (
              <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                {error ? 'Error' : 'No Portfolio'}
              </Badge>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4 pt-4 border-t border-gray-700">
            {error && (
              <div className="bg-red-900/20 border border-red-500/50 rounded p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {hasPortfolio && (
              <>
                {/* Holdings Table */}
                {portfolio.holdings.length > 0 ? (
                  <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Coins className="h-4 w-4" />
                      Holdings ({portfolio.holdings.length})
                    </h4>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-700">
                            <TableHead className="text-gray-300">Token</TableHead>
                            <TableHead className="text-gray-300">Amount</TableHead>
                            <TableHead className="text-gray-300">Avg Price</TableHead>
                            <TableHead className="text-gray-300">Current Price</TableHead>
                            <TableHead className="text-gray-300 text-right">Invested</TableHead>
                            <TableHead className="text-gray-300 text-right">Current Value</TableHead>
                            <TableHead className="text-gray-300 text-right">P/L</TableHead>
                            <TableHead className="text-gray-300 text-right">P/L %</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {portfolio.holdings.map((holding, index) => (
                            <TableRow key={index} className="border-gray-700">
                              <TableCell className="text-white font-mono font-semibold">
                                {holding.tokenName}
                              </TableCell>
                              <TableCell className="text-white">
                                {holding.amount.toLocaleString(undefined, { maximumFractionDigits: 8 })}
                              </TableCell>
                              <TableCell className="text-white">
                                ${holding.averageAcquisitionPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell className="text-white">
                                {holding.currentPrice !== null ? (
                                  `$${holding.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                ) : (
                                  <span className="text-gray-500">N/A</span>
                                )}
                              </TableCell>
                              <TableCell className="text-white text-right">
                                ${holding.totalInvestedUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell className="text-white text-right">
                                {holding.currentValue !== null ? (
                                  `$${holding.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                ) : (
                                  <span className="text-gray-500">N/A</span>
                                )}
                              </TableCell>
                              <TableCell className={`text-right ${holding.profitLoss !== null && holding.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {holding.profitLoss !== null ? (
                                  <>
                                    {holding.profitLoss >= 0 ? '+' : ''}${holding.profitLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                  </>
                                ) : (
                                  <span className="text-gray-500">N/A</span>
                                )}
                              </TableCell>
                              <TableCell className={`text-right ${holding.profitLossPercentage !== null && holding.profitLossPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {holding.profitLossPercentage !== null ? (
                                  <>
                                    {holding.profitLossPercentage >= 0 ? '+' : ''}{holding.profitLossPercentage.toFixed(2)}%
                                  </>
                                ) : (
                                  <span className="text-gray-500">N/A</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-900/50 rounded p-4">
                    <p className="text-gray-400 text-sm">No holdings found for this user</p>
                  </div>
                )}

                {/* Available Tokens */}
                {availableTokens.length > 0 ? (
                  <div>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Coins className="h-4 w-4" />
                      Available Tokens ({availableTokens.length})
                    </h4>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-700">
                            <TableHead className="text-gray-300">Token</TableHead>
                            <TableHead className="text-gray-300">Amount</TableHead>
                            <TableHead className="text-gray-300">Average Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {availableTokens.map((token, index) => (
                            <TableRow key={index} className="border-gray-700">
                              <TableCell className="text-white font-mono font-semibold">
                                {token.tokenName}
                              </TableCell>
                              <TableCell className="text-white">
                                {token.amount.toLocaleString(undefined, { maximumFractionDigits: 8 })}
                              </TableCell>
                              <TableCell className="text-white">
                                ${token.averagePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-900/50 rounded p-4">
                    <p className="text-gray-400 text-sm">No available tokens for this user</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

